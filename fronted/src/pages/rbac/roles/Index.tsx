import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { skipToken } from "@reduxjs/toolkit/query";
import Toolbar from "@/components/Toolbar";
import TableComponent from "@/components/Table/TableComponent";
import PageNumber from "@/components/PageNumber";
import SettingsModal from "@/components/Table/SettingsModal";
import AdvancedFilter from "@/components/AdvancedFilter";
import InputFormField from "@/components/InputFormField";
import AddEditForm from "./AddEditForm";
import { useGetRolesQuery } from "@/store/slice/role";
import { useGetColumnsQuery } from "@/store/slice/columns";
import { setBreadcrumbs } from "@/store/slice/bredCrumbs";
import { RootState } from "@/store";
import { Column, hasFilledField } from "@/utils/helper";
import { FilterKey, Operator } from "@/components/SearchWithOperators";

const Index: React.FC = () => {
  const dispatch = useDispatch();
  const usersInfo = useSelector((state: RootState) => state.user.user || {});
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState<number | undefined>(undefined);

  const [searchParams, setSearchParams] = useState({ limit: 10, page: 1 });
  const [searchFilter, setSearchFilter] = useState<{ key?: string; operator?: string; value?: string }>({});

  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [isPreferencesOpen, setIsPreferencesOpen] = useState(false);
  const [openForm, setOpenForm] = useState(false);
  const [editData, setEditData] = useState<any>(null);
  const [formData, setFormData] = useState<any>(null);
  const [isEditForm, setIsEditForm] = useState(false);
  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  const [selectedItems, setSelectedItems] = useState<any[]>([]);

  // Columns from API
  const { data: referenceRecord } = useGetColumnsQuery(
    { type: "roles", user_id: usersInfo?.trn_user_id },
    { refetchOnMountOrArgChange: true }
  );
  const allColumns: Column[] = referenceRecord?.columns || [];

  useEffect(() => {
    if (referenceRecord?.page_size) setItemsPerPage(referenceRecord.page_size);
  }, [referenceRecord]);

  // Data fetch
  const { data: dataRecords, isFetching, refetch } = useGetRolesQuery(searchParams, { refetchOnMountOrArgChange: true });
  const items = dataRecords?.items || [];
  const totalCount = dataRecords?.totalCount || 0;
  const safeItemsPerPage: number = itemsPerPage ?? 10;
  const totalPages = Math.ceil(totalCount / safeItemsPerPage);

  const handlePageChange = (newPage: number) => {
    if (newPage >= 1 && newPage <= totalPages) {
      setCurrentPage(newPage);
      setSearchParams(prev => ({ ...prev, page: newPage }));
    }
  };

  const handleSearch = (key: FilterKey, operator: Operator, value: string) => {
  // Only trigger if all three are provided
  console.log('Filter by form',key,operator,value)
  if (key && operator && value) {
    // setSearchFilter({ key: key.value, operator: operator.value, value });
    setSearchParams({
      limit: safeItemsPerPage,
      page: 1,
      // key: key.value,
      // operator: operator.value,
      // value,
    });
    refetch();
  }
};

  const onClear = () => {
    setSearchFilter({});
    setSearchParams({ limit: safeItemsPerPage, page: 1 });
    refetch();
  };

  useEffect(() => {
    dispatch(setBreadcrumbs(["Role Details"]));
  }, [dispatch]);

  return (
    <>
      <SettingsModal
        isOpen={isSettingsOpen}
        onClose={() => setIsSettingsOpen(false)}
        itemsPerPage={safeItemsPerPage}
        setItemsPerPage={setItemsPerPage}
        allColumns={allColumns}
        type="roles"
      />

      <div className="shadow-lg p-2">
        {/* Toolbar */}
        <Toolbar
          columns={allColumns}
          title="Roles"
          currentPage={currentPage}
          totalPages={totalPages}
          totalCount={totalCount}
          itemsPerPage={itemsPerPage}
          onPageChange={handlePageChange}
          onSearch={handleSearch}
          onRefresh={refetch}
          onAdd={() => { setEditData(null); setOpenForm(true); }}
          onPreference={() => setIsSettingsOpen(true)}
          advancedSearch={() => setIsPreferencesOpen(!isPreferencesOpen)}
        />

        {selectedIds.length > 0 && (
          <span className="small p-2">
            ✅ {selectedIds.length} selected from this page.
          </span>
        )}

        {isPreferencesOpen && (
          <AdvancedFilter
            onClear={onClear}
            hasFilled={hasFilledField(searchFilter)}
            onSearch={() => refetch()}
            onSearching={isFetching}
            isOpen={isPreferencesOpen}
            onClose={() => setIsPreferencesOpen(false)}
          >
            <div className="row">
              <InputFormField
                label="Role Name"
                name="name"
                inputValue={searchFilter.key || ""}
                error={""}
                onChange={(e) => setSearchFilter(prev => ({ ...prev, key: e.target.value }))}
              />
              <InputFormField
                label="Description"
                name="desc"
                inputValue={searchFilter.value || ""}
                error={""}
                onChange={(e) => setSearchFilter(prev => ({ ...prev, value: e.target.value }))}
              />
            </div>
          </AdvancedFilter>
        )}

        {/* Data table */}
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
          rowIdKey="mst_role_id"
        />

        {/* Add/Edit Form */}
        <AddEditForm
          open={openForm}
          onClose={() => setOpenForm(false)}
          initialData={formData}
          isEdit={isEditForm}
          onSuccess={refetch}
          setIsEditForm={setIsEditForm}
        />

        {/* Pagination */}
        {totalCount > safeItemsPerPage && (
          <PageNumber
            currentPage={currentPage}
            totalPages={totalPages}
            handlePageChange={handlePageChange}
            handleFilter={() => {}}
            totalCount={totalCount}
          />
        )}
      </div>
    </>
  );
};

export default Index;
