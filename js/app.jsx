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
                                <i>How would you describe your gender?</i>
                            </label>
                            <div>
                                <div className="form-check">
                                    <input
                                        className="form-check-input"
                                        type="radio"
                                        name="gender"
                                        id="gender-man"
                                        value="man"
                                        checked={formData.gender === "man"}
                                        onChange={handleChange}
                                        required
                                    />
                                    <label className="form-check-label" htmlFor="gender-man">
                                        Man
                                    </label>
                                </div>
                                <div className="form-check">
                                    <input
                                        className="form-check-input"
                                        type="radio"
                                        name="gender"
                                        id="gender-woman"
                                        value="woman"
                                        checked={formData.gender === "woman"}
                                        onChange={handleChange}
                                        required
                                    />
                                    <label className="form-check-label" htmlFor="gender-woman">
                                        Woman
                                    </label>
                                </div>
                                <div className="form-check">
                                    <input
                                        className="form-check-input"
                                        type="radio"
                                        name="gender"
                                        id="gender-other"
                                        value="other"
                                        checked={formData.gender === "other"}
                                        onChange={handleChange}
                                        required
                                    />
                                    <label className="form-check-label" htmlFor="gender-other">
                                        Non-binary or another gender identity
                                    </label>
                                </div>
                                <div className="form-check">
                                    <input
                                        className="form-check-input"
                                        type="radio"
                                        name="gender"
                                        id="gender-not-selected"
                                        value="not-selected"
                                        checked={formData.gender === "not-selected"}
                                        onChange={handleChange}
                                    />
                                    <label className="form-check-label" htmlFor="gender-not-selected">
                                        Prefer not to say
                                    </label>
                                </div>
                            </div>
                        </div>

                        <div className="mb-4">
                            <label htmlFor="age" className="form-label">
                                <i>Which age group best describes you?</i>
                            </label>
                            <div>
                                <div className="form-check">
                                    <input
                                        className="form-check-input"
                                        type="radio"
                                        name="age"
                                        id="age-younger"
                                        value="younger"
                                        checked={formData.age === "younger"}
                                        onChange={handleChange}
                                        required
                                    />
                                    <label className="form-check-label" htmlFor="age-younger">
                                        18 - 39
                                    </label>
                                </div>
                                <div className="form-check">
                                    <input
                                        className="form-check-input"
                                        type="radio"
                                        name="age"
                                        id="age-middle"
                                        value="middle"
                                        checked={formData.age === "middle"}
                                        onChange={handleChange}
                                        required
                                    />
                                    <label className="form-check-label" htmlFor="age-middle">
                                        40 - 64
                                    </label>
                                </div>
                                <div className="form-check">
                                    <input
                                        className="form-check-input"
                                        type="radio"
                                        name="age"
                                        id="age-older"
                                        value="older"
                                        checked={formData.age === "older"}
                                        onChange={handleChange}
                                        required
                                    />
                                    <label className="form-check-label" htmlFor="age-older">
                                        65 or over
                                    </label>
                                </div>
                                <div className="form-check">
                                    <input
                                        className="form-check-input"
                                        type="radio"
                                        name="age"
                                        id="age-not-selected"
                                        value="not-selected"
                                        checked={formData.age === "not-selected"}
                                        onChange={handleChange}
                                    />
                                    <label className="form-check-label" htmlFor="age-not-selected">
                                        Prefer not to say
                                    </label>
                                </div>
                            </div>
                        </div>

                        <div className="mb-4">
                            <label htmlFor="ethnicity" className="form-label">
                                <i>Which of these best describes your ethnic background? (Please choose the one that fits best.)</i>
                            </label>
                            <div>
                                <div className="form-check">
                                    <input
                                        className="form-check-input"
                                        type="radio"
                                        name="ethnicity"
                                        id="ethnicity-white"
                                        value="white"
                                        checked={formData.ethnicity === "white"}
                                        onChange={handleChange}
                                        required
                                    />
                                    <label className="form-check-label" htmlFor="ethnicity-white">
                                        White (UK, Ireland or other White background)
                                    </label>
                                </div>
                                <div className="form-check">
                                    <input
                                        className="form-check-input"
                                        type="radio"
                                        name="ethnicity"
                                        id="ethnicity-other"
                                        value="other"
                                        checked={formData.ethnicity === "other"}
                                        onChange={handleChange}
                                        required
                                    />
                                    <label className="form-check-label" htmlFor="ethnicity-other">
                                        Ethnic minority background (for example: Mixed, Asian, Black, Middle Eastern, North African, or any other non-White background)
                                    </label>
                                </div>
                                <div className="form-check">
                                    <input
                                        className="form-check-input"
                                        type="radio"
                                        name="ethnicity"
                                        id="ethnicity-not-selected"
                                        value="not-selected"
                                        checked={formData.ethnicity === "not-selected"}
                                        onChange={handleChange}
                                    />
                                    <label className="form-check-label" htmlFor="ethnicity-not-selected">
                                        Prefer not to say
                                    </label>
                                </div>
                            </div>
                        </div>

                        <div className="mb-4">
                            <label htmlFor="education" className="form-label">
                                <i>Which option best matches the highest level of education you have completed?</i>
                            </label>
                            <div>
                                <div className="form-check">
                                    <input
                                        className="form-check-input"
                                        type="radio"
                                        name="education"
                                        id="education-sixteen"
                                        value="sixteen"
                                        checked={formData.education === "sixteen"}
                                        onChange={handleChange}
                                        required
                                    />
                                    <label className="form-check-label" htmlFor="education-sixteen">
                                        I finished school at around age 16 or earlier
                                        <span>
                                            <button
                                                type="button"
                                                className="btn btn-sm btn-outline-secondary rounded-circle p-0 d-inline-flex justify-content-center align-items-center"
                                                style={{ width: "1.5rem", height: "1.5rem" }}
                                                title="GCSEs or equivalent, or below."
                                            >
                                                i
                                            </button>
                                        </span>
                                    </label>
                                </div>

                                <div className="form-check">
                                    <input
                                        className="form-check-input"
                                        type="radio"
                                        name="education"
                                        id="education-eighteen"
                                        value="eighteen"
                                        checked={formData.education === "eighteen"}
                                        onChange={handleChange}
                                    />
                                    <label className="form-check-label" htmlFor="education-eighteen">
                                        I continued in education past 16 but not at university
                                        <span>
                                            <button
                                                type="button"
                                                className="btn btn-sm btn-outline-secondary rounded-circle p-0 d-inline-flex justify-content-center align-items-center"
                                                style={{ width: "1.5rem", height: "1.5rem" }}
                                                title="for example A-levels or college"
                                            >
                                                i
                                            </button>
                                        </span>
                                    </label>
                                </div>

                                <div className="form-check">
                                    <input
                                        className="form-check-input"
                                        type="radio"
                                        name="education"
                                        id="education-older"
                                        value="older"
                                        checked={formData.education === "older"}
                                        onChange={handleChange}
                                    />
                                    <label className="form-check-label" htmlFor="education-older">
                                        I studied at university or in another longer higher-education course
                                        <span>
                                            <button
                                                type="button"
                                                className="btn btn-sm btn-outline-secondary rounded-circle p-0 d-inline-flex justify-content-center align-items-center"
                                                style={{ width: "1.5rem", height: "1.5rem" }}
                                                title="for example degree, Masters, PhD"
                                            >
                                            i
                                            </button>
                                        </span>
                                    </label>
                                </div>

                                <div className="form-check">
                                    <input
                                        className="form-check-input"
                                        type="radio"
                                        name="education"
                                        id="education-not-selected"
                                        value="not-selected"
                                        checked={formData.education === "not-selected"}
                                        onChange={handleChange}
                                    />
                                    <label className="form-check-label" htmlFor="education-not-selected">
                                        Prefer not to say
                                    </label>
                                </div>
                            </div>
                        </div>

                        <div className="mb-4">
                            <label htmlFor="income" className="form-label">
                                <i>Thinking about your household as a whole, which of these broad income ranges best fits you (before tax)?</i>
                            </label>
                            <div>
                                <div className="form-check">
                                    <input
                                        className="form-check-input"
                                        type="radio"
                                        name="income"
                                        id="income-lower"
                                        value="lower"
                                        checked={formData.income === "lower"}
                                        onChange={handleChange}
                                        required
                                    />
                                    <label className="form-check-label" htmlFor="income-lower">
                                        Under £21,0000
                                    </label>
                                </div>
                                <div className="form-check">
                                    <input
                                        className="form-check-input"
                                        type="radio"
                                        name="income"
                                        id="income-middle"
                                        value="middle"
                                        checked={formData.income === "middle"}
                                        onChange={handleChange}
                                        required
                                    />
                                    <label className="form-check-label" htmlFor="income-middle">
                                        £21,000 - £45,000
                                    </label>
                                </div>
                                <div className="form-check">
                                    <input
                                        className="form-check-input"
                                        type="radio"
                                        name="income"
                                        id="income-higher"
                                        value="higher"
                                        checked={formData.income === "higher"}
                                        onChange={handleChange}
                                        required
                                    />
                                    <label className="form-check-label" htmlFor="income-higher">
                                        Over £45,000
                                    </label>
                                </div>
                                <div className="form-check">
                                    <input
                                        className="form-check-input"
                                        type="radio"
                                        name="income"
                                        id="income-not-selected"
                                        value="not-selected"
                                        checked={formData.income === "not-selected"}
                                        onChange={handleChange}
                                    />
                                    <label className="form-check-label" htmlFor="income-not-selected">
                                        Prefer not to say
                                    </label>
                                </div>
                            </div>
                        </div>

                        <div className="mb-4">
                            <label htmlFor="movement" className="form-label">
                                <i>Do you have any long-term health condition or disability that affects how easy it is for you to walk, stand, or get around outside, if at all?</i>
                            </label>
                            <div>
                                <div className="form-check">
                                    <input
                                        className="form-check-input"
                                        type="radio"
                                        name="movement"
                                        id="movement-yes"
                                        value="yes"
                                        checked={formData.movement === "yes"}
                                        onChange={handleChange}
                                        required
                                    />
                                    <label className="form-check-label" htmlFor="movement-yes">
                                        Yes
                                    </label>
                                </div>
                                <div className="form-check">
                                    <input
                                        className="form-check-input"
                                        type="radio"
                                        name="movement"
                                        id="movement-no"
                                        value="no"
                                        checked={formData.movement === "no"}
                                        onChange={handleChange}
                                        required
                                    />
                                    <label className="form-check-label" htmlFor="movement-no">
                                        No
                                    </label>
                                </div>
                                <div className="form-check">
                                    <input
                                        className="form-check-input"
                                        type="radio"
                                        name="movement"
                                        id="movement-not-selected"
                                        value="not-selected"
                                        checked={formData.movement === "not-selected"}
                                        onChange={handleChange}
                                    />
                                    <label className="form-check-label" htmlFor="movement-not-selected">
                                        Prefer not to say
                                    </label>
                                </div>
                            </div>
                        </div>

                        <div className="mb-4">
                            <label htmlFor="dog" className="form-label">
                                <i>Do you currently have a dog in your household, or do you regularly walk a dog?</i>
                            </label>
                            <div>
                                <div className="form-check">
                                    <input
                                        className="form-check-input"
                                        type="radio"
                                        name="dog"
                                        id="dog-yes"
                                        value="yes"
                                        checked={formData.dog === "yes"}
                                        onChange={handleChange}
                                        required
                                    />
                                    <label className="form-check-label" htmlFor="dog-yes">
                                        Yes
                                    </label>
                                </div>
                                <div className="form-check">
                                    <input
                                        className="form-check-input"
                                        type="radio"
                                        name="dog"
                                        id="dog-no"
                                        value="no"
                                        checked={formData.dog === "no"}
                                        onChange={handleChange}
                                        required
                                    />
                                    <label className="form-check-label" htmlFor="dog-no">
                                        No
                                    </label>
                                </div>
                                <div className="form-check">
                                    <input
                                        className="form-check-input"
                                        type="radio"
                                        name="dog"
                                        id="dog-not-selected"
                                        value="not-selected"
                                        checked={formData.dog === "not-selected"}
                                        onChange={handleChange}
                                    />
                                    <label className="form-check-label" htmlFor="dog-not-selected">
                                        Prefer not to say
                                    </label>
                                </div>
                            </div>
                        </div>

                        <div className="mb-4">
                            <label htmlFor="children" className="form-label">
                                <i>Are there any children under 18 living in your household, if you’re happy to say?</i>
                            </label>
                            <div>
                                <div className="form-check">
                                    <input
                                        className="form-check-input"
                                        type="radio"
                                        name="children"
                                        id="children-yes"
                                        value="yes"
                                        checked={formData.children === "yes"}
                                        onChange={handleChange}
                                        required
                                    />
                                    <label className="form-check-label" htmlFor="children-yes">
                                        Yes
                                    </label>
                                </div>
                                <div className="form-check">
                                    <input
                                        className="form-check-input"
                                        type="radio"
                                        name="children"
                                        id="children-no"
                                        value="no"
                                        checked={formData.children === "no"}
                                        onChange={handleChange}
                                        required
                                    />
                                    <label className="form-check-label" htmlFor="children-no">
                                        No
                                    </label>
                                </div>
                                <div className="form-check">
                                    <input
                                        className="form-check-input"
                                        type="radio"
                                        name="children"
                                        id="children-not-selected"
                                        value="not-selected"
                                        checked={formData.children === "not-selected"}
                                        onChange={handleChange}
                                    />
                                    <label className="form-check-label" htmlFor="children-not-selected">
                                        Prefer not to say
                                    </label>
                                </div>
                            </div>
                        </div>

                        <div className="mb-4">
                            <label htmlFor="garden" className="form-label">
                                <i>Do you have access to a private garden or outdoor space at home that you can use?</i>
                            </label>
                            <div>
                                <div className="form-check">
                                    <input
                                        className="form-check-input"
                                        type="radio"
                                        name="garden"
                                        id="garden-yes"
                                        value="yes"
                                        checked={formData.garden === "yes"}
                                        onChange={handleChange}
                                        required
                                    />
                                    <label className="form-check-label" htmlFor="garden-yes">
                                        Yes
                                    </label>
                                </div>
                                <div className="form-check">
                                    <input
                                        className="form-check-input"
                                        type="radio"
                                        name="garden"
                                        id="garden-no"
                                        value="no"
                                        checked={formData.garden === "no"}
                                        onChange={handleChange}
                                        required
                                    />
                                    <label className="form-check-label" htmlFor="garden-no">
                                        No
                                    </label>
                                </div>
                                <div className="form-check">
                                    <input
                                        className="form-check-input"
                                        type="radio"
                                        name="garden"
                                        id="garden-not-selected"
                                        value="not-selected"
                                        checked={formData.garden === "not-selected"}
                                        onChange={handleChange}
                                    />
                                    <label className="form-check-label" htmlFor="garden-not-selected">
                                        Prefer not to say
                                    </label>
                                </div>
                            </div>
                        </div>

                        <div className="mb-4">
                            <label htmlFor="acceptTerms" className="form-label">
                                <b>Participant confirmation</b>
                                <p>By ticking the box below and clicking “Start survey,” you confirm that:</p>
                                <ul>
                                    <li>you are 18+,</li>
                                    <li>you have read and understood the <a href="../terms.html" target="terms">Privacy Notice</a>,</li>
                                    <li>you understand the study is anonymous, only aggregated results will be shared, and individual records cannot be identified or deleted after submission, and</li>
                                    <li>you consent to take part.</li>
                                </ul>
                            </label>
                            <p>I agree and wish to continue <input name="acceptTerms" type="checkbox" id="acceptTerms" checked={formData.acceptTerms} onChange={handleAcceptTerms}/></p>
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
