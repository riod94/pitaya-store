"use client"
import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
	Dialog,
	DialogContent,
	DialogDescription,
	DialogFooter,
	DialogHeader,
	DialogTitle,
} from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { X } from "lucide-react";
import { toast } from "sonner";

interface ShippingZoneDialogProps {
	open: boolean;
	onOpenChange: (open: boolean) => void;
	zone?: {
		id: number;
		name: string;
		description: string | null;
		area: string[];
		isActive: boolean;
	} | null;
	onSuccess: () => void;
}

export function ShippingZoneDialog({ open, onOpenChange, zone, onSuccess }: ShippingZoneDialogProps) {
	const [loading, setLoading] = useState(false);
	const [name, setName] = useState("");
	const [description, setDescription] = useState("");
	const [areas, setAreas] = useState<string[]>([]);
	const [newArea, setNewArea] = useState("");

	useEffect(() => {
		if (zone) {
			setName(zone.name);
			setDescription(zone.description || "");
			setAreas(zone.area || []);
		} else {
			setName("");
			setDescription("");
			setAreas([]);
		}
		setNewArea("");
	}, [zone, open]);

	const handleAddArea = () => {
		const trimmed = newArea.trim();
		if (trimmed && !areas.includes(trimmed)) {
			setAreas([...areas, trimmed]);
			setNewArea("");
		}
	};

	const handleRemoveArea = (areaToRemove: string) => {
		setAreas(areas.filter(a => a !== areaToRemove));
	};

	const handleSubmit = async (e: React.FormEvent) => {
		e.preventDefault();
		
		if (!name.trim()) {
			toast.error("Nama zone wajib diisi");
			return;
		}

		if (areas.length === 0) {
			toast.error("Minimal satu area harus ditambahkan");
			return;
		}

		setLoading(true);
		try {
			const payload = {
				name: name.trim(),
				description: description.trim() || null,
				area: areas,
				isActive: true,
			};

			const url = zone 
				? `/api/admin/shipping-zones/${zone.id}`
				: `/api/admin/shipping-zones`;
			
			const method = zone ? "PUT" : "POST";

			const res = await fetch(url, {
				method,
				headers: { "Content-Type": "application/json" },
				body: JSON.stringify(payload),
			});

			if (!res.ok) {
				const errData = await res.json().catch(() => ({}));
				throw new Error(errData?.error || "Gagal menyimpan shipping zone");
			}

			toast.success(zone ? "Shipping zone berhasil diupdate" : "Shipping zone berhasil ditambahkan");
			onSuccess();
			onOpenChange(false);
		} catch (error: any) {
			console.error(error);
			toast.error(error.message || "Terjadi kesalahan");
		} finally {
			setLoading(false);
		}
	};

	return (
		<Dialog open={open} onOpenChange={onOpenChange}>
			<DialogContent className="sm:max-w-[525px]">
				<form onSubmit={handleSubmit}>
					<DialogHeader>
						<DialogTitle>{zone ? "Edit Shipping Zone" : "Add Shipping Zone"}</DialogTitle>
						<DialogDescription>
							{zone ? "Update shipping zone details" : "Create a new shipping zone with coverage areas"}
						</DialogDescription>
					</DialogHeader>
					<div className="grid gap-4 py-4">
						<div className="space-y-2">
							<Label htmlFor="zone-name">Zone Name *</Label>
							<Input
								id="zone-name"
								placeholder="e.g., Jakarta & Sekitarnya"
								value={name}
								onChange={(e) => setName(e.target.value)}
								required
							/>
						</div>
						<div className="space-y-2">
							<Label htmlFor="zone-description">Description</Label>
							<Textarea
								id="zone-description"
								placeholder="Optional description"
								value={description}
								onChange={(e) => setDescription(e.target.value)}
								rows={2}
							/>
						</div>
						<div className="space-y-2">
							<Label htmlFor="zone-areas">Coverage Areas *</Label>
							<div className="flex gap-2">
								<Input
									id="zone-areas"
									placeholder="e.g., Jakarta Selatan"
									value={newArea}
									onChange={(e) => setNewArea(e.target.value)}
									onKeyDown={(e) => {
										if (e.key === "Enter") {
											e.preventDefault();
											handleAddArea();
										}
									}}
								/>
								<Button type="button" onClick={handleAddArea} variant="outline">
									Add
								</Button>
							</div>
							{areas.length > 0 && (
								<div className="flex flex-wrap gap-2 mt-2">
									{areas.map((area, index) => (
										<Badge key={index} variant="secondary" className="gap-1">
											{area}
											<button
												type="button"
												onClick={() => handleRemoveArea(area)}
												className="ml-1 hover:text-destructive"
											>
												<X className="h-3 w-3" />
											</button>
										</Badge>
									))}
								</div>
							)}
						</div>
					</div>
					<DialogFooter>
						<Button type="button" variant="outline" onClick={() => onOpenChange(false)} disabled={loading}>
							Cancel
						</Button>
						<Button type="submit" disabled={loading}>
							{loading ? "Saving..." : zone ? "Update" : "Create"}
						</Button>
					</DialogFooter>
				</form>
			</DialogContent>
		</Dialog>
	);
}
