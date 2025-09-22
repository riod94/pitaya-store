"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";
import { ArrowLeft } from "lucide-react";
import Link from "next/link";

export default function NewProductPage() {
  const router = useRouter();
  const [images, setImages] = useState<File[]>([]);
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [category, setCategory] = useState("");
  const [price, setPrice] = useState("");
  const [discountPercent, setDiscountPercent] = useState("");
  const [discountPrice, setDiscountPrice] = useState("");
  const [stock, setStock] = useState("");
  const [sku, setSku] = useState("");
  const [condition, setCondition] = useState("new");
  const [brand, setBrand] = useState("");
  const [weight, setWeight] = useState("");
  const [length, setLength] = useState("");
  const [width, setWidth] = useState("");
  const [height, setHeight] = useState("");
  const [preOrder, setPreOrder] = useState(false);
  const [shippingCourier, setShippingCourier] = useState(false);
  const [shippingInsurance, setShippingInsurance] = useState("optional");
  const [status, setStatus] = useState(true);
  const [loading, setLoading] = useState(false);
  const [variantEnabled, setVariantEnabled] = useState(false);
  const [variants, setVariants] = useState([
    { id: 1, name: "", price: "", discount: "", discountPrice: "", weight: "", stock: "", sku: "", status: true, image: "", selected: false },
  ]);

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files) return;
    setImages(Array.from(e.target.files));
  };

  const addVariant = () => {
    setVariants([...variants, { id: Date.now(), name: "", price: "", discount: "", discountPrice: "", weight: "", stock: "", sku: "", status: true, image: "", selected: false }]);
  };

  const updateVariant = (index: number, field: string, value: any) => {
    const newVariants = [...variants];
    (newVariants[index] as any)[field] = value;
    setVariants(newVariants);
  };

  const removeVariant = (index: number) => {
    const newVariants = [...variants];
    newVariants.splice(index, 1);
    setVariants(newVariants);
  };

  const handleSubmit = async () => {
    if (!name || (!variantEnabled && (!price || !stock)) || !sku) {
      alert("Please fill all required fields");
      return;
    }
    setLoading(true);
    try {
      // Prepare product data
      const productData = {
        sku,
        name,
        slug: name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, ''),
        description,
        costPrice: parseFloat(price) || 0,
        hpp: parseFloat(price) || 0,
        sellingPrice: parseFloat(price) || 0,
        weight: parseFloat(weight) || 0,
        stockQuantity: parseInt(stock) || 0,
        status: status ? 'active' : 'inactive',
        images: images.map(img => URL.createObjectURL(img)), // In real app, upload to storage first
        dimensions: {
          length: parseFloat(length) || 0,
          width: parseFloat(width) || 0,
          height: parseFloat(height) || 0
        }
      };

      // Create product
      const response = await fetch('/api/admin/products', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(productData),
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || 'Failed to create product');
      }

      const result = await response.json();
      const productId = result.data.id;

      // Create variants if enabled
      if (variantEnabled && variants.length > 0) {
        for (const variant of variants) {
          if (variant.name && variant.sku) {
            const variantData = {
              productId,
              sku: variant.sku,
              name: variant.name,
              attributes: { type: variant.name }, // Simple attribute structure
              costPrice: parseFloat(variant.price) || productData.costPrice,
              hpp: parseFloat(variant.price) || productData.hpp,
              sellingPrice: parseFloat(variant.price) || productData.sellingPrice,
              stockQuantity: parseInt(variant.stock) || 0,
              weight: parseFloat(variant.weight) || productData.weight,
              images: variant.image ? [variant.image] : [],
              isActive: variant.status
            };

            await fetch('/api/admin/products/variants', {
              method: 'POST',
              headers: {
                'Content-Type': 'application/json',
              },
              body: JSON.stringify(variantData),
            });
          }
        }
      }

      alert("Product created successfully!");
      router.push("/admin/products/v2");
    } catch (error) {
      console.error('Error creating product:', error);
      alert(error instanceof Error ? error.message : "Failed to create product");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container fluid rounded-lg space-y-6">
      <Link href="/admin/products/v2" className="flex gap-4">
        <ArrowLeft size={28} strokeWidth={2} />
        <p className="text-2xl font-bold">Tambah Produk</p>
      </Link>

      {/* Informasi Dasar */}
      <section className="bg-white p-6 rounded-lg shadow space-y-4">
        <h2 className="text-lg font-semibold border-l-4 border-yellow-400 pl-2">Informasi Dasar</h2>
        <div className="flex flex-col md:flex-row gap-6">
          <div className="flex flex-col items-center justify-center border border-dashed border-gray-300 rounded-md w-48 h-48 cursor-pointer bg-gray-50">
            <input
              type="file"
              multiple
              accept="image/*"
              className="hidden"
              id="product-images"
              onChange={handleImageChange}
            />
            <label htmlFor="product-images" className="cursor-pointer text-gray-400 text-center">
              +<br />
              Upload Foto Produk
            </label>
          </div>
          <div className="flex-1 space-y-4">
            <div>
              <Label>Nama Produk <span className="text-red-500">*</span></Label>
              <Input maxLength={255} placeholder="Tulis nama produkmu" value={name} onChange={(e) => setName(e.target.value)} />
              <div className="text-xs text-gray-500">{name.length}/255</div>
            </div>
            <div>
              <Label>Deskripsi Produk <span className="text-red-500">*</span></Label>
              <Textarea maxLength={5000} placeholder="Masukkan detail produk" value={description} onChange={(e) => setDescription(e.target.value)} rows={5} />
              <div className="text-xs text-gray-500">{description.length}/5000</div>
            </div>
            <div>
              <Label>Kategori Produk <span className="text-red-500">*</span></Label>
              <Input placeholder="Pilih atau ketik kategori produkmu" value={category} onChange={(e) => setCategory(e.target.value)} />
            </div>
          </div>
        </div>
      </section>

      {/* Informasi Penjualan */}
      <section className="bg-white p-6 rounded-lg shadow space-y-4">
        <h2 className="text-lg font-semibold border-l-4 border-yellow-400 pl-2">Informasi Penjualan</h2>
        <div className="space-y-4">
          {/* Variant Switch */}
          <div className="flex items-center justify-between">
            <Label>Varian Produk (Opsional)</Label>
            <Switch checked={variantEnabled} onCheckedChange={setVariantEnabled} />
          </div>

          {!variantEnabled && (
            <>
              <div>
                <Label>Harga Produk <span className="text-red-500">*</span></Label>
                <Input placeholder="Rp Masukkan harga produkmu" value={price} onChange={(e) => setPrice(e.target.value)} />
              </div>
              <div className="flex gap-2">
                <div className="flex-1">
                  <Label>Diskon Produk</Label>
                  <Input placeholder="%" value={discountPercent} onChange={(e) => setDiscountPercent(e.target.value)} />
                </div>
                <div className="flex-1">
                  <Label>Harga Diskon</Label>
                  <Input placeholder="Rp Masukkan harga diskon" value={discountPrice} onChange={(e) => setDiscountPrice(e.target.value)} />
                </div>
              </div>
              <div>
                <Label>Stok Produk <span className="text-red-500">*</span></Label>
                <Input placeholder="0" value={stock} onChange={(e) => setStock(e.target.value)} />
              </div>
              <div>
                <Label>SKU</Label>
                <Input placeholder="Masukkan SKU Produkmu" value={sku} onChange={(e) => setSku(e.target.value)} />
              </div>
            </>
          )}

          {variantEnabled && (
            <>
              <div className="overflow-x-auto rounded-lg border bg-white p-4">
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-4">
                    <input
                      type="checkbox"
                      checked={variants.length > 0 && variants.every(v => v.selected)}
                      onChange={(e) => {
                        const checked = e.target.checked;
                        setVariants(variants.map(v => ({ ...v, selected: checked })));
                      }}
                    />
                    <span className="font-semibold">Pilih Semua {variants.length} Varian</span>
                    <select
                      className="border rounded px-2 py-1 text-sm"
                      onChange={(e) => {
                        // Implement filter logic if needed
                      }}
                    >
                      <option>Semua Varian</option>
                      {/* Add filter options dynamically if needed */}
                    </select>
                  </div>
                  <Button onClick={addVariant} className="bg-blue-600 text-white hover:bg-blue-700">
                    Tambah Varian
                  </Button>
                </div>
                <table className="min-w-full table-fixed border-collapse border border-gray-200 text-sm">
                  <thead className="bg-gray-100">
                    <tr>
                      <th className="w-10 p-2 border border-gray-300">
                        {/* Empty for checkbox column */}
                      </th>
                      <th className="w-24 p-2 border border-gray-300">Gambar</th>
                      <th className="p-2 border border-gray-300">Varian</th>
                      <th className="p-2 border border-gray-300">Harga</th>
                      <th className="p-2 border border-gray-300">Diskon</th>
                      <th className="p-2 border border-gray-300">Setelah Diskon</th>
                      <th className="p-2 border border-gray-300">Berat</th>
                      <th className="p-2 border border-gray-300">Stock</th>
                      <th className="p-2 border border-gray-300">SKU</th>
                      <th className="p-2 border border-gray-300">Status</th>
                      <th className="w-10 p-2 border border-gray-300">Aksi</th>
                    </tr>
                  </thead>
                  <tbody>
                    {variants.map((variant, idx) => (
                      <tr key={variant.id} className="border border-gray-300">
                        <td className="p-2 border border-gray-300 text-center">
                          <input
                            type="checkbox"
                            checked={variant.selected || false}
                            onChange={(e) => {
                              const checked = e.target.checked;
                              const newVariants = [...variants];
                              newVariants[idx].selected = checked;
                              setVariants(newVariants);
                            }}
                          />
                        </td>
                        <td className="p-2 border border-gray-300 text-center">
                          <div className="flex flex-col items-center justify-center w-16 h-16 border border-dashed rounded-md cursor-pointer bg-gray-50 mx-auto">
                            <input
                              type="file"
                              accept="image/*"
                              className="hidden"
                              id={`variant-image-${variant.id}`}
                              onChange={(e) => {
                                const file = e.target.files?.[0];
                                if (file) {
                                  const reader = new FileReader();
                                  reader.onload = () => {
                                    updateVariant(idx, "image", reader.result);
                                  };
                                  reader.readAsDataURL(file);
                                }
                              }}
                            />
                            <label htmlFor={`variant-image-${variant.id}`} className="cursor-pointer w-full h-full flex items-center justify-center">
                              {variant.image ? (
                                <img src={variant.image} alt="Variant" className="object-cover w-full h-full rounded-md" />
                              ) : (
                                <span className="text-gray-400">+ Upload</span>
                              )}
                            </label>
                          </div>
                        </td>
                        <td className="p-2 border border-gray-300">
                          <Input
                            placeholder="Varian"
                            value={variant.name}
                            onChange={(e) => updateVariant(idx, "name", e.target.value)}
                          />
                        </td>
                        <td className="p-2 border border-gray-300">
                          <Input
                            placeholder="Rp"
                            value={variant.price}
                            onChange={(e) => updateVariant(idx, "price", e.target.value)}
                          />
                        </td>
                        <td className="p-2 border border-gray-300">
                          <Input
                            placeholder="%"
                            value={variant.discount}
                            onChange={(e) => updateVariant(idx, "discount", e.target.value)}
                          />
                        </td>
                        <td className="p-2 border border-gray-300">
                          <Input
                            placeholder="Rp"
                            value={variant.discountPrice}
                            onChange={(e) => updateVariant(idx, "discountPrice", e.target.value)}
                          />
                        </td>
                        <td className="p-2 border border-gray-300">
                          <Input
                            placeholder="g"
                            value={variant.weight}
                            onChange={(e) => updateVariant(idx, "weight", e.target.value)}
                          />
                        </td>
                        <td className="p-2 border border-gray-300">
                          <Input
                            placeholder="Stock"
                            value={variant.stock}
                            onChange={(e) => updateVariant(idx, "stock", e.target.value)}
                          />
                        </td>
                        <td className="p-2 border border-gray-300">
                          <Input
                            placeholder="SKU"
                            value={variant.sku}
                            onChange={(e) => updateVariant(idx, "sku", e.target.value)}
                          />
                        </td>
                        <td className="p-2 border border-gray-300 text-center">
                          <Switch
                            checked={variant.status}
                            onCheckedChange={(checked) => updateVariant(idx, "status", checked)}
                          />
                          {variant.status && (
                            <Badge variant="secondary" className="ml-2">
                              Utama
                            </Badge>
                          )}
                        </td>
                        <td className="p-2 border border-gray-300 text-center">
                          <button
                            className="text-red-600 hover:text-red-800"
                            onClick={() => removeVariant(idx)}
                            title="Hapus Varian"
                          >
                            &times;
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </>
          )}
        </div>
      </section>

      {/* Informasi Pengiriman */}
      <section className="bg-white p-6 rounded-lg shadow space-y-4">
        <h2 className="text-lg font-semibold border-l-4 border-yellow-400 pl-2">Informasi Pengiriman</h2>
        <div className="space-y-4">
          <div>
            <Label>Berat Produk <span className="text-red-500">*</span></Label>
            <Input placeholder="Berat Produk" value={weight} onChange={(e) => setWeight(e.target.value)} />
          </div>
          <div className="flex gap-2">
            <Input placeholder="Panjang" value={length} onChange={(e) => setLength(e.target.value)} />
            <Input placeholder="Lebar" value={width} onChange={(e) => setWidth(e.target.value)} />
            <Input placeholder="Tinggi" value={height} onChange={(e) => setHeight(e.target.value)} />
          </div>
          <div className="flex items-center justify-between">
            <Label>Pre-Order</Label>
            <Switch checked={preOrder} onCheckedChange={setPreOrder} />
          </div>
          <div className="flex items-center justify-between">
            <Label>Pengiriman Kurir Toko</Label>
            <Switch checked={shippingCourier} onCheckedChange={setShippingCourier} />
          </div>
          <div>
            <Label>Asuransi Pengiriman</Label>
            <div className="flex gap-4">
              <div className="flex items-center space-x-2">
                <input
                  type="radio"
                  id="insurance-required"
                  name="insurance"
                  value="required"
                  checked={shippingInsurance === "required"}
                  onChange={() => setShippingInsurance("required")}
                />
                <Label htmlFor="insurance-required">Wajib</Label>
              </div>
              <div className="flex items-center space-x-2">
                <input
                  type="radio"
                  id="insurance-optional"
                  name="insurance"
                  value="optional"
                  checked={shippingInsurance === "optional"}
                  onChange={() => setShippingInsurance("optional")}
                />
                <Label htmlFor="insurance-optional">Opsional</Label>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Status Produk */}
      <section className="bg-white p-6 rounded-lg shadow space-y-4">
        <h2 className="text-lg font-semibold border-l-4 border-yellow-400 pl-2">Status Produk</h2>
        <div className="flex items-center justify-between">
          <Label>Status</Label>
          <Switch checked={status} onCheckedChange={setStatus} />
        </div>
      </section>

      <div className="flex justify-end space-x-4">
        <Button variant="outline" onClick={() => router.back()}>
          Batalkan
        </Button>
        <Button onClick={handleSubmit} disabled={loading}>
          Simpan
        </Button>
      </div>
    </div>
  );
}
