import { useState, useRef } from 'react';
import { Upload, Type, Palette, Save, ShoppingCart, Sparkles, Wand2 } from 'lucide-react';
import { AIGeneratorTab } from '../components/features/AIGeneratorTab';
import { Button } from '../components/ui/button';
import { Card, CardContent } from '../components/ui/card';
import { Input } from '../components/ui/input';
import { Label } from '../components/ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../components/ui/tabs';
import { useCartStore } from '../stores/cartStore';
import { useDesignStore } from '../stores/designStore';
import { toast } from '../hooks/use-toast';
import {
  KEYCHAIN_SHAPES,
  STICKER_SIZES,
  COLOR_FILTERS,
  TEXT_FONTS,
  TEXT_COLORS,
} from '../constants/customization';

const DESIGN_TEMPLATES = [
  {
    id: 'template-1',
    name: 'Birthday Bash',
    image: 'https://images.unsplash.com/photo-1530103862676-de8c9debad1d?w=400&h=400&fit=crop',
    text: 'Happy Birthday!',
    filter: 'vibrant',
  },
  {
    id: 'template-2',
    name: 'Love & Hearts',
    image: 'https://images.unsplash.com/photo-1518199266791-5375a83190b7?w=400&h=400&fit=crop',
    text: 'Love You',
    filter: 'warm',
  },
  {
    id: 'template-3',
    name: 'Motivational',
    image: 'https://images.unsplash.com/photo-1506126613408-eca07ce68773?w=400&h=400&fit=crop',
    text: 'Never Give Up',
    filter: 'cool',
  },
  {
    id: 'template-4',
    name: 'Cute Kitty',
    image: 'https://images.unsplash.com/photo-1574158622682-e40e69881006?w=400&h=400&fit=crop',
    text: 'Meow',
    filter: 'none',
  },
];
import { CustomDesign, Product } from '../types';

