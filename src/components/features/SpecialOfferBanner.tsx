import { Gift } from 'lucide-react';

export function SpecialOfferBanner() {
  return (
    <div className="bg-gradient-to-r from-secondary via-primary to-accent p-4 rounded-2xl shadow-lg mb-6">
      <div className="flex items-center justify-center gap-3 text-white">
        <Gift className="w-6 h-6 animate-bounce" />
        <p className="text-sm md:text-base font-bold text-center">
          🎉 Special Offer: Buy 2 Keychains & Get 5 Stickers FREE! 🎁
        </p>
        <Gift className="w-6 h-6 animate-bounce" />
      </div>
    </div>
  );
}
