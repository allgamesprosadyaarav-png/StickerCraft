import { useState, useEffect } from 'react';
import { Gift, X } from 'lucide-react';
import { Button } from '../ui/button';

interface SpecialOfferPopupProps {
  onNavigate: (page: 'store') => void;
}

export function SpecialOfferPopup({ onNavigate }: SpecialOfferPopupProps) {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const interval = setInterval(() => {
      setIsVisible(true);
      setTimeout(() => setIsVisible(false), 5000); // Auto-hide after 5 seconds
    }, 15000); // Show every 15 seconds

    return () => clearInterval(interval);
  }, []);

  if (!isVisible) return null;

  return (
    <div className="fixed bottom-6 right-6 z-50 animate-in slide-in-from-bottom-5 fade-in duration-300">
      <div className="relative bg-gradient-to-br from-secondary via-primary to-accent p-4 rounded-2xl shadow-2xl w-72">
        <button
          onClick={() => setIsVisible(false)}
          className="absolute top-2 right-2 text-white/80 hover:text-white transition-colors"
        >
          <X className="w-4 h-4" />
        </button>

        <div className="space-y-3 pt-2">
          <div className="flex items-center gap-2">
            <div className="bg-white/20 p-2 rounded-full animate-bounce-slow">
              <Gift className="w-6 h-6 text-white" />
            </div>
            <h3 className="text-lg font-bold text-white">
              Special Offer! 🎉
            </h3>
          </div>

          <div className="bg-white/10 backdrop-blur-sm rounded-xl p-3 space-y-1">
            <p className="text-sm font-bold text-white">
              Buy 2 Keychains
            </p>
            <p className="text-xl font-black text-yellow-300">
              GET 5 STICKERS FREE!
            </p>
          </div>

          <Button
            onClick={() => {
              setIsVisible(false);
              onNavigate('store');
            }}
            className="w-full bg-white text-primary hover:bg-white/90 font-bold text-sm py-2"
          >
            Shop Now
          </Button>
        </div>
      </div>
    </div>
  );
}
