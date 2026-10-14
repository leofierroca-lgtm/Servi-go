import React from 'react';
import { Outlet } from 'react-router-dom';
import Header from '../components/Header';
import CartDrawer from '../components/CartDrawer';
import GlobalChatBubble from '../components/GlobalChatBubble';
import useAuthStore from '../store/useAuthStore';

export default function MainLayout() {
  const role = useAuthStore(state => state.role);
  const isDelivery = role === 'delivery';
  const isAdmin = role === 'admin';

  return (
    <div className="min-h-screen bg-[#0a0a0a]">
      <Header />
      {!isDelivery && !isAdmin && <CartDrawer />}
      {!isDelivery && !isAdmin && <GlobalChatBubble />}
      
      <main className="max-w-screen-2xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <Outlet />
      </main>
    </div>
  );
}
