import React from 'react';
import { View, Text, StyleSheet, Dimensions } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { TrendingUp, TrendingDown, PiggyBank } from 'lucide-react-native';

interface TransactionBarChartProps {
  income: number;
  expenses: number;
  title?: string;
}

const { width: screenWidth } = Dimensions.get('window');
const chartWidth = screenWidth - 80; // Account for padding

export function TransactionBarChart({ income, expenses, title }: TransactionBarChartProps) {
  const savings = income - expenses;
  const maxValue = Math.max(income, expenses, Math.abs(savings));
  
  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-GB', {
      style: 'currency',
      currency: 'GBP',
      minimumFractionDigits: 0,
    }).format(amount);
  };

  const getBarWidth = (value: number) => {
    if (maxValue === 0) return 0;
    return (Math.abs(value) / maxValue) * (chartWidth - 120); // Reserve space for labels
  };

  const getSavingsColor = () => {
    if (savings > 0) return ['#059669', '#10B981']; // Green for positive savings
    if (savings === 0) return ['#6B7280', '#9CA3AF']; // Gray for break-even
    return ['#DC2626', '#EF4444']; // Red for negative savings
  };

  const getSavingsIcon = () => {
    if (savings > 0) return <PiggyBank size={20} color="#FFFFFF" />;
    if (savings === 0) return <PiggyBank size={20} color="#FFFFFF" />;
    return <TrendingDown size={20} color="#FFFFFF" />;
  };

  const getSavingsLabel = () => {
    if (savings > 0) return 'Savings';
    if (savings === 0) return 'Break Even';
    return 'Deficit';
  };

  return (
    <View style={styles.container}>
      {title && <Text style={styles.title}>{title}</Text>}
      
      <View style={styles.chartContainer}>
        {/* Income Bar */}
        <View style={styles.barRow}>
          <View style={styles.labelContainer}>
            <View style={styles.iconContainer}>
              <TrendingUp size={20} color="#FFFFFF" />
            </View>
            <View style={styles.labelTextContainer}>
              <Text style={styles.barLabel}>Income</Text>
              <Text style={styles.barValue}>{formatCurrency(income)}</Text>
            </View>
          </View>
          <View style={styles.barContainer}>
            <LinearGradient
              colors={['#059669', '#10B981']}
              style={[styles.bar, { width: getBarWidth(income) }]}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 0 }}
            />
          </View>
        </View>

        {/* Expenses Bar */}
        <View style={styles.barRow}>
          <View style={styles.labelContainer}>
            <View style={[styles.iconContainer, { backgroundColor: '#DC2626' }]}>
              <TrendingDown size={20} color="#FFFFFF" />
            </View>
            <View style={styles.labelTextContainer}>
              <Text style={styles.barLabel}>Expenses</Text>
              <Text style={styles.barValue}>{formatCurrency(expenses)}</Text>
            </View>
          </View>
          <View style={styles.barContainer}>
            <LinearGradient
              colors={['#DC2626', '#EF4444']}
              style={[styles.bar, { width: getBarWidth(expenses) }]}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 0 }}
            />
          </View>
        </View>

        {/* Savings/Deficit Bar */}
        <View style={styles.barRow}>
          <View style={styles.labelContainer}>
            <View style={[styles.iconContainer, { backgroundColor: getSavingsColor()[0] }]}>
              {getSavingsIcon()}
            </View>
            <View style={styles.labelTextContainer}>
              <Text style={styles.barLabel}>{getSavingsLabel()}</Text>
              <Text style={[
                styles.barValue,
                { color: savings >= 0 ? '#059669' : '#DC2626' }
              ]}>
                {savings >= 0 ? '+' : ''}{formatCurrency(savings)}
              </Text>
            </View>
          </View>
          <View style={styles.barContainer}>
            <LinearGradient
              colors={getSavingsColor()}
              style={[styles.bar, { width: getBarWidth(savings) }]}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 0 }}
            />
          </View>
        </View>
      </View>

      {/* Summary Insight */}
      <View style={[
        styles.insightContainer,
        { backgroundColor: savings >= 0 ? '#F0FDF4' : '#FEF2F2' }
      ]}>
        <View style={styles.insightHeader}>
          <View style={[
            styles.insightIcon,
            { backgroundColor: savings >= 0 ? '#059669' : '#DC2626' }
          ]}>
            {savings >= 0 ? 
              <TrendingUp size={16} color="#FFFFFF" /> : 
              <TrendingDown size={16} color="#FFFFFF" />
            }
          </View>
          <Text style={[
            styles.insightTitle,
            { color: savings >= 0 ? '#059669' : '#DC2626' }
          ]}>
            {savings >= 0 ? 'Positive Cashflow' : 'Negative Cashflow'}
          </Text>
        </View>
        <Text style={styles.insightText}>
          {savings >= 0 
            ? `You're saving ${formatCurrency(savings)} per month. Consider investing this surplus to grow your wealth.`
            : `You're spending ${formatCurrency(Math.abs(savings))} more than you earn. Review your expenses to improve your financial position.`
          }
        </Text>
      </View>

      {/* Financial Health Metrics */}
      <View style={styles.metricsContainer}>
        <View style={styles.metricCard}>
          <Text style={styles.metricLabel}>Savings Rate</Text>
          <Text style={[
            styles.metricValue,
            { color: savings >= 0 ? '#059669' : '#DC2626' }
          ]}>
            {income > 0 ? `${((savings / income) * 100).toFixed(1)}%` : '0%'}
          </Text>
        </View>
        <View style={styles.metricCard}>
          <Text style={styles.metricLabel}>Expense Ratio</Text>
          <Text style={styles.metricValue}>
            {income > 0 ? `${((expenses / income) * 100).toFixed(1)}%` : '0%'}
          </Text>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
    marginBottom: 20,
  },
  title: {
    fontSize: 18,
    fontWeight: '600',
    color: '#111827',
    marginBottom: 20,
    textAlign: 'center',
  },
  chartContainer: {
    marginBottom: 20,
  },
  barRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
    gap: 12,
  },
  labelContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    width: 120,
    gap: 8,
  },
  iconContainer: {
    width: 32,
    height: 32,
    borderRadius: 8,
    backgroundColor: '#059669',
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  labelTextContainer: {
    flex: 1,
  },
  barLabel: {
    fontSize: 12,
    fontWeight: '600',
    color: '#6B7280',
    marginBottom: 2,
  },
  barValue: {
    fontSize: 14,
    fontWeight: '700',
    color: '#111827',
  },
  barContainer: {
    flex: 1,
    height: 32,
    backgroundColor: '#F3F4F6',
    borderRadius: 16,
    overflow: 'hidden',
    justifyContent: 'center',
  },
  bar: {
    height: '100%',
    borderRadius: 16,
    minWidth: 4, // Ensure very small values are still visible
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  insightContainer: {
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: '#E5E7EB',
  },
  insightHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
    gap: 8,
  },
  insightIcon: {
    width: 24,
    height: 24,
    borderRadius: 6,
    alignItems: 'center',
    justifyContent: 'center',
  },
  insightTitle: {
    fontSize: 14,
    fontWeight: '600',
  },
  insightText: {
    fontSize: 14,
    color: '#6B7280',
    lineHeight: 20,
  },
  metricsContainer: {
    flexDirection: 'row',
    gap: 12,
  },
  metricCard: {
    flex: 1,
    backgroundColor: '#F8FAFC',
    borderRadius: 12,
    padding: 16,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#E2E8F0',
  },
  metricLabel: {
    fontSize: 12,
    color: '#6B7280',
    marginBottom: 4,
    textAlign: 'center',
  },
  metricValue: {
    fontSize: 18,
    fontWeight: '700',
    color: '#111827',
  },
});