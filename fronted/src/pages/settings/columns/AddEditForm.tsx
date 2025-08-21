import React, { useState, useEffect, useRef } from "react";
import { toast } from "react-toastify";
import SliderForm from "@/components/Form/SliderForm";
import InputColFormField from "@/components/Form/InputColFormField";
import InputColSelectField from "@/components/Form/InputColSelectField";
import { ValidationRules } from "@/utils/validationRequest";
import { useSaveColumnMutation } from "@/store/slice/columns";


interface ColumnConfig {
    key_type: string;
    column_key: string;
    column_label: string;
    required?: boolean;
    minLength?: number;
    maxLength?: number;
    is_active?: string;
}

const fieldConfigs: ColumnConfig[] = [
    { key_type: "policies", column_key: "first_name", column_label: "Name", required: true, minLength: 2 },
    { key_type: "policies", column_key: "email", column_label: "Email", required: true },
    { key_type: "policies", column_key: "role_names", column_label: "Roles", required: true },
    { key_type: "policies", column_key: "is_active", column_label: "Status", is_active: "N" },
    { key_type: "policies", column_key: "action", column_label: "Action" },
    { key_type: "policies", column_key: "page_size", column_label: "Page Size" },
];
type FormRow = {
    [key: string]: any;
};
// Create blank row with defaults
const blankRow: FormRow = fieldConfigs.reduce((acc, col) => {
    acc[col.column_key] = col.is_active ?? "";
    return acc;
}, {} as FormRow);
type FormValues = {
    [key: string]: any[];
};

type FormErrors = {
    [key: string]: string[];
};

// Initialize form values with at least 1 row per column
const blankValues: FormValues = fieldConfigs.reduce((acc, col) => {
    acc[col.column_key] = [col.is_active ?? ""];
    return acc;
}, {} as FormValues);

const validationRules: ValidationRules = fieldConfigs.reduce((rules, field) => {
    if (field.required) {
        rules[field.column_key] = {
            required: true,
            ...(field.minLength ? { minLength: field.minLength } : {}),
            ...(field.maxLength ? { maxLength: field.maxLength } : {}),
        };
    }
    return rules;
}, {} as ValidationRules);
const AddEditForm: React.FC<any> = ({ setFormData, open, onClose, onSuccess, initialData }) => {
    const [formValues, setFormValues] = useState<FormRow[]>([]);
    const [errors, setErrors] = useState<FormErrors>({});

    useEffect(() => {
        if (initialData && initialData.length > 0) {
            setFormValues(initialData);
        } else {
            setFormValues([{ ...blankRow }]);
        }
    }, [initialData]);

    const handleChange = (rowIndex: number, field: string, value: any) => {
        setFormValues(prev =>
            prev.map((row, i) => (i === rowIndex ? { ...row, [field]: value } : row))
        );

        setErrors(prev => ({
            ...prev,
            [rowIndex]: { ...(prev[rowIndex] || {}), [field]: "" }
        }));
    };

    const addRow = () => {
        setFormValues(prev => [...prev, { ...blankRow }]);
    };

    const removeRow = (index: number) => {
        setFormValues(prev => prev.filter((_, i) => i !== index));

        setErrors(prev => {
            const updated = { ...prev };
            delete updated[index];
            return updated;
        });
    };
    const columns = [
        { key: "key_type", label: "Key Type", type: "string" },
        { key: "column_key", label: "Field Key", type: "string" },
        { key: "column_label", label: "Display Label", type: "string" },
        { key: "column_order", label: "Display Order" },
        // { key: "page_size", label: "Page Size" },         
        { key: "is_active", label: "Visible" },
    ];

    const timeoutRef = useRef<number | null>(null);
    const [saveColumn, { isLoading: isLoading }] = useSaveColumnMutation();

    const handleFormSubmit = async () => {
        try {

            const response = await saveColumn(formValues).unwrap();
            toast.success(response.message || "Data saved successfully!", { autoClose: 3000, position: "top-right" });
            onSuccess();
            timeoutRef.current = window.setTimeout(() => {
                onClose();
            }, 2000);

        } catch (err: any) {
            toast.error(err?.error || "Unable to create  details.", { autoClose: 3000, position: "top-right" });
        }
    };
    useEffect(() => {
        return () => {
            if (timeoutRef.current) {
                clearTimeout(timeoutRef.current);
            }
        };
    }, []);

    return (
        <SliderForm
            show={open}
            onClose={onClose}
            title="Add / Edit Columns" 
            onSubmit={handleFormSubmit}
            isSubmitting={isLoading} 
        >
            <div className="table-responsive">
                <table className="table table-bordered align-middle">
                    <thead className="table-light">
                        <tr>
                            {["key_type", "column_key", "column_label", "column_order", "column_visible"].map(col => (
                                <th key={col} className="text-center">{col.replace("_", " ")}</th>
                            ))}
                            <th className="text-center">Action</th>
                        </tr>
                    </thead>

                    <tbody>
                        {formValues.map((row, rowIndex) => (
                            <tr key={rowIndex}>
                                {columns.map(field => (
                                    <td key={field.key}>
                                        {field.key === "is_active" ? (
                                            <InputColSelectField
                                                name={field.key}
                                                label=""
                                                options={[
                                                    { value: "Y", label: "Yes" },
                                                    { value: "N", label: "No" },
                                                ]}
                                                value={row[field.key]}
                                                onChange={opt => handleChange(rowIndex, field.key, opt?.value)}
                                            />
                                        ) : (
                                            <InputColFormField
                                                label=""
                                                name={field.key}
                                                inputValue={row[field.key]}
                                                error={errors[rowIndex]?.[field.key]}
                                                onChange={e => handleChange(rowIndex, field.key, e.target.value)}
                                            />
                                        )}
                                    </td>
                                ))}

                                <td className="text-center">
                                    {formValues.length > 1 && (
                                        <button
                                            type="button"
                                            className="btn btn-sm btn-danger"
                                            onClick={() => removeRow(rowIndex)}
                                        >
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
