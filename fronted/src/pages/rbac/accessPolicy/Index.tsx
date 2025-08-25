import React, { useEffect, useState } from "react";
import Toolbar from "@/components/Toolbar";
import TableComponent from "@/components/Table/TableComponent";
import PageNumber from "@/components/PageNumber";
import SettingsModal from "@/components/Table/SettingsModal";
import AdvancedFilter from "@/components/AdvancedFilter";
import InputFormField from "@/components/InputFormField";
import { useGetPermissionsQuery } from "@/store/slice/permissions";
import { Column } from "@/utils/helper";
import AddEditForm from "./AddEditForm";
import { useGetColumnsQuery } from "@/store/slice/columns";
import { skipToken } from "@reduxjs/toolkit/query";
import { useDispatch } from "react-redux";
import { setBreadcrumbs } from "@/store/slice/bredCrumbs";
import { useGetPoliciesQuery } from "@/store/slice/access-policy/policies";
import { FilterKey, Operator } from "@/components/SearchWithOperators";

const Index: React.FC = () => {
  const [filter, setFilter] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(setBreadcrumbs(["Access Policies"]));
  }, [dispatch]);
  const { data: referenceRecord, isFetching: isRefFetching } = useGetColumnsQuery(
    { type: "policies", user_id: 1 },
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
  const { data: dataRecords, isFetching, refetch } = useGetPoliciesQuery(
    itemsPerPage ? { limit: itemsPerPage, page: currentPage, filter } : skipToken,
    { refetchOnMountOrArgChange: true }
  );


  const items = dataRecords?.items || [];
  const totalCount = dataRecords?.totalCount || 0;
  const safeItemsPerPage: number = itemsPerPage ?? 10;
  const totalPages = Math.ceil(totalCount / safeItemsPerPage);

  const handlePageChange = (newPage: number) => {
    if (newPage >= 1 && newPage <= totalPages) {
      setCurrentPage(newPage);
    }
  };

  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [isPreferencesOpen, setIsPreferencesOpen] = useState(false);
  const [openForm, setOpenForm] = useState(false);
  const [isEdidForm, setIsEditForm] = useState<any>(false);
  const [formData, setFormData] = useState<any>(null);
  useEffect(() => {
    setFormData(formData);
  }, [formData]);

  useEffect(() => {
    setIsEditForm(isEdidForm);
  }, [isEdidForm]);

  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  const [selectedItems, setSelectedItems] = useState<any[]>([]);

 const handleSearch = (key: FilterKey, operator: Operator, value: string) => {
    console.log('Filter by form', key, operator, value)
    if (key && operator && value) {
    }
  };

  const onClear = () => {
  };
  return (
    <>
      <SettingsModal
        isOpen={isSettingsOpen}
        onClose={() => setIsSettingsOpen(false)}
        itemsPerPage={safeItemsPerPage}
        setItemsPerPage={setItemsPerPage}
        allColumns={allColumns}
        type="policies"
      />

      <div className="shadow-lg p-2">
        {/* Toolbar */}
        <Toolbar
          currentPage={currentPage}
          totalPages={totalPages}
          totalCount={totalCount}
          itemsPerPage={itemsPerPage}
          onPageChange={handlePageChange}
          onSearch={handleSearch}
          onRefresh={refetch}
          onAdd={() => { setIsEditForm(false); setOpenForm(true); }}
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
          setFormData={setFormData}
          isFetching={isFetching}
          data={items}
          allColumns={allColumns}
          selectedIds={selectedIds}
          setSelectedIds={setSelectedIds}
          setIsEditForm={setIsEditForm}
          setSelectedItems={setSelectedItems}
          rowIdKey="mst_permission_id"
        />

        {/* Add/Edit Form */}
        <AddEditForm
          open={openForm}
          onClose={() => setOpenForm(false) }
          initialData={formData}
          isEdit={isEdidForm}
          onSuccess={refetch}
          setIsEditForm={setIsEditForm}
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
