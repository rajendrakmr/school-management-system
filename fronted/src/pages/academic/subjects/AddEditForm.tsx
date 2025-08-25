import React, { useEffect, useState, useRef, useCallback, useMemo } from "react";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import SliderForm from "@/components/Form/SliderForm";
import InputFormField from "@/components/Form/InputFormField";
import InputSelectField from "@/components/Form/InputSelectField";
import InputRadioField from "@/components/Form/InputRadioField";
import InputFileField from "@/components/Form/InputFileField";
import { validationRequest, ValidationRules } from "@/utils/validationRequest";
import { useSaveSubjectMutation } from "@/store/slice/academics/subjects";
import { useGetBracnhListQuery, useGetDepartmentListQuery, useGetMediumListQuery } from "@/store/slice/dropdown";
import { isActiveOptions } from "@/utils/helper";
import { useUserInfo } from "@/hooks/useUserInfo";

interface FormRecordItem {
    trn_school_id?: string;
    mst_department_id: number;
    mst_subject_id: string;
    name: string;
    code: string;
    type: string;
    image?: File | null;
    image_path?: string;
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
const AddEditForm: React.FC<AddEditFormProps> = ({
    open,
    onClose,
    initialData,
    isEdit,
    onSuccess,
}) => {

    const usersInfo = useUserInfo();
    const { data: branchOptions } = useGetBracnhListQuery({ refetchOnMountOrArgChange: true });
    const { data: departmentOptions } = useGetDepartmentListQuery({ refetchOnMountOrArgChange: true });


    // ------------------- Field Config -------------------
    const fieldConfigs: Record<keyof FormRecordItem, { label: string; required: boolean; minLength?: number; maxLength?: number }> = {
        trn_school_id: { required: !usersInfo?.trn_school_id, label: "Branch" },
        mst_department_id: { required: true, label: "Department" },
        mst_subject_id: { required: false, label: "ID" },
        name: { required: true, minLength: 2, maxLength: 50, label: "Subject Name" },
        type: { required: true, label: "Type" },
        code: { required: false, label: "Subject Code" },
        image: { required: false, label: "Image" },
        image_path: { required: false, label: "Image" },
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


    const PATH = process.env.BACKEND_PATH_API_URL;
    const defaultForm: FormRecordItem = useMemo(() => ({
        mst_subject_id: "",
        trn_school_id: "",
        mst_department_id: 0,
        name: "",
        type: "",
        code: "",
        image_path: "",
        is_active: "Y",
    }), []);
    const initialForm: FormRecordItem = useMemo(
        () => (isEdit ? initialData || defaultForm : defaultForm),
        [isEdit, initialData, defaultForm]
    );
    const [formData, setFormData] = useState<FormRecordItem>(initialForm);
    useEffect(() => {
        setFormData(initialForm);
    }, [initialForm]);
    const [errors, setErrors] = useState<FormErrors>({});
    const [preview, setPreview] = useState<string>("");
    const timeoutRef = useRef<number | null>(null);

    const [saveSubject, { isLoading }] = useSaveSubjectMutation();
    const { data: mediumsOptions } = useGetMediumListQuery({ refetchOnMountOrArgChange: true });


    const typeOptions = useMemo(() => [
        { value: "core", label: "Core" },
        { value: "elective", label: "Elective" },
        { value: "optional", label: "Optional" },
    ], []);

    const handleChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
        setErrors(prev => ({ ...prev, [name]: "" }));
    }, []);

    const handleSelectChange = useCallback((selectedOption: any, name: string) => {
        setFormData(prev => ({ ...prev, [name]: selectedOption?.value || "" }));
        setErrors(prev => ({ ...prev, [name]: "" }));
    }, []);

