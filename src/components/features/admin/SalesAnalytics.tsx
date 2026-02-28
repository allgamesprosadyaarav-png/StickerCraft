import { useState, useEffect } from 'react';
import { TrendingUp, DollarSign, ShoppingBag, Users, Calendar } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '../../ui/card';
import { getSalesAnalytics, getOverallStats } from '../../../lib/admin';

export function SalesAnalytics() {
  const [analytics, setAnalytics] = useState<any[]>([]);
  const [stats, setStats] = useState<any>(null);
  const [timeRange, setTimeRange] = useState(30);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadAnalytics();
  }, [timeRange]);

  const loadAnalytics = async () => {
    setLoading(true);
    const [analyticsData, statsData] = await Promise.all([
      getSalesAnalytics(timeRange),
      getOverallStats(),
    ]);
    setAnalytics(analyticsData);
    setStats(statsData);
    setLoading(false);
  };

  const calculateTrend = () => {
    if (analytics.length < 2) return 0;
    const recent = analytics.slice(0, 7).reduce((sum, day) => sum + parseFloat(day.total_revenue || 0), 0);
    const previous = analytics.slice(7, 14).reduce((sum, day) => sum + parseFloat(day.total_revenue || 0), 0);
    if (previous === 0) return 100;
    return ((recent - previous) / previous * 100).toFixed(1);
  };

  const trend = calculateTrend();

  return (
    <div className="space-y-6">
      {/* Time Range Selector */}
      <Card>
        <CardContent className="p-4">
          <div className="flex items-center gap-2">
            <Calendar className="w-4 h-4 text-muted-foreground" />
            <span className="text-sm font-medium">Time Range:</span>
            <div className="flex gap-2">
              {[7, 30, 90].map((days) => (
                <button
                  key={days}
                  onClick={() => setTimeRange(days)}
                  className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                    timeRange === days
                      ? 'bg-primary text-primary-foreground'
                      : 'bg-muted hover:bg-muted/80'
                  }`}
                >
                  {days} Days
                </button>
              ))}
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Overview Stats */}
      {stats && (
        <div className="grid md:grid-cols-4 gap-4">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                Total Revenue
              </CardTitle>
              <DollarSign className="w-4 h-4 text-green-600" />
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-green-600">
                ₹{stats.totalRevenue.toFixed(2)}
              </div>
              <p className="text-xs text-muted-foreground mt-1">
                {trend >= 0 ? '+' : ''}{trend}% from last period
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                Total Orders
              </CardTitle>
              <ShoppingBag className="w-4 h-4 text-blue-600" />
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-blue-600">
                {stats.totalOrders}
              </div>
              <p className="text-xs text-muted-foreground mt-1">
                All time orders
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                Avg Order Value
              </CardTitle>
              <TrendingUp className="w-4 h-4 text-purple-600" />
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-purple-600">
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
                Revenue/Day
              </CardTitle>
              <Calendar className="w-4 h-4 text-orange-600" />
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-orange-600">
                ₹{(stats.totalRevenue / timeRange).toFixed(2)}
              </div>
              <p className="text-xs text-muted-foreground mt-1">
                Average per day
              </p>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Daily Revenue Chart */}
      <Card>
        <CardHeader>
          <CardTitle>Daily Revenue Breakdown</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-2">
            {analytics.slice(0, 15).map((day) => {
              const revenue = parseFloat(day.total_revenue || 0);
              const maxRevenue = Math.max(...analytics.map(d => parseFloat(d.total_revenue || 0)));
              const percentage = maxRevenue > 0 ? (revenue / maxRevenue) * 100 : 0;

              return (
                <div key={day.date} className="space-y-1">
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-muted-foreground">
                      {new Date(day.date).toLocaleDateString()}
                    </span>
                    <div className="flex items-center gap-4">
                      <span className="text-muted-foreground">
                        {day.order_count} orders
                      </span>
                      <span className="font-bold text-primary">
                        ₹{revenue.toFixed(2)}
                      </span>
                    </div>
                  </div>
                  <div className="w-full bg-muted rounded-full h-2">
                    <div
                      className="bg-gradient-to-r from-green-500 to-emerald-500 h-2 rounded-full transition-all"
                      style={{ width: `${percentage}%` }}
                    />
                  </div>
                </div>
              );
            })}
          </div>
        </CardContent>
      </Card>

      {/* Top Products */}
      {stats && stats.topProducts.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle>Best Selling Products</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {stats.topProducts.slice(0, 10).map((product: any, index: number) => (
                <div
                  key={index}
                  className="flex items-center justify-between p-3 bg-muted rounded-lg"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-primary rounded-full flex items-center justify-center text-primary-foreground font-bold">
                      #{index + 1}
                    </div>
                    <div>
                      <p className="font-medium">{product.product_name}</p>
                      <p className="text-sm text-muted-foreground">
                        {product.quantity} units sold
                      </p>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="w-24 bg-muted-foreground/20 rounded-full h-2">
                      <div
                        className="bg-primary h-2 rounded-full"
                        style={{
                          width: `${(product.quantity / stats.topProducts[0].quantity) * 100}%`,
                        }}
                      />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
