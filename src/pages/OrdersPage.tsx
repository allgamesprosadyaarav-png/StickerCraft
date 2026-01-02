import { Package, Truck, MapPin } from 'lucide-react';
import { useAuthStore } from '../stores/authStore';
import { useOrderStore } from '../stores/orderStore';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card';
import { LoyaltyWidget } from '../components/features/LoyaltyWidget';
import { OrderTracking } from '../components/features/OrderTracking';
import { ReferralSystem } from '../components/features/ReferralSystem';
import { ReviewsSection } from '../components/features/ReviewsSection';

export function OrdersPage() {
  const user = useAuthStore((state) => state.user);
  const getOrdersByUserId = useOrderStore((state) => state.getOrdersByUserId);

  if (!user) return null;

  const orders = getOrdersByUserId(user.id);

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-6">My Account</h1>

      <div className="grid lg:grid-cols-3 gap-6 mb-8">
        {/* Loyalty Widget */}
        <div className="lg:col-span-1">
          <LoyaltyWidget />
        </div>

        {/* Profile Info */}
        <div className="lg:col-span-2">
          <Card className="glass h-full">
            <CardHeader>
              <CardTitle>Profile Information</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div>
                <p className="text-sm text-muted-foreground">Name</p>
                <p className="font-medium">{user.name}</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Email</p>
                <p className="font-medium">{user.email}</p>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-sm text-muted-foreground">Country</p>
                  <p className="font-medium">{user.country}</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">State</p>
                  <p className="font-medium">{user.state}</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Order History */}
      <Card className="glass">
        <CardHeader>
          <CardTitle>Order History</CardTitle>
        </CardHeader>
        <CardContent>
          {orders.length === 0 ? (
            <div className="text-center py-8">
              <Package className="w-12 h-12 mx-auto text-muted-foreground mb-3" />
              <p className="text-muted-foreground">No orders yet</p>
            </div>
          ) : (
            <div className="space-y-4">
              {orders.slice().reverse().map((order, idx) => {
                // Calculate estimated delivery date
                const orderDate = new Date(order.date);
                const deliveryDate = new Date(orderDate);
                deliveryDate.setDate(deliveryDate.getDate() + (user?.isPremium ? 4 : 6));
                const estimatedDelivery = deliveryDate.toLocaleDateString('en-IN', {
                  day: 'numeric',
                  month: 'short',
                  year: 'numeric'
                });

                // Generate tracking number
                const trackingNumber = `SCT${order.id.split('-')[1]?.substring(0, 10).toUpperCase() || ''}${idx.toString().padStart(3, '0')}`;

                return (
                  <div key={order.id} className="space-y-4">
                    <Card className="glass">
                      <CardHeader>
                        <div className="flex justify-between items-start">
                          <div className="space-y-1">
                            <p className="font-mono text-sm text-muted-foreground">
                              Order #{order.id}
                            </p>
                            <p className="text-sm text-muted-foreground">
                              Placed on {new Date(order.date).toLocaleDateString('en-IN', {
                                day: 'numeric',
                                month: 'long',
                                year: 'numeric',
                                hour: '2-digit',
                                minute: '2-digit'
                              })}
                            </p>
                          </div>
                          <div className="text-right">
                            <p className="font-bold text-lg text-primary">₹{order.total.toFixed(2)}</p>
                            <p className="text-xs text-green-600 font-medium">
                              +{order.pointsEarned} points earned
                            </p>
                          </div>
                        </div>
                      </CardHeader>
                      <CardContent className="space-y-4">
                        {/* Status Badge */}
                        <div className="flex items-center gap-3">
                          {order.status === 'delivered' ? <Package className="w-5 h-5 text-green-600" /> :
                           order.status === 'shipped' ? <Truck className="w-5 h-5 text-blue-600" /> :
                           <MapPin className="w-5 h-5 text-yellow-600" />}
                          <span className={`px-3 py-1.5 rounded-full text-sm font-medium ${
                            order.status === 'delivered' ? 'bg-green-100 dark:bg-green-950 text-green-700 dark:text-green-400' :
                            order.status === 'shipped' ? 'bg-blue-100 dark:bg-blue-950 text-blue-700 dark:text-blue-400' :
                            order.status === 'processing' ? 'bg-yellow-100 dark:bg-yellow-950 text-yellow-700 dark:text-yellow-400' :
                            'bg-gray-100 dark:bg-gray-950 text-gray-700 dark:text-gray-400'
                          }`}>
                            {order.status === 'processing' ? '📦 Processing' :
                             order.status === 'shipped' ? '🚚 Shipped' :
                             order.status === 'delivered' ? '✅ Delivered' : order.status}
                          </span>
                          {user?.isPremium && order.status !== 'delivered' && (
                            <span className="px-2 py-1 rounded-full text-xs font-medium bg-purple-100 dark:bg-purple-950 text-purple-700 dark:text-purple-400">
                              ⚡ Premium Quick Delivery
                            </span>
                          )}
                        </div>

                        {/* Items List */}
                        <div className="border-t pt-4">
                          <p className="text-sm font-semibold mb-3 flex items-center gap-2">
                            <Package className="w-4 h-4" />
                            Order Items ({order.items.length})
                          </p>
                          <div className="grid gap-2">
                            {order.items.map((item, index) => (
                              <div key={index} className="flex items-center gap-3 bg-muted/30 p-2 rounded-lg">
                                <img 
                                  src={item.product.image} 
                                  alt={item.product.name}
                                  className={`w-12 h-12 object-cover rounded ${
                                    item.product.type === 'sticker' ? 'rounded-full border-2 border-white' : ''
                                  }`}
                                />
                                <div className="flex-1">
                                  <p className="text-sm font-medium">{item.product.name}</p>
                                  <p className="text-xs text-muted-foreground">
                                    Qty: {item.quantity} × ₹{item.product.price}
                                  </p>
                                </div>
                                <p className="text-sm font-semibold">₹{(item.quantity * item.product.price).toFixed(2)}</p>
                              </div>
                            ))}
                          </div>
                        </div>

                        {/* Shipping Details */}
                        <div className="border-t pt-4 bg-muted/30 p-3 rounded-lg">
                          <p className="text-sm font-semibold mb-2 flex items-center gap-2">
                            <MapPin className="w-4 h-4" />
                            Delivery Address
                          </p>
                          <div className="text-sm text-muted-foreground space-y-1">
                            <p>{order.shippingDetails.name}</p>
                            <p>{order.shippingDetails.address}</p>
                            <p>{order.shippingDetails.city}, {order.shippingDetails.state} - {order.shippingDetails.pincode}</p>
                            <p>{order.shippingDetails.country}</p>
                            <p className="pt-1 border-t mt-2">
                              📞 {order.shippingDetails.phone} | 📧 {order.shippingDetails.email}
                            </p>
                          </div>
                        </div>
                      </CardContent>
                    </Card>

                    {/* Order Tracking */}
                    <OrderTracking 
                      orderId={order.id}
                      status={order.status}
                      estimatedDelivery={estimatedDelivery}
                      trackingNumber={trackingNumber}
                    />
                  </div>
                );
              })}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Referral System */}
      <div className="mt-8">
        <ReferralSystem />
      </div>

      {/* Reviews Section */}
      <div className="mt-8">
        <ReviewsSection />
      </div>
    </div>
  );
}
