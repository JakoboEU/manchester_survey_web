import React, { useState, useEffect } from "react";
import PolicyForm from "./components/PolicyForm.jsx";
import DemographicsForm from "./components/DemographicsForm.jsx";
import HabitatRanking from "./components/HabitatRanking.jsx";
import ContinueForm from "./components/ContinueForm.jsx";
import {signInAnonymously, supabase, useSupabaseError} from "./lib/supabaseClient.js";
import PageShimmer from "./components/PageShimmer.jsx";

const enumValue = (name) => Object.freeze({toString: () => name});

const PageState = Object.freeze({
    ACCEPT_POLICY: enumValue("AcceptPolicy"),
    DEMOGRAPHICS: enumValue("Demographics"),
    DEMOGRAPHICS_COMPLETE: enumValue("DemographicsComplete"),
    RETURNED_USER: enumValue("ReturnedUser"),
    SURVEY: enumValue("Survey"),
    ERROR: enumValue("Survey")
});

function App() {
    const notSelectedValue = 'not-selected';
    const localStoragePersonId = 'person_id';

    const [loading, setLoading] = useState(false);

    const [personId, setPersonId] = useState(() => {
        return JSON.parse(localStorage.getItem(localStoragePersonId)) || null;
    });
    const [pageState, setPageState] = useState(() => {
        if (personId === null) {
            return PageState.ACCEPT_POLICY;
        } else {
            return PageState.RETURNED_USER;
        }
    });
    useEffect(() => {
        localStorage.setItem(localStoragePersonId, JSON.stringify(personId));
    }, [personId]);

    const [demographics, setDemographics] = useState({
        gender: "",
        age: "",
        ethnicity: "",
        income: "",
        education: "",
        movement: "",
        dog: "",
        children: "",
        garden: "",
    });

    const [error, setError] = useState(null);
    const [accessToken, setAccessToken] = useState(null);

    const isDemographicsComplete = Object.keys(demographics).every((field) => !!demographics[field]);

    function handlePolicyAccepted() {
        setPageState(PageState.DEMOGRAPHICS);
    }

    function onSkipDemographics(skip) {
        if (skip) {
            setDemographics((prev) => ({
                ...prev,
                gender: notSelectedValue,
                age: notSelectedValue,
                ethnicity: notSelectedValue,
                income: notSelectedValue,
                education: notSelectedValue,
                movement: notSelectedValue,
                dog: notSelectedValue,
                children: notSelectedValue,
                garden: notSelectedValue,
            }));
        }
    }

    function handleDemographicChange(name, value) {
        setDemographics((prev) => ({
            ...prev,
            [name]: value,
        }));
    }

    const { wrapResult } = useSupabaseError()

    async function handleDemographicsSubmit(captchaToken) {
        if (!demographics) {
            return
        }

        setError(null);
        setLoading(true);
        try {
            const accessTokenFromSignIn = await signInAnonymously(captchaToken)
            setAccessToken(accessTokenFromSignIn)

            const {data, error} = await supabase.functions.invoke("create-demographic", {
                headers: {
                    Authorization: `Bearer ${accessTokenFromSignIn}`,
                },
                body: demographics,
            });

            const { ok: demographicDataStoredOkay, message: demographicDataStoredError } = wrapResult(
                { data, error },
                'Failed to store demographic data.'
            )

            if (!demographicDataStoredOkay) {
                throw new Error(demographicDataStoredError)
            }

            const {personId} = data ?? {};

            if (!personId) {
                throw new Error("No person ID returned from upstream.");
            } else {
                setPersonId(personId)
                setPageState(PageState.DEMOGRAPHICS_COMPLETE);
                setLoading(false);
            }
        } catch (err) {
            setPageState(PageState.ERROR)
            setError(err?.message ?? "Unknown error");
            setLoading(false);
        }
    }

    function handleContinueToSurvey() {
        setPageState(PageState.SURVEY);
    }

    async function handleContinueToSurveyWithCaptcha(captchaToken) {
        const accessTokenFromSignIn = await signInAnonymously(captchaToken)
        setAccessToken(accessTokenFromSignIn)
        setPageState(PageState.SURVEY);
    }

    let content;

    if (pageState === PageState.ACCEPT_POLICY) {
        content = <PolicyForm onAccepted={handlePolicyAccepted} />;
    } else if (pageState === PageState.DEMOGRAPHICS) {
        content = (
            <DemographicsForm
                formData={demographics}
                enableSubmit={isDemographicsComplete}
                notSelectedValue={notSelectedValue}
                onChange={handleDemographicChange}
                onSubmit={handleDemographicsSubmit}
                onSkipDemographics={onSkipDemographics}
            />
        );
    } else if (pageState === PageState.DEMOGRAPHICS_COMPLETE) {
        content = (
            <ContinueForm
                onContinue={handleContinueToSurvey}
                captchaRequired={false}
                title="Thank you"
                text="Your demographic answers have been recorded. You can now continue to the main part of the survey." />
        );
    } else if (pageState === PageState.RETURNED_USER) {
        content = (
            <ContinueForm
                onContinue={handleContinueToSurveyWithCaptcha}
                captchaRequired={true}
                title="Welcome Back"
                text="Click continue to the main part of the survey." />
        );
    } else if (pageState === PageState.ERROR) {
        content = <div className="card-body p-4">
                <h1 className="h4 mb-3 text-center">City Nature Choices: Page Error</h1>
                <div className="alert alert-danger">
                    {error}
                </div>
            </div>
    } else if (pageState === PageState.SURVEY) {
        content = <HabitatRanking personId={personId} accessToken={accessToken} />
    } else {
        content = <div className="card-body p-4">
                    <h1 className="h4 mb-3 text-center">City Nature Choices: Page Error</h1>
                    <p className="text-center mb-4">Invalid page state, please refresh the page in the browser.</p>
                </div>
    }

    return (
        <div className="min-vh-100 d-flex align-items-center justify-content-center">
            <div className="card shadow-lg w-100" style={{ maxWidth: "480px" }}>
                {content}
                {loading && <PageShimmer />}
            </div>
        </div>
    );
}

export default App;
