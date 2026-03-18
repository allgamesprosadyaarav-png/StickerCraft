import { create } from 'zustand';
import { CartItem, Product, CaseOption } from '../types';
import { saveCartToDatabase, removeItemFromCart as dbRemoveItem, updateCartItemQuantity as dbUpdateQuantity, clearCart as dbClearCart, loadCartFromDatabase } from '../lib/database';
import { useAuthStore } from './authStore';
import { toast } from '../hooks/use-toast';

interface CartState {
  items: CartItem[];
  addItem: (product: Product, selectedCase?: CaseOption, customization?: string) => void;
  removeItem: (productId: string) => void;
  updateQuantity: (productId: string, quantity: number) => void;
  clearCart: () => void;
  getTotal: () => number;
  getKeychainCount: () => number;
  shouldApplyOffer: () => boolean;
}

// Background database sync (completely non-blocking)
let syncTimeout: NodeJS.Timeout | null = null;
function scheduleDatabaseSync(userId: string, items: CartItem[]) {
  if (syncTimeout) clearTimeout(syncTimeout);
  syncTimeout = setTimeout(() => {
    saveCartToDatabase(userId, items)
      .catch(err => console.log('Background sync failed (non-critical):', err));
  }, 1000);
}

export const useCartStore = create<CartState>()((set, get) => ({
  items: [],
  
  addItem: (product, selectedCase, customization) => {
    try {
      const userId = useAuthStore.getState().user?.id;
      if (!userId) {
        toast({
          title: 'Please log in',
          description: 'You need to be logged in to add items to cart',
        });
        return;
      }

      // Strict validation
      if (!product?.id || !product?.name || typeof product?.price !== 'number') {
        console.error('Invalid product:', product);
        toast({
          title: 'Error',
          description: 'Invalid product data',
        });
        return;
      }

      // Clean and freeze product data
      const cleanProduct = Object.freeze({
        id: String(product.id),
        name: String(product.name),
        type: product.type || 'sticker',
        category: product.category || 'standard',
        price: Number(product.price),
        image: String(product.image || ''),
        description: String(product.description || ''),
      });

      // Update state SYNCHRONOUSLY - no async operations here
      const currentItems = [...(get().items || [])];
      const existingItemIndex = currentItems.findIndex(
        (item) => item?.product?.id === cleanProduct.id && 
                  item?.selectedCase?.id === selectedCase?.id
      );
      
      if (existingItemIndex >= 0) {
        // Update existing item
        currentItems[existingItemIndex] = {
          ...currentItems[existingItemIndex],
          quantity: currentItems[existingItemIndex].quantity + 1
        };
      } else {
        // Add new item
        currentItems.push({ 
          product: cleanProduct, 
          quantity: 1, 
          selectedCase, 
          customization 
        });
      }

      // Update state immediately
      set({ items: currentItems });

      // Show success toast
      toast({
        title: '✅ Added to cart!',
        description: cleanProduct.name,
      });

      // Schedule background database sync (non-blocking)
      scheduleDatabaseSync(userId, currentItems);
    } catch (error) {
      console.error('Cart error:', error);
      toast({
        title: 'Error',
        description: 'Failed to add item. Please try again.',
      });
    }
  },
  
  removeItem: (productId) => {
    try {
      const userId = useAuthStore.getState().user?.id;
      if (!userId) return;
      
      // Update state immediately
      const currentItems = get().items.filter((item) => item.product.id !== productId);
      set({ items: currentItems });

      // Background sync
      scheduleDatabaseSync(userId, currentItems);
    } catch (error) {
      console.error('Error removing item:', error);
    }
  },
  
  updateQuantity: (productId, quantity) => {
    try {
      const userId = useAuthStore.getState().user?.id;
      if (!userId) return;
      
      // Update state immediately
      const currentItems = quantity <= 0
        ? get().items.filter((item) => item.product.id !== productId)
        : get().items.map((item) =>
            item.product.id === productId ? { ...item, quantity } : item
          );
      
      set({ items: currentItems });

      // Background sync
      scheduleDatabaseSync(userId, currentItems);
    } catch (error) {
      console.error('Error updating quantity:', error);
    }
  },
  
  clearCart: () => {
    try {
      const userId = useAuthStore.getState().user?.id;
      set({ items: [] });
      
      if (userId) {
        dbClearCart(userId).catch(err => console.log('Clear cart DB error:', err));
      }
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
