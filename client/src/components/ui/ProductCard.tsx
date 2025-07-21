import { motion } from "framer-motion";
import { Heart, Eye, ShoppingCart } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { formatPrice } from "@/utils/helpers";
import { useCart } from "@/hooks/useCart";
import { useToast } from "@/hooks/use-toast";
import type { Product } from "@/types";

interface ProductCardProps {
  product: Product;
  className?: string;
  onQuickView?: (product: Product) => void;
}

export const ProductCard = ({ product, className = "", onQuickView }: ProductCardProps) => {
  const { addToCart, isAddingToCart } = useCart();
  const { toast } = useToast();

  const handleAddToCart = () => {
    addToCart({
      productId: product.id,
      quantity: 1,
    });

    toast({
      title: "কার্টে যুক্ত হয়েছে",
      description: `${product.namebn} সফলভাবে কার্টে যুক্ত হয়েছে।`,
    });
  };

  const handleQuickView = () => {
    onQuickView?.(product);
  };

  return (
    <motion.div
      whileHover={{ y: -5 }}
      className={`glass-effect rounded-xl overflow-hidden group ${className}`}
    >
      <div className="relative">
        <img
          src={product.images[0] || "https://images.unsplash.com/photo-1542291026-7eec264c27ff"}
          alt={product.name}
          className="w-full h-48 object-cover"
          loading="lazy"
        />
        
        {product.featured && (
          <Badge className="absolute top-2 left-2 bg-green-500 text-white">
            Bestseller
          </Badge>
        )}
        
        {product.originalPrice && (
          <Badge className="absolute top-2 right-2 bg-red-500 text-white">
            Sale
          </Badge>
        )}

        <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
          <Button
            size="sm"
            variant="secondary"
            onClick={handleQuickView}
            className="glass-effect"
          >
            <Eye className="h-4 w-4" />
          </Button>
          <Button
            size="sm"
            variant="secondary"
            className="glass-effect"
          >
            <Heart className="h-4 w-4" />
          </Button>
        </div>
      </div>

      <div className="p-4">
        <h3 className="font-semibold mb-1 text-white">{product.name}</h3>
        <p className="text-sm text-gray-300 mb-2">{product.namebn}</p>
        
        <div className="flex items-center gap-2 mb-2">
          <span className="text-2xl font-bold text-gold">
            {formatPrice(product.price)}
          </span>
          {product.originalPrice && (
            <span className="text-sm line-through text-gray-400">
              {formatPrice(product.originalPrice)}
            </span>
          )}
        </div>

        <p className="text-sm text-gray-300 mb-4 line-clamp-2">
          {product.description}
        </p>

        <div className="flex gap-2">
          <Button
            onClick={handleAddToCart}
            disabled={!product.inStock || isAddingToCart}
            className="flex-1 bg-gradient-to-r from-yellow-400 to-yellow-600 hover:from-yellow-500 hover:to-yellow-700 text-black font-semibold"
          >
            {isAddingToCart ? (
              "Adding..."
            ) : !product.inStock ? (
              "Stock Out"
            ) : (
              <>
                <ShoppingCart className="h-4 w-4 mr-2" />
                Add to Cart
              </>
            )}
          </Button>
          
          <Button
            variant="outline"
            size="sm"
            onClick={handleQuickView}
            className="glass-effect border-gold/30 text-gold hover:bg-gold hover:text-black"
          >
            <Eye className="h-4 w-4" />
          </Button>
        </div>
      </div>
    </motion.div>
  );
};
