import React, { useState } from 'react';
import { CheckCircle, XCircle, Search, Filter, Download } from 'lucide-react';
import Card, { CardBody, CardHeader } from '../../components/ui/Card';
import Button from '../../components/ui/Button';
import Input from '../../components/ui/Input';
import { useCreditCard } from '../../context/CreditCardContext';

const CreditDecisions: React.FC = () => {
  const { creditDecisions } = useCreditCard();
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState<'all' | 'approved' | 'declined'>('all');
  
  const filteredDecisions = creditDecisions
    .filter(decision => 
      (filterStatus === 'all' || decision.decision === filterStatus) &&
      (searchTerm === '' || decision.userId.toLowerCase().includes(searchTerm.toLowerCase()))
    )
    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
  
  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
    }).format(amount);
  };
  
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-2xl font-bold text-gray-900">Credit Decisions</h1>
        <Button
          variant="outline"
          leftIcon={<Download size={16} />}
        >
          Export Decisions
        </Button>
      </div>
      
      <Card className="mb-8">
        <CardBody>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <div className="col-span-2">
              <Input
                placeholder="Search by User ID"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                leftIcon={<Search size={16} className="text-gray-400" />}
                fullWidth
              />
            </div>
            <div className="flex space-x-2">
              <Button
                variant={filterStatus === 'all' ? 'primary' : 'outline'}
                onClick={() => setFilterStatus('all')}
                fullWidth
              >
                All
              </Button>
              <Button
                variant={filterStatus === 'approved' ? 'success' : 'outline'}
                onClick={() => setFilterStatus('approved')}
                fullWidth
              >
                Approved
              </Button>
              <Button
                variant={filterStatus === 'declined' ? 'danger' : 'outline'}
                onClick={() => setFilterStatus('declined')}
                fullWidth
              >
                Declined
              </Button>
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
        </CardBody>
      </Card>
      
      <Card>
        <CardHeader>
          <h2 className="text-lg font-semibold text-gray-800">Decision History</h2>
        </CardHeader>
        <CardBody className="p-0">
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Date
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    User ID
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Decision
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Suggested Limit
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Reason
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {filteredDecisions.map(decision => (
                  <tr key={decision.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {new Date(decision.date).toLocaleDateString()}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                      {decision.userId}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                        decision.decision === 'approved'
                          ? 'bg-green-100 text-green-800'
                          : 'bg-red-100 text-red-800'
                      }`}>
                        {decision.decision === 'approved' ? (
                          <CheckCircle size={14} className="mr-1" />
                        ) : (
                          <XCircle size={14} className="mr-1" />
                        )}
                        {decision.decision.toUpperCase()}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {decision.decision === 'approved' ? formatCurrency(decision.suggestedLimit) : '-'}
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-500">
                      {decision.reason}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
            
            {filteredDecisions.length === 0 && (
              <div className="text-center py-8 text-gray-500">
                <p>No credit decisions found matching your criteria.</p>
              </div>
            )}
          </div>
        </CardBody>
      </Card>
    </div>
  );
};

export default CreditDecisions;