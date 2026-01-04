import { useState, useEffect } from 'react';
import { MapPin, X, Gift, Search, Trophy } from 'lucide-react';
import { Button } from '../ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { ALL_PRODUCTS } from '../../constants/products';
import { toast } from '../../hooks/use-toast';

interface Treasure {
  id: string;
  emoji: string;
  name: string;
  hint: string;
  location: string;
  reward: { type: string; value: number };
  found: boolean;
}

const TREASURES: Treasure[] = [
  {
    id: 'treasure-1',
    emoji: '💎',
    name: 'Hidden Diamond',
    hint: 'Look where the prices are shown...',
    location: 'cart',
    reward: { type: '₹50 OFF', value: 50 },
    found: false,
  },
  {
    id: 'treasure-2',
    emoji: '🏆',
    name: 'Golden Trophy',
    hint: 'Find it where achievements shine...',
    location: 'achievements',
    reward: { type: '5 Free Stickers', value: 50 },
    found: false,
  },
  {
    id: 'treasure-3',
    emoji: '⭐',
    name: 'Lucky Star',
    hint: 'Hidden among the fun features...',
    location: 'funzone',
    reward: { type: '₹25 OFF', value: 25 },
    found: false,
  },
  {
    id: 'treasure-4',
    emoji: '🎁',
    name: 'Mystery Gift',
    hint: 'Search in the product gallery...',
    location: 'products',
    reward: { type: 'Free Keychain', value: 110 },
    found: false,
  },
  {
    id: 'treasure-5',
    emoji: '🌟',
    name: 'Shining Star',
    hint: 'Check the footer area...',
    location: 'footer',
    reward: { type: '₹75 OFF', value: 75 },
    found: false,
  },
];

