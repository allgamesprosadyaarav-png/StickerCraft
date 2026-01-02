import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { CartItem, Product, CaseOption } from '../types';

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

export const useCartStore = create<CartState>()(
  persist(
    (set, get) => ({
      items: [],
      addItem: (product, selectedCase, customization) => {
        try {
          set((state) => {
            // Safety check - ensure state.items exists and is an array
            const currentItems = Array.isArray(state.items) ? state.items : [];
            
            const existingItem = currentItems.find(
              (item) => item?.product?.id === product?.id && 
              item?.selectedCase?.id === selectedCase?.id
            );
            
            if (existingItem) {
              return {
                items: currentItems.map((item) =>
                  item?.product?.id === product?.id && item?.selectedCase?.id === selectedCase?.id
                    ? { ...item, quantity: (item.quantity || 0) + 1 }
                    : item
                ),
              };
            }
            
            return {
              items: [...currentItems, { product, quantity: 1, selectedCase, customization }],
            };
          });
        } catch (error) {
          console.error('Error adding item to cart:', error);
          // Reset cart if corrupted
          set({ items: [{ product, quantity: 1, selectedCase, customization }] });
        }
      },
      removeItem: (productId) =>
        set((state) => ({
          items: state.items.filter((item) => item.product.id !== productId),
        })),
      updateQuantity: (productId, quantity) =>
        set((state) => ({
          items: quantity <= 0
            ? state.items.filter((item) => item.product.id !== productId)
            : state.items.map((item) =>
                item.product.id === productId ? { ...item, quantity } : item
              ),
        })),
      clearCart: () => set({ items: [] }),
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
    }),
    {
      name: 'cart-storage',
    }
  )
);
