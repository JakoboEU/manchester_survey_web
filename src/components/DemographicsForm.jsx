import React from "react";
import RadioGroup from "./RadioGroup";

function DemographicsForm({ formData, onChange, onSubmit, onSkipDemographics, notSelectedValue }) {
    const [skipDemographics, setSkipDemographics] = React.useState(false);

    function handleChange(event) {
        const { name, value } = event.target;
        onChange(name, value);
    }

    function handleSubmit(event) {
        event.preventDefault();
        onSubmit();
    }

    const handleSkipDemographicsChange = (checked) => {
        setSkipDemographics(checked);
        onSkipDemographics(checked);
    };

    const demographicsForm = !skipDemographics && (
        <>
            <RadioGroup
                name="gender"
                groupLabel="How would you describe your gender?"
                selectedValue={formData.gender}
                onChange={handleChange}
                notSelected={notSelectedValue}
                required
                options={[
                    { value: "man", label: "Man" },
                    { value: "woman", label: "Woman" },
                    { value: "other", label: "Non-binary or another gender identity" },
                ]}
            />
            <RadioGroup
                name="age"
                groupLabel="Which age group best describes you?"
                selectedValue={formData.age}
                onChange={handleChange}
                notSelected={notSelectedValue}
                required
                options={[
                    { value: "younger", label: "18 - 39" },
                    { value: "middle", label: "40 - 64" },
                    { value: "older", label: "65 or over" },
                ]}
            />
            <RadioGroup
                name="ethnicity"
                groupLabel="Which of these best describes your ethnic background? (Please choose the one that fits best.)"
                selectedValue={formData.ethnicity}
                onChange={handleChange}
                notSelected={notSelectedValue}
                required
                options={[
                    { value: "white", label: "White", help: "UK, Ireland or other White background" },
                    { value: "other", label: "Ethnic minority background", help: "for example: Mixed, Asian, Black, Middle Eastern, North African, or any other non-White background" },
                ]}
            />
            <RadioGroup
                name="education"
                groupLabel="Which option best matches the highest level of education you have completed?"
                selectedValue={formData.education}
                onChange={handleChange}
                notSelected={notSelectedValue}
                required
                options={[
                    { value: "sixteen", label: "I finished school at around age 16 or earlier", help: "GCSEs or equivalent, or below." },
                    { value: "eighteen", label: "I continued in education past 16 but not at university", help: "for example A-levels or college" },
                    { value: "older", label: "I studied at university or in another longer higher-education course", help: "for example degree, Masters, PhD" },
                ]}
            />
            <RadioGroup
                name="income"
                groupLabel="Thinking about your household as a whole, which of these broad income ranges best fits you (before tax)?"
                selectedValue={formData.income}
                onChange={handleChange}
                notSelected={notSelectedValue}
                required
                options={[
                    { value: "lower", label: "Under £21,0000" },
                    { value: "middle", label: "£21,000 - £45,000" },
                    { value: "higher", label: "Over £45,000" },
                ]}
            />
            <RadioGroup
                name="movement"
                groupLabel="Do you have any long-term health condition or disability that affects how easy it is for you to walk, stand, or get around outside, if at all?"
                selectedValue={formData.movement}
                onChange={handleChange}
                notSelected={notSelectedValue}
                required
                options={[
                    { value: "yes", label: "Yes" },
                    { value: "no", label: "No" },
                ]}
            />
            <RadioGroup
                name="dog"
                groupLabel="Do you currently have a dog in your household, or do you regularly walk a dog?"
                selectedValue={formData.dog}
                onChange={handleChange}
                notSelected={notSelectedValue}
                required
                options={[
                    { value: "yes", label: "Yes" },
                    { value: "no", label: "No" },
                ]}
            />
            <RadioGroup
                name="children"
                groupLabel="Are there any children under 18 living in your household, if you’re happy to say?"
                selectedValue={formData.children}
                onChange={handleChange}
                notSelected={notSelectedValue}
                required
                options={[
                    { value: "yes", label: "Yes" },
                    { value: "no", label: "No" },
                ]}
            />
            <RadioGroup
                name="garden"
                groupLabel="Do you have access to a private garden or outdoor space at home that you can use?"
                selectedValue={formData.garden}
                onChange={handleChange}
                notSelected={notSelectedValue}
                required
                options={[
                    { value: "yes", label: "Yes" },
                    { value: "no", label: "No" },
                ]}
            />
        </>)

    return (
        <div className="card-body p-4">
            <h1 className="h4 mb-3 text-center">City Nature Choices: About You (Optional)</h1>
            <p className="text-muted text-center mb-4">
                The next few questions are about you and your household.
                They help us understand whether people from different backgrounds see green spaces differently.
            </p>
            <p className="text-muted text-center mb-4">
                You don’t have to answer any question, if you’d rather skip just choose “Prefer not to say”.
            </p>

            <div className="mb-4 form-check">
                <label htmlFor="skipDemographics" className="form-check-label">
                    I’d prefer not to answer any questions about myself – skip this section
                </label>
                <input
                    name="skipDemographics"
                    type="checkbox"
                    className="form-check-input"
                    id="skipDemographics"
                    checked={skipDemographics}
                    onChange={(e) => handleSkipDemographicsChange(e.target.checked)}
                />
            </div>
            <form onSubmit={handleSubmit} className="needs-validation" noValidate>
                {demographicsForm}
                <button type="submit" className="btn btn-primary w-100">
                    Continue
                </button>
            </form>
        </div>
    );
}

export default DemographicsForm;
