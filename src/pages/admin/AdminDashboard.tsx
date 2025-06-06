import React, { useState, useEffect } from 'react';
import { Users, CreditCard as CreditCardIcon, Wallet, Bell, BarChart3 } from 'lucide-react';
import Card, { CardBody, CardHeader } from '../../components/ui/Card';
import Button from '../../components/ui/Button';
import { useCreditCard } from '../../context/CreditCardContext';
import { useAuth } from '../../context/useAuth';

const AdminDashboard: React.FC = () => {
  const { 
    allCards, 
    portalNotices, 
    creditDecisions,
    updatePortalNotice 
  } = useCreditCard();

  const { currentUser } = useAuth();
  const userId = currentUser?.id;
  const isAdmin = currentUser?.role;
  const [totalCreditLimit,settotalCreditLimit] = useState<number>(0);
  const [totalOutstanding,settotalOutstanding] = useState<number>(0);
  const [totalAvailable,settotalAvailable] = useState<number>(0);
  const [blockedCards,setblockedCards] = useState<number>(0);
  
  useEffect(() => {
      const fetchData = async () => {
        try {
          console.log('Before Callout');
          const [cardsRes] = await Promise.all([
            fetch('https://cc-pay-app-service-dev-cecxemfggbf0dzas.eastus-01.azurewebsites.net/api/card/getCardAccountSummary', {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({ UserID: userId, isAdmin: isAdmin }),
            })
          ]);
  
          const cardsData = await cardsRes.json();
          console.log('cardsData',cardsData);
          console.log('cardsData',cardsData[0]);

          if (cardsData && cardsData.message) {
            console.log('cardsData : ',cardsData);
            // console.log('TotalCreditLimit',cardsData.message.TotalCreditLimit);
            // console.log('TotalOutstanding',cardsData.message.TotalOutstanding);
            // console.log('AvailableCredit',cardsData.message.AvailableCredit);
            // console.log('TotalBlockedCards',cardsData.message.TotalBlockedCards);
            settotalCreditLimit(cardsData?.message?.TotalCreditLimit ?? 0);
            settotalOutstanding(cardsData?.message?.TotalOutstanding ?? 0);
            settotalAvailable(cardsData?.message?.TotalAvailableCredit ?? 0);
            setblockedCards(cardsData?.message?.TotalBlockedCards ?? 0); 
          }else {
            // This block runs if the API returns a null message.
            console.warn("API returned no data for this user:", cardsData);
            // Optionally reset states to 0 to clear any old data
            settotalCreditLimit(0);
            settotalOutstanding(0);
            settotalAvailable(0);
            setblockedCards(0);
          }
        }catch(error){
          console.log(error)
        }
      };
      fetchData()
    },[userId]);

  const [selectedNotice, setSelectedNotice] = useState<string>(
    portalNotices.length > 0 ? portalNotices[0].id : ''
  );
  
  // Quick stats
  // const totalCreditLimit = allCards.reduce((sum, card) => sum + card.creditLimit, 0);
  // const totalOutstanding = allCards.reduce((sum, card) => sum + card.totalOutstanding, 0);
  // const totalAvailable = allCards.reduce((sum, card) => sum + card.availableLimit, 0);
  // const blockedCards = allCards.filter(card => card.isBlocked).length;


  
  // Format currency
  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
    }).format(amount);
  };
  
  // Toggle notice active status
  const toggleNoticeStatus = (noticeId: string, isActive: boolean) => {
    updatePortalNotice(noticeId, { isActive });
  };
  
  // Get selected notice
  const activeNotice = portalNotices.find(notice => notice.id === selectedNotice);
  
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <h1 className="text-2xl font-bold text-gray-900 mb-8">Admin Dashboard</h1>
      
      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <Card>
          <CardBody className="flex items-center p-6">
            <div className="bg-blue-100 p-3 rounded-full mr-4">
              <CreditCardIcon size={24} className="text-blue-700" />
            </div>
            <div>
              <p className="text-gray-500 text-sm">Total Credit Limit</p>
              <p className="text-2xl font-bold text-gray-900">{formatCurrency(totalCreditLimit)}</p>
            </div>
          </CardBody>
        </Card>
        
        <Card>
          <CardBody className="flex items-center p-6">
            <div className="bg-green-100 p-3 rounded-full mr-4">
              <Wallet size={24} className="text-green-700" />
            </div>
            <div>
              <p className="text-gray-500 text-sm">Total Available</p>
              <p className="text-2xl font-bold text-gray-900">{formatCurrency(totalAvailable)}</p>
            </div>
          </CardBody>
        </Card>
        
        <Card>
          <CardBody className="flex items-center p-6">
            <div className="bg-red-100 p-3 rounded-full mr-4">
              <BarChart3 size={24} className="text-red-700" />
            </div>
            <div>
              <p className="text-gray-500 text-sm">Total Outstanding</p>
              <p className="text-2xl font-bold text-gray-900">{formatCurrency(totalOutstanding)}</p>
            </div>
          </CardBody>
        </Card>
        
        <Card>
          <CardBody className="flex items-center p-6">
            <div className="bg-amber-100 p-3 rounded-full mr-4">
              <Users size={24} className="text-amber-700" />
            </div>
            <div>
              <p className="text-gray-500 text-sm">Blocked Cards</p>
              <p className="text-2xl font-bold text-gray-900">{blockedCards}</p>
            </div>
          </CardBody>
        </Card>
      </div>
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Portal Notices */}
        <div className="lg:col-span-2">
          <Card>
            <CardHeader className="flex justify-between items-center">
              <h2 className="text-lg font-semibold text-gray-800">Portal Notices</h2>
              <div className="bg-blue-100 p-2 rounded-full">
                <Bell size={18} className="text-blue-700" />
              </div>
            </CardHeader>
            <CardBody>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <h3 className="text-sm font-medium text-gray-700 mb-3">Active Notices</h3>
                  <ul className="space-y-2 max-h-64 overflow-y-auto">
                    {portalNotices.map(notice => (
                      <li 
                        key={notice.id}
                        className={`p-3 rounded border cursor-pointer transition-colors ${
                          notice.id === selectedNotice 
                            ? 'bg-blue-50 border-blue-300' 
                            : 'bg-white border-gray-200 hover:bg-gray-50'
                        }`}
                        onClick={() => setSelectedNotice(notice.id)}
                      >
                        <div className="flex justify-between items-start">
                          <div>
                            <p className="font-medium">{notice.title}</p>
                            <p className="text-xs text-gray-500 mt-1">
                              {new Date(notice.startDate).toLocaleDateString()} - {new Date(notice.endDate).toLocaleDateString()}
                            </p>
                          </div>
                          <div className={`px-2 py-1 rounded-full text-xs font-medium ${
                            notice.isActive ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'
                          }`}>
                            {notice.isActive ? 'Active' : 'Inactive'}
                          </div>
                        </div>
                      </li>
                    ))}
                  </ul>
                  <div className="mt-4">
                    <Button variant="primary" size="sm" fullWidth>
                      Create New Notice
                    </Button>
                  </div>
                </div>
                
                {activeNotice && (
                  <div className="bg-gray-50 p-4 rounded-lg">
                    <div className="flex justify-between items-start mb-4">
                      <h3 className="text-lg font-semibold">{activeNotice.title}</h3>
                      <Button 
                        variant={activeNotice.isActive ? 'danger' : 'success'} 
                        size="sm"
                        onClick={() => toggleNoticeStatus(activeNotice.id, !activeNotice.isActive)}
                      >
                        {activeNotice.isActive ? 'Deactivate' : 'Activate'}
                      </Button>
                    </div>
                    <p className="text-sm text-gray-600 mb-4">{activeNotice.content}</p>
                    <div className="flex justify-between text-sm text-gray-500">
                      <p>Start: {new Date(activeNotice.startDate).toLocaleDateString()}</p>
                      <p>End: {new Date(activeNotice.endDate).toLocaleDateString()}</p>
                    </div>
                    <div className="mt-4 flex space-x-2">
                      <Button variant="secondary" size="sm">
                        Edit
                      </Button>
                      <Button variant="outline" size="sm">
                        Delete
                      </Button>
                    </div>
                  </div>
                )}
              </div>
            </CardBody>
          </Card>
        </div>
        
        {/* Credit Decisions */}
        <Card>
          <CardHeader className="flex justify-between items-center">
            <h2 className="text-lg font-semibold text-gray-800">Recent Credit Decisions</h2>
            <Button variant="outline" size="sm">View All</Button>
          </CardHeader>
          <CardBody className="p-0">
            <ul className="divide-y divide-gray-200 max-h-80 overflow-y-auto">
              {creditDecisions.map(decision => (
                <li key={decision.id} className="px-6 py-4 hover:bg-gray-50 transition-colors">
                  <div className="flex items-start justify-between mb-1">
                    <p className="font-medium">Customer ID: {decision.userId}</p>
                    <div className={`px-2 py-1 rounded-full text-xs font-medium ${
                      decision.decision === 'approved' 
                        ? 'bg-green-100 text-green-800' 
                        : 'bg-red-100 text-red-800'
                    }`}>
                      {decision.decision.toUpperCase()}
                    </div>
                  </div>
                  <p className="text-sm text-gray-500">
                    {new Date(decision.date).toLocaleDateString()}
                  </p>
                  <p className="text-sm mt-1">
                    {decision.decision === 'approved' && (
                      <span>Limit: {formatCurrency(decision.suggestedLimit)}</span>
                    )}
                  </p>
                  <p className="text-sm text-gray-600 mt-1">{decision.reason}</p>
                </li>
              ))}
            </ul>
          </CardBody>
        </Card>
      </div>
    </div>
  );
};

export default AdminDashboard;