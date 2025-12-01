function App() {
    const [formData, setFormData] = React.useState({
        name: "",
        email: "",
        favCity: "",
        theme: "light",
    });

    function handleChange(event) {
        const { name, value } = event.target;
        setFormData((prev) => ({ ...prev, [name]: value }));
    }

    function handleSubmit(event) {
        event.preventDefault();
        alert("Submitted:\n" + JSON.stringify(formData, null, 2));
    }

    return (
        <div className="min-vh-100 d-flex align-items-center justify-content-center">
            <div className="card shadow-lg w-100" style={{ maxWidth: "480px" }}>
                <div className="card-body p-4">
                    <h1 className="h4 mb-3 text-center">Pick the Park: Help Shape Wildlife-Friendly Spaces</h1>
                    <p className="text-muted small text-center mb-4">
                        In a quick series of A/B image choices, you’ll judge three things: wildlife potential, personal safety, and local support.
                        Basic demographics help us understand which features matter to different communities and ensure recommendations are fair and inclusive; results are summarised only at group level.
                    </p>

                    <form onSubmit={handleSubmit} className="needs-validation" noValidate>
                        <div className="mb-3">
                            <label htmlFor="gender" className="form-label">
                                What is your gender?
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
                                Which age group are you in?
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
                            <label htmlFor="ethinicity" className="form-label">
                                Which of the following best describes your ethnic background?
                            </label>
                            <select
                                id="ethinicity"
                                name="ethinicity"
                                className="form-select"
                                value={formData.ethinicity}
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
                                What is the highest level of education you have completed?
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
                                Do you have any long-term health condition or disability that limits how easily you can walk, stand, or get around outside the home?
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
                                Do you have a dog in your household, or regularly walk a dog?
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
                                Are there any children under 18 living in your household?
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
                                Do you have access to a private garden at home?
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
                                    <li>you agree to the <a href="../terms.html" target="terms">terms of service</a>,</li>
                                    <li>you are 18+,</li>
                                    <li>you have read and understood this Privacy Notice,</li>
                                    <li>you understand the study is anonymous, only aggregated results will be shared, and individual records cannot be identified or deleted after submission, and</li>
                                    <li>you consent to take part.</li>
                                </ul>
                            </label>
                            <p>I agree and wish to continue <input type="checkbox" id="accept"/></p>
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
