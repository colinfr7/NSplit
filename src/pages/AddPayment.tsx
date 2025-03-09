
import React, { useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { ArrowLeft, Calendar, DollarSign, Users, X } from 'lucide-react';
import Button from '@/components/Button';
import { toast } from "sonner";

const AddPayment: React.FC = () => {
  const navigate = useNavigate();
  const { eventId } = useParams<{ eventId: string }>();
  const [expenseTitle, setExpenseTitle] = useState('');
  const [amount, setAmount] = useState('');
  const [date, setDate] = useState(new Date().toISOString().split('T')[0]);
  const [paidBy, setPaidBy] = useState('You');
  const [splitEvenly, setSplitEvenly] = useState(true);
  const [loading, setLoading] = useState(false);
  
  // Mock event participants
  const participants = ['You', 'Alex', 'Jamie', 'Taylor', 'Jordan'];
  const [selectedParticipants, setSelectedParticipants] = useState<string[]>([...participants]);
  
  const handleParticipantToggle = (participant: string) => {
    if (selectedParticipants.includes(participant)) {
      // Don't allow deselecting if only one participant would remain
      if (selectedParticipants.length <= 1) {
        toast.error("At least one participant must be selected");
        return;
      }
      setSelectedParticipants(selectedParticipants.filter(p => p !== participant));
    } else {
      setSelectedParticipants([...selectedParticipants, participant]);
    }
  };
  
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Simple validation
    if (!expenseTitle.trim()) {
      toast.error("Please enter an expense title");
      return;
    }
    
    if (!amount || isNaN(parseFloat(amount)) || parseFloat(amount) <= 0) {
      toast.error("Please enter a valid amount");
      return;
    }
    
    // Simulate form submission
    setLoading(true);
    
    // Mock API call
    setTimeout(() => {
      // Success - go back to event page
      toast.success("Expense added successfully!");
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
        
        <h1 className="text-2xl md:text-3xl font-bold mb-6">Add an Expense</h1>
        
        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label htmlFor="expense-title" className="block text-sm font-medium text-gray-700 mb-1">
              What was this expense for?
            </label>
            <input
              id="expense-title"
              type="text"
              value={expenseTitle}
              onChange={(e) => setExpenseTitle(e.target.value)}
              placeholder="Dinner, Tickets, Taxi, etc."
              className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-nsplit-500 focus:border-nsplit-500 outline-none transition-colors"
            />
          </div>
          
          <div>
            <label htmlFor="amount" className="block text-sm font-medium text-gray-700 mb-1">
              <div className="flex items-center">
                <DollarSign size={16} className="mr-1" />
                How much was it?
              </div>
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                <span className="text-gray-500">$</span>
              </div>
              <input
                id="amount"
                type="number"
                step="0.01"
                min="0"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                placeholder="0.00"
                className="w-full pl-8 pr-4 py-2 border border-gray-300 rounded-md focus:ring-nsplit-500 focus:border-nsplit-500 outline-none transition-colors"
              />
            </div>
          </div>
          
          <div>
            <label htmlFor="date" className="block text-sm font-medium text-gray-700 mb-1">
              <div className="flex items-center">
                <Calendar size={16} className="mr-1" />
                When was this?
              </div>
            </label>
            <input
              id="date"
              type="date"
              value={date}
              onChange={(e) => setDate(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-nsplit-500 focus:border-nsplit-500 outline-none transition-colors"
            />
          </div>
          
          <div>
            <label htmlFor="paidBy" className="block text-sm font-medium text-gray-700 mb-1">
              Who paid?
            </label>
            <select
              id="paidBy"
              value={paidBy}
              onChange={(e) => setPaidBy(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-nsplit-500 focus:border-nsplit-500 outline-none transition-colors"
            >
              {participants.map((participant) => (
                <option key={participant} value={participant}>{participant}</option>
              ))}
            </select>
          </div>
          
          <div>
            <div className="flex justify-between items-center mb-2">
              <label className="block text-sm font-medium text-gray-700">
                <div className="flex items-center">
                  <Users size={16} className="mr-1" />
                  Split between who?
                </div>
              </label>
              <button
                type="button"
                onClick={() => setSplitEvenly(!splitEvenly)}
                className="text-xs font-medium text-nsplit-600 hover:text-nsplit-700"
              >
                {splitEvenly ? "Split Unevenly" : "Split Evenly"}
              </button>
            </div>
            
            <div className="space-y-2">
              {participants.map((participant) => (
                <div 
                  key={participant}
                  className={`flex items-center justify-between p-3 rounded-md border ${
                    selectedParticipants.includes(participant) 
                      ? 'border-nsplit-300 bg-nsplit-50' 
                      : 'border-gray-200'
                  }`}
                >
                  <span>{participant}</span>
                  
                  <button
                    type="button"
                    onClick={() => handleParticipantToggle(participant)}
                    className={`p-1 rounded-full ${
                      selectedParticipants.includes(participant)
                        ? 'text-nsplit-600 hover:bg-nsplit-100'
                        : 'text-gray-400 hover:bg-gray-100'
                    }`}
                  >
                    {selectedParticipants.includes(participant) ? (
                      <X size={16} />
                    ) : (
                      <Plus size={16} />
                    )}
                  </button>
                </div>
              ))}
            </div>
            
            {!splitEvenly && (
              <div className="mt-4 text-sm text-gray-500">
                Custom split options would go here (not implemented in this UI prototype)
              </div>
            )}
          </div>
          
          <div className="pt-4">
            <Button type="submit" fullWidth isLoading={loading}>
              Save Expense
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddPayment;
