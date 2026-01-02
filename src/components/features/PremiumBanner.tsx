import { Crown, Zap, Gift, Sparkles } from 'lucide-react';
import { useState } from 'react';
import { Card, CardContent } from '../ui/card';
import { Button } from '../ui/button';
import { PremiumModal } from './PremiumModal';
import { useAuthStore } from '../../stores/authStore';

export function PremiumBanner() {
  const [showPremiumModal, setShowPremiumModal] = useState(false);
  const user = useAuthStore((state) => state.user);

  if (user?.isPremium) {
    return null; // Don't show banner to premium members
  }

  return (
    <>
      <Card className="glass mb-6 overflow-hidden relative">
        <div className="absolute inset-0 bg-gradient-to-r from-purple-500/10 via-pink-500/10 to-orange-500/10"></div>
        <CardContent className="p-6 relative">
          <div className="flex flex-col md:flex-row items-center gap-4">
            <div className="flex-shrink-0">
              <div className="w-16 h-16 rounded-full bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center shadow-lg">
                <Crown className="w-8 h-8 text-white" />
              </div>
            </div>

            <div className="flex-1 text-center md:text-left">
              <h3 className="text-xl font-bold mb-1 flex items-center justify-center md:justify-start gap-2">
                <Sparkles className="w-5 h-5 text-yellow-500" />
                Upgrade to Premium - Only ₹99!
                <Sparkles className="w-5 h-5 text-yellow-500" />
              </h3>
              <div className="flex flex-wrap justify-center md:justify-start gap-3 mt-2">
                <span className="text-sm flex items-center gap-1 text-muted-foreground">
                  <Zap className="w-4 h-4 text-orange-500" />
                  Quick Delivery
                </span>
                <span className="text-sm flex items-center gap-1 text-muted-foreground">
                  <Crown className="w-4 h-4 text-purple-500" />
                  Premium Stickers & Keychains
                </span>
                <span className="text-sm flex items-center gap-1 text-muted-foreground">
                  <Gift className="w-4 h-4 text-pink-500" />
                  Exclusive Designs
                </span>
              </div>
            </div>

            <div className="flex-shrink-0">
              <Button
                onClick={() => setShowPremiumModal(true)}
                className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 gap-2 shadow-lg"
                size="lg"
              >
                <Crown className="w-4 h-4" />
                Get Premium
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {showPremiumModal && (
        <PremiumModal onClose={() => setShowPremiumModal(false)} />
      )}
    </>
  );
}
