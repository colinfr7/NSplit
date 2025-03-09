import React, { useState, useEffect, useRef } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { ArrowLeft, DollarSign, User, Users, Plus, Minus, AlertCircle, CheckCircle, Search, Globe, Lock, X, QrCode, Edit } from 'lucide-react';
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
  isPublic?: boolean;
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
  { id: '123', title: 'Weekend Trip', isPublic: true },
  { id: '456', title: 'Dinner Party', isPublic: true },
  { id: '789', title: 'Office Lunch', isPublic: false },
  { id: '101', title: 'Birthday Celebration', isPublic: true },
  { id: '102', title: 'Game Night', isPublic: true },
  { id: '103', title: 'Movie Night', isPublic: false },
  { id: '104', title: 'Beach Day', isPublic: true },
];

const AddPayment: React.FC = () => {
  const navigate = useNavigate();
  const { eventId } = useParams<{ eventId: string }>();
  const [paymentTitle, setPaymentTitle] = useState('');
  const [totalAmount, setTotalAmount] = useState<string>(''); 
  const [selectedCurrency, setSelectedCurrency] = useState<CurrencyOption>(currencies[1]); // Default to MYR
  const [usdcEquivalent, setUsdcEquivalent] = useState<number | null>(null);
  const [events, setEvents] = useState<Event[]>(mockEvents);
  const [selectedEvent, setSelectedEvent] = useState<string>(eventId || '');
  
  // Event search and filtering
  const [eventSearchTerm, setEventSearchTerm] = useState<string>('');
  const [showEventDropdown, setShowEventDropdown] = useState<boolean>(false);
  const [filteredEvents, setFilteredEvents] = useState<Event[]>([]);
  const eventSearchRef = useRef<HTMLDivElement>(null);
  
  // Event editing
  const [isEditingEvent, setIsEditingEvent] = useState<boolean>(false);
  const [editedEventTitle, setEditedEventTitle] = useState<string>('');
  
  // QR code modal
  const [showQRModal, setShowQRModal] = useState<boolean>(false);
  
  const { user } = useAuth();
  
  const loggedInUser = { id: '1', name: user?.displayName || 'Alex' };
  
  const [payer, setPayer] = useState('');
  const [participants, setParticipants] = useState<Participant[]>([
    { id: '1', name: 'Alex', amount: null },
    { id: '2', name: 'Jamie', amount: null },
    { id: '3', name: 'Taylor', amount: null },
  ]);
  const [newParticipantName, setNewParticipantName] = useState<string>('');
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
      // Find the event title for the ID
      const event = events.find(e => e.id === eventId);
      if (event) {
        setEventSearchTerm(event.title);
      }
    }
  }, [loggedInUser.name, eventId, events]);
  
  // Filter events based on search term
  useEffect(() => {
    if (eventSearchTerm) {
      const filtered = events.filter(event => 
        event.title.toLowerCase().includes(eventSearchTerm.toLowerCase())
      );
      setFilteredEvents(filtered);
    } else {
      // When empty, show only public events as suggestions
      setFilteredEvents(events.filter(event => event.isPublic));
    }
  }, [eventSearchTerm, events]);
  
  // Close dropdown when clicking outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (eventSearchRef.current && !eventSearchRef.current.contains(event.target as Node)) {
        setShowEventDropdown(false);
      }
    }
    
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

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
    if (total > 0 && participants.length > 0) {
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
      return sum + (p.amount === null ? 0 : p.amount * selectedCurrency.rate);
    }, 0);
    
    const difference = Math.abs(totalUsdcAmount - sumUsdcAmounts);
    setSplitAmountDifference(difference);
    setSplitAmountError(difference > 0.01); // Allow a small rounding error
  };
  
  // Calculate total USDC sum of participants for unequal splits
  const getTotalParticipantsAmount = (): number => {
    return participants.reduce((sum, p) => {
      return sum + (p.amount === null ? 0 : p.amount * selectedCurrency.rate);
    }, 0);
  };
  
  const handleCreateNewEvent = (title: string) => {
    if (!title.trim()) {
      toast.error("Please enter an event name");
      return;
    }
    
    // Create a new event
    const newEvent: Event = {
      id: `new-${Date.now()}`,
      title: title.trim(),
      isPublic: true // Default to public
    };
    
    // Add the new event to the list
    setEvents([...events, newEvent]);
    
    // Select the new event
    setSelectedEvent(newEvent.id);
    setEventSearchTerm(newEvent.title);
    setShowEventDropdown(false);
    
    toast.success(`New event "${newEvent.title}" created`);
  };
  
  const handleSelectEvent = (event: Event) => {
    setSelectedEvent(event.id);
    setEventSearchTerm(event.title);
    setShowEventDropdown(false);
  };
  
  const handleEventSearchFocus = () => {
    setShowEventDropdown(true);
  };
  
  const handleEventSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setEventSearchTerm(e.target.value);
    setShowEventDropdown(true);
    
    // Clear selected event if search field is emptied
    if (e.target.value === '') {
      setSelectedEvent('');
    }
  };
  
  const startEditingEvent = () => {
    if (!selectedEvent) return;
    
    const event = events.find(e => e.id === selectedEvent);
    if (event) {
      setEditedEventTitle(event.title);
      setIsEditingEvent(true);
    }
  };
  
  const saveEditedEvent = () => {
    if (!editedEventTitle.trim()) {
      toast.error("Event name cannot be empty");
      return;
    }
    
    setEvents(prevEvents => 
      prevEvents.map(event => 
        event.id === selectedEvent 
          ? { ...event, title: editedEventTitle.trim() } 
          : event
      )
    );
    
    setEventSearchTerm(editedEventTitle.trim());
    setIsEditingEvent(false);
    toast.success("Event name updated");
  };
  
  const cancelEditingEvent = () => {
    setIsEditingEvent(false);
  };
  
  const addParticipant = () => {
    if (!newParticipantName.trim()) {
      toast.error("Please enter a name");
      return;
    }
    
    const newId = `p-${Date.now()}`;
    const newParticipant: Participant = {
      id: newId,
      name: newParticipantName.trim(),
      amount: null
    };
    
    setParticipants([...participants, newParticipant]);
    setNewParticipantName('');
    
    // Update split amounts if equal splitting is enabled
    if (splitEqually && totalAmount) {
      const numericValue = parseFloat(totalAmount);
      if (numericValue > 0) {
        setTimeout(() => updateEqualSplits(numericValue), 0);
      }
    }
    
    toast.success(`${newParticipantName.trim()} added to payment`);
  };
  
  const removeParticipant = (id: string) => {
    if (participants.length <= 2) {
      toast.error("At least 2 participants are required");
      return;
    }
    
    const participant = participants.find(p => p.id === id);
    setParticipants(participants.filter(p => p.id !== id));
    
    // Update split amounts if equal splitting is enabled
    if (splitEqually && totalAmount) {
      const numericValue = parseFloat(totalAmount);
      if (numericValue > 0) {
        setTimeout(() => updateEqualSplits(numericValue), 0);
      }
    }
    
    if (participant) {
      toast.success(`${participant.name} removed from payment`);
    }
  };
  
  const generateQRCode = () => {
    setShowQRModal(true);
  };
  
  const closeQRModal = () => {
    setShowQRModal(false);
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
  
  // Get an event by ID
  const getEventById = (id: string): Event | undefined => {
    return events.find(event => event.id === id);
  };
  
  // Get currently selected event
  const currentEvent = selectedEvent ? getEventById(selectedEvent) : undefined;
  
  // Get public events for quick selection
  const publicEvents = events.filter(event => event.isPublic);
  
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
          
          {/* Enhanced Event Selection field */}
          <div ref={eventSearchRef}>
            <label htmlFor="event-search" className="block text-sm font-medium text-gray-700 mb-1">
              Event
            </label>
            
            {isEditingEvent ? (
              <div className="flex items-center">
                <input
                  type="text"
                  value={editedEventTitle}
                  onChange={(e) => setEditedEventTitle(e.target.value)}
                  className="flex-grow px-4 py-2 border border-gray-300 rounded-l-md focus:ring-nsplit-500 focus:border-nsplit-500 outline-none transition-colors"
                  placeholder="Enter event name"
                  autoFocus
                />
                <button
                  type="button"
                  onClick={saveEditedEvent}
                  className="px-3 py-2 bg-nsplit-500 text-white rounded-none hover:bg-nsplit-600"
                >
                  Save
                </button>
                <button
                  type="button"
                  onClick={cancelEditingEvent}
                  className="px-3 py-2 bg-gray-200 text-gray-700 rounded-r-md hover:bg-gray-300"
                >
                  Cancel
                </button>
              </div>
            ) : (
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Search size={16} className="text-gray-400" />
                </div>
                
                <input
                  id="event-search"
                  type="text"
                  value={eventSearchTerm}
                  onChange={handleEventSearchChange}
                  onFocus={handleEventSearchFocus}
                  placeholder="Search or create an event..."
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-md focus:ring-nsplit-500 focus:border-nsplit-500 outline-none transition-colors"
                />
                
                {eventSearchTerm && (
                  <button 
                    type="button"
                    onClick={() => {
                      setEventSearchTerm('');
                      setSelectedEvent('');
                    }}
                    className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400 hover:text-gray-600"
                  >
                    <X size={16} />
                  </button>
                )}
                
                {/* Dropdown for event search results */}
                {showEventDropdown && (
                  <div className="absolute z-10 mt-1 w-full bg-white rounded-md shadow-lg border border-gray-200 max-h-60 overflow-y-auto">
                    {filteredEvents.length > 0 ? (
                      <ul className="py-1">
                        {filteredEvents.map(event => (
                          <li key={event.id} className="px-3 py-2 hover:bg-gray-100 cursor-pointer" onClick={() => handleSelectEvent(event)}>
                            <div className="flex items-center justify-between">
                              <span className={`${selectedEvent === event.id ? 'font-medium text-nsplit-600' : ''}`}>
                                {event.title}
                              </span>
                              <span className="flex items-center text-xs text-gray-500">
                                {event.isPublic ? (
                                  <Globe size={14} className="ml-2 text-green-500" />
                                ) : (
                                  <Lock size={14} className="ml-2 text-gray-400" />
                                )}
                              </span>
                            </div>
                          </li>
                        ))}
                      </ul>
                    ) : (
                      <div className="p-3">
                        <p className="text-sm text-gray-500 mb-2">No events found with "{eventSearchTerm}"</p>
                        <button
                          type="button"
                          onClick={() => handleCreateNewEvent(eventSearchTerm)}
                          className="w-full flex items-center justify-center text-sm font-medium text-nsplit-600 bg-nsplit-50 hover:bg-nsplit-100 p-2 rounded-md transition-colors"
                        >
                          <Plus size={16} className="mr-2" />
                          Create "{eventSearchTerm}"
                        </button>
                      </div>
                    )}
                    
                    {filteredEvents.length > 0 && !filteredEvents.some(e => e.title.toLowerCase() === eventSearchTerm.toLowerCase()) && eventSearchTerm && (
                      <div className="p-3 border-t border-gray-100">
                        <button
                          type="button"
                          onClick={() => handleCreateNewEvent(eventSearchTerm)}
                          className="w-full flex items-center justify-center text-sm font-medium text-nsplit-600 bg-nsplit-50 hover:bg-nsplit-100 p-2 rounded-md transition-colors"
                        >
                          <Plus size={16} className="mr-2" />
                          Create "{eventSearchTerm}"
                        </button>
                      </div>
                    )}
                  </div>
                )}
              </div>
            )}
            
            {/* Public events quick selection (show only if not editing and no event selected) */}
            {!isEditingEvent && !currentEvent && publicEvents.length > 0 && (
              <div className="mt-3">
                <p className="text-xs text-gray-500 mb-2">Public Events</p>
                <div className="flex flex-wrap gap-2">
                  {publicEvents.slice(0, 5).map(event => (
                    <button
                      key={event.id}
                      type="button"
                      onClick={() => handleSelectEvent(event)}
                      className={`px-3 py-1.5 text-sm rounded-full flex items-center ${
                        selectedEvent === event.id 
                          ? 'bg-nsplit-100 text-nsplit-700 font-medium' 
                          : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                      }`}
                    >
                      {event.title}
                      <Globe size={12} className="ml-1.5 text-green-500" />
                    </button>
                  ))}
                  
                  {publicEvents.length > 5 && (
                    <button
                      type="button"
                      onClick={() => setShowEventDropdown(true)}
                      className="px-3 py-1.5 text-sm rounded-full bg-gray-100 text-gray-700 hover:bg-gray-200 flex items-center"
                    >
                      +{publicEvents.length - 5} more
                    </button>
                  )}
                </div>
              </div>
            )}
            
            {/* Show selected event with edit button */}
            {!isEditingEvent && currentEvent && (
              <div className="mt-3 p-3 bg-gray-50 rounded-md border border-gray-200">
                <div className="flex justify-between items-center">
                  <div className="flex items-center">
                    <span className="font-medium">{currentEvent.title}</span>
                    {currentEvent.isPublic ? (
                      <span className="ml-2 flex items-center text-xs text-green-600 bg-green-50 px-2 py-0.5 rounded-full">
                        <Globe size={12} className="mr-1" />
                        Public
                      </span>
                    ) : (
                      <span className="ml-2 flex items-center text-xs text-gray-600 bg-gray-100 px-2 py-0.5 rounded-full">
                        <Lock size={12} className="mr-1" />
                        Private
                      </span>
                    )}
                  </div>
                  <div className="flex items-center">
                    <button
                      type="button"
                      onClick={startEditingEvent}
                      className="mr-2 flex items-center text-nsplit-600 hover:text-nsplit-700 text-sm"
                    >
                      <Edit size={14} className="mr-1" />
                      Edit
                    </button>
                    <button
                      type="button"
                      onClick={() => {
                        setSelectedEvent('');
                        setEventSearchTerm('');
                      }}
                      className="text-gray-400 hover:text-gray-600"
                    >
                      <X size={16} />
                    </button>
                  </div>
                </div>
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
              
              {/* Improved conversion box with prominent USDC amount */}
              <div className="mt-2 p-3 rounded-md bg-gradient-to-r from-nsplit-50 to-blue-50 border border-nsplit-100 shadow-sm">
                <div className="flex flex-col">
                  <div className="flex justify-between items-center mb-1">
                    <span className="text-sm text-gray-500">USDC Equivalent:</span>
                    <span className="text-xl font-semibold text-nsplit-800">
                      ${numericTotalAmount > 0 
                        ? (numericTotalAmount * selectedCurrency.rate).toFixed(2) 
                        : '0.00'}
                    </span>
                  </div>
                  <div className="text-xs text-nsplit-600 mt-1 flex justify-end items-center">
                    <span>Rate: 1 {selectedCurrency.code} = {selectedCurrency.rate} USDC</span>
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
                    <span className="ml-1 text-xs font-medium text-nsplit-600">(You)</span>
                  )}
                </label>
              ))}
            </div>
          </div>
          
          <div>
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center">
                <label className="block text-sm font-medium text-gray-700 mr-2">
                  Split Between
                </label>
                <button
                  type="button"
                  onClick={generateQRCode}
                  className="text-xs flex items-center text-nsplit-600 bg-nsplit-50 px-2 py-1 rounded border border-nsplit-100 hover:bg-nsplit-100"
                >
                  <QrCode size={12} className="mr-1" />
                  Share QR
                </button>
              </div>
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
                  <div className="w-24 flex items-center text-sm font-medium text-gray-700">
                    <span className="truncate">
                      {participant.name}
                      {participant.id === loggedInUser.id && (
                        <span className="ml-1 text-xs text-nsplit-600">(You)</span>
                      )}
                    </span>
                    <button
                      type="button"
                      onClick={() => removeParticipant(participant.id)}
                      className="ml-1 text-gray-400 hover:text-red-500"
                    >
                      <Minus size={14} />
                    </button>
                  </div>
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
                    
                    {/* Display USDC label */}
                    <div className="absolute right-3 top-1/2 transform -translate-y-1/2 bg-nsplit-50 px-2 py-0.5 rounded text-xs font-medium text-nsplit-700 border border-nsplit-100">
                      USDC
                    </div>
                  </div>
                </div>
              ))}
              
              {/* Add new participant */}
              <div className="flex items-center mt-4">
                <div className="flex-grow">
                  <input
                    type="text"
                    value={newParticipantName}
                    onChange={(e) => setNewParticipantName(e.target.value)}
                    placeholder="New participant name"
                    className="w-full px-4 py-2 border border-gray-300 rounded-l-md focus:ring-nsplit-500 focus:border-nsplit-500 outline-none transition-colors"
                  />
                </div>
                <button
                  type="button"
                  onClick={addParticipant}
                  className="px-4 py-2 bg-nsplit-500 text-white rounded-r-md hover:bg-nsplit-600 flex items-center"
                >
                  <Plus size={16} />
                </button>
              </div>
            </div>
          </div>
          
          <div className="pt-4">
            <Button type="submit" fullWidth isLoading={loading}>
              Add Payment
            </Button>
          </div>
        </form>
      </div>
      
      {/* QR Code Modal */}
      {showQRModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 max-w-sm w-full">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-medium">Share Payment</h3>
              <button
                onClick={closeQRModal}
                className="text-gray-400 hover:text-gray-600"
              >
                <X size={20} />
              </button>
            </div>
            
            <div className="flex flex-col items-center">
              <div className="border-4 border-white p-2 shadow-md rounded">
                <div className="bg-gray-200 h-48 w-48 flex items-center justify-center">
                  <QrCode size={100} className="text-gray-700" />
                </div>
              </div>
              
              <p className="mt-4 text-sm text-gray-600 text-center">
                Scan this QR code to join this payment.
                They'll be able to add their name and participate in the split.
              </p>
              
              <div className="mt-4 w-full">
                <Button onClick={closeQRModal} fullWidth>
                  Close
                </Button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AddPayment;
