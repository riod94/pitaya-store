"use client";

import { useState, useMemo } from "react";
import DataTableV2, { DataTableColumn, DataTableAction } from "@/components/ui/DataTableV2";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Eye, Edit, Trash2, Plus, RefreshCw } from "lucide-react";

// Sample data types
interface User {
  id: string;
  name: string;
  email: string;
  role: "admin" | "user" | "moderator";
  status: "active" | "inactive" | "pending";
  joinDate: string;
  lastLogin: string;
  posts: number;
}

// Generate sample data
const generateSampleData = (count: number): User[] => {
  const roles: User["role"][] = ["admin", "user", "moderator"];
  const statuses: User["status"][] = ["active", "inactive", "pending"];
  const names = ["John Doe", "Jane Smith", "Bob Johnson", "Alice Brown", "Charlie Wilson", "Diana Davis", "Eve Miller", "Frank Garcia", "Grace Lee", "Henry Taylor"];
  
  return Array.from({ length: count }, (_, i) => ({
    id: `user-${i + 1}`,
    name: names[i % names.length] + ` ${i + 1}`,
    email: `user${i + 1}@example.com`,
    role: roles[Math.floor(Math.random() * roles.length)],
    status: statuses[Math.floor(Math.random() * statuses.length)],
    joinDate: new Date(Date.now() - Math.random() * 365 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
    lastLogin: new Date(Date.now() - Math.random() * 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
    posts: Math.floor(Math.random() * 100),
  }));
};

export default function DataTableDemoPage() {
  const [data, setData] = useState<User[]>(() => generateSampleData(50));
  const [loading, setLoading] = useState(false);
  const [globalFilter, setGlobalFilter] = useState("");
  const [rowSelection, setRowSelection] = useState({});
  const [pagination, setPagination] = useState({
    pageIndex: 0,
    pageSize: 10,
    total: 50,
  });

  // Refresh data
  const refreshData = () => {
    setLoading(true);
    setTimeout(() => {
      setData(generateSampleData(50));
      setLoading(false);
    }, 1000);
  };

  // Actions
  const actions: DataTableAction<User>[] = [
    {
      label: "View",
      icon: <Eye className="mr-2 h-4 w-4" />,
      onClick: (user) => {
        alert(`Viewing user: ${user.name}`);
      },
      variant: "outline",
    },
    {
      label: "Edit",
      icon: <Edit className="mr-2 h-4 w-4" />,
      onClick: (user) => {
        alert(`Editing user: ${user.name}`);
      },
      variant: "outline",
    },
    {
      label: "Delete",
      icon: <Trash2 className="mr-2 h-4 w-4" />,
      onClick: (user) => {
        if (confirm(`Are you sure you want to delete ${user.name}?`)) {
          setData(prev => prev.filter(u => u.id !== user.id));
        }
      },
      variant: "destructive",
      show: (user) => user.role !== "admin", // Hide delete for admins
    },
  ];

  // Columns definition
  const columns: DataTableColumn<User>[] = useMemo(() => [
    {
      accessorKey: "name",
      header: "Name",
      cell: ({ row }) => (
        <div className="font-medium">{row.original.name}</div>
      ),
      sortable: true,
      filterType: "text",
    },
    {
      accessorKey: "email",
      header: "Email",
      cell: ({ row }) => (
        <div className="text-muted-foreground">{row.original.email}</div>
      ),
      sortable: true,
      filterType: "text",
    },
    {
      accessorKey: "role",
      header: "Role",
      cell: ({ row }) => {
        const role = row.original.role;
        const variants: Record<string, string> = {
          admin: "bg-red-100 text-red-800",
          moderator: "bg-blue-100 text-blue-800",
          user: "bg-gray-100 text-gray-800",
        };
        return (
          <Badge className={variants[role] || "bg-gray-100 text-gray-800"}>
            {role.charAt(0).toUpperCase() + role.slice(1)}
          </Badge>
        );
      },
      sortable: true,
      filterType: "select",
      filterOptions: [
        { label: "Admin", value: "admin" },
        { label: "Moderator", value: "moderator" },
        { label: "User", value: "user" },
      ],
    },
    {
      accessorKey: "status",
      header: "Status",
      cell: ({ row }) => {
        const status = row.original.status;
        const variants: Record<string, string> = {
          active: "bg-green-100 text-green-800",
          inactive: "bg-red-100 text-red-800",
          pending: "bg-yellow-100 text-yellow-800",
        };
        return (
          <Badge className={variants[status]}>
            {status.charAt(0).toUpperCase() + status.slice(1)}
          </Badge>
        );
      },
      sortable: true,
      filterType: "select",
      filterOptions: [
        { label: "Active", value: "active" },
        { label: "Inactive", value: "inactive" },
        { label: "Pending", value: "pending" },
      ],
    },
    {
      accessorKey: "joinDate",
      header: "Join Date",
      cell: ({ row }) => (
        <div className="text-sm">
          {new Date(row.original.joinDate).toLocaleDateString()}
        </div>
      ),
      sortable: true,
      filterType: "date",
    },
    {
      accessorKey: "lastLogin",
      header: "Last Login",
      cell: ({ row }) => (
        <div className="text-sm text-muted-foreground">
          {new Date(row.original.lastLogin).toLocaleDateString()}
        </div>
      ),
      sortable: true,
      filterType: "date",
    },
    {
      accessorKey: "posts",
      header: "Posts",
      cell: ({ row }) => (
        <div className="text-center font-medium">
          {row.original.posts}
        </div>
      ),
      sortable: true,
      filterType: "number",
    },
  ], []);

  // Export handler
  const handleExport = (exportData: User[]) => {
    console.log("Exporting users:", exportData);
    // Create CSV
    const headers = ["Name", "Email", "Role", "Status", "Join Date", "Last Login", "Posts"];
    const csvContent = [
      headers.join(","),
      ...exportData.map(user => [
        `"${user.name}"`,
        `"${user.email}"`,
        user.role,
        user.status,
        user.joinDate,
        user.lastLogin,
        user.posts,
      ].join(","))
    ].join("\n");

    const blob = new Blob([csvContent], { type: "text/csv" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "users.csv";
    a.click();
    URL.revokeObjectURL(url);
  };

  // Filter data for client-side operations
  const filteredData = useMemo(() => {
    if (!globalFilter) return data;
    return data.filter(user => 
      user.name.toLowerCase().includes(globalFilter.toLowerCase()) ||
      user.email.toLowerCase().includes(globalFilter.toLowerCase()) ||
      user.role.toLowerCase().includes(globalFilter.toLowerCase()) ||
      user.status.toLowerCase().includes(globalFilter.toLowerCase())
    );
  }, [data, globalFilter]);

  // Paginated data for client-side pagination
  const paginatedData = useMemo(() => {
    const start = pagination.pageIndex * pagination.pageSize;
    const end = start + pagination.pageSize;
    return filteredData.slice(start, end);
  }, [filteredData, pagination.pageIndex, pagination.pageSize]);

  // Update total when filtered data changes
  const total = filteredData.length;

  return (
    <div className="space-y-6 p-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">DataTable V2 Demo</h1>
          <p className="text-muted-foreground">
            Showcase of advanced DataTable features with sample user data
          </p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" onClick={refreshData} disabled={loading}>
            <RefreshCw className={`mr-2 h-4 w-4 ${loading ? 'animate-spin' : ''}`} />
            Refresh
          </Button>
          <Button>
            <Plus className="mr-2 h-4 w-4" />
            Add User
          </Button>
        </div>
      </div>

      {/* Stats */}
      <div className="grid gap-4 md:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Users</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{data.length}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Active Users</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {data.filter(u => u.status === 'active').length}
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Admins</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {data.filter(u => u.role === 'admin').length}
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Selected</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {Object.keys(rowSelection).length}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* DataTable */}
      <Card>
        <CardContent className="p-6">
          <DataTableV2
            data={paginatedData}
            columns={columns}
            loading={loading}
            
            // Search & Filter
            searchable
            searchPlaceholder="Search users..."
            globalFilter={globalFilter}
            onGlobalFilterChange={setGlobalFilter}
            
            // Pagination (client-side)
            pagination={{
              pageIndex: pagination.pageIndex,
              pageSize: pagination.pageSize,
              total: total,
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
            
            // Actions
            actions={actions}
            
            // Export
            enableExport
            exportFilename="users-demo"
            onExport={handleExport}
            
            // Column Management
            enableColumnVisibility
            enableColumnResizing
            
            // Styling
            size="md"
            className="w-full"
          />
        </CardContent>
      </Card>

      {/* Selected Data Info */}
      {Object.keys(rowSelection).length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle>Selected Users ({Object.keys(rowSelection).length})</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              {Object.keys(rowSelection).map(id => {
                const user = data.find(u => u.id === id);
                return user ? (
                  <div key={id} className="flex items-center justify-between p-2 bg-muted rounded">
                    <span>{user.name} ({user.email})</span>
                    <Badge variant="outline">{user.role}</Badge>
                  </div>
                ) : null;
              })}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
