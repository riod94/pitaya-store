"use client";

import React, { useState, useEffect } from "react";
import { useSearchParams, useRouter, usePathname } from "next/navigation";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { HeroContentTab } from "./components/HeroContentTab";
import { BannersContentTab } from "./components/BannersContentTab";
import { TestimonialsContentTab } from "./components/TestimonialsContentTab";

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

export default function ContentPage() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const pathname = usePathname();

  // Get tab from URL or default to "hero"
  const getInitialTab = () => {
    const tab = searchParams.get("tab");
    return tab && ["hero", "banners", "testimonials"].includes(tab) ? tab : "hero";
  };

  const [activeTab, setActiveTab] = useState(getInitialTab());
  const [heroContent, setHeroContent] = useState<HeroContent[]>([]);
  const [banners, setBanners] = useState<Banner[]>([]);
  const [testimonials, setTestimonials] = useState<Testimonial[]>([]);
  const [loading, setLoading] = useState(false);

  // Update URL when tab changes
  const handleTabChange = (newTab: string) => {
    setActiveTab(newTab);
    const newSearchParams = new URLSearchParams(searchParams);
    newSearchParams.set("tab", newTab);
    router.replace(`${pathname}?${newSearchParams.toString()}`);
  };

  // Load data berdasarkan tab aktif
  useEffect(() => {
    const loadTabData = async () => {
      setLoading(true);
      try {
        switch (activeTab) {
          case "hero":
            console.log("📡 Loading hero content...");
            const heroRes = await fetch("/api/admin/hero-content");
            if (heroRes.ok) {
              const heroData = await heroRes.json();
              setHeroContent(heroData);
            }
            break;
          case "banners":
            console.log("📡 Loading banners...");
            const bannerRes = await fetch("/api/admin/banners");
            if (bannerRes.ok) {
              const bannerData = await bannerRes.json();
              setBanners(bannerData);
            }
            break;
          case "testimonials":
            console.log("📡 Loading testimonials...");
            const testimonialRes = await fetch("/api/admin/testimonials");
            if (testimonialRes.ok) {
              const testimonialData = await testimonialRes.json();
              setTestimonials(testimonialData);
            }
            break;
        }
      } catch (error) {
        console.error(`Error loading ${activeTab}:`, error);
      } finally {
        setLoading(false);
      }
    };

    loadTabData();
  }, [activeTab]);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">Content Management</h1>
        <p className="text-muted-foreground">Manage your website content and marketing materials.</p>
      </div>

      <Tabs value={activeTab} onValueChange={handleTabChange} className="space-y-6">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="hero">Hero Section</TabsTrigger>
          <TabsTrigger value="banners">Banners</TabsTrigger>
          <TabsTrigger value="testimonials">Testimonials</TabsTrigger>
        </TabsList>

        <TabsContent value="hero" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Hero Section</CardTitle>
              <CardDescription>Manage your homepage hero section content.</CardDescription>
            </CardHeader>
            <CardContent>
              <HeroContentTab
                data={heroContent}
                loading={loading && activeTab === "hero"}
                onRefresh={() => setActiveTab("hero")}
              />
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="banners" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Promotional Banners</CardTitle>
              <CardDescription>Manage promotional banners for your website.</CardDescription>
            </CardHeader>
            <CardContent>
              <BannersContentTab
                data={banners}
                loading={loading && activeTab === "banners"}
                onRefresh={() => setActiveTab("banners")}
              />
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="testimonials" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Customer Testimonials</CardTitle>
              <CardDescription>Manage customer testimonials for your website.</CardDescription>
            </CardHeader>
            <CardContent>
              <TestimonialsContentTab
                data={testimonials}
                loading={loading && activeTab === "testimonials"}
                onRefresh={() => setActiveTab("testimonials")}
              />
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
