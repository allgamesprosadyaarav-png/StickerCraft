export interface StickerPack {
  id: string;
  name: string;
  description: string;
  stickerCount: number;
  regularPrice: number;
  packPrice: number;
  savings: number;
  image: string;
  category: 'anime' | 'kawaii' | 'nature' | 'food';
}

export const STICKER_PACKS: StickerPack[] = [
  {
    id: 'pack-anime-1',
    name: 'Demon Slayer Pack',
    description: 'Complete Demon Slayer collection with Tanjiro, Nezuko, Zenitsu & more',
    stickerCount: 5,
    regularPrice: 125,
    packPrice: 99,
    savings: 26,
    image: 'https://cdn-ai.onspace.ai/onspace/files/8MHRzfJ3EqTQp4Ymqgi5Bb/pasted-image-1765088250437-0.png',
    category: 'anime',
  },
  {
    id: 'pack-anime-2',
    name: 'Naruto Legends Pack',
    description: 'Iconic Naruto universe: Naruto, Sasuke, Kakashi & Deku',
    stickerCount: 5,
    regularPrice: 125,
    packPrice: 99,
    savings: 26,
    image: 'https://cdn-ai.onspace.ai/onspace/files/nxMYRmfojssin5L8EbPsrd/pasted-image-1765102288304-0.png',
    category: 'anime',
  },
  {
    id: 'pack-anime-3',
    name: 'Legendary Pirates & Saiyans Pack',
    description: 'Epic collection: Luffy, Goku, Vegeta, and more heroes',
    stickerCount: 6,
    regularPrice: 150,
    packPrice: 119,
    savings: 31,
    image: 'https://cdn-ai.onspace.ai/onspace/files/naFdBBK3XimGUcUicCoNSZ/luf.jpeg',
    category: 'anime',
  },
  {
    id: 'pack-kawaii-1',
    name: 'Kawaii Animals Pack',
    description: 'Adorable collection of cute cats, pandas, and friends',
    stickerCount: 5,
    regularPrice: 50,
    packPrice: 39,
    savings: 11,
    image: 'https://api.dicebear.com/7.x/bottts/svg?seed=kawaii&backgroundColor=ffd5dc',
    category: 'kawaii',
  },
  {
    id: 'pack-food-1',
    name: 'Yummy Treats Pack',
    description: 'Delicious donuts, pizza, cupcakes and more',
    stickerCount: 5,
    regularPrice: 50,
    packPrice: 39,
    savings: 11,
    image: 'https://api.dicebear.com/7.x/bottts/svg?seed=food&backgroundColor=ffdfbf',
    category: 'food',
  },
  {
    id: 'pack-nature-1',
    name: 'Nature & Sky Pack',
    description: 'Clouds, stars, rainbows and nature elements',
    stickerCount: 5,
    regularPrice: 50,
    packPrice: 39,
    savings: 11,
    image: 'https://api.dicebear.com/7.x/bottts/svg?seed=nature&backgroundColor=b2ebf2',
    category: 'nature',
  },
];
