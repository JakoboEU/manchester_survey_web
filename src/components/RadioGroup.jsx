// RadioGroup.jsx
import React from "react";
import RadioOption from "./RadioOption";

function RadioGroup({
                        name,
                        groupLabel,
                        selectedValue,
                        notSelected,
                        onChange,
                        options,
                        required = false,
                    }) {
    return (
        <div className="mb-3">
            {groupLabel && (
                <label className="form-label">
                    <i>{groupLabel}</i>
                </label>
            )}
            <div>
                {options.map((opt) => (
                    <RadioOption
                        key={opt.value}
                        name={name}
                        value={opt.value}
                        selectedValue={selectedValue}
                        onChange={onChange}
                        required={required}
                        label={opt.label}
                        helpLabel={opt.help}
                    />
                ))}
                <RadioOption
                    key='not-selected'
                    name={name}
                    value={notSelected}
                    selectedValue={selectedValue}
                    onChange={onChange}
                    required={required}
                    label="Prefer not to say"
                />
            </div>
        </div>
    );
}

export default RadioGroup;
