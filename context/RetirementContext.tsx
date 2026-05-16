import React, { createContext, useContext, useReducer, ReactNode } from 'react';

export interface UserProfile {
  dateOfBirth: string;
  lifeExpectancy: number;
  retirementAge: number;
  currentAge: number;
  nationalInsuranceNumber?: string;
}

export interface BudgetData {
  income: {
    salary: number;
    savingsInterest: number;
    dividends: number;
    rentalIncome: number;
    other: number;
  };
  expenses: {
    housing: number;
    utilities: number;
    transport: number;
    food: number;
    entertainment: number;
    healthcare: number;
    insurance: number;
    other: number;
  };
}

export interface FinancialData {
  assets: {
    primaryResidence: number;
    buyToLetProperty: number;
    isaSavings: number;
    pensionPot: number;
    premiumBonds: number;
    stocksAndShares: number;
    other: number;
  };
  liabilities: {
    mortgage: number;
    creditCards: number;
    personalLoans: number;
    studentLoan: number;
    other: number;
  };
  income: {
    salary: number;
    rentalIncome: number;
    dividends: number;
    statePension: number;
    privatePension: number;
    other: number;
  };
  expenses: {
    housing: number;
    food: number;
    transport: number;
    utilities: number;
    entertainment: number;
    healthcare: number;
    councilTax: number;
    insurance: number;
    other: number;
  };
  monthlySavings: number;
  pensionContributions: number;
  employerPensionMatch: number;
  inflationRate: number;
  wageInflationRate: number;
}

export interface RetirementState {
  userProfile: UserProfile;
  financialData: FinancialData;
  budgetData: BudgetData;
  retirementScore: number;
  netWorth: number;
  monthlyNetCashflow: number;
  statePensionEntitlement: number;
}

type RetirementAction = 
  | { type: 'UPDATE_PROFILE'; payload: Partial<UserProfile> }
  | { type: 'UPDATE_FINANCIAL_DATA'; payload: Partial<FinancialData> }
  | { type: 'UPDATE_BUDGET_DATA'; payload: Partial<BudgetData> }
  | { type: 'CALCULATE_METRICS' };

const initialState: RetirementState = {
  userProfile: {
    dateOfBirth: '',
    lifeExpectancy: 85,
    retirementAge: 67, // UK State Pension age
    currentAge: 30,
  },
  financialData: {
    assets: {
      primaryResidence: 0,
      buyToLetProperty: 0,
      isaSavings: 0,
      pensionPot: 45000, // Updated to match demo data
      premiumBonds: 0,
      stocksAndShares: 0,
      other: 0,
    },
    liabilities: {
      mortgage: 0,
      creditCards: 0,
      personalLoans: 0,
      studentLoan: 0,
      other: 0,
    },
    income: {
      salary: 0,
      rentalIncome: 0,
      dividends: 0,
      statePension: 0,
      privatePension: 0,
      other: 0,
    },
    expenses: {
      housing: 0,
      food: 0,
      transport: 0,
      utilities: 0,
      entertainment: 0,
      healthcare: 0,
      councilTax: 0,
      insurance: 0,
      other: 0,
    },
    monthlySavings: 0,
    pensionContributions: 400, // Updated to match demo data
    employerPensionMatch: 200, // Updated to match demo data
    inflationRate: 2.5, // UK target inflation
    wageInflationRate: 2.0,
  },
  budgetData: {
    income: {
      salary: 3000,
      savingsInterest: 200,
      dividends: 150,
      rentalIncome: 800,
      other: 0,
    },
    expenses: {
      housing: 1200,
      utilities: 320,
      transport: 180,
      food: 780,
      entertainment: 495,
      healthcare: 100,
      insurance: 150,
      other: 0,
    },
  },
  retirementScore: 0,
  netWorth: 0,
  monthlyNetCashflow: 0,
  statePensionEntitlement: 0,
};

function calculateStatePension(currentAge: number, retirementAge: number): number {
  // UK State Pension calculation (simplified)
  // Full State Pension for 2024: £221.20 per week = £958.53 per month
  const fullStatePension = 958.53;
  const yearsToRetirement = Math.max(0, retirementAge - currentAge);
  const workingYears = Math.min(35, currentAge - 16 + yearsToRetirement); // 35 years for full pension
  
  return (workingYears / 35) * fullStatePension;
}

