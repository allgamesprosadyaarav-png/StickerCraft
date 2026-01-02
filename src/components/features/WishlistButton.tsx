import { Heart } from 'lucide-react';
import { Product } from '../../types';
import { useWishlistStore } from '../../stores/wishlistStore';
import { toast } from '../../hooks/use-toast';
import { Button } from '../ui/button';

interface WishlistButtonProps {
  product: Product;
  size?: 'sm' | 'default' | 'lg';
  variant?: 'default' | 'ghost' | 'outline';
}

export function WishlistButton({ product, size = 'sm', variant = 'ghost' }: WishlistButtonProps) {
  const { addItem, removeItem, isInWishlist } = useWishlistStore();
  const inWishlist = isInWishlist(product.id);

  const handleToggle = (e: React.MouseEvent) => {
    e.stopPropagation();
    
    if (inWishlist) {
      removeItem(product.id);
      toast({
        title: 'Removed from wishlist',
        description: `${product.name} has been removed from your wishlist`,
      });
    } else {
      addItem(product);
      toast({
        title: 'Added to wishlist! ❤️',
        description: `${product.name} has been added to your wishlist`,
      });
    }
  };

  return (
    <Button
      variant={variant}
      size={size}
      onClick={handleToggle}
      className={`${inWishlist ? 'text-red-500 hover:text-red-600' : ''}`}
    >
      <Heart
        className={`w-4 h-4 ${inWishlist ? 'fill-current' : ''}`}
      />
    </Button>
  );
}
