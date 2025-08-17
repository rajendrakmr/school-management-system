import React, { useState } from "react";
import Select from "react-select";
import {
  customSelectOption,
  customSelectOption1,
  rowSelectdOption,
  SelectOption,
} from "@/utils/helper";

interface OptionType {
  value: string | number;
  label: string;
}

interface SelectFormInputProps {
  name: string;
  label: string;
  options: OptionType[];
  value: string;
  onChange: (selectedOption: OptionType | null, name: string) => void;
  isEdit?: boolean;
  error?: string;
  required?: boolean;
  isLoading?: boolean;
  pgNo?: number;
  formData?: any;
  onMenuScroll?: (formData: any, pgNo?: number) => void;
  col?: string;
  isTrue?: boolean;
  onKeyDown?: (event: React.KeyboardEvent) => void;
  childCol?: string;
  chiCol?: string;
}

const InputSelectField: React.FC<SelectFormInputProps> = ({
  name,
  label,
  options,
  value,
  onChange,
  isEdit = false,
  error,
  required = false,
  isLoading = false,
  pgNo,
  formData,
  onMenuScroll = () => console.log("Default"),
  col = "col-md-3",
  isTrue = false,
  onKeyDown,
}) => {
  const [copySuccess, setCopySuccess] = useState<string>("");

  return (
    <div className={`${col} mt-3`}>
      <div className="form-group">
        {/* label top */}
        <label
          htmlFor={name}
          className="form-label fw-semibold"
          style={{ fontSize: "14px" }}
        >
          {label}
          {required && <span className="text-danger">*</span>}
        </label>

        {/* select box */}
        <Select
          className={`w-100 ${error ? "is-invalid" : ""}`}
          id={name}
          name={name}
          options={options}
          value={
            isEdit
              ? { value: value, label: value }
              : options.find((option) => option.value === value) || null
          }
          onChange={(selectedOption) =>
            onChange(selectedOption as OptionType | null, name)
          }
          menuPortalTarget={document.body}
          styles={
            name === "selectedLoginId" ? rowSelectdOption : customSelectOption1
          }
          onMenuScrollToBottom={() => onMenuScroll(formData, pgNo)}
          isLoading={isLoading}
          isDisabled={isTrue}
          onKeyDown={onKeyDown}
        />

        {/* success copy msg */}
        {copySuccess && (
          <span className="text-success ms-2">{copySuccess}</span>
        )}

        {/* error msg */}
        {error && (
          <div className="invalid-feedback" style={{ fontSize: "12px" }}>
            {error}
          </div>
        )}
      </div>
    </div>
  );
};

export default InputSelectField;
