import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Plus, ArrowUpRight, ArrowDownRight, Send, CreditCard, Users, Filter, CheckCircle, CircleDollarSign, Calendar, Bell, X, Clock, Cash } from 'lucide-react';
import Button from '@/components/Button';
import EventCard from '@/components/EventCard';
import { useAuth } from '@/context/AuthContext';
import { toast } from '@/hooks/use-toast';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Switch } from "@/components/ui/switch";
import ExpenseCard from '@/components/ExpenseCard';
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";

const Dashboard: React.FC = () => {
  const navigate = useNavigate();
  const { isAuthenticated, user } = useAuth();
  const [showCompleted, setShowCompleted] = useState(false);
  const [paymentFilter, setPaymentFilter] = useState<'all' | 'owe' | 'owed'>('all');
  const [notifications, setNotifications] = useState<Array<{
    id: string;
    type: 'crypto_completed' | 'cash_pending';
    amount: number;
    from: string;
    to: string;
    date: string;
    event?: string;
    needsConfirmation?: boolean;
  }>>([
    {
      id: 'notif1',
      type: 'crypto_completed',
      amount: 25.50,
      from: 'Jamie',
      to: 'You',
      date: '2 hours ago',
      event: 'Weekend Trip to Bali'
    },
    {
      id: 'notif2',
      type: 'cash_pending',
      amount: 15.75,
      from: 'Morgan',
      to: 'You',
      date: '1 day ago',
      event: 'Dinner at Bottega',
      needsConfirmation: true
    }
  ]);
  
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
  
  // Calculate total events and transactions statistics
  const totalEvents = events.length;
  const totalTransactions = events.reduce((sum, event) => sum + event.expenses.length, 0);
  const totalSplitTransactions = events.reduce((sum, event) => {
    return sum + event.expenses.filter(exp => exp.splitBetween.length > 1).length;
  }, 0);
  
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
    if (!showCompleted && action.status === 'completed') return false;
    
    if (paymentFilter === 'all') return true;
    if (paymentFilter === 'owe') return action.type === 'owe';
    if (paymentFilter === 'owed') return action.type === 'receive';
    return true;
  });
  
  const handlePayNow = (userId: string, amount: number, event?: string) => {
    navigate('/crypto-payment', {
      state: {
        paymentDetails: {
          to: userId,
          amount: amount,
          event: event
        }
      }
    });
  };
  
  const handleSendReminder = (userId: string, amount: number) => {
    toast({
      title: "Reminder Sent",
      description: `Reminder sent to collect $${amount.toFixed(2)}`,
    });
    // In a real app, this would send a notification/email
  };

  const handleMarkAsCompleted = (actionId: string) => {
    toast({
      title: "Payment Completed",
      description: "The payment has been marked as completed",
    });
    // In a real app, this would update the payment status
  };

  const handleConfirmCashPayment = (notificationId: string) => {
    setNotifications(prev => prev.filter(n => n.id !== notificationId));
    toast({
      title: "Payment Confirmed",
      description: "You have confirmed receiving this cash payment",
    });
    // In a real app, this would update the payment status
  };

  const handleDismissNotification = (notificationId: string) => {
    setNotifications(prev => prev.filter(n => n.id !== notificationId));
  };
  
  if (!isAuthenticated) {
    return null; // Don't render anything while redirecting
  }
  
  return (
    <div className="min-h-screen pt-20 pb-12 px-4">
      <div className="max-w-lg mx-auto">
        <h1 className="text-2xl md:text-3xl font-bold mb-8">Dashboard</h1>
        
        {/* Stats Cards - Make Balance more prominent */}
        <div className="grid grid-cols-1 gap-4 mb-8">
          {/* Total Balance - Made larger */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
            <h2 className="text-sm font-medium text-gray-500 mb-1">Total Balance</h2>
            <div className="flex items-center">
              {isPositiveTotalBalance ? (
                <ArrowUpRight size={24} className="text-green-500 mr-2" />
              ) : (
                <ArrowDownRight size={24} className="text-red-500 mr-2" />
              )}
              <p className={`text-3xl font-bold ${
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
          
          {/* Secondary cards in a single row */}
          <div className="grid grid-cols-2 gap-4">
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
        </div>

        {/* Notifications Section - Improved styling */}
        {notifications.length > 0 && (
          <div className="mb-8">
            <div className="flex items-center mb-4">
              <Bell size={18} className="mr-2 text-nsplit-600" />
              <h2 className="text-lg font-semibold">Notifications</h2>
            </div>
            
            <div className="space-y-3">
              {notifications.map(notification => (
                <Alert 
                  key={notification.id} 
                  className={notification.type === 'crypto_completed' ? "bg-green-50 border-green-100" : "bg-blue-50 border-blue-100"}
                >
                  <div className="flex justify-between items-start">
                    <div className="flex-1">
                      <p className="text-sm">
                        {notification.type === 'crypto_completed' 
                          ? `${notification.from} sent you $${notification.amount.toFixed(2)} via crypto payment.` 
                          : `${notification.from} marked a cash payment of $${notification.amount.toFixed(2)} as completed.`}
                      </p>
                      {notification.event && (
                        <p className="text-xs text-gray-600 mt-1">Event: {notification.event}</p>
                      )}
                      <p className="text-xs text-gray-500 mt-1">{notification.date}</p>
                    </div>
                    <div className="flex items-center space-x-2">
                      {notification.needsConfirmation && (
                        <Button 
                          size="sm" 
                          variant="outline"
                          onClick={() => handleConfirmCashPayment(notification.id)}
                        >
                          <CheckCircle size={14} className="mr-1" />
                          Confirm
                        </Button>
                      )}
                      <button 
                        onClick={() => handleDismissNotification(notification.id)}
                        className="text-gray-400 hover:text-gray-600"
                      >
                        <X size={16} />
                      </button>
                    </div>
                  </div>
                </Alert>
              ))}
            </div>
          </div>
        )}
        
        {/* Settlements - Improved heading consistency and UX */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 mb-8">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-lg font-semibold">Settlements</h2>
            <div className="flex items-center space-x-2">
              <Switch
                checked={showCompleted}
                onCheckedChange={setShowCompleted}
                id="show-completed"
              />
              <label
                htmlFor="show-completed"
                className="text-sm font-medium leading-none cursor-pointer"
              >
                Include completed
              </label>
            </div>
          </div>
          
          {/* Improved filter UI */}
          <div className="flex flex-col mb-5">
            <div className="flex gap-2 mb-3">
              <button 
                onClick={() => setPaymentFilter('all')}
                className={`flex-1 px-4 py-2 text-sm rounded-md transition-colors ${
                  paymentFilter === 'all' 
                    ? 'bg-gray-800 text-white' 
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                All
              </button>
              <button 
                onClick={() => setPaymentFilter('owe')}
                className={`flex-1 px-4 py-2 text-sm rounded-md transition-colors ${
                  paymentFilter === 'owe' 
                    ? 'bg-red-600 text-white' 
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                You Owe
              </button>
              <button 
                onClick={() => setPaymentFilter('owed')}
                className={`flex-1 px-4 py-2 text-sm rounded-md transition-colors ${
                  paymentFilter === 'owed' 
                    ? 'bg-green-600 text-white' 
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                Owed to You
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
                      
                      {/* Show payment method for amounts you owe */}
                      {action.type === 'owe' && action.status === 'pending' && (
                        <p className="text-xs text-gray-500 mt-1 flex items-center">
                          <span className="mr-1">Preferred payment:</span>
                          {action.id === 'pay1' ? (
                            <span className="flex items-center text-nsplit-600">
                              <CreditCard size={12} className="mr-1" /> Crypto
                            </span>
                          ) : (
                            <span className="flex items-center text-nsplit-600">
                              <Cash size={12} className="mr-1" /> Cash
                            </span>
                          )}
                        </p>
                      )}
                      
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
                        <div className="flex flex-col space-y-1">
                          {action.type === 'owe' ? (
                            <>
                              <Button
                                size="sm"
                                onClick={() => handlePayNow(action.user, action.amount, action.event)}
                              >
                                <CreditCard size={14} className="mr-1" />
                                Pay Now
                              </Button>
                              <a 
                                href="#" 
                                className="text-xs text-center text-gray-500 hover:text-gray-700 underline"
                                onClick={(e) => {
                                  e.preventDefault();
                                  handleMarkAsCompleted(action.id);
                                }}
                              >
                                Mark as completed
                              </a>
                            </>
                          ) : (
                            <>
                              <Button
                                size="sm"
                                variant="outline"
                                onClick={() => handleSendReminder(action.user, action.amount)}
                              >
                                <Send size={14} className="mr-1" />
                                Remind
                              </Button>
                              <a 
                                href="#" 
                                className="text-xs text-center text-gray-500 hover:text-gray-700 underline"
                                onClick={(e) => {
                                  e.preventDefault();
                                  handleMarkAsCompleted(action.id);
                                }}
                              >
                                Mark as completed
                              </a>
                            </>
                          )}
                        </div>
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
              {paymentFilter === 'all' && !showCompleted && "No pending settlements"}
              {paymentFilter === 'all' && showCompleted && "No settlements found"}
              {paymentFilter === 'owe' && !showCompleted && "You don't owe anyone right now"}
              {paymentFilter === 'owe' && showCompleted && "No payments you owe found"}
              {paymentFilter === 'owed' && !showCompleted && "No one owes you right now"}
              {paymentFilter === 'owed' && showCompleted && "No payments owed to you found"}
            </p>
          )}
        </div>
        
        {/* Events and Payments Section - Consistent heading style */}
        <div className="mb-8">
          <div className="flex justify-between items-center mb-6">
            <div>
              <h2 className="text-lg font-semibold">Your Events & Payments</h2>
              <p className="text-xs text-gray-500 mt-1">
                {totalEvents} events • {totalTransactions} transactions • {totalSplitTransactions} split transactions
              </p>
            </div>
            <div className="flex space-x-3">
              <Button 
                onClick={() => navigate('/create-event')}
                size="sm"
              >
                <Plus size={16} className="mr-2" />
                New Event
              </Button>
            </div>
          </div>
          
          {events.length > 0 ? (
            <div className="space-y-8">
              {events.map(event => (
                <div key={event.id} className="border border-gray-200 rounded-xl overflow-hidden">
                  {/* Event Card with Add Payment button in top-right */}
                  <div className="relative">
                    <EventCard event={event} />
                    <div className="absolute top-4 right-4">
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={(e) => {
                          e.stopPropagation();
                          navigate(`/event/${event.id}/add-payment`);
                        }}
                      >
                        <Plus size={14} className="mr-1" />
                        Add Payment
                      </Button>
                    </div>
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
                                {expense.date}
                              </p>
                            </div>
                            <div className="text-right">
                              <p className="font-medium">${expense.amount.toFixed(2)}</p>
                              <p className={`text-xs ${
                                expense.paidBy === 'Alex' 
                                  ? 'text-green-600' 
                                  : 'text-gray-500'
                              }`}>
                                {expense.paidBy === 'Alex' 
                                  ? `You paid • Get back $${(expense.amount - (expense.amount / expense.splitBetween.length)).toFixed(2)}` 
                                  : `${expense.paidBy} paid • Owe $${(expense.amount / expense.splitBetween.length)).toFixed(2)}`}
                              </p>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                    
                    {/* Event balance summary */}
                    {event.userBalance !== undefined && (
                      <div className={`mt-4 p-3 rounded-lg border ${
                        event.userBalance > 0
                          ? 'bg-green-50 border-green-100'
                          : event.userBalance < 0
                            ? 'bg-red-50 border-red-100'
                            : 'bg-gray-50 border-gray-100'
                      }`}>
                        <p className="font-medium text-sm">
                          Balance for this event: 
                          <span className={`ml-2 ${
                            event.userBalance > 0
                              ? 'text-green-600'
                              : event.userBalance < 0
                                ? 'text-red-600'
                                : 'text-gray-600'
                          }`}>
                            {event.userBalance > 0 
                              ? `You get back $${event.userBalance.toFixed(2)}` 
                              : event.userBalance < 0
                                ? `You owe $${Math.abs(event.userBalance).toFixed(2)}`
                                : 'Settled'}
                          </span>
                        </p>
                      </div>
                    )}

                    {/* Add Payment button at bottom */}
                    <div className="mt-4 flex justify-end">
                      <Button
                        size="sm"
                        onClick={() => navigate(`/event/${event.id}/add-payment`)}
                      >
                        <Plus size={14} className="mr-1" />
                        Add Payment
                      </Button>
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
