"use client";

import React, { ChangeEvent, useMemo } from "react";
import {
  ColumnDef,
  useReactTable,
  getCoreRowModel,
  flexRender,
  Row,
} from "@tanstack/react-table";
import {
  DndContext,
  closestCenter,
  DragEndEvent,
  UniqueIdentifier,
  useSensors,
  useSensor,
  MouseSensor,
  TouchSensor,
  KeyboardSensor,
} from "@dnd-kit/core";
import {
  arrayMove,
  SortableContext,
  useSortable,
  verticalListSortingStrategy,
} from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Input } from "@/components/ui/input";
import { Select } from "@/components/ui/select";
import { Card } from "@/components/ui/card";
import { restrictToVerticalAxis } from "@dnd-kit/modifiers";
import { initialData } from "@/constant";
import { STATUS_OPTIONS, StatusEnum } from "@/constants/optionsConstant";

// Define your data model.
export interface Milestone {
  id: string;
  milestone: string;
  plannedDate: string;
  percentComplete: number;
  actualDate: string;
  reward: number;
  cumulativeReward: number;
  variation: number;
  status: StatusEnum;
}

function compareDates(date1: string, date2: string): number {
  const d1 = new Date(date1);
  const d2 = new Date(date2);

  if (d1 < d2) return -1; // date1 is earlier than date2
  if (d1 > d2) return 1;  // date1 is later than date2
  return 0;               // both dates are the same
}


