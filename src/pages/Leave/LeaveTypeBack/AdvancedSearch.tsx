import React, { useState, ReactNode } from "react";
import { motion } from "framer-motion";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCog, faSearch } from "@fortawesome/free-solid-svg-icons";

interface PreferencesProps {
    isOpen: boolean;
    onClose: () => void;
    itemsPerPage: number;
    setItemsPerPage: (value: number) => void;
    availableColumns: string[];
    selectedColumns: string[];
    setSelectedColumns: (columns: string[]) => void;
    children?: ReactNode;
}

const AdvancedSearch: React.FC<PreferencesProps> = ({
    isOpen,
    onClose,
    itemsPerPage,
    setItemsPerPage,
    availableColumns,
    selectedColumns,
    setSelectedColumns,
    children
}) => {
    const [tempItemsPerPage, setTempItemsPerPage] = useState(itemsPerPage);
    const [tempSelectedColumns, setTempSelectedColumns] = useState(selectedColumns);
    const [stripedRows, setStripedRows] = useState(false);
    const [compactMode, setCompactMode] = useState(false);
    const [isSearchOpen, setIsSearchOpen] = useState(false);
    const [searchQuery, setSearchQuery] = useState("");

    const handleSave = () => {
        setItemsPerPage(tempItemsPerPage);
        setSelectedColumns(tempSelectedColumns);
        onClose();
    };

    return (
        <>
            {isOpen && <div onClick={onClose}></div>}

            <motion.div
                initial={{ x: 300 }}
                animate={{ x: isOpen ? 0 : -300 }}
                exit={{ x: -300 }}
                transition={{ duration: 0.3, ease: "easeInOut" }}
                className={`preferences-panel ${isOpen ? 'visible' : 'hidden'}`}
            >
                <div className="preferences-content">
                    <h3>Preferences</h3>

                    <div className="advanced-search-container" style={{
                        border: "1px solid"
                    }}>
                        <motion.div
                            // initial={{ opacity: 0, height: 0 }}
                            // animate={{ opacity: isSearchOpen ? 1 : 0, height: isSearchOpen ? "auto" : 0 }}
                            // transition={{ duration: 0.3 }}
                            className="advanced-search-form"
                        >
                            {children}
                        </motion.div>
                    </div>
                    <div className="preferences-buttons">
                        <button className="btn-sm" onClick={handleSave}>Save</button>
                        <button className="btn-sm" onClick={onClose}>Cancel</button>
                    </div>
                </div>
            </motion.div>
        </>
    );
};

export default AdvancedSearch;
