"use client";

import Link from "next/link";
import Image from "next/image";
import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import DataTableV2, { DataTableColumn, DataTableAction } from "@/components/ui/DataTableV2";
import { Plus, Eye, Edit, Trash2, Package, Star, DollarSign } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

// Types
interface ProductVariant {
  id: string;
  name: string;
  sku: string;
  price: number;
  stock: number;
  attributes: Record<string, string>; // e.g., { color: "Red", size: "M" }
}

interface Product {
  id: string;
  name: string;
  category: {
    id: string;
    name: string;
  };
  images: string[];
  costPrice: number;
  hpp: number;
  sellingPrice: number;
  stockQuantity: number;
  status: "active" | "inactive" | "discontinued";
  variants?: ProductVariant[];
  hasVariants: boolean;
  createdAt: string;
  updatedAt: string;
}

export default function ProductsPageV2() {
  const [data, setData] = useState<Product[]>([]);
  const [loading, setLoading] = useState(false);
  const [pagination, setPagination] = useState({
    pageIndex: 0,
    pageSize: 10,
    total: 0,
  });
  const [globalFilter, setGlobalFilter] = useState("");
  const [rowSelection, setRowSelection] = useState({});
  const [showImport, setShowImport] = useState(false);

  // Fetch data
  useEffect(() => {
    setLoading(true);
    const params = new URLSearchParams({
      page: String(pagination.pageIndex + 1),
      pageSize: String(pagination.pageSize),
      search: globalFilter,
    });

    fetch(`/api/admin/products?${params.toString()}`)
      .then((res) => res.json())
      .then((res) => {
        // Mock data with variants for demo
        const mockData: Product[] = (res.data || []).map((product: any) => ({
          ...product,
          hasVariants: Math.random() > 0.7, // 30% chance of having variants
          variants: Math.random() > 0.7 ? [
            {
              id: `${product.id}-v1`,
              name: `${product.name} - Red`,
              sku: `${product.id}-RED`,
              price: product.sellingPrice + 10000,
              stock: Math.floor(Math.random() * 50),
              attributes: { color: "Red", size: "M" },
            },
            {
              id: `${product.id}-v2`,
              name: `${product.name} - Blue`,
              sku: `${product.id}-BLUE`,
              price: product.sellingPrice + 15000,
              stock: Math.floor(Math.random() * 50),
              attributes: { color: "Blue", size: "L" },
            },
          ] : undefined,
        }));

        setData(mockData);
        setPagination(prev => ({
          ...prev,
          total: res.pagination?.totalCount || 0,
        }));
      })
      .finally(() => setLoading(false));
  }, [pagination.pageIndex, pagination.pageSize, globalFilter]);

  // Actions
  const actions: DataTableAction<Product>[] = [
    {
      label: "View",
      icon: <Eye className="mr-2 h-4 w-4" />,
      onClick: (product) => {
        // Navigate to product detail page or show modal
        window.location.href = `/admin/products/${product.id}`;
      },
      variant: "outline",
    },
    {
      label: "Edit",
      icon: <Edit className="mr-2 h-4 w-4" />,
      onClick: (product) => {
        window.location.href = `/admin/products/${product.id}/edit`;
      },
      variant: "outline",
    },
    {
      label: "Delete",
      icon: <Trash2 className="mr-2 h-4 w-4" />,
      onClick: async (product) => {
        if (!confirm(`Are you sure you want to delete ${product.name}?`)) return;
        const res = await fetch(`/api/admin/products/${product.id}`, {
          method: "DELETE",
        });
        if (res.ok) {
          alert(`Product ${product.name} deleted`);
          setPagination(prev => ({ ...prev, pageIndex: 0 }));
        } else {
          alert("Failed to delete product");
        }
      },
      variant: "destructive",
      className: "text-red-600",
    },
  ];

  // Columns definition
  const columns: DataTableColumn<Product>[] = [
    {
      id: "image",
      header: "Image",
      cell: ({ row }) => (
        <div className="w-12 h-12 rounded-md overflow-hidden bg-gray-100">
          <Image
            src={row.original.images[0] || "/placeholder.svg"}
            alt={row.original.name}
            width={48}
            height={48}
            className="w-full h-full object-cover"
          />
        </div>
      ),
      size: 80,
      enableSorting: false,
      exportable: false,
    },
    {
      accessorKey: "name",
      header: "Product",
      cell: ({ row }) => (
        <div className="space-y-1">
          <div className="font-medium">{row.original.name}</div>
          {row.original.hasVariants && (
            <Badge variant="secondary" className="text-xs">
              <Package className="mr-1 h-3 w-3" />
              {row.original.variants?.length || 0} variants
            </Badge>
          )}
        </div>
      ),
      sortable: true,
      filterType: "text",
    },
    {
      accessorKey: "category.name",
      header: "Category",
      cell: ({ row }) => row.original.category?.name || "-",
      sortable: true,
      filterType: "select",
      filterOptions: [
        { label: "Electronics", value: "electronics" },
        { label: "Clothing", value: "clothing" },
        { label: "Books", value: "books" },
        { label: "Home & Garden", value: "home-garden" },
      ],
    },
    {
      accessorKey: "costPrice",
      header: "Cost Price",
      cell: ({ row }) => (
        <div className="text-right">
          Rp {row.original.costPrice.toLocaleString("id-ID")}
        </div>
      ),
      sortable: true,
      filterType: "number",
    },
    {
      accessorKey: "sellingPrice",
      header: "Selling Price",
      cell: ({ row }) => (
        <div className="text-right font-medium">
          Rp {row.original.sellingPrice.toLocaleString("id-ID")}
        </div>
      ),
      sortable: true,
      filterType: "number",
    },
    {
      accessorKey: "stockQuantity",
      header: "Stock",
      cell: ({ row }) => (
        <div className="text-center">
          <Badge
            variant={row.original.stockQuantity > 10 ? "default" : "destructive"}
          >
            {row.original.stockQuantity}
          </Badge>
        </div>
      ),
      sortable: true,
      filterType: "number",
    },
    {
      accessorKey: "status",
      header: "Status",
      cell: ({ row }) => {
        const status = row.original.status;
        const variants: Record<string, string> = {
          active: "bg-green-100 text-green-800",
          inactive: "bg-red-100 text-red-800",
          discontinued: "bg-yellow-100 text-yellow-800",
        };
        return (
          <Badge className={variants[status] || "bg-gray-100 text-gray-800"}>
            {status.charAt(0).toUpperCase() + status.slice(1)}
          </Badge>
        );
      },
      sortable: true,
      filterType: "select",
      filterOptions: [
        { label: "Active", value: "active" },
        { label: "Inactive", value: "inactive" },
        { label: "Discontinued", value: "discontinued" },
      ],
    },
  ];

  // Render product variants sub-component
  const renderSubComponent = ({ row }: { row: any }) => {
    const product = row.original as Product;
    if (!product.variants || product.variants.length === 0) {
      return (
        <div className="p-4 text-center text-muted-foreground">
          No variants available
        </div>
      );
    }

    return (
      <div className="p-4 space-y-3">
        <h4 className="font-medium text-sm text-muted-foreground">
          Product Variants ({product.variants.length})
        </h4>
        <div className="grid gap-3">
          {product.variants.map((variant) => (
            <div
              key={variant.id}
              className="flex items-center justify-between p-3 bg-background rounded-lg border"
            >
              <div className="space-y-1">
                <div className="font-medium text-sm">{variant.name}</div>
                <div className="text-xs text-muted-foreground">
                  SKU: {variant.sku}
                </div>
                <div className="flex gap-2">
                  {Object.entries(variant.attributes).map(([key, value]) => (
                    <Badge key={key} variant="outline" className="text-xs">
                      {key}: {value}
                    </Badge>
                  ))}
                </div>
              </div>
              <div className="text-right space-y-1">
                <div className="font-medium">
                  Rp {variant.price.toLocaleString("id-ID")}
                </div>
                <div className="text-xs text-muted-foreground">
                  Stock: {variant.stock}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  };

  // Export handler
  const handleExport = (exportData: Product[]) => {
    console.log("Exporting data:", exportData);
    // Implement your export logic here
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Products V2</h1>
          <p className="text-muted-foreground">
            Advanced product management with TanStack Table
          </p>
        </div>
        <div className="flex flex-wrap gap-2 items-center">
          {Object.keys(rowSelection).length > 0 && (
            <>
              <Button
                variant="destructive"
                onClick={async () => {
                  if (!confirm(`Delete ${Object.keys(rowSelection).length} selected products?`)) return;
                  const res = await fetch('/api/admin/products/bulk', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({
                      action: 'delete',
                      productIds: Object.keys(rowSelection).map(id => parseInt(id)),
                    }),
                  });
                  if (res.ok) {
                    alert('Deleted selected products');
                    setRowSelection({});
                    setPagination(prev => ({ ...prev, pageIndex: 0 }));
                  } else {
                    alert('Failed to delete products');
                  }
                }}
              >
                Delete Selected ({Object.keys(rowSelection).length})
              </Button>
              <Button
                onClick={async () => {
                  const stock = prompt('Enter new stock quantity for selected products:');
                  if (stock === null) return;
                  const stockNum = parseInt(stock);
                  if (isNaN(stockNum)) {
                    alert('Invalid number');
                    return;
                  }
                  const res = await fetch('/api/admin/products/bulk', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({
                      action: 'updateStock',
                      productIds: Object.keys(rowSelection).map(id => parseInt(id)),
                      stockUpdate: stockNum,
                    }),
                  });
                  if (res.ok) {
                    alert('Updated stock for selected products');
                    setRowSelection({});
                    setPagination(prev => ({ ...prev, pageIndex: 0 }));
                  } else {
                    alert('Failed to update stock');
                  }
                }}
              >
                Edit Stock Selected ({Object.keys(rowSelection).length})
              </Button>
            </>
          )}
          <Button className="bg-pink-500 hover:bg-pink-600" onClick={() => window.location.href = '/admin/products/new'}>
            <Plus className="mr-2 h-4 w-4" />
            Add Product
          </Button>
          <Button onClick={() => setShowImport(true)}>
            Import Products
          </Button>
        </div>
      </div>

      {/* Import Modal */}
      {showImport && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-lg">
            <h2 className="text-xl font-semibold mb-4">Import Products</h2>
            <input
              type="file"
              accept=".json,.csv"
              onChange={async (e) => {
                const file = e.target.files?.[0];
                if (!file) return;
                const text = await file.text();
                let productsToImport = [];
                try {
                  if (file.name.endsWith(".json")) {
                    productsToImport = JSON.parse(text);
                  } else if (file.name.endsWith(".csv")) {
                    // Simple CSV parse (assuming header row)
                    const lines = text.split("\n").filter(Boolean);
                    const headers = lines[0].split(",").map(h => h.trim());
                    productsToImport = lines.slice(1).map(line => {
                      const values = line.split(",").map(v => v.trim());
                      const obj: any = {};
                      headers.forEach((header, i) => {
                        obj[header] = values[i];
                      });
                      return obj;
                    });
                  } else {
                    alert("Unsupported file format");
                    return;
                  }
                } catch (err) {
                  alert("Failed to parse file");
                  return;
                }

                // Call import API
                const res = await fetch("/api/admin/products/bulk", {
                  method: "PUT",
                  headers: { "Content-Type": "application/json" },
                  body: JSON.stringify({ products: productsToImport }),
                });
                if (res.ok) {
                  alert("Products imported successfully");
                  setShowImport(false);
                  setPagination(prev => ({ ...prev, pageIndex: 0 }));
                } else {
                  alert("Failed to import products");
                }
              }}
            />
            <div className="mt-4 flex justify-end space-x-2">
              <Button variant="outline" onClick={() => setShowImport(false)}>
                Cancel
              </Button>
            </div>
          </div>
        </div>
      )}

      {/* Stats Cards */}
      <div className="grid gap-4 md:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Products</CardTitle>
            <Package className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{pagination.total}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">With Variants</CardTitle>
            <Star className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {data.filter(p => p.hasVariants).length}
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Active Products</CardTitle>
            <Package className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {data.filter(p => p.status === 'active').length}
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Value</CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              Rp {data.reduce((sum, p) => sum + (p.sellingPrice * p.stockQuantity), 0).toLocaleString("id-ID")}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* DataTable */}
      <Card>
        <CardContent className="p-6">
          <DataTableV2
            data={data}
            columns={columns}
            loading={loading}
            
            // Search & Filter
            searchable
            searchPlaceholder="Search products..."
            globalFilter={globalFilter}
            onGlobalFilterChange={setGlobalFilter}
            
            // Pagination
            pagination={{
              pageIndex: pagination.pageIndex,
              pageSize: pagination.pageSize,
              total: pagination.total,
              onPaginationChange: (newPagination) => {
                setPagination(prev => ({
                  ...prev,
                  pageIndex: newPagination.pageIndex,
                  pageSize: newPagination.pageSize,
                }));
              },
            }}
            
            // Selection
            enableRowSelection
            rowSelection={rowSelection}
            onRowSelectionChange={setRowSelection}
            getRowId={(row) => row.id}
            
            // Expansion for variants
            enableExpanding
            getSubRows={(row) => row.hasVariants ? [] : undefined} // Enable expansion for products with variants
            renderSubComponent={renderSubComponent}
            
            // Actions
            actions={actions}
            
            // Export
            enableExport
            exportFilename="products"
            onExport={handleExport}
            
            // Column Management
            enableColumnVisibility
            enableColumnResizing
            
            // Styling
            size="md"
            className="w-full"
            
            // Server-side operations
            manualPagination
            manualSorting={false}
            manualFiltering={false}
          />
        </CardContent>
      </Card>
    </div>
  );
}
