import React, { memo, ChangeEvent, KeyboardEvent } from "react";

interface InputColFormFieldProps {
  label: string;
  type?: string;
  name?: string;
  inputValue: string | number;
  error?: string;
  placeholder?: string;
  onChange?: (e: ChangeEvent<HTMLInputElement>) => void;
  isDefault?: boolean;
  onKeyUp?: (e: KeyboardEvent<HTMLInputElement>) => void;
  max?: number;
}

const InputColFormField: React.FC<InputColFormFieldProps> = memo(
  ({
    label,
    placeholder,
    type = "text",
    name,
    inputValue,
    onChange,
    error,
    isDefault = false,
    onKeyUp,
    max = 250,
  }) => {
    const handleInputChange = (e: ChangeEvent<HTMLInputElement>) => {
      let value = e.target.value;

      if (type === "number") {
        const numericValue = value.replace(/[^0-9.]/g, "");
        if (value !== numericValue || (numericValue.match(/\./g) || []).length > 1) {
          return;
        }
        e.target.value = numericValue;
      } else {
        // if (name !== "key_name") {
        //   // Convert all other fields to uppercase and replace spaces with underscores
        //   const alphanumericValue = value.replace(/[^a-zA-Z0-9 ]/g, "");
        //   e.target.value = alphanumericValue.to().trim().replace(/\s+/g, "_");
        // } else {
          // Keep original value for key_name
          e.target.value = value.trim();
         
      }

      if (onChange) onChange(e);
    };

    const handleKeyUp = (e: KeyboardEvent<HTMLInputElement>) => {
      if (onKeyUp) onKeyUp(e);
    };

    const inputType = type === "number" && max !== 250 ? "text" : type;

    return (
      <input
        type={inputType}
        className={`form-control ${error ? "is-invalid" : ""}`}
        id={name}
        disabled={isDefault}
        name={name}
        value={inputValue ?? ""}
        onChange={handleInputChange}
        onKeyUp={handleKeyUp}
        maxLength={max}
        placeholder={placeholder || label}
      />
    );
  }
);

const areEqual = (
  prevProps: InputColFormFieldProps,
  nextProps: InputColFormFieldProps
) => {
  return (
    prevProps.name === nextProps.name &&
    prevProps.error === nextProps.error &&
    prevProps.inputValue === nextProps.inputValue
  );
};

export default memo(InputColFormField, areEqual);
