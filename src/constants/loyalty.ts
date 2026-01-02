import { LoyaltyTier } from '../types';

export const LOYALTY_TIERS: LoyaltyTier[] = [
  {
    name: 'Bronze',
    minPoints: 0,
    discount: 0,
    perks: ['Earn 1 point per ₹10 spent', 'Early access to sales'],
  },
  {
    name: 'Silver',
    minPoints: 2000,
    discount: 5,
    perks: ['5% discount on all orders', 'Free shipping on orders over ₹500', 'Birthday gift'],
  },
  {
    name: 'Gold',
    minPoints: 5000,
    discount: 10,
    perks: ['10% discount on all orders', 'Free shipping always', 'Exclusive designs', 'Priority support'],
  },
  {
    name: 'Platinum',
    minPoints: 10000,
    discount: 15,
    perks: ['15% discount on all orders', 'Free expedited shipping', 'Exclusive platinum-only designs', 'Personal design consultant', 'Early product launches'],
  },
];

export const POINTS_PER_RUPEE = 0.1; // 1 point per ₹10 spent
