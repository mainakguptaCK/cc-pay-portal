import { 
  User, CreditCard, Transaction, Reward, Statement, 
  Fee, DirectDebit, ReferralLink, CreditDecision, PortalNotice,
  CardSettings, CardType, CardFees
} from "../types";

// Mock Users
export const users: User[] = [
  {
    id: "admin-1",
    name: "Admin User",
    email: "admin@example.com",
    role: "admin",
    isLocked: false
  },
  {
    id: "customer-1",
    name: "John Doe",
    email: "john@example.com",
    role: "customer",
    isLocked: false
  }
];

// Mock Card Settings
const defaultCardSettings: CardSettings = {
  domesticTransactions: true,
  internationalTransactions: true,
  touchToPay: true,
  touchToPayLimit: 100,
  onlinePayments: true,
  atmWithdrawals: true,
  merchantPosPayments: true
};

// Mock Card Fees by Type
const cardFeesByType: Record<CardType, CardFees> = {
  platinum: {
    annual: 499,
    monthly: 0,
    late: 45,
    cashAdvance: 10,
    other: 0
  },
  gold: {
    annual: 199,
    monthly: 0,
    late: 35,
    cashAdvance: 8,
    other: 0
  },
  titanium: {
    annual: 299,
    monthly: 0,
    late: 40,
    cashAdvance: 9,
    other: 0
  },
  business: {
    annual: 399,
    monthly: 0,
    late: 45,
    cashAdvance: 10,
    other: 0
  },
  rewards: {
    annual: 99,
    monthly: 0,
    late: 30,
    cashAdvance: 7,
    other: 0
  }
};

// Mock Credit Cards
export const creditCards: CreditCard[] = [
  {
    id: "card-1",
    userId: "customer-1",
    cardNumber: "****-****-****-1234",
    expiryDate: "12/25",
    cvv: "***",
    creditLimit: 5000,
    availableLimit: 3200,
    totalOutstanding: 1800,
    dueDate: "2025-05-15",
    nextDueDate: "2025-06-15",
    isBlocked: false,
    cardType: "platinum",
    settings: defaultCardSettings,
    fees: cardFeesByType.platinum
  },
  {
    id: "card-2",
    userId: "customer-1",
    cardNumber: "****-****-****-5678",
    expiryDate: "03/26",
    cvv: "***",
    creditLimit: 10000,
    availableLimit: 7500,
    totalOutstanding: 2500,
    dueDate: "2025-05-20",
    nextDueDate: "2025-06-20",
    isBlocked: false,
    cardType: "gold",
    settings: { ...defaultCardSettings, internationalTransactions: false },
    fees: cardFeesByType.gold
  },
  {
    id: "card-3",
    userId: "customer-1",
    cardNumber: "****-****-****-9012",
    expiryDate: "08/25",
    cvv: "***",
    creditLimit: 15000,
    availableLimit: 12000,
    totalOutstanding: 3000,
    dueDate: "2025-05-18",
    nextDueDate: "2025-06-18",
    isBlocked: true,
    cardType: "titanium",
    settings: { ...defaultCardSettings, touchToPay: false },
    fees: cardFeesByType.titanium
  },
  {
    id: "card-4",
    userId: "customer-1",
    cardNumber: "****-****-****-3456",
    expiryDate: "11/26",
    cvv: "***",
    creditLimit: 8000,
    availableLimit: 6000,
    totalOutstanding: 2000,
    dueDate: "2025-05-25",
    nextDueDate: "2025-06-25",
    isBlocked: false,
    cardType: "business",
    settings: { ...defaultCardSettings, atmWithdrawals: false },
    fees: cardFeesByType.business
  },
  {
    id: "card-5",
    userId: "customer-1",
    cardNumber: "****-****-****-7890",
    expiryDate: "06/25",
    cvv: "***",
    creditLimit: 20000,
    availableLimit: 15000,
    totalOutstanding: 5000,
    dueDate: "2025-05-22",
    nextDueDate: "2025-06-22",
    isBlocked: false,
    cardType: "rewards",
    settings: defaultCardSettings,
    fees: cardFeesByType.rewards
  }
];

// Calculate reward points based on amount and card type
const calculateRewardPoints = (amount: number, cardType: CardType): number => {
  const basePoints = Math.floor(amount);
  const multiplier = {
    platinum: 3,
    gold: 2,
    titanium: 2.5,
    business: 2,
    rewards: 1.5
  };
  return Math.floor(basePoints * multiplier[cardType]);
};

