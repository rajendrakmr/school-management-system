import React, { useState, useEffect } from "react";
import ColumnSelector, { Column } from "@/components/pageSettings/ColumnSelector";
import SortableTable from "@/components/pageSettings/SortableTable";

const TablePage: React.FC = () => {
  // Assume columns come from an API; using static data for demo.
  const [allColumns, setAllColumns] = useState<Column[]>([
    { key: "id", label: "ID" },
    { key: "name", label: "Name" },
    { key: "category", label: "Category" },
    { key: "email", label: "Email" },
    { key: "phone", label: "Phone" },
  ]);

  // selectedColumnKeys holds which columns are selected and their order.
  const [selectedColumnKeys, setSelectedColumnKeys] = useState<string[]>(
    allColumns.map((col) => col.key)
  );

  // Simulated API data for table rows.
  const [data, setData] = useState<Record<string, any>[]>([
    { id: 1, name: "Alice", category: "Admin", email: "alice@example.com", phone: "1234567890" },
    { id: 2, name: "Bob", category: "User", email: "bob@example.com", phone: "9876543210" },
    { id: 3, name: "Charlie", category: "Guest", email: "charlie@example.com", phone: "5555555555" },
  ]);

  // On component mount, load saved column settings from localStorage.
  useEffect(() => {
    const savedColumns = localStorage.getItem("selectedColumns");
    if (savedColumns) {
      setSelectedColumnKeys(JSON.parse(savedColumns));
    }
  }, []);

  // Function to save column settings to backend.
  const saveColumnsToBackend = async (selectedKeys: string[]) => {
    // For demo, we save to localStorage; replace with API call if needed.
    localStorage.setItem("selectedColumns", JSON.stringify(selectedKeys));
    return Promise.resolve();
  };

  return (
    <div className="container mt-4">
      <h2>Dynamic Sortable Table</h2>
      <ColumnSelector
        allColumns={allColumns}
        selectedColumnKeys={selectedColumnKeys}
        setSelectedColumnKeys={setSelectedColumnKeys}
        saveColumnsToBackend={saveColumnsToBackend}
      />
      <SortableTable data={data} allColumns={allColumns} selectedColumnKeys={selectedColumnKeys} />
    </div>
  );
};

export default TablePage;
