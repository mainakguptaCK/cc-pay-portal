import React, { useState, useEffect } from 'react';
import { Lock, Unlock, Edit, User, CreditCard as CreditCardIcon, Mail, AlertCircle } from 'lucide-react';
import Card, { CardBody, CardHeader } from '../../components/ui/Card';
import Button from '../../components/ui/Button';
import Input from '../../components/ui/Input';
import { useCreditCard } from '../../context/CreditCardContext';
import { User as UserType } from '../../types';

const UserManagement: React.FC = () => {
  const { allCards, lockUserAccount, updateUserCreditLimit } = useCreditCard();
  const [allUsers, setAllUsers] = useState<UserType[]>([]);
  const [selectedUser, setSelectedUser] = useState<UserType | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [creditLimits, setCreditLimits] = useState<Record<string, string>>({});
  const [loading, setLoading] = useState(true);

  // Fetch users from backend
  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const response = await fetch('https://cc-pay-app-service-dev-cecxemfggbf0dzas.eastus-01.azurewebsites.net/api/user/findAllUsers');
        const data = await response.json();

        // Map API response to your internal UserType
        const mappedUsers: UserType[] = data.users.map((user: any) => ({
          id: user.UserID.toString(),
          name: `${user.FirstName} ${user.LastName}`,
          email: user.Email,
          isLocked: user.AccountStatus !== 'Active',
          role: 'customer', // Assuming all fetched users are customers
        }));

        setAllUsers(mappedUsers);
      } catch (error) {
        console.error('Error fetching users:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchUsers();
  }, []);

  // Filter users
  const filteredUsers = allUsers.filter(user => 
    (searchQuery === '' || 
      user.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      user.email.toLowerCase().includes(searchQuery.toLowerCase()))
  );
  
  // Get user's cards
  const getUserCards = (userId: string) => {
    return allCards.filter(card => card.userId === userId);
  };

  // Format currency
  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
    }).format(amount);
  };

  // Handle credit limit update
  const handleCreditLimitUpdate = (cardId: string) => {
    const newLimit = creditLimits[cardId];
    if (!newLimit) return;

    updateUserCreditLimit(selectedUser!.id, Number(newLimit));
    setCreditLimits(prev => ({ ...prev, [cardId]: '' }));
  };

  const getCardTypeColor = (cardType: string) => {
    const colors = {
      platinum: 'bg-gray-800 text-white',
      gold: 'bg-yellow-600 text-white',
      titanium: 'bg-blue-700 text-white',
      business: 'bg-green-700 text-white',
      rewards: 'bg-purple-700 text-white'
    };
    return colors[cardType as keyof typeof colors] || 'bg-gray-600 text-white';
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <h1 className="text-2xl font-bold text-gray-900 mb-8">User Management</h1>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* User List */}
        <div>
          <Card>
            <CardHeader className="flex justify-between items-center">
              <h2 className="text-lg font-semibold text-gray-800">Customer List</h2>
              <Button variant="outline" size="sm">Add User</Button>
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
                <div className="text-center py-6 text-gray-500">Loading users...</div>
              ) : (
                <ul className="divide-y divide-gray-200 max-h-96 overflow-y-auto">
                  {filteredUsers.map(user => (
                    <li 
                      key={user.id} 
                      className={`px-6 py-4 cursor-pointer hover:bg-gray-50 transition-colors ${
                        selectedUser?.id === user.id ? 'bg-blue-50 border-l-4 border-blue-700' : ''
                      }`}
                      onClick={() => setSelectedUser(user)}
                    >
                      <div className="flex items-center space-x-4">
                        <div className="bg-gray-100 p-2 rounded-full">
                          <User size={18} className="text-gray-600" />
                        </div>
                        <div className="flex-1">
                          <p className="font-medium text-gray-900">{user.name}</p>
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
                  <h2 className="text-lg font-semibold text-gray-800">User Details</h2>
                  <div className="flex space-x-2">
                    <Button 
                      variant="outline" 
                      size="sm"
                      leftIcon={<Edit size={16} />}
                    >
                      Edit
                    </Button>
                    <Button 
                      variant={selectedUser.isLocked ? 'success' : 'danger'} 
                      size="sm"
                      leftIcon={selectedUser.isLocked ? <Unlock size={16} /> : <Lock size={16} />}
                      onClick={() => lockUserAccount(selectedUser.id, !selectedUser.isLocked)}
                    >
                      {selectedUser.isLocked ? 'Unlock Account' : 'Lock Account'}
                    </Button>
                  </div>
                </CardHeader>
                <CardBody>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <h3 className="text-sm font-medium text-gray-500 mb-2">User Information</h3>
                      <div className="bg-gray-50 rounded-lg p-4">
                        <p className="font-medium text-gray-900 mb-1">{selectedUser.name}</p>
                        <p className="text-gray-600 mb-3">{selectedUser.email}</p>
                        <p className="text-sm text-gray-500">
                          User ID: <span className="font-mono bg-gray-100 px-1 rounded">{selectedUser.id}</span>
                        </p>
                        <p className="text-sm text-gray-500 mt-1">
                          Status: <span className={`font-medium ${selectedUser.isLocked ? 'text-red-600' : 'text-green-600'}`}>
                            {selectedUser.isLocked ? 'Locked' : 'Active'}
                          </span>
                        </p>
                      </div>
                    </div>
                    
                    <div>
                      <h3 className="text-sm font-medium text-gray-500 mb-2">Actions</h3>
                      <div className="space-y-3">
                        <Button 
                          variant="outline" 
                          fullWidth
                          leftIcon={<Mail size={16} />}
                        >
                          Update Email Address
                        </Button>
                        <Button 
                          variant="outline" 
                          fullWidth
                          leftIcon={<AlertCircle size={16} />}
                        >
                          Send Verification Code
                        </Button>
                        <Button 
                          variant="outline" 
                          fullWidth
                          leftIcon={<CreditCardIcon size={16} />}
                        >
                          Issue Replacement Card
                        </Button>
                      </div>
                    </div>
                  </div>
                </CardBody>
              </Card>
              
              {/* Credit Card Details */}
              <Card>
                <CardHeader>
                  <h2 className="text-lg font-semibold text-gray-800">Credit Card Information</h2>
                </CardHeader>
                <CardBody>
                  {getUserCards(selectedUser.id).length > 0 ? (
                    <div className="space-y-6">
                      {getUserCards(selectedUser.id).map(card => (
                        <div key={card.id} className="bg-gray-50 rounded-lg p-4">
                          <div className="flex justify-between items-start mb-4">
                            <div className="flex items-center">
                              <CreditCardIcon size={20} className="text-blue-700 mr-2" />
                              <span className="font-medium">{card.cardNumber}</span>
                              <span className={`ml-2 px-2 py-1 text-xs font-medium rounded ${getCardTypeColor(card.cardType)}`}>
                                {card.cardType.toUpperCase()}
                              </span>
                            </div>
                            <div className={`px-2 py-1 rounded-full text-xs font-medium ${
                              card.isBlocked ? 'bg-red-100 text-red-800' : 'bg-green-100 text-green-800'
                            }`}>
                              {card.isBlocked ? 'Blocked' : 'Active'}
                            </div>
                          </div>
                          
                          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                            <div>
                              <p className="text-sm text-gray-500">Credit Limit</p>
                              <p className="font-semibold">{formatCurrency(card.creditLimit)}</p>
                            </div>
                            <div>
                              <p className="text-sm text-gray-500">Available Credit</p>
                              <p className="font-semibold">{formatCurrency(card.availableLimit)}</p>
                            </div>
                            <div>
                              <p className="text-sm text-gray-500">Outstanding Balance</p>
                              <p className="font-semibold">{formatCurrency(card.totalOutstanding)}</p>
                            </div>
                          </div>
                          
                          <div>
                            <h4 className="text-sm font-medium text-gray-700 mb-2">Update Credit Limit</h4>
                            <div className="flex space-x-3">
                              <Input
                                type="number"
                                placeholder="New credit limit"
                                value={creditLimits[card.id] || ''}
                                onChange={(e) => setCreditLimits(prev => ({
                                  ...prev,
                                  [card.id]: e.target.value
                                }))}
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
                    <div className="text-center py-6 text-gray-500">
                      <CreditCardIcon size={48} className="mx-auto mb-4 text-gray-300" />
                      <p>No credit cards found for this user.</p>
                      <Button variant="outline" size="sm" className="mt-3">
                        Issue New Card
                      </Button>
                    </div>
                  )}
                </CardBody>
              </Card>
            </>
          ) : (
            <div className="bg-white p-8 rounded-lg shadow-md text-center">
              <User size={48} className="mx-auto mb-4 text-gray-300" />
              <h2 className="text-xl font-semibold text-gray-800 mb-2">No User Selected</h2>
              <p className="text-gray-600">Select a user from the list to view and manage their details.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default UserManagement;
