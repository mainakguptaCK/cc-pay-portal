export type UserRole = 'admin' | 'customer';

export interface User {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  isLocked: boolean;
}

export type CardType = 'platinum' | 'gold' | 'titanium' | 'business' | 'rewards';

export interface CreditCard {
  id: string;
  userId: string;
  cardNumber: string;
  expiryDate: string;
  cvv: string;
  creditLimit: number;
  availableLimit: number;
  totalOutstanding: number;
  dueDate: string;
  nextDueDate: string;
  isBlocked: boolean;
  cardType: CardType;
  settings: CardSettings;
  fees: CardFees;
}

export interface CardSettings {
  domesticTransactions: boolean;
  internationalTransactions: boolean;
  touchToPay: boolean;
  touchToPayLimit: number;
  onlinePayments: boolean;
  atmWithdrawals: boolean;
  merchantPosPayments: boolean;
}

export interface CardFees {
  annual: number;
  monthly: number;
  late: number;
  cashAdvance: number;
  other: number;
}

export interface Transaction {
  id: string;
  transactionId: string;
  cardId: string;
  date: string;
  merchantName: string;
  amount: number;
  category: string;
  isCredit: boolean;
  description: string;
  rewardPoints: number;
  isReversed: boolean;
  originalTransactionId?: string;
}

export interface Reward {
  id: string;
  userId: string;
  points: number;
  expiryDate: string;
  redemptionHistory: RedemptionHistory[];
}

export interface RedemptionHistory {
  id: string;
  date: string;
  points: number;
  description: string;
}

export interface Statement {
  id: string;
  userId: string;
  period: string;
  startDate: string;
  endDate: string;
  totalSpent: number;
  minimumPayment: number;
  dueDate: string;
  isDownloaded: boolean;
}

export interface Fee {
  id: string;
  type: 'annual' | 'monthly' | 'late' | 'cashAdvance' | 'other';
  amount: number;
  description: string;
}

export interface DirectDebit {
  id: string;
  userId: string;
  accountNumber: string;
  routingNumber: string;
  frequency: 'weekly' | 'biweekly' | 'monthly';
  amount: number;
  isActive: boolean;
  nextDebitDate: string;
}

export interface ReferralLink {
  id: string;
  userId: string;
  code: string;
  url: string;
  totalReferrals: number;
  pointsEarned: number;
}

export interface CreditDecision {
  id: string;
  userId: string;
  date: string;
  decision: 'approved' | 'declined';
  reason: string;
  suggestedLimit: number;
}

export interface PortalNotice {
  id: string;
  title: string;
  content: string;
  startDate: string;
  endDate: string;
  isActive: boolean;
}