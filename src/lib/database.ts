import { supabase } from './supabase';
import type { CartItem, Order } from '../types';

// =====================================================
// CART OPERATIONS
// =====================================================

export async function loadCartFromDatabase(userId: string): Promise<CartItem[]> {
  const { data, error } = await supabase
    .from('cart_items')
    .select('*')
    .eq('user_id', userId);

  if (error) {
    console.error('Error loading cart:', error);
    return [];
  }

  return (data || []).map((item) => ({
    product: {
      id: item.product_id,
      name: item.product_name,
      type: item.product_type,
      category: item.product_category,
      price: parseFloat(item.price),
      image: item.product_image,
      description: '',
    },
    quantity: item.quantity,
    selectedCase: item.customizations?.selectedCase,
    customization: item.customizations?.customization,
  }));
}

export async function saveCartToDatabase(userId: string, items: CartItem[]) {
  // First, clear existing cart
  await supabase.from('cart_items').delete().eq('user_id', userId);

  if (items.length === 0) return;

  // Insert new items
  const cartItems = items.map((item) => ({
    user_id: userId,
    product_id: item.product.id,
    product_name: item.product.name,
    product_type: item.product.type,
    product_category: item.product.category,
    product_image: item.product.image,
    price: item.product.price,
    quantity: item.quantity,
    customizations: {
      selectedCase: item.selectedCase,
      customization: item.customization,
    },
  }));

  const { error } = await supabase.from('cart_items').insert(cartItems);

  if (error) {
    console.error('Error saving cart:', error);
  }
}

export async function addItemToCart(userId: string, item: CartItem) {
  const { error } = await supabase.from('cart_items').upsert({
    user_id: userId,
    product_id: item.product.id,
    product_name: item.product.name,
    product_type: item.product.type,
    product_category: item.product.category,
    product_image: item.product.image,
    price: item.product.price,
    quantity: item.quantity,
    customizations: {
      selectedCase: item.selectedCase,
      customization: item.customization,
    },
  });

  if (error) {
    console.error('Error adding item to cart:', error);
    throw error;
  }
}

export async function removeItemFromCart(userId: string, productId: string) {
  const { error } = await supabase
    .from('cart_items')
    .delete()
    .eq('user_id', userId)
    .eq('product_id', productId);

  if (error) {
    console.error('Error removing item from cart:', error);
    throw error;
  }
}

export async function updateCartItemQuantity(
  userId: string,
  productId: string,
  quantity: number
) {
  if (quantity <= 0) {
    return removeItemFromCart(userId, productId);
  }

  const { error } = await supabase
    .from('cart_items')
    .update({ quantity, updated_at: new Date().toISOString() })
    .eq('user_id', userId)
    .eq('product_id', productId);

  if (error) {
    console.error('Error updating cart item quantity:', error);
    throw error;
  }
}

export async function clearCart(userId: string) {
  const { error } = await supabase
    .from('cart_items')
    .delete()
    .eq('user_id', userId);

  if (error) {
    console.error('Error clearing cart:', error);
    throw error;
  }
}

// =====================================================
// ORDER OPERATIONS
// =====================================================

