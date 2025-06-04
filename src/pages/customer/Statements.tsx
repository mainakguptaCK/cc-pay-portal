import React, { useState, useEffect } from 'react';
import { Download, FileText, Search, Calendar, Eye } from 'lucide-react';
import Card, { CardBody, CardHeader } from '../../components/ui/Card';
import Button from '../../components/ui/Button';
import Input from '../../components/ui/Input';
import { useCreditCard } from '../../context/CreditCardContext';
import { useAuth } from '../../context/useAuth';

const Statements: React.FC = () => {
  const { userStatements } = useCreditCard();
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedPeriod, setSelectedPeriod] = useState<string>('all');
  const [selectedCard, setSelectedCard] = useState<string>('all');
  const [userCards, setUserCards] = useState<any[]>([]);
    const { currentUser } = useAuth();
    const userId = currentUser?.id;

  useEffect(() => {
    const fetchData = async () => {
      try {
        const cardsRes = await fetch(
          'https://cc-pay-app-service-dev-cecxemfggbf0dzas.eastus-01.azurewebsites.net/api/card/getCardDetails',
          {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ UserID: userId }),
          }
        );
        const cardsData = await cardsRes.json();
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
          StatementCycleFrequency: card.StatementCycleFrequency,
          BillingDate: card.BillingDate,
          PaymentDue: card.PaymentDue
        }));
        setUserCards(normalizedCards);
      } catch (error) {
        console.error('Error fetching card data:', error);
      }
    };

    fetchData();
  }, [userId]);

  const selectedCardData = selectedCard === 'all'
    ? null
    : userCards.find(card => card.id === selectedCard);

  const filteredStatements = userStatements
    .filter(statement =>
      (selectedPeriod === 'all' || statement.period.toLowerCase().includes(selectedPeriod)) &&
      (searchTerm === '' || statement.period.toLowerCase().includes(searchTerm.toLowerCase())) &&
      (selectedCard === 'all' || statement.cardId === selectedCard)
    )
    .sort((a, b) => new Date(b.startDate).getTime() - new Date(a.startDate).getTime());

  const formatCurrency = (amount: number) =>
    new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
    }).format(amount);

  const formatCardNumber = (cardNumber: string) =>
    `**** **** **** ${cardNumber.slice(-4)}`;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-2xl font-bold text-gray-900">Statements</h1>
        <Button variant="outline" leftIcon={<Download size={16} />}>
          Download All
        </Button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2">
          {/* Statement List */}
          <Card>
            <CardHeader className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-2">
              <h2 className="text-lg font-semibold text-gray-800">Statement History</h2>
              <div className="flex flex-col sm:flex-row gap-2 w-full sm:w-auto sm:space-x-2">
                <Input
                  placeholder="Search statements"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  leftIcon={<Search size={16} className="text-gray-400" />}
                />
                <select
                  className="rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                  value={selectedPeriod}
                  onChange={(e) => setSelectedPeriod(e.target.value)}
                >
                  <option value="all">All Periods</option>
                  <option value="2025">2025</option>
                  <option value="2024">2024</option>
                </select>
                <select
                  className="rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
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
            </CardHeader>

            <CardBody className="p-0">
              <div className="divide-y divide-gray-200">
                {filteredStatements.map(statement => (
                  <div key={statement.id} className="p-6 hover:bg-gray-50">
                    <div className="flex items-start justify-between">
                      <div className="flex items-start">
                        <div className={`p-2 rounded-full ${
                          statement.isDownloaded ? 'bg-green-100' : 'bg-blue-100'
                        } mr-4`}>
                          <FileText size={20} className={
                            statement.isDownloaded ? 'text-green-700' : 'text-blue-700'
                          } />
                        </div>
                        <div>
                          <h3 className="font-medium text-gray-900">{statement.period}</h3>
                          <div className="mt-1 text-sm text-gray-500">
                            <div className="flex items-center">
                              <Calendar size={14} className="mr-1" />
                              {new Date(statement.startDate).toLocaleDateString()} - {new Date(statement.endDate).toLocaleDateString()}
                            </div>
                          </div>
                        </div>
                      </div>
                      <div className="flex items-center space-x-3">
                        <div className="text-right">
                          <p className="text-sm font-medium text-gray-900">
                            {formatCurrency(statement.totalSpent)}
                          </p>
                          <p className="text-xs text-gray-500">
                            Due: {new Date(statement.dueDate).toLocaleDateString()}
                          </p>
                        </div>
                        <div className="flex space-x-2">
                          <Button variant="outline" size="sm" leftIcon={<Eye size={14} />}>
                            View
                          </Button>
                          <Button variant="outline" size="sm" leftIcon={<Download size={14} />}>
                            Download
                          </Button>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}

                {filteredStatements.length === 0 && (
                  <div className="text-center py-8 text-gray-500">
                    <FileText size={32} className="mx-auto mb-3 text-gray-400" />
                    <p>No statements found matching your criteria.</p>
                  </div>
                )}
              </div>
            </CardBody>
          </Card>
        </div>

        {/* Statement Info */}
        <div>
        <Card className="mb-6">
          <CardHeader>
            <h2 className="text-lg font-semibold text-gray-800">Statement Information</h2>
          </CardHeader>
          <CardBody>
            {selectedCardData ? (
              <div className="space-y-4">
                <div>
                  <p className="text-sm text-gray-500">Statement Cycle</p>
                  <p className="font-medium">{selectedCardData.StatementCycleFrequency}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Billing Period</p>
                  <p className="font-medium">{selectedCardData.BillingDate}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Payment Due</p>
                  <p className="font-medium">{selectedCardData.PaymentDue} days after statement date</p>
                </div>
              </div>
            ) : (
              <div className="space-y-4 text-gray-500 text-sm">
                <p>Select a specific card to view statement details.</p>
              </div>
            )}

            <div className="mt-6">
              <Button variant="outline" fullWidth>
                Manage Statement Preferences
              </Button>
            </div>
          </CardBody>
        </Card>
      </div>
      </div>
    </div>
  );
};

export default Statements;