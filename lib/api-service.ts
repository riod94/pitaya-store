import { toast } from "sonner";

// Base API configuration
const API_BASE_URL = "/api";

interface ApiResponse<T = any> {
  data?: T;
  error?: string;
  message?: string;
}

interface FetchOptions extends RequestInit {
  showToast?: boolean;
  toastSuccessMessage?: string;
  toastErrorMessage?: string;
}

// Generic API service class
class ApiService {
  private async request<T>(
    endpoint: string,
    options: FetchOptions = {}
  ): Promise<T> {
    const {
      showToast = false,
      toastSuccessMessage,
      toastErrorMessage,
      ...fetchOptions
    } = options;

    try {
      const response = await fetch(`${API_BASE_URL}${endpoint}`, {
        headers: {
          "Content-Type": "application/json",
          ...fetchOptions.headers,
        },
        ...fetchOptions,
      });

      const data: ApiResponse<T> = await response.json();

      if (!response.ok) {
        throw new Error(data.error || `HTTP ${response.status}`);
      }

      if (showToast && toastSuccessMessage) {
        toast.success(toastSuccessMessage);
      }

      return (data.data ?? data) as T;
    } catch (error) {
      const errorMessage = toastErrorMessage || (error as Error).message;

      if (showToast) {
        toast.error(errorMessage);
      }

      throw error;
    }
  }

  // GET request
  async get<T>(endpoint: string, options?: Omit<FetchOptions, "method" | "body">): Promise<T> {
    return this.request<T>(endpoint, { ...options, method: "GET" });
  }

  // POST request
  async post<T>(endpoint: string, data?: any, options?: FetchOptions): Promise<T> {
    return this.request<T>(endpoint, {
      ...options,
      method: "POST",
      body: data ? JSON.stringify(data) : undefined,
    });
  }

  // PUT request
  async put<T>(endpoint: string, data?: any, options?: FetchOptions): Promise<T> {
    return this.request<T>(endpoint, {
      ...options,
      method: "PUT",
      body: data ? JSON.stringify(data) : undefined,
    });
  }

  // DELETE request
  async delete<T>(endpoint: string, options?: FetchOptions): Promise<T> {
    return this.request<T>(endpoint, { ...options, method: "DELETE" });
  }

  // Upload file (multipart form data)
  async uploadFile<T>(endpoint: string, formData: FormData, options?: FetchOptions): Promise<T> {
    return this.request<T>(endpoint, {
      ...options,
      method: "POST",
      body: formData,
      headers: {}, // Let browser set Content-Type for FormData
    });
  }
}

// Create API service instance
export const apiService = new ApiService();

// Authentication service
export const authService = {
  // Get ImageKit authentication for uploads
  async getImageKitAuth() {
    return apiService.get<{ signature: string; token: string; expire: number; publicKey: string }>("/imagekit-auth");
  },

  // Validate admin access
  async validateAdminAccess() {
    return apiService.get("/admin/validate");
  },
};

// Hero content service
export const heroContentService = {
  // Get all hero content
  async getAll() {
    return apiService.get("/admin/hero-content");
  },

  // Get hero content by ID
  async getById(id: number) {
    return apiService.get(`/admin/hero-content/${id}`);
  },

  // Create hero content
  async create(data: any) {
    return apiService.post("/admin/hero-content", data, {
      showToast: true,
      toastSuccessMessage: "Hero content created successfully",
      toastErrorMessage: "Failed to create hero content",
    });
  },

  // Update hero content
  async update(id: number, data: any) {
    return apiService.put(`/admin/hero-content/${id}`, data, {
      showToast: true,
      toastSuccessMessage: "Hero content updated successfully",
      toastErrorMessage: "Failed to update hero content",
    });
  },

  // Delete hero content
  async delete(id: number) {
    return apiService.delete(`/admin/hero-content/${id}`, {
      showToast: true,
      toastSuccessMessage: "Hero content deleted successfully",
      toastErrorMessage: "Failed to delete hero content",
    });
  },
};

// Banners service
export const bannersService = {
  // Get all banners
  async getAll() {
    return apiService.get("/admin/banners");
  },

  // Get banner by ID
  async getById(id: number) {
    return apiService.get(`/admin/banners/${id}`);
  },

  // Create banner
  async create(data: any) {
    return apiService.post("/admin/banners", data, {
      showToast: true,
      toastSuccessMessage: "Banner created successfully",
      toastErrorMessage: "Failed to create banner",
    });
  },

  // Update banner
  async update(id: number, data: any) {
    return apiService.put(`/admin/banners/${id}`, data, {
      showToast: true,
      toastSuccessMessage: "Banner updated successfully",
      toastErrorMessage: "Failed to update banner",
    });
  },

  // Delete banner
  async delete(id: number) {
    return apiService.delete(`/admin/banners/${id}`, {
      showToast: true,
      toastSuccessMessage: "Banner deleted successfully",
      toastErrorMessage: "Failed to delete banner",
    });
  },
};

// Testimonials service
export const testimonialsService = {
  // Get all testimonials
  async getAll() {
    return apiService.get("/admin/testimonials");
  },

  // Get testimonial by ID
  async getById(id: number) {
    return apiService.get(`/admin/testimonials/${id}`);
  },

  // Create testimonial
  async create(data: any) {
    return apiService.post("/admin/testimonials", data, {
      showToast: true,
      toastSuccessMessage: "Testimonial created successfully",
      toastErrorMessage: "Failed to create testimonial",
    });
  },

  // Update testimonial
  async update(id: number, data: any) {
    return apiService.put(`/admin/testimonials/${id}`, data, {
      showToast: true,
      toastSuccessMessage: "Testimonial updated successfully",
      toastErrorMessage: "Failed to update testimonial",
    });
  },

  // Delete testimonial
  async delete(id: number) {
    return apiService.delete(`/admin/testimonials/${id}`, {
      showToast: true,
      toastSuccessMessage: "Testimonial deleted successfully",
      toastErrorMessage: "Failed to delete testimonial",
    });
  },
};

// Export types
export type { ApiResponse, FetchOptions };
