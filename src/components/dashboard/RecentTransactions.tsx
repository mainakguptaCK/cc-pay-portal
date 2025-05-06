import React from 'react';
import { Calendar, ArrowUp, ArrowDown, ShoppingBag, Coffee, Music, Smartphone } from 'lucide-react';
import Card, { CardBody, CardHeader } from '../ui/Card';
import { Transaction } from '../../types';

interface RecentTransactionsProps {
  transactions: Transaction[];
}

const RecentTransactions: React.FC<RecentTransactionsProps> = ({ transactions }) => {
  // Format currency
  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
    }).format(amount);
  };
  
  // Format date
  const formatDate = (dateString: string) => {
    const options: Intl.DateTimeFormatOptions = { month: 'short', day: 'numeric' };
    return new Date(dateString).toLocaleDateString('en-US', options);
  };
  
  // Get category icon
  const getCategoryIcon = (category: string) => {
    switch (category.toLowerCase()) {
      case 'shopping':
        return <ShoppingBag size={18} />;
      case 'food & drinks':
        return <Coffee size={18} />;
      case 'entertainment':
        return <Music size={18} />;
      default:
        return <Smartphone size={18} />;
    }
  };
  
  return (
    <Card className="h-full">
      <CardHeader className="flex justify-between items-center">
        <h3 className="font-semibold text-lg text-gray-800">Recent Transactions</h3>
        <div className="flex items-center text-blue-900 text-sm">
          <Calendar size={14} className="mr-1" />
          <span>Last 30 Days</span>
        </div>
      </CardHeader>
      <CardBody className="p-0">
        <ul className="divide-y divide-gray-200">
          {transactions.slice(0, 5).map((transaction) => (
            <li key={transaction.id} className="py-4 px-6 hover:bg-gray-50 transition-colors">
              <div className="flex items-center space-x-4">
                <div className={`p-2 rounded-full ${
                  transaction.isCredit 
                    ? 'bg-green-100 text-green-600' 
                    : 'bg-blue-100 text-blue-600'
                }`}>
                  {transaction.isCredit ? <ArrowDown size={16} /> : getCategoryIcon(transaction.category)}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-gray-900 truncate">
                    {transaction.merchantName}
                  </p>
                  <p className="text-xs text-gray-500">
                    {formatDate(transaction.date)} • {transaction.category}
                  </p>
                </div>
                <div className={`text-sm font-semibold ${
                  transaction.isCredit ? 'text-green-600' : 'text-gray-900'
                }`}>
                  {transaction.isCredit ? '+' : '-'}{formatCurrency(transaction.amount)}
                </div>
              </div>
            </li>
          ))}
        </ul>
        
        {transactions.length === 0 && (
          <div className="py-8 px-6 text-center text-gray-500">
            <p>No recent transactions found.</p>
          </div>
        )}
      </CardBody>
    </Card>
  );
};

export default RecentTransactions;