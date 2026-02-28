import { useState, useEffect } from 'react';
import { useAuthStore } from './stores/authStore';
import { AuthPage } from './pages/AuthPage';
import { StorePage } from './pages/StorePage';
import { CartPage } from './pages/CartPage';
import { OrdersPage } from './pages/OrdersPage';
import { CustomDesignPage } from './pages/CustomDesignPage';
import { AdminDashboard } from './pages/AdminDashboard';
import { Header } from './components/layout/Header';
import { FloatingStickers } from './components/layout/FloatingStickers';

import { Toaster } from './components/ui/toaster';
import { FloatingCartWidget } from './components/features/FloatingCartWidget';
import { Confetti } from './components/features/Confetti';
import { AngilaAIButton } from './components/features/AngilaAIButton';
import { VerifiedReviews } from './components/features/VerifiedReviews';
import { DailyLuckyDraw } from './components/features/DailyLuckyDraw';
import { LiveChatButton } from './components/features/LiveChatButton';
import { Footer } from './components/layout/Footer';
import { useCartStore } from './stores/cartStore';
import { useKonami } from './hooks/use-konami';
import { toast } from './hooks/use-toast';

type Page = 'store' | 'cart' | 'orders' | 'custom' | 'admin';

function App() {
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated);
  const [currentPage, setCurrentPage] = useState<Page>('store');
  const [showConfetti, setShowConfetti] = useState(false);
  const items = useCartStore((state) => state.items);
  const [easterEggTriggered, setEasterEggTriggered] = useState(false);

  // Konami Code Easter Egg
  useKonami(() => {
    if (!easterEggTriggered) {
      setEasterEggTriggered(true);
      setShowConfetti(true);
      toast({
        title: '🎮 Konami Code Activated!',
        description: 'You unlocked a secret! Enjoy 30% OFF your next purchase! 🎉',
      });
      localStorage.setItem('konamiDiscount', '30');
      setTimeout(() => setShowConfetti(false), 5000);
    }
  });
  
  // Trigger confetti when items are added to cart
  const previousItemCount = useState(items.length)[0];
  if (items.length > previousItemCount) {
    setShowConfetti(true);
    setTimeout(() => setShowConfetti(false), 100);
  }



  if (!isAuthenticated) {
    return (
      <>
        <FloatingStickers />
        <AuthPage />
      </>
    );
  }

  return (
    <div className="min-h-screen relative flex flex-col">
      <FloatingStickers />
      <Confetti trigger={showConfetti} />
      <FloatingCartWidget onNavigateToCart={() => setCurrentPage('cart')} />
      <AngilaAIButton />
      <VerifiedReviews />
      <DailyLuckyDraw />
      <LiveChatButton />
      
      <div className="relative z-10 flex-1">
        <Header onNavigate={setCurrentPage} currentPage={currentPage} />
        
        <main>
          {currentPage === 'store' && <StorePage onNavigate={setCurrentPage} />}
          {currentPage === 'cart' && <CartPage />}
          {currentPage === 'orders' && <OrdersPage />}
          {currentPage === 'custom' && <CustomDesignPage />}
          {currentPage === 'admin' && <AdminDashboard />}
        </main>
      </div>

      <Footer />
      <Toaster />
    </div>
  );
}

export default App;
