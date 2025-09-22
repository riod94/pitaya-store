# DataTableV2 - Advanced Data Table Component

DataTableV2 adalah komponen data table yang powerful dan flexible menggunakan TanStack Table sebagai core engine. Komponen ini dirancang untuk menggantikan DataTable yang lama dengan fitur-fitur yang lebih advanced.

## Features

### Core Features
- ✅ **Search & Filtering**: Global search dengan debouncing + column-specific filters
- ✅ **Sorting**: Multi-column sorting dengan visual indicators
- ✅ **Pagination**: Server-side dan client-side pagination
- ✅ **Row Selection**: Single dan multiple row selection dengan checkbox
- ✅ **Column Management**: Show/hide columns, column resizing
- ✅ **Export**: CSV export dengan customizable data
- ✅ **Loading States**: Built-in loading indicators
- ✅ **Responsive Design**: Mobile-friendly dengan horizontal scroll

### Advanced Features
- ✅ **Row Expansion**: Support untuk nested data (perfect untuk product variants)
- ✅ **Custom Actions**: Flexible action buttons per row
- ✅ **Column Filtering**: Text, select, number, dan date filters
- ✅ **Virtual Scrolling**: Performance optimization untuk large datasets
- ✅ **TypeScript**: Full type safety
- ✅ **Customizable Styling**: Tailwind CSS dengan size variants

## Installation

```bash
bun add @tanstack/react-table
```

## Basic Usage

```tsx
import DataTableV2, { DataTableColumn } from "@/components/ui/DataTableV2";

interface User {
  id: string;
  name: string;
  email: string;
  status: "active" | "inactive";
}

const columns: DataTableColumn<User>[] = [
  {
    accessorKey: "name",
    header: "Name",
    sortable: true,
    filterType: "text",
  },
  {
    accessorKey: "email",
    header: "Email",
    sortable: true,
    filterType: "text",
  },
  {
    accessorKey: "status",
    header: "Status",
    cell: ({ row }) => (
      <Badge variant={row.original.status === "active" ? "default" : "secondary"}>
        {row.original.status}
      </Badge>
    ),
    filterType: "select",
    filterOptions: [
      { label: "Active", value: "active" },
      { label: "Inactive", value: "inactive" },
    ],
  },
];

function UsersTable() {
  const [data, setData] = useState<User[]>([]);
  const [loading, setLoading] = useState(false);

  return (
    <DataTableV2
      data={data}
      columns={columns}
      loading={loading}
      searchable
      enableRowSelection
      enableExport
    />
  );
}
```

## Advanced Usage with Product Variants

```tsx
interface Product {
  id: string;
  name: string;
  variants?: ProductVariant[];
  hasVariants: boolean;
}

interface ProductVariant {
  id: string;
  name: string;
  sku: string;
  price: number;
  attributes: Record<string, string>;
}

const columns: DataTableColumn<Product>[] = [
  {
    accessorKey: "name",
    header: "Product",
    cell: ({ row }) => (
      <div className="space-y-1">
        <div className="font-medium">{row.original.name}</div>
        {row.original.hasVariants && (
          <Badge variant="secondary">
            {row.original.variants?.length || 0} variants
          </Badge>
        )}
      </div>
    ),
  },
  // ... other columns
];

const renderSubComponent = ({ row }: { row: any }) => {
  const product = row.original as Product;
  
  return (
    <div className="p-4 space-y-3">
      <h4 className="font-medium">Product Variants</h4>
      <div className="grid gap-3">
        {product.variants?.map((variant) => (
          <div key={variant.id} className="flex justify-between p-3 border rounded">
            <div>
              <div className="font-medium">{variant.name}</div>
              <div className="text-sm text-muted-foreground">SKU: {variant.sku}</div>
            </div>
            <div className="text-right">
              <div className="font-medium">Rp {variant.price.toLocaleString()}</div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

function ProductsTable() {
  return (
    <DataTableV2
      data={products}
      columns={columns}
      enableExpanding
      getSubRows={(row) => row.hasVariants ? [] : undefined}
      renderSubComponent={renderSubComponent}
      // ... other props
    />
  );
}
```

## Props Reference

### DataTableProps<T>

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `data` | `T[]` | - | Array of data to display |
| `columns` | `DataTableColumn<T>[]` | - | Column definitions |
| `loading` | `boolean` | `false` | Show loading state |

#### Search & Filter
| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `searchable` | `boolean` | `true` | Enable global search |
| `searchPlaceholder` | `string` | `"Search..."` | Search input placeholder |
| `globalFilter` | `string` | `""` | Current global filter value |
| `onGlobalFilterChange` | `(value: string) => void` | - | Global filter change handler |

#### Pagination
| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `pagination` | `PaginationConfig` | - | Pagination configuration |
| `manualPagination` | `boolean` | `false` | Enable server-side pagination |

