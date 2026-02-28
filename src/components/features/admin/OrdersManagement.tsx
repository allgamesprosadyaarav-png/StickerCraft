import { useState, useEffect } from 'react';
import { Search, RefreshCw, Package, Truck, CheckCircle, XCircle, Clock } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '../../ui/card';
import { Button } from '../../ui/button';
import { Input } from '../../ui/input';
import { Badge } from '../../ui/badge';
import { Label } from '../../ui/label';
import { getAllOrders, updateOrderStatus } from '../../../lib/admin';
import { toast } from '../../../hooks/use-toast';

const statusOptions = [
  { value: 'pending', label: 'Pending', icon: Clock, color: 'bg-yellow-500' },
  { value: 'confirmed', label: 'Confirmed', icon: CheckCircle, color: 'bg-blue-500' },
  { value: 'processing', label: 'Processing', icon: Package, color: 'bg-purple-500' },
  { value: 'shipped', label: 'Shipped', icon: Truck, color: 'bg-indigo-500' },
  { value: 'delivered', label: 'Delivered', icon: CheckCircle, color: 'bg-green-500' },
  { value: 'cancelled', label: 'Cancelled', icon: XCircle, color: 'bg-red-500' },
];

export function OrdersManagement() {
  const [orders, setOrders] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [editingOrder, setEditingOrder] = useState<string | null>(null);
  const [trackingNumber, setTrackingNumber] = useState('');
  const [deliveryPartner, setDeliveryPartner] = useState('');

  useEffect(() => {
    loadOrders();
  }, []);

  const loadOrders = async () => {
    setLoading(true);
    const data = await getAllOrders();
    setOrders(data);
    setLoading(false);
  };

  const handleUpdateStatus = async (orderId: string, newStatus: string) => {
    try {
      await updateOrderStatus(
        orderId,
        newStatus,
        trackingNumber || undefined,
        deliveryPartner || undefined
      );
      
      toast({
        title: 'Order updated! ✓',
        description: `Status changed to ${newStatus}`,
      });
      
      setEditingOrder(null);
      setTrackingNumber('');
      setDeliveryPartner('');
      loadOrders();
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to update order status',
        variant: 'destructive',
      });
    }
  };

  const filteredOrders = orders.filter((order) => {
    const matchesSearch = 
      order.order_number.toLowerCase().includes(searchQuery.toLowerCase()) ||
      order.customer_name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      order.customer_email.toLowerCase().includes(searchQuery.toLowerCase());
    
    const matchesStatus = statusFilter === 'all' || order.status === statusFilter;
    
    return matchesSearch && matchesStatus;
  });

  const getStatusBadge = (status: string) => {
    const statusConfig = statusOptions.find(s => s.value === status);
    if (!statusConfig) return null;

    return (
      <Badge className={`${statusConfig.color} text-white`}>
        <statusConfig.icon className="w-3 h-3 mr-1" />
        {statusConfig.label}
      </Badge>
    );
  };

  return (
    <div className="space-y-6">
      {/* Filters */}
      <Card>
        <CardContent className="p-4">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                <Input
                  placeholder="Search by order number, customer name, or email..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>
            <div className="flex gap-2">
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="px-4 py-2 border rounded-lg"
              >
                <option value="all">All Statuses</option>
                {statusOptions.map((status) => (
                  <option key={status.value} value={status.value}>
                    {status.label}
                  </option>
                ))}
              </select>
              <Button onClick={loadOrders} variant="outline" size="icon">
                <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Orders List */}
      <div className="space-y-4">
        {filteredOrders.map((order) => (
          <Card key={order.id}>
            <CardHeader>
              <div className="flex items-start justify-between">
                <div>
                  <CardTitle className="text-lg">
                    Order #{order.order_number}
                  </CardTitle>
                  <p className="text-sm text-muted-foreground mt-1">
                    {new Date(order.created_at).toLocaleString()}
                  </p>
                </div>
                {getStatusBadge(order.status)}
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              {/* Customer Info */}
              <div className="grid md:grid-cols-2 gap-4 p-4 bg-muted rounded-lg">
                <div>
                  <p className="text-sm font-medium">Customer</p>
                  <p className="text-sm text-muted-foreground">{order.customer_name}</p>
                  <p className="text-sm text-muted-foreground">{order.customer_email}</p>
                  <p className="text-sm text-muted-foreground">{order.customer_phone}</p>
                </div>
                <div>
                  <p className="text-sm font-medium">Delivery Address</p>
                  <p className="text-sm text-muted-foreground">
                    {order.delivery_address.street}, {order.delivery_address.city}
                  </p>
                  <p className="text-sm text-muted-foreground">
                    {order.delivery_address.state}, {order.delivery_address.pincode}
                  </p>
                  <p className="text-sm text-muted-foreground">
                    {order.delivery_address.country}
                  </p>
                </div>
              </div>

              {/* Order Items */}
              <div>
                <p className="text-sm font-medium mb-2">Items ({order.order_items.length})</p>
                <div className="space-y-2">
                  {order.order_items.map((item: any) => (
                    <div
                      key={item.id}
                      className="flex items-center gap-3 p-2 bg-muted rounded"
                    >
                      <img
                        src={item.product_image}
                        alt={item.product_name}
                        className="w-12 h-12 object-cover rounded"
                      />
                      <div className="flex-1">
                        <p className="text-sm font-medium">{item.product_name}</p>
                        <p className="text-xs text-muted-foreground">
                          Qty: {item.quantity} × ₹{item.unit_price}
                        </p>
                      </div>
                      <p className="text-sm font-bold">₹{item.total_price}</p>
                    </div>
                  ))}
                </div>
              </div>

              {/* Order Total */}
              <div className="flex items-center justify-between p-4 bg-primary/10 rounded-lg">
                <span className="font-semibold">Total Amount</span>
                <span className="text-2xl font-bold text-primary">
                  ₹{order.final_amount}
                </span>
              </div>

              {/* Tracking Info */}
              {order.tracking_number && (
                <div className="p-3 bg-blue-50 dark:bg-blue-950 rounded-lg">
                  <p className="text-sm font-medium">Tracking Information</p>
                  <p className="text-sm text-muted-foreground">
                    {order.delivery_partner}: {order.tracking_number}
                  </p>
                </div>
              )}

              {/* Status Update */}
              {editingOrder === order.id ? (
                <div className="space-y-3 p-4 border-2 border-primary rounded-lg">
                  <div className="space-y-2">
                    <Label>Update Status</Label>
                    <div className="grid grid-cols-3 gap-2">
                      {statusOptions.map((status) => (
                        <Button
                          key={status.value}
                          onClick={() => handleUpdateStatus(order.id, status.value)}
                          variant={order.status === status.value ? 'default' : 'outline'}
                          size="sm"
                          className="gap-1"
                        >
                          <status.icon className="w-3 h-3" />
                          {status.label}
                        </Button>
                      ))}
                    </div>
                  </div>
                  
                  <div className="grid md:grid-cols-2 gap-3">
                    <div className="space-y-2">
                      <Label htmlFor="tracking">Tracking Number</Label>
                      <Input
                        id="tracking"
                        placeholder="Enter tracking number"
                        value={trackingNumber}
                        onChange={(e) => setTrackingNumber(e.target.value)}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="partner">Delivery Partner</Label>
                      <select
                        id="partner"
                        value={deliveryPartner}
                        onChange={(e) => setDeliveryPartner(e.target.value)}
                        className="w-full px-3 py-2 border rounded-lg"
                      >
                        <option value="">Select partner</option>
                        <option value="Shiprocket">Shiprocket</option>
                        <option value="Delhivery">Delhivery</option>
                        <option value="Blue Dart">Blue Dart</option>
                      </select>
                    </div>
                  </div>
                  
                  <div className="flex gap-2">
                    <Button
                      onClick={() => setEditingOrder(null)}
                      variant="outline"
                      size="sm"
                    >
                      Cancel
                    </Button>
                  </div>
                </div>
              ) : (
                <Button
                  onClick={() => setEditingOrder(order.id)}
                  variant="outline"
                  className="w-full"
                >
                  Update Order Status
                </Button>
              )}
            </CardContent>
          </Card>
        ))}

        {filteredOrders.length === 0 && (
          <Card>
            <CardContent className="py-12 text-center">
              <Package className="w-16 h-16 mx-auto mb-4 text-muted-foreground" />
              <p className="text-muted-foreground">No orders found</p>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}
