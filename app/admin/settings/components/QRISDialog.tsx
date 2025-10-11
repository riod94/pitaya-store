"use client"
import React, { useState, useEffect, useRef } from "react";
import { Button } from "@/components/ui/button";
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
import { toast } from "sonner";
import { Loader2, Upload, X } from "lucide-react";
import Image from "next/image";

interface QRISDialogProps {
	open: boolean;
	onOpenChange: (open: boolean) => void;
	setting?: {
		id: number;
		merchantName: string;
		qrCodeImage: string;
		qrCodeImageId: string | null;
		isActive: boolean;
	} | null;
	onSuccess: () => void;
}

export function QRISDialog({ open, onOpenChange, setting, onSuccess }: QRISDialogProps) {
	const [loading, setLoading] = useState(false);
	const [merchantName, setMerchantName] = useState("");
	const [qrCodeImage, setQrCodeImage] = useState("");
	const [qrCodeImageId, setQrCodeImageId] = useState("");
	const [uploading, setUploading] = useState(false);
	const [previewImage, setPreviewImage] = useState("");
	const fileInputRef = useRef<HTMLInputElement>(null);

	useEffect(() => {
		if (setting) {
			setMerchantName(setting.merchantName);
			setQrCodeImage(setting.qrCodeImage);
			setQrCodeImageId(setting.qrCodeImageId || "");
			setPreviewImage(setting.qrCodeImage);
		} else {
			setMerchantName("");
			setQrCodeImage("");
			setQrCodeImageId("");
			setPreviewImage("");
		}
	}, [setting, open]);

	const handleFileSelect = async (event: React.ChangeEvent<HTMLInputElement>) => {
		const file = event.target.files?.[0];
		if (!file) return;

		setUploading(true);
		try {
			// Get authentication for upload
			const authResponse = await fetch("/api/imagekit-auth");
			if (!authResponse.ok) {
				throw new Error("Failed to authenticate");
			}
			const authParams = await authResponse.json();

			// Upload file using fetch
			const formData = new FormData();
			formData.append("file", file);
			formData.append("fileName", `qris-qr-code-${Date.now()}.png`);
			formData.append("folder", "/qris");
			formData.append("signature", authParams.signature);
			formData.append("token", authParams.token);
			formData.append("expire", authParams.expire);
			formData.append("publicKey", authParams.publicKey);

			const uploadResponse = await fetch(`https://upload.imagekit.io/api/v1/files/upload`, {
				method: "POST",
				body: formData,
			});

			if (!uploadResponse.ok) {
				throw new Error("Upload failed");
			}

			const result = await uploadResponse.json();

			setQrCodeImage(result.url || "");
			setQrCodeImageId(result.fileId || "");
			setPreviewImage(result.url || "");
			toast.success("Image uploaded successfully");
		} catch (error) {
			console.error("Upload error:", error);
			toast.error("Failed to upload image");
		} finally {
			setUploading(false);
		}
	};

	const handleRemoveImage = () => {
		setQrCodeImage("");
		setQrCodeImageId("");
		setPreviewImage("");
	};

	const handleSubmit = async (e: React.FormEvent) => {
		e.preventDefault();

		if (!merchantName.trim()) {
			toast.error("Merchant name is required");
			return;
		}

		if (!qrCodeImage) {
			toast.error("Please upload QR code image");
			return;
		}

		setLoading(true);
		try {
			const payload = {
				merchantName: merchantName.trim(),
				qrCodeImage,
				qrCodeImageId,
				...(setting && { id: setting.id, oldImageId: setting.qrCodeImageId }),
			};

			const url = setting
				? `/api/admin/qris-settings`
				: `/api/admin/qris-settings`;

			const method = setting ? "PUT" : "POST";

			const res = await fetch(url, {
				method,
				headers: { "Content-Type": "application/json" },
				body: JSON.stringify(payload),
			});

			if (!res.ok) {
				const errData = await res.json().catch(() => ({}));
				throw new Error(errData?.error || "Failed to save QRIS settings");
			}

			toast.success(setting ? "QRIS settings updated successfully" : "QRIS settings added successfully");
			onOpenChange(false);
			setTimeout(() => {
				onSuccess();
			}, 100);
		} catch (error: any) {
			console.error(error);
			toast.error(error.message || "An error occurred");
		} finally {
			setLoading(false);
		}
	};

	const authenticator = async () => {
		try {
			const response = await fetch("/api/imagekit-auth");
			if (!response.ok) {
				throw new Error("Failed to authenticate");
			}
			return await response.json();
		} catch (error) {
			console.error("Authentication error:", error);
			throw error;
		}
	};

	return (
		<Dialog open={open} onOpenChange={onOpenChange}>
			<DialogContent className="sm:max-w-[525px]">
				<form onSubmit={handleSubmit}>
					<DialogHeader>
						<DialogTitle>{setting ? "Edit QRIS Settings" : "Setup QRIS Payment"}</DialogTitle>
						<DialogDescription>
							{setting ? "Update QRIS payment settings" : "Upload your QRIS QR code for payment"}
						</DialogDescription>
					</DialogHeader>
					<div className="grid gap-4 py-4">
						<div className="space-y-2">
							<Label htmlFor="merchant-name">Merchant Name *</Label>
							<Input
								id="merchant-name"
								placeholder="e.g., Pitaya Store"
								value={merchantName}
								onChange={(e) => setMerchantName(e.target.value)}
								required
							/>
						</div>

						<div className="space-y-2">
							<Label>QR Code Image *</Label>

							{previewImage ? (
								<div className="relative border rounded-lg p-4 bg-gray-50">
									<div className="flex justify-center mb-2">
										<div className="relative w-64 h-64">
											<Image
												src={previewImage}
												alt="QRIS QR Code"
												fill
												className="object-contain"
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
										ref={fileInputRef}
										type="file"
										accept="image/*"
										onChange={handleFileSelect}
										className="hidden"
									/>

									<Upload className="mx-auto h-12 w-12 text-gray-400 mb-4" />
									<p className="text-sm text-gray-600 mb-4">
										Click to upload or drag and drop
									</p>
									<Button
										type="button"
										variant="outline"
										onClick={() => fileInputRef.current?.click()}
										disabled={uploading}
									>
										{uploading ? (
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
										PNG, JPG up to 5MB
									</p>
								</div>
							)}
						</div>
					</div>
					<DialogFooter>
						<Button type="button" variant="outline" onClick={() => onOpenChange(false)} disabled={loading || uploading}>
							Cancel
						</Button>
						<Button type="submit" disabled={loading || uploading || !qrCodeImage}>
							{loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
							{loading ? "Saving..." : setting ? "Update" : "Save"}
						</Button>
					</DialogFooter>
				</form>
			</DialogContent>
		</Dialog>
	);
}
