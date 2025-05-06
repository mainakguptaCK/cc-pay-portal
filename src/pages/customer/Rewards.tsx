import React from 'react';
import { Gift, Star, Clock, ChevronRight, Award, Ticket, CreditCard } from 'lucide-react';
import Card, { CardBody, CardHeader } from '../../components/ui/Card';
import Button from '../../components/ui/Button';
import { useCreditCard } from '../../context/CreditCardContext';

const Rewards: React.FC = () => {
  const { userReward, userReferralLink } = useCreditCard();
  
  if (!userReward) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <h1 className="text-2xl font-bold text-gray-900 mb-8">Rewards</h1>
        <Card>
          <CardBody className="text-center py-12">
            <Gift size={48} className="mx-auto mb-4 text-gray-400" />
            <h2 className="text-xl font-semibold text-gray-900 mb-2">No Rewards Program Found</h2>
            <p className="text-gray-600 mb-6">You're not currently enrolled in our rewards program.</p>
            <Button variant="primary">Enroll Now</Button>
          </CardBody>
        </Card>
      </div>
    );
  }
  
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <h1 className="text-2xl font-bold text-gray-900 mb-8">Rewards</h1>
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2">
          {/* Points Overview */}
          <Card className="mb-8">
            <CardBody className="p-6">
              <div className="flex items-center justify-between mb-6">
                <div>
                  <h2 className="text-2xl font-bold text-gray-900">{userReward.points.toLocaleString()}</h2>
                  <p className="text-gray-600">Available Points</p>
                </div>
                <div className="bg-blue-100 p-3 rounded-full">
                  <Star size={24} className="text-blue-700" />
                </div>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <Button variant="outline" fullWidth leftIcon={<Gift size={16} />}>
                  Redeem Points
                </Button>
                <Button variant="outline" fullWidth leftIcon={<Clock size={16} />}>
                  Points History
                </Button>
                <Button variant="outline" fullWidth leftIcon={<CreditCard size={16} />}>
                  Earning Details
                </Button>
              </div>
            </CardBody>
          </Card>
          
          {/* Redemption Options */}
          <Card className="mb-8">
            <CardHeader>
              <h2 className="text-lg font-semibold text-gray-800">Popular Redemption Options</h2>
            </CardHeader>
            <CardBody className="p-0">
              <div className="divide-y divide-gray-200">
                <div className="p-6 hover:bg-gray-50 cursor-pointer">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center">
                      <div className="bg-purple-100 p-3 rounded-full mr-4">
                        <Ticket size={20} className="text-purple-700" />
                      </div>
                      <div>
                        <h3 className="font-medium text-gray-900">Travel Rewards</h3>
                        <p className="text-sm text-gray-500">Book flights, hotels, and car rentals</p>
                      </div>
                    </div>
                    <ChevronRight size={20} className="text-gray-400" />
                  </div>
                </div>
                
                <div className="p-6 hover:bg-gray-50 cursor-pointer">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center">
                      <div className="bg-green-100 p-3 rounded-full mr-4">
                        <Gift size={20} className="text-green-700" />
                      </div>
                      <div>
                        <h3 className="font-medium text-gray-900">Gift Cards</h3>
                        <p className="text-sm text-gray-500">Choose from popular retailers</p>
                      </div>
                    </div>
                    <ChevronRight size={20} className="text-gray-400" />
                  </div>
                </div>
                
                <div className="p-6 hover:bg-gray-50 cursor-pointer">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center">
                      <div className="bg-blue-100 p-3 rounded-full mr-4">
                        <CreditCard size={20} className="text-blue-700" />
                      </div>
                      <div>
                        <h3 className="font-medium text-gray-900">Statement Credit</h3>
                        <p className="text-sm text-gray-500">Apply points to your balance</p>
                      </div>
                    </div>
                    <ChevronRight size={20} className="text-gray-400" />
                  </div>
                </div>
              </div>
            </CardBody>
          </Card>
          
          {/* Recent Redemptions */}
          <Card>
            <CardHeader>
              <h2 className="text-lg font-semibold text-gray-800">Recent Redemptions</h2>
            </CardHeader>
            <CardBody className="p-0">
              <div className="divide-y divide-gray-200">
                {userReward.redemptionHistory.map(redemption => (
                  <div key={redemption.id} className="p-6">
                    <div className="flex justify-between items-start">
                      <div>
                        <p className="font-medium text-gray-900">{redemption.description}</p>
                        <p className="text-sm text-gray-500">
                          {new Date(redemption.date).toLocaleDateString()}
                        </p>
                      </div>
                      <p className="font-medium text-gray-900">
                        -{redemption.points.toLocaleString()} points
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </CardBody>
          </Card>
        </div>
        
        <div>
          {/* Points Expiry */}
          <Card className="mb-6">
            <CardHeader>
              <h2 className="text-lg font-semibold text-gray-800">Points Status</h2>
            </CardHeader>
            <CardBody>
              <div className="space-y-4">
                <div>
                  <p className="text-sm text-gray-500">Points Expiring</p>
                  <div className="flex items-center mt-1">
                    <Clock size={16} className="text-gray-400 mr-2" />
                    <p className="font-medium">
                      {new Date(userReward.expiryDate).toLocaleDateString()}
                    </p>
                  </div>
                </div>
                <div className="bg-yellow-50 border-l-4 border-yellow-400 p-4">
                  <div className="flex">
                    <div className="flex-shrink-0">
                      <Clock size={20} className="text-yellow-400" />
                    </div>
                    <div className="ml-3">
                      <p className="text-sm text-yellow-700">
                        Don't let your points expire! Redeem them before {new Date(userReward.expiryDate).toLocaleDateString()}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </CardBody>
          </Card>
          
          {/* Referral Program */}
          {userReferralLink && (
            <Card>
              <CardHeader>
                <h2 className="text-lg font-semibold text-gray-800">Refer & Earn</h2>
              </CardHeader>
              <CardBody>
                <div className="text-center mb-6">
                  <div className="bg-blue-100 p-3 rounded-full inline-block mb-4">
                    <Award size={24} className="text-blue-700" />
                  </div>
                  <h3 className="font-medium text-gray-900 mb-2">Share with Friends</h3>
                  <p className="text-sm text-gray-600">
                    Earn {userReferralLink.pointsEarned} points for each approved referral
                  </p>
                </div>
                
                <div className="bg-gray-50 p-4 rounded-lg mb-4">
                  <p className="text-sm font-medium text-gray-900 mb-1">Your Referral Code</p>
                  <p className="font-mono text-blue-700">{userReferralLink.code}</p>
                </div>
                
                <div className="space-y-3">
                  <Button variant="primary" fullWidth>
                
                    Share Link
                  </Button>
                  <div className="text-center">
                    <p className="text-sm text-gray-600">
                      Total Referrals: {userReferralLink.totalReferrals}
                    </p>
                    <p className="text-sm text-gray-600">
                      Points Earned: {userReferralLink.pointsEarned}
                    </p>
                  </div>
                </div>
              </CardBody>
            </Card>
          )}
        </div>
      </div>
    </div>
  );
};

export default Rewards;