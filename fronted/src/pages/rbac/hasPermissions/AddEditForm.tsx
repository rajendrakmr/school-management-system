import React, { useEffect, useState, useRef } from "react";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import SliderForm from "@/components/Form/SliderForm"; 
import InputSelectField from "@/components/Form/InputSelectField";
import { validationRequest, ValidationRules } from "@/utils/validationRequest"; 
import { useGetPermissionsMenuQuery, useRolesQuery } from "@/store/slice/dropdown";
import 'react-checkbox-tree/lib/react-checkbox-tree.css';
import CheckboxTree from 'react-checkbox-tree';
import { FaCheck, FaRegCheckSquare, FaRegSquare, FaFingerprint, FaMinus, FaPlus } from 'react-icons/fa';
import { useSaveRoleHasPermissionMutation } from "@/store/slice/roleHasPermissions";

interface FormRecordItem {
    permissions: string[];
    mst_role_id: string;
}
interface Node {
    value: string;
    label: string;
    children?: Node[];
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
    permissions: { required: false, label: "ID" },
    mst_role_id: { required: true, label: "Role" },
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

interface PermissionForm {
    mst_permission_id: number;
    permission_name: string;
}
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
        permissions: [],
        mst_role_id: "",
    };

    const { data: permissions } = useGetPermissionsMenuQuery({ refetchOnMountOrArgChange: true });
    const { data: rolesOptions, isFetching: isLoadingRoles } = useRolesQuery({ refetchOnMountOrArgChange: true });
    const formBody: FormRecordItem = isEdit ? initialKey : initialData || initialKey;
   
    const [formData, setFormData] = useState<FormRecordItem>(formBody);
    const [errors, setErrors] = useState<FormErrors>({});

    // Input field change
    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target;
        setFormData((prev) => ({ ...prev, [name]: value }));
        setErrors((prev) => ({ ...prev, [name]: "" }));
    };
    // Select field change
    const handleSelectChange = (selectedOption: any, name: string) => {
        setFormData((prev) => ({ ...prev, [name]: selectedOption?.value || "" }));
        setErrors({ ...errors, [name]: "" });
    };

    // File field change


    // Reset form
    const resetForm = () => {
        setFormData(formBody);
        setErrors({});
        setIsEditForm(false)
    };



    const timeoutRef = useRef<number | null>(null);
    const [saveRoleHasPermission, { isLoading: isLoading }] = useSaveRoleHasPermissionMutation();
    const [checked, setChecked] = useState<string[]>([]);
    const [expanded, setExpanded] = useState<string[]>(["1", "2"])
    const [nodes, setNodes] = useState<Node[]>([]);
    const handleFormSubmit = async () => { 
        const { isValid, errors } = validationRequest(formData, validationRules);
        setErrors(errors);
        if (!isValid) {
            toast.error("Please fill in all mandatory fields.", {
                autoClose: 3000,
                position: "top-right",
            });
            return;
        }

        try {
            console.log('formDataformData',formData)
            const response = await saveRoleHasPermission(formData).unwrap();
            setIsEditForm(false)
            toast.success(response.message || "Record saved successfully!", {
                autoClose: 3000,
                position: "top-right",
            });

            resetForm();
            onSuccess();
            timeoutRef.current = window.setTimeout(() => {
                onClose();
            }, 2000);
        } catch (err: any) { 
            if (err?.data?.errors) {
                setErrors(err.data.errors);
                toast.error("Please fix the highlighted errors.", {
                    autoClose: 3000,
                    position: "top-right",
                });
            } else {
                toast.error(err?.data?.message || "Unable to update details.", {
                    autoClose: 3000,
                    position: "top-right",
                });
            }
        }
    };



    useEffect(() => {
        return () => {
            if (timeoutRef.current) {
                clearTimeout(timeoutRef.current);
            }
        };
    }, []);





useEffect(() => {
  if (initialData) {
    setFormData(initialData);

    // Checked leaf nodes
    const selectedNode = (initialData?.permissions ?? []).map(p =>
      typeof p === "string" ? p : String((p as PermissionForm).mst_permission_id)
    );
    setChecked(selectedNode); 
    setExpanded(selectedNode); // remove duplicates
  }
}, [initialData]);




    useEffect(() => {
        if (permissions) {
            setNodes(permissions);
        }
    }, [permissions]);

    const handleCheck = (newChecked: string[]) => {
        setChecked(newChecked);
        setFormData((prev) => ({ ...prev, permissions: newChecked })); // Update formData
    };

    return (
        <SliderForm
            show={open}
            onClose={() => {
                resetForm();
                onClose();
            }}
            title={"Role has Permission"}
            errors={errors}
            onSubmit={handleFormSubmit}
            onChange={handleChange}
            isSubmitting={isLoading}
        >
            <div className="row  p-5">
                <InputSelectField
                    name="mst_role_id"
                    label={fieldConfigs.mst_role_id.label}
                    options={rolesOptions}
                    isLoading={isLoadingRoles}
                    value={formData.mst_role_id}
                    onChange={handleSelectChange}
                    isEdit={true}
                    error={errors.mst_role_id}
                    required={fieldConfigs.mst_role_id.required}
                />
                <div className={` col-md-1 mt-3`}></div>
                <div className={` col-md-6 mt-3`}>
                    <div className="form-group">
                        <label
                            className="form-label fw-semibold"
                            style={{ fontSize: "14px" }}
                        >
                            Permissions
                        </label>
                        <CheckboxTree
                            nodes={nodes}       // ✅ Required!
                            checked={checked}
                            expanded={expanded}
                            onCheck={handleCheck}
                            onExpand={setExpanded}
                            icons={{
                                check: <FaCheck />,
                                uncheck: <FaRegSquare />,
                                halfCheck: <FaRegCheckSquare />,

                                // Use plus/minus instead of arrows
                                expandClose: <FaPlus />,
                                expandOpen: <FaMinus />,
                                // parentClose: <FaPlus />,
                                // parentOpen: <FaMinus />,

                                expandAll: <FaPlus />,
                                collapseAll: <FaMinus />,

                                // Leaf icon
                                leaf: <FaFingerprint />
                            }}
                        />

                    </div>

                </div>
                {/* <InputSelectField
                    name="is_active"
                    label={fieldConfigs.is_active.label}
                    options={statusOptions}
                    value={formData.is_active}
                    onChange={handleSelectChange}
                    isEdit={true}
                    error={errors.is_active}
                    required={fieldConfigs.is_active.required}
                /> */}
            </div>

        </SliderForm>
    );
};

export default AddEditForm;