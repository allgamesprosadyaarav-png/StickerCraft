import { useState, useEffect } from 'react';
import { Gift, X, Sparkles, Coins, Zap } from 'lucide-react';
import { Button } from '../ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { toast } from '../../hooks/use-toast';

const PRIZES = [
  { id: 1, name: '₹100 OFF', value: 100, color: 'from-yellow-400 to-orange-500', emoji: '💰' },
  { id: 2, name: 'Free Keychain', value: 110, color: 'from-purple-400 to-pink-500', emoji: '🔑' },
  { id: 3, name: '₹50 OFF', value: 50, color: 'from-blue-400 to-cyan-500', emoji: '💵' },
  { id: 4, name: '5 Free Stickers', value: 50, color: 'from-green-400 to-emerald-500', emoji: '🎨' },
  { id: 5, name: '₹25 OFF', value: 25, color: 'from-red-400 to-pink-500', emoji: '🎁' },
  { id: 6, name: 'Better Luck!', value: 0, color: 'from-gray-400 to-slate-500', emoji: '🍀' },
];

export function DailyLuckyDraw() {
  const [isOpen, setIsOpen] = useState(false);
  const [isSpinning, setIsSpinning] = useState(false);
  const [result, setResult] = useState<typeof PRIZES[0] | null>(null);
  const [canPlay, setCanPlay] = useState(true);

  useEffect(() => {
    // Check if user already played today
    const lastPlayed = localStorage.getItem('lastLuckyDrawDate');
    const today = new Date().toDateString();
    if (lastPlayed === today) {
      setCanPlay(false);
    }
  }, []);

  const handleSpin = () => {
    if (!canPlay) {
      toast({
        title: 'Already played today! 🎮',
        description: 'Come back tomorrow for another chance to win',
      });
      return;
    }

    setIsSpinning(true);
    setResult(null);

    // Simulate spinning animation
    setTimeout(() => {
      // Weighted random selection (lower prizes more common)
      const weights = [5, 3, 10, 8, 15, 30]; // Better Luck is 30% chance
      const totalWeight = weights.reduce((sum, w) => sum + w, 0);
      let random = Math.random() * totalWeight;
      
      let selectedPrize = PRIZES[0];
      for (let i = 0; i < PRIZES.length; i++) {
        random -= weights[i];
        if (random <= 0) {
          selectedPrize = PRIZES[i];
          break;
        }
      }

      setResult(selectedPrize);
      setIsSpinning(false);
      setCanPlay(false);
      localStorage.setItem('lastLuckyDrawDate', new Date().toDateString());

      if (selectedPrize.value > 0) {
        // Save prize to offers
        const offers = JSON.parse(localStorage.getItem('availableOffers') || '[]');
        offers.push({
          id: `lucky-${Date.now()}`,
          type: 'lucky',
          label: selectedPrize.name,
          discount: Math.round((selectedPrize.value / 100) * 100), // Convert to percentage for discount
          expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString(), // 7 days
        });
        localStorage.setItem('availableOffers', JSON.stringify(offers));

        toast({
          title: `🎉 You won ${selectedPrize.name}!`,
          description: 'Prize added to your offers. Use it at checkout!',
        });
      } else {
        toast({
          title: '🍀 Better luck tomorrow!',
          description: 'Try again tomorrow for another chance to win',
        });
      }
    }, 3000);
  };

  return (
    <>
      <button
        onClick={() => setIsOpen(true)}
        className="fixed bottom-24 right-6 z-40 bg-gradient-to-r from-yellow-500 via-orange-500 to-red-500 text-white p-4 rounded-full shadow-2xl hover:scale-110 transition-transform animate-bounce"
      >
        <Gift className="w-6 h-6" />
      </button>

      {isOpen && (
        <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4">
          <Card className="w-full max-w-md">
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle className="flex items-center gap-2 text-2xl">
                  <Sparkles className="w-6 h-6 text-yellow-500" />
                  Daily Lucky Draw
                </CardTitle>
                <Button variant="ghost" size="icon" onClick={() => setIsOpen(false)}>
                  <X className="w-5 h-5" />
                </Button>
              </div>
              <p className="text-sm text-muted-foreground">
                Spin once per day for a chance to win amazing prizes! 🎁
              </p>
            </CardHeader>

            <CardContent className="space-y-6">
              {/* Prize Display */}
              <div className="grid grid-cols-3 gap-2">
                {PRIZES.filter(p => p.value > 0).map((prize) => (
                  <div
                    key={prize.id}
                    className={`bg-gradient-to-br ${prize.color} p-3 rounded-xl text-white text-center`}
                  >
                    <p className="text-2xl mb-1">{prize.emoji}</p>
                    <p className="text-xs font-bold">{prize.name}</p>
                  </div>
                ))}
              </div>

              {/* Spin Button */}
              <div className="relative">
                <div className={`w-48 h-48 mx-auto rounded-full bg-gradient-to-br from-purple-500 via-pink-500 to-red-500 flex items-center justify-center ${isSpinning ? 'animate-spin' : ''}`}>
                  <div className="w-44 h-44 rounded-full bg-background flex items-center justify-center">
                    {result ? (
                      <div className="text-center">
                        <p className="text-4xl mb-2">{result.emoji}</p>
                        <p className="font-bold text-lg">{result.name}</p>
                      </div>
                    ) : (
                      <Gift className="w-16 h-16 text-primary" />
                    )}
                  </div>
                </div>

                {isSpinning && (
                  <div className="absolute inset-0 flex items-center justify-center">
                    <Sparkles className="w-8 h-8 text-yellow-500 animate-ping" />
                  </div>
                )}
              </div>

              {/* Action Button */}
              <Button
                onClick={handleSpin}
                disabled={!canPlay || isSpinning}
                className="w-full bg-gradient-to-r from-purple-600 to-pink-600 text-lg py-6"
                size="lg"
              >
                {isSpinning ? (
                  <span className="flex items-center gap-2">
                    <Sparkles className="w-5 h-5 animate-spin" />
                    Spinning...
                  </span>
                ) : !canPlay ? (
                  'Come Back Tomorrow! ⏰'
                ) : (
                  <span className="flex items-center gap-2">
                    <Zap className="w-5 h-5" />
                    Spin Now - FREE!
                  </span>
                )}
              </Button>

              {!canPlay && !isSpinning && (
                <div className="bg-muted/50 p-3 rounded-lg text-center">
                  <p className="text-sm text-muted-foreground">
                    ⏰ Next draw available tomorrow at midnight
                  </p>
                </div>
              )}

              <div className="bg-blue-50 dark:bg-blue-950 p-3 rounded-lg border border-blue-200 dark:border-blue-800">
                <p className="text-xs text-blue-700 dark:text-blue-400">
                  💡 <strong>How it works:</strong> Spin the wheel once per day for free! Win discounts, free stickers, or keychains. All prizes are automatically added to your account.
                </p>
              </div>
            </CardContent>
          </Card>
        </div>
      )}
    </>
  );
}
