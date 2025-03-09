
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Plus, CreditCard, Clock } from 'lucide-react';
import Button from '@/components/Button';
import EventCard from '@/components/EventCard';

// Mock data for recent events
const recentEvents = [
  {
    id: '123',
    title: 'Weekend Trip to Bali',
    date: 'June 15-18, 2023',
    participants: 4,
    totalExpenses: 516.25,
  },
  {
    id: '456',
    title: 'Birthday Dinner',
    date: 'May 27, 2023',
    participants: 6,
    totalExpenses: 241.80,
  },
  {
    id: '789',
    title: 'Monthly Apartment Expenses',
    date: 'June 1, 2023',
    participants: 3,
    totalExpenses: 320.45,
  },
];

// Mock data for recent activities
const recentActivities = [
  {
    id: '1',
    type: 'payment',
    title: 'Jamie added "Dinner at La Trattoria"',
    amount: 120.50,
    time: '2 hours ago',
  },
  {
    id: '2',
    type: 'settlement',
    title: 'You paid Jordan',
    amount: 45.75,
    time: 'Yesterday',
  },
  {
    id: '3',
    type: 'payment',
    title: 'Taylor added "Hotel Booking"',
    amount: 350.00,
    time: 'Yesterday',
  },
];

const Dashboard: React.FC = () => {
  const navigate = useNavigate();
  
  return (
    <div className="min-h-screen pt-20 pb-12">
      <div className="container-content">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8">
          <h1 className="text-2xl md:text-3xl font-bold mb-4 md:mb-0">Your Events</h1>
          <Button onClick={() => navigate('/create-event')}>
            <Plus size={16} className="mr-2" />
            Create Event
          </Button>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
          {recentEvents.map(event => (
            <EventCard key={event.id} event={event} />
          ))}
        </div>
        
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
          <h2 className="text-xl font-semibold mb-6">Recent Activity</h2>
          
          <div className="space-y-4">
            {recentActivities.map(activity => (
              <div 
                key={activity.id}
                className="flex items-center p-3 hover:bg-gray-50 rounded-lg transition-colors"
              >
                <div className="mr-4 p-2 rounded-full bg-nsplit-50">
                  {activity.type === 'payment' ? (
                    <CreditCard size={20} className="text-nsplit-600" />
                  ) : (
                    <Clock size={20} className="text-nsplit-600" />
                  )}
                </div>
                
                <div className="flex-grow">
                  <h3 className="text-sm font-medium text-gray-900">{activity.title}</h3>
                  <p className="text-xs text-gray-500">{activity.time}</p>
                </div>
                
                <div className="text-right">
                  <p className="font-semibold text-gray-900">${activity.amount.toFixed(2)}</p>
                </div>
              </div>
            ))}
          </div>
          
          <div className="mt-6 text-center">
            <Button variant="outline" size="sm">
              View All Activity
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
