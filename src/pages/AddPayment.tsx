
import React, { useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { ArrowLeft, DollarSign, User, Users, Plus, Minus } from 'lucide-react';
import Button from '@/components/Button';
import { toast } from "sonner";

interface Participant {
  id: string;
  name: string;
  amount: number | null;
}

const AddPayment: React.FC = () => {
  const navigate = useNavigate();
  const { eventId } = useParams<{ eventId: string }>();
  const [paymentTitle, setPaymentTitle] = useState('');
  const [totalAmount, setTotalAmount] = useState<number | null>(null);
  const [payer, setPayer] = useState('');
  const [participants, setParticipants] = useState<Participant[]>([
    { id: '1', name: 'Alex', amount: null },
    { id: '2', name: 'Jamie', amount: null },
    { id: '3', name: 'Taylor', amount: null },
  ]);
  const [splitEqually, setSplitEqually] = useState(true);
  const [loading, setLoading] = useState(false);
  
  const handleAmountChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    // Allow only numbers and one decimal point
    if (/^\d*\.?\d*$/.test(value)) {
      setTotalAmount(value === '' ? null : parseFloat(value));
    }
  };
  
  const handleParticipantAmountChange = (id: string, amount: number | null) => {
    setParticipants(prevParticipants =>
      prevParticipants.map(p =>
        p.id === id ? { ...p, amount: amount } : p
      )
    );
  };
  
  const toggleSplitEqually = () => {
    setSplitEqually(!splitEqually);
    
    // If toggling to split equally, clear individual amounts
    if (!splitEqually && totalAmount !== null) {
      const equalAmount = totalAmount / participants.length;
      setParticipants(prevParticipants =>
        prevParticipants.map(p => ({ ...p, amount: equalAmount }))
      );
    }
  };
  
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validate
    if (!paymentTitle.trim()) {
      toast.error("Please enter a payment title");
      return;
    }
    if (totalAmount === null || totalAmount <= 0) {
      toast.error("Please enter a valid total amount");
      return;
    }
    if (!payer.trim()) {
      toast.error("Please select who paid");
      return;
    }
    
    if (!splitEqually) {
      const totalIndividualAmount = participants.reduce((sum, p) => sum + (p.amount || 0), 0);
      if (totalIndividualAmount !== totalAmount) {
        toast.error("The sum of individual amounts must equal the total amount");
        return;
      }
    }
    
    setLoading(true);
    
    // Mock API call
    setTimeout(() => {
      toast.success("Payment added successfully!");
      navigate(`/event/${eventId}`);
      setLoading(false);
    }, 1000);
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
        
        <h1 className="text-2xl md:text-3xl font-bold mb-6">Add New Payment</h1>
        
        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label htmlFor="payment-title" className="block text-sm font-medium text-gray-700 mb-1">
              Payment Title
            </label>
            <input
              id="payment-title"
              type="text"
              value={paymentTitle}
              onChange={(e) => setPaymentTitle(e.target.value)}
              placeholder="Dinner, Taxi, Hotel, etc."
              className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-nsplit-500 focus:border-nsplit-500 outline-none transition-colors"
            />
          </div>
          
          <div>
            <label htmlFor="total-amount" className="block text-sm font-medium text-gray-700 mb-1">
              Total Amount
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <DollarSign size={16} className="text-gray-500" />
              </div>
              <input
                id="total-amount"
                type="text"
                value={totalAmount === null ? '' : totalAmount.toFixed(2)}
                onChange={handleAmountChange}
                placeholder="0.00"
                className="w-full px-4 py-2 pl-8 border border-gray-300 rounded-md focus:ring-nsplit-500 focus:border-nsplit-500 outline-none transition-colors"
              />
            </div>
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Paid By
            </label>
            <div className="space-y-3">
              {participants.map(participant => (
                <label key={participant.id} className="flex items-center">
                  <input
                    type="radio"
                    name="payer"
                    value={participant.name}
                    checked={payer === participant.name}
                    onChange={() => setPayer(participant.name)}
                    className="mr-2 focus:ring-nsplit-500 focus:border-nsplit-500"
                  />
                  {participant.name}
                </label>
              ))}
            </div>
          </div>
          
          <div>
            <div className="flex items-center justify-between mb-3">
              <label className="block text-sm font-medium text-gray-700">
                Split Between
              </label>
              <button
                type="button"
                onClick={toggleSplitEqually}
                className="text-sm text-nsplit-600 hover:text-nsplit-700"
              >
                {splitEqually ? 'Split unequally' : 'Split equally'}
              </button>
            </div>
            
            <div className="space-y-3">
              {participants.map(participant => (
                <div key={participant.id} className="flex items-center">
                  <label className="w-24 text-sm font-medium text-gray-700">
                    {participant.name}
                  </label>
                  <div className="relative flex-grow">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <DollarSign size={16} className="text-gray-500" />
                    </div>
                    <input
                      type="text"
                      value={participant.amount === null ? '' : participant.amount.toFixed(2)}
                      onChange={(e) => {
                        const value = e.target.value;
                        if (/^\d*\.?\d*$/.test(value)) {
                          const amount = value === '' ? null : parseFloat(value);
                          handleParticipantAmountChange(participant.id, amount);
                        }
                      }}
                      placeholder="0.00"
                      disabled={splitEqually}
                      className="w-full px-4 py-2 pl-8 border border-gray-300 rounded-md focus:ring-nsplit-500 focus:border-nsplit-500 outline-none transition-colors disabled:bg-gray-100 disabled:cursor-not-allowed"
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>
          
          <div className="pt-4">
            <Button type="submit" fullWidth isLoading={loading}>
              Add Payment
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddPayment;
