import React, { useState } from "react";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import SliderForm from "@/components/Form/SliderForm";
import InputFormField from "@/components/Form/InputFormField";
import InputSelectField from "@/components/Form/InputSelectField";
import InputFileField from "@/components/Form/InputFileField";
import { validationRequest, ValidationRules } from "@/utils/validationRequest";
 
interface SchoolFormData {
    id: string;
    name: string;
    code: string;
    address: string;
    city: string;
    state: string;
    country: string;
    pincode: string;
    phone: string;
    email: string;
    principal_name: string;
    established_year: number | string;
    type: string;
    status: string;
    logo?: File | null;
}

// ✅ Errors type (all string messages)
type SchoolFormErrors = {
    [K in keyof SchoolFormData]?: string;
};

interface AddEditFormProps {
    open: boolean;
    onClose: () => void;
    initialData?: SchoolFormData;
    onSuccess: () => void;
}

// ------------------- Field Config -------------------
interface FieldConfig {
    label: string;
    required: boolean;
    minLength?: number;
    maxLength?: number;
}

const fieldConfigs: Record<keyof SchoolFormData, FieldConfig> = {
    id: { required: false, label: "ID" },
    name: { required: false, minLength: 2, maxLength: 50, label: "School Name" },
    code: { required: true, label: "School Code" },
    address: { required: false, label: "Address" },
    city: { required: true, label: "City" },
    state: { required: true, label: "State" },
    country: { required: true, label: "Country" },
    pincode: { required: true, label: "Pincode" },
    phone: { required: true, label: "Phone" },
    email: { required: true, label: "Email" },
    principal_name: { required: false, label: "Principal Name" },
    established_year: { required: false, label: "Established Year" },
    type: { required: true, label: "School Type" },
    status: { required: true, label: "Status" },
    logo: { required: false, label: "School Logo" },
};


// ------------------- Generate Validation Rules -------------------
const validationRules: ValidationRules = Object.keys(fieldConfigs).reduce(
    (rules, key) => {
        const config = fieldConfigs[key as keyof typeof fieldConfigs];
        if (config.required) {
            rules[key as keyof SchoolFormData] = {
                required: true,
                ...(config.minLength ? { minLength: config.minLength } : {}),
                ...(config.maxLength ? { maxLength: config.maxLength } : {}),
            };
        }
        return rules;
    },
    {} as ValidationRules
);

