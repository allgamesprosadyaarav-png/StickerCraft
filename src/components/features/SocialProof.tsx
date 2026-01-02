import { useEffect, useState } from 'react';
import { ShoppingBag, MapPin, Clock } from 'lucide-react';

interface Notification {
  id: string;
  message: string;
  location: string;
  timeAgo: string;
  product: string;
}

const SAMPLE_NOTIFICATIONS: Notification[] = [
  { id: '1', message: 'Rahul from Mumbai just purchased', location: 'Mumbai', timeAgo: '2 minutes ago', product: 'Tanjiro Sticker' },
  { id: '2', message: 'Priya from Delhi just purchased', location: 'Delhi', timeAgo: '5 minutes ago', product: 'Naruto Keychain' },
  { id: '3', message: 'Arjun from Bangalore just purchased', location: 'Bangalore', timeAgo: '8 minutes ago', product: 'AI Custom Sticker' },
  { id: '4', message: 'Sneha from Pune just purchased', location: 'Pune', timeAgo: '12 minutes ago', product: 'Luffy Keychain' },
  { id: '5', message: 'Vikram from Hyderabad just purchased', location: 'Hyderabad', timeAgo: '15 minutes ago', product: 'Demon Slayer Pack' },
  { id: '6', message: 'Meera from Chennai just purchased', location: 'Chennai', timeAgo: '18 minutes ago', product: 'Goku Sticker' },
];

export function SocialProof() {
  const [currentNotification, setCurrentNotification] = useState<Notification | null>(null);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const showNotification = () => {
      const randomNotification = SAMPLE_NOTIFICATIONS[Math.floor(Math.random() * SAMPLE_NOTIFICATIONS.length)];
      setCurrentNotification(randomNotification);
      setIsVisible(true);

      // Hide after 5 seconds
      setTimeout(() => {
        setIsVisible(false);
      }, 5000);
    };

    // Show first notification after 10 seconds
    const initialTimer = setTimeout(showNotification, 10000);

    // Then show notifications every 20-30 seconds
    const interval = setInterval(showNotification, Math.random() * 10000 + 20000);

    return () => {
      clearTimeout(initialTimer);
      clearInterval(interval);
    };
  }, []);

  if (!isVisible || !currentNotification) return null;

  return (
    <div className="fixed bottom-6 left-6 z-50 animate-in slide-in-from-left duration-500">
      <div className="bg-background/95 backdrop-blur-lg border-2 border-primary/20 rounded-2xl shadow-2xl p-4 max-w-sm">
        <div className="flex items-start gap-3">
          <div className="bg-gradient-to-br from-primary to-secondary p-2.5 rounded-full">
            <ShoppingBag className="w-5 h-5 text-white" />
          </div>
          <div className="flex-1 space-y-1">
            <p className="font-semibold text-sm">{currentNotification.message}</p>
            <p className="text-xs text-primary font-medium">{currentNotification.product}</p>
            <div className="flex items-center gap-3 text-xs text-muted-foreground">
              <span className="flex items-center gap-1">
                <MapPin className="w-3 h-3" />
                {currentNotification.location}
              </span>
              <span className="flex items-center gap-1">
                <Clock className="w-3 h-3" />
                {currentNotification.timeAgo}
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
