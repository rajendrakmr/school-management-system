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
    trn_school_id?: string;
    admin_name?: string;
    email?: string;
    mst_plan_id?: string;
    subscription_start?: string;
    subscription_end?: string;
    payment_status?: string;
    is_active: string;
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
        trn_school_id: { label: "School", required: true },
        admin_name: { label: "Admin Name", required: true },
        email: { label: "Admin Email", required: true },
        mst_plan_id: { label: "Subscribed Plan", required: true },
        subscription_start: { label: "Subscription Start", required: true },
        subscription_end: { label: "Subscription End", required: true },
        payment_status: { label: "Payment Status", required: true },
        is_active: { label: "Trial Active", required: false },
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
        trn_school_id: "",
        admin_name: "",
        email: "",
        mst_plan_id: "",
        subscription_start: "",
        subscription_end: "",
        payment_status: "",
        is_active: "Y",
        trial_days: "",
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


    // const { data: sessionOptions } = useGetSessionListQuery(formData?.price, { refetchOnMountOrArgChange: true });
    // const { data: sectionOptions } = useGetSectionListQuery(formData?.currency, { refetchOnMountOrArgChange: true });
    const { data: branchOptions } = useGetBracnhListQuery({ refetchOnMountOrArgChange: true });
    // const { data: mediumOptions } = useGetMediumListQuery({ refetchOnMountOrArgChange: true });
    // const { data: shiftOptions } = useGetShiftListQuery(formData?.currency, { refetchOnMountOrArgChange: true });

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
            title={pagetitle}
            errors={errors}
            onSubmit={handleFormSubmit}
            onChange={handleChange}
            isSubmitting={isLoading}
        >
            <div className="row">
                 <InputSelectField
                    name="mst_plan_id"
                    label={fieldConfigs.mst_plan_id.label}
                    options={branchOptions}
                    value={formData.mst_plan_id}
                    onChange={handleSelectChange}
                    isEdit={false}
                    error={errors.mst_plan_id}
                    required={fieldConfigs.mst_plan_id.required}
                    col="col-md-3"
                />
                <InputSelectField
                    name="trn_school_id"
                    label={fieldConfigs.trn_school_id.label}
                    options={branchOptions}
                    value={formData.trn_school_id}
                    onChange={handleSelectChange}
                    isEdit={false}
                    error={errors.trn_school_id}
                    required={fieldConfigs.trn_school_id.required}
                    col="col-md-3"
                />
                <InputFormField
                    label={fieldConfigs.admin_name.label}
                    name="admin_name"
                    inputValue={formData.admin_name}
                    error={errors.admin_name}
                    required={fieldConfigs.admin_name.required}
                    onChange={handleChange}
                    col="col-md-3"
                />

                <InputFormField
                    label={fieldConfigs.email.label}
                    name="email"
                    inputValue={formData.email}
                    error={errors.email}
                    required={fieldConfigs.email.required}
                    onChange={handleChange}
                    col="col-md-3"
                />
                <InputFormField
                    label={fieldConfigs.subscription_start.label}
                    name="subscription_start"
                    inputValue={formData.subscription_start}
                    error={errors.subscription_start}
                    required={fieldConfigs.subscription_start.required}
                    onChange={handleChange}
                    col="col-md-3"
                />
                <InputFormField
                    label={fieldConfigs.subscription_end.label}
                    name="subscription_end"
                    inputValue={formData.subscription_end}
                    error={errors.subscription_end}
                    required={fieldConfigs.subscription_end.required}
                    onChange={handleChange}
                    col="col-md-3"
                />

                 

                <InputSelectField
                    name="payment_status"
                    label={fieldConfigs.payment_status.label}
                    options={isActiveOptions}
                    value={formData.payment_status}
                    onChange={handleSelectChange}
                    isEdit={false}
                    error={errors.payment_status}
                    required={fieldConfigs.payment_status.required} 
                    col="col-md-3"
                /> 
                <InputSelectField
                    name="is_active"
                    label={fieldConfigs.is_active.label}
                    options={isActiveOptions}
                    value={formData.is_active}
                    onChange={handleSelectChange}
                    isEdit={false}
                    error={errors.is_active}
                    required={fieldConfigs.is_active.required}
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

            </div>
        </SliderForm >
    );
};

export default React.memo(AddEditForm);
