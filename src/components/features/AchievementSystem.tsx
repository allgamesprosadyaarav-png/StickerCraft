import { useState, useEffect } from 'react';
import { X, Trophy, Star, Zap, Award, Crown, Target, Sparkles } from 'lucide-react';
import { useAuthStore } from '../../stores/authStore';
import { useCartStore } from '../../stores/cartStore';
import { Button } from '../ui/button';

interface Achievement {
  id: string;
  title: string;
  description: string;
  icon: any;
  color: string;
  requirement: number;
  progress: number;
  unlocked: boolean;
  reward: string;
}

export function AchievementSystem({ onClose }: { onClose: () => void }) {
  const user = useAuthStore((state) => state.user);
  const orders = JSON.parse(localStorage.getItem('orders') || '[]');
  const cartItems = useCartStore((state) => state.items);

  const [achievements, setAchievements] = useState<Achievement[]>([
    {
      id: 'first_order',
      title: 'First Steps',
      description: 'Complete your first order',
      icon: Star,
      color: 'from-yellow-400 to-orange-400',
      requirement: 1,
      progress: orders.length,
      unlocked: orders.length >= 1,
      reward: '50 Loyalty Points',
    },
    {
      id: 'collector_5',
      title: 'Sticker Collector',
      description: 'Order 5 stickers or keychains',
      icon: Trophy,
      color: 'from-blue-400 to-cyan-400',
      requirement: 5,
      progress: orders.length,
      unlocked: orders.length >= 5,
      reward: '100 Loyalty Points',
    },
    {
      id: 'ai_creator',
      title: 'AI Artist',
      description: 'Generate 3 AI stickers',
      icon: Sparkles,
      color: 'from-purple-400 to-pink-400',
      requirement: 3,
      progress: parseInt(localStorage.getItem('aiStickersGenerated') || '0'),
      unlocked: parseInt(localStorage.getItem('aiStickersGenerated') || '0') >= 3,
      reward: 'Free Premium Sticker',
    },
    {
      id: 'premium_member',
      title: 'VIP Member',
      description: 'Unlock Premium subscription',
      icon: Crown,
      color: 'from-yellow-500 to-amber-500',
      requirement: 1,
      progress: user?.isPremium ? 1 : 0,
      unlocked: user?.isPremium || false,
      reward: 'Exclusive Badge',
    },
    {
      id: 'big_spender',
      title: 'Big Spender',
      description: 'Spend over ₹1000',
      icon: Award,
      color: 'from-green-400 to-emerald-400',
      requirement: 1000,
      progress: orders.reduce((sum: number, order: any) => sum + order.total, 0),
      unlocked: orders.reduce((sum: number, order: any) => sum + order.total, 0) >= 1000,
      reward: '15% Discount Coupon',
    },
    {
      id: 'lucky_winner',
      title: 'Lucky Winner',
      description: 'Win from Spin Wheel or Scratch Card',
      icon: Zap,
      color: 'from-pink-400 to-rose-400',
      requirement: 1,
      progress: JSON.parse(localStorage.getItem('availableOffers') || '[]').length,
      unlocked: JSON.parse(localStorage.getItem('availableOffers') || '[]').length >= 1,
      reward: 'Mystery Box',
    },
    {
      id: 'daily_visitor',
      title: 'Daily Visitor',
      description: 'Visit StickerCraft 7 days in a row',
      icon: Target,
      color: 'from-indigo-400 to-purple-400',
      requirement: 7,
      progress: parseInt(localStorage.getItem('dailyVisitStreak') || '0'),
      unlocked: parseInt(localStorage.getItem('dailyVisitStreak') || '0') >= 7,
      reward: '200 Loyalty Points',
    },
  ]);

  const unlockedCount = achievements.filter((a) => a.unlocked).length;
  const totalCount = achievements.length;
  const completionPercentage = Math.round((unlockedCount / totalCount) * 100);

  return (
    <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 overflow-y-auto animate-in fade-in">
      <div className="min-h-screen flex items-center justify-center p-4">
        <div className="glass bg-card rounded-3xl max-w-4xl w-full p-6 animate-in zoom-in-95">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-3">
              <div className="w-14 h-14 bg-gradient-to-br from-yellow-400 to-orange-400 rounded-2xl flex items-center justify-center">
                <Trophy className="w-8 h-8 text-white" />
              </div>
              <div>
                <h2 className="text-3xl font-bold">Achievements</h2>
                <p className="text-sm text-muted-foreground">
                  {unlockedCount} of {totalCount} unlocked ({completionPercentage}%)
                </p>
              </div>
            </div>
            <button onClick={onClose} className="hover:bg-muted rounded-full p-2">
              <X className="w-6 h-6" />
            </button>
          </div>

          {/* Progress Bar */}
          <div className="mb-8 bg-muted rounded-full h-4 overflow-hidden">
            <div
              className="h-full bg-gradient-to-r from-yellow-400 via-orange-400 to-red-400 transition-all duration-1000"
              style={{ width: `${completionPercentage}%` }}
            />
          </div>

          {/* Achievements Grid */}
          <div className="grid md:grid-cols-2 gap-4">
            {achievements.map((achievement) => {
              const Icon = achievement.icon;
              const progress = Math.min((achievement.progress / achievement.requirement) * 100, 100);

              return (
                <div
                  key={achievement.id}
                  className={`relative overflow-hidden rounded-2xl border-2 p-6 transition-all ${
                    achievement.unlocked
                      ? 'border-yellow-400 bg-gradient-to-br from-yellow-400/10 to-orange-400/10'
                      : 'border-muted bg-muted/30 opacity-70'
                  }`}
                >
                  {achievement.unlocked && (
                    <div className="absolute top-2 right-2 bg-yellow-400 text-white px-3 py-1 rounded-full text-xs font-bold flex items-center gap-1">
                      <Star className="w-3 h-3" />
                      Unlocked!
                    </div>
                  )}

                  <div className="flex gap-4">
                    <div
                      className={`flex-shrink-0 w-16 h-16 bg-gradient-to-br ${achievement.color} rounded-2xl flex items-center justify-center ${
                        !achievement.unlocked && 'grayscale'
                      }`}
                    >
                      <Icon className="w-8 h-8 text-white" />
                    </div>

                    <div className="flex-1 space-y-2">
                      <h3 className="font-bold text-lg">{achievement.title}</h3>
                      <p className="text-sm text-muted-foreground">{achievement.description}</p>

                      <div className="space-y-1">
                        <div className="flex justify-between text-xs">
                          <span className="text-muted-foreground">Progress</span>
                          <span className="font-medium">
                            {achievement.progress} / {achievement.requirement}
                          </span>
                        </div>
                        <div className="bg-muted rounded-full h-2 overflow-hidden">
                          <div
                            className={`h-full bg-gradient-to-r ${achievement.color} transition-all duration-500`}
                            style={{ width: `${progress}%` }}
                          />
                        </div>
                      </div>

                      <div className="bg-primary/10 text-primary px-3 py-1 rounded-full text-xs font-semibold inline-block">
                        🎁 {achievement.reward}
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          <div className="mt-8 text-center bg-gradient-to-r from-primary/10 to-purple-500/10 p-6 rounded-2xl border border-primary/20">
            <p className="text-lg font-semibold mb-2">
              Keep unlocking achievements to earn exclusive rewards! 🏆
            </p>
            <p className="text-sm text-muted-foreground">
              Rewards are automatically credited to your account when unlocked
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
