import React, { useEffect, useState, useRef } from "react";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import SliderForm from "@/components/Form/SliderForm";
import InputFormField from "@/components/Form/InputFormField";
import InputSelectField from "@/components/Form/InputSelectField";
import { validationRequest, ValidationRules } from "@/utils/validationRequest";
import { useSavePermissionMutation } from "@/store/slice/permissions";
import InputRowFormField from "@/components/Form/InputRowFormField";
import { useGetModulesQuery } from "@/store/slice/dropdown";

interface FormRecordItem {
    mst_permission_id: string;
     mst_module_id: string;
    permission_name: string;
    permission_description: string;
    path_url: string;
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
    mst_permission_id: { required: false, label: "ID" },
    mst_module_id: { required: true, label: "Module" },
    permission_name: { required: true, minLength: 2, maxLength: 50, label: "Permission Name" },
    permission_description: { required: false, label: "Description" },
    path_url: { required: true, label: "Path URL" },
    is_active: { required: false, label: "Status" }
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
    setIsEditForm
}) => {
    // Default form
    const initialKey = {
        mst_permission_id: "",
        mst_module_id: "",
        permission_name: "",
        permission_description: "",
        path_url: "",
        is_active: "Y",
    };

     const { data: modulesOptions, isFetching } = useGetModulesQuery({ refetchOnMountOrArgChange: true });
  
    const formBody: FormRecordItem = isEdit ? initialKey : initialData || initialKey;

    // const formBody: FormRecordItem = initialData || {
    //     mst_permission_id: "",
    //     permission_name: "",
    //     permission_description: "",
    //     path_url: "",
    //     is_active: "Y",
    // };
    const [formData, setFormData] = useState<FormRecordItem>(formBody);
    const [errors, setErrors] = useState<FormErrors>({});

    // Input field change
    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target;
        setFormData((prev) => ({ ...prev, [name]: value }));
        setErrors((prev) => ({ ...prev, [name]: "" }));
    };
    // Select field change
    const handleSelectChange = (selectedOption: any, name: string) => {
        setFormData((prev) => ({ ...prev, [name]: selectedOption?.value || "" }));
        setErrors({ ...errors, [name]: "" });
    };

    // File field change


    // Reset form
    const resetForm = () => {
        setFormData(formBody);
        setErrors({});
        setIsEditForm(false)
    };



    const timeoutRef = useRef<number | null>(null);
    const [savePermission, { isLoading: isLoading }] = useSavePermissionMutation();

    const handleFormSubmit = async () => {
        const { isValid, errors } = validationRequest(formData, validationRules);
        setErrors(errors);

        if (!isValid) {
            toast.error("Please fill in all mandatory fields.", {
                autoClose: 3000,
                position: "top-right",
            });
            return;
        }

        try {



            const response = await savePermission(formData).unwrap();
            setIsEditForm(false)
            toast.success(response.message || "Record saved successfully!", {
                autoClose: 3000,
                position: "top-right",
            });

            resetForm();
            onSuccess();
            timeoutRef.current = window.setTimeout(() => {
                onClose();
            }, 2000);
        } catch (err: any) {
            console.error("Save School Error:", errors, err);
            if (err?.data?.errors) {
                setErrors(err.data.errors);
                toast.error("Please fix the highlighted errors.", {
                    autoClose: 3000,
                    position: "top-right",
                });
            } else {
                toast.error(err?.data?.message || "Unable to save school details.", {
                    autoClose: 3000,
                    position: "top-right",
                });
            }
        }
    };



    useEffect(() => {
        return () => {
            if (timeoutRef.current) {
                clearTimeout(timeoutRef.current);
            }
        };
    }, []);




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



    useEffect(() => {
        if (initialData) {
            setFormData(initialData);
        }
    }, [initialData]);



    return (
        <SliderForm
            show={open}
            onClose={() => {
                resetForm();
                onClose();
            }}
            title={formData?.mst_permission_id ? "Edit Permission Details" : "Add Permission Details"}
            errors={errors}
            onSubmit={handleFormSubmit}
            onChange={handleChange}
            isSubmitting={isLoading}
        >
              <InputSelectField
                name="mst_module_id"
                label={fieldConfigs.mst_module_id.label}
                options={modulesOptions}
                value={formData.mst_module_id}
                onChange={handleSelectChange}
                isEdit={true}
                error={errors.mst_module_id}
                required={fieldConfigs.mst_module_id.required}
            />
            <InputFormField
                label={fieldConfigs.permission_name.label}
                name="permission_name"
                inputValue={formData.permission_name}
                error={errors.permission_name}
                required={fieldConfigs.permission_name.required}
                onChange={handleChange}
            />

            <InputRowFormField
                label={fieldConfigs.permission_description.label}
                type="textarea"
                name="permission_description"
                inputValue={formData.permission_description}
                required={fieldConfigs.permission_description.required}
                onChange={handleChange}
                placeholder="Enter description"
                rows={4}
                col="col-md-6"
            />

            <InputFormField
                label={fieldConfigs.path_url.label}
                name="path_url"
                inputValue={formData.path_url}
                error={errors.path_url}
                required={fieldConfigs.path_url.required}
                onChange={handleChange}
            />

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

        </SliderForm>
    );
};

export default AddEditForm;