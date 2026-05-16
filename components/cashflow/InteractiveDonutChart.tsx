import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Dimensions } from 'react-native';
import Svg, { Path, Circle, G } from 'react-native-svg';
import { TrendingUp, TrendingDown, Eye, EyeOff } from 'lucide-react-native';

interface DonutChartData {
  id: string;
  name: string;
  value: number;
  color: string;
  subcategories?: DonutChartData[];
}

interface InteractiveDonutChartProps {
  incomeData: DonutChartData[];
  expenseData: DonutChartData[];
  title?: string;
}

interface HoverInfo {
  name: string;
  value: number;
  percentage: number;
  color: string;
}

const { width: screenWidth } = Dimensions.get('window');
const chartSize = Math.min(screenWidth - 80, 300);
const centerX = chartSize / 2;
const centerY = chartSize / 2;
const outerRadius = chartSize * 0.4;
const innerRadius = chartSize * 0.25;

export function InteractiveDonutChart({ incomeData, expenseData, title }: InteractiveDonutChartProps) {
  const [viewMode, setViewMode] = useState<'income' | 'expenses'>('expenses');
  const [showSubcategories, setShowSubcategories] = useState(false);
  const [hoveredSegment, setHoveredSegment] = useState<HoverInfo | null>(null);

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-GB', {
      style: 'currency',
      currency: 'GBP',
      minimumFractionDigits: 0,
    }).format(amount);
  };

  const getCurrentData = () => {
    const rawData = viewMode === 'income' ? incomeData : expenseData;
    
    if (showSubcategories) {
      // Flatten subcategories
      const flatData: DonutChartData[] = [];
      rawData.forEach(category => {
        if (category.subcategories && category.subcategories.length > 0) {
          flatData.push(...category.subcategories);
        } else {
          flatData.push(category);
        }
      });
      return flatData;
    }
    
    return rawData;
  };

  const currentData = getCurrentData();
  const total = currentData.reduce((sum, item) => sum + item.value, 0);

  // Create segments with angles
  const segments = currentData.map((item, index) => {
    const percentage = total > 0 ? (item.value / total) * 100 : 0;
    const startAngle = currentData.slice(0, index).reduce((sum, prev) => sum + (prev.value / total) * 360, 0);
    const endAngle = startAngle + (item.value / total) * 360;
    
    return {
      ...item,
      percentage,
      startAngle,
      endAngle,
    };
  });

  const createDonutSlice = (segment: any, index: number) => {
    const startAngle = (segment.startAngle - 90) * (Math.PI / 180);
    const endAngle = (segment.endAngle - 90) * (Math.PI / 180);
    
    const x1 = centerX + outerRadius * Math.cos(startAngle);
    const y1 = centerY + outerRadius * Math.sin(startAngle);
    const x2 = centerX + outerRadius * Math.cos(endAngle);
    const y2 = centerY + outerRadius * Math.sin(endAngle);
    
    const x3 = centerX + innerRadius * Math.cos(endAngle);
    const y3 = centerY + innerRadius * Math.sin(endAngle);
    const x4 = centerX + innerRadius * Math.cos(startAngle);
    const y4 = centerY + innerRadius * Math.sin(startAngle);
    
    const largeArcFlag = segment.percentage > 50 ? 1 : 0;
    
    const pathData = [
      `M ${x1} ${y1}`,
      `A ${outerRadius} ${outerRadius} 0 ${largeArcFlag} 1 ${x2} ${y2}`,
      `L ${x3} ${y3}`,
      `A ${innerRadius} ${innerRadius} 0 ${largeArcFlag} 0 ${x4} ${y4}`,
      'Z'
    ].join(' ');

    return (
      <Path
        key={index}
        d={pathData}
        fill={segment.color}
        stroke="#FFFFFF"
        strokeWidth={2}
        onPress={() => {
          setHoveredSegment({
            name: segment.name,
            value: segment.value,
            percentage: segment.percentage,
            color: segment.color,
          });
        }}
      />
    );
  };

  const toggleViewMode = () => {
    setViewMode(prev => prev === 'income' ? 'expenses' : 'income');
    setHoveredSegment(null);
  };

  const toggleSubcategories = () => {
    setShowSubcategories(prev => !prev);
    setHoveredSegment(null);
  };

  return (
    <View style={styles.container}>
      {title && <Text style={styles.title}>{title}</Text>}
      
      {/* Controls */}
      <View style={styles.controls}>
        <TouchableOpacity
          style={[styles.controlButton, viewMode === 'income' && styles.activeControlButton]}
          onPress={toggleViewMode}
        >
          <TrendingUp size={16} color={viewMode === 'income' ? '#FFFFFF' : '#059669'} />
          <Text style={[
            styles.controlButtonText,
            viewMode === 'income' && styles.activeControlButtonText
          ]}>
            Income
          </Text>
        </TouchableOpacity>
        
        <TouchableOpacity
          style={[styles.controlButton, viewMode === 'expenses' && styles.activeControlButton]}
          onPress={toggleViewMode}
        >
          <TrendingDown size={16} color={viewMode === 'expenses' ? '#FFFFFF' : '#DC2626'} />
          <Text style={[
            styles.controlButtonText,
            viewMode === 'expenses' && styles.activeControlButtonText
          ]}>
            Expenses
          </Text>
        </TouchableOpacity>
      </View>

      <TouchableOpacity
        style={styles.subcategoryToggle}
        onPress={toggleSubcategories}
      >
        {showSubcategories ? <EyeOff size={16} color="#6B7280" /> : <Eye size={16} color="#6B7280" />}
        <Text style={styles.subcategoryToggleText}>
          {showSubcategories ? 'Show Categories' : 'Show Subcategories'}
        </Text>
      </TouchableOpacity>

      {/* Donut Chart */}
      <View style={styles.chartContainer}>
        <Svg width={chartSize} height={chartSize} style={styles.chart}>
          <G>
            {segments.map((segment, index) => createDonutSlice(segment, index))}
          </G>
        </Svg>
        
        {/* Center Info */}
        <View style={styles.centerInfo}>
          <Text style={styles.centerLabel}>Total {viewMode === 'income' ? 'Income' : 'Expenses'}</Text>
          <Text style={[
            styles.centerAmount,
            { color: viewMode === 'income' ? '#059669' : '#DC2626' }
          ]}>
            {formatCurrency(total)}
          </Text>
          {hoveredSegment && (
            <View style={styles.hoverInfo}>
              <View style={[styles.hoverColorDot, { backgroundColor: hoveredSegment.color }]} />
              <Text style={styles.hoverName}>{hoveredSegment.name}</Text>
              <Text style={styles.hoverPercentage}>{hoveredSegment.percentage.toFixed(1)}%</Text>
            </View>
          )}
        </View>
      </View>

      {/* Legend */}
      <View style={styles.legend}>
        {segments.map((segment) => (
          <TouchableOpacity
            key={segment.id}
            style={[
              styles.legendItem,
              hoveredSegment?.name === segment.name && styles.activeLegendItem
            ]}
            onPress={() => {
              setHoveredSegment({
                name: segment.name,
                value: segment.value,
                percentage: segment.percentage,
                color: segment.color,
              });
            }}
          >
            <View style={styles.legendRow}>
              <View style={[styles.colorIndicator, { backgroundColor: segment.color }]} />
              <Text style={styles.legendLabel}>{segment.name}</Text>
            </View>
            <View style={styles.legendValues}>
              <Text style={styles.legendAmount}>{formatCurrency(segment.value)}</Text>
              <Text style={styles.legendPercentage}>{segment.percentage.toFixed(1)}%</Text>
            </View>
          </TouchableOpacity>
        ))}
      </View>

      {/* Clear Hover */}
      {hoveredSegment && (
        <TouchableOpacity
          style={styles.clearHoverButton}
          onPress={() => setHoveredSegment(null)}
        >
          <Text style={styles.clearHoverText}>Clear Selection</Text>
        </TouchableOpacity>
      )}
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
    marginBottom: 16,
    textAlign: 'center',
  },
  controls: {
    flexDirection: 'row',
    gap: 8,
    marginBottom: 12,
  },
  controlButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#E5E7EB',
    gap: 6,
  },
  activeControlButton: {
    backgroundColor: '#7C3AED',
    borderColor: '#7C3AED',
  },
  controlButtonText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#6B7280',
  },
  activeControlButtonText: {
    color: '#FFFFFF',
  },
  subcategoryToggle: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 8,
    gap: 6,
    marginBottom: 16,
  },
  subcategoryToggleText: {
    fontSize: 14,
    color: '#6B7280',
  },
  chartContainer: {
    alignItems: 'center',
    marginBottom: 24,
    position: 'relative',
  },
  chart: {
    width: chartSize,
    height: chartSize,
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
  centerLabel: {
    fontSize: 14,
    color: '#6B7280',
    marginBottom: 4,
  },
  centerAmount: {
    fontSize: 20,
    fontWeight: '700',
    marginBottom: 8,
  },
  hoverInfo: {
    alignItems: 'center',
    backgroundColor: 'rgba(255, 255, 255, 0.95)',
    borderRadius: 8,
    padding: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  hoverColorDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    marginBottom: 4,
  },
  hoverName: {
    fontSize: 12,
    fontWeight: '600',
    color: '#111827',
    marginBottom: 2,
  },
  hoverPercentage: {
    fontSize: 14,
    fontWeight: '700',
    color: '#7C3AED',
  },
  legend: {
    gap: 8,
  },
  legendItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 8,
    backgroundColor: 'transparent',
  },
  activeLegendItem: {
    backgroundColor: '#F8FAFC',
    borderWidth: 1,
    borderColor: '#E2E8F0',
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
    color: '#7C3AED',
    fontWeight: '600',
  },
  clearHoverButton: {
    alignSelf: 'center',
    paddingVertical: 8,
    paddingHorizontal: 16,
    backgroundColor: '#F3F4F6',
    borderRadius: 8,
    marginTop: 8,
  },
  clearHoverText: {
    fontSize: 12,
    color: '#6B7280',
  },
});