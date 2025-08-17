import React, { useState } from "react";
import { motion } from "framer-motion";
import "./motion.css"
interface SettingsModalProps {
    isOpen: boolean;
    onClose: () => void;
    itemsPerPage: number;
    setItemsPerPage: (value: number) => void;
    availableColumns: string[];
    selectedColumns: string[];
    setSelectedColumns: (columns: string[]) => void;
}

const SettingsModal: React.FC<SettingsModalProps> = ({
    isOpen,
    onClose,
    itemsPerPage,
    setItemsPerPage,
    availableColumns,
    selectedColumns,
    setSelectedColumns
}) => {
    const [tempItemsPerPage, setTempItemsPerPage] = useState(itemsPerPage);
    const [tempSelectedColumns, setTempSelectedColumns] = useState(selectedColumns);

    const handleSave = () => {
        setItemsPerPage(tempItemsPerPage);
        setSelectedColumns(tempSelectedColumns);
        onClose();
    };

    return (
        <>
            {/* Overlay */}
            {isOpen && <div className="modal-overlay" onClick={onClose}></div>}

            {/* Sliding Modal */}
            <motion.div
                initial={{ x: 300 }} // Start off-screen
                animate={{ x: isOpen ? 0 : 300 }} // Slide in when open
                exit={{ x: 300 }} // Slide out when closing
                transition={{ duration: 0.3, ease: "easeInOut" }}
                className="modal-right"
            >
                <div className="modal-content">
                    <h3>Settings</h3>

                    {/* Pagination Settings */}
                    <div>
                        <label>Items per Page:</label>
                        <select value={tempItemsPerPage} onChange={(e) => setTempItemsPerPage(Number(e.target.value))}>
                            {[5, 10, 20, 50, 100].map((num) => (
                                <option key={num} value={num}>{num}</option>
                            ))}
                        </select>
                    </div>

                    {/* Table Column Selection */}
                    <div>
                        <label>Visible Columns:</label>
                        {availableColumns.map((col) => (
                            <div key={col}>
                                <input
                                    type="checkbox"
                                    checked={tempSelectedColumns.includes(col)}
                                    onChange={() =>
                                        setTempSelectedColumns(
                                            tempSelectedColumns.includes(col)
                                                ? tempSelectedColumns.filter((c) => c !== col)
                                                : [...tempSelectedColumns, col]
                                        )
                                    }
                                />
                                {col}
                            </div>
                        ))}
                    </div>

                    {/* Buttons */}
                    <div className="modal-buttons">
                        <button onClick={handleSave}>Save</button>
                        <button onClick={onClose}>Cancel</button>
                    </div>
                </div>
            </motion.div>
        </>
    );
};

export default SettingsModal;