"use client";

import React, { useState, useEffect, useMemo } from "react";
import {
  useReactTable,
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  getExpandedRowModel,
  ColumnDef,
  flexRender,
  Row,
  Table as TanStackTable,
  ColumnFiltersState,
  SortingState,
  VisibilityState,
  RowSelectionState,
  ExpandedState,
} from "@tanstack/react-table";
import {
  ChevronLeft,
  ChevronRight,
  ChevronDown,
  ChevronUp,
  Search,
  Filter,
  Download,
  Settings,
  Eye,
  EyeOff,
  MoreHorizontal,
  ChevronFirst,
  ChevronLast,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuCheckboxItem,
  DropdownMenuSeparator,
  DropdownMenuLabel,
} from "@/components/ui/dropdown-menu";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import clsx from "clsx";

// Types
export interface DataTableColumn<T> {
  id?: string;
  accessorKey?: keyof T | string;
  header?: string | React.ReactNode | ((props: any) => React.ReactNode);
  cell?: (props: any) => React.ReactNode;
  filterType?: "text" | "select" | "date" | "number" | "range";
  filterOptions?: { label: string; value: string }[];
  exportable?: boolean;
  resizable?: boolean;
  sortable?: boolean;
  enableSorting?: boolean;
  enableHiding?: boolean;
  size?: number;
  meta?: any;
}

export interface DataTableAction<T> {
  label: string;
  icon?: React.ReactNode;
  onClick: (row: T) => void;
  variant?: "default" | "destructive" | "outline" | "secondary";
  className?: string;
  show?: (row: T) => boolean;
}

export interface DataTableProps<T> {
  data: T[];
  columns: DataTableColumn<T>[];
  loading?: boolean;
  
  // Search & Filter
  searchable?: boolean;
  searchPlaceholder?: string;
  globalFilter?: string;
  onGlobalFilterChange?: (value: string) => void;
  
  // Pagination
  pagination?: {
    pageIndex: number;
    pageSize: number;
    total: number;
    onPaginationChange: (pagination: { pageIndex: number; pageSize: number }) => void;
  };
  
  // Selection
  enableRowSelection?: boolean;
  rowSelection?: RowSelectionState;
  onRowSelectionChange?: (selection: RowSelectionState) => void;
  getRowId?: (row: T) => string;
  
  // Expansion (for variants)
  enableExpanding?: boolean;
  getSubRows?: (row: T) => T[] | undefined;
  renderSubComponent?: (props: { row: Row<T> }) => React.ReactElement;
  
  // Actions
  actions?: DataTableAction<T>[];
  
  // Export
  enableExport?: boolean;
  exportFilename?: string;
  onExport?: (data: T[]) => void;
  
  // Column Management
  enableColumnVisibility?: boolean;
  enableColumnResizing?: boolean;
  
  // Styling
  className?: string;
  size?: "sm" | "md" | "lg";
  
  // Server-side operations
  manualPagination?: boolean;
  manualSorting?: boolean;
  manualFiltering?: boolean;
  onSortingChange?: (sorting: SortingState) => void;
  onColumnFiltersChange?: (filters: ColumnFiltersState) => void;
}

const PAGE_SIZE_OPTIONS = [10, 25, 50, 100];

