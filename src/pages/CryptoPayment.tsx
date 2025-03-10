
import React, { useState } from 'react';
import { useNavigate, useParams, useLocation } from 'react-router-dom';
import { CreditCard, ArrowRight, Check, Copy } from 'lucide-react';
import Button from '@/components/Button';
import { useToast } from '@/hooks/use-toast';

const CryptoPayment: React.FC = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const { id } = useParams();
  const location = useLocation();
  const paymentDetails = location.state?.paymentDetails;
  
  const [paymentState, setPaymentState] = useState<'pending' | 'processing' | 'completed'>('pending');
  
  // Dummy wallet address for demo purposes
  const walletAddress = "0x742d35Cc6634C0532925a3b844Bc454e4438f44e";
  
  if (!paymentDetails) {
    return (
      <div className="min-h-screen pt-20 pb-12 px-4">
        <div className="max-w-md mx-auto text-center">
          <h1 className="text-2xl font-bold mb-4">Payment Error</h1>
          <p className="text-gray-600 mb-6">Payment details not found. Please try again.</p>
          <Button onClick={() => navigate('/dashboard')}>
            Return to Dashboard
          </Button>
        </div>
      </div>
    );
  }
  
  const handleCopyAddress = () => {
    navigator.clipboard.writeText(walletAddress);
    toast({
      title: "Address Copied",
      description: "Wallet address copied to clipboard",
    });
  };
  
  const handleSendToWallet = () => {
    setPaymentState('processing');
    
    // Simulate processing time
    setTimeout(() => {
      setPaymentState('completed');
      
      // Update user's payment data in a real app
      // For now, just simulate this with a toast
      toast({
        title: "Payment Completed",
        description: `Payment of $${paymentDetails.amount.toFixed(2)} to ${paymentDetails.to} has been processed`,
      });
    }, 2000);
  };
  
  const handleFinish = () => {
    navigate('/dashboard');
  };
  
  return (
    <div className="min-h-screen pt-20 pb-12 px-4">
      <div className="max-w-md mx-auto">
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
          <h1 className="text-2xl font-bold mb-6 text-center">Crypto Payment</h1>
          
          {paymentState === 'pending' && (
            <>
              <div className="bg-blue-50 rounded-lg p-4 mb-6 border border-blue-100">
                <h2 className="font-semibold mb-2">Payment Details</h2>
                <div className="space-y-2">
                  <p className="text-sm"><span className="text-gray-500">To:</span> {paymentDetails.to}</p>
                  <p className="text-sm"><span className="text-gray-500">Amount:</span> ${paymentDetails.amount.toFixed(2)}</p>
                  {paymentDetails.event && (
                    <p className="text-sm"><span className="text-gray-500">Event:</span> {paymentDetails.event}</p>
                  )}
                </div>
              </div>
              
              <div className="mb-6">
                <h2 className="font-semibold mb-3">Wallet Address</h2>
                <div className="flex items-center border border-gray-200 rounded-lg p-3 bg-gray-50">
                  <p className="text-sm font-mono flex-1 truncate">{walletAddress}</p>
                  <button 
                    onClick={handleCopyAddress}
                    className="ml-2 p-2 text-gray-600 hover:text-gray-900 rounded-md hover:bg-gray-200"
                  >
                    <Copy size={16} />
                  </button>
                </div>
              </div>
              
              <div className="flex flex-col space-y-3">
                <Button 
                  fullWidth 
                  onClick={handleSendToWallet}
                >
                  <CreditCard size={16} className="mr-2" />
                  Send to Wallet
                </Button>
                <Button 
                  variant="outline" 
                  fullWidth 
                  onClick={() => navigate('/dashboard')}
                >
                  Cancel
                </Button>
              </div>
            </>
          )}
          
          {paymentState === 'processing' && (
            <div className="text-center py-8">
              <div className="w-16 h-16 border-4 border-t-nsplit-600 border-gray-200 rounded-full animate-spin mx-auto mb-4"></div>
              <h2 className="text-xl font-semibold mb-2">Processing Payment</h2>
              <p className="text-gray-600">Please wait while your payment is being processed...</p>
            </div>
          )}
          
          {paymentState === 'completed' && (
            <div className="text-center py-8">
              <div className="w-16 h-16 bg-green-100 text-green-600 rounded-full flex items-center justify-center mx-auto mb-4">
                <Check size={32} />
              </div>
              <h2 className="text-xl font-semibold mb-2">Payment Complete!</h2>
              <p className="text-gray-600 mb-6">Your payment of ${paymentDetails.amount.toFixed(2)} to {paymentDetails.to} was successful.</p>
              <Button 
                fullWidth 
                onClick={handleFinish}
              >
                Return to Dashboard
              </Button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default CryptoPayment;
