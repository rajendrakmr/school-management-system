import React, { useEffect, useState, useRef } from "react";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import SliderForm from "@/components/Form/SliderForm";
import InputFormField from "@/components/Form/InputFormField";
import InputSelectField from "@/components/Form/InputSelectField";
import InputFileField from "@/components/Form/InputFileField";
import { validationRequest, ValidationRules } from "@/utils/validationRequest";
import { useUpdateSchoolMutation } from "@/store/slice/school";
import { useSaveMediumMutation } from "@/store/slice/academics/mediums";
import { isActiveOptions } from "@/utils/helper";
import { useSaveSemesterMutation } from "@/store/slice/academics/semesters";

interface FormRecordItem {
    mst_semester_id: string;
    name: string;
    end_month: string;
    start_month: string;
    is_active: string;
}

type SchoolFormErrors = {
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
    mst_semester_id: { required: false, label: "ID" },
    start_month: { required: true,  label: "Start Month" },
    end_month: { required: true,  label: "End Month" },
    name: { required: true, minLength: 2, maxLength: 50, label: "Name" },
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
    setIsEditForm
}) => {
    // Default form
    const initialKey = {
        mst_semester_id: "",
        name: "",
        start_month: "",
        end_month: "",
        is_active: "Y"
    };
    const formBody: FormRecordItem = isEdit ? initialKey : initialData || initialKey;

    const [formData, setFormData] = useState<FormRecordItem>(formBody);
    const [errors, setErrors] = useState<SchoolFormErrors>({});
    // Input field change
    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
        setErrors({ ...errors, [e.target.name]: "" });
    };

    // Select field change
    const handleSelectChange = (selectedOption: any, name: string) => {
        setFormData((prev) => ({ ...prev, [name]: selectedOption?.value || "" }));
        setErrors({ ...errors, [name]: "" });
    };


    // Reset form
    const resetForm = () => {
        setFormData(formBody);
        setErrors({});
    };



    const timeoutRef = useRef<number | null>(null);
    const [saveSemester, { isLoading: isLoading }] = useSaveSemesterMutation();
    const handleFormSubmit = async () => {
        const { isValid, errors } = validationRequest(formData, validationRules);
        setErrors(errors);
        if (!isValid) {
            toast.error("Please fill in all mandatory fields.", { autoClose: 3000, position: "top-right" });
            return;
        }
        try {
            const response = await saveSemester(formData).unwrap();
            console.log('responseresponse', response)
            toast.success(response.message || "data saved successfully!", { autoClose: 3000, position: "top-right" });
            onSuccess();
            resetForm();
            timeoutRef.current = window.setTimeout(() => {
                onClose();
            }, 1000);

        } catch (err: any) {
            console.log('errerrerrerrerr', err)
            if (err?.data?.errors) {
                setErrors(err.data.errors);  // <-- Set form errors here
                toast.error("Please fix the highlighted errors.", { autoClose: 3000, position: "top-right" });
            } else {
                toast.error(err?.data?.message || "Unable to save role details.", { autoClose: 3000, position: "top-right" });
            }
        } finally {

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

    const monthOptions = [
        { value: "January", label: "January" },
        { value: "February", label: "February" },
        { value: "March", label: "March" },
        { value: "April", label: "April" },
        { value: "May", label: "May" },
        { value: "June", label: "June" },
        { value: "July", label: "July" },
        { value: "August", label: "August" },
        { value: "September", label: "September" },
        { value: "October", label: "October" },
        { value: "November", label: "November" },
        { value: "December", label: "December" },
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
            title={formData?.mst_semester_id ? "Edit Semester" : "Add Semester"}
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
                col="col-md-6"
            />
            <div className="col-md-6"> 
            </div>
            <InputSelectField
                name="start_month"
                label={fieldConfigs.start_month.label}
                options={monthOptions}
                value={formData.start_month}
                onChange={handleSelectChange}
                isEdit={true}
                error={errors.start_month}
                required={fieldConfigs.start_month.required}
            />
             <div className="col-md-8"> 
            </div>
            <InputSelectField
                name="end_month"
                label={fieldConfigs.end_month.label}
                options={monthOptions}
                value={formData.end_month}
                onChange={handleSelectChange}
                isEdit={true}
                error={errors.end_month}
                required={fieldConfigs.end_month.required}
            />
              <div className="col-md-8"> 
            </div>
            <InputSelectField
                name="is_active"
                label={fieldConfigs.is_active.label}
                options={isActiveOptions}
                value={formData.is_active}
                onChange={handleSelectChange}
                isEdit={true}
                error={errors.is_active}
                required={fieldConfigs.is_active.required}
            />
           </div>

        </SliderForm>
    );
};

export default AddEditForm;