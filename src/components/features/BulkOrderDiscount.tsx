import { Package, TrendingDown, Zap } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';

export function BulkOrderDiscount() {
  const bulkTiers = [
    { min: 10, max: 24, discount: 10, icon: '📦' },
    { min: 25, max: 49, discount: 15, icon: '📦📦' },
    { min: 50, max: 99, discount: 20, icon: '📦📦📦' },
    { min: 100, max: null, discount: 25, icon: '🏆' },
  ];

  return (
    <Card className="glass border-2 border-purple-200 dark:border-purple-800">
      <CardHeader>
        <div className="flex items-center gap-3">
          <div className="bg-gradient-to-br from-purple-500 to-pink-500 p-3 rounded-full">
            <Package className="w-6 h-6 text-white" />
          </div>
          <div>
            <CardTitle className="text-2xl">Bulk Order Discounts</CardTitle>
            <p className="text-sm text-muted-foreground">Save more when you buy more!</p>
          </div>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="bg-gradient-to-r from-purple-50 to-pink-50 dark:from-purple-950/50 dark:to-pink-950/50 p-4 rounded-xl">
          <div className="flex items-center gap-2 text-purple-700 dark:text-purple-400 font-semibold mb-2">
            <Zap className="w-5 h-5" />
            <span>Special Pricing for Bulk Orders</span>
          </div>
          <p className="text-sm text-muted-foreground">
            Perfect for events, gifts, or reselling! Contact us for custom bulk orders above 100 pieces.
          </p>
        </div>

        <div className="grid gap-3">
          {bulkTiers.map((tier) => (
            <div
              key={tier.min}
              className="bg-muted/30 p-4 rounded-xl border-2 border-transparent hover:border-primary/50 transition-all"
            >
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-3">
                  <span className="text-3xl">{tier.icon}</span>
                  <div>
                    <p className="font-semibold text-lg">
                      {tier.min}{tier.max ? `-${tier.max}` : '+'} Stickers
                    </p>
                    <p className="text-xs text-muted-foreground">
                      {tier.max ? `${tier.min} to ${tier.max} pieces` : `${tier.min}+ pieces`}
                    </p>
                  </div>
                </div>
                <div className="text-right">
                  <div className="flex items-center gap-1 text-green-600 font-bold text-2xl">
                    <TrendingDown className="w-5 h-5" />
                    {tier.discount}%
                  </div>
                  <p className="text-xs text-muted-foreground">discount</p>
                </div>
              </div>
              <div className="bg-background/50 p-2 rounded-lg mt-2">
                <p className="text-xs text-muted-foreground">
                  💰 Example: 50 stickers × ₹10 = ₹500 → Pay only <span className="font-bold text-green-600">₹{(500 * (1 - tier.discount / 100)).toFixed(0)}</span>
                </p>
              </div>
            </div>
          ))}
        </div>

        <div className="bg-yellow-50 dark:bg-yellow-950 p-4 rounded-xl border border-yellow-200 dark:border-yellow-800">
          <p className="text-sm font-semibold text-yellow-800 dark:text-yellow-400 mb-1">
            🎯 Need 100+ stickers?
          </p>
          <p className="text-xs text-yellow-700 dark:text-yellow-500">
            Contact us on WhatsApp (+91 93540 40524) for custom quotes and even better pricing!
          </p>
        </div>
      </CardContent>
    </Card>
  );
}
