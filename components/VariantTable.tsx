import React from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Switch } from "@/components/ui/switch";
import { Badge } from "@/components/ui/badge";
import { ProductVariantForm } from '@/types/product';

interface VariantTableProps {
	variants: ProductVariantForm[];
	onUpdateVariant: (index: number, field: string, value: any) => void;
	onRemoveVariant: (index: number) => void;
	onAddVariant: () => void;
	onSelectAll: (checked: boolean) => void;
}

export const VariantTable: React.FC<VariantTableProps> = ({
	variants,
	onUpdateVariant,
	onRemoveVariant,
	onAddVariant,
	onSelectAll,
}) => {
	const allSelected = variants.length > 0 && variants.every(v => v.selected);
	const hasSelected = variants.some(v => v.selected);

	const handleSelectAll = (checked: boolean) => {
		onSelectAll(checked);
	};

	return (
		<div className="overflow-x-auto rounded-lg border bg-white p-4">
			<div className="flex items-center justify-between mb-4">
				<div className="flex items-center gap-4">
					<input
						type="checkbox"
						checked={allSelected}
						onChange={(e) => handleSelectAll(e.target.checked)}
						className="rounded border-gray-300"
					/>
					<span className="font-semibold">
						Pilih Semua {variants.length} Varian
					</span>
					<select className="border rounded px-2 py-1 text-sm">
						<option>Semua Varian</option>
					</select>
				</div>
				<Button
					onClick={onAddVariant}
					className="bg-blue-600 text-white hover:bg-blue-700"
				>
					Tambah Varian
				</Button>
			</div>

			<div className="overflow-x-auto">
				<table className="min-w-full table-fixed border-collapse border border-gray-200 text-sm">
					<thead className="bg-gray-100">
						<tr>
							<th className="w-10 p-2 border border-gray-300"></th>
							<th className="w-20 p-2 border border-gray-300">Gambar</th>
							<th className="w-32 p-2 border border-gray-300">Varian</th>
							<th className="w-24 p-2 border border-gray-300">Harga</th>
							<th className="w-20 p-2 border border-gray-300">Diskon</th>
							<th className="w-28 p-2 border border-gray-300">Setelah Diskon</th>
							<th className="w-20 p-2 border border-gray-300">Berat</th>
							<th className="w-20 p-2 border border-gray-300">Stock</th>
							<th className="w-24 p-2 border border-gray-300">SKU</th>
							<th className="w-20 p-2 border border-gray-300">Status</th>
							<th className="w-16 p-2 border border-gray-300">Aksi</th>
						</tr>
					</thead>
					<tbody>
						{variants.map((variant, idx) => (
							<VariantRow
								key={variant.id}
								variant={variant}
								index={idx}
								onUpdate={onUpdateVariant}
								onRemove={onRemoveVariant}
							/>
						))}
					</tbody>
				</table>
			</div>

			{hasSelected && (
				<div className="mt-4 p-3 bg-blue-50 border border-blue-200 rounded">
					<div className="flex items-center justify-between">
						<span className="text-sm text-blue-800">
							{variants.filter(v => v.selected).length} varian dipilih
						</span>
						<div className="flex gap-2">
							<Button variant="outline" size="sm">
								Set Aktif
							</Button>
							<Button variant="outline" size="sm">
								Set Nonaktif
							</Button>
							<Button variant="destructive" size="sm">
								Hapus
							</Button>
						</div>
					</div>
				</div>
			)}
		</div>
	);
};

interface VariantRowProps {
	variant: ProductVariantForm;
	index: number;
	onUpdate: (index: number, field: string, value: any) => void;
	onRemove: (index: number) => void;
}

const VariantRow: React.FC<VariantRowProps> = ({ variant, index, onUpdate, onRemove }) => {
	const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
		const file = e.target.files?.[0];
		if (file) {
			const reader = new FileReader();
			reader.onload = () => {
				onUpdate(index, 'image', reader.result);
			};
			reader.readAsDataURL(file);
		}
	};

	return (
		<tr className="border border-gray-300 hover:bg-gray-50">
			<td className="p-2 border border-gray-300 text-center">
				<input
					type="checkbox"
					checked={variant.selected || false}
					onChange={(e) => onUpdate(index, 'selected', e.target.checked)}
					className="rounded border-gray-300"
				/>
			</td>

			<td className="p-2 border border-gray-300 text-center">
				<div className="flex flex-col items-center justify-center w-16 h-16 border border-dashed rounded-md cursor-pointer bg-gray-50 mx-auto">
					<input
						type="file"
						accept="image/*"
						className="hidden"
						id={`variant-image-${variant.id}`}
						onChange={handleImageUpload}
					/>
					<label
						htmlFor={`variant-image-${variant.id}`}
						className="cursor-pointer w-full h-full flex items-center justify-center"
					>
						{variant.image ? (
							<img
								src={variant.image}
								alt="Variant"
								className="object-cover w-full h-full rounded-md"
							/>
						) : (
							<span className="text-gray-400 text-xs">
								+ Upload
							</span>
						)}
					</label>
				</div>
			</td>

			<td className="p-2 border border-gray-300">
				<Input
					placeholder="Varian"
					value={variant.name}
					onChange={(e) => onUpdate(index, 'name', e.target.value)}
					className={variant.name ? '' : 'border-red-300'}
				/>
			</td>

			<td className="p-2 border border-gray-300">
				<Input
					placeholder="Rp"
					value={variant.price}
					onChange={(e) => onUpdate(index, 'price', e.target.value)}
					className={variant.price ? '' : 'border-red-300'}
				/>
			</td>

			<td className="p-2 border border-gray-300">
				<Input
					placeholder="%"
					value={variant.discount}
					onChange={(e) => onUpdate(index, 'discount', e.target.value)}
				/>
			</td>

			<td className="p-2 border border-gray-300">
				<Input
					placeholder="Rp"
					value={variant.discountPrice}
					onChange={(e) => onUpdate(index, 'discountPrice', e.target.value)}
				/>
			</td>

			<td className="p-2 border border-gray-300">
				<Input
					placeholder="g"
					value={variant.weight}
					onChange={(e) => onUpdate(index, 'weight', e.target.value)}
				/>
			</td>

			<td className="p-2 border border-gray-300">
				<Input
					placeholder="Stock"
					value={variant.stock}
					onChange={(e) => onUpdate(index, 'stock', e.target.value)}
				/>
			</td>

			<td className="p-2 border border-gray-300">
				<Input
					placeholder="SKU"
					value={variant.sku}
					onChange={(e) => onUpdate(index, 'sku', e.target.value)}
					className={variant.sku ? '' : 'border-red-300'}
				/>
			</td>

			<td className="p-2 border border-gray-300 text-center">
				<div className="flex flex-col items-center gap-1">
					<Switch
						checked={variant.status}
						onCheckedChange={(checked) => onUpdate(index, 'status', checked)}
					/>
					{variant.status && (
						<Badge variant="secondary" className="text-xs">
							Utama
						</Badge>
					)}
				</div>
			</td>

			<td className="p-2 border border-gray-300 text-center">
				<button
					className="text-red-600 hover:text-red-800 p-1"
					onClick={() => onRemove(index)}
					title="Hapus Varian"
				>
					&times;
				</button>
			</td>
		</tr>
	);
};
