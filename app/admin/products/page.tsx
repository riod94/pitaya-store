"use client";

import Link from "next/link";
import Image from "next/image";
import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import DataTable from "@/components/ui/DataTable";
import { Plus, MoreHorizontal } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";

export default function ProductsPage() {
	const [data, setData] = useState<any[]>([]);
	const [loading, setLoading] = useState(false);
	const [total, setTotal] = useState(0);
	const [page, setPage] = useState(1);
	const [pageSize, setPageSize] = useState<number | "All">(10);
	const [search, setSearch] = useState("");
	const [selected, setSelected] = useState<string[]>([]);
	const [sortBy, setSortBy] = useState<string>("name");
	const [sortDir, setSortDir] = useState<"asc" | "desc">("asc");
	const [statusFilter, setStatusFilter] = useState<string>("");

	// Handler untuk View/Edit/Delete
	const handleView = (row: any) => {
		alert(`View produk: ${row.name}`);
	};
	const handleEdit = (row: any) => {
		window.location.href = `/admin/products/${row.id}`;
	};
	const handleDelete = (row: any) => {
		if (confirm(`Yakin hapus produk: ${row.name}?`)) {
			// Implementasi delete API
			alert("Produk dihapus (dummy)");
		}
	};

	useEffect(() => {
		setLoading(true);
		const params = new URLSearchParams({
			page: String(page),
			pageSize:
				pageSize === "All" ? String(total || 1000) : String(pageSize),
			search,
			sortBy,
			sortDir,
			status: statusFilter,
		});
		fetch(`/api/admin/products?${params.toString()}`)
			.then((res) => res.json())
			.then((res) => {
				setData(res.data || []);
				setTotal(res.pagination.totalCount || 0);
			})
			.finally(() => setLoading(false));
	}, [page, pageSize, search, sortBy, sortDir, statusFilter, total]);

	const columns = [
		{
			label: "Image",
			accessor: "images",
			render: (row: any) => (
				<div className="w-10 h-10 rounded-md overflow-hidden bg-gray-100">
					<Image
						src={row.images[0] || "/placeholder.svg"}
						alt={row.name}
						width={40}
						height={40}
						className="w-full h-full object-cover"
					/>
				</div>
			),
			width: "80px",
		},
		{
			label: "Product",
			accessor: "name",
			className: "font-medium",
			sortable: true,
		},
		{
			label: "Category",
			accessor: "category",
			render: (row: any) => `${row.category?.name}`,
			sortable: false,
		},
		{
			label: "Price",
			accessor: "costPrice",
			render: (row: any) => `Rp ${row.costPrice}`,
			sortable: true,
		},
		{
			label: "HPP",
			accessor: "hpp",
			render: (row: any) => `Rp ${row.hpp}`,
			sortable: true,
		},
		{
			label: "Sell Price",
			accessor: "sellingPrice",
			render: (row: any) => `Rp ${row.sellingPrice}`,
			sortable: true,
		},
		{ label: "Stock", accessor: "stockQuantity", sortable: true },
		{
			label: "Status",
			accessor: "status",
			filterOptions: [
				{ label: "All", value: "" },
				{ label: "Active", value: "active" },
				{ label: "Inactive", value: "inactive" },
				{ label: "Discontinued", value: "discontinued" },
			],
			onFilter: setStatusFilter,
			render: (row: any) => (
				<div
					className={`px-2 py-1 rounded-full text-xs font-medium inline-block ${
						row.status === "active"
							? "bg-green-100 text-green-800"
							: row.status === "discontinued"
							? "bg-yellow-100 text-yellow-800"
							: "bg-red-100 text-red-800"
					}`}
				>
					{row.status}
				</div>
			),
		},
	];

	return (
		<div className="space-y-6">
			<div className="flex items-center justify-between">
				<div>
					<h1 className="text-2xl font-bold tracking-tight">Products</h1>
					<p className="text-muted-foreground">
						Manage your product inventory and pricing.
					</p>
				</div>
				<Link href="/admin/products/new">
					<Button className="bg-pink-500 hover:bg-pink-600">
						<Plus className="mr-2 h-4 w-4" /> Add Product
					</Button>
				</Link>
			</div>
			<Card>
				<CardContent>
					<DataTable
						columns={columns}
						data={data}
						loading={loading}
						searchPlaceholder="Search products..."
						onSearch={setSearch}
						filterable
						onSort={(by, dir) => {
							setSortBy(by);
							setSortDir(dir);
						}}
						pagination={{
							total,
							page,
							pageSize: pageSize === "All" ? total : pageSize,
							onChange: setPage,
						}}
						checkbox
						selectedRows={selected}
						onSelectRows={setSelected}
						rowKey={(row: any) => row.id}
						onView={handleView}
						onEdit={handleEdit}
						onDelete={handleDelete}
					/>
				</CardContent>
			</Card>
		</div>
	);
}
