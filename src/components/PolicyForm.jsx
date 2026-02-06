import { useState } from "react";

function PolicyForm({ onAccepted }) {
    const [checked, setChecked] = useState(false);

    function handleSubmit(event) {
        event.preventDefault();
        if (!checked) return;
        onAccepted();
    }

    return (
        <div className="card-body p-4">
            <h1 className="h4 mb-3 text-center">City Nature Choices</h1>
            <p className="text-muted text-center mb-4">
                In a quick series of A/B image choices, you’ll judge three things:
                wildlife potential, personal safety, and local support.
            </p>

            <form onSubmit={handleSubmit} className="needs-validation" noValidate>
                <div className="mb-3">
                    <div className="mb-4">
                        <label htmlFor="acceptTerms" className="form-label">
                            <b>Participant confirmation</b>
                            <p>
                                By ticking the box below and clicking “Start survey,” you
                                confirm that:
                            </p>
                            <ul>
                                <li>you are 18+,</li>
                                <li>
                                    you have read and understood the{" "}
                                    <a href="/terms.html" target="terms">
                                        Privacy Notice
                                    </a>
                                    ,
                                </li>
                                <li>
                                    you understand the study is anonymous, only aggregated results
                                    will be shared, and individual records cannot be identified or
                                    deleted after submission, and
                                </li>
                                <li>you consent to take part.</li>
                                <li className="small text-muted">
                                    If you accessed this survey via Survey Swap; the completion code will be revealed after 40 choices.
                                </li>
                            </ul>
                        </label>
                        <p>
                            I agree and wish to continue{" "}
                            <input
                                name="acceptTerms"
                                type="checkbox"
                                id="acceptTerms"
                                onChange={(e) => setChecked(e.target.checked)}
                                required
                            />
                        </p>
                    </div>

                    <button
                        type="submit"
                        className="btn btn-primary w-100"
                        disabled={!checked}
                    >
                        Continue
                    </button>
                </div>
            </form>
        </div>
    );
}

export default PolicyForm;
