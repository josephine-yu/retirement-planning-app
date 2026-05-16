import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import Svg, { Path } from 'react-native-svg';

interface PieChartData {
  name: string;
  value: number;
  color: string;
}

interface BudgetPieChartProps {
  data: PieChartData[];
  title?: string;
}

export function BudgetPieChart({ data, title }: BudgetPieChartProps) {
  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-GB', {
      style: 'currency',
      currency: 'GBP',
      minimumFractionDigits: 0,
    }).format(amount);
  };

  const total = data.reduce((sum, item) => sum + item.value, 0);
  
  // Calculate percentages and create segments
  const segments = data.map((item, index) => {
    const percentage = total > 0 ? (item.value / total) * 100 : 0;
    return {
      ...item,
      percentage,
      startAngle: data.slice(0, index).reduce((sum, prev) => sum + (prev.value / total) * 360, 0),
      endAngle: data.slice(0, index + 1).reduce((sum, prev) => sum + (prev.value / total) * 360, 0),
    };
  });

  // Create a visual pie chart using circular segments
  const createPieSlice = (segment: any, index: number) => {
    const radius = 60;
    const centerX = 80;
    const centerY = 80;
    
    const startAngle = (segment.startAngle - 90) * (Math.PI / 180);
    const endAngle = (segment.endAngle - 90) * (Math.PI / 180);
    
    const x1 = centerX + radius * Math.cos(startAngle);
    const y1 = centerY + radius * Math.sin(startAngle);
    const x2 = centerX + radius * Math.cos(endAngle);
    const y2 = centerY + radius * Math.sin(endAngle);
    
    const largeArcFlag = segment.percentage > 50 ? 1 : 0;
    
    const pathData = [
      `M ${centerX} ${centerY}`,
      `L ${x1} ${y1}`,
      `A ${radius} ${radius} 0 ${largeArcFlag} 1 ${x2} ${y2}`,
      'Z'
    ].join(' ');

        return (
      <Path
        key={index}
        d={pathData}
        fill={segment.color}
        stroke="#FFFFFF"
        strokeWidth={2}
      />
    );
};

  return (
    <View style={styles.container}>
      {title && <Text style={styles.title}>{title}</Text>}
      
      {/* Pie Chart */}
      <View style={styles.chartContainer}>
        <View style={styles.pieChartWrapper}>
          <Svg width={160} height={160} viewBox="0 0 160 160" style={styles.pieChart}>
            {segments.map((segment, index) => createPieSlice(segment, index))}
          </Svg>
          
          <View style={styles.centerInfo}>
            <Text style={styles.totalLabel}>Total</Text>
            <Text style={styles.totalAmount}>{formatCurrency(total)}</Text>
          </View>
        </View>
      </View>

      {/* Legend */}
      <View style={styles.legend}>
        {segments.map((segment) => (
          <View key={segment.name} style={styles.legendItem}>
            <View style={styles.legendRow}>
              <View style={[styles.colorIndicator, { backgroundColor: segment.color }]} />
              <Text style={styles.legendLabel}>{segment.name}</Text>
            </View>
            <View style={styles.legendValues}>
              <Text style={styles.legendAmount}>{formatCurrency(segment.value)}</Text>
              <Text style={styles.legendPercentage}>{segment.percentage.toFixed(1)}%</Text>
            </View>
          </View>
        ))}
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
  },
  title: {
    fontSize: 18,
    fontWeight: '600',
    color: '#111827',
    marginBottom: 16,
    textAlign: 'center',
  },
  chartContainer: {
    alignItems: 'center',
    marginBottom: 24,
  },
  pieChartWrapper: {
    position: 'relative',
    alignItems: 'center',
    justifyContent: 'center',
  },
  pieChart: {
    width: 160,
    height: 160,
  },
  centerInfo: {
    position: 'absolute',
    alignItems: 'center',
    justifyContent: 'center',
    top: 0,
    bottom: 0,
    left: 0,
    right: 0,
  },
  totalLabel: {
    fontSize: 14,
    color: '#6B7280',
    marginBottom: 4,
  },
  totalAmount: {
    fontSize: 18,
    fontWeight: '700',
    color: '#111827',
  },
  legend: {
    gap: 12,
  },
  legendItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  legendRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    flex: 1,
  },
  colorIndicator: {
    width: 12,
    height: 12,
    borderRadius: 6,
  },
  legendLabel: {
    fontSize: 14,
    color: '#374151',
    flex: 1,
  },
  legendValues: {
    alignItems: 'flex-end',
  },
  legendAmount: {
    fontSize: 14,
    fontWeight: '600',
    color: '#111827',
  },
  legendPercentage: {
    fontSize: 12,
    color: '#6B7280',
  },
});