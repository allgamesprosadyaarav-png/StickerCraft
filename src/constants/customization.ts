export interface KeychainShape {
  id: string;
  name: string;
  svg: string;
  multiplier: number;
}

export const KEYCHAIN_SHAPES: KeychainShape[] = [
  {
    id: 'circle',
    name: 'Circle',
    svg: '<circle cx="50" cy="50" r="45" fill="currentColor"/>',
    multiplier: 1,
  },
  {
    id: 'square',
    name: 'Square',
    svg: '<rect x="10" y="10" width="80" height="80" rx="8" fill="currentColor"/>',
    multiplier: 1,
  },
  {
    id: 'star',
    name: 'Star',
    svg: '<path d="M50 5 L61 38 L95 38 L68 58 L79 91 L50 71 L21 91 L32 58 L5 38 L39 38 Z" fill="currentColor"/>',
    multiplier: 1.2,
  },
  {
    id: 'heart',
    name: 'Heart',
    svg: '<path d="M50,90 C50,90 10,65 10,40 C10,25 20,15 30,15 C40,15 50,25 50,25 C50,25 60,15 70,15 C80,15 90,25 90,40 C90,65 50,90 50,90 Z" fill="currentColor"/>',
    multiplier: 1.15,
  },
  {
    id: 'hexagon',
    name: 'Hexagon',
    svg: '<path d="M50 10 L85 30 L85 70 L50 90 L15 70 L15 30 Z" fill="currentColor"/>',
    multiplier: 1.1,
  },
];

export interface StickerSize {
  id: string;
  name: string;
  dimensions: string;
  priceMultiplier: number;
}

export const STICKER_SIZES: StickerSize[] = [
  { id: 'small', name: 'Small', dimensions: '2" × 2"', priceMultiplier: 1 },
  { id: 'medium', name: 'Medium', dimensions: '3" × 3"', priceMultiplier: 1.5 },
  { id: 'large', name: 'Large', dimensions: '4" × 4"', priceMultiplier: 2 },
  { id: 'xlarge', name: 'Extra Large', dimensions: '6" × 6"', priceMultiplier: 3 },
];

export const COLOR_FILTERS = [
  { id: 'none', name: 'Original', filter: 'none' },
  { id: 'vibrant', name: 'Vibrant', filter: 'saturate(1.5) contrast(1.1)' },
  { id: 'vintage', name: 'Vintage', filter: 'sepia(0.3) contrast(0.9)' },
  { id: 'cool', name: 'Cool', filter: 'hue-rotate(180deg) saturate(1.2)' },
  { id: 'warm', name: 'Warm', filter: 'hue-rotate(-30deg) saturate(1.3)' },
  { id: 'bw', name: 'B&W', filter: 'grayscale(1)' },
];

export const TEXT_FONTS = [
  { id: 'inter', name: 'Inter', family: 'Inter, sans-serif' },
  { id: 'comic', name: 'Comic', family: 'Comic Sans MS, cursive' },
  { id: 'bold', name: 'Bold Impact', family: 'Impact, sans-serif' },
  { id: 'handwriting', name: 'Handwriting', family: 'Brush Script MT, cursive' },
];

export const TEXT_COLORS = [
  { id: 'white', name: 'White', color: '#FFFFFF' },
  { id: 'black', name: 'Black', color: '#000000' },
  { id: 'red', name: 'Red', color: '#EF4444' },
  { id: 'blue', name: 'Blue', color: '#3B82F6' },
  { id: 'yellow', name: 'Yellow', color: '#FBBF24' },
  { id: 'pink', name: 'Pink', color: '#EC4899' },
];