export function TreasureHunt() {
  const [isOpen, setIsOpen] = useState(false);
  const [treasures, setTreasures] = useState<Treasure[]>(() => {
    const saved = localStorage.getItem('treasureHuntProgress');
    return saved ? JSON.parse(saved) : TREASURES;
  });

  const foundCount = treasures.filter(t => t.found).length;
  const totalCount = treasures.length;

  const handleTreasureFound = (treasureId: string) => {
    const updatedTreasures = treasures.map(t => 
      t.id === treasureId ? { ...t, found: true } : t
    );
    setTreasures(updatedTreasures);
    localStorage.setItem('treasureHuntProgress', JSON.stringify(updatedTreasures));

    const treasure = treasures.find(t => t.id === treasureId);
    if (treasure && !treasure.found) {
      // Save reward
      const offers = JSON.parse(localStorage.getItem('availableOffers') || '[]');
      offers.push({
        id: `treasure-${Date.now()}`,
        type: 'treasure',
        label: treasure.reward.type,
        discount: Math.round((treasure.reward.value / 100) * 100),
        expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString(),
      });
      localStorage.setItem('availableOffers', JSON.stringify(offers));

      toast({
        title: `🎉 Treasure Found: ${treasure.name}!`,
        description: `You discovered ${treasure.reward.type}! Check your offers.`,
      });

      // Check if all treasures found
      if (updatedTreasures.every(t => t.found)) {
        setTimeout(() => {
          toast({
            title: '👑 MASTER TREASURE HUNTER!',
            description: 'You found all treasures! Enjoy a special bonus: ₹200 OFF your next order!',
          });
          const bonusOffers = JSON.parse(localStorage.getItem('availableOffers') || '[]');
          bonusOffers.push({
            id: `treasure-master-${Date.now()}`,
            type: 'treasure',
            label: 'Master Hunter Bonus',
            discount: 200,
            expiresAt: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString(),
          });
          localStorage.setItem('availableOffers', JSON.stringify(bonusOffers));
        }, 1000);
      }
    }
  };

  const resetHunt = () => {
    const resetTreasures = TREASURES.map(t => ({ ...t, found: false }));
    setTreasures(resetTreasures);
    localStorage.setItem('treasureHuntProgress', JSON.stringify(resetTreasures));
    toast({
      title: '🔄 Hunt Reset!',
      description: 'New treasures are hidden. Start searching again!',
    });
  };

  // Expose global function for finding treasures (called from hidden buttons)
  useEffect(() => {
    (window as any).foundTreasure = handleTreasureFound;
    return () => {
      delete (window as any).foundTreasure;
    };
  }, [treasures]);

  return (
    <>
      <button
        onClick={() => setIsOpen(true)}
        className="fixed bottom-56 right-6 z-40 bg-gradient-to-r from-orange-500 via-red-500 to-pink-500 text-white p-4 rounded-full shadow-2xl hover:scale-110 transition-transform"
      >
        <div className="relative">
          <MapPin className="w-6 h-6" />
          {foundCount > 0 && (
            <div className="absolute -top-2 -right-2 bg-green-500 text-white text-xs w-5 h-5 rounded-full flex items-center justify-center font-bold">
              {foundCount}
            </div>
          )}
        </div>
      </button>

      {isOpen && (
        <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4">
          <Card className="w-full max-w-2xl">
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle className="flex items-center gap-2 text-2xl">
                    <MapPin className="w-6 h-6 text-orange-500" />
                    Treasure Hunt
                  </CardTitle>
                  <p className="text-sm text-muted-foreground mt-1">
                    Find hidden treasures across the site to unlock rewards! 🗺️
                  </p>
                </div>
                <Button variant="ghost" size="icon" onClick={() => setIsOpen(false)}>
                  <X className="w-5 h-5" />
                </Button>
              </div>
            </CardHeader>

            <CardContent className="space-y-6">
              {/* Progress */}
              <div className="bg-gradient-to-r from-orange-500/10 to-red-500/10 p-4 rounded-xl border-2 border-orange-500/20">
                <div className="flex items-center justify-between mb-2">
                  <span className="font-semibold">Progress</span>
                  <span className="text-2xl font-black text-primary">
                    {foundCount}/{totalCount}
                  </span>
                </div>
                <div className="h-3 bg-muted rounded-full overflow-hidden">
                  <div
                    className="h-full bg-gradient-to-r from-orange-500 to-red-500 transition-all duration-500"
                    style={{ width: `${(foundCount / totalCount) * 100}%` }}
                  />
                </div>
              </div>

              {/* Treasure List */}
              <div className="space-y-3">
                <h3 className="font-bold text-lg flex items-center gap-2">
                  <Search className="w-5 h-5" />
                  Treasures to Find
                </h3>
                {treasures.map((treasure) => (
                  <div
                    key={treasure.id}
                    className={`p-4 rounded-xl border-2 transition-all ${
                      treasure.found
                        ? 'border-green-500 bg-green-50 dark:bg-green-950'
                        : 'border-muted bg-muted/30'
                    }`}
                  >
                    <div className="flex items-center gap-4">
                      <div className={`text-4xl ${treasure.found ? '' : 'grayscale opacity-50'}`}>
                        {treasure.found ? treasure.emoji : '❓'}
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center gap-2">
                          <h4 className="font-bold">
                            {treasure.found ? treasure.name : '???'}
                          </h4>
                          {treasure.found && (
                            <span className="text-xs bg-green-500 text-white px-2 py-0.5 rounded-full font-bold">
                              FOUND ✓
                            </span>
                          )}
                        </div>
                        <p className="text-sm text-muted-foreground mt-1">
                          {treasure.found ? `Reward: ${treasure.reward.type}` : treasure.hint}
                        </p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              {/* Master Reward */}
              {foundCount === totalCount && (
                <div className="bg-gradient-to-r from-yellow-500 to-orange-500 p-6 rounded-2xl text-white text-center space-y-2 animate-pulse">
                  <Trophy className="w-12 h-12 mx-auto" />
                  <p className="text-2xl font-black">MASTER HUNTER!</p>
                  <p className="text-sm opacity-90">You found all treasures! Bonus unlocked!</p>
                </div>
              )}

              {/* Hidden Treasures Guide */}
              <div className="bg-blue-50 dark:bg-blue-950 p-4 rounded-xl border border-blue-200 dark:border-blue-800">
                <p className="text-xs text-blue-700 dark:text-blue-400">
                  💡 <strong>How to play:</strong> Explore different pages and sections of the site. Look for small hidden treasure icons {foundCount > 0 && '(like the one you already found!)'} and click them to collect rewards. Use the hints above to guide your search!
                </p>
              </div>

              {/* Reset Button */}
              {foundCount > 0 && (
                <Button
                  onClick={resetHunt}
                  variant="outline"
                  className="w-full"
                >
                  🔄 Reset Hunt & Find Again
                </Button>
              )}
            </CardContent>
          </Card>
        </div>
      )}
    </>
  );
}

// Hidden Treasure Buttons (to be placed around the site)
export function HiddenTreasure({ treasureId }: { treasureId: string }) {
  const [found, setFound] = useState(() => {
    const saved = localStorage.getItem('treasureHuntProgress');
    if (saved) {
      const treasures = JSON.parse(saved);
      const treasure = treasures.find((t: Treasure) => t.id === treasureId);
      return treasure?.found || false;
    }
    return false;
  });

  const handleClick = () => {
    if (!found) {
      (window as any).foundTreasure?.(treasureId);
      setFound(true);
    }
  };

  if (found) return null;

  return (
    <button
      onClick={handleClick}
      className="inline-flex items-center justify-center w-8 h-8 text-2xl hover:scale-150 transition-transform cursor-pointer animate-bounce"
      title="Click to collect treasure!"
    >
      🎁
    </button>
  );
}
