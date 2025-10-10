export interface Product {
	id: number;
	name: string;
	description: string;
	sku: string;
	slug: string;
	costPrice: number;
	hpp: number;
	sellingPrice: number;
	weight: number;
	stockQuantity: number;
	status: 'active' | 'inactive';
	images: string[];
	dimensions?: {
		length: number;
		width: number;
		height: number;
	};
	category?: {
		id: number;
		name: string;
	};
	createdAt: string;
	updatedAt: string;
}

export interface ProductVariant {
	id: number;
	productId: number;
	sku: string;
	name: string;
	attributes: Record<string, any>;
	costPrice: number;
	hpp: number;
	sellingPrice: number;
	stockQuantity: number;
	weight: number;
	images: string[];
	isActive: boolean;
	createdAt: string;
	updatedAt: string;
}

export interface ProductFormData {
	// Basic Information
	name: string;
	description: string;
	category: string;

	// Sales Information
	price: string;
	discountPercent: string;
	discountPrice: string;
	stock: string;
	sku: string;

	// Physical Information
	weight: string;
	length: string;
	width: string;
	height: string;

	// Settings
	preOrder: boolean;
	shippingCourier: boolean;
	shippingInsurance: 'required' | 'optional';
	status: boolean;

	// Variants
	variantEnabled: boolean;
	variants: ProductVariantForm[];
}

export interface ProductVariantForm {
	id: number;
	name: string;
	price: string;
	discount: string;
	discountPrice: string;
	weight: string;
	stock: string;
	sku: string;
	status: boolean;
	image: string;
	selected: boolean;
}

export interface FormErrors {
	[key: string]: string;
}

export interface LoadingStates {
	loading: boolean;
	saving: boolean;
	loadingProduct: boolean;
	loadingVariants: boolean;
}

export type Action =
	| { type: 'SET_LOADING'; payload: Partial<LoadingStates> }
	| { type: 'SET_PRODUCT'; payload: Product | null }
	| { type: 'SET_FORM_DATA'; payload: Partial<ProductFormData> }
	| { type: 'SET_FORM_ERRORS'; payload: FormErrors }
	| { type: 'SET_VARIANTS'; payload: ProductVariantForm[] }
	| { type: 'ADD_VARIANT' }
	| { type: 'UPDATE_VARIANT'; payload: { index: number; field: string; value: any } }
	| { type: 'REMOVE_VARIANT'; payload: number }
	| { type: 'RESET_FORM' }
	| { type: 'SET_IMAGES'; payload: File[] };
