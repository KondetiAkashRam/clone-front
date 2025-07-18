import React from 'react';
import { 
  LayoutDashboard, 
  FileText, 
  CreditCard, 
  Receipt, 
  Package, 
  RotateCcw,
  BookOpen,
  Calculator,
  PieChart,
  TrendingUp,
  Building2 // Add a company icon
} from 'lucide-react';

interface SidebarProps {
  activeSection: string;
  onSectionChange: (section: string) => void;
}

const menuItems = [
  { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
  { id: 'company-info', label: 'Company Info', icon: Building2 }, // New section
  { id: 'documents-ai', label: 'Documents AI', icon: FileText },
  { id: 'bank-transactions', label: 'Bank Transactions', icon: CreditCard },
  { id: 'invoices', label: 'Invoices', icon: Receipt },
  { id: 'bills', label: 'Bills', icon: Receipt },
  { id: 'inventory', label: 'Inventory', icon: Package },
  { id: 'item-restocks', label: 'Item Restocks', icon: RotateCcw },
  { id: 'manual-journals', label: 'Manual Journals', icon: BookOpen },
  { id: 'general-ledgers', label: 'General Ledgers', icon: BookOpen },
  { id: 'general-entries', label: 'General Entries', icon: Calculator },
  { id: 'financial-statements', label: 'Financial Statements', icon: TrendingUp },
  { id: 'full-financial-statement', label: 'Full Financial Statement', icon: FileText }, // New section
];

export { menuItems }; // Export for use in App

export const Sidebar: React.FC<SidebarProps> = ({ activeSection, onSectionChange }) => {
  // Use context properly
  let fetchDashboardSummary: (() => Promise<void>) | undefined;
  let fetchTransactions: (() => Promise<void>) | undefined;
  try {
    // Only call hook inside component
    // eslint-disable-next-line react-hooks/rules-of-hooks
    const context = require('../context/AppContext').useAppContext?.();
    fetchDashboardSummary = context?.fetchDashboardSummary;
    fetchTransactions = context?.fetchTransactions;
  } catch {}
  const handleRefresh = async () => {
    if (!window.confirm('Are you sure you want to reset all data? This cannot be undone.')) return;
    await fetch('http://localhost:8000/reset-data/', { method: 'POST' });
    if (fetchDashboardSummary) await fetchDashboardSummary();
    if (fetchTransactions) await fetchTransactions();
    window.location.reload(); // Optionally reload to clear all state
  };
  return (
    <div className="w-64 bg-white shadow-lg h-screen fixed left-0 top-0 z-10 flex flex-col justify-between">
      <div>
        <div className="p-6 border-b border-gray-200">
          <div className="flex items-center space-x-2">
            <PieChart className="w-8 h-8 text-blue-600" />
            <h1 className="text-xl font-bold text-gray-800">FinanceAI</h1>
          </div>
        </div>
        <nav className="mt-6">
          {menuItems.map((item) => {
            const Icon = item.icon;
            return (
              <button
                key={item.id}
                onClick={() => onSectionChange(item.id)}
                className={`w-full flex items-center space-x-3 px-6 py-3 text-left transition-all duration-200 ${
                  activeSection === item.id
                    ? 'bg-blue-50 text-blue-600 border-r-2 border-blue-600'
                    : 'text-gray-600 hover:bg-gray-50 hover:text-gray-800'
                }`}
              >
                <Icon className="w-5 h-5" />
                <span className="font-medium">{item.label}</span>
              </button>
            );
          })}
        </nav>
      </div>
      {/* Refresh Button */}
      <div className="p-6 border-t border-gray-200">
        <button
          className="w-full flex items-center justify-center space-x-2 px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-blue-100 hover:text-blue-700 transition-colors"
          onClick={handleRefresh}
        >
          <RotateCcw className="w-5 h-5 mr-2" />
          <span>Reset All Data</span>
        </button>
      </div>
    </div>
  );
};