import React from "react";
import HelpIcon from "./HelpIcon.jsx";

function RadioOption({
                         name,
                         value,
                         selectedValue,
                         onChange,
                         label,
                         helpLabel,
                         required = false
                     }) {
    const isChecked = selectedValue === value;
    const helpText = helpLabel? <HelpIcon helpLabel={ helpLabel } /> : ''

    return (
        <div className="form-check">
            <input
                className="form-check-input"
                type="radio"
                name={name}
                id="{name}-{value}"
                value={value}
                checked={isChecked}
                onChange={onChange}
                required={required}
            />
            <label className="form-check-label" htmlFor="{name}-{value}">
                {label}{" "}{helpText}
            </label>
        </div>
    );
}

export default RadioOption;