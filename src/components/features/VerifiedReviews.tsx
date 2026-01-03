import { useState, useEffect } from 'react';
import { Star, CheckCircle, X } from 'lucide-react';
import { Card } from '../ui/card';

interface Review {
  id: string;
  name: string;
  rating: 5;
  comment: string;
  verified: true;
  date: string;
}

const VERIFIED_REVIEWS: Review[] = [
  {
    id: '1',
    name: 'Anjali Sharma',
    rating: 5,
    comment: 'Amazing quality stickers! The anime ones are perfect.',
    verified: true,
    date: '2 days ago',
  },
  {
    id: '2',
    name: 'Rohit Mehta',
    rating: 5,
    comment: 'AI-generated stickers exceeded my expectations!',
    verified: true,
    date: '5 days ago',
  },
  {
    id: '3',
    name: 'Kavya Nair',
    rating: 5,
    comment: 'Fast delivery and beautiful packaging. Will order again!',
    verified: true,
    date: '1 week ago',
  },
  {
    id: '4',
    name: 'Aryan Gupta',
    rating: 5,
    comment: 'The keychains are super durable and look fantastic!',
    verified: true,
    date: '1 week ago',
  },
];

export function VerifiedReviews() {
  const [currentReview, setCurrentReview] = useState<Review | null>(null);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const showReview = () => {
      const randomReview = VERIFIED_REVIEWS[Math.floor(Math.random() * VERIFIED_REVIEWS.length)];
      setCurrentReview(randomReview);
      setIsVisible(true);

      // Hide after 8 seconds
      setTimeout(() => {
        setIsVisible(false);
      }, 8000);
    };

    // Show first review after 15 seconds
    const initialTimer = setTimeout(showReview, 15000);

    // Then show reviews every 30-40 seconds
    const interval = setInterval(showReview, Math.random() * 10000 + 30000);

    return () => {
      clearTimeout(initialTimer);
      clearInterval(interval);
    };
  }, []);

  if (!isVisible || !currentReview) return null;

  return (
    <div className="fixed bottom-6 left-6 z-40 animate-in slide-in-from-left duration-500">
      <Card className="bg-background/95 backdrop-blur-lg border-2 border-green-500/20 shadow-2xl p-4 max-w-sm relative">
        <button
          onClick={() => setIsVisible(false)}
          className="absolute top-2 right-2 text-muted-foreground hover:text-foreground"
        >
          <X className="w-4 h-4" />
        </button>

        <div className="space-y-3">
          <div className="flex items-center gap-2">
            <div className="bg-gradient-to-br from-green-500 to-emerald-500 p-2 rounded-full">
              <CheckCircle className="w-4 h-4 text-white" />
            </div>
            <div className="flex-1">
              <p className="font-semibold text-sm">{currentReview.name}</p>
              <div className="flex items-center gap-1">
                {[...Array(currentReview.rating)].map((_, i) => (
                  <Star key={i} className="w-3 h-3 fill-yellow-500 text-yellow-500" />
                ))}
                <span className="text-xs text-green-600 font-medium ml-1 flex items-center gap-0.5">
                  <CheckCircle className="w-3 h-3" />
                  Verified Buyer
                </span>
              </div>
            </div>
          </div>

          <p className="text-sm text-muted-foreground italic">"{currentReview.comment}"</p>

          <p className="text-xs text-muted-foreground">{currentReview.date}</p>
        </div>
      </Card>
    </div>
  );
}
