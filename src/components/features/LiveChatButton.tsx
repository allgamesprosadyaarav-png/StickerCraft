import { useState } from 'react';
import { MessageCircle, X, Send, Instagram } from 'lucide-react';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';

export function LiveChatButton() {
  const [isOpen, setIsOpen] = useState(false);
  const [message, setMessage] = useState('');

  const handleSendMessage = () => {
    if (!message.trim()) return;

    // Open WhatsApp with the message
    const whatsappUrl = `https://wa.me/919354040524?text=${encodeURIComponent(message)}`;
    window.open(whatsappUrl, '_blank');
    setMessage('');
    setIsOpen(false);
  };

  const handleInstagramSupport = () => {
    window.open('https://instagram.com/stickercraft_official', '_blank');
  };

  return (
    <>
      {/* Chat Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="fixed bottom-6 right-6 z-50 bg-gradient-to-br from-green-500 to-green-600 text-white p-4 rounded-full shadow-2xl hover:scale-110 transition-transform duration-300"
      >
        {isOpen ? <X className="w-6 h-6" /> : <MessageCircle className="w-6 h-6" />}
      </button>

      {/* Chat Window */}
      {isOpen && (
        <div className="fixed bottom-24 right-6 z-50 w-96 max-w-[calc(100vw-3rem)] animate-in slide-in-from-bottom duration-300">
          <Card className="glass shadow-2xl">
            <CardHeader className="bg-gradient-to-r from-green-500 to-green-600 text-white rounded-t-xl">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-white/20 flex items-center justify-center">
                  <MessageCircle className="w-5 h-5" />
                </div>
                <div className="flex-1">
                  <CardTitle className="text-lg">Live Support</CardTitle>
                  <p className="text-xs text-white/90">We typically reply instantly</p>
                </div>
              </div>
            </CardHeader>
            <CardContent className="p-4 space-y-4">
              {/* Quick Actions */}
              <div className="space-y-2">
                <p className="text-sm font-medium">How can we help you?</p>
                <div className="grid gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    className="justify-start text-left h-auto py-2"
                    onClick={() => setMessage('Hi! I need help with my order')}
                  >
                    📦 Track my order
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    className="justify-start text-left h-auto py-2"
                    onClick={() => setMessage('I want to know about custom stickers')}
                  >
                    🎨 Custom sticker inquiry
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    className="justify-start text-left h-auto py-2"
                    onClick={() => setMessage('Tell me about bulk orders')}
                  >
                    💼 Bulk order discount
                  </Button>
                </div>
              </div>

              {/* Message Input */}
              <div className="space-y-2">
                <p className="text-xs text-muted-foreground">Or type your message:</p>
                <div className="flex gap-2">
                  <Input
                    placeholder="Type your message..."
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
                    className="flex-1"
                  />
                  <Button onClick={handleSendMessage} size="sm" className="gap-2">
                    <Send className="w-4 h-4" />
                  </Button>
                </div>
              </div>

              {/* Contact Options */}
              <div className="border-t pt-4 space-y-3">
                <p className="text-xs font-medium">Other ways to reach us:</p>
                <div className="grid gap-2">
                  <Button
                    onClick={() => window.open('https://wa.me/919354040524', '_blank')}
                    variant="outline"
                    size="sm"
                    className="justify-start gap-2"
                  >
                    <span className="text-green-600">📱</span>
                    WhatsApp: +91 93540 40524
                  </Button>
                  <Button
                    onClick={handleInstagramSupport}
                    variant="outline"
                    size="sm"
                    className="justify-start gap-2"
                  >
                    <Instagram className="w-4 h-4 text-pink-600" />
                    Instagram: @stickercraft_official
                  </Button>
                </div>
              </div>

              <div className="bg-blue-50 dark:bg-blue-950 p-3 rounded-lg">
                <p className="text-xs text-blue-700 dark:text-blue-400">
                  💬 Available 24/7 for your queries! We aim to respond within minutes.
                </p>
              </div>
            </CardContent>
          </Card>
        </div>
      )}
    </>
  );
}
