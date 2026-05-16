import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Modal, SafeAreaView, ScrollView } from 'react-native';
import { TrendingUp, TrendingDown, Info, X, Calculator, PiggyBank, Percent, Calendar, TrendingDown as TrendingDownIcon } from 'lucide-react-native';
import { LinearGradient } from 'expo-linear-gradient';

interface MetricCardProps {
  title: string;
  value: string;
  icon: React.ReactNode;
  trend: 'positive' | 'negative' | 'neutral';
  showInfoButton?: boolean;
  onInfoPress?: () => void;
}

export function MetricCard({ title, value, icon, trend, showInfoButton = false, onInfoPress }: MetricCardProps) {
  const [showInfoModal, setShowInfoModal] = useState(false);

  const getTrendIcon = () => {
    if (trend === 'positive') {
      return <TrendingUp size={16} color="#059669" />;
    } else if (trend === 'negative') {
      return <TrendingDown size={16} color="#DC2626" />;
    }
    return null;
  };

  const getTrendColor = () => {
    if (trend === 'positive') return '#059669';
    if (trend === 'negative') return '#DC2626';
    return '#6B7280';
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-GB', {
      style: 'currency',
      currency: 'GBP',
      minimumFractionDigits: 0,
    }).format(amount);
  };

  const handleInfoPress = () => {
    if (onInfoPress) {
      onInfoPress();
    } else {
      setShowInfoModal(true);
    }
  };

  // Demo data for calculation explanation
  const demoCurrentAge = 30;
  const demoRetirementAge = 67;
  const yearsToRetirement = demoRetirementAge - demoCurrentAge;
  const demoCurrentIncome = 4150;
  const demoCurrentExpenses = 3225;
  const demoCurrentCashflow = demoCurrentIncome - demoCurrentExpenses;
  const wageInflationRate = 0.02;
  const expenseInflationRate = 0.025;
  const discountRate = 0.03;

  return (
    <>
      <View style={styles.container}>
        <View style={styles.header}>
          <View style={styles.iconContainer}>
            {icon}
          </View>
          <View style={styles.rightSection}>
            {getTrendIcon()}
            {showInfoButton && (
              <TouchableOpacity
                style={styles.infoButton}
                onPress={handleInfoPress}
              >
                <Info size={16} color="#6B7280" />
              </TouchableOpacity>
            )}
          </View>
        </View>
        <Text style={styles.title}>{title}</Text>
        <Text style={[styles.value, { color: getTrendColor() }]}>{value}</Text>
      </View>

      {/* Information Modal - only show if no custom onInfoPress handler */}
      {!onInfoPress && (
        <Modal
          visible={showInfoModal}
          animationType="slide"
          presentationStyle="pageSheet"
          onRequestClose={() => setShowInfoModal(false)}
        >
          <SafeAreaView style={styles.modalContainer}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Projected Retirement Fund Calculation</Text>
              <TouchableOpacity
                style={styles.modalCloseButton}
                onPress={() => setShowInfoModal(false)}
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
                      <TrendingDownIcon size={16} color="#DC2626" />
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
                      <Text style={styles.insightBold}>Present Value:</Text> The calculation shows today's purchasing 
                      power of all your future savings accumulated over {yearsToRetirement} years.
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
      )}
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 16,
    flex: 1,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  iconContainer: {
    flex: 1,
  },
  rightSection: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  infoButton: {
    padding: 4,
    borderRadius: 6,
    backgroundColor: '#F3F4F6',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  title: {
    fontSize: 14,
    color: '#6B7280',
    marginBottom: 4,
  },
  value: {
    fontSize: 18,
    fontWeight: '700',
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