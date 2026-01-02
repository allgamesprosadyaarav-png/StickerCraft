import { useState, useEffect } from 'react';
import { X, CheckCircle2, CreditCard, Smartphone, QrCode, Gift, Truck } from 'lucide-react';
import { useCartStore } from '../../stores/cartStore';
import { useAuthStore } from '../../stores/authStore';
import { useOrderStore } from '../../stores/orderStore';
import { ShippingDetails, Order } from '../../types';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Label } from '../ui/label';
import { POINTS_PER_RUPEE } from '../../constants/loyalty';
import { calculateDeliveryFee } from '../../lib/deliveryService';
import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  import.meta.env.VITE_SUPABASE_URL,
  import.meta.env.VITE_SUPABASE_ANON_KEY
);

interface CheckoutModalProps {
  onClose: () => void;
  total: number;
  offerApplied: boolean;
  deliveryFee?: number;
}

export function CheckoutModal({ onClose, total, offerApplied, deliveryFee: initialDeliveryFee = 0 }: CheckoutModalProps) {
  const { items, clearCart } = useCartStore();
  const { user, updateLoyaltyPoints } = useAuthStore();
  const addOrder = useOrderStore((state) => state.addOrder);
  const [isProcessing, setIsProcessing] = useState(false);
  const [orderComplete, setOrderComplete] = useState(false);
  const [orderId, setOrderId] = useState('');
  const [paymentMethod, setPaymentMethod] = useState<'card' | 'upi'>('card');
  const [cardType, setCardType] = useState<'credit' | 'debit'>('credit');
  const [cardNumber, setCardNumber] = useState('');
  const [cardExpiry, setCardExpiry] = useState('');
  const [cardCVV, setCardCVV] = useState('');
  const [upiId, setUpiId] = useState('');
  const [upiQrCode, setUpiQrCode] = useState('');
  const [giftWrap, setGiftWrap] = useState(false);
  const [giftMessage, setGiftMessage] = useState('');
  const [availableOffers, setAvailableOffers] = useState<any[]>([]);
  const [selectedOffer, setSelectedOffer] = useState<any>(null);

  const [shippingDetails, setShippingDetails] = useState<ShippingDetails>({
    name: user?.name || '',
    email: user?.email || '',
    phone: '',
    address: '',
    city: '',
    state: user?.state || '',
    country: user?.country || '',
    pincode: '',
  });

  const giftWrapPrice = 30;
  const subtotal = giftWrap ? total + giftWrapPrice : total;
  const offerDiscount = selectedOffer ? Math.round((subtotal * selectedOffer.discount) / 100) : 0;
  
  // Calculate delivery fee based on order total and pincode
  const calculatedDeliveryFee = shippingDetails.pincode && shippingDetails.pincode.length === 6
    ? calculateDeliveryFee(subtotal - offerDiscount, shippingDetails.pincode)
    : initialDeliveryFee;
  
  const finalTotal = subtotal - offerDiscount + calculatedDeliveryFee;

  // Load available offers on mount
  useEffect(() => {
    const offers = JSON.parse(localStorage.getItem('availableOffers') || '[]');
    // Filter out expired offers
    const validOffers = offers.filter((offer: any) => new Date(offer.expiresAt) > new Date());
    setAvailableOffers(validOffers);
    localStorage.setItem('availableOffers', JSON.stringify(validOffers));
  }, []);

  // Generate UPI QR Code when payment method changes to UPI
  useEffect(() => {
    if (paymentMethod === 'upi') {
      // Generate UPI payment string
      const upiString = `upi://pay?pa=stickercraft@paytm&pn=StickerCraft&am=${finalTotal}&cu=INR&tn=Order Payment`;
      // Generate QR code using an API
      const qrCodeUrl = `https://api.qrserver.com/v1/create-qr-code/?size=300x300&data=${encodeURIComponent(upiString)}`;
      setUpiQrCode(qrCodeUrl);
    }
  }, [paymentMethod, finalTotal]);

  const handleChange = (field: keyof ShippingDetails, value: string) => {
    setShippingDetails((prev) => ({ ...prev, [field]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsProcessing(true);

    // Simulate payment processing
    await new Promise((resolve) => setTimeout(resolve, 2000));

    const pointsEarned = Math.floor(finalTotal * POINTS_PER_RUPEE);
    const newOrderId = `ORD-${Date.now()}`;

    const order: Order = {
      id: newOrderId,
      userId: user?.id || '',
      items: [...items],
      total: finalTotal,
      pointsEarned,
      shippingDetails,
      date: new Date().toISOString(),
      status: 'processing',
    };

    addOrder(order);
    updateLoyaltyPoints(pointsEarned);
    clearCart();
    
    // Remove used offer
    if (selectedOffer) {
      const updatedOffers = availableOffers.filter(o => o.id !== selectedOffer.id);
      localStorage.setItem('availableOffers', JSON.stringify(updatedOffers));
    }
    
    // Send order notification to admin
    try {
      const { error: notificationError } = await supabase.functions.invoke('send-order-notification', {
        body: {
          orderId: newOrderId,
          orderTotal: finalTotal,
          customerName: shippingDetails.name,
          customerPhone: shippingDetails.phone,
          customerEmail: shippingDetails.email,
          items: items,
          shippingAddress: `${shippingDetails.address}, ${shippingDetails.city}, ${shippingDetails.state} - ${shippingDetails.pincode}`,
        },
      });
      
      if (notificationError) {
        console.error('Notification error (non-critical):', notificationError);
      } else {
        console.log('✅ Order notification sent to admin');
      }
    } catch (notifError) {
      console.error('Failed to send notification (non-critical):', notifError);
    }
    
    setOrderId(newOrderId);
    setOrderComplete(true);
    setIsProcessing(false);
  };

  if (orderComplete) {
    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm">
        <div className="bg-background p-8 rounded-3xl shadow-2xl max-w-md mx-4 text-center space-y-6">
          <div className="flex justify-center">
            <div className="bg-green-100 p-4 rounded-full">
              <CheckCircle2 className="w-16 h-16 text-green-600" />
            </div>
          </div>

          <div className="space-y-2">
            <h2 className="text-3xl font-bold">Order Confirmed! 🎉</h2>
            <p className="text-muted-foreground">Your order has been placed successfully</p>
          </div>

          <div className="bg-muted p-4 rounded-xl space-y-2">
            <p className="text-sm text-muted-foreground">Order ID</p>
            <p className="font-mono font-bold text-lg">{orderId}</p>
          </div>

          {offerApplied && (
            <div className="bg-secondary/10 p-4 rounded-xl border-2 border-secondary">
              <p className="font-medium text-secondary">
                🎁 5 Free Stickers Included!
              </p>
            </div>
          )}
          
          <div className="bg-blue-50 dark:bg-blue-950 p-3 rounded-lg">
            <p className="text-xs text-blue-700 dark:text-blue-400">
              📦 Delivery partner will be assigned shortly. Real-time tracking will be available in your orders.
            </p>
          </div>

          <Button onClick={onClose} className="w-full" size="lg">
            Continue Shopping
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-black/50 backdrop-blur-sm">
      <div className="min-h-screen flex items-center justify-center p-4">
        <div className="bg-background rounded-3xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
          <div className="sticky top-0 bg-background border-b p-6 flex justify-between items-center">
            <h2 className="text-2xl font-bold">Checkout</h2>
            <button onClick={onClose} className="text-muted-foreground hover:text-foreground">
              <X className="w-6 h-6" />
            </button>
          </div>

          <form onSubmit={handleSubmit} className="p-6 space-y-6">
            <div className="grid md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="name">Full Name *</Label>
                <Input
                  id="name"
                  value={shippingDetails.name}
                  onChange={(e) => handleChange('name', e.target.value)}
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="email">Email *</Label>
                <Input
                  id="email"
                  type="email"
                  value={shippingDetails.email}
                  onChange={(e) => handleChange('email', e.target.value)}
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="phone">Phone *</Label>
                <Input
                  id="phone"
                  type="tel"
                  value={shippingDetails.phone}
                  onChange={(e) => handleChange('phone', e.target.value)}
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="pincode">Pincode *</Label>
                <Input
                  id="pincode"
                  value={shippingDetails.pincode}
                  onChange={(e) => handleChange('pincode', e.target.value)}
                  required
                  maxLength={6}
                />
                {shippingDetails.pincode.length === 6 && calculatedDeliveryFee === 0 && (
                  <p className="text-xs text-green-600 flex items-center gap-1">
                    <Truck className="w-3 h-3" />
                    Free delivery available!
                  </p>
                )}
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="address">Address *</Label>
              <Input
                id="address"
                value={shippingDetails.address}
                onChange={(e) => handleChange('address', e.target.value)}
                required
              />
            </div>

            <div className="grid md:grid-cols-3 gap-4">
              <div className="space-y-2">
                <Label htmlFor="city">City *</Label>
                <Input
                  id="city"
                  value={shippingDetails.city}
                  onChange={(e) => handleChange('city', e.target.value)}
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="state">State *</Label>
                <Input
                  id="state"
                  value={shippingDetails.state}
                  onChange={(e) => handleChange('state', e.target.value)}
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="country">Country *</Label>
                <Input
                  id="country"
                  value={shippingDetails.country}
                  onChange={(e) => handleChange('country', e.target.value)}
                  required
                />
              </div>
            </div>

            {/* Delivery Partner Info */}
            <div className="bg-blue-50 dark:bg-blue-950 p-4 rounded-xl border border-blue-200 dark:border-blue-800">
              <div className="flex items-start gap-3">
                <Truck className="w-5 h-5 text-blue-600 dark:text-blue-400 mt-0.5" />
                <div className="space-y-1">
                  <p className="font-semibold text-sm text-blue-900 dark:text-blue-100">Trusted Delivery Partners</p>
                  <p className="text-xs text-blue-700 dark:text-blue-300">
                    We partner with Shiprocket, Delhivery, and Blue Dart for reliable delivery
                  </p>
                  <p className="text-xs text-blue-700 dark:text-blue-300">
                    Real-time tracking will be available after order confirmation
                  </p>
                </div>
              </div>
            </div>

            {/* Available Offers */}
            {availableOffers.length > 0 && (
              <div className="space-y-3">
                <Label className="text-lg font-semibold">🎁 Your Won Offers</Label>
                <div className="space-y-2">
                  {availableOffers.map((offer) => (
                    <button
                      key={offer.id}
                      type="button"
                      onClick={() => setSelectedOffer(selectedOffer?.id === offer.id ? null : offer)}
                      className={`w-full p-4 rounded-xl border-2 transition-all text-left ${
                        selectedOffer?.id === offer.id
                          ? 'border-primary bg-primary/10'
                          : 'border-muted hover:border-primary/50'
                      }`}
                    >
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          <div className={`w-12 h-12 rounded-full flex items-center justify-center ${
                            offer.type === 'spin' ? 'bg-gradient-to-br from-purple-400 to-pink-400' : 'bg-gradient-to-br from-yellow-400 to-orange-400'
                          }`}>
                            <span className="text-2xl">{offer.type === 'spin' ? '🎡' : '🎫'}</span>
                          </div>
                          <div>
                            <p className="font-semibold">{offer.label}</p>
                            <p className="text-xs text-muted-foreground">
                              Save ₹{Math.round((subtotal * offer.discount) / 100)} on this order
                            </p>
                            <p className="text-xs text-muted-foreground">
                              Expires: {new Date(offer.expiresAt).toLocaleDateString()}
                            </p>
                          </div>
                        </div>
                        <div className="text-2xl font-black text-primary">
                          {offer.discount}% OFF
                        </div>
                      </div>
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Gift Wrap Option */}
            <div className="space-y-3">
              <Label className="text-lg font-semibold">Gift Options</Label>
              <div className="bg-muted/50 p-4 rounded-xl space-y-3">
                <label className="flex items-start gap-3 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={giftWrap}
                    onChange={(e) => setGiftWrap(e.target.checked)}
                    className="mt-1"
                  />
                  <div className="flex-1">
                    <div className="flex items-center gap-2">
                      <Gift className="w-4 h-4 text-primary" />
                      <span className="font-medium">Add Gift Wrapping</span>
                      <span className="text-sm text-muted-foreground">+₹{giftWrapPrice}</span>
                    </div>
                    <p className="text-xs text-muted-foreground mt-1">
                      Beautiful gift box with ribbon and greeting card
                    </p>
                  </div>
                </label>
                
                {giftWrap && (
                  <div className="space-y-2 ml-6">
                    <Label htmlFor="giftMessage" className="text-sm">Gift Message (Optional)</Label>
                    <Input
                      id="giftMessage"
                      placeholder="Write a special message..."
                      value={giftMessage}
                      onChange={(e) => setGiftMessage(e.target.value)}
                      maxLength={100}
                    />
                    <p className="text-xs text-muted-foreground">
                      {giftMessage.length}/100 characters
                    </p>
                  </div>
                )}
              </div>
            </div>

            <div className="bg-muted p-4 rounded-xl space-y-2">
              <div className="flex justify-between text-sm">
                <span>Subtotal</span>
                <span>₹{total.toFixed(2)}</span>
              </div>
              {giftWrap && (
                <div className="flex justify-between text-sm text-primary">
                  <span className="flex items-center gap-1">
                    <Gift className="w-3 h-3" />
                    Gift Wrap
                  </span>
                  <span>₹{giftWrapPrice.toFixed(2)}</span>
                </div>
              )}
              {selectedOffer && (
                <div className="flex justify-between text-sm text-green-600 font-semibold">
                  <span className="flex items-center gap-1">
                    🎉 {selectedOffer.label}
                  </span>
                  <span>-₹{offerDiscount.toFixed(2)}</span>
                </div>
              )}
              <div className="flex justify-between text-sm">
                <div className="flex items-center gap-1">
                  <Truck className="w-3 h-3" />
                  <span>Delivery Fee</span>
                </div>
                {calculatedDeliveryFee === 0 ? (
                  <span className="text-green-600 font-medium">FREE ✓</span>
                ) : (
                  <span>₹{calculatedDeliveryFee}</span>
                )}
              </div>
              
              {subtotal - offerDiscount < 50 && calculatedDeliveryFee > 0 && (
                <div className="bg-blue-50 dark:bg-blue-950 p-2 rounded-lg">
                  <p className="text-xs text-blue-700 dark:text-blue-400">
                    💡 Add ₹{(50 - (subtotal - offerDiscount)).toFixed(2)} more to get FREE delivery!
                  </p>
                </div>
              )}
              
              <div className="border-t pt-2 flex justify-between font-bold text-lg">
                <span>Total Amount</span>
                <span className="text-primary">₹{finalTotal.toFixed(2)}</span>
              </div>
              {selectedOffer && (
                <div className="bg-green-50 dark:bg-green-950 p-2 rounded-lg">
                  <p className="text-sm text-green-700 dark:text-green-400 font-semibold text-center">
                    🎉 You saved ₹{offerDiscount.toFixed(2)} with your {selectedOffer.type === 'spin' ? 'Spin Wheel' : 'Scratch Card'} prize!
                  </p>
                </div>
              )}
              <p className="text-sm text-muted-foreground">
                You'll earn {Math.floor(finalTotal * POINTS_PER_RUPEE)} loyalty points with this order!
              </p>
            </div>

            {/* Payment Method Selection */}
            <div className="space-y-4">
              <Label className="text-lg font-semibold">Payment Method</Label>
              
              <div className="grid grid-cols-2 gap-3">
                <button
                  type="button"
                  onClick={() => setPaymentMethod('card')}
                  className={`p-4 rounded-xl border-2 transition-all ${
                    paymentMethod === 'card'
                      ? 'border-primary bg-primary/10'
                      : 'border-muted hover:border-primary/50'
                  }`}
                >
                  <CreditCard className="w-8 h-8 mx-auto mb-2" />
                  <p className="font-medium">Card</p>
                  <p className="text-xs text-muted-foreground">Credit/Debit</p>
                </button>

                <button
                  type="button"
                  onClick={() => setPaymentMethod('upi')}
                  className={`p-4 rounded-xl border-2 transition-all ${
                    paymentMethod === 'upi'
                      ? 'border-primary bg-primary/10'
                      : 'border-muted hover:border-primary/50'
                  }`}
                >
                  <Smartphone className="w-8 h-8 mx-auto mb-2" />
                  <p className="font-medium">UPI</p>
                  <p className="text-xs text-muted-foreground">Google Pay, PhonePe</p>
                </button>
              </div>

              {/* Card Payment Form */}
              {paymentMethod === 'card' && (
                <div className="space-y-4 p-4 border rounded-xl bg-muted/30">
                  <div className="flex gap-3">
                    <button
                      type="button"
                      onClick={() => setCardType('credit')}
                      className={`flex-1 py-2 px-4 rounded-lg border transition-all ${
                        cardType === 'credit'
                          ? 'bg-primary text-primary-foreground border-primary'
                          : 'border-muted hover:border-primary/50'
                      }`}
                    >
                      Credit Card
                    </button>
                    <button
                      type="button"
                      onClick={() => setCardType('debit')}
                      className={`flex-1 py-2 px-4 rounded-lg border transition-all ${
                        cardType === 'debit'
                          ? 'bg-primary text-primary-foreground border-primary'
                          : 'border-muted hover:border-primary/50'
                      }`}
                    >
                      Debit Card
                    </button>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="cardNumber">Card Number *</Label>
                    <Input
                      id="cardNumber"
                      placeholder="1234 5678 9012 3456"
                      value={cardNumber}
                      onChange={(e) => {
                        const value = e.target.value.replace(/\s/g, '');
                        if (/^\d{0,16}$/.test(value)) {
                          const formatted = value.match(/.{1,4}/g)?.join(' ') || value;
                          setCardNumber(formatted);
                        }
                      }}
                      maxLength={19}
                      required={paymentMethod === 'card'}
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="expiry">Expiry Date *</Label>
                      <Input
                        id="expiry"
                        placeholder="MM/YY"
                        value={cardExpiry}
                        onChange={(e) => {
                          const value = e.target.value.replace(/\D/g, '');
                          if (value.length <= 4) {
                            const formatted = value.length >= 2 
                              ? `${value.slice(0, 2)}/${value.slice(2)}` 
                              : value;
                            setCardExpiry(formatted);
                          }
                        }}
                        maxLength={5}
                        required={paymentMethod === 'card'}
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="cvv">CVV *</Label>
                      <Input
                        id="cvv"
                        type="password"
                        placeholder="123"
                        value={cardCVV}
                        onChange={(e) => {
                          const value = e.target.value.replace(/\D/g, '');
                          if (value.length <= 3) setCardCVV(value);
                        }}
                        maxLength={3}
                        required={paymentMethod === 'card'}
                      />
                    </div>
                  </div>
                </div>
              )}

              {/* UPI Payment Form */}
              {paymentMethod === 'upi' && (
                <div className="space-y-4 p-4 border rounded-xl bg-muted/30">
                  {/* UPI QR Code Scanner */}
                  <div className="bg-white p-4 rounded-xl space-y-3">
                    <div className="flex items-center gap-2 justify-center">
                      <QrCode className="w-5 h-5 text-primary" />
                      <Label className="text-base font-semibold">Scan QR Code to Pay</Label>
                    </div>
                    
                    {upiQrCode && (
                      <div className="flex justify-center">
                        <div className="bg-white p-3 rounded-lg border-2 border-primary">
                          <img 
                            src={upiQrCode} 
                            alt="UPI QR Code" 
                            className="w-48 h-48"
                          />
                        </div>
                      </div>
                    )}
                    
                    <div className="text-center space-y-2">
                      <p className="text-sm font-medium">Amount: ₹{finalTotal.toFixed(2)}</p>
                      <p className="text-xs text-muted-foreground">
                        Scan with any UPI app (Google Pay, PhonePe, Paytm)
                      </p>
                    </div>
                  </div>

                  <div className="relative">
                    <div className="absolute inset-0 flex items-center">
                      <div className="w-full border-t"></div>
                    </div>
                    <div className="relative flex justify-center text-xs uppercase">
                      <span className="bg-muted/30 px-2 text-muted-foreground">Or</span>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="upiId">Enter UPI ID Manually</Label>
                    <Input
                      id="upiId"
                      placeholder="yourname@paytm"
                      value={upiId}
                      onChange={(e) => setUpiId(e.target.value)}
                    />
                    <p className="text-xs text-muted-foreground">
                      Enter your UPI ID (e.g., yourname@paytm, yourname@googlepay)
                    </p>
                  </div>

                  <div className="flex items-center gap-2 text-sm text-muted-foreground bg-blue-50 dark:bg-blue-950 p-3 rounded-lg">
                    <Smartphone className="w-4 h-4" />
                    <span>You'll receive a payment request on your UPI app</span>
                  </div>
                </div>
              )}
            </div>

            <Button
              type="submit"
              className="w-full"
              size="lg"
              disabled={isProcessing}
            >
              {isProcessing ? 'Processing Payment...' : `Pay ₹${finalTotal.toFixed(2)}`}
            </Button>
          </form>
        </div>
      </div>
    </div>
  );
}
