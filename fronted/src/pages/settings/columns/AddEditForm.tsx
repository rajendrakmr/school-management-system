import React, { useState, useEffect, useRef, useCallback } from "react";
import { toast } from "react-toastify";
import SliderForm from "@/components/Form/SliderForm";
import InputColFormField from "@/components/Form/InputColFormField";
import InputColSelectField from "@/components/Form/InputColSelectField";
import { useSaveColumnMutation } from "@/store/slice/columns";
import InputFormField from "@/components/InputFormField";

interface ColumnConfig {
  message?: string;
  column_key: string;
  required?: boolean;
  minLength?: number;
  maxLength?: number;
  is_active?: string;
}

const fieldConfigs: ColumnConfig[] = [
  { message: "column key must match with db field.", column_key: "column_key", required: true, minLength: 2 },
  { message: "column label is display field.", column_key: "column_label", required: true },
  { message: "column order is sequence of column.", column_key: "column_order", required: true },
  { message: "", column_key: "is_active", is_active: "Y" },
  { message: "", column_key: "is_admin_only", is_active: "N" },
];

// Default blank row
const blankRow = fieldConfigs.reduce((acc, col) => {
  acc[col.column_key] = col.is_active ?? "";
  return acc;
}, {} as Record<string, any>);

// Validation rules
const validationRules = fieldConfigs.reduce((rules, f) => {
  if (f.required) {
    rules[f.column_key] = {
      required: true,
      ...(f.minLength && { minLength: f.minLength }),
      ...(f.maxLength && { maxLength: f.maxLength }),
    };
  }
  return rules;
}, {} as Record<string, { required?: boolean; minLength?: number; maxLength?: number }>);

const columns = [
  { key: "column_key", label: "Field Key", type: "text" },
  { key: "column_label", label: "Display Label", type: "text" },
  { key: "column_order", label: "Display Order", type: "text" },
  {
    key: "is_active",
    label: "Visible",
    type: "select",
    options: [
      { value: "Y", label: "Yes" },
      { value: "N", label: "No" },
    ],
  },
  {
    key: "is_admin_only",
    label: "Who can access?",
    type: "select",
    options: [
      { value: "Y", label: "Only Admin" },
      { value: "N", label: "For All" },
    ],
  },
];

