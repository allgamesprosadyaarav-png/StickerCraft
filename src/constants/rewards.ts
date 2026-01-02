import { Reward } from '../types';

export const REWARDS_CATALOG: Reward[] = [
  {
    id: 'reward-1',
    name: '₹50 Off Coupon',
    description: 'Get ₹50 discount on your next order',
    pointsCost: 500,
    type: 'discount',
    value: 50,
    icon: '💰',
  },
  {
    id: 'reward-2',
    name: '₹100 Off Coupon',
    description: 'Get ₹100 discount on orders above ₹500',
    pointsCost: 900,
    type: 'discount',
    value: 100,
    icon: '🎁',
  },
  {
    id: 'reward-3',
    name: 'Free Shipping',
    description: 'Free shipping on your next order',
    pointsCost: 300,
    type: 'freeShipping',
    value: 0,
    icon: '🚚',
  },
  {
    id: 'reward-4',
    name: '3 Free Stickers',
    description: 'Get 3 standard stickers for free',
    pointsCost: 200,
    type: 'freeProduct',
    value: 30,
    icon: '🏷️',
  },
  {
    id: 'reward-5',
    name: 'Free Anime Sticker',
    description: 'Get 1 anime sticker of your choice',
    pointsCost: 400,
    type: 'freeProduct',
    value: 25,
    icon: '⭐',
  },
  {
    id: 'reward-6',
    name: 'Exclusive Design',
    description: 'Access to limited edition exclusive design',
    pointsCost: 1000,
    type: 'exclusive',
    value: 0,
    icon: '✨',
  },
  {
    id: 'reward-7',
    name: '₹200 Off Coupon',
    description: 'Get ₹200 discount on orders above ₹1000',
    pointsCost: 1500,
    type: 'discount',
    value: 200,
    icon: '💎',
  },
  {
    id: 'reward-8',
    name: 'Premium Trial (7 Days)',
    description: '7 days of Premium membership benefits',
    pointsCost: 800,
    type: 'exclusive',
    value: 0,
    icon: '👑',
  },
];

export const PREMIUM_PRICE = 99;

export const PREMIUM_BENEFITS = [
  '⚡ Quick & Priority Delivery',
  '👑 Access to Premium Stickers & Keychains',
  '✨ Exclusive Limited Edition Designs',
  '💰 Extra 10% loyalty points on every order',
  '🎁 1 Free Premium Sticker every month',
  '🚀 Early access to new designs',
];
