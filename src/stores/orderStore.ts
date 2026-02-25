import { create } from 'zustand';
import { Order } from '../types';
import { loadOrders, createOrder as dbCreateOrder } from '../lib/database';
import type { CartItem } from '../types';

interface OrderState {
  orders: Order[];
  loading: boolean;
  error: string | null;
  createOrder: (orderData: {
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
  }) => Promise<{ success: boolean; order?: Order; error?: string }>;
  loadUserOrders: (userId: string) => Promise<void>;
  getOrdersByUserId: (userId: string) => Order[];
}

export const useOrderStore = create<OrderState>()((set, get) => ({
  orders: [],
  loading: false,
  error: null,
  
  createOrder: async (orderData) => {
    set({ loading: true, error: null });
    try {
      const result = await dbCreateOrder(orderData);
      
      if (result.success && result.order) {
        set((state) => ({
          orders: [result.order!, ...state.orders],
          loading: false,
        }));
      } else {
        set({ loading: false, error: result.error || 'Failed to create order' });
      }
      
      return result;
    } catch (error: any) {
      set({ loading: false, error: error.message });
      return { success: false, error: error.message };
    }
  },
  
  loadUserOrders: async (userId: string) => {
    set({ loading: true, error: null });
    try {
      const orders = await loadOrders(userId);
      set({ orders, loading: false });
    } catch (error: any) {
      set({ loading: false, error: error.message });
    }
  },
  
  getOrdersByUserId: (userId: string) => {
    const state = get();
    return state.orders.filter((order) => order.userId === userId);
  },
}));

// Load orders when user logs in
export async function loadUserOrders(userId: string) {
  await useOrderStore.getState().loadUserOrders(userId);
}
