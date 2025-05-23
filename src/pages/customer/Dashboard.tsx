import React, { useState, useEffect } from 'react';
import CreditLimitCard from '../../components/dashboard/CreditLimitCard';
import PaymentInfo from '../../components/dashboard/PaymentInfo';
import RecentTransactions from '../../components/dashboard/RecentTransactions';
import SpendingByCategory from '../../components/dashboard/SpendingByCategory';
import NoticeAlert from '../../components/dashboard/NoticeAlert';
import { CreditCard as CreditCardIcon, ChevronDown, ChevronUp } from 'lucide-react';
import Card, { CardBody } from '../../components/ui/Card';
import Button from '../../components/ui/Button';
import { useCreditCard } from '../../context/CreditCardContext';
import { useAuth } from '../../context/useAuth';


const CustomerDashboard: React.FC = () => {
  const [userCards, setUserCards] = useState<any[]>([]);
  const [userTransactions, setUserTransactions] = useState<any[]>([]);
  const [loadingTransactions, setLoadingTransactions] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const { portalNotices } = useCreditCard();
  const [dismissedNotices, setDismissedNotices] = useState<string[]>([]);
  const [selectedCard, setSelectedCard] = useState<string | 'overall'>('overall');
  const [expandedCards, setExpandedCards] = useState<string[]>([]);
  const { currentUser } = useAuth();

  // Fetch user's credit cards
  useEffect(() => {
    const fetchUserCards = async () => {
      try {
        console.log(currentUser);
        const userId = currentUser?.id;
        const response = await fetch('http://127.0.0.1:5000/api/card/getCardDetails', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ UserID: userId }),
        });

        const data = await response.json();

        const normalizedCards = data.cards.map((card: any) => ({
          id: card.CardID.toString(),
          cardNumber: card.CardNumber,
          isBlocked: card.CardStatus !== 'Active',
          cardType: card.CardType,
          cardholderName: card.CardholderName,
          createdDate: new Date(card.CreatedDate),
          expiryDate: new Date(card.ExpirationDate).toLocaleDateString(),
          lastModifiedDate: new Date(card.LastModifiedDate),
          creditLimit: card.CreditLimit,
          availableLimit: card.CreditLimit - card.OutStandingBalance,
          totalOutstanding: card.OutStandingBalance,
          dueDate: new Date(card.PaymentDueDate).toLocaleDateString(),
        }));

        setUserCards(normalizedCards);
      } catch (err) {
        console.error('Failed to fetch cards:', err);
      }
    };

    fetchUserCards();
  }, []);

  // Fetch transactions from backend
  useEffect(() => {
    const fetchTransactions = async () => {
      try {
        console.log(currentUser);
        const userId = currentUser?.id; 
        const response = await fetch('http://127.0.0.1:5000/api/transaction/getTransactionsByUser', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ UserID: userId }),
        });

        const data = await response.json();
        console.log(data)

        setUserTransactions(data.Transactions);
        setError(null);
      } catch (err) {
        setError('Failed to load transactions');
        console.error(err);
      } finally {
        setLoadingTransactions(false);
      }
    };

    fetchTransactions();
  }, []);

  const activeNotices = portalNotices.filter(
    notice =>
      notice.isActive &&
      !dismissedNotices.includes(notice.id) &&
      new Date(notice.startDate) <= new Date() &&
      new Date(notice.endDate) >= new Date()
  );

  const dismissNotice = (noticeId: string) => {
    setDismissedNotices([...dismissedNotices, noticeId]);
  };

  const toggleCardExpansion = (cardId: string) => {
    setExpandedCards(prev =>
      prev.includes(cardId) ? prev.filter(id => id !== cardId) : [...prev, cardId]
    );
  };

  const filteredTransactions =
    selectedCard === 'overall'
      ? userTransactions
      : userTransactions.filter(tx => tx.cardId == selectedCard);

  const overallStats = userCards.reduce(
    (acc, card) => ({
      creditLimit: acc.creditLimit + card.creditLimit,
      availableLimit: acc.availableLimit + card.availableLimit,
      totalOutstanding: acc.totalOutstanding + card.totalOutstanding,
      dueDate: acc.dueDate > card.dueDate ? acc.dueDate : card.dueDate,
    }),
    {
      creditLimit: 0,
      availableLimit: 0,
      totalOutstanding: 0,
      dueDate: '',
    }
  );

  const formatCardNumber = (cardNumber: string) => {
    return cardNumber.replace(/(\*{4})-(\*{4})-(\*{4})-(\d{4})/, '$1 $2 $3 $4');
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <h1 className="text-2xl font-bold text-gray-900 mb-8">Dashboard</h1>

      {activeNotices.map(notice => (
        <NoticeAlert key={notice.id} notice={notice} onClose={() => dismissNotice(notice.id)} />
      ))}

      {userCards.length > 0 ? (
        <>
          {/* Card Selection */}
          <div className="mb-8">
            <h2 className="text-lg font-semibold text-gray-800 mb-4">Your Credit Cards</h2>
            <div className="space-y-4">
              <Card
                className={`cursor-pointer transition-colors ${
                  selectedCard === 'overall' ? 'ring-2 ring-blue-500' : ''
                }`}
                onClick={() => setSelectedCard('overall')}
              >
                <CardBody className="flex justify-between items-center">
                  <div className="flex items-center">
                    <div className="bg-blue-100 p-2 rounded-full mr-3">
                      <CreditCardIcon size={24} className="text-blue-700" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-gray-900">Overall Overview</h3>
                      <p className="text-sm text-gray-500">View combined statistics for all cards</p>
                    </div>
                  </div>
                </CardBody>
              </Card>

              {userCards.map(card => (
                <Card key={card.id} className="overflow-hidden">
                  <CardBody className="p-0">
                    <div
                      className={`p-4 cursor-pointer transition-colors ${
                        selectedCard === card.id ? 'ring-2 ring-blue-500' : ''
                      }`}
                      onClick={() => setSelectedCard(card.id)}
                    >
                      <div className="flex justify-between items-center">
                        <div className="flex items-center">
                          <div
                            className={`p-2 rounded-full ${
                              card.isBlocked
                                ? 'bg-red-100 text-red-600'
                                : 'bg-blue-100 text-blue-600'
                            }`}
                          >
                            <CreditCardIcon size={20} />
                          </div>
                          <div className="ml-3">
                            <p className="font-medium text-gray-900">
                              {card.isBlocked && '(Blocked) '}
                              {formatCardNumber(card.cardNumber)}
                            </p>
                            <p className="text-sm text-gray-500">Expires: {card.expiryDate}</p>
                          </div>
                        </div>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={e => {
                            e.stopPropagation();
                            toggleCardExpansion(card.id);
                          }}
                          rightIcon={
                            expandedCards.includes(card.id) ? (
                              <ChevronUp size={16} />
                            ) : (
                              <ChevronDown size={16} />
                            )
                          }
                        >
                          {expandedCards.includes(card.id) ? 'Less Details' : 'More Details'}
                        </Button>
                      </div>
                    </div>

                    {expandedCards.includes(card.id) && (
                      <div className="border-t border-gray-200 p-4 bg-gray-50">
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                          <div>
                            <p className="text-sm text-gray-500">Credit Limit</p>
                            <p className="font-semibold text-gray-900">
                              ${card.creditLimit.toLocaleString()}
                            </p>
                          </div>
                          <div>
                            <p className="text-sm text-gray-500">Available Credit</p>
                            <p className="font-semibold text-gray-900">
                              ${card.availableLimit.toLocaleString()}
                            </p>
                          </div>
                          <div>
                            <p className="text-sm text-gray-500">Outstanding Balance</p>
                            <p className="font-semibold text-gray-900">
                              ${card.totalOutstanding.toLocaleString()}
                            </p>
                          </div>
                        </div>
                      </div>
                    )}
                  </CardBody>
                </Card>
              ))}
            </div>
          </div>

          {/* Dashboard Widgets */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
            <div className="lg:col-span-2">
              <CreditLimitCard
                card={
                  selectedCard === 'overall'
                    ? { ...overallStats, id: 'overall', settings: {} } as any
                    : userCards.find(card => card.id === selectedCard)!
                }
              />
            </div>
            <div>
              <PaymentInfo
                card={
                  selectedCard === 'overall'
                    ? { ...overallStats, id: 'overall' } as any
                    : userCards.find(card => card.id === selectedCard)!
                }
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {loadingTransactions ? (
              <div className="col-span-full text-center text-gray-600">Loading transactions...</div>
            ) : error ? (
              <div className="col-span-full text-center text-red-500">{error}</div>
            ) : (
              <>
                <RecentTransactions transactions={filteredTransactions} />
                <SpendingByCategory transactions={filteredTransactions} />
              </>
            )}
          </div>
        </>
      ) : (
        <div className="bg-white p-8 rounded-lg shadow-md text-center">
          <h2 className="text-xl font-semibold text-gray-800 mb-2">No active cards found</h2>
          <p className="text-gray-600 mb-4">You don't have any active credit cards at the moment.</p>
        </div>
      )}
    </div>
  );
};

export default CustomerDashboard;
