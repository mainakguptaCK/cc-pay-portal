import React, { createContext, useState, useContext, useEffect } from 'react';
import { 
  CreditCard, Transaction, Statement, DirectDebit, Reward, 
  ReferralLink, PortalNotice, User, Fee, CreditDecision
} from '../types';
import { 
  creditCards, transactions, statements, directDebits, rewards,
  referralLinks, portalNotices, fees, creditDecisions
} from '../utils/mockData';
import { useAuth } from './useAuth';

interface CreditCardContextType {
  // User's credit cards
  userCards: CreditCard[];
  allCards: CreditCard[];
  getCardById: (id: string) => CreditCard | undefined;
  updateCardSettings: (cardId: string, settings: Partial<CreditCard['settings']>) => void;
  blockCard: (cardId: string, blocked: boolean) => void;
  
  // Transactions
  userTransactions: Transaction[];
  allTransactions: Transaction[];
  
  // Statements
  userStatements: Statement[];
  allStatements: Statement[];
  
  // Direct Debits
  userDirectDebit: DirectDebit | undefined;
  allDirectDebits: DirectDebit[];
  updateDirectDebit: (debitId: string, updates: Partial<DirectDebit>) => void;
  
  // Rewards
  userReward: Reward | undefined;
  allRewards: Reward[];
  
  // Referrals
  userReferralLink: ReferralLink | undefined;
  allReferralLinks: ReferralLink[];
  
  // Admin functions
  portalNotices: PortalNotice[];
  updatePortalNotice: (noticeId: string, updates: Partial<PortalNotice>) => void;
  creditDecisions: CreditDecision[];
  fees: Fee[];
  updateFee: (feeId: string, updates: Partial<Fee>) => void;
  updateUserCreditLimit: (userId: string, newLimit: number) => void;
  lockUserAccount: (userId: string, locked: boolean) => void;
}

const CreditCardContext = createContext<CreditCardContextType | undefined>(undefined);

