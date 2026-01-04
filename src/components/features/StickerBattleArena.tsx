import { useState, useEffect } from 'react';
import { Swords, X, Trophy, TrendingUp, Users } from 'lucide-react';
import { Button } from '../ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { ALL_PRODUCTS } from '../../constants/products';
import { toast } from '../../hooks/use-toast';

interface BattleStats {
  productId: string;
  wins: number;
  losses: number;
  rating: number;
}

export function StickerBattleArena() {
  const [isOpen, setIsOpen] = useState(false);
  const [currentBattle, setCurrentBattle] = useState<[any, any] | null>(null);
  const [battleStats, setBattleStats] = useState<BattleStats[]>([]);
  const [showLeaderboard, setShowLeaderboard] = useState(false);

  useEffect(() => {
    // Load battle stats from localStorage
    const savedStats = localStorage.getItem('stickerBattleStats');
    if (savedStats) {
      setBattleStats(JSON.parse(savedStats));
    } else {
      // Initialize stats for all products
      const initialStats = ALL_PRODUCTS.filter(p => p.type === 'sticker').map(p => ({
        productId: p.id,
        wins: 0,
        losses: 0,
        rating: 1500, // Starting ELO rating
      }));
      setBattleStats(initialStats);
    }
  }, []);

  const startNewBattle = () => {
    const stickers = ALL_PRODUCTS.filter(p => p.type === 'sticker');
    const shuffled = [...stickers].sort(() => Math.random() - 0.5);
    setCurrentBattle([shuffled[0], shuffled[1]]);
    setShowLeaderboard(false);
  };

  const handleVote = (winnerId: string, loserId: string) => {
    // Update stats
    const updatedStats = battleStats.map(stat => {
      if (stat.productId === winnerId) {
        return {
          ...stat,
          wins: stat.wins + 1,
          rating: stat.rating + 32, // ELO-like rating increase
        };
      }
      if (stat.productId === loserId) {
        return {
          ...stat,
          losses: stat.losses + 1,
          rating: Math.max(1000, stat.rating - 16), // ELO-like rating decrease (minimum 1000)
        };
      }
      return stat;
    });

    setBattleStats(updatedStats);
    localStorage.setItem('stickerBattleStats', JSON.stringify(updatedStats));

    toast({
      title: '⚔️ Vote recorded!',
      description: 'Thanks for participating in the battle!',
    });

    // Start new battle
    setTimeout(() => {
      startNewBattle();
    }, 500);
  };

  const getTopStickers = () => {
    return [...battleStats]
      .sort((a, b) => b.rating - a.rating)
      .slice(0, 10)
      .map(stat => {
        const product = ALL_PRODUCTS.find(p => p.id === stat.productId);
        return { ...stat, product };
      })
      .filter(item => item.product);
  };

  useEffect(() => {
    if (isOpen && !currentBattle) {
      startNewBattle();
    }
  }, [isOpen]);

  return (
    <>
      <Button
        onClick={() => setIsOpen(true)}
        variant="outline"
        className="gap-2 bg-gradient-to-r from-red-500 to-orange-500 text-white border-0"
      >
        <Swords className="w-4 h-4" />
        Battle Arena
      </Button>

      {isOpen && (
        <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4">
          <Card className="w-full max-w-4xl">
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle className="flex items-center gap-2 text-2xl">
                    <Swords className="w-6 h-6 text-orange-500" />
                    Sticker Battle Arena
                  </CardTitle>
                  <p className="text-sm text-muted-foreground mt-1">
                    Vote for your favorite! Help rank the best stickers! ⚔️
                  </p>
                </div>
                <Button variant="ghost" size="icon" onClick={() => setIsOpen(false)}>
                  <X className="w-5 h-5" />
                </Button>
              </div>
            </CardHeader>

            <CardContent className="space-y-6">
              <div className="flex gap-2">
                <Button
                  onClick={() => setShowLeaderboard(false)}
                  variant={!showLeaderboard ? 'default' : 'outline'}
                  className="flex-1 gap-2"
                >
                  <Swords className="w-4 h-4" />
                  Battle
                </Button>
                <Button
                  onClick={() => setShowLeaderboard(true)}
                  variant={showLeaderboard ? 'default' : 'outline'}
                  className="flex-1 gap-2"
                >
                  <Trophy className="w-4 h-4" />
                  Leaderboard
                </Button>
              </div>

              {!showLeaderboard ? (
                <>
                  {/* Battle Arena */}
                  {currentBattle && (
                    <div className="grid md:grid-cols-2 gap-6">
                      {currentBattle.map((product, index) => (
                        <button
                          key={product.id}
                          onClick={() => handleVote(product.id, currentBattle[index === 0 ? 1 : 0].id)}
                          className="group relative bg-gradient-to-br from-muted to-muted/50 p-6 rounded-2xl border-2 border-muted hover:border-primary transition-all hover:scale-105"
                        >
                          <div className="absolute top-4 right-4 bg-primary text-primary-foreground w-8 h-8 rounded-full flex items-center justify-center font-bold">
                            {index + 1}
                          </div>

                          <div className="aspect-square bg-background rounded-full p-6 mb-4 mx-auto max-w-xs">
                            <img
                              src={product.image}
                              alt={product.name}
                              className="w-full h-full object-contain"
                            />
                          </div>

                          <h3 className="font-bold text-xl mb-2">{product.name}</h3>
                          <p className="text-sm text-muted-foreground mb-4">{product.category}</p>

                          {battleStats.find(s => s.productId === product.id) && (
                            <div className="flex items-center justify-center gap-4 text-sm">
                              <div className="flex items-center gap-1">
                                <Trophy className="w-4 h-4 text-yellow-500" />
                                <span className="font-medium">
                                  {battleStats.find(s => s.productId === product.id)?.wins || 0}W
                                </span>
                              </div>
                              <div className="text-muted-foreground">
                                {battleStats.find(s => s.productId === product.id)?.losses || 0}L
                              </div>
                              <div className="flex items-center gap-1 text-primary">
                                <TrendingUp className="w-4 h-4" />
                                <span className="font-bold">
                                  {battleStats.find(s => s.productId === product.id)?.rating || 1500}
                                </span>
                              </div>
                            </div>
                          )}

                          <div className="mt-4 bg-primary/10 text-primary py-2 px-4 rounded-lg font-medium group-hover:bg-primary group-hover:text-primary-foreground transition-all">
                            Vote for This!
                          </div>
                        </button>
                      ))}
                    </div>
                  )}

                  <div className="text-center">
                    <div className="inline-flex items-center gap-2 bg-muted px-4 py-2 rounded-full">
                      <Users className="w-4 h-4" />
                      <span className="text-sm">
                        {battleStats.reduce((sum, stat) => sum + stat.wins + stat.losses, 0)} total votes
                      </span>
                    </div>
                  </div>
                </>
              ) : (
                <>
                  {/* Leaderboard */}
                  <div className="space-y-3">
                    <div className="flex items-center gap-2 mb-4">
                      <Trophy className="w-5 h-5 text-yellow-500" />
                      <h3 className="font-bold text-xl">Top 10 Stickers</h3>
                    </div>

                    {getTopStickers().map((item, index) => (
                      <div
                        key={item.productId}
                        className={`flex items-center gap-4 p-4 rounded-xl border-2 ${
                          index === 0
                            ? 'border-yellow-500 bg-yellow-50 dark:bg-yellow-950'
                            : index === 1
                            ? 'border-gray-400 bg-gray-50 dark:bg-gray-900'
                            : index === 2
                            ? 'border-orange-500 bg-orange-50 dark:bg-orange-950'
                            : 'border-muted'
                        }`}
                      >
                        <div className="flex items-center justify-center w-12 h-12 rounded-full bg-background font-bold text-xl">
                          {index === 0 ? '🥇' : index === 1 ? '🥈' : index === 2 ? '🥉' : `#${index + 1}`}
                        </div>

                        <img
                          src={item.product?.image}
                          alt={item.product?.name}
                          className="w-16 h-16 object-contain rounded-full bg-background"
                        />

                        <div className="flex-1">
                          <h4 className="font-bold">{item.product?.name}</h4>
                          <div className="flex items-center gap-3 text-sm text-muted-foreground">
                            <span>{item.wins}W - {item.losses}L</span>
                            <span className="text-primary font-bold">⭐ {item.rating}</span>
                          </div>
                        </div>

                        <div className="text-right">
                          <p className="text-sm text-muted-foreground">Win Rate</p>
                          <p className="font-bold text-lg">
                            {item.wins + item.losses > 0
                              ? Math.round((item.wins / (item.wins + item.losses)) * 100)
                              : 0}%
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>
                </>
              )}

              <div className="bg-orange-50 dark:bg-orange-950 p-4 rounded-xl border border-orange-200 dark:border-orange-800">
                <p className="text-sm text-orange-700 dark:text-orange-400">
                  💡 <strong>How it works:</strong> Vote for your favorite sticker in each battle! Stickers earn rating points with each win. The community decides which stickers are the best!
                </p>
              </div>
            </CardContent>
          </Card>
        </div>
      )}
    </>
  );
}
