"use client";

import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
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
import { toast } from "sonner";
import { Loader2, Plus, Edit, Trash2, Upload, X, Calendar } from "lucide-react";
import Image from "next/image";

interface Banner {
  id: number;
  title: string;
  description?: string;
  imageUrl: string;
  imageId?: string;
  buttonText?: string;
  buttonUrl?: string;
  isActive: boolean;
  sortOrder: number;
  startDate?: string;
  endDate?: string;
  createdAt: string;
  updatedAt: string;
}

interface BannersContentTabProps {
  data: Banner[];
  loading: boolean;
  onRefresh: () => void;
}

export function BannersContentTab({ data, loading, onRefresh }: BannersContentTabProps) {
  const [banners, setBanners] = useState<Banner[]>(data);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editingBanner, setEditingBanner] = useState<Banner | null>(null);
  const [uploading, setUploading] = useState(false);
  const [previewImage, setPreviewImage] = useState("");

  // Update local state when data prop changes
  useEffect(() => {
    setBanners(data);
  }, [data]);

  // Form state
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    imageUrl: "",
    imageId: "",
    buttonText: "",
    buttonUrl: "",
    startDate: "",
    endDate: "",
  });

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
      formData.append("fileName", `banner-${Date.now()}.png`);
      formData.append("folder", "/banners");
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

      setFormData(prev => ({
        ...prev,
        imageUrl: result.url || "",
        imageId: result.fileId || "",
      }));
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
    setFormData(prev => ({
      ...prev,
      imageUrl: "",
      imageId: "",
    }));
    setPreviewImage("");
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.title || !formData.imageUrl) {
      toast.error("Title and image are required");
      return;
    }

    try {
      const url = editingBanner
        ? `/api/admin/banners/${editingBanner.id}`
        : `/api/admin/banners`;

      const method = editingBanner ? "PUT" : "POST";

      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      if (!res.ok) {
        const errData = await res.json().catch(() => ({}));
        throw new Error(errData?.error || "Failed to save banner");
      }

      toast.success(editingBanner ? "Banner updated successfully" : "Banner created successfully");
      setDialogOpen(false);
      resetForm();
      onRefresh(); // Refresh data from parent
    } catch (error: any) {
      console.error(error);
      toast.error(error.message || "An error occurred");
    }
  };

  const handleEdit = (banner: Banner) => {
    setEditingBanner(banner);
    setFormData({
      title: banner.title,
      description: banner.description || "",
      imageUrl: banner.imageUrl,
      imageId: banner.imageId || "",
      buttonText: banner.buttonText || "",
      buttonUrl: banner.buttonUrl || "",
      startDate: banner.startDate ? new Date(banner.startDate).toISOString().split('T')[0] : "",
      endDate: banner.endDate ? new Date(banner.endDate).toISOString().split('T')[0] : "",
    });
    setPreviewImage(banner.imageUrl);
    setDialogOpen(true);
  };

  const handleDelete = async (id: number) => {
    if (!confirm("Are you sure you want to delete this banner?")) return;

    try {
      const res = await fetch(`/api/admin/banners/${id}`, {
        method: "DELETE",
      });

      if (!res.ok) {
        const errData = await res.json().catch(() => ({}));
        throw new Error(errData?.error || "Failed to delete banner");
      }

      toast.success("Banner deleted successfully");
      onRefresh(); // Refresh data from parent
    } catch (error: any) {
      console.error(error);
      toast.error(error.message || "An error occurred");
    }
  };

  const resetForm = () => {
    setEditingBanner(null);
    setFormData({
      title: "",
      description: "",
      imageUrl: "",
      imageId: "",
      buttonText: "",
      buttonUrl: "",
      startDate: "",
      endDate: "",
    });
    setPreviewImage("");
  };

  const handleAddNew = () => {
    resetForm();
    setDialogOpen(true);
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center p-8">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-end">
        <Button onClick={handleAddNew} className="bg-pink-500 hover:bg-pink-600">
          <Plus className="mr-2 h-4 w-4" /> Add Banner
        </Button>
      </div>

      {banners.length === 0 ? (
        <Card>
          <CardContent className="p-6 text-center">
            <p className="text-muted-foreground">No banners yet. Add your first promotional banner.</p>
          </CardContent>
        </Card>
      ) : (
        <div className="grid gap-6">
          {banners.map((banner) => (
            <Card key={banner.id}>
              <CardContent className="p-6">
                <div className="flex gap-6">
                  <div className="w-64 h-32 border rounded-lg overflow-hidden flex-shrink-0">
                    <Image
                      src={banner.imageUrl}
                      alt={banner.title}
                      width={256}
                      height={128}
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <div className="flex-1">
                    <div className="flex items-start justify-between mb-4">
                      <div>
                        <div className="flex items-center gap-2 mb-2">
                          <h3 className="text-xl font-semibold">{banner.title}</h3>
                          <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                            banner.isActive ? "bg-green-100 text-green-800" : "bg-gray-100 text-gray-800"
                          }`}>
                            {banner.isActive ? "Active" : "Inactive"}
                          </span>
                        </div>
                        {banner.description && (
                          <p className="text-gray-600 mb-2">{banner.description}</p>
                        )}
                        {banner.buttonText && (
                          <p className="text-sm text-muted-foreground">
                            Button: {banner.buttonText} → {banner.buttonUrl}
                          </p>
                        )}
                        {(banner.startDate || banner.endDate) && (
                          <div className="flex items-center gap-1 text-sm text-muted-foreground mt-2">
                            <Calendar className="h-4 w-4" />
                            {banner.startDate && <span>From: {new Date(banner.startDate).toLocaleDateString()}</span>}
                            {banner.startDate && banner.endDate && <span> • </span>}
                            {banner.endDate && <span>To: {new Date(banner.endDate).toLocaleDateString()}</span>}
                          </div>
                        )}
                      </div>
                      <div className="flex gap-2">
                        <Button variant="outline" size="sm" onClick={() => handleEdit(banner)}>
                          <Edit className="mr-2 h-4 w-4" /> Edit
                        </Button>
                        <Button variant="outline" size="sm" onClick={() => handleDelete(banner.id)}>
                          <Trash2 className="mr-2 h-4 w-4" /> Delete
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
        <DialogContent className="sm:max-w-[625px]">
          <form onSubmit={handleSubmit}>
            <DialogHeader>
              <DialogTitle>
                {editingBanner ? "Edit Banner" : "Add Banner"}
              </DialogTitle>
              <DialogDescription>
                {editingBanner ? "Update promotional banner" : "Create new promotional banner"}
              </DialogDescription>
            </DialogHeader>

            <div className="grid gap-4 py-4">
              <div className="space-y-2">
                <Label htmlFor="title">Title *</Label>
                <Input
                  id="title"
                  value={formData.title}
                  onChange={(e) => setFormData(prev => ({ ...prev, title: e.target.value }))}
                  placeholder="Enter banner title"
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="description">Description</Label>
                <Textarea
                  id="description"
                  value={formData.description}
                  onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
                  placeholder="Enter banner description"
                  rows={3}
                />
              </div>

              <div className="space-y-2">
                <Label>Banner Image *</Label>
                {previewImage ? (
                  <div className="relative border rounded-lg p-4 bg-gray-50">
                    <div className="flex justify-center mb-2">
                      <div className="relative w-64 h-32">
                        <Image
                          src={previewImage}
                          alt="Banner preview"
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
                      type="file"
                      accept="image/*"
                      onChange={handleFileSelect}
                      className="hidden"
                      id="banner-image"
                    />
                    <Upload className="mx-auto h-12 w-12 text-gray-400 mb-4" />
                    <p className="text-sm text-gray-600 mb-4">
                      Click to upload or drag and drop
                    </p>
                    <Button
                      type="button"
                      variant="outline"
                      onClick={() => document.getElementById('banner-image')?.click()}
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

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="buttonText">Button Text</Label>
                  <Input
                    id="buttonText"
                    value={formData.buttonText}
                    onChange={(e) => setFormData(prev => ({ ...prev, buttonText: e.target.value }))}
                    placeholder="e.g., Shop Now"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="buttonUrl">Button URL</Label>
                  <Input
                    id="buttonUrl"
                    value={formData.buttonUrl}
                    onChange={(e) => setFormData(prev => ({ ...prev, buttonUrl: e.target.value }))}
                    placeholder="e.g., /products"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="startDate">Start Date</Label>
                  <Input
                    id="startDate"
                    type="date"
                    value={formData.startDate}
                    onChange={(e) => setFormData(prev => ({ ...prev, startDate: e.target.value }))}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="endDate">End Date</Label>
                  <Input
                    id="endDate"
                    type="date"
                    value={formData.endDate}
                    onChange={(e) => setFormData(prev => ({ ...prev, endDate: e.target.value }))}
                  />
                </div>
              </div>
            </div>

            <DialogFooter>
              <Button type="button" variant="outline" onClick={() => setDialogOpen(false)}>
                Cancel
              </Button>
              <Button type="submit" disabled={uploading}>
                {uploading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                {editingBanner ? "Update" : "Create"}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
}
