import { useState } from 'react';
import { Package, X, Sparkles, ShoppingCart } from 'lucide-react';
import { Button } from '../ui/button';
import { ALL_PRODUCTS } from '../../constants/products';
import { Product } from '../../types';
import { useCartStore } from '../../stores/cartStore';
import { toast } from '../../hooks/use-toast';

const MYSTERY_BOXES = [
  {
    id: 'mystery-basic',
    name: '🎁 Basic Mystery Box',
    description: '3 random stickers',
    price: 25,
    itemCount: 3,
    image: 'https://images.unsplash.com/photo-1513885535751-8b9238bd345a?w=400&h=400&fit=crop',
  },
  {
    id: 'mystery-premium',
    name: '✨ Premium Mystery Box',
    description: '5 random stickers + 1 keychain',
    price: 60,
    itemCount: 6,
    image: 'https://images.unsplash.com/photo-1549465220-1a8b9238cd48?w=400&h=400&fit=crop',
  },
  {
    id: 'mystery-mega',
    name: '🌟 Mega Mystery Box',
    description: '10 random items (mix of stickers & keychains)',
    price: 100,
    itemCount: 10,
    image: 'https://images.unsplash.com/photo-1607083206968-13611e3d76db?w=400&h=400&fit=crop',
  },
];

interface MysteryBoxProps {
  onClose: () => void;
}

export function MysteryBox({ onClose }: MysteryBoxProps) {
  const [selectedBox, setSelectedBox] = useState<typeof MYSTERY_BOXES[0] | null>(null);
  const [revealedItems, setRevealedItems] = useState<Product[]>([]);
  const [isRevealing, setIsRevealing] = useState(false);
  const addToCart = useCartStore((state) => state.addItem);

  const handlePurchase = (box: typeof MYSTERY_BOXES[0]) => {
    setSelectedBox(box);
    setIsRevealing(true);

    // Simulate opening animation
    setTimeout(() => {
      const randomItems: Product[] = [];
      const availableProducts = [...ALL_PRODUCTS];

      for (let i = 0; i < box.itemCount; i++) {
        const randomIndex = Math.floor(Math.random() * availableProducts.length);
        randomItems.push(availableProducts[randomIndex]);
        availableProducts.splice(randomIndex, 1);
      }

      setRevealedItems(randomItems);
      setIsRevealing(false);
    }, 2000);
  };

  const handleAddAllToCart = () => {
    revealedItems.forEach((item) => addToCart(item));
    toast({
      title: '🎉 Mystery box added to cart!',
      description: `${revealedItems.length} items added`,
    });
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4 animate-in fade-in">
      <div className="glass bg-card rounded-2xl max-w-4xl w-full max-h-[90vh] overflow-y-auto p-6 animate-in zoom-in-95">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-2">
            <Package className="w-6 h-6 text-primary" />
            <h2 className="text-2xl font-bold">Mystery Boxes</h2>
          </div>
          <button onClick={onClose} className="hover:bg-muted rounded-full p-2">
            <X className="w-5 h-5" />
          </button>
        </div>

        {isRevealing ? (
          <div className="text-center py-20 space-y-6">
            <div className="relative inline-block">
              <Package className="w-32 h-32 text-primary animate-bounce" />
              <Sparkles className="w-12 h-12 text-yellow-400 absolute -top-2 -right-2 animate-spin" />
              <Sparkles className="w-8 h-8 text-pink-400 absolute -bottom-2 -left-2 animate-ping" />
            </div>
            <h3 className="text-2xl font-bold animate-pulse">Opening your mystery box...</h3>
            <p className="text-muted-foreground">Get ready for some surprises!</p>
          </div>
        ) : revealedItems.length > 0 ? (
          <div className="space-y-6">
            <div className="text-center space-y-2">
              <h3 className="text-2xl font-bold">🎉 Your Mystery Items!</h3>
              <p className="text-muted-foreground">You got {revealedItems.length} awesome items!</p>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
              {revealedItems.map((item, index) => (
                <div
                  key={`${item.id}-${index}`}
                  className="group bg-gradient-to-br from-primary/10 to-purple-500/10 rounded-xl p-3 border-2 border-primary/20 animate-in zoom-in-95"
                  style={{ animationDelay: `${index * 100}ms` }}
                >
                  <div className="aspect-square rounded-lg overflow-hidden mb-2 bg-white">
                    <img
                      src={item.image}
                      alt={item.name}
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <p className="text-xs font-medium text-center line-clamp-2">{item.name}</p>
                  <p className="text-primary text-center font-bold text-sm">₹{item.price}</p>
                </div>
              ))}
            </div>

            <div className="flex gap-3">
              <Button onClick={handleAddAllToCart} className="flex-1 gap-2">
                <ShoppingCart className="w-4 h-4" />
                Add All to Cart
              </Button>
              <Button onClick={onClose} variant="outline" className="flex-1">
                Close
              </Button>
            </div>
          </div>
        ) : (
          <div className="grid md:grid-cols-3 gap-6">
            {MYSTERY_BOXES.map((box) => (
              <div
                key={box.id}
                className="group hover:scale-105 transition-all duration-300"
              >
                <div className="bg-gradient-to-br from-muted/50 to-muted rounded-2xl overflow-hidden border-2 border-border hover:border-primary transition-colors">
                  <div className="relative aspect-square">
                    <img
                      src={box.image}
                      alt={box.name}
                      className="w-full h-full object-cover"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
                    <div className="absolute bottom-3 left-3 right-3 text-white">
                      <h3 className="font-bold text-lg mb-1">{box.name}</h3>
                      <p className="text-sm opacity-90">{box.description}</p>
                    </div>
                  </div>
                  <div className="p-4 space-y-3">
                    <div className="flex items-center justify-between">
                      <span className="text-muted-foreground text-sm">Mystery items:</span>
                      <span className="font-bold">{box.itemCount} items</span>
                    </div>
                    <div className="text-center">
                      <div className="text-3xl font-bold text-primary mb-2">₹{box.price}</div>
                      <Button
                        onClick={() => handlePurchase(box)}
                        className="w-full gap-2"
                      >
                        <Sparkles className="w-4 h-4" />
                        Open Box
                      </Button>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
