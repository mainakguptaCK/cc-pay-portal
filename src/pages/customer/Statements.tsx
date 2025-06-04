import React, { useState } from 'react';
import { Download, FileText, Search, Calendar, Eye } from 'lucide-react';
import Card, { CardBody, CardHeader } from '../../components/ui/Card';
import Button from '../../components/ui/Button';
import Input from '../../components/ui/Input';
import { useCreditCard } from '../../context/CreditCardContext';

const Statements: React.FC = () => {
  const { userStatements } = useCreditCard();
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedPeriod, setSelectedPeriod] = useState<string>('all');
  
  const filteredStatements = userStatements
    .filter(statement => 
      (selectedPeriod === 'all' || statement.period.toLowerCase().includes(selectedPeriod)) &&
      (searchTerm === '' || statement.period.toLowerCase().includes(searchTerm.toLowerCase()))
    )
    .sort((a, b) => new Date(b.startDate).getTime() - new Date(a.startDate).getTime());
  
  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
    }).format(amount);
  };
  
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-2xl font-bold text-gray-900">Statements</h1>
        <Button
          variant="outline"
          leftIcon={<Download size={16} />}
        >
          Download All
        </Button>
      </div>
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2">
          {/* Statement List */}
          <Card>
            <CardHeader className="flex justify-between items-center">
              <h2 className="text-lg font-semibold text-gray-800">Statement History</h2>
              <div className="flex space-x-2">
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
                          <Button
                            variant="outline"
                            size="sm"
                            leftIcon={<Eye size={14} />}
                          >
                            View
                          </Button>
                          <Button
                            variant="outline"
                            size="sm"
                            leftIcon={<Download size={14} />}
                          >
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
        
        <div>
          {/* Statement Info */}
          <Card className="mb-6">
            <CardHeader>
              <h2 className="text-lg font-semibold text-gray-800">Statement Information</h2>
            </CardHeader>
            <CardBody>
              <div className="space-y-4">
                <div>
                  <p className="text-sm text-gray-500">Statement Cycle</p>
                  <p className="font-medium">Monthly</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Billing Period</p>
                  <p className="font-medium">1st to Last day of month</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Payment Due</p>
                  <p className="font-medium">15 days after statement date</p>
                </div>
              </div>
              
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