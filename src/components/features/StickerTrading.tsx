import { useState } from 'react';
import { Repeat, Users, TrendingUp, Star, MessageCircle } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { useAuthStore } from '../../stores/authStore';
import { toast } from '../../hooks/use-toast';

interface TradeOffer {
  id: string;
  fromUser: string;
  fromUserAvatar: string;
  offerSticker: { name: string; image: string };
  wantSticker: { name: string; image: string };
  status: 'pending' | 'accepted' | 'rejected';
  createdAt: string;
}

const SAMPLE_TRADES: TradeOffer[] = [
  {
    id: 'trade-1',
    fromUser: 'Rahul_Collector',
    fromUserAvatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=rahul',
    offerSticker: { 
      name: 'Tanjiro Kamado', 
      image: 'https://cdn-ai.onspace.ai/onspace/files/oN6s9VcVj4mPPCEEeP7fZP/pasted-image-1765261960453-2.png'
    },
    wantSticker: { 
      name: 'Deku', 
      image: 'https://cdn-ai.onspace.ai/onspace/files/nCit9xSF2oDiKYZBrQsNNr/pasted-image-1765262297051-0.png'
    },
    status: 'pending',
    createdAt: '2 hours ago',
  },
  {
    id: 'trade-2',
    fromUser: 'Anime_Fan_99',
    fromUserAvatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=anime',
    offerSticker: { 
      name: 'Kakashi', 
      image: 'https://cdn-ai.onspace.ai/onspace/files/QJyMfUqPP8LPjePpRfCBUE/ka.jpeg'
    },
    wantSticker: { 
      name: 'Luffy', 
      image: 'https://cdn-ai.onspace.ai/onspace/files/naFdBBK3XimGUcUicCoNSZ/luf.jpeg'
    },
    status: 'pending',
    createdAt: '5 hours ago',
  },
];

interface StickerTradingProps {
  onClose: () => void;
}

