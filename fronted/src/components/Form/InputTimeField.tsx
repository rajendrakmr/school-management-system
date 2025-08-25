import React, { memo, useState, useEffect, ChangeEvent, FocusEvent } from "react";

interface InputTimeFieldProps {
  label: string;
  name: string;
  inputValue?: string; // "HH:mm" or "HH:mm:ss"
  onChange?: (e: ChangeEvent<HTMLInputElement>) => void;
  onBlur?: (e: FocusEvent<HTMLInputElement>) => void;
  error?: string;
  required?: boolean;
  col?: string;
}

const InputTimeField: React.FC<InputTimeFieldProps> = memo(({
  label,
  name,
  inputValue = "",
  onChange,
  onBlur,
  error,
  required = false,
  col = "col-md-3"
}) => {
  const [time, setTime] = useState(inputValue);

  useEffect(() => {
    setTime(inputValue);
  }, [inputValue]);

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value;
    setTime(val);

    if (onChange) {
      onChange(e);
    }
  };

  return (
    <div className={`${col} mt-3`}>
      <div className="form-group">
        <label htmlFor={name} className="form-label fw-semibold" style={{ fontSize: "14px" }}>
          {label} {required && <span className="text-danger">*</span>}
        </label>
        <input
          type="time"
          id={name}
          name={name}
          value={time}
          onChange={handleChange}
          onBlur={onBlur}
          className={`form-control ${error ? "is-invalid" : ""}`}
          step={1} // allows seconds
        />
        {error && <div className="invalid-feedback">{error}</div>}
      </div>
    </div>
  );
});

export default InputTimeField;
