import { useState, useEffect } from "react";
import ColumnSelector from "./ColumnSelector";

interface Column {
    key: string;
    label: string;
    order: number;
    isActive: boolean;
}

interface TableComponentProps {
    data: Record<string, any>[];
    columns: Column[];
}

const allColumns: Column[] = [
    { key: "id", label: "ID", order: 1, isActive: true },
    { key: "title", label: "Name", order: 2, isActive: true },
    { key: "category", label: "Category", order: 3, isActive: false },
    { key: "price", label: "Price", order: 4, isActive: false },
];

const TableComponent: React.FC<TableComponentProps> = ({ data, columns }) => {
    const [selectedColumns, setSelectedColumns] = useState<Column[]>([]);

    useEffect(() => {
        const savedColumns = localStorage.getItem("selectedColumns");
        if (savedColumns) {
            setSelectedColumns(JSON.parse(savedColumns));
        } else {
            setSelectedColumns(columns);
        }
    }, []);

    return (
        <div>
            <ColumnSelector allColumns={columns} selectedColumns={selectedColumns} setSelectedColumns={setSelectedColumns} />

            <div className="table-container table-responsive">
                <table className="table table-bordered">
                    <thead>
                        <tr>
                            {selectedColumns.map((col) => (
                                <th key={col.key}>{col.label}</th>
                            ))}
                        </tr>
                    </thead>
                    <tbody>
                        {data.map((item) => (
                            <tr key={item.id}>
                                {selectedColumns.map((col) => (
                                    <td key={col.key}>{item[col.key]}</td>
                                ))}
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default TableComponent;
