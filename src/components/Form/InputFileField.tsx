import React, { memo, ChangeEvent } from "react";

interface FileUploadFieldProps {
  label: string;
  name?: string;
  error?: string;
  required?: boolean;
  accept?: string; // e.g. "image/*,.pdf"
  onChange?: (e: ChangeEvent<HTMLInputElement>) => void;
  col?: string;
  row1?: string;
  row2?: string;
}

const InputFileField: React.FC<FileUploadFieldProps> = memo(
  ({
    label,
    name,
    error,
    required = false,
    accept = "*/*",
    onChange,
    col = "col-md-3",
    row1 = "col-sm-5 col-4", // (not used, but kept for consistency)
    row2 = "col-sm-7 col-8", // (not used, but kept for consistency)
  }) => {
    const inputId = name || `file-${Math.random().toString(36).substring(2, 9)}`;

    return (
      <div className={`${col} mt-3`}>
        <div className="form-group">
          {/* Label always on top */}
          <label
            htmlFor={inputId}
            className="form-label fw-semibold"
            style={{ fontSize: "14px" }}
          >
            {label}
            {required && <span className="text-danger">*</span>}
          </label>

          {/* File input */}
          <input
            type="file"
            className={`form-control ${error ? "is-invalid" : ""}`}
            id={inputId}
            name={name}
            accept={accept}
            onChange={onChange}
          />

          {/* Error message */}
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

const areEqual = (
  prevProps: FileUploadFieldProps,
  nextProps: FileUploadFieldProps
) => {
  return (
    prevProps.name === nextProps.name &&
    prevProps.error === nextProps.error
  );
};

export default memo(InputFileField, areEqual);