export function CreditCardProvider({ children }: { children: React.ReactNode }) {
  const { currentUser } = useAuth();
  
  // State for all data types
  const [userCards, setUserCards] = useState<CreditCard[]>([]);
  const [allCards, setAllCards] = useState<CreditCard[]>(creditCards);
  const [userTransactions, setUserTransactions] = useState<Transaction[]>([]);
  const [allTransactions, setAllTransactions] = useState<Transaction[]>(transactions);
  const [userStatements, setUserStatements] = useState<Statement[]>([]);
  const [allStatements, setAllStatements] = useState<Statement[]>(statements);
  const [userDirectDebit, setUserDirectDebit] = useState<DirectDebit | undefined>(undefined);
  const [allDirectDebits, setAllDirectDebits] = useState<DirectDebit[]>(directDebits);
  const [userReward, setUserReward] = useState<Reward | undefined>(undefined);
  const [allRewards, setAllRewards] = useState<Reward[]>(rewards);
  const [userReferralLink, setUserReferralLink] = useState<ReferralLink | undefined>(undefined);
  const [allReferralLinks, setAllReferralLinks] = useState<ReferralLink[]>(referralLinks);
  const [portalNoticesList, setPortalNoticesList] = useState<PortalNotice[]>(portalNotices);
  const [creditDecisionsList, setCreditDecisionsList] = useState<CreditDecision[]>(creditDecisions);
  const [feesList, setFeesList] = useState<Fee[]>(fees);
  
  // Update user-specific data when the user changes
  useEffect(() => {
    if (currentUser) {
      const userId = currentUser.id;
      
      // Get user's credit cards
      const cards = allCards.filter(card => card.userId === userId);
      setUserCards(cards);
      
      // Get user's transactions from all their cards
      const cardIds = cards.map(card => card.id);
      const txs = allTransactions.filter(tx => cardIds.includes(tx.cardId));
      setUserTransactions(txs);
      
      // Get user's statements
      const userStats = allStatements.filter(stmt => stmt.userId === userId);
      setUserStatements(userStats);
      
      // Get user's direct debit
      const debit = allDirectDebits.find(dd => dd.userId === userId);
      setUserDirectDebit(debit);
      
      // Get user's rewards
      const reward = allRewards.find(r => r.userId === userId);
      setUserReward(reward);
      
      // Get user's referral link
      const refLink = allReferralLinks.find(rl => rl.userId === userId);
      setUserReferralLink(refLink);
    } else {
      // Clear user-specific data when logged out
      setUserCards([]);
      setUserTransactions([]);
      setUserStatements([]);
      setUserDirectDebit(undefined);
      setUserReward(undefined);
      setUserReferralLink(undefined);
    }
  }, [currentUser, allCards, allTransactions, allStatements, allDirectDebits, allRewards, allReferralLinks]);
  
  // Utility functions
  const getCardById = (id: string) => {
    return allCards.find(card => card.id === id);
  };
  
  const updateCardSettings = (cardId: string, settings: Partial<CreditCard['settings']>) => {
    const updatedCards = allCards.map(card => {
      if (card.id === cardId) {
        return { 
          ...card, 
          settings: { ...card.settings, ...settings } 
        };
      }
      return card;
    });
    
    setAllCards(updatedCards);
  };
  
  const blockCard = (cardId: string, blocked: boolean) => {
    const updatedCards = allCards.map(card => {
      if (card.id === cardId) {
        return { ...card, isBlocked: blocked };
      }
      return card;
    });
    
    setAllCards(updatedCards);
  };
  
  const updateDirectDebit = (debitId: string, updates: Partial<DirectDebit>) => {
    const updatedDebits = allDirectDebits.map(debit => {
      if (debit.id === debitId) {
        return { ...debit, ...updates };
      }
      return debit;
    });
    
    setAllDirectDebits(updatedDebits);
    
    // Update user's direct debit if it was modified
    if (userDirectDebit && userDirectDebit.id === debitId) {
      setUserDirectDebit({ ...userDirectDebit, ...updates });
    }
  };
  
  const updatePortalNotice = (noticeId: string, updates: Partial<PortalNotice>) => {
    const updatedNotices = portalNoticesList.map(notice => {
      if (notice.id === noticeId) {
        return { ...notice, ...updates };
      }
      return notice;
    });
    
    setPortalNoticesList(updatedNotices);
  };
  
  const updateFee = (feeId: string, updates: Partial<Fee>) => {
    const updatedFees = feesList.map(fee => {
      if (fee.id === feeId) {
        return { ...fee, ...updates };
      }
      return fee;
    });
    
    setFeesList(updatedFees);
  };
  
  const updateUserCreditLimit = (userId: string, newLimit: number) => {
    const updatedCards = allCards.map(card => {
      if (card.userId === userId) {
        const difference = newLimit - card.creditLimit;
        return { 
          ...card, 
          creditLimit: newLimit,
          availableLimit: card.availableLimit + difference
        };
      }
      return card;
    });
    
    setAllCards(updatedCards);
  };
  
  const lockUserAccount = (userId: string, locked: boolean) => {
    // In a real app, this would make an API call
    console.log(`${locked ? 'Locking' : 'Unlocking'} account for user ${userId}`);
  };
  
  return (
    <CreditCardContext.Provider
      value={{
        userCards,
        allCards,
        getCardById,
        updateCardSettings,
        blockCard,
        userTransactions,
        allTransactions,
        userStatements,
        allStatements,
        userDirectDebit,
        allDirectDebits,
        updateDirectDebit,
        userReward,
        allRewards,
        userReferralLink,
        allReferralLinks,
        portalNotices: portalNoticesList,
        updatePortalNotice,
        creditDecisions: creditDecisionsList,
        fees: feesList,
        updateFee,
        updateUserCreditLimit,
        lockUserAccount
      }}
    >
      {children}
    </CreditCardContext.Provider>
  );
}

export function useCreditCard() {
  const context = useContext(CreditCardContext);
  if (context === undefined) {
    throw new Error('useCreditCard must be used within a CreditCardProvider');
  }
  return context;
}