import React, { useState } from "react";
import Turnstile from "react-turnstile";

function ContinueForm({captchaRequired, onContinue, title, text}) {
    const [captchaToken, setCaptchaToken] = useState()

    const captchaSiteKey = import.meta.env.VITE_CAPTCHA_SITE_KEY;

    function continueSubmit(event) {
        event.preventDefault()
        if (captchaRequired) {
            onContinue(captchaToken)
        } else {
            onContinue()
        }
    }

    if(captchaRequired) {
        return (
            <div className="card-body p-4 text-center">
                <h1 className="h4 mb-3">{title}</h1>
                <p className="text-muted">
                    {text}
                </p>
                <form onSubmit={continueSubmit} noValidate>
                    <span className="text-muted text-center mb-4">
                        <Turnstile sitekey="0x4AAAAAACKMJXal2NhKyPKL" onVerify={(token) => { setCaptchaToken(token) }}/>
                    </span>
                    <button type="submit" className="btn btn-primary w-100" disabled={!captchaToken}>
                        Continue
                    </button>
                </form>
            </div>
        )
    } else {
        return (
            <div className="card-body p-4 text-center">
                <h1 className="h4 mb-3">{title}</h1>
                <p className="text-muted">
                    {text}
                </p>
                <form onSubmit={continueSubmit} noValidate>
                    <button type="submit" className="btn btn-primary w-100">
                        Continue
                    </button>
                </form>
            </div>
        )
    }
}

export default ContinueForm;