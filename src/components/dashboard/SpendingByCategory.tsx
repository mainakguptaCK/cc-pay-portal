import React from 'react';
import { PieChart, BarChart3 } from 'lucide-react';
import Card, { CardBody, CardHeader } from '../ui/Card';
import { Transaction } from '../../types';

interface SpendingByCategoryProps {
  transactions: Transaction[];
}

interface CategoryTotal {
  category: string;
  total: number;
  color: string;
}

const SpendingByCategory: React.FC<SpendingByCategoryProps> = ({ transactions }) => {
  // Filter out credit transactions
  const expenses = transactions.filter(tx => !tx.isCredit);
  
  // Calculate totals by category
  const categoryTotals = expenses.reduce<Record<string, number>>((acc, tx) => {
    if (!acc[tx.category]) {
      acc[tx.category] = 0;
    }
    acc[tx.category] += tx.amount;
    return acc;
  }, {});
  
  // Format categories with colors
  const categoryColors: Record<string, string> = {
    'Shopping': '#4C51BF', // indigo-600
    'Food & Drinks': '#805AD5', // purple-600
    'Entertainment': '#D53F8C', // pink-600
    'Travel': '#ED8936', // orange-500
    'Utilities': '#38B2AC', // teal-500
    'Transportation': '#3182CE', // blue-600
    'Health': '#E53E3E', // red-600
    'Education': '#48BB78', // green-500
    'Other': '#718096', // gray-600
  };
  
  // Create formatted category totals array
  const formattedCategoryTotals: CategoryTotal[] = Object.entries(categoryTotals)
    .map(([category, total]) => ({
      category,
      total,
      color: categoryColors[category] || '#718096',
    }))
    .sort((a, b) => b.total - a.total);
  
  // Calculate total spending
  const totalSpending = formattedCategoryTotals.reduce((sum, cat) => sum + cat.total, 0);
  
  // Format currency
  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
    }).format(amount);
  };
  
  return (
    <Card className="h-full">
      <CardHeader className="flex justify-between items-center">
        <h3 className="font-semibold text-lg text-gray-800">Spending by Category</h3>
        <div className="flex space-x-2">
          <button className="p-1.5 bg-blue-100 rounded-full text-blue-900">
            <PieChart size={16} />
          </button>
          <button className="p-1.5 bg-gray-100 rounded-full text-gray-500">
            <BarChart3 size={16} />
          </button>
        </div>
      </CardHeader>
      <CardBody>
        {formattedCategoryTotals.length > 0 ? (
          <>
            <div className="mb-6 relative pt-1">
              <div className="flex h-4 mb-4 overflow-hidden text-xs rounded-full">
                {formattedCategoryTotals.map((cat, index) => (
                  <div
                    key={index}
                    className="flex flex-col justify-center"
                    style={{
                      width: `${(cat.total / totalSpending) * 100}%`,
                      backgroundColor: cat.color,
                    }}
                  />
                ))}
              </div>
              <p className="text-sm text-gray-600 mb-2">Total Spending: {formatCurrency(totalSpending)}</p>
            </div>
            
            <div className="space-y-3">
              {formattedCategoryTotals.map((cat, index) => (
                <div key={index} className="flex items-center justify-between">
                  <div className="flex items-center">
                    <div
                      className="w-3 h-3 rounded-full mr-2"
                      style={{ backgroundColor: cat.color }}
                    />
                    <span className="text-sm text-gray-700">{cat.category}</span>
                  </div>
                  <div className="flex items-center">
                    <span className="text-sm font-medium">{formatCurrency(cat.total)}</span>
                    <span className="text-xs text-gray-500 ml-2">
                      {((cat.total / totalSpending) * 100).toFixed(1)}%
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </>
        ) : (
          <div className="py-8 text-center text-gray-500">
            <p>No spending data available.</p>
          </div>
        )}
      </CardBody>
    </Card>
  );
};

export default SpendingByCategory;