#### Selection
| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `enableRowSelection` | `boolean` | `false` | Enable row selection |
| `rowSelection` | `RowSelectionState` | `{}` | Current selection state |
| `onRowSelectionChange` | `(selection: RowSelectionState) => void` | - | Selection change handler |
| `getRowId` | `(row: T) => string` | - | Custom row ID getter |

#### Expansion (for variants)
| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `enableExpanding` | `boolean` | `false` | Enable row expansion |
| `getSubRows` | `(row: T) => T[] \| undefined` | - | Get sub-rows for expansion |
| `renderSubComponent` | `(props: { row: Row<T> }) => ReactElement` | - | Render expanded content |

#### Actions
| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `actions` | `DataTableAction<T>[]` | `[]` | Row action definitions |

#### Export
| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `enableExport` | `boolean` | `false` | Enable export functionality |
| `exportFilename` | `string` | `"data"` | Export filename |
| `onExport` | `(data: T[]) => void` | - | Custom export handler |

#### Column Management
| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `enableColumnVisibility` | `boolean` | `true` | Enable column show/hide |
| `enableColumnResizing` | `boolean` | `true` | Enable column resizing |

#### Styling
| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `size` | `"sm" \| "md" \| "lg"` | `"md"` | Table size variant |
| `className` | `string` | `""` | Additional CSS classes |

### DataTableColumn<T>

| Prop | Type | Description |
|------|------|-------------|
| `id` | `string` | Unique column identifier |
| `accessorKey` | `keyof T \| string` | Data accessor key |
| `header` | `string \| ReactNode \| Function` | Column header content |
| `cell` | `(props: any) => ReactNode` | Custom cell renderer |
| `sortable` | `boolean` | Enable sorting for this column |
| `filterType` | `"text" \| "select" \| "date" \| "number" \| "range"` | Filter type |
| `filterOptions` | `{ label: string; value: string }[]` | Options for select filter |
| `exportable` | `boolean` | Include in export |
| `resizable` | `boolean` | Enable column resizing |
| `size` | `number` | Column width |

### DataTableAction<T>

| Prop | Type | Description |
|------|------|-------------|
| `label` | `string` | Action button label |
| `icon` | `ReactNode` | Action button icon |
| `onClick` | `(row: T) => void` | Click handler |
| `variant` | `"default" \| "destructive" \| "outline" \| "secondary"` | Button variant |
| `className` | `string` | Additional CSS classes |
| `show` | `(row: T) => boolean` | Conditional visibility |

## Migration from DataTable

### Before (DataTable)
```tsx
<DataTable
  columns={columns}
  data={data}
  loading={loading}
  onSearch={setSearch}
  pagination={{
    total,
    page,
    pageSize,
    onChange: setPage,
  }}
  onView={handleView}
  onEdit={handleEdit}
  onDelete={handleDelete}
/>
```

### After (DataTableV2)
```tsx
<DataTableV2
  data={data}
  columns={columns}
  loading={loading}
  globalFilter={search}
  onGlobalFilterChange={setSearch}
  pagination={{
    pageIndex: page - 1,
    pageSize,
    total,
    onPaginationChange: ({ pageIndex }) => setPage(pageIndex + 1),
  }}
  actions={[
    {
      label: "View",
      icon: <Eye className="mr-2 h-4 w-4" />,
      onClick: handleView,
    },
    {
      label: "Edit",
      icon: <Edit className="mr-2 h-4 w-4" />,
      onClick: handleEdit,
    },
    {
      label: "Delete",
      icon: <Trash2 className="mr-2 h-4 w-4" />,
      onClick: handleDelete,
      variant: "destructive",
    },
  ]}
/>
```

## Performance Tips

1. **Use `useMemo` for columns**: Prevent unnecessary re-renders
```tsx
const columns = useMemo(() => [...], []);
```

2. **Implement server-side operations**: For large datasets
```tsx
<DataTableV2
  manualPagination
  manualSorting
  manualFiltering
  // ... handlers
/>
```

3. **Use `getRowId`**: For better performance with row selection
```tsx
<DataTableV2
  getRowId={(row) => row.id}
  // ...
/>
```

## Examples

Lihat implementasi lengkap di:
- `app/admin/products/page-v2.tsx` - Complete example dengan product variants
- `components/ui/DataTableV2.tsx` - Component source code

## Troubleshooting

### Common Issues

1. **TypeScript errors**: Pastikan semua props memiliki type yang benar
2. **Performance issues**: Gunakan server-side operations untuk dataset besar
3. **Styling issues**: Periksa Tailwind CSS classes dan responsive design

### Support

Untuk pertanyaan atau issues, silakan buat issue di repository atau hubungi tim development.
