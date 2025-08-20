// InputMultiSelectField.tsx
import React from "react";
import Select, { MultiValue } from "react-select";

interface OptionType {
  value: string | number;
  label: string;
}

interface InputMultiSelectFieldProps {
  name: string;
  label: string;
  options: OptionType[];
  value: string[]; // ✅ your form only deals with string[]
  onChange: (value: string[]) => void; // ✅ simplified
  error?: string;
  required?: boolean;
}

const InputMultiSelectField: React.FC<InputMultiSelectFieldProps> = ({
  name,
  label,
  options,
  value,
  onChange,
  error,
  required,
}) => {
  console.log('IIinnnnnnnnnnnnnnnnnnnnnn',value)
  // map string[] → OptionType[]
  const selectedOptions = options?.filter((opt) => value.includes(String(opt.value))  );
console.log('IIinnnnnnnnnnnnnnnnnnnnnn selectedOptions',selectedOptions)
  const handleChange = (selected: MultiValue<OptionType>) => {
    onChange(selected.map((opt) => String(opt.value))); // map back to string[]
  };

  return (
    <div className="mb-4">
      <label htmlFor={name} className="block mb-1 font-medium">
        {label} {required && <span className="text-red-500">*</span>}
      </label>
      <Select
        inputId={name}
        isMulti
        options={options}
        value={selectedOptions}
        onChange={handleChange}
      />
      {error && <p className="text-red-500 text-sm">{error}</p>}
    </div>
  );
};

export default InputMultiSelectField;
