"use client";

import React, { useState, useEffect, useMemo } from "react";
import {
	useHeroContent,
	useHeroContentMutations,
	useImageUpload,
} from "@/hooks/use-content";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
	Dialog,
	DialogContent,
	DialogDescription,
	DialogFooter,
	DialogHeader,
	DialogTitle,
} from "@/components/ui/dialog";
import { Loader2, Plus, Edit, Trash2, Upload, X } from "lucide-react";
import Image from "next/image";

interface HeroContent {
	id: number;
	title: string;
	subtitle: string;
	imageUrl?: string;
	imageId?: string;
	buttonText?: string;
	buttonUrl?: string;
	button2Text?: string;
	button2Url?: string;
	tagline?: string;
	isActive: boolean;
	sortOrder: number;
	createdAt: string;
	updatedAt: string;
}

interface HeroContentTabProps {
	data: HeroContent[];
	loading: boolean;
	onRefresh: () => void;
}

export function HeroContentTab({
	data,
	loading,
	onRefresh,
}: Readonly<HeroContentTabProps>) {
	const [heroContent, setHeroContent] = useState<HeroContent[]>(data);
	const [dialogOpen, setDialogOpen] = useState(false);
	const [editingContent, setEditingContent] = useState<HeroContent | null>(
		null
	);
	const [previewImage, setPreviewImage] = useState("");

	// Use React Query hooks
	const { data: queryData, isLoading: queryLoading, error } = useHeroContent();
	const {
		createHero,
		updateHero,
		deleteHero,
		isCreating,
		isUpdating,
		isDeleting,
	} = useHeroContentMutations();
	const { uploadImage, isUploading } = useImageUpload();

	// Update local state when data prop changes
	useEffect(() => {
		setHeroContent(data);
	}, [data]);

	// Form state
	const [formData, setFormData] = useState({
		title: "",
		subtitle: "",
		imageUrl: "",
		imageId: "",
		buttonText: "",
		buttonUrl: "",
		button2Text: "",
		button2Url: "",
		tagline: "",
	});

	const handleFileSelect = async (
		event: React.ChangeEvent<HTMLInputElement>
	) => {
		const file = event.target.files?.[0];
		if (!file) return;

		uploadImage(file, {
			onSuccess: (result: any) => {
				setFormData((prev) => ({
					...prev,
					imageUrl: result.url || "",
					imageId: result.fileId || "",
				}));
				setPreviewImage(result.url || "");
			},
		});
	};

	const handleRemoveImage = () => {
		setFormData((prev) => ({
			...prev,
			imageUrl: "",
			imageId: "",
		}));
		setPreviewImage("");
	};

	const handleSubmit = async (e: React.FormEvent) => {
		e.preventDefault();

		if (!formData.title || !formData.subtitle) {
			return;
		}

		try {
			if (editingContent) {
				updateHero({ id: editingContent.id, data: formData });
			} else {
				createHero(formData);
			}
			setDialogOpen(false);
			resetForm();
		} catch (error) {
			console.error(error);
		}
	};

	const handleEdit = (content: HeroContent) => {
		setEditingContent(content);
		setFormData({
			title: content.title,
			subtitle: content.subtitle,
			imageUrl: content.imageUrl || "",
			imageId: content.imageId || "",
			buttonText: content.buttonText || "",
			buttonUrl: content.buttonUrl || "",
			button2Text: content.button2Text || "",
			button2Url: content.button2Url || "",
			tagline: content.tagline || "",
		});
		setPreviewImage(content.imageUrl || "");
		setDialogOpen(true);
	};

	const handleDelete = async (id: number) => {
		if (!confirm("Are you sure you want to delete this hero content?"))
			return;

		try {
			deleteHero(id);
		} catch (error) {
			console.error(error);
		}
	};

	const resetForm = () => {
		setEditingContent(null);
		setFormData({
			title: "",
			subtitle: "",
			imageUrl: "",
			imageId: "",
			buttonText: "",
			buttonUrl: "",
			button2Text: "",
			button2Url: "",
			tagline: "",
		});
		setPreviewImage("");
	};

	const handleAddNew = () => {
		resetForm();
		setDialogOpen(true);
	};

	const isLoading = loading || queryLoading;
	const isMutating = isCreating || isUpdating || isDeleting;

	// Merge data tanpa duplikasi berdasarkan ID
	const currentData = useMemo(() => {
		const dataMap = new Map();

		// Prioritas: queryData > heroContent untuk data terbaru
		if (queryData && Array.isArray(queryData)) {
			queryData.forEach((item) => dataMap.set(item.id, item));
		}

		if (Array.isArray(heroContent)) {
			heroContent.forEach((item) => {
				if (!dataMap.has(item.id)) {
					dataMap.set(item.id, item);
				}
			});
		}

		return Array.from(dataMap.values());
	}, [queryData, heroContent]);

	if (isLoading) {
		return (
			<div className="flex items-center justify-center p-8">
				<Loader2 className="h-8 w-8 animate-spin" />
			</div>
		);
	}

	if (error) {
		return (
			<Card>
				<CardContent className="p-6 text-center">
					<p className="text-red-600">
						Error loading hero content: {error.message}
					</p>
				</CardContent>
			</Card>
		);
	}

	return (
		<div className="space-y-6">
			<div className="flex justify-end">
				<Button
					onClick={handleAddNew}
					className="bg-pink-500 hover:bg-pink-600"
					disabled={isMutating}
				>
					<Plus className="mr-2 h-4 w-4" />
					{currentData.length > 0
						? "Edit Hero Section"
						: "Create Hero Section"}
				</Button>
			</div>

			{currentData.length === 0 ? (
				<Card>
					<CardContent className="p-6 text-center">
						<p className="text-muted-foreground">
							No hero section configured. Create your homepage hero
							section.
						</p>
					</CardContent>
				</Card>
			) : (
				<div className="w-full">
					{currentData.map((content: HeroContent) => (
						<Card key={content.id} className="overflow-hidden">
							<CardContent className="p-0">
								<div className="relative">
									{content.imageUrl && (
										<div className="relative w-full h-96 bg-gradient-to-r from-gray-100 to-gray-200">
											<Image
												src={content.imageUrl}
												alt={content.title}
												fill
												className="object-cover"
												priority
											/>
											<div className="absolute inset-0 bg-black/40" />
											<div className="absolute inset-0 flex items-center justify-center">
												<div className="text-center text-white space-y-4 max-w-3xl px-6">
													<h1 className="text-5xl md:text-6xl font-bold leading-tight">
														{content.title}
													</h1>
													<p className="text-xl md:text-2xl font-light">
														{content.subtitle}
													</p>
													{content.tagline && (
														<p className="text-lg opacity-90">
															{content.tagline}
														</p>
													)}
													<div className="flex flex-col sm:flex-row gap-4 justify-center mt-8">
														{content.buttonText &&
															content.buttonUrl && (
																<Button
																	size="lg"
																	className="bg-white text-black hover:bg-gray-100 px-8 py-3 text-lg"
																	asChild
																>
																	<a href={content.buttonUrl}>
																		{content.buttonText}
																	</a>
																</Button>
															)}
														{content.button2Text &&
															content.button2Url && (
																<Button
																	size="lg"
																	variant="outline"
																	className="border-white text-white hover:bg-white hover:text-black px-8 py-3 text-lg"
																	asChild
																>
																	<a href={content.button2Url}>
																		{content.button2Text}
																	</a>
																</Button>
															)}
													</div>
												</div>
											</div>
										</div>
									)}
									<div className="p-6">
										<div className="flex items-start justify-between">
											<div className="flex-1">
												{!content.imageUrl && (
													<div className="space-y-4">
														<div>
															<h3 className="text-2xl font-bold">
																{content.title}
															</h3>
															<p className="text-gray-600 mt-1">
																{content.subtitle}
															</p>
															{content.tagline && (
																<p className="text-sm text-muted-foreground mt-2">
																	{content.tagline}
																</p>
															)}
														</div>
														<div className="flex flex-col sm:flex-row gap-4">
															{content.buttonText &&
																content.buttonUrl && (
																	<Button
																		variant="outline"
																		asChild
																	>
																		<a
																			href={
																				content.buttonUrl
																			}
																		>
																			{content.buttonText}
																		</a>
																	</Button>
																)}
															{content.button2Text &&
																content.button2Url && (
																	<Button
																		variant="outline"
																		asChild
																	>
																		<a
																			href={
																				content.button2Url
																			}
																		>
																			{content.button2Text}
																		</a>
																	</Button>
																)}
														</div>
													</div>
												)}
											</div>
											<div className="flex gap-2">
												<Button
													variant="outline"
													size="sm"
													onClick={() => handleEdit(content)}
													disabled={isMutating}
												>
													<Edit className="mr-2 h-4 w-4" /> Edit
												</Button>
												<Button
													variant="outline"
													size="sm"
													onClick={() => handleDelete(content.id)}
													disabled={isMutating}
												>
													<Trash2 className="mr-2 h-4 w-4" />{" "}
													Delete
												</Button>
											</div>
										</div>
									</div>
								</div>
							</CardContent>
						</Card>
					))}
				</div>
			)}

			{/* Add/Edit Dialog */}
			<Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
				<DialogContent className="sm:max-w-[700px] max-h-[90vh] overflow-y-auto">
					<form onSubmit={handleSubmit}>
						<DialogHeader>
							<DialogTitle>
								{editingContent
									? "Edit Hero Section"
									: "Create Hero Section"}
							</DialogTitle>
							<DialogDescription>
								Configure your homepage hero section with title,
								subtitle, and call-to-action buttons.
							</DialogDescription>
						</DialogHeader>

						<div className="grid gap-6 py-4">
							<div className="grid grid-cols-1 gap-4">
								<div className="space-y-2">
									<Label htmlFor="title">Main Title *</Label>
									<Input
										id="title"
										value={formData.title}
										onChange={(e) =>
											setFormData((prev) => ({
												...prev,
												title: e.target.value,
											}))
										}
										placeholder="Enter main hero title"
										required
										className="text-lg"
									/>
								</div>

								<div className="space-y-2">
									<Label htmlFor="subtitle">Subtitle *</Label>
									<Input
										id="subtitle"
										value={formData.subtitle}
										onChange={(e) =>
											setFormData((prev) => ({
												...prev,
												subtitle: e.target.value,
											}))
										}
										placeholder="Enter hero subtitle"
										required
										className="text-base"
									/>
								</div>

								<div className="space-y-2">
									<Label htmlFor="tagline">Tagline (Optional)</Label>
									<Input
										id="tagline"
										value={formData.tagline}
										onChange={(e) =>
											setFormData((prev) => ({
												...prev,
												tagline: e.target.value,
											}))
										}
										placeholder="Brief tagline or supporting text"
									/>
								</div>
							</div>

							<div className="space-y-2">
								<Label>Hero Background Image</Label>
								{previewImage ? (
									<div className="relative border rounded-lg p-4 bg-gray-50">
										<div className="flex justify-center mb-2">
											<div className="relative w-full h-48">
												<Image
													src={previewImage}
													alt="Hero preview"
													fill
													className="object-cover rounded-lg"
												/>
											</div>
										</div>
										<Button
											type="button"
											variant="outline"
											size="sm"
											onClick={handleRemoveImage}
											className="w-full"
										>
											<X className="mr-2 h-4 w-4" />
											Remove Image
										</Button>
									</div>
								) : (
									<div className="border-2 border-dashed rounded-lg p-6 text-center">
										<input
											type="file"
											accept="image/*"
											onChange={handleFileSelect}
											className="hidden"
											id="hero-image"
										/>
										<Upload className="mx-auto h-12 w-12 text-gray-400 mb-4" />
										<p className="text-sm text-gray-600 mb-4">
											Click to upload hero background image
										</p>
										<Button
											type="button"
											variant="outline"
											onClick={() =>
												document
													.getElementById("hero-image")
													?.click()
											}
											disabled={isUploading}
										>
											{isUploading ? (
												<>
													<Loader2 className="mr-2 h-4 w-4 animate-spin" />
													Uploading...
												</>
											) : (
												<>
													<Upload className="mr-2 h-4 w-4" />
													Choose File
												</>
											)}
										</Button>
										<p className="text-xs text-gray-500 mt-2">
											PNG, JPG up to 10MB • Recommended: 1920x1080px
										</p>
									</div>
								)}
							</div>

							<div className="grid grid-cols-1 md:grid-cols-2 gap-4">
								<div className="space-y-2">
									<Label htmlFor="buttonText">
										Primary Button Text
									</Label>
									<Input
										id="buttonText"
										value={formData.buttonText}
										onChange={(e) =>
											setFormData((prev) => ({
												...prev,
												buttonText: e.target.value,
											}))
										}
										placeholder="e.g., Shop Now, Get Started"
									/>
								</div>

								<div className="space-y-2">
									<Label htmlFor="buttonUrl">Primary Button URL</Label>
									<Input
										id="buttonUrl"
										value={formData.buttonUrl}
										onChange={(e) =>
											setFormData((prev) => ({
												...prev,
												buttonUrl: e.target.value,
											}))
										}
										placeholder="e.g., /products, /contact"
										className="normal-case"
										autoCapitalize="off"
										autoComplete="off"
									/>
								</div>
							</div>

							<div className="grid grid-cols-1 md:grid-cols-2 gap-4">
								<div className="space-y-2">
									<Label htmlFor="button2Text">
										Secondary Button Text (Optional)
									</Label>
									<Input
										id="button2Text"
										value={formData.button2Text}
										onChange={(e) =>
											setFormData((prev) => ({
												...prev,
												button2Text: e.target.value,
											}))
										}
										placeholder="e.g., Learn More, View Demo"
									/>
								</div>

								<div className="space-y-2">
									<Label htmlFor="button2Url">
										Secondary Button URL (Optional)
									</Label>
									<Input
										id="button2Url"
										value={formData.button2Url}
										onChange={(e) =>
											setFormData((prev) => ({
												...prev,
												button2Url: e.target.value,
											}))
										}
										placeholder="e.g., /about, /services"
										className="normal-case"
										autoCapitalize="off"
										autoComplete="off"
									/>
								</div>
							</div>
						</div>

						<DialogFooter>
							<Button
								type="button"
								variant="outline"
								onClick={() => setDialogOpen(false)}
							>
								Cancel
							</Button>
							<Button type="submit" disabled={isMutating || isUploading}>
								{(isMutating || isUploading) && (
									<Loader2 className="mr-2 h-4 w-4 animate-spin" />
								)}
								{editingContent
									? "Update Hero Section"
									: "Create Hero Section"}
							</Button>
						</DialogFooter>
					</form>
				</DialogContent>
			</Dialog>
		</div>
	);
}
