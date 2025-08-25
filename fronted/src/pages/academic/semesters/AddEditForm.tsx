import React, { useEffect, useState, useRef, useCallback, useMemo } from "react";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import SliderForm from "@/components/Form/SliderForm";
import InputFormField from "@/components/Form/InputFormField";
import InputSelectField from "@/components/Form/InputSelectField";
import { validationRequest, ValidationRules } from "@/utils/validationRequest";
import { useSaveSemesterMutation } from "@/store/slice/academics/semesters";
import { isActiveOptions } from "@/utils/helper";
import { useUserInfo } from "@/hooks/useUserInfo";
import { useGetBracnhListQuery } from "@/store/slice/dropdown";

interface FormRecordItem {
    mst_semester_id: string;
     trn_school_id?: string;
    name: string;
    start_month: string;
    end_month: string;
    is_active: string;
}

type FormErrors = Partial<Record<keyof FormRecordItem, string>>;

interface AddEditFormProps {
    open: boolean;
    isEdit: boolean;
    onClose: () => void;
    initialData?: FormRecordItem;
    onSuccess: () => void;
    setIsEditForm: React.Dispatch<React.SetStateAction<boolean>>;
}


// ------------------- Component -------------------
const AddEditForm: React.FC<AddEditFormProps> = ({ open, onClose, initialData, isEdit, onSuccess }) => {
    const usersInfo = useUserInfo();
    const { data: branchOptions } = useGetBracnhListQuery({ refetchOnMountOrArgChange: true });


    // ------------------- Field Config -------------------
    const fieldConfigs: Record<keyof FormRecordItem, { label: string; required: boolean; minLength?: number; maxLength?: number }> = {
         trn_school_id: { required: !usersInfo?.trn_school_id, label: "Branch" },
        mst_semester_id: { required: false, label: "ID" },
        name: { required: true, minLength: 2, maxLength: 50, label: "Name" },
        start_month: { required: true, label: "Start Month" },
        end_month: { required: true, label: "End Month" },
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
    const initialForm = useMemo<FormRecordItem>(() => ({
        mst_semester_id: "",
        trn_school_id:"",
        name: "",
        start_month: "",
        end_month: "",
        is_active: "Y",
    }), []);

    const [formData, setFormData] = useState<FormRecordItem>(initialData || initialForm);
    const [errors, setErrors] = useState<FormErrors>({});
    const timeoutRef = useRef<number | null>(null);

    const [saveSemester, { isLoading }] = useSaveSemesterMutation();

    const monthOptions = useMemo(() => [
        "January", "February", "March", "April", "May", "June",
        "July", "August", "September", "October", "November", "December"
    ].map(m => ({ value: m, label: m })), []);

    const handleChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
        setErrors(prev => ({ ...prev, [name]: "" }));
    }, []);

    const handleSelectChange = useCallback((selectedOption: any, name: string) => {
        setFormData(prev => ({ ...prev, [name]: selectedOption?.value || "" }));
        setErrors(prev => ({ ...prev, [name]: "" }));
    }, []);

    const resetForm = useCallback(() => {
        setFormData(initialData || initialForm);
        setErrors({});
    }, [initialData, initialForm]);

    const handleFormSubmit = useCallback(async () => {
        const { isValid, errors } = validationRequest(formData, validationRules);
        setErrors(errors);

        if (!isValid) {
            toast.error("Please fill in all mandatory fields.", { autoClose: 3000, position: "top-right" });
            return;
        }

        try {
            const response = await saveSemester(formData).unwrap();
            toast.success(response.message || "Data saved successfully!", { autoClose: 3000, position: "top-right" });
            onSuccess();
            resetForm();
            timeoutRef.current = window.setTimeout(onClose, 1000);
        } catch (err: any) {
            console.error(err);
            if (err?.data?.errors) {
                setErrors(err.data.errors);
                toast.error("Please fix the highlighted errors.", { autoClose: 3000, position: "top-right" });
            } else {
                toast.error(err?.data?.message || "Unable to save semester details.", { autoClose: 3000, position: "top-right" });
            }
        }
    }, [formData, onSuccess, onClose, resetForm, saveSemester]);

    useEffect(() => {
        if (initialData) setFormData(initialData);
        return () => timeoutRef.current && clearTimeout(timeoutRef.current);
    }, [initialData]);

    return (
        <SliderForm
            show={open}
            onClose={() => { resetForm(); onClose(); }}
            title={formData.mst_semester_id ? "Edit Semester" : "Add Semester"}
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
            <div className="row">
                <InputFormField
                    label={fieldConfigs.name.label}
                    name="name"
                    inputValue={formData.name}
                    error={errors.name}
                    required={fieldConfigs.name.required}
                    onChange={handleChange}
                    col="col-md-6"
                />
                <div className="col-md-6"></div>
                <InputSelectField
                    name="start_month"
                    label={fieldConfigs.start_month.label}
                    options={monthOptions}
                    value={formData.start_month}
                    onChange={handleSelectChange}
                    isEdit={false}
                    error={errors.start_month}
                    required={fieldConfigs.start_month.required}
                />

                <InputSelectField
                    name="end_month"
                    label={fieldConfigs.end_month.label}
                    options={monthOptions}
                    value={formData.end_month}
                    onChange={handleSelectChange}
                    isEdit={false}
                    error={errors.end_month}
                    required={fieldConfigs.end_month.required}
                />
                <div className="col-md-6"></div>

                {isEdit &&
                    <InputSelectField
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
};

export default React.memo(AddEditForm);