const AddEditForm: React.FC<any> = ({ open, onClose, onSuccess, initialData }) => {
  const [inputForm, setInputForm] = useState<{ name: string; size: number | "" }>({ name: "", size: "" });
  const [formValues, setFormValues] = useState<Record<string, any>[]>([]);
  const [errors, setErrors] = useState<Record<string, any>>({});
  const timeoutRef = useRef<number | null>(null);
  const [saveColumn, { isLoading }] = useSaveColumnMutation();

  // Initialize form
  useEffect(() => {
    if (initialData?.columns?.length) {
      setFormValues(initialData.columns);
      setInputForm({ name: initialData?.page || "", size: initialData?.size || "" });
    } else {
      setFormValues([{ ...blankRow }]);
      setInputForm({ name: "", size: "" });
    }
  }, [initialData]);

  // Handle input (page + size)
  const handleInputChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setInputForm((prev) => ({
      ...prev,
      [name]: name === "size" ? (value === "" ? "" : Number(value)) : value.toLowerCase(),
    }));
    setErrors((prev) => ({ ...prev, [name]: "" }));
  }, []);

  // Handle row field change
  const handleChange = (rowIndex: number, field: string, value: any) => {
    setFormValues((prev) =>
      prev.map((row, i) => (i === rowIndex ? { ...row, [field]: value } : row))
    );
    setErrors((prev) => ({ ...prev, [`${rowIndex}-${field}`]: "" }));
  };

  // Add/remove rows
  const addRow = () => setFormValues((prev) => [...prev, { ...blankRow }]);
  const removeRow = (index: number) => setFormValues((prev) => prev.filter((_, i) => i !== index));

  // Format field key for error messages
  const formatLabel = (key: string) =>
    key.replace(/_/g, " ").replace(/\b\w/g, (c) => c.toUpperCase());

  // Validate form
  const validateForm = (): boolean => {
    let valid = true;
    const newErrors: Record<string, string> = {};

    // Page validation
    if (!inputForm.name.trim()) {
      newErrors["name"] = "Page name is required.";
      valid = false;
    }
    if (!inputForm.size || inputForm.size <= 0) {
      newErrors["size"] = "Items per page must be greater than 0.";
      valid = false;
    }

    // Row validation
    formValues.forEach((row, rowIndex) => {
      Object.entries(validationRules).forEach(([fieldKey, rules]) => {
        const value = row[fieldKey] || "";
        const label = formatLabel(fieldKey);

        if (rules.required && !value.trim()) {
          newErrors[`${rowIndex}-${fieldKey}`] = `${label} is required.`;
          valid = false;
        }
        if (rules.minLength && value.length < rules.minLength) {
          newErrors[`${rowIndex}-${fieldKey}`] = `${label} must be at least ${rules.minLength} characters.`;
          valid = false;
        }
        if (rules.maxLength && value.length > rules.maxLength) {
          newErrors[`${rowIndex}-${fieldKey}`] = `${label} must be at most ${rules.maxLength} characters.`;
          valid = false;
        }
      });
    });

    setErrors(newErrors);
    return valid;
  };

  const handleFormSubmit = async () => {
    if (!validateForm()) return;  
    try {
      const response = await saveColumn({ name: inputForm.name, size: inputForm.size, columns: formValues }).unwrap();
      toast.success(response.message || "Data saved successfully!", { autoClose: 3000 });
      onSuccess();
      timeoutRef.current = window.setTimeout(onClose, 2000);
    } catch (err: any) {
      toast.error(err?.error || "Unable to create details.", { autoClose: 3000 });
    }
  };

  useEffect(() => () => timeoutRef.current && clearTimeout(timeoutRef.current), []);

  return (
    <SliderForm show={open} onClose={onClose} title="Add / Edit Columns" onSubmit={handleFormSubmit} isSubmitting={isLoading}>
      <div className="">
        <div className="row shadow-lg p-1">
          <InputFormField
            label="Page Type"
            name="name"
            inputValue={inputForm.name}
            error={errors["name"]}
            required
            onChange={handleInputChange}
            placeholder="Enter page type (e.g., sections, classes)"
            col="col-md-6"
            row1="col-sm-3"
            row2="col-sm-6"
          />

          <InputFormField
            label="Items per Page"
            name="size"
            type="number"
            inputValue={inputForm.size}
            error={errors["size"]}
            required
            onChange={handleInputChange}
            placeholder="Enter number of items per page"
            col="col-md-6"
            row1="col-sm-5"
            row2="col-sm-3"
          />
        </div>

        <table className="table table-bordered align-middle mt-3">
          <thead className="table-light">
            <tr>
              {columns.map((col) => (
                <th key={col.key} className="text-center">
                  {col.label}
                </th>
              ))}
              <th className="text-center">Action</th>
            </tr>
          </thead>
          <tbody>
            {formValues.map((row, rowIndex) => (
              <tr key={rowIndex}>
                {columns.map((col) => (
                  <td key={col.key}>
                    {col.type === "select" ? (
                        <InputColSelectField
                        name={col.key}
                        label=""
                        options={col.options || []}
                        value={row[col.key]}
                        error={errors[`${rowIndex}-${col.key}`]}
                        onChange={(opt) => handleChange(rowIndex, col.key, opt?.value)}
                        />
                    ) : (
                      <InputColFormField
                      label=""
                      name={col.key}
                      inputValue={row[col.key]}
                      error={errors[`${rowIndex}-${col.key}`]}
                      onChange={(e) => handleChange(rowIndex, col.key, e.target.value)}
                      />
                    )}
                    <span className="text-danger"> {errors[`${rowIndex}-${col.key}`]}</span>
                  </td>
                ))}
                <td className="text-center">
                  {formValues.length > 1 && (
                    <button type="button" className="btn btn-sm btn-danger" onClick={() => removeRow(rowIndex)}>
                      Remove
                    </button>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="mt-2">
        <button type="button" className="btn btn-sm btn-primary" onClick={addRow}>
          + Add Row
        </button>
      </div>
    </SliderForm>
  );
};

export default AddEditForm;