export default function ConstructionContractTable() {
  const [data, setData] = React.useState<Milestone[]>(initialData);
  const [invalidRows, setInvalidRows] = React.useState<boolean[]>(new Array(initialData.length).fill(false));
  const [invalid, setInvalid] = React.useState(false);

  React.useEffect(() => {
    // Calculate the total percent when the data changes
    const totalPercent = data.reduce((sum, item) => sum + item.percentComplete, 0);

    console.log(totalPercent);
    // If total is not 100, set the invalid state to true, else set it to false
    setInvalid(totalPercent !== 100);
  }, [data]);

  const dataIds = React.useMemo<UniqueIdentifier[]>(
    () => data?.map(({ id }) => id),
    [data]
  )

  // Compute cumulative rewards dynamically.
  // The cumulative reward for each row is based on the previous row's cumulative reward,
  // plus the current row's reward and variation.
  const computedData = useMemo<Milestone[]>(() => {
    let cumulative = 0;
    let contractResidual = 0;
    return data.map((row) => {
      cumulative += row.reward + row.variation;
      contractResidual += row.variation;
      return { ...row, cumulativeReward: cumulative, variation: contractResidual };
    });
  }, [data]);

  const updateRow = React.useCallback(
    (index: number, key: keyof Milestone, value: string | number | StatusEnum): void => {
      setData((prevData) => {
        const updatedData = [...prevData];
        updatedData[index] = { ...updatedData[index], [key]: value };
        return updatedData;
      });
    },
    [setData] // Add dependencies here (e.g., setData) if necessary
  );

  const handlePlannedDateChange = React.useCallback(
    (index: number, newDate: string) => {
      setData((prevData) => {
        const updatedData = [...prevData];
        
        // Check if the new date is earlier than the previous milestone
        if (index > 0 && compareDates(updatedData[index - 1].plannedDate, newDate) > 0) {
          // Mark the row as invalid
          setInvalidRows((prevInvalidRows) => {
            const updatedInvalidRows = [...prevInvalidRows];
            updatedInvalidRows[index] = true;
            return updatedInvalidRows;
          });
  
          // Update the row's plannedDate even if it's invalid
          updateRow(index, "plannedDate", newDate);
          return prevData; // Don't update the planned date, keep the previous data
        }
  
        // Reset invalid state if date is valid
        setInvalidRows((prevInvalidRows) => {
          const updatedInvalidRows = [...prevInvalidRows];
          updatedInvalidRows[index] = false;
          return updatedInvalidRows;
        });
  
        // Proceed with the normal date update
        updateRow(index, "plannedDate", newDate);
        return updatedData;
      });
    },
    [setData, setInvalidRows, updateRow] // Add dependencies here if necessary
  );


  // Handle drag end to update the order of the rows.
  function handleDragEnd(event: DragEndEvent) {
    const { active, over } = event
    if (active && over && active.id !== over.id) {
      setData(data => {
        const oldIndex = dataIds.indexOf(active.id)
        const newIndex = dataIds.indexOf(over.id)
        const newData = arrayMove(data, oldIndex, newIndex);//this is just a splice util

        setInvalidRows(() => {
          const updatedInvalidRows = newData.map((milestone, index) => {
            if (index > 0 && compareDates(newData[index - 1].plannedDate, milestone.plannedDate) > 0) {
              return true; // Mark as invalid
            }
            return false; // Valid date order
          });
          return updatedInvalidRows;
        });

        return newData
      })
    }
  }

  // Define table columns.
  const columns = useMemo<ColumnDef<Milestone>[]>(
    () => [
      // Drag handle column.
      {
        id: 'drag-handle',
        header: '',
        cell: ({ row }) => (
          <span className="cursor-move select-none" title="Drag to reorder" id={row.id}>
            ⋮⋮
          </span>
        ),
        enableSorting: false,
        size: 40,
      },
      {
        header: "Contract Milestone",
        accessorKey: "milestone",
        cell: ({ row }) =>{
          // eslint-disable-next-line
          const [error, setError] = React.useState(false);

          return (
          <Input
            type="text"
            className={error ? "border-red-500 focus:ring-red-500" : ""}
            value={row.original.milestone as string}
            onChange={(e: ChangeEvent<HTMLInputElement>) => {
              if(data.some(d=> d.milestone.toLowerCase() === e.target.value.toLowerCase()))
                setError(true);
              else setError(false);
              updateRow(row.index, "milestone", e.target.value)
            }
            }
            onMouseDown={(e) => e.stopPropagation()}
          />
        )},
      },
      {
        header: "Milestone Number",
        accessorKey: "milestoneNumber",
        cell: ({ row }) => {
          return (
            <span className="text-gray-500">{row.index + 1}</span> // Calculated based on position
          );
        },
      },
      {
        header: "Planned Date",
        accessorKey: "plannedDate",
        cell: ({ row }) => {
          const isCompleted = row.original.status === StatusEnum.COMPLETED;
          return (
            <Input
              type="date"
              value={row.original.plannedDate as string}
              className={invalidRows[row.index] ? "border-red-500 focus:ring-red-500" : ""}
              disabled={isCompleted}
              onChange={(e: ChangeEvent<HTMLInputElement>) => {handlePlannedDateChange(row.index, e.target.value)}}
              onMouseDown={(e) => e.stopPropagation()}
            />
          );
        },
      },
      {
        header: "% of Project",
        accessorKey: "percentComplete",
        cell: ({ row }) => (
          <Input
            type="number"
            value={row.original.percentComplete as number}
            onChange={(e: ChangeEvent<HTMLInputElement>) => updateRow(row.index, "percentComplete", parseInt(e.target.value))}
            className={invalid ? "border-red-500 focus:ring-red-500" : ""}
            onMouseDown={(e) => e.stopPropagation()}
          />
        ),
      },
      {
        header: "Actual Date",
        accessorKey: "actualDate",
      },
      {
        header: "Milestone Reward/Money",
        accessorKey: "reward",
      },
      {
        header: "Cumulative Reward/Money",
        accessorKey: "cumulativeReward",
      },
      {
        header: "Variation",
        accessorKey: "variation",
        cell: ({ row, table }) => {
          const prevRow = row.index > 0 ? table.options.data[row.index - 1] : null; // Get the previous row (if exists)
          const prevVariation = prevRow ? prevRow.variation : 0;

          // Determine the class based on variation change
          const variationClass =
            row.original.variation > prevVariation
              ? "text-green-500"
              : row.original.variation < prevVariation
                ? "text-red-500"
                : "text-gray-700";

          return <span className={variationClass}>{row.original.variation}</span>;
        },
      },
      {
        header: "Status",
        accessorKey: "status",
        cell: ({ row }) => (
          <Select
            value={row.original.status}
            onChange={(value: string) => updateRow(row.index, "status", value as StatusEnum)}
            options={STATUS_OPTIONS}
          />
        ),
      },
    ],
    [invalidRows, invalid, handlePlannedDateChange, updateRow]
  );

  // Create the table instance.
  const table = useReactTable<Milestone>({
    data: computedData,
    columns,
    getCoreRowModel: getCoreRowModel(),
    getRowId: row => row.id,
  });

  const sensors = useSensors(
    useSensor(MouseSensor, {}),
    useSensor(TouchSensor, {}),
    useSensor(KeyboardSensor, {})
  )

  return (
    <Card className="m-14 p-4">
      <DndContext collisionDetection={closestCenter}
        modifiers={[restrictToVerticalAxis]}
        onDragEnd={handleDragEnd}
        sensors={sensors}
      >
        <SortableContext items={computedData.map((row) => row.id)} strategy={verticalListSortingStrategy}>
          <Table>
            <TableHeader>
              {table.getHeaderGroups().map((headerGroup) => (
                <TableRow key={headerGroup.id}>
                  {headerGroup.headers.map((header) => (
                    <TableHead key={header.id}>
                      {flexRender(header.column.columnDef.header, header.getContext())}
                    </TableHead>
                  ))}
                </TableRow>
              ))}
            </TableHeader>
            <TableBody>
              {table.getRowModel().rows.map((row) => (
                <SortableTableRow key={row.id} row={row}>
                  {row.getVisibleCells().map((cell) => (
                    <TableCell key={cell.id}>
                      {flexRender(cell.column.columnDef.cell, cell.getContext()) ||
                        (cell.getValue() as string)}
                    </TableCell>
                  ))}
                </SortableTableRow>
              ))}
            </TableBody>
          </Table>
        </SortableContext>
      </DndContext>
    </Card>
  );
}

/**
 * A wrapper around TableRow that makes it sortable using DnD Kit.
 */
interface SortableTableRowProps {
  row: Row<Milestone>;
  children: React.ReactNode;
}

function SortableTableRow({ row, children }: SortableTableRowProps) {
  const { attributes, listeners, setNodeRef, transform, transition } = useSortable({
    id: row.id,
  });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };

  return (
    <TableRow ref={setNodeRef} style={style} {...attributes} {...listeners}>
      {children}
    </TableRow>
  );
}