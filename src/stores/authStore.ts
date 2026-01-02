import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { User, RedeemedReward } from '../types';

interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
  redeemedRewards: RedeemedReward[];
  login: (userData: Omit<User, 'id' | 'loyaltyPoints' | 'loyaltyTier' | 'isPremium'>) => void;
  logout: () => void;
  updateLoyaltyPoints: (points: number) => void;
  updateLoyaltyTier: () => void;
  redeemPoints: (points: number, reward: RedeemedReward) => boolean;
  activatePremium: (months: number) => void;
  checkPremiumExpiry: () => void;
}

const getTierForPoints = (points: number): User['loyaltyTier'] => {
  if (points >= 10000) return 'Platinum';
  if (points >= 5000) return 'Gold';
  if (points >= 2000) return 'Silver';
  return 'Bronze';
};

export const useAuthStore = create<AuthState>()(
  persist(
    (set, get) => ({
      user: null,
      isAuthenticated: false,
      redeemedRewards: [],
      login: (userData) => {
        const newUser: User = {
          ...userData,
          id: crypto.randomUUID(),
          loyaltyPoints: 0,
          loyaltyTier: 'Bronze',
          isPremium: false,
        };
        set({ user: newUser, isAuthenticated: true });
      },
      logout: () => set({ user: null, isAuthenticated: false, redeemedRewards: [] }),
      updateLoyaltyPoints: (points) =>
        set((state) => {
          if (!state.user) return state;
          const newPoints = state.user.loyaltyPoints + points;
          const newTier = getTierForPoints(newPoints);
          return {
            user: {
              ...state.user,
              loyaltyPoints: newPoints,
              loyaltyTier: newTier,
            },
          };
        }),
      updateLoyaltyTier: () =>
        set((state) => {
          if (!state.user) return state;
          return {
            user: {
              ...state.user,
              loyaltyTier: getTierForPoints(state.user.loyaltyPoints),
            },
          };
        }),
      redeemPoints: (points, reward) => {
        const state = get();
        if (!state.user || state.user.loyaltyPoints < points) {
          return false;
        }
        set({
          user: {
            ...state.user,
            loyaltyPoints: state.user.loyaltyPoints - points,
          },
          redeemedRewards: [...state.redeemedRewards, reward],
        });
        return true;
      },
      activatePremium: (months) =>
        set((state) => {
          if (!state.user) return state;
          const now = new Date();
          const expiryDate = new Date(now.setMonth(now.getMonth() + months));
          return {
            user: {
              ...state.user,
              isPremium: true,
              premiumExpiryDate: expiryDate.toISOString(),
            },
          };
        }),
      checkPremiumExpiry: () =>
        set((state) => {
          if (!state.user || !state.user.isPremium || !state.user.premiumExpiryDate) {
            return state;
          }
          const now = new Date();
          const expiryDate = new Date(state.user.premiumExpiryDate);
          if (now > expiryDate) {
            return {
              user: {
                ...state.user,
                isPremium: false,
                premiumExpiryDate: undefined,
              },
            };
          }
          return state;
        }),
    }),
    {
      name: 'auth-storage',
    }
  )
);
