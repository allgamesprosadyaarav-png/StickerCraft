import { useEffect, useState } from 'react';
import { TrendingUp, Package, Users, Clock } from 'lucide-react';
import { Card } from '../ui/card';
import { useOrderStore } from '../../stores/orderStore';

export function RealTimeStats() {
  const orders = useOrderStore((state) => state.orders);
  const [isVisible, setIsVisible] = useState(false);

  // Calculate real stats
  const todayOrders = orders.filter((order) => {
    const orderDate = new Date(order.date);
    const today = new Date();
    return (
      orderDate.getDate() === today.getDate() &&
      orderDate.getMonth() === today.getMonth() &&
      orderDate.getFullYear() === today.getFullYear()
    );
  });

  const totalOrdersToday = todayOrders.length;
  const totalItemsSoldToday = todayOrders.reduce(
    (sum, order) => sum + order.items.reduce((itemSum, item) => itemSum + item.quantity, 0),
    0
  );
  const totalRevenueToday = todayOrders.reduce((sum, order) => sum + order.total, 0);

  useEffect(() => {
    // Show stats after 5 seconds
    const timer = setTimeout(() => setIsVisible(true), 5000);
    return () => clearTimeout(timer);
  }, []);

  if (!isVisible) return null;

  return (
    <div className="fixed bottom-6 right-6 z-40 animate-in slide-in-from-right duration-500">
      <Card className="bg-background/95 backdrop-blur-lg border-2 border-primary/20 shadow-2xl p-4 max-w-xs">
        <div className="space-y-3">
          <div className="flex items-center gap-2 border-b pb-2">
            <TrendingUp className="w-5 h-5 text-primary" />
            <h3 className="font-bold text-sm">Today's Activity</h3>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div className="bg-gradient-to-br from-green-500/10 to-emerald-500/10 p-3 rounded-xl">
              <Package className="w-4 h-4 text-green-600 mb-1" />
              <p className="text-2xl font-bold">{totalOrdersToday}</p>
              <p className="text-xs text-muted-foreground">Orders</p>
            </div>

            <div className="bg-gradient-to-br from-blue-500/10 to-cyan-500/10 p-3 rounded-xl">
              <Users className="w-4 h-4 text-blue-600 mb-1" />
              <p className="text-2xl font-bold">{totalItemsSoldToday}</p>
              <p className="text-xs text-muted-foreground">Items Sold</p>
            </div>
          </div>

          <div className="bg-gradient-to-br from-purple-500/10 to-pink-500/10 p-3 rounded-xl">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs text-muted-foreground">Revenue</p>
                <p className="text-xl font-bold text-primary">₹{totalRevenueToday.toFixed(2)}</p>
              </div>
              <Clock className="w-5 h-5 text-purple-600" />
            </div>
          </div>

          <div className="bg-muted/50 p-2 rounded-lg">
            <p className="text-xs text-muted-foreground text-center">
              📊 Real-time data from your account
            </p>
          </div>
        </div>
      </Card>
    </div>
  );
}
