
import { useState, useEffect } from 'react';
import { X, Clock, Flame, Zap, ShoppingCart } from 'lucide-react';
import { Button } from '../ui/button';
import { useCartStore } from '../../stores/cartStore';
import { toast } from '../../hooks/use-toast';

interface LimitedDrop {
  id: string;
  name: string;
  image: string;
  originalPrice: number;
  dropPrice: number;
  type: 'sticker' | 'keychain';
  category: 'anime' | 'gaming' | 'special';
  endsAt: Date;
  stockLeft: number;
  maxStock: number;
}

export function LimitedEditionDrops({ onClose }: { onClose: () => void }) {
  const addToCart = useCartStore((state) => state.addItem);
  const [drops, setDrops] = useState<LimitedDrop[]>([]);
  const [timeLeft, setTimeLeft] = useState<{ [key: string]: string }>({});

  useEffect(() => {
    loadDrops();
    const interval = setInterval(updateTimers, 1000);
    return () => clearInterval(interval);
  }, []);

  const loadDrops = () => {
    // Simulated limited drops - in real app, these would come from backend
    const currentDrops: LimitedDrop[] = [
      {
        id: 'drop-gojo-1',
        name: 'Gojo Satoru Special Edition',
        image: 'https://cdn-ai.onspace.ai/onspace/files/XSoZFQmbtsaZuQoV7cMkp2/pasted-image-1765102302804-1.png',
        originalPrice: 35,
        dropPrice: 20,
        type: 'sticker',
        category: 'anime',
        endsAt: new Date(Date.now() + 2 * 60 * 60 * 1000), // 2 hours
        stockLeft: 15,
        maxStock: 50,
      },
      {
        id: 'drop-minecraft-2',
        name: 'Diamond Sword Ultra Rare',
        image: 'https://cdn-ai.onspace.ai/onspace/files/AHrH4crsewMdyoh4uehNmu/pasted-image-1765118037706-1.png',
        originalPrice: 30,
        dropPrice: 18,
        type: 'sticker',
        category: 'gaming',
        endsAt: new Date(Date.now() + 4 * 60 * 60 * 1000), // 4 hours
        stockLeft: 8,
        maxStock: 30,
      },
      {
        id: 'drop-naruto-keychain',
        name: 'Naruto Gold Keychain',
        image: 'https://cdn-ai.onspace.ai/onspace/files/nxMYRmfojssin5L8EbPsrd/pasted-image-1765102288304-0.png',
        originalPrice: 150,
        dropPrice: 99,
        type: 'keychain',
        category: 'anime',
        endsAt: new Date(Date.now() + 6 * 60 * 60 * 1000), // 6 hours
        stockLeft: 5,
        maxStock: 20,
      },
    ];

    setDrops(currentDrops);
  };

  const updateTimers = () => {
    const newTimeLeft: { [key: string]: string } = {};
    drops.forEach((drop) => {
      const now = new Date().getTime();
      const end = drop.endsAt.getTime();
      const diff = end - now;

      if (diff > 0) {
        const hours = Math.floor(diff / (1000 * 60 * 60));
        const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
        const seconds = Math.floor((diff % (1000 * 60)) / 1000);
        newTimeLeft[drop.id] = `${hours}h ${minutes}m ${seconds}s`;
      } else {
        newTimeLeft[drop.id] = 'ENDED';
      }
    });
    setTimeLeft(newTimeLeft);
  };

  const handleBuyDrop = (drop: LimitedDrop) => {
    if (drop.stockLeft <= 0) {
      toast({
        title: 'Out of Stock',
        description: 'This limited edition item is sold out!',
        variant: 'destructive',
      });
      return;
    }

    addToCart({
      id: drop.id,
      name: drop.name + ' (Limited Edition)',
      type: drop.type,
      category: drop.category,
      price: drop.dropPrice,
      image: drop.image,
      description: 'Limited Edition Drop',
    });

    // Decrease stock (in real app, this would be server-side)
    setDrops(drops.map(d => 
      d.id === drop.id ? { ...d, stockLeft: d.stockLeft - 1 } : d
    ));

    toast({
      title: '🔥 Limited Edition Added!',
      description: `${drop.name} added to cart at drop price!`,
    });
  };

  const activeDrops = drops.filter(d => timeLeft[d.id] !== 'ENDED');

  return (
    <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 overflow-y-auto animate-in fade-in">
      <div className="min-h-screen flex items-center justify-center p-4">
        <div className="glass bg-card rounded-3xl max-w-5xl w-full p-6 animate-in zoom-in-95">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-3">
              <div className="relative">
                <div className="w-14 h-14 bg-gradient-to-br from-red-500 to-orange-500 rounded-2xl flex items-center justify-center animate-pulse">
                  <Flame className="w-8 h-8 text-white" />
                </div>
                <div className="absolute -top-1 -right-1 w-6 h-6 bg-yellow-400 rounded-full flex items-center justify-center text-xs font-black">
                  {activeDrops.length}
                </div>
              </div>
              <div>
                <h2 className="text-3xl font-bold">Limited Edition Drops</h2>
                <p className="text-sm text-muted-foreground">Exclusive items • Limited time only</p>
              </div>
            </div>
            <button onClick={onClose} className="hover:bg-muted rounded-full p-2">
              <X className="w-6 h-6" />
            </button>
          </div>

          {activeDrops.length === 0 ? (
            <div className="text-center py-12">
              <Flame className="w-16 h-16 mx-auto mb-4 text-muted-foreground" />
              <h3 className="text-2xl font-bold mb-2">No Active Drops</h3>
              <p className="text-muted-foreground">Check back soon for new limited editions!</p>
            </div>
          ) : (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {activeDrops.map((drop) => {
                const stockPercentage = (drop.stockLeft / drop.maxStock) * 100;
                const isLowStock = stockPercentage < 30;

                return (
                  <div
                    key={drop.id}
                    className="relative overflow-hidden rounded-2xl border-2 border-primary bg-gradient-to-br from-primary/5 to-purple-500/5 group hover:scale-105 transition-transform"
                  >
                    {/* Animated glow effect */}
                    <div className="absolute inset-0 bg-gradient-to-r from-red-500/20 to-orange-500/20 blur-2xl group-hover:blur-3xl transition-all" />
                    
                    {/* Badge */}
                    <div className="absolute top-3 left-3 z-10 bg-gradient-to-r from-red-500 to-orange-500 text-white px-3 py-1 rounded-full text-xs font-bold flex items-center gap-1 shadow-lg">
                      <Zap className="w-3 h-3" />
                      LIMITED
                    </div>

                    <div className="relative p-6 space-y-4">
                      {/* Image */}
                      <div className="aspect-square bg-white rounded-xl overflow-hidden border-2 border-white">
                        <img
                          src={drop.image}
                          alt={drop.name}
                          className="w-full h-full object-cover group-hover:scale-110 transition-transform"
                        />
                      </div>

                      {/* Info */}
                      <div className="space-y-3">
                        <h3 className="font-bold text-lg">{drop.name}</h3>

                        {/* Timer */}
                        <div className="bg-red-500/20 text-red-600 dark:text-red-400 px-3 py-2 rounded-lg flex items-center justify-center gap-2 font-mono font-bold">
                          <Clock className="w-4 h-4 animate-pulse" />
                          {timeLeft[drop.id] || 'Calculating...'}
                        </div>

                        {/* Stock */}
                        <div className="space-y-1">
                          <div className="flex justify-between text-xs">
                            <span className={isLowStock ? 'text-red-500 font-semibold' : 'text-muted-foreground'}>
                              {isLowStock && '🔥 '} {drop.stockLeft} left
                            </span>
                            <span className="text-muted-foreground">{drop.maxStock} total</span>
                          </div>
                          <div className="bg-muted rounded-full h-2 overflow-hidden">
                            <div
                              className={`h-full transition-all duration-500 ${
                                isLowStock
                                  ? 'bg-gradient-to-r from-red-500 to-orange-500 animate-pulse'
                                  : 'bg-gradient-to-r from-green-400 to-emerald-400'
                              }`}
                              style={{ width: `${stockPercentage}%` }}
                            />
                          </div>
                        </div>

                        {/* Price */}
                        <div className="flex items-center justify-between">
                          <div>
                            <div className="text-sm text-muted-foreground line-through">
                              ₹{drop.originalPrice}
                            </div>
                            <div className="text-3xl font-black text-primary">
                              ₹{drop.dropPrice}
                            </div>
                            <div className="text-xs text-green-600 dark:text-green-400 font-semibold">
                              Save ₹{drop.originalPrice - drop.dropPrice}!
                            </div>
                          </div>

                          <Button
                            onClick={() => handleBuyDrop(drop)}
                            disabled={drop.stockLeft <= 0}
                            className="bg-gradient-to-r from-red-500 to-orange-500 hover:from-red-600 hover:to-orange-600"
                            size="lg"
                          >
                            <ShoppingCart className="w-4 h-4 mr-2" />
                            {drop.stockLeft <= 0 ? 'Sold Out' : 'Buy Now'}
                          </Button>
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}

          <div className="mt-6 text-center bg-gradient-to-r from-red-500/10 to-orange-500/10 p-4 rounded-xl border border-red-500/20">
            <p className="text-sm text-muted-foreground">
              💡 <strong>Tip:</strong> Limited editions sell out fast! Grab them before they're gone forever.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
