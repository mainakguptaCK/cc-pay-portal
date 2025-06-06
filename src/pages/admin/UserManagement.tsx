import React, { useState, useEffect } from "react";
import {
  Lock,
  Unlock,
  Edit,
  User,
  CreditCard as CreditCardIcon,
  Mail,
} from "lucide-react";
import Card, { CardBody, CardHeader } from "../../components/ui/Card";
import Button from "../../components/ui/Button";
import Input from "../../components/ui/Input";
import { User as UserType, CreditCard } from "../../types";

const UserManagement: React.FC = () => {
  const [allUsers, setAllUsers] = useState<UserType[]>([]);
  const [selectedUser, setSelectedUser] = useState<UserType | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [creditLimits, setCreditLimits] = useState<Record<string, string>>({});
  const [loading, setLoading] = useState(true);
  const [userCards, setUserCards] = useState<CreditCard[]>([]);
  const [showCardForm, setShowCardForm] = useState(false);
  const [newEmail, setNewEmail] = useState(selectedUser?.email || "");
  const [newCardDetails, setNewCardDetails] = useState({
    cardNumber: "",
    cardType: "",
    creditLimit: "",
    cardholderName: "",
  });

  // Fetch users from backend
  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const response = await fetch(
          "https://cc-pay-app-service-dev-cecxemfggbf0dzas.eastus-01.azurewebsites.net/api/user/findAllUsers"
        );
        const data = await response.json();
        const mappedUsers: UserType[] = data.users.map((user: any) => ({
          id: user.id.toString(),
          name: user.displayName,
          email: user.Email,
          isLocked: !user.accountEnabled,
          role: "customer",
        }));
        setAllUsers(mappedUsers);
      } catch (error) {
        console.error("Error fetching users:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchUsers();
  }, []);

  // Fetch credit card details when user is selected
  useEffect(() => {
    const fetchUserCards = async (userId: string) => {
      try {
        const response = await fetch(
          "https://cc-pay-app-service-dev-cecxemfggbf0dzas.eastus-01.azurewebsites.net/api/card/getCardDetails",
          {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ UserID: userId }),
          }
        );
        const data = await response.json();
        console.log(data.cards);
        const mappedCards: CreditCard[] = (data.cards || []).map(
          (card: any) => ({
            id: card.CardID.toString(),
            cardNumber: card.CardNumber,
            cardType: card.CardType,
            creditLimit: card.CreditLimit,
            totalOutstanding: card.OutStandingBalance,
            availableLimit: card.CreditLimit - card.OutStandingBalance,
            cardholderName: card.CardholderName,
            isBlocked: card.CardStatus !== "Active",
            expirationDate: card.ExpirationDate,
          })
        );
        setUserCards(mappedCards);
      } catch (error) {
        console.error("Error fetching user cards:", error);
        setUserCards([]);
      }
    };
    if (selectedUser) {
      fetchUserCards(selectedUser.id);
    } else {
      setUserCards([]);
    }
  }, [selectedUser]);

  const handleIssueNewCard = async () => {
    if (!selectedUser) return;

    try {
      console.log(selectedUser);
      const response = await fetch(
        "https://cc-pay-app-service-dev-cecxemfggbf0dzas.eastus-01.azurewebsites.net/api/admin/createCard",
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            UserID: selectedUser.id,
            CardNumber: newCardDetails.cardNumber,
            CardType: newCardDetails.cardType,
            CardStatus: "Active",
            CreditLimit: parseFloat(newCardDetails.creditLimit),
            OutStandingBalance: 0.0,
            CardHolderName: newCardDetails.cardholderName,
          }),
        }
      );

      if (response.ok) {
        // Refresh card list after issuing new card
        const updatedResponse = await fetch(
          "https://cc-pay-app-service-dev-cecxemfggbf0dzas.eastus-01.azurewebsites.net/api/card/getCardDetails",
          {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ UserID: selectedUser.id }),
          }
        );
        const updatedData = await updatedResponse.json();
        const mappedCards: CreditCard[] = (updatedData.cards || []).map(
          (card: any) => ({
            id: card.CardID.toString(),
            cardNumber: card.CardNumber,
            cardType: card.CardType,
            creditLimit: card.CreditLimit,
            totalOutstanding: card.OutStandingBalance,
            availableLimit: card.CreditLimit - card.OutStandingBalance,
            cardholderName: card.CardholderName,
            isBlocked: card.CardStatus !== "Active",
            expirationDate: card.ExpirationDate,
          })
        );
        setUserCards(mappedCards);

        // Clear form
        setShowCardForm(false);
        setNewCardDetails({
          cardNumber: "",
          cardType: "",
          creditLimit: "",
          cardholderName: "",
        });
      } else {
        console.error("Failed to issue new card");
      }
    } catch (error) {
      console.error("Error issuing card:", error);
    }
  };

  const handleUpdateEmail = async () => {
    if (!selectedUser || !newEmail) return;

    setLoading(true);
    try {
      const response = await fetch(
        "http://127.0.0.1:5000/api/admin/updateUserEmail", // 🔁 Update URL if needed
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            userID: selectedUser.id,
            email: newEmail,
          }),
        }
      );

      if (response.ok) {
        console.log("Email updated successfully");
      } else {
        console.error("Failed to update email");
      }
    } catch (err) {
      console.error("Error updating email:", err);
    } finally {
      setLoading(false);
    }
  };

  const filteredUsers = allUsers.filter((user) => {
  const name = user.name || "";
  const email = user.email || "";
  return (
    searchQuery === "" ||
    name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    email.toLowerCase().includes(searchQuery.toLowerCase())
  );
});

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
    }).format(amount);
  };

  const handleCreditLimitUpdate = async (cardId: string) => {
    const newLimit = creditLimits[cardId];
    if (!newLimit || !selectedUser) return;

    const card = userCards.find((c) => c.id === cardId);
    if (!card) {
      console.error("Card not found.");
      return;
    }

    try {
      const response = await fetch(
        "https://cc-pay-app-service-dev-cecxemfggbf0dzas.eastus-01.azurewebsites.net/api/admin/updateCardDetails",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            CardNumber: card.cardNumber,
            UserID: selectedUser.id,
            CreditLimit: parseFloat(newLimit),
          }),
        }
      );

      if (!response.ok) {
        throw new Error("Failed to update credit limit.");
      }

      const result = await response.json();
      console.log("Credit limit updated:", result);

      // Optionally refresh card data
      setCreditLimits((prev) => ({ ...prev, [cardId]: "" }));
      setUserCards((prevCards) =>
        prevCards.map((c) => {
          // Find the card that was just updated
          if (c.id === cardId) {
            const newCreditLimit = parseFloat(newLimit);
            // Also recalculate the available limit
            const newAvailableLimit = newCreditLimit - c.totalOutstanding;
            
            // Return a new object for the updated card
            return {
              ...c,
              creditLimit: newCreditLimit,
              availableLimit: newAvailableLimit,
            };
          }
          // Return all other cards unchanged
          return c;
        }));
      // Optionally, refetch card details here to reflect new limit
    } catch (error) {
      console.error("Error updating credit limit:", error);
    }
  };

  const getCardTypeColor = (cardType: string) => {
    const colors = {
      platinum: "bg-gray-800 text-white",
      gold: "bg-yellow-600 text-white",
      titanium: "bg-blue-700 text-white",
      business: "bg-green-700 text-white",
      rewards: "bg-purple-700 text-white",
    };
    return colors[cardType as keyof typeof colors] || "bg-gray-600 text-white";
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <h1 className="text-2xl font-bold text-gray-900 mb-8">User Management</h1>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* User List */}
        <div>
          <Card>
            <CardHeader className="flex justify-between items-center">
              <h2 className="text-lg font-semibold text-gray-800">
                Customer List
              </h2>
              {/* <Button variant="outline" size="sm">
                Add User
              </Button> */}
            </CardHeader>
            <div className="px-6 py-4 border-b border-gray-200">
              <Input
                placeholder="Search by name or email"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                leftIcon={<Mail size={16} className="text-gray-400" />}
                fullWidth
              />
            </div>
            <CardBody className="p-0">
              {loading ? (
                <div className="text-center py-6 text-gray-500">
                  Loading users...
                </div>
              ) : (
                <ul className="divide-y divide-gray-200 max-h-96 overflow-y-auto">
                  {filteredUsers.map((user) => (
                    <li
                      key={user.id}
                      className={`px-6 py-4 cursor-pointer hover:bg-gray-50 transition-colors ${
                        selectedUser?.id === user.id
                          ? "bg-blue-50 border-l-4 border-blue-700"
                          : ""
                      }`}
                      onClick={() => setSelectedUser(user)}
                    >
                      <div className="flex items-center space-x-4">
                        <div className="bg-gray-100 p-2 rounded-full">
                          <User size={18} className="text-gray-600" />
                        </div>
                        <div className="flex-1">
                          <p className="font-medium text-gray-900">
                            {user.name}
                          </p>
                          <p className="text-sm text-gray-500">{user.email}</p>
                        </div>
                        {user.isLocked && (
                          <span className="px-2 py-1 rounded-full text-xs font-medium bg-red-100 text-red-800">
                            Locked
                          </span>
                        )}
                      </div>
                    </li>
                  ))}
                  {filteredUsers.length === 0 && (
                    <li className="px-6 py-8 text-center text-gray-500">
                      No users found matching your search.
                    </li>
                  )}
                </ul>
              )}
            </CardBody>
          </Card>
        </div>

        {/* User Details */}
        <div className="lg:col-span-2">
          {selectedUser ? (
            <>
              <Card className="mb-6">
                <CardHeader className="flex justify-between items-center">
                  <h2 className="text-lg font-semibold text-gray-800">
                    User Details
                  </h2>
                  {/* <div className="flex space-x-2">
                    <Button
                      variant="outline"
                      size="sm"
                      leftIcon={<Edit size={16} />}
                    >
                      Edit
                    </Button>
                    <Button
                      variant={selectedUser.isLocked ? "success" : "danger"}
                      size="sm"
                      leftIcon={
                        selectedUser.isLocked ? (
                          <Unlock size={16} />
                        ) : (
                          <Lock size={16} />
                        )
                      }
                      onClick={async () => {
                        if (!selectedUser) return;
                        const newStatus = !selectedUser.isLocked;
                        try {
                          const response = await fetch(
                            "https://cc-pay-app-service-dev-cecxemfggbf0dzas.eastus-01.azurewebsites.net/api/admin/updateUserAccountStatus",
                            {
                              method: "POST",
                              headers: { "Content-Type": "application/json" },
                              body: JSON.stringify({
                                userID: selectedUser.id,
                                accountEnabled: !newStatus, // accountEnabled should be false if locking
                              }),
                            }
                          );

                          if (response.ok) {
                            setSelectedUser((prev) =>
                              prev ? { ...prev, isLocked: newStatus } : prev
                            );
                            setAllUsers((prevUsers) =>
                              prevUsers.map((user) =>
                                user.id === selectedUser.id
                                  ? { ...user, isLocked: newStatus }
                                  : user
                              )
                            );
                          } else {
                            console.error("Failed to update user status");
                          }
                        } catch (err) {
                          console.error(
                            "Error updating user account status:",
                            err
                          );
                        }
                      }}
                    >
                      {selectedUser.isLocked
                        ? "Unlock Account"
                        : "Lock Account"}
                    </Button>
                  </div> */}
                </CardHeader>
                <CardBody>
                  <div className="grid grid-cols-1 md:grid-cols-1 gap-6">
                    <div>
                      <h3 className="text-sm font-medium text-gray-500 mb-2">
                        User Information
                      </h3>
                      <div className="bg-gray-50 rounded-lg p-4">
                        <p className="font-medium text-gray-900 mb-1">
                          {selectedUser.name}
                        </p>
                        <p className="text-gray-600 mb-3">
                          {selectedUser.email}
                        </p>
                        <p className="text-sm text-gray-500">
                          User ID:{" "}
                          <span className="font-mono bg-gray-100 px-1 rounded">
                            {selectedUser.id}
                          </span>
                        </p>
                        <p className="text-sm text-gray-500 mt-1">
                          Status:{" "}
                          <span
                            className={`font-medium ${
                              selectedUser.isLocked
                                ? "text-red-600"
                                : "text-green-600"
                            }`}
                          >
                            {selectedUser.isLocked ? "Locked" : "Active"}
                          </span>
                        </p>
                      </div>
                    </div>

                    {/* <div>
                      <h3 className="text-sm font-medium text-gray-500 mb-2">
                        Actions
                      </h3>
                      <div className="space-y-3">
                        <input
                          type="email"
                          className="w-full border border-gray-300 rounded-md p-2 text-sm"
                          placeholder="Enter new email address"
                          value={newEmail}
                          onChange={(e) => setNewEmail(e.target.value)}
                        />
                        <Button
                          variant="outline"
                          fullWidth
                          leftIcon={<Mail size={16} />}
                          onClick={handleUpdateEmail}
                          disabled={loading}
                        >
                          {loading ? "Updating..." : "Update Email Address"}
                        </Button>
                      </div>
                    </div> */}
                  </div>
                </CardBody>
              </Card>

              {/* Credit Card Details */}
              <Card>
                <CardHeader className="flex justify-between items-center">
                  <h2 className="text-lg font-semibold text-gray-800">
                    Credit Card Information
                  </h2>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setShowCardForm(true)}
                  >
                    Issue New Card
                  </Button>
                </CardHeader>

                <CardBody>
                  {userCards.length > 0 ? (
                    <div className="space-y-6">
                      {userCards.map((card) => (
                        <div
                          key={card.id}
                          className="bg-gray-50 rounded-lg p-4"
                        >
                          <div className="flex justify-between items-start mb-4">
                            <div className="flex items-center">
                              <CreditCardIcon
                                size={20}
                                className="text-blue-700 mr-2"
                              />
                              <span className="font-medium">
                                {card.cardNumber}
                              </span>
                              <span
                                className={`ml-2 px-2 py-1 text-xs font-medium rounded ${getCardTypeColor(
                                  card.cardType
                                )}`}
                              >
                                {card.cardType.toUpperCase()}
                              </span>
                            </div>
                            <div
                              className={`px-2 py-1 rounded-full text-xs font-medium ${
                                card.isBlocked
                                  ? "bg-red-100 text-red-800"
                                  : "bg-green-100 text-green-800"
                              }`}
                            >
                              {card.isBlocked ? "Blocked" : "Active"}
                            </div>
                          </div>

                          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                            <div>
                              <p className="text-sm text-gray-500">
                                Credit Limit
                              </p>
                              <p className="font-semibold">
                                {formatCurrency(card.creditLimit)}
                              </p>
                            </div>
                            <div>
                              <p className="text-sm text-gray-500">
                                Available Credit
                              </p>
                              <p className="font-semibold">
                                {formatCurrency(card.availableLimit)}
                              </p>
                            </div>
                            <div>
                              <p className="text-sm text-gray-500">
                                Outstanding Balance
                              </p>
                              <p className="font-semibold">
                                {formatCurrency(card.totalOutstanding)}
                              </p>
                            </div>
                          </div>

                          <div>
                            <h4 className="text-sm font-medium text-gray-700 mb-2">
                              Update Credit Limit
                            </h4>
                            <div className="flex space-x-3">
                              <Input
                                type="number"
                                placeholder="New credit limit"
                                value={creditLimits[card.id] || ""}
                                onChange={(e) =>
                                  setCreditLimits((prev) => ({
                                    ...prev,
                                    [card.id]: e.target.value,
                                  }))
                                }
                                fullWidth
                              />
                              <Button
                                variant="primary"
                                onClick={() => handleCreditLimitUpdate(card.id)}
                                disabled={!creditLimits[card.id]}
                              >
                                Update
                              </Button>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="text-center text-gray-500 py-6">
                      <p>No credit cards associated with this user.</p>
                    </div>
                  )}

                  {/* Show form only if user clicked "Issue New Card" */}
                  {showCardForm && (
                    <div className="mt-6 space-y-3 text-left max-w-md mx-auto">
                      <Input
                        placeholder="Card Number"
                        value={newCardDetails.cardNumber}
                        onChange={(e) =>
                          setNewCardDetails((prev) => ({
                            ...prev,
                            cardNumber: e.target.value,
                          }))
                        }
                      />
                      <Input
                        placeholder="Card Type (e.g., Master, Platinum)"
                        value={newCardDetails.cardType}
                        onChange={(e) =>
                          setNewCardDetails((prev) => ({
                            ...prev,
                            cardType: e.target.value,
                          }))
                        }
                      />
                      <Input
                        placeholder="Credit Limit"
                        type="number"
                        value={newCardDetails.creditLimit}
                        onChange={(e) =>
                          setNewCardDetails((prev) => ({
                            ...prev,
                            creditLimit: e.target.value,
                          }))
                        }
                      />
                      <Input
                        placeholder="Cardholder Name"
                        value={newCardDetails.cardholderName}
                        onChange={(e) =>
                          setNewCardDetails((prev) => ({
                            ...prev,
                            cardholderName: e.target.value,
                          }))
                        }
                      />
                      <Button variant="primary" onClick={handleIssueNewCard}>
                        Submit & Issue
                      </Button>
                      <Button
                        variant="outline"
                        onClick={() => setShowCardForm(false)}
                      >
                        Cancel
                      </Button>
                    </div>
                  )}
                </CardBody>
              </Card>
            </>
          ) : (
            <div className="bg-white p-8 rounded-lg shadow-md text-center">
              <User size={48} className="mx-auto mb-4 text-gray-300" />
              <h2 className="text-xl font-semibold text-gray-800 mb-2">
                No User Selected
              </h2>
              <p className="text-gray-600">
                Select a user from the list to view and manage their details.
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default UserManagement;
