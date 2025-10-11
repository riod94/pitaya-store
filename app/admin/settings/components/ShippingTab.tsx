"use client"
import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import {
	Card,
	CardContent,
	CardDescription,
	CardFooter,
	CardHeader,
	CardTitle,
} from "@/components/ui/card";
import {
	AlertDialog,
	AlertDialogAction,
	AlertDialogCancel,
	AlertDialogContent,
	AlertDialogDescription,
	AlertDialogFooter,
	AlertDialogHeader,
	AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Separator } from "@/components/ui/separator";
import { Save, Plus, Pencil, Trash2 } from "lucide-react";
import { ShippingZoneDialog } from "./ShippingZoneDialog";
import { toast } from "sonner";

interface ShippingTabProps {
	settings: any;
	updateNestedField: (section: string, subsection: string, field: string, value: any) => void;
	toggleShippingProvider: (key: string) => void;
	handleSaveChanges: () => void;
	loading: boolean;
	onZonesChange: () => void;
}

export function ShippingTab({ settings, updateNestedField, toggleShippingProvider, handleSaveChanges, loading, onZonesChange }: ShippingTabProps) {
	const [dialogOpen, setDialogOpen] = useState(false);
	const [selectedZone, setSelectedZone] = useState<any>(null);
	const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
	const [zoneToDelete, setZoneToDelete] = useState<number | null>(null);
	const [deleting, setDeleting] = useState(false);

	const handleEditZone = (zone: any) => {
		setSelectedZone(zone);
		setDialogOpen(true);
	};

	const handleAddZone = () => {
		setSelectedZone(null);
		setDialogOpen(true);
	};

	const handleDeleteZone = async () => {
		if (!zoneToDelete) return;
		
		setDeleting(true);
		try {
			const res = await fetch(`/api/admin/shipping-zones/${zoneToDelete}`, {
				method: "DELETE",
			});

			if (!res.ok) {
				const errData = await res.json().catch(() => ({}));
				throw new Error(errData?.error || "Gagal menghapus shipping zone");
			}

			toast.success("Shipping zone berhasil dihapus");
			onZonesChange();
		} catch (error: any) {
			console.error(error);
			toast.error(error.message || "Terjadi kesalahan");
		} finally {
			setDeleting(false);
			setDeleteDialogOpen(false);
			setZoneToDelete(null);
		}
	};

	const confirmDelete = (zoneId: number) => {
		setZoneToDelete(zoneId);
		setDeleteDialogOpen(true);
	};

	return (
		<>
			<Card>
				<CardHeader>
					<CardTitle>Shipping Settings</CardTitle>
					<CardDescription>
						Configure shipping options and delivery methods.
					</CardDescription>
				</CardHeader>
				<CardContent>
					<div className="space-y-6">
						<div className="space-y-4">
							<h3 className="text-lg font-medium">
								Shipping Methods
							</h3>
							<div className="space-y-4">
								<div className="flex items-center space-x-2">
									<Switch
										id="jne"
										checked={settings.shipping?.shippingMethods?.jne || false}
										onCheckedChange={() => toggleShippingProvider("jne")}
									/>
									<Label htmlFor="jne">JNE</Label>
								</div>
								<div className="flex items-center space-x-2">
									<Switch
										id="j&t"
										checked={settings.shipping?.shippingMethods?.jt || false}
										onCheckedChange={() => toggleShippingProvider("jt")}
									/>
									<Label htmlFor="j&t">J&T Express</Label>
								</div>
								<div className="flex items-center space-x-2">
									<Switch
										id="sicepat"
										checked={settings.shipping?.shippingMethods?.sicepat || false}
										onCheckedChange={() => toggleShippingProvider("sicepat")}
									/>
									<Label htmlFor="sicepat">SiCepat</Label>
								</div>
								<div className="flex items-center space-x-2">
									<Switch
										id="pos"
										checked={settings.shipping?.shippingMethods?.pos || false}
										onCheckedChange={() => toggleShippingProvider("pos")}
									/>
									<Label htmlFor="pos">POS Indonesia</Label>
								</div>
								<div className="flex items-center space-x-2">
									<Switch
										id="gosend"
										checked={settings.shipping?.shippingMethods?.gosend || false}
										onCheckedChange={() => toggleShippingProvider("gosend")}
									/>
									<Label htmlFor="gosend">GoSend</Label>
								</div>
							</div>
						</div>

						<Separator />

						<div className="space-y-4">
							<h3 className="text-lg font-medium">
								Free Shipping
							</h3>
							<div className="flex items-center space-x-2">
								<Switch
									id="enable-free-shipping"
									checked={settings.shipping?.freeShipping?.enabled || false}
									onCheckedChange={(checked) => updateNestedField("shipping", "freeShipping", "enabled", checked)}
								/>
								<Label htmlFor="enable-free-shipping">
									Enable free shipping for orders above threshold
								</Label>
							</div>
							<div className="space-y-2">
								<Label htmlFor="free-shipping-threshold">
									Minimum Order Amount for Free Shipping (Rp)
								</Label>
								<Input
									id="free-shipping-threshold"
									type="number"
									value={settings.shipping?.freeShipping?.threshold || 0}
									onChange={(e) => updateNestedField("shipping", "freeShipping", "threshold", Number(e.target.value))}
								/>
							</div>
						</div>

						<Separator />

						<div className="space-y-4">
							<div className="flex items-center justify-between">
								<h3 className="text-lg font-medium">
									Shipping Zones
								</h3>
								<Button onClick={handleAddZone} size="sm">
									<Plus className="mr-2 h-4 w-4" /> Add Zone
								</Button>
							</div>
							<div className="space-y-2">
								{settings.shipping?.shippingZones?.length === 0 ? (
									<div className="text-center py-8 text-muted-foreground">
										No shipping zones yet. Click "Add Zone" to create one.
									</div>
								) : (
									settings.shipping?.shippingZones?.map((zone: any) => (
										<div
											key={zone.id}
											className="flex items-center justify-between p-4 border rounded-lg hover:bg-accent/50 transition-colors"
										>
											<div className="flex-1">
												<h4 className="font-medium">{zone.name}</h4>
												<p className="text-sm text-muted-foreground">
													{zone.areas?.join(", ") || "No areas"}
												</p>
											</div>
											<div className="flex gap-2">
												<Button 
													variant="outline" 
													size="sm"
													onClick={() => handleEditZone(zone)}
												>
													<Pencil className="h-4 w-4" />
												</Button>
												<Button 
													variant="outline" 
													size="sm"
													onClick={() => confirmDelete(zone.id)}
												>
													<Trash2 className="h-4 w-4 text-destructive" />
												</Button>
											</div>
										</div>
									))
								)}
							</div>
						</div>
					</div>
				</CardContent>
				<CardFooter>
					<Button
						className="bg-pink-500 hover:bg-pink-600"
						onClick={handleSaveChanges}
						disabled={loading}
					>
						<Save className="mr-2 h-4 w-4" /> {loading ? "Menyimpan..." : "Save Changes"}
					</Button>
				</CardFooter>
			</Card>

			<ShippingZoneDialog
				open={dialogOpen}
				onOpenChange={setDialogOpen}
				zone={selectedZone}
				onSuccess={onZonesChange}
			/>

			<AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
				<AlertDialogContent>
					<AlertDialogHeader>
						<AlertDialogTitle>Are you sure?</AlertDialogTitle>
						<AlertDialogDescription>
							This action cannot be undone. This will permanently delete the shipping zone.
						</AlertDialogDescription>
					</AlertDialogHeader>
					<AlertDialogFooter>
						<AlertDialogCancel disabled={deleting}>Cancel</AlertDialogCancel>
						<AlertDialogAction 
							onClick={handleDeleteZone}
							disabled={deleting}
							className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
						>
							{deleting ? "Deleting..." : "Delete"}
						</AlertDialogAction>
					</AlertDialogFooter>
				</AlertDialogContent>
			</AlertDialog>
		</>
	);
}
