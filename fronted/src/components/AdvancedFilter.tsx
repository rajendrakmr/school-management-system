import React, { useState, ReactNode } from "react";
import { motion } from "framer-motion";
import "./AdvancedFilter.css"
interface PreferencesProps {
    isOpen?: boolean;
    onClose?: () => void;
    children?: ReactNode;
    onSearch?: () => void;
    onClear?: () => void;
    onSearching?: boolean;
    hasFilled?: boolean;
}

const AdvancedFilter: React.FC<PreferencesProps> = ({
    isOpen,
    onClose,
    children,
    onSearch,
    onSearching,
    onClear,
    hasFilled
}) => {

    return (
        <>
            <motion.div
                initial={{ x: 300 }}
                animate={{ x: isOpen ? 0 : -300 }}
                exit={{ x: -300 }}
                transition={{ duration: 0.3, ease: "easeInOut" }}
                className={`preferences-panel ${isOpen ? 'visible' : 'hidden'}`}
            >
                <div className="preferences-content shadow-lg p-2">
                    <h6>Advanced Filter</h6>
                    <div className="advanced-search-container shadow-lg p-4" style={{
                        border: "1px solid",
                        borderRadius: "0px"
                    }}>
                        {children}
                        <div className="preferences-buttons">
                            {
                                hasFilled && <button style={{backgroundColor:"#e54a4a"}} className="cbtn-sm cbtn-c" onClick={onClear}>
                                    {onSearching ? (
                                        <>
                                            <span
                                                className="spinner-border spinner-border-sm me-2"
                                                aria-hidden="true"
                                            ></span>
                                            Searching...
                                        </>
                                    ) : (
                                        "Clear"
                                    )}
                                </button>
                            }
                            {<button className="cbtn-sm cbtn-c" onClick={onClose}>Close</button>}
                            
                            <button className="cbtn-sm cbtn-s" onClick={onSearch}>
                                {onSearching ? (
                                    <>
                                        <span
                                            className="spinner-border spinner-border-sm me-2"
                                            role="status"
                                            aria-hidden="true"
                                        ></span>
                                        Searching...
                                    </>
                                ) : (
                                    "Search"
                                )}
                            </button>
                        </div>
                    </div>

                </div>
            </motion.div>
        </>
    );
};

export default AdvancedFilter;
