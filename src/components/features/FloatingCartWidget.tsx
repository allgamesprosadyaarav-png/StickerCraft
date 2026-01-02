import { ShoppingCart, X } from 'lucide-react';
import { useState } from 'react';
import { useCartStore } from '../../stores/cartStore';
import { Button } from '../ui/button';

interface FloatingCartWidgetProps {
  onNavigateToCart: () => void;
}

export function FloatingCartWidget({ onNavigateToCart }: FloatingCartWidgetProps) {
  const [isExpanded, setIsExpanded] = useState(false);
  const items = useCartStore((state) => state.items);
  const total = useCartStore((state) => state.total);
  const removeItem = useCartStore((state) => state.removeItem);

  const itemCount = items.reduce((sum, item) => sum + item.quantity, 0);

  if (itemCount === 0) return null;

  return (
    <div className="fixed bottom-24 right-6 z-40">
      {isExpanded ? (
        <div className="glass bg-card border-2 border-primary/20 rounded-2xl shadow-2xl w-80 max-h-96 overflow-hidden animate-in slide-in-from-right">
          <div className="bg-gradient-to-r from-primary to-purple-600 text-white p-4 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <ShoppingCart className="w-5 h-5" />
              <span className="font-bold">Your Cart ({itemCount})</span>
            </div>
            <button
              onClick={() => setIsExpanded(false)}
              className="hover:bg-white/20 rounded-full p-1 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          <div className="p-4 space-y-3 max-h-64 overflow-y-auto">
            {items.slice(0, 3).map((item) => (
              <div
                key={`${item.product.id}-${item.selectedCase?.id || 'no-case'}`}
                className="flex gap-3 bg-muted/50 rounded-lg p-2"
              >
                <img
                  src={item.product.image}
                  alt={item.product.name}
                  className="w-12 h-12 rounded-lg object-cover"
                />
                <div className="flex-1 min-w-0">
                  <p className="font-medium text-sm truncate">{item.product.name}</p>
                  <p className="text-xs text-muted-foreground">
                    Qty: {item.quantity} × ₹{item.product.price}
                  </p>
                </div>
                <button
                  onClick={() => removeItem(item.product.id, item.selectedCase?.id)}
                  className="text-destructive hover:bg-destructive/10 rounded p-1 h-fit"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
            ))}
            {items.length > 3 && (
              <p className="text-xs text-center text-muted-foreground">
                + {items.length - 3} more items
              </p>
            )}
          </div>

          <div className="p-4 border-t space-y-2">
            <div className="flex justify-between items-center font-bold text-lg">
              <span>Total:</span>
              <span className="text-primary">₹{total}</span>
            </div>
            <Button onClick={onNavigateToCart} className="w-full">
              View Cart & Checkout
            </Button>
          </div>
        </div>
      ) : (
        <button
          onClick={() => setIsExpanded(true)}
          className="relative group"
        >
          <div className="absolute inset-0 bg-gradient-to-r from-primary to-purple-600 rounded-full blur-xl opacity-75 group-hover:opacity-100 transition-opacity animate-pulse"></div>
          
          <div className="relative glass bg-gradient-to-r from-primary to-purple-600 text-white p-4 rounded-full shadow-2xl group-hover:scale-110 transition-transform">
            <ShoppingCart className="w-6 h-6" />
            <div className="absolute -top-2 -right-2 bg-red-500 text-white text-xs font-bold rounded-full w-6 h-6 flex items-center justify-center animate-bounce">
              {itemCount}
            </div>
          </div>
        </button>
      )}
    </div>
  );
}
