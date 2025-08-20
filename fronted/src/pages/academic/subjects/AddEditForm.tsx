import React, { useEffect, useState, useRef } from "react";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import SliderForm from "@/components/Form/SliderForm";
import InputFormField from "@/components/Form/InputFormField";
import InputSelectField from "@/components/Form/InputSelectField";
import { validationRequest, ValidationRules } from "@/utils/validationRequest";
import { useSaveSubjectMutation } from "@/store/slice/academics/subjects";
import InputRadioField from "@/components/Form/InputRadioField";
import { useMediumsQuery } from "@/store/slice/dropdown";
import InputFileField from "@/components/Form/InputFileField";

interface FormRecordItem {
    mst_medium_id: number;
    mst_subject_id: string;
    name: string;
    code: string;
    type: string;
    image?: File | null;
    image_path?: string;
    is_active: string;
}

type FormErrors = {
    [K in keyof FormRecordItem]?: string;
};

interface AddEditFormProps {
    open: boolean;
    isEdit: boolean;
    onClose: () => void;
    initialData?: FormRecordItem;
    onSuccess: () => void;
    setIsEditForm: React.Dispatch<React.SetStateAction<boolean>>;
}

// ------------------- Field Config -------------------
interface FieldConfig {
    label: string;
    required: boolean;
    minLength?: number;
    maxLength?: number;
}

const fieldConfigs: Record<keyof FormRecordItem, FieldConfig> = {
    mst_medium_id: { required: true, label: "Medium" },
    mst_subject_id: { required: false, label: "ID" },
    name: { required: true, minLength: 2, maxLength: 50, label: "Subject Name" },
    type: { required: true, label: "Type" },
    code: { required: false, label: "Subject Code" },
    image: { required: false, label: "Image" },
    image_path: { required: false, label: "Image" },
    is_active: { required: false, label: "Status" },
};

