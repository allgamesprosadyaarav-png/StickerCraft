import { useState, useEffect } from 'react';
import { X, Target, CheckCircle2, Clock, Gift } from 'lucide-react';
import { Button } from '../ui/button';
import { toast } from '../../hooks/use-toast';

interface Challenge {
  id: string;
  title: string;
  description: string;
  reward: string;
  progress: number;
  goal: number;
  completed: boolean;
  emoji: string;
}

export function DailyChallenges({ onClose }: { onClose: () => void }) {
  const [challenges, setChallenges] = useState<Challenge[]>([]);
  const [timeUntilReset, setTimeUntilReset] = useState('');

  useEffect(() => {
    loadChallenges();
    updateResetTimer();
    const interval = setInterval(updateResetTimer, 1000);
    return () => clearInterval(interval);
  }, []);

  const loadChallenges = () => {
    const today = new Date().toDateString();
    const savedData = JSON.parse(localStorage.getItem('dailyChallenges') || '{}');

    // Reset if new day
    if (savedData.date !== today) {
      const newChallenges = generateDailyChallenges();
      localStorage.setItem('dailyChallenges', JSON.stringify({
        date: today,
        challenges: newChallenges,
      }));
      setChallenges(newChallenges);
    } else {
      setChallenges(savedData.challenges);
    }
  };

  const generateDailyChallenges = (): Challenge[] => {
    const orders = JSON.parse(localStorage.getItem('orders') || '[]');
    const cartItems = JSON.parse(localStorage.getItem('cart-storage') || '{"state":{"items":[]}}').state.items;
    const aiGenerated = parseInt(localStorage.getItem('aiStickersGenerated') || '0');

    return [
      {
        id: 'add_to_cart',
        title: 'Shopping Spree',
        description: 'Add 3 items to your cart',
        reward: '30 Loyalty Points',
        progress: cartItems.length,
        goal: 3,
        completed: cartItems.length >= 3,
        emoji: '🛒',
      },
      {
        id: 'generate_ai',
        title: 'AI Creator',
        description: 'Generate 1 AI sticker today',
        reward: '50 Loyalty Points',
        progress: aiGenerated,
        goal: 1,
        completed: aiGenerated >= 1,
        emoji: '✨',
      },
      {
        id: 'visit_store',
        title: 'Window Shopping',
        description: 'Browse the store for 5 minutes',
        reward: '20 Loyalty Points',
        progress: 1,
        goal: 1,
        completed: true, // Auto-complete on visit
        emoji: '👀',
      },
      {
        id: 'wishlist_add',
        title: 'Wishful Thinking',
        description: 'Add 2 items to wishlist',
        reward: '25 Loyalty Points',
        progress: JSON.parse(localStorage.getItem('wishlist-storage') || '{"state":{"items":[]}}').state.items.length,
        goal: 2,
        completed: JSON.parse(localStorage.getItem('wishlist-storage') || '{"state":{"items":[]}}').state.items.length >= 2,
        emoji: '❤️',
      },
      {
        id: 'spin_or_scratch',
        title: 'Feeling Lucky',
        description: 'Use Spin Wheel or Scratch Card',
        reward: '40 Loyalty Points',
        progress: JSON.parse(localStorage.getItem('availableOffers') || '[]').length > 0 ? 1 : 0,
        goal: 1,
        completed: JSON.parse(localStorage.getItem('availableOffers') || '[]').length > 0,
        emoji: '🎰',
      },
    ];
  };

  const updateResetTimer = () => {
    const now = new Date();
    const tomorrow = new Date(now);
    tomorrow.setDate(tomorrow.getDate() + 1);
    tomorrow.setHours(0, 0, 0, 0);
    
    const diff = tomorrow.getTime() - now.getTime();
    const hours = Math.floor(diff / (1000 * 60 * 60));
    const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
    const seconds = Math.floor((diff % (1000 * 60)) / 1000);
    
    setTimeUntilReset(`${hours}h ${minutes}m ${seconds}s`);
  };

  const claimReward = (challenge: Challenge) => {
    if (!challenge.completed) return;

    const claimed = JSON.parse(localStorage.getItem('claimedChallenges') || '[]');
    if (claimed.includes(challenge.id)) {
      toast({
        title: 'Already Claimed',
        description: 'You already claimed this reward!',
      });
      return;
    }

    claimed.push(challenge.id);
    localStorage.setItem('claimedChallenges', JSON.stringify(claimed));

    toast({
      title: '🎉 Reward Claimed!',
      description: `You earned ${challenge.reward}`,
    });

    // Update challenges
    loadChallenges();
  };

  const completedCount = challenges.filter((c) => c.completed).length;
  const completionPercentage = (completedCount / challenges.length) * 100;

  return (
    <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 overflow-y-auto animate-in fade-in">
      <div className="min-h-screen flex items-center justify-center p-4">
        <div className="glass bg-card rounded-3xl max-w-2xl w-full p-6 animate-in zoom-in-95">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-3">
              <div className="w-14 h-14 bg-gradient-to-br from-green-400 to-emerald-400 rounded-2xl flex items-center justify-center">
                <Target className="w-8 h-8 text-white" />
              </div>
              <div>
                <h2 className="text-3xl font-bold">Daily Challenges</h2>
                <p className="text-sm text-muted-foreground flex items-center gap-1">
                  <Clock className="w-3 h-3" />
                  Resets in {timeUntilReset}
                </p>
              </div>
            </div>
            <button onClick={onClose} className="hover:bg-muted rounded-full p-2">
              <X className="w-6 h-6" />
            </button>
          </div>

          {/* Overall Progress */}
          <div className="mb-6 bg-muted/50 p-4 rounded-xl">
            <div className="flex justify-between text-sm mb-2">
              <span className="font-medium">Today's Progress</span>
              <span className="text-primary font-bold">
                {completedCount} / {challenges.length} Completed
              </span>
            </div>
            <div className="bg-background rounded-full h-3 overflow-hidden">
              <div
                className="h-full bg-gradient-to-r from-green-400 to-emerald-400 transition-all duration-500"
                style={{ width: `${completionPercentage}%` }}
              />
            </div>
          </div>

          {/* Challenges List */}
          <div className="space-y-3">
            {challenges.map((challenge) => (
              <div
                key={challenge.id}
                className={`relative overflow-hidden rounded-xl border-2 p-4 transition-all ${
                  challenge.completed
                    ? 'border-green-400 bg-green-400/10'
                    : 'border-muted bg-muted/30'
                }`}
              >
                <div className="flex items-start gap-4">
                  <div className="text-4xl">{challenge.emoji}</div>
                  
                  <div className="flex-1 space-y-2">
                    <div className="flex items-start justify-between">
                      <div>
                        <h3 className="font-bold text-lg">{challenge.title}</h3>
                        <p className="text-sm text-muted-foreground">{challenge.description}</p>
                      </div>
                      {challenge.completed && (
                        <CheckCircle2 className="w-6 h-6 text-green-500 flex-shrink-0" />
                      )}
                    </div>

                    <div className="space-y-1">
                      <div className="flex justify-between text-xs">
                        <span className="text-muted-foreground">Progress</span>
                        <span className="font-medium">
                          {Math.min(challenge.progress, challenge.goal)} / {challenge.goal}
                        </span>
                      </div>
                      <div className="bg-muted rounded-full h-2 overflow-hidden">
                        <div
                          className="h-full bg-gradient-to-r from-green-400 to-emerald-400 transition-all duration-500"
                          style={{
                            width: `${Math.min((challenge.progress / challenge.goal) * 100, 100)}%`,
                          }}
                        />
                      </div>
                    </div>

                    <div className="flex items-center justify-between">
                      <div className="bg-yellow-400/20 text-yellow-700 dark:text-yellow-300 px-3 py-1 rounded-full text-xs font-semibold inline-flex items-center gap-1">
                        <Gift className="w-3 h-3" />
                        {challenge.reward}
                      </div>
                      
                      {challenge.completed && (
                        <Button
                          size="sm"
                          onClick={() => claimReward(challenge)}
                          className="bg-green-500 hover:bg-green-600"
                        >
                          Claim Reward
                        </Button>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {completedCount === challenges.length && (
            <div className="mt-6 text-center bg-gradient-to-r from-green-400 to-emerald-400 text-white p-6 rounded-2xl">
              <h3 className="text-2xl font-bold mb-2">🎉 All Challenges Complete!</h3>
              <p className="text-sm opacity-90">
                Amazing work! Come back tomorrow for new challenges!
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