export function DataTableV2<T>({
  data,
  columns,
  loading = false,
  searchable = true,
  searchPlaceholder = "Search...",
  globalFilter = "",
  onGlobalFilterChange,
  pagination,
  enableRowSelection = false,
  rowSelection = {},
  onRowSelectionChange,
  getRowId,
  enableExpanding = false,
  getSubRows,
  renderSubComponent,
  actions = [],
  enableExport = false,
  exportFilename = "data",
  onExport,
  enableColumnVisibility = true,
  enableColumnResizing = true,
  className = "",
  size = "md",
  manualPagination = false,
  manualSorting = false,
  manualFiltering = false,
  onSortingChange,
  onColumnFiltersChange,
}: DataTableProps<T>) {
  // States
  const [sorting, setSorting] = useState<SortingState>([]);
  const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([]);
  const [columnVisibility, setColumnVisibility] = useState<VisibilityState>({});
  const [expanded, setExpanded] = useState<ExpandedState>({});
  const [internalGlobalFilter, setInternalGlobalFilter] = useState(globalFilter);

  // Debounced search
  useEffect(() => {
    const timer = setTimeout(() => {
      onGlobalFilterChange?.(internalGlobalFilter);
    }, 300);
    return () => clearTimeout(timer);
  }, [internalGlobalFilter, onGlobalFilterChange]);

  // Enhanced columns with actions
  const enhancedColumns = useMemo(() => {
    const cols: ColumnDef<T>[] = columns.map(col => {
      const columnDef: any = {
        id: col.id || (col.accessorKey as string),
        header: col.header || col.id || col.accessorKey,
        cell: col.cell,
        enableSorting: col.sortable !== false,
        enableHiding: col.enableHiding !== false,
        size: col.size,
        meta: col.meta,
      };

      // Add accessorKey only if it exists
      if (col.accessorKey) {
        columnDef.accessorKey = col.accessorKey;
      }

      return columnDef as ColumnDef<T>;
    });

    // Add selection column
    if (enableRowSelection) {
      cols.unshift({
        id: "select",
        header: ({ table }) => (
          <Checkbox
            checked={table.getIsAllPageRowsSelected()}
            onCheckedChange={(value) => table.toggleAllPageRowsSelected(!!value)}
            aria-label="Select all"
          />
        ),
        cell: ({ row }) => (
          <Checkbox
            checked={row.getIsSelected()}
            onCheckedChange={(value) => row.toggleSelected(!!value)}
            aria-label="Select row"
          />
        ),
        enableSorting: false,
        enableHiding: false,
        size: 40,
      });
    }

    // Add expand column
    if (enableExpanding) {
      cols.unshift({
        id: "expand",
        header: "",
        cell: ({ row }) => {
          if (!row.getCanExpand()) return null;
          return (
            <Button
              variant="ghost"
              size="sm"
              onClick={row.getToggleExpandedHandler()}
              className="p-0 h-6 w-6"
            >
              {row.getIsExpanded() ? (
                <ChevronDown className="h-4 w-4" />
              ) : (
                <ChevronRight className="h-4 w-4" />
              )}
            </Button>
          );
        },
        enableSorting: false,
        enableHiding: false,
        size: 40,
      });
    }

    // Add actions column
    if (actions.length > 0) {
      cols.push({
        id: "actions",
        header: "Actions",
        cell: ({ row }) => {
          const visibleActions = actions.filter(action => 
            !action.show || action.show(row.original)
          );

          if (visibleActions.length === 0) return null;

          if (visibleActions.length === 1) {
            const action = visibleActions[0];
            return (
              <Button
                variant={action.variant || "outline"}
                size="sm"
                onClick={() => action.onClick(row.original)}
                className={action.className}
              >
                {action.icon}
                {action.label}
              </Button>
            );
          }

          return (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                  <MoreHorizontal className="h-4 w-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                {visibleActions.map((action, index) => (
                  <DropdownMenuItem
                    key={index}
                    onClick={() => action.onClick(row.original)}
                    className={action.className}
                  >
                    {action.icon}
                    {action.label}
                  </DropdownMenuItem>
                ))}
              </DropdownMenuContent>
            </DropdownMenu>
          );
        },
        enableSorting: false,
        enableHiding: false,
        size: 80,
      });
    }

    return cols;
  }, [columns, enableRowSelection, enableExpanding, actions]);

  // Table instance
  const table = useReactTable({
    data,
    columns: enhancedColumns as ColumnDef<T>[],
    getCoreRowModel: getCoreRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getExpandedRowModel: getExpandedRowModel(),
    
    // States
    state: {
      sorting,
      columnFilters,
      columnVisibility,
      rowSelection,
      globalFilter: manualFiltering ? globalFilter : internalGlobalFilter,
      expanded,
      pagination: pagination ? {
        pageIndex: pagination.pageIndex,
        pageSize: pagination.pageSize,
      } : undefined,
    },
    
    // Handlers
    onSortingChange: manualSorting ? (updater) => {
      const newSorting = typeof updater === 'function' ? updater(sorting) : updater;
      onSortingChange?.(newSorting);
    } : setSorting,
    onColumnFiltersChange: manualFiltering ? (updater) => {
      const newFilters = typeof updater === 'function' ? updater(columnFilters) : updater;
      onColumnFiltersChange?.(newFilters);
    } : setColumnFilters,
    onColumnVisibilityChange: setColumnVisibility,
    onRowSelectionChange: (updater) => {
      const newSelection = typeof updater === 'function' ? updater(rowSelection) : updater;
      onRowSelectionChange?.(newSelection);
    },
    onGlobalFilterChange: manualFiltering ? onGlobalFilterChange : setInternalGlobalFilter,
    onExpandedChange: setExpanded,
    onPaginationChange: pagination ? (updater) => {
      const currentPagination = { pageIndex: pagination.pageIndex, pageSize: pagination.pageSize };
      const newPagination = typeof updater === 'function' ? updater(currentPagination) : updater;
      pagination.onPaginationChange(newPagination);
    } : undefined,
    
    // Options
    enableRowSelection,
    enableExpanding,
    getRowId,
    getSubRows,
    manualPagination,
    manualSorting,
    manualFiltering,
    enableColumnResizing,
    columnResizeMode: "onChange",
    
    // Row count for server-side pagination
    rowCount: pagination?.total,
  });

  // Export function
  const handleExport = () => {
    if (onExport) {
      const selectedRows = table.getSelectedRowModel().rows.map(row => row.original);
      const dataToExport = selectedRows.length > 0 ? selectedRows : data;
      onExport(dataToExport);
    } else {
      // Default CSV export
      const selectedRows = table.getSelectedRowModel().rows.map(row => row.original);
      const dataToExport = selectedRows.length > 0 ? selectedRows : data;
      
      const exportableColumns = columns.filter(col => col.exportable !== false);
      const headers = exportableColumns.map(col => typeof col.header === 'string' ? col.header : col.id || col.accessorKey as string).join(",");
      const rows = dataToExport.map(row => 
        exportableColumns.map(col => {
          const value = (row as any)[col.accessorKey as string];
          return typeof value === "string" ? `"${value}"` : value;
        }).join(",")
      ).join("\n");
      
      const csv = `${headers}\n${rows}`;
      const blob = new Blob([csv], { type: "text/csv" });
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `${exportFilename}.csv`;
      a.click();
      URL.revokeObjectURL(url);
    }
  };

  const sizeClasses = {
    sm: "text-xs",
    md: "text-sm",
    lg: "text-base",
  };

  const cellPadding = {
    sm: "px-2 py-1",
    md: "px-3 py-2",
    lg: "px-4 py-3",
  };

  return (
    <div className={clsx("w-full space-y-4", className)}>
      {/* Toolbar */}
      <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
        <div className="flex flex-1 items-center space-x-2">
          {searchable && (
            <div className="relative max-w-sm">
              <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder={searchPlaceholder}
                value={internalGlobalFilter}
                onChange={(e) => setInternalGlobalFilter(e.target.value)}
                className="pl-8"
              />
            </div>
          )}
          
          {/* Column Filters */}
          {table.getHeaderGroups()[0]?.headers.some(header => 
            header.column.getCanFilter() && 
            (header.column.columnDef as DataTableColumn<T>).filterType
          ) && (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline" size="sm">
                  <Filter className="mr-2 h-4 w-4" />
                  Filters
                  {columnFilters.length > 0 && (
                    <Badge variant="secondary" className="ml-2">
                      {columnFilters.length}
                    </Badge>
                  )}
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="start" className="w-80">
                <DropdownMenuLabel>Filter Columns</DropdownMenuLabel>
                <DropdownMenuSeparator />
                {table.getHeaderGroups()[0]?.headers
                  .filter(header => header.column.getCanFilter())
                  .map(header => {
                    const column = header.column;
                    const columnDef = column.columnDef as DataTableColumn<T>;
                    
                    if (columnDef.filterType === "select" && columnDef.filterOptions) {
                      return (
                        <div key={column.id} className="p-2">
                          <label className="text-sm font-medium mb-1 block">
                            {typeof columnDef.header === 'string' ? columnDef.header : column.id}
                          </label>
                          <Select
                            value={(column.getFilterValue() as string) ?? ""}
                            onValueChange={(value) => 
                              column.setFilterValue(value === "all" ? "" : value)
                            }
                          >
                            <SelectTrigger className="w-full">
                              <SelectValue placeholder="All" />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="all">All</SelectItem>
                              {columnDef.filterOptions.map(option => (
                                <SelectItem key={option.value} value={option.value}>
                                  {option.label}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                        </div>
                      );
                    }
                    
                    return (
                      <div key={column.id} className="p-2">
                        <label className="text-sm font-medium mb-1 block">
                          {typeof columnDef.header === 'string' ? columnDef.header : column.id}
                        </label>
                        <Input
                          placeholder={`Filter ${typeof columnDef.header === 'string' ? columnDef.header : column.id}...`}
                          value={(column.getFilterValue() as string) ?? ""}
                          onChange={(e) => column.setFilterValue(e.target.value)}
                        />
                      </div>
                    );
                  })}
              </DropdownMenuContent>
            </DropdownMenu>
          )}
        </div>

        <div className="flex items-center space-x-2">
          {/* Export */}
          {enableExport && (
            <Button variant="outline" size="sm" onClick={handleExport}>
              <Download className="mr-2 h-4 w-4" />
              Export
            </Button>
          )}
          
          {/* Column Visibility */}
          {enableColumnVisibility && (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline" size="sm">
                  <Settings className="mr-2 h-4 w-4" />
                  Columns
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-48">
                <DropdownMenuLabel>Toggle Columns</DropdownMenuLabel>
                <DropdownMenuSeparator />
                {table.getAllColumns()
                  .filter(column => column.getCanHide())
                  .map(column => (
                    <DropdownMenuCheckboxItem
                      key={column.id}
                      checked={column.getIsVisible()}
                      onCheckedChange={(value) => column.toggleVisibility(!!value)}
                    >
                      {typeof column.columnDef.header === 'string' ? column.columnDef.header : column.id}
                    </DropdownMenuCheckboxItem>
                  ))}
              </DropdownMenuContent>
            </DropdownMenu>
          )}
        </div>
      </div>

      {/* Table */}
      <Card>
        <CardContent className="p-0">
          <div className="overflow-auto">
            <table className={clsx("w-full border-collapse", sizeClasses[size])}>
              <thead>
                {table.getHeaderGroups().map(headerGroup => (
                  <tr key={headerGroup.id} className="border-b bg-muted/50">
                    {headerGroup.headers.map(header => (
                      <th
                        key={header.id}
                        className={clsx(
                          "text-left font-medium text-muted-foreground",
                          cellPadding[size],
                          header.column.getCanSort() && "cursor-pointer select-none hover:bg-muted/80"
                        )}
                        style={{
                          width: header.getSize() !== 150 ? header.getSize() : undefined,
                        }}
                        onClick={header.column.getToggleSortingHandler()}
                      >
                        <div className="flex items-center space-x-1">
                          {flexRender(header.column.columnDef.header, header.getContext())}
                          {header.column.getCanSort() && (
                            <div className="flex flex-col">
                              {header.column.getIsSorted() === "asc" ? (
                                <ChevronUp className="h-3 w-3" />
                              ) : header.column.getIsSorted() === "desc" ? (
                                <ChevronDown className="h-3 w-3" />
                              ) : (
                                <div className="h-3 w-3 opacity-50">⇅</div>
                              )}
                            </div>
                          )}
                        </div>
                        {/* Column Resizer */}
                        {enableColumnResizing && header.column.getCanResize() && (
                          <div
                            onMouseDown={header.getResizeHandler()}
                            onTouchStart={header.getResizeHandler()}
                            className="absolute right-0 top-0 h-full w-1 bg-border cursor-col-resize hover:bg-primary/50"
                          />
                        )}
                      </th>
                    ))}
                  </tr>
                ))}
              </thead>
              <tbody>
                {loading ? (
                  <tr>
                    <td
                      colSpan={table.getHeaderGroups()[0]?.headers.length}
                      className={clsx("text-center text-muted-foreground", cellPadding[size])}
                    >
                      Loading...
                    </td>
                  </tr>
                ) : table.getRowModel().rows.length === 0 ? (
                  <tr>
                    <td
                      colSpan={table.getHeaderGroups()[0]?.headers.length}
                      className={clsx("text-center text-muted-foreground", cellPadding[size])}
                    >
                      No data found
                    </td>
                  </tr>
                ) : (
                  table.getRowModel().rows.map(row => (
                    <React.Fragment key={row.id}>
                      <tr className="border-b hover:bg-muted/50 transition-colors">
                        {row.getVisibleCells().map(cell => (
                          <td
                            key={cell.id}
                            className={clsx(cellPadding[size])}
                            style={{
                              width: cell.column.getSize() !== 150 ? cell.column.getSize() : undefined,
                            }}
                          >
                            {flexRender(cell.column.columnDef.cell, cell.getContext())}
                          </td>
                        ))}
                      </tr>
                      {/* Expanded Row (for variants) */}
                      {row.getIsExpanded() && renderSubComponent && (
                        <tr>
                          <td colSpan={row.getVisibleCells().length} className="p-0">
                            <div className="bg-muted/25 border-l-4 border-primary/50">
                              {renderSubComponent({ row })}
                            </div>
                          </td>
                        </tr>
                      )}
                    </React.Fragment>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>

      {/* Pagination */}
      {pagination && (
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="text-sm text-muted-foreground">
            {enableRowSelection && (
              <span className="mr-4">
                {table.getFilteredSelectedRowModel().rows.length} of{" "}
                {table.getFilteredRowModel().rows.length} row(s) selected
              </span>
            )}
            Showing {pagination.pageIndex * pagination.pageSize + 1} to{" "}
            {Math.min((pagination.pageIndex + 1) * pagination.pageSize, pagination.total)} of{" "}
            {pagination.total} entries
          </div>
          
          <div className="flex items-center space-x-2">
            <div className="flex items-center space-x-2">
              <span className="text-sm">Rows per page:</span>
              <Select
                value={pagination.pageSize.toString()}
                onValueChange={(value) =>
                  pagination.onPaginationChange({
                    pageIndex: 0,
                    pageSize: parseInt(value),
                  })
                }
              >
                <SelectTrigger className="w-16">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {PAGE_SIZE_OPTIONS.map(size => (
                    <SelectItem key={size} value={size.toString()}>
                      {size}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            
            <div className="flex items-center space-x-1">
              <Button
                variant="outline"
                size="sm"
                onClick={() =>
                  pagination.onPaginationChange({
                    pageIndex: 0,
                    pageSize: pagination.pageSize,
                  })
                }
                disabled={pagination.pageIndex === 0}
              >
                <ChevronFirst className="h-4 w-4" />
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={() =>
                  pagination.onPaginationChange({
                    pageIndex: pagination.pageIndex - 1,
                    pageSize: pagination.pageSize,
                  })
                }
                disabled={pagination.pageIndex === 0}
              >
                <ChevronLeft className="h-4 w-4" />
              </Button>
              
              <span className="text-sm px-2">
                Page {pagination.pageIndex + 1} of{" "}
                {Math.ceil(pagination.total / pagination.pageSize)}
              </span>
              
              <Button
                variant="outline"
                size="sm"
                onClick={() =>
                  pagination.onPaginationChange({
                    pageIndex: pagination.pageIndex + 1,
                    pageSize: pagination.pageSize,
                  })
                }
                disabled={
                  pagination.pageIndex >= Math.ceil(pagination.total / pagination.pageSize) - 1
                }
              >
                <ChevronRight className="h-4 w-4" />
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={() =>
                  pagination.onPaginationChange({
                    pageIndex: Math.ceil(pagination.total / pagination.pageSize) - 1,
                    pageSize: pagination.pageSize,
                  })
                }
                disabled={
                  pagination.pageIndex >= Math.ceil(pagination.total / pagination.pageSize) - 1
                }
              >
                <ChevronLast className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default DataTableV2;
