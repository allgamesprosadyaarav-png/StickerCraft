import { useState, useEffect } from 'react';
import { Mic, MicOff, Search, Loader2 } from 'lucide-react';
import { Button } from '../ui/button';
import { Card } from '../ui/card';
import { toast } from '../../hooks/use-toast';

interface VoiceSearchProps {
  onSearch: (query: string) => void;
}

export function VoiceSearch({ onSearch }: VoiceSearchProps) {
  const [isListening, setIsListening] = useState(false);
  const [transcript, setTranscript] = useState('');
  const [recognition, setRecognition] = useState<any>(null);

  useEffect(() => {
    if (typeof window !== 'undefined' && ('webkitSpeechRecognition' in window || 'SpeechRecognition' in window)) {
      const SpeechRecognition = (window as any).webkitSpeechRecognition || (window as any).SpeechRecognition;
      const recognitionInstance = new SpeechRecognition();
      
      recognitionInstance.continuous = false;
      recognitionInstance.interimResults = true;
      recognitionInstance.lang = 'en-IN'; // Indian English

      recognitionInstance.onresult = (event: any) => {
        const current = event.resultIndex;
        const transcriptText = event.results[current][0].transcript;
        setTranscript(transcriptText);

        if (event.results[current].isFinal) {
          onSearch(transcriptText);
          setIsListening(false);
          toast({
            title: '🎤 Voice search complete!',
            description: `Searching for: ${transcriptText}`,
          });
        }
      };

      recognitionInstance.onerror = (event: any) => {
        console.error('Speech recognition error:', event.error);
        setIsListening(false);
        toast({
          title: 'Voice search error',
          description: 'Please try again or type your search',
          variant: 'destructive',
        });
      };

      recognitionInstance.onend = () => {
        setIsListening(false);
      };

      setRecognition(recognitionInstance);
    }
  }, [onSearch]);

  const startListening = () => {
    if (!recognition) {
      toast({
        title: 'Voice search not supported',
        description: 'Your browser does not support voice search',
        variant: 'destructive',
      });
      return;
    }

    setTranscript('');
    setIsListening(true);
    recognition.start();
    toast({
      title: '🎤 Listening...',
      description: 'Speak your search query',
    });
  };

  const stopListening = () => {
    if (recognition) {
      recognition.stop();
      setIsListening(false);
    }
  };

  return (
    <div className="relative">
      <Button
        onClick={isListening ? stopListening : startListening}
        variant={isListening ? 'default' : 'outline'}
        size="lg"
        className={`gap-2 ${isListening ? 'animate-pulse bg-gradient-to-r from-red-500 to-pink-500' : ''}`}
      >
        {isListening ? (
          <>
            <MicOff className="w-5 h-5" />
            Stop Listening
          </>
        ) : (
          <>
            <Mic className="w-5 h-5" />
            Voice Search
          </>
        )}
      </Button>

      {isListening && (
        <Card className="absolute top-full mt-2 left-0 right-0 p-4 bg-background/95 backdrop-blur-lg border-2 border-primary z-50">
          <div className="flex items-center gap-3">
            <Loader2 className="w-5 h-5 animate-spin text-primary" />
            <div className="flex-1">
              <p className="text-sm font-medium">Listening...</p>
              {transcript && (
                <p className="text-xs text-muted-foreground mt-1">{transcript}</p>
              )}
            </div>
            <div className="flex gap-1">
              {[1, 2, 3, 4].map((i) => (
                <div
                  key={i}
                  className="w-1 bg-primary rounded-full animate-pulse"
                  style={{
                    height: `${Math.random() * 20 + 10}px`,
                    animationDelay: `${i * 0.1}s`,
                  }}
                />
              ))}
            </div>
          </div>
        </Card>
      )}
    </div>
  );
}
