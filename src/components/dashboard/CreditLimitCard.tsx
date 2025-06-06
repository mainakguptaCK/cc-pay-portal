import React from 'react';
import { PieChart, DollarSign, ArrowUp } from 'lucide-react';
import Card, { CardBody } from '../ui/Card';
import { CreditCard } from '../../types';

interface CreditLimitCardProps {
  card: CreditCard;
}

const CreditLimitCard: React.FC<CreditLimitCardProps> = ({ card }) => {
  const { creditLimit, availableLimit, totalOutstanding } = card;
  
  // Calculate percentage of credit used
  const percentUsed = ((creditLimit - availableLimit) / creditLimit) * 100;
  const formattedPercentUsed = percentUsed.toFixed(0);
  
  // Format currency
  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
    }).format(amount);
  };
  
  return (
    <Card className="h-full">
      <CardBody>
        <div className="flex justify-between items-start mb-4">
          <h3 className="font-semibold text-lg text-gray-800">Credit Overview</h3>
          <div className="bg-blue-50 p-2 rounded-full">
            <PieChart size={20} className="text-blue-900" />
          </div>
        </div>
        
        <div className="mb-6">
          <div className="h-2 w-full bg-gray-200 rounded-full overflow-hidden">
            <div 
              className={`h-full rounded-full ${
                percentUsed > 80 ? 'bg-red-500' : percentUsed > 50 ? 'bg-amber-500' : 'bg-emerald-500'
              }`}
              style={{ width: `${percentUsed}%` }}
            />
          </div>
          <div className="flex justify-between mt-2 text-sm text-gray-500">
            <span>{formattedPercentUsed}% Used</span>
            <span>{(100 - percentUsed).toFixed(0)}% Available</span>
          </div>
        </div>
        
        <div className="space-y-4">
          <div className="flex justify-between items-center">
            <div>
              <p className="text-sm text-gray-500 mb-1">Total Credit Limit</p>
              <p className="text-lg font-semibold flex items-center">
                <p className="text-gray-400 mr-1" />
                {formatCurrency(creditLimit)}
              </p>
            </div>
            <div className="bg-blue-50 p-1.5 rounded-full">
              <ArrowUp size={16} className="text-blue-700" />
            </div>
          </div>
          
          <div className="flex justify-between items-center">
            <div>
              <p className="text-sm text-gray-500 mb-1">Available Credit</p>
              <p className="text-lg font-semibold">{formatCurrency(availableLimit)}</p>
            </div>
          </div>
          
          <div className="flex justify-between items-center">
            <div>
              <p className="text-sm text-gray-500 mb-1">Current Balance</p>
              <p className="text-lg font-semibold">{formatCurrency(totalOutstanding)}</p>
            </div>
          </div>
        </div>
      </CardBody>
    </Card>
  );
};

export default CreditLimitCard;