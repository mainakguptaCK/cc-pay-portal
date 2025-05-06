import React from 'react';
import { Calendar, AlertCircle } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import Card, { CardBody } from '../ui/Card';
import Button from '../ui/Button';
import { CreditCard } from '../../types';

interface PaymentInfoProps {
  card: CreditCard;
}

const PaymentInfo: React.FC<PaymentInfoProps> = ({ card }) => {
  const navigate = useNavigate();
  const { dueDate, totalOutstanding } = card;
  
  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
    }).format(amount);
  };
  
  const formatDate = (dateString: string) => {
    const options: Intl.DateTimeFormatOptions = { 
      year: 'numeric', 
      month: 'long', 
      day: 'numeric' 
    };
    return new Date(dateString).toLocaleDateString('en-US', options);
  };
  
  const calculateDaysUntilDue = (dueDate: string) => {
    const today = new Date();
    const due = new Date(dueDate);
    const diffTime = due.getTime() - today.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays;
  };
  
  const daysUntilDue = calculateDaysUntilDue(dueDate);
  
  return (
    <Card className="h-full">
      <CardBody>
        <div className="flex justify-between items-start mb-4">
          <h3 className="font-semibold text-lg text-gray-800">Payment Due</h3>
          <div className="bg-blue-50 p-2 rounded-full">
            <Calendar size={20} className="text-blue-900" />
          </div>
        </div>
        
        <div className="mb-6">
          <p className="text-sm text-gray-500 mb-1">Payment Amount</p>
          <p className="text-2xl font-bold">{formatCurrency(totalOutstanding)}</p>
        </div>
        
        <div className="mb-6 p-3 bg-blue-50 rounded-lg flex items-start">
          <AlertCircle size={18} className="text-blue-700 mr-2 mt-0.5 flex-shrink-0" />
          <div>
            <p className="text-sm font-medium text-gray-800">Due on {formatDate(dueDate)}</p>
            <p className="text-sm text-gray-600">
              {daysUntilDue > 0 
                ? `${daysUntilDue} days remaining until due date` 
                : daysUntilDue === 0 
                  ? 'Payment due today' 
                  : 'Payment overdue'}
            </p>
          </div>
        </div>
        
        <div className="flex space-x-3">
          <Button 
            variant="primary" 
            fullWidth
            onClick={() => navigate('/payment')}
          >
            Pay Now
          </Button>
          <Button 
            variant="outline" 
            fullWidth
            onClick={() => navigate('/transactions')}
          >
            Payment History
          </Button>
        </div>
      </CardBody>
    </Card>
  );
};

export default PaymentInfo;