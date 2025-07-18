import React, { createContext, useContext, useReducer, ReactNode, useState, useEffect } from 'react';
import { FinancialData, Document, TransactionData, FinancialStatement, CashFlowData } from '../types';

interface CompanyInfo {
  name: string;
  address: string;
  email: string;
  phone: string;
  website: string;
  logo?: File | string;
  owner: string;
  establishedDate?: string;
  approvalDate?: string;
  chamberOfCommerce?: string;
  city?: string;
  country?: string;
  financialYear?: string;
}

interface AppState {
  financialData: FinancialData;
  cashFlowData: CashFlowData[];
  documents: Document[];
  transactions: TransactionData[];
  financialStatements: FinancialStatement;
  loading: boolean;
  error: string | null;
  companyInfo: CompanyInfo;
}

type AppAction = 
  | { type: 'SET_FINANCIAL_DATA'; payload: FinancialData }
  | { type: 'SET_CASH_FLOW_DATA'; payload: CashFlowData[] }
  | { type: 'ADD_DOCUMENT'; payload: Document }
  | { type: 'UPDATE_DOCUMENT'; payload: Document }
  | { type: 'ADD_TRANSACTION'; payload: TransactionData }
  | { type: 'SET_TRANSACTIONS'; payload: TransactionData[] }
  | { type: 'SET_FINANCIAL_STATEMENTS'; payload: FinancialStatement }
  | { type: 'SET_LOADING'; payload: boolean }
  | { type: 'SET_ERROR'; payload: string | null }
  | { type: 'SET_COMPANY_INFO'; payload: CompanyInfo };

const initialState: AppState = {
  financialData: {
    cashBalance: 0,
    revenue: 0,
    expenses: 0,
    netBurn: 0
  },
  cashFlowData: [],
  documents: [],
  transactions: [],
  financialStatements: {
    balanceSheet: [],
    profitLoss: [],
    trialBalance: [],
    cashFlow: []
  },
  loading: false,
  error: null,
  companyInfo: {
    name: '',
    address: '',
    email: '',
    phone: '',
    website: '',
    logo: undefined,
    owner: '',
    establishedDate: '',
    approvalDate: '',
    chamberOfCommerce: '',
    city: '',
    country: '',
    financialYear: '',
  }
};

const appReducer = (state: AppState, action: AppAction): AppState => {
  switch (action.type) {
    case 'SET_FINANCIAL_DATA':
      return { ...state, financialData: action.payload };
    case 'SET_CASH_FLOW_DATA':
      return { ...state, cashFlowData: action.payload };
    case 'ADD_DOCUMENT':
      return { ...state, documents: [...state.documents, action.payload] };
    case 'UPDATE_DOCUMENT':
      return {
        ...state,
        documents: state.documents.map(doc => 
          doc.id === action.payload.id ? action.payload : doc
        )
      };
    case 'ADD_TRANSACTION':
      return { ...state, transactions: [...state.transactions, action.payload] };
    case 'SET_TRANSACTIONS':
      return { ...state, transactions: action.payload };
    case 'SET_FINANCIAL_STATEMENTS':
      return { ...state, financialStatements: action.payload };
    case 'SET_LOADING':
      return { ...state, loading: action.payload };
    case 'SET_ERROR':
      return { ...state, error: action.payload };
    case 'SET_COMPANY_INFO':
      return { ...state, companyInfo: action.payload };
    default:
      return state;
  }
};

const AppContext = createContext<{
  state: AppState;
  dispatch: React.Dispatch<AppAction>;
  dashboardSummary: {
    cashBalance: number;
    revenue: number;
    expenses: number;
    netBurn: number;
  };
  fetchDashboardSummary: () => Promise<void>;
  fetchTransactions: () => Promise<void>;
} | null>(null);

export const AppProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [state, dispatch] = useReducer(appReducer, initialState);
  const [dashboardSummary, setDashboardSummary] = useState({
    cashBalance: 0,
    revenue: 0,
    expenses: 0,
    netBurn: 0
  });

  // Reset backend data on every refresh
  useEffect(() => {
    fetch('https://clone-3-jh4k.onrender.com/reset-data/', { method: 'POST' });
  }, []);

  const fetchDashboardSummary = async () => {
    try {
      const res = await fetch('https://clone-3-jh4k.onrender.com/dashboard-summary/');
      if (res.ok) {
        const data = await res.json();
        setDashboardSummary(data);
      }
    } catch (e) {
      // Optionally handle error
    }
  };

  const fetchTransactions = async () => {
    try {
      const res = await fetch('https://clone-3-jh4k.onrender.com/transactions/');
      if (res.ok) {
        const data = await res.json();
        dispatch({ type: 'SET_TRANSACTIONS', payload: data });
      }
    } catch (e) {
      // Optionally handle error
    }
  };

  return (
    <AppContext.Provider value={{ state, dispatch, dashboardSummary, fetchDashboardSummary, fetchTransactions }}>
      {children}
    </AppContext.Provider>
  );
};

export const useAppContext = () => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useAppContext must be used within an AppProvider');
  }
  return context;
};
