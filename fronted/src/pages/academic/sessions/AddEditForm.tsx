import React, { useEffect, useState, useRef, useCallback, useMemo } from "react";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import SliderForm from "@/components/Form/SliderForm";
import InputFormField from "@/components/Form/InputFormField";
import InputSelectField from "@/components/Form/InputSelectField";
import { validationRequest, ValidationRules } from "@/utils/validationRequest";
import { isActiveOptions } from "@/utils/helper";
import { useUserInfo } from "@/hooks/useUserInfo";
import { useGetBracnhListQuery } from "@/store/slice/dropdown";
import { useSaveSessionMutation } from "@/store/slice/academics/session";
import InputDateField from "@/components/Form/InputDateField";

interface FormRecordItem {
    trn_school_id?: string;
    mst_shift_id: string;
    name: string;
     code: string;
    start_date: string;
    end_date: string;
    is_active: string;
}

type FormErrors = {
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
            mst_shift_id: { required: false, label: "ID" },
            name: { required: true, minLength: 2, maxLength: 50, label: "Name" },
              code: { required: true, minLength: 2, maxLength: 10, label: "Code" },
            start_date: { required: true, label: "Start Time" },
            end_date: { required: true, label: "End Time" },
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
                mst_shift_id: "",
                trn_school_id: "",
                name: "",
                code:"",
                start_date: "",
                end_date: "",
                is_active: "Y",
            }),
            []
        );
        const initialForm: FormRecordItem = useMemo(
            () => (isEdit ? initialData || defaultForm : defaultForm),
            [isEdit, initialData, defaultForm]
        );

        const [formData, setFormData] = useState<FormRecordItem>(initialForm);

        const [errors, setErrors] = useState<FormErrors>({});
        const timeoutRef = useRef<number | null>(null);
        const [saveSession, { isLoading }] = useSaveSessionMutation();
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
                const response = await saveSession(formData).unwrap();
                toast.success(response.message || "Data saved successfully!", { autoClose: 3000, position: "top-right" });
                onSuccess();
                resetForm();
                timeoutRef.current = window.setTimeout(onClose, 1000);
            } catch (err: any) {
                console.log('err', err.data)
                if (err?.data?.errors) {
                    setErrors(err.data.errors);
                    toast.error("Please fix the highlighted errors.", { autoClose: 3000, position: "top-right" });
                } else {
                    toast.error(err?.data?.error || "Unable to save details.", { autoClose: 3000, position: "top-right" });
                }
            }
        }, [formData, onSuccess, resetForm, onClose,]);



        useEffect(() => {
            return () => {
                if (timeoutRef.current) clearTimeout(timeoutRef.current);
            };
        }, []);

        useEffect(() => {
            console.log('errors', errors)
        }, [errors]);




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
               <div className="row">
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
                  <div className="col-md-12"></div>

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
                  <div className="col-md-12"></div>


                <InputDateField
                    label={fieldConfigs.start_date.label}
                    name="start_date"
                    inputValue={formData.start_date}
                    error={errors.start_date?.toString()}
                    required={fieldConfigs.start_date.required}
                    onChange={handleChange}
                   
                />
                <InputDateField
                    label={fieldConfigs.end_date.label}
                    name="end_date"
                    minDate={formData.start_date}
                    inputValue={formData.end_date}
                    error={errors.end_date}
                    required={fieldConfigs.end_date.required}
                    onChange={handleChange}
                   
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
               </div>
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

