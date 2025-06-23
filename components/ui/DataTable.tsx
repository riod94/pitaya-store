"use client";
import React, { useState, useEffect } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import clsx from "clsx";

interface Column<T> {
	label: string;
	accessor: keyof T | string;
	render?: (row: T) => React.ReactNode;
	filterOptions?: { label: string; value: string }[];
	onFilter?: (value: string) => void;
	sortable?: boolean;
	width?: string;
	className?: string;
}

interface DataTableActionHandlers<T> {
	onView?: (row: T) => void;
	onEdit?: (row: T) => void;
	onDelete?: (row: T) => void;
}

interface PaginationProps {
	total: number;
	page: number;
	pageSize: number;
	onChange: (page: number) => void;
}

interface DataTableProps<T> extends DataTableActionHandlers<T> {
	columns: Column<T>[];
	data: T[];
	loading?: boolean;
	searchPlaceholder?: string;
	onSearch?: (q: string) => void;
	filterable?: boolean;
	pagination?: PaginationProps;
	onSort?: (sortBy: string, sortDir: "asc" | "desc") => void;
	checkbox?: boolean;
	selectedRows?: string[];
	rowKey?: (row: T) => string;
	onSelectRows?: (ids: string[]) => void;
	className?: string;
}

const PAGE_SIZE_OPTIONS = [10, 25, 50, 100, "All"];

import {
	DropdownMenu,
	DropdownMenuTrigger,
	DropdownMenuContent,
	DropdownMenuItem,
} from "@/components/ui/dropdown-menu";
import { MoreHorizontal } from "lucide-react";