function calculateMetrics(state: RetirementState): RetirementState {
  const totalAssets = Object.values(state.financialData.assets).reduce((sum, value) => sum + value, 0);
  const totalLiabilities = Object.values(state.financialData.liabilities).reduce((sum, value) => sum + value, 0);
  
  // Use budget data for income and expenses if available, otherwise fall back to financial data
  const totalBudgetIncome = Object.values(state.budgetData.income).reduce((sum, value) => sum + value, 0);
  const totalBudgetExpenses = Object.values(state.budgetData.expenses).reduce((sum, value) => sum + value, 0);
  
  const totalIncome = totalBudgetIncome > 0 ? totalBudgetIncome : Object.values(state.financialData.income).reduce((sum, value) => sum + value, 0);
  const totalExpenses = totalBudgetExpenses > 0 ? totalBudgetExpenses : Object.values(state.financialData.expenses).reduce((sum, value) => sum + value, 0);
  
  const netWorth = totalAssets - totalLiabilities;
  const monthlyNetCashflow = totalIncome - totalExpenses;
  
  // Calculate State Pension entitlement
  const statePensionEntitlement = calculateStatePension(
    state.userProfile.currentAge, 
    state.userProfile.retirementAge
  );
  
  // Enhanced retirement score calculation for UK context
  const yearsToRetirement = Math.max(0, state.userProfile.retirementAge - state.userProfile.currentAge);
  const retirementYears = state.userProfile.lifeExpectancy - state.userProfile.retirementAge;
  
  // Target retirement income (including State Pension)
  const targetMonthlyRetirementIncome = totalExpenses * 0.8; // 80% replacement ratio
  const statePensionContribution = statePensionEntitlement;
  const requiredPrivateIncome = Math.max(0, targetMonthlyRetirementIncome - statePensionContribution);
  
  // Calculate projected pension pot (including employer contributions and tax relief)
  const totalMonthlyContributions = state.financialData.pensionContributions + 
                                   state.financialData.employerPensionMatch +
                                   (state.financialData.pensionContributions * 0.25); // Basic rate tax relief
  
  const projectedPensionPot = (totalMonthlyContributions * 12 * yearsToRetirement * 1.05) + // 5% annual growth
                              state.financialData.assets.pensionPot;
  
  // 4% withdrawal rule for pension pot
  const projectedPrivateIncome = (projectedPensionPot * 0.04) / 12;
  
  const totalProjectedIncome = projectedPrivateIncome + statePensionContribution;
  const retirementScore = Math.min(100, Math.max(0, (totalProjectedIncome / targetMonthlyRetirementIncome) * 100));

  return {
    ...state,
    netWorth,
    monthlyNetCashflow,
    statePensionEntitlement,
    retirementScore: Math.round(retirementScore),
  };
}

function retirementReducer(state: RetirementState, action: RetirementAction): RetirementState {
  switch (action.type) {
    case 'UPDATE_PROFILE':
      const updatedState = {
        ...state,
        userProfile: { ...state.userProfile, ...action.payload },
      };
      return calculateMetrics(updatedState);
      
    case 'UPDATE_FINANCIAL_DATA':
      const updatedFinancialState = {
        ...state,
        financialData: { ...state.financialData, ...action.payload },
      };
      return calculateMetrics(updatedFinancialState);

    case 'UPDATE_BUDGET_DATA':
      const updatedBudgetState = {
        ...state,
        budgetData: { ...state.budgetData, ...action.payload },
      };
      return calculateMetrics(updatedBudgetState);
      
    case 'CALCULATE_METRICS':
      return calculateMetrics(state);
      
    default:
      return state;
  }
}

const RetirementContext = createContext<{
  state: RetirementState;
  dispatch: React.Dispatch<RetirementAction>;
} | null>(null);

export function RetirementProvider({ children }: { children: ReactNode }) {
  const [state, dispatch] = useReducer(retirementReducer, initialState);

  return (
    <RetirementContext.Provider value={{ state, dispatch }}>
      {children}
    </RetirementContext.Provider>
  );
}

export function useRetirement() {
  const context = useContext(RetirementContext);
  if (!context) {
    throw new Error('useRetirement must be used within a RetirementProvider');
  }
  return context;
}