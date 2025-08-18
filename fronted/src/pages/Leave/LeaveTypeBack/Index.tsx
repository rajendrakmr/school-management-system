import { faCog, faPlus, faSearch, faSyncAlt } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import React, { useEffect, useState } from "react";
import { Modal, Button } from 'react-bootstrap';
import Pagination from "@/components/Pagination";

import { InputGroup, FormControl } from "react-bootstrap";
import Toolbar from "@/components/Toolbar";
import ActionModal from "@/components/ActionModal";
import FormInput from "@/components/FormInput";
const sampleData = Array.from({ length: 50 }, (_, index) => ({
    id: index + 1,
    name: `Product ${index + 1}`,
    category: `Category ${index % 5 + 1}`,
}));

const ITEMS_PER_PAGE = 10; // Number of rows per page

import { useGetLeaveTypesQuery, useCreateLeaveTypeMutation } from "@/store/slice/leaveTypeApi";
import PageNumber from "@/components/PageNumber";
import SettingsModal from "./SettingsModal";
import AdvancedSearch from "./AdvancedSearch";
import InputFormField from "@/components/InputFormField";
import InputSelectField from "@/components/InputSelectField";
import { validationRequest, ValidationRules, ValidationErrors } from "@/utils/validationRequest";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

import { DndContext, closestCenter } from "@dnd-kit/core";
import { SortableContext, verticalListSortingStrategy, useSortable, arrayMove } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import ColumnSelector from "./ColumnSelector";
import TableComponent from "./TableComponent";
const Index: React.FC = () => {
    const [show, setShow] = useState(false);
    const [page, setPage] = useState(1);
    const [filter, setFilter] = useState("");

    // Fetch Leave Types with pagination & filter
    const { data: dataRecords, error: fetchError, isLoading: isFetching } = useGetLeaveTypesQuery({ limit: 10, page, filter });
    const [createLeaveType, { isLoading: isSubmitting, error: submitError }] = useCreateLeaveTypeMutation();
    const { products, total, limit } = dataRecords || { products: [], total: 0, limit: 0, skip: 0 };
    const handleClose = () => setShow(false);
    // Local state to store filtered leave types
    const [filteredLeaveTypes, setFilteredLeaveTypes] = useState<any[]>([]);

    // useEffect to process data after fetching
    useEffect(() => {
        if (dataRecords) {
            console.log("Fetched Leave Types:", dataRecords); // Debugging
            setFilteredLeaveTypes(dataRecords.products.filter((type: any) => type.active));
            console // Example: Filtering active leave types
        }
    }, [dataRecords]); // Runs when `leaveTypes` changes

    const handleShow = () => setShow(true);
    const [currentPage, setCurrentPage] = useState(0);
    const totalPages = limit;  // Example total pages
    const totalCount = total;  // Example total records

    const handlePageChange = (newPage: number) => {
        if (newPage >= 0 && newPage < totalPages) {
            setCurrentPage(newPage);
        }
    };
    const paginatedData = sampleData.slice(
        currentPage * ITEMS_PER_PAGE,
        (currentPage + 1) * ITEMS_PER_PAGE
    );
    const handleRefresh = () => {
        console.log("Refreshing data...");
        // Add your refresh logic here (API call, state update, etc.)
    };
    const [formData, setFormData] = useState({ name: "", code: "", alias: "", isStatus: "Y" });
    const [errors, setErrors] = useState<{ name?: string; code?: string; alias?: string }>({});


    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
        setErrors({ ...errors, [e.target.name]: "" });
    };

    const validationRules: ValidationRules = {
        name: { required: true, minLength: 3 },
        code: { required: true, minLength: 2, maxLength: 10 },
    };

    const handleFormSubmit = async () => {
        const { isValid, errors } = validationRequest(formData, validationRules);
        setErrors(errors);
        if (!isValid) {
            toast.error("Please fill in all mandatory fields.", { position: "top-right", autoClose: 3000 });
            console.log("Created Successfully Successfully:", errors);
            return;
        }

        try {
            const newLeave = { title: formData.name };
            const response = await createLeaveType(newLeave).unwrap();
            toast.success("Leave type created successfully!", { position: "top-right", autoClose: 3000 });
            console.log("Created Successfully:", response);
            handleClose();
        } catch (err: any) {
            const apiError = err?.data?.message || "Error creating leave type. Please try again.";
            setErrors((prevErrors) => ({
                ...prevErrors,
                apiError,
            }));
            toast.error(apiError, { position: "top-right", autoClose: 3000 });
            console.error("Error creating leave type:", err);
        }
    };


    const openFormModal = () => {
        setErrors({});
        setShow(true);
    };


    const handleFilter = (page: number) => {
        // const startIndex = (page - 1) * itemsPerPage;
        // const filteredData = allData.slice(startIndex, startIndex + itemsPerPage);
        // setDisplayedData(filteredData);
    };
    const allData = [
        { id: 1, name: "Alice", age: 25, city: "New York" },
        { id: 2, name: "Bob", age: 30, city: "Los Angeles" },
        { id: 3, name: "Charlie", age: 35, city: "Chicago" },
        { id: 4, name: "David", age: 40, city: "Houston" },
        { id: 5, name: "Eve", age: 45, city: "Miami" },
        // Add more data...
    ];

    const availableColumns = ["id", "name", "age", "city"];


    const [itemsPerPage, setItemsPerPage] = useState(10);

    // const [selectedColumns, setSelectedColumns] = useState(availableColumns);
    const [isSettingsOpen, setIsSettingsOpen] = useState(false);

    // const handlePageChange = (page: number) => {
    //     setCurrentPage(page);
    // };
    const [isPreferencesOpen, setIsPreferencesOpen] = useState(false);
    const [isSearchOption, setIsSearchOption] = useState(false);
    const onPreference = () => setIsSettingsOpen(true);

    const options = [
        { value: "apple", label: "Apple" },
        { value: "banana", label: "Banana" },
        { value: "cherry", label: "Cherry" },
        { value: "cherry", label: "Cherry" },
        { value: "cherry", label: "Cherry" },
        { value: "cherry", label: "Cherry" },


        { value: "cherry", label: "Cherry" },
        { value: "cherry", label: "Cherry" },
        { value: "cherry", label: "Cherry" },
        { value: "cherry", label: "Cherry" },
        { value: "cherry", label: "Cherry" },
        { value: "cherry", label: "Cherry" },
        { value: "cherry", label: "Cherry" },

    ];

    const handleSelectChange = (selectedOption: any, name: string) => {
        setFormData((prev) => ({ ...prev, [name]: selectedOption?.value || "" }));  // Clear error on selection
    };

    const allColumns = [
        { key: "id", label: "ID" },
        { key: "title", label: "Name" },
        { key: "category", label: "Category" },
        { key: "price", label: "Price" }, // Extra column example
    ];

    // State to manage selected columns (User preference)
    const [selectedColumns, setSelectedColumns] = useState(["id", "title", "category"]);
    // const [selectedColumns, setSelectedColumns] = useState([
    //     { key: "id", label: "ID" },
    //     { key: "name", label: "Name" },
    //     { key: "category", label: "Category" }
    // ]);

    const sampleDataRecords = [
        { id: 1, name: "Alice", category: "Admin" },
        { id: 2, name: "Bob", category: "User" },
        { id: 3, name: "Charlie", category: "Guest" }
    ];

    return <section>
        <Toolbar
            title="Leave Request"
            currentPage={currentPage}
            totalPages={totalPages}
            totalCount={totalCount}
            onPageChange={handlePageChange}
            onSearch={(query) => console.log("Search query:", query)}
            onRefresh={handleRefresh}
            onAdd={openFormModal}
            onPreference={() => setIsSettingsOpen(true)}
            advancedSearch={() => setIsPreferencesOpen(true)}
        />
        {/* {
            isPreferencesOpen && (
                <AdvancedSearch
                    isOpen={isPreferencesOpen}
                    onClose={() => setIsPreferencesOpen(false)}
                    itemsPerPage={itemsPerPage}
                    setItemsPerPage={setItemsPerPage}
                    availableColumns={availableColumns}
                    selectedColumns={selectedColumns}
                    setSelectedColumns={setSelectedColumns}
                >
                    <div>
                        <label>Search:</label>
                        <input type="text" placeholder="Enter search query..." />
                        <input type="text" placeholder="Enter search query..." />
                        <input type="text" placeholder="Enter search query..." />
                    </div>
                </AdvancedSearch>
            )
        } */}

        
        <SettingsModal
            isOpen={isSettingsOpen}
            onClose={() => setIsSettingsOpen(false)}
            itemsPerPage={itemsPerPage}
            setItemsPerPage={setItemsPerPage}
            availableColumns={availableColumns}
            selectedColumns={selectedColumns}
            setSelectedColumns={setSelectedColumns}
        />

        {/* <ColumnSelector selectedColumns={selectedColumns} setSelectedColumns={setSelectedColumns} /> */}
         
        <ActionModal
            show={show}
            title="Add Leave Request"
            formData={formData}
            errors={errors}
            onClose={handleClose}
            onSubmit={handleFormSubmit}
            onChange={handleChange}
            isSubmitting={isSubmitting}
        >
            {/* <InputSelectField
                name="fruit"
                label="Select a Fruit"
                options={options}
                value={formData.isStatus}
                onChange={handleSelectChange}
                isEdit={true}
                error={errors.name}
                required={true}
                isLoading={false}
                formData={formData}
            /> */}
            <InputFormField label="Name" name="name" inputValue={formData.name} error={errors.name} required onChange={handleChange} />
            <InputFormField label="Code" name="code" inputValue={formData.code} error={errors.code} required onChange={handleChange} />
            <InputFormField label="Alias" name="alias" inputValue={formData.alias} error={errors.alias} onChange={handleChange} />
        </ActionModal>
        {/* <TableComponent data={sampleDataRecords} /> */}
        {/* <div className="table-container table-responsive tableReponsivecontainer">
                <table className="table table-bordered">
                    <thead className="table-header-bg text-white" style={{ position: "sticky", top: 0, backgroundColor: "#32ab9b" }}>
                        <tr>
                            {selectedColumns.map((colKey) => {
                                const column = allColumns.find((c) => c.key === colKey);
                                return <th key={colKey}>{column?.label}</th>;
                            })}
                        </tr>
                    </thead>
                    <tbody>
                        {isFetching ? (
                            <tr>
                                <td colSpan={selectedColumns.length} className="text-center">
                                    <div className="d-flex justify-content-center align-items-center" style={{ height: "200px", width: "100%" }}>
                                        <div className="spinner-border text-primary" role="status">
                                            <span className="visually-hidden">Loading...</span>
                                        </div>
                                    </div>
                                </td>
                            </tr>
                        ) : (
                            dataRecords?.products?.map((item: any) => (
                                <tr key={item.id}>
                                    {selectedColumns.map((colKey) => (
                                        <td key={colKey}>{item[colKey]}</td>
                                    ))}
                                </tr>
                            ))
                        )}
                    </tbody>
                </table>
            </div> */}

      
        <PageNumber
            currentPage={currentPage}
            totalPages={totalPages}
            handlePageChange={handlePageChange}
            handleFilter={handleFilter}
            totalCount={totalCount}
        />

    </section>
};

export default Index;
