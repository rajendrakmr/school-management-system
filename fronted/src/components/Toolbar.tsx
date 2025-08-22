import React, { useCallback } from "react";
import { faCog, faPlus, faSyncAlt } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { Button } from "react-bootstrap";
import Pagination from "./Pagination";
import SearchWithOperators, { FilterKey, Operator } from "./SearchWithOperators";

interface PageHeaderProps {
  title?: string;
  currentPage: number;
  totalPages: number;
  totalCount?: number;
  itemsPerPage?: number;
  onPageChange: (page: number) => void;
  onSearch: (key: FilterKey, operator: Operator, value: string) => void; 
  onRefresh: () => void;
  onAdd?: () => void;
  onPreference?: () => void;
  advancedSearch?: () => void;
  columns?: FilterKey[]; // Pass columns from parent
}

const ToolbarComponent: React.FC<PageHeaderProps> = ({
  title,
  currentPage,
  totalPages,
  totalCount = 0,
  onPageChange,
  onAdd,
  onRefresh,
  onPreference,
  advancedSearch,
  itemsPerPage,
  columns,
  onSearch,
}) => {
  const handlePageChange = useCallback((page: number) => onPageChange(page), [onPageChange]);
  const handleRefresh = useCallback(() => onRefresh(), [onRefresh]);
  const handleAdd = useCallback(() => onAdd && onAdd(), [onAdd]);
  const handlePreference = useCallback(() => onPreference && onPreference(), [onPreference]);
  const handleAdvancedSearch = useCallback(() => advancedSearch && advancedSearch(), [advancedSearch]);

  return (
    <>
      <div className="d-flex align-items-center primary-light-bg text-bold position-relative p-2">
        <div className="d-flex gap-2">
          {onAdd && (
            <Button variant="primary" className="cbtn-sm" onClick={handleAdd}>
              <FontAwesomeIcon icon={faPlus} /> Add
            </Button>
          )}
          {advancedSearch && (
            <button
              type="button"
              className="cbtn-sm"
              onClick={handleAdvancedSearch}
              style={{ backgroundColor: "rgb(193, 80, 101)", color: "#fff" }}
            >
              Filter
            </button>
          )}
        </div>

        <div className="d-flex gap-2 ms-auto">
          <Button
            variant="light"
            className="btn-sm rounded-circle border"
            onClick={handleRefresh}
            title="Refresh"
          >
            <FontAwesomeIcon icon={faSyncAlt} />
          </Button>

          {onPreference && (
            <Button
              variant="light"
              onClick={handlePreference}
              className="btn-sm rounded-circle border"
              title="Settings"
            >
              <FontAwesomeIcon icon={faCog} />
            </Button>
          )}
        </div>
      </div>

      <div className="d-flex align-items-center primary-light-bg text-bold position-relative pb-2">
        {/* Pass columns and onSearch to SearchWithOperators */}
        <SearchWithOperators columns={columns || []} onSearch={onSearch} />

        <div className="d-flex align-items-center gap-2 me-2">
          <Pagination
            itemsPerPage={itemsPerPage}
            currentPage={currentPage}
            totalPages={totalPages}
            totalCount={totalCount}
            handlePageChange={handlePageChange}
          />
        </div>
      </div>
    </>
  );
};

// Custom comparison for memo
function areEqual(prevProps: PageHeaderProps, nextProps: PageHeaderProps) {
  return (
    prevProps.currentPage === nextProps.currentPage &&
    prevProps.totalPages === nextProps.totalPages &&
    prevProps.totalCount === nextProps.totalCount &&
    prevProps.itemsPerPage === nextProps.itemsPerPage &&
    prevProps.onPageChange === nextProps.onPageChange &&
    prevProps.onAdd === nextProps.onAdd &&
    prevProps.onRefresh === nextProps.onRefresh &&
    prevProps.onPreference === nextProps.onPreference &&
    prevProps.advancedSearch === nextProps.advancedSearch &&
    prevProps.columns === nextProps.columns &&
    prevProps.onSearch === nextProps.onSearch
  );
}

// Memoized Toolbar
const Toolbar = React.memo(ToolbarComponent, areEqual);

export default Toolbar;
