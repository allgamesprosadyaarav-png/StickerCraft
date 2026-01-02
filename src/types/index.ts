export interface User {
  id: string;
  name: string;
  email: string;
  country: string;
  state: string;
  loyaltyPoints: number;
  loyaltyTier: 'Bronze' | 'Silver' | 'Gold' | 'Platinum';
  isPremium: boolean;
  premiumExpiryDate?: string;
}

export interface Product {
  id: string;
  name: string;
  type: 'sticker' | 'keychain';
  category: 'standard' | 'anime' | 'food' | 'minimalist' | 'gaming' | 'minecraft';
  price: number;
  image: string;
  description?: string;
}

export interface KeychainProduct extends Product {
  type: 'keychain';
  caseOptions: CaseOption[];
}

export interface CaseOption {
  id: string;
  name: string;
  color: string;
  priceModifier: number;
}

export interface CartItem {
  product: Product;
  quantity: number;
  selectedCase?: CaseOption;
  customization?: string;
}

export interface Order {
  id: string;
  userId: string;
  items: CartItem[];
  total: number;
  pointsEarned: number;
  shippingDetails: ShippingDetails;
  date: string;
  status: 'pending' | 'processing' | 'shipped' | 'delivered';
}

export interface ShippingDetails {
  name: string;
  email: string;
  phone: string;
  address: string;
  city: string;
  state: string;
  country: string;
  pincode: string;
}

export interface LoyaltyTier {
  name: 'Bronze' | 'Silver' | 'Gold' | 'Platinum';
  minPoints: number;
  discount: number;
  perks: string[];
}

export interface CustomDesign {
  id: string;
  type: 'sticker' | 'keychain';
  name: string;
  imageUrl?: string;
  uploadedImage?: string;
  text?: string;
  textFont?: string;
  textColor?: string;
  colorFilter?: string;
  size?: string;
  shape?: string;
  createdAt: string;
}

export interface Reward {
  id: string;
  name: string;
  description: string;
  pointsCost: number;
  type: 'discount' | 'freeShipping' | 'freeProduct' | 'exclusive';
  value: number;
  icon: string;
}

export interface RedeemedReward {
  id: string;
  userId: string;
  rewardId: string;
  reward: Reward;
  redeemedAt: string;
  used: boolean;
}
