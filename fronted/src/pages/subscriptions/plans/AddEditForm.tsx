import React, { useEffect, useState, useRef, useCallback, useMemo } from "react";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import SliderForm from "@/components/Form/SliderForm";
import InputFormField from "@/components/Form/InputFormField";
import InputSelectField from "@/components/Form/InputSelectField";
import InputRadioField from "@/components/Form/InputRadioField";
import { validationRequest, ValidationRules } from "@/utils/validationRequest";
import { useGetBracnhListQuery, useGetSectionListQuery, useGetShiftListQuery, useGetStreamListQuery, useGetMediumListQuery, useGetSessionListQuery } from "@/store/slice/dropdown";
import { isActiveOptions } from "@/utils/helper";
import ToggleSwitch from "@/components/pageSettings/ToggleSwitch";
import { useSaveClassMutation } from "@/store/slice/academics/classes";
import { useSelector } from "react-redux";
import { RootState } from "@/store";

interface FormRecordItem {
    name: string;
    code?: string;
    price?: string;
    description?: string;
    currency?: string;
    billing_cycle: string;
    max_teachers: string;
    max_students?: string;
    is_active: string;
    trial_days: string;
    features?: string[];
}

type FormErrors = Partial<Record<keyof FormRecordItem, string>>;

interface AddEditFormProps {
    open: boolean;
    pagetitle: string;
    isEdit: boolean;
    onClose: () => void;
    initialData?: FormRecordItem;
    onSuccess: () => void;
    setIsEditForm: React.Dispatch<React.SetStateAction<boolean>>;
}

