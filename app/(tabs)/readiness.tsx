import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  SafeAreaView,
  TouchableOpacity,
  TextInput,
  Alert,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { useRetirement } from '@/context/RetirementContext';
import { 
  TrendingUp, 
  TrendingDown, 
  PoundSterling, 
  Percent,
  Play,
  RotateCcw,
  Shield,
  Settings
} from 'lucide-react-native';
import { router } from 'expo-router';

interface Scenario {
  id: string;
  title: string;
  description: string;
  icon: React.ReactNode;
  color: string;
  modifier: (data: any) => any;
}

export default function Readiness() {
  const { state, dispatch } = useRetirement();
  const [selectedScenario, setSelectedScenario] = useState<string | null>(null);
  const [customValues, setCustomValues] = useState({
    salaryIncrease: 10,
    pensionIncrease: 10,
    expenseReduction: 10,
    retirementIncomeReduction: 10,
  });
  const [scenarioResult, setScenarioResult] = useState<any>(null);

  const predefinedScenarios: Scenario[] = [
    {
      id: 'salary-increase',
      title: 'Increase Salary by 10%',
      description: 'See how earning 10% more affects your UK retirement',
      icon: <TrendingUp size={24} color="#059669" />,
      color: '#059669',
      modifier: (data) => ({
        ...data,
        income: {
          ...data.income,
          salary: data.income.salary * 1.1,
        },
      }),
    },
    {
      id: 'pension-boost',
      title: 'Increase Pension Contributions by 10%',
      description: 'Impact of boosting pension contributions by 10%',
      icon: <Shield size={24} color="#3B82F6" />,
      color: '#3B82F6',
      modifier: (data) => ({
        ...data,
        pensionContributions: data.pensionContributions * 1.1,
      }),
    },
    {
      id: 'spend-less',
      title: 'Reduce Expenses by 10%',
      description: 'Benefits of cutting monthly expenses by 10%',
      icon: <TrendingDown size={24} color="#F59E0B" />,
      color: '#F59E0B',
      modifier: (data) => ({
        ...data,
        expenses: Object.keys(data.expenses).reduce((acc, key) => ({
          ...acc,
          [key]: data.expenses[key] * 0.9,
        }), {}),
      }),
    },
    {
      id: 'retirement-income-reduction',
      title: 'Need 10% Less in Retirement',
      description: 'Impact of needing 10% less income in retirement',
      icon: <Percent size={24} color="#EF4444" />,
      color: '#EF4444',
      modifier: (data) => ({
        ...data,
        expenses: Object.keys(data.expenses).reduce((acc, key) => ({
          ...acc,
          [key]: data.expenses[key] * 0.9,
        }), {}),
      }),
    },
  ];

  const runScenario = (scenario: Scenario) => {
    const modifiedData = scenario.modifier(state.financialData);
    
    // Calculate new metrics with UK-specific considerations
    const totalAssets = Object.values(state.financialData.assets).reduce((sum: number, value: any) => sum + value, 0);
    const totalLiabilities = Object.values(state.financialData.liabilities).reduce((sum: number, value: any) => sum + value, 0);
    const totalIncome = Object.values(modifiedData.income).reduce((sum: number, value: any) => sum + value, 0);
    const totalExpenses = Object.values(modifiedData.expenses).reduce((sum: number, value: any) => sum + value, 0);
    
    const netWorth = totalAssets - totalLiabilities;
    const monthlyNetCashflow = totalIncome - totalExpenses;
    
    // Enhanced UK retirement score calculation
    const yearsToRetirement = Math.max(0, state.userProfile.retirementAge - state.userProfile.currentAge);
    const targetMonthlyRetirementIncome = totalExpenses * 0.8; // 80% replacement ratio
    
    // Calculate projected pension pot with UK tax relief and employer matching
    const totalMonthlyContributions = (modifiedData.pensionContributions || state.financialData.pensionContributions) + 
                                     state.financialData.employerPensionMatch +
                                     ((modifiedData.pensionContributions || state.financialData.pensionContributions) * 0.25); // Basic rate tax relief
    
    const projectedPensionPot = (totalMonthlyContributions * 12 * yearsToRetirement * 1.05) + // 5% annual growth
                                state.financialData.assets.pensionPot;
    
    const projectedPrivateIncome = (projectedPensionPot * 0.04) / 12; // 4% withdrawal rule
    const totalProjectedIncome = projectedPrivateIncome + state.statePensionEntitlement;
    const retirementScore = Math.min(100, Math.max(0, (totalProjectedIncome / targetMonthlyRetirementIncome) * 100));

    const result = {
      scenario: scenario.title,
      color: scenario.color,
      original: {
        retirementScore: state.retirementScore,
        netWorth: state.netWorth,
        monthlyNetCashflow: state.monthlyNetCashflow,
      },
      modified: {
        retirementScore: Math.round(retirementScore),
        netWorth,
        monthlyNetCashflow,
      },
      improvements: {
        retirementScore: Math.round(retirementScore) - state.retirementScore,
        netWorth: netWorth - state.netWorth,
        monthlyNetCashflow: monthlyNetCashflow - state.monthlyNetCashflow,
      },
    };

    setScenarioResult(result);
    setSelectedScenario(scenario.id);
  };

  const runCustomScenario = () => {
    const modifiedData = {
      ...state.financialData,
      income: {
        ...state.financialData.income,
        salary: state.financialData.income.salary * (1 + customValues.salaryIncrease / 100),
      },
      pensionContributions: state.financialData.pensionContributions * (1 + customValues.pensionIncrease / 100),
      expenses: Object.keys(state.financialData.expenses).reduce((acc, key) => ({
        ...acc,
        [key]: state.financialData.expenses[key as keyof typeof state.financialData.expenses] * (1 - customValues.expenseReduction / 100),
      }), {} as any),
    };

    // Apply retirement income reduction
    const retirementExpenseMultiplier = 1 - (customValues.retirementIncomeReduction / 100);

    // Calculate metrics with custom scenario
    const totalAssets = Object.values(state.financialData.assets).reduce((sum: number, value: any) => sum + value, 0);
    const totalLiabilities = Object.values(state.financialData.liabilities).reduce((sum: number, value: any) => sum + value, 0);
    const totalIncome = Object.values(modifiedData.income).reduce((sum: number, value: any) => sum + value, 0);
    const totalExpenses = Object.values(modifiedData.expenses).reduce((sum: number, value: any) => sum + value, 0);
    
    const netWorth = totalAssets - totalLiabilities;
    const monthlyNetCashflow = totalIncome - totalExpenses;
    
    const yearsToRetirement = Math.max(0, state.userProfile.retirementAge - state.userProfile.currentAge);
    const targetMonthlyRetirementIncome = (totalExpenses * 0.8) * retirementExpenseMultiplier;
    
    // Enhanced pension calculation with UK tax benefits
    const totalMonthlyContributions = modifiedData.pensionContributions + 
                                     state.financialData.employerPensionMatch +
                                     (modifiedData.pensionContributions * 0.25); // Basic rate tax relief
    
    const projectedPensionPot = (totalMonthlyContributions * 12 * yearsToRetirement * 1.05) + 
                                state.financialData.assets.pensionPot;
    
    const projectedPrivateIncome = (projectedPensionPot * 0.04) / 12;
    const totalProjectedIncome = projectedPrivateIncome + state.statePensionEntitlement;
    const retirementScore = Math.min(100, Math.max(0, (totalProjectedIncome / targetMonthlyRetirementIncome) * 100));

    const result = {
      scenario: 'Custom UK Scenario',
      color: '#8B5CF6',
      original: {
        retirementScore: state.retirementScore,
        netWorth: state.netWorth,
        monthlyNetCashflow: state.monthlyNetCashflow,
      },
      modified: {
        retirementScore: Math.round(retirementScore),
        netWorth,
        monthlyNetCashflow,
      },
      improvements: {
        retirementScore: Math.round(retirementScore) - state.retirementScore,
        netWorth: netWorth - state.netWorth,
        monthlyNetCashflow: monthlyNetCashflow - state.monthlyNetCashflow,
      },
    };

    setScenarioResult(result);
    setSelectedScenario('custom');
  };

  const resetScenario = () => {
    setSelectedScenario(null);
    setScenarioResult(null);
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-GB', {
      style: 'currency',
      currency: 'GBP',
      minimumFractionDigits: 0,
    }).format(amount);
  };

  const formatChange = (value: number, isPercent = false) => {
    const sign = value >= 0 ? '+' : '';
    if (isPercent) {
      return `${sign}${value}`;
    }
    return `${sign}${formatCurrency(value)}`;
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
        {/* Header */}
        <LinearGradient
          colors={['#F59E0B', '#F97316']}
          style={styles.header}
        >
          <View style={styles.headerContent}>
            <View>
              <Text style={styles.headerTitle}>Readiness Testing</Text>
              <Text style={styles.headerSubtitle}>Test different UK scenarios</Text>
            </View>
            <TouchableOpacity 
              style={styles.settingsButton}
              onPress={() => router.push('/settings')}
            >
              <Settings size={24} color="#FFFFFF" />
            </TouchableOpacity>
          </View>
        </LinearGradient>

        {/* Predefined Scenarios */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>UK Retirement Scenarios</Text>
          <View style={styles.scenarioGrid}>
            {predefinedScenarios.map((scenario) => (
              <TouchableOpacity
                key={scenario.id}
                style={[
                  styles.scenarioCard,
                  selectedScenario === scenario.id && styles.selectedScenarioCard
                ]}
                onPress={() => runScenario(scenario)}
              >
                <View style={styles.scenarioIcon}>
                  {scenario.icon}
                </View>
                <Text style={styles.scenarioTitle}>{scenario.title}</Text>
                <Text style={styles.scenarioDescription}>{scenario.description}</Text>
                <View style={styles.scenarioButton}>
                  <Play size={16} color={scenario.color} />
                  <Text style={[styles.scenarioButtonText, { color: scenario.color }]}>
                    Run Test
                  </Text>
                </View>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        {/* Custom Scenario */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Custom UK Scenario</Text>
          <View style={styles.customScenarioCard}>
            <Text style={styles.customScenarioTitle}>Build Your Own UK Test</Text>
            
            <View style={styles.customInputRow}>
              <Text style={styles.customInputLabel}>Salary Increase (%)</Text>
              <TextInput
                style={styles.customInput}
                value={customValues.salaryIncrease.toString()}
                onChangeText={(value) => setCustomValues(prev => ({ 
                  ...prev, 
                  salaryIncrease: parseFloat(value) || 0 
                }))}
                keyboardType="numeric"
                placeholder="10"
              />
            </View>

            <View style={styles.customInputRow}>
              <Text style={styles.customInputLabel}>Pension Contribution Increase (%)</Text>
              <TextInput
                style={styles.customInput}
                value={customValues.pensionIncrease.toString()}
                onChangeText={(value) => setCustomValues(prev => ({ 
                  ...prev, 
                  pensionIncrease: parseFloat(value) || 0 
                }))}
                keyboardType="numeric"
                placeholder="10"
              />
            </View>

            <View style={styles.customInputRow}>
              <Text style={styles.customInputLabel}>Expense Reduction (%)</Text>
              <TextInput
                style={styles.customInput}
                value={customValues.expenseReduction.toString()}
                onChangeText={(value) => setCustomValues(prev => ({ 
                  ...prev, 
                  expenseReduction: parseFloat(value) || 0 
                }))}
                keyboardType="numeric"
                placeholder="10"
              />
            </View>

            <View style={styles.customInputRow}>
              <Text style={styles.customInputLabel}>Retirement Income Reduction (%)</Text>
              <TextInput
                style={styles.customInput}
                value={customValues.retirementIncomeReduction.toString()}
                onChangeText={(value) => setCustomValues(prev => ({ 
                  ...prev, 
                  retirementIncomeReduction: parseFloat(value) || 0 
                }))}
                keyboardType="numeric"
                placeholder="10"
              />
            </View>

            <TouchableOpacity style={styles.customRunButton} onPress={runCustomScenario}>
              <LinearGradient
                colors={['#8B5CF6', '#A855F7']}
                style={styles.customRunButtonGradient}
              >
                <Play size={16} color="#FFFFFF" />
                <Text style={styles.customRunButtonText}>Run Custom Test</Text>
              </LinearGradient>
            </TouchableOpacity>
          </View>
        </View>

        {/* Results */}
        {scenarioResult && (
          <View style={styles.section}>
            <View style={styles.resultsHeader}>
              <Text style={styles.sectionTitle}>Test Results</Text>
              <TouchableOpacity style={styles.resetButton} onPress={resetScenario}>
                <RotateCcw size={16} color="#6B7280" />
                <Text style={styles.resetButtonText}>Reset</Text>
              </TouchableOpacity>
            </View>

            <View style={styles.resultsCard}>
              <Text style={[styles.resultsTitle, { color: scenarioResult.color }]}>
                {scenarioResult.scenario}
              </Text>

              <View style={styles.resultRow}>
                <Text style={styles.resultLabel}>Retirement Score</Text>
                <View style={styles.resultValues}>
                  <Text style={styles.originalValue}>{scenarioResult.original.retirementScore}</Text>
                  <Text style={styles.arrow}>→</Text>
                  <Text style={[styles.newValue, { color: scenarioResult.color }]}>
                    {scenarioResult.modified.retirementScore}
                  </Text>
                  <Text style={[
                    styles.changeValue,
                    { color: scenarioResult.improvements.retirementScore >= 0 ? '#059669' : '#DC2626' }
                  ]}>
                    <Text>({formatChange(scenarioResult.improvements.retirementScore)})</Text>
                  </Text>
                </View>
              </View>

              <View style={styles.resultRow}>
                <Text style={styles.resultLabel}>Net Worth</Text>
                <View style={styles.resultValues}>
                  <Text style={styles.originalValue}>
                    {formatCurrency(scenarioResult.original.netWorth)}
                  </Text>
                  <Text style={styles.arrow}>→</Text>
                  <Text style={[styles.newValue, { color: scenarioResult.color }]}>
                    {formatCurrency(scenarioResult.modified.netWorth)}
                  </Text>
                  <Text style={[
                    styles.changeValue,
                    { color: scenarioResult.improvements.netWorth >= 0 ? '#059669' : '#DC2626' }
                  ]}>
                    <Text>({formatChange(scenarioResult.improvements.netWorth)})</Text>
                  </Text>
                </View>
              </View>

              <View style={styles.resultRow}>
                <Text style={styles.resultLabel}>Monthly Cashflow</Text>
                <View style={styles.resultValues}>
                  <Text style={styles.originalValue}>
                    {formatCurrency(scenarioResult.original.monthlyNetCashflow)}
                  </Text>
                  <Text style={styles.arrow}>→</Text>
                  <Text style={[styles.newValue, { color: scenarioResult.color }]}>
                    {formatCurrency(scenarioResult.modified.monthlyNetCashflow)}
                  </Text>
                  <Text style={[
                    styles.changeValue,
                    { color: scenarioResult.improvements.monthlyNetCashflow >= 0 ? '#059669' : '#DC2626' }
                  ]}>
                    <Text>({formatChange(scenarioResult.improvements.monthlyNetCashflow)})</Text>
                  </Text>
                </View>
              </View>
            </View>
          </View>
        )}

        <View style={{ height: 32 }} />
      </ScrollView>
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
    paddingBottom: 30,
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
  section: {
    paddingHorizontal: 20,
    marginTop: 24,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: '600',
    color: '#111827',
    marginBottom: 16,
  },
  scenarioGrid: {
    gap: 12,
  },
  scenarioCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
    borderWidth: 2,
    borderColor: 'transparent',
  },
  selectedScenarioCard: {
    borderColor: '#F59E0B',
  },
  scenarioIcon: {
    marginBottom: 12,
  },
  scenarioTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#111827',
    marginBottom: 8,
  },
  scenarioDescription: {
    fontSize: 14,
    color: '#6B7280',
    marginBottom: 16,
    lineHeight: 20,
  },
  scenarioButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  scenarioButtonText: {
    fontSize: 14,
    fontWeight: '600',
  },
  customScenarioCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
  },
  customScenarioTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#111827',
    marginBottom: 20,
  },
  customInputRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  customInputLabel: {
    fontSize: 14,
    color: '#374151',
    flex: 1,
  },
  customInput: {
    borderWidth: 1,
    borderColor: '#D1D5DB',
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 8,
    fontSize: 14,
    width: 80,
    textAlign: 'center',
  },
  customRunButton: {
    marginTop: 8,
  },
  customRunButtonGradient: {
    borderRadius: 12,
    paddingVertical: 12,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
  },
  customRunButtonText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#FFFFFF',
  },
  resultsHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  resetButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    paddingHorizontal: 12,
    paddingVertical: 6,
    backgroundColor: '#F3F4F6',
    borderRadius: 8,
  },
  resetButtonText: {
    fontSize: 12,
    color: '#6B7280',
  },
  resultsCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
  },
  resultsTitle: {
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 20,
  },
  resultRow: {
    marginBottom: 16,
  },
  resultLabel: {
    fontSize: 14,
    color: '#6B7280',
    marginBottom: 8,
  },
  resultValues: {
    flexDirection: 'row',
    alignItems: 'center',
    flexWrap: 'wrap',
    gap: 8,
  },
  originalValue: {
    fontSize: 14,
    color: '#9CA3AF',
  },
  arrow: {
    fontSize: 14,
    color: '#9CA3AF',
  },
  newValue: {
    fontSize: 16,
    fontWeight: '600',
  },
  changeValue: {
    fontSize: 12,
    fontWeight: '500',
  },
});