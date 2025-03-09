
import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { ArrowLeft, DollarSign, User, Users, Plus, Minus, AlertCircle, CheckCircle } from 'lucide-react';
import Button from '@/components/Button';
import { toast } from "sonner";
import { useAuth } from '@/context/AuthContext';

interface Participant {
  id: string;
  name: string;
  amount: number | null;
}

interface CurrencyOption {
  code: string;
  symbol: string;
  name: string;
  rate: number; // Exchange rate to USDC
}

interface Event {
  id: string;
  title: string;
}

const currencies: CurrencyOption[] = [
  { code: 'USDC', symbol: '$', name: 'USDC', rate: 1 },
  { code: 'MYR', symbol: 'RM', name: 'Malaysian Ringgit', rate: 0.23 }, // Example rate: 1 MYR = 0.23 USDC
  { code: 'USD', symbol: '$', name: 'US Dollar', rate: 1 },
  { code: 'EUR', symbol: '€', name: 'Euro', rate: 1.08 },
  { code: 'GBP', symbol: '£', name: 'British Pound', rate: 1.27 },
];

// Mock events data - in a real app this would come from an API
const mockEvents: Event[] = [
  { id: '123', title: 'Weekend Trip' },
  { id: '456', title: 'Dinner Party' },
  { id: '789', title: 'Office Lunch' },
];

