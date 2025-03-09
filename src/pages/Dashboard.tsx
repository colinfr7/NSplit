
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Plus, ArrowUpRight, ArrowDownRight, Send, CreditCard } from 'lucide-react';
import Button from '@/components/Button';
import EventCard from '@/components/EventCard';
import { useAuth } from '@/context/AuthContext';
import { toast } from 'sonner';

const Dashboard: React.FC = () => {
  const navigate = useNavigate();
  const { isAuthenticated, user } = useAuth();
  
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
      userBalance: 85.50 // Positive: user gets money back
    },
    {
      id: '456',
      title: 'Dinner at Bottega',
      date: 'July 3, 2023',
      participants: 3,
      totalExpenses: 120.75,
      userBalance: -45.25 // Negative: user owes money
    },
    {
      id: '789',
      title: 'Road Trip to Big Sur',
      date: 'August 20-22, 2023',
      participants: 5,
      totalExpenses: 1250.00,
      userBalance: 0 // Neutral: user is settled up
    }
  ];
  
  // Mock payment actions based on algorithm
  const paymentActions = [
    {
      id: 'pay1',
      type: 'owe',
      user: 'Jamie',
      amount: 45.25,
      event: 'Dinner at Bottega'
    },
    {
      id: 'pay2',
      type: 'receive',
      user: 'Alex',
      amount: 85.50,
      event: 'Weekend Trip to Bali'
    }
  ];
  
  // Calculate total balance
  const totalBalance = events.reduce((sum, event) => sum + (event.userBalance || 0), 0);
  const isPositiveTotalBalance = totalBalance >= 0;
  
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
        
        {/* Balance Card */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 mb-8">
          <h2 className="text-sm font-medium text-gray-500 mb-1">Your Total Balance</h2>
          <div className="flex items-center">
            {isPositiveTotalBalance ? (
              <ArrowUpRight size={20} className="text-green-500 mr-2" />
            ) : (
              <ArrowDownRight size={20} className="text-red-500 mr-2" />
            )}
            <p className={`text-3xl font-bold ${
              isPositiveTotalBalance ? 'text-green-600' : 'text-red-600'
            }`}>
              ${Math.abs(totalBalance).toFixed(2)}
            </p>
          </div>
          <p className="text-sm text-gray-500 mt-1">
            {isPositiveTotalBalance 
              ? 'You are owed in total' 
              : 'You owe in total'}
          </p>
        </div>
        
        {/* Payment Actions */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 mb-8">
          <h2 className="text-lg font-semibold mb-4">Payments</h2>
          
          {paymentActions.length > 0 ? (
            <div className="space-y-4">
              {paymentActions.map(action => (
                <div key={action.id} className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
                  <div>
                    <p className="font-medium">
                      {action.type === 'owe' ? 'You owe' : 'You receive'}
                    </p>
                    <p className="text-sm text-gray-600">
                      {action.type === 'owe' ? `Pay ${action.user}` : `From ${action.user}`} 
                      <span className="mx-1">•</span>
                      {action.event}
                    </p>
                  </div>
                  <div className="flex items-center">
                    <p className={`font-semibold mr-3 ${
                      action.type === 'owe' ? 'text-red-600' : 'text-green-600'
                    }`}>
                      ${action.amount.toFixed(2)}
                    </p>
                    {action.type === 'owe' ? (
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
                    )}
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-center text-gray-500 py-4">No pending payments</p>
          )}
        </div>
        
        {/* Actions */}
        <div className="flex space-x-3 mb-8">
          <Button 
            onClick={() => navigate('/create-event')}
            className="flex-1"
          >
            <Plus size={16} className="mr-2" />
            New Event
          </Button>
          <Button 
            variant="outline"
            onClick={() => navigate('/add-payment')}
            className="flex-1"
          >
            <Plus size={16} className="mr-2" />
            Add Payment
          </Button>
        </div>
        
        {/* Recent Events */}
        <div className="mb-8">
          <h2 className="text-lg font-semibold mb-4">Your Events</h2>
          <div className="space-y-4">
            {events.map(event => (
              <EventCard key={event.id} event={event} />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
