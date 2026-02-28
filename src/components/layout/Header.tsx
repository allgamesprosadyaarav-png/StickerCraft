import { ShoppingCart, User, LogOut, Award, Palette, Instagram, Shield } from 'lucide-react';
import { useAuthStore } from '../../stores/authStore';
import { useCartStore } from '../../stores/cartStore';
import { Button } from '../ui/button';

interface HeaderProps {
  onNavigate: (page: 'store' | 'cart' | 'orders' | 'custom' | 'admin') => void;
  currentPage: string;
}

export function Header({ onNavigate, currentPage }: HeaderProps) {
  const { user, logout } = useAuthStore();
  const items = useCartStore((state) => state.items);
  
  const totalItems = items.reduce((sum, item) => sum + item.quantity, 0);

  return (
    <header className="sticky top-0 z-40 glass border-b border-white/20 shadow-lg">
      <div className="container mx-auto px-4 py-4">
        <div className="flex items-center justify-between">
          <button 
            onClick={() => onNavigate('store')}
            className="flex items-center gap-2 group"
          >
            <img 
              src="https://cdn-ai.onspace.ai/onspace/files/MStvs5typySWCzgRA3sfWS/pasted-image-1765116711106-6.jpeg" 
              alt="StickerCraft Logo" 
              className="w-10 h-10 object-contain group-hover:scale-110 transition-transform"
            />
            <h1 className="text-2xl font-bold text-gradient">StickerCraft</h1>
          </button>

          <div className="flex items-center gap-2">
            <a
              href="https://instagram.com/stickercraft_official"
              target="_blank"
              rel="noopener noreferrer"
              className="hidden md:flex items-center gap-1 glass px-3 py-1.5 rounded-full text-sm font-medium hover:bg-pink-500/20 transition-colors group"
              title="Follow us on Instagram"
            >
              <Instagram className="w-4 h-4 text-pink-500 group-hover:scale-110 transition-transform" />
              <span className="text-xs">@stickercraft_official</span>
            </a>
            {user && (
              <>
                <div className="hidden md:flex items-center gap-2 glass px-4 py-2 rounded-full">
                  <Award className={`w-5 h-5 ${
                    user.loyaltyTier === 'Platinum' ? 'text-purple-500' :
                    user.loyaltyTier === 'Gold' ? 'text-yellow-500' :
                    user.loyaltyTier === 'Silver' ? 'text-gray-400' :
                    'text-orange-600'
                  }`} />
                  <span className="text-sm font-medium">
                    {user.loyaltyPoints} pts
                  </span>
                </div>

                <Button
                  variant={currentPage === 'custom' ? 'default' : 'ghost'}
                  size="sm"
                  onClick={() => onNavigate('custom')}
                  className="gap-2"
                >
                  <Palette className="w-4 h-4" />
                  <span className="hidden sm:inline">Design</span>
                </Button>

                <Button
                  variant={currentPage === 'orders' ? 'default' : 'ghost'}
                  size="sm"
                  onClick={() => onNavigate('orders')}
                  className="hidden md:flex"
                >
                  <User className="w-4 h-4 mr-2" />
                  Orders
                </Button>

                <Button
                  variant={currentPage === 'admin' ? 'default' : 'ghost'}
                  size="sm"
                  onClick={() => onNavigate('admin')}
                  className="hidden md:flex gap-2 bg-purple-500/20 hover:bg-purple-500/30"
                >
                  <Shield className="w-4 h-4" />
                  Admin
                </Button>
              </>
            )}

            <Button
              variant={currentPage === 'cart' ? 'default' : 'ghost'}
              size="sm"
              onClick={() => onNavigate('cart')}
              className="relative"
            >
              <ShoppingCart className="w-4 h-4" />
              {totalItems > 0 && (
                <span className="absolute -top-1 -right-1 bg-secondary text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                  {totalItems}
                </span>
              )}
            </Button>

            {user && (
              <Button
                variant="ghost"
                size="sm"
                onClick={logout}
                className="text-destructive hover:text-destructive"
              >
                <LogOut className="w-4 h-4" />
              </Button>
            )}
          </div>
        </div>
      </div>
    </header>
  );
}
