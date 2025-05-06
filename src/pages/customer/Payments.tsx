import React, { useState } from 'react';
import { CreditCard, Calendar, DollarSign, CheckCircle } from 'lucide-react';
import Card, { CardBody, CardHeader } from '../../components/ui/Card';
import Button from '../../components/ui/Button';
import Input from '../../components/ui/Input';
import { useCreditCard } from '../../context/CreditCardContext';

const Payments: React.FC = () => {
  const { userCards, userDirectDebit } = useCreditCard();
  const [selectedCard, setSelectedCard] = useState(userCards[0]?.id || '');
  const [paymentAmount, setPaymentAmount] = useState('');
  const [paymentDate, setPaymentDate] = useState('');
  
  const selectedCardData = userCards.find(card => card.id === selectedCard);
  
  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
    }).format(amount);
  };
  
  const formatCardNumber = (cardNumber: string) => {
    return cardNumber.replace(/(\*{4})-(\*{4})-(\*{4})-(\d{4})/, '$1 $2 $3 $4');
  };
  
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <h1 className="text-2xl font-bold text-gray-900 mb-8">Make a Payment</h1>
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Payment Form */}
        <div className="lg:col-span-2">
          <Card>
            <CardHeader>
              <h2 className="text-lg font-semibold text-gray-800">Payment Details</h2>
            </CardHeader>
            <CardBody>
              <div className="space-y-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Select Card
                  </label>
                  <div className="grid grid-cols-1 gap-4">
                    {userCards.map(card => (
                      <div
                        key={card.id}
                        className={`border rounded-lg p-4 cursor-pointer transition-colors ${
                          selectedCard === card.id 
                            ? 'border-blue-500 bg-blue-50' 
                            : 'border-gray-200 hover:bg-gray-50'
                        }`}
                        onClick={() => setSelectedCard(card.id)}
                      >
                        <div className="flex justify-between items-center">
                          <div className="flex items-center">
                            <div className={`p-2 rounded-full ${
                              card.isBlocked ? 'bg-red-100 text-red-600' : 'bg-blue-100 text-blue-600'
                            }`}>
                              <CreditCard size={20} />
                            </div>
                            <div className="ml-3">
                              <p className="font-medium text-gray-900">
                                {formatCardNumber(card.cardNumber)}
                              </p>
                              <p className="text-sm text-gray-500">
                                Balance: {formatCurrency(card.totalOutstanding)}
                              </p>
                            </div>
                          </div>
                          <div className="flex items-center">
                            <div className="h-5 w-5 rounded-full border-2 border-blue-500 flex items-center justify-center">
                              {selectedCard === card.id && (
                                <div className="h-3 w-3 rounded-full bg-blue-500" />
                              )}
                            </div>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <Input
                    label="Payment Amount"
                    type="number"
                    value={paymentAmount}
                    onChange={(e) => setPaymentAmount(e.target.value)}
                    leftIcon={<DollarSign size={16} className="text-gray-400" />}
                    placeholder="Enter amount"
                    fullWidth
                  />
                  
                  <Input
                    label="Payment Date"
                    type="date"
                    value={paymentDate}
                    onChange={(e) => setPaymentDate(e.target.value)}
                    leftIcon={<Calendar size={16} className="text-gray-400" />}
                    fullWidth
                  />
                </div>
                
                <div className="bg-gray-50 p-4 rounded-lg">
                  <h3 className="text-sm font-medium text-gray-900 mb-2">Quick Payment Options</h3>
                  <div className="grid grid-cols-3 gap-3">
                    {selectedCardData && (
                      <>
                        <Button
                          variant="outline"
                          onClick={() => setPaymentAmount(selectedCardData.totalOutstanding.toString())}
                        >
                          Full Balance
                        </Button>
                        <Button
                          variant="outline"
                          onClick={() => setPaymentAmount((selectedCardData.totalOutstanding * 0.5).toString())}
                        >
                          50% of Balance
                        </Button>
                        <Button
                          variant="outline"
                          onClick={() => setPaymentAmount((selectedCardData.totalOutstanding * 0.25).toString())}
                        >
                          25% of Balance
                        </Button>
                      </>
                    )}
                  </div>
                </div>
                
                <Button
                  variant="primary"
                  fullWidth
                  size="lg"
                  leftIcon={<DollarSign size={18} />}
                >
                  Make Payment
                </Button>
              </div>
            </CardBody>
          </Card>
        </div>
        
        {/* Payment Info */}
        <div>
          <Card className="mb-6">
            <CardHeader>
              <h2 className="text-lg font-semibold text-gray-800">Payment Summary</h2>
            </CardHeader>
            <CardBody>
              {selectedCardData && (
                <div className="space-y-4">
                  <div>
                    <p className="text-sm text-gray-500">Selected Card</p>
                    <p className="font-medium">{formatCardNumber(selectedCardData.cardNumber)}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Current Balance</p>
                    <p className="text-xl font-semibold">{formatCurrency(selectedCardData.totalOutstanding)}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Payment Amount</p>
                    <p className="text-xl font-semibold">
                      {paymentAmount ? formatCurrency(Number(paymentAmount)) : '-'}
                    </p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Payment Date</p>
                    <p className="font-medium">
                      {paymentDate ? new Date(paymentDate).toLocaleDateString() : '-'}
                    </p>
                  </div>
                </div>
              )}
            </CardBody>
          </Card>
          
          <Card>
            <CardHeader>
              <h2 className="text-lg font-semibold text-gray-800">Automatic Payments</h2>
            </CardHeader>
            <CardBody>
              {userDirectDebit ? (
                <div>
                  <div className="flex items-center mb-4">
                    <CheckCircle size={20} className="text-green-500 mr-2" />
                    <p className="text-sm font-medium text-gray-900">AutoPay is Active</p>
                  </div>
                  <div className="space-y-3">
                    <div>
                      <p className="text-sm text-gray-500">Payment Amount</p>
                      <p className="font-medium">{formatCurrency(userDirectDebit.amount)}</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-500">Frequency</p>
                      <p className="font-medium capitalize">{userDirectDebit.frequency}</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-500">Next Payment</p>
                      <p className="font-medium">
                        {new Date(userDirectDebit.nextDebitDate).toLocaleDateString()}
                      </p>
                    </div>
                  </div>
                  <Button
                    variant="outline"
                    fullWidth
                    className="mt-4"
                  >
                    Manage AutoPay
                  </Button>
                </div>
              ) : (
                <div className="text-center py-6">
                  <Calendar size={32} className="mx-auto mb-3 text-gray-400" />
                  <p className="text-gray-600 mb-4">Set up automatic payments to never miss a due date</p>
                  <Button variant="primary">Set Up AutoPay</Button>
                </div>
              )}
            </CardBody>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default Payments;