
import React, { useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { ArrowLeft, Plus, DollarSign, UserCircle, Users, BarChart, Download, Calendar } from 'lucide-react';
import Button from '@/components/Button';
import ExpenseCard from '@/components/ExpenseCard';
import BalanceCard from '@/components/BalanceCard';

// Mock data for the UI
const mockExpenses = [
  {
    id: '1',
    title: 'Dinner at La Trattoria',
    amount: 120.50,
    date: '2023-06-15',
    paidBy: 'Alex',
    splitBetween: ['Alex', 'Jamie', 'Taylor', 'Jordan'],
  },
  {
    id: '2',
    title: 'Taxi to Airport',
    amount: 45.75,
    date: '2023-06-16',
    paidBy: 'Jamie',
    splitBetween: ['Alex', 'Jamie', 'Taylor'],
  },
  {
    id: '3',
    title: 'Hotel Booking',
    amount: 350.00,
    date: '2023-06-16',
    paidBy: 'Taylor',
    splitBetween: ['Alex', 'Jamie', 'Taylor', 'Jordan'],
  },
];

const mockBalances = [
  { user: 'Alex', balance: 85.25 },
  { user: 'Jamie', balance: -45.50 },
  { user: 'Taylor', balance: 120.75 },
  { user: 'Jordan', balance: -160.50 },
];

const EventDetail: React.FC = () => {
  const navigate = useNavigate();
  const { eventId } = useParams<{ eventId: string }>();
  const [activeTab, setActiveTab] = useState<'expenses' | 'balances'>('expenses');
  
  // Mock event data
  const event = {
    id: eventId,
    title: 'Weekend Trip to Bali',
    date: 'June 15-18, 2023',
    participants: ['Alex', 'Jamie', 'Taylor', 'Jordan'],
    totalExpenses: mockExpenses.reduce((sum, expense) => sum + expense.amount, 0),
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
        
        <div className="flex justify-between items-start mb-4">
          <h1 className="text-2xl md:text-3xl font-bold">{event.title}</h1>
          <Button 
            variant="outline" 
            size="sm"
            onClick={() => navigate('/event/123/settings')}
          >
            Edit
          </Button>
        </div>
        
        <div className="flex items-center space-x-2 text-gray-500 mb-6">
          <Calendar size={16} />
          <span>{event.date}</span>
          <span className="mx-2">•</span>
          <Users size={16} />
          <span>{event.participants.length} participants</span>
        </div>
        
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-4 mb-6">
          <div className="flex justify-between items-center">
            <div>
              <h3 className="text-sm font-medium text-gray-500">Total Expenses</h3>
              <p className="text-2xl font-bold">${event.totalExpenses.toFixed(2)}</p>
            </div>
            <Button
              onClick={() => navigate(`/event/${eventId}/add-payment`)}
              size="sm"
            >
              <Plus size={16} className="mr-2" />
              Add Expense
            </Button>
          </div>
        </div>
        
        <div className="flex border-b border-gray-200 mb-6">
          <button
            className={`flex items-center px-4 py-2 border-b-2 font-medium text-sm ${
              activeTab === 'expenses' 
                ? 'border-nsplit-600 text-nsplit-600' 
                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
            }`}
            onClick={() => setActiveTab('expenses')}
          >
            <DollarSign size={16} className="mr-1" />
            Expenses
          </button>
          <button
            className={`flex items-center px-4 py-2 border-b-2 font-medium text-sm ${
              activeTab === 'balances' 
                ? 'border-nsplit-600 text-nsplit-600' 
                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
            }`}
            onClick={() => setActiveTab('balances')}
          >
            <BarChart size={16} className="mr-1" />
            Balances
          </button>
        </div>
        
        {activeTab === 'expenses' ? (
          <div className="space-y-4">
            {mockExpenses.map(expense => (
              <ExpenseCard key={expense.id} expense={expense} />
            ))}
          </div>
        ) : (
          <div className="space-y-6">
            {mockBalances.map((balance, index) => (
              <BalanceCard key={index} user={balance.user} balance={balance.balance} />
            ))}
            <div className="flex justify-center mt-6">
              <Button variant="outline" className="mr-3">
                <Download size={16} className="mr-2" />
                Export
              </Button>
              <Button>
                Settle Up
              </Button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default EventDetail;
