import React from "react";

interface PageSizeSelectorProps {
  pageSize: number;
  itemsPerPage: number;
  setPageSize: (value: number) => void;
}

const pageSizes = [10, 25, 50,75,100];

const PageSizeSelector: React.FC<PageSizeSelectorProps> = ({ pageSize,itemsPerPage, setPageSize }) => {
  return (
    <div style={{ marginBottom: "8px" }}> 
      {pageSizes.map((size) => (
        <label key={size} style={{ marginRight: "16px" }}>
          <input
            type="radio"
            value={size}
            checked={pageSize === size}
            onChange={() => setPageSize(size)}
            style={{ marginRight: "4px" }}
          />
          {size} items
        </label>
      ))}
    </div>
  );
};

export default PageSizeSelector;
