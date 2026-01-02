import { useState, useEffect } from 'react';
import { X, Lock, CheckCircle2, Award } from 'lucide-react';
import { Button } from '../ui/button';
import { ALL_PRODUCTS } from '../../constants/products';
import { useCartStore } from '../../stores/cartStore';

interface CollectionAlbumProps {
  onClose: () => void;
}

export function CollectionAlbum({ onClose }: CollectionAlbumProps) {
  const [collectedIds, setCollectedIds] = useState<Set<string>>(new Set());
  const cartHistory = useCartStore((state) => state.items);

  useEffect(() => {
    // Load collection from localStorage
    const saved = localStorage.getItem('stickerCollection');
    if (saved) {
      setCollectedIds(new Set(JSON.parse(saved)));
    }

    // Add items from current cart to collection (simulating purchase)
    const newCollected = new Set(collectedIds);
    cartHistory.forEach((item) => {
      newCollected.add(item.product.id);
    });
    
    if (newCollected.size > collectedIds.size) {
      setCollectedIds(newCollected);
      localStorage.setItem('stickerCollection', JSON.stringify(Array.from(newCollected)));
    }
  }, [cartHistory]);

  const totalItems = ALL_PRODUCTS.length;
  const collectedCount = collectedIds.size;
  const completionPercentage = Math.round((collectedCount / totalItems) * 100);

  const getTier = () => {
    if (completionPercentage >= 100) return { name: 'Master Collector', icon: '🏆', color: 'from-yellow-400 to-orange-400' };
    if (completionPercentage >= 75) return { name: 'Expert Collector', icon: '💎', color: 'from-purple-400 to-pink-400' };
    if (completionPercentage >= 50) return { name: 'Avid Collector', icon: '⭐', color: 'from-blue-400 to-cyan-400' };
    if (completionPercentage >= 25) return { name: 'Budding Collector', icon: '🌱', color: 'from-green-400 to-emerald-400' };
    return { name: 'Beginner', icon: '🔰', color: 'from-gray-400 to-gray-500' };
  };

  const tier = getTier();

  return (
    <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4 animate-in fade-in">
      <div className="glass bg-card rounded-2xl max-w-4xl w-full max-h-[90vh] overflow-y-auto p-6 animate-in zoom-in-95">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-2">
            <Award className="w-6 h-6 text-primary" />
            <h2 className="text-2xl font-bold">My Collection</h2>
          </div>
          <button onClick={onClose} className="hover:bg-muted rounded-full p-2">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Stats */}
        <div className="mb-8 space-y-4">
          <div className={`bg-gradient-to-r ${tier.color} text-white p-6 rounded-2xl text-center`}>
            <div className="text-5xl mb-2">{tier.icon}</div>
            <h3 className="text-2xl font-bold mb-1">{tier.name}</h3>
            <p className="text-white/90">You've collected {collectedCount} out of {totalItems} items!</p>
          </div>

          <div className="space-y-2">
            <div className="flex justify-between text-sm">
              <span className="font-medium">Collection Progress</span>
              <span className="text-primary font-bold">{completionPercentage}%</span>
            </div>
            <div className="h-4 bg-muted rounded-full overflow-hidden">
              <div
                className="h-full bg-gradient-to-r from-primary to-purple-600 transition-all duration-500"
                style={{ width: `${completionPercentage}%` }}
              />
            </div>
          </div>
        </div>

        {/* Collection Grid */}
        <div className="grid grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-3">
          {ALL_PRODUCTS.map((product) => {
            const isCollected = collectedIds.has(product.id);
            return (
              <div
                key={product.id}
                className={`relative aspect-square rounded-xl overflow-hidden border-2 transition-all ${
                  isCollected
                    ? 'border-primary bg-primary/5'
                    : 'border-border bg-muted/30 grayscale opacity-50'
                }`}
              >
                <img
                  src={product.image}
                  alt={product.name}
                  className="w-full h-full object-cover"
                />
                {isCollected ? (
                  <div className="absolute top-1 right-1 bg-green-500 rounded-full p-1">
                    <CheckCircle2 className="w-4 h-4 text-white" />
                  </div>
                ) : (
                  <div className="absolute inset-0 flex items-center justify-center bg-black/60">
                    <Lock className="w-6 h-6 text-white" />
                  </div>
                )}
                <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 to-transparent p-2">
                  <p className="text-white text-[10px] font-medium truncate">{product.name}</p>
                </div>
              </div>
            );
          })}
        </div>

        <div className="mt-6">
          <Button onClick={onClose} className="w-full">
            Close Collection
          </Button>
        </div>
      </div>
    </div>
  );
}
