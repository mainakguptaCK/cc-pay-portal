import React, { useState } from 'react';
import { CreditCard as CreditCardIcon, Shield, AlertCircle, Settings, Lock, Unlock } from 'lucide-react';
import Card, { CardHeader, CardBody, CardFooter } from '../../components/ui/Card';
import Button from '../../components/ui/Button';
import Switch from '../../components/ui/Switch';
import { useCreditCard } from '../../context/CreditCardContext';

const CardManagement: React.FC = () => {
  const { userCards, updateCardSettings, blockCard } = useCreditCard();
  const [activeCardId, setActiveCardId] = useState<string>(userCards.length > 0 ? userCards[0].id : '');
  
  const activeCard = userCards.find(card => card.id === activeCardId);
  
  if (userCards.length === 0) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <h1 className="text-2xl font-bold text-gray-900 mb-8">Card Management</h1>
        <div className="bg-white p-8 rounded-lg shadow-md text-center">
          <h2 className="text-xl font-semibold text-gray-800 mb-2">No cards found</h2>
          <p className="text-gray-600 mb-4">You don't have any credit cards associated with your account.</p>
        </div>
      </div>
    );
  }
  
  if (!activeCard) {
    return null;
  }
  
  const toggleSetting = (setting: keyof typeof activeCard.settings, value: boolean) => {
    updateCardSettings(activeCardId, { [setting]: value });
  };
  
  const handleBlockCard = () => {
    blockCard(activeCardId, !activeCard.isBlocked);
  };
  
  const formatCardNumber = (cardNumber: string) => {
    return cardNumber.replace(/(\*{4})-(\*{4})-(\*{4})-(\d{4})/, '$1 $2 $3 $4');
  };
  
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <h1 className="text-2xl font-bold text-gray-900 mb-8">Card Management</h1>
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-1">
          {/* Card Selector */}
          <Card className="mb-6">
            <CardHeader>
              <h2 className="text-lg font-semibold text-gray-800">Your Cards</h2>
            </CardHeader>
            <CardBody className="p-0">
              <ul className="divide-y divide-gray-200">
                {userCards.map(card => (
                  <li 
                    key={card.id} 
                    className={`px-6 py-4 cursor-pointer hover:bg-gray-50 transition-colors ${
                      card.id === activeCardId ? 'bg-blue-50 border-l-4 border-blue-700' : ''
                    }`}
                    onClick={() => setActiveCardId(card.id)}
                  >
                    <div className="flex items-center space-x-3">
                      <div className={`p-2 rounded-full ${
                        card.isBlocked ? 'bg-red-100 text-red-600' : 'bg-blue-100 text-blue-600'
                      }`}>
                        <CreditCardIcon size={18} />
                      </div>
                      <div>
                        <p className="font-medium">
                          {card.isBlocked && '(Blocked) '}
                          {formatCardNumber(card.cardNumber)}
                        </p>
                        <p className="text-sm text-gray-500">Expires: {card.expiryDate}</p>
                      </div>
                    </div>
                  </li>
                ))}
              </ul>
            </CardBody>
          </Card>
          
          {/* Quick Actions */}
          <Card>
            <CardHeader>
              <h2 className="text-lg font-semibold text-gray-800">Quick Actions</h2>
            </CardHeader>
            <CardBody>
              <div className="space-y-4">
                <Button
                  variant={activeCard.isBlocked ? 'success' : 'danger'}
                  fullWidth
                  leftIcon={activeCard.isBlocked ? <Unlock size={16} /> : <Lock size={16} />}
                  onClick={handleBlockCard}
                >
                  {activeCard.isBlocked ? 'Unblock Card' : 'Block Card'}
                </Button>
                <Button
                  variant="secondary"
                  fullWidth
                  leftIcon={<CreditCardIcon size={16} />}
                >
                  Request Card Replacement
                </Button>
                <Button
                  variant="outline"
                  fullWidth
                  leftIcon={<AlertCircle size={16} />}
                >
                  Report Lost or Stolen
                </Button>
              </div>
            </CardBody>
          </Card>
        </div>
        
        <div className="lg:col-span-2">
          {/* Card Visual */}
          <div className={`relative mb-8 h-56 w-full rounded-xl p-6 shadow-lg bg-gradient-to-r from-blue-900 to-blue-700 ${
            activeCard.isBlocked ? 'opacity-70' : ''
          }`}>
            {activeCard.isBlocked && (
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="bg-red-600 text-white px-4 py-2 rounded-full font-bold transform rotate-12 shadow-lg">
                  BLOCKED
                </div>
              </div>
            )}
            <div className="flex flex-col justify-between h-full text-white">
              <div className="flex justify-between items-start">
                <div className="text-xl font-bold">Azure Card</div>
                <div className="w-12 h-12 rounded-full bg-white/20 flex items-center justify-center">
                  <CreditCardIcon size={24} className="text-white" />
                </div>
              </div>
              
              <div className="my-4">
                <div className="text-xl tracking-wider font-medium">{formatCardNumber(activeCard.cardNumber)}</div>
              </div>
              
              <div className="flex justify-between items-end">
                <div>
                  <p className="text-white/70 text-xs mb-1">EXPIRES</p>
                  <p>{activeCard.expiryDate}</p>
                </div>
                
                <div>
                  <p className="text-white/70 text-xs mb-1">CVV</p>
                  <p>{activeCard.cvv}</p>
                </div>
                
                <div className="flex items-center space-x-1">
                  <div className="w-8 h-8 rounded-full bg-yellow-400"></div>
                  <div className="w-8 h-8 rounded-full bg-red-500 opacity-70 -ml-4"></div>
                </div>
              </div>
            </div>
          </div>
          
          {/* Security Settings */}
          <Card className="mb-6">
            <CardHeader className="flex justify-between items-center">
              <h2 className="text-lg font-semibold text-gray-800">Security Settings</h2>
              <div className="p-2 rounded-full bg-blue-50">
                <Shield size={18} className="text-blue-700" />
              </div>
            </CardHeader>
            <CardBody className="divide-y divide-gray-200">
              <div className="py-4 flex justify-between items-center">
                <div>
                  <p className="font-medium">Domestic Transactions</p>
                  <p className="text-sm text-gray-500">Allow transactions within the country</p>
                </div>
                <Switch 
                  checked={activeCard.settings.domesticTransactions} 
                  onChange={(checked) => toggleSetting('domesticTransactions', checked)}
                />
              </div>
              
              <div className="py-4 flex justify-between items-center">
                <div>
                  <p className="font-medium">International Transactions</p>
                  <p className="text-sm text-gray-500">Allow transactions outside the country</p>
                </div>
                <Switch 
                  checked={activeCard.settings.internationalTransactions} 
                  onChange={(checked) => toggleSetting('internationalTransactions', checked)}
                />
              </div>
              
              <div className="py-4 flex justify-between items-center">
                <div>
                  <p className="font-medium">Online Payments</p>
                  <p className="text-sm text-gray-500">Allow online and e-commerce transactions</p>
                </div>
                <Switch 
                  checked={activeCard.settings.onlinePayments} 
                  onChange={(checked) => toggleSetting('onlinePayments', checked)}
                />
              </div>
              
              <div className="py-4 flex justify-between items-center">
                <div>
                  <p className="font-medium">ATM Withdrawals</p>
                  <p className="text-sm text-gray-500">Allow cash withdrawals from ATMs</p>
                </div>
                <Switch 
                  checked={activeCard.settings.atmWithdrawals} 
                  onChange={(checked) => toggleSetting('atmWithdrawals', checked)}
                />
              </div>
            </CardBody>
          </Card>
          
          {/* Contactless Payment Settings */}
          <Card>
            <CardHeader className="flex justify-between items-center">
              <h2 className="text-lg font-semibold text-gray-800">Contactless Settings</h2>
              <div className="p-2 rounded-full bg-blue-50">
                <Settings size={18} className="text-blue-700" />
              </div>
            </CardHeader>
            <CardBody className="divide-y divide-gray-200">
              <div className="py-4 flex justify-between items-center">
                <div>
                  <p className="font-medium">Touch to Pay</p>
                  <p className="text-sm text-gray-500">Allow contactless transactions</p>
                </div>
                <Switch 
                  checked={activeCard.settings.touchToPay} 
                  onChange={(checked) => toggleSetting('touchToPay', checked)}
                />
              </div>
              
              <div className="py-4 flex justify-between items-center">
                <div>
                  <p className="font-medium">Merchant POS Payments</p>
                  <p className="text-sm text-gray-500">Allow in-store point of sale transactions</p>
                </div>
                <Switch 
                  checked={activeCard.settings.merchantPosPayments} 
                  onChange={(checked) => toggleSetting('merchantPosPayments', checked)}
                />
              </div>
            </CardBody>
            <CardFooter className="bg-gray-50">
              <div className="text-sm text-gray-600">
                <p>Contact customer support for more security options or to report suspicious activity.</p>
              </div>
            </CardFooter>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default CardManagement;