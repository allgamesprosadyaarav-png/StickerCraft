import { useState, useRef } from 'react';
import { Camera, X, Download, Image as ImageIcon, Sparkles, RotateCw } from 'lucide-react';
import { Button } from '../ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { PRODUCTS } from '../../constants/products';

interface StickerOnPhoto {
  id: string;
  productId: string;
  x: number;
  y: number;
  scale: number;
  rotation: number;
}

export function PhotoBoothMode() {
  const [isOpen, setIsOpen] = useState(false);
  const [photoSrc, setPhotoSrc] = useState<string>('');
  const [stickers, setStickers] = useState<StickerOnPhoto[]>([]);
  const [selectedFilter, setSelectedFilter] = useState<string>('none');
  const fileInputRef = useRef<HTMLInputElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  const filters = [
    { id: 'none', name: 'Original', filter: '' },
    { id: 'vintage', name: 'Vintage', filter: 'sepia(80%) contrast(120%)' },
    { id: 'cool', name: 'Cool', filter: 'hue-rotate(180deg) saturate(120%)' },
    { id: 'warm', name: 'Warm', filter: 'hue-rotate(30deg) saturate(130%)' },
    { id: 'bw', name: 'B&W', filter: 'grayscale(100%) contrast(120%)' },
    { id: 'neon', name: 'Neon', filter: 'saturate(200%) brightness(120%)' },
  ];

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        setPhotoSrc(event.target?.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const addSticker = (productId: string) => {
    const newSticker: StickerOnPhoto = {
      id: `sticker-${Date.now()}`,
      productId,
      x: 50,
      y: 50,
      scale: 1,
      rotation: 0,
    };
    setStickers([...stickers, newSticker]);
  };

  const removeSticker = (id: string) => {
    setStickers(stickers.filter(s => s.id !== id));
  };

  const updateStickerPosition = (id: string, x: number, y: number) => {
    setStickers(stickers.map(s => s.id === id ? { ...s, x, y } : s));
  };

  const downloadImage = () => {
    if (!canvasRef.current || !photoSrc) return;

    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const img = new Image();
    img.crossOrigin = 'anonymous';
    img.src = photoSrc;
    
    img.onload = () => {
      canvas.width = img.width;
      canvas.height = img.height;

      // Draw photo with filter
      ctx.filter = filters.find(f => f.id === selectedFilter)?.filter || '';
      ctx.drawImage(img, 0, 0);
      ctx.filter = 'none';

      // Draw stickers
      const stickerPromises = stickers.map((sticker) => {
        return new Promise<void>((resolve) => {
          const product = PRODUCTS.find(p => p.id === sticker.productId);
          if (!product) {
            resolve();
            return;
          }

          const stickerImg = new Image();
          stickerImg.crossOrigin = 'anonymous';
          stickerImg.src = product.image;
          
          stickerImg.onload = () => {
            ctx.save();
            const x = (canvas.width * sticker.x) / 100;
            const y = (canvas.height * sticker.y) / 100;
            const size = 150 * sticker.scale;
            
            ctx.translate(x, y);
            ctx.rotate((sticker.rotation * Math.PI) / 180);
            ctx.drawImage(stickerImg, -size / 2, -size / 2, size, size);
            ctx.restore();
            resolve();
          };

          stickerImg.onerror = () => resolve();
        });
      });

      Promise.all(stickerPromises).then(() => {
        canvas.toBlob((blob) => {
          if (blob) {
            const url = URL.createObjectURL(blob);
            const a = document.createElement('a');
            a.href = url;
            a.download = `sticker-booth-${Date.now()}.png`;
            a.click();
            URL.revokeObjectURL(url);
          }
        });
      });
    };
  };

  const animeStickers = PRODUCTS.filter(p => p.category === 'anime' && p.type === 'sticker').slice(0, 12);

  return (
    <>
      <Button
        onClick={() => setIsOpen(true)}
        variant="outline"
        className="gap-2 bg-gradient-to-r from-pink-500 to-purple-500 text-white border-0"
      >
        <Camera className="w-4 h-4" />
        Photo Booth
      </Button>

      {isOpen && (
        <div className="fixed inset-0 z-50 bg-black/90 backdrop-blur-sm overflow-y-auto">
          <div className="min-h-screen flex items-center justify-center p-4">
            <Card className="w-full max-w-6xl">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle className="flex items-center gap-2 text-2xl">
                      <Camera className="w-6 h-6 text-pink-500" />
                      Photo Booth Mode
                    </CardTitle>
                    <p className="text-sm text-muted-foreground mt-1">
                      Add stickers to your photos and apply fun filters! 📸
                    </p>
                  </div>
                  <Button variant="ghost" size="icon" onClick={() => setIsOpen(false)}>
                    <X className="w-5 h-5" />
                  </Button>
                </div>
              </CardHeader>

              <CardContent className="space-y-6">
                <div className="grid lg:grid-cols-3 gap-6">
                  {/* Main Photo Area */}
                  <div className="lg:col-span-2 space-y-4">
                    {!photoSrc ? (
                      <div className="aspect-video bg-muted rounded-xl flex flex-col items-center justify-center gap-4 border-2 border-dashed">
                        <ImageIcon className="w-16 h-16 text-muted-foreground" />
                        <div className="space-y-2 text-center">
                          <p className="font-medium">Upload a photo to get started</p>
                          <input
                            ref={fileInputRef}
                            type="file"
                            accept="image/*"
                            onChange={handleFileUpload}
                            className="hidden"
                          />
                          <Button onClick={() => fileInputRef.current?.click()} className="gap-2">
                            <ImageIcon className="w-4 h-4" />
                            Choose Photo
                          </Button>
                        </div>
                      </div>
                    ) : (
                      <div className="relative aspect-video bg-muted rounded-xl overflow-hidden">
                        <img
                          src={photoSrc}
                          alt="Your photo"
                          className="w-full h-full object-contain"
                          style={{ filter: filters.find(f => f.id === selectedFilter)?.filter }}
                        />
                        
                        {stickers.map((sticker) => {
                          const product = PRODUCTS.find(p => p.id === sticker.productId);
                          if (!product) return null;

                          return (
                            <div
                              key={sticker.id}
                              className="absolute cursor-move group"
                              style={{
                                left: `${sticker.x}%`,
                                top: `${sticker.y}%`,
                                transform: `translate(-50%, -50%) rotate(${sticker.rotation}deg) scale(${sticker.scale})`,
                              }}
                              draggable
                              onDragEnd={(e) => {
                                const rect = e.currentTarget.parentElement?.getBoundingClientRect();
                                if (!rect) return;
                                const x = ((e.clientX - rect.left) / rect.width) * 100;
                                const y = ((e.clientY - rect.top) / rect.height) * 100;
                                updateStickerPosition(sticker.id, x, y);
                              }}
                            >
                              <img
                                src={product.image}
                                alt={product.name}
                                className="w-24 h-24 object-contain drop-shadow-2xl pointer-events-none"
                              />
                              <button
                                onClick={() => removeSticker(sticker.id)}
                                className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full w-6 h-6 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
                              >
                                ✕
                              </button>
                            </div>
                          );
                        })}
                      </div>
                    )}

                    {/* Filters */}
                    {photoSrc && (
                      <div className="space-y-2">
                        <p className="text-sm font-medium">Filters</p>
                        <div className="flex gap-2 overflow-x-auto pb-2">
                          {filters.map((filter) => (
                            <button
                              key={filter.id}
                              onClick={() => setSelectedFilter(filter.id)}
                              className={`flex-shrink-0 px-4 py-2 rounded-lg border-2 transition-all ${
                                selectedFilter === filter.id
                                  ? 'border-primary bg-primary/10'
                                  : 'border-muted hover:border-primary/50'
                              }`}
                            >
                              <p className="text-sm font-medium">{filter.name}</p>
                            </button>
                          ))}
                        </div>
                      </div>
                    )}

                    {/* Actions */}
                    {photoSrc && (
                      <div className="flex gap-2">
                        <Button onClick={() => fileInputRef.current?.click()} variant="outline" className="flex-1 gap-2">
                          <RotateCw className="w-4 h-4" />
                          Change Photo
                        </Button>
                        <Button onClick={downloadImage} className="flex-1 gap-2 bg-gradient-to-r from-green-600 to-emerald-600">
                          <Download className="w-4 h-4" />
                          Download
                        </Button>
                      </div>
                    )}
                  </div>

                  {/* Sticker Palette */}
                  <div className="space-y-4">
                    <div className="flex items-center gap-2">
                      <Sparkles className="w-5 h-5 text-purple-500" />
                      <h3 className="font-bold">Add Stickers</h3>
                    </div>

                    <div className="grid grid-cols-3 gap-2 max-h-96 overflow-y-auto">
                      {animeStickers.map((product) => (
                        <button
                          key={product.id}
                          onClick={() => addSticker(product.id)}
                          disabled={!photoSrc}
                          className="aspect-square bg-muted rounded-lg p-2 hover:bg-muted/70 transition-all hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                          <img
                            src={product.image}
                            alt={product.name}
                            className="w-full h-full object-contain rounded-full"
                          />
                        </button>
                      ))}
                    </div>

                    <div className="bg-blue-50 dark:bg-blue-950 p-3 rounded-lg border border-blue-200 dark:border-blue-800">
                      <p className="text-xs text-blue-700 dark:text-blue-400">
                        💡 <strong>Tip:</strong> Click stickers to add them to your photo. Drag to reposition. Click the ✕ to remove.
                      </p>
                    </div>
                  </div>
                </div>

                <canvas ref={canvasRef} className="hidden" />
              </CardContent>
            </Card>
          </div>
        </div>
      )}
    </>
  );
}
