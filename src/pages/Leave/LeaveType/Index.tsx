
import React, { useEffect, useState } from "react";
import Toolbar from "@/components/Toolbar";
import { useGetLeaveTypesQuery, useCreateLeaveTypeMutation, useUpdateLeaveTypeMutation } from "@/store/slice/leaveTypeApi";
import PageNumber from "@/components/PageNumber";
import { validationRequest, ValidationRules, ValidationErrors } from "@/utils/validationRequest";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import TableComponent from "@/components/Table/TableComponent";
import SettingsModal from "@/components/Table/SettingsModal";
import { Column } from "@/utils/helper";
import SliderForm from "@/components/Form/SliderForm";
import RowFormInputField from "@/components/Form/RowFormInputField";
import { FormDataType } from "./type";
import AdvancedFilter from "@/components/AdvancedFilter";
import InputFormField from "@/components/InputFormField";
import { data } from "react-router-dom";
import RowFormSelectField from "@/components/Form/RowFormSelectField";

const Index: React.FC = () => {
    const [filter, setFilter] = useState("");
    const [currentPage, setCurrentPage] = useState(1);
    const [itemsPerPage, setItemsPerPage] = useState(10);
    const { data: dataRecords, error: fetchError, isLoading, isFetching, refetch } = useGetLeaveTypesQuery({ limit: itemsPerPage, page: currentPage, filter }, { refetchOnMountOrArgChange: true });

    const { records = [], total: totalCount = 0 } = dataRecords || {};
    const totalPages = Math.ceil(totalCount / itemsPerPage);
    const handlePageChange = (newPage: number) => {
        if (newPage >= 1 && newPage <= totalPages) {
            setCurrentPage(newPage);
        }
    };
    const [createLeaveType, { isLoading: isCreating, error: createError }] = useCreateLeaveTypeMutation();
    const [updateLeaveType, { isLoading: isUpdating, error: updateError }] = useUpdateLeaveTypeMutation();

    const handleRefresh = () => {
        console.log("Refreshing data...");
    };







    const handleFilter = (page: number) => {
    };

    const [isSettingsOpen, setIsSettingsOpen] = useState(false);
    const [isPreferencesOpen, setIsPreferencesOpen] = useState(false);





    // ************************* FORM SECTIONS****************************************
    // *******************************************************************************
    const formBody = {
        name: "",
        id: "",
        code: "",
        description: "",
        accrual_rate: 5,
        status: "active"
    };
    const [formData, setFormData] = useState<FormDataType>(formBody);
    const [errors, setErrors] = useState<Partial<FormDataType>>({});
    const validationRules: ValidationRules = {
        // desc: { required: true, minLength: 3 },
        name: { required: true, minLength: 2, maxLength: 30 },
    };
    const handleFormSubmit = async () => {
        const { isValid, errors } = validationRequest(formData, validationRules);
        setErrors(errors);

        if (!isValid) {
            toast.error("Please fill in all mandatory fields.", { position: "top-right", autoClose: 3000 });
            console.log("Validation Errors:", errors);
            return;
        }

        try {
            let response;

            if (formData.id) {
                // Ensure ID is passed separately for update
                response = await updateLeaveType(formData).unwrap();
            } else {
                response = await createLeaveType(formData).unwrap();
            }

            toast.success(response.message || "Operation successful!", { position: "top-right", autoClose: 3000 });
            console.log("Success:", response);

            setOpenSliderForm(false);
        } catch (err: any) {
            console.error("Error occurred while processing leave type:", err);

            let apiError = "Unable to process request. Please try again.";
            if (err?.status === 422 && err?.data?.errors) {
                setErrors(err.data.errors);
                apiError = "Please correct the highlighted errors.";
            } else if (err?.data?.message) {
                apiError = err.data.message;
            }

            setErrors((prevErrors) => ({
                ...prevErrors,
                apiError,
            }));

            toast.error(apiError, { position: "top-right", autoClose: 3000 });
        }
    };



    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setFormData((prevData) => {
            const updatedIndentItemList = {
                [e.target.name]: e.target.value
            };
            return { ...prevData, ...updatedIndentItemList };
        });
        setErrors({ ...errors, [e.target.name]: "" });
    };

    // table header
    const allColumns = [
        { key: "action", label: "Action", order: 5, isActive: true },
        { key: "status", label: "Status", order: 4, isActive: true },
        { key: "id", label: "ID", order: 1, isActive: true },
        { key: "name", label: "Name", order: 2, isActive: true },
        { key: "code", label: "Code", order: 3, isActive: true },
        { key: "description", label: "Description", order: 6, isActive: true },
    ];
    const savedColumns = localStorage.getItem("selectedColumns");
    let userColumns: Column[] = [];
    if (savedColumns) {
        userColumns = JSON.parse(savedColumns);
    }
    const mergedColumns = allColumns.map((defaultCol) => {
        const userCol = userColumns.find((col: Column) => col.key === defaultCol.key);
        return userCol ? { ...defaultCol, ...userCol } : defaultCol;
    });

    const [openSliderForm, setOpenSliderForm] = useState(false);
    const [selectedIds, setSelectedIds] = useState<string[]>([]);
    const [selectedItems, setSelectedItems] = useState<Record<string, any>[]>([]);

    const options = [
        { value: "active", label: "Active" },
        { value: "inactive", label: "In Active" },
    ];
    const handleSelectChange = (selectedOption: any, name: string) => {
        setFormData((prev) => ({ ...prev, [name]: selectedOption?.value || "" }));
    };
    return <section>
        <SettingsModal
            isOpen={isSettingsOpen}
            onClose={() => setIsSettingsOpen(false)}
            itemsPerPage={itemsPerPage}
            setItemsPerPage={setItemsPerPage}
            allColumns={allColumns}
        />
        <Toolbar
            title="Leave Request"
            currentPage={currentPage}
            totalPages={totalPages}
            totalCount={totalCount}
            itemsPerPage={itemsPerPage}
            onPageChange={handlePageChange}
            onSearch={(query) => console.log("Search query:", query)}
            onRefresh={handleRefresh}
            onAdd={() => {
                setErrors({});
                setOpenSliderForm(true);
                setFormData(formBody);
            }}

            onPreference={() => setIsSettingsOpen(true)}
            advancedSearch={() => setIsPreferencesOpen(!isPreferencesOpen)}
        />
        {
            isPreferencesOpen && (
                <AdvancedFilter
                    isOpen={isPreferencesOpen}
                    onClose={() => setIsPreferencesOpen(false)}
                >

                    <div className="row">
                        <InputFormField label="Name" name="name" inputValue={formData.name} error={errors.name} required onChange={handleChange} />
                        <InputFormField label="Price" name="code" inputValue={formData.code} error={errors.code} required onChange={handleChange} />
                    </div>

                </AdvancedFilter>
            )
        }


        <TableComponent setOpenSliderForm={setOpenSliderForm} setFormData={setFormData} isFetching={isFetching} data={records} allColumns={mergedColumns} selectedIds={selectedIds} setSelectedIds={setSelectedIds} setSelectedItems={setSelectedItems} />
        <SliderForm
            show={openSliderForm}
            onClose={() => setOpenSliderForm(false)}
            title={formData?.id ? "Edit Leave Request" : "Add Leave Request"}
            errors={errors}
            onSubmit={handleFormSubmit}
            onChange={handleChange}
            isSubmitting={isCreating || isUpdating}
        >

            <RowFormInputField label="Name" name="name" inputValue={formData.name} error={errors.name} required onChange={handleChange} />
            <RowFormInputField label="Code" name="code" inputValue={formData.code} error={errors.code} required onChange={handleChange} />
            <RowFormInputField label="Description" name="description" inputValue={formData.description} error={errors.description} onChange={handleChange} />
            {/* <RowFormInputField label="Alias" name="alias" inputValue={formData.description} error={errors.description} onChange={handleChange} /> */}
            <RowFormSelectField
                name="status"
                label="Staus"
                options={options}
                value={formData.status}
                onChange={handleSelectChange}
                isEdit={true}
                error={errors.status}
                required={true}
                isLoading={false}
                formData={formData}
            />
        </SliderForm>


        {
            totalCount > itemsPerPage &&
            <PageNumber
                currentPage={currentPage}
                totalPages={totalPages}
                handlePageChange={handlePageChange}
                handleFilter={handleFilter}
                totalCount={totalCount}
            />

        }


    </section>
};

export default Index;