const AddEditForm: React.FC<AddEditFormProps> = ({ open, onClose, initialData, isEdit, onSuccess, pagetitle }) => {
    const usersInfo = useSelector((state: RootState) => state?.user.user || {});



    // ------------------- Field Config -------------------
    const fieldConfigs: Record<keyof FormRecordItem, { label: string; required: boolean; minLength?: number; maxLength?: number }> = {
        name: { label: "Name", required: true, minLength: 2, maxLength: 50 },
        code: { label: "Code", required: false },
        description: { label: "About Plan", required: false },
        price: { label: "Price", required: true },
        currency: { label: "Currency", required: true },
        billing_cycle: { label: "Billing Cycle", required: true },
        trial_days: { label: "Trial Days", required: false },
        max_students: { label: "Maximum Students", required: true },
        max_teachers: { label: "Maximum Teachers", required: false },
        features: { label: "Features", required: true },
        is_active: { label: "Status", required: false },
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

    // ------------------- Default Form -------------------
    const defaultForm: FormRecordItem = useMemo(() => ({
        description: "",
        currency: "",
        max_teachers: "",
        price: "",
        max_student: "",
        billing_cycle: "",
        name: "",
        is_active: "Y",
        trial_days: "",
        feature: []
    }), [usersInfo]);

    const initialForm: FormRecordItem = useMemo(
        () => (isEdit ? initialData || defaultForm : defaultForm),
        [isEdit, initialData, defaultForm]
    );

    const [formData, setFormData] = useState<FormRecordItem>(initialForm);
    useEffect(() => {
        setFormData(initialForm);
    }, [initialForm]);

    const [errors, setErrors] = useState<FormErrors>({});
    const timeoutRef = useRef<number | null>(null);

    const [saveClass, { isLoading }] = useSaveClassMutation();

    // ------------------- Dropdown Data -------------------




    const handleSelectChange = useCallback((selectedOption: any, name: string) => {
        setFormData(prev => ({ ...prev, [name]: selectedOption?.value || "" }));
        setErrors(prev => ({ ...prev, [name]: "" }));
    }, []);

    const handleToggleSection = useCallback((sectionId: string) => {
        setFormData(prev => ({
            ...prev,
            features: prev.features.includes(sectionId)
                ? prev.features.filter(id => id !== sectionId)
                : [...prev.features, sectionId]
        }));
        setErrors(prev => ({ ...prev, ['features']: "" }));
    }, []);

    const handleFormSubmit = useCallback(async () => {
        const { isValid, errors } = validationRequest(formData, validationRules);
        setErrors(errors);
        console.log('errorserrorserrorserrors', errors)

        if (!isValid) {
            toast.error("Please fill in all mandatory fields.", { autoClose: 3000, position: "top-right" });
            return;
        }

        try {
            const response = await saveClass(formData).unwrap();
            toast.success(response.message || "Data saved successfully!", { autoClose: 3000, position: "top-right" });
            onSuccess();
            timeoutRef.current = window.setTimeout(onClose, 1000);
        } catch (err: any) {
            if (err?.data?.errors) {
                console.log('err.data.errors', err.data.errors)
                setErrors(err.data.errors);
                toast.error("Please fix the highlighted errors.", { autoClose: 3000, position: "top-right" });
            } else {
                toast.error(err?.data?.message || "Unable to save details.", { autoClose: 3000, position: "top-right" });
            }
        } finally {
            setErrors({});
        }
    }, [formData, onSuccess, onClose]);

    // ------------------- JSX -------------------


    const { data: sessionOptions } = useGetSessionListQuery(formData?.price, { refetchOnMountOrArgChange: true });
    const { data: sectionOptions } = useGetSectionListQuery(formData?.currency, { refetchOnMountOrArgChange: true });
    const { data: branchOptions } = useGetBracnhListQuery({ refetchOnMountOrArgChange: true });
    const { data: mediumOptions } = useGetMediumListQuery({ refetchOnMountOrArgChange: true });
    const { data: shiftOptions } = useGetShiftListQuery(formData?.currency, { refetchOnMountOrArgChange: true });

    // ------------------- Handlers -------------------
    const handleChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
        setErrors(prev => ({ ...prev, [name]: "" }));
    }, []);


    return (
        <SliderForm
            show={open}
            onClose={onClose}
            title={isEdit ? `Edit ${pagetitle}` : `Add ${pagetitle}`}
            errors={errors}
            onSubmit={handleFormSubmit}
            onChange={handleChange}
            isSubmitting={isLoading}
        >
            <div className="row">
                <InputFormField
                    label={fieldConfigs.name.label}
                    name="name"
                    inputValue={formData.name}
                    error={errors.name}
                    required={fieldConfigs.name.required}
                    onChange={handleChange}
                    col="col-md-3"
                />
                
                <InputFormField
                    label={fieldConfigs.code.label}
                    name="code"
                    inputValue={formData.code}
                    error={errors.code}
                    required={fieldConfigs.code.required}
                    onChange={handleChange}
                    col="col-md-3"
                />
                <InputFormField
                    label={fieldConfigs.description.label}
                    name="description"
                    inputValue={formData.description}
                    error={errors.description}
                    required={fieldConfigs.description.required}
                    onChange={handleChange}
                    col="col-md-6"
                />


                <InputSelectField
                    name="currency"
                    label={fieldConfigs.currency.label}
                    options={sessionOptions}
                    value={formData.currency}
                    onChange={handleSelectChange}
                    isEdit={!!usersInfo?.currency} // disable editing if user has session
                    error={errors.currency}
                    required={fieldConfigs.currency.required}
                    col="col-md-3"
                />
                <InputFormField
                   label={fieldConfigs.max_students.label}
                    name="max_students"
                    inputValue={formData.max_students}
                    error={errors.max_students}
                    required={fieldConfigs.max_students.required}
                    onChange={handleChange}
                    col="col-md-3"
                />
                <InputFormField
                    label={fieldConfigs.max_teachers.label}
                    name="max_teachers"
                    inputValue={formData.max_teachers}
                    error={errors.max_teachers}
                    required={fieldConfigs.max_teachers.required}
                    onChange={handleChange}
                    col="col-md-3"
                />
                <InputFormField
                    label={fieldConfigs.trial_days.label}
                    name="trial_days"
                    inputValue={formData.trial_days}
                    error={errors.trial_days}
                    required={fieldConfigs.trial_days.required}
                    onChange={handleChange}
                    col="col-md-3"
                />
                 
                 <InputFormField
                    label={fieldConfigs.billing_cycle.label}
                    name="billing_cycle"
                    inputValue={formData.billing_cycle}
                    error={errors.billing_cycle}
                    required={fieldConfigs.billing_cycle.required}
                    onChange={handleChange}
                    col="col-md-3"
                />
                 
                 

                


                <InputFormField
                    label={fieldConfigs.trial_days.label}
                    name="trial_days"
                    inputValue={formData.trial_days}
                    error={errors.trial_days}
                    required={fieldConfigs.trial_days.required}
                    onChange={handleChange}
                    col="col-md-3"
                />
                {isEdit && (
                    <InputSelectField
                        name="is_active"
                        label={fieldConfigs.is_active.label}
                        options={isActiveOptions}
                        value={formData.is_active}
                        onChange={handleSelectChange}
                        isEdit={false}
                        error={errors.is_active}
                        required={fieldConfigs.is_active.required}
                    />
                )}
 

                <div className="row"> 
                    <div className={`col-md-5 mt-4`}>
                        <div className="form-group">
                            {fieldConfigs.features.label}{fieldConfigs.features.required && <span className="text-danger">*</span>}

                            <div className="actions flex gap-2 mt-1">
                                {sectionOptions?.map(item => (
                                    <label key={item.value} className="flex items-center gap-2 mx-2">
                                        <ToggleSwitch
                                            checked={formData?.features.includes(item.value)}
                                            onChange={() => handleToggleSection(item.value)}
                                        />
                                        {item.label}
                                    </label>
                                ))}
                                <br />
                                {errors.features && <span className="text-danger">{errors.features}</span>}
                            </div>
                        </div>
                    </div>
                </div>
                
            </div>
        </SliderForm >
    );
};

export default React.memo(AddEditForm);