// ------------------- Generate Validation Rules -------------------
const validationRules: ValidationRules = Object.keys(fieldConfigs).reduce(
    (rules, key) => {
        const config = fieldConfigs[key as keyof typeof fieldConfigs];
        if (config.required) {
            rules[key as keyof FormRecordItem] = {
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
    isEdit,
    onSuccess,
    setIsEditForm,
}) => {
    const initialKey: FormRecordItem = {
        mst_subject_id: "",
        mst_medium_id: 0,
        name: "",
        type: "",
        code: "",
        image_path: "",
        is_active: "Y",
    };
    const formBody: FormRecordItem = initialData || initialKey;

    const [formData, setFormData] = useState<FormRecordItem>(formBody);
    const [errors, setErrors] = useState<FormErrors>({});
    const [preview, setPreview] = useState<string>("");

    const timeoutRef = useRef<number | null>(null);
    const [saveSubject, { isLoading }] = useSaveSubjectMutation();
    const { data: mediumsOptions } = useMediumsQuery({ refetchOnMountOrArgChange: true });

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
        setErrors((prev) => ({ ...prev, [e.target.name]: "" }));
    };

    const handleSelectChange = (selectedOption: any, name: string) => {
        setFormData((prev) => ({ ...prev, [name]: selectedOption?.value || "" }));
        setErrors((prev) => ({ ...prev, [name]: "" }));
    };

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0] || null;
        setFormData((prev) => ({ ...prev, image: file }));
        setPreview(file ? URL.createObjectURL(file) : "");
        setErrors((prev) => ({ ...prev, image: "" }));
    };

    const resetForm = () => {
        setFormData(formBody);
        setErrors({});
        setPreview("");
    };

    const handleFormSubmit = async () => {
        const { isValid, errors } = validationRequest(formData, validationRules);
        setErrors(errors);

        if (!isValid) {
            toast.error("Please fill in all mandatory fields.");
            return;
        }

        try {
            const formPayload = new FormData();
            Object.entries(formData).forEach(([key, value]) => {
                if (value !== undefined && value !== null) {
                    if (key === "image" && value instanceof File) {
                        formPayload.append("image", value);
                    } else {
                        formPayload.append(key, String(value));
                    }
                }
            });

            // Pass FormData directly
            const response = await saveSubject(formPayload).unwrap();

            toast.success(response.message || "Data saved successfully!");
            onSuccess();
            resetForm();
            timeoutRef.current = window.setTimeout(onClose, 1000);
        } catch (err: any) {
            console.error(err);
            if (err?.data?.errors) setErrors(err.data.errors);
            toast.error(err?.data?.message ?? "Unable to save subject details");
        }
    };

    useEffect(() => {
        if (initialData) setFormData(initialData);
        return () => timeoutRef.current && clearTimeout(timeoutRef.current);
    }, [initialData]);

    const statusOptions = [
        { value: "Y", label: "Active" },
        { value: "N", label: "Inactive" },
    ];
    const typOptions = [
        { value: "theory", label: "Theory" },
        { value: "practical", label: "Practical" },
    ];

    const renderImage = (src: string) => (
        <img
            style={{
                width: "90px",
                height: "90px",
                borderRadius: "50px",
                border: "1px solid #ccc",
                objectFit: "cover",
            }}
            src={`http://localhost:5000/uploads${src}`}
            alt="School Logo"
            onError={(e) => { (e.target as HTMLImageElement).src = "https://via.placeholder.com/90?text=No+Logo"; }}
        />
    );

    return (
        <SliderForm
            show={open}
            onClose={() => { resetForm(); onClose(); }}
            title={isEdit ? "Edit Subject" : "Add Subject"}
            errors={errors}
            onSubmit={handleFormSubmit}
            onChange={handleChange}
            isSubmitting={isLoading}
        >
            <span className="text-danger">Note: Subject Name, Code & Type should be unique for Medium</span>
            <div className="row">
                <InputRadioField
                    label={fieldConfigs.mst_medium_id.label}
                    name="mst_medium_id"
                    options={mediumsOptions}
                    error={errors.mst_medium_id}
                    selectedValue={formData.mst_medium_id}
                    onChange={handleChange}
                    required={fieldConfigs.mst_medium_id.required}
                    col="col-md-12"
                />
                <InputFormField
                    label={fieldConfigs.name.label}
                    name="name"
                    inputValue={formData.name}
                    error={errors.name}
                    required={fieldConfigs.name.required}
                    onChange={handleChange}
                    col="col-md-4"
                />
                <InputFormField
                    label={fieldConfigs.code.label}
                    name="code"
                    inputValue={formData.code}
                    error={errors.code}
                    required={fieldConfigs.code.required}
                    onChange={handleChange}
                    col="col-md-4"
                />
                <InputRadioField
                    label={fieldConfigs.type.label}
                    name="type"
                    options={typOptions}
                    error={errors.type}
                    selectedValue={formData.type}
                    onChange={handleChange}
                    required={fieldConfigs.type.required}
                    col="col-md-12"
                />
                <InputFileField
                    label={fieldConfigs.image.label}
                    name="image"
                    accept="image/*"
                    onChange={handleFileChange}
                    error={errors.image}
                    col="col-md-7"
                />
                {preview ? (
                    <div className="col-md-3 mt-3">
                        <div className="position-relative d-inline-block">
                            <img src={preview} alt="Logo Preview" className="img-thumbnail"
                                style={{ width: "90px", height: "90px", borderRadius: "50px", border: "1px solid #ccc", objectFit: "cover" }} />
                            <button
                                type="button"
                                className="btn btn-sm btn-danger position-absolute top-0 end-0"
                                onClick={() => { setFormData(prev => ({ ...prev, image: null, image_path: "" })); setPreview(""); }}
                            >✕</button>
                        </div>
                    </div>
                ) : formData.image_path ? (
                    <div className="col-md-3 mt-3">
                        <div className="position-relative d-inline-block">
                            {renderImage(formData.image_path)}
                            <button
                                type="button"
                                className="btn btn-sm btn-danger position-absolute top-0 end-0"
                                onClick={() => setFormData(prev => ({ ...prev, image: null, image_path: "" }))}
                            >✕</button>
                        </div>
                    </div>
                ) : (
                    <div className="col-md-3 mt-3">
                        <div style={{ width: "90px", height: "90px", borderRadius: "50px", border: "1px solid #ccc", backgroundColor: "#f0f0f0", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "12px", color: "#999" }}>No Logo</div>
                    </div>
                )}
                <InputSelectField
                    name="is_active"
                    label={fieldConfigs.is_active.label}
                    options={statusOptions}
                    value={formData.is_active}
                    onChange={handleSelectChange}
                    isEdit={true}
                    error={errors.is_active}
                    required={fieldConfigs.is_active.required}
                />
            </div>
        </SliderForm>
    );
};

export default AddEditForm;
