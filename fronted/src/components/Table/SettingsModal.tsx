import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";
import "./settingsModal.css";
import { Column } from "@/utils/helper";
import ColumnDefault from "./ColumnDefault";
import PageSizeSelector from "./PageSizeSelector";
import { useUpdateColumnMutation } from "@/store/slice/columns";
interface SettingsModalProps {
    isOpen?: boolean;
    type?: string;
    onClose?: () => void;
    itemsPerPage?: number;
    setItemsPerPage?: (value: number) => void;
    allColumns: Column[];
}

const SettingsModal: React.FC<SettingsModalProps> = ({
    isOpen,
    onClose,
    itemsPerPage = 10,
    setItemsPerPage,
    allColumns,
    type
}) => {
    const [tempItemsPerPage, setTempItemsPerPage] = useState(itemsPerPage);
    const [selectedColumns, setSelectedColumns] = useState<Column[]>(allColumns);
    const [searchTerm, setSearchTerm] = useState("");
  useEffect(() => {
        setTempItemsPerPage(itemsPerPage);
    }, [itemsPerPage]);
    useEffect(() => {
        setSelectedColumns(allColumns);
    }, [allColumns]);

    const filteredColumns = selectedColumns.filter((col) =>
        col.column_label.toLowerCase().includes(searchTerm.toLowerCase())
    );

    const [updateColumn, { isLoading }] = useUpdateColumnMutation();

    const handleSave = async () => {
        try {
            if (setItemsPerPage) setItemsPerPage(tempItemsPerPage);

            localStorage.setItem("selectedColumns", JSON.stringify(selectedColumns));

            const payload = {
                selectedColumns,
                page_size: tempItemsPerPage,
                user_id: 1,
                type:type
            };
            await updateColumn(payload).unwrap();
            onClose?.();
        } catch (error) {
            console.error("Error saving columns:", error);
            alert("Failed to save columns. Please try again.");
        }
    };

    return (
        <>
            {isOpen && <div className="modal-overlay" onClick={onClose}></div>}
            <motion.div
                initial={{ x: 600 }}
                animate={{ x: isOpen ? 0 : 600 }}
                exit={{ x: 600 }}
                transition={{ duration: 0.3, ease: "easeInOut" }}
                className="modal-right"
            >
                <div className="modal-content">
                    <div className="modal-header pt-4">
                        <h5 className="modal-title">Preferences</h5>
                        <div className="modal-buttons">
                            <button onClick={onClose} className="submit-btn">Cancel</button>
                            <button onClick={handleSave} className="submit-btn" disabled={isLoading}>
                                {isLoading ? "Saving..." : "Save Changes"}
                            </button>
                        </div>
                    </div>

                    <div className="modal-body shadow p-3">
                        <div className="left-part">
                            <h6>Page size</h6>
                            <PageSizeSelector
                                pageSize={tempItemsPerPage}
                                itemsPerPage={itemsPerPage}
                                setPageSize={setTempItemsPerPage}
                            />
                        </div>
                        <div className="right-part">
                            <h6>Attributes</h6>
                            <p>Select visible columns</p>
                            <input
                                type="text"
                                placeholder="Search columns..."
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                                className="column-search-input"
                            />
                            <div className="columns-list">
                                <ColumnDefault
                                    allColumns={filteredColumns}
                                    setSelectedColumns={setSelectedColumns}
                                />
                            </div>
                        </div>
                    </div>
                </div>
            </motion.div>
        </>
    );
};

export default SettingsModal;
