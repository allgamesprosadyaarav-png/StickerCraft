import { useState } from 'react';
import { X, Crown, Check, CreditCard } from 'lucide-react';
import { useAuthStore } from '../../stores/authStore';
import { Button } from '../ui/button';
import { toast } from '../../hooks/use-toast';
import { PREMIUM_PRICE, PREMIUM_BENEFITS } from '../../constants/rewards';

interface PremiumModalProps {
  onClose: () => void;
}

export function PremiumModal({ onClose }: PremiumModalProps) {
  const [selectedPlan, setSelectedPlan] = useState<'monthly' | 'yearly'>('monthly');
  const [isProcessing, setIsProcessing] = useState(false);
  const activatePremium = useAuthStore((state) => state.activatePremium);

  const monthlyPrice = PREMIUM_PRICE;
  const yearlyPrice = PREMIUM_PRICE * 10; // ₹990 for 12 months (2 months free)

  const handlePurchase = async () => {
    setIsProcessing(true);

    // Simulate payment processing
    await new Promise((resolve) => setTimeout(resolve, 2000));

    const months = selectedPlan === 'monthly' ? 1 : 12;
    activatePremium(months);

    toast({
      title: 'Welcome to Premium! 👑',
      description: 'You now have access to all premium features!',
    });

    setIsProcessing(false);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-black/50 backdrop-blur-sm">
      <div className="min-h-screen flex items-center justify-center p-4">
        <div className="bg-background rounded-3xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
          <div className="sticky top-0 bg-gradient-to-r from-purple-600 to-pink-600 p-6 flex justify-between items-center rounded-t-3xl">
            <div className="flex items-center gap-3 text-white">
              <Crown className="w-8 h-8" />
              <div>
                <h2 className="text-2xl font-bold">StickerCraft Premium</h2>
                <p className="text-sm opacity-90">Unlock exclusive features</p>
              </div>
            </div>
            <button onClick={onClose} className="text-white hover:bg-white/20 p-2 rounded-full">
              <X className="w-6 h-6" />
            </button>
          </div>

          <div className="p-6 space-y-6">
            {/* Plan Selection */}
            <div className="grid md:grid-cols-2 gap-4">
              <button
                onClick={() => setSelectedPlan('monthly')}
                className={`p-6 rounded-2xl border-2 transition-all text-left ${
                  selectedPlan === 'monthly'
                    ? 'border-purple-600 bg-purple-50 dark:bg-purple-950'
                    : 'border-muted hover:border-purple-400'
                }`}
              >
                <div className="space-y-2">
                  <p className="font-bold text-lg">Monthly Plan</p>
                  <div className="flex items-baseline gap-2">
                    <span className="text-3xl font-bold text-purple-600">₹{monthlyPrice}</span>
                    <span className="text-muted-foreground">/month</span>
                  </div>
                  <p className="text-sm text-muted-foreground">Billed monthly</p>
                </div>
              </button>

              <button
                onClick={() => setSelectedPlan('yearly')}
                className={`p-6 rounded-2xl border-2 transition-all text-left relative ${
                  selectedPlan === 'yearly'
                    ? 'border-purple-600 bg-purple-50 dark:bg-purple-950'
                    : 'border-muted hover:border-purple-400'
                }`}
              >
                <div className="absolute -top-3 -right-3 bg-green-500 text-white px-3 py-1 rounded-full text-xs font-bold">
                  Save 17%
                </div>
                <div className="space-y-2">
                  <p className="font-bold text-lg">Yearly Plan</p>
                  <div className="flex items-baseline gap-2">
                    <span className="text-3xl font-bold text-purple-600">₹{yearlyPrice}</span>
                    <span className="text-muted-foreground">/year</span>
                  </div>
                  <p className="text-sm text-muted-foreground">₹{Math.round(yearlyPrice / 12)}/month</p>
                </div>
              </button>
            </div>

            {/* Benefits */}
            <div className="bg-muted/30 p-6 rounded-2xl space-y-4">
              <p className="font-bold text-lg flex items-center gap-2">
                <Crown className="w-5 h-5 text-purple-600" />
                Premium Benefits
              </p>
              <div className="grid md:grid-cols-2 gap-3">
                {PREMIUM_BENEFITS.map((benefit, index) => (
                  <div key={index} className="flex items-start gap-2">
                    <Check className="w-5 h-5 text-green-600 flex-shrink-0 mt-0.5" />
                    <span className="text-sm">{benefit}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Payment Summary */}
            <div className="bg-gradient-to-r from-purple-50 to-pink-50 dark:from-purple-950 dark:to-pink-950 p-6 rounded-2xl border-2 border-purple-200 dark:border-purple-800">
              <div className="space-y-3">
                <div className="flex justify-between items-center">
                  <span className="font-medium">
                    {selectedPlan === 'monthly' ? 'Monthly' : 'Yearly'} Subscription
                  </span>
                  <span className="font-bold text-lg">
                    ₹{selectedPlan === 'monthly' ? monthlyPrice : yearlyPrice}
                  </span>
                </div>
                {selectedPlan === 'yearly' && (
                  <div className="flex justify-between items-center text-sm text-green-600">
                    <span>Savings (2 months free)</span>
                    <span className="font-bold">₹{monthlyPrice * 2}</span>
                  </div>
                )}
                <div className="border-t pt-3 flex justify-between items-center">
                  <span className="font-bold text-lg">Total</span>
                  <span className="font-bold text-2xl text-purple-600">
                    ₹{selectedPlan === 'monthly' ? monthlyPrice : yearlyPrice}
                  </span>
                </div>
              </div>
            </div>

            {/* Purchase Button */}
            <Button
              className="w-full bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 gap-2"
              size="lg"
              onClick={handlePurchase}
              disabled={isProcessing}
            >
              {isProcessing ? (
                'Processing...'
              ) : (
                <>
                  <CreditCard className="w-5 h-5" />
                  Subscribe Now
                </>
              )}
            </Button>

            <p className="text-xs text-center text-muted-foreground">
              By subscribing, you agree to our terms. Cancel anytime.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
