import React, { useEffect, useState, useRef, useCallback, useMemo } from "react";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import SliderForm from "@/components/Form/SliderForm";
import InputFormField from "@/components/Form/InputFormField";
import InputSelectField from "@/components/Form/InputSelectField";
import { validationRequest, ValidationRules } from "@/utils/validationRequest";
import { useSaveFormDataMutation } from "@/store/slice/academics/streams";
import { isActiveOptions } from "@/utils/helper";
import { useUserInfo } from "@/hooks/useUserInfo";
import { useGetBracnhListQuery } from "@/store/slice/dropdown";

interface FormRecordItem {
    trn_school_id?: string;
    mst_stream_id: string;
    name: string;
    code: string;
    is_active: string;
}

type SchoolFormErrors = {
    [K in keyof FormRecordItem]?: string;
};

interface AddEditFormProps {
    open: boolean;
    pagetitle: string;
    isEdit: boolean;
    onClose: () => void;
    initialData?: FormRecordItem;
    onSuccess: () => void;
    setIsEditForm: React.Dispatch<React.SetStateAction<boolean>>;
}



// ------------------- Component -------------------
const AddEditForm: React.FC<AddEditFormProps> = React.memo(
    ({ open, onClose, initialData, isEdit, onSuccess, pagetitle }) => {

        const usersInfo = useUserInfo();
        const { data: branchOptions } = useGetBracnhListQuery({ refetchOnMountOrArgChange: true });

        // ------------------- Field Config -------------------
        const fieldConfigs: Record<keyof FormRecordItem, { label: string; required: boolean; minLength?: number; maxLength?: number }> = {
            trn_school_id: { required: !usersInfo?.trn_school_id, label: "Branch" },
            mst_stream_id: { required: false, label: "ID" },
            name: { required: true, minLength: 2, maxLength: 50, label: "Name" },
            code: { required: false, label: "Code" },
            is_active: { required: false, label: "Status" },
        };

        // ------------------- Validation Rules -------------------
        const validationRules: ValidationRules = Object.keys(fieldConfigs).reduce((rules, key) => {
            const config = fieldConfigs[key as keyof typeof fieldConfigs];
            if (config.required) {
                rules[key as keyof FormRecordItem] = {
                    required: true,
                    ...(config.minLength ? { minLength: config.minLength } : {}),
                    ...(config.maxLength ? { maxLength: config.maxLength } : {}),
                };
            }
            return rules;
        }, {} as ValidationRules);
        const defaultForm: FormRecordItem = useMemo(
            () => ({
                mst_stream_id: "",
                trn_school_id: "",
                name: "",
                code: "",
                is_active: "Y",
            }),
            []
        );
        const initialForm: FormRecordItem = useMemo(
            () => (isEdit ? initialData || defaultForm : defaultForm),
            [isEdit, initialData, defaultForm]
        );

        const [formData, setFormData] = useState<FormRecordItem>(initialForm);

        const [errors, setErrors] = useState<SchoolFormErrors>({});
        const timeoutRef = useRef<number | null>(null);
        const [saveFormData, { isLoading }] = useSaveFormDataMutation();
        useEffect(() => {
            setFormData(initialForm)
        }, [initialForm])

        // Memoized change handlers
        const handleChange = useCallback(
            (e: React.ChangeEvent<HTMLInputElement>) => {
                const { name, value } = e.target;
                setFormData((prev) => ({ ...prev, [name]: value }));
                setErrors((prev) => ({ ...prev, [name]: "" }));
            },
            []
        );

        const handleSelectChange = useCallback((selectedOption: any, name: string) => {
            setFormData((prev) => ({ ...prev, [name]: selectedOption?.value || "" }));
            setErrors((prev) => ({ ...prev, [name]: "" }));
        }, []);

        const resetForm = useCallback(() => {
            setFormData(initialForm);
            setErrors({});
        }, [initialForm]);

        const handleFormSubmit = useCallback(async () => {
            const { isValid, errors } = validationRequest(formData, validationRules);
            setErrors(errors);

            if (!isValid) {
                toast.error("Please fill in all mandatory fields.", { autoClose: 3000, position: "top-right" });
                return;
            }

            try {
                const response = await saveFormData(formData).unwrap();
                toast.success(response.message || "Data saved successfully!", { autoClose: 3000, position: "top-right" });
                onSuccess();
                resetForm();
                timeoutRef.current = window.setTimeout(onClose, 1000);
            } catch (err: any) {
                if (err?.data?.errors) {
                    setErrors(err.data.errors);
                    toast.error("Please fix the highlighted errors.", { autoClose: 3000, position: "top-right" });
                } else {
                    toast.error(err?.data?.message || "Unable to save details.", { autoClose: 3000, position: "top-right" });
                }
            }
        }, [formData, onSuccess, resetForm, onClose,]);



        useEffect(() => {
            return () => {
                if (timeoutRef.current) clearTimeout(timeoutRef.current);
            };
        }, []);



        return (
            <SliderForm
                show={open}
                onClose={() => {
                    resetForm();
                    onClose();
                }}
                title={isEdit ? `Edit ${pagetitle}` : `Add ${pagetitle}`}
                errors={errors}
                onSubmit={handleFormSubmit}
                onChange={handleChange}
                isSubmitting={isLoading}
            >
                {
                    !usersInfo?.trn_school_id &&
                    <InputSelectField
                        name="trn_school_id"
                        label={fieldConfigs.trn_school_id.label}
                        options={branchOptions}
                        value={formData.trn_school_id}
                        onChange={handleSelectChange}
                        isEdit={!!usersInfo?.trn_school_id} // disable editing if user has school
                        error={errors.trn_school_id}
                        required={fieldConfigs.trn_school_id.required}
                        col="col-md-4"
                    />

                }
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
                    col="col-md-6"
                />

                {isEdit && <InputSelectField
                    name="is_active"
                    label={fieldConfigs.is_active.label}
                    options={isActiveOptions}
                    value={formData.is_active}
                    onChange={handleSelectChange}
                    isEdit={false}
                    error={errors.is_active}
                    required={fieldConfigs.is_active.required}
                />}
            </SliderForm>
        );
    }
);

function areEqual(prevProps: AddEditFormProps, nextProps: AddEditFormProps) {
    return (
        prevProps.open === nextProps.open &&
        prevProps.isEdit === nextProps.isEdit &&
        prevProps.initialData === nextProps.initialData &&
        prevProps.onClose === nextProps.onClose &&
        prevProps.onSuccess === nextProps.onSuccess &&
        prevProps.setIsEditForm === nextProps.setIsEditForm
    );
}

// Memoized AddEditForm
const MemoizedAddEditForm = React.memo(AddEditForm, areEqual);

export default MemoizedAddEditForm;

