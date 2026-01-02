import { useState } from 'react';
import { Star, ThumbsUp, MessageCircle, User } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { useAuthStore } from '../../stores/authStore';
import { toast } from '../../hooks/use-toast';

interface Review {
  id: string;
  userName: string;
  userAvatar: string;
  rating: number;
  comment: string;
  date: string;
  likes: number;
  productName: string;
  images?: string[];
}

const SAMPLE_REVIEWS: Review[] = [
  {
    id: 'rev-1',
    userName: 'Priya Sharma',
    userAvatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=priya',
    rating: 5,
    comment: 'Absolutely love the Tanjiro sticker! Quality is amazing and colors are so vibrant. Fast delivery too! 🔥',
    date: '2 days ago',
    likes: 24,
    productName: 'Tanjiro Kamado Sticker',
  },
  {
    id: 'rev-2',
    userName: 'Rahul Kumar',
    userAvatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=rahul',
    rating: 5,
    comment: 'The AI sticker generation is mind-blowing! Created a custom Naruto sticker and it turned out perfect. Will order more!',
    date: '5 days ago',
    likes: 18,
    productName: 'AI Generated Custom Sticker',
  },
  {
    id: 'rev-3',
    userName: 'Sneha Patel',
    userAvatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=sneha',
    rating: 4,
    comment: 'Luffy keychain is adorable! The acrylic quality is top-notch. Only wish there were more One Piece characters available.',
    date: '1 week ago',
    likes: 15,
    productName: 'Luffy Straw Hat Keychain',
  },
  {
    id: 'rev-4',
    userName: 'Arjun Reddy',
    userAvatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=arjun',
    rating: 5,
    comment: 'Got the Demon Slayer pack for my sister - she absolutely loves it! The free stickers with 2 keychains offer is awesome 🎁',
    date: '1 week ago',
    likes: 32,
    productName: 'Demon Slayer Pack',
  },
  {
    id: 'rev-5',
    userName: 'Meera Joshi',
    userAvatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=meera',
    rating: 5,
    comment: 'Best quality anime stickers in India! The Goku sticker is exactly like the picture. Premium membership is totally worth it for the quick delivery! 💯',
    date: '3 days ago',
    likes: 41,
    productName: 'Goku Sticker',
  },
  {
    id: 'rev-6',
    userName: 'Vikram Singh',
    userAvatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=vikram',
    rating: 5,
    comment: 'Ordered 10 custom stickers for my laptop. Each one is perfect! Customer service responded instantly on Instagram. Highly recommend! ⭐',
    date: '4 days ago',
    likes: 28,
    productName: 'Custom Design Stickers',
  },
  {
    id: 'rev-7',
    userName: 'Ananya Das',
    userAvatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=ananya',
    rating: 5,
    comment: 'The scratch card feature is so fun! Won a 20% discount and used it immediately. Nezuko keychain quality is outstanding! 😍',
    date: '6 days ago',
    likes: 19,
    productName: 'Nezuko Keychain',
  },
  {
    id: 'rev-8',
    userName: 'Kabir Mehta',
    userAvatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=kabir',
    rating: 4,
    comment: 'Great variety of anime characters! Got Eren, Levi and Kakashi stickers. All look fantastic. Delivery was on time. Would give 5 stars if there were AOT keychains too!',
    date: '1 week ago',
    likes: 22,
    productName: 'Anime Stickers Pack',
  },
  {
    id: 'rev-9',
    userName: 'Riya Kapoor',
    userAvatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=riya',
    rating: 5,
    comment: 'AI-generated my dog as an anime character sticker! Results are AMAZING! This feature alone is worth trying StickerCraft. Plus free delivery over ₹50 is great! 🐕✨',
    date: '1 week ago',
    likes: 47,
    productName: 'AI Custom Sticker',
  },
  {
    id: 'rev-10',
    userName: 'Aarav Gupta',
    userAvatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=aarav',
    rating: 5,
    comment: 'Bought the One Piece bundle - Luffy, Zoro, and Nami keychains. Premium acrylic quality with vibrant colors! Delivery was super fast with Delhivery. A++',
    date: '2 weeks ago',
    likes: 35,
    productName: 'One Piece Keychains Bundle',
  },
  {
    id: 'rev-11',
    userName: 'Ishita Verma',
    userAvatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=ishita',
    rating: 5,
    comment: 'The loyalty program is fantastic! Already earned 500 points. Mystery box gave me 3 exclusive stickers! Customer for life! 🎁',
    date: '2 weeks ago',
    likes: 30,
    productName: 'Mystery Box',
  },
  {
    id: 'rev-12',
    userName: 'Rohan Nair',
    userAvatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=rohan',
    rating: 4,
    comment: 'Saitama sticker is hilarious and high quality! Sticks well on my phone case. Only improvement would be more One Punch Man characters. Still, very satisfied! 👊',
    date: '2 weeks ago',
    likes: 16,
    productName: 'Saitama Sticker',
  },
  {
    id: 'rev-13',
    userName: 'Diya Shah',
    userAvatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=diya',
    rating: 5,
    comment: 'Bought stickers for my whole friend group! Everyone loved them. The referral program is generous too - earned ₹400 already! Thank you StickerCraft! 💖',
    date: '3 weeks ago',
    likes: 53,
    productName: 'Mixed Anime Stickers',
  },
  {
    id: 'rev-14',
    userName: 'Aditya Jain',
    userAvatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=aditya',
    rating: 5,
    comment: 'Premium membership pays for itself! Quick delivery, exclusive stickers, and priority support. The Gojo holographic sticker is INSANE! 🔥',
    date: '3 weeks ago',
    likes: 38,
    productName: 'Premium Gojo Sticker',
  },
  {
    id: 'rev-15',
    userName: 'Nisha Pandey',
    userAvatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=nisha',
    rating: 5,
    comment: 'Perfect gift for anime fans! Ordered Demon Slayer pack for my brother\'s birthday. He was thrilled! Packaging was beautiful too. Will order again! 🎂',
    date: '3 weeks ago',
    likes: 26,
    productName: 'Demon Slayer Pack',
  },
];

