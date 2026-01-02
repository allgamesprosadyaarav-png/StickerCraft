import { useState, useRef, useEffect } from 'react';
import { Gift, X, Sparkles, Zap, Star, Trophy } from 'lucide-react';
import { Button } from '../ui/button';
import { useAuthStore } from '../../stores/authStore';
import { toast } from '../../hooks/use-toast';

interface Prize {
  id: string;
  label: string;
  color: string;
  value: number; // discount percentage or loyalty points
  type: 'discount' | 'points' | 'freebie';
}

const PRIZES: Prize[] = [
  { id: '1', label: '10% OFF', color: '#FF6B6B', value: 10, type: 'discount' },
  { id: '2', label: '50 Points', color: '#4ECDC4', value: 50, type: 'points' },
  { id: '3', label: 'Free Sticker', color: '#45B7D1', value: 1, type: 'freebie' },
  { id: '4', label: '5% OFF', color: '#FFA07A', value: 5, type: 'discount' },
  { id: '5', label: '100 Points', color: '#98D8C8', value: 100, type: 'points' },
  { id: '6', label: '20% OFF', color: '#F7DC6F', value: 20, type: 'discount' },
  { id: '7', label: '25 Points', color: '#BB8FCE', value: 25, type: 'points' },
  { id: '8', label: '15% OFF', color: '#F8B4D9', value: 15, type: 'discount' },
  { id: '9', label: '30% OFF', color: '#E74C3C', value: 30, type: 'discount' },
  { id: '10', label: '200 Points', color: '#3498DB', value: 200, type: 'points' },
  { id: '11', label: '25% OFF', color: '#9B59B6', value: 25, type: 'discount' },
  { id: '12', label: '75 Points', color: '#1ABC9C', value: 75, type: 'points' },
];

interface LuckySpinWheelProps {
  onClose: () => void;
}

