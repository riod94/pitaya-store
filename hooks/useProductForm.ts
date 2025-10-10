"use client";

import { useReducer, useCallback, useEffect } from 'react';
import { Product, ProductVariant, ProductFormData, ProductVariantForm, FormErrors, LoadingStates, Action } from '@/types/product';

const initialFormData: ProductFormData = {
	name: '',
	description: '',
	category: '',
	price: '',
	discountPercent: '',
	discountPrice: '',
	stock: '',
	sku: '',
	weight: '',
	length: '',
	width: '',
	height: '',
	preOrder: false,
	shippingCourier: false,
	shippingInsurance: 'optional' as const,
	status: true,
	variantEnabled: false,
	variants: [],
};

const initialLoadingStates: LoadingStates = {
	loading: false,
	saving: false,
	loadingProduct: true,
	loadingVariants: false,
};

const initialState = {
	product: null as Product | null,
	formData: initialFormData,
	errors: {} as FormErrors,
	loading: initialLoadingStates,
	images: [] as File[],
};

function formReducer(state: typeof initialState, action: Action): typeof initialState {
	switch (action.type) {
		case 'SET_LOADING':
			return {
				...state,
				loading: { ...state.loading, ...action.payload },
			};

		case 'SET_PRODUCT':
			return {
				...state,
				product: action.payload,
			};

		case 'SET_FORM_DATA':
			return {
				...state,
				formData: { ...state.formData, ...action.payload },
			};

		case 'SET_FORM_ERRORS':
			return {
				...state,
				errors: action.payload,
			};

		case 'SET_VARIANTS':
			return {
				...state,
				formData: {
					...state.formData,
					variants: action.payload,
				},
			};

		case 'ADD_VARIANT':
			const newVariant: ProductVariantForm = {
				id: Date.now(),
				name: '',
				price: '',
				discount: '',
				discountPrice: '',
				weight: '',
				stock: '',
				sku: '',
				status: true,
				image: '',
				selected: false,
			};
			return {
				...state,
				formData: {
					...state.formData,
					variants: [...state.formData.variants, newVariant],
				},
			};

		case 'UPDATE_VARIANT':
			const { index, field, value } = action.payload;
			const updatedVariants = [...state.formData.variants];
			(updatedVariants[index] as any)[field] = value;
			return {
				...state,
				formData: {
					...state.formData,
					variants: updatedVariants,
				},
			};

		case 'REMOVE_VARIANT':
			return {
				...state,
				formData: {
					...state.formData,
					variants: state.formData.variants.filter((_, idx) => idx !== action.payload),
				},
			};

		case 'RESET_FORM':
			return {
				...state,
				formData: initialFormData,
				errors: {},
			};

		case 'SET_IMAGES':
			return {
				...state,
				images: action.payload,
			};

		default:
			return state;
	}
}

export function useProductForm(productId: string) {
	const [state, dispatch] = useReducer(formReducer, initialState);

	const setLoading = useCallback((loading: Partial<LoadingStates>) => {
		dispatch({ type: 'SET_LOADING', payload: loading });
	}, []);

	const setProduct = useCallback((product: Product | null) => {
		dispatch({ type: 'SET_PRODUCT', payload: product });
	}, []);

	const setFormData = useCallback((data: Partial<ProductFormData>) => {
		dispatch({ type: 'SET_FORM_DATA', payload: data });
	}, []);

	const setFormErrors = useCallback((errors: FormErrors) => {
		dispatch({ type: 'SET_FORM_ERRORS', payload: errors });
	}, []);

	const setVariants = useCallback((variants: ProductVariantForm[]) => {
		dispatch({ type: 'SET_VARIANTS', payload: variants });
	}, []);

	const addVariant = useCallback(() => {
		dispatch({ type: 'ADD_VARIANT' });
	}, []);

	const updateVariant = useCallback((index: number, field: string, value: any) => {
		dispatch({ type: 'UPDATE_VARIANT', payload: { index, field, value } });
	}, []);

	const removeVariant = useCallback((index: number) => {
		dispatch({ type: 'REMOVE_VARIANT', payload: index });
	}, []);

	const setImages = useCallback((images: File[]) => {
		dispatch({ type: 'SET_IMAGES', payload: images });
	}, []);

	const resetForm = useCallback(() => {
		dispatch({ type: 'RESET_FORM' });
	}, []);

	// Load product data
	useEffect(() => {
		if (!productId) return;

		setLoading({ loadingProduct: true });

		Promise.all([
			fetch(`/api/admin/products/${productId}`).then((res) => res.json()),
			fetch(`/api/admin/products/${productId}/variants`).then((res) => res.json()),
		])
			.then(([productData, variantsData]) => {
				const product = productData.data;

				if (product) {
					setProduct(product);
					setFormData({
						name: product.name || '',
						description: product.description || '',
						category: product.category?.name || '',
						price: product.sellingPrice?.toString() || '',
						stock: product.stockQuantity?.toString() || '',
						sku: product.sku || '',
						weight: product.weight?.toString() || '',
						length: product.dimensions?.length?.toString() || '',
						width: product.dimensions?.width?.toString() || '',
						height: product.dimensions?.height?.toString() || '',
						status: product.status === 'active',
					});
				}

				// Load variants if available
				if (variantsData.data && variantsData.data.length > 0) {
					const loadedVariants: ProductVariantForm[] = variantsData.data.map((variant: ProductVariant) => ({
						id: variant.id,
						name: variant.name,
						price: variant.sellingPrice?.toString() || '',
						discount: '',
						discountPrice: '',
						weight: variant.weight?.toString() || '',
						stock: variant.stockQuantity?.toString() || '',
						sku: variant.sku,
						status: variant.isActive,
						image: variant.images?.[0] || '',
						selected: false,
					}));
					setVariants(loadedVariants);
					setFormData({ variantEnabled: true });
				}
			})
			.catch((error) => {
				console.error('Error loading product data:', error);
				setFormErrors({ general: 'Gagal memuat data produk' });
			})
			.finally(() => {
				setLoading({ loadingProduct: false });
			});
	}, [productId, setProduct, setFormData, setVariants, setFormErrors, setLoading]);

	return {
		// State
		product: state.product,
		formData: state.formData,
		errors: state.errors,
		loading: state.loading,
		images: state.images,

		// Actions
		setFormData,
		setFormErrors,
		setVariants,
		addVariant,
		updateVariant,
		removeVariant,
		setImages,
		resetForm,
		setLoading,
	};
}
