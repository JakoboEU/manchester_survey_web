function App() {
    const [formData, setFormData] = React.useState({
        gender: "",
        age: "",
        ethnicity: "",
        income: "",
        education: "",
        movement: "",
        dog: "",
        children: "",
        garden: "",
        acceptTerms: false,
    });

    function handleChange(event) {
        const { name, value } = event.target;
        setFormData((prev) => ({ ...prev, [name]: value }));
    }

    function handleAcceptTerms(event) {
        setFormData((prev) => ({ ...prev, ['acceptTerms']: !formData.acceptTerms }));
    }

    function handleSubmit(event) {
        event.preventDefault();
        alert("Submitted:\n" + JSON.stringify(formData, null, 2));
    }

    return (
        <div className="min-vh-100 d-flex align-items-center justify-content-center">
            <div className="card shadow-lg w-100" style={{ maxWidth: "480px" }}>
                <div className="card-body p-4">
                    <h1 className="h4 mb-3 text-center">City Nature Choices</h1>
                    <p className="text-muted small text-center mb-4">
                        In a quick series of A/B image choices, you’ll judge three things: wildlife potential, personal safety, and local support.
                        Basic demographics help us understand which features matter to different communities and ensure recommendations are fair and inclusive; results are summarised only at group level.
                    </p>

                    <form onSubmit={handleSubmit} className="needs-validation" noValidate>
                        <div className="mb-3">
                            <label htmlFor="gender" className="form-label">
                                How would you describe your gender?
                            </label>
                            <select
                                id="gender"
                                name="gender"
                                className="form-select"
                                value={formData.gender}
                                onChange={handleChange}
                                required
                            >
                                <option value="">Choose…</option>
                                <option value="man">Man</option>
                                <option value="woman">Woman</option>
                                <option value="other">Non-binary or another gender identity</option>
                                <option value="not-selected">Prefer not to say</option>
                            </select>
                        </div>

                        <div className="mb-4">
                            <label htmlFor="age" className="form-label">
                                Which age group best describes you?
                            </label>
                            <select
                                id="age"
                                name="age"
                                className="form-select"
                                value={formData.age}
                                onChange={handleChange}
                            >
                                <option value="">Choose…</option>
                                <option value="younger">18 - 39</option>
                                <option value="middle">40 - 64</option>
                                <option value="older">65 or over</option>
                                <option value="not-selected">Prefer not to say</option>
                            </select>
                        </div>

                        <div className="mb-4">
                            <label htmlFor="ethnicity" className="form-label">
                                Which of these best describes your ethnic background? (Please choose the one that fits best.)
                            </label>
                            <select
                                id="ethnicity"
                                name="ethnicity"
                                className="form-select"
                                value={formData.ethnicity}
                                onChange={handleChange}
                            >
                                <option value="">Choose…</option>
                                <option value="white">White (UK, Ireland or other White background)</option>
                                <option value="other">Ethnic minority background (for example: Mixed, Asian, Black, Middle Eastern, North African, or any other non-White background)</option>
                                <option value="not-selected">Prefer not to say</option>
                            </select>
                        </div>

                        <div className="mb-4">
                            <label htmlFor="education" className="form-label">
                                Which option best matches the highest level of education you have completed?
                            </label>
                            <select
                                id="education"
                                name="education"
                                className="form-select"
                                value={formData.education}
                                onChange={handleChange}
                            >
                                <option value="">Choose…</option>
                                <option value="sixteen">Finished school at 16 or earlier (GCSEs or equivalent, or below)</option>
                                <option value="eighteen">Finished school at 18 / higher or further education (no university degree)</option>
                                <option value="older">University degree or higher (e.g. BA/BSc, Masters, PhD)</option>
                                <option value="not-selected">Prefer not to say</option>
                            </select>
                        </div>

                        <div className="mb-4">
                            <label htmlFor="income" className="form-label">
                                Thinking about your household as a whole, which of these broad income ranges best fits you (before tax)?
                            </label>
                            <select
                                id="income"
                                name="income"
                                className="form-select"
                                value={formData.movement}
                                onChange={handleChange}
                            >
                                <option value="">Choose…</option>
                                <option value="lower">Under £21,0000</option>
                                <option value="middle">£21,000 - £45,000</option>
                                <option value="higher">Over £45,000</option>
                                <option value="not-selected">Prefer not to say</option>
                            </select>
                        </div>

                        <div className="mb-4">
                            <label htmlFor="education" className="form-label">
                                Which option best matches the highest level of education you have completed?
                            </label>
                            <select
                                id="education"
                                name="education"
                                className="form-select"
                                value={formData.education}
                                onChange={handleChange}
                            >
                                <option value="">Choose…</option>
                                <option value="sixteen">Finished school at 16 or earlier (GCSEs or equivalent, or below)</option>
                                <option value="eighteen">Finished school at 18 / higher or further education (no university degree)</option>
                                <option value="older">University degree or higher (e.g. BA/BSc, Masters, PhD)</option>
                                <option value="not-selected">Prefer not to say</option>
                            </select>
                        </div>

                        <div className="mb-4">
                            <label htmlFor="movement" className="form-label">
                                Do you have any long-term health condition or disability that affects how easy it is for you to walk, stand, or get around outside, if at all?
                            </label>
                            <select
                                id="movement"
                                name="movement"
                                className="form-select"
                                value={formData.movement}
                                onChange={handleChange}
                            >
                                <option value="">Choose…</option>
                                <option value="yes">Yes</option>
                                <option value="no">No</option>
                                <option value="not-selected">Prefer not to say</option>
                            </select>
                        </div>

                        <div className="mb-4">
                            <label htmlFor="dog" className="form-label">
                                Do you currently have a dog in your household, or do you regularly walk a dog?
                            </label>
                            <select
                                id="dog"
                                name="dog"
                                className="form-select"
                                value={formData.dog}
                                onChange={handleChange}
                            >
                                <option value="">Choose…</option>
                                <option value="yes">Yes</option>
                                <option value="no">No</option>
                                <option value="not-selected">Prefer not to say</option>
                            </select>
                        </div>

                        <div className="mb-4">
                            <label htmlFor="children" className="form-label">
                                Are there any children under 18 living in your household, if you’re happy to say?
                            </label>
                            <select
                                id="children"
                                name="children"
                                className="form-select"
                                value={formData.children}
                                onChange={handleChange}
                            >
                                <option value="">Choose…</option>
                                <option value="yes">Yes</option>
                                <option value="no">No</option>
                                <option value="not-selected">Prefer not to say</option>
                            </select>
                        </div>

                        <div className="mb-4">
                            <label htmlFor="garden" className="form-label">
                                Do you have access to a private garden or outdoor space at home that you can use?
                            </label>
                            <select
                                id="garden"
                                name="garden"
                                className="form-select"
                                value={formData.garden}
                                onChange={handleChange}
                            >
                                <option value="">Choose…</option>
                                <option value="yes">Yes</option>
                                <option value="no">No</option>
                                <option value="not-selected">Prefer not to say</option>
                            </select>
                        </div>

                        <div className="mb-4">
                            <label htmlFor="age" className="form-label">
                                <b>Participant confirmation</b>
                                <p>By ticking the box below and clicking “Start survey,” you confirm that:</p>
                                <ul>
                                    <li>you are 18+,</li>
                                    <li>you have read and understood the <a href="../terms.html" target="terms">Privacy Notice</a>,</li>
                                    <li>you understand the study is anonymous, only aggregated results will be shared, and individual records cannot be identified or deleted after submission, and</li>
                                    <li>you consent to take part.</li>
                                </ul>
                            </label>
                            <p>I agree and wish to continue <input type="checkbox" id="accept" checked={formData.acceptTerms} onChange={handleAcceptTerms}/></p>
                        </div>

                        <button type="submit" className="btn btn-primary w-100">
                            Submit
                        </button>
                    </form>
                </div>
            </div>
        </div>
    );
}

const rootElement = document.getElementById("root");
const root = ReactDOM.createRoot(rootElement);
root.render(<App />);
