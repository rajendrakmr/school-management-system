import React, { useEffect, useState, useCallback, useMemo } from "react";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import SliderForm from "@/components/Form/SliderForm";
import InputFormField from "@/components/Form/InputFormField";
import InputSelectField from "@/components/Form/InputSelectField";
import InputRadioField from "@/components/Form/InputRadioField";
import { validationRequest, ValidationRules } from "@/utils/validationRequest";
import {
  useGetBracnhListQuery,
  useGetSectionListQuery,
  useGetShiftListQuery,
  useGetStreamListQuery,
  useGetMediumListQuery,
  useGetSessionListQuery,
  useGetClassListQuery,
  useGetSubjectListQuery
} from "@/store/slice/dropdown";
import { isActiveOptions } from "@/utils/helper";
import { useSelector } from "react-redux";
import { RootState } from "@/store";
import { useSaveClassSubjectMutation } from "@/store/slice/academics/classSubject";
import { useUserInfo } from "@/hooks/useUserInfo";

interface FormRecordItem {
  name: string;
  is_optional: string;
  code?: string;
  theory_marks?: string;
  practical_marks?: string;
  max_marks?: string;
  trn_school_id?: string;
  mst_class_id?: string;
  mst_session_id?: string;
  mst_stream_id: number;
  mst_subject_id: string;
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

const typeOptions = [
  { label: "No", value: "N" },
  { label: "Yes", value: "Y" }
];

const AddEditForm: React.FC<AddEditFormProps> = ({
  open,
  onClose,
  initialData,
  isEdit,
  onSuccess,
  pagetitle
}) => {
//   const usersInfo = useSelector((state: RootState) => state.user || {});
     const usersInfo = useUserInfo();
  // Default form
  const defaultForm: FormRecordItem = useMemo(() => ({
    mst_class_id: "",
    mst_subject_id: "",
    mst_session_id: "",
    mst_stream_id: null,
    trn_school_id: usersInfo?.trn_school_id || "",
    name: "",
    code: "",
    is_optional: "Y",
    is_active: "Y"
  }), [usersInfo]);

  const [formData, setFormData] = useState<FormRecordItem>(isEdit ? initialData || defaultForm : defaultForm);
  useEffect(() => { setFormData(isEdit ? initialData || defaultForm : defaultForm); }, [initialData, isEdit, defaultForm]);

  const [errors, setErrors] = useState<FormErrors>({});
  const timeoutRef = React.useRef<number | null>(null);

  const [saveClassSubject, { isLoading }] = useSaveClassSubjectMutation();

  const fieldConfigs: Record<keyof FormRecordItem, { label: string; required: boolean }> = {
    mst_subject_id: { required: true, label: "Subject" },
    trn_school_id: { required: !usersInfo?.trn_school_id, label: "Branch" },
    mst_class_id: { required: true, label: "Class" },
    mst_session_id: { required: true, label: "Academic Session" },
    name: { required: true, label: "Name" },
    code: { required: false, label: "Code" },
    theory_marks: { required: true, label: "Theory Marks" },
    practical_marks: { required: true, label: "Practical Marks" },
    max_marks: { required: true, label: "Full Marks" },
    is_optional: { required: false, label: "Type" },
    mst_stream_id: { required: false, label: "Stream" },
    is_active: { required: false, label: "Status" }
  };

  const validationRules: ValidationRules = useMemo(() => {
    return Object.entries(fieldConfigs).reduce((rules, [key, config]) => {
      if (config.required) rules[key as keyof FormRecordItem] = { required: true };
      return rules;
    }, {} as ValidationRules);
  }, [fieldConfigs]);

  // Dropdown queries
  const { data: sessionOptions } = useGetSessionListQuery(formData.trn_school_id, { refetchOnMountOrArgChange: true });
  const { data: classOptions } = useGetClassListQuery(formData.mst_session_id, { refetchOnMountOrArgChange: true });
  const { data: streamOptions } = useGetStreamListQuery({ refetchOnMountOrArgChange: true });
  const { data: subjectOptions } = useGetSubjectListQuery(formData.trn_school_id, { refetchOnMountOrArgChange: true });
  const { data: branchOptions } = useGetBracnhListQuery({ refetchOnMountOrArgChange: true });

  // Handlers
  const handleFieldChange = useCallback((name: keyof FormRecordItem, value: any) => {
    setFormData(prev => ({ ...prev, [name]: value }));
    setErrors(prev => ({ ...prev, [name]: "" }));
  }, []);

  const handleFormSubmit = useCallback(async () => {
    const { isValid, errors } = validationRequest(formData, validationRules);
    setErrors(errors);
 
    if (!isValid) {
      toast.error("Please fill in all mandatory fields.");
      return;
    }

    try {
      const response = await saveClassSubject(formData).unwrap();
      toast.success(response.message || "Data saved successfully!");
      onSuccess();
      timeoutRef.current = window.setTimeout(onClose, 1000);
    } catch (err: any) {
        console.log('err.data.errors',err)
      if (err?.data?.errors) {
        setErrors(err.data.errors);
        toast.error("Please fix the highlighted errors.");
      } else {
        toast.error(err?.data?.message || "Unable to save details.");
      }
    } 
  }, [formData, validationRules, saveClassSubject, onSuccess, onClose]);

  return (
    <SliderForm
      show={open}
      onClose={onClose}
      title={isEdit ? `Edit ${pagetitle}` : `Add ${pagetitle}`}
      errors={errors}
      onSubmit={handleFormSubmit}
      onChange={(e) => handleFieldChange(e.target.name as keyof FormRecordItem, e.target.value)}
      isSubmitting={isLoading}
    >
      <div className="row">
        {!usersInfo?.trn_school_id && (
          <InputSelectField
            name="trn_school_id"
            label={fieldConfigs.trn_school_id.label}
            options={branchOptions}
            value={formData.trn_school_id}
            onChange={(opt) => handleFieldChange("trn_school_id", opt?.value)}
            error={errors.trn_school_id}
            required
          />
        )}

        <InputSelectField
          name="mst_session_id"
          label={fieldConfigs.mst_session_id.label}
          options={sessionOptions}
          value={formData.mst_session_id}
          onChange={(opt) => handleFieldChange("mst_session_id", opt?.value)}
          error={errors.mst_session_id}
          required
        />

        <InputSelectField
          name="mst_class_id"
          label={fieldConfigs.mst_class_id.label}
          options={classOptions}
          value={formData.mst_class_id}
          onChange={(opt) => handleFieldChange("mst_class_id", opt?.value)}
          error={errors.mst_class_id}
          required
        />

        <InputSelectField
          name="mst_subject_id"
          label={fieldConfigs.mst_subject_id.label}
          options={subjectOptions}
          value={formData.mst_subject_id}
          onChange={(opt) => handleFieldChange("mst_subject_id", opt?.value)}
          error={errors.mst_subject_id}
          required
        />

        <InputSelectField
          name="mst_stream_id"
          label={fieldConfigs.mst_stream_id.label}
          options={streamOptions}
          value={formData.mst_stream_id}
          onChange={(opt) => handleFieldChange("mst_stream_id", opt?.value)}
          error={errors.mst_stream_id}
        />

        {["name", "code", "theory_marks", "practical_marks", "max_marks"].map((key) => (
          <InputFormField
            key={key}
            label={fieldConfigs[key as keyof FormRecordItem].label}
            name={key}
            inputValue={formData[key as keyof FormRecordItem] || ""}
            error={errors[key as keyof FormRecordItem]}
            required={fieldConfigs[key as keyof FormRecordItem].required}
            onChange={(e) => handleFieldChange(key as keyof FormRecordItem, e.target.value)}
            type={["theory_marks","practical_marks","max_marks"].includes(key) ? "num" : "text"}
          />
        ))}

        <InputRadioField
          label={fieldConfigs.is_optional.label}
          name="is_optional"
          options={typeOptions}
          selectedValue={formData.is_optional}
          onChange={(e) => handleFieldChange("is_optional", e.target.value)}
          error={errors.is_optional}
        />
<div className="col-md-12"></div>
        {isEdit && (
          <InputSelectField
            name="is_active"
            label={fieldConfigs.is_active.label}
            options={isActiveOptions}
            value={formData.is_active}
            onChange={(opt) => handleFieldChange("is_active", opt?.value)}
            error={errors.is_active}
          />
        )}
      </div>
    </SliderForm>
  );
};

export default React.memo(AddEditForm);
