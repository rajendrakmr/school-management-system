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
    trn_school_id?: string;
    mst_class_id?: string;
    mst_session_id?: string;
    mst_stream_id: string;
    mst_shift_id: string;
    mst_medium_id?: string;
    is_active: string;
    sections?: string[];
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
        sections: { required: true, label: "Section" },
        mst_medium_id: { required: true, label: "Medium" },
        trn_school_id: { required: !usersInfo?.trn_school_id, label: "Branch" },
        mst_class_id: { required: false, label: "ID" },
        mst_session_id: { required: true, label: "Academic Session" },
        name: { required: true, minLength: 2, maxLength: 50, label: "Class Name" },
        code: { required: true, minLength: 1, maxLength: 10, label: "Code" },
        mst_shift_id: { required: false, label: "Shift (Optional)" },
        mst_stream_id: { required: false, label: "Stream (Optional)" },
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

    // ------------------- Default Form -------------------
    const defaultForm: FormRecordItem = useMemo(() => ({
        mst_class_id: "",
        mst_session_id: "",
        mst_shift_id: "",
        trn_school_id: usersInfo?.trn_school_id || "",
        mst_medium_id: "",
        mst_stream_id: "",
        name: "",
        is_active: "Y",
        sections: []
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
            sections: prev.sections.includes(sectionId)
                ? prev.sections.filter(id => id !== sectionId)
                : [...prev.sections, sectionId]
        }));
         setErrors(prev => ({ ...prev, ['sections']: "" }));
    }, []);

    const handleFormSubmit = useCallback(async () => {
        const { isValid, errors } = validationRequest(formData, validationRules);
        setErrors(errors);
        console.log('errorserrorserrorserrors',errors)

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


    const { data: sessionOptions } = useGetSessionListQuery({ refetchOnMountOrArgChange: true });
    const { data: sectionOptions } = useGetSectionListQuery(formData?.mst_session_id, { refetchOnMountOrArgChange: true });
    const { data: branchOptions } = useGetBracnhListQuery({ refetchOnMountOrArgChange: true });
    const { data: mediumOptions } = useGetMediumListQuery({ refetchOnMountOrArgChange: true });
    const { data: streamOptions } = useGetStreamListQuery({ refetchOnMountOrArgChange: true });
    const { data: shiftOptions } = useGetShiftListQuery(formData?.mst_session_id, { refetchOnMountOrArgChange: true });
    const [sectionList, setSectionList] = useState<{ value: string; label: string }[]>([]);
    // ------------------- Handlers -------------------
    const handleChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
        setErrors(prev => ({ ...prev, [name]: "" }));
    }, []);

    // useEffect(() => {
    //     if (sectionOptions) {
    //         setSectionList(sectionOptions);
    //     }
    // }, [sectionOptions]);
    console.log('sectionOptionssectionOptionssectionOptions', sectionOptions)

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
                <InputSelectField
                    name="mst_session_id"
                    label={fieldConfigs.mst_session_id.label}
                    options={sessionOptions}
                    value={formData.mst_session_id}
                    onChange={handleSelectChange}
                    isEdit={!!usersInfo?.mst_session_id} // disable editing if user has session
                    error={errors.mst_session_id}
                    required={fieldConfigs.mst_session_id.required}
                    col="col-md-4"
                />

                <InputRadioField
                    label={fieldConfigs.mst_medium_id.label}
                    name="mst_medium_id"
                    options={mediumOptions}
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
                    col="col-md-6"
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

                {/* <div className="col-md-4"></div> */}

                <div className="row">
                    <InputSelectField
                        name="mst_shift_id"
                        label={fieldConfigs.mst_shift_id.label}
                        options={shiftOptions}
                        value={formData.mst_shift_id}
                        onChange={handleSelectChange}
                        isEdit={false}
                        error={errors.mst_shift_id}
                        required={fieldConfigs.mst_shift_id.required}
                    />



                    <div className={`col-md-5 mt-4`}>
                        <div className="form-group">
                            {fieldConfigs.sections.label}{fieldConfigs.sections.required && <span className="text-danger">*</span>}
                            
                            <div className="actions flex gap-2 mt-1">
                                {sectionOptions?.map(item => (
                                    <label key={item.value} className="flex items-center gap-2 mx-2">
                                        <ToggleSwitch
                                            checked={formData?.sections.includes(item.value)}
                                            onChange={() => handleToggleSection(item.value)}
                                        />
                                        {item.label}
                                    </label>
                                ))}
                                <br />
                                {errors.sections&& <span className="text-danger">{errors.sections}</span>}
                            </div> 
                    </div>
                </div>
            </div>
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
