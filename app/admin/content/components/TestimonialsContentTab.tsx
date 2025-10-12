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
import { Loader2, Plus, Edit, Trash2, Star, Upload, X } from "lucide-react";
import Image from "next/image";

interface Testimonial {
  id: number;
  name: string;
  role?: string;
  company?: string;
  content: string;
  imageUrl?: string;
  imageId?: string;
  rating: number;
  isActive: boolean;
  sortOrder: number;
  createdAt: string;
  updatedAt: string;
}

interface TestimonialsContentTabProps {
  data: Testimonial[];
  loading: boolean;
  onRefresh: () => void;
}

export function TestimonialsContentTab({ data, loading, onRefresh }: TestimonialsContentTabProps) {
  const [testimonials, setTestimonials] = useState<Testimonial[]>(data);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editingTestimonial, setEditingTestimonial] = useState<Testimonial | null>(null);
  const [uploading, setUploading] = useState(false);
  const [previewImage, setPreviewImage] = useState("");

  // Update local state when data prop changes
  useEffect(() => {
    setTestimonials(data);
  }, [data]);

  // Form state
  const [formData, setFormData] = useState({
    name: "",
    role: "",
    company: "",
    content: "",
    imageUrl: "",
    imageId: "",
    rating: 5,
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
      formData.append("fileName", `testimonial-${Date.now()}.png`);
      formData.append("folder", "/testimonials");
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

    if (!formData.name || !formData.content) {
      toast.error("Name and content are required");
      return;
    }

    try {
      const url = editingTestimonial
        ? `/api/admin/testimonials/${editingTestimonial.id}`
        : `/api/admin/testimonials`;

      const method = editingTestimonial ? "PUT" : "POST";

      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      if (!res.ok) {
        const errData = await res.json().catch(() => ({}));
        throw new Error(errData?.error || "Failed to save testimonial");
      }

      toast.success(editingTestimonial ? "Testimonial updated successfully" : "Testimonial created successfully");
      setDialogOpen(false);
      resetForm();
      onRefresh(); // Refresh data from parent
    } catch (error: any) {
      console.error(error);
      toast.error(error.message || "An error occurred");
    }
  };

  const handleEdit = (testimonial: Testimonial) => {
    setEditingTestimonial(testimonial);
    setFormData({
      name: testimonial.name,
      role: testimonial.role || "",
      company: testimonial.company || "",
      content: testimonial.content,
      imageUrl: testimonial.imageUrl || "",
      imageId: testimonial.imageId || "",
      rating: testimonial.rating,
    });
    setPreviewImage(testimonial.imageUrl || "");
    setDialogOpen(true);
  };

  const handleDelete = async (id: number) => {
    if (!confirm("Are you sure you want to delete this testimonial?")) return;

    try {
      const res = await fetch(`/api/admin/testimonials/${id}`, {
        method: "DELETE",
      });

      if (!res.ok) {
        const errData = await res.json().catch(() => ({}));
        throw new Error(errData?.error || "Failed to delete testimonial");
      }

      toast.success("Testimonial deleted successfully");
      onRefresh(); // Refresh data from parent
    } catch (error: any) {
      console.error(error);
      toast.error(error.message || "An error occurred");
    }
  };

  const resetForm = () => {
    setEditingTestimonial(null);
    setFormData({
      name: "",
      role: "",
      company: "",
      content: "",
      imageUrl: "",
      imageId: "",
      rating: 5,
    });
    setPreviewImage("");
  };

  const handleAddNew = () => {
    resetForm();
    setDialogOpen(true);
  };

  const renderStars = (rating: number, interactive = false) => {
    return (
      <div className="flex gap-1">
        {[1, 2, 3, 4, 5].map((star) => (
          <Star
            key={star}
            className={`h-4 w-4 ${
              star <= rating ? "fill-yellow-400 text-yellow-400" : "text-gray-300"
            } ${interactive ? "cursor-pointer" : ""}`}
            onClick={interactive ? () => setFormData(prev => ({ ...prev, rating: star })) : undefined}
          />
        ))}
      </div>
    );
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
          <Plus className="mr-2 h-4 w-4" /> Add Testimonial
        </Button>
      </div>

      {testimonials.length === 0 ? (
        <Card>
          <CardContent className="p-6 text-center">
            <p className="text-muted-foreground">No testimonials yet. Add your first customer testimonial.</p>
          </CardContent>
        </Card>
      ) : (
        <div className="grid md:grid-cols-2 gap-6">
          {testimonials.map((testimonial) => (
            <Card key={testimonial.id}>
              <CardContent className="p-6">
                <div className="flex items-start gap-4">
                  {testimonial.imageUrl && (
                    <div className="w-12 h-12 rounded-full overflow-hidden flex-shrink-0">
                      <Image
                        src={testimonial.imageUrl}
                        alt={testimonial.name}
                        width={48}
                        height={48}
                        className="w-full h-full object-cover"
                      />
                    </div>
                  )}
                  <div className="flex-1">
                    <div className="flex items-center justify-between mb-2">
                      <h3 className="font-semibold">{testimonial.name}</h3>
                      {renderStars(testimonial.rating)}
                    </div>
                    {(testimonial.role || testimonial.company) && (
                      <p className="text-sm text-muted-foreground mb-2">
                        {testimonial.role}
                        {testimonial.role && testimonial.company && " at "}
                        {testimonial.company}
                      </p>
                    )}
                    <p className="text-gray-600 text-sm">{testimonial.content}</p>
                  </div>
                </div>
                <div className="flex gap-2 mt-4 justify-end">
                  <Button variant="outline" size="sm" onClick={() => handleEdit(testimonial)}>
                    <Edit className="mr-2 h-4 w-4" /> Edit
                  </Button>
                  <Button variant="outline" size="sm" onClick={() => handleDelete(testimonial.id)}>
                    <Trash2 className="mr-2 h-4 w-4" /> Delete
                  </Button>
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
                {editingTestimonial ? "Edit Testimonial" : "Add Testimonial"}
              </DialogTitle>
              <DialogDescription>
                {editingTestimonial ? "Update customer testimonial" : "Add new customer testimonial"}
              </DialogDescription>
            </DialogHeader>

            <div className="grid gap-4 py-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="name">Name *</Label>
                  <Input
                    id="name"
                    value={formData.name}
                    onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                    placeholder="Customer name"
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="rating">Rating</Label>
                  <div className="flex items-center gap-2">
                    {renderStars(formData.rating, true)}
                    <span className="text-sm text-muted-foreground ml-2">
                      {formData.rating} star{formData.rating !== 1 ? 's' : ''}
                    </span>
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="role">Role/Position</Label>
                  <Input
                    id="role"
                    value={formData.role}
                    onChange={(e) => setFormData(prev => ({ ...prev, role: e.target.value }))}
                    placeholder="e.g., Software Engineer"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="company">Company</Label>
                  <Input
                    id="company"
                    value={formData.company}
                    onChange={(e) => setFormData(prev => ({ ...prev, company: e.target.value }))}
                    placeholder="Company name"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="content">Testimonial Content *</Label>
                <Textarea
                  id="content"
                  value={formData.content}
                  onChange={(e) => setFormData(prev => ({ ...prev, content: e.target.value }))}
                  placeholder="What does the customer say about your products/services?"
                  rows={4}
                  required
                />
              </div>

              <div className="space-y-2">
                <Label>Profile Image</Label>
                {previewImage ? (
                  <div className="relative border rounded-lg p-4 bg-gray-50">
                    <div className="flex justify-center mb-2">
                      <div className="relative w-16 h-16 rounded-full overflow-hidden">
                        <Image
                          src={previewImage}
                          alt="Profile preview"
                          fill
                          className="object-cover"
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
                      id="testimonial-image"
                    />
                    <Upload className="mx-auto h-12 w-12 text-gray-400 mb-4" />
                    <p className="text-sm text-gray-600 mb-4">
                      Click to upload profile image
                    </p>
                    <Button
                      type="button"
                      variant="outline"
                      onClick={() => document.getElementById('testimonial-image')?.click()}
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
                      PNG, JPG up to 2MB
                    </p>
                  </div>
                )}
              </div>
            </div>

            <DialogFooter>
              <Button type="button" variant="outline" onClick={() => setDialogOpen(false)}>
                Cancel
              </Button>
              <Button type="submit" disabled={uploading}>
                {uploading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                {editingTestimonial ? "Update" : "Create"}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
}