export function StickerTrading({ onClose }: StickerTradingProps) {
  const user = useAuthStore((state) => state.user);
  const [trades, setTrades] = useState<TradeOffer[]>(SAMPLE_TRADES);
  const [searchQuery, setSearchQuery] = useState('');

  const handleAcceptTrade = (tradeId: string) => {
    setTrades(trades.map(t => 
      t.id === tradeId ? { ...t, status: 'accepted' as const } : t
    ));
    toast({
      title: 'Trade accepted! 🎉',
      description: 'The sticker will be sent to your collection',
    });
  };

  const handleRejectTrade = (tradeId: string) => {
    setTrades(trades.filter(t => t.id !== tradeId));
    toast({
      title: 'Trade rejected',
      description: 'The offer has been declined',
    });
  };

  const handleCreateTrade = () => {
    toast({
      title: 'Coming soon! 🚀',
      description: 'Create custom trade offers in the next update',
    });
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm overflow-y-auto">
      <div className="min-h-screen flex items-center justify-center p-4">
        <Card className="w-full max-w-4xl">
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle className="flex items-center gap-2 text-2xl">
                  <Repeat className="w-6 h-6 text-primary" />
                  Sticker Trading Hub
                </CardTitle>
                <p className="text-sm text-muted-foreground mt-1">
                  Trade stickers with other collectors
                </p>
              </div>
              <Button variant="ghost" onClick={onClose}>✕</Button>
            </div>
          </CardHeader>

          <CardContent className="space-y-6">
            {/* Stats Bar */}
            <div className="grid grid-cols-3 gap-4">
              <div className="bg-gradient-to-br from-purple-500/10 to-pink-500/10 p-4 rounded-xl text-center">
                <Users className="w-6 h-6 mx-auto mb-2 text-purple-600" />
                <p className="text-2xl font-bold">1,234</p>
                <p className="text-xs text-muted-foreground">Active Traders</p>
              </div>
              <div className="bg-gradient-to-br from-green-500/10 to-emerald-500/10 p-4 rounded-xl text-center">
                <TrendingUp className="w-6 h-6 mx-auto mb-2 text-green-600" />
                <p className="text-2xl font-bold">567</p>
                <p className="text-xs text-muted-foreground">Trades Today</p>
              </div>
              <div className="bg-gradient-to-br from-yellow-500/10 to-orange-500/10 p-4 rounded-xl text-center">
                <Star className="w-6 h-6 mx-auto mb-2 text-yellow-600" />
                <p className="text-2xl font-bold">4.8</p>
                <p className="text-xs text-muted-foreground">Avg Rating</p>
              </div>
            </div>

            {/* Search Bar */}
            <div className="space-y-2">
              <Input
                placeholder="Search for specific sticker trades..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="text-lg"
              />
              <div className="flex gap-2">
                <Button variant="outline" size="sm">All Offers</Button>
                <Button variant="outline" size="sm">Anime</Button>
                <Button variant="outline" size="sm">Rare</Button>
                <Button variant="outline" size="sm">Limited Edition</Button>
              </div>
            </div>

            {/* Trade Offers */}
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="font-bold text-lg">Available Trades</h3>
                <Button onClick={handleCreateTrade} className="gap-2">
                  <Repeat className="w-4 h-4" />
                  Create Trade Offer
                </Button>
              </div>

              {trades.map((trade) => (
                <Card key={trade.id} className="border-2 hover:border-primary/50 transition-all">
                  <CardContent className="p-4">
                    <div className="flex items-center gap-4">
                      {/* From User */}
                      <div className="flex items-center gap-2">
                        <img 
                          src={trade.fromUserAvatar} 
                          alt={trade.fromUser}
                          className="w-10 h-10 rounded-full"
                        />
                        <div>
                          <p className="font-semibold text-sm">{trade.fromUser}</p>
                          <p className="text-xs text-muted-foreground">{trade.createdAt}</p>
                        </div>
                      </div>

                      {/* Offer Sticker */}
                      <div className="flex-1 flex items-center gap-3 bg-muted/50 p-3 rounded-xl">
                        <img 
                          src={trade.offerSticker.image} 
                          alt={trade.offerSticker.name}
                          className="w-16 h-16 object-cover rounded-full border-2 border-primary"
                        />
                        <div>
                          <p className="text-xs text-muted-foreground">Offering:</p>
                          <p className="font-semibold">{trade.offerSticker.name}</p>
                        </div>
                      </div>

                      {/* Arrow */}
                      <div className="flex-shrink-0">
                        <Repeat className="w-8 h-8 text-primary" />
                      </div>

                      {/* Want Sticker */}
                      <div className="flex-1 flex items-center gap-3 bg-muted/50 p-3 rounded-xl">
                        <img 
                          src={trade.wantSticker.image} 
                          alt={trade.wantSticker.name}
                          className="w-16 h-16 object-cover rounded-full border-2 border-secondary"
                        />
                        <div>
                          <p className="text-xs text-muted-foreground">Wants:</p>
                          <p className="font-semibold">{trade.wantSticker.name}</p>
                        </div>
                      </div>

                      {/* Actions */}
                      <div className="flex gap-2">
                        {trade.status === 'pending' ? (
                          <>
                            <Button 
                              size="sm" 
                              onClick={() => handleAcceptTrade(trade.id)}
                              className="gap-1"
                            >
                              ✓ Accept
                            </Button>
                            <Button 
                              size="sm" 
                              variant="outline"
                              onClick={() => handleRejectTrade(trade.id)}
                            >
                              ✕
                            </Button>
                            <Button size="sm" variant="outline" className="gap-1">
                              <MessageCircle className="w-3 h-3" />
                            </Button>
                          </>
                        ) : (
                          <div className="px-3 py-2 bg-green-100 text-green-700 rounded-lg text-sm font-medium">
                            ✓ Accepted
                          </div>
                        )}
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>

            <div className="bg-blue-50 dark:bg-blue-950 p-4 rounded-xl border border-blue-200 dark:border-blue-800">
              <p className="text-sm text-blue-700 dark:text-blue-400">
                💡 <strong>How it works:</strong> Browse offers, accept trades you like, and grow your collection! 
                All trades are verified and secure. Premium members get priority trades and exclusive offers.
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
