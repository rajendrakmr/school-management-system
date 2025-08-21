import React, { useEffect, useState, useRef } from "react";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import SliderForm from "@/components/Form/SliderForm";
import InputSelectField from "@/components/Form/InputSelectField";
import { validationRequest, ValidationRules } from "@/utils/validationRequest";
import { useGetPermissionsMenuQuery, useRolesQuery } from "@/store/slice/dropdown";
import { useSaveRoleHasPermissionMutation } from "@/store/slice/access-policy/policies";
import ToggleSwitch from "@/components/pageSettings/ToggleSwitch";

interface PermissionForm {
    mst_permission_id: number;
    permission_name: string;
    can_view: "Y" | "N";
    can_edit: "Y" | "N";
    can_delete: "Y" | "N";
    can_update: "Y" | "N";
    can_create: "Y" | "N";
}

interface FormRecordItem {
    permissions: PermissionForm[];
    mst_role_id: string;
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
}

const fieldConfigs: Record<keyof FormRecordItem, FieldConfig> = {
    permissions: { required: false, label: "Permissions" },
    mst_role_id: { required: true, label: "Role" },
};

// ------------------- Validation Rules -------------------
const validationRules: ValidationRules = Object.keys(fieldConfigs).reduce(
    (rules, key) => {
        const config = fieldConfigs[key as keyof typeof fieldConfigs];
        if (config.required) {
            rules[key as keyof FormRecordItem] = { required: true };
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
    const initialKey: FormRecordItem = {
        permissions: [],
        mst_role_id: "",
    };

    const formBody: FormRecordItem = initialData || initialKey;

    const [formData, setFormData] = useState<FormRecordItem>(formBody);
    const [errors, setErrors] = useState<FormErrors>({});
    const timeoutRef = useRef<number | null>(null);

    const { data: rolesOptions, isFetching: isLoadingRoles } = useRolesQuery({ refetchOnMountOrArgChange: true });
    const { data: permissions, refetch: refetchPermissions } = useGetPermissionsMenuQuery(formData.mst_role_id, {
        skip: !formData.mst_role_id
    });

    const [saveRoleHasPermission, { isLoading }] = useSaveRoleHasPermissionMutation();
 
    useEffect(() => {
        if (initialData) setFormData(initialData);
    }, [initialData]);

    // Refetch permissions whenever role changes
    useEffect(() => {
        if (formData.mst_role_id) {
            refetchPermissions();
        }
    }, [formData.mst_role_id, refetchPermissions]);
    useEffect(() => {
        if (permissions) {
            setFormData(prev => ({ ...prev, permissions: permissions }));
        }
    }, [permissions]);





    // Clear timeout on unmount
    useEffect(() => {
        return () => { if (timeoutRef.current) clearTimeout(timeoutRef.current); };
    }, []);

    // ------------------- Handlers -------------------
    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
        setErrors(prev => ({ ...prev, [name]: "" }));
    };

    const handleSelectChange = (selectedOption: any, name: string) => {
        const value = selectedOption?.value || "";
        setFormData(prev => ({ ...prev, [name]: value }));

        if (name === "mst_role_id") {
            setFormData(prev => ({ ...prev, permissions: [] })); // reset permissions
        }
        setErrors(prev => ({ ...prev, [name]: "" }));
    };

    const resetForm = () => {
        setFormData(formBody);
        setErrors({});
        setIsEditForm(false);
    };

    const handleFormSubmit = async () => {
        console.log('forn Dta',formData)
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
            timeoutRef.current = window.setTimeout(() => { onClose(); }, 2000);
        } catch (err: any) {
            if (err?.data?.errors) {
                setErrors(err.data.errors);
                toast.error("Please fix the highlighted errors.", { autoClose: 3000, position: "top-right" });
            } else {
                toast.error(err?.data?.message || "Unable to update details.", { autoClose: 3000, position: "top-right" });
            }
        }
    };

    // ------------------- Render -------------------
    return (
        <SliderForm
            show={open}
            onClose={() => { resetForm(); onClose(); }}
            title={"Role has Permission"}
            errors={errors}
            onSubmit={handleFormSubmit}
            onChange={handleChange}
            isSubmitting={isLoading}
        >
            <InputSelectField
                name="mst_role_id"
                label={fieldConfigs.mst_role_id.label}
                options={rolesOptions}
                isLoading={isLoadingRoles}
                value={formData.mst_role_id}
                onChange={handleSelectChange}
                error={errors.mst_role_id}
                required={fieldConfigs.mst_role_id.required}
            />

            <div className="row pt-3">
                
                <div className="permissions-container shadow-lg p-3">
                <h6>Permission Lists</h6> 


                    {(formData.permissions || []).map((perm) => (
                        <div key={perm.mst_permission_id} className="permission-row mt-1">
                            <strong>{perm.permission_name}</strong>
                            <div className="actions flex gap-2 mt-1">
                                {(["can_view", "can_edit", "can_delete", "can_update", "can_create"] as const).map(action => (
                                    <label key={action} className="flex items-center gap-2">
                                        <ToggleSwitch
                                            checked={perm[action] === "Y"}
                                            onChange={() => {
                                                const updatedPermissions = formData.permissions.map(p =>
                                                    p.mst_permission_id === perm.mst_permission_id
                                                        ? { ...p, [action]: p[action] === "Y" ? "N" : "Y" }
                                                        : p
                                                );
                                                setFormData(prev => ({ ...prev, permissions: updatedPermissions }));
                                            }}
                                        />
                                        {action.replace("can_", "").toLocaleLowerCase()}
                                    </label>
                                ))}
                            </div>
                        </div>
                    ))}


                </div>
                    <span className="text-danger">{errors.permissions?errors.permissions:""}</span>
            </div>
        </SliderForm>
    );
};

export default AddEditForm;
