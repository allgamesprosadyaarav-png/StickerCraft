import { useState } from 'react';
import { Filter, Package, Heart, Crown, ShoppingCart, Sparkles, Gift, Smile, Award, Trophy, Target, Flame, Camera, Repeat, Mic } from 'lucide-react';
import { useWishlistStore } from '../stores/wishlistStore';
import { useAuthStore } from '../stores/authStore';
import { Product, KeychainProduct } from '../types';
import { ALL_PRODUCTS, ALL_PREMIUM_PRODUCTS } from '../constants/products';
import { STICKER_PACKS } from '../constants/stickerPacks';
import { Card, CardContent, CardFooter } from '../components/ui/card';
import { useCartStore } from '../stores/cartStore';
import { toast } from '../hooks/use-toast';
import { ProductCard } from '../components/features/ProductCard';
import { SpecialOfferBanner } from '../components/features/SpecialOfferBanner';
import { PremiumBanner } from '../components/features/PremiumBanner';
import { SocialBanner } from '../components/features/SocialBanner';
import { BulkOrderDiscount } from '../components/features/BulkOrderDiscount';
import { AIPromoCorner } from '../components/features/AIPromoCorner';
import { LuckySpinWheel } from '../components/features/LuckySpinWheel';
import { PersonalityQuiz } from '../components/features/PersonalityQuiz';
import { MysteryBox } from '../components/features/MysteryBox';
import { ScratchCard } from '../components/features/ScratchCard';
import { MoodSelector } from '../components/features/MoodSelector';
import { CollectionAlbum } from '../components/features/CollectionAlbum';
import { FAQ } from '../components/features/FAQ';
import { AboutUs } from '../components/features/AboutUs';
import { AchievementSystem } from '../components/features/AchievementSystem';
import { DailyChallenges } from '../components/features/DailyChallenges';
import { LimitedEditionDrops } from '../components/features/LimitedEditionDrops';
import { StickerTrading } from '../components/features/StickerTrading';
import { PhotoBoothMode } from '../components/features/PhotoBoothMode';
import { VirtualMuseum } from '../components/features/VirtualMuseum';
import { Button } from '../components/ui/button';

type FilterType = 'all' | 'stickers' | 'keychains' | 'standard' | 'anime' | 'minecraft' | 'food' | 'minimalist' | 'gaming' | 'packs' | 'wishlist' | 'premium' | 'faq';

interface StorePageProps {
  onNavigate: (page: 'store' | 'cart' | 'orders' | 'custom') => void;
}

