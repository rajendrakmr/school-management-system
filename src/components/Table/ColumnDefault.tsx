import React, { useEffect, useState, useRef } from "react";
import { DndContext, closestCenter, DragEndEvent } from "@dnd-kit/core";
import { arrayMove, SortableContext, verticalListSortingStrategy } from "@dnd-kit/sortable";
import SortableItem from "./SortableItem";
import ToggleSwitch from "@/components/pageSettings/ToggleSwitch";
import { Column } from "@/utils/helper";

interface ColumnSelectorProps {
    allColumns: Column[];
    setSelectedColumns: (columns: Column[]) => void;
}

const ColumnDefault: React.FC<ColumnSelectorProps> = ({ allColumns, setSelectedColumns }) => {
    const [tempColumns, setTempColumns] = useState<Column[]>(allColumns);
    const prevColumnsRef = useRef<Column[]>(allColumns);  
 
    useEffect(() => {
        if (JSON.stringify(allColumns) !== JSON.stringify(prevColumnsRef.current)) {
            setTempColumns([...allColumns]);
            prevColumnsRef.current = allColumns;
        }
    }, [allColumns]);

     
    useEffect(() => { 
        if (JSON.stringify(tempColumns) !== JSON.stringify(prevColumnsRef.current)) {
            setSelectedColumns(tempColumns);
            prevColumnsRef.current = tempColumns;
        }
    }, [tempColumns, setSelectedColumns]);
 
    const handleCheckboxChange = (colKey: string,is_active:boolean) => { 
        setTempColumns((prevColumns) =>
            prevColumns.map((col) =>
                col.column_key === colKey ? { ...col, is_active: !is_active } : col
            )
        );
    };
 
    const handleDragEnd = (event: DragEndEvent) => {
        const { active, over } = event; 
        if (!over || active.id === over.id) return; 
        setTempColumns((prevColumns) => {
          const oldIndex = prevColumns.findIndex((col) => col.column_key === active.id);
          const newIndex = prevColumns.findIndex((col) => col.column_key === over.id);
          const newColumns = arrayMove(prevColumns, oldIndex, newIndex); 
          return newColumns.map((col, index) => ({
            ...col,
            column_order: index + 1,
          }));
        });
      };
      

    return (
        <div style={{ maxHeight: "300px", overflowY: "auto" }}> 
            <DndContext collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
                <SortableContext items={tempColumns.map(({ column_key }) => column_key)} strategy={verticalListSortingStrategy}>
                    {tempColumns.map((col) => (
                        <SortableItem key={col.id} id={col.column_key}>
                            <label style={{ display: "flex", alignItems: "center", marginBottom: "4px" }}>
                                <ToggleSwitch
                                    checked={col.is_active}
                                    onChange={(e) => {
                                        e.stopPropagation();
                                        handleCheckboxChange(col.column_key,col.is_active);
                                    }}
                                />
                                {col.column_label}
                            </label>
                        </SortableItem>
                    ))}
                </SortableContext>
            </DndContext>
        </div>
    );
};

export default React.memo(ColumnDefault);
