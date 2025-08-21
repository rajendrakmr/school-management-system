import React, { useEffect, useState, useRef } from "react";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import SliderForm from "@/components/Form/SliderForm";
import InputSelectField from "@/components/Form/InputSelectField";
import InputMultiSelectField from "@/components/Form/InputMultiSelectField";
import { validationRequest, ValidationRules } from "@/utils/validationRequest";
import { useSaveRoleHasPermissionMutation } from "@/store/slice/access-policy/policies";
import { useGetUsersQuery, useRolesQuery } from "@/store/slice/dropdown";

interface OptionType {
    value: string | number;
    label: string;
}

interface FormRecordItem {
    trn_user_id: string | number;
    mst_role_id: string[];
}

type FormErrors = {
    [K in keyof FormRecordItem]?: string;
};

interface AddEditFormProps {
    open: boolean;
    onClose: () => void;
    initialData?: FormRecordItem;
    onSuccess: () => void;
    isEdit: boolean;
    setIsEditForm: React.Dispatch<React.SetStateAction<boolean>>;
}
interface UsersResponse {
    users: { value: string; label: string }[];
    total: number;
    page: number;
    totalPages: number;
}

interface FieldConfig {
    label: string;
    required: boolean;
    minLength?: number;
    maxLength?: number;
}

const fieldConfigs: Record<keyof FormRecordItem, FieldConfig> = {
    trn_user_id: { required: true, label: "User" },
    mst_role_id: { required: true, label: "Role" },
};

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

const AddEditForm: React.FC<AddEditFormProps> = ({
    open,
    onClose,
    initialData,
    isEdit,
    onSuccess,
    setIsEditForm,
}) => {
    const initialKey: FormRecordItem = {

        trn_user_id: "",
        mst_role_id: [],
    };
    console.log("initialDatainitialDatainitialDatainitialData", initialData)
    const [formData, setFormData] = useState<FormRecordItem>(initialData || initialKey);
    const [errors, setErrors] = useState<FormErrors>({});
    const [userPage, setUserPage] = useState(1);
    const [userSearch, setUserSearch] = useState("");
    const timeoutRef = useRef<number | null>(null);

    const [saveRoleHasPermission, { isLoading }] = useSaveRoleHasPermissionMutation();
    const { data: usersResponse, isFetching: isUserLoading } = useGetUsersQuery({
        page: userPage,
        limit: 10,
        search: userSearch,
    });
    // console.log('usersResponse',usersResponse)
    const userOptions: OptionType[] = usersResponse?.data || [];
    const { data: rolesOptions } = useRolesQuery({ refetchOnMountOrArgChange: false });


    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target;
        setFormData((prev) => ({ ...prev, [name]: value }));
        setErrors((prev) => ({ ...prev, [name]: "" }));
    };

    const handleSelectChange = (selectedOption: any, name: string) => {
        setFormData((prev) => ({ ...prev, [name]: selectedOption?.value || "" }));
        setErrors({ ...errors, [name]: "" });
    };



    const resetForm = () => {
        setFormData(initialKey);
        setErrors({});
        setIsEditForm(false);
        setUserPage(1);
        setUserSearch("");
    };

    const handleFormSubmit = async () => {
        const { isValid, errors } = validationRequest(formData, validationRules);
        setErrors(errors);
        if (!isValid) {
            toast.error("Please fill in all mandatory fields.", { autoClose: 3000, position: "top-right" });
            return;
        }

        try {
            const response = await saveRoleHasPermission(formData).unwrap();
            toast.success(response.message || "Record saved successfully!", { autoClose: 3000, position: "top-right" });
            resetForm();
            onSuccess();
            timeoutRef.current = window.setTimeout(() => onClose(), 2000);
        } catch (err: any) {
            if (err?.data?.errors) {
                setErrors(err.data.errors);
                toast.error("Please fix the highlighted errors.", { autoClose: 3000, position: "top-right" });
            } else {
                toast.error(err?.data?.message || "Unable to save details.", { autoClose: 3000, position: "top-right" });
            }
        }
    };

    useEffect(() => {
        if (initialData) {
            setFormData({
                ...initialData,
                mst_role_id: initialData.mst_role_id?.map(String), // convert numbers to strings
            });
        }
    }, [initialData]);


    useEffect(() => {
        return () => {
            if (timeoutRef.current) clearTimeout(timeoutRef.current);
        };
    }, []);

    const handleUserScroll = () => {
        if (usersResponse && userPage < usersResponse.totalPages) setUserPage((prev) => prev + 1);
    };

    return (
        <SliderForm
            show={open}
            onClose={() => {
                resetForm();
                onClose();
            }}
            title={isEdit ? "Edit Access Policies" : "Assign Access Policies"}
            errors={errors}
            onSubmit={handleFormSubmit}
            onChange={handleChange}
            isSubmitting={isLoading}
        >
            {/* User Dropdown */}
            <InputSelectField
                name="trn_user_id"
                label={fieldConfigs.trn_user_id.label}
                options={userOptions}
                value={formData.trn_user_id}
                onChange={(selected) => handleSelectChange(selected, "trn_user_id")}
                onMenuScroll={handleUserScroll}
                onInputChange={(val) => {
                    setUserSearch(val);
                    setUserPage(1);
                }}
                isLoading={isUserLoading}
                error={errors.trn_user_id}
                required={fieldConfigs.trn_user_id.required}
                height="70vh"
            />

            {/* Multi Role Dropdown */}
            <InputMultiSelectField
                name="mst_role_id"
                label={fieldConfigs.mst_role_id.label}
                options={rolesOptions || []}
                value={formData.mst_role_id}   // ✅ now valid
                onChange={(selected) =>
                    setFormData((prev) => ({ ...prev, mst_role_id: selected }))
                }
                error={errors.mst_role_id}
                required={fieldConfigs.mst_role_id.required}
            />
        </SliderForm>
    );
};

export default AddEditForm;
