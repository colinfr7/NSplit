
import React from 'react';
import { ArrowRight } from 'lucide-react';
import Button from './Button';

interface BalanceCardProps {
  user: string;
  balance: number;
}

const BalanceCard: React.FC<BalanceCardProps> = ({ user, balance }) => {
  const isPositive = balance > 0;
  
  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-100 p-4">
      <div className="flex justify-between items-center">
        <div className="flex items-center">
          <div className="w-10 h-10 rounded-full bg-gray-100 flex items-center justify-center mr-3">
            <span className="text-gray-700 font-medium">
              {user.charAt(0).toUpperCase()}
            </span>
          </div>
          <div>
            <h3 className="font-medium text-gray-900">{user}</h3>
            <p className={`text-sm ${isPositive ? 'text-green-600' : 'text-red-600'}`}>
              {isPositive ? 'gets back' : 'owes'} ${Math.abs(balance).toFixed(2)}
            </p>
          </div>
        </div>
        
        {!isPositive && (
          <Button size="sm" variant="outline">
            Pay {user} <ArrowRight size={14} className="ml-1" />
          </Button>
        )}
      </div>
    </div>
  );
};

export default BalanceCard;
