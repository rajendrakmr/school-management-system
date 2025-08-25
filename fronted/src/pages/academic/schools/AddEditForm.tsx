import React, { useEffect, useState, useRef } from "react";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import SliderForm from "@/components/Form/SliderForm";
import InputFormField from "@/components/Form/InputFormField";
import InputSelectField from "@/components/Form/InputSelectField";
import InputFileField from "@/components/Form/InputFileField";
import { validationRequest, ValidationRules } from "@/utils/validationRequest";
import { useUpdateSchoolMutation } from "@/store/slice/school";

interface SchoolFormData {
  trn_school_id: string;
  school_name: string;
  school_code: string;
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
  is_active: string;
  logo?: File | null;
  image_path?: string;
}

type SchoolFormErrors = {
  [K in keyof SchoolFormData]?: string;
};

interface AddEditFormProps {
  open: boolean;
  onClose: () => void;
  initialData?: SchoolFormData;
  onSuccess: () => void;
}

interface FieldConfig {
  label: string;
  required: boolean;
  minLength?: number;
  maxLength?: number;
}

const fieldConfigs: Record<keyof SchoolFormData, FieldConfig> = {
  trn_school_id: { required: false, label: "ID" },
  school_name: { required: true, minLength: 2, maxLength: 50, label: "School Name" },
  school_code: { required: true, label: "School Code" },
  email: { required: true, label: "Email" },
  principal_name: { required: true, label: "Principal Name" },
  address: { required: false, label: "Address" },
  city: { required: false, label: "City" },
  state: { required: false, label: "State" },
  country: { required: false, label: "Country" },
  pincode: { required: false, label: "Pincode" },
  phone: { required: true, label: "Phone" },
  established_year: { required: false, label: "Established Year" },
  type: { required: false, label: "School Type" },
  is_active: { required: false, label: "Status" },
  logo: { required: false, label: "School Logo" },
  image_path: { required: false, label: "School Logo" },
};

// ------------------- Validation Rules -------------------
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

