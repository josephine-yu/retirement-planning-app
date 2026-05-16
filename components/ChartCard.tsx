import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

interface ChartCardProps {
  title: string;
  data: {
    income: number;
    expenses: number;
  };
}

export function ChartCard({ title, data }: ChartCardProps) {
  const total = data.income + data.expenses;
  const incomePercentage = total > 0 ? (data.income / total) * 100 : 50;
  const expensesPercentage = total > 0 ? (data.expenses / total) * 100 : 50;

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-GB', {
      style: 'currency',
      currency: 'GBP',
      minimumFractionDigits: 0,
    }).format(amount);
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>{title}</Text>
      
      {/* Bar Chart */}
      <View style={styles.chartContainer}>
        <View style={styles.barContainer}>
          <View style={[styles.bar, styles.incomeBar, { width: `${incomePercentage}%` }]} />
          <View style={[styles.bar, styles.expensesBar, { width: `${expensesPercentage}%` }]} />
        </View>
      </View>

      {/* Legend */}
      <View style={styles.legend}>
        <View style={styles.legendItem}>
          <View style={[styles.legendColor, { backgroundColor: '#059669' }]} />
          <Text style={styles.legendText}>Income: {formatCurrency(data.income)}</Text>
        </View>
        <View style={styles.legendItem}>
          <View style={[styles.legendColor, { backgroundColor: '#DC2626' }]} />
          <Text style={styles.legendText}>Expenses: {formatCurrency(data.expenses)}</Text>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  title: {
    fontSize: 16,
    fontWeight: '600',
    color: '#111827',
    marginBottom: 16,
  },
  chartContainer: {
    marginBottom: 16,
  },
  barContainer: {
    height: 20,
    backgroundColor: '#F3F4F6',
    borderRadius: 10,
    overflow: 'hidden',
    flexDirection: 'row',
  },
  bar: {
    height: '100%',
  },
  incomeBar: {
    backgroundColor: '#059669',
  },
  expensesBar: {
    backgroundColor: '#DC2626',
  },
  legend: {
    gap: 8,
  },
  legendItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  legendColor: {
    width: 12,
    height: 12,
    borderRadius: 6,
  },
  legendText: {
    fontSize: 14,
    color: '#6B7280',
  },
});