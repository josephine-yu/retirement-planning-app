import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  SafeAreaView,
  TouchableOpacity,
  Modal,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { useRetirement } from '@/context/RetirementContext';
import { MetricCard } from '@/components/MetricCard';
import { InteractiveRetirementScore } from '@/components/InteractiveRetirementScore';
import { Banknote, TrendingUp, Settings, Info, X, Calculator, PiggyBank, Target, Percent, Calendar, TrendingDown, Shield } from 'lucide-react-native';
import { router } from 'expo-router';

export default function Dashboard() {
  const { state } = useRetirement();
  const [showIncomeInfoModal, setShowIncomeInfoModal] = useState(false);
  const [showRetirementFundModal, setShowRetirementFundModal] = useState(false);
  const [showPensionPotModal, setShowPensionPotModal] = useState(false);

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-GB', {
      style: 'currency',
      currency: 'GBP',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount);
  };

  // Demo user profile data for realistic calculation
  const demoCurrentAge = 30; // 30 years old
  const demoRetirementAge = 67; // UK State Pension age
  
  // Calculate years to retirement using demo data
  const yearsToRetirement = Math.max(0, demoRetirementAge - demoCurrentAge); // 37 years
  
  // Demo current financial data from budget
  const demoCurrentIncome = 4150; // From budget data (salary + savings interest + dividends + rental)
  const demoCurrentExpenses = 3225; // From budget data (all expense categories)
  const demoCurrentCashflow = demoCurrentIncome - demoCurrentExpenses; // £925 monthly surplus
  
  // Economic assumptions
  const wageInflationRate = 0.02; // 2% annual wage growth
  const expenseInflationRate = 0.025; // 2.5% annual expense inflation
  const discountRate = 0.03; // 3% discount rate for present value
  
  // Calculate projected retirement fund with inflation adjustments
  const calculateProjectedRetirementFund = () => {
    let totalPresentValue = 0;
    
    for (let year = 1; year <= yearsToRetirement; year++) {
      // Project income with wage inflation
      const projectedIncome = demoCurrentIncome * Math.pow(1 + wageInflationRate, year);
      
      // Project expenses with general inflation
      const projectedExpenses = demoCurrentExpenses * Math.pow(1 + expenseInflationRate, year);
      
      // Calculate annual cashflow
      const annualCashflow = (projectedIncome - projectedExpenses) * 12;
      
      // Convert to present value
      const presentValue = annualCashflow / Math.pow(1 + discountRate, year);
      
      totalPresentValue += presentValue;
    }
    
    return totalPresentValue;
  };
  
  const projectedRetirementFund = calculateProjectedRetirementFund();
  
  // Demo pension contributions data for retirement income calculation
  const demoMonthlyContributions = 400; // £400 personal contribution
  const demoEmployerMatch = 200; // £200 employer match
  const demoTaxRelief = demoMonthlyContributions * 0.25; // 25% tax relief
  
  const totalMonthlyContributions = demoMonthlyContributions + demoEmployerMatch + demoTaxRelief;
  
  // Demo current pension pot
  const demoCurrentPensionPot = 45000;
  
  const projectedPensionPot = (totalMonthlyContributions * 12 * yearsToRetirement * 1.05) + demoCurrentPensionPot;
  
  // 4% withdrawal rule for pension pot
  const totalProjectedMonthlyIncome = ((projectedPensionPot * 0.04) / 12);
  const totalProjectedAnnualIncome = totalProjectedMonthlyIncome * 12;

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
        {/* Header */}
        <LinearGradient
          colors={['#1E40AF', '#3B82F6']}
          style={styles.header}
        >
          <View style={styles.headerContent}>
            <View>
              <Text style={styles.headerTitle}>Pension Dashboard</Text>
              <Text style={styles.headerSubtitle}>Your retirement overview</Text>
            </View>
            <TouchableOpacity 
              style={styles.settingsButton}
              onPress={() => router.push('/settings')}
            >
              <Settings size={24} color="#FFFFFF" />
            </TouchableOpacity>
          </View>
        </LinearGradient>

        {/* Interactive Retirement Score */}
        <View style={styles.scoreSection}>
          <InteractiveRetirementScore 
            score={state.retirementScore}
            projectedIncome={totalProjectedMonthlyIncome}
            currentExpenses={demoCurrentExpenses}
            yearsToRetirement={yearsToRetirement}
          />
        </View>

        {/* Key Metrics Section */}
        <View style={styles.metricsSection}>
          <Text style={styles.sectionTitle}>Key Metrics</Text>
          
          <View style={styles.metricsGrid}>
            <MetricCard
              title="Projected Retirement Fund"
              value={formatCurrency(projectedRetirementFund)}
              icon={<Target size={24} color="#7C3AED" />}
              trend={projectedRetirementFund > 0 ? 'positive' : 'neutral'}
              showInfoButton={true}
              onInfoPress={() => setShowRetirementFundModal(true)}
            />
            <MetricCard
              title="Years to Retirement"
              value={`${yearsToRetirement} years`}
              icon={<Calendar size={24} color="#F59E0B" />}
              trend="neutral"
            />
          </View>

          {/* New Projected Pension Pot Metric */}
          <View style={styles.pensionPotSection}>
            <View style={styles.pensionPotCard}>
              <View style={styles.pensionPotHeader}>
                <Shield size={24} color="#7C3AED" />
                <Text style={styles.pensionPotTitle}>Projected Pension Pot</Text>
                <TouchableOpacity
                  style={styles.infoButton}
                  onPress={() => setShowPensionPotModal(true)}
                >
                  <Info size={20} color="#6B7280" />
                </TouchableOpacity>
              </View>
              
              <View style={styles.pensionPotRow}>
                <View style={styles.pensionPotItem}>
                  <PiggyBank size={20} color="#7C3AED" />
                  <Text style={styles.pensionPotLabel}>Current Pot</Text>
                  <Text style={styles.pensionPotValue}>
                    {formatCurrency(demoCurrentPensionPot)}
                  </Text>
                </View>
                <View style={styles.pensionPotDivider} />
                <View style={styles.pensionPotItem}>
                  <TrendingUp size={20} color="#059669" />
                  <Text style={styles.pensionPotLabel}>Projected at Retirement</Text>
                  <Text style={styles.pensionPotValue}>
                    {formatCurrency(projectedPensionPot)}
                  </Text>
                </View>
              </View>
              
              <View style={styles.pensionContributionsBreakdown}>
                <Text style={styles.contributionsTitle}>Monthly Contributions</Text>
                <View style={styles.contributionRow}>
                  <Text style={styles.contributionLabel}>Your Contribution:</Text>
                  <Text style={styles.contributionValue}>{formatCurrency(demoMonthlyContributions)}</Text>
                </View>
                <View style={styles.contributionRow}>
                  <Text style={styles.contributionLabel}>Employer Match:</Text>
                  <Text style={styles.contributionValue}>{formatCurrency(demoEmployerMatch)}</Text>
                </View>
                <View style={styles.contributionRow}>
                  <Text style={styles.contributionLabel}>Tax Relief (25%):</Text>
                  <Text style={styles.contributionValue}>{formatCurrency(demoTaxRelief)}</Text>
                </View>
                <View style={styles.contributionDivider} />
                <View style={styles.contributionRow}>
                  <Text style={styles.contributionTotalLabel}>Total Monthly:</Text>
                  <Text style={styles.contributionTotalValue}>{formatCurrency(totalMonthlyContributions)}</Text>
                </View>
              </View>
              
              <View style={styles.pensionInsightCard}>
                <Text style={styles.pensionInsightTitle}>Pension Growth</Text>
                <Text style={styles.pensionInsightText}>
                  Your pension pot is projected to grow from {formatCurrency(demoCurrentPensionPot)} to{' '}
                  {formatCurrency(projectedPensionPot)} over {yearsToRetirement} years, assuming 5% annual growth 
                  and total monthly contributions of {formatCurrency(totalMonthlyContributions)}.
                </Text>
              </View>
            </View>
          </View>

          {/* Projected Retirement Income - Now under Key Metrics */}
          <View style={styles.projectedIncomeSection}>
            <View style={styles.projectedIncomeCard}>
              <View style={styles.projectedIncomeHeader}>
                <Banknote size={24} color="#059669" />
                <Text style={styles.projectedIncomeTitle}>Projected Retirement Income</Text>
                <TouchableOpacity
                  style={styles.infoButton}
                  onPress={() => setShowIncomeInfoModal(true)}
                >
                  <Info size={20} color="#6B7280" />
                </TouchableOpacity>
              </View>
              
              <View style={styles.incomeProjectionRow}>
                <View style={styles.incomeProjectionItem}>
                  <Banknote size={20} color="#059669" />
                  <Text style={styles.incomeProjectionLabel}>Monthly Income</Text>
                  <Text style={styles.incomeProjectionValue}>
                    {formatCurrency(totalProjectedMonthlyIncome)}
                  </Text>
                </View>
                <View style={styles.incomeProjectionDivider} />
                <View style={styles.incomeProjectionItem}>
                  <TrendingUp size={20} color="#3B82F6" />
                  <Text style={styles.incomeProjectionLabel}>Annual Income</Text>
                  <Text style={styles.incomeProjectionValue}>
                    {formatCurrency(totalProjectedAnnualIncome)}
                  </Text>
                </View>
              </View>
              
              <View style={styles.incomeInsightCard}>
                <Text style={styles.incomeInsightTitle}>Income Insight</Text>
                <Text style={styles.incomeInsightText}>
                  {totalProjectedMonthlyIncome >= demoCurrentIncome * 0.8
                    ? "✅ Your projected retirement income meets the 80% replacement ratio. You're on track for a comfortable retirement!"
                    : "⚠️ Your projected retirement income is below the recommended 80% of current income. Consider increasing pension contributions or reducing future expenses."
                  }
                </Text>
              </View>
            </View>
          </View>
        </View>
      </ScrollView>

      {/* Pension Pot Information Modal */}
      <Modal
        visible={showPensionPotModal}
        animationType="slide"
        presentationStyle="pageSheet"
        onRequestClose={() => setShowPensionPotModal(false)}
      >
        <SafeAreaView style={styles.modalContainer}>
          <View style={styles.modalHeader}>
            <Text style={styles.modalTitle}>Projected Pension Pot Calculation</Text>
            <TouchableOpacity
              style={styles.modalCloseButton}
              onPress={() => setShowPensionPotModal(false)}
            >
              <X size={24} color="#6B7280" />
            </TouchableOpacity>
          </View>

          <ScrollView style={styles.modalContent}>
            <View style={styles.calculationSection}>
              <View style={styles.calculationHeader}>
                <Shield size={24} color="#7C3AED" />
                <Text style={styles.calculationTitle}>UK Pension Pot Growth</Text>
              </View>
              
              <Text style={styles.calculationDescription}>
                Your projected pension pot calculation includes your current savings, monthly contributions, 
                employer matching, UK tax relief, and compound growth over time.
              </Text>

              <View style={styles.formulaCard}>
                <Text style={styles.formulaTitle}>Calculation Components</Text>
                <Text style={styles.formulaText}>
                  1. Current pension pot: {formatCurrency(demoCurrentPensionPot)}{'\n'}
                  2. Monthly contributions (including employer match & tax relief){'\n'}
                  3. Compound growth at 5% annually over {yearsToRetirement} years{'\n'}
                  4. Total projected pot at retirement
                </Text>
              </View>

              <View style={styles.componentSection}>
                <Text style={styles.componentTitle}>Monthly Contribution Breakdown</Text>
                
                <View style={styles.componentItem}>
                  <View style={styles.componentIcon}>
                    <PiggyBank size={16} color="#3B82F6" />
                  </View>
                  <View style={styles.componentContent}>
                    <Text style={styles.componentLabel}>Your Monthly Contribution</Text>
                    <Text style={styles.componentValue}>{formatCurrency(demoMonthlyContributions)}</Text>
                    <Text style={styles.componentDescription}>
                      Your personal pension contributions each month
                    </Text>
                  </View>
                </View>

                <View style={styles.componentItem}>
                  <View style={styles.componentIcon}>
                    <Target size={16} color="#F59E0B" />
                  </View>
                  <View style={styles.componentContent}>
                    <Text style={styles.componentLabel}>Employer Matching</Text>
                    <Text style={styles.componentValue}>{formatCurrency(demoEmployerMatch)}</Text>
                    <Text style={styles.componentDescription}>
                      Employer contributions matched to your pension
                    </Text>
                  </View>
                </View>

                <View style={styles.componentItem}>
                  <View style={styles.componentIcon}>
                    <Percent size={16} color="#059669" />
                  </View>
                  <View style={styles.componentContent}>
                    <Text style={styles.componentLabel}>UK Tax Relief (25%)</Text>
                    <Text style={styles.componentValue}>{formatCurrency(demoTaxRelief)}</Text>
                    <Text style={styles.componentDescription}>
                      Basic rate tax relief on your pension contributions
                    </Text>
                  </View>
                </View>

                <View style={styles.totalContributionsCard}>
                  <Text style={styles.totalContributionsLabel}>Total Monthly Contributions</Text>
                  <Text style={styles.totalContributionsValue}>
                    {formatCurrency(totalMonthlyContributions)}
                  </Text>
                </View>
              </View>

              <View style={styles.growthSection}>
                <Text style={styles.growthTitle}>Growth Assumptions</Text>
                
                <View style={styles.growthItem}>
                  <View style={styles.growthIcon}>
                    <TrendingUp size={16} color="#7C3AED" />
                  </View>
                  <View style={styles.growthContent}>
                    <Text style={styles.growthLabel}>Annual Growth Rate: 5%</Text>
                    <Text style={styles.growthDescription}>
                      Conservative estimate for long-term pension fund growth
                    </Text>
                  </View>
                </View>

                <View style={styles.growthItem}>
                  <View style={styles.growthIcon}>
                    <Calendar size={16} color="#3B82F6" />
                  </View>
                  <View style={styles.growthContent}>
                    <Text style={styles.growthLabel}>Years to Retirement: {yearsToRetirement}</Text>
                    <Text style={styles.growthDescription}>
                      Time remaining for your pension to grow
                    </Text>
                  </View>
                </View>

                <View style={styles.growthItem}>
                  <View style={styles.growthIcon}>
                    <PiggyBank size={16} color="#059669" />
                  </View>
                  <View style={styles.growthContent}>
                    <Text style={styles.growthLabel}>Current Pension Pot: {formatCurrency(demoCurrentPensionPot)}</Text>
                    <Text style={styles.growthDescription}>
                      Your existing pension savings that will also grow
                    </Text>
                  </View>
                </View>
              </View>

              <View style={styles.projectionCard}>
                <Text style={styles.projectionTitle}>Growth Projection Example</Text>
                
                <View style={styles.yearExample}>
                  <Text style={styles.yearTitle}>Year 10 Projection</Text>
                  <View style={styles.projectionRow}>
                    <Text style={styles.projectionLabel}>Annual Contributions:</Text>
                    <Text style={styles.projectionValue}>
                      {formatCurrency(totalMonthlyContributions * 12)}
                    </Text>
                  </View>
                  <View style={styles.projectionRow}>
                    <Text style={styles.projectionLabel}>Accumulated (10 years):</Text>
                    <Text style={styles.projectionValue}>
                      {formatCurrency((totalMonthlyContributions * 12 * 10 * 1.05) + demoCurrentPensionPot)}
                    </Text>
                  </View>
                </View>

                <View style={styles.yearExample}>
                  <Text style={styles.yearTitle}>Final Projection ({yearsToRetirement} years)</Text>
                  <View style={styles.projectionRow}>
                    <Text style={styles.projectionLabel}>Total Contributions:</Text>
                    <Text style={styles.projectionValue}>
                      {formatCurrency(totalMonthlyContributions * 12 * yearsToRetirement)}
                    </Text>
                  </View>
                  <View style={styles.projectionRow}>
                    <Text style={styles.projectionLabel}>With Growth + Current Pot:</Text>
                    <Text style={[styles.projectionValue, styles.finalValue]}>
                      {formatCurrency(projectedPensionPot)}
                    </Text>
                  </View>
                </View>
              </View>

              <View style={styles.insightSection}>
                <Text style={styles.insightTitle}>Key Insights</Text>
                
                <View style={styles.insightItem}>
                  <Text style={styles.insightBullet}>🏦</Text>
                  <Text style={styles.insightText}>
                    <Text style={styles.insightBold}>UK Tax Benefits:</Text> Tax relief and employer matching 
                    significantly boost your pension contributions from {formatCurrency(demoMonthlyContributions)} 
                    to {formatCurrency(totalMonthlyContributions)} monthly.
                  </Text>
                </View>

                <View style={styles.insightItem}>
                  <Text style={styles.insightBullet}>📈</Text>
                  <Text style={styles.insightText}>
                    <Text style={styles.insightBold}>Compound Growth:</Text> Your pension pot grows from{' '}
                    {formatCurrency(demoCurrentPensionPot)} to {formatCurrency(projectedPensionPot)} over{' '}
                    {yearsToRetirement} years through regular contributions and compound growth.
                  </Text>
                </View>

                <View style={styles.insightItem}>
                  <Text style={styles.insightBullet}>💰</Text>
                  <Text style={styles.insightText}>
                    <Text style={styles.insightBold}>Retirement Income:</Text> This pension pot could provide 
                    approximately {formatCurrency(totalProjectedMonthlyIncome)} monthly income using the 4% withdrawal rule.
                  </Text>
                </View>
              </View>

              <View style={styles.disclaimerSection}>
                <Text style={styles.disclaimerTitle}>Important Considerations</Text>
                <Text style={styles.disclaimerText}>
                  • Growth rates are estimates and actual returns may vary{'\n'}
                  • Tax relief rates may change with future legislation{'\n'}
                  • Employer matching terms may change over time{'\n'}
                  • Consider inflation impact on purchasing power{'\n'}
                  • Regular review and adjustment recommended
                </Text>
              </View>
            </View>
          </ScrollView>
        </SafeAreaView>
      </Modal>

      {/* Retirement Fund Calculation Modal */}
      <Modal
        visible={showRetirementFundModal}
        animationType="slide"
        presentationStyle="pageSheet"
        onRequestClose={() => setShowRetirementFundModal(false)}
      >
        <SafeAreaView style={styles.modalContainer}>
          <View style={styles.modalHeader}>
            <Text style={styles.modalTitle}>Projected Retirement Fund Calculation</Text>
            <TouchableOpacity
              style={styles.modalCloseButton}
              onPress={() => setShowRetirementFundModal(false)}
            >
              <X size={24} color="#6B7280" />
            </TouchableOpacity>
          </View>

          <ScrollView style={styles.modalContent}>
            <View style={styles.calculationSection}>
              <View style={styles.calculationHeader}>
                <Calculator size={24} color="#7C3AED" />
                <Text style={styles.calculationTitle}>Inflation-Adjusted Cashflow Analysis</Text>
              </View>
              
              <Text style={styles.calculationDescription}>
                Your projected retirement fund represents the present value of all future cashflow 
                surpluses, adjusted for wage inflation and expense inflation over your working years.
              </Text>

              <View style={styles.formulaCard}>
                <Text style={styles.formulaTitle}>Calculation Method</Text>
                <Text style={styles.formulaText}>
                  1. Project income with wage inflation (2% annually){'\n'}
                  2. Project expenses with general inflation (2.5% annually){'\n'}
                  3. Calculate annual cashflow surplus{'\n'}
                  4. Discount to present value (3% discount rate)
                </Text>
              </View>

              <View style={styles.componentSection}>
                <Text style={styles.componentTitle}>Current Financial Position</Text>
                
                <View style={styles.componentItem}>
                  <View style={styles.componentIcon}>
                    <TrendingUp size={16} color="#059669" />
                  </View>
                  <View style={styles.componentContent}>
                    <Text style={styles.componentLabel}>Monthly Income</Text>
                    <Text style={styles.componentValue}>{formatCurrency(demoCurrentIncome)}</Text>
                    <Text style={styles.componentDescription}>
                      Current total monthly income from all sources
                    </Text>
                  </View>
                </View>

                <View style={styles.componentItem}>
                  <View style={styles.componentIcon}>
                    <TrendingDown size={16} color="#DC2626" />
                  </View>
                  <View style={styles.componentContent}>
                    <Text style={styles.componentLabel}>Monthly Expenses</Text>
                    <Text style={styles.componentValue}>{formatCurrency(demoCurrentExpenses)}</Text>
                    <Text style={styles.componentDescription}>
                      Current total monthly expenses across all categories
                    </Text>
                  </View>
                </View>

                <View style={styles.componentItem}>
                  <View style={styles.componentIcon}>
                    <PiggyBank size={16} color="#7C3AED" />
                  </View>
                  <View style={styles.componentContent}>
                    <Text style={styles.componentLabel}>Monthly Cashflow Surplus</Text>
                    <Text style={[styles.componentValue, { color: demoCurrentCashflow >= 0 ? '#059669' : '#DC2626' }]}>
                      {demoCurrentCashflow >= 0 ? '+' : ''}{formatCurrency(demoCurrentCashflow)}
                    </Text>
                    <Text style={styles.componentDescription}>
                      Available for savings and investments each month
                    </Text>
                  </View>
                </View>
              </View>

              <View style={styles.componentSection}>
                <Text style={styles.componentTitle}>Economic Assumptions</Text>
                
                <View style={styles.componentItem}>
                  <View style={styles.componentIcon}>
                    <Percent size={16} color="#3B82F6" />
                  </View>
                  <View style={styles.componentContent}>
                    <Text style={styles.componentLabel}>Wage Inflation Rate: 2.0%</Text>
                    <Text style={styles.componentDescription}>
                      Annual growth rate applied to income (UK historical average)
                    </Text>
                  </View>
                </View>

                <View style={styles.componentItem}>
                  <View style={styles.componentIcon}>
                    <Percent size={16} color="#F59E0B" />
                  </View>
                  <View style={styles.componentContent}>
                    <Text style={styles.componentLabel}>Expense Inflation Rate: 2.5%</Text>
                    <Text style={styles.componentDescription}>
                      Annual growth rate applied to expenses (UK target inflation)
                    </Text>
                  </View>
                </View>

                <View style={styles.componentItem}>
                  <View style={styles.componentIcon}>
                    <Percent size={16} color="#059669" />
                  </View>
                  <View style={styles.componentContent}>
                    <Text style={styles.componentLabel}>Discount Rate: 3.0%</Text>
                    <Text style={styles.componentDescription}>
                      Rate used to calculate present value of future cashflows
                    </Text>
                  </View>
                </View>
              </View>

              <View style={styles.projectionCard}>
                <Text style={styles.projectionTitle}>Sample Year-by-Year Projection</Text>
                
                <View style={styles.yearExample}>
                  <Text style={styles.yearTitle}>Year 1 (2025)</Text>
                  <View style={styles.projectionRow}>
                    <Text style={styles.projectionLabel}>Projected Income:</Text>
                    <Text style={styles.projectionValue}>
                      {formatCurrency(demoCurrentIncome * Math.pow(1.02, 1))}
                    </Text>
                  </View>
                  <View style={styles.projectionRow}>
                    <Text style={styles.projectionLabel}>Projected Expenses:</Text>
                    <Text style={styles.projectionValue}>
                      {formatCurrency(demoCurrentExpenses * Math.pow(1.025, 1))}
                    </Text>
                  </View>
                  <View style={styles.projectionRow}>
                    <Text style={styles.projectionLabel}>Annual Surplus:</Text>
                    <Text style={[styles.projectionValue, styles.finalValue]}>
                      {formatCurrency((demoCurrentIncome * Math.pow(1.02, 1) - demoCurrentExpenses * Math.pow(1.025, 1)) * 12)}
                    </Text>
                  </View>
                </View>

                <View style={styles.yearExample}>
                  <Text style={styles.yearTitle}>Year 10 (2034)</Text>
                  <View style={styles.projectionRow}>
                    <Text style={styles.projectionLabel}>Projected Income:</Text>
                    <Text style={styles.projectionValue}>
                      {formatCurrency(demoCurrentIncome * Math.pow(1.02, 10))}
                    </Text>
                  </View>
                  <View style={styles.projectionRow}>
                    <Text style={styles.projectionLabel}>Projected Expenses:</Text>
                    <Text style={styles.projectionValue}>
                      {formatCurrency(demoCurrentExpenses * Math.pow(1.025, 10))}
                    </Text>
                  </View>
                  <View style={styles.projectionRow}>
                    <Text style={styles.projectionLabel}>Annual Surplus:</Text>
                    <Text style={[styles.projectionValue, styles.finalValue]}>
                      {formatCurrency((demoCurrentIncome * Math.pow(1.02, 10) - demoCurrentExpenses * Math.pow(1.025, 10)) * 12)}
                    </Text>
                  </View>
                </View>

                <View style={styles.totalProjectionCard}>
                  <Text style={styles.totalProjectionLabel}>Total Projected Retirement Fund (Present Value):</Text>
                  <Text style={styles.totalProjectionValue}>
                    {formatCurrency(projectedRetirementFund)}
                  </Text>
                </View>
              </View>

              <View style={styles.insightSection}>
                <Text style={styles.insightTitle}>Key Insights</Text>
                
                <View style={styles.insightItem}>
                  <Text style={styles.insightBullet}>💡</Text>
                  <Text style={styles.insightText}>
                    <Text style={styles.insightBold}>Inflation Impact:</Text> Your expenses are projected to grow 
                    faster (2.5%) than your income (2.0%), which gradually reduces your cashflow surplus over time.
                  </Text>
                </View>

                <View style={styles.insightItem}>
                  <Text style={styles.insightBullet}>📈</Text>
                  <Text style={styles.insightText}>
                    <Text style={styles.insightBold}>Present Value:</Text> The {formatCurrency(projectedRetirementFund)} 
                    represents today's purchasing power of all your future savings.
                  </Text>
                </View>

                <View style={styles.insightItem}>
                  <Text style={styles.insightBullet}>🎯</Text>
                  <Text style={styles.insightText}>
                    <Text style={styles.insightBold}>Strategy:</Text> Consider increasing income growth or controlling 
                    expense inflation to maximize your retirement fund accumulation.
                  </Text>
                </View>
              </View>

              <View style={styles.disclaimerSection}>
                <Text style={styles.disclaimerTitle}>Important Considerations</Text>
                <Text style={styles.disclaimerText}>
                  • This calculation assumes consistent cashflow patterns{'\n'}
                  • Actual inflation rates may vary from projections{'\n'}
                  • Investment returns on accumulated funds not included{'\n'}
                  • Consider tax implications and pension contributions{'\n'}
                  • Regular review and adjustment recommended
                </Text>
              </View>
            </View>
          </ScrollView>
        </SafeAreaView>
      </Modal>

      {/* Income Calculation Info Modal */}
      <Modal
        visible={showIncomeInfoModal}
        animationType="slide"
        presentationStyle="pageSheet"
        onRequestClose={() => setShowIncomeInfoModal(false)}
      >
        <SafeAreaView style={styles.modalContainer}>
          <View style={styles.modalHeader}>
            <Text style={styles.modalTitle}>How Projected Income is Calculated</Text>
            <TouchableOpacity
              style={styles.modalCloseButton}
              onPress={() => setShowIncomeInfoModal(false)}
            >
              <X size={24} color="#6B7280" />
            </TouchableOpacity>
          </View>

          <ScrollView style={styles.modalContent}>
            <View style={styles.calculationSection}>
              <View style={styles.calculationHeader}>
                <Calculator size={24} color="#059669" />
                <Text style={styles.calculationTitle}>Projected Retirement Income</Text>
              </View>
              
              <Text style={styles.calculationDescription}>
                Your projected retirement income is calculated based on the 4% withdrawal rule 
                applied to your estimated pension pot at retirement. Here's the detailed breakdown:
              </Text>

              <View style={styles.formulaCard}>
                <Text style={styles.formulaTitle}>4% Withdrawal Rule</Text>
                <Text style={styles.formulaText}>
                  Monthly Income = (Projected Pension Pot × 4%) ÷ 12 months
                </Text>
                <Text style={styles.formulaSubtext}>
                  The 4% rule is a widely accepted guideline that suggests withdrawing 4% of your 
                  retirement savings annually to maintain your capital throughout retirement.
                </Text>
              </View>

              <View style={styles.componentSection}>
                <Text style={styles.componentTitle}>Demo User Profile</Text>
                
                <View style={styles.componentItem}>
                  <View style={styles.componentIcon}>
                    <Calendar size={16} color="#3B82F6" />
                  </View>
                  <View style={styles.componentContent}>
                    <Text style={styles.componentLabel}>Current Age: {demoCurrentAge} years</Text>
                    <Text style={styles.componentDescription}>
                      Starting point for retirement planning calculations
                    </Text>
                  </View>
                </View>

                <View style={styles.componentItem}>
                  <View style={styles.componentIcon}>
                    <Target size={16} color="#F59E0B" />
                  </View>
                  <View style={styles.componentContent}>
                    <Text style={styles.componentLabel}>Retirement Age: {demoRetirementAge} years</Text>
                    <Text style={styles.componentDescription}>
                      UK State Pension age (may vary based on birth year)
                    </Text>
                  </View>
                </View>

                <View style={styles.componentItem}>
                  <View style={styles.componentIcon}>
                    <Calendar size={16} color="#059669" />
                  </View>
                  <View style={styles.componentContent}>
                    <Text style={styles.componentLabel}>Years to Retirement: {yearsToRetirement} years</Text>
                    <Text style={styles.componentDescription}>
                      Time available for pension savings to grow ({demoRetirementAge} - {demoCurrentAge} = {yearsToRetirement} years)
                    </Text>
                  </View>
                </View>
              </View>

              <View style={styles.componentSection}>
                <Text style={styles.componentTitle}>Pension Pot Growth Calculation</Text>
                
                <View style={styles.componentItem}>
                  <View style={styles.componentIcon}>
                    <PiggyBank size={16} color="#3B82F6" />
                  </View>
                  <View style={styles.componentContent}>
                    <Text style={styles.componentLabel}>Your Monthly Contributions</Text>
                    <Text style={styles.componentValue}>{formatCurrency(demoMonthlyContributions)}</Text>
                    <Text style={styles.componentDescription}>
                      Your personal pension contributions each month
                    </Text>
                  </View>
                </View>

                <View style={styles.componentItem}>
                  <View style={styles.componentIcon}>
                    <Target size={16} color="#F59E0B" />
                  </View>
                  <View style={styles.componentContent}>
                    <Text style={styles.componentLabel}>Employer Matching</Text>
                    <Text style={styles.componentValue}>{formatCurrency(demoEmployerMatch)}</Text>
                    <Text style={styles.componentDescription}>
                      Employer contributions matched to your pension
                    </Text>
                  </View>
                </View>

                <View style={styles.componentItem}>
                  <View style={styles.componentIcon}>
                    <Percent size={16} color="#059669" />
                  </View>
                  <View style={styles.componentContent}>
                    <Text style={styles.componentLabel}>UK Tax Relief (25%)</Text>
                    <Text style={styles.componentValue}>{formatCurrency(demoTaxRelief)}</Text>
                    <Text style={styles.componentDescription}>
                      Basic rate tax relief on your pension contributions
                    </Text>
                  </View>
                </View>

                <View style={styles.totalContributionsCard}>
                  <Text style={styles.totalContributionsLabel}>Total Monthly Contributions</Text>
                  <Text style={styles.totalContributionsValue}>
                    {formatCurrency(totalMonthlyContributions)}
                  </Text>
                </View>
              </View>

              <View style={styles.growthSection}>
                <Text style={styles.growthTitle}>Investment Growth Assumptions</Text>
                
                <View style={styles.growthItem}>
                  <View style={styles.growthIcon}>
                    <TrendingUp size={16} color="#7C3AED" />
                  </View>
                  <View style={styles.growthContent}>
                    <Text style={styles.growthLabel}>Annual Growth Rate: 5%</Text>
                    <Text style={styles.growthDescription}>
                      Conservative estimate for long-term pension fund growth
                    </Text>
                  </View>
                </View>

                <View style={styles.growthItem}>
                  <View style={styles.growthIcon}>
                    <Calculator size={16} color="#3B82F6" />
                  </View>
                  <View style={styles.growthContent}>
                    <Text style={styles.growthLabel}>Years to Retirement: {yearsToRetirement}</Text>
                    <Text style={styles.growthDescription}>
                      Time remaining for your pension to grow
                    </Text>
                  </View>
                </View>

                <View style={styles.growthItem}>
                  <View style={styles.growthIcon}>
                    <PiggyBank size={16} color="#059669" />
                  </View>
                  <View style={styles.growthContent}>
                    <Text style={styles.growthLabel}>Current Pension Pot: {formatCurrency(demoCurrentPensionPot)}</Text>
                    <Text style={styles.growthDescription}>
                      Your existing pension savings that will also grow
                    </Text>
                  </View>
                </View>
              </View>

              <View style={styles.projectionCard}>
                <Text style={styles.projectionTitle}>Final Calculation</Text>
                
                <View style={styles.projectionRow}>
                  <Text style={styles.projectionLabel}>Projected Pension Pot at Retirement:</Text>
                  <Text style={styles.projectionValue}>{formatCurrency(projectedPensionPot)}</Text>
                </View>
                
                <View style={styles.projectionRow}>
                  <Text style={styles.projectionLabel}>4% Annual Withdrawal:</Text>
                  <Text style={styles.projectionValue}>{formatCurrency(projectedPensionPot * 0.04)}</Text>
                </View>
                
                <View style={styles.projectionRow}>
                  <Text style={styles.projectionLabel}>Monthly Income:</Text>
                  <Text style={[styles.projectionValue, styles.finalValue]}>
                    {formatCurrency(totalProjectedMonthlyIncome)}
                  </Text>
                </View>
              </View>

              <View style={styles.disclaimerSection}>
                <Text style={styles.disclaimerTitle}>Important Considerations</Text>
                <Text style={styles.disclaimerText}>
                  • This calculation doesn't include UK State Pension entitlement{'\n'}
                  • Investment returns can vary and are not guaranteed{'\n'}
                  • Inflation will affect the purchasing power of your income{'\n'}
                  • Consider reviewing and adjusting your strategy regularly{'\n'}
                  • Seek professional financial advice for personalized planning
                </Text>
              </View>
            </View>
          </ScrollView>
        </SafeAreaView>
      </Modal>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F9FAFB',
  },
  scrollView: {
    flex: 1,
  },
  header: {
    paddingHorizontal: 20,
    paddingTop: 60,
    paddingBottom: 40,
    borderBottomLeftRadius: 24,
    borderBottomRightRadius: 24,
  },
  headerContent: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  headerTitle: {
    fontSize: 28,
    fontWeight: '700',
    color: '#FFFFFF',
    marginBottom: 4,
  },
  headerSubtitle: {
    fontSize: 16,
    color: '#BFDBFE',
  },
  settingsButton: {
    padding: 8,
    borderRadius: 12,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
  },
  scoreSection: {
    paddingHorizontal: 20,
    marginTop: 20,
  },
  metricsSection: {
    paddingHorizontal: 20,
    marginTop: 24,
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: '600',
    color: '#111827',
    marginBottom: 16,
  },
  metricsGrid: {
    flexDirection: 'row',
    gap: 12,
    marginBottom: 20,
  },
  // Pension Pot Section Styles
  pensionPotSection: {
    marginBottom: 20,
  },
  pensionPotCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
    borderLeftWidth: 4,
    borderLeftColor: '#7C3AED',
  },
  pensionPotHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
    gap: 12,
  },
  pensionPotTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#111827',
    flex: 1,
  },
  infoButton: {
    padding: 8,
    borderRadius: 8,
    backgroundColor: '#F3F4F6',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  pensionPotRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 20,
  },
  pensionPotItem: {
    flex: 1,
    alignItems: 'center',
  },
  pensionPotDivider: {
    width: 1,
    height: 60,
    backgroundColor: '#E5E7EB',
    marginHorizontal: 16,
  },
  pensionPotLabel: {
    fontSize: 14,
    color: '#6B7280',
    marginTop: 8,
    marginBottom: 4,
    textAlign: 'center',
  },
  pensionPotValue: {
    fontSize: 18,
    fontWeight: '700',
    color: '#111827',
    marginBottom: 2,
  },
  pensionContributionsBreakdown: {
    backgroundColor: '#F8FAFC',
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
  },
  contributionsTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#111827',
    marginBottom: 12,
  },
  contributionRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  contributionLabel: {
    fontSize: 14,
    color: '#6B7280',
  },
  contributionValue: {
    fontSize: 14,
    fontWeight: '600',
    color: '#111827',
  },
  contributionDivider: {
    height: 1,
    backgroundColor: '#E5E7EB',
    marginVertical: 8,
  },
  contributionTotalLabel: {
    fontSize: 14,
    fontWeight: '600',
    color: '#7C3AED',
  },
  contributionTotalValue: {
    fontSize: 16,
    fontWeight: '700',
    color: '#7C3AED',
  },
  pensionInsightCard: {
    backgroundColor: '#F3F0FF',
    borderRadius: 12,
    padding: 16,
    borderWidth: 1,
    borderColor: '#E9D5FF',
  },
  pensionInsightTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: '#7C3AED',
    marginBottom: 8,
  },
  pensionInsightText: {
    fontSize: 14,
    color: '#374151',
    lineHeight: 20,
  },
  projectedIncomeSection: {
    marginTop: 8,
  },
  projectedIncomeCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
    borderLeftWidth: 4,
    borderLeftColor: '#059669',
  },
  projectedIncomeHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
    gap: 12,
  },
  projectedIncomeTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#111827',
    flex: 1,
  },
  incomeProjectionRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 20,
  },
  incomeProjectionItem: {
    flex: 1,
    alignItems: 'center',
  },
  incomeProjectionDivider: {
    width: 1,
    height: 60,
    backgroundColor: '#E5E7EB',
    marginHorizontal: 16,
  },
  incomeProjectionLabel: {
    fontSize: 14,
    color: '#6B7280',
    marginTop: 8,
    marginBottom: 4,
  },
  incomeProjectionValue: {
    fontSize: 18,
    fontWeight: '700',
    color: '#111827',
    marginBottom: 2,
  },
  incomeInsightCard: {
    backgroundColor: '#F0FDF4',
    borderRadius: 12,
    padding: 16,
    borderWidth: 1,
    borderColor: '#BBF7D0',
  },
  incomeInsightTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: '#059669',
    marginBottom: 8,
  },
  incomeInsightText: {
    fontSize: 14,
    color: '#374151',
    lineHeight: 20,
  },
  // Modal Styles
  modalContainer: {
    flex: 1,
    backgroundColor: '#F9FAFB',
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#E5E7EB',
    backgroundColor: '#FFFFFF',
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: '600',
    color: '#111827',
  },
  modalCloseButton: {
    padding: 8,
  },
  modalContent: {
    flex: 1,
    paddingHorizontal: 20,
    paddingTop: 20,
  },
  calculationSection: {
    paddingBottom: 32,
  },
  calculationHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
    gap: 12,
  },
  calculationTitle: {
    fontSize: 24,
    fontWeight: '700',
    color: '#111827',
  },
  calculationDescription: {
    fontSize: 16,
    color: '#6B7280',
    lineHeight: 24,
    marginBottom: 24,
  },
  formulaCard: {
    backgroundColor: '#F0F9FF',
    borderRadius: 12,
    padding: 16,
    marginBottom: 24,
    borderWidth: 1,
    borderColor: '#BAE6FD',
  },
  formulaTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#0369A1',
    marginBottom: 8,
  },
  formulaText: {
    fontSize: 14,
    color: '#374151',
    lineHeight: 20,
  },
  formulaSubtext: {
    fontSize: 14,
    color: '#6B7280',
    lineHeight: 20,
    marginTop: 8,
  },
  componentSection: {
    marginBottom: 24,
  },
  componentTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#111827',
    marginBottom: 16,
  },
  componentItem: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: 16,
    gap: 12,
  },
  componentIcon: {
    width: 32,
    height: 32,
    borderRadius: 8,
    backgroundColor: '#FFFFFF',
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  componentContent: {
    flex: 1,
  },
  componentLabel: {
    fontSize: 14,
    fontWeight: '600',
    color: '#111827',
    marginBottom: 2,
  },
  componentValue: {
    fontSize: 16,
    fontWeight: '700',
    color: '#059669',
    marginBottom: 4,
  },
  componentDescription: {
    fontSize: 14,
    color: '#6B7280',
    lineHeight: 18,
  },
  totalContributionsCard: {
    backgroundColor: '#EFF6FF',
    borderRadius: 12,
    padding: 16,
    marginTop: 8,
    borderWidth: 1,
    borderColor: '#DBEAFE',
    alignItems: 'center',
  },
  totalContributionsLabel: {
    fontSize: 14,
    fontWeight: '600',
    color: '#1E40AF',
    marginBottom: 4,
  },
  totalContributionsValue: {
    fontSize: 20,
    fontWeight: '700',
    color: '#1E40AF',
  },
  growthSection: {
    marginBottom: 24,
  },
  growthTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#111827',
    marginBottom: 16,
  },
  growthItem: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: 12,
    gap: 12,
  },
  growthIcon: {
    width: 32,
    height: 32,
    borderRadius: 8,
    backgroundColor: '#FFFFFF',
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  growthContent: {
    flex: 1,
  },
  growthLabel: {
    fontSize: 14,
    fontWeight: '600',
    color: '#111827',
    marginBottom: 2,
  },
  growthDescription: {
    fontSize: 14,
    color: '#6B7280',
    lineHeight: 18,
  },
  projectionCard: {
    backgroundColor: '#FEF3C7',
    borderRadius: 12,
    padding: 16,
    marginBottom: 24,
    borderWidth: 1,
    borderColor: '#FDE68A',
  },
  projectionTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#92400E',
    marginBottom: 12,
    textAlign: 'center',
  },
  projectionRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  projectionLabel: {
    fontSize: 14,
    color: '#78350F',
    flex: 1,
  },
  projectionValue: {
    fontSize: 14,
    fontWeight: '600',
    color: '#92400E',
  },
  finalValue: {
    fontSize: 16,
    fontWeight: '700',
    color: '#059669',
  },
  yearExample: {
    backgroundColor: 'rgba(255, 255, 255, 0.5)',
    borderRadius: 8,
    padding: 12,
    marginBottom: 12,
  },
  yearTitle: {
    fontSize: 14,
    fontWeight: '700',
    color: '#92400E',
    marginBottom: 8,
  },
  totalProjectionCard: {
    backgroundColor: '#7C3AED',
    borderRadius: 12,
    padding: 16,
    alignItems: 'center',
    marginTop: 8,
  },
  totalProjectionLabel: {
    fontSize: 14,
    fontWeight: '600',
    color: '#FFFFFF',
    marginBottom: 8,
    textAlign: 'center',
  },
  totalProjectionValue: {
    fontSize: 24,
    fontWeight: '700',
    color: '#FFFFFF',
  },
  insightSection: {
    backgroundColor: '#F0F9FF',
    borderRadius: 12,
    padding: 16,
    marginBottom: 24,
    borderWidth: 1,
    borderColor: '#BAE6FD',
  },
  insightTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#0369A1',
    marginBottom: 16,
  },
  insightItem: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: 12,
    gap: 8,
  },
  insightBullet: {
    fontSize: 16,
    marginTop: 2,
  },
  insightText: {
    fontSize: 14,
    color: '#374151',
    lineHeight: 20,
    flex: 1,
  },
  insightBold: {
    fontWeight: '600',
    color: '#111827',
  },
  disclaimerSection: {
    backgroundColor: '#FEF2F2',
    borderRadius: 12,
    padding: 16,
    borderWidth: 1,
    borderColor: '#FECACA',
  },
  disclaimerTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#DC2626',
    marginBottom: 8,
  },
  disclaimerText: {
    fontSize: 14,
    color: '#7F1D1D',
    lineHeight: 20,
  },
});