const AddEditForm: React.FC<AddEditFormProps> = ({ open, onClose, initialData, onSuccess }) => {
  const defaultForm: SchoolFormData = {
    trn_school_id: "",
    school_name: "",
    school_code: "",
    address: "",
    city: "",
    state: "",
    country: "",
    pincode: "",
    phone: "",
    email: "",
    principal_name: "",
    established_year: "2021",
    type: "",
    is_active: "Y",
    logo: null,
    image_path: "",
  };

  const [formData, setFormData] = useState<SchoolFormData>(defaultForm);
  const [errors, setErrors] = useState<SchoolFormErrors>({});
  const [preview, setPreview] = useState<string>("");
  const timeoutRef = useRef<number | null>(null);
  const [updateSchool, { isLoading }] = useUpdateSchoolMutation();

  // Input change
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
    setErrors({ ...errors, [e.target.name]: "" });
  };

  // Dropdown change
  const handleSelectChange = (selectedOption: any, name: string) => {
    setFormData((prev) => ({ ...prev, [name]: selectedOption?.value || "" }));
    setErrors({ ...errors, [name]: "" });
  };

  // File change
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0] || null;
    if (file) {
      setFormData((prev) => ({ ...prev, logo: file }));
      setPreview(URL.createObjectURL(file));
    } else {
      setFormData((prev) => ({ ...prev, logo: null }));
      setPreview("");
    }
    setErrors({ ...errors, logo: "" });
  };

  // Reset form
  const resetForm = () => {
    setFormData(defaultForm);
    setPreview("");
    setErrors({});
  };

  // Submit form
  const handleFormSubmit = async () => {
    const { isValid, errors } = validationRequest(formData, validationRules);
    setErrors(errors);

    if (!isValid) {
      toast.error("Please fill in all mandatory fields.", { autoClose: 3000, position: "top-right" });
      return;
    }

    try {
      const formPayload = new FormData();
      Object.entries(formData).forEach(([key, value]) => {
        if (key === "logo" && value instanceof File) {
          formPayload.append("logo", value);
        } else if (value !== undefined && value !== null && value !== "") {
          formPayload.append(key, String(value));
        }
      });

      const response = await updateSchool({
        id: formData.trn_school_id,
        schoolData: formPayload,
      }).unwrap();

      toast.success(response.message || "School details saved successfully!", { autoClose: 3000, position: "top-right" });

      resetForm();
      onSuccess();
      timeoutRef.current = window.setTimeout(() => onClose(), 2000);
    } catch (err: any) {
        console.log('errerrerr',err)
      if (err?.data?.errors) {
        setErrors(err.data.errors);
        toast.error("Please fix the highlighted errors.", { autoClose: 3000, position: "top-right" });
      } else {
        toast.error(err?.data?.message || "Unable to save school details.", { autoClose: 3000, position: "top-right" });
      }
    }
  };

  // Cleanup timeout
  useEffect(() => {
    return () => {
      if (timeoutRef.current) clearTimeout(timeoutRef.current);
    };
  }, []);

  // Load initial data
  useEffect(() => {
    if (initialData) {
      setFormData(initialData);
      if (initialData.image_path) {
        setPreview(`http://localhost:5000${initialData.image_path}`);
      } else {
        setPreview("");
      }
    }
  }, [initialData]);

  // Dropdown options
  const statusOptions = [
    { value: "Y", label: "Active" },
    { value: "N", label: "Inactive" },
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
      title={formData?.trn_school_id ? "Edit School Details" : "Add School Details"}
      errors={errors}
      onSubmit={handleFormSubmit}
      onChange={handleChange}
      isSubmitting={isLoading}
    >
      <div className="row">
        {/* Input fields */}
        <InputFormField label={fieldConfigs.principal_name.label} name="principal_name" inputValue={formData.principal_name} error={errors.principal_name} required={fieldConfigs.principal_name.required} onChange={handleChange} />
        <InputFormField label={fieldConfigs.email.label} name="email" type="email" inputValue={formData.email} error={errors.email} required={fieldConfigs.email.required} onChange={handleChange} />
        <InputFormField label={fieldConfigs.school_name.label} name="school_name" inputValue={formData.school_name} error={errors.school_name} required={fieldConfigs.school_name.required} onChange={handleChange} />
        <InputFormField label={fieldConfigs.school_code.label} name="school_code" inputValue={formData.school_code} error={errors.school_code} required={fieldConfigs.school_code.required} onChange={handleChange} />
        <InputFormField label={fieldConfigs.address.label} name="address" inputValue={formData.address} error={errors.address} required={fieldConfigs.address.required} onChange={handleChange} />
        <InputFormField label={fieldConfigs.city.label} name="city" inputValue={formData.city} error={errors.city} required={fieldConfigs.city.required} onChange={handleChange} />
        <InputFormField label={fieldConfigs.state.label} name="state" inputValue={formData.state} error={errors.state} required={fieldConfigs.state.required} onChange={handleChange} />
        <InputFormField label={fieldConfigs.country.label} name="country" inputValue={formData.country} error={errors.country} required={fieldConfigs.country.required} onChange={handleChange} />
        <InputFormField label={fieldConfigs.pincode.label} name="pincode" type="number" inputValue={formData.pincode} error={errors.pincode} required={fieldConfigs.pincode.required} onChange={handleChange} />
        <InputFormField label={fieldConfigs.phone.label} name="phone" inputValue={formData.phone} error={errors.phone} required={fieldConfigs.phone.required} onChange={handleChange} />

        {/* Dropdowns */}
        <InputSelectField name="type" label={fieldConfigs.type.label} options={typeOptions} value={formData.type} onChange={handleSelectChange} isEdit={false} error={errors.type} required={fieldConfigs.type.required} />
        <InputSelectField name="is_active" label={fieldConfigs.is_active.label} options={statusOptions} value={formData.is_active} onChange={handleSelectChange} isEdit={false} error={errors.is_active} required={fieldConfigs.is_active.required} />

        {/* File input */}
        <InputFileField label={fieldConfigs.logo.label} name="logo" accept="image/*" onChange={handleFileChange} error={errors.logo} />

        {/* Logo Preview */}
        <div className="col-md-3 mt-3">
          <div className="position-relative d-inline-block">
            {preview ? (
              <>
                <img src={preview} alt="School Logo" className="img-thumbnail" style={{ width: "90px", height: "90px", borderRadius: "50px", border: "1px solid #ccc", objectFit: "cover" }} />
                <button
                  type="button"
                  className="btn btn-sm btn-danger position-absolute top-0 end-0"
                  onClick={() => {
                    setFormData((prev) => ({ ...prev, logo: null, image_path: "" }));
                    setPreview("");
                  }}
                >
                  ✕
                </button>
              </>
            ) : (
              <div style={{ width: "90px", height: "90px", borderRadius: "50px", border: "1px solid #ccc", backgroundColor: "#f0f0f0", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "12px", color: "#999" }}>
                No Logo
              </div>
            )}
          </div>
        </div>
      </div>
    </SliderForm>
  );
};

export default AddEditForm;
