
import React, { useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { ArrowLeft, Calendar, DollarSign, Tag, FileText, Users } from 'lucide-react';
import Button from '@/components/Button';
import { useToast } from '@/hooks/use-toast';

const AddPayment: React.FC = () => {
  const navigate = useNavigate();
  const { eventId } = useParams<{ eventId: string }>();
  const { toast } = useToast();
  
  // Mock event participants
  const participants = ['You', 'Jamie', 'Taylor', 'Jordan'];
  const [selectedParticipants, setSelectedParticipants] = useState<string[]>(participants);
  
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // In a real app, we would save the payment to the database here
    
    toast({
      title: "Expense added!",
      description: "Your expense has been added to the event.",
    });
    
    // Redirect back to the event detail page
    navigate(`/event/${eventId}`);
  };
  
  const toggleParticipant = (participant: string) => {
    setSelectedParticipants(prev => 
      prev.includes(participant)
        ? prev.filter(p => p !== participant)
        : [...prev, participant]
    );
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
        
        <h1 className="text-2xl md:text-3xl font-bold mb-6">Add Expense</h1>
        
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-4">
            <div>
              <label htmlFor="expenseTitle" className="block text-sm font-medium text-gray-700 mb-1">
                What was it for?
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Tag size={16} className="text-gray-400" />
                </div>
                <input
                  id="expenseTitle"
                  type="text"
                  placeholder="e.g., Dinner at La Trattoria"
                  className="w-full pl-10 px-4 py-2 border border-gray-300 rounded-md focus:ring-nsplit-500 focus:border-nsplit-500"
                  required
                />
              </div>
            </div>
            
            <div>
              <label htmlFor="amount" className="block text-sm font-medium text-gray-700 mb-1">
                How much?
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <DollarSign size={16} className="text-gray-400" />
                </div>
                <input
                  id="amount"
                  type="number"
                  step="0.01"
                  placeholder="0.00"
                  className="w-full pl-10 px-4 py-2 border border-gray-300 rounded-md focus:ring-nsplit-500 focus:border-nsplit-500"
                  required
                />
              </div>
            </div>
            
            <div>
              <label htmlFor="date" className="block text-sm font-medium text-gray-700 mb-1">
                When?
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Calendar size={16} className="text-gray-400" />
                </div>
                <input
                  id="date"
                  type="date"
                  defaultValue={new Date().toISOString().split('T')[0]}
                  className="w-full pl-10 px-4 py-2 border border-gray-300 rounded-md focus:ring-nsplit-500 focus:border-nsplit-500"
                  required
                />
              </div>
            </div>
            
            <div>
              <label htmlFor="paidBy" className="block text-sm font-medium text-gray-700 mb-1">
                Who paid?
              </label>
              <select
                id="paidBy"
                className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-nsplit-500 focus:border-nsplit-500"
                required
              >
                <option value="You">You</option>
                <option value="Jamie">Jamie</option>
                <option value="Taylor">Taylor</option>
                <option value="Jordan">Jordan</option>
              </select>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Split between
              </label>
              <div className="space-y-2 border border-gray-300 rounded-md p-3">
                {participants.map(participant => (
                  <div 
                    key={participant}
                    className="flex items-center"
                  >
                    <input
                      type="checkbox"
                      id={`participant-${participant}`}
                      checked={selectedParticipants.includes(participant)}
                      onChange={() => toggleParticipant(participant)}
                      className="rounded text-nsplit-600 focus:ring-nsplit-500 mr-2"
                    />
                    <label 
                      htmlFor={`participant-${participant}`}
                      className="text-sm text-gray-700"
                    >
                      {participant}
                    </label>
                  </div>
                ))}
              </div>
            </div>
            
            <div>
              <label htmlFor="notes" className="block text-sm font-medium text-gray-700 mb-1">
                Notes (Optional)
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 pt-2 pointer-events-none">
                  <FileText size={16} className="text-gray-400" />
                </div>
                <textarea
                  id="notes"
                  rows={3}
                  placeholder="Add any details about this expense..."
                  className="w-full pl-10 px-4 py-2 border border-gray-300 rounded-md focus:ring-nsplit-500 focus:border-nsplit-500"
                />
              </div>
            </div>
            
            <div className="pt-4">
              <Button
                type="submit"
                fullWidth
              >
                Add Expense
              </Button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddPayment;
