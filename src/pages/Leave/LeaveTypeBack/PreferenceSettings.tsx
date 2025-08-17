import React, { useState } from "react";
import { motion } from "framer-motion";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCog } from "@fortawesome/free-solid-svg-icons";
import "./motion.css"
interface PreferencesProps {
    isOpen: boolean;
    onClose: () => void;
    itemsPerPage: number;
    setItemsPerPage: (value: number) => void;
    availableColumns: string[];
    selectedColumns: string[];
    setSelectedColumns: (columns: string[]) => void;
}

const PreferenceSettings: React.FC<PreferencesProps> = ({
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
    const [stripedRows, setStripedRows] = useState(false);
    const [compactMode, setCompactMode] = useState(false);

    const handleSave = () => {
        setItemsPerPage(tempItemsPerPage);
        setSelectedColumns(tempSelectedColumns);
        onClose();
    };

    return (
        <>
            {isOpen && <div className="modal-overlay" onClick={onClose}></div>}

            <motion.div
                initial={{ x: 300 }}
                animate={{ x: isOpen ? 0 : 300 }}
                exit={{ x: 300 }}
                transition={{ duration: 0.3, ease: "easeInOut" }}
                className="preferences-panel"
            >
                <div className="preferences-content">
                    <h3>Preferences</h3>

                    <div>
                        <label>Page size:</label>
                        {[10, 25, 50].map(num => (
                            <div key={num}>
                                <input
                                    type="radio"
                                    value={num}
                                    checked={tempItemsPerPage === num}
                                    onChange={() => setTempItemsPerPage(num)}
                                />
                                {num} resources
                            </div>
                        ))}
                    </div>

                    <div>
                        <label>
                            <input
                                type="checkbox"
                                checked={stripedRows}
                                onChange={() => setStripedRows(!stripedRows)}
                            />
                            Striped rows
                        </label>
                    </div>

                    <div>
                        <label>
                            <input
                                type="checkbox"
                                checked={compactMode}
                                onChange={() => setCompactMode(!compactMode)}
                            />
                            Compact table mode
                        </label>
                    </div>

                    <div>
                        <label>Visible Columns:</label>
                        {availableColumns.map(col => (
                            <div key={col}>
                                <input
                                    type="checkbox"
                                    checked={tempSelectedColumns.includes(col)}
                                    onChange={() =>
                                        setTempSelectedColumns(
                                            tempSelectedColumns.includes(col)
                                                ? tempSelectedColumns.filter(c => c !== col)
                                                : [...tempSelectedColumns, col]
                                        )
                                    }
                                />
                                {col}
                            </div>
                        ))}
                    </div>

                    <div className="preferences-buttons">
                        <button onClick={handleSave}>Save</button>
                        <button onClick={onClose}>Cancel</button>
                    </div>
                </div>
            </motion.div>
        </>
    );
};

export default PreferenceSettings;
