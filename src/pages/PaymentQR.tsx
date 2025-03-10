
import React from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, QrCode, Check, Share2, Copy } from 'lucide-react';
import Button from '@/components/Button';
import { toast } from 'sonner';

const PaymentQR: React.FC = () => {
  const { paymentId } = useParams<{ paymentId: string }>();
  const navigate = useNavigate();
  
  const handleCopyPaymentLink = () => {
    const url = `${window.location.origin}/join-payment/${paymentId}`;
    navigator.clipboard.writeText(url)
      .then(() => toast.success("Payment link copied to clipboard!"))
      .catch(() => toast.error("Failed to copy payment link"));
  };
  
  const handleMarkAsPaid = () => {
    toast.success("Payment marked as complete!");
    navigate(`/dashboard`);
  };
  
  return (
    <div className="min-h-screen pt-20 pb-12 px-4">
      <div className="max-w-lg mx-auto">
        <button 
          onClick={() => navigate(-1)} 
          className="mb-6 flex items-center text-nsplit-600 hover:text-nsplit-700"
        >
          <ArrowLeft size={16} className="mr-1" />
          <span>Back</span>
        </button>
        
        <h1 className="text-2xl md:text-3xl font-bold mb-2">Payment QR Code</h1>
        <p className="text-gray-600 mb-6">Share this QR code to let others join this payment</p>
        
        <div className="bg-white border border-gray-200 rounded-lg p-6 shadow-sm mb-6 flex flex-col items-center">
          <div className="bg-nsplit-50 border border-nsplit-100 p-4 rounded-lg w-64 h-64 flex items-center justify-center mb-4">
            <QrCode size={200} className="text-nsplit-800" strokeWidth={1} />
          </div>
          
          <h2 className="text-lg font-semibold mb-1">Scan to join payment</h2>
          <p className="text-sm text-gray-500 text-center mb-2">
            Amount: <span className="font-medium">$45.00</span>
          </p>
          <p className="text-sm text-gray-500 text-center mb-4">
            For: <span className="font-medium">Dinner at Restaurant</span>
          </p>
          
          <Button 
            onClick={handleCopyPaymentLink}
            variant="outline"
            fullWidth
          >
            <Share2 size={16} />
            Copy Payment Link
          </Button>
        </div>
        
        <div className="space-y-4">
          <Button 
            onClick={handleMarkAsPaid}
            fullWidth
          >
            <Check size={16} />
            Mark as Paid
          </Button>
          
          <Button 
            onClick={() => navigate(`/event/${paymentId?.split('-')[0] || '123'}`)}
            variant="outline"
            fullWidth
          >
            Return to Event
          </Button>
        </div>
      </div>
    </div>
  );
};

export default PaymentQR;
