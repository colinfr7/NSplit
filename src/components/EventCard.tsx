
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Calendar, Users } from 'lucide-react';

interface EventCardProps {
  event: {
    id: string;
    title: string;
    date: string;
    participants: number;
    totalExpenses: number;
  };
}

const EventCard: React.FC<EventCardProps> = ({ event }) => {
  const navigate = useNavigate();
  
  return (
    <div 
      className="bg-white rounded-xl shadow-sm border border-gray-100 p-5 cursor-pointer transition-all hover:shadow-md"
      onClick={() => navigate(`/event/${event.id}`)}
    >
      <h3 className="font-medium text-lg text-gray-900">{event.title}</h3>
      
      <div className="flex items-center mt-2 text-sm text-gray-500">
        <Calendar size={14} className="mr-1" />
        <span>{event.date}</span>
        <span className="mx-2">•</span>
        <Users size={14} className="mr-1" />
        <span>{event.participants} participants</span>
      </div>
      
      <div className="mt-4 pt-4 border-t border-gray-100 flex justify-between items-center">
        <div>
          <p className="text-xs text-gray-500">Total expenses</p>
          <p className="font-semibold text-gray-900">${event.totalExpenses.toFixed(2)}</p>
        </div>
        
        <div className="text-right">
          <div className="inline-flex items-center justify-center px-2.5 py-0.5 rounded-full bg-nsplit-50 text-nsplit-600 text-xs font-medium">
            Active
          </div>
        </div>
      </div>
    </div>
  );
};

export default EventCard;
