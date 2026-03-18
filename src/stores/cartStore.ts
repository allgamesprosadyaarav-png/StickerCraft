import { create } from 'zustand';
import { CartItem, Product, CaseOption } from '../types';
import { saveCartToDatabase, removeItemFromCart as dbRemoveItem, updateCartItemQuantity as dbUpdateQuantity, clearCart as dbClearCart, loadCartFromDatabase } from '../lib/database';
import { useAuthStore } from './authStore';
import { toast } from '../hooks/use-toast';

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
    const userId = useAuthStore.getState().user?.id;
    if (!userId) {
      console.error('No user logged in');
      toast({
        title: 'Authentication required',
        description: 'Please log in to add items to cart',
        variant: 'destructive',
      });
      return;
    }

    // Validate product data with extensive checks
    if (!product || 
        !product.id || 
        !product.name || 
        typeof product.price !== 'number' || 
        !product.type || 
        !product.category ||
        !product.image) {
      console.error('Invalid product data:', product);
      toast({
        title: 'Invalid product',
        description: 'Unable to add this item to cart. Please refresh and try again.',
        variant: 'destructive',
      });
      return;
    }

    // Create a clean product object to avoid any reference issues
    const cleanProduct = {
      id: String(product.id),
      name: String(product.name),
      type: product.type,
      category: product.category,
      price: Number(product.price),
      image: String(product.image),
      description: product.description || '',
    };

    // Update state SYNCHRONOUSLY (no try-catch to avoid blocking)
    const currentItems = Array.isArray(get().items) ? [...get().items].filter(item => item && item.product) : [];
    const existingItem = currentItems.find(
      (item) => item?.product?.id === cleanProduct.id && 
      item?.selectedCase?.id === selectedCase?.id
    );
    
    if (existingItem) {
      set({
        items: currentItems.map((item) =>
          item?.product?.id === cleanProduct.id && item?.selectedCase?.id === selectedCase?.id
            ? { ...item, quantity: (item.quantity || 0) + 1 }
            : item
        )
      });
    } else {
      const newItem: CartItem = { 
        product: cleanProduct, 
        quantity: 1, 
        selectedCase: selectedCase || undefined, 
        customization: customization || undefined 
      };
      set({ items: [...currentItems, newItem] });
    }

    // Show success message immediately
    toast({
      title: 'Added to cart! 🎉',
      description: `${cleanProduct.name} has been added to your cart`,
    });

    // Then save to database (completely async, fire-and-forget)
    setTimeout(() => {
      const currentState = get();
      saveCartToDatabase(userId, currentState.items)
        .catch(err => console.error('Failed to save to database (non-blocking):', err));
    }, 500);
  },
  
  removeItem: async (productId) => {
    try {
      const userId = useAuthStore.getState().user?.id;
      if (!userId) return;
      
      // Update state first (optimistic)
      set((state) => ({
        items: state.items.filter((item) => item.product.id !== productId),
      }));

      // Then update database
      await dbRemoveItem(userId, productId).catch((err) => {
        console.error('Failed to remove from database:', err);
      });
    } catch (error) {
      console.error('Error removing item:', error);
      toast({
        title: 'Error removing item',
        description: 'Please try again',
        variant: 'destructive',
      });
    }
  },
  
  updateQuantity: async (productId, quantity) => {
    try {
      const userId = useAuthStore.getState().user?.id;
      if (!userId) return;
      
      // Update state first (optimistic)
      set((state) => ({
        items: quantity <= 0
          ? state.items.filter((item) => item.product.id !== productId)
          : state.items.map((item) =>
              item.product.id === productId ? { ...item, quantity } : item
            ),
      }));

      // Then update database
      await dbUpdateQuantity(userId, productId, quantity).catch((err) => {
        console.error('Failed to update quantity in database:', err);
      });
    } catch (error) {
      console.error('Error updating quantity:', error);
      toast({
        title: 'Error updating quantity',
        description: 'Please try again',
        variant: 'destructive',
      });
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
