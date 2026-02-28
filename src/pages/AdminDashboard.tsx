import { useState, useEffect } from 'react';
import { 
  BarChart3, Package, ShoppingBag, TrendingUp, AlertTriangle, 
  RefreshCw, Search, Filter, Download, Users, DollarSign 
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { Badge } from '../components/ui/badge';
import { OrdersManagement } from '../components/features/admin/OrdersManagement';
import { InventoryManagement } from '../components/features/admin/InventoryManagement';
import { SalesAnalytics } from '../components/features/admin/SalesAnalytics';
import { checkAdminAccess, getOverallStats } from '../lib/admin';
import { useAuthStore } from '../stores/authStore';

type AdminTab = 'dashboard' | 'orders' | 'inventory' | 'analytics';

export function AdminDashboard() {
  const [currentTab, setCurrentTab] = useState<AdminTab>('dashboard');
  const [isAdmin, setIsAdmin] = useState<boolean>(false);
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState<any>(null);
  const user = useAuthStore((state) => state.user);

  useEffect(() => {
    if (user) {
      checkAccess();
      loadStats();
    }
  }, [user]);

  const checkAccess = async () => {
    if (!user) return;
    
    const hasAccess = await checkAdminAccess(user.id);
    setIsAdmin(hasAccess);
    setLoading(false);
  };

  const loadStats = async () => {
    const data = await getOverallStats();
    setStats(data);
  };

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-12">
        <div className="flex items-center justify-center h-64">
          <RefreshCw className="w-8 h-8 animate-spin text-primary" />
        </div>
      </div>
    );
  }

  if (!isAdmin) {
    return (
      <div className="container mx-auto px-4 py-12">
        <Card className="max-w-md mx-auto text-center">
          <CardContent className="py-12 space-y-4">
            <AlertTriangle className="w-16 h-16 mx-auto text-yellow-500" />
            <h2 className="text-2xl font-bold">Access Denied</h2>
            <p className="text-muted-foreground">
              You don't have admin privileges to access this page.
            </p>
          </CardContent>
        </Card>
      </div>
    );
  }

  const tabs = [
    { id: 'dashboard', label: 'Dashboard', icon: BarChart3 },
    { id: 'orders', label: 'Orders', icon: ShoppingBag },
    { id: 'inventory', label: 'Inventory', icon: Package },
    { id: 'analytics', label: 'Analytics', icon: TrendingUp },
  ] as const;

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2">Admin Dashboard</h1>
        <p className="text-muted-foreground">
          Manage orders, inventory, and view analytics
        </p>
      </div>

      {/* Navigation Tabs */}
      <div className="flex gap-2 mb-6 overflow-x-auto pb-2">
        {tabs.map((tab) => (
          <Button
            key={tab.id}
            variant={currentTab === tab.id ? 'default' : 'outline'}
            onClick={() => setCurrentTab(tab.id as AdminTab)}
            className="gap-2"
          >
            <tab.icon className="w-4 h-4" />
            {tab.label}
          </Button>
        ))}
      </div>

      {/* Dashboard Overview */}
      {currentTab === 'dashboard' && stats && (
        <div className="space-y-6">
          {/* Stats Cards */}
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-sm font-medium text-muted-foreground">
                  Total Orders
                </CardTitle>
                <ShoppingBag className="w-4 h-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold">{stats.totalOrders}</div>
                <p className="text-xs text-muted-foreground mt-1">
                  All time orders
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-sm font-medium text-muted-foreground">
                  Total Revenue
                </CardTitle>
                <DollarSign className="w-4 h-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold text-green-600">
                  ₹{stats.totalRevenue.toFixed(2)}
                </div>
                <p className="text-xs text-muted-foreground mt-1">
                  All time revenue
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-sm font-medium text-muted-foreground">
                  Average Order Value
                </CardTitle>
                <TrendingUp className="w-4 h-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold text-primary">
                  ₹{stats.averageOrderValue.toFixed(2)}
                </div>
                <p className="text-xs text-muted-foreground mt-1">
                  Per order average
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-sm font-medium text-muted-foreground">
                  Pending Orders
                </CardTitle>
                <AlertTriangle className="w-4 h-4 text-yellow-500" />
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold text-yellow-600">
                  {stats.ordersByStatus.pending || 0}
                </div>
                <p className="text-xs text-muted-foreground mt-1">
                  Awaiting processing
                </p>
              </CardContent>
            </Card>
          </div>

          {/* Order Status Breakdown */}
          <Card>
            <CardHeader>
              <CardTitle>Orders by Status</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
                {Object.entries(stats.ordersByStatus).map(([status, count]) => (
                  <div key={status} className="text-center p-4 bg-muted rounded-lg">
                    <div className="text-2xl font-bold text-primary">{count as number}</div>
                    <div className="text-xs text-muted-foreground capitalize mt-1">
                      {status}
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Top Products */}
          <Card>
            <CardHeader>
              <CardTitle>Top Selling Products</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {stats.topProducts.slice(0, 5).map((product: any, index: number) => (
                  <div
                    key={index}
                    className="flex items-center justify-between p-3 bg-muted rounded-lg"
                  >
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 bg-primary rounded-full flex items-center justify-center text-primary-foreground font-bold">
                        #{index + 1}
                      </div>
                      <span className="font-medium">{product.product_name}</span>
                    </div>
                    <Badge variant="secondary">{product.quantity} sold</Badge>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Orders Management */}
      {currentTab === 'orders' && <OrdersManagement />}

      {/* Inventory Management */}
      {currentTab === 'inventory' && <InventoryManagement />}

      {/* Sales Analytics */}
      {currentTab === 'analytics' && <SalesAnalytics />}
    </div>
  );
}
