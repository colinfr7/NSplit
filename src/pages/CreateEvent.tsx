import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Plus, X, Users, Globe, Lock, Info, QrCode, Search, Check, Calendar } from 'lucide-react';
import Button from '@/components/Button';
import { toast } from "sonner";
import { Switch } from "@/components/ui/switch";
import { useAuth } from '@/context/AuthContext';
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { format } from "date-fns";
import { Calendar as CalendarComponent } from "@/components/ui/calendar";
import { cn } from "@/lib/utils";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

// Sample data for user suggestions - in a real app this would come from an API
const SAMPLE_USERS = [
  { id: 'user1', name: 'Alex Johnson', photoURL: 'https://randomuser.me/api/portraits/men/32.jpg', discordName: 'alex_j#1234' },
  { id: 'user2', name: 'Maria Garcia', photoURL: 'https://randomuser.me/api/portraits/women/44.jpg', discordName: 'maria_g#5678' },
  { id: 'user3', name: 'John Smith', photoURL: 'https://randomuser.me/api/portraits/men/36.jpg' },
  { id: 'user4', name: 'Sarah Lee', photoURL: 'https://randomuser.me/api/portraits/women/28.jpg', discordName: 'sarahlee#2345' },
  { id: 'user5', name: 'David Kim', photoURL: 'https://randomuser.me/api/portraits/men/42.jpg' },
];

