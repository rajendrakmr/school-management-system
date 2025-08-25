import React, { useEffect, useState, useRef, useCallback } from "react";
import Toolbar from "@/components/Toolbar";
import PageNumber from "@/components/PageNumber";
import SettingsModal from "@/components/Table/SettingsModal";
import AdvancedFilter from "@/components/AdvancedFilter";
import InputFormField from "@/components/InputFormField";
import AddEditForm from "./AddEditForm";
import { useGetColumnListQuery, useGetColumnsQuery } from "@/store/slice/columns";
import { skipToken } from "@reduxjs/toolkit/query";
import { useDispatch, useSelector } from "react-redux";
import { setBreadcrumbs } from "@/store/slice/bredCrumbs";
import { RootState } from "@/store";
import TableComponent from "@/components/Table/TableComponent";
import { Column } from "@/utils/helper";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPenToSquare } from "@fortawesome/free-solid-svg-icons";
import { FilterKey, Operator } from "@/components/SearchWithOperators";

// export interface Column {
//   column_key: string;
//   column_label: string;
// }

interface ColumnConfig {
    key_type: string;
    column_key: string;
    column_label: string;
    required?: boolean;
    minLength?: number;
    maxLength?: number;
    columns?: string;
}

const Index: React.FC = () => {
  const [filter, setFilter] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState<number>(10);
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [isPreferencesOpen, setIsPreferencesOpen] = useState(false);
  const [openForm, setOpenForm] = useState(false);
  const [editData, setEditData] = useState<any>(null);
  const [formData, setFormData] = useState<any>(null);
  const [isEditForm, setIsEditForm] = useState(false);
  const [selectedIds, setSelectedIds] = useState<string[]>([]);

  const selectAllRef = useRef<HTMLInputElement>(null);

  const dispatch = useDispatch();
  useEffect(() => {
    dispatch(setBreadcrumbs(["Page Settings Details"]));
  }, [dispatch]);

  const { data: dataRecords, isFetching, refetch } = useGetColumnListQuery(
    { limit: itemsPerPage, page: currentPage, filter },
    { refetchOnMountOrArgChange: true }
  );

  // console.log(dataRecords, "dataRecordsdataRecordsdataRecordsdataRecords")
  const items = dataRecords?.items || [];
  const totalCount = dataRecords?.total || 0;
  const totalPages = dataRecords?.totalPages
  useEffect(() => {
    if (dataRecords?.limit) {
      setItemsPerPage(dataRecords.limit);
    }
  }, [dataRecords]);
  const handlePageChange = (newPage: number) => {
    if (newPage >= 1 && newPage <= totalPages) {
      setCurrentPage(newPage);
    }
  };

  const handleSelectAll = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.checked) {
      setSelectedIds(items.map((item) => String(item.id)));
    } else {
      setSelectedIds([]);
    }
  };

  const handleSelectRow = (e: React.ChangeEvent<HTMLInputElement>, item: any) => {
    const id = String(item.id);
    if (e.target.checked) {
      setSelectedIds((prev) => [...prev, id]);
    } else {
      setSelectedIds((prev) => prev.filter((i) => i !== id));
    }
  };

  const allColumns: Column[] = [
    { id: 2, column_key: "action", column_label: "Action", column_order: 20, is_active: true },
    { id: 1, column_key: "page", column_label: "Page", column_order: 21, is_active: true },
    { id: 3, column_key: "columns", column_label: "Field List", column_order: 22, is_active: true },

  ];

  const activeColumns = allColumns; // You can customize which columns are active

  const handleEdit = useCallback(async (item: ColumnConfig) => { 
      try { 
        setOpenForm(true)
        setFormData(item); 
        setIsEditForm(true);
      } catch (err) {
        console.error("Failed to load form data:", err);
      }  
    },
    [setFormData]
  );

   const handleSearch = (key: FilterKey, operator: Operator, value: string) => {
    console.log('Filter by form', key, operator, value)
    if (key && operator && value) {
    }
  };

  const onClear = () => {
  };
  return (
    <> 

      <div className="shadow-lg p-2">
        <Toolbar
          title="Roles"
          currentPage={currentPage}
          totalPages={totalPages}
          totalCount={totalCount}
          itemsPerPage={itemsPerPage}
          onPageChange={handlePageChange}
          onSearch={handleSearch}
          onRefresh={refetch}
          onAdd={() => {
            setEditData(null);
            setFormData(null);
            setOpenForm(true);
            setIsEditForm(false);
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

        <div className="table-container table-responsive tableReponsivecontainer">
          <table className="table table-bordered">
            <thead
              className="table-header-bg text-white"
              style={{ position: "sticky", top: 0, backgroundColor: "#32ab9b" }}
            >
              <tr>
                <th className="text-center align-middle">
                  <div className="d-flex align-items-center justify-content-center gap-2">
                    <input
                      ref={selectAllRef}
                      type="checkbox"
                      className="form-check-input cursor-pointer"
                      onChange={handleSelectAll}
                      checked={items.length > 0 && selectedIds.length === items.length}
                      style={{ width: "18px", height: "18px" }}
                    />
                  </div>
                </th>
                {activeColumns.map((col) => (
                  <th key={col.column_key}>{col.column_label}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {isFetching ? (
                <tr>
                  <td colSpan={activeColumns.length + 1} className="text-center">
                    Loading...
                  </td>
                </tr>
              ) : items.length === 0 ? (
                <tr>
                  <td colSpan={activeColumns.length + 1} className="text-center">
                    No records found.
                  </td>
                </tr>
              ) : (
                items.map((item,index) => (
                  <tr key={index}>
                    <td className="text-center">
                      <input
                        type="checkbox"
                        checked={selectedIds.includes(item.page)}
                        onChange={(e) => handleSelectRow(e, item)}
                      />
                    </td>
                    <td className="p-2">
                      <div className="d-flex align-items-center ">
                        <a
                          className="cursor-pointer px-2  btn-sm"
                        onClick={() => handleEdit(item)}
                        >
                          <FontAwesomeIcon icon={faPenToSquare} style={{ color: "#007bff" }} />
                        </a>
                      </div>
                    </td>
                    <td>{item.page}</td>
                    <td className="p-2">
                      {item?.columns?.map((col) => (
                        <span
                        style={{borderRadius:"0px"}}
                          className={`badge m-1 bg-secondary`}
                        >
                          {col.column_label}
                        </span>
                      ))}
                    </td>

                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
        <AddEditForm
          open={openForm}
          onClose={() => setOpenForm(false)}
          initialData={formData}
          isEdit={isEditForm}
          onSuccess={refetch}
          setIsEditForm={setIsEditForm}
        />

        {totalCount > itemsPerPage && (
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
