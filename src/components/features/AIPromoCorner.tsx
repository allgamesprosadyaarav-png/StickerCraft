import { Sparkles, Wand2 } from 'lucide-react';

interface AIPromoCornerProps {
  onNavigate: () => void;
}

export function AIPromoCorner({ onNavigate }: AIPromoCornerProps) {
  return (
    <button
      onClick={onNavigate}
      className="fixed bottom-6 right-6 z-50 group"
      aria-label="Try AI Sticker Generation"
    >
      <div className="relative">
        {/* Glow effect */}
        <div className="absolute inset-0 bg-gradient-to-r from-purple-600 to-pink-600 rounded-2xl blur-xl opacity-75 group-hover:opacity-100 transition-opacity animate-pulse"></div>
        
        {/* Main content */}
        <div className="relative glass bg-gradient-to-r from-purple-600 to-pink-600 text-white p-4 rounded-2xl shadow-2xl max-w-[200px] group-hover:scale-105 transition-transform">
          <div className="flex items-start gap-2">
            <Wand2 className="w-5 h-5 flex-shrink-0 mt-0.5 animate-bounce" />
            <div className="text-left">
              <p className="text-xs font-bold leading-tight mb-1">
                Now let your imagination generate stickers!
              </p>
              <div className="flex items-center gap-1 text-yellow-300">
                <Sparkles className="w-3 h-3" />
                <span className="text-[10px] font-semibold">Try Latest AI Generation</span>
                <Sparkles className="w-3 h-3" />
              </div>
            </div>
          </div>
        </div>

        {/* Pulsing ring */}
        <div className="absolute -inset-2 border-2 border-purple-400/50 rounded-2xl animate-ping"></div>
      </div>
    </button>
  );
}
