import React, { useState, useRef, useEffect, useCallback } from "react";
import { Dropdown } from "react-bootstrap";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faSearch, faTimes } from "@fortawesome/free-solid-svg-icons";

export interface FilterKey { column_key: string; column_label: string; }
export interface Operator { label: string; value: string; }

interface SearchWithOperatorsProps {
    columns: FilterKey[];
    onSearch?: (key: FilterKey, operator: Operator, value: string) => void;
}

const operators: Operator[] = [
    { label: "Equals", value: "=" },
    { label: "Contains", value: ":" },
];

const SearchWithOperators: React.FC<SearchWithOperatorsProps> = ({ columns, onSearch }) => {
    const [selectedKey, setSelectedKey] = useState<FilterKey | null>(null);
    const [selectedOperator, setSelectedOperator] = useState<Operator | null>(null);
    const [inputValue, setInputValue] = useState<string>("");

    const [showKeyDropdown, setShowKeyDropdown] = useState(false);
    const [showOperatorDropdown, setShowOperatorDropdown] = useState(false);
    const [showDropdown, setShowDropdown] = useState(true);

    const inputRef = useRef<HTMLInputElement>(null);
    const containerRef = useRef<HTMLDivElement>(null);

    const handleKeySelect = useCallback((key: FilterKey) => {
        setSelectedKey(key);
        setSelectedOperator(null);
        setShowKeyDropdown(false);
        setShowOperatorDropdown(true);
        inputRef.current?.focus();
    }, []);

    const handleOperatorSelect = useCallback((op: Operator) => {
        setSelectedOperator(op);
        setShowOperatorDropdown(false);
        inputRef.current?.focus();
    }, []);

    const handleEnter = () => {
        if (selectedKey && selectedOperator && inputValue.trim() !== "") {
            onSearch?.(selectedKey, selectedOperator, inputValue);
            setInputValue("");
        }
    };

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setInputValue(e.target.value);
         if (selectedKey && selectedOperator && inputValue.trim() !== "") {
            onSearch?.(selectedKey, selectedOperator, inputValue);
            // setInputValue("");
        }
    };

    const clearAll = () => {
        setSelectedKey(null);
        setSelectedOperator(null);
        setInputValue("");
        setShowKeyDropdown(true);
        inputRef.current?.focus();
    };

    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
                setShowDropdown(false);
            }
        };
        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, []);

    return (
        <div className="position-relative" style={{ width: "50%" }} ref={containerRef}>
            <div className="d-flex align-items-center border rounded p-1" style={{ minHeight: "38px" }}>
                <FontAwesomeIcon icon={faSearch} className="ms-2 me-2 text-muted" />
                {selectedKey && <span className="me-1">{selectedKey.column_label}</span>}
                {selectedOperator && <span className="me-1">{selectedOperator.value}</span>}

                <input
                    ref={inputRef}
                    type="text"
                    className="flex-grow-1 border-0"
                    placeholder={!selectedKey ? "Search..." : ""}
                    value={inputValue}
                    onChange={handleInputChange}
                    onFocus={() => {
                        setShowDropdown(true);
                        if (!selectedKey) setShowKeyDropdown(true);
                    }}
                    onKeyDown={(e) => {
                        if (e.key === "Enter") handleEnter();
                        else if (e.key === "Backspace" && inputValue === "" && selectedOperator) {
                            setSelectedOperator(null);
                            setShowOperatorDropdown(true);
                        } else if (e.key === "Backspace" && inputValue === "" && selectedKey) {
                            setSelectedKey(null);
                            setShowKeyDropdown(true);
                        }
                    }}
                    style={{ outline: "none" }}
                />

                {(selectedKey || selectedOperator || inputValue) && (
                    <FontAwesomeIcon
                        icon={faTimes}
                        className="ms-2 text-muted pr-2"
                        style={{ cursor: "pointer" }}
                        onClick={clearAll}
                    />
                )}
            </div>

            {showKeyDropdown && !selectedKey && showDropdown && !inputValue && (
                <Dropdown.Menu show className="mt-1" style={{ width: "60%", maxHeight: "200px", overflowY: "auto" }}>
                    <Dropdown.Header>Columns</Dropdown.Header>
                    {columns.map((col) => (
                        <Dropdown.Item key={col.column_key} onClick={() => handleKeySelect(col)}>
                            {col.column_label}
                        </Dropdown.Item>
                    ))}
                </Dropdown.Menu>
            )}

            {showOperatorDropdown && selectedKey && !selectedOperator && !inputValue && (
                <Dropdown.Menu show className="mt-1" style={{ width: "60%", maxHeight: "200px", overflowY: "auto" }}>
                    <Dropdown.Header>Operators</Dropdown.Header>
                    {operators.map((op) => (
                        <Dropdown.Item key={op.value} onClick={() => handleOperatorSelect(op)}>
                            <div>{selectedKey.column_label} {op.value}</div>
                            <div style={{ fontSize: "0.8rem", color: "#6c757d" }}>{op.label}</div>
                        </Dropdown.Item>
                    ))}
                </Dropdown.Menu>
            )}
        </div>
    );
};

export default React.memo(SearchWithOperators);