const AddPayment: React.FC = () => {
  const navigate = useNavigate();
  const { eventId } = useParams<{ eventId: string }>();
  const [paymentTitle, setPaymentTitle] = useState('');
  const [totalAmount, setTotalAmount] = useState<string>(''); // Changed to string for input control
  const [selectedCurrency, setSelectedCurrency] = useState<CurrencyOption>(currencies[1]); // Default to MYR
  const [usdcEquivalent, setUsdcEquivalent] = useState<number | null>(null);
  const [events, setEvents] = useState<Event[]>(mockEvents);
  const [selectedEvent, setSelectedEvent] = useState<string>(eventId || '');
  const [newEventName, setNewEventName] = useState<string>('');
  const [showNewEventInput, setShowNewEventInput] = useState<boolean>(false);
  
  const { user } = useAuth();
  
  const loggedInUser = { id: '1', name: user?.displayName || 'Alex' };
  
  const [payer, setPayer] = useState('');
  const [participants, setParticipants] = useState<Participant[]>([
    { id: '1', name: 'Alex', amount: null },
    { id: '2', name: 'Jamie', amount: null },
    { id: '3', name: 'Taylor', amount: null },
  ]);
  const [splitEqually, setSplitEqually] = useState(true);
  const [loading, setLoading] = useState(false);

  // Check if total equals sum of individual amounts for unequal splits
  const [splitAmountError, setSplitAmountError] = useState<boolean>(false);
  const [splitAmountDifference, setSplitAmountDifference] = useState<number>(0);
  
  useEffect(() => {
    setPayer(loggedInUser.name);
    
    // If eventId is passed, set the selected event
    if (eventId) {
      setSelectedEvent(eventId);
    }
  }, [loggedInUser.name, eventId]);
  
  // Handle total amount input as string but convert to number for calculations
  const handleAmountChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    
    // Allow empty string or valid numbers with up to one decimal point
    if (value === '' || /^\d*\.?\d*$/.test(value)) {
      setTotalAmount(value);
      
      const numericValue = value === '' ? 0 : parseFloat(value);
      updateUsdcEquivalent(numericValue);
      
      // Update split amounts if split equally is enabled
      if (splitEqually && numericValue > 0) {
        updateEqualSplits(numericValue);
      }
    }
  };
  
  const updateUsdcEquivalent = (amount: number) => {
    if (amount > 0) {
      const usdc = amount * selectedCurrency.rate;
      setUsdcEquivalent(usdc);
    } else {
      setUsdcEquivalent(null);
    }
  };
  
  const updateEqualSplits = (total: number) => {
    if (total > 0) {
      const equalAmount = total / participants.length;
      setParticipants(prevParticipants =>
        prevParticipants.map(p => ({ ...p, amount: equalAmount }))
      );
    }
  };
  
  const handleCurrencyChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const currencyCode = e.target.value;
    const currency = currencies.find(c => c.code === currencyCode) || currencies[0];
    setSelectedCurrency(currency);
    
    const numericValue = totalAmount === '' ? 0 : parseFloat(totalAmount);
    if (numericValue > 0) {
      const usdc = numericValue * currency.rate;
      setUsdcEquivalent(usdc);
      
      // Also update individual amounts if split equally
      if (splitEqually) {
        updateEqualSplits(numericValue);
      }
    }
  };
  
  const handleParticipantAmountChange = (id: string, amount: number | null) => {
    setParticipants(prevParticipants =>
      prevParticipants.map(p =>
        p.id === id ? { ...p, amount: amount } : p
      )
    );
    
    // Check total after a short delay to allow for user typing
    setTimeout(validateSplitAmounts, 100);
  };
  
  const toggleSplitEqually = () => {
    setSplitEqually(!splitEqually);
    
    if (!splitEqually) { // Going from unequal to equal
      const numericValue = totalAmount === '' ? 0 : parseFloat(totalAmount);
      if (numericValue > 0) {
        updateEqualSplits(numericValue);
      }
      // Reset error state
      setSplitAmountError(false);
      setSplitAmountDifference(0);
    } else { // Going from equal to unequal
      validateSplitAmounts();
    }
  };
  
  const validateSplitAmounts = () => {
    if (splitEqually || totalAmount === '') return;
    
    const numericTotalAmount = parseFloat(totalAmount);
    const totalUsdcAmount = numericTotalAmount * selectedCurrency.rate;
    const sumUsdcAmounts = participants.reduce((sum, p) => {
      const participantUsdcAmount = p.amount === null ? 0 : p.amount * selectedCurrency.rate;
      return sum + participantUsdcAmount;
    }, 0);
    
    const difference = Math.abs(totalUsdcAmount - sumUsdcAmounts);
    setSplitAmountDifference(difference);
    setSplitAmountError(difference > 0.01); // Allow a small rounding error
  };
  
  // Calculate total USDC sum of participants for unequal splits
  const getTotalParticipantsAmount = (): number => {
    return participants.reduce((sum, p) => {
      const participantUsdcAmount = p.amount === null ? 0 : p.amount * selectedCurrency.rate;
      return sum + participantUsdcAmount;
    }, 0);
  };
  
  const handleCreateNewEvent = () => {
    if (!newEventName.trim()) {
      toast.error("Please enter an event name");
      return;
    }
    
    // Create a new event
    const newEvent: Event = {
      id: `new-${Date.now()}`,
      title: newEventName.trim()
    };
    
    // Add the new event to the list
    setEvents([...events, newEvent]);
    
    // Select the new event
    setSelectedEvent(newEvent.id);
    
    // Reset the new event input
    setNewEventName('');
    setShowNewEventInput(false);
    
    toast.success(`New event "${newEvent.title}" created`);
  };
  
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!paymentTitle.trim()) {
      toast.error("Please enter a payment title");
      return;
    }
    if (totalAmount === '' || parseFloat(totalAmount) <= 0) {
      toast.error("Please enter a valid total amount");
      return;
    }
    if (!payer.trim()) {
      toast.error("Please select who paid");
      return;
    }
    if (!selectedEvent) {
      toast.error("Please select or create an event");
      return;
    }
    
    if (!splitEqually) {
      validateSplitAmounts();
      if (splitAmountError) {
        toast.error("The sum of individual amounts must equal the total amount");
        return;
      }
    }
    
    setLoading(true);
    
    setTimeout(() => {
      toast.success("Payment added successfully!");
      navigate(`/event/${selectedEvent}`);
      setLoading(false);
    }, 1000);
  };
  
  // Calculate the numeric total amount 
  const numericTotalAmount = totalAmount === '' ? 0 : parseFloat(totalAmount);
  
  // Calculate USDC amounts for each participant
  const getParticipantUsdcAmount = (participant: Participant): number => {
    if (participant.amount === null) return 0;
    return participant.amount * selectedCurrency.rate;
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
          
          {/* Event Selection field */}
          <div>
            <label htmlFor="event-select" className="block text-sm font-medium text-gray-700 mb-1">
              Event
            </label>
            
            {!showNewEventInput ? (
              <div className="flex gap-2">
                <select
                  id="event-select"
                  value={selectedEvent}
                  onChange={(e) => setSelectedEvent(e.target.value)}
                  className="flex-grow px-4 py-2 border border-gray-300 rounded-md focus:ring-nsplit-500 focus:border-nsplit-500 outline-none transition-colors"
                >
                  <option value="">Select an event</option>
                  {events.map(event => (
                    <option key={event.id} value={event.id}>
                      {event.title}
                    </option>
                  ))}
                </select>
                <Button
                  type="button"
                  variant="outline"
                  size="md"
                  onClick={() => setShowNewEventInput(true)}
                >
                  <Plus size={16} />
                  New
                </Button>
              </div>
            ) : (
              <div className="flex gap-2">
                <input
                  type="text"
                  value={newEventName}
                  onChange={(e) => setNewEventName(e.target.value)}
                  placeholder="Enter new event name"
                  className="flex-grow px-4 py-2 border border-gray-300 rounded-md focus:ring-nsplit-500 focus:border-nsplit-500 outline-none transition-colors"
                  autoFocus
                />
                <Button
                  type="button"
                  variant="outline"
                  size="md"
                  onClick={handleCreateNewEvent}
                >
                  Create
                </Button>
                <Button
                  type="button"
                  variant="ghost"
                  size="md"
                  onClick={() => setShowNewEventInput(false)}
                >
                  Cancel
                </Button>
              </div>
            )}
          </div>
          
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-grow">
              <label htmlFor="total-amount" className="block text-sm font-medium text-gray-700 mb-1">
                Total Amount
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <span className="text-gray-500 sm:text-sm mr-2">{selectedCurrency.symbol}</span>
                </div>
                <input
                  id="total-amount"
                  type="text"
                  value={totalAmount}
                  onChange={handleAmountChange}
                  placeholder="0.00"
                  className="w-full px-4 py-2 pl-10 border border-gray-300 rounded-md focus:ring-nsplit-500 focus:border-nsplit-500 outline-none transition-colors"
                />
              </div>
              
              {/* Always show conversion box with improved styling */}
              <div className="mt-2 p-3 rounded-md bg-gradient-to-r from-nsplit-50 to-blue-50 border border-nsplit-100 shadow-sm">
                <div className="flex flex-col">
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-gray-500">USDC Equivalent:</span>
                    <span className="text-lg font-semibold text-nsplit-800">
                      ${numericTotalAmount > 0 
                        ? (numericTotalAmount * selectedCurrency.rate).toFixed(2) 
                        : '0.00'}
                    </span>
                  </div>
                  <div className="text-xs text-nsplit-600 mt-1 flex justify-end items-center">
                    <span>Rate: 1 {selectedCurrency.code} = {selectedCurrency.rate} USDC</span>
                    <span className="ml-1 text-nsplit-400">(via Google Finance)</span>
                  </div>
                </div>
              </div>
            </div>
            
            <div className="md:w-1/3">
              <label htmlFor="currency" className="block text-sm font-medium text-gray-700 mb-1">
                Currency
              </label>
              <select
                id="currency"
                value={selectedCurrency.code}
                onChange={handleCurrencyChange}
                className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-nsplit-500 focus:border-nsplit-500 outline-none transition-colors"
              >
                {currencies.map(currency => (
                  <option key={currency.code} value={currency.code}>
                    {currency.code} - {currency.name}
                  </option>
                ))}
              </select>
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
                  {participant.id === loggedInUser.id && (
                    <span className="ml-2 text-xs font-medium text-nsplit-600">(You)</span>
                  )}
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
            
            {/* Split amount summary feedback */}
            {!splitEqually && totalAmount !== '' && (
              <div className={`mb-3 p-2 rounded-md flex items-center ${
                splitAmountError ? 'bg-red-50 text-red-700' : 'bg-green-50 text-green-700'
              }`}>
                {splitAmountError ? (
                  <>
                    <AlertCircle size={16} className="mr-1" />
                    <div className="text-sm">
                      <span className="font-medium">Amounts don't match: </span>
                      <span>Total: ${(numericTotalAmount * selectedCurrency.rate).toFixed(2)}, </span>
                      <span>Split sum: ${getTotalParticipantsAmount().toFixed(2)}, </span>
                      <span>Difference: ${splitAmountDifference.toFixed(2)}</span>
                    </div>
                  </>
                ) : (
                  <>
                    <CheckCircle size={16} className="mr-1" />
                    <span className="text-sm font-medium">Amounts match</span>
                  </>
                )}
              </div>
            )}
            
            <div className="space-y-3">
              {participants.map(participant => (
                <div key={participant.id} className="flex items-center">
                  <label className="w-24 text-sm font-medium text-gray-700">
                    {participant.name}
                    {participant.id === loggedInUser.id && (
                      <span className="ml-1 text-xs text-nsplit-600">(You)</span>
                    )}
                  </label>
                  <div className="relative flex-grow">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <DollarSign size={14} className="text-nsplit-600" />
                    </div>
                    <input
                      type="text"
                      value={participant.amount === null ? '' : getParticipantUsdcAmount(participant).toFixed(2)}
                      onChange={(e) => {
                        const value = e.target.value;
                        if (/^\d*\.?\d*$/.test(value)) {
                          // Convert back from USDC to the selected currency for internal storage
                          const usdcAmount = value === '' ? null : parseFloat(value);
                          const originalAmount = usdcAmount === null ? null : usdcAmount / selectedCurrency.rate;
                          handleParticipantAmountChange(participant.id, originalAmount);
                        }
                      }}
                      placeholder="0.00"
                      disabled={splitEqually}
                      className="w-full px-4 py-2 pl-10 border border-gray-300 rounded-md focus:ring-nsplit-500 focus:border-nsplit-500 outline-none transition-colors disabled:bg-gray-100 disabled:cursor-not-allowed"
                    />
                    
                    {/* Display USDC label since we're already showing USDC values */}
                    <div className="absolute right-3 top-1/2 transform -translate-y-1/2 bg-nsplit-50 px-2 py-0.5 rounded text-xs font-medium text-nsplit-700 border border-nsplit-100">
                      USDC
                    </div>
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
