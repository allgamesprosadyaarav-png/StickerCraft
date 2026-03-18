import { useState } from 'react';
import { X, Truck, ShoppingBag } from 'lucide-react';
import { Button } from '../ui/button';
import stickerRobotMascot from '@/assets/sticker-robot-mascot.jpg';

export function MinimumOrderPopup() {
  const [isVisible, setIsVisible] = useState(true);
  const [isMinimized, setIsMinimized] = useState(false);

  if (!isVisible) return null;

  return (
    <div className="fixed bottom-24 right-4 z-40 animate-in slide-in-from-right">
      {isMinimized ? (
        <button
          onClick={() => setIsMinimized(false)}
          className="glass bg-white/95 hover:bg-white p-4 rounded-full shadow-2xl border-2 border-primary/20 hover:scale-110 transition-transform"
        >
          <Truck className="w-6 h-6 text-primary" />
        </button>
      ) : (
        <div className="glass bg-white/95 p-4 rounded-2xl shadow-2xl border-2 border-primary/20 max-w-xs">
          <div className="flex items-start gap-3">
            {/* Sticker Robot Mascot */}
            <div className="flex-shrink-0">
              <div className="relative bg-gradient-to-br from-blue-100 to-teal-100 dark:from-blue-950 dark:to-teal-950 rounded-2xl p-1 shadow-lg">
                <img
                  src={stickerRobotMascot}
                  alt="Sticker Robot Mascot"
                  className="w-20 h-20 object-cover rounded-xl"
                />
                <div className="absolute -top-1 -right-1 bg-green-500 w-5 h-5 rounded-full border-2 border-white flex items-center justify-center animate-pulse">
                  <span className="text-white text-xs">✓</span>
                </div>
              </div>
            </div>

            {/* Message */}
            <div className="flex-1">
              <div className="flex items-start justify-between mb-2">
                <div className="bg-primary text-white px-2 py-1 rounded-md text-xs font-bold">
                  Delivery Info
                </div>
                <div className="flex gap-1">
                  <button
                    onClick={() => setIsMinimized(true)}
                    className="text-muted-foreground hover:text-foreground transition-colors"
                  >
                    <span className="text-lg">−</span>
                  </button>
                  <button
                    onClick={() => setIsVisible(false)}
                    className="text-muted-foreground hover:text-foreground transition-colors"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>
              </div>
              
              <div className="space-y-3">
                <div className="bg-orange-50 dark:bg-orange-950 border-l-4 border-orange-500 p-3 rounded-r-lg">
                  <div className="flex items-center gap-2 text-orange-700 dark:text-orange-400 font-bold text-sm mb-1">
                    <ShoppingBag className="w-4 h-4" />
                    Minimum Order
                  </div>
                  <p className="text-xs text-orange-600 dark:text-orange-500">
                    ₹50 required to place order
                  </p>
                </div>

                <div className="bg-green-50 dark:bg-green-950 border-l-4 border-green-500 p-3 rounded-r-lg">
                  <div className="flex items-center gap-2 text-green-700 dark:text-green-400 font-bold text-sm mb-1">
                    <Truck className="w-4 h-4" />
                    FREE Delivery
                  </div>
                  <p className="text-xs text-green-600 dark:text-green-500">
                    On orders ₹60 or above! 🎉
                  </p>
                </div>

                <div className="text-center">
                  <p className="text-xs text-muted-foreground italic">
                    "We deliver happiness to your doorstep!" 📦
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
