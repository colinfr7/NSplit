
import React from 'react';
import { DollarSign, User } from 'lucide-react';

interface ExpenseCardProps {
  expense: {
    id: string;
    title: string;
    amount: number;
    date: string;
    paidBy: string;
    splitBetween: string[];
  };
}

const ExpenseCard: React.FC<ExpenseCardProps> = ({ expense }) => {
  // Format the date
  const formattedDate = new Date(expense.date).toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
  });
  
  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-100 p-4 transition-all hover:shadow-md">
      <div className="flex justify-between items-start">
        <div>
          <h3 className="font-medium text-gray-900">{expense.title}</h3>
          <div className="flex items-center mt-1 text-sm text-gray-500">
            <span>{formattedDate}</span>
            <span className="mx-2">•</span>
            <span className="flex items-center">
              <User size={14} className="mr-1" />
              {expense.paidBy} paid
            </span>
          </div>
        </div>
        <div className="text-right">
          <p className="font-semibold text-gray-900">${expense.amount.toFixed(2)}</p>
          <p className="text-xs text-gray-500 mt-1">
            Split {expense.splitBetween.length} ways
          </p>
        </div>
      </div>
      
      {/* Preview of split */}
      <div className="mt-3 pt-3 border-t border-gray-100">
        <div className="flex items-center text-sm text-gray-600">
          <DollarSign size={14} className="mr-1 text-gray-400" />
          <span className="text-xs">
            {expense.splitBetween.slice(0, 2).join(', ')}
            {expense.splitBetween.length > 2 && ` +${expense.splitBetween.length - 2} more`}
          </span>
        </div>
      </div>
    </div>
  );
};

export default ExpenseCard;
