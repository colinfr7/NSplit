
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Plus, ArrowUpRight, ArrowDownRight, Send, CreditCard, Users, Filter, CheckCircle, CircleDollarSign } from 'lucide-react';
import Button from '@/components/Button';
import EventCard from '@/components/EventCard';
import { useAuth } from '@/context/AuthContext';
import { toast } from 'sonner';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import ExpenseCard from '@/components/ExpenseCard';

const Dashboard: React.FC = () => {
  const navigate = useNavigate();
  const { isAuthenticated, user } = useAuth();
  const [paymentFilter, setPaymentFilter] = useState<'all' | 'owe' | 'owed' | 'completed'>('all');
  
  // Redirect if not authenticated
  React.useEffect(() => {
    if (!isAuthenticated) {
      navigate('/sign-in?redirect=/dashboard');
    }
  }, [isAuthenticated, navigate]);
  
  // Mock events data with user balance information
  const events = [
    {
      id: '123',
      title: 'Weekend Trip to Bali',
      date: 'June 15-18, 2023',
      participants: 4,
      totalExpenses: 750.25,
      userBalance: 85.50, // Positive: user gets money back
      expenses: [
        { id: 'exp1', title: 'Hotel', amount: 450, date: '2023-06-15', paidBy: 'Alex', splitBetween: ['Alex', 'Jamie', 'Taylor', 'Morgan'] },
        { id: 'exp2', title: 'Dinner', amount: 120, date: '2023-06-16', paidBy: 'Jamie', splitBetween: ['Alex', 'Jamie', 'Taylor', 'Morgan'] },
        { id: 'exp3', title: 'Taxi', amount: 25, date: '2023-06-17', paidBy: 'Morgan', splitBetween: ['Alex', 'Jamie', 'Taylor', 'Morgan'] },
        { id: 'exp4', title: 'Snacks', amount: 15, date: '2023-06-18', paidBy: 'Taylor', splitBetween: ['Alex', 'Jamie', 'Taylor', 'Morgan'] },
      ]
    },
    {
      id: '456',
      title: 'Dinner at Bottega',
      date: 'July 3, 2023',
      participants: 3,
      totalExpenses: 120.75,
      userBalance: -45.25, // Negative: user owes money
      expenses: [
        { id: 'exp5', title: 'Dinner Bill', amount: 120.75, date: '2023-07-03', paidBy: 'Jamie', splitBetween: ['Alex', 'Jamie', 'Taylor'] }
      ]
    },
    {
      id: '789',
      title: 'Road Trip to Big Sur',
      date: 'August 20-22, 2023',
      participants: 5,
      totalExpenses: 1250.00,
      userBalance: 0, // Neutral: user is settled up
      expenses: [
        { id: 'exp6', title: 'Gas', amount: 80, date: '2023-08-20', paidBy: 'Alex', splitBetween: ['Alex', 'Jamie', 'Taylor', 'Morgan', 'Riley'] },
        { id: 'exp7', title: 'Camping', amount: 200, date: '2023-08-20', paidBy: 'Riley', splitBetween: ['Alex', 'Jamie', 'Taylor', 'Morgan', 'Riley'] },
        { id: 'exp8', title: 'Food', amount: 350, date: '2023-08-21', paidBy: 'Morgan', splitBetween: ['Alex', 'Jamie', 'Taylor', 'Morgan', 'Riley'] },
        { id: 'exp9', title: 'Souvenirs', amount: 100, date: '2023-08-22', paidBy: 'Taylor', splitBetween: ['Alex', 'Jamie', 'Taylor', 'Morgan', 'Riley'] }
      ]
    }
  ];
  
  // Mock payment actions based on algorithm
  const paymentActions = [
    {
      id: 'pay1',
      type: 'owe',
      user: 'Jamie',
      amount: 45.25,
      event: 'Dinner at Bottega',
      date: '2023-07-03',
      status: 'pending',
      relatedExpenses: [
        { title: 'Dinner Bill', amount: 120.75, date: '2023-07-03' }
      ]
    },
    {
      id: 'pay2',
      type: 'receive',
      user: 'Alex',
      amount: 85.50,
      event: 'Weekend Trip to Bali',
      date: '2023-06-18',
      status: 'pending',
      relatedExpenses: [
        { title: 'Hotel', amount: 450, date: '2023-06-15' },
        { title: 'Dinner', amount: 120, date: '2023-06-16' }
      ]
    },
    {
      id: 'pay3',
      type: 'owe',
      user: 'Riley',
      amount: 32.80,
      event: 'Road Trip to Big Sur',
      date: '2023-08-22',
      status: 'completed',
      relatedExpenses: [
        { title: 'Camping', amount: 200, date: '2023-08-20' }
      ]
    },
    {
      id: 'pay4',
      type: 'receive',
      user: 'Morgan',
      amount: 20.75,
      event: 'Weekend Trip to Bali',
      date: '2023-06-17',
      status: 'completed',
      relatedExpenses: [
        { title: 'Taxi', amount: 25, date: '2023-06-17' }
      ]
    }
  ];
  
  // Calculate total balance
  const totalBalance = events.reduce((sum, event) => sum + (event.userBalance || 0), 0);
  const isPositiveTotalBalance = totalBalance >= 0;
  
  // Calculate how much user is owed and owes
  const totalOwed = events.reduce((sum, event) => {
    const balance = event.userBalance || 0;
    return sum + (balance > 0 ? balance : 0);
  }, 0);
  
  const totalOwing = events.reduce((sum, event) => {
    const balance = event.userBalance || 0;
    return sum + (balance < 0 ? Math.abs(balance) : 0);
  }, 0);
  
  // Count open transactions
  const openOwedTransactions = paymentActions.filter(action => action.type === 'receive' && action.status === 'pending').length;
  const openOwingTransactions = paymentActions.filter(action => action.type === 'owe' && action.status === 'pending').length;
  
  const filteredPaymentActions = paymentActions.filter(action => {
    if (paymentFilter === 'all') return action.status === 'pending';
    if (paymentFilter === 'owe') return action.type === 'owe' && action.status === 'pending';
    if (paymentFilter === 'owed') return action.type === 'receive' && action.status === 'pending';
    if (paymentFilter === 'completed') return action.status === 'completed';
    return true;
  });
  
  const handlePayNow = (userId: string, amount: number) => {
    toast.success(`Payment of $${amount.toFixed(2)} initiated`);
    // In a real app, this would open a payment flow
  };
  
  const handleSendReminder = (userId: string, amount: number) => {
    toast.success(`Reminder sent to collect $${amount.toFixed(2)}`);
    // In a real app, this would send a notification/email
  };
  
  if (!isAuthenticated) {
    return null; // Don't render anything while redirecting
  }
  
  return (
    <div className="min-h-screen pt-20 pb-12 px-4">
      <div className="max-w-lg mx-auto">
        <h1 className="text-2xl md:text-3xl font-bold mb-8">Dashboard</h1>
        
        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
          {/* Total Balance */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-5">
            <h2 className="text-sm font-medium text-gray-500 mb-1">Total Balance</h2>
            <div className="flex items-center">
              {isPositiveTotalBalance ? (
                <ArrowUpRight size={20} className="text-green-500 mr-2" />
              ) : (
                <ArrowDownRight size={20} className="text-red-500 mr-2" />
              )}
              <p className={`text-2xl font-bold ${
                isPositiveTotalBalance ? 'text-green-600' : 'text-red-600'
              }`}>
                ${Math.abs(totalBalance).toFixed(2)}
              </p>
            </div>
            <p className="text-sm text-gray-500 mt-1">
              {isPositiveTotalBalance 
                ? 'Net balance in your favor' 
                : 'Net balance you owe'}
            </p>
          </div>
          
          {/* Money Owed to You */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-5">
            <h2 className="text-sm font-medium text-gray-500 mb-1">You are owed</h2>
            <div className="flex items-center">
              <ArrowUpRight size={20} className="text-green-500 mr-2" />
              <p className="text-2xl font-bold text-green-600">
                ${totalOwed.toFixed(2)}
              </p>
            </div>
            <p className="text-sm text-gray-500 mt-1">
              {openOwedTransactions} open {openOwedTransactions === 1 ? 'transaction' : 'transactions'}
            </p>
          </div>
          
          {/* Money You Owe */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-5">
            <h2 className="text-sm font-medium text-gray-500 mb-1">You owe</h2>
            <div className="flex items-center">
              <ArrowDownRight size={20} className="text-red-500 mr-2" />
              <p className="text-2xl font-bold text-red-600">
                ${totalOwing.toFixed(2)}
              </p>
            </div>
            <p className="text-sm text-gray-500 mt-1">
              {openOwingTransactions} open {openOwingTransactions === 1 ? 'transaction' : 'transactions'}
            </p>
          </div>
        </div>
        
        {/* Payment Settlements */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 mb-8">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-lg font-semibold">Settlements</h2>
            <div className="flex items-center space-x-2">
              <button 
                onClick={() => setPaymentFilter('all')}
                className={`px-3 py-1 text-xs rounded-full ${
                  paymentFilter === 'all' 
                    ? 'bg-gray-800 text-white' 
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                All Pending
              </button>
              <button 
                onClick={() => setPaymentFilter('owe')}
                className={`px-3 py-1 text-xs rounded-full ${
                  paymentFilter === 'owe' 
                    ? 'bg-red-600 text-white' 
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                You Owe
              </button>
              <button 
                onClick={() => setPaymentFilter('owed')}
                className={`px-3 py-1 text-xs rounded-full ${
                  paymentFilter === 'owed' 
                    ? 'bg-green-600 text-white' 
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                Owed to You
              </button>
              <button 
                onClick={() => setPaymentFilter('completed')}
                className={`px-3 py-1 text-xs rounded-full ${
                  paymentFilter === 'completed' 
                    ? 'bg-blue-600 text-white' 
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                <CheckCircle size={12} className="mr-1 inline" />
                Completed
              </button>
            </div>
          </div>
          
          {filteredPaymentActions.length > 0 ? (
            <div className="space-y-4">
              {filteredPaymentActions.map(action => (
                <div 
                  key={action.id} 
                  className={`p-4 rounded-lg ${
                    action.status === 'completed' 
                      ? 'bg-gray-50 border border-gray-200' 
                      : action.type === 'owe' 
                        ? 'bg-red-50 border border-red-100' 
                        : 'bg-green-50 border border-green-100'
                  }`}
                >
                  <div className="flex justify-between items-start">
                    <div>
                      <p className="font-medium">
                        {action.type === 'owe' ? `You owe ${action.user}` : `${action.user} owes you`}
                      </p>
                      <p className="text-sm text-gray-600 mt-1">
                        {action.event} <span className="mx-1">•</span> {action.date}
                      </p>
                      
                      {/* Related expenses */}
                      {action.relatedExpenses && action.relatedExpenses.length > 0 && (
                        <div className="mt-2 pl-2 border-l-2 border-gray-200">
                          {action.relatedExpenses.slice(0, 2).map((expense, idx) => (
                            <p key={idx} className="text-xs text-gray-500">
                              {expense.title}: ${expense.amount.toFixed(2)} <span className="text-gray-400">{expense.date}</span>
                            </p>
                          ))}
                          {action.relatedExpenses.length > 2 && (
                            <p className="text-xs text-gray-500">+{action.relatedExpenses.length - 2} more expenses</p>
                          )}
                        </div>
                      )}
                    </div>
                    <div className="flex items-center">
                      <p className={`font-semibold mr-3 ${
                        action.status === 'completed' 
                          ? 'text-gray-600' 
                          : action.type === 'owe' 
                            ? 'text-red-600' 
                            : 'text-green-600'
                      }`}>
                        ${action.amount.toFixed(2)}
                      </p>
                      
                      {action.status === 'pending' && (
                        action.type === 'owe' ? (
                          <Button
                            size="sm"
                            onClick={() => handlePayNow(action.user, action.amount)}
                          >
                            <CreditCard size={14} className="mr-1" />
                            Pay Now
                          </Button>
                        ) : (
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => handleSendReminder(action.user, action.amount)}
                          >
                            <Send size={14} className="mr-1" />
                            Remind
                          </Button>
                        )
                      )}
                      
                      {action.status === 'completed' && (
                        <div className="flex items-center text-green-600">
                          <CheckCircle size={16} className="mr-1" />
                          <span className="text-sm">Settled</span>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-center text-gray-500 py-4">
              {paymentFilter === 'all' && "No pending settlements"}
              {paymentFilter === 'owe' && "You don't owe anyone right now"}
              {paymentFilter === 'owed' && "No one owes you right now"}
              {paymentFilter === 'completed' && "No completed settlements yet"}
            </p>
          )}
        </div>
        
        {/* Events and Transactions Section */}
        <div className="mb-8">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-lg font-semibold">Your Events and Transactions</h2>
            <div className="flex space-x-3">
              <Button 
                onClick={() => navigate('/create-event')}
                size="sm"
              >
                <Plus size={16} className="mr-2" />
                New Event
              </Button>
              <Button 
                variant="outline"
                onClick={() => navigate('/add-payment')}
                size="sm"
              >
                <Plus size={16} className="mr-2" />
                Add Payment
              </Button>
            </div>
          </div>
          
          {events.length > 0 ? (
            <div className="space-y-8">
              {events.map(event => (
                <div key={event.id} className="border border-gray-200 rounded-xl overflow-hidden">
                  {/* Event Card */}
                  <div className="cursor-pointer" onClick={() => navigate(`/event/${event.id}`)}>
                    <EventCard event={event} />
                  </div>
                  
                  {/* Event Summary */}
                  <div className="p-4 border-t border-gray-200 bg-gray-50">
                    <div className="flex justify-between items-center mb-3">
                      <h3 className="text-sm font-medium text-gray-700">
                        Transactions Summary
                      </h3>
                      <p className="text-xs text-gray-500">
                        {event.expenses.length} {event.expenses.length === 1 ? 'expense' : 'expenses'} • {event.participants} {event.participants === 1 ? 'participant' : 'participants'}
                      </p>
                    </div>
                    
                    {/* Expenses List */}
                    <div className="space-y-3">
                      {event.expenses.map((expense) => (
                        <div key={expense.id} className="p-3 bg-white rounded-lg border border-gray-100 shadow-sm">
                          <div className="flex justify-between">
                            <div>
                              <p className="font-medium">{expense.title}</p>
                              <p className="text-xs text-gray-500 mt-1">
                                Paid by {expense.paidBy} • Split {expense.splitBetween.length} ways
                              </p>
                            </div>
                            <div className="text-right">
                              <p className="font-medium">${expense.amount.toFixed(2)}</p>
                              <p className={`text-xs ${
                                expense.paidBy === 'Alex' 
                                  ? 'text-green-600' 
                                  : 'text-gray-500'
                              }`}>
                                {expense.paidBy === 'Alex' ? (
                                  `You paid • You get back $${(expense.amount - (expense.amount / expense.splitBetween.length)).toFixed(2)}`
                                ) : (
                                  `You owe $${(expense.amount / expense.splitBetween.length).toFixed(2)}`
                                )}
                              </p>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-12 bg-gray-50 rounded-lg border border-gray-200">
              <CircleDollarSign size={48} className="mx-auto text-gray-300 mb-4" />
              <h3 className="text-lg font-medium text-gray-700 mb-2">No events yet</h3>
              <p className="text-gray-500 mb-6">Create your first event to start tracking expenses</p>
              <Button 
                onClick={() => navigate('/create-event')}
              >
                <Plus size={16} className="mr-2" />
                Create Event
              </Button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
