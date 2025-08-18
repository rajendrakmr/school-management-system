import { faCaretLeft, faCaretRight } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

interface PaginationProps {
    currentPage: number;

    totalPages: number;
    totalCount?: number;
    itemsPerPage?: number;
    handlePageChange: (page: number) => void;
}

const Pagination: React.FC<PaginationProps> = ({ currentPage, totalPages, handlePageChange, totalCount = 0, itemsPerPage = 10 }) => {
    return (
        <div className="pagination d-flex align-items-center gap-3">
            {/* Previous Button */}
            <button
                className={`pagination-button btn btn-sm ${currentPage === 0 ? 'disabled' : 'btn-outline-primary'}`}
                onClick={() => handlePageChange(currentPage - 1)}
                disabled={currentPage === 0}
                style={{
                    borderRadius: "50%",
                    width: "35px",
                    height: "35px",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    border: "1px solid #007bff",
                    backgroundColor: currentPage === 0 ? "#ccc" : "transparent",
                    color: currentPage === 0 ? "#666" : "#007bff",
                    cursor: currentPage === 0 ? "not-allowed" : "pointer",
                    transition: "0.3s",
                }}
            >
                <FontAwesomeIcon icon={faCaretLeft} />
            </button>
            <span className="text-secondary">
                📊 {totalCount === 0
                    ? "0/0"
                    : `${Math.min(itemsPerPage, totalCount)}/${totalCount}`} shown |
                📝 Page {totalPages > 0 ? currentPage : 0}/{totalPages > 0 ? totalPages : 0} |
                📁 Total: {totalCount}
            </span>




            <button
                className={`pagination-button btn btn-sm ${currentPage >= totalPages ? 'disabled' : 'btn-outline-primary'}`}
                onClick={() => handlePageChange(currentPage + 1)}
                disabled={currentPage >= totalPages}
                style={{
                    borderRadius: "50%",
                    width: "35px",
                    height: "35px",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    border: "1px solid #007bff",
                    backgroundColor: currentPage >= totalPages ? "#ccc" : "transparent",
                    color: currentPage >= totalPages ? "#666" : "#007bff",
                    cursor: currentPage >= totalPages ? "not-allowed" : "pointer",
                    transition: "0.3s",
                }}
            >
                <FontAwesomeIcon icon={faCaretRight} />
            </button>
        </div>
    );
};

export default Pagination;