export function StorePage({ onNavigate }: StorePageProps) {
  const [filter, setFilter] = useState<FilterType>('all');
  const wishlistItems = useWishlistStore((state) => state.items);
  const addToCart = useCartStore((state) => state.addItem);
  const user = useAuthStore((state) => state.user);

  // Creative features modals
  const [showSpinWheel, setShowSpinWheel] = useState(false);
  const [showQuiz, setShowQuiz] = useState(false);
  const [showMysteryBox, setShowMysteryBox] = useState(false);
  const [showScratchCard, setShowScratchCard] = useState(false);
  const [showMoodSelector, setShowMoodSelector] = useState(false);
  const [showCollection, setShowCollection] = useState(false);
  const [showAchievements, setShowAchievements] = useState(false);
  const [showChallenges, setShowChallenges] = useState(false);
  const [showLimitedDrops, setShowLimitedDrops] = useState(false);
  const [showTrading, setShowTrading] = useState(false);

  const allProductsToShow = filter === 'premium' ? ALL_PREMIUM_PRODUCTS : ALL_PRODUCTS;

  const filteredProducts = allProductsToShow.filter((product) => {
    if (filter === 'all') return true;
    if (filter === 'premium') return true; // Already filtered above
    if (filter === 'wishlist') return wishlistItems.some(item => item.id === product.id);
    if (filter === 'packs') return false; // Packs shown separately
    if (filter === 'stickers') return product.type === 'sticker';
    if (filter === 'keychains') return product.type === 'keychain';
    return product.category === filter;
  });

  const handleBuyPack = (pack: typeof STICKER_PACKS[0]) => {
    // Add pack as a custom product
    const packProduct = {
      id: pack.id,
      name: pack.name,
      type: 'sticker' as const,
      category: pack.category,
      price: pack.packPrice,
      image: pack.image,
      description: `${pack.description} (${pack.stickerCount} stickers)`,
    };
    addToCart(packProduct);
    toast({
      title: 'Pack added to cart! 🎁',
      description: `${pack.name} (${pack.stickerCount} stickers) for ₹${pack.packPrice}`,
    });
  };

  const filters: { label: string; value: FilterType; icon?: any }[] = [
    { label: 'All Products', value: 'all' },
    { label: '👑 Premium Only', value: 'premium', icon: Crown },
    { label: '🎁 Sticker Packs', value: 'packs', icon: Package },
    { label: '❤️ Wishlist', value: 'wishlist', icon: Heart },
    { label: 'All Stickers', value: 'stickers' },
    { label: 'Cartoon Stickers', value: 'standard' },
    { label: '⛏️ Minecraft Stickers', value: 'minecraft' },
    { label: 'Anime Stickers', value: 'anime' },
    { label: 'All Keychains', value: 'keychains' },
    { label: 'Anime Keychains', value: 'anime' },
    { label: 'Food Keychains', value: 'food' },
    { label: 'Minimal Keychains', value: 'minimalist' },
    { label: 'Gaming Keychains', value: 'gaming' },
    { label: '❓ Frequently Asked Questions', value: 'faq' },
  ];

  return (
    <>
      <AIPromoCorner onNavigate={() => onNavigate('custom')} />
      
      {/* Creative Features Modals */}
      {showSpinWheel && <LuckySpinWheel onClose={() => setShowSpinWheel(false)} />}
      {showQuiz && (
        <PersonalityQuiz
          onClose={() => setShowQuiz(false)}
          onComplete={(recommendations) => {
            setMoodRecommendations(recommendations);
            setFilter('all');
          }}
        />
      )}
      {showMysteryBox && <MysteryBox onClose={() => setShowMysteryBox(false)} />}
      {showScratchCard && <ScratchCard onClose={() => setShowScratchCard(false)} />}
      {showMoodSelector && (
        <MoodSelector
          onClose={() => setShowMoodSelector(false)}
          onSelect={(products) => {
            setMoodRecommendations(products);
            setFilter('all');
          }}
        />
      )}
      {showCollection && <CollectionAlbum onClose={() => setShowCollection(false)} />}
      {showAchievements && <AchievementSystem onClose={() => setShowAchievements(false)} />}
      {showChallenges && <DailyChallenges onClose={() => setShowChallenges(false)} />}
      {showLimitedDrops && <LimitedEditionDrops onClose={() => setShowLimitedDrops(false)} />}
      {showTrading && <StickerTrading onClose={() => setShowTrading(false)} />}
      <VirtualMuseum />
      
      <div className="container mx-auto px-4 py-8">
      {/* Limited Edition Alert Banner */}
      <div 
        onClick={() => setShowLimitedDrops(true)}
        className="mb-6 bg-gradient-to-r from-red-500 via-orange-500 to-yellow-500 text-white p-4 rounded-2xl cursor-pointer hover:scale-[1.02] transition-transform shadow-2xl border-2 border-yellow-300 animate-pulse"
      >
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 bg-white rounded-full flex items-center justify-center">
              <Flame className="w-7 h-7 text-red-500 animate-bounce" />
            </div>
            <div>
              <h3 className="text-xl font-black">🔥 LIMITED EDITION DROPS LIVE!</h3>
              <p className="text-sm opacity-90">Exclusive items ending soon • Tap to view</p>
            </div>
          </div>
          <div className="text-4xl font-black">→</div>
        </div>
      </div>

      <PremiumBanner />
      <SocialBanner />
      <SpecialOfferBanner />
      
      {/* Creative Features Bar */}
      <div className="mb-8 bg-gradient-to-r from-purple-500/10 via-pink-500/10 to-orange-500/10 border-2 border-primary/20 rounded-2xl p-6">
        <div className="text-center mb-4">
          <h2 className="text-2xl font-bold mb-1">🎮 Fun Zone</h2>
          <p className="text-muted-foreground text-sm">Try our exciting features!</p>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-7 gap-3">
          <Button
            onClick={() => setShowSpinWheel(true)}
            variant="outline"
            className="flex-col h-auto py-4 gap-2 hover:scale-105 transition-transform"
          >
            <div className="text-3xl">🎡</div>
            <span className="text-xs font-semibold">Lucky Spin</span>
          </Button>
          <Button
            onClick={() => setShowQuiz(true)}
            variant="outline"
            className="flex-col h-auto py-4 gap-2 hover:scale-105 transition-transform"
          >
            <div className="text-3xl">🎭</div>
            <span className="text-xs font-semibold">Personality Quiz</span>
          </Button>
          <Button
            onClick={() => setShowMysteryBox(true)}
            variant="outline"
            className="flex-col h-auto py-4 gap-2 hover:scale-105 transition-transform"
          >
            <div className="text-3xl">📦</div>
            <span className="text-xs font-semibold">Mystery Box</span>
          </Button>
          <Button
            onClick={() => setShowScratchCard(true)}
            variant="outline"
            className="flex-col h-auto py-4 gap-2 hover:scale-105 transition-transform"
          >
            <div className="text-3xl">🎫</div>
            <span className="text-xs font-semibold">Scratch Card</span>
          </Button>
          <Button
            onClick={() => setShowMoodSelector(true)}
            variant="outline"
            className="flex-col h-auto py-4 gap-2 hover:scale-105 transition-transform"
          >
            <div className="text-3xl">😊</div>
            <span className="text-xs font-semibold">Mood Picker</span>
          </Button>
          <Button
            onClick={() => setShowCollection(true)}
            variant="outline"
            className="flex-col h-auto py-4 gap-2 hover:scale-105 transition-transform"
          >
            <div className="text-3xl">🏆</div>
            <span className="text-xs font-semibold">My Collection</span>
          </Button>
          <Button
            onClick={() => onNavigate('custom')}
            variant="outline"
            className="flex-col h-auto py-4 gap-2 hover:scale-105 transition-transform bg-gradient-to-br from-purple-500/20 to-pink-500/20"
          >
            <div className="text-3xl">✨</div>
            <span className="text-xs font-semibold">AI Generator</span>
          </Button>
        </div>
      </div>

      {/* NEW FEATURES BAR */}
      <div className="mb-8 bg-gradient-to-r from-yellow-400/10 via-orange-500/10 to-red-500/10 border-2 border-orange-500/30 rounded-2xl p-6">
        <div className="text-center mb-4">
          <h2 className="text-2xl font-bold mb-1">🎯 Rewards & Challenges</h2>
          <p className="text-muted-foreground text-sm">Unlock achievements and earn exclusive rewards!</p>
        </div>
        <div className="grid grid-cols-3 gap-3">
          <Button
            onClick={() => setShowAchievements(true)}
            variant="outline"
            className="flex-col h-auto py-4 gap-2 hover:scale-105 transition-transform"
          >
            <div className="text-3xl">🏆</div>
            <span className="text-xs font-semibold">Achievements</span>
          </Button>
          <Button
            onClick={() => setShowChallenges(true)}
            variant="outline"
            className="flex-col h-auto py-4 gap-2 hover:scale-105 transition-transform"
          >
            <div className="text-3xl">🎯</div>
            <span className="text-xs font-semibold">Daily Challenges</span>
          </Button>
          <Button
            onClick={() => setShowLimitedDrops(true)}
            variant="outline"
            className="flex-col h-auto py-4 gap-2 hover:scale-105 transition-transform bg-gradient-to-br from-red-500/20 to-orange-500/20 animate-pulse"
          >
            <div className="text-3xl">🔥</div>
            <span className="text-xs font-semibold">Limited Drops</span>
          </Button>
        </div>
      </div>

      {/* NEW FEATURES SHOWCASE */}
      <div className="mb-8 bg-gradient-to-r from-cyan-500/10 via-blue-500/10 to-purple-500/10 border-2 border-cyan-500/30 rounded-2xl p-6">
        <div className="text-center mb-4">
          <h2 className="text-2xl font-bold mb-1">🚀 Creative Features</h2>
          <p className="text-muted-foreground text-sm">Experience stickers in a whole new way!</p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Button
            onClick={() => setShowTrading(true)}
            variant="outline"
            className="flex-col h-auto py-6 gap-2 hover:scale-105 transition-transform bg-gradient-to-br from-green-500/10 to-emerald-500/10"
          >
            <div className="text-4xl">🔄</div>
            <span className="font-semibold">Sticker Trading</span>
            <span className="text-xs text-muted-foreground">Trade with collectors</span>
          </Button>
          <div className="flex items-center justify-center">
            <PhotoBoothMode />
          </div>
        </div>
      </div>

      <div className="mb-8">
        <div className="flex items-center gap-2 mb-4">
          <Filter className="w-5 h-5 text-primary" />
          <h2 className="text-xl font-bold">Filter Products</h2>
        </div>
        
        <div className="flex flex-wrap gap-2">
          {filters.map((f) => (
            <Button
              key={f.value}
              variant={filter === f.value ? 'default' : 'outline'}
              size="sm"
              onClick={() => setFilter(f.value)}
              className="rounded-full"
            >
              {f.label}
            </Button>
          ))}
        </div>
      </div>

      {/* FAQ Section */}
      {filter === 'faq' && <FAQ />}
      
      {/* Sticker Packs Section */}
      {filter === 'packs' && (
        <div className="space-y-6">
          <div className="text-center mb-6">
            <h2 className="text-3xl font-bold mb-2">🎁 Sticker Pack Bundles</h2>
            <p className="text-muted-foreground">Save money with our curated sticker collections!</p>
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {STICKER_PACKS.map((pack) => (
              <Card key={pack.id} className="group hover:shadow-xl transition-all duration-300 hover:-translate-y-1">
                <CardContent className="p-6 space-y-4">
                  <div className="relative aspect-square rounded-xl overflow-hidden">
                    <img 
                      src={pack.image} 
                      alt={pack.name}
                      className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                    />
                    <div className="absolute top-3 right-3 bg-green-500 text-white px-3 py-1 rounded-full text-sm font-bold shadow-lg">
                      Save ₹{pack.savings}
                    </div>
                  </div>
                  <div className="space-y-2">
                    <h3 className="font-bold text-xl">{pack.name}</h3>
                    <p className="text-sm text-muted-foreground">{pack.description}</p>
                    <div className="flex items-center gap-2 text-sm">
                      <span className="bg-primary/10 text-primary px-3 py-1 rounded-full font-medium">
                        {pack.stickerCount} Stickers
                      </span>
                    </div>
                  </div>
                </CardContent>
                <CardFooter className="p-6 pt-0 flex items-center justify-between">
                  <div>
                    <div className="text-sm text-muted-foreground line-through">₹{pack.regularPrice}</div>
                    <div className="text-3xl font-bold text-primary">₹{pack.packPrice}</div>
                  </div>
                  <Button onClick={() => handleBuyPack(pack)} className="gap-2">
                    <ShoppingCart className="w-4 h-4" />
                    Buy Pack
                  </Button>
                </CardFooter>
              </Card>
            ))}
          </div>
        </div>
      )}

      {/* Regular Products Grid */}
      {filter !== 'packs' && filter !== 'faq' && filter !== 'about' && (
        <>
          {filter === 'premium' && !user?.isPremium ? (
            <div className="text-center py-12 space-y-4">
              <Crown className="w-16 h-16 mx-auto text-purple-500" />
              <h3 className="text-2xl font-bold">Premium Products</h3>
              <p className="text-muted-foreground text-lg">Upgrade to Premium to access exclusive stickers and keychains</p>
              <Button className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 gap-2">
                <Crown className="w-4 h-4" />
                Get Premium - ₹99
              </Button>
            </div>
          ) : filter === 'wishlist' && wishlistItems.length === 0 ? (
            <div className="text-center py-12">
              <Heart className="w-16 h-16 mx-auto mb-4 text-muted-foreground" />
              <p className="text-muted-foreground text-lg">Your wishlist is empty</p>
              <p className="text-sm text-muted-foreground mt-2">Click the heart icon on products to add them here</p>
            </div>
          ) : (
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6">
              {filteredProducts.map((product) => (
                <ProductCard
                  key={product.id}
                  product={product as Product & KeychainProduct}
                />
              ))}
            </div>
          )}

          {filteredProducts.length === 0 && filter !== 'wishlist' && filter !== 'premium' && (
            <div className="text-center py-12">
              <p className="text-muted-foreground text-lg">No products found for this filter</p>
            </div>
          )}
        </>
      )}

      {/* Bulk Order Discount Section */}
      <div className="mt-12">
        <BulkOrderDiscount />
      </div>

      {/* About Us Section */}
      <AboutUs />

      {/* FAQ Section */}
      <FAQ />
    </div>
    </>
  );
}
