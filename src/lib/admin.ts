import { supabase } from './supabase';

// =====================================================
// ADMIN ACCESS CONTROL
// =====================================================

export async function checkAdminAccess(userId: string): Promise<boolean> {
  const { data, error } = await supabase
    .from('user_profiles')
    .select('is_admin')
    .eq('id', userId)
    .single();

  if (error || !data) return false;
  return data.is_admin === true;
}

// =====================================================
// ADMIN ORDER MANAGEMENT
// =====================================================

export async function getAllOrders() {
  const { data: orders, error } = await supabase
    .from('orders')
    .select(`
      *,
      order_items (*),
      user_profiles (username, email)
    `)
    .order('created_at', { ascending: false });

  if (error) {
    console.error('Error fetching orders:', error);
    return [];
  }

  return orders;
}

export async function updateOrderStatus(
  orderId: string,
  status: string,
  trackingNumber?: string,
  deliveryPartner?: string,
  estimatedDeliveryDate?: string
) {
  const updateData: any = {
    status,
    updated_at: new Date().toISOString(),
  };

  if (trackingNumber) updateData.tracking_number = trackingNumber;
  if (deliveryPartner) updateData.delivery_partner = deliveryPartner;
  if (estimatedDeliveryDate) updateData.estimated_delivery_date = estimatedDeliveryDate;

  const { error } = await supabase
    .from('orders')
    .update(updateData)
    .eq('id', orderId);

  if (error) {
    console.error('Error updating order:', error);
    throw error;
  }

  return { success: true };
}

// =====================================================
// ADMIN INVENTORY MANAGEMENT
// =====================================================

export async function getAllInventory() {
  const { data, error } = await supabase
    .from('products_inventory')
    .select('*')
    .order('product_id');

  if (error) {
    console.error('Error fetching inventory:', error);
    return [];
  }

  return data;
}

export async function getInventoryAlerts() {
  const { data, error } = await supabase
    .from('inventory_alerts')
    .select('*');

  if (error) {
    console.error('Error fetching inventory alerts:', error);
    return [];
  }

  return data;
}

export async function updateInventory(
  productId: string,
  stockQuantity: number,
  lowStockThreshold?: number
) {
  const updateData: any = {
    stock_quantity: stockQuantity,
    updated_at: new Date().toISOString(),
  };

  if (lowStockThreshold !== undefined) {
    updateData.low_stock_threshold = lowStockThreshold;
  }

  const { error } = await supabase
    .from('products_inventory')
    .update(updateData)
    .eq('product_id', productId);

  if (error) {
    console.error('Error updating inventory:', error);
    throw error;
  }

  return { success: true };
}

export async function addInventoryItem(
  productId: string,
  stockQuantity: number = 100,
  lowStockThreshold: number = 10
) {
  const { error } = await supabase
    .from('products_inventory')
    .insert({
      product_id: productId,
      stock_quantity: stockQuantity,
      reserved_quantity: 0,
      low_stock_threshold: lowStockThreshold,
    });

  if (error) {
    console.error('Error adding inventory item:', error);
    throw error;
  }

  return { success: true };
}

// =====================================================
// SALES ANALYTICS
// =====================================================

export async function getSalesAnalytics(days: number = 30) {
  const { data, error } = await supabase
    .from('sales_analytics')
    .select('*')
    .limit(days);

  if (error) {
    console.error('Error fetching sales analytics:', error);
    return [];
  }

  return data;
}

export async function getOverallStats() {
  // Total orders
  const { count: totalOrders } = await supabase
    .from('orders')
    .select('*', { count: 'exact', head: true });

  // Total revenue
  const { data: revenueData } = await supabase
    .from('orders')
    .select('final_amount');

  const totalRevenue = revenueData?.reduce(
    (sum, order) => sum + parseFloat(order.final_amount),
    0
  ) || 0;

  // Orders by status
  const { data: statusData } = await supabase
    .from('orders')
    .select('status');

  const ordersByStatus = statusData?.reduce((acc: any, order) => {
    acc[order.status] = (acc[order.status] || 0) + 1;
    return acc;
  }, {}) || {};

  // Top selling products
  const { data: topProducts } = await supabase
    .from('order_items')
    .select('product_name, quantity')
    .order('quantity', { ascending: false })
    .limit(10);

  // Average order value
  const averageOrderValue = totalOrders ? totalRevenue / totalOrders : 0;

  return {
    totalOrders: totalOrders || 0,
    totalRevenue,
    averageOrderValue,
    ordersByStatus,
    topProducts: topProducts || [],
  };
}
