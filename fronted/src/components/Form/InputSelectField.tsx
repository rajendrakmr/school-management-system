import React, { useState } from "react";
import Select from "react-select";
import {
  customSelectOption,
  customSelectOption1,
  rowSelectdOption,
} from "@/utils/helper";

interface OptionType {
  value: string | number;
  label: string;
}

interface SelectFormInputProps {
  name: string;
  label: string;
  options: OptionType[];
  value: string | number | null;
  onChange: (selectedOption: OptionType | null, name: string) => void;
  isEdit?: boolean;
  error?: string;
  required?: boolean;
  isLoading?: boolean;
  isSearchingLoader?: boolean;   // 🔹 new for search loader
  pgNo?: number;
  formData?: any;
  onMenuScroll?: (formData: any, pgNo?: number) => void;
  onInputChange?: (input: string) => void; // 🔹 new for search
  col?: string;
  isTrue?: boolean;
  onKeyDown?: (event: React.KeyboardEvent) => void;
  childCol?: string;
  chiCol?: string;
  height?: string; // 🔹 new for dropdown height
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
  isSearchingLoader = false,
  pgNo,
  formData,
  onMenuScroll = () => console.log("Default"),
  onInputChange,
  col = "col-md-4",
  isTrue = false,
  onKeyDown,
  height = "50vh",
}) => {
  const [copySuccess, setCopySuccess] = useState<string>("");

  return (
    <div className={`${col} mt-3`}>
      <div className="form-group">
        {/* label */}
        <label
          htmlFor={name}
          className="form-label fw-semibold"
          style={{ fontSize: "14px" }}
        >
          {label}
          {required && <span className="text-danger">*</span>}
        </label>

        <Select
          classNamePrefix="react-select"
          id={name}
          name={name}
          options={options}
          value={options?.find((option) => option.value === value) || null}
          onChange={(selectedOption) =>
            onChange(selectedOption as OptionType | null, name)
          }
          styles={{
            control: (base, state) => ({
              ...base,
              minHeight: 35,      // control ki total height
              height: 30,
              borderWidth: '1px',
              borderColor: error ? 'red' : state.isFocused ? '#2684FF' : '#CED4DA',
              boxShadow: error ? 'none' : state.isFocused ? '0 0 0 1px #2684FF' : 'none',
              "&:hover": {
                borderColor: error ? 'red' : state.isFocused ? '#2684FF' : '#CED4DA',
              },
              borderRadius: "0px",
            }),
            valueContainer: (base) => ({
              ...base,
              height: 30,          // value container height
              padding: '0 8px',    // vertical padding reduce
            }),
            input: (base) => ({
              ...base,
              margin: 0,
              padding: 0,
            }),
            indicatorsContainer: (base) => ({
              ...base,
              height: 30,         // icon container height
            }),
          }}
        />


        {copySuccess && (
          <span className="text-success ms-2">{copySuccess}</span>
        )}

        {error && (
          <span className="text-danger" style={{ fontSize: "12px" }}>
            {error}
          </span>
        )}
      </div>
    </div>
  );
};

export default InputSelectField;
