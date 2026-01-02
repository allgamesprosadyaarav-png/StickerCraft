import { useState } from 'react';
import { X, ChevronRight, Sparkles } from 'lucide-react';
import { Button } from '../ui/button';
import { Product } from '../../types';
import { ALL_PRODUCTS } from '../../constants/products';

interface Question {
  id: number;
  question: string;
  options: {
    text: string;
    personality: string;
  }[];
}

const QUESTIONS: Question[] = [
  {
    id: 1,
    question: 'What\'s your ideal weekend?',
    options: [
      { text: '🎮 Gaming marathon', personality: 'gamer' },
      { text: '📺 Binge-watching anime', personality: 'anime' },
      { text: '🎨 Creative projects', personality: 'creative' },
      { text: '😌 Chill and relax', personality: 'minimalist' },
    ],
  },
  {
    id: 2,
    question: 'Pick your aesthetic:',
    options: [
      { text: '✨ Cute and colorful', personality: 'kawaii' },
      { text: '⚫ Dark and edgy', personality: 'edgy' },
      { text: '🌈 Bright and vibrant', personality: 'vibrant' },
      { text: '🤍 Clean and minimal', personality: 'minimalist' },
    ],
  },
  {
    id: 3,
    question: 'Your favorite snack?',
    options: [
      { text: '🍕 Pizza!', personality: 'foodie' },
      { text: '🍣 Sushi', personality: 'anime' },
      { text: '🍔 Burger', personality: 'casual' },
      { text: '🥗 Healthy stuff', personality: 'minimalist' },
    ],
  },
  {
    id: 4,
    question: 'Dream vacation destination?',
    options: [
      { text: '🗾 Japan', personality: 'anime' },
      { text: '🎡 Theme park', personality: 'fun' },
      { text: '🏔️ Mountains', personality: 'nature' },
      { text: '🏖️ Beach', personality: 'chill' },
    ],
  },
];

interface PersonalityQuizProps {
  onClose: () => void;
  onComplete: (recommendations: Product[]) => void;
}

export function PersonalityQuiz({ onClose, onComplete }: PersonalityQuizProps) {
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [answers, setAnswers] = useState<string[]>([]);
  const [showResults, setShowResults] = useState(false);
  const [recommendations, setRecommendations] = useState<Product[]>([]);

  const handleAnswer = (personality: string) => {
    const newAnswers = [...answers, personality];
    setAnswers(newAnswers);

    if (currentQuestion < QUESTIONS.length - 1) {
      setCurrentQuestion(currentQuestion + 1);
    } else {
      // Calculate personality type
      const personalityCount: { [key: string]: number } = {};
      newAnswers.forEach((p) => {
        personalityCount[p] = (personalityCount[p] || 0) + 1;
      });

      const dominantPersonality = Object.entries(personalityCount).sort(
        ([, a], [, b]) => b - a
      )[0][0];

      // Get recommendations based on personality
      const recs = getRecommendations(dominantPersonality);
      setRecommendations(recs);
      setShowResults(true);
    }
  };

  const getRecommendations = (personality: string): Product[] => {
    const personalityMap: { [key: string]: string[] } = {
      anime: ['anime'],
      gamer: ['gaming'],
      minimalist: ['minimalist'],
      foodie: ['food'],
      creative: ['standard'],
      kawaii: ['standard', 'anime'],
      vibrant: ['standard', 'anime'],
    };

    const categories = personalityMap[personality] || ['standard'];
    return ALL_PRODUCTS.filter((p) => categories.includes(p.category)).slice(0, 6);
  };

  const getPersonalityTitle = () => {
    const personality = answers[answers.length - 1] || 'creative';
    const titles: { [key: string]: string } = {
      anime: '🎌 The Anime Enthusiast',
      gamer: '🎮 The Gaming Legend',
      minimalist: '🤍 The Minimalist',
      foodie: '🍕 The Foodie',
      creative: '🎨 The Creative Spirit',
      kawaii: '✨ The Kawaii Collector',
      vibrant: '🌈 The Color Lover',
    };
    return titles[personality] || '✨ The Unique One';
  };

  if (showResults) {
    return (
      <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4 animate-in fade-in">
        <div className="glass bg-card rounded-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto p-6 animate-in zoom-in-95">
          <div className="text-center space-y-6">
            <div className="inline-block bg-gradient-to-r from-primary to-purple-600 text-white px-6 py-3 rounded-full text-2xl font-bold">
              {getPersonalityTitle()}
            </div>
            
            <h3 className="text-xl font-semibold">Your Perfect Sticker Matches:</h3>
            
            <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
              {recommendations.map((product) => (
                <div
                  key={product.id}
                  className="group bg-muted/30 rounded-xl p-3 hover:scale-105 transition-transform"
                >
                  <div className="aspect-square rounded-lg overflow-hidden mb-2">
                    <img
                      src={product.image}
                      alt={product.name}
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <p className="text-sm font-medium text-center">{product.name}</p>
                  <p className="text-primary text-center font-bold">₹{product.price}</p>
                </div>
              ))}
            </div>

            <div className="flex gap-3">
              <Button
                onClick={() => {
                  onComplete(recommendations);
                  onClose();
                }}
                className="flex-1 gap-2"
              >
                <Sparkles className="w-4 h-4" />
                View Recommendations
              </Button>
              <Button onClick={onClose} variant="outline" className="flex-1">
                Close
              </Button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  const question = QUESTIONS[currentQuestion];

  return (
    <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4 animate-in fade-in">
      <div className="glass bg-card rounded-2xl max-w-md w-full p-6 animate-in zoom-in-95">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-bold">Find Your Sticker Style</h2>
          <button onClick={onClose} className="hover:bg-muted rounded-full p-2">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Progress */}
        <div className="mb-6">
          <div className="flex justify-between text-sm text-muted-foreground mb-2">
            <span>Question {currentQuestion + 1} of {QUESTIONS.length}</span>
            <span>{Math.round(((currentQuestion + 1) / QUESTIONS.length) * 100)}%</span>
          </div>
          <div className="h-2 bg-muted rounded-full overflow-hidden">
            <div
              className="h-full bg-gradient-to-r from-primary to-purple-600 transition-all duration-300"
              style={{ width: `${((currentQuestion + 1) / QUESTIONS.length) * 100}%` }}
            />
          </div>
        </div>

        <div className="space-y-4">
          <h3 className="text-lg font-semibold text-center">{question.question}</h3>
          
          <div className="space-y-2">
            {question.options.map((option, index) => (
              <button
                key={index}
                onClick={() => handleAnswer(option.personality)}
                className="w-full p-4 text-left bg-muted/50 hover:bg-primary/10 rounded-lg transition-all hover:scale-105 border-2 border-transparent hover:border-primary group"
              >
                <div className="flex items-center justify-between">
                  <span className="font-medium">{option.text}</span>
                  <ChevronRight className="w-5 h-5 text-muted-foreground group-hover:text-primary transition-colors" />
                </div>
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
