import { ProductFormData, FormErrors } from '@/types/product';

export function useFormValidation() {
	const validateForm = (formData: ProductFormData): FormErrors => {
		const errors: FormErrors = {};

		// Basic validation
		if (!formData.name.trim()) {
			errors.name = 'Nama produk wajib diisi';
		} else if (formData.name.length > 255) {
			errors.name = 'Nama produk maksimal 255 karakter';
		}

		if (!formData.description.trim()) {
			errors.description = 'Deskripsi produk wajib diisi';
		} else if (formData.description.length > 5000) {
			errors.description = 'Deskripsi produk maksimal 5000 karakter';
		}

		if (!formData.category.trim()) {
			errors.category = 'Kategori produk wajib diisi';
		}

		if (!formData.sku.trim()) {
			errors.sku = 'SKU wajib diisi';
		}

		// Price validation
		const price = parseFloat(formData.price);
		if (!formData.variantEnabled) {
			if (!formData.price.trim()) {
				errors.price = 'Harga produk wajib diisi';
			} else if (isNaN(price) || price <= 0) {
				errors.price = 'Harga produk harus berupa angka positif';
			}
		}

		// Stock validation
		if (!formData.variantEnabled) {
			if (!formData.stock.trim()) {
				errors.stock = 'Stok produk wajib diisi';
			} else {
				const stock = parseInt(formData.stock);
				if (isNaN(stock) || stock < 0) {
					errors.stock = 'Stok produk harus berupa angka positif';
				}
			}
		}

		// Weight validation
		if (formData.weight.trim()) {
			const weight = parseFloat(formData.weight);
			if (isNaN(weight) || weight <= 0) {
				errors.weight = 'Berat produk harus berupa angka positif';
			}
		}

		// Dimensions validation
		if (formData.length.trim()) {
			const length = parseFloat(formData.length);
			if (isNaN(length) || length <= 0) {
				errors.length = 'Panjang harus berupa angka positif';
			}
		}

		if (formData.width.trim()) {
			const width = parseFloat(formData.width);
			if (isNaN(width) || width <= 0) {
				errors.width = 'Lebar harus berupa angka positif';
			}
		}

		if (formData.height.trim()) {
			const height = parseFloat(formData.height);
			if (isNaN(height) || height <= 0) {
				errors.height = 'Tinggi harus berupa angka positif';
			}
		}

		// Variant validation
		if (formData.variantEnabled) {
			const hasVariants = formData.variants.length > 0;
			if (!hasVariants) {
				errors.variants = 'Minimal harus ada 1 varian';
			} else {
				// Validate each variant
				formData.variants.forEach((variant, index) => {
					if (!variant.name.trim()) {
						errors[`variant_${index}_name`] = 'Nama varian wajib diisi';
					}

					if (!variant.sku.trim()) {
						errors[`variant_${index}_sku`] = 'SKU varian wajib diisi';
					}

					const price = parseFloat(variant.price);
					if (!variant.price.trim()) {
						errors[`variant_${index}_price`] = 'Harga varian wajib diisi';
					} else if (isNaN(price) || price <= 0) {
						errors[`variant_${index}_price`] = 'Harga varian harus berupa angka positif';
					}

					if (variant.stock.trim()) {
						const stock = parseInt(variant.stock);
						if (isNaN(stock) || stock < 0) {
							errors[`variant_${index}_stock`] = 'Stok varian harus berupa angka positif';
						}
					}

					if (variant.weight.trim()) {
						const weight = parseFloat(variant.weight);
						if (isNaN(weight) || weight <= 0) {
							errors[`variant_${index}_weight`] = 'Berat varian harus berupa angka positif';
						}
					}
				});
			}
		}

		return errors;
	};

	const isFormValid = (errors: FormErrors): boolean => {
		return Object.keys(errors).length === 0;
	};

	return { validateForm, isFormValid };
}