// Mock Transactions
export const transactions: Transaction[] = [
  // Card 1 Transactions (Platinum)
  {
    id: "tx-1",
    transactionId: "TXN-001",
    cardId: "card-1",
    date: "2025-04-10",
    merchantName: "Amazon",
    amount: 250.99,
    category: "Shopping",
    isCredit: false,
    description: "Electronics purchase",
    rewardPoints: calculateRewardPoints(250.99, "platinum"),
    isReversed: false
  },
  {
    id: "tx-2",
    transactionId: "TXN-002",
    cardId: "card-1",
    date: "2025-04-15",
    merchantName: "Starbucks",
    amount: 5.75,
    category: "Food & Drinks",
    isCredit: false,
    description: "Coffee",
    rewardPoints: calculateRewardPoints(5.75, "platinum"),
    isReversed: false
  },
  // Card 2 Transactions (Gold)
  {
    id: "tx-3",
    transactionId: "TXN-003",
    cardId: "card-2",
    date: "2025-04-18",
    merchantName: "Netflix",
    amount: 15.99,
    category: "Entertainment",
    isCredit: false,
    description: "Monthly subscription",
    rewardPoints: calculateRewardPoints(15.99, "gold"),
    isReversed: false
  },
  {
    id: "tx-4",
    transactionId: "TXN-004",
    cardId: "card-2",
    date: "2025-04-20",
    merchantName: "Walmart",
    amount: 150.50,
    category: "Shopping",
    isCredit: false,
    description: "Groceries",
    rewardPoints: calculateRewardPoints(150.50, "gold"),
    isReversed: false
  },
  // Reversed Transaction Example
  {
    id: "tx-4-reverse",
    transactionId: "TXN-004-REV",
    cardId: "card-2",
    date: "2025-04-21",
    merchantName: "Walmart",
    amount: 150.50,
    category: "Shopping",
    isCredit: true,
    description: "Refund - Groceries",
    rewardPoints: -calculateRewardPoints(150.50, "gold"),
    isReversed: true,
    originalTransactionId: "TXN-004"
  },
  // Card 3 Transactions (Titanium)
  {
    id: "tx-5",
    transactionId: "TXN-005",
    cardId: "card-3",
    date: "2025-04-22",
    merchantName: "Best Buy",
    amount: 899.99,
    category: "Shopping",
    isCredit: false,
    description: "New laptop",
    rewardPoints: calculateRewardPoints(899.99, "titanium"),
    isReversed: false
  },
  {
    id: "tx-6",
    transactionId: "TXN-006",
    cardId: "card-3",
    date: "2025-04-23",
    merchantName: "Payment",
    amount: 1000,
    category: "Payment",
    isCredit: true,
    description: "Monthly payment",
    rewardPoints: 0,
    isReversed: false
  },
  // Card 4 Transactions (Business)
  {
    id: "tx-7",
    transactionId: "TXN-007",
    cardId: "card-4",
    date: "2025-04-25",
    merchantName: "Shell",
    amount: 45.00,
    category: "Transportation",
    isCredit: false,
    description: "Gas",
    rewardPoints: calculateRewardPoints(45.00, "business"),
    isReversed: false
  },
  {
    id: "tx-8",
    transactionId: "TXN-008",
    cardId: "card-4",
    date: "2025-04-26",
    merchantName: "AMC Theaters",
    amount: 32.50,
    category: "Entertainment",
    isCredit: false,
    description: "Movie tickets",
    rewardPoints: calculateRewardPoints(32.50, "business"),
    isReversed: false
  },
  // Card 5 Transactions (Rewards)
  {
    id: "tx-9",
    transactionId: "TXN-009",
    cardId: "card-5",
    date: "2025-04-28",
    merchantName: "Apple",
    amount: 1299.99,
    category: "Shopping",
    isCredit: false,
    description: "iPhone purchase",
    rewardPoints: calculateRewardPoints(1299.99, "rewards"),
    isReversed: false
  },
  {
    id: "tx-10",
    transactionId: "TXN-010",
    cardId: "card-5",
    date: "2025-04-29",
    merchantName: "Payment",
    amount: 2000,
    category: "Payment",
    isCredit: true,
    description: "Monthly payment",
    rewardPoints: 0,
    isReversed: false
  }
];

// Rest of the mock data remains unchanged
export const rewards: Reward[] = [
  {
    id: "reward-1",
    userId: "customer-1",
    points: 1500,
    expiryDate: "2026-12-31",
    redemptionHistory: [
      {
        id: "redeem-1",
        date: "2025-03-15",
        points: 500,
        description: "Gift card redemption"
      }
    ]
  }
];

export const statements: Statement[] = [
  {
    id: "statement-1",
    userId: "customer-1",
    period: "March 2025",
    startDate: "2025-03-01",
    endDate: "2025-03-31",
    totalSpent: 1250.45,
    minimumPayment: 125.05,
    dueDate: "2025-04-15",
    isDownloaded: true
  },
  {
    id: "statement-2",
    userId: "customer-1",
    period: "April 2025",
    startDate: "2025-04-01",
    endDate: "2025-04-30",
    totalSpent: 1800.22,
    minimumPayment: 180.02,
    dueDate: "2025-05-15",
    isDownloaded: false
  }
];

export const fees: Fee[] = [
  {
    id: "fee-1",
    type: "annual",
    amount: 99.99,
    description: "Annual membership fee"
  },
  {
    id: "fee-2",
    type: "late",
    amount: 39.99,
    description: "Late payment fee"
  },
  {
    id: "fee-3",
    type: "cashAdvance",
    amount: 5.00,
    description: "Cash advance fee"
  }
];

export const directDebits: DirectDebit[] = [
  {
    id: "debit-1",
    userId: "customer-1",
    accountNumber: "****5678",
    routingNumber: "****1234",
    frequency: "monthly",
    amount: 500,
    isActive: true,
    nextDebitDate: "2025-05-15"
  }
];

export const referralLinks: ReferralLink[] = [
  {
    id: "ref-1",
    userId: "customer-1",
    code: "JOHNDOE25",
    url: "https://example.com/refer/JOHNDOE25",
    totalReferrals: 2,
    pointsEarned: 1000
  }
];

export const creditDecisions: CreditDecision[] = [
  {
    id: "decision-1",
    userId: "customer-1",
    date: "2025-01-15",
    decision: "approved",
    reason: "Good credit history",
    suggestedLimit: 5000
  }
];

export const portalNotices: PortalNotice[] = [
  {
    id: "notice-1",
    title: "System Maintenance",
    content: "The portal will be undergoing maintenance on May 25, 2025, from 2 AM to 5 AM ET.",
    startDate: "2025-05-20",
    endDate: "2025-05-25",
    isActive: true
  }
];