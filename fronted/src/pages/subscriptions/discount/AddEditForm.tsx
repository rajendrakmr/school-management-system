import React, { useEffect, useState, useRef, useCallback, useMemo } from "react";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import SliderForm from "@/components/Form/SliderForm";
import InputFormField from "@/components/Form/InputFormField";
import InputSelectField from "@/components/Form/InputSelectField";
import InputRadioField from "@/components/Form/InputRadioField";
import { validationRequest, ValidationRules } from "@/utils/validationRequest";
import { useGetBracnhListQuery, useGetSectionListQuery, useGetShiftListQuery, useGetStreamListQuery, useGetMediumListQuery, useGetSessionListQuery } from "@/store/slice/dropdown";
import { isActiveOptions, paymentMethodOptions, paymentStatusOptions } from "@/utils/helper";
import ToggleSwitch from "@/components/pageSettings/ToggleSwitch";
import { useSaveClassMutation } from "@/store/slice/academics/classes";
import { useSelector } from "react-redux";
import { RootState } from "@/store";
import InputDateField from "@/components/Form/InputDateField";

interface FormRecordItem {
    code?: string;
    name?: string;
    discount_type?: string;
    discount_value?: number;
    applicable_plans?: string[];
    start_date?: string;
    end_date?: string;
    usage_limit?: number;
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
        code: { label: "Discount Code", required: true, minLength: 3, maxLength: 20 },
        name: { label: "Name", required: true, minLength: 3, maxLength: 20 },
        discount_type: { label: "Discount Type", required: true },
        discount_value: { label: "Discount Value", required: true },
        applicable_plans: { label: "Applicable Plans", required: true },
        start_date: { label: "Start Date", required: true },
        end_date: { label: "End Date", required: true },
        usage_limit: { label: "Usage Limit", required: false },
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
        name: "",
        code: "",
        discount_value: null,
        discount_type: "",
        applicable_plans: [],
        start_date: "",
        is_active: "",
        end_date: "",
        usage_limit:null
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
                <InputDateField
                    name="start_date"
                    label={fieldConfigs.start_date.label}
                    inputValue={formData.start_date}
                    onChange={handleChange}
                    error={errors.start_date}
                    required={fieldConfigs.start_date.required}
                    col="col-md-2"
                />
                <InputDateField
                    name="end_date"
                    label={fieldConfigs.end_date.label}
                    inputValue={formData.end_date}
                    onChange={handleChange}
                    error={errors.end_date}
                    required={fieldConfigs.end_date.required}
                    col="col-md-2"
                />

                <InputFormField
                    label={fieldConfigs.discount_value.label}
                    name="discount_value"
                    inputValue={formData.discount_value}
                    error={errors.discount_value}
                    required={fieldConfigs.discount_value.required}
                    onChange={handleChange}
                    col="col-md-3"
                />
                <InputFormField
                    label={fieldConfigs.usage_limit.label}
                    name="usage_limit"
                    inputValue={formData.usage_limit}
                    error={errors.usage_limit}
                    required={fieldConfigs.usage_limit.required}
                    onChange={handleChange}
                    col="col-md-3"
                /> 

            </div>
        </SliderForm >
    );
};

export default React.memo(AddEditForm);