    const handleFileChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0] || null;
        setFormData(prev => ({ ...prev, image: file }));
        setPreview(file ? URL.createObjectURL(file) : "");
        setErrors(prev => ({ ...prev, image: "" }));
    }, []);

    const resetForm = useCallback(() => {
        setFormData(initialForm);
        setErrors({});
        setPreview("");
    }, [initialForm]);

    const handleFormSubmit = useCallback(async () => {
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
                    if (key === "image" && value instanceof File) formPayload.append("image", value);
                    else formPayload.append(key, String(value));
                }
            });

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
    }, [formData, onSuccess, onClose, resetForm, saveSubject]);

    useEffect(() => {
        if (initialForm) setFormData(initialForm);
        return () => timeoutRef.current && clearTimeout(timeoutRef.current);
    }, [initialForm]);

    const renderImagePreview = useCallback(() => {
        if (preview) return preview;
        if (formData.image_path) return `${PATH}/uploads${formData.image_path}`;
        return "";
    }, [preview, formData.image_path]);

    return (
        <SliderForm
            show={open}
            onClose={() => { resetForm(); onClose(); }}
            title={isEdit ? "Edit Subject" : "Add Subject"}
            errors={errors}
            onSubmit={handleFormSubmit}
            onChange={handleChange}
            isSubmitting={isLoading}
        >
            <span className="text-danger">Note: Subject Name, Code & Type should be unique for Department</span>
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
                <InputSelectField
                    name="mst_department_id"
                    label={fieldConfigs.mst_department_id.label}
                    options={departmentOptions}
                    value={formData.mst_department_id}
                    onChange={handleSelectChange}
                    isEdit={!!usersInfo?.mst_department_id} // disable editing if user has school
                    error={errors.mst_department_id}
                    required={fieldConfigs.mst_department_id.required}
                    col="col-md-4"
                />
                {/* <InputRadioField
                    label={fieldConfigs.mst_medium_id.label}
                    name="mst_medium_id"
                    options={mediumsOptions}
                    error={errors.mst_medium_id}
                    selectedValue={formData.mst_medium_id}
                    onChange={handleChange}
                    required={fieldConfigs.mst_medium_id.required}
                    col="col-md-12"
                /> */}
                <InputFormField
                    label={fieldConfigs.name.label}
                    name="name"
                    inputValue={formData.name}
                    error={errors.name}
                    required={fieldConfigs.name.required}
                    onChange={handleChange}
                    col="col-md-4"
                />
                <div className="col-md-4"></div>
                <InputFormField
                    label={fieldConfigs.code.label}
                    name="code"
                    inputValue={formData.code}
                    error={errors.code}
                    required={fieldConfigs.code.required}
                    onChange={handleChange}
                    col="col-md-4"
                />
                <InputRadioField
                    label={fieldConfigs.type.label}
                    name="type"
                    options={typeOptions}
                    error={errors.type}
                    selectedValue={formData.type}
                    onChange={handleChange}
                    required={fieldConfigs.type.required}
                    col="col-md-6"
                />
                {/* <InputFileField
                    label={fieldConfigs.image.label}
                    name="image"
                    accept="image/*"
                    onChange={handleFileChange}
                    error={errors.image}
                    col="col-md-7"
                /> */}
                {/* <div className="col-md-3 mt-3">
                    {renderImagePreview() ? (
                        <div className="position-relative d-inline-block">
                            <img
                                src={renderImagePreview()}
                                alt="Preview"
                                className="img-thumbnail"
                                style={{ width: "90px", height: "90px", borderRadius: "50px", objectFit: "cover" }}
                            />
                            <button
                                type="button"
                                className="btn btn-sm btn-danger position-absolute top-0 end-0"
                                onClick={() => { setFormData(prev => ({ ...prev, image: null, image_path: "" })); setPreview(""); }}
                            >✕</button>
                        </div>
                    ) : (
                        <div style={{ width: "90px", height: "90px", borderRadius: "50px", border: "1px solid #ccc", backgroundColor: "#f0f0f0", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "12px", color: "#999" }}>
                            No Logo
                        </div>
                    )}
                </div> */}
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
};

export default React.memo(AddEditForm);
