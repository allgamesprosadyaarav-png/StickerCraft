import { Instagram, Heart, Sparkles } from 'lucide-react';
import { Card, CardContent } from '../ui/card';

export function SocialBanner() {
  return (
    <Card className="glass mb-6 overflow-hidden relative border-2 border-primary/20">
      <div className="absolute inset-0 bg-gradient-to-r from-pink-500/10 via-purple-500/10 to-blue-500/10 animate-gradient"></div>
      <CardContent className="p-6 relative">
        <div className="flex flex-col md:flex-row items-center justify-center gap-4">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-full bg-gradient-to-br from-pink-500 to-purple-600 flex items-center justify-center shadow-lg animate-pulse">
              <Instagram className="w-6 h-6 text-white" />
            </div>
            <div>
              <p className="text-lg font-bold flex items-center gap-2">
                <Sparkles className="w-5 h-5 text-yellow-500" />
                Join Our Community!
              </p>
              <p className="text-sm text-muted-foreground">
                Follow us for exclusive designs & giveaways
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <Heart className="w-5 h-5 text-red-500 animate-bounce" />
            <a
              href="https://instagram.com/stickercraft_official"
              target="_blank"
              rel="noopener noreferrer"
              className="text-lg font-bold text-primary hover:underline flex items-center gap-1"
            >
              @stickercraft_official
            </a>
            <Heart className="w-5 h-5 text-red-500 animate-bounce" />
          </div>
        </div>

        <div className="mt-3 text-center">
          <p className="text-xs text-muted-foreground">
            ✨ Tag us in your posts with #StickerCraftCreations for a chance to be featured!
          </p>
        </div>
      </CardContent>
    </Card>
  );
}

