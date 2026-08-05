import React, { useEffect } from 'react';
import { AppProvider, useApp } from './context/AppContext';
import { initNativeApp } from './services/nativeService';
import { Navbar } from './components/Navbar';
import { BottomNav } from './components/BottomNav';
import { HomeFeed } from './components/HomeFeed';
import { ExploreView } from './components/ExploreView';
import { SellerStudioView } from './components/SellerStudioView';
import { WishlistView } from './components/WishlistView';
import { UserProfileView } from './components/UserProfileView';
import { AdminPanel } from './components/AdminPanel';
import { ChatMessengerView } from './components/ChatMessengerView';
import { OrdersView } from './components/OrdersView';
import { ProductDetailModal } from './components/ProductDetailModal';
import { StoryViewerModal } from './components/StoryViewerModal';
import { RentalCheckoutModal } from './components/RentalCheckoutModal';
import { BuyCheckoutModal } from './components/BuyCheckoutModal';
import { UploadListingModal } from './components/UploadListingModal';
import { FiltersModal } from './components/FiltersModal';
import { NotificationsModal } from './components/NotificationsModal';
import { CallSellerModal } from './components/CallSellerModal';
import { AuthModal } from './components/AuthModal';
import { ToastContainer } from './components/ToastContainer';
import { Footer } from './components/Footer';

const AppContent: React.FC = () => {
  const { activeTab } = useApp();

  useEffect(() => {
    initNativeApp();
  }, []);

  return (
    <div className="min-h-screen bg-[#050505] text-white flex flex-col selection:bg-[#D4AF37] selection:text-black">
      {/* Top Luxury Navigation */}
      <Navbar />

      {/* Main Content Area */}
      <main className="flex-1">
        {activeTab === 'home' && <HomeFeed />}
        {activeTab === 'explore' && <ExploreView />}
        {activeTab === 'sell' && <SellerStudioView />}
        {activeTab === 'wishlist' && <WishlistView />}
        {activeTab === 'profile' && <UserProfileView />}
        {activeTab === 'admin' && <AdminPanel />}
        {activeTab === 'chat' && <ChatMessengerView />}
        {activeTab === 'orders' && <OrdersView />}
      </main>

      {/* Footer */}
      <Footer />

      {/* Mobile-first Bottom Navigation Bar */}
      <BottomNav />

      {/* All Application Modals */}
      <ProductDetailModal />
      <StoryViewerModal />
      <RentalCheckoutModal />
      <BuyCheckoutModal />
      <UploadListingModal />
      <FiltersModal />
      <NotificationsModal />
      <CallSellerModal />
      <AuthModal />

      {/* Luxury Toast Notification Stack */}
      <ToastContainer />
    </div>
  );
};

export default function App() {
  return (
    <AppProvider>
      <AppContent />
    </AppProvider>
  );
}