const CreateEvent: React.FC = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [eventTitle, setEventTitle] = useState('');
  const [participants, setParticipants<{id: string; name: string; photoURL?: string; discordName?: string}[]>([]);
  const [loading, setLoading] = useState(false);
  const [isPublic, setIsPublic] = useState(true); // Default to public
  const [showVisibilityTooltip, setShowVisibilityTooltip] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [newParticipantName, setNewParticipantName] = useState('');
  
  // Event date settings
  const [startDate, setStartDate] = useState<Date>(new Date()); // Default to today
  const [endDate, setEndDate] = useState<Date | undefined>(undefined); // For multi-day events
  const [isMultiDay, setIsMultiDay] = useState(false);
  const [showStartDatePicker, setShowStartDatePicker] = useState(false);
  const [showEndDatePicker, setShowEndDatePicker] = useState(false);
  
  // Add the current user automatically when the component mounts
  useEffect(() => {
    if (user) {
      const currentUser = {
        id: user.uid,
        name: user.displayName || 'You (current user)',
        photoURL: user.photoURL,
        discordName: user.discordName,
      };
      
      // Only add if the user is not already in the participants list
      setParticipants(prev => {
        if (!prev.some(p => p.id === user.uid)) {
          return [currentUser];
        }
        return prev;
      });
    }
  }, [user]);
  
  const toggleMultiDayEvent = () => {
    if (!isMultiDay) {
      // When enabling multi-day, set end date to start date if not set
      if (!endDate) {
        setEndDate(startDate);
      }
    } else {
      // When disabling multi-day, clear end date
      setEndDate(undefined);
    }
    setIsMultiDay(!isMultiDay);
  };
  
  const handleStartDateSelect = (date: Date | undefined) => {
    if (date) {
      setStartDate(date);
      setShowStartDatePicker(false);
      
      // If end date is before start date, update it
      if (endDate && date > endDate) {
        setEndDate(date);
      }
    }
  };
  
  const handleEndDateSelect = (date: Date | undefined) => {
    if (date) {
      setEndDate(date);
      setShowEndDatePicker(false);
    }
  };
  
  const addParticipant = () => {
    // Check if there's a name in the input field
    if (newParticipantName.trim()) {
      const newParticipant = {
        id: `new-${Date.now()}`,
        name: newParticipantName.trim()
      };
      setParticipants([...participants, newParticipant]);
      setNewParticipantName(''); // Clear the input field
    } else {
      // If empty, create an empty participant slot
      setParticipants([...participants, {id: `new-${Date.now()}`, name: ''}]);
    }
    setSearchTerm('');
  };
  
  const removeParticipant = (index: number) => {
    // Allow removing the current user (changed behavior)
    const newParticipants = [...participants];
    newParticipants.splice(index, 1);
    setParticipants(newParticipants);
    
    // Show a toast if the user removes themselves
    if (user && participants[index].id === user.uid) {
      toast("You removed yourself from the event");
    }
  };
  
  const handleParticipantChange = (index: number, value: string) => {
    // Allow editing participant names (even current user)
    const newParticipants = [...participants];
    newParticipants[index] = {
      ...newParticipants[index],
      name: value
    };
    setParticipants(newParticipants);
    setSearchTerm(value);
  };
  
  const handleSelectUser = (selectedUser: typeof SAMPLE_USERS[0]) => {
    // Check if user is already in participants
    if (participants.some(p => p.id === selectedUser.id)) {
      toast.error("This person is already in the event");
      return;
    }
    
    // Add the selected user directly
    setParticipants([...participants, selectedUser]);
    setNewParticipantName(''); // Clear the input field
    setSearchTerm('');
  };
  
  const toggleVisibility = () => {
    setIsPublic(!isPublic);
  };
  
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Simple validation
    if (!eventTitle.trim()) {
      toast.error("Please enter an event title");
      return;
    }
    
    const filledParticipants = participants.filter(p => p.name.trim() !== '');
    if (filledParticipants.length < 1) {
      toast.error("Please add at least 1 participant");
      return;
    }
    
    // Check dates for multi-day events
    if (isMultiDay && (!endDate || endDate < startDate)) {
      toast.error("End date must be after start date");
      return;
    }
    
    // Simulate form submission
    setLoading(true);
    
    // Mock API call
    setTimeout(() => {
      // Success - go to the new event page
      toast.success("Event created successfully!");
      navigate('/event/123'); // In a real app, this would be the new event ID
      setLoading(false);
    }, 1000);
  };

  const handleCreateAndAddExpense = () => {
    // Validate the form first
    if (!eventTitle.trim()) {
      toast.error("Please enter an event title");
      return;
    }
    
    const filledParticipants = participants.filter(p => p.name.trim() !== '');
    if (filledParticipants.length < 1) {
      toast.error("Please add at least 1 participant");
      return;
    }
    
    // Check dates for multi-day events
    if (isMultiDay && (!endDate || endDate < startDate)) {
      toast.error("End date must be after start date");
      return;
    }
    
    // Simulate event creation
    setLoading(true);
    
    // Mock API call to create event then redirect to add expense
    setTimeout(() => {
      toast.success("Event created! Now add your first expense.");
      navigate('/add-payment/123'); // Navigate to add payment page with the new event ID
      setLoading(false);
    }, 1000);
  };
  
  const handleCreateAndOpenQR = () => {
    // Validate the form first
    if (!eventTitle.trim()) {
      toast.error("Please enter an event title");
      return;
    }
    
    const filledParticipants = participants.filter(p => p.name.trim() !== '');
    if (filledParticipants.length < 1) {
      toast.error("Please add at least 1 participant");
      return;
    }
    
    // Simulate event creation
    setLoading(true);
    
    // Mock API call to create event then redirect to QR code page
    setTimeout(() => {
      toast.success("Event created! Open QR code for sharing.");
      navigate('/event-qr/123'); // Navigate to the new QR code page with event ID
      setLoading(false);
    }, 1000);
  };
  
  const formatDateRange = () => {
    if (isMultiDay && endDate) {
      return `${format(startDate, "MMM d")} - ${format(endDate, "MMM d, yyyy")}`;
    }
    return format(startDate, "PPP");
  };
  
  const filteredSuggestions = SAMPLE_USERS.filter(user => 
    newParticipantName && 
    user.name.toLowerCase().includes(newParticipantName.toLowerCase()) &&
    !participants.some(p => p.id === user.id)
  );
  
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
        
        <h1 className="text-2xl md:text-3xl font-bold mb-6">Create New Event</h1>
        
        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label htmlFor="event-title" className="block text-sm font-medium text-gray-700 mb-1">
              Event Title
            </label>
            <input
              id="event-title"
              type="text"
              value={eventTitle}
              onChange={(e) => setEventTitle(e.target.value)}
              placeholder="Weekend Trip, Dinner Party, etc."
              className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-nsplit-500 focus:border-nsplit-500 outline-none transition-colors"
            />
          </div>

          {/* Event Date Section */}
          <div>
            <div className="flex justify-between items-center mb-2">
              <label className="block text-sm font-medium text-gray-700">
                Event Date
              </label>
              <div className="flex items-center">
                <Switch 
                  checked={isMultiDay} 
                  onCheckedChange={toggleMultiDayEvent}
                  className="mr-2"
                />
                <span className="text-sm text-gray-700">Multi-day event</span>
              </div>
            </div>
            
            <div className="space-y-3">
              {/* Start Date */}
              <Popover open={showStartDatePicker} onOpenChange={setShowStartDatePicker}>
                <PopoverTrigger asChild>
                  <button
                    type="button"
                    className="w-full flex items-center justify-between px-4 py-2 border border-gray-300 rounded-md focus:ring-nsplit-500 focus:border-nsplit-500 outline-none transition-colors bg-white text-left"
                  >
                    <span>{isMultiDay ? `Start: ${format(startDate, "MMM d, yyyy")}` : format(startDate, "PPP")}</span>
                    <Calendar size={16} className="text-gray-400" />
                  </button>
                </PopoverTrigger>
                <PopoverContent align="start" className="w-auto p-0">
                  <CalendarComponent
                    mode="single"
                    selected={startDate}
                    onSelect={handleStartDateSelect}
                    initialFocus
                    className={cn("p-3 pointer-events-auto")}
                  />
                </PopoverContent>
              </Popover>
              
              {/* End Date (only if multi-day is enabled) */}
              {isMultiDay && (
                <Popover open={showEndDatePicker} onOpenChange={setShowEndDatePicker}>
                  <PopoverTrigger asChild>
                    <button
                      type="button"
                      className="w-full flex items-center justify-between px-4 py-2 border border-gray-300 rounded-md focus:ring-nsplit-500 focus:border-nsplit-500 outline-none transition-colors bg-white text-left"
                    >
                      <span>End: {endDate ? format(endDate, "MMM d, yyyy") : "Select end date"}</span>
                      <Calendar size={16} className="text-gray-400" />
                    </button>
                  </PopoverTrigger>
                  <PopoverContent align="start" className="w-auto p-0">
                    <CalendarComponent
                      mode="single"
                      selected={endDate}
                      onSelect={handleEndDateSelect}
                      disabled={(date) => date < startDate}
                      initialFocus
                      className={cn("p-3 pointer-events-auto")}
                    />
                  </PopoverContent>
                </Popover>
              )}
              
              {/* Visual Date Range Display */}
              {isMultiDay && endDate && (
                <p className="text-sm text-gray-600 bg-gray-50 p-2 rounded-md">
                  Event duration: {Math.ceil((endDate.getTime() - startDate.getTime()) / (1000 * 60 * 60 * 24))} days
                </p>
              )}
            </div>
          </div>
          
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              {isPublic ? (
                <Globe size={16} className="text-green-600" />
              ) : (
                <Lock size={16} className="text-gray-600" />
              )}
              <span className="text-sm font-medium">
                {isPublic ? 'Public' : 'Private'} Event
              </span>
              <Switch 
                checked={isPublic} 
                onCheckedChange={toggleVisibility}
                className="ml-1"
              />
            </div>
            <div className="relative">
              <button
                type="button"
                onMouseEnter={() => setShowVisibilityTooltip(true)}
                onMouseLeave={() => setShowVisibilityTooltip(false)}
                className="text-gray-400 hover:text-gray-600"
              >
                <Info size={14} />
              </button>
              
              {showVisibilityTooltip && (
                <div className="absolute right-0 bottom-full mb-2 w-64 p-2 bg-gray-800 text-white text-xs rounded shadow-lg z-10">
                  <p><strong>Public:</strong> Anyone can find, view, and add expenses to this event.</p>
                  <p className="mt-1"><strong>Private:</strong> Only invited members can view and add expenses.</p>
                  <div className="absolute right-0 bottom-0 transform translate-y-1/2 -translate-x-1 rotate-45 w-2 h-2 bg-gray-800"></div>
                </div>
              )}
            </div>
          </div>
          
          <div>
            <div className="flex justify-between items-center mb-2">
              <label className="block text-sm font-medium text-gray-700">
                <div className="flex items-center">
                  <Users size={16} className="mr-2" />
                  Participants
                </div>
              </label>
              <span className="text-xs text-gray-500">{participants.length} {participants.length === 1 ? 'person' : 'people'}</span>
            </div>
            
            <div className="space-y-3">
              {participants.map((participant, index) => (
                <div key={index} className="flex items-center">
                  <div className={`flex-grow flex items-center px-4 py-2 border rounded-md ${
                    user && participant.id === user.uid || participant.photoURL
                      ? 'bg-nsplit-50 border-nsplit-200'
                      : 'border-gray-300'
                  }`}>
                    {participant.photoURL && (
                      <Avatar className="h-6 w-6 mr-2">
                        <AvatarImage src={participant.photoURL} />
                        <AvatarFallback className="bg-nsplit-100 text-nsplit-700 text-xs">
                          {participant.name?.charAt(0) || '?'}
                        </AvatarFallback>
                      </Avatar>
                    )}
                    <div className="flex-grow">
                      <p className="text-sm font-medium">{participant.name}</p>
                      {participant.discordName && (
                        <p className="text-xs text-gray-500">{participant.discordName}</p>
                      )}
                    </div>
                  </div>
                  <button
                    type="button"
                    onClick={() => removeParticipant(index)}
                    className="ml-2 p-2 text-gray-400 hover:text-red-500 transition-colors"
                  >
                    <X size={18} />
                  </button>
                </div>
              ))}
            </div>
            
            <div className="mt-3 flex">
              <Popover>
                <PopoverTrigger asChild>
                  <div className="flex-grow relative">
                    <input
                      type="text"
                      value={newParticipantName}
                      onChange={(e) => setNewParticipantName(e.target.value)}
                      placeholder="Add a new participant..."
                      className="w-full px-4 py-2 border border-gray-300 rounded-l-md focus:ring-nsplit-500 focus:border-nsplit-500 outline-none transition-colors"
                    />
                    {newParticipantName && (
                      <div className="absolute right-3 top-1/2 transform -translate-y-1/2">
                        <Search size={16} className="text-gray-400" />
                      </div>
                    )}
                  </div>
                </PopoverTrigger>
                {filteredSuggestions.length > 0 && (
                  <PopoverContent className="w-[280px] p-0" align="start">
                    <div className="overflow-y-auto max-h-56">
                      {filteredSuggestions.map((suggestion) => (
                        <div
                          key={suggestion.id}
                          className="px-3 py-2 hover:bg-gray-100 cursor-pointer flex items-center"
                          onClick={() => handleSelectUser(suggestion)}
                        >
                          <Avatar className="h-6 w-6 mr-2">
                            <AvatarImage src={suggestion.photoURL} />
                            <AvatarFallback className="bg-nsplit-100 text-nsplit-700 text-xs">
                              {suggestion.name.charAt(0)}
                            </AvatarFallback>
                          </Avatar>
                          <div>
                            <p className="text-sm font-medium">{suggestion.name}</p>
                            {suggestion.discordName && (
                              <p className="text-xs text-gray-500">{suggestion.discordName}</p>
                            )}
                          </div>
                        </div>
                      ))}
                    </div>
                  </PopoverContent>
                )}
              </Popover>
              <button
                type="button"
                onClick={addParticipant}
                className="h-[40px] w-[40px] flex items-center justify-center bg-nsplit-600 text-white rounded-r-md hover:bg-nsplit-700 focus:outline-none focus:ring-2 focus:ring-nsplit-500"
              >
                <Check size={16} />
              </button>
            </div>
            
            <p className="text-xs text-gray-500 mt-2">
              More participants can be added later by scanning a QR code.
            </p>
          </div>
          
          <div className="pt-4 space-y-3">
            <Button 
              type="button" 
              onClick={handleCreateAndOpenQR} 
              fullWidth 
              isLoading={loading}
            >
              <QrCode size={16} className="mr-2" />
              Create Event & Open QR Code
            </Button>
            
            <Button 
              type="button"
              onClick={handleCreateAndAddExpense} 
              variant="secondary" 
              fullWidth
              isLoading={loading}
            >
              <Plus size={16} className="mr-2" />
              Create Event & Add First Expense
            </Button>
            
            <div className="flex justify-center">
              <button 
                type="submit"
                className="mt-2 text-nsplit-600 hover:text-nsplit-700 text-sm font-medium"
              >
                Create Event Only
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CreateEvent;