export function CustomDesignPage() {
  const [activeTab, setActiveTab] = useState<'design' | 'ai'>('design');
  const [designType, setDesignType] = useState<'sticker' | 'keychain'>('sticker');
  const [uploadedImage, setUploadedImage] = useState<string>('');
  const [overlayText, setOverlayText] = useState('');
  const [selectedSize, setSelectedSize] = useState(STICKER_SIZES[0]);
  const [selectedShape, setSelectedShape] = useState(KEYCHAIN_SHAPES[0]);
  const [selectedFilter, setSelectedFilter] = useState(COLOR_FILTERS[0]);
  const [selectedFont, setSelectedFont] = useState(TEXT_FONTS[0]);
  const [selectedTextColor, setSelectedTextColor] = useState(TEXT_COLORS[0]);
  const [showTemplates, setShowTemplates] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const applyTemplate = (template: typeof DESIGN_TEMPLATES[0]) => {
    setUploadedImage(template.image);
    setOverlayText(template.text);
    const filter = COLOR_FILTERS.find(f => f.id === template.filter);
    if (filter) setSelectedFilter(filter);
    setShowTemplates(false);
    toast({
      title: 'Template applied! ✨',
      description: 'You can now customize it further',
    });
  };

  const addItem = useCartStore((state) => state.addItem);
  const saveDesign = useDesignStore((state) => state.saveDesign);

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setUploadedImage(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const calculatePrice = () => {
    const basePrice = designType === 'sticker' ? 10 : 110;
    const sizeMultiplier = designType === 'sticker' ? selectedSize.priceMultiplier : 1;
    const shapeMultiplier = designType === 'keychain' ? selectedShape.multiplier : 1;
    return Math.round(basePrice * sizeMultiplier * shapeMultiplier);
  };

  const handleSaveDesign = () => {
    if (!uploadedImage && !overlayText) {
      toast({
        title: 'Design is empty',
        description: 'Please upload an image or add text',
        variant: 'destructive',
      });
      return;
    }

    const design: CustomDesign = {
      id: crypto.randomUUID(),
      type: designType,
      name: `Custom ${designType} - ${new Date().toLocaleDateString()}`,
      uploadedImage,
      text: overlayText,
      textFont: selectedFont.id,
      textColor: selectedTextColor.id,
      colorFilter: selectedFilter.id,
      size: designType === 'sticker' ? selectedSize.id : undefined,
      shape: designType === 'keychain' ? selectedShape.id : undefined,
      createdAt: new Date().toISOString(),
    };

    saveDesign(design);
    toast({
      title: 'Design saved! 🎨',
      description: 'Your custom design has been saved to your library',
    });
  };

  const handleAddToCart = () => {
    if (!uploadedImage && !overlayText) {
      toast({
        title: 'Design is empty',
        description: 'Please upload an image or add text before adding to cart',
        variant: 'destructive',
      });
      return;
    }

    const customProduct: Product = {
      id: `custom-${Date.now()}`,
      name: `Custom ${designType}`,
      type: designType,
      category: 'standard',
      price: calculatePrice(),
      image: uploadedImage || 'https://via.placeholder.com/400?text=Custom+Design',
      description: `Custom ${designType} with ${overlayText ? 'text: ' + overlayText : 'uploaded image'}`,
    };

    addItem(customProduct);
    toast({
      title: 'Added to cart! 🛒',
      description: `Your custom ${designType} has been added`,
    });
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold mb-2 text-gradient">Design Your Own</h1>
          <p className="text-muted-foreground">Create unique stickers and keychains</p>
        </div>

        {/* Main Tabs: Custom Design vs AI Generator */}
        <div className="mb-6">
          <div className="flex items-center justify-center gap-3">
            <Button
              variant={activeTab === 'design' ? 'default' : 'outline'}
              onClick={() => setActiveTab('design')}
              className="gap-2 h-12"
            >
              <Palette className="w-5 h-5" />
              Custom Design
            </Button>
            <Button
              variant={activeTab === 'ai' ? 'default' : 'outline'}
              onClick={() => setActiveTab('ai')}
              className="gap-2 h-12 bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white"
            >
              <Wand2 className="w-5 h-5" />
              AI Generator ✨
            </Button>
          </div>
        </div>

        {activeTab === 'ai' ? (
          <AIGeneratorTab />
        ) : (

        <div className="grid lg:grid-cols-2 gap-8">
          {/* Design Controls */}
          <div className="space-y-6">
            <Card className="glass">
              <CardContent className="p-6 space-y-6">
                {/* Type Selection */}
                <div className="space-y-2">
                  <Label>Design Type</Label>
                  <div className="grid grid-cols-2 gap-3">
                    <Button
                      variant={designType === 'sticker' ? 'default' : 'outline'}
                      onClick={() => setDesignType('sticker')}
                      className="h-auto py-4"
                    >
                      <div className="text-center">
                        <div className="text-2xl mb-1">🏷️</div>
                        <div className="font-bold">Sticker</div>
                        <div className="text-xs opacity-70">From ₹10</div>
                      </div>
                    </Button>
                    <Button
                      variant={designType === 'keychain' ? 'default' : 'outline'}
                      onClick={() => setDesignType('keychain')}
                      className="h-auto py-4"
                    >
                      <div className="text-center">
                        <div className="text-2xl mb-1">🔑</div>
                        <div className="font-bold">Keychain</div>
                        <div className="text-xs opacity-70">From ₹110</div>
                      </div>
                    </Button>
                  </div>
                </div>

                {/* Design Templates */}
                <div className="space-y-2">
                  <Label>Quick Start</Label>
                  <Button
                    variant="outline"
                    onClick={() => setShowTemplates(!showTemplates)}
                    className="w-full"
                  >
                    <Sparkles className="w-4 h-4 mr-2" />
                    {showTemplates ? 'Hide' : 'Use'} Templates
                  </Button>
                  
                  {showTemplates && (
                    <div className="grid grid-cols-2 gap-2 p-2 border rounded-lg">
                      {DESIGN_TEMPLATES.map((template) => (
                        <button
                          key={template.id}
                          onClick={() => applyTemplate(template)}
                          className="aspect-square rounded-lg overflow-hidden border-2 hover:border-primary transition-all"
                        >
                          <img 
                            src={template.image} 
                            alt={template.name}
                            className="w-full h-full object-cover"
                          />
                          <div className="text-xs font-medium p-1 bg-black/50 text-white">
                            {template.name}
                          </div>
                        </button>
                      ))}
                    </div>
                  )}
                </div>

                {/* Image Upload */}
                <div className="space-y-2">
                  <Label>Upload Your Image</Label>
                  <input
                    ref={fileInputRef}
                    type="file"
                    accept="image/*"
                    onChange={handleImageUpload}
                    className="hidden"
                  />
                  <Button
                    variant="outline"
                    onClick={() => fileInputRef.current?.click()}
                    className="w-full"
                  >
                    <Upload className="w-4 h-4 mr-2" />
                    Choose Image
                  </Button>
                </div>

                {/* Overlay Text */}
                <div className="space-y-2">
                  <Label htmlFor="text">Add Text (Optional)</Label>
                  <Input
                    id="text"
                    placeholder="Enter your text..."
                    value={overlayText}
                    onChange={(e) => setOverlayText(e.target.value)}
                    maxLength={30}
                  />
                  <p className="text-xs text-muted-foreground">
                    {overlayText.length}/30 characters
                  </p>
                </div>

                {/* Customization Tabs */}
                <Tabs defaultValue="style" className="w-full">
                  <TabsList className="grid w-full grid-cols-3">
                    <TabsTrigger value="style">
                      <Palette className="w-4 h-4 mr-1" />
                      Style
                    </TabsTrigger>
                    <TabsTrigger value="text">
                      <Type className="w-4 h-4 mr-1" />
                      Text
                    </TabsTrigger>
                    <TabsTrigger value="size">
                      {designType === 'sticker' ? '📏 Size' : '⬡ Shape'}
                    </TabsTrigger>
                  </TabsList>

                  <TabsContent value="style" className="space-y-3 mt-4">
                    <Label>Color Filter</Label>
                    <div className="grid grid-cols-3 gap-2">
                      {COLOR_FILTERS.map((filter) => (
                        <Button
                          key={filter.id}
                          size="sm"
                          variant={selectedFilter.id === filter.id ? 'default' : 'outline'}
                          onClick={() => setSelectedFilter(filter)}
                        >
                          {filter.name}
                        </Button>
                      ))}
                    </div>
                  </TabsContent>

                  <TabsContent value="text" className="space-y-3 mt-4">
                    <div className="space-y-2">
                      <Label>Font</Label>
                      <div className="grid grid-cols-2 gap-2">
                        {TEXT_FONTS.map((font) => (
                          <Button
                            key={font.id}
                            size="sm"
                            variant={selectedFont.id === font.id ? 'default' : 'outline'}
                            onClick={() => setSelectedFont(font)}
                          >
                            {font.name}
                          </Button>
                        ))}
                      </div>
                    </div>
                    <div className="space-y-2">
                      <Label>Text Color</Label>
                      <div className="grid grid-cols-3 gap-2">
                        {TEXT_COLORS.map((color) => (
                          <Button
                            key={color.id}
                            size="sm"
                            variant={selectedTextColor.id === color.id ? 'default' : 'outline'}
                            onClick={() => setSelectedTextColor(color)}
                            className="gap-2"
                          >
                            <div
                              className="w-4 h-4 rounded-full border-2"
                              style={{ backgroundColor: color.color }}
                            />
                            {color.name}
                          </Button>
                        ))}
                      </div>
                    </div>
                  </TabsContent>

                  <TabsContent value="size" className="space-y-3 mt-4">
                    {designType === 'sticker' ? (
                      <>
                        <Label>Sticker Size</Label>
                        <div className="space-y-2">
                          {STICKER_SIZES.map((size) => (
                            <Button
                              key={size.id}
                              variant={selectedSize.id === size.id ? 'default' : 'outline'}
                              onClick={() => setSelectedSize(size)}
                              className="w-full justify-between"
                            >
                              <span>{size.name} ({size.dimensions})</span>
                              <span>₹{Math.round(10 * size.priceMultiplier)}</span>
                            </Button>
                          ))}
                        </div>
                      </>
                    ) : (
                      <>
                        <Label>Keychain Shape</Label>
                        <div className="grid grid-cols-2 gap-3">
                          {KEYCHAIN_SHAPES.map((shape) => (
                            <Button
                              key={shape.id}
                              variant={selectedShape.id === shape.id ? 'default' : 'outline'}
                              onClick={() => setSelectedShape(shape)}
                              className="h-auto py-4 flex-col gap-2"
                            >
                              <svg
                                viewBox="0 0 100 100"
                                className="w-12 h-12"
                                dangerouslySetInnerHTML={{ __html: shape.svg }}
                              />
                              <span className="text-xs">{shape.name}</span>
                            </Button>
                          ))}
                        </div>
                      </>
                    )}
                  </TabsContent>
                </Tabs>
              </CardContent>
            </Card>
          </div>

          {/* Live Preview */}
          <div className="space-y-6">
            <Card className="glass">
              <CardContent className="p-6">
                <Label className="mb-3 block">Live Preview</Label>
                <div className="aspect-square bg-gradient-to-br from-muted/50 to-muted rounded-2xl flex items-center justify-center overflow-hidden relative">
                  {designType === 'keychain' ? (
                    <div className="relative w-4/5 h-4/5">
                      <svg viewBox="0 0 100 100" className="w-full h-full text-primary/20">
                        <g dangerouslySetInnerHTML={{ __html: selectedShape.svg }} />
                      </svg>
                      {uploadedImage && (
                        <div
                          className="absolute inset-0"
                          style={{
                            clipPath: selectedShape.id === 'circle' ? 'circle(45% at 50% 50%)' :
                                      selectedShape.id === 'square' ? 'inset(10% 10% 10% 10% round 8%)' :
                                      selectedShape.id === 'star' ? 'polygon(50% 5%, 61% 38%, 95% 38%, 68% 58%, 79% 91%, 50% 71%, 21% 91%, 32% 58%, 5% 38%, 39% 38%)' :
                                      selectedShape.id === 'heart' ? 'path("M50,90 C50,90 10,65 10,40 C10,25 20,15 30,15 C40,15 50,25 50,25 C50,25 60,15 70,15 C80,15 90,25 90,40 C90,65 50,90 50,90 Z")' :
                                      'polygon(50% 10%, 85% 30%, 85% 70%, 50% 90%, 15% 70%, 15% 30%)',
                          }}
                        >
                          <img
                            src={uploadedImage}
                            alt="Design preview"
                            className="w-full h-full object-cover"
                            style={{ filter: selectedFilter.filter }}
                          />
                        </div>
                      )}
                      {overlayText && (
                        <div className="absolute inset-0 flex items-center justify-center">
                          <p
                            className="font-bold text-center px-4 drop-shadow-lg"
                            style={{
                              fontFamily: selectedFont.family,
                              color: selectedTextColor.color,
                              fontSize: 'clamp(0.8rem, 4vw, 1.5rem)',
                              textShadow: '2px 2px 4px rgba(0,0,0,0.5)',
                            }}
                          >
                            {overlayText}
                          </p>
                        </div>
                      )}
                    </div>
                  ) : (
                    <div className="relative w-3/4 h-3/4 rounded-full overflow-hidden border-4 border-white shadow-2xl">
                      {uploadedImage ? (
                        <img
                          src={uploadedImage}
                          alt="Design preview"
                          className="w-full h-full object-cover"
                          style={{ filter: selectedFilter.filter }}
                        />
                      ) : (
                        <div className="w-full h-full bg-gradient-to-br from-primary/20 to-secondary/20 flex items-center justify-center">
                          <p className="text-muted-foreground text-center px-4">
                            Upload an image<br />or add text
                          </p>
                        </div>
                      )}
                      {overlayText && (
                        <div className="absolute inset-0 flex items-center justify-center bg-black/20">
                          <p
                            className="font-bold text-center px-4 drop-shadow-lg"
                            style={{
                              fontFamily: selectedFont.family,
                              color: selectedTextColor.color,
                              fontSize: 'clamp(1rem, 5vw, 2rem)',
                              textShadow: '2px 2px 4px rgba(0,0,0,0.5)',
                            }}
                          >
                            {overlayText}
                          </p>
                        </div>
                      )}
                    </div>
                  )}
                </div>

                <div className="mt-6 space-y-3">
                  <div className="bg-muted p-4 rounded-xl">
                    <div className="flex justify-between items-center">
                      <span className="font-medium">Price:</span>
                      <span className="text-2xl font-bold text-primary">₹{calculatePrice()}</span>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    <Button variant="outline" onClick={handleSaveDesign} className="gap-2">
                      <Save className="w-4 h-4" />
                      Save Design
                    </Button>
                    <Button onClick={handleAddToCart} className="gap-2">
                      <ShoppingCart className="w-4 h-4" />
                      Add to Cart
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
        )}
      </div>
    </div>
  );
}
