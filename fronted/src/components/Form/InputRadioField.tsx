import React, { memo, ChangeEvent } from "react";

interface RadioOption {
    value: string | number;
    label: string;
}

interface InputRadioFieldProps {
    label: string;
    name: string;
    options: RadioOption[];
    selectedValue: string | number;
    onChange?: (e: ChangeEvent<HTMLInputElement>) => void;
    error?: string;
    required?: boolean;
    col?: string;
    isDefault?: boolean;
}

const InputRadioFieldComponent: React.FC<InputRadioFieldProps> = ({
    label,
    name,
    options,
    selectedValue,
    onChange,
    error,
    required = false,
    col = "col-md-6",
    isDefault = false,
}) => {
    const colors = ["#9B5DE5", "#4D96FF", "#FF6B6B", "#FFD93D", "#6BCB77"]; // different colors

    return (
        <div className={`${col} mt-4`}>
            <label className="form-label fw-semibold mb-2" style={{ fontSize: "14px" }}>
                {label} {required && <span className="text-danger">*</span>}
            </label>
            <div className="d-flex flex-wrap gap-3">
                {options?.map((opt, index) => {
                    const color = colors[index % colors.length];
                    const isChecked = selectedValue == opt.value;

                    return (
                        <label
                            key={opt.value}
                            htmlFor={`${name}_${opt.value}`}
                            style={{
                                display: "flex",
                                alignItems: "center",
                                gap: "8px",
                                cursor: isDefault ? "not-allowed" : "pointer",
                                fontSize: "14px",
                                fontWeight: isChecked ? 600 : 400,
                            }}
                        >
                            <input
                                type="radio"
                                id={`${name}_${opt.value}`}
                                name={name}
                                value={opt.value}
                                checked={isChecked}
                                onChange={onChange}
                                disabled={isDefault}
                                style={{ display: "none" }}
                            />
                            <span
                                style={{
                                    width: "18px",
                                    height: "18px",
                                    borderRadius: "50%",
                                    border: `2px solid ${error ? "red" : color}`, // 🔹 red border on error
                                    display: "inline-block",
                                    position: "relative",
                                    transition: "all 0.2s",
                                }}
                            >
                                {isChecked && (
                                    <span
                                        style={{
                                            width: "10px",
                                            height: "10px",
                                            borderRadius: "50%",
                                            backgroundColor: error ? "red" : color, // 🔹 red fill if checked + error
                                            position: "absolute",
                                            top: "50%",
                                            left: "50%",
                                            transform: "translate(-50%, -50%)",
                                        }}
                                    ></span>
                                )}
                            </span>

                            {opt.label}
                        </label>
                    );
                })}
            </div>
            {error && (
                <div className="text-danger mt-1" style={{ fontSize: "12px" }}>
                    {error}
                </div>
            )}
        </div>
    );
};

const areEqual = (
    prevProps: InputRadioFieldProps,
    nextProps: InputRadioFieldProps
) => {
    return (
        prevProps.selectedValue === nextProps.selectedValue &&
        prevProps.error === nextProps.error &&
        prevProps.options === nextProps.options &&
        prevProps.isDefault === nextProps.isDefault
    );
};

export default memo(InputRadioFieldComponent, areEqual);
