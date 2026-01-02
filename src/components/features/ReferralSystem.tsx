import { useState } from 'react';
import { Gift, Copy, Check, Users, Star } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { useAuthStore } from '../../stores/authStore';
import { toast } from '../../hooks/use-toast';

export function ReferralSystem() {
  const user = useAuthStore((state) => state.user);
  const [copied, setCopied] = useState(false);
  
  // Generate unique referral code based on user email
  const referralCode = user ? `STICKER${user.email.substring(0, 3).toUpperCase()}${user.name.substring(0, 3).toUpperCase()}` : 'STICKERXXX';
  const referralLink = `https://stickercraft.onspace.app/?ref=${referralCode}`;
  
  // Simulated referral stats
  const [referralStats] = useState({
    totalReferrals: 0,
    successfulReferrals: 0,
    earnedRewards: 0,
    pendingRewards: 0,
  });

  const handleCopyCode = () => {
    navigator.clipboard.writeText(referralCode);
    setCopied(true);
    toast({
      title: 'Copied!',
      description: 'Referral code copied to clipboard',
    });
    setTimeout(() => setCopied(false), 2000);
  };

  const handleCopyLink = () => {
    navigator.clipboard.writeText(referralLink);
    toast({
      title: 'Link Copied!',
      description: 'Share this link with your friends!',
    });
  };

  if (!user) return null;

  return (
    <Card className="glass border-2 border-primary/20">
      <CardHeader>
        <div className="flex items-center gap-3">
          <div className="bg-gradient-to-br from-purple-500 to-pink-500 p-3 rounded-full">
            <Gift className="w-6 h-6 text-white" />
          </div>
          <div>
            <CardTitle className="text-2xl">Refer & Earn</CardTitle>
            <p className="text-sm text-muted-foreground">Share the love, get rewards!</p>
          </div>
        </div>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* How it Works */}
        <div className="bg-gradient-to-r from-purple-50 to-pink-50 dark:from-purple-950/50 dark:to-pink-950/50 p-4 rounded-xl space-y-3">
          <p className="font-semibold text-sm">🎁 How it works:</p>
          <div className="space-y-2 text-sm text-muted-foreground">
            <div className="flex items-start gap-2">
              <span className="text-purple-600 dark:text-purple-400 font-bold">1.</span>
              <span>Share your referral code with friends</span>
            </div>
            <div className="flex items-start gap-2">
              <span className="text-purple-600 dark:text-purple-400 font-bold">2.</span>
              <span>They get ₹50 off on their first order</span>
            </div>
            <div className="flex items-start gap-2">
              <span className="text-purple-600 dark:text-purple-400 font-bold">3.</span>
              <span>You get ₹100 in rewards when they complete a purchase!</span>
            </div>
          </div>
        </div>

        {/* Referral Code */}
        <div className="space-y-3">
          <label className="text-sm font-medium">Your Referral Code</label>
          <div className="flex gap-2">
            <Input
              value={referralCode}
              readOnly
              className="font-mono text-lg font-bold bg-muted"
            />
            <Button onClick={handleCopyCode} variant="outline" className="gap-2">
              {copied ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
              {copied ? 'Copied!' : 'Copy'}
            </Button>
          </div>
        </div>

        {/* Referral Link */}
        <div className="space-y-3">
          <label className="text-sm font-medium">Your Referral Link</label>
          <div className="flex gap-2">
            <Input
              value={referralLink}
              readOnly
              className="text-sm bg-muted"
            />
            <Button onClick={handleCopyLink} variant="outline" size="sm">
              Share
            </Button>
          </div>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-2 gap-4">
          <div className="bg-muted/50 p-4 rounded-xl text-center space-y-1">
            <Users className="w-6 h-6 mx-auto text-primary" />
            <p className="text-2xl font-bold text-primary">{referralStats.totalReferrals}</p>
            <p className="text-xs text-muted-foreground">Total Referrals</p>
          </div>
          <div className="bg-muted/50 p-4 rounded-xl text-center space-y-1">
            <Check className="w-6 h-6 mx-auto text-green-600" />
            <p className="text-2xl font-bold text-green-600">{referralStats.successfulReferrals}</p>
            <p className="text-xs text-muted-foreground">Successful</p>
          </div>
          <div className="bg-muted/50 p-4 rounded-xl text-center space-y-1">
            <Star className="w-6 h-6 mx-auto text-yellow-600" />
            <p className="text-2xl font-bold text-yellow-600">₹{referralStats.earnedRewards}</p>
            <p className="text-xs text-muted-foreground">Earned</p>
          </div>
          <div className="bg-muted/50 p-4 rounded-xl text-center space-y-1">
            <Gift className="w-6 h-6 mx-auto text-purple-600" />
            <p className="text-2xl font-bold text-purple-600">₹{referralStats.pendingRewards}</p>
            <p className="text-xs text-muted-foreground">Pending</p>
          </div>
        </div>

        {/* Social Share Buttons */}
        <div className="space-y-2">
          <p className="text-sm font-medium">Share on social media:</p>
          <div className="grid grid-cols-3 gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => {
                const text = `Check out StickerCraft! Use my code ${referralCode} to get ₹50 off your first order! ${referralLink}`;
                window.open(`https://wa.me/?text=${encodeURIComponent(text)}`, '_blank');
              }}
              className="gap-2"
            >
              <span>📱</span>
              WhatsApp
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => {
                const text = `Check out StickerCraft! Use code ${referralCode} for ₹50 off! ${referralLink}`;
                window.open(`https://twitter.com/intent/tweet?text=${encodeURIComponent(text)}`, '_blank');
              }}
              className="gap-2"
            >
              <span>🐦</span>
              Twitter
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => {
                handleCopyLink();
                toast({
                  title: 'Ready to share!',
                  description: 'Link copied - paste it anywhere!',
                });
              }}
              className="gap-2"
            >
              <span>📧</span>
              Other
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
