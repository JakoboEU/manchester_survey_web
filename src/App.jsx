import React, { useState, useEffect } from "react";
import PolicyForm from "./components/PolicyForm.jsx";
import DemographicsForm from "./components/DemographicsForm.jsx";
import HabitatRanking from "./components/HabitatRanking.jsx";

const enumValue = (name) => Object.freeze({toString: () => name});

const PageState = Object.freeze({
    ACCEPT_POLICY: enumValue("AcceptPolicy"),
    DEMOGRAPHICS: enumValue("Demographics"),
    DEMOGRAPHICS_COMPLETE: enumValue("DemographicsComplete"),
    RETURNED_USER: enumValue("ReturnedUser"),
    SURVEY: enumValue("Survey")
});

function App() {
    const notSelectedValue = 'not-selected';
    const localStoragePersonId = 'personId';


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

    function handleDemographicsSubmit() {
        if (!demographics) {
            return
        }
        console.log("Demographics submitted:", demographics)
        setPersonId('4454')
        setPageState(PageState.DEMOGRAPHICS_COMPLETE);
    }

    function handleContinueToSurvey() {
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
            <div className="card-body p-4 text-center">
                <h1 className="h4 mb-3">Thank you</h1>
                <p className="text-muted">
                    Your demographic answers have been recorded. You can now continue to
                    the main part of the survey.
                </p>
                <form onSubmit={handleContinueToSurvey} noValidate>
                    <button type="submit" className="btn btn-primary w-100">
                        Continue
                    </button>
                </form>
            </div>
        );
    } else if (pageState === PageState.RETURNED_USER) {
        content = (
            <div className="card-body p-4 text-center">
                <h1 className="h4 mb-3">Welcome Back</h1>
                <p className="text-muted">
                    Click continue to the main part of the survey.
                </p>
                <form onSubmit={handleContinueToSurvey} noValidate>
                    <button type="submit" className="btn btn-primary w-100">
                        Continue
                    </button>
                </form>
            </div>
        );
    } else if (pageState === PageState.SURVEY) {
        content = <HabitatRanking personId={personId} />
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
            </div>
        </div>
    );
}

export default App;
