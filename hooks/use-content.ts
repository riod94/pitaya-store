import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { apiService, heroContentService, bannersService, testimonialsService } from "@/lib/api-service";
import { toast } from "sonner";

// Hero Content Hooks
export function useHeroContent() {
	return useQuery({
		queryKey: ["hero-content"],
		queryFn: () => heroContentService.getAll(),
		staleTime: 1000 * 60 * 5, // 5 minutes
	});
}

export function useHeroContentMutations() {
	const queryClient = useQueryClient();

	const createMutation = useMutation({
		mutationFn: heroContentService.create,
		onSuccess: () => {
			queryClient.invalidateQueries({ queryKey: ["hero-content"] });
		},
	});

	const updateMutation = useMutation({
		mutationFn: ({ id, data }: { id: number; data: any }) =>
			heroContentService.update(id, data),
		onSuccess: () => {
			queryClient.invalidateQueries({ queryKey: ["hero-content"] });
		},
	});

	const deleteMutation = useMutation({
		mutationFn: heroContentService.delete,
		onSuccess: () => {
			queryClient.invalidateQueries({ queryKey: ["hero-content"] });
		},
	});

	return {
		createHero: createMutation.mutate,
		updateHero: updateMutation.mutate,
		deleteHero: deleteMutation.mutate,
		isCreating: createMutation.isPending,
		isUpdating: updateMutation.isPending,
		isDeleting: deleteMutation.isPending,
	};
}

// Banners Hooks
export function useBanners() {
	return useQuery({
		queryKey: ["banners"],
		queryFn: () => bannersService.getAll(),
		staleTime: 1000 * 60 * 5, // 5 minutes
	});
}

export function useBannersMutations() {
	const queryClient = useQueryClient();

	const createMutation = useMutation({
		mutationFn: bannersService.create,
		onSuccess: () => {
			queryClient.invalidateQueries({ queryKey: ["banners"] });
		},
	});

	const updateMutation = useMutation({
		mutationFn: ({ id, data }: { id: number; data: any }) =>
			bannersService.update(id, data),
		onSuccess: () => {
			queryClient.invalidateQueries({ queryKey: ["banners"] });
		},
	});

	const deleteMutation = useMutation({
		mutationFn: bannersService.delete,
		onSuccess: () => {
			queryClient.invalidateQueries({ queryKey: ["banners"] });
		},
	});

	return {
		createBanner: createMutation.mutate,
		updateBanner: updateMutation.mutate,
		deleteBanner: deleteMutation.mutate,
		isCreating: createMutation.isPending,
		isUpdating: updateMutation.isPending,
		isDeleting: deleteMutation.isPending,
	};
}

// Testimonials Hooks
export function useTestimonials() {
	return useQuery({
		queryKey: ["testimonials"],
		queryFn: () => testimonialsService.getAll(),
		staleTime: 1000 * 60 * 5, // 5 minutes
	});
}

export function useTestimonialsMutations() {
	const queryClient = useQueryClient();

	const createMutation = useMutation({
		mutationFn: testimonialsService.create,
		onSuccess: () => {
			queryClient.invalidateQueries({ queryKey: ["testimonials"] });
		},
	});

	const updateMutation = useMutation({
		mutationFn: ({ id, data }: { id: number; data: any }) =>
			testimonialsService.update(id, data),
		onSuccess: () => {
			queryClient.invalidateQueries({ queryKey: ["testimonials"] });
		},
	});

	const deleteMutation = useMutation({
		mutationFn: testimonialsService.delete,
		onSuccess: () => {
			queryClient.invalidateQueries({ queryKey: ["testimonials"] });
		},
	});

	return {
		createTestimonial: createMutation.mutate,
		updateTestimonial: updateMutation.mutate,
		deleteTestimonial: deleteMutation.mutate,
		isCreating: createMutation.isPending,
		isUpdating: updateMutation.isPending,
		isDeleting: deleteMutation.isPending,
	};
}

// Image Upload Hook
export function useImageUpload() {
	const uploadMutation = useMutation({
		mutationFn: async (file: File) => {
			// Get ImageKit auth
			const authParams = await apiService.get<{
				signature: string;
				token: string;
				expire: number;
				publicKey: string;
			}>("/imagekit-auth");

			// Upload to ImageKit
			const formData = new FormData();
			formData.append("file", file);
			formData.append("fileName", `upload-${Date.now()}.${file.name.split('.').pop()}`);
			formData.append("folder", "/uploads");
			formData.append("signature", authParams.signature);
			formData.append("token", authParams.token);
			formData.append("expire", authParams.expire.toString());
			formData.append("publicKey", authParams.publicKey);

			return apiService.uploadFile("/imagekit-upload", formData);
		},
		onSuccess: () => {
			toast.success("Image uploaded successfully");
		},
		onError: () => {
			toast.error("Failed to upload image");
		},
	});

	return {
		uploadImage: uploadMutation.mutate,
		isUploading: uploadMutation.isPending,
	};
}
