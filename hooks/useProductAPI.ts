import { useCallback } from 'react';
import { ProductFormData } from '@/types/product';

export function useProductAPI(productId: string) {
	const updateProduct = useCallback(async (formData: ProductFormData, images: File[]): Promise<{ success: boolean; message: string }> => {
		try {
			// Prepare product data
			const productData = {
				sku: formData.sku,
				name: formData.name,
				slug: formData.name
					.toLowerCase()
					.replace(/[^a-z0-9]+/g, "-")
					.replace(/(^-|-$)/g, ""),
				description: formData.description,
				costPrice: parseFloat(formData.price) || 0,
				hpp: parseFloat(formData.price) || 0,
				sellingPrice: parseFloat(formData.price) || 0,
				weight: parseFloat(formData.weight) || 0,
				stockQuantity: parseInt(formData.stock) || 0,
				status: formData.status ? "active" : "inactive",
				images: images.length > 0
					? images.map((img) => URL.createObjectURL(img))
					: [], // You might want to handle existing images differently
				dimensions: {
					length: parseFloat(formData.length) || 0,
					width: parseFloat(formData.width) || 0,
					height: parseFloat(formData.height) || 0,
				},
			};

			// Update product
			const response = await fetch(`/api/admin/products/${productId}`, {
				method: "PUT",
				headers: {
					"Content-Type": "application/json",
				},
				body: JSON.stringify(productData),
			});

			if (!response.ok) {
				const error = await response.json();
				throw new Error(error.message || "Gagal memperbarui produk");
			}

			// Handle variants if enabled
			if (formData.variantEnabled && formData.variants.length > 0) {
				// Delete existing variants
				await fetch(`/api/admin/products/${productId}/variants`, {
					method: "DELETE",
				});

				// Create new variants
				for (const variant of formData.variants) {
					if (variant.name && variant.sku) {
						const variantData = {
							productId: parseInt(productId),
							sku: variant.sku,
							name: variant.name,
							attributes: { type: variant.name },
							costPrice: parseFloat(variant.price) || productData.costPrice,
							hpp: parseFloat(variant.price) || productData.hpp,
							sellingPrice: parseFloat(variant.price) || productData.sellingPrice,
							stockQuantity: parseInt(variant.stock) || 0,
							weight: parseFloat(variant.weight) || productData.weight,
							images: variant.image ? [variant.image] : [],
							isActive: variant.status,
						};

						await fetch("/api/admin/products/variants", {
							method: "POST",
							headers: {
								"Content-Type": "application/json",
							},
							body: JSON.stringify(variantData),
						});
					}
				}
			}

			return { success: true, message: "Produk berhasil diperbarui!" };
		} catch (error) {
			console.error("Error updating product:", error);
			return {
				success: false,
				message: error instanceof Error ? error.message : "Gagal memperbarui produk"
			};
		}
	}, [productId]);

	const deleteProduct = useCallback(async (): Promise<{ success: boolean; message: string }> => {
		try {
			const response = await fetch(`/api/admin/products/${productId}`, {
				method: "DELETE",
			});

			if (!response.ok) {
				const error = await response.json();
				throw new Error(error.message || "Gagal menghapus produk");
			}

			return { success: true, message: "Produk berhasil dihapus!" };
		} catch (error) {
			console.error("Error deleting product:", error);
			return {
				success: false,
				message: error instanceof Error ? error.message : "Gagal menghapus produk"
			};
		}
	}, [productId]);

	return { updateProduct, deleteProduct };
}
