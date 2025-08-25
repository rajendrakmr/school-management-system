import { useCallback, useEffect, useMemo, useRef } from "react";
import { Column } from "@/utils/helper";
import "./TableComponent.css";
import "bootstrap/dist/css/bootstrap.min.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPenToSquare } from "@fortawesome/free-solid-svg-icons";
import { Dropdown, Spinner } from "react-bootstrap";
import LoadingLoader from "../LoadingLoader";
import IsActiveBadge from "../Form/IsActiveBadge";
import IsDefaultBadge from "../Form/IsDefaultBadge";
import BranchComponent from "../BranchComponent";

interface TableComponentProps<T extends Record<string, any> = any> {
  data: T[];
  allColumns: Column[];
  isFetching: boolean;
  setIsEditForm: React.Dispatch<React.SetStateAction<boolean>>;
  setFormData: React.Dispatch<React.SetStateAction<T>>;
  setOpenSliderForm: React.Dispatch<React.SetStateAction<boolean>>;
  setSelectedItems?: React.Dispatch<React.SetStateAction<T[]>>;
  setSelectedIds?: React.Dispatch<React.SetStateAction<string[]>>;
  selectedIds?: string[];
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
  selectedIds = [],
  rowIdKey = "id",
}: TableComponentProps<T>) => {
  const selectAllRef = useRef<HTMLInputElement>(null);

  /** ✅ Memoize active columns */
  const activeColumns = useMemo(
    () => allColumns.filter((col) => col.is_active).sort((a, b) => a.column_order - b.column_order),
    [allColumns]
  );

  /** ✅ Handle Select All */
  const handleSelectAll = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      if (!setSelectedIds || !setSelectedItems) return;
      if (e.target.checked) {
        const allIds = data.map((item) => String(item[rowIdKey]));
        setSelectedIds(allIds);
        setSelectedItems([...data]);
      } else {
        setSelectedIds([]);
        setSelectedItems([]);
      }
    },
    [data, rowIdKey, setSelectedIds, setSelectedItems]
  );

  /** ✅ Handle Select Single Row */
  const handleSelectRow = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>, item: T) => {
      if (!setSelectedIds || !setSelectedItems) return;
      const id = String(item[rowIdKey]);
      if (e.target.checked) {
        setSelectedIds((prev) => [...prev, id]);
        setSelectedItems((prev) => [...prev, item]);
      } else {
        setSelectedIds((prev) => prev.filter((x) => x !== id));
        setSelectedItems((prev) => prev.filter((x) => String(x[rowIdKey]) !== id));
      }
    },
    [setSelectedIds, setSelectedItems, rowIdKey]
  );

  /** ✅ Keep Select All in sync */
  useEffect(() => {
    if (selectAllRef.current) {
      selectAllRef.current.indeterminate =
        selectedIds.length > 0 && selectedIds.length < data.length;
    }
  }, [selectedIds, data]);

  /** ✅ Handle Edit */
  const handleEdit = useCallback(
    (item: T) => {
      setFormData(item);
      setOpenSliderForm(true);
      setIsEditForm(true);
    },
    [setFormData, setOpenSliderForm, setIsEditForm]
  );

  /** ✅ Render Image */
  const renderImage = useCallback((src: string) => (
    <img
      style={{
        width: 90,
        height: 90,
        borderRadius: "50%",
        border: "1px solid #ccc",
        objectFit: "cover",
      }}
      src={`${process.env.BACKEND_PATH_API_URL}/uploads${src}`}
      alt="Logo"
      onError={(e) => {
        (e.target as HTMLImageElement).src = "https://via.placeholder.com/90?text=No+Logo";
      }}
    />
  ), []);

  /** ✅ Render Cell */
  const renderCell = (col: Column, item: T) => {
    const value = item[col.column_key];

    if (Array.isArray(value)) {
      return (
        <div className="d-flex flex-wrap gap-1">
          {value.map((val: any, idx: number) => (
            <span
              key={idx}
              style={{ borderRadius: "0px" }}
              className={`badge ${col.column_key.includes("role") ? "bg-primary" : "bg-secondary"}`}
            >
              {val}
            </span>
          ))}
        </div>
      );
    }

    switch (col.column_key) {
      case "branch":
        return (
          <BranchComponent
            name={item.branch}
            email={item.branch_email}
            imageSrc={item.branch_image}
          />
        );
      case "action":
        return (
          <div className="d-flex align-items-center gap-2">
            <a
              className="cursor-pointer px-2 btn-sm"
              onClick={() => handleEdit(item)}
            >
              <FontAwesomeIcon icon={faPenToSquare} style={{ color: "#007bff" }} />
            </a>
            <Dropdown align="end">
              <Dropdown.Toggle id="dropdown-profile" className="profile-dropdown-toggle">
                ⋮
              </Dropdown.Toggle>
              <Dropdown.Menu>
                <Dropdown.Item>Delete</Dropdown.Item>
              </Dropdown.Menu>
            </Dropdown>
          </div>
        );
      case "is_active":
        return <IsActiveBadge status={value} />;
      case "is_optional":
         return <IsDefaultBadge status={value} />;
        
      case "is_default":
        return <IsDefaultBadge status={value} />;
      case "image_path":
        return renderImage(value);
      default:
        return value;
    }
  };

  /** ✅ Render Body Rows */
  const renderRows = () => {
    if (isFetching) {
      return (
        <tr>
          <td colSpan={activeColumns.length + 1} className="text-center">
            <LoadingLoader />
          </td>
        </tr>
      );
    }
    if (data.length === 0) {
      return (
        <tr>
          <td colSpan={activeColumns.length + 1} className="text-center">
            No records found.
          </td>
        </tr>
      );
    }

    return data.map((item) => (
      <tr key={String(item[rowIdKey])}>
        <td className="text-center">
          <input
            type="checkbox"
            checked={selectedIds.includes(String(item[rowIdKey]))}
            onChange={(e) => handleSelectRow(e, item)}
          />
        </td>
        {activeColumns.map((col) => (
          <td key={col.id} className="p-2">
            {renderCell(col, item)}
          </td>
        ))}
      </tr>
    ));
  };

  return (
    <div className="table-container table-responsive tableReponsivecontainer">
      <table className="table table-bordered">
        <thead
          className="table-header-bg text-white"
          style={{ position: "sticky", top: 0, backgroundColor: "#32ab9b" }}
        >
          <tr>
            <th className="text-center align-middle">
              <input
                ref={selectAllRef}
                type="checkbox"
                className="form-check-input cursor-pointer"
                onChange={handleSelectAll}
                checked={data.length > 0 && selectedIds.length === data.length}
                style={{ width: 18, height: 18 }}
              />
            </th>
            {activeColumns.map((col) => (
              <th key={col.id}>{col.column_label}</th>
            ))}
          </tr>
        </thead>
        <tbody>{renderRows()}</tbody>
      </table>
    </div>
  );
};

export default TableComponent;
