import { useCallback, useEffect, useRef, useState } from "react";
import { Column } from "@/utils/helper";
import "./TableComponent.css";
import "bootstrap/dist/css/bootstrap.min.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPenToSquare } from "@fortawesome/free-solid-svg-icons";
import { Dropdown, Spinner } from "react-bootstrap";
import LoadingLoader from "../LoadingLoader";
import IsActiveBadge from "../Form/IsActiveBadge";

interface TableComponentProps<T extends Record<string, any> = any> {
  data: T[];
  allColumns: Column[];
  isFetching: boolean;
  setIsEditForm: React.Dispatch<React.SetStateAction<boolean>>;
  setFormData: React.Dispatch<React.SetStateAction<T>>;
  setOpenSliderForm: React.Dispatch<React.SetStateAction<boolean>>;
  setSelectedItems: React.Dispatch<React.SetStateAction<T[]>>;
  setSelectedIds: React.Dispatch<React.SetStateAction<string[]>>;
  selectedIds: string[];
  rowIdKey?: string;
}

const TableComponent = <T extends Record<string, any>>({
  data,
  allColumns,
  isFetching,
  setFormData,
  setOpenSliderForm,
  setIsEditForm,
  setSelectedItems,
  setSelectedIds,
  selectedIds,
  rowIdKey = "id",
}: TableComponentProps<T>) => {
  const [isFormLoading, setIsFormLoading] = useState(false);
  const selectAllRef = useRef<HTMLInputElement>(null);

  /** ✅ Only active columns */
  const activeColumns = allColumns
    .filter((col) => col.is_active)
    .sort((a, b) => a.column_order - b.column_order);

  /** ✅ Handle Select All */
  const handleSelectAll = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.checked) {
      const allIds = data.map((item) => String(item[rowIdKey]));
      setSelectedIds(allIds);
      setSelectedItems([...data]);
    } else {
      setSelectedIds([]);
      setSelectedItems([]);
    }
  };

  const handleSelectRow = useCallback((e: React.ChangeEvent<HTMLInputElement>, item: T) => {
    const id = String(item[rowIdKey]); 
    if (e.target.checked) {
      setSelectedIds((prev) => [...prev, id]);
      setSelectedItems((prev) => [...prev, item]);
    } else {
      setSelectedIds((prev) => prev.filter((x) => x !== id));
      setSelectedItems((prev) =>
        prev.filter((x) => String(x[rowIdKey]) !== id)
      );
    }
  }, [setSelectedIds, setSelectedItems]);


  useEffect(() => {
    if (selectAllRef.current) {
      selectAllRef.current.indeterminate =
        selectedIds.length > 0 && selectedIds.length < data.length;
    }
  }, [selectedIds, data]);


  const handleEdit = useCallback(
    async (item: T) => {
      setIsFormLoading(true);
      try {
        setFormData(item);
        setOpenSliderForm(true);
        setIsEditForm(true);
      } catch (err) {
        console.error("Failed to load form data:", err);
      } finally {
        setIsFormLoading(false);
      }
    },
    [setFormData]
  );


  const renderImage = (src: string) => (
    <img
      style={{
        width: "90px",
        height: "90px",
        borderRadius: "50px",
        border: "1px solid #ccc",
        objectFit: "cover",
      }}
      src={`http://localhost:5000/uploads/logos/${src}`}
      alt="School Logo"
      onError={(e) => {
        (e.target as HTMLImageElement).src =
          "https://via.placeholder.com/90?text=No+Logo";
      }}
    />
  );



  return (
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
                  checked={data.length > 0 && selectedIds.length === data.length}
                  style={{ width: "18px", height: "18px" }}
                />
                {/* {selectedIds.length > 0 && <span className="badge bg-primary">
                  {selectedIds.length}
                </span>} */}
              </div>
            </th>

            {activeColumns.map((col) => (
              <th key={col.id}>{col.column_label}</th>
            ))}
          </tr>
        </thead>
        <tbody>
          {isFetching ? (
            <tr>
              <td colSpan={activeColumns.length + 1} className="text-center">
                <LoadingLoader />
              </td>
            </tr>
          ) : data.length === 0 ? (
            <tr>
              <td colSpan={activeColumns.length + 1} className="text-center">
                No records found.
              </td>
            </tr>
          ) : (
            data.map((item) => (
              <tr key={String(item[rowIdKey])}>
                <td className="text-center">
                  <input
                    type="checkbox"
                    checked={selectedIds.includes(String(item[rowIdKey]))}
                    onChange={(e) => handleSelectRow(e, item)}
                  />
                </td>
                {activeColumns.map((col) => {
                  const cellValue = item[col.column_key];
                  return (
                    <td key={col.id} className="p-2">
                      {col.column_key === "action" ? (
                        <div className="d-flex align-items-center gap-2">
                          <a
                            className="cursor-pointer px-2 cursoredit btn-sm"
                            onClick={() => handleEdit(item)}
                          >
                            {isFormLoading ? (
                              <Spinner animation="border" size="sm" />
                            ) : (
                              <FontAwesomeIcon
                                icon={faPenToSquare}
                                style={{ color: "#007bff" }}
                              />
                            )}
                          </a>
                          <Dropdown align="end">
                            <Dropdown.Toggle
                              id="dropdown-profile"
                              className="profile-dropdown-toggle"
                            >
                              ⋮
                            </Dropdown.Toggle>
                            <Dropdown.Menu>
                              <Dropdown.Item>Delete</Dropdown.Item>
                            </Dropdown.Menu>
                          </Dropdown>
                        </div>
                      ) : col.column_key === "is_active" ? (
                        <IsActiveBadge status={cellValue} />
                      ) : col.column_key === "permission" ? (item.permissions && (
                        <div className="flex flex-wrap gap-1">
                          {item.permissions.map((perm: any, index: number) => (
                            <>
                              <span key={perm.mst_permission_id} className="badge m-2 bg-secondary">
                                {perm.permission_name}
                              </span>
                              {index < item.permissions.length - 1 ? ',' : ''}
                            </>
                          ))}
                        </div>

                      )
                      ) : col.column_key === "image_path" ? (
                        renderImage(cellValue)
                      ) : (
                        cellValue
                      )}
                    </td>
                  );
                })}
              </tr>
            ))

          )}
        </tbody>
      </table>
    </div>
  );
};

export default TableComponent;
