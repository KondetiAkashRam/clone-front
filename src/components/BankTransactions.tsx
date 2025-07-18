import React, { useState } from 'react';
import { useAppContext } from '../context/AppContext';
import { CreditCard, Plus, Filter, Search, TrendingUp, TrendingDown } from 'lucide-react';

export const BankTransactions: React.FC = () => {
  const { state, dispatch, fetchDashboardSummary, fetchTransactions } = useAppContext();
  const [searchTerm, setSearchTerm] = useState('');
  const [filterType, setFilterType] = useState('all');
  const [showModal, setShowModal] = useState(false);
  const [form, setForm] = useState({
    date: '',
    description: '',
    amount: '',
    type: 'credit',
    category: 'bank-transactions', // Add category to form state
    dashboardCategory: ''
  });

  const [isClassifying, setIsClassifying] = useState(false);

  const handleCreate = async () => {
    if (!form.date || !form.description || !form.amount) return;
    setIsClassifying(true);
    let dashboardCategory = '';
    try {
      const response = await fetch('http://localhost:8000/classify-transaction/', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ description: form.description }),
      });
      if (response.ok) {
        const data = await response.json();
        dashboardCategory = data.dashboardCategory || '';
      }
    } catch (e) {
      // fallback: leave dashboardCategory blank
    }
    // Fallback logic for dashboardCategory
    if (!dashboardCategory) {
      dashboardCategory = 'Cash Balance';
    }
    setIsClassifying(false);
    const newTransaction = {
      id: Date.now().toString() + Math.random().toString(36).substr(2, 9),
      date: form.date,
      description: form.description,
      amount: parseFloat(form.amount),
      category: form.category || 'bank-transactions',
      type: form.type as 'credit' | 'debit',
      dashboardCategory,
    };
    await fetch('http://localhost:8000/transactions/', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(newTransaction)
    });
    setShowModal(false);
    setForm({ date: '', description: '', amount: '', type: 'credit', category: 'bank-transactions', dashboardCategory: '' });
    // Fetch updated dashboard summary and transactions
    if (fetchDashboardSummary) await fetchDashboardSummary();
    if (fetchTransactions) await fetchTransactions();
  };

  const handleDescriptionChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const desc = e.target.value;
    setForm(f => ({ ...f, description: desc }));
    if (desc.length > 3) {
      try {
        const res = await fetch('http://localhost:8000/classify-transaction/', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ description: desc })
        });
        if (res.ok) {
          const data = await res.json();
          if (data.category) {
            setForm(f => ({ ...f, category: data.category, dashboardCategory: data.dashboardCategory || '' }));
          }
        }
      } catch (err) {
        // ignore classification errors
      }
    }
  };

  const bankTransactions = state.transactions.filter(
    transaction => transaction.category === 'bank-transactions'
  );

  const filteredTransactions = bankTransactions.filter(transaction => {
    const matchesSearch = transaction.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesFilter = filterType === 'all' || transaction.type === filterType;
    return matchesSearch && matchesFilter;
  });

  const totalBalance = bankTransactions.reduce((sum, transaction) => {
    return sum + (transaction.type === 'credit' ? transaction.amount : -transaction.amount);
  }, 0);

  const totalCredits = bankTransactions
    .filter(t => t.type === 'credit')
    .reduce((sum, t) => sum + t.amount, 0);

  const totalDebits = bankTransactions
    .filter(t => t.type === 'debit')
    .reduce((sum, t) => sum + t.amount, 0);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold text-gray-900">Bank Transactions</h1>
        <div className="flex items-center space-x-2">
          <CreditCard className="w-8 h-8 text-blue-600" />
          <span className="text-sm text-gray-600">Transaction Management</span>
        </div>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-gradient-to-br from-blue-50 to-blue-100 rounded-xl p-6 border border-blue-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-blue-600">Total Balance</p>
              <p className="text-2xl font-bold text-blue-900">${totalBalance.toLocaleString()}</p>
            </div>
            <div className="p-3 bg-blue-600 rounded-lg">
              <CreditCard className="w-6 h-6 text-white" />
            </div>
          </div>
        </div>

        <div className="bg-gradient-to-br from-green-50 to-green-100 rounded-xl p-6 border border-green-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-green-600">Total Credits</p>
              <p className="text-2xl font-bold text-green-900">${totalCredits.toLocaleString()}</p>
            </div>
            <div className="p-3 bg-green-600 rounded-lg">
              <TrendingUp className="w-6 h-6 text-white" />
            </div>
          </div>
        </div>

        <div className="bg-gradient-to-br from-red-50 to-red-100 rounded-xl p-6 border border-red-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-red-600">Total Debits</p>
              <p className="text-2xl font-bold text-red-900">${totalDebits.toLocaleString()}</p>
            </div>
            <div className="p-3 bg-red-600 rounded-lg">
              <TrendingDown className="w-6 h-6 text-white" />
            </div>
          </div>
        </div>
      </div>

      {/* Controls */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between space-y-4 md:space-y-0">
          <div className="flex items-center space-x-4">
            <div className="relative">
              <Search className="w-5 h-5 text-gray-400 absolute left-3 top-1/2 transform -translate-y-1/2" />
              <input
                type="text"
                placeholder="Search transactions..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <select
              value={filterType}
              onChange={(e) => setFilterType(e.target.value)}
              className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="all">All Types</option>
              <option value="credit">Credits</option>
              <option value="debit">Debits</option>
            </select>
          </div>
          <button
            className="flex items-center space-x-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            onClick={() => setShowModal(true)}
          >
            <Plus className="w-5 h-5" />
            <span>Add Transaction</span>
          </button>
        </div>
      </div>
      {/* Modal for creating transaction */}
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-30">
          <div className="bg-white rounded-xl p-8 shadow-lg w-full max-w-md">
            <h2 className="text-xl font-bold mb-4">Add Bank Transaction</h2>
            <div className="space-y-4">
              <input
                type="date"
                className="w-full border rounded-lg px-3 py-2"
                value={form.date}
                onChange={e => setForm(f => ({ ...f, date: e.target.value }))}
                placeholder="Date"
              />
              <input
                type="text"
                className="w-full border rounded-lg px-3 py-2"
                value={form.description}
                onChange={handleDescriptionChange}
                placeholder="Description"
              />
              <input
                type="number"
                className="w-full border rounded-lg px-3 py-2"
                value={form.amount}
                onChange={e => setForm(f => ({ ...f, amount: e.target.value }))}
                placeholder="Amount"
              />
              <select
                className="w-full border rounded-lg px-3 py-2"
                value={form.type}
                onChange={e => setForm(f => ({ ...f, type: e.target.value }))}
              >
                <option value="credit">Credit</option>
                <option value="debit">Debit</option>
              </select>
              <div className="flex justify-end gap-2 mt-4">
                <button
                  className="px-4 py-2 bg-gray-200 rounded-lg"
                  onClick={() => setShowModal(false)}
                  disabled={isClassifying}
                >Cancel</button>
                <button
                  className="px-4 py-2 bg-blue-600 text-white rounded-lg"
                  onClick={handleCreate}
                  disabled={isClassifying}
                >{isClassifying ? 'Classifying...' : 'Add'}</button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Transactions Table */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="px-6 py-4 border-b border-gray-200">
          <h3 className="text-lg font-semibold text-gray-900">Transaction History</h3>
        </div>
        
        {filteredTransactions.length === 0 ? (
          <div className="p-8 text-center">
            <CreditCard className="w-12 h-12 text-gray-400 mx-auto mb-4" />
            <p className="text-gray-600">No bank transactions found</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50">
                <tr>
                  <th className="text-left py-3 px-6 font-medium text-gray-900">Date</th>
                  <th className="text-left py-3 px-6 font-medium text-gray-900">Description</th>
                  <th className="text-left py-3 px-6 font-medium text-gray-900">Type</th>
                  <th className="text-right py-3 px-6 font-medium text-gray-900">Amount</th>
                  <th className="text-right py-3 px-6 font-medium text-gray-900">Balance</th>
                </tr>
              </thead>
              <tbody>
                {filteredTransactions.map((transaction, index) => (
                  <tr key={transaction.id} className="border-b border-gray-100 hover:bg-gray-50 transition-colors">
                    <td className="py-4 px-6 text-sm text-gray-900">
                      {new Date(transaction.date).toLocaleDateString()}
                    </td>
                    <td className="py-4 px-6 text-sm text-gray-900">{transaction.name || transaction.description}</td>
                    <td className="py-4 px-6">
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                        transaction.type === 'credit' 
                          ? 'bg-green-100 text-green-800' 
                          : 'bg-red-100 text-red-800'
                      }`}>
                        {transaction.type}
                      </span>
                    </td>
                    <td className={`py-4 px-6 text-right font-semibold ${
                      transaction.type === 'credit' ? 'text-green-600' : 'text-red-600'
                    }`}>
                      {transaction.type === 'credit' ? '+' : '-'}${transaction.amount.toLocaleString()}
                    </td>
                    <td className="py-4 px-6 text-right text-sm text-gray-900">
                      ${totalBalance.toLocaleString()}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};