const AddEditForm: React.FC<AddEditFormProps> = ({
    open,
    onClose,
    initialData,
    onSuccess,
}) => {
    // Default form
    const formBody: SchoolFormData = initialData || {
        id: "",
        name: "",
        code: "",
        address: "",
        city: "",
        state: "",
        country: "",
        pincode: "",
        phone: "",
        email: "",
        principal_name: "",
        established_year: "",
        type: "",
        status: "Active",
        logo: null,
    };

    const [formData, setFormData] = useState<SchoolFormData>(formBody);
    const [errors, setErrors] = useState<SchoolFormErrors>({});
    const [preview, setPreview] = useState<string>("");

    // Input field change
    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
        setErrors({ ...errors, [e.target.name]: "" });
    };

    // Select field change
    const handleSelectChange = (selectedOption: any, name: string) => {
        setFormData((prev) => ({ ...prev, [name]: selectedOption?.value || "" }));
        setErrors({ ...errors, [name]: "" });
    };

    // File field change
    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0] || null;
        setFormData((prev) => ({ ...prev, logo: file }));

        if (file) {
            setPreview(URL.createObjectURL(file)); // ✅ preview url string
        } else {
            setPreview("");
        }
        setErrors({ ...errors, logo: "" });
    };

    // Reset form
    const resetForm = () => {
        setFormData(formBody);
        setPreview("");
        setErrors({});
    };

    // Submit
    const handleFormSubmit = async () => {
        const { isValid, errors } = validationRequest(formData, validationRules);
        setErrors(errors);

        if (!isValid) {
            toast.error("Please fill in all mandatory fields.", {
                position: "top-right",
                autoClose: 3000,
            });
            return;
        }

        try {
            // ✅ Convert to FormData for API
            const payload = new FormData();
            Object.keys(formData).forEach((key) => {
                const value = formData[key as keyof SchoolFormData];
                if (value !== null && value !== undefined) {
                    if (key === "logo" && value instanceof File) {
                        payload.append("logo", value);
                    } else {
                        payload.append(key, String(value));
                    }
                }
            });

            // TODO: API call with payload

            toast.success("School details saved successfully!", {
                position: "top-right",
                autoClose: 3000,
            });

            onSuccess();
            resetForm();
            onClose();
        } catch (err: any) {
            toast.error("Unable to save school details.", {
                position: "top-right",
                autoClose: 3000,
            });
        }
    };

    // Dropdown options
    const statusOptions = [
        { value: "Active", label: "Active" },
        { value: "Inactive", label: "Inactive" },
    ];

    const typeOptions = [
        { value: "Private", label: "Private" },
        { value: "Public", label: "Public" },
        { value: "Government", label: "Government" },
    ];

    return (
        <SliderForm
            show={open}
            onClose={() => {
                resetForm();
                onClose();
            }}
            title={formData?.id ? "Edit School Details" : "Add School Details"}
            errors={errors}
            onSubmit={handleFormSubmit}
            onChange={handleChange}
            isSubmitting={false}
        >
            <div className="row">
                {/* Input Fields */}
                <InputFormField
                    label={fieldConfigs.name.label}
                    name="name"
                    inputValue={formData.name}
                    error={errors.name}
                    required={fieldConfigs.name.required}
                    onChange={handleChange}
                />

                <InputFormField
                    label={fieldConfigs.code.label}
                    name="code"
                    inputValue={formData.code}
                    error={errors.code}
                    required={fieldConfigs.code.required}
                    onChange={handleChange}
                />

                <InputFormField
                    label={fieldConfigs.address.label}
                    name="address"
                    inputValue={formData.address}
                    error={errors.address}
                    required={fieldConfigs.address.required}
                    onChange={handleChange}
                />

                <InputFormField
                    label={fieldConfigs.city.label}
                    name="city"
                    inputValue={formData.city}
                    error={errors.city}
                    required={fieldConfigs.city.required}
                    onChange={handleChange}
                />

                <InputFormField
                    label={fieldConfigs.state.label}
                    name="state"
                    inputValue={formData.state}
                    error={errors.state}
                    required={fieldConfigs.state.required}
                    onChange={handleChange}
                />

                <InputFormField
                    label={fieldConfigs.country.label}
                    name="country"
                    inputValue={formData.country}
                    error={errors.country}
                    required={fieldConfigs.country.required}
                    onChange={handleChange}
                />

                <InputFormField
                    label={fieldConfigs.pincode.label}
                    name="pincode"
                    type="number"
                    inputValue={formData.pincode}
                    error={errors.pincode}
                    required={fieldConfigs.pincode.required}
                    onChange={handleChange}
                />

                <InputFormField
                    label={fieldConfigs.phone.label}
                    name="phone"
                    inputValue={formData.phone}
                    error={errors.phone}
                    required={fieldConfigs.phone.required}
                    onChange={handleChange}
                />

                <InputFormField
                    label={fieldConfigs.email.label}
                    name="email"
                    type="email"
                    inputValue={formData.email}
                    error={errors.email}
                    required={fieldConfigs.email.required}
                    onChange={handleChange}
                />

                <InputFormField
                    label={fieldConfigs.principal_name.label}
                    name="principal_name"
                    inputValue={formData.principal_name}
                    error={errors.principal_name}
                    required={fieldConfigs.principal_name.required}
                    onChange={handleChange}
                />

                {/* Dropdowns */}
                <InputSelectField
                    name="type"
                    label={fieldConfigs.type.label}
                    options={typeOptions}
                    value={formData.type}
                    onChange={handleSelectChange}
                    isEdit={true}
                    error={errors.type}
                    required={fieldConfigs.type.required}
                />

                <InputSelectField
                    name="status"
                    label={fieldConfigs.status.label}
                    options={statusOptions}
                    value={formData.status}
                    onChange={handleSelectChange}
                    isEdit={true}
                    error={errors.status}
                    required={fieldConfigs.status.required}
                />

                {/* ✅ School Logo Upload */}
                <InputFileField
                    label={fieldConfigs.logo.label}
                    name="logo"
                    accept="image/*"
                    onChange={handleFileChange}
                    error={errors.logo}
                />

                {preview && (
                    <div className="col-md-3 mt-3">
                        <div className="position-relative d-inline-block">
                            <img
                                src={preview}
                                alt="Logo Preview"
                                className="img-thumbnail"
                                style={{ maxWidth: "120px" }}
                            />
                            <button
                                type="button"
                                className="btn btn-sm btn-danger position-absolute top-0 end-0"
                                onClick={() => {
                                    setFormData((prev) => ({ ...prev, logo: null }));
                                    setPreview("");
                                }}
                            >
                                ✕
                            </button>
                        </div>
                    </div>
                )}
            </div>
        </SliderForm>
    );
};

export default AddEditForm;
