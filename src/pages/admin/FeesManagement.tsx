import React, { useState } from 'react';
import { DollarSign, Edit, Save, X, AlertCircle } from 'lucide-react';
import Card, { CardBody, CardHeader } from '../../components/ui/Card';
import Button from '../../components/ui/Button';
import Input from '../../components/ui/Input';
import { useCreditCard } from '../../context/CreditCardContext';
import { Fee, CardType } from '../../types';

const FeesManagement: React.FC = () => {
  const { fees, updateFee } = useCreditCard();
  const [editingFee, setEditingFee] = useState<string | null>(null);
  const [editAmount, setEditAmount] = useState<string>('');
  const [selectedCardType, setSelectedCardType] = useState<CardType>('platinum');
  
  const feeCategories = {
    annual: 'Annual Fees',
    monthly: 'Monthly Fees',
    late: 'Late Payment Fees',
    cashAdvance: 'Cash Advance Fees',
    other: 'Other Fees'
  };

  const cardTypes: CardType[] = ['platinum', 'gold', 'titanium', 'business', 'rewards'];
  
  const handleEditClick = (fee: Fee) => {
    setEditingFee(fee.id);
    setEditAmount(fee.amount.toString());
  };
  
  const handleSave = (fee: Fee) => {
    const newAmount = parseFloat(editAmount);
    if (!isNaN(newAmount) && newAmount >= 0) {
      updateFee(fee.id, { amount: newAmount });
    }
    setEditingFee(null);
  };
  
  const handleCancel = () => {
    setEditingFee(null);
    setEditAmount('');
  };
  
  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
    }).format(amount);
  };

  const getCardTypeColor = (cardType: CardType) => {
    const colors = {
      platinum: 'bg-gray-800 text-white',
      gold: 'bg-yellow-600 text-white',
      titanium: 'bg-blue-700 text-white',
      business: 'bg-green-700 text-white',
      rewards: 'bg-purple-700 text-white'
    };
    return colors[cardType];
  };
  
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <h1 className="text-2xl font-bold text-gray-900 mb-8">Fees Management</h1>
      
      <div className="mb-6">
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Select Card Type
        </label>
        <div className="flex flex-wrap gap-2">
          {cardTypes.map(type => (
            <button
              key={type}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                selectedCardType === type
                  ? getCardTypeColor(type)
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
              onClick={() => setSelectedCardType(type)}
            >
              {type.toUpperCase()}
            </button>
          ))}
        </div>
      </div>
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Fee Categories */}
        <div className="lg:col-span-2">
          {Object.entries(feeCategories).map(([category, title]) => {
            const categoryFees = fees.filter(fee => fee.type === category);
            
            return (
              <Card key={category} className="mb-6">
                <CardHeader className="flex justify-between items-center">
                  <h2 className="text-lg font-semibold text-gray-800">{title}</h2>
                  <div className="bg-blue-100 p-2 rounded-full">
                    <DollarSign size={18} className="text-blue-700" />
                  </div>
                </CardHeader>
                <CardBody className="p-0">
                  <div className="divide-y divide-gray-200">
                    {categoryFees.map(fee => (
                      <div key={fee.id} className="p-6">
                        <div className="flex justify-between items-start">
                          <div>
                            <h3 className="text-base font-medium text-gray-900">
                              {fee.description}
                              <span className={`ml-2 px-2 py-1 text-xs font-medium rounded ${getCardTypeColor(selectedCardType)}`}>
                                {selectedCardType.toUpperCase()}
                              </span>
                            </h3>
                            {editingFee === fee.id ? (
                              <div className="mt-2 flex items-center space-x-2">
                                <Input
                                  type="number"
                                  value={editAmount}
                                  onChange={(e) => setEditAmount(e.target.value)}
                                  placeholder="Enter amount"
                                  className="w-32"
                                />
                                <Button
                                  variant="success"
                                  size="sm"
                                  leftIcon={<Save size={14} />}
                                  onClick={() => handleSave(fee)}
                                >
                                  Save
                                </Button>
                                <Button
                                  variant="outline"
                                  size="sm"
                                  leftIcon={<X size={14} />}
                                  onClick={handleCancel}
                                >
                                  Cancel
                                </Button>
                              </div>
                            ) : (
                              <p className="mt-1 text-2xl font-semibold text-gray-900">
                                {formatCurrency(fee.amount)}
                              </p>
                            )}
                          </div>
                          {editingFee !== fee.id && (
                            <Button
                              variant="outline"
                              size="sm"
                              leftIcon={<Edit size={14} />}
                              onClick={() => handleEditClick(fee)}
                            >
                              Edit
                            </Button>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                </CardBody>
              </Card>
            );
          })}
        </div>
        
        {/* Fee Management Info */}
        <div>
          <Card>
            <CardHeader>
              <h2 className="text-lg font-semibold text-gray-800">Fee Management Guide</h2>
            </CardHeader>
            <CardBody>
              <div className="space-y-4">
                <div className="flex items-start">
                  <AlertCircle size={20} className="text-blue-600 mr-2 mt-0.5 flex-shrink-0" />
                  <p className="text-sm text-gray-600">
                    Changes to fees will affect all future transactions and billing cycles. Existing charges will not be affected.
                  </p>
                </div>
                
                <div className="bg-yellow-50 border-l-4 border-yellow-400 p-4">
                  <div className="flex">
                    <div className="flex-shrink-0">
                      <AlertCircle size={20} className="text-yellow-400" />
                    </div>
                    <div className="ml-3">
                      <h3 className="text-sm font-medium text-yellow-800">Important Notice</h3>
                      <p className="mt-2 text-sm text-yellow-700">
                        Fee changes must comply with regulatory requirements and customer agreements. Ensure proper notification periods are observed.
                      </p>
                    </div>
                  </div>
                </div>
                
                <div className="border-t border-gray-200 pt-4">
                  <h3 className="text-sm font-medium text-gray-900 mb-2">Quick Actions</h3>
                  <div className="space-y-2">
                    <Button variant="outline" fullWidth>
                      Download Fee Schedule
                    </Button>
                    <Button variant="outline" fullWidth>
                      View Change History
                    </Button>
                    <Button variant="outline" fullWidth>
                      Schedule Fee Update
                    </Button>
                  </div>
                </div>
              </div>
            </CardBody>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default FeesManagement;