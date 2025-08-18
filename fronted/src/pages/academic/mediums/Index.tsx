import React, { useEffect, useState } from "react";
import Toolbar from "@/components/Toolbar";
import TableComponent from "@/components/Table/TableComponent";
import PageNumber from "@/components/PageNumber";
import SettingsModal from "@/components/Table/SettingsModal";
import AdvancedFilter from "@/components/AdvancedFilter";
import InputFormField from "@/components/InputFormField";
import { useGetSchoolsQuery } from "@/store/slice/school";
import { Column } from "@/utils/helper";
import AddEditForm from "./AddEditForm";
import { useGetColumnsQuery } from "@/store/slice/columns";
import { skipToken } from "@reduxjs/toolkit/query";
import { useDispatch } from "react-redux";
import { setBreadcrumbs } from "@/store/slice/bredCrumbs";
import { useGetMediumsQuery } from "@/store/slice/academics/mediums";

const Index: React.FC = () => {
  const [filter, setFilter] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(setBreadcrumbs(["Medium"]));
  }, [dispatch]);
  const { data: referenceRecord, isFetching: isRefFetching } = useGetColumnsQuery(
    { type: "mediums", user_id: 1 },
    { refetchOnMountOrArgChange: true }
  );

  const allColumns: Column[] = referenceRecord?.columns || [];
  const [itemsPerPage, setItemsPerPage] = useState<number | undefined>(undefined);
  useEffect(() => {
    if (referenceRecord?.page_size) {
      setItemsPerPage(referenceRecord.page_size);
    }
  }, [referenceRecord]);

  // roles API call tabhi trigger ho jab itemsPerPage set ho
  const { data: dataRecords, isFetching, refetch } = useGetMediumsQuery(
    itemsPerPage ? { limit: itemsPerPage, page: currentPage, filter } : skipToken,
    { refetchOnMountOrArgChange: true }
  );


  // Console log for debugging


 
  // Extract roles and total count from API response
  const items = dataRecords?.items || [];
  const totalCount = dataRecords?.totalCount || 0; // adjust to your API field
  //  const totalPages = Math.ceil(totalCount / (itemsPerPage || 10));
  const safeItemsPerPage: number = itemsPerPage ?? 10;

  // totalPages calculate karte waqt
  const totalPages = Math.ceil(totalCount / safeItemsPerPage);

  const handlePageChange = (newPage: number) => {
    if (newPage >= 1 && newPage <= totalPages) {
      setCurrentPage(newPage);
    }
  };

  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [isPreferencesOpen, setIsPreferencesOpen] = useState(false);
  const [openForm, setOpenForm] = useState(false);
  const [editData, setEditData] = useState<any>(null);
  const [formData, setFormData] = useState<any>(null);
  useEffect(() => {
    setFormData(formData);
  }, [formData]);
  // const allColumns: Column[] = [ 
  //   { key: "role_name", label: "Role Name", order: 2, isActive: true },
  //   { key: "role_description", label: "Description", order: 3, isActive: true },
  //   { key: "isActive", label: "Status", order: 3, isActive: true },
  //   { key: "action", label: "Action", order: 4, isActive: true },
  // ];



  // const savedColumns = localStorage.getItem("selectedColumns");
  // let userColumns: Column[] = savedColumns ? JSON.parse(savedColumns) : [];
  // const mergedColumns = allColumns.map((defaultCol) => {
  //   const userCol = userColumns.find((col: Column) => col.column_key === defaultCol.column_key);
  //   return userCol ? { ...defaultCol, ...userCol } : defaultCol;
  // });
  const [isEdidForm, setIsEditForm] = useState<any>(false);

  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  const [selectedItems, setSelectedItems] = useState<any[]>([]);

  console.log('formData', formData)
  return (
    <>
      <SettingsModal
        isOpen={isSettingsOpen}
        onClose={() => setIsSettingsOpen(false)}
        itemsPerPage={safeItemsPerPage}
        setItemsPerPage={setItemsPerPage}
        allColumns={allColumns}
        type="mediums"
      />

      <div className="shadow-lg p-2">
        {/* Toolbar */}
        <Toolbar
          currentPage={currentPage}
          totalPages={totalPages}
          totalCount={totalCount}
          itemsPerPage={itemsPerPage}
          onPageChange={handlePageChange}
          onSearch={(query) => setFilter(query)}
          onRefresh={refetch}
          onAdd={() => {
            setEditData(null);
            setOpenForm(true);
          }}
          onPreference={() => setIsSettingsOpen(true)}
          advancedSearch={() => setIsPreferencesOpen(!isPreferencesOpen)}
        />
        {selectedIds.length > 0 && (
          <span className="small p-2">
            ✅ {selectedIds.length} selected from this page.
          </span>
        )}

        {isPreferencesOpen && (
          <AdvancedFilter isOpen={isPreferencesOpen} onClose={() => setIsPreferencesOpen(false)}>
            <div className="row">
              <InputFormField
                label="Role Name"
                name="role_name"
                inputValue=""
                error={""}
                required
                onChange={() => { }}
              />
              <InputFormField
                label="Description"
                name="role_description"
                inputValue=""
                error={""}
                required
                onChange={() => { }}
              />
            </div>
          </AdvancedFilter>
        )}

        {/* Table */}
        <TableComponent
          setOpenSliderForm={setOpenForm}
          setIsEditForm={setIsEditForm}
          setFormData={setFormData}
          isFetching={isFetching}
          data={items}
          allColumns={allColumns}
          selectedIds={selectedIds}
          setSelectedIds={setSelectedIds}
          setSelectedItems={setSelectedItems}
          rowIdKey="mst_medium_id"
        />

        {/* Add/Edit Form */}
        <AddEditForm
          open={openForm}
          onClose={() => setOpenForm(false)}
          initialData={formData}
          onSuccess={refetch}
        />


        {/* Pagination */}
        {totalCount > safeItemsPerPage && (
          <PageNumber
            currentPage={currentPage}
            totalPages={totalPages}
            handlePageChange={handlePageChange}
            handleFilter={() => { }}
            totalCount={totalCount}
          />
        )}
      </div>
    </>
  );
};

export default Index;
