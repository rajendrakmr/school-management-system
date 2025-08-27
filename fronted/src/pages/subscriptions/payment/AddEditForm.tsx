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
    payment_method?: string;
    amount?: string;
    payment_date?: string;
    invoice_number?: string;
    notes?: string;
    payment_status: string;
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
        amount: { label: "Payment Amount", required: true },
        payment_method: { label: "Payment Method", required: true },
        payment_date: { label: "Payment Date", required: true },
        invoice_number: { label: "Invoice Number", required: false },
        notes: { label: "Notes", required: false },
        payment_status: { label: "Payment Status", required: false },
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
        payment_method: "",
        amount: "",
        invoice_number: "",
        notes: "",
        payment_status: "",
        payment_date: ""
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
                    name="payment_method"
                    label={fieldConfigs.payment_method.label}
                    options={paymentMethodOptions}
                    value={formData.payment_method}
                    onChange={handleSelectChange}
                    isEdit={false}
                    error={errors.payment_method}
                    required={fieldConfigs.payment_method.required}
                    col="col-md-3"
                />
                <InputDateField
                    name="payment_date"
                    label={fieldConfigs.payment_date.label} 
                    inputValue={formData.payment_date}
                    onChange={handleChange} 
                    error={errors.payment_date}
                    required={fieldConfigs.payment_date.required}
                    col="col-md-2"
                />

                <InputFormField
                    label={fieldConfigs.notes.label}
                    name="notes"
                    inputValue={formData.notes}
                    error={errors.notes}
                    required={fieldConfigs.notes.required}
                    onChange={handleChange}
                    col="col-md-6"
                />
                <InputFormField
                    label={fieldConfigs.invoice_number.label}
                    name="invoice_number"
                    inputValue={formData.invoice_number}
                    error={errors.invoice_number}
                    required={fieldConfigs.invoice_number.required}
                    onChange={handleChange}
                    col="col-md-3"
                />




                <InputSelectField
                    name="payment_status"
                    label={fieldConfigs.payment_status.label}
                    options={paymentStatusOptions}
                    value={formData.payment_status}
                    onChange={handleSelectChange}
                    isEdit={false}
                    error={errors.payment_status}
                    required={fieldConfigs.payment_status.required}
                    col="col-md-2"
                />


            </div>
        </SliderForm >
    );
};

export default React.memo(AddEditForm);
