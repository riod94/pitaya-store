"use client";

import { useEffect, useState } from "react";
import { useRouter, useParams } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import Image from "next/image";

export default function ProductDetailPage() {
  const router = useRouter();
  const params = useParams();
  const productId = params.id;

  const [product, setProduct] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!productId) return;
    setLoading(true);
    fetch(`/api/admin/products/${productId}`)
      .then(res => res.json())
      .then(data => {
        setProduct(data.data);
      })
      .finally(() => setLoading(false));
  }, [productId]);

  if (loading) {
    return <div>Loading...</div>;
  }

  if (!product) {
    return <div>Product not found</div>;
  }

  return (
    <div className="max-w-4xl mx-auto p-6 space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>{product.name}</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex gap-6">
            <div className="w-48 h-48 rounded-md overflow-hidden bg-gray-100">
              <Image
                src={product.images?.[0] || "/placeholder.svg"}
                alt={product.name}
                width={192}
                height={192}
                className="object-cover w-full h-full"
              />
            </div>
            <div className="flex-1 space-y-4">
              <div><strong>SKU:</strong> {product.sku}</div>
              <div><strong>Category:</strong> {product.category?.name || "-"}</div>
              <div><strong>Price:</strong> Rp {product.sellingPrice?.toLocaleString()}</div>
              <div><strong>Stock:</strong> {product.stockQuantity}</div>
              <div><strong>Status:</strong> <Badge>{product.status}</Badge></div>
              <div><strong>Description:</strong> {product.description || "-"}</div>
              {/* Add more fields as needed */}
            </div>
          </div>
          <div className="mt-6">
            <Button onClick={() => router.back()}>Back</Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
