import { useState } from 'react';
import { Building2, X, ChevronLeft, ChevronRight, Info, Heart, ShoppingCart } from 'lucide-react';
import { Button } from '../ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { ALL_PRODUCTS } from '../../constants/products';
import { useCartStore } from '../../stores/cartStore';
import { useWishlistStore } from '../../stores/wishlistStore';
import { toast } from '../../hooks/use-toast';

export function VirtualMuseum() {
  const [isOpen, setIsOpen] = useState(false);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const addToCart = useCartStore((state) => state.addItem);
  const { items: wishlistItems, addItem: addToWishlist, removeItem: removeFromWishlist } = useWishlistStore();

  const categories = [
    { id: 'all', name: 'All Exhibits', emoji: '🎨' },
    { id: 'anime', name: 'Anime Gallery', emoji: '🎌' },
    { id: 'minecraft', name: 'Pixel Art Hall', emoji: '⛏️' },
    { id: 'standard', name: 'Cartoon Collection', emoji: '🎪' },
  ];

  const filteredProducts = selectedCategory === 'all' 
    ? ALL_PRODUCTS.filter(p => p.type === 'sticker')
    : ALL_PRODUCTS.filter(p => p.type === 'sticker' && p.category === selectedCategory);

  const currentProduct = filteredProducts[currentIndex];
  const isInWishlist = currentProduct ? wishlistItems.some(item => item.id === currentProduct.id) : false;

  const goNext = () => {
    setCurrentIndex((prev) => (prev + 1) % filteredProducts.length);
  };

  const goPrevious = () => {
    setCurrentIndex((prev) => (prev - 1 + filteredProducts.length) % filteredProducts.length);
  };

  const handleAddToCart = () => {
    if (currentProduct) {
      addToCart(currentProduct);
      toast({
        title: 'Added to cart! 🛒',
        description: `${currentProduct.name} - ₹${currentProduct.price}`,
      });
    }
  };

  const handleWishlist = () => {
    if (!currentProduct) return;
    
    if (isInWishlist) {
      removeFromWishlist(currentProduct.id);
      toast({
        title: 'Removed from wishlist',
        description: currentProduct.name,
      });
    } else {
      addToWishlist(currentProduct);
      toast({
        title: 'Added to wishlist! ❤️',
        description: currentProduct.name,
      });
    }
  };

  if (!currentProduct) return null;

  return (
    <>
      <button
        onClick={() => setIsOpen(true)}
        className="fixed bottom-72 right-6 z-40 bg-gradient-to-r from-purple-500 via-indigo-500 to-blue-500 text-white p-4 rounded-full shadow-2xl hover:scale-110 transition-transform"
      >
        <Building2 className="w-6 h-6" />
      </button>

      {isOpen && (
        <div className="fixed inset-0 z-50 bg-black/90 backdrop-blur-sm overflow-y-auto">
          <div className="min-h-screen flex items-center justify-center p-4">
            <Card className="w-full max-w-5xl bg-gradient-to-br from-slate-900 to-slate-800 border-2 border-purple-500/30">
              <CardHeader className="border-b border-purple-500/20">
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle className="flex items-center gap-2 text-2xl text-white">
                      <Building2 className="w-6 h-6 text-purple-400" />
                      Virtual Sticker Museum
                    </CardTitle>
                    <p className="text-sm text-slate-400 mt-1">
                      Browse our complete collection in an immersive 3D gallery experience 🖼️
                    </p>
                  </div>
                  <Button variant="ghost" size="icon" onClick={() => setIsOpen(false)} className="text-white">
                    <X className="w-5 h-5" />
                  </Button>
                </div>
              </CardHeader>

              <CardContent className="p-8 space-y-6">
                {/* Gallery Categories */}
                <div className="flex gap-2 overflow-x-auto pb-2">
                  {categories.map((cat) => (
                    <button
                      key={cat.id}
                      onClick={() => {
                        setSelectedCategory(cat.id);
                        setCurrentIndex(0);
                      }}
                      className={`flex items-center gap-2 px-4 py-2 rounded-lg font-medium transition-all whitespace-nowrap ${
                        selectedCategory === cat.id
                          ? 'bg-purple-500 text-white shadow-lg scale-105'
                          : 'bg-slate-700 text-slate-300 hover:bg-slate-600'
                      }`}
                    >
                      <span className="text-xl">{cat.emoji}</span>
                      <span>{cat.name}</span>
                    </button>
                  ))}
                </div>

                {/* Main Display */}
                <div className="relative">
                  {/* Museum Frame */}
                  <div className="bg-gradient-to-b from-amber-900 via-amber-800 to-amber-900 p-8 rounded-3xl shadow-2xl">
                    {/* Spotlight Effect */}
                    <div className="absolute top-0 left-1/2 -translate-x-1/2 w-64 h-64 bg-yellow-300/20 blur-3xl rounded-full -z-10" />
                    
                    <div className="bg-slate-900 p-8 rounded-2xl border-4 border-amber-700 shadow-inner">
                      {/* Exhibit Plaque */}
                      <div className="mb-6 bg-gradient-to-r from-amber-800 to-amber-700 px-6 py-3 rounded-lg">
                        <p className="text-center text-amber-100 text-sm font-serif">
                          Exhibit #{currentIndex + 1} of {filteredProducts.length}
                        </p>
                      </div>

                      {/* Main Artwork */}
                      <div className="relative aspect-square bg-gradient-to-br from-slate-800 to-slate-900 rounded-xl p-8 mb-6 overflow-hidden group">
                        {/* Museum Lighting Effect */}
                        <div className="absolute inset-0 bg-gradient-to-b from-white/5 via-transparent to-black/20 pointer-events-none" />
                        
                        <img
                          src={currentProduct.image}
                          alt={currentProduct.name}
                          className="w-full h-full object-contain transform group-hover:scale-110 transition-transform duration-500 drop-shadow-2xl"
                          style={{
                            filter: 'drop-shadow(0 0 40px rgba(168, 85, 247, 0.4))',
                          }}
                        />

                        {/* Reflection Effect */}
                        <div className="absolute bottom-0 left-0 right-0 h-1/3 bg-gradient-to-t from-purple-500/10 to-transparent pointer-events-none" />
                      </div>

                      {/* Information Plaque */}
                      <div className="bg-gradient-to-br from-slate-800 to-slate-700 p-6 rounded-xl border border-purple-500/30">
                        <div className="flex items-start justify-between mb-4">
                          <div>
                            <h3 className="text-2xl font-bold text-white mb-1">
                              {currentProduct.name}
                            </h3>
                            <p className="text-slate-400 text-sm flex items-center gap-2">
                              <Info className="w-4 h-4" />
                              {currentProduct.category.charAt(0).toUpperCase() + currentProduct.category.slice(1)} Collection
                            </p>
                          </div>
                          <div className="text-right">
                            <p className="text-sm text-slate-400">Price</p>
                            <p className="text-3xl font-black text-purple-400">
                              ₹{currentProduct.price}
                            </p>
                          </div>
                        </div>

                        <p className="text-slate-300 text-sm mb-4 border-t border-slate-600 pt-4">
                          {currentProduct.description}
                        </p>

                        {/* Actions */}
                        <div className="grid grid-cols-2 gap-3">
                          <Button
                            onClick={handleWishlist}
                            variant="outline"
                            className={`gap-2 ${
                              isInWishlist
                                ? 'bg-red-500 text-white border-red-500 hover:bg-red-600'
                                : 'text-slate-300 border-slate-600 hover:bg-slate-700'
                            }`}
                          >
                            <Heart className={`w-4 h-4 ${isInWishlist ? 'fill-current' : ''}`} />
                            {isInWishlist ? 'Wishlisted' : 'Add to Wishlist'}
                          </Button>
                          <Button
                            onClick={handleAddToCart}
                            className="gap-2 bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700"
                          >
                            <ShoppingCart className="w-4 h-4" />
                            Add to Cart
                          </Button>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Navigation */}
                  <button
                    onClick={goPrevious}
                    className="absolute left-2 top-1/2 -translate-y-1/2 bg-purple-600 hover:bg-purple-700 text-white p-4 rounded-full shadow-2xl transition-all hover:scale-110"
                  >
                    <ChevronLeft className="w-6 h-6" />
                  </button>
                  <button
                    onClick={goNext}
                    className="absolute right-2 top-1/2 -translate-y-1/2 bg-purple-600 hover:bg-purple-700 text-white p-4 rounded-full shadow-2xl transition-all hover:scale-110"
                  >
                    <ChevronRight className="w-6 h-6" />
                  </button>
                </div>

                {/* Gallery Navigation Dots */}
                <div className="flex justify-center gap-2 flex-wrap">
                  {filteredProducts.slice(0, 10).map((_, index) => (
                    <button
                      key={index}
                      onClick={() => setCurrentIndex(index)}
                      className={`w-2 h-2 rounded-full transition-all ${
                        index === currentIndex
                          ? 'bg-purple-500 w-8'
                          : 'bg-slate-600 hover:bg-slate-500'
                      }`}
                    />
                  ))}
                  {filteredProducts.length > 10 && (
                    <span className="text-slate-400 text-xs">
                      +{filteredProducts.length - 10} more
                    </span>
                  )}
                </div>

                <div className="bg-purple-950/30 p-4 rounded-xl border border-purple-500/20">
                  <p className="text-xs text-purple-300 text-center">
                    🏛️ <strong>Museum Tip:</strong> Use arrow keys or click the arrows to navigate through exhibits. Click on any item to add to cart or wishlist!
                  </p>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      )}
    </>
  );
}
