import { useState } from 'react';
import { ShoppingCart, Crown, Lock, Eye, Sparkles, Flame, Star } from 'lucide-react';
import { WishlistButton } from './WishlistButton';
import { Product, KeychainProduct, CaseOption } from '../../types';
import { useCartStore } from '../../stores/cartStore';
import { useAuthStore } from '../../stores/authStore';
import { Button } from '../ui/button';
import { Card, CardContent, CardFooter } from '../ui/card';
import { toast } from '../../hooks/use-toast';
import { QuickViewModal } from './QuickViewModal';

interface ProductCardProps {
  product: Product & Partial<KeychainProduct>;
}

export function ProductCard({ product }: ProductCardProps) {
  const addItem = useCartStore((state) => state.addItem);
  const user = useAuthStore((state) => state.user);
  const [selectedCase, setSelectedCase] = useState<CaseOption | undefined>(
    product.caseOptions?.[0]
  );
  const [showCaseOptions, setShowCaseOptions] = useState(false);
  const [showQuickView, setShowQuickView] = useState(false);

  const isPremiumProduct = product.description?.includes('PREMIUM EXCLUSIVE');
  const canPurchase = !isPremiumProduct || user?.isPremium;
  
  // Randomly assign badges for variety
  const badges = ['new', 'hot', 'trending', null];
  const productBadge = badges[Math.floor(Math.random() * badges.length)];
  
  const getBadge = () => {
    if (isPremiumProduct) return { icon: Sparkles, text: 'PREMIUM', class: 'from-purple-600 to-pink-600' };
    if (productBadge === 'new') return { icon: Star, text: 'NEW', class: 'from-green-600 to-emerald-600' };
    if (productBadge === 'hot') return { icon: Flame, text: 'HOT', class: 'from-orange-600 to-red-600' };
    if (productBadge === 'trending') return { icon: Sparkles, text: 'TRENDING', class: 'from-blue-600 to-cyan-600' };
    return null;
  };
  
  const badge = getBadge();

  const handleAddToCart = () => {
    if (!canPurchase) {
      toast({
        title: 'Premium Required 👑',
        description: 'Upgrade to Premium to access this exclusive product',
        variant: 'destructive',
      });
      return;
    }

    addItem(product, selectedCase);
    toast({
      title: 'Added to cart! 🎉',
      description: `${product.name} has been added to your cart.`,
    });
  };

  const finalPrice = product.price + (selectedCase?.priceModifier || 0);
  const isSticker = product.type === 'sticker';

  return (
    <>
    <Card className="group hover:shadow-xl transition-all duration-300 hover:-translate-y-1 overflow-hidden relative">
      <CardContent className="p-4 space-y-3">
        {/* Product Image */}
        <div className="relative aspect-square overflow-hidden bg-gradient-to-br from-muted/50 to-muted">
          {/* Badge */}
          {badge && (
            <div className={`absolute top-2 left-2 bg-gradient-to-r ${badge.class} text-white px-2 py-1 rounded-full text-xs font-bold shadow-lg z-10 flex items-center gap-1 animate-in slide-in-from-left`}>
              <badge.icon className="w-3 h-3" />
              {badge.text}
            </div>
          )}
          {/* Wishlist Button */}
          <div className="absolute top-2 right-2 z-10">
            <WishlistButton product={product} />
          </div>
          
          {/* Quick View Button */}
          <button
            onClick={(e) => {
              e.stopPropagation();
              setShowQuickView(true);
            }}
            className="absolute bottom-2 right-2 z-10 glass bg-white/90 hover:bg-white text-primary p-2 rounded-full shadow-lg opacity-0 group-hover:opacity-100 transition-opacity"
          >
            <Eye className="w-4 h-4" />
          </button>
          {isSticker ? (
            <div className="w-full h-full flex items-center justify-center p-3">
              <div className="relative w-full h-full rounded-full overflow-hidden border-4 border-white shadow-xl group-hover:scale-105 group-hover:rotate-2 transition-all duration-500">
                <img
                  src={product.image}
                  alt={product.name}
                  className="w-full h-full object-cover"
                />
                {/* Hover overlay */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
              </div>
            </div>
          ) : (
            <div className="relative w-full h-full">
              <img
                src={product.image}
                alt={product.name}
                className="w-full h-full object-cover group-hover:scale-110 group-hover:rotate-1 transition-all duration-500 rounded-xl"
              />
              {/* Hover overlay */}
              <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
            </div>
          )}
          {isPremiumProduct && (
            <div className="absolute top-2 right-2 bg-gradient-to-r from-purple-600 to-pink-600 text-white px-2 py-1 rounded-full text-xs font-bold shadow-lg flex items-center gap-1">
              <Crown className="w-3 h-3" />
              PREMIUM
            </div>
          )}
          {!isPremiumProduct && product.category === 'anime' && (
            <div className="absolute top-2 right-2 bg-secondary text-white px-2 py-1 rounded-full text-xs font-bold shadow-lg">
              ⭐ Anime
            </div>
          )}
        </div>

        {/* Product Info */}
        <div className="space-y-1">
          <h3 className="font-bold text-sm md:text-base line-clamp-1">{product.name}</h3>
          <p className="text-xs text-muted-foreground line-clamp-2">{product.description}</p>
        </div>

        {/* Keychain Case Options */}
        {product.type === 'keychain' && product.caseOptions && (
          <div className="space-y-2">
            <button
              onClick={() => setShowCaseOptions(!showCaseOptions)}
              className="text-xs text-primary hover:underline font-medium"
            >
              {showCaseOptions ? 'Hide' : 'Show'} Case Options
            </button>
            
            {showCaseOptions && (
              <div className="grid grid-cols-2 gap-2">
                {product.caseOptions.map((caseOption) => (
                  <button
                    key={caseOption.id}
                    onClick={() => setSelectedCase(caseOption)}
                    className={`text-xs p-2 rounded-lg border-2 transition-all ${
                      selectedCase?.id === caseOption.id
                        ? 'border-primary bg-primary/10'
                        : 'border-border hover:border-primary/50'
                    }`}
                  >
                    <div className="font-medium">{caseOption.name}</div>
                    {caseOption.priceModifier !== 0 && (
                      <div className="text-muted-foreground">
                        {caseOption.priceModifier > 0 ? '+' : ''}₹{caseOption.priceModifier}
                      </div>
                    )}
                  </button>
                ))}
              </div>
            )}
          </div>
        )}
      </CardContent>

      <CardFooter className="p-4 pt-0 flex items-center justify-between">
        <div className="space-y-1">
          <div className="text-2xl font-bold text-primary">₹{finalPrice}</div>
          {product.type === 'keychain' && selectedCase && selectedCase.priceModifier !== 0 && (
            <div className="text-xs text-muted-foreground">
              Base: ₹{product.price}
            </div>
          )}
        </div>
        
        <Button
          size="sm"
          onClick={handleAddToCart}
          className={`gap-2 ${
            isPremiumProduct && !canPurchase
              ? 'bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700'
              : ''
          }`}
          disabled={!canPurchase}
        >
          {!canPurchase ? (
            <>
              <Lock className="w-4 h-4" />
              Premium
            </>
          ) : (
            <>
              <ShoppingCart className="w-4 h-4" />
              Add
            </>
          )}
        </Button>
      </CardFooter>
    </Card>
    {showQuickView && (
      <QuickViewModal product={product} onClose={() => setShowQuickView(false)} />
    )}
    </>
  );
}
