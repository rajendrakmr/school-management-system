import React, { useEffect, useState, useMemo, useCallback } from "react";
import { useDispatch } from "react-redux";
import { skipToken } from "@reduxjs/toolkit/query";

import Toolbar from "@/components/Toolbar";
import TableComponent from "@/components/Table/TableComponent";
import PageNumber from "@/components/PageNumber";
import SettingsModal from "@/components/Table/SettingsModal";
import AdvancedFilter from "@/components/AdvancedFilter";
import InputFormField from "@/components/InputFormField";
import AddEditForm from "./AddEditForm";
import { Column } from "@/utils/helper";
import { setBreadcrumbs } from "@/store/slice/bredCrumbs";
import { useGetColumnsQuery } from "@/store/slice/columns";
import { useGetSectionsQuery } from "@/store/slice/academics/sections";
import { FilterKey, Operator } from "@/components/SearchWithOperators";

const Index: React.FC = () => {
  const dispatch = useDispatch();

  const [filter, setFilter] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState<number | undefined>(undefined);

  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [isPreferencesOpen, setIsPreferencesOpen] = useState(false);
  const [openForm, setOpenForm] = useState(false);
  const [formData, setFormData] = useState<any>(null);
  const [isEditForm, setIsEditForm] = useState(false);

  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  const [selectedItems, setSelectedItems] = useState<any[]>([]);
  const pagetitle = "Section"
  // Set breadcrumbs once
  useEffect(() => {
    dispatch(setBreadcrumbs([pagetitle]));
  }, [dispatch]);

  // Fetch columns
  const { data: referenceRecord } = useGetColumnsQuery(
    { type: "sections", user_id: 1 },
    { refetchOnMountOrArgChange: true }
  );

  const allColumns: Column[] = useMemo(() => referenceRecord?.columns || [], [referenceRecord]);

  useEffect(() => {
    if (referenceRecord?.page_size) setItemsPerPage(referenceRecord.page_size);
  }, [referenceRecord]);

  // Fetch sections
  const { data: dataRecords, isFetching, refetch } = useGetSectionsQuery(
    itemsPerPage ? { limit: itemsPerPage, page: currentPage, filter } : skipToken,
    { refetchOnMountOrArgChange: true }
  );

  const items = useMemo(() => dataRecords?.items || [], [dataRecords]);
  const totalCount = useMemo(() => dataRecords?.totalCount || 0, [dataRecords]);
  const safeItemsPerPage = itemsPerPage ?? 10;
  const totalPages = Math.ceil(totalCount / safeItemsPerPage);

  const handlePageChange = useCallback(
    (newPage: number) => {
      if (newPage >= 1 && newPage <= totalPages) setCurrentPage(newPage);
    },
    [totalPages]
  );



  const togglePreferences = useCallback(() => setIsPreferencesOpen((prev) => !prev), []);

  // 
  const handleSearch = useCallback((key: FilterKey, operator: Operator, value: string) => {
    // Only trigger if all three are provided
    console.log('Filter by form', key, operator, value)
    if (key && operator && value) {
      // setSearchFilter({ key: key.value, operator: operator.value, value });
      // setSearchParams({
      //   limit: safeItemsPerPage,
      //   page: 1,
      //   // key: key.value,
      //   // operator: operator.value,
      //   // value,
      // });
      // refetch();
    }
  }, []);

  const onClear = () => {
    // setSearchFilter({});
    // setSearchParams({ limit: safeItemsPerPage, page: 1 });
    // refetch();
  };
  return (
    <>
      <SettingsModal
        isOpen={isSettingsOpen}
        onClose={() => setIsSettingsOpen(false)}
        itemsPerPage={safeItemsPerPage}
        setItemsPerPage={setItemsPerPage}
        allColumns={allColumns}
        type="sections"
      />

      <div className="shadow-lg p-2">
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
          onAdd={() => { setIsEditForm(false); setOpenForm(true); }}
          onPreference={() => setIsSettingsOpen(true)}
          advancedSearch={() => setIsPreferencesOpen(!isPreferencesOpen)}
        />

        {selectedIds.length > 0 && (
          <span className="small p-2">✅ {selectedIds.length} selected from this page.</span>
        )}

        {isPreferencesOpen && (
          <AdvancedFilter isOpen={isPreferencesOpen} onClose={() => setIsPreferencesOpen(false)}>
            <div className="row">
              <InputFormField label="Role Name" name="role_name" inputValue="" error="" required onChange={() => { }} />
              <InputFormField label="Description" name="role_description" inputValue="" error="" required onChange={() => { }} />
            </div>
          </AdvancedFilter>
        )}

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

        <AddEditForm
          pagetitle={pagetitle}
          open={openForm}
          onClose={() => setOpenForm(false)}
          initialData={formData}
          isEdit={isEditForm}
          onSuccess={refetch}
          setIsEditForm={setIsEditForm}
        />

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
