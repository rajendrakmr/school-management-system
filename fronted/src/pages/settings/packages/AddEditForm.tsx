import React, { useEffect, useState, useRef } from "react";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import SliderForm from "@/components/Form/SliderForm";
import InputFormField from "@/components/Form/InputFormField";
import InputSelectField from "@/components/Form/InputSelectField";
import { validationRequest, ValidationRules } from "@/utils/validationRequest";
import { useSaveSubjectMutation } from "@/store/slice/academics/subjects";
import InputRadioField from "@/components/Form/InputRadioField";
import { useMediumsQuery } from "@/store/slice/dropdown";
import InputFileField from "@/components/Form/InputFileField";
import ToggleSwitch from "@/components/pageSettings/ToggleSwitch";

interface FormRecordItem {
    mst_package_id: number;
    tag_line: string;
    name: string;
    description: string;
    type: string;
    billing_period: number | string;
    no_of_student: number | string;
    no_of_staff: number | string;
    charges: number | string;
    is_active: string;
    features: any[]
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
    mst_package_id: { required: true, label: "Medium" },
    no_of_staff: { required: true, label: "No. of Staff" },
    no_of_student: { required: true, label: "No. of Student" },
    billing_period: { required: true, label: "Days" },
    charges: { required: true, label: "Charges" },
    name: { required: true, minLength: 2, maxLength: 50, label: "Name" },
    description: { required: false, minLength: 2, maxLength: 50, label: "Description" },
    type: { required: true, label: "Type" },
    features: { required: false, label: "Feature" },
    tag_line: { required: false, minLength: 2, maxLength: 50, label: "Tagline" },
    is_active: { required: false, label: "Status" },
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
    setIsEditForm,
}) => {
    const initialKey: FormRecordItem = {
        mst_package_id: null,
        tag_line: null,
        name: "",
        type: "",
        description: "",
        charges: null,
        no_of_staff: null,
        no_of_student: null,
        billing_period: null,
        features: [],
        is_active: "Y",
    };
    const formBody: FormRecordItem = initialData || initialKey;

    const [formData, setFormData] = useState<FormRecordItem>(formBody);
    const [errors, setErrors] = useState<FormErrors>({});
    const [preview, setPreview] = useState<string>("");

    const timeoutRef = useRef<number | null>(null);
    const [saveSubject, { isLoading }] = useSaveSubjectMutation();
    const { data: mediumsOptions } = useMediumsQuery({ refetchOnMountOrArgChange: true });

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
        setErrors((prev) => ({ ...prev, [e.target.name]: "" }));
    };

    const handleSelectChange = (selectedOption: any, name: string) => {
        setFormData((prev) => ({ ...prev, [name]: selectedOption?.value || "" }));
        setErrors((prev) => ({ ...prev, [name]: "" }));
    };

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0] || null;
        setFormData((prev) => ({ ...prev, image: file }));
        setPreview(file ? URL.createObjectURL(file) : "");
        setErrors((prev) => ({ ...prev, image: "" }));
    };

    const resetForm = () => {
        setFormData(formBody);
        setErrors({});
        setPreview("");
    };

    const handleFormSubmit = async () => {
        const { isValid, errors } = validationRequest(formData, validationRules);
        setErrors(errors);

        if (!isValid) {
            toast.error("Please fill in all mandatory fields.");
            return;
        }

        try {
            const formPayload = new FormData();
            Object.entries(formData).forEach(([key, value]) => {
                if (value !== undefined && value !== null) {
                    if (key === "image" && value instanceof File) {
                        formPayload.append("image", value);
                    } else {
                        formPayload.append(key, String(value));
                    }
                }
            });

            // Pass FormData directly
            const response = await saveSubject(formPayload).unwrap();

            toast.success(response.message || "Data saved successfully!");
            onSuccess();
            resetForm();
            timeoutRef.current = window.setTimeout(onClose, 1000);
        } catch (err: any) {
            console.error(err);
            if (err?.data?.errors) setErrors(err.data.errors);
            toast.error(err?.data?.message ?? "Unable to save subject details");
        }
    };

    useEffect(() => {
        if (initialData) setFormData(initialData);
        return () => timeoutRef.current && clearTimeout(timeoutRef.current);
    }, [initialData]);

    const statusOptions = [
        { value: "Y", label: "Active" },
        { value: "N", label: "Inactive" },
    ];
    const typOptions = [
        { value: "prepaid", label: "Prepaid" },
        { value: "postpaid", label: "Postpaid" },
    ];

    const renderImage = (src: string) => (
        <img
            style={{
                width: "90px",
                height: "90px",
                borderRadius: "50px",
                border: "1px solid #ccc",
                objectFit: "cover",
            }}
            src={`http://localhost:5000/uploads${src}`}
            alt="School Logo"
            onError={(e) => { (e.target as HTMLImageElement).src = "https://via.placeholder.com/90?text=No+Logo"; }}
        />
    );
    const features = [
        { id: 1, label: "Academics Management", locked: true },
        { id: 2, label: "Session Year Management", locked: true },
        { id: 3, label: "Student Management", locked: true },
        { id: 4, label: "Teacher Management", locked: false },
        { id: 5, label: "Announcement Management", locked: false },
        { id: 6, label: "Assignment Management", locked: false },
        { id: 7, label: "Attendance Management", locked: false },
        { id: 8, label: "Exam Management", locked: false },
        { id: 9, label: "Expense Management", locked: false },
        { id: 10, label: "Fees Management", locked: false },
        { id: 11, label: "Holiday Management", locked: false },
    ];
    const [activeIds, setActiveIds] = useState<number[]>([]); 
    const toggleFeature = (id: number, locked: boolean) => {
        if (locked) return; 
        setActiveIds(prev => prev.includes(id) ? prev.filter(x => x !== id) : [...prev, id]
        );
    };
    return (
        <SliderForm
            show={open}
            onClose={() => { resetForm(); onClose(); }}
            title={isEdit ? "Edit Package " : "Add Package"}
            errors={errors}
            onSubmit={handleFormSubmit}
            onChange={handleChange}
            isSubmitting={isLoading}
        >
            {/* <span className="text-danger">Note: Subject Name, Code & Type should be unique for Medium</span> */}
            <div className="row">
                <InputRadioField
                    label={fieldConfigs.type.label}
                    name="type"
                    options={typOptions}
                    error={errors.type}
                    selectedValue={formData.type}
                    onChange={handleChange}
                    required={fieldConfigs.type.required}
                    col="col-md-12"
                />
                <InputFormField
                    label={fieldConfigs.name.label}
                    name="name"
                    inputValue={formData.name}
                    error={errors.name}
                    required={fieldConfigs.name.required}
                    onChange={handleChange}
                    col="col-md-4"
                />
                <InputFormField
                    label={fieldConfigs.description.label}
                    name="description"
                    inputValue={formData.description}
                    error={errors.description}
                    required={fieldConfigs.description.required}
                    onChange={handleChange}
                    col="col-md-8"
                />
                <InputFormField
                    label={fieldConfigs.tag_line.label}
                    name="tag_line"
                    inputValue={formData.tag_line}
                    error={errors.tag_line}
                    required={fieldConfigs.tag_line.required}
                    onChange={handleChange}
                    col="col-md-4"
                />
                <InputFormField
                    label={fieldConfigs.billing_period.label}
                    name="billing_period"
                    inputValue={formData.billing_period}
                    error={errors.billing_period}
                    required={fieldConfigs.billing_period.required}
                    onChange={handleChange}
                    col="col-md-2"
                />
                <InputFormField
                    label={fieldConfigs.no_of_staff.label}
                    name="no_of_staff"
                    inputValue={formData.no_of_staff}
                    error={errors.no_of_staff}
                    required={fieldConfigs.no_of_staff.required}
                    onChange={handleChange}
                    col="col-md-2"
                />
                <InputFormField
                    label={fieldConfigs.no_of_student.label}
                    name="no_of_student"
                    inputValue={formData.no_of_student}
                    error={errors.no_of_student}
                    required={fieldConfigs.no_of_student.required}
                    onChange={handleChange}
                    col="col-md-2"
                />
                <InputFormField
                    label={fieldConfigs.charges.label}
                    name="charges"
                    inputValue={formData.charges}
                    error={errors.charges}
                    required={fieldConfigs.charges.required}
                    onChange={handleChange}
                    col="col-md-4"
                />
                {isEdit && <InputSelectField
                    name="is_active"
                    label={fieldConfigs.is_active.label}
                    options={statusOptions}
                    value={formData.is_active}
                    onChange={handleSelectChange}
                    isEdit={false}
                    error={errors.is_active}
                    required={fieldConfigs.is_active.required}
                />}
                {/* <div className="row pt-3"> */}

                    <div className="permissions-container  shadow-lg p-3 features-grid grid grid-cols-4 gap-4 p-4 row" style={{borderRadius:"0px !important"}}>
                        <h6>{fieldConfigs.features.label}</h6> 

                        {(features || []).map((feature) => {
                            const isActive = activeIds.includes(feature.id);
                            return (
                                <div
                                    key={feature.id}
                                    style={{borderRadius:"0px !important", cursor:"pointer"}}
                                    onClick={() => toggleFeature(feature.id, feature.locked)}
                                    className={`col-md-2 cursor-pointer border  p-2 text-center select-none
                        ${feature.locked ? "border-green-500 text-green-500" : ""}
                        ${!feature.locked && isActive ? "border-green-500 text-green-500" : ""}
                        ${!feature.locked && !isActive ? "border-black text-black" : ""}
                        `}
                                >
                                    {feature.locked && <span className="mr-1">🔒</span>}
                                    {!feature.locked && isActive && <span className="mr-1">✔</span>}
                                    {feature.label}
                                </div>
                            );
                        })} 
                </div>
            </div>
        </SliderForm>
    );
};

export default AddEditForm;
