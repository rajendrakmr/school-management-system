import React, { memo, ChangeEvent, FocusEvent, KeyboardEvent } from "react";

interface InputFormFieldProps {
  label: string;
  type?: string;
  name?: string;
  inputValue: string | number;
  error?: string;
  placeholder?: string;
  onChange?: (e: ChangeEvent<HTMLInputElement>) => void;
  isDefault?: boolean;
  onBlur?: (e: FocusEvent<HTMLInputElement>) => void;
  required?: boolean;
  max?: number;
  onKeyUp?: (e: KeyboardEvent<HTMLInputElement>) => void;
  col?: string;
  row1?: string;
  row2?: string;
}

const InputFormField: React.FC<InputFormFieldProps> = memo(
  ({
    label,
    placeholder,
    type = "text",
    name,
    inputValue,
    onChange,
    error,
    isDefault = false,
    onBlur,
    required = false,
    max = 250,
    onKeyUp,
    col = "col-md-4",
    row1 = "col-sm-5 col-4",
    row2 = "col-sm-7 col-8",
  }) => {
   
    const handleNumberInput = (e: ChangeEvent<HTMLInputElement>) => {

      let value = e.target.value;
      if (type === "num") {
        let numericValue = value.replace(/[^0-9.]/g, ''); 
        const parts = numericValue.split('.');
        if (parts.length > 2) {
          numericValue = parts[0] + '.' + parts[1];
        } 
        e.target.value = numericValue;
      }

      else if (type === "number") {
        const numericValue = value.replace(/[^0-9.]/g, "");
        if (
          value !== numericValue ||
          (numericValue.match(/\./g) || []).length > 1
        ) {
          return;
        }
        e.target.value = numericValue;
      } else if (type === "str" || type === "string") {
        const alphanumericValue = value.replace(/[^a-zA-Z0-9-]/g, "");
        e.target.value = alphanumericValue.toUpperCase().trim();
      }

      if (onChange) {
        onChange(e);
      }
    };

    const inputType = type === "number" && max !== 250 ? "text" : type;
    const handleKeyUp = (e: KeyboardEvent<HTMLInputElement>) => {
      if (onKeyUp) onKeyUp(e);
    };

    return (

      <div className={`${col} mt-3`}>
        <div className="form-group">
          {/* label always top */}
          <label
            htmlFor={name}
            className="form-label fw-semibold"
            style={{ fontSize: "14px" }}
          >
            {label}
            {required && <span className="text-danger">*</span>}
          </label>

          {/* input field */}
          <input
            type={inputType}
            className={`form-control ${error ? "is-invalid" : ""}`}
            id={name}
            disabled={isDefault}
            name={name}
            value={inputValue ?? ""}
            onBlur={onBlur}
            onKeyUp={handleKeyUp}
            onChange={handleNumberInput}
            maxLength={max}
            min={0}
            placeholder={placeholder || `Enter ${label}`}
          />

          {error && <span className="text-danger">{error}</span>}
        </div>
      </div>
    );
  }
);

const areEqual = (
  prevProps: InputFormFieldProps,
  nextProps: InputFormFieldProps
) => {
  return (
    prevProps.name === nextProps.name &&
    prevProps.error === nextProps.error &&
    prevProps.inputValue === nextProps.inputValue
  );
};

export default memo(InputFormField, areEqual);
