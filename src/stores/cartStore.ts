import { create } from 'zustand';
import { CartItem, Product, CaseOption } from '../types';
import { saveCartToDatabase, removeItemFromCart as dbRemoveItem, updateCartItemQuantity as dbUpdateQuantity, clearCart as dbClearCart, loadCartFromDatabase } from '../lib/database';
import { useAuthStore } from './authStore';

interface CartState {
  items: CartItem[];
  addItem: (product: Product, selectedCase?: CaseOption, customization?: string) => Promise<void>;
  removeItem: (productId: string) => Promise<void>;
  updateQuantity: (productId: string, quantity: number) => Promise<void>;
  clearCart: () => Promise<void>;
  getTotal: () => number;
  getKeychainCount: () => number;
  shouldApplyOffer: () => boolean;
}

export const useCartStore = create<CartState>()((set, get) => ({
  items: [],
  
  addItem: async (product, selectedCase, customization) => {
    try {
      const userId = useAuthStore.getState().user?.id;
      if (!userId) {
        console.error('No user logged in');
        return;
      }

      set((state) => {
        const currentItems = Array.isArray(state.items) ? state.items : [];
        const existingItem = currentItems.find(
          (item) => item?.product?.id === product?.id && 
          item?.selectedCase?.id === selectedCase?.id
        );
        
        if (existingItem) {
          const updatedItems = currentItems.map((item) =>
            item?.product?.id === product?.id && item?.selectedCase?.id === selectedCase?.id
              ? { ...item, quantity: (item.quantity || 0) + 1 }
              : item
          );
          saveCartToDatabase(userId, updatedItems);
          return { items: updatedItems };
        }
        
        const newItem: CartItem = { product, quantity: 1, selectedCase, customization };
        const updatedItems = [...currentItems, newItem];
        saveCartToDatabase(userId, updatedItems);
        return { items: updatedItems };
      });
    } catch (error) {
      console.error('Error adding item to cart:', error);
    }
  },
  
  removeItem: async (productId) => {
    try {
      const userId = useAuthStore.getState().user?.id;
      if (!userId) return;
      
      await dbRemoveItem(userId, productId);
      set((state) => ({
        items: state.items.filter((item) => item.product.id !== productId),
      }));
    } catch (error) {
      console.error('Error removing item:', error);
    }
  },
  
  updateQuantity: async (productId, quantity) => {
    try {
      const userId = useAuthStore.getState().user?.id;
      if (!userId) return;
      
      await dbUpdateQuantity(userId, productId, quantity);
      set((state) => ({
        items: quantity <= 0
          ? state.items.filter((item) => item.product.id !== productId)
          : state.items.map((item) =>
              item.product.id === productId ? { ...item, quantity } : item
            ),
      }));
    } catch (error) {
      console.error('Error updating quantity:', error);
    }
  },
  
  clearCart: async () => {
    try {
      const userId = useAuthStore.getState().user?.id;
      if (userId) {
        await dbClearCart(userId);
      }
      set({ items: [] });
    } catch (error) {
      console.error('Error clearing cart:', error);
    }
  },
  
  getTotal: () => {
    try {
      const state = get();
      if (!Array.isArray(state.items)) return 0;
      
      return state.items.reduce((total, item) => {
        if (!item?.product?.price) return total;
        const basePrice = item.product.price || 0;
        const casePrice = item.selectedCase?.priceModifier || 0;
        const quantity = item.quantity || 0;
        return total + (basePrice + casePrice) * quantity;
      }, 0);
    } catch (error) {
      console.error('Error calculating total:', error);
      return 0;
    }
  },
  
  getKeychainCount: () => {
    const state = get();
    return state.items
      .filter((item) => item.product.type === 'keychain')
      .reduce((sum, item) => sum + item.quantity, 0);
  },
  
  shouldApplyOffer: () => {
    const state = get();
    return state.getKeychainCount() >= 2;
  },
}));

// Load cart from database when user logs in
export async function loadUserCart(userId: string) {
  try {
    const items = await loadCartFromDatabase(userId);
    useCartStore.setState({ items });
  } catch (error) {
    console.error('Error loading user cart:', error);
  }
}
