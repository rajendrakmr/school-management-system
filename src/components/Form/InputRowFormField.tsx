import React, { memo, ChangeEvent, FocusEvent, KeyboardEvent } from "react";

interface InputRowFormFieldProps {
    label: string;
    type?: "text" | "number" | "string" | "textarea";
    name?: string;
    inputValue: string;
    error?: string;
    placeholder?: string;
    onChange?: (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => void;
    isDefault?: boolean;
    onBlur?: (e: FocusEvent<HTMLInputElement | HTMLTextAreaElement>) => void;
    required?: boolean;
    max?: number;
    rows?: number; // For textarea
    onKeyUp?: (e: KeyboardEvent<HTMLInputElement | HTMLTextAreaElement>) => void;
    col?: string;
}

const InputRowFormField: React.FC<InputRowFormFieldProps> = memo(
    ({
        label,
        type = "text",
        name,
        inputValue,
        placeholder,
        onChange,
        error,
        isDefault = false,
        onBlur,
        required = false,
        max = 250,
        rows = 3,
        onKeyUp,
        col = "col-md-3",
    }) => {
        const handleInputChange = (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
            let value = e.target.value;

            if (type === "number") {
                const numericValue = value.replace(/[^0-9.]/g, "");
                if ((numericValue.match(/\./g) || []).length > 1) return;
                e.target.value = numericValue;
            } else if (type === "string") {
                e.target.value = value.replace(/[^a-zA-Z0-9-]/g, "").toUpperCase().trim();
            }

            onChange?.(e);
        };

        const handleKeyUp = (e: KeyboardEvent<HTMLInputElement | HTMLTextAreaElement>) => {
            onKeyUp?.(e);
        };

        return (
            <div className={`${col} mt-3`}>
                <div className="form-group">
                    <label htmlFor={name} className="form-label fw-semibold" style={{ fontSize: "14px" }}>
                        {label}
                        {required && <span className="text-danger">*</span>}
                    </label>

                    {type === "textarea" ? (
                        <textarea
                            id={name}
                            name={name}
                            value={inputValue ?? ""}
                            placeholder={placeholder || `Enter ${label}`}
                            className={`form-control ${error ? "is-invalid" : ""}`}
                            disabled={isDefault}
                            maxLength={max}
                            rows={rows}
                            onChange={handleInputChange}
                            onBlur={onBlur}
                            onKeyUp={handleKeyUp}
                        />
                    ) : (
                        <input
                            type={type === "number" && max !== 250 ? "text" : type}
                            id={name}
                            name={name}
                            value={inputValue ?? ""}
                            placeholder={placeholder || `Enter ${label}`}
                            className={`form-control ${error ? "is-invalid" : ""}`}
                            disabled={isDefault}
                            maxLength={max}
                            min={0}
                            onChange={handleInputChange}
                            onBlur={onBlur}
                            onKeyUp={handleKeyUp}
                        />
                    )}

                    {error && (
                        <div className="invalid-feedback" style={{ fontSize: "12px" }}>
                            {error}
                        </div>
                    )}
                </div>
            </div>
        );
    }
);

const areEqual = (prev: InputRowFormFieldProps, next: InputRowFormFieldProps) =>
    prev.name === next.name &&
    prev.error === next.error &&
    prev.inputValue === next.inputValue;

export default memo(InputRowFormField, areEqual);