export async function createOrder(orderData: {
  userId: string;
  items: CartItem[];
  totalAmount: number;
  discountAmount: number;
  deliveryFee: number;
  finalAmount: number;
  customerInfo: {
    name: string;
    email: string;
    phone: string;
    address: {
      street: string;
      city: string;
      state: string;
      country: string;
      pincode: string;
    };
  };
  specialInstructions?: string;
}): Promise<{ success: boolean; order?: Order; error?: string }> {
  try {
    // Generate order number
    const orderNumber = `ORD-${Date.now()}-${Math.random().toString(36).substr(2, 9).toUpperCase()}`;

    // Create order
    const { data: order, error: orderError } = await supabase
      .from('orders')
      .insert({
        user_id: orderData.userId,
        order_number: orderNumber,
        status: 'pending',
        total_amount: orderData.totalAmount,
        discount_amount: orderData.discountAmount,
        delivery_fee: orderData.deliveryFee,
        final_amount: orderData.finalAmount,
        customer_name: orderData.customerInfo.name,
        customer_email: orderData.customerInfo.email,
        customer_phone: orderData.customerInfo.phone,
        delivery_address: orderData.customerInfo.address,
        special_instructions: orderData.specialInstructions || null,
      })
      .select()
      .single();

    if (orderError) throw orderError;

    // Create order items
    const orderItems = orderData.items.map((item) => ({
      order_id: order.id,
      product_id: item.product.id,
      product_name: item.product.name,
      product_type: item.product.type,
      product_category: item.product.category,
      product_image: item.product.image,
      quantity: item.quantity,
      unit_price: item.product.price,
      total_price: item.product.price * item.quantity,
      customizations: {
        selectedCase: item.selectedCase,
        customization: item.customization,
      },
    }));

    const { error: itemsError } = await supabase
      .from('order_items')
      .insert(orderItems);

    if (itemsError) throw itemsError;

    // Clear cart after successful order
    await clearCart(orderData.userId);

    // Send order notification
    await sendOrderNotification(order, orderData.items);

    return {
      success: true,
      order: {
        id: order.id,
        orderNumber: order.order_number,
        userId: order.user_id,
        status: order.status,
        items: orderData.items,
        total: order.final_amount,
        createdAt: order.created_at,
        deliveryAddress: order.delivery_address,
        trackingNumber: order.tracking_number,
      },
    };
  } catch (error: any) {
    console.error('Error creating order:', error);
    return {
      success: false,
      error: error.message || 'Failed to create order',
    };
  }
}

export async function loadOrders(userId: string): Promise<Order[]> {
  const { data: orders, error: ordersError } = await supabase
    .from('orders')
    .select(`
      *,
      order_items (*)
    `)
    .eq('user_id', userId)
    .order('created_at', { ascending: false });

  if (ordersError) {
    console.error('Error loading orders:', ordersError);
    return [];
  }

  return (orders || []).map((order) => ({
    id: order.id,
    orderNumber: order.order_number,
    userId: order.user_id,
    status: order.status,
    items: (order.order_items || []).map((item: any) => ({
      product: {
        id: item.product_id,
        name: item.product_name,
        type: item.product_type,
        category: item.product_category,
        price: parseFloat(item.unit_price),
        image: item.product_image,
        description: '',
      },
      quantity: item.quantity,
      selectedCase: item.customizations?.selectedCase,
      customization: item.customizations?.customization,
    })),
    total: parseFloat(order.final_amount),
    createdAt: order.created_at,
    deliveryAddress: order.delivery_address,
    trackingNumber: order.tracking_number,
  }));
}

export async function updateOrderStatus(
  orderId: string,
  status: string,
  trackingNumber?: string
) {
  const updateData: any = {
    status,
    updated_at: new Date().toISOString(),
  };

  if (trackingNumber) {
    updateData.tracking_number = trackingNumber;
  }

  const { error } = await supabase
    .from('orders')
    .update(updateData)
    .eq('id', orderId);

  if (error) {
    console.error('Error updating order status:', error);
    throw error;
  }
}

// =====================================================
// INVENTORY OPERATIONS
// =====================================================

export async function checkProductAvailability(
  productId: string,
  quantity: number
): Promise<boolean> {
  const { data, error } = await supabase
    .from('products_inventory')
    .select('available_quantity')
    .eq('product_id', productId)
    .single();

  if (error || !data) {
    console.error('Error checking inventory:', error);
    return true; // Allow purchase if inventory check fails
  }

  return data.available_quantity >= quantity;
}

export async function reserveInventory(productId: string, quantity: number) {
  const { error } = await supabase.rpc('reserve_inventory', {
    p_product_id: productId,
    p_quantity: quantity,
  });

  if (error) {
    console.error('Error reserving inventory:', error);
    throw error;
  }
}

// =====================================================
// NOTIFICATIONS
// =====================================================

async function sendOrderNotification(order: any, items: CartItem[]) {
  try {
    // Call edge function to send notification
    await supabase.functions.invoke('send-order-notification', {
      body: {
        orderNumber: order.order_number,
        customerName: order.customer_name,
        customerPhone: order.customer_phone,
        totalAmount: order.final_amount,
        items: items.map((item) => ({
          name: item.product.name,
          quantity: item.quantity,
          price: item.product.price,
        })),
      },
    });
  } catch (error) {
    console.error('Error sending order notification:', error);
    // Don't throw - notification failure shouldn't block order
  }
}
