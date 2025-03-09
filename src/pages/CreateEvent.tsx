
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Calendar, Users, Map, Clock } from 'lucide-react';
import Button from '@/components/Button';
import { useToast } from '@/hooks/use-toast';

const CreateEvent: React.FC = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // In a real app, we would save the event to the database here
    
    toast({
      title: "Event created!",
      description: "Your event has been created successfully.",
    });
    
    // Redirect to the event detail page (with a fake ID for now)
    navigate('/event/123');
  };
  
  return (
    <div className="min-h-screen pt-20 pb-12 px-4">
      <div className="max-w-md mx-auto">
        <button 
          onClick={() => navigate(-1)} 
          className="mb-6 flex items-center text-nsplit-600 hover:text-nsplit-700"
        >
          <ArrowLeft size={16} className="mr-1" />
          <span>Back</span>
        </button>
        
        <h1 className="text-2xl md:text-3xl font-bold mb-6">Create New Event</h1>
        
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-4">
            <div>
              <label htmlFor="eventName" className="block text-sm font-medium text-gray-700 mb-1">
                Event Name
              </label>
              <div className="relative">
                <input
                  id="eventName"
                  type="text"
                  placeholder="e.g., Weekend Trip to Bali"
                  className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-nsplit-500 focus:border-nsplit-500"
                  required
                />
              </div>
            </div>
            
            <div>
              <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-1">
                Description (Optional)
              </label>
              <textarea
                id="description"
                rows={3}
                placeholder="Add any details about this event..."
                className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-nsplit-500 focus:border-nsplit-500"
              />
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label htmlFor="startDate" className="block text-sm font-medium text-gray-700 mb-1">
                  Start Date
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <Calendar size={16} className="text-gray-400" />
                  </div>
                  <input
                    id="startDate"
                    type="date"
                    className="w-full pl-10 px-4 py-2 border border-gray-300 rounded-md focus:ring-nsplit-500 focus:border-nsplit-500"
                    required
                  />
                </div>
              </div>
              
              <div>
                <label htmlFor="endDate" className="block text-sm font-medium text-gray-700 mb-1">
                  End Date (Optional)
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <Calendar size={16} className="text-gray-400" />
                  </div>
                  <input
                    id="endDate"
                    type="date"
                    className="w-full pl-10 px-4 py-2 border border-gray-300 rounded-md focus:ring-nsplit-500 focus:border-nsplit-500"
                  />
                </div>
              </div>
            </div>
            
            <div>
              <label htmlFor="location" className="block text-sm font-medium text-gray-700 mb-1">
                Location (Optional)
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Map size={16} className="text-gray-400" />
                </div>
                <input
                  id="location"
                  type="text"
                  placeholder="e.g., Bali, Indonesia"
                  className="w-full pl-10 px-4 py-2 border border-gray-300 rounded-md focus:ring-nsplit-500 focus:border-nsplit-500"
                />
              </div>
            </div>
            
            <div>
              <label htmlFor="participants" className="block text-sm font-medium text-gray-700 mb-1">
                Participants
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Users size={16} className="text-gray-400" />
                </div>
                <input
                  id="participants"
                  type="text"
                  placeholder="Add emails, separated by commas"
                  className="w-full pl-10 px-4 py-2 border border-gray-300 rounded-md focus:ring-nsplit-500 focus:border-nsplit-500"
                />
              </div>
              <p className="mt-1 text-xs text-gray-500">
                Participants will receive an invitation to join this event.
              </p>
            </div>
            
            <div className="pt-4">
              <Button
                type="submit"
                fullWidth
              >
                Create Event
              </Button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CreateEvent;