export function LuckySpinWheel({ onClose }: LuckySpinWheelProps) {
  const [isSpinning, setIsSpinning] = useState(false);
  const [rotation, setRotation] = useState(0);
  const [result, setResult] = useState<Prize | null>(null);
  const [particles, setParticles] = useState<{ id: number; x: number; y: number; color: string }[]>([]);
  const user = useAuthStore((state) => state.user);
  const addLoyaltyPoints = useAuthStore((state) => state.addLoyaltyPoints);
  const wheelRef = useRef<HTMLDivElement>(null);

  // Check if user can spin (2 times per month)
  const currentMonth = new Date().getMonth() + '-' + new Date().getFullYear();
  const spinData = JSON.parse(localStorage.getItem('spinData') || '{}');
  const monthSpins = spinData[currentMonth] || 0;
  const canSpin = monthSpins < 2;

  const handleSpin = () => {
    if (!canSpin || isSpinning) return;

    setIsSpinning(true);
    
    // Random prize selection
    const prizeIndex = Math.floor(Math.random() * PRIZES.length);
    const prize = PRIZES[prizeIndex];
    
    // Calculate rotation (multiple full spins + landing position)
    const segmentAngle = 360 / PRIZES.length;
    const targetRotation = 360 * 5 + (prizeIndex * segmentAngle) + (segmentAngle / 2);
    
    setRotation(targetRotation);

    setTimeout(() => {
      setIsSpinning(false);
      setResult(prize);
      
      // Update spin count for current month
      const updatedSpinData = { ...spinData, [currentMonth]: monthSpins + 1 };
      localStorage.setItem('spinData', JSON.stringify(updatedSpinData));

      // Create particle explosion
      const newParticles = Array.from({ length: 30 }, (_, i) => ({
        id: i,
        x: Math.random() * 100,
        y: Math.random() * 100,
        color: ['#FFD700', '#FF69B4', '#00BFFF', '#FF6347'][Math.floor(Math.random() * 4)],
      }));
      setParticles(newParticles);
      setTimeout(() => setParticles([]), 2000);

      // Apply prize
      if (prize.type === 'points') {
        addLoyaltyPoints(prize.value);
        toast({
          title: `🎉 You won ${prize.value} loyalty points!`,
          description: 'Points added to your account',
        });
      } else if (prize.type === 'discount') {
        // Save discount to offers array
        const existingOffers = JSON.parse(localStorage.getItem('availableOffers') || '[]');
        const newOffer = {
          id: `spin-${Date.now()}`,
          type: 'spin',
          discount: prize.value,
          label: `${prize.value}% OFF from Spin Wheel`,
          expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString(), // 7 days
        };
        existingOffers.push(newOffer);
        localStorage.setItem('availableOffers', JSON.stringify(existingOffers));
        
        toast({
          title: `🎉 You won ${prize.value}% discount!`,
          description: 'Saved to your offers! Apply at checkout',
        });
      } else {
        toast({
          title: '🎉 You won a free sticker!',
          description: 'Added to your cart',
        });
      }
    }, 4000);
  };

  return (
    <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4 animate-in fade-in">
      <div className="glass bg-card rounded-2xl max-w-lg w-full p-6 animate-in zoom-in-95 relative overflow-hidden">
        {/* Particle effects */}
        {particles.map((particle) => (
          <div
            key={particle.id}
            className="absolute w-2 h-2 rounded-full animate-confetti-fall pointer-events-none"
            style={{
              left: `${particle.x}%`,
              top: `${particle.y}%`,
              backgroundColor: particle.color,
              animationDelay: `${Math.random() * 0.5}s`,
            }}
          />
        ))}
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-2">
            <Gift className="w-6 h-6 text-primary" />
            <h2 className="text-2xl font-bold">Daily Lucky Spin</h2>
          </div>
          <button onClick={onClose} className="hover:bg-muted rounded-full p-2">
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="relative flex items-center justify-center mb-6">
          {/* Animated glow rings */}
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="w-96 h-96 rounded-full bg-gradient-to-r from-purple-500/20 to-pink-500/20 blur-3xl animate-pulse" />
          </div>
          
          {/* Pointer */}
          <div className="absolute top-0 left-1/2 -translate-x-1/2 z-10 animate-bounce">
            <div className="relative">
              <div className="w-0 h-0 border-l-[20px] border-r-[20px] border-t-[30px] border-l-transparent border-r-transparent border-t-red-500 drop-shadow-lg" />
              <Star className="absolute -top-2 left-1/2 -translate-x-1/2 w-6 h-6 text-yellow-400 animate-spin" />
            </div>
          </div>

          {/* Wheel */}
          <div
            ref={wheelRef}
            className="relative w-80 h-80 rounded-full shadow-2xl transition-transform duration-4000 ease-out"
            style={{
              transform: `rotate(${rotation}deg)`,
              transitionTimingFunction: 'cubic-bezier(0.17, 0.67, 0.12, 0.99)',
            }}
          >
            <svg viewBox="0 0 200 200" className="w-full h-full">
              {PRIZES.map((prize, index) => {
                const angle = (360 / PRIZES.length) * index;
                const nextAngle = (360 / PRIZES.length) * (index + 1);
                const startAngle = (angle - 90) * (Math.PI / 180);
                const endAngle = (nextAngle - 90) * (Math.PI / 180);
                
                const x1 = 100 + 100 * Math.cos(startAngle);
                const y1 = 100 + 100 * Math.sin(startAngle);
                const x2 = 100 + 100 * Math.cos(endAngle);
                const y2 = 100 + 100 * Math.sin(endAngle);

                return (
                  <g key={prize.id}>
                    <path
                      d={`M 100 100 L ${x1} ${y1} A 100 100 0 0 1 ${x2} ${y2} Z`}
                      fill={prize.color}
                      stroke="white"
                      strokeWidth="2"
                    />
                    <text
                      x="100"
                      y="60"
                      fill="white"
                      fontSize="10"
                      fontWeight="bold"
                      textAnchor="middle"
                      transform={`rotate(${angle + 22.5} 100 100)`}
                    >
                      {prize.label}
                    </text>
                  </g>
                );
              })}
            </svg>

            {/* Center button with glow */}
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2">
              <div className="relative">
                <div className="absolute inset-0 bg-gradient-to-r from-yellow-400 to-orange-400 rounded-full blur-xl animate-pulse" />
                <div className="relative w-20 h-20 bg-gradient-to-br from-yellow-400 via-orange-400 to-red-400 rounded-full shadow-2xl flex items-center justify-center border-4 border-white">
                  <Trophy className="w-10 h-10 text-white animate-bounce" />
                </div>
              </div>
            </div>
          </div>
        </div>

        {result ? (
          <div className="relative overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-r from-yellow-400/20 to-orange-400/20 blur-2xl animate-pulse" />
            <div className="relative text-center space-y-4 bg-gradient-to-r from-yellow-400 to-orange-400 text-white p-8 rounded-2xl border-4 border-yellow-300 shadow-2xl">
              <div className="flex items-center justify-center gap-2 mb-2">
                <Sparkles className="w-8 h-8 animate-spin" />
                <h3 className="text-3xl font-black">CONGRATULATIONS!</h3>
                <Sparkles className="w-8 h-8 animate-spin" />
              </div>
              <div className="bg-white/20 backdrop-blur-sm rounded-xl p-4 border-2 border-white/30">
                <p className="text-4xl font-black mb-2">{result.label}</p>
                {result.type === 'discount' && (
                  <p className="text-sm font-semibold">Saved to your offers!</p>
                )}
              </div>
              <Button 
                onClick={onClose} 
                className="w-full bg-white text-yellow-600 hover:bg-yellow-50 font-bold text-lg py-6 shadow-lg"
              >
                <Zap className="w-5 h-5 mr-2" />
                Claim Prize
              </Button>
            </div>
          </div>
        ) : (
          <div className="space-y-4">
            <Button
              onClick={handleSpin}
              disabled={!canSpin || isSpinning}
              className="w-full gap-2 bg-gradient-to-r from-primary to-purple-600"
              size="lg"
            >
              {isSpinning ? 'Spinning...' : canSpin ? 'Spin the Wheel!' : 'Monthly limit reached!'}
            </Button>
            {!canSpin ? (
              <p className="text-sm text-muted-foreground text-center">
                You've used both spins this month. Come back next month!
              </p>
            ) : monthSpins === 1 ? (
              <p className="text-sm text-green-600 dark:text-green-400 text-center font-medium">
                ⚡ 1 spin remaining this month!
              </p>
            ) : (
              <p className="text-sm text-muted-foreground text-center">
                💫 You have 2 free spins this month!
              </p>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
