import Link from "next/link";
import { ShoppingBag, Star } from "lucide-react";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Product } from "@/app/types/product";
import { dummyTailors } from "@/app/lib/dummyData";

interface ProductCardProps {
  product: Product;
}

export default function ProductCard({ product }: ProductCardProps) {
  // Find tailor for this product
  const tailor = dummyTailors.find((t) => t.id === product.tailorId);

  return (
    <Card className="h-full flex flex-col hover:shadow-lg transition-shadow">
      <CardContent className="p-0">
        {/* Image Placeholder */}
        <div className="relative w-full aspect-[4/3] bg-slate-100 flex items-center justify-center overflow-hidden">
          {product.featured && (
            <Badge className="absolute top-3 right-3 bg-yellow-500 text-white hover:bg-yellow-600">
              Featured
            </Badge>
          )}
          <ShoppingBag className="w-16 h-16 text-slate-300" />
        </div>

        {/* Content */}
        <div className="p-4">
          {/* Category */}
          <Badge variant="secondary" className="mb-2 text-xs">
            {product.category}
          </Badge>

          {/* Product Name */}
          <h3 className="text-lg font-semibold text-slate-900 mb-2 line-clamp-2">
            {product.name}
          </h3>

          {/* Description */}
          <p className="text-sm text-slate-600 mb-3 line-clamp-2">
            {product.description}
          </p>

          {/* Tailor Info */}
          {tailor && (
            <div className="flex items-center gap-2 text-sm text-slate-600 mb-3">
              <div className="w-6 h-6 rounded-full bg-slate-200 flex items-center justify-center flex-shrink-0">
                <span className="text-xs font-bold text-slate-600">
                  {tailor.name.charAt(0)}
                </span>
              </div>
              <span className="truncate">{tailor.name}</span>
              {tailor.isVerified && (
                <Star className="w-3 h-3 fill-blue-600 text-blue-600 flex-shrink-0" />
              )}
            </div>
          )}

          {/* Price */}
          <div className="text-2xl font-bold text-slate-900">
            €{product.price}
          </div>
        </div>
      </CardContent>

      <CardFooter className="p-4 pt-0 mt-auto">
        <Button asChild className="w-full h-11 touch-manipulation">
          <Link href={`/products/${product.id}`}>Details ansehen</Link>
        </Button>
      </CardFooter>
    </Card>
  );
}
