import { useState } from 'react';
import { X, Sparkles, Zap, Trophy } from 'lucide-react';
import { Button } from '../ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { toast } from '../../hooks/use-toast';

const SLOT_SYMBOLS = ['🎨', '🔑', '⭐', '💎', '🎁', '🍀', '🌟', '💰'];

const PRIZES = [
  { pattern: ['💰', '💰', '💰'], reward: '₹100 OFF', value: 100 },
  { pattern: ['💎', '💎', '💎'], reward: 'Free Premium Keychain', value: 150 },
  { pattern: ['🎁', '🎁', '🎁'], reward: '10 Free Stickers', value: 100 },
  { pattern: ['🌟', '🌟', '🌟'], reward: '₹75 OFF', value: 75 },
  { pattern: ['⭐', '⭐', '⭐'], reward: '₹50 OFF', value: 50 },
  { pattern: ['🍀', '🍀', '🍀'], reward: '5 Free Stickers', value: 50 },
];

export function StickerSlotsGame() {
  const [isOpen, setIsOpen] = useState(false);
  const [slots, setSlots] = useState<string[]>(['🎨', '🔑', '⭐']);
  const [isSpinning, setIsSpinning] = useState(false);
  const [credits, setCredits] = useState(() => {
    const saved = localStorage.getItem('slotsCredits');
    return saved ? parseInt(saved) : 5;
  });
  const [totalWins, setTotalWins] = useState(() => {
    const saved = localStorage.getItem('slotsTotalWins');
    return saved ? parseInt(saved) : 0;
  });

  const spin = () => {
    if (credits <= 0) {
      toast({
        title: 'No credits left! 😢',
        description: 'Buy more stickers to earn free spins!',
      });
      return;
    }

    setIsSpinning(true);
    setCredits(credits - 1);
    localStorage.setItem('slotsCredits', (credits - 1).toString());

    // Animate slots
    let spinCount = 0;
    const spinInterval = setInterval(() => {
      setSlots([
        SLOT_SYMBOLS[Math.floor(Math.random() * SLOT_SYMBOLS.length)],
        SLOT_SYMBOLS[Math.floor(Math.random() * SLOT_SYMBOLS.length)],
        SLOT_SYMBOLS[Math.floor(Math.random() * SLOT_SYMBOLS.length)],
      ]);
      spinCount++;

      if (spinCount >= 20) {
        clearInterval(spinInterval);
        
        // Determine final result (with some luck)
        const luck = Math.random();
        let finalSlots: string[];
        
        if (luck < 0.15) {
          // 15% chance of winning big
          const prize = PRIZES[Math.floor(Math.random() * 3)];
          finalSlots = [...prize.pattern];
        } else if (luck < 0.35) {
          // 20% chance of small win
          const prize = PRIZES[Math.floor(Math.random() * 3) + 3];
          finalSlots = [...prize.pattern];
        } else {
          // 65% no match
          finalSlots = [
            SLOT_SYMBOLS[Math.floor(Math.random() * SLOT_SYMBOLS.length)],
            SLOT_SYMBOLS[Math.floor(Math.random() * SLOT_SYMBOLS.length)],
            SLOT_SYMBOLS[Math.floor(Math.random() * SLOT_SYMBOLS.length)],
          ];
          // Ensure they don't match
          while (finalSlots[0] === finalSlots[1] && finalSlots[1] === finalSlots[2]) {
            finalSlots[2] = SLOT_SYMBOLS[Math.floor(Math.random() * SLOT_SYMBOLS.length)];
          }
        }
        
        setSlots(finalSlots);
        setIsSpinning(false);
        
        // Check for win
        const matchedPrize = PRIZES.find(
          p => p.pattern[0] === finalSlots[0] && 
               p.pattern[1] === finalSlots[1] && 
               p.pattern[2] === finalSlots[2]
        );
        
        if (matchedPrize) {
          const newWins = totalWins + 1;
          setTotalWins(newWins);
          localStorage.setItem('slotsTotalWins', newWins.toString());
          
          // Save prize
          const offers = JSON.parse(localStorage.getItem('availableOffers') || '[]');
          offers.push({
            id: `slots-${Date.now()}`,
            type: 'slots',
            label: matchedPrize.reward,
            discount: Math.round((matchedPrize.value / 100) * 100),
            expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString(),
          });
          localStorage.setItem('availableOffers', JSON.stringify(offers));
          
          toast({
            title: `🎰 JACKPOT! You won ${matchedPrize.reward}! 🎉`,
            description: 'Prize added to your offers!',
          });
        } else {
          toast({
            title: 'Better luck next time! 🎲',
            description: 'Keep spinning for a chance to win big!',
          });
        }
      }
    }, 100);
  };

  const earnCredits = () => {
    toast({
      title: '💰 Earn Free Spins',
      description: 'Buy 5 stickers to get 1 free spin! Or complete daily challenges!',
    });
  };

  return (
    <>
      <button
        onClick={() => setIsOpen(true)}
        className="fixed bottom-40 right-6 z-40 bg-gradient-to-r from-yellow-500 via-orange-500 to-red-500 text-white px-4 py-3 rounded-full shadow-2xl hover:scale-110 transition-transform animate-pulse"
      >
        <div className="flex items-center gap-2">
          <span className="text-2xl">🎰</span>
          <span className="font-bold text-sm">SLOTS</span>
        </div>
      </button>

      {isOpen && (
        <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4">
          <Card className="w-full max-w-lg">
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle className="flex items-center gap-2 text-2xl">
                  <span className="text-3xl">🎰</span>
                  Sticker Slots
                </CardTitle>
                <Button variant="ghost" size="icon" onClick={() => setIsOpen(false)}>
                  <X className="w-5 h-5" />
                </Button>
              </div>
              <p className="text-sm text-muted-foreground">
                Match 3 symbols to win amazing prizes! 💰
              </p>
            </CardHeader>

            <CardContent className="space-y-6">
              {/* Credits Display */}
              <div className="bg-gradient-to-r from-purple-500/10 to-pink-500/10 p-4 rounded-xl border-2 border-purple-500/20">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-muted-foreground">Your Credits</p>
                    <p className="text-3xl font-black text-primary">{credits}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-sm text-muted-foreground">Total Wins</p>
                    <p className="text-2xl font-bold text-green-600">{totalWins}</p>
                  </div>
                </div>
              </div>

              {/* Slot Machine */}
              <div className="bg-gradient-to-br from-yellow-400 via-orange-500 to-red-500 p-6 rounded-2xl shadow-2xl">
                <div className="bg-black/30 backdrop-blur-sm p-6 rounded-xl">
                  <div className="grid grid-cols-3 gap-4 mb-4">
                    {slots.map((symbol, index) => (
                      <div
                        key={index}
                        className={`aspect-square bg-white rounded-xl flex items-center justify-center text-6xl shadow-2xl ${
                          isSpinning ? 'animate-bounce' : ''
                        }`}
                      >
                        {symbol}
                      </div>
                    ))}
                  </div>

                  <Button
                    onClick={spin}
                    disabled={isSpinning || credits <= 0}
                    className="w-full bg-gradient-to-r from-green-500 to-emerald-500 text-white text-xl font-black py-6 shadow-2xl"
                    size="lg"
                  >
                    {isSpinning ? (
                      <span className="flex items-center gap-2">
                        <Sparkles className="w-6 h-6 animate-spin" />
                        SPINNING...
                      </span>
                    ) : credits <= 0 ? (
                      'NO CREDITS'
                    ) : (
                      <span className="flex items-center gap-2">
                        <Zap className="w-6 h-6" />
                        SPIN NOW!
                      </span>
                    )}
                  </Button>
                </div>
              </div>

              {/* Prize Table */}
              <div className="space-y-2">
                <h3 className="font-bold text-lg flex items-center gap-2">
                  <Trophy className="w-5 h-5 text-yellow-500" />
                  Win Table
                </h3>
                <div className="space-y-1">
                  {PRIZES.map((prize, index) => (
                    <div
                      key={index}
                      className="flex items-center justify-between bg-muted p-2 rounded-lg text-sm"
                    >
                      <div className="flex items-center gap-2">
                        {prize.pattern.map((symbol, i) => (
                          <span key={i} className="text-2xl">{symbol}</span>
                        ))}
                      </div>
                      <span className="font-semibold text-primary">{prize.reward}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Earn Credits */}
              {credits <= 2 && (
                <Button
                  onClick={earnCredits}
                  variant="outline"
                  className="w-full gap-2"
                >
                  <Sparkles className="w-4 h-4" />
                  How to Earn Free Spins
                </Button>
              )}

              <div className="bg-blue-50 dark:bg-blue-950 p-3 rounded-lg border border-blue-200 dark:border-blue-800">
                <p className="text-xs text-blue-700 dark:text-blue-400">
                  💡 <strong>Tip:</strong> Buy stickers to earn free spins! Every 5 stickers purchased = 1 free spin credit. Complete daily challenges for bonus spins!
                </p>
              </div>
            </CardContent>
          </Card>
        </div>
      )}
    </>
  );
}
