import React, { useState, useEffect } from 'react';
import { Search, Filter, Download, Calendar, CreditCard, Award } from 'lucide-react';
import Card, { CardBody, CardHeader } from '../../components/ui/Card';
import Button from '../../components/ui/Button';
import Input from '../../components/ui/Input';
import { Transaction, CardType as CardTier } from '../../types'; // Adjust path as needed

interface Card {
  id: string;
  cardNumber: string;
  cardType: CardTier;
}

const Transactions: React.FC = () => {
  const userId = '4'; // Replace with real user ID from auth/session
  const [userCards, setUserCards] = useState<Card[]>([]);
  const [userTransactions, setUserTransactions] = useState<Transaction[]>([]);
  const [selectedCard, setSelectedCard] = useState<string>('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [dateRange, setDateRange] = useState({ start: '', end: '' });

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [cardsRes, txRes] = await Promise.all([
          fetch('http://127.0.0.1:5000/api/card/getCardDetails', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ UserID: userId }),
          }),
          fetch('http://127.0.0.1:5000/api/transaction/getTransactionsByUser', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ UserID: userId }),
          }),
        ]);

        const cardsData = await cardsRes.json();
        const transactionsData = await txRes.json();

        const normalizedCards = cardsData.cards.map((card: any) => ({
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
        setUserTransactions(transactionsData.Transactions);
        //console.log(transactionsData);
        
      } catch (error) {
        console.error('Error fetching card or transaction data:', error);
      }
    };

    fetchData();
  }, [userId]);

    const filteredTransactions = Array.isArray(userTransactions)
      ? userTransactions
          .filter(tx =>
            (selectedCard === 'all' || tx.cardId === selectedCard) &&
            (searchTerm === '' ||
              tx.merchantName.toLowerCase().includes(searchTerm.toLowerCase()) ||
              tx.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
              tx.transactionId.toLowerCase().includes(searchTerm.toLowerCase())) &&
            (!dateRange.start || new Date(tx.date) >= new Date(dateRange.start)) &&
            (!dateRange.end || new Date(tx.date) <= new Date(dateRange.end)))
          .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
      : [];
      console.log(userTransactions);
      

  const formatCurrency = (amount: number) =>
    new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(amount);

  const formatCardNumber = (cardNumber: string) =>
    cardNumber.replace(/(\*{4})-(\*{4})-(\*{4})-(\d{4})/, '$1 $2 $3 $4');

  const getCardTypeColor = (cardType: CardTier) => {
    const colors = {
      platinum: 'bg-gray-800 text-white',
      gold: 'bg-yellow-600 text-white',
      titanium: 'bg-blue-700 text-white',
      business: 'bg-green-700 text-white',
      rewards: 'bg-purple-700 text-white',
    };
    return colors[cardType] || 'bg-gray-600 text-white';
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-2xl font-bold text-gray-900">Transactions</h1>
        <Button
          variant="outline"
          leftIcon={<Download size={16} />}
        >
          Export Transactions
        </Button>
      </div>
      
      <Card className="mb-8">
        <CardBody>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <div className="lg:col-span-2">
              <Input
                placeholder="Search transactions"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                leftIcon={<Search size={16} className="text-gray-400" />}
                fullWidth
              />
            </div>
            <div>
              <select
                className="w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                value={selectedCard}
                onChange={(e) => setSelectedCard(e.target.value)}
              >
                <option value="all">All Cards</option>
                {userCards.map(card => (
                  <option key={card.id} value={card.id}>
                    {card.cardType.toUpperCase()} - {formatCardNumber(card.cardNumber)}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <Button
                variant="outline"
                leftIcon={<Filter size={16} />}
                fullWidth
              >
                More Filters
              </Button>
            </div>
          </div>
          
          <div className="mt-4 grid grid-cols-1 md:grid-cols-2 gap-4">
            <Input
              type="date"
              label="Start Date"
              value={dateRange.start}
              onChange={(e) => setDateRange({ ...dateRange, start: e.target.value })}
              leftIcon={<Calendar size={16} className="text-gray-400" />}
            />
            <Input
              type="date"
              label="End Date"
              value={dateRange.end}
              onChange={(e) => setDateRange({ ...dateRange, end: e.target.value })}
              leftIcon={<Calendar size={16} className="text-gray-400" />}
            />
          </div>
        </CardBody>
      </Card>
      
      <Card>
        <CardHeader>
          <h2 className="text-lg font-semibold text-gray-800">Transaction History</h2>
        </CardHeader>
        <CardBody className="p-0">
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Transaction ID
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Date
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Merchant
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Card
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Category
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Amount
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Reward Points
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Status
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                
                {
                  
                filteredTransactions.map(transaction => {
                  console.log('Rendering transaction:', transaction);
                  const card = userCards.find(c => c.id === transaction.cardId);
                  return (
                    <tr key={transaction.id} className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                        {transaction.transactionId}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {new Date(transaction.date).toLocaleDateString()}
                      </td>
                      <td className="px-6 py-4">
                        <div>
                          <p className="text-sm font-medium text-gray-900">{transaction.merchantName}</p>
                          <p className="text-sm text-gray-500">{transaction.description}</p>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        {card && (
                          <div className="flex items-center space-x-2">
                            <CreditCard size={16} className="text-gray-400" />
                            <span className={`px-2 py-1 text-xs font-medium rounded ${getCardTypeColor(card.cardType)}`}>
                              {card.cardType.toUpperCase()}
                            </span>
                          </div>
                        )}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className="px-2 py-1 text-xs font-medium rounded-full bg-gray-100 text-gray-800">
                          {transaction.category}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm">
                        <span className={transaction.isCredit ? 'text-green-600' : 'text-gray-900'}>
                          {transaction.isCredit ? '+' : '-'}{formatCurrency(transaction.amount)}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center space-x-1">
                          <Award size={16} className={transaction.rewardPoints >= 0 ? 'text-yellow-600' : 'text-red-600'} />
                          <span className={`text-sm ${transaction.rewardPoints >= 0 ? 'text-yellow-600' : 'text-red-600'}`}>
                            {transaction.rewardPoints > 0 ? '+' : ''}{transaction.rewardPoints}
                          </span>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        {transaction.isReversed ? (
                          <span className="px-2 py-1 text-xs font-medium rounded-full bg-red-100 text-red-800">
                            Reversed
                          </span>
                        ) : (
                          <span className="px-2 py-1 text-xs font-medium rounded-full bg-green-100 text-green-800">
                            Completed
                          </span>
                        )}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
            
            {filteredTransactions.length === 0 && (
              <div className="text-center py-8 text-gray-500">
                <p>No transactions found matching your criteria.</p>
              </div>
            )}
          </div>
        </CardBody>
      </Card>
    </div>
  );
};

export default Transactions;
