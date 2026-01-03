import { useState } from 'react';
import { Trash2, Plus, Minus, ShoppingBag, Gift, Zap, Truck } from 'lucide-react';
import { calculateDeliveryFee } from '../lib/deliveryService';
import { useCartStore } from '../stores/cartStore';
import { useAuthStore } from '../stores/authStore';
import { Button } from '../components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card';
import { CheckoutModal } from '../components/features/CheckoutModal';
import { LOYALTY_TIERS } from '../constants/loyalty';

export function CartPage() {
  const cartStore = useCartStore();
  const user = useAuthStore((state) => state.user);
  const [showCheckout, setShowCheckout] = useState(false);

  // Safety checks to prevent white screen
  if (!cartStore || !cartStore.items) {
    return (
      <div className="container mx-auto px-4 py-12">
        <Card className="max-w-md mx-auto text-center glass">
          <CardContent className="py-12 space-y-4">
            <ShoppingBag className="w-16 h-16 mx-auto text-muted-foreground" />
            <h2 className="text-2xl font-bold">Loading...</h2>
          </CardContent>
        </Card>
      </div>
    );
  }

  const { items, removeItem, updateQuantity, getTotal, shouldApplyOffer, getKeychainCount } = cartStore;

  const subtotal = getTotal();
  const keychainCount = getKeychainCount();
  const offerApplied = shouldApplyOffer();
  const freeStickersValue = offerApplied ? 5 * 10 : 0; // 5 stickers × ₹10
  
  // Apply loyalty discount
  const userTier = LOYALTY_TIERS.find((tier) => tier.name === user?.loyaltyTier);
  const discountPercent = userTier?.discount || 0;
  const discountAmount = (subtotal * discountPercent) / 100;
  
  const total = subtotal - discountAmount;
  
  // FREE DELIVERY ALWAYS - No delivery charges!
  const deliveryFee = 0;
  const finalTotal = total;
  const FREE_DELIVERY_THRESHOLD = 50;

  if (items.length === 0) {
    return (
      <div className="container mx-auto px-4 py-12">
        <Card className="max-w-md mx-auto text-center glass">
          <CardContent className="py-12 space-y-4">
            <ShoppingBag className="w-16 h-16 mx-auto text-muted-foreground" />
            <h2 className="text-2xl font-bold">Your cart is empty</h2>
            <p className="text-muted-foreground">Add some awesome stickers and keychains!</p>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <>
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold mb-6">Shopping Cart</h1>

        <div className="grid lg:grid-cols-3 gap-6">
          {/* Cart Items */}
          <div className="lg:col-span-2 space-y-4">
            {items.map((item) => (
              <Card key={item.product.id + (item.selectedCase?.id || '')} className="glass">
                <CardContent className="p-4">
                  <div className="flex gap-4">
                    <img
                      src={item.product.image}
                      alt={item.product.name}
                      className={`w-20 h-20 object-cover rounded-lg ${
                        item.product.type === 'sticker' ? 'rounded-full border-2 border-white' : ''
                      }`}
                    />
                    
                    <div className="flex-1 space-y-2">
                      <h3 className="font-bold">{item.product.name}</h3>
                      <p className="text-sm text-muted-foreground">
                        {item.product.category} {item.product.type}
                      </p>
                      {item.selectedCase && (
                        <p className="text-xs text-primary">
                          Case: {item.selectedCase.name}
                        </p>
                      )}
                      
                      <div className="flex items-center gap-2">
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => updateQuantity(item.product.id, item.quantity - 1)}
                        >
                          <Minus className="w-3 h-3" />
                        </Button>
                        <span className="w-8 text-center font-medium">{item.quantity}</span>
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => updateQuantity(item.product.id, item.quantity + 1)}
                        >
                          <Plus className="w-3 h-3" />
                        </Button>
                      </div>
                    </div>

                    <div className="text-right space-y-2">
                      <p className="text-xl font-bold text-primary">
                        ₹{(item.product.price + (item.selectedCase?.priceModifier || 0)) * item.quantity}
                      </p>
                      <Button
                        size="sm"
                        variant="ghost"
                        onClick={() => removeItem(item.product.id)}
                        className="text-destructive hover:text-destructive"
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          {/* Order Summary */}
          <div className="lg:col-span-1">
            <Card className="glass sticky top-24">
              <CardHeader>
                <CardTitle>Order Summary</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {user?.isPremium && (
                  <div className="bg-gradient-to-r from-purple-50 to-pink-50 dark:from-purple-950 dark:to-pink-950 p-3 rounded-lg border-2 border-purple-200 dark:border-purple-800">
                    <div className="flex items-center gap-2 text-purple-600 dark:text-purple-400 font-medium text-sm">
                      <Zap className="w-4 h-4" />
                      Premium Quick Delivery Activated!
                    </div>
                    <p className="text-xs text-muted-foreground mt-1">
                      Your order will be delivered with priority shipping
                    </p>
                  </div>
                )}
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span>Subtotal</span>
                    <span>₹{subtotal}</span>
                  </div>
                  
                  {discountPercent > 0 && (
                    <div className="flex justify-between text-green-600">
                      <span>{user?.loyaltyTier} Discount ({discountPercent}%)</span>
                      <span>-₹{discountAmount.toFixed(2)}</span>
                    </div>
                  )}

                  <div className="flex justify-between">
                    <div className="flex items-center gap-1">
                      <Truck className="w-4 h-4" />
                      <span>Delivery Fee</span>
                    </div>
                    <span className="text-green-600 font-bold">FREE ✓</span>
                  </div>
                  
                  {total >= FREE_DELIVERY_THRESHOLD ? (
                    <div className="bg-green-50 dark:bg-green-950 p-2 rounded-lg border border-green-200 dark:border-green-800">
                      <p className="text-xs text-green-700 dark:text-green-400 font-medium">
                        🎉 FREE delivery unlocked on orders over ₹50!
                      </p>
                    </div>
                  ) : (
                    <div className="bg-yellow-50 dark:bg-yellow-950 p-2 rounded-lg border border-yellow-200 dark:border-yellow-800">
                      <p className="text-xs text-yellow-700 dark:text-yellow-400">
                        💡 Add ₹{(FREE_DELIVERY_THRESHOLD - total).toFixed(2)} more to qualify for the FREE delivery promotion!
                      </p>
                    </div>
                  )}

                  {offerApplied && (
                    <div className="bg-secondary/10 p-3 rounded-lg border-2 border-secondary">
                      <div className="flex items-center gap-2 text-secondary font-medium mb-1">
                        <Gift className="w-4 h-4" />
                        <span>Special Offer Applied!</span>
                      </div>
                      <p className="text-xs text-muted-foreground">
                        You have {keychainCount} keychains - 5 free stickers will be included!
                      </p>
                      <p className="text-sm font-medium mt-1">
                        Savings: ₹{freeStickersValue}
                      </p>
                    </div>
                  )}
                </div>

                <div className="border-t pt-4">
                  <div className="flex justify-between text-xl font-bold">
                    <span>Total</span>
                    <span className="text-primary">₹{finalTotal.toFixed(2)}</span>
                  </div>
                  {offerApplied && (
                    <p className="text-xs text-muted-foreground mt-1">
                      + 5 Free Stickers (₹{freeStickersValue} value)
                    </p>
                  )}
                  {deliveryFee === 0 && (
                    <p className="text-xs text-green-600 font-medium mt-1">
                      🎉 Free delivery applied!
                    </p>
                  )}
                </div>

                <Button
                  className="w-full"
                  size="lg"
                  onClick={() => setShowCheckout(true)}
                >
                  Proceed to Checkout
                </Button>
                
                <div className="bg-green-50 dark:bg-green-950 p-3 rounded-lg border border-green-200 dark:border-green-800">
                  <p className="text-xs text-green-700 dark:text-green-400 text-center font-medium flex items-center justify-center gap-1">
                    <Truck className="w-4 h-4" />
                    🎉 Enjoy FREE delivery on all orders!
                  </p>
                </div>
                
                <div className="bg-muted/50 p-3 rounded-lg">
                  <p className="text-xs text-muted-foreground text-center">
                    🚚 Delivery by trusted partners: Shiprocket, Delhivery, Blue Dart
                  </p>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>

      {showCheckout && (
        <CheckoutModal
          onClose={() => setShowCheckout(false)}
          total={finalTotal}
          offerApplied={offerApplied}
          deliveryFee={deliveryFee}
        />
      )}
    </>
  );
}