export function ReviewsSection() {
  const user = useAuthStore((state) => state.user);
  const [reviews] = useState<Review[]>(SAMPLE_REVIEWS);
  const [newReview, setNewReview] = useState({ rating: 5, comment: '' });
  const [showReviewForm, setShowReviewForm] = useState(false);

  const handleSubmitReview = () => {
    if (!user) {
      toast({
        title: 'Sign in required',
        description: 'Please sign in to leave a review',
        variant: 'destructive',
      });
      return;
    }

    if (!newReview.comment.trim()) {
      toast({
        title: 'Comment required',
        description: 'Please write a comment for your review',
        variant: 'destructive',
      });
      return;
    }

    toast({
      title: 'Review submitted!',
      description: 'Thank you for your feedback! 🌟',
    });
    setNewReview({ rating: 5, comment: '' });
    setShowReviewForm(false);
  };

  const renderStars = (rating: number, interactive = false, onRate?: (rating: number) => void) => {
    return (
      <div className="flex gap-1">
        {[1, 2, 3, 4, 5].map((star) => (
          <button
            key={star}
            onClick={() => interactive && onRate?.(star)}
            disabled={!interactive}
            className={interactive ? 'cursor-pointer transition-transform hover:scale-110' : ''}
          >
            <Star
              className={`w-5 h-5 ${
                star <= rating
                  ? 'fill-yellow-400 text-yellow-400'
                  : 'text-muted-foreground'
              }`}
            />
          </button>
        ))}
      </div>
    );
  };

  return (
    <Card className="glass">
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="text-2xl">Customer Reviews</CardTitle>
            <p className="text-sm text-muted-foreground mt-1">
              See what our customers are saying
            </p>
          </div>
          <Button onClick={() => setShowReviewForm(!showReviewForm)} className="gap-2">
            <MessageCircle className="w-4 h-4" />
            Write Review
          </Button>
        </div>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Write Review Form */}
        {showReviewForm && (
          <Card className="border-2 border-primary/20">
            <CardContent className="p-4 space-y-4">
              <div className="space-y-2">
                <label className="text-sm font-medium">Your Rating</label>
                {renderStars(newReview.rating, true, (rating) =>
                  setNewReview({ ...newReview, rating })
                )}
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium">Your Review</label>
                <Input
                  placeholder="Share your experience..."
                  value={newReview.comment}
                  onChange={(e) =>
                    setNewReview({ ...newReview, comment: e.target.value })
                  }
                  className="min-h-[100px]"
                />
              </div>
              <div className="flex gap-2">
                <Button onClick={handleSubmitReview} className="flex-1">
                  Submit Review
                </Button>
                <Button
                  onClick={() => setShowReviewForm(false)}
                  variant="outline"
                  className="flex-1"
                >
                  Cancel
                </Button>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Reviews List */}
        <div className="space-y-4">
          {reviews.map((review) => (
            <Card key={review.id} className="glass">
              <CardContent className="p-4 space-y-3">
                <div className="flex items-start gap-3">
                  <div className="w-10 h-10 rounded-full bg-gradient-to-br from-primary to-secondary flex items-center justify-center overflow-hidden">
                    {review.userAvatar ? (
                      <img src={review.userAvatar} alt={review.userName} className="w-full h-full" />
                    ) : (
                      <User className="w-6 h-6 text-white" />
                    )}
                  </div>
                  <div className="flex-1 space-y-1">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="font-semibold">{review.userName}</p>
                        <p className="text-xs text-muted-foreground">{review.date}</p>
                      </div>
                      {renderStars(review.rating)}
                    </div>
                    <p className="text-sm text-primary font-medium">{review.productName}</p>
                    <p className="text-sm text-muted-foreground mt-2">{review.comment}</p>
                    <div className="flex items-center gap-4 mt-3">
                      <Button variant="ghost" size="sm" className="gap-2 h-8">
                        <ThumbsUp className="w-3 h-3" />
                        <span className="text-xs">Helpful ({review.likes})</span>
                      </Button>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Load More */}
        <Button variant="outline" className="w-full">
          Load More Reviews
        </Button>
      </CardContent>
    </Card>
  );
}