export default function DataTable<T extends {}>({
	columns,
	data,
	loading = false,
	searchPlaceholder = "Search...",
	onSearch,
	filterable = false,
	pagination = { total: 0, page: 1, pageSize: 10, onChange: () => {} },
	onSort,
	checkbox = false,
	selectedRows = [],
	rowKey = (row: any) => row.id,
	onSelectRows,
	className = "",
	onView,
	onEdit,
	onDelete,
}: DataTableProps<T>) {
	const [search, setSearch] = useState("");
	// Debounce timer
	const debounceDelay = 300;
	useEffect(() => {
		if (!onSearch) return;
		const handler = setTimeout(() => {
			onSearch(search.toLowerCase());
		}, debounceDelay);
		return () => clearTimeout(handler);
	}, [search, onSearch]);
	const [internalSelected, setInternalSelected] =
		useState<string[]>(selectedRows);
	const [sortBy, setSortBy] = useState<string>("");
	const [sortDir, setSortDir] = useState<"asc" | "desc">("asc");
	const [filters, setFilters] = useState<Record<string, string>>({});
	const [pageSize, setPageSize] = useState<number | "All">(
		pagination.pageSize || 10
	);

	useEffect(() => {
		setInternalSelected(selectedRows);
	}, [selectedRows]);

	// Sorting handler
	const handleSort = (accessor: string) => {
		let nextDir: "asc" | "desc" = "asc";
		if (sortBy === accessor) {
			nextDir = sortDir === "asc" ? "desc" : "asc";
		}
		setSortBy(accessor);
		setSortDir(nextDir);
		onSort?.(accessor, nextDir);
	};

	// Filter handler
	const handleFilter = (accessor: string, value: string) => {
		setFilters((prev) => ({ ...prev, [accessor]: value }));
		columns.find((col) => col.accessor === accessor)?.onFilter?.(value);
	};

	const handleSelectAll = (e: React.ChangeEvent<HTMLInputElement>) => {
		if (e.target.checked) {
			const allIds = data.map(rowKey);
			setInternalSelected(allIds);
			onSelectRows?.(allIds);
		} else {
			setInternalSelected([]);
			onSelectRows?.([]);
		}
	};

	const handleSelectRow = (id: string) => {
		let next: string[];
		if (internalSelected.includes(id)) {
			next = internalSelected.filter((i) => i !== id);
		} else {
			next = [...internalSelected, id];
		}
		setInternalSelected(next);
		onSelectRows?.(next);
	};

	return (
		<div className={clsx("w-full", className)}>
			{/* Search & Filter */}
			<div className="flex flex-col md:flex-row md:items-center gap-2 my-3">
				{onSearch && (
					<input
						className="border rounded-lg px-3 py-2 text-sm w-full md:w-64 focus:outline-pink-400 bg-white"
						placeholder={searchPlaceholder}
						value={search}
						onChange={(e) => setSearch(e.target.value)}
					/>
				)}
				{filterable &&
					columns
						.filter((col) => col.filterOptions)
						.map((col, idx) => (
							<select
								key={col.accessor as string}
								className="border rounded-lg px-2 py-2 text-sm bg-white"
								value={filters[col.accessor as string] || ""}
								onChange={(e) =>
									handleFilter(col.accessor as string, e.target.value)
								}
							>
								<option value="">All {col.label}</option>
								{col.filterOptions?.map((opt) => (
									<option key={opt.value} value={opt.value}>
										{opt.label}
									</option>
								))}
							</select>
						))}
				{pagination && (
					<div className="ml-auto flex items-center gap-2">
						<span className="text-xs text-gray-500">Show</span>
						<select
							className="border rounded-lg px-2 py-2 text-sm bg-white"
							value={pageSize}
							onChange={(e) => {
								const val =
									e.target.value === "All"
										? "All"
										: parseInt(e.target.value, 10);
								setPageSize(val);
								pagination.onChange(1); // reset to page 1
								if (pagination) {
									pagination.pageSize =
										val === "All" ? pagination.total : val;
								}
							}}
						>
							{PAGE_SIZE_OPTIONS.map((opt) => (
								<option key={opt} value={opt}>
									{opt}
								</option>
							))}
						</select>
					</div>
				)}
			</div>
			{/* Table */}
			<div className="overflow-x-auto rounded-xl border bg-white">
				<table className="min-w-full divide-y divide-gray-200 text-sm">
					<thead className="bg-gray-50">
						<tr>
							{checkbox && (
								<th className="px-3 py-3 text-left">
									<input
										type="checkbox"
										checked={
											internalSelected.length === data.length &&
											data.length > 0
										}
										onChange={handleSelectAll}
									/>
								</th>
							)}
							{columns.map((col) => (
								<th
									key={col.accessor as string}
									className={clsx(
										"px-3 py-3 text-left font-semibold text-gray-700 select-none cursor-pointer group",
										col.className
									)}
									style={col.width ? { width: col.width } : {}}
									onClick={() =>
										col.sortable && handleSort(col.accessor as string)
									}
								>
									<span className="flex items-center gap-1">
										{col.label}
										{col.sortable && (
											<span className="inline-block">
												{sortBy === col.accessor ? (
													sortDir === "asc" ? (
														"▲"
													) : (
														"▼"
													)
												) : (
													<span className="opacity-30">⇅</span>
												)}
											</span>
										)}
									</span>
								</th>
							))}
							{(onView || onEdit || onDelete) && (
								<th className="px-3 py-3 text-left font-semibold text-gray-700">
									Actions
								</th>
							)}
						</tr>
					</thead>
					<tbody>
						{loading ? (
							<tr>
								<td
									colSpan={
										columns.length +
										(checkbox ? 1 : 0) +
										(onView || onEdit || onDelete ? 1 : 0)
									}
									className="text-center py-8"
								>
									Loading...
								</td>
							</tr>
						) : data.length === 0 ? (
							<tr>
								<td
									colSpan={
										columns.length +
										(checkbox ? 1 : 0) +
										(onView || onEdit || onDelete ? 1 : 0)
									}
									className="text-center py-8 text-gray-400"
								>
									No data found
								</td>
							</tr>
						) : (
							data.map((row, idx) => {
								const id = rowKey(row);
								return (
									<tr
										key={id}
										className={clsx(
											"hover:bg-pink-50 transition-colors",
											idx % 2 === 1 ? "bg-gray-50" : "bg-white"
										)}
									>
										{checkbox && (
											<td className="px-3 py-2">
												<input
													type="checkbox"
													checked={internalSelected.includes(id)}
													onChange={() => handleSelectRow(id)}
												/>
											</td>
										)}
										{columns.map((col) => (
											<td
												key={col.accessor as string}
												className={clsx("px-3 py-2", col.className)}
											>
												{col.render
													? col.render(row)
													: (row as any)[col.accessor]}
											</td>
										))}
										{(onView || onEdit || onDelete) && (
											<td className="px-3 py-2 whitespace-nowrap">
												{(() => {
													const actions = [
														onView
															? {
																	label: "View",
																	onClick: () => onView(row),
																	className: "text-blue-500",
															  }
															: null,
														onEdit
															? {
																	label: "Edit",
																	onClick: () => onEdit(row),
																	className: "text-yellow-600",
															  }
															: null,
														onDelete
															? {
																	label: "Delete",
																	onClick: () => onDelete(row),
																	className: "text-red-500",
															  }
															: null,
													].filter(Boolean);
													if (actions.length === 1) {
														const action = actions[0]!;
														return (
															<button
																className={
																	"text-xs px-2 py-1 rounded hover:underline " +
																	action.className
																}
																onClick={action.onClick}
															>
																{action.label}
															</button>
														);
													}
													if (actions.length > 1) {
														return (
															<DropdownMenu>
																<DropdownMenuTrigger asChild>
																	<button className="p-2 rounded-full hover:bg-gray-100 focus:outline-none">
																		<MoreHorizontal className="w-5 h-5" />
																	</button>
																</DropdownMenuTrigger>
																<DropdownMenuContent align="end">
																	{actions.map(
																		(action, i) =>
																			action && (
																				<DropdownMenuItem
																					key={
																						action.label
																					}
																					className={
																						action.className +
																						" cursor-pointer"
																					}
																					onClick={
																						action.onClick
																					}
																				>
																					{action.label}
																				</DropdownMenuItem>
																			)
																	)}
																</DropdownMenuContent>
															</DropdownMenu>
														);
													}
													return null;
												})()}
											</td>
										)}
									</tr>
								);
							})
						)}
					</tbody>
				</table>
			</div>
			{/* Pagination */}
			{pagination && (
				<div className="flex flex-col md:flex-row md:items-center justify-between gap-2 mt-4">
					<div className="text-gray-500 text-xs md:text-sm">
						Showing {(pagination.page - 1) * pagination.pageSize + 1}
						{"-"}
						{Math.min(
							pagination.page * pagination.pageSize,
							pagination.total
						)}
						{" of "}
						{pagination.total}
					</div>
					<div className="flex gap-2 items-center">
						<button
							className="p-2 rounded-full border hover:bg-gray-100 disabled:opacity-50"
							onClick={() => pagination.onChange(pagination.page - 1)}
							disabled={pagination.page <= 1}
						>
							<ChevronLeft size={18} />
						</button>
						<span className="text-xs md:text-sm">
							Page {pagination.page} of{" "}
							{Math.ceil(pagination.total / pagination.pageSize)}
						</span>
						<button
							className="p-2 rounded-full border hover:bg-gray-100 disabled:opacity-50"
							onClick={() => pagination.onChange(pagination.page + 1)}
							disabled={
								pagination.page >=
								Math.ceil(pagination.total / pagination.pageSize)
							}
						>
							<ChevronRight size={18} />
						</button>
					</div>
				</div>
			)}
		</div>
	);
}
