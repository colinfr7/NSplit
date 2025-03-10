
import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { Toaster } from 'sonner';
import { AuthProvider } from './context/AuthContext';
import Header from './components/Header';
import Index from './pages/Index';
import SignUp from './pages/SignUp';
import SignIn from './pages/SignIn';
import Dashboard from './pages/Dashboard';
import CreateEvent from './pages/CreateEvent';
import EventDetail from './pages/EventDetail';
import AddPayment from './pages/AddPayment';
import CryptoPayment from './pages/CryptoPayment';
import Settings from './pages/Settings';
import NotFound from './pages/NotFound';
import EventQR from './pages/EventQR';
import PaymentQR from './pages/PaymentQR';

const queryClient = new QueryClient();

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <BrowserRouter>
          <div className="relative flex min-h-screen flex-col">
            <Header />
            <main className="flex-1">
              <Routes>
                <Route path="/" element={<Index />} />
                <Route path="/sign-up" element={<SignUp />} />
                <Route path="/sign-in" element={<SignIn />} />
                <Route path="/dashboard" element={<Dashboard />} />
                <Route path="/create-event" element={<CreateEvent />} />
                <Route path="/event/:eventId" element={<EventDetail />} />
                <Route path="/event/:eventId/add-payment" element={<AddPayment />} />
                <Route path="/add-payment" element={<AddPayment />} />
                <Route path="/crypto-payment" element={<CryptoPayment />} />
                <Route path="/settings" element={<Settings />} />
                <Route path="/event-qr/:eventId" element={<EventQR />} />
                <Route path="/payment-qr/:paymentId" element={<PaymentQR />} />
                <Route path="*" element={<NotFound />} />
              </Routes>
            </main>
            <Toaster />
          </div>
        </BrowserRouter>
      </AuthProvider>
    </QueryClientProvider>
  );
}

export default App;
