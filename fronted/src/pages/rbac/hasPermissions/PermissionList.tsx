import ToggleSwitch from "@/components/pageSettings/ToggleSwitch";
import React from "react";

interface PermissionItem {
    mst_permission_id: number;
    permission_name: string;
    can_view: "Y" | "N";
    can_edit: "Y" | "N";
    can_delete: "Y" | "N";
    can_update: "Y" | "N";
    can_create: "Y" | "N";
}

interface Props {
    permissions: PermissionItem[];
    onChange: (updatedPermissions: PermissionItem[]) => void;
}

const PermissionList: React.FC<Props> = ({ permissions, onChange }) => {
    const [localPermissions, setLocalPermissions] = React.useState<PermissionItem[]>(permissions);

    const handleToggle = (permId: number, action: keyof PermissionItem) => {
        const updated = localPermissions?.map(p =>
            p.mst_permission_id === permId
                ? { ...p, [action]: p[action] === "Y" ? "N" : "Y" }
                : p
        );
        setLocalPermissions(updated);
        onChange(updated);
    };

    return (
        <div className="permissions-container">
            {localPermissions?.map((perm) => (
                <div key={perm.mst_permission_id} className="permission-row">
                    <strong>{perm.permission_name}</strong>
                    <div className="actions flex gap-2 mt-1">
                        {(["can_view", "can_edit", "can_delete", "can_update", "can_create"] as const).map(action => (
                            <label key={action} className="flex items-center gap-1">
                                <ToggleSwitch
                                    checked={perm[action] === "Y"}
                                    onChange={() => handleToggle(perm.mst_permission_id, action)}
                                />
                                {action.replace("can_", "").toUpperCase()}
                            </label>
                        ))}
                    </div>
                </div>
            ))}
        </div>
    );
};

export default PermissionList;
