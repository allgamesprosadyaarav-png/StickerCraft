import { useState } from 'react';
import { X, Smile, Frown, Meh, Heart, Zap, Star } from 'lucide-react';
import { Button } from '../ui/button';
import { Product } from '../../types';
import { ALL_PRODUCTS } from '../../constants/products';

const MOODS = [
  { id: 'happy', icon: Smile, label: 'Happy', color: 'from-yellow-400 to-orange-400', keywords: ['cute', 'fun', 'smile'] },
  { id: 'love', icon: Heart, label: 'In Love', color: 'from-pink-400 to-red-400', keywords: ['heart', 'love', 'cute'] },
  { id: 'energetic', icon: Zap, label: 'Energetic', color: 'from-green-400 to-emerald-400', keywords: ['gaming', 'action', 'power'] },
  { id: 'chill', icon: Meh, label: 'Chill', color: 'from-blue-400 to-cyan-400', keywords: ['minimal', 'simple', 'calm'] },
  { id: 'excited', icon: Star, label: 'Excited', color: 'from-purple-400 to-pink-400', keywords: ['anime', 'vibrant', 'cool'] },
  { id: 'sad', icon: Frown, label: 'Need Comfort', color: 'from-indigo-400 to-purple-400', keywords: ['cute', 'soft', 'warm'] },
];

interface MoodSelectorProps {
  onClose: () => void;
  onSelect: (products: Product[]) => void;
}

export function MoodSelector({ onClose, onSelect }: MoodSelectorProps) {
  const [selectedMood, setSelectedMood] = useState<typeof MOODS[0] | null>(null);

  const handleMoodSelect = (mood: typeof MOODS[0]) => {
    setSelectedMood(mood);
    
    // Filter products based on mood
    const filtered = ALL_PRODUCTS.filter((product) => {
      const searchText = `${product.name} ${product.description || ''} ${product.category}`.toLowerCase();
      return mood.keywords.some((keyword) => searchText.includes(keyword));
    }).slice(0, 8);

    setTimeout(() => {
      onSelect(filtered);
      onClose();
    }, 500);
  };

  return (
    <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4 animate-in fade-in">
      <div className="glass bg-card rounded-2xl max-w-2xl w-full p-6 animate-in zoom-in-95">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-bold">How are you feeling today?</h2>
          <button onClick={onClose} className="hover:bg-muted rounded-full p-2">
            <X className="w-5 h-5" />
          </button>
        </div>

        <p className="text-muted-foreground text-center mb-8">
          We'll recommend stickers that match your mood! ✨
        </p>

        <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
          {MOODS.map((mood) => {
            const Icon = mood.icon;
            return (
              <button
                key={mood.id}
                onClick={() => handleMoodSelect(mood)}
                className={`group relative p-6 rounded-2xl border-2 transition-all hover:scale-105 ${
                  selectedMood?.id === mood.id
                    ? 'border-primary bg-primary/10'
                    : 'border-border hover:border-primary'
                }`}
              >
                <div className={`absolute inset-0 bg-gradient-to-br ${mood.color} opacity-0 group-hover:opacity-10 rounded-2xl transition-opacity`} />
                <div className="relative space-y-3 text-center">
                  <div className={`inline-flex items-center justify-center w-16 h-16 rounded-full bg-gradient-to-br ${mood.color} text-white`}>
                    <Icon className="w-8 h-8" />
                  </div>
                  <p className="font-semibold">{mood.label}</p>
                </div>
                {selectedMood?.id === mood.id && (
                  <div className="absolute inset-0 flex items-center justify-center">
                    <div className="animate-ping absolute inline-flex h-full w-full rounded-2xl bg-primary opacity-20" />
                  </div>
                )}
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
}
