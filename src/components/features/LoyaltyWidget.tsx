import { Award, Trophy, Crown, Zap, Gift, Sparkles } from 'lucide-react';
import { useState } from 'react';
import { useAuthStore } from '../../stores/authStore';
import { LOYALTY_TIERS } from '../../constants/loyalty';
import { REWARDS_CATALOG } from '../../constants/rewards';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Progress } from '../ui/progress';
import { Button } from '../ui/button';
import { toast } from '../../hooks/use-toast';
import { RedeemedReward } from '../../types';

export function LoyaltyWidget() {
  const user = useAuthStore((state) => state.user);
  const redeemPoints = useAuthStore((state) => state.redeemPoints);
  const [showRewards, setShowRewards] = useState(false);

  if (!user) return null;

  const currentTierIndex = LOYALTY_TIERS.findIndex((t) => t.name === user.loyaltyTier);
  const currentTier = LOYALTY_TIERS[currentTierIndex];
  const nextTier = LOYALTY_TIERS[currentTierIndex + 1];

  const pointsInCurrentTier = user.loyaltyPoints - currentTier.minPoints;
  const pointsNeededForNext = nextTier
    ? nextTier.minPoints - currentTier.minPoints
    : 0;
  const progress = nextTier
    ? (pointsInCurrentTier / pointsNeededForNext) * 100
    : 100;

  const tierIcons = {
    Bronze: Award,
    Silver: Zap,
    Gold: Trophy,
    Platinum: Crown,
  };

  const tierColors = {
    Bronze: 'text-orange-600',
    Silver: 'text-gray-400',
    Gold: 'text-yellow-500',
    Platinum: 'text-purple-500',
  };

  const TierIcon = tierIcons[user.loyaltyTier];

  return (
    <Card className="glass">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <TierIcon className={`w-6 h-6 ${tierColors[user.loyaltyTier]}`} />
          <span className={tierColors[user.loyaltyTier]}>{user.loyaltyTier} Member</span>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-2">
          <div className="flex justify-between text-sm">
            <span className="font-medium">Your Points</span>
            <span className="font-bold text-primary">{user.loyaltyPoints} pts</span>
          </div>

          {nextTier && (
            <>
              <Progress value={progress} className="h-2" />
              <p className="text-xs text-muted-foreground">
                {nextTier.minPoints - user.loyaltyPoints} points to {nextTier.name}
              </p>
            </>
          )}
        </div>

        <div className="space-y-2">
          <p className="text-sm font-medium">Your Perks:</p>
          <ul className="space-y-1">
            {currentTier.perks.map((perk, index) => (
              <li key={index} className="text-xs text-muted-foreground flex items-start gap-2">
                <span className="text-primary mt-0.5">✓</span>
                <span>{perk}</span>
              </li>
            ))}
          </ul>
        </div>

        {currentTier.discount > 0 && (
          <div className="bg-primary/10 border-2 border-primary rounded-lg p-3 text-center">
            <p className="text-sm font-bold text-primary">
              You save {currentTier.discount}% on every order!
            </p>
          </div>
        )}

        <Button
          variant="outline"
          className="w-full gap-2"
          onClick={() => setShowRewards(!showRewards)}
        >
          <Gift className="w-4 h-4" />
          {showRewards ? 'Hide' : 'View'} Rewards
        </Button>

        {showRewards && (
          <div className="space-y-2 max-h-64 overflow-y-auto">
            <p className="text-sm font-medium flex items-center gap-1">
              <Sparkles className="w-4 h-4 text-yellow-500" />
              Redeem Your Points:
            </p>
            {REWARDS_CATALOG.map((reward) => {
              const canAfford = user.loyaltyPoints >= reward.pointsCost;
              
              const handleRedeem = () => {
                const redeemedReward: RedeemedReward = {
                  id: crypto.randomUUID(),
                  userId: user.id,
                  rewardId: reward.id,
                  reward,
                  redeemedAt: new Date().toISOString(),
                  used: false,
                };
                
                const success = redeemPoints(reward.pointsCost, redeemedReward);
                
                if (success) {
                  toast({
                    title: `Reward Redeemed! ${reward.icon}`,
                    description: `You've redeemed ${reward.name}`,
                  });
                } else {
                  toast({
                    title: 'Not enough points',
                    description: `You need ${reward.pointsCost - user.loyaltyPoints} more points`,
                    variant: 'destructive',
                  });
                }
              };

              return (
                <div
                  key={reward.id}
                  className={`border rounded-lg p-3 space-y-2 ${
                    canAfford ? 'border-primary/50 bg-primary/5' : 'opacity-60'
                  }`}
                >
                  <div className="flex items-start justify-between gap-2">
                    <div className="flex-1">
                      <p className="text-sm font-medium flex items-center gap-1">
                        <span>{reward.icon}</span>
                        {reward.name}
                      </p>
                      <p className="text-xs text-muted-foreground">
                        {reward.description}
                      </p>
                    </div>
                    <div className="text-right">
                      <p className="text-sm font-bold text-primary">
                        {reward.pointsCost} pts
                      </p>
                    </div>
                  </div>
                  <Button
                    size="sm"
                    variant={canAfford ? 'default' : 'outline'}
                    className="w-full"
                    disabled={!canAfford}
                    onClick={handleRedeem}
                  >
                    {canAfford ? 'Redeem' : 'Not Enough Points'}
                  </Button>
                </div>
              );
            })}
          </div>
        )}
      </CardContent>
    </Card>
  );
}
