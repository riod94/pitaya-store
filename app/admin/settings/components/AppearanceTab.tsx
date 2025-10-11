import React from "react";
import { Button } from "@/components/ui/button";
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
import { Separator } from "@/components/ui/separator";
import { Save } from "lucide-react";

interface AppearanceTabProps {
	settings: any;
	updateField: (section: string, field: string, value: any) => void;
	updateNestedField: (section: string, subsection: string, field: string, value: any) => void;
	handleSaveChanges: () => void;
	loading: boolean;
}

export function AppearanceTab({ settings, updateField, updateNestedField, handleSaveChanges, loading }: AppearanceTabProps) {
	return (
		<Card>
			<CardHeader>
				<CardTitle>Appearance Settings</CardTitle>
				<CardDescription>
					Customize how your store looks to customers.
				</CardDescription>
			</CardHeader>
			<CardContent className="space-y-6">
				<div className="space-y-4">
					<h3 className="text-lg font-medium">Theme</h3>
					<div className="grid grid-cols-3 gap-4">
						<div 
							className={`border-2 rounded-lg p-4 text-center cursor-pointer transition-all ${
								settings.appearance?.theme === "default" ? "border-pink-500 ring-2 ring-pink-200" : "border-gray-200 hover:border-pink-300"
							}`}
							onClick={() => updateField("appearance", "theme", "default")}
						>
							<div className="h-20 bg-gradient-to-r from-pink-500 to-teal-500 rounded-md mb-2"></div>
							<p className="font-medium">Default</p>
						</div>
						<div 
							className={`border-2 rounded-lg p-4 text-center cursor-pointer transition-all ${
								settings.appearance?.theme === "purple" ? "border-pink-500 ring-2 ring-pink-200" : "border-gray-200 hover:border-pink-300"
							}`}
							onClick={() => updateField("appearance", "theme", "purple")}
						>
							<div className="h-20 bg-gradient-to-r from-purple-500 to-indigo-500 rounded-md mb-2"></div>
							<p className="font-medium">Purple</p>
						</div>
						<div 
							className={`border-2 rounded-lg p-4 text-center cursor-pointer transition-all ${
								settings.appearance?.theme === "autumn" ? "border-pink-500 ring-2 ring-pink-200" : "border-gray-200 hover:border-pink-300"
							}`}
							onClick={() => updateField("appearance", "theme", "autumn")}
						>
							<div className="h-20 bg-gradient-to-r from-amber-500 to-orange-500 rounded-md mb-2"></div>
							<p className="font-medium">Autumn</p>
						</div>
					</div>
				</div>

				<Separator />

				<div className="space-y-4">
					<h3 className="text-lg font-medium">Logo</h3>
					<div className="flex items-center gap-4">
						<div className="w-24 h-24 border border-gray-200 rounded-lg flex items-center justify-center">
							<img
								src={settings.appearance?.logo}
								alt="Logo"
								className="max-w-full max-h-full p-2"
							/>
						</div>
						<Button variant="outline">Change Logo</Button>
					</div>
				</div>

				<Separator />

				<div className="space-y-4">
					<h3 className="text-lg font-medium">Homepage Layout</h3>
					<div className="space-y-2">
						<div className="flex items-center space-x-2">
							<Switch
								id="show-hero"
								checked={settings.appearance?.homepageLayout?.showHero || false}
								onCheckedChange={(checked) => updateNestedField("appearance", "homepageLayout", "showHero", checked)}
							/>
							<Label htmlFor="show-hero">
								Show hero section
							</Label>
						</div>
						<div className="flex items-center space-x-2">
							<Switch
								id="show-featured"
								checked={settings.appearance?.homepageLayout?.showFeatured || false}
								onCheckedChange={(checked) => updateNestedField("appearance", "homepageLayout", "showFeatured", checked)}
							/>
							<Label htmlFor="show-featured">
								Show featured products
							</Label>
						</div>
						<div className="flex items-center space-x-2">
							<Switch
								id="show-categories"
								checked={settings.appearance?.homepageLayout?.showCategories || false}
								onCheckedChange={(checked) => updateNestedField("appearance", "homepageLayout", "showCategories", checked)}
							/>
							<Label htmlFor="show-categories">
								Show product categories
							</Label>
						</div>
						<div className="flex items-center space-x-2">
							<Switch
								id="show-testimonials"
								checked={settings.appearance?.homepageLayout?.showTestimonials || false}
								onCheckedChange={(checked) => updateNestedField("appearance", "homepageLayout", "showTestimonials", checked)}
							/>
							<Label htmlFor="show-testimonials">
								Show testimonials
							</Label>
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
	);
}
