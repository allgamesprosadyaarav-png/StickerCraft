import { useState, useRef, useEffect } from 'react';
import { X, Send, Bot, User, ExternalLink, Loader2 } from 'lucide-react';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { createClient } from '@supabase/supabase-js';
import { FunctionsHttpError } from '@supabase/supabase-js';

const supabase = createClient(
  import.meta.env.VITE_SUPABASE_URL,
  import.meta.env.VITE_SUPABASE_ANON_KEY
);

interface Message {
  id: string;
  text: string;
  sender: 'user' | 'bot';
  timestamp: Date;
}

const AI_RESPONSES: { [key: string]: string } = {
  // Greetings
  hello: "Hi there! 👋 I'm Angila, your StickerCraft AI assistant. How can I help you today?",
  hi: "Hello! 👋 I'm here to help with any questions about StickerCraft!",
  
  // Products
  sticker: "We offer a wide variety of stickers including:\n• Anime characters (Naruto, Tanjiro, Gojo, Luffy, etc.)\n• Minecraft designs\n• Cartoonish stickers\n• AI-generated custom stickers\n\nPrices start from ₹10! What type are you looking for?",
  keychain: "Our keychains include:\n• Anime character keychains (₹110)\n• Food themed keychains\n• Minimalist designs\n• Gaming keychains\n\nAll come with case options like clear acrylic, leather, or glitter!",
  price: "Our pricing:\n• Standard stickers: ₹10\n• Anime stickers: ₹25\n• AI-generated stickers: ₹15\n• Keychains: ₹110\n• Premium stickers: ₹35\n• Premium keychains: ₹150",
  
  // AI Generation
  ai: "Our AI sticker generator lets you create unique designs! Just:\n1. Go to Custom Design\n2. Click 'AI Sticker Generator'\n3. Describe your idea\n4. Our AI creates it for you!\n\nAI stickers cost ₹15 each.",
  custom: "You can customize stickers and keychains by:\n• Uploading your own images\n• Adding text overlays\n• Choosing different shapes\n• Applying color filters\n• Selecting fonts and sizes",
  
  // Premium
  premium: "Premium subscription (₹99) gives you:\n• Access to exclusive premium stickers & keychains\n• Quick delivery (3-5 days)\n• Special discounts\n• Early access to new designs\n\nWorth it for serious collectors!",
  
  // Loyalty
  loyalty: "Our loyalty program rewards you:\n• Earn 5 points per ₹1 spent\n• Redeem points for:\n  - Free stickers\n  - Discounts\n  - Premium access\n  - Free keychains\n\nCheck the loyalty widget to see your progress!",
  points: "You earn 5 loyalty points for every ₹1 you spend! Collect points to unlock awesome rewards like free stickers, discounts, and even premium membership!",
  
  // Games/Features
  spin: "Try our Lucky Spin Wheel! You can spin 2 times per month to win:\n• Discount codes (5-30% OFF)\n• Loyalty points\n• Free stickers\n\nFind it in the Fun Zone on the store page!",
  scratch: "Scratch Cards are available 2 times per month! Scratch to reveal:\n• Discount codes\n• Special offers\n\nYour winnings are saved to use at checkout!",
  mystery: "Mystery Boxes contain surprise items:\n• Basic Box (₹25): 3 random stickers\n• Premium Box (₹60): 5 stickers + 1 keychain\n• Mega Box (₹100): 10 random items\n\nGreat for discovering new designs!",
  
  // Shipping & Delivery
  shipping: "Shipping information:\n• Standard: 5-7 business days\n• Premium members: 3-5 business days (quick delivery)\n• We ship across India\n• Free shipping on orders above ₹500",
  delivery: "Delivery takes 5-7 days for standard orders, and 3-5 days for premium members. We deliver all across India!",
  
  // Payment
  payment: "We accept:\n• Credit cards (Visa, Mastercard, etc.)\n• Debit cards\n• UPI (Google Pay, PhonePe, Paytm)\n• You can scan our UPI QR code at checkout",
  
  // Orders & Returns
  order: "To track your order:\n1. Go to 'My Orders' page\n2. View your order status\n3. Check delivery updates\n\nOrder ID is sent to your email after purchase!",
  return: "Returns & exchanges:\n• Damaged/incorrect items: Contact us within 7 days\n• We'll provide replacement or refund\n• Custom/AI-generated stickers are non-returnable\n\nContact us on Instagram for support!",
  
  // Account
  account: "Your account features:\n• Track orders\n• View loyalty points\n• Save favorites to wishlist\n• Manage addresses\n• View purchase history",
  
  // Contact
  contact: "Need more help? Contact us on Instagram:\n📱 @stickercraft_official\n🔗 instagram.com/stickercraft_official\n\nWe respond within 24 hours!",
  help: "I'm here to help! You can:\n• Ask about products\n• Learn about features\n• Get pricing info\n• Understand shipping\n\nOr contact us directly on Instagram @stickercraft_official for personalized support!",
  instagram: "Follow us on Instagram!\n📱 @stickercraft_official\n🔗 instagram.com/stickercraft_official\n\nFor customer support, DM us anytime!",
};

