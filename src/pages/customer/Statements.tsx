import React, { useState, useEffect } from "react";
import { Download, Search } from "lucide-react";
import Card, { CardBody, CardHeader } from "../../components/ui/Card";
import Button from "../../components/ui/Button";
// import Input from "../../components/ui/Input";
import { useAuth } from "../../context/useAuth";

const Statements: React.FC = () => {
  // const [searchTerm, setSearchTerm] = useState("");
  // const [selectedPeriod, setSelectedPeriod] = useState<string>("all");
  const [selectedCard, setSelectedCard] = useState<string>("all");
  const [userCards, setUserCards] = useState<any[]>([]);
  const { currentUser } = useAuth();
  const userId = currentUser?.id;

  useEffect(() => {
    const fetchData = async () => {
      try {
        const cardsRes = await fetch(
          "https://cc-pay-app-service-dev-cecxemfggbf0dzas.eastus-01.azurewebsites.net/api/card/getCardDetails",
          {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ UserID: userId }),
          }
        );
        const cardsData = await cardsRes.json();
        const normalizedCards = cardsData.cards.map((card: any) => ({
          id: card.CardID.toString(),
          cardNumber: card.CardNumber,
          isBlocked: card.CardStatus !== "Active",
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
          PaymentDue: card.PaymentDue,
        }));
        setUserCards(normalizedCards);
      } catch (error) {
        console.error("Error fetching card data:", error);
      }
    };

    fetchData();
  }, [userId]);

  const selectedCardData =
    selectedCard === "all"
      ? null
      : userCards.find((card) => card.id === selectedCard);

  const formatCardNumber = (cardNumber: string) =>
    `**** **** **** ${cardNumber.slice(-4)}`;

  const handleDownloadStatement = async (duration: number) => {
    if (!userId) return;

    if (selectedCard === "all") {
      alert("Please select a card to download the statement.");
      return;
    }

    const selectedCardData = userCards.find((card) => card.id === selectedCard);
    if (!selectedCardData) {
      alert("Invalid card selected.");
      return;
    }

    try {
      const res = await fetch(
        "https://cc-pay-app-service-dev-cecxemfggbf0dzas.eastus-01.azurewebsites.net/api/statement/download",
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            UserID: userId,
            Duration: duration,
            CardNumber: selectedCardData.cardNumber,
          }),
        }
      );

      if (!res.ok) throw new Error("Download failed");

      const blob = await res.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `statement_last_${duration}_months.pdf`;
      document.body.appendChild(a);
      a.click();
      a.remove();
      window.URL.revokeObjectURL(url);
    } catch (error) {
      console.error("Error downloading statement:", error);
      alert("Failed to download statement. Please try again.");
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-2xl font-bold text-gray-900">Statements</h1>
        {/* <Button variant="outline" leftIcon={<Download size={16} />}>
          Download All
        </Button> */}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2">
          {/* Statement List */}
          <Card>
            <CardHeader className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-2">
              <h2 className="text-lg font-semibold text-gray-800">
                Statement History
              </h2>
              <div className="flex flex-col sm:flex-row gap-2 w-full sm:w-auto sm:space-x-2">
                {/* <Input
                  placeholder="Search statements"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  leftIcon={<Search size={16} className="text-gray-400" />}
                /> */}
                {/* <select
                  className="rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                  value={selectedPeriod}
                  onChange={(e) => setSelectedPeriod(e.target.value)}
                >
                  <option value="all">All Periods</option>
                  <option value="2025">2025</option>
                  <option value="2024">2024</option>
                </select> */}
                <select
                  className="rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                  value={selectedCard}
                  onChange={(e) => setSelectedCard(e.target.value)}
                >
                  <option value="all">All Cards</option>
                  {userCards.map((card) => (
                    <option key={card.id} value={card.id}>
                      {card.cardType.toUpperCase()} -{" "}
                      {formatCardNumber(card.cardNumber)}
                    </option>
                  ))}
                </select>
              </div>
            </CardHeader>

            <CardBody className="flex flex-col sm:flex-row gap-4 p-6">
              <Button
                variant="outline"
                leftIcon={<Download size={16} />}
                onClick={() => handleDownloadStatement(1)}
              >
                Download Last Month Statement
              </Button>
              <Button
                variant="outline"
                leftIcon={<Download size={16} />}
                onClick={() => handleDownloadStatement(3)}
              >
                Download Last 3 Months Statement
              </Button>
            </CardBody>
          </Card>
        </div>

        {/* Statement Info */}
        <div>
          <Card className="mb-6">
            <CardHeader>
              <h2 className="text-lg font-semibold text-gray-800">
                Statement Information
              </h2>
            </CardHeader>
            <CardBody>
              {selectedCardData ? (
                <div className="space-y-4">
                  <div>
                    <p className="text-sm text-gray-500">Statement Cycle</p>
                    <p className="font-medium">
                      {selectedCardData.StatementCycleFrequency}
                    </p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Billing Period</p>
                    <p className="font-medium">
                      {selectedCardData.BillingDate}
                    </p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Payment Due</p>
                    <p className="font-medium">
                      {selectedCardData.PaymentDue} days after statement date
                    </p>
                  </div>
                </div>
              ) : (
                <div className="space-y-4 text-gray-500 text-sm">
                  <p>Select a specific card to view statement details.</p>
                </div>
              )}

              {/* <div className="mt-6">
                <Button variant="outline" fullWidth>
                  Manage Statement Preferences
                </Button>
              </div> */}
            </CardBody>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default Statements;
