import { useState, useRef, useEffect } from 'react';
import { X, Gift } from 'lucide-react';
import { Button } from '../ui/button';
import { toast } from '../../hooks/use-toast';

const PRIZES = [
  { id: 1, text: '10% OFF', discount: 10, color: 'from-yellow-400 to-orange-400' },
  { id: 2, text: '15% OFF', discount: 15, color: 'from-green-400 to-emerald-400' },
  { id: 3, text: '20% OFF', discount: 20, color: 'from-blue-400 to-cyan-400' },
  { id: 4, text: '25% OFF', discount: 25, color: 'from-purple-400 to-pink-400' },
  { id: 5, text: 'Better Luck!', discount: 0, color: 'from-gray-400 to-gray-500' },
];

interface ScratchCardProps {
  onClose: () => void;
}

export function ScratchCard({ onClose }: ScratchCardProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [isScratching, setIsScratching] = useState(false);
  const [scratchPercentage, setScratchPercentage] = useState(0);
  const [prize, setPrize] = useState(PRIZES[Math.floor(Math.random() * PRIZES.length)]);
  const [revealed, setRevealed] = useState(false);
  
  // Check if user can scratch (2 times per month)
  const currentMonth = new Date().getMonth() + '-' + new Date().getFullYear();
  const scratchData = JSON.parse(localStorage.getItem('scratchData') || '{}');
  const monthScratches = scratchData[currentMonth] || 0;
  const canScratch = monthScratches < 2;

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Set canvas size
    const rect = canvas.getBoundingClientRect();
    canvas.width = rect.width * 2;
    canvas.height = rect.height * 2;
    ctx.scale(2, 2);

    // Draw scratch surface
    const gradient = ctx.createLinearGradient(0, 0, rect.width, rect.height);
    gradient.addColorStop(0, '#C0C0C0');
    gradient.addColorStop(0.5, '#E8E8E8');
    gradient.addColorStop(1, '#C0C0C0');
    
    ctx.fillStyle = gradient;
    ctx.fillRect(0, 0, rect.width, rect.height);

    // Add text
    ctx.fillStyle = '#666';
    ctx.font = 'bold 24px Arial';
    ctx.textAlign = 'center';
    ctx.fillText('Scratch Here!', rect.width / 2, rect.height / 2 - 10);
    ctx.font = '16px Arial';
    ctx.fillText('🎁', rect.width / 2, rect.height / 2 + 20);
  }, []);

  const scratch = (e: React.MouseEvent<HTMLCanvasElement> | React.TouchEvent<HTMLCanvasElement>) => {
    if (!isScratching) return;

    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const rect = canvas.getBoundingClientRect();
    const x = ('touches' in e ? e.touches[0].clientX : e.clientX) - rect.left;
    const y = ('touches' in e ? e.touches[0].clientY : e.clientY) - rect.top;

    ctx.globalCompositeOperation = 'destination-out';
    ctx.beginPath();
    ctx.arc(x * 2, y * 2, 30, 0, Math.PI * 2);
    ctx.fill();

    // Calculate scratch percentage
    const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
    let transparent = 0;
    for (let i = 3; i < imageData.data.length; i += 4) {
      if (imageData.data[i] === 0) transparent++;
    }
    const percentage = (transparent / (imageData.data.length / 4)) * 100;
    setScratchPercentage(percentage);

    if (percentage > 50 && !revealed) {
      setRevealed(true);
      
      // Update scratch count for current month
      const updatedScratchData = { ...scratchData, [currentMonth]: monthScratches + 1 };
      localStorage.setItem('scratchData', JSON.stringify(updatedScratchData));
      
      if (prize.discount > 0) {
        // Save discount to offers array
        const existingOffers = JSON.parse(localStorage.getItem('availableOffers') || '[]');
        const newOffer = {
          id: `scratch-${Date.now()}`,
          type: 'scratch',
          discount: prize.discount,
          label: `${prize.discount}% OFF from Scratch Card`,
          expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString(), // 7 days
        };
        existingOffers.push(newOffer);
        localStorage.setItem('availableOffers', JSON.stringify(existingOffers));
        
        toast({
          title: `🎉 You won ${prize.discount}% OFF!`,
          description: 'Saved to your offers! Apply at checkout',
        });
      }
    }
  };

  return (
    <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4 animate-in fade-in">
      <div className="glass bg-card rounded-2xl max-w-md w-full p-6 animate-in zoom-in-95">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-2">
            <Gift className="w-6 h-6 text-primary" />
            <h2 className="text-2xl font-bold">Scratch & Win!</h2>
          </div>
          <button onClick={onClose} className="hover:bg-muted rounded-full p-2">
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="relative">
          {/* Prize underneath */}
          <div className={`absolute inset-0 rounded-2xl bg-gradient-to-br ${prize.color} flex items-center justify-center`}>
            <div className="text-center text-white">
              <div className="text-5xl font-black mb-2">{prize.text}</div>
              {prize.discount > 0 && (
                <p className="text-lg font-semibold">on your next purchase!</p>
              )}
            </div>
          </div>

          {/* Scratch canvas */}
          {canScratch && (
            <canvas
              ref={canvasRef}
              className="w-full h-64 rounded-2xl cursor-pointer relative z-10"
              onMouseDown={() => setIsScratching(true)}
              onMouseUp={() => setIsScratching(false)}
              onMouseMove={scratch}
              onTouchStart={() => setIsScratching(true)}
              onTouchEnd={() => setIsScratching(false)}
              onTouchMove={scratch}
            />
          )}
        </div>

        <div className="mt-6 space-y-4">
          {!canScratch ? (
            <div className="bg-red-50 dark:bg-red-950 p-4 rounded-xl text-center">
              <p className="text-red-600 dark:text-red-400 font-semibold mb-2">Monthly Limit Reached</p>
              <p className="text-sm text-muted-foreground">You've used both scratch cards this month. Come back next month!</p>
              <Button onClick={onClose} className="w-full mt-4">
                Close
              </Button>
            </div>
          ) : (
            <>
              <div className="text-center text-sm text-muted-foreground">
                {revealed ? (
                  <span className="text-primary font-semibold">Prize revealed! 🎉</span>
                ) : monthScratches === 1 ? (
                  <span className="text-green-600 dark:text-green-400 font-medium">⚡ Last scratch card this month!</span>
                ) : (
                  <span>Scratch to reveal your prize!</span>
                )}
              </div>

              {revealed && (
                <Button onClick={onClose} className="w-full">
                  {prize.discount > 0 ? 'Claim Discount' : 'Close'}
                </Button>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
}