const QUICK_QUESTIONS = [
  "What stickers do you have?",
  "How does AI generation work?",
  "What's the Premium subscription?",
  "How do I earn loyalty points?",
  "Shipping and delivery info",
  "Contact customer support",
];

interface AngilaAIProps {
  onClose: () => void;
}

export function AngilaAI({ onClose }: AngilaAIProps) {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      text: "Hi! I'm Angila 🤖, your StickerCraft AI assistant! I can help you with product questions, orders, features, and more. What would you like to know?",
      sender: 'bot',
      timestamp: new Date(),
    },
  ]);
  const [inputValue, setInputValue] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const getAIResponse = async (userMessage: string): Promise<string> => {
    try {
      const { data, error } = await supabase.functions.invoke('angela-ai-chat', {
        body: { message: userMessage },
      });

      if (error) {
        console.error('AI Error:', error);
        if (error instanceof FunctionsHttpError) {
          const errorText = await error.context.text();
          console.error('Error details:', errorText);
        }
        // Fallback to pre-programmed responses
        return findFallbackResponse(userMessage);
      }

      return data.response;
    } catch (err) {
      console.error('AI call failed:', err);
      return findFallbackResponse(userMessage);
    }
  };

  const findFallbackResponse = (userMessage: string): string => {
    const message = userMessage.toLowerCase();
    
    // Check for exact or partial matches
    for (const [key, response] of Object.entries(AI_RESPONSES)) {
      if (message.includes(key)) {
        return response;
      }
    }
    
    // Default response
    return "I'm not sure about that specific question. Here are some helpful options:\n\n• Ask about our products (stickers, keychains)\n• Learn about AI generation and customization\n• Inquire about Premium subscription\n• Get shipping and payment info\n• Contact customer support\n\nOr DM us on Instagram @stickercraft_official for personalized help! 📱";
  };

  const handleSend = async (text?: string) => {
    const messageText = text || inputValue.trim();
    if (!messageText) return;

    // Add user message
    const userMessage: Message = {
      id: Date.now().toString(),
      text: messageText,
      sender: 'user',
      timestamp: new Date(),
    };
    setMessages((prev) => [...prev, userMessage]);
    setInputValue('');
    setIsTyping(true);

    // Get AI response
    const response = await getAIResponse(messageText);
    
    const botMessage: Message = {
      id: (Date.now() + 1).toString(),
      text: response,
      sender: 'bot',
      timestamp: new Date(),
    };
    setMessages((prev) => [...prev, botMessage]);
    setIsTyping(false);
  };

  return (
    <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4 animate-in fade-in">
      <div className="glass bg-card rounded-2xl max-w-2xl w-full h-[600px] flex flex-col animate-in zoom-in-95 overflow-hidden">
        {/* Header */}
        <div className="bg-gradient-to-r from-primary to-purple-600 p-4 flex items-center justify-between text-white">
          <div className="flex items-center gap-3">
            <div className="relative">
              <div className="w-12 h-12 bg-white rounded-full flex items-center justify-center">
                <Bot className="w-7 h-7 text-primary" />
              </div>
              <div className="absolute bottom-0 right-0 w-3 h-3 bg-green-400 rounded-full border-2 border-white" />
            </div>
            <div>
              <h2 className="text-lg font-bold">Angila AI</h2>
              <p className="text-xs opacity-90">StickerCraft Assistant • Online</p>
            </div>
          </div>
          <button onClick={onClose} className="hover:bg-white/20 rounded-full p-2 transition-colors">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Quick Questions */}
        <div className="p-3 bg-muted/30 border-b overflow-x-auto">
          <p className="text-xs text-muted-foreground mb-2">Quick questions:</p>
          <div className="flex gap-2 flex-nowrap">
            {QUICK_QUESTIONS.map((question) => (
              <button
                key={question}
                onClick={() => handleSend(question)}
                className="text-xs px-3 py-1.5 bg-primary/10 hover:bg-primary/20 rounded-full whitespace-nowrap transition-colors"
              >
                {question}
              </button>
            ))}
          </div>
        </div>

        {/* Messages */}
        <div className="flex-1 overflow-y-auto p-4 space-y-4">
          {messages.map((message) => (
            <div
              key={message.id}
              className={`flex gap-3 ${message.sender === 'user' ? 'flex-row-reverse' : 'flex-row'}`}
            >
              <div className={`flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center ${
                message.sender === 'user' 
                  ? 'bg-gradient-to-br from-primary to-purple-600' 
                  : 'bg-gradient-to-br from-blue-500 to-cyan-500'
              }`}>
                {message.sender === 'user' ? (
                  <User className="w-5 h-5 text-white" />
                ) : (
                  <Bot className="w-5 h-5 text-white" />
                )}
              </div>
              <div className={`flex-1 max-w-[80%] ${message.sender === 'user' ? 'items-end' : 'items-start'} flex flex-col`}>
                <div className={`rounded-2xl px-4 py-2.5 ${
                  message.sender === 'user'
                    ? 'bg-gradient-to-br from-primary to-purple-600 text-white'
                    : 'bg-muted'
                }`}>
                  <p className="text-sm whitespace-pre-line">{message.text}</p>
                </div>
                <p className="text-xs text-muted-foreground mt-1 px-2">
                  {message.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                </p>
              </div>
            </div>
          ))}
          
          {isTyping && (
            <div className="flex gap-3">
              <div className="flex-shrink-0 w-8 h-8 rounded-full bg-gradient-to-br from-blue-500 to-cyan-500 flex items-center justify-center">
                <Bot className="w-5 h-5 text-white" />
              </div>
              <div className="bg-muted rounded-2xl px-4 py-2.5">
                <div className="flex gap-1">
                  <div className="w-2 h-2 bg-muted-foreground rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
                  <div className="w-2 h-2 bg-muted-foreground rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
                  <div className="w-2 h-2 bg-muted-foreground rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
                </div>
              </div>
            </div>
          )}
          
          <div ref={messagesEndRef} />
        </div>

        {/* Contact Banner */}
        <div className="bg-gradient-to-r from-pink-500/10 to-purple-500/10 border-t border-b px-4 py-2">
          <a
            href="https://instagram.com/stickercraft_official"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center justify-between text-sm hover:opacity-80 transition-opacity"
          >
            <div className="flex items-center gap-2">
              <div className="text-2xl">📱</div>
              <div>
                <p className="font-semibold">Need personalized help?</p>
                <p className="text-xs text-muted-foreground">DM us on Instagram @stickercraft_official</p>
              </div>
            </div>
            <ExternalLink className="w-4 h-4 text-primary" />
          </a>
        </div>

        {/* Input */}
        <div className="p-4 border-t bg-background">
          <form
            onSubmit={(e) => {
              e.preventDefault();
              handleSend();
            }}
            className="flex gap-2"
          >
            <Input
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              placeholder="Type your question..."
              className="flex-1"
            />
            <Button type="submit" size="icon" disabled={!inputValue.trim()}>
              <Send className="w-4 h-4" />
            </Button>
          </form>
        </div>
      </div>
    </div>
  );
}
