
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Plus, Trash2, Users, Globe, Lock, Info } from 'lucide-react';
import Button from '@/components/Button';
import { toast } from "sonner";
import { Switch } from "@/components/ui/switch";

const CreateEvent: React.FC = () => {
  const navigate = useNavigate();
  const [eventTitle, setEventTitle] = useState('');
  const [participants, setParticipants] = useState(['', '']);
  const [loading, setLoading] = useState(false);
  const [isPublic, setIsPublic] = useState(true); // Default to public
  const [showVisibilityTooltip, setShowVisibilityTooltip] = useState(false);
  
  const addParticipant = () => {
    setParticipants([...participants, '']);
  };
  
  const removeParticipant = (index: number) => {
    // Don't allow removing if only 2 participants remain
    if (participants.length <= 2) {
      toast.error("At least 2 participants are required");
      return;
    }
    
    const newParticipants = [...participants];
    newParticipants.splice(index, 1);
    setParticipants(newParticipants);
  };
  
  const handleParticipantChange = (index: number, value: string) => {
    const newParticipants = [...participants];
    newParticipants[index] = value;
    setParticipants(newParticipants);
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
    
    const filledParticipants = participants.filter(p => p.trim() !== '');
    if (filledParticipants.length < 2) {
      toast.error("Please add at least 2 participants");
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
              <span className="text-xs text-gray-500">{participants.length} people</span>
            </div>
            
            <div className="space-y-3">
              {participants.map((participant, index) => (
                <div key={index} className="flex items-center">
                  <input
                    type="text"
                    value={participant}
                    onChange={(e) => handleParticipantChange(index, e.target.value)}
                    placeholder={index === 0 ? "You" : `Person ${index + 1}`}
                    className="flex-grow px-4 py-2 border border-gray-300 rounded-md focus:ring-nsplit-500 focus:border-nsplit-500 outline-none transition-colors"
                  />
                  {participants.length > 2 && (
                    <button
                      type="button"
                      onClick={() => removeParticipant(index)}
                      className="ml-2 p-2 text-gray-400 hover:text-red-500 transition-colors"
                    >
                      <Trash2 size={18} />
                    </button>
                  )}
                </div>
              ))}
            </div>
            
            <button
              type="button"
              onClick={addParticipant}
              className="mt-3 flex items-center text-sm font-medium text-nsplit-600 hover:text-nsplit-700"
            >
              <Plus size={16} className="mr-1" />
              Add Another Person
            </button>
          </div>
          
          <div className="pt-4">
            <Button type="submit" fullWidth isLoading={loading}>
              Create Event
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CreateEvent;
