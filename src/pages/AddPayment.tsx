import React, { useState, useEffect, useRef } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { ArrowLeft, DollarSign, User, Users, Plus, Minus, AlertCircle, CheckCircle, Search, Globe, Lock, X, QrCode, Edit, Calendar } from 'lucide-react';
import Button from '@/components/Button';
import { toast } from "sonner";
import { useAuth } from '@/context/AuthContext';
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { format } from "date-fns";
import { Calendar as CalendarComponent } from "@/components/ui/calendar";
import { cn } from "@/lib/utils";

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
  date: Date; // Added date property
}

const currencies: CurrencyOption[] = [
  { code: 'USDC', symbol: '$', name: 'USDC', rate: 1 },
  { code: 'MYR', symbol: 'RM', name: 'Malaysian Ringgit', rate: 0.23 }, // Example rate: 1 MYR = 0.23 USDC
  { code: 'USD', symbol: '$', name: 'US Dollar', rate: 1 },
  { code: 'EUR', symbol: '€', name: 'Euro', rate: 1.08 },
  { code: 'GBP', symbol: '£', name: 'British Pound', rate: 1.27 },
  { code: 'SGD', symbol: 'S$', name: 'Singapore Dollar', rate: 0.75 }, // Added Singapore Dollar
];

const mockEvents: Event[] = [
  { id: '123', title: 'Weekend Trip', isPublic: true, date: new Date() },
  { id: '456', title: 'Dinner Party', isPublic: true, date: new Date(Date.now() - 86400000) }, // Yesterday
  { id: '789', title: 'Office Lunch', isPublic: false, date: new Date(Date.now() + 86400000) }, // Tomorrow
  { id: '101', title: 'Birthday Celebration', isPublic: true, date: new Date(Date.now() + 86400000 * 2) }, // Day after tomorrow
  { id: '102', title: 'Game Night', isPublic: true, date: new Date(Date.now() + 86400000 * 3) }, // Outside 2-day window
  { id: '103', title: 'Movie Night', isPublic: false, date: new Date(Date.now() - 86400000 * 2) },
  { id: '104', title: 'Beach Day', isPublic: true, date: new Date(Date.now() - 86400000 * 3) }, // Outside 2-day window
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
  
  const [eventSearchTerm, setEventSearchTerm] = useState<string>('');
  const [showEventDropdown, setShowEventDropdown] = useState<boolean>(false);
  const [filteredEvents, setFilteredEvents] = useState<Event[]>([]);
  const eventSearchRef = useRef<HTMLDivElement>(null);
  
  const [isEditingEvent, setIsEditingEvent] = useState<boolean>(false);
  const [editedEventTitle, setEditedEventTitle] = useState<string>('');
  
  const [paymentDate, setPaymentDate] = useState<Date>(new Date());
  const [showDatePicker, setShowDatePicker] = useState<boolean>(false);
  
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

  const [splitAmountError, setSplitAmountError] = useState<boolean>(false);
  const [splitAmountDifference, setSplitAmountDifference] = useState<number>(0);
  
  const numericTotalAmount = totalAmount === '' ? 0 : parseFloat(totalAmount);
  
  useEffect(() => {
    setPayer(loggedInUser.name);
    
    if (eventId) {
      setSelectedEvent(eventId);
      const event = events.find(e => e.id === eventId);
      if (event) {
        setEventSearchTerm(event.title);
      }
    }
  }, [loggedInUser.name, eventId, events]);
  
  useEffect(() => {
    const now = new Date();
    const twoDaysAgo = new Date(now);
    twoDaysAgo.setDate(now.getDate() - 2);
    
    const twoDaysFromNow = new Date(now);
    twoDaysFromNow.setDate(now.getDate() + 2);
    
    let filtered = events;
    if (eventSearchTerm) {
      filtered = events.filter(event => 
        event.title.toLowerCase().includes(eventSearchTerm.toLowerCase())
      );
    } else {
      filtered = events.filter(event => {
        const eventDate = new Date(event.date);
        return (
          event.isPublic && 
          eventDate >= twoDaysAgo && 
          eventDate <= twoDaysFromNow
        );
      });
    }
    
    setFilteredEvents(filtered);
  }, [eventSearchTerm, events]);
  
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

  const handleAmountChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    
    if (value === '' || /^\d*\.?\d*$/.test(value)) {
      setTotalAmount(value);
      
      const numericValue = value === '' ? 0 : parseFloat(value);
      updateUsdcEquivalent(numericValue);
      
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
    
    setTimeout(validateSplitAmounts, 100);
  };
  
  const toggleSplitEqually = () => {
    setSplitEqually(!splitEqually);
    
    if (!splitEqually) {
      const numericValue = totalAmount === '' ? 0 : parseFloat(totalAmount);
      if (numericValue > 0) {
        updateEqualSplits(numericValue);
      }
      setSplitAmountError(false);
      setSplitAmountDifference(0);
    } else {
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
    setSplitAmountError(difference > 0.01);
  };
  
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
    
    const newEvent: Event = {
      id: `new-${Date.now()}`,
      title: title.trim(),
      isPublic: true,
      date: new Date()
    };
    
    setEvents([...events, newEvent]);
    
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
  
  const handleAddPaymentAndQR = () => {
    if (!validatePaymentForm()) return;
    
    setLoading(true);
    
    setTimeout(() => {
      toast.success("Payment added successfully!");
      setShowQRModal(true);
      setLoading(false);
    }, 1000);
  };
  
  const validatePaymentForm = (): boolean => {
    if (!paymentTitle.trim()) {
      toast.error("Please enter a payment title");
      return false;
    }
    if (totalAmount === '' || parseFloat(totalAmount) <= 0) {
      toast.error("Please enter a valid total amount");
      return false;
    }
    if (!payer.trim()) {
      toast.error("Please select who paid");
      return false;
    }
    if (!selectedEvent) {
      toast.error("Please select or create an event");
      return false;
    }
    
    if (!splitEqually) {
      validateSplitAmounts();
      if (splitAmountError) {
        toast.error("The sum of individual amounts must equal the total amount");
        return false;
      }
    }
    
    return true;
  };
  
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validatePaymentForm()) return;
    
    setLoading(true);
    
    setTimeout(() => {
      toast.success("Payment added successfully!");
      navigate(`/event/${selectedEvent}`);
      setLoading(false);
    }, 1000);
  };
  
  const getParticipantBalance = (participant: Participant): number => {
    if (participant.amount === null) return 0;
    
    const usdcAmount = participant.amount * selectedCurrency.rate;
    
    if (participant.name === payer) {
      return numericTotalAmount * selectedCurrency.rate - usdcAmount;
    } else {
      return -usdcAmount;
    }
  };
  
  const isParticipantReceiving = (participant: Participant): boolean => {
    return participant.name === payer;
  };
  
  const formatEventDate = (date: Date): string => {
    return format(date, "MMM d");
  };
  
  const currentEvent = events.find(e => e.id === selectedEvent);
  
  const now = new Date();
  const twoDaysAgo = new Date(now);
  twoDaysAgo.setDate(now.getDate() - 2);
  
  const twoDaysFromNow = new Date(now);
  twoDaysFromNow.setDate(now.getDate() + 2);
  
  const recentPublicEvents = events.filter(event => {
    const eventDate = new Date(event.date);
    return event.isPublic && eventDate >= twoDaysAgo && eventDate <= twoDaysFromNow;
  });
  
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
            <label htmlFor="payment-date" className="block text-sm font-medium text-gray-700 mb-1">
              Date
            </label>
            <Popover open={showDatePicker} onOpenChange={setShowDatePicker}>
              <PopoverTrigger asChild>
                <button
                  id="payment-date"
                  type="button"
                  className="w-full flex items-center justify-between px-4 py-2 border border-gray-300 rounded-md focus:ring-nsplit-500 focus:border-nsplit-500 outline-none transition-colors bg-white text-left"
                >
                  <span>{format(paymentDate, "PPP")}</span>
                  <Calendar size={16} className="text-gray-400" />
                </button>
              </PopoverTrigger>
              <PopoverContent align="start" className="w-auto p-0">
                <CalendarComponent
                  mode="single"
                  selected={paymentDate}
                  onSelect={(date) => {
                    if (date) {
                      setPaymentDate(date);
                      setShowDatePicker(false);
                    }
                  }}
                  initialFocus
                  className={cn("p-3 pointer-events-auto")}
                />
              </PopoverContent>
            </Popover>
          </div>
          
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
                              <div className="flex items-center text-xs text-gray-500">
                                <span className="mr-2">{formatEventDate(event.date)}</span>
                                {event.isPublic ? (
                                  <Globe size={14} className="text-green-500" />
                                ) : (
                                  <Lock size={14} className="text-gray-400" />
                                )}
                              </div>
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
            
            {!isEditingEvent && !currentEvent && recentPublicEvents.length > 0 && (
              <div className="mt-3">
                <p className="text-xs text-gray-500 mb-2">Recent Events</p>
                <div className="flex flex-wrap gap-2">
                  {recentPublicEvents.slice(0, 5).map(event => (
                    <button
                      key={event.id}
                      type="button"
                      onClick={() => handleSelectEvent(event)}
                      className={`px-2 py-1 text-xs rounded-full flex items-center truncate max-w-full ${
                        selectedEvent === event.id 
                          ? 'bg-nsplit-100 text-nsplit-700 font-medium' 
                          : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                      }`}
                    >
                      <span className="truncate max-w-[100px]">{event.title}</span>
                      <span className="mx-1 text-xs text-gray-500 whitespace-nowrap">{formatEventDate(event.date)}</span>
                      <Globe size={10} className="text-green-500 flex-shrink-0" />
                    </button>
                  ))}
                  
                  {recentPublicEvents.length > 5 && (
                    <button
                      type="button"
                      onClick={() => setShowEventDropdown(true)}
                      className="px-2 py-1 text-xs rounded-full bg-gray-100 text-gray-700 hover:bg-gray-200 flex items-center"
                    >
                      +{recentPublicEvents.length - 5} more
                    </button>
                  )}
                </div>
              </div>
            )}
            
            {!isEditingEvent && currentEvent && (
              <div className="mt-3 p-3 bg-gray-50 rounded-md border border-gray-200">
                <div className="flex justify-between items-center">
                  <div className="flex items-center">
                    <span className="font-medium">{currentEvent.title}</span>
                    <span className="mx-2 text-sm text-gray-500">{formatEventDate(currentEvent.date)}</span>
                    {currentEvent.isPublic ? (
                      <span className="flex items-center text-xs text-green-600 bg-green-50 px-2 py-0.5 rounded-full">
                        <Globe size={12} className="mr-1" />
                        Public
                      </span>
                    ) : (
                      <span className="flex items-center text-xs text-gray-600 bg-gray-100 px-2 py-0.5 rounded-full">
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
              
              <div className="mt-2 p-3 rounded-md bg-gradient-to-r from-blue-50 to-blue-50 border border-blue-100 shadow-sm w-full">
                <div className="flex flex-col">
                  <div className="flex justify-between items-center mb-1">
                    <span className="text-sm text-gray-600">USDC Equivalent:</span>
                    <span className="text-xl font-semibold text-nsplit-800">
                      ${numericTotalAmount > 0 
                        ? (numericTotalAmount * selectedCurrency.rate).toFixed(2) 
                        : '0.00'}
                    </span>
                  </div>
                  <div className="text-xs text-blue-600 mt-1 flex justify-end items-center">
                    <span>Rate: 1 {selectedCurrency.code} = {selectedCurrency.rate} USDC</span>
                  </div>
                </div>
              </div>
            </div>
            
            <div className="md:w-1/4">
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
            <div className="flex items-center justify-between mb-2">
              <label className="block text-sm font-medium text-gray-700">
                <div className="flex items-center">
                  <Users size={16} className="mr-2" />
                  Participants
                </div>
              </label>
            </div>
            
            <div className="bg-gray-50 p-4 rounded-lg border border-gray-200 mb-4">
              <div className="mb-4">
                <p className="text-sm font-medium text-gray-700 mb-2">Paid By</p>
                <div className="space-y-2">
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
              
              <div className="flex items-center mb-3">
                <input
                  type="text"
                  value={newParticipantName}
                  onChange={(e) => setNewParticipantName(e.target.value)}
                  placeholder="Add participant..."
                  className="flex-grow px-4 py-2 border border-gray-300 rounded-l-md focus:ring-nsplit-500 focus:border-nsplit-500 outline-none transition-colors"
                />
                <button
                  type="button"
                  onClick={addParticipant}
                  disabled={!newParticipantName.trim()}
                  className="h-[40px] w-[40px] flex items-center justify-center bg-nsplit-500 text-white rounded-r-md hover:bg-nsplit-600 disabled:bg-gray-300 disabled:cursor-not-allowed"
                >
                  <Plus size={16} />
                </button>
              </div>
              
              <p className="text-xs text-gray-500 mb-2">
                You can add more participants later by sharing a QR code after creating the payment.
              </p>
            </div>
            
            <div className="flex justify-end mb-3">
              <button
                type="button"
                onClick={toggleSplitEqually}
                className="text-sm text-nsplit-600 hover:text-nsplit-700"
              >
                {splitEqually ? 'Split unequally' : 'Split equally'}
              </button>
            </div>
            
            <div className="rounded-md border border-gray-200 overflow-hidden">
              <table className="w-full">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="text-left text-xs font-medium text-gray-500 uppercase tracking-wider py-2 px-3">Participant</th>
                    <th className="text-right text-xs font-medium text-gray-500 uppercase tracking-wider py-2 px-3">Amount (USDC)</th>
                    <th className="text-right text-xs font-medium text-gray-500 uppercase tracking-wider py-2 px-3">Balance</th>
                    <th className="w-8"></th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {participants.map(participant => {
                    const balance = getParticipantBalance(participant);
                    const isReceiving = isParticipantReceiving(participant);
                    
                    return (
                      <tr key={participant.id}>
                        <td className="py-2 px-3 whitespace-nowrap">
                          <div className="flex items-center">
                            <span className="font-medium text-sm text-gray-900">
                              {participant.name}
                              {participant.id === loggedInUser.id && (
                                <span className="ml-1 text-xs font-medium text-nsplit-600">(You)</span>
                              )}
                            </span>
                          </div>
                        </td>
                        <td className="py-2 px-3 whitespace-nowrap text-right">
                          {splitEqually ? (
                            <span className="text-sm text-gray-900">
                              ${participant.amount !== null ? (participant.amount * selectedCurrency.rate).toFixed(2) : '0.00'}
                            </span>
                          ) : (
                            <input
                              type="text"
                              value={participant.amount !== null ? participant.amount.toString() : ''}
                              onChange={(e) => {
                                const value = e.target.value;
                                if (value === '' || /^\d*\.?\d*$/.test(value)) {
                                  const numericValue = value === '' ? null : parseFloat(value);
                                  handleParticipantAmountChange(participant.id, numericValue);
                                }
                              }}
                              className="w-20 px-2 py-1 text-right border border-gray-300 rounded-md text-sm"
                              placeholder="0.00"
                            />
                          )}
                        </td>
                        <td className="py-2 px-3 whitespace-nowrap text-right">
                          <span className={`text-sm ${isReceiving ? 'text-green-600' : 'text-red-600'}`}>
                            {isReceiving ? `+$${Math.abs(balance).toFixed(2)}` : `-$${Math.abs(balance).toFixed(2)}`}
                          </span>
                        </td>
                        <td className="py-2 px-1 whitespace-nowrap text-right">
                          <button
                            type="button"
                            onClick={() => removeParticipant(participant.id)}
                            className="text-gray-400 hover:text-red-500"
                            title="Remove participant"
                          >
                            <X size={16} />
                          </button>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
            
            {!splitEqually && totalAmount !== '' && (
              <div className={`mt-3 p-2 rounded-md flex items-center ${
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
            
            <div className="mt-3 p-3 rounded-md bg-blue-50 border border-blue-100 text-gray-700 text-sm flex items-center">
              <div className="text-sm">
                <span className="font-medium">Current split: </span>
                <span>Split will be recalculated if more participants are added later.</span>
              </div>
            </div>
          </div>
          
          <div className="pt-6 flex flex-col sm:flex-row gap-4">
            <Button 
              type="button" 
              onClick={handleAddPaymentAndQR}
              fullWidth
              isLoading={loading}
              className="order-1 sm:order-1"
            >
              <QrCode size={18} className="mr-2" />
              Add Payment & Create QR Code
            </Button>
            
            <Button 
              type="submit" 
              variant="outline"
              fullWidth
              isLoading={loading}
              className="order-2 sm:order-2"
            >
              Add Payment
            </Button>
          </div>
        </form>
        
        {showQRModal && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white rounded-lg p-6 max-w-md w-full">
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-lg font-bold">Share QR Code</h2>
                <button 
                  onClick={closeQRModal}
                  className="text-gray-500 hover:text-gray-700"
                >
                  <X size={20} />
                </button>
              </div>
              
              <div className="flex flex-col items-center p-4">
                <div className="bg-gray-100 p-6 rounded-lg mb-4">
                  <QrCode size={180} className="text-nsplit-700" />
                </div>
                
                <p className="text-center text-sm text-gray-600 mb-4">
                  Share this QR code with others to let them join this payment.
                </p>
                
                <Button 
                  onClick={closeQRModal}
                  fullWidth
                >
                  Close
                </Button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default AddPayment;
