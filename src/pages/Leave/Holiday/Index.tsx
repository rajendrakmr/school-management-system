
import React, { useEffect, useState } from "react";
import Toolbar from "@/components/Toolbar";
import { useGetLeaveTypesQuery, useCreateLeaveTypeMutation } from "@/store/slice/leaveTypeApi";
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

const Index: React.FC = () => {
    const [filter, setFilter] = useState("");
    const [currentPage, setCurrentPage] = useState(1);
    const [itemsPerPage, setItemsPerPage] = useState(10);
    const { data: dataRecords, error: fetchError, isLoading, isFetching, refetch } = useGetLeaveTypesQuery({ limit: itemsPerPage, page: currentPage, filter }, { refetchOnMountOrArgChange: true });
    const { products = [], total: totalCount = 0 } = dataRecords || {};
    const totalPages = Math.ceil(totalCount / itemsPerPage);
    const handlePageChange = (newPage: number) => {
        if (newPage >= 1 && newPage <= totalPages) {
            setCurrentPage(newPage);
        }
    };
    const [createLeaveType, { isLoading: isSubmitting, error: submitError }] = useCreateLeaveTypeMutation();



    const handleRefresh = () => { 
    };








    const handleFilter = (page: number) => {
    };

    const [isSettingsOpen, setIsSettingsOpen] = useState(false);
    const [isPreferencesOpen, setIsPreferencesOpen] = useState(false);





    // ************************* FORM SECTIONS****************************************
    // *******************************************************************************

    const [formData, setFormData] = useState<FormDataType>({
        title: "",
        price: "",
        alias: "",
        isStatus: "Y"
    });
    const [errors, setErrors] = useState<Partial<FormDataType>>({});
    const validationRules: ValidationRules = {
        title: { required: true, minLength: 3 },
        price: { required: true, minLength: 2, maxLength: 10 },
    };
    const handleFormSubmit = async () => {
        const { isValid, errors } = validationRequest(formData, validationRules);
        setErrors(errors); 
        if (!isValid) {
            toast.error("Please fill in all mandatory fields.", { position: "top-right", autoClose: 3000 });
            
            return;
        }

        try {
            const newLeave = { title: formData.title };
            const response = await createLeaveType(newLeave).unwrap();
            toast.success("Leave type created successfully!", { position: "top-right", autoClose: 3000 });
            

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
        { key: "title", label: "Title Name", order: 2, isActive: true },
        { key: "price", label: "Price", order: 3, isActive: true },
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
                        <InputFormField label="Name" name="title" inputValue={formData.title} error={errors.title} required onChange={handleChange} />
                        <InputFormField label="Price" name="price" inputValue={formData.title} error={errors.title} required onChange={handleChange} />
                    </div>

                </AdvancedFilter>
            )
        }


        <TableComponent setOpenSliderForm={setOpenSliderForm} setFormData={setFormData} isFetching={isFetching} data={products} allColumns={mergedColumns} selectedIds={selectedIds} setSelectedIds={setSelectedIds} setSelectedItems={setSelectedItems} />
        <SliderForm
            show={openSliderForm}
            onClose={() => setOpenSliderForm(false)}
            title="Add Leave Request"
            errors={errors}
            onSubmit={handleFormSubmit}
            onChange={handleChange}
            isSubmitting={isSubmitting}
        >
           
                <RowFormInputField label="Name" name="title" inputValue={formData.title} error={errors.title} required onChange={handleChange} />
                <RowFormInputField label="Code" name="price" inputValue={formData.price} error={errors.price} required onChange={handleChange} />
                <RowFormInputField label="Alias" name="alias" inputValue={formData.alias} error={errors.alias} onChange={handleChange} />
          
        </SliderForm>



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
