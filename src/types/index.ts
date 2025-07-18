export interface FinancialData {
  cashBalance: number;
  revenue: number;
  expenses: number;
  netBurn: number;
}

export interface CashFlowData {
  month: string;
  inflow: number;
  outflow: number;
}

export interface Document {
  id: string;
  name: string;
  type: string;
  uploadDate: string;
  status: 'processing' | 'completed' | 'failed';
  category?: DocumentCategory;
  analysis?: any;
  dashboardCategory?: string;
  amount?: number; // Added for extracted amount
}

export type DocumentCategory = 
  | 'bank-transactions'
  | 'invoices' 
  | 'bills'
  | 'inventory'
  | 'item-restocks'
  | 'manual-journals'
  | 'general-ledgers'
  | 'general-entries';

export interface TransactionData {
  id: string;
  date: string;
  description: string;
  amount: number;
  category: string;
  type: 'credit' | 'debit';
  dashboardCategory?: string;
  name?: string; // Add document name if available
  quantity?: number;
  unitPrice?: number;
  status?: string;
}

export interface GroupedBalanceSheet {
  Assets: GroupedBalanceSheetItem[];
  Liabilities: GroupedBalanceSheetItem[];
  Equity: GroupedBalanceSheetItem[];
  [key: string]: GroupedBalanceSheetItem[]; // Add index signature
}

export interface GroupedBalanceSheetItem {
  account: string;
  amount: number;
}

export interface GroupedTrialBalance {
  Assets: GroupedTrialBalanceItem[];
  Liabilities: GroupedTrialBalanceItem[];
  Equity: GroupedTrialBalanceItem[];
  Revenue: GroupedTrialBalanceItem[];
  Expenses: GroupedTrialBalanceItem[];
  [key: string]: GroupedTrialBalanceItem[]; // Add index signature
}

export interface GroupedTrialBalanceItem {
  account: string;
  debit: number;
  credit: number;
}

export interface FinancialStatement {
  balanceSheet: BalanceSheetItem[];
  profitLoss: ProfitLossItem[];
  trialBalance: TrialBalanceItem[];
  cashFlow: CashFlowItem[];
  groupedBalanceSheet?: GroupedBalanceSheet;
  groupedTrialBalance?: GroupedTrialBalance;
  // New fields for detailed breakdowns
  relatedParties?: any[];
  assetBreakdown?: {
    inventories: BalanceSheetItem[];
    receivables: BalanceSheetItem[];
    cashAndCashEquivalents: BalanceSheetItem[];
  };
  liabilityBreakdown?: {
    equity: BalanceSheetItem[];
    shortTermDebts: BalanceSheetItem[];
  };
  profitLossBreakdown?: {
    income: ProfitLossItem[];
    COGS: ProfitLossItem[];
    operatingExpenses: ProfitLossItem[];
    financialItems: ProfitLossItem[];
    tax: ProfitLossItem[];
  };
  detailedProfitLoss?: { label: string; amount: number }[];
}

export interface BalanceSheetItem {
  account: string;
  type: 'asset' | 'liability' | 'equity';
  amount: number;
  category: string;
}

export interface ProfitLossItem {
  account: string;
  type: 'revenue' | 'expense';
  amount: number;
  category: string;
}

export interface TrialBalanceItem {
  account: string;
  debit: number;
  credit: number;
}

export interface CashFlowItem {
  description: string;
  amount: number;
  type: 'operating' | 'investing' | 'financing';
}