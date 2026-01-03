import { useState, useRef } from 'react';
import { Camera, X, Download, RotateCw, ZoomIn, ZoomOut, Move } from 'lucide-react';
import { Button } from '../ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Product } from '../../types';

interface ARStickerPreviewProps {
  product: Product;
  onClose: () => void;
}

export function ARStickerPreview({ product, onClose }: ARStickerPreviewProps) {
  const [stream, setStream] = useState<MediaStream | null>(null);
  const [stickerPosition, setStickerPosition] = useState({ x: 50, y: 50 });
  const [stickerScale, setStickerScale] = useState(1);
  const [stickerRotation, setStickerRotation] = useState(0);
  const [isDragging, setIsDragging] = useState(false);
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  const startCamera = async () => {
    try {
      const mediaStream = await navigator.mediaDevices.getUserMedia({ 
        video: { facingMode: 'environment' } 
      });
      setStream(mediaStream);
      if (videoRef.current) {
        videoRef.current.srcObject = mediaStream;
      }
    } catch (error) {
      console.error('Camera access error:', error);
      alert('Unable to access camera. Please check permissions.');
    }
  };

  const stopCamera = () => {
    if (stream) {
      stream.getTracks().forEach(track => track.stop());
      setStream(null);
    }
  };

  const capturePhoto = () => {
    if (!videoRef.current || !canvasRef.current) return;

    const canvas = canvasRef.current;
    const video = videoRef.current;
    const ctx = canvas.getContext('2d');
    
    if (!ctx) return;

    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;

    // Draw video frame
    ctx.drawImage(video, 0, 0);

    // Draw sticker on top
    const img = new Image();
    img.crossOrigin = 'anonymous';
    img.src = product.image;
    img.onload = () => {
      ctx.save();
      
      const x = (canvas.width * stickerPosition.x) / 100;
      const y = (canvas.height * stickerPosition.y) / 100;
      const size = 150 * stickerScale;
      
      ctx.translate(x, y);
      ctx.rotate((stickerRotation * Math.PI) / 180);
      ctx.drawImage(img, -size / 2, -size / 2, size, size);
      ctx.restore();

      // Download image
      canvas.toBlob((blob) => {
        if (blob) {
          const url = URL.createObjectURL(blob);
          const a = document.createElement('a');
          a.href = url;
          a.download = `sticker-preview-${Date.now()}.png`;
          a.click();
          URL.revokeObjectURL(url);
        }
      });
    };
  };

  const handleMouseDown = () => setIsDragging(true);
  const handleMouseUp = () => setIsDragging(false);
  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!isDragging) return;
    const rect = e.currentTarget.getBoundingClientRect();
    const x = ((e.clientX - rect.left) / rect.width) * 100;
    const y = ((e.clientY - rect.top) / rect.height) * 100;
    setStickerPosition({ x: Math.max(0, Math.min(100, x)), y: Math.max(0, Math.min(100, y)) });
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/90 backdrop-blur-sm flex items-center justify-center p-4">
      <Card className="w-full max-w-4xl">
        <CardHeader>
          <div className="flex items-center justify-between">
            <div className="space-y-1">
              <CardTitle className="flex items-center gap-2">
                <Camera className="w-5 h-5" />
                AR Sticker Preview
              </CardTitle>
              <p className="text-sm text-muted-foreground">
                See how {product.name} looks in real life!
              </p>
            </div>
            <Button variant="ghost" size="icon" onClick={onClose}>
              <X className="w-5 h-5" />
            </Button>
          </div>
        </CardHeader>

        <CardContent className="space-y-4">
          {/* Camera Preview */}
          <div 
            className="relative aspect-video bg-muted rounded-xl overflow-hidden"
            onMouseMove={handleMouseMove}
            onMouseDown={handleMouseDown}
            onMouseUp={handleMouseUp}
            onMouseLeave={handleMouseUp}
          >
            {stream ? (
              <>
                <video
                  ref={videoRef}
                  autoPlay
                  playsInline
                  className="w-full h-full object-cover"
                />
                <div
                  className="absolute cursor-move"
                  style={{
                    left: `${stickerPosition.x}%`,
                    top: `${stickerPosition.y}%`,
                    transform: `translate(-50%, -50%) rotate(${stickerRotation}deg) scale(${stickerScale})`,
                  }}
                >
                  <img
                    src={product.image}
                    alt={product.name}
                    className="w-32 h-32 object-contain drop-shadow-2xl pointer-events-none"
                    draggable={false}
                  />
                </div>
                <div className="absolute bottom-4 left-4 bg-black/50 backdrop-blur-sm text-white px-3 py-1 rounded-full text-sm">
                  <Move className="w-4 h-4 inline mr-1" />
                  Drag to position
                </div>
              </>
            ) : (
              <div className="absolute inset-0 flex items-center justify-center">
                <Button onClick={startCamera} size="lg" className="gap-2">
                  <Camera className="w-5 h-5" />
                  Start Camera
                </Button>
              </div>
            )}
          </div>

          {/* Controls */}
          {stream && (
            <div className="space-y-3">
              <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
                <Button
                  variant="outline"
                  onClick={() => setStickerScale(s => Math.min(3, s + 0.2))}
                  className="gap-2"
                >
                  <ZoomIn className="w-4 h-4" />
                  Bigger
                </Button>
                <Button
                  variant="outline"
                  onClick={() => setStickerScale(s => Math.max(0.3, s - 0.2))}
                  className="gap-2"
                >
                  <ZoomOut className="w-4 h-4" />
                  Smaller
                </Button>
                <Button
                  variant="outline"
                  onClick={() => setStickerRotation(r => (r + 15) % 360)}
                  className="gap-2"
                >
                  <RotateCw className="w-4 h-4" />
                  Rotate
                </Button>
                <Button
                  onClick={capturePhoto}
                  className="gap-2 bg-gradient-to-r from-purple-600 to-pink-600"
                >
                  <Download className="w-4 h-4" />
                  Save Photo
                </Button>
              </div>

              <div className="flex gap-2">
                <Button variant="outline" onClick={stopCamera} className="flex-1">
                  Stop Camera
                </Button>
                <Button onClick={onClose} className="flex-1">
                  Done
                </Button>
              </div>
            </div>
          )}

          <canvas ref={canvasRef} className="hidden" />
        </CardContent>
      </Card>
    </div>
  );
}
