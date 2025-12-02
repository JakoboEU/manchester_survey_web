import React from "react";

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
    const helpText = helpLabel? <button
        type="button"
        className="btn btn-sm btn-outline-secondary rounded-circle p-0 d-inline-flex justify-content-center align-items-center"
        style={{ width: "1.5rem", height: "1.5rem" }}
        title={helpLabel}
    >
        i
    </button> : ''

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