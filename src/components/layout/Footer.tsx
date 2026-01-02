import { Heart, Mail, Phone, MapPin, Instagram, Info } from 'lucide-react';
import { useState } from 'react';
import { AboutUs } from '../features/AboutUs';

export function Footer() {
  const [showAboutUs, setShowAboutUs] = useState(false);

  return (
    <>
      {showAboutUs && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 overflow-y-auto animate-in fade-in">
          <div className="min-h-screen flex items-center justify-center p-4">
            <div className="relative w-full max-w-6xl">
              <button
                onClick={() => setShowAboutUs(false)}
                className="absolute top-4 right-4 z-10 bg-background hover:bg-muted rounded-full p-2 transition-colors"
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
              <div className="bg-background rounded-3xl shadow-2xl overflow-hidden">
                <AboutUs />
              </div>
            </div>
          </div>
        </div>
      )}
      
      <footer className="relative z-10 bg-gradient-to-br from-primary/5 via-purple-500/5 to-pink-500/5 border-t border-border mt-20">
        <div className="container mx-auto px-4 py-12">
          <div className="grid md:grid-cols-4 gap-8">
            {/* Brand */}
            <div className="space-y-4">
              <div className="flex items-center gap-2">
                <img 
                  src="https://cdn-ai.onspace.ai/onspace/files/MStvs5typySWCzgRA3sfWS/pasted-image-1765116711106-6.jpeg" 
                  alt="StickerCraft" 
                  className="w-12 h-12 rounded-full object-cover"
                />
                <h3 className="text-xl font-bold">StickerCraft</h3>
              </div>
              <p className="text-sm text-muted-foreground">
                Your one-stop shop for custom stickers and keychains. Express yourself with our AI-powered designs!
              </p>
              <div className="flex items-center gap-2">
                <span className="text-sm text-muted-foreground">Made with</span>
                <Heart className="w-4 h-4 text-red-500 fill-red-500 animate-pulse" />
                <span className="text-sm text-muted-foreground">in India</span>
              </div>
            </div>

            {/* Quick Links */}
            <div>
              <h4 className="font-bold mb-4">Quick Links</h4>
              <ul className="space-y-2">
                <li>
                  <button 
                    onClick={() => setShowAboutUs(true)}
                    className="text-sm text-muted-foreground hover:text-primary transition-colors flex items-center gap-2"
                  >
                    <Info className="w-4 h-4" />
                    About Us
                  </button>
                </li>
                <li>
                  <a href="#faq" className="text-sm text-muted-foreground hover:text-primary transition-colors">
                    FAQ
                  </a>
                </li>
                <li>
                  <a href="#" className="text-sm text-muted-foreground hover:text-primary transition-colors">
                    Shipping & Delivery
                  </a>
                </li>
                <li>
                  <a href="#" className="text-sm text-muted-foreground hover:text-primary transition-colors">
                    Returns & Refunds
                  </a>
                </li>
                <li>
                  <a href="#" className="text-sm text-muted-foreground hover:text-primary transition-colors">
                    Privacy Policy
                  </a>
                </li>
                <li>
                  <a href="#" className="text-sm text-muted-foreground hover:text-primary transition-colors">
                    Terms & Conditions
                  </a>
                </li>
              </ul>
            </div>

            {/* Products */}
            <div>
              <h4 className="font-bold mb-4">Products</h4>
              <ul className="space-y-2">
                <li>
                  <a href="#" className="text-sm text-muted-foreground hover:text-primary transition-colors">
                    Anime Stickers
                  </a>
                </li>
                <li>
                  <a href="#" className="text-sm text-muted-foreground hover:text-primary transition-colors">
                    Minecraft Stickers
                  </a>
                </li>
                <li>
                  <a href="#" className="text-sm text-muted-foreground hover:text-primary transition-colors">
                    Custom Keychains
                  </a>
                </li>
                <li>
                  <a href="#" className="text-sm text-muted-foreground hover:text-primary transition-colors">
                    AI-Generated Stickers
                  </a>
                </li>
                <li>
                  <a href="#" className="text-sm text-muted-foreground hover:text-primary transition-colors">
                    Sticker Packs
                  </a>
                </li>
                <li>
                  <a href="#" className="text-sm text-muted-foreground hover:text-primary transition-colors">
                    Premium Collection
                  </a>
                </li>
              </ul>
            </div>

            {/* Contact */}
            <div>
              <h4 className="font-bold mb-4">Contact Us</h4>
              <ul className="space-y-3">
                <li className="flex items-start gap-2 text-sm text-muted-foreground">
                  <Mail className="w-4 h-4 mt-0.5 flex-shrink-0" />
                  <a href="mailto:support@stickercraft.com" className="hover:text-primary transition-colors">
                    support@stickercraft.com
                  </a>
                </li>
                <li className="flex items-start gap-2 text-sm text-muted-foreground">
                  <Phone className="w-4 h-4 mt-0.5 flex-shrink-0" />
                  <span>+91 XXXXX XXXXX</span>
                </li>
                <li className="flex items-start gap-2 text-sm text-muted-foreground">
                  <MapPin className="w-4 h-4 mt-0.5 flex-shrink-0" />
                  <span>India</span>
                </li>
                <li>
                  <a
                    href="https://instagram.com/stickercraft_official"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-2 bg-gradient-to-r from-purple-600 to-pink-600 text-white px-4 py-2 rounded-full text-sm font-semibold hover:scale-105 transition-transform"
                  >
                    <Instagram className="w-4 h-4" />
                    @stickercraft_official
                  </a>
                </li>
              </ul>
            </div>
          </div>

          <div className="mt-12 pt-8 border-t border-border text-center">
            <p className="text-sm text-muted-foreground">
              © {new Date().getFullYear()} StickerCraft. All rights reserved.
            </p>
            <p className="text-xs text-muted-foreground mt-2">
              Powered by AI • Made in India 🇮🇳
            </p>
          </div>
        </div>
      </footer>
    </>
  );
}
