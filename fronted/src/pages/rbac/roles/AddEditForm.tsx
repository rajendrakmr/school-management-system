import React, { useEffect, useState, useRef } from "react";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import SliderForm from "@/components/Form/SliderForm";
import InputRowFormField from "@/components/Form/InputRowFormField";
import InputSelectField from "@/components/Form/InputSelectField";
import InputFormField from "@/components/Form/InputFormField";
import { validationRequest, ValidationRules } from "@/utils/validationRequest";
import { useSaveRoleMutation } from "@/store/slice/role";

interface FormRecordItem {
    mst_role_id?: number;
    role_name: string;
    role_description: string;
    isActive: string;
}

type SchoolFormErrors = {
    [K in keyof FormRecordItem]?: string;
};

interface AddEditFormProps {
    open: boolean;
    onClose: () => void;
    initialData?: FormRecordItem;
    onSuccess: () => void;
    isEdit: boolean;
    setIsEditForm?: React.Dispatch<React.SetStateAction<boolean>>;
}

interface FieldConfig {
    label: string;
    required: boolean;
    minLength?: number;
    maxLength?: number;
}

const fieldConfigs: Record<keyof FormRecordItem, FieldConfig> = {
    mst_role_id: { required: false, label: "ID" },
    role_name: { required: true, minLength: 3, maxLength: 50, label: "Role Name" },
    role_description: { required: false, label: "Description" },
    isActive: { required: false, label: "Status" },
};

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

const AddEditForm: React.FC<AddEditFormProps> = ({ open, onClose, initialData, onSuccess,isEdit,setIsEditForm }) => {
    
   const initialKey: FormRecordItem = {
         role_name: "",
        role_description: "",
        isActive: "Y",
    };

    const formBody: FormRecordItem = initialData || initialKey;
    const [formData, setFormData] = useState<FormRecordItem>(formBody);
    const [errors, setErrors] = useState<SchoolFormErrors>({});

    const [saveRole, { isLoading: isLoading }] = useSaveRoleMutation();
    // const [updateRole, { isLoading: isUpdating }] = useUpdateRoleMutation();

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target;
        setFormData((prev) => ({ ...prev, [name]: value }));
        setErrors((prev) => ({ ...prev, [name]: "" }));
    };

    const handleSelectChange = (selectedOption: any, name: string) => {
        setFormData((prev) => ({ ...prev, [name]: selectedOption?.value || "" }));
        setErrors((prev) => ({ ...prev, [name]: "" }));
    };

    const resetForm = () => {
        setFormData(formBody);
        setErrors({});
    };
    const timeoutRef = useRef<number | null>(null);

    const handleFormSubmit = async () => {
        const { isValid, errors } = validationRequest(formData, validationRules);
        setErrors(errors);

        if (!isValid) {
            toast.error("Please fill in all mandatory fields.", { autoClose: 3000, position: "top-right" });
            return;
        }

        try {
            const response = await saveRole(formData).unwrap();
            toast.success(response.message || "Role details saved successfully!", { autoClose: 3000, position: "top-right" });
            onSuccess();
            resetForm();
            timeoutRef.current = window.setTimeout(() => {
                onClose();
            }, 2000);

        } catch (err: any) {
            if (err?.data?.errors) {
                setErrors(err.data.errors);  // <-- Set form errors here
                toast.error("Please fix the highlighted errors.", { autoClose: 3000, position: "top-right" });
            } else {
                toast.error(err?.data?.message || "Unable to save role details.", { autoClose: 3000, position: "top-right" });
            }
        } finally {
            // optional cleanup here
        }
    };

    useEffect(() => {
        return () => {
            if (timeoutRef.current) {
                clearTimeout(timeoutRef.current);
            }
        };
    }, []);

    const statusOptions = [
        { value: "Y", label: "Active" },
        { value: "N", label: "In Active" },
    ];

    return (
        <SliderForm
            show={open}
            onClose={() => {
                resetForm();
                setIsEditForm(false)
                onClose();
            }}
            title={formData.mst_role_id ? "Edit Role Details" : "Add Role Details"}
            errors={errors}
            onSubmit={handleFormSubmit}
            onChange={handleChange}
            isSubmitting={isLoading}
        >
            <InputFormField
                label={fieldConfigs.role_name.label}
                name="role_name"
                inputValue={formData.role_name}
                error={errors.role_name}
                required={fieldConfigs.role_name.required}
                onChange={handleChange}
            />

            <InputRowFormField
                label={fieldConfigs.role_description.label}
                type="textarea"
                name="role_description"
                inputValue={formData.role_description}
                required={fieldConfigs.role_description.required}
                onChange={handleChange}
                placeholder="Enter description"
                rows={4}
                col="col-md-6"
            />

           {isEdit && 
            <InputSelectField
                name="isActive"
                label={fieldConfigs.isActive.label}
                options={statusOptions}
                value={formData.isActive}
                onChange={handleSelectChange}
                isEdit={true}
                error={errors.isActive}
                required={fieldConfigs.isActive.required}
            />}
        </SliderForm>
    );
};

export default AddEditForm;
