import { useState } from "react";
import PolicyForm from "./components/PolicyForm.jsx";
import DemographicsForm from "./components/DemographicsForm.jsx";
import demographicsForm from "./components/DemographicsForm.jsx";

function App() {
    const notSelectedValue = 'not-selected';

    const [hasAcceptedPolicy, setHasAcceptedPolicy] = useState(false);
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
    const [isSubmitted, setIsSubmitted] = useState(false);

    const onSkipDemographics = (skip) => {
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

    const isComplete = Object.keys(demographics).every((field) => !!demographics[field]);

    function handlePolicyAccepted() {
        setHasAcceptedPolicy(true);
    }

    function handleDemographicChange(name, value) {
        setDemographics((prev) => ({
            ...prev,
            [name]: value,
        }));
    }

    function handleDemographicsSubmit() {
        if (!demographicsForm) {
            return
        }
        console.log("Demographics submitted:", demographics);
        setIsSubmitted(true);
    }

    let content;

    if (!hasAcceptedPolicy) {
        content = <PolicyForm onAccepted={handlePolicyAccepted} />;
    } else if (!isSubmitted) {
        content = (
            <DemographicsForm
                formData={demographics}
                enableSubmit={isComplete}
                onChange={handleDemographicChange}
                onSubmit={handleDemographicsSubmit}
                notSelectedValue={notSelectedValue}
                onSkipDemographics={onSkipDemographics}
            />
        );
    } else {
        content = (
            <div className="card-body p-4 text-center">
                <h1 className="h4 mb-3">Thank you</h1>
                <p className="text-muted">
                    Your demographic answers have been recorded. You can now continue to
                    the main part of the survey.
                </p>
            </div>
        );
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
