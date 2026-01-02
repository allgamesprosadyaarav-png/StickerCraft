import { useState } from 'react';
import { Sparkles, Wand2, Loader2, Download, ShoppingCart } from 'lucide-react';
import { createClient } from '@supabase/supabase-js';
import { FunctionsHttpError } from '@supabase/supabase-js';
import { Button } from '../ui/button';
import { Card, CardContent } from '../ui/card';
import { Input } from '../ui/input';
import { toast } from '../../hooks/use-toast';
import { useCartStore } from '../../stores/cartStore';

const supabase = createClient(
  import.meta.env.VITE_SUPABASE_URL,
  import.meta.env.VITE_SUPABASE_ANON_KEY
);

const EXAMPLE_PROMPTS = [
  'Cute kawaii panda eating ramen noodles',
  'Cyberpunk neon dragon breathing fire',
  'Retro 80s vaporwave sunset with palm trees',
  'Anime-style magical girl with cherry blossoms',
  'Pixel art game character wielding a sword',
  'Holographic rainbow unicorn with stars',
  'Minimalist mountain landscape at sunset',
  'Cartoon space astronaut floating in galaxy',
  'Chibi anime cat with big sparkly eyes',
  'Cute coffee cup with kawaii face and steam',
];

export function AIGeneratorTab() {
  const [prompt, setPrompt] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);
  const [generatedImage, setGeneratedImage] = useState<string | null>(null);
  const [generatedDescription, setGeneratedDescription] = useState<string>('');
  const addToCart = useCartStore((state) => state.addItem);

  const handleGenerate = async () => {
    if (!prompt.trim()) {
      toast({
        title: 'Enter a prompt',
        description: 'Please describe the sticker you want to generate',
        variant: 'destructive',
      });
      return;
    }

    setIsGenerating(true);
    setGeneratedImage(null);

    try {
      const { data, error } = await supabase.functions.invoke('generate-ai-sticker', {
        body: { prompt: prompt.trim() },
      });

      if (error) {
        console.error('AI Generation Error:', error);
        let errorMessage = 'Failed to generate sticker';
        let errorDetails = '';
        
        if (error instanceof FunctionsHttpError) {
          try {
            const statusCode = error.context?.status ?? 500;
            const responseText = await error.context?.text();
            console.log('Error response:', responseText);
            
            // Try to parse JSON error response
            try {
              const errorData = JSON.parse(responseText);
              errorMessage = errorData.error || errorMessage;
              errorDetails = errorData.details || '';
            } catch {
              // Not JSON, use as plain text
              errorMessage = responseText || errorMessage;
            }

            // Add status code context
            if (statusCode === 402) {
              errorMessage = '⚠️ AI Service Quota Limit Reached\n\n' + errorMessage + '\n\nPlease contact support on Instagram: @stickercraft_official';
            } else if (statusCode === 429) {
              errorMessage = '⏳ Too Many Requests\n\nPlease wait a moment and try again.';
            } else if (statusCode === 401) {
              errorMessage = '🔒 Authentication Error\n\nPlease contact support.';
            }
          } catch (parseError) {
            console.error('Error parsing error response:', parseError);
            errorMessage = error.message || 'Failed to generate sticker';
          }
        } else {
          errorMessage = error.message || errorMessage;
        }
        
        throw new Error(errorMessage);
      }

      if (!data?.success || !data?.imageUrl) {
        throw new Error('Failed to generate image');
      }

      setGeneratedImage(data.imageUrl);
      setGeneratedDescription(data.description || 'AI-generated sticker');

      toast({
        title: 'Sticker generated! ✨',
        description: 'Your AI-generated sticker is ready!',
      });
    } catch (error: any) {
      console.error('Generation error:', error);
      
      // Format multi-line error messages
      const errorLines = error.message?.split('\n') || ['Failed to generate sticker'];
      const title = errorLines[0];
      const description = errorLines.slice(1).join(' ').trim() || 'Please try again or contact support.';
      
      toast({
        title: title,
        description: description,
        variant: 'destructive',
      });
    } finally {
      setIsGenerating(false);
    }
  };

  const handleAddToCart = () => {
    if (!generatedImage) return;

    const aiSticker = {
      id: `ai-sticker-${Date.now()}`,
      name: `AI: ${prompt.slice(0, 30)}${prompt.length > 30 ? '...' : ''}`,
      type: 'sticker' as const,
      category: 'standard' as const,
      price: 15, // AI-generated stickers at ₹15
      image: generatedImage,
      description: generatedDescription,
    };

    addToCart(aiSticker);
    toast({
      title: 'Added to cart! 🎉',
      description: 'Your AI-generated sticker has been added to cart.',
    });
  };

  const handleDownload = () => {
    if (!generatedImage) return;

    const link = document.createElement('a');
    link.href = generatedImage;
    link.download = `ai-sticker-${Date.now()}.png`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

    toast({
      title: 'Download started! 📥',
      description: 'Your AI-generated sticker is downloading.',
    });
  };

  return (
    <div className="space-y-6">
      <div className="text-center space-y-2">
        <div className="flex items-center justify-center gap-2">
          <Sparkles className="w-8 h-8 text-purple-500 animate-pulse" />
          <h2 className="text-3xl font-bold text-gradient">AI Sticker Generator</h2>
          <Sparkles className="w-8 h-8 text-pink-500 animate-pulse" />
        </div>
        <p className="text-muted-foreground">
          Describe your dream sticker and let AI create it for you! ✨
        </p>
      </div>

      {/* Input Section */}
      <Card className="glass">
        <CardContent className="p-6 space-y-4">
          <div className="space-y-2">
            <label className="text-sm font-medium">Describe your sticker:</label>
            <div className="flex gap-2">
              <Input
                value={prompt}
                onChange={(e) => setPrompt(e.target.value)}
                placeholder="e.g., Cute kawaii panda eating ramen"
                className="flex-1"
                onKeyDown={(e) => {
                  if (e.key === 'Enter' && !isGenerating) {
                    handleGenerate();
                  }
                }}
              />
              <Button
                onClick={handleGenerate}
                disabled={isGenerating || !prompt.trim()}
                className="gap-2 bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700"
              >
                {isGenerating ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    Generating...
                  </>
                ) : (
                  <>
                    <Wand2 className="w-4 h-4" />
                    Generate
                  </>
                )}
              </Button>
            </div>
          </div>

          {/* Example Prompts */}
          <div className="space-y-2">
            <p className="text-xs text-muted-foreground">Try these examples:</p>
            <div className="flex flex-wrap gap-2">
              {EXAMPLE_PROMPTS.map((example) => (
                <Button
                  key={example}
                  variant="outline"
                  size="sm"
                  onClick={() => setPrompt(example)}
                  className="text-xs"
                  disabled={isGenerating}
                >
                  {example}
                </Button>
              ))}
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Generated Sticker Display */}
      {isGenerating && (
        <Card className="glass">
          <CardContent className="p-12">
            <div className="flex flex-col items-center justify-center space-y-4">
              <Loader2 className="w-16 h-16 animate-spin text-primary" />
              <p className="text-lg font-medium">Creating your sticker...</p>
              <p className="text-sm text-muted-foreground">This may take a few seconds</p>
            </div>
          </CardContent>
        </Card>
      )}

      {generatedImage && !isGenerating && (
        <Card className="glass">
          <CardContent className="p-6 space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-xl font-bold">Your AI-Generated Sticker</h3>
              <div className="bg-primary/10 text-primary px-3 py-1 rounded-full text-sm font-medium">
                ₹15
              </div>
            </div>

            <div className="relative aspect-square max-w-md mx-auto bg-gradient-to-br from-muted/50 to-muted rounded-xl overflow-hidden">
              <div className="w-full h-full flex items-center justify-center p-8">
                <div className="relative w-full h-full rounded-full overflow-hidden border-4 border-white shadow-2xl">
                  <img
                    src={generatedImage}
                    alt="AI Generated Sticker"
                    className="w-full h-full object-cover"
                  />
                </div>
              </div>
            </div>

            <div className="space-y-2">
              <p className="text-sm font-medium">Prompt:</p>
              <p className="text-sm text-muted-foreground italic">&ldquo;{prompt}&rdquo;</p>
            </div>

            <div className="flex gap-2">
              <Button onClick={handleAddToCart} className="flex-1 gap-2">
                <ShoppingCart className="w-4 h-4" />
                Add to Cart - ₹15
              </Button>
              <Button onClick={handleDownload} variant="outline" className="gap-2">
                <Download className="w-4 h-4" />
                Download
              </Button>
            </div>

            <Button
              onClick={() => {
                setGeneratedImage(null);
                setPrompt('');
              }}
              variant="ghost"
              className="w-full"
            >
              Generate Another Sticker
            </Button>
          </CardContent>
        </Card>
      )}

      {/* Info Section */}
      <Card className="glass border-2 border-primary/20">
        <CardContent className="p-4">
          <div className="flex items-start gap-3">
            <Sparkles className="w-5 h-5 text-purple-500 mt-0.5" />
            <div className="space-y-1 text-sm">
              <p className="font-medium">How AI Sticker Generation Works:</p>
              <ul className="text-muted-foreground space-y-1 ml-4 list-disc">
                <li>Describe your desired sticker in detail</li>
                <li>Our AI creates a unique design just for you</li>
                <li>AI-generated stickers are priced at ₹15 each</li>
                <li>Download and use them anywhere!</li>
              </ul>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
