import { X, ShoppingCart, Heart, Share2, ZoomIn } from 'lucide-react';
import { useState } from 'react';
import { Product, KeychainProduct } from '../../types';
import { useCartStore } from '../../stores/cartStore';
import { useWishlistStore } from '../../stores/wishlistStore';
import { useAuthStore } from '../../stores/authStore';
import { toast } from '../../hooks/use-toast';
import { Button } from '../ui/button';
import { Badge } from '../ui/badge';

interface QuickViewModalProps {
  product: Product & Partial<KeychainProduct>;
  onClose: () => void;
}

export function QuickViewModal({ product, onClose }: QuickViewModalProps) {
  const [selectedCase, setSelectedCase] = useState(product.caseOptions?.[0]);
  const [isZoomed, setIsZoomed] = useState(false);
  const addToCart = useCartStore((state) => state.addItem);
  const addToWishlist = useWishlistStore((state) => state.addItem);
  const removeFromWishlist = useWishlistStore((state) => state.removeItem);
  const wishlistItems = useWishlistStore((state) => state.items);
  const user = useAuthStore((state) => state.user);

  const isInWishlist = wishlistItems.some(item => item.id === product.id);
  const isPremium = product.description?.includes('PREMIUM EXCLUSIVE');

  const handleAddToCart = () => {
    if (isPremium && !user?.isPremium) {
      toast({
        title: 'Premium Required',
        description: 'Subscribe to Premium to access exclusive products',
        variant: 'destructive',
      });
      return;
    }

    addToCart(product, selectedCase);
    toast({
      title: 'Added to cart! 🎉',
      description: `${product.name} has been added to your cart`,
    });
    onClose();
  };

  const handleWishlist = () => {
    if (isInWishlist) {
      removeFromWishlist(product.id);
      toast({ title: 'Removed from wishlist' });
    } else {
      addToWishlist(product);
      toast({ title: 'Added to wishlist! ❤️' });
    }
  };

  const handleShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: product.name,
          text: `Check out ${product.name} on StickerCraft!`,
          url: window.location.href,
        });
      } catch (err) {
        console.log('Share cancelled');
      }
    } else {
      navigator.clipboard.writeText(window.location.href);
      toast({ title: 'Link copied to clipboard!' });
    }
  };

  return (
    <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4 animate-in fade-in">
      <div className="glass bg-card rounded-2xl max-w-4xl w-full max-h-[90vh] overflow-y-auto animate-in zoom-in-95">
        <div className="sticky top-0 bg-gradient-to-r from-primary to-purple-600 text-white p-4 flex items-center justify-between z-10">
          <h2 className="text-xl font-bold">Quick View</h2>
          <button
            onClick={onClose}
            className="hover:bg-white/20 rounded-full p-2 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="p-6 grid md:grid-cols-2 gap-8">
          {/* Image Section */}
          <div className="space-y-4">
            <div
              className="relative aspect-square bg-gradient-to-br from-muted/50 to-muted rounded-2xl overflow-hidden cursor-zoom-in"
              onClick={() => setIsZoomed(!isZoomed)}
            >
              <img
                src={product.image}
                alt={product.name}
                className={`w-full h-full object-cover transition-transform duration-300 ${
                  isZoomed ? 'scale-150' : 'scale-100'
                }`}
              />
              <div className="absolute top-3 right-3 bg-black/50 text-white px-2 py-1 rounded-full text-xs flex items-center gap-1">
                <ZoomIn className="w-3 h-3" />
                {isZoomed ? 'Click to zoom out' : 'Click to zoom in'}
              </div>
              {isPremium && (
                <Badge className="absolute top-3 left-3 bg-gradient-to-r from-purple-600 to-pink-600 text-white border-0">
                  ✨ PREMIUM
                </Badge>
              )}
            </div>

            {/* Action Buttons */}
            <div className="flex gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={handleWishlist}
                className="flex-1"
              >
                <Heart className={`w-4 h-4 mr-2 ${isInWishlist ? 'fill-red-500 text-red-500' : ''}`} />
                {isInWishlist ? 'In Wishlist' : 'Add to Wishlist'}
              </Button>
              <Button variant="outline" size="sm" onClick={handleShare}>
                <Share2 className="w-4 h-4 mr-2" />
                Share
              </Button>
            </div>
          </div>

          {/* Details Section */}
          <div className="space-y-6">
            <div>
              <h1 className="text-3xl font-bold mb-2">{product.name}</h1>
              <p className="text-muted-foreground">{product.description}</p>
            </div>

            <div className="flex items-baseline gap-3">
              <span className="text-4xl font-bold text-primary">₹{product.price}</span>
              <Badge variant="outline" className="capitalize">
                {product.type}
              </Badge>
              <Badge variant="secondary" className="capitalize">
                {product.category}
              </Badge>
            </div>

            {/* Keychain Case Options */}
            {product.caseOptions && product.caseOptions.length > 0 && (
              <div className="space-y-3">
                <label className="text-sm font-medium">Select Case:</label>
                <div className="grid grid-cols-2 gap-2">
                  {product.caseOptions.map((caseOption) => (
                    <button
                      key={caseOption.id}
                      onClick={() => setSelectedCase(caseOption)}
                      className={`p-3 rounded-lg border-2 transition-all text-left ${
                        selectedCase?.id === caseOption.id
                          ? 'border-primary bg-primary/10'
                          : 'border-border hover:border-primary/50'
                      }`}
                    >
                      <div className="flex items-center gap-2 mb-1">
                        <div
                          className="w-4 h-4 rounded-full border"
                          style={{
                            backgroundColor: caseOption.color === 'transparent' ? '#fff' : caseOption.color,
                            border: caseOption.color === 'transparent' ? '1px solid #ccc' : 'none',
                          }}
                        />
                        <span className="text-sm font-medium">{caseOption.name}</span>
                      </div>
                      <p className="text-xs text-muted-foreground">
                        {caseOption.priceModifier > 0 ? '+' : ''}₹{caseOption.priceModifier}
                      </p>
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Product Features */}
            <div className="space-y-2 bg-muted/30 rounded-lg p-4">
              <h3 className="font-semibold text-sm">Product Features:</h3>
              <ul className="space-y-1 text-sm text-muted-foreground">
                <li>✓ High-quality materials</li>
                <li>✓ Vibrant, fade-resistant colors</li>
                <li>✓ Perfect for gifts</li>
                {isPremium && <li>✓ Exclusive premium design</li>}
                {user?.isPremium && <li>✓ Free express shipping for Premium members</li>}
              </ul>
            </div>

            <Button onClick={handleAddToCart} size="lg" className="w-full gap-2">
              <ShoppingCart className="w-5 h-5" />
              Add to Cart - ₹{product.price + (selectedCase?.priceModifier || 0)}
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
