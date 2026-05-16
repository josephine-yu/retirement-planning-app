import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Modal, SafeAreaView, ScrollView } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Target, TrendingUp, TriangleAlert as AlertTriangle, CircleCheck as CheckCircle, Info, X, Calculator, PiggyBank, Calendar, PoundSterling } from 'lucide-react-native';
import Svg, { Defs, LinearGradient as SvgLinearGradient, Stop, Rect, Polygon } from 'react-native-svg';
import { router } from 'expo-router';

interface InteractiveRetirementScoreProps {
  score: number;
  projectedIncome: number;
  currentExpenses: number;
  yearsToRetirement: number;
}

export function InteractiveRetirementScore({ 
  score, 
  projectedIncome, 
  currentExpenses, 
  yearsToRetirement 
}: InteractiveRetirementScoreProps) {
  const [showInfoModal, setShowInfoModal] = useState(false);

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-GB', {
      style: 'currency',
      currency: 'GBP',
      minimumFractionDigits: 0,
    }).format(amount);
  };

  const getScoreColor = (score: number) => {
    if (score >= 80) return '#059669'; // Green
    if (score >= 60) return '#F59E0B'; // Amber
    if (score >= 40) return '#F97316'; // Orange
    return '#DC2626'; // Red
  };

  const getScoreGradient = (score: number) => {
    if (score >= 80) return ['#059669', '#10B981']; // Green
    if (score >= 60) return ['#F59E0B', '#FBBF24']; // Amber
    if (score >= 40) return ['#F97316', '#FB923C']; // Orange
    return ['#DC2626', '#EF4444']; // Red
  };

  const getScoreLabel = (score: number) => {
    if (score >= 80) return 'Excellent';
    if (score >= 60) return 'Good';
    if (score >= 40) return 'Fair';
    return 'Needs Work';
  };

  const getScoreIcon = (score: number) => {
    if (score >= 80) return <CheckCircle size={20} color="#FFFFFF" />;
    if (score >= 60) return <TrendingUp size={20} color="#FFFFFF" />;
    if (score >= 40) return <Target size={20} color="#FFFFFF" />;
    return <AlertTriangle size={20} color="#FFFFFF" />;
  };

  const getScoreAdvice = (score: number) => {
    if (score >= 80) {
      return "You're on track for a comfortable retirement! Consider maximizing your ISA allowance and reviewing your investment strategy for potential optimizations.";
    }
    if (score >= 60) {
      return "Good progress towards retirement! Consider increasing pension contributions or reducing planned retirement expenses to improve your readiness score.";
    }
    if (score >= 40) {
      return "You're making progress but need to boost your retirement savings. Consider increasing contributions and reviewing your investment strategy.";
    }
    return "Immediate action needed! Significantly increase pension contributions and consider seeking professional financial advice to improve your retirement readiness.";
  };

  const handleActionPress = () => {
    if (score >= 60) {
      // For good scores, go to readiness testing to optimize
      router.push('/readiness');
    } else {
      // For lower scores, go to settings to improve planning
      router.push('/settings');
    }
  };

  // Calculate arrow position (score is 0-100, scale width is 280px)
  const scaleWidth = 280;
  const arrowPosition = Math.max(10, Math.min(scaleWidth - 10, (score / 100) * scaleWidth));

  // Calculate replacement ratio
  const replacementRatio = currentExpenses > 0 ? (projectedIncome / currentExpenses) * 100 : 0;

  return (
    <View style={styles.container}>
      <View style={styles.scoreCard}>
        {/* Header */}
        <View style={styles.header}>
          <Text style={styles.title}>Retirement Readiness</Text>
          <TouchableOpacity
            style={styles.infoButton}
            onPress={() => setShowInfoModal(true)}
          >
            <Info size={20} color="#6B7280" />
          </TouchableOpacity>
        </View>

        {/* Score Scale */}
        <View style={styles.scoreScaleContainer}>
          <Text style={styles.scoreTitle}>Your Readiness Score</Text>
          
          {/* Compact Score Display - moved here between title and scale */}
          <View style={styles.compactScoreDisplay}>
            <Text style={[styles.compactScoreNumber, { color: getScoreColor(score) }]}>
              {score}
            </Text>
            <Text style={styles.compactScoreLabel}>
              {getScoreLabel(score)}
            </Text>
          </View>
          
          {/* Scale with Arrow */}
          <View style={styles.scaleWrapper}>
            <Svg width={scaleWidth} height={60} style={styles.scaleSvg}>
              <Defs>
                <SvgLinearGradient id="scaleGradient" x1="0%" y1="0%" x2="100%" y2="0%">
                  <Stop offset="0%" stopColor="#DC2626" />
                  <Stop offset="40%" stopColor="#F97316" />
                  <Stop offset="60%" stopColor="#F59E0B" />
                  <Stop offset="80%" stopColor="#059669" />
                </SvgLinearGradient>
              </Defs>
              
              {/* Scale Bar */}
              <Rect
                x={0}
                y={20}
                width={scaleWidth}
                height={12}
                fill="url(#scaleGradient)"
                rx={6}
              />
              
              {/* Arrow pointing to score */}
              <Polygon
                points={`${arrowPosition - 6},15 ${arrowPosition + 6},15 ${arrowPosition},8`}
                fill={getScoreColor(score)}
                stroke="#FFFFFF"
                strokeWidth={2}
              />
              
              {/* Arrow pointing down to scale */}
              <Polygon
                points={`${arrowPosition - 6},37 ${arrowPosition + 6},37 ${arrowPosition},44`}
                fill={getScoreColor(score)}
                stroke="#FFFFFF"
                strokeWidth={2}
              />
            </Svg>
            
            {/* Scale Labels */}
            <View style={styles.scaleLabels}>
              <Text style={styles.scaleLabel}>0</Text>
              <Text style={styles.scaleLabel}>25</Text>
              <Text style={styles.scaleLabel}>50</Text>
              <Text style={styles.scaleLabel}>75</Text>
              <Text style={styles.scaleLabel}>100</Text>
            </View>
          </View>
        </View>

        {/* Action Button with Navigation */}
        <TouchableOpacity style={styles.actionButton} onPress={handleActionPress}>
          <LinearGradient
            colors={score >= 60 ? ['#059669', '#10B981'] : ['#DC2626', '#EF4444']}
            style={styles.actionGradient}
          >
            <PiggyBank size={18} color="#FFFFFF" />
            <Text style={styles.actionText}>
              {score >= 60 ? 'Optimize Strategy' : 'Improve Readiness'}
            </Text>
          </LinearGradient>
        </TouchableOpacity>
      </View>

      {/* Information Modal */}
      <Modal
        visible={showInfoModal}
        animationType="slide"
        presentationStyle="pageSheet"
        onRequestClose={() => setShowInfoModal(false)}
      >
        <SafeAreaView style={styles.modalContainer}>
          <View style={styles.modalHeader}>
            <Text style={styles.modalTitle}>How Your Score is Calculated</Text>
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
                <Calculator size={24} color="#3B82F6" />
                <Text style={styles.calculationTitle}>Retirement Readiness Score</Text>
              </View>
              
              <Text style={styles.calculationDescription}>
                Your retirement readiness score is calculated based on your projected retirement income 
                compared to your target retirement expenses. Here's how it works:
              </Text>

              <View style={styles.formulaCard}>
                <Text style={styles.formulaTitle}>Calculation Formula</Text>
                <Text style={styles.formulaText}>
                  Score = (Projected Monthly Income ÷ Target Monthly Income) × 100
                </Text>
              </View>

              <View style={styles.componentSection}>
                <Text style={styles.componentTitle}>Income Components</Text>
                
                <View style={styles.componentItem}>
                  <View style={styles.componentIcon}>
                    <PiggyBank size={16} color="#059669" />
                  </View>
                  <View style={styles.componentContent}>
                    <Text style={styles.componentLabel}>Pension Pot Withdrawal</Text>
                    <Text style={styles.componentDescription}>
                      4% annual withdrawal rule from your projected pension pot
                    </Text>
                  </View>
                </View>

                <View style={styles.componentItem}>
                  <View style={styles.componentIcon}>
                    <PoundSterling size={16} color="#3B82F6" />
                  </View>
                  <View style={styles.componentContent}>
                    <Text style={styles.componentLabel}>UK State Pension</Text>
                    <Text style={styles.componentDescription}>
                      Estimated based on your working years and retirement age
                    </Text>
                  </View>
                </View>
              </View>

              <View style={styles.componentSection}>
                <Text style={styles.componentTitle}>Pension Pot Growth</Text>
                
                <View style={styles.componentItem}>
                  <View style={styles.componentIcon}>
                    <TrendingUp size={16} color="#7C3AED" />
                  </View>
                  <View style={styles.componentContent}>
                    <Text style={styles.componentLabel}>Your Contributions</Text>
                    <Text style={styles.componentDescription}>
                      Monthly pension contributions you make
                    </Text>
                  </View>
                </View>

                <View style={styles.componentItem}>
                  <View style={styles.componentIcon}>
                    <Target size={16} color="#F59E0B" />
                  </View>
                  <View style={styles.componentContent}>
                    <Text style={styles.componentLabel}>Employer Matching</Text>
                    <Text style={styles.componentDescription}>
                      Employer contributions to your pension
                    </Text>
                  </View>
                </View>

                <View style={styles.componentItem}>
                  <View style={styles.componentIcon}>
                    <CheckCircle size={16} color="#059669" />
                  </View>
                  <View style={styles.componentContent}>
                    <Text style={styles.componentLabel}>Tax Relief</Text>
                    <Text style={styles.componentDescription}>
                      25% basic rate tax relief on your contributions
                    </Text>
                  </View>
                </View>
              </View>

              <View style={styles.targetSection}>
                <Text style={styles.targetTitle}>Target Income Calculation</Text>
                <Text style={styles.targetDescription}>
                  Your target retirement income is set at 80% of your current monthly expenses, 
                  which is the standard recommendation for maintaining your lifestyle in retirement.
                </Text>
                
                <View style={styles.targetBreakdown}>
                  <View style={styles.targetRow}>
                    <Text style={styles.targetLabel}>Current Monthly Expenses:</Text>
                    <Text style={styles.targetValue}>{formatCurrency(currentExpenses)}</Text>
                  </View>
                  <View style={styles.targetRow}>
                    <Text style={styles.targetLabel}>Target (80%):</Text>
                    <Text style={styles.targetValue}>{formatCurrency(currentExpenses * 0.8)}</Text>
                  </View>
                  <View style={styles.targetRow}>
                    <Text style={styles.targetLabel}>Your Projection:</Text>
                    <Text style={[
                      styles.targetValue,
                      { color: projectedIncome >= currentExpenses * 0.8 ? '#059669' : '#DC2626' }
                    ]}>
                      {formatCurrency(projectedIncome)}
                    </Text>
                  </View>
                </View>
              </View>

              <View style={styles.scaleSection}>
                <Text style={styles.scaleTitle}>Score Interpretation</Text>
                
                <View style={styles.scaleItem}>
                  <View style={[styles.scaleIndicator, { backgroundColor: '#059669' }]} />
                  <View style={styles.scaleContent}>
                    <Text style={styles.scaleLabel}>80-100: Excellent</Text>
                    <Text style={styles.scaleDescription}>
                      Well prepared for a comfortable retirement
                    </Text>
                  </View>
                </View>

                <View style={styles.scaleItem}>
                  <View style={[styles.scaleIndicator, { backgroundColor: '#F59E0B' }]} />
                  <View style={styles.scaleContent}>
                    <Text style={styles.scaleLabel}>60-79: Good</Text>
                    <Text style={styles.scaleDescription}>
                      On track but could benefit from optimization
                    </Text>
                  </View>
                </View>

                <View style={styles.scaleItem}>
                  <View style={[styles.scaleIndicator, { backgroundColor: '#F97316' }]} />
                  <View style={styles.scaleContent}>
                    <Text style={styles.scaleLabel}>40-59: Fair</Text>
                    <Text style={styles.scaleDescription}>
                      Making progress but needs significant improvement
                    </Text>
                  </View>
                </View>

                <View style={styles.scaleItem}>
                  <View style={[styles.scaleIndicator, { backgroundColor: '#DC2626' }]} />
                  <View style={styles.scaleContent}>
                    <Text style={styles.scaleLabel}>0-39: Needs Work</Text>
                    <Text style={styles.scaleDescription}>
                      Immediate action required to improve retirement readiness
                    </Text>
                  </View>
                </View>
              </View>

              <View style={styles.disclaimerSection}>
                <Text style={styles.disclaimerTitle}>Important Notes</Text>
                <Text style={styles.disclaimerText}>
                  • This calculation assumes a 5% annual growth rate on pension investments{'\n'}
                  • State pension estimates are based on current rates and may change{'\n'}
                  • Consider inflation and changing expenses in retirement{'\n'}
                  • Consult with a financial advisor for personalized advice
                </Text>
              </View>
            </View>
          </ScrollView>
        </SafeAreaView>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginBottom: 24,
  },
  scoreCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 24,
  },
  title: {
    fontSize: 20,
    fontWeight: '600',
    color: '#111827',
  },
  infoButton: {
    padding: 8,
    borderRadius: 8,
    backgroundColor: '#F3F4F6',
  },
  scoreScaleContainer: {
    alignItems: 'center',
    marginBottom: 24,
  },
  scoreTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#374151',
    marginBottom: 16,
  },
  // New compact score display styles
  compactScoreDisplay: {
    alignItems: 'center',
    marginBottom: 20,
  },
  compactScoreNumber: {
    fontSize: 32,
    fontWeight: '800',
    lineHeight: 36,
  },
  compactScoreLabel: {
    fontSize: 14,
    fontWeight: '600',
    color: '#6B7280',
    marginTop: 2,
  },
  scaleWrapper: {
    alignItems: 'center',
  },
  scaleSvg: {
    marginBottom: 8,
  },
  scaleLabels: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: 280,
    paddingHorizontal: 4,
  },
  scaleLabel: {
    fontSize: 12,
    color: '#6B7280',
    fontWeight: '500',
  },
  actionButton: {
    borderRadius: 12,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  actionGradient: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 14,
    gap: 8,
  },
  actionText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#FFFFFF',
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
    backgroundColor: '#EFF6FF',
    borderRadius: 12,
    padding: 16,
    marginBottom: 24,
    borderWidth: 1,
    borderColor: '#DBEAFE',
  },
  formulaTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1E40AF',
    marginBottom: 8,
  },
  formulaText: {
    fontSize: 14,
    color: '#3730A3',
    fontFamily: 'monospace',
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
    marginBottom: 4,
  },
  componentDescription: {
    fontSize: 14,
    color: '#6B7280',
    lineHeight: 20,
  },
  targetSection: {
    backgroundColor: '#F0FDF4',
    borderRadius: 12,
    padding: 16,
    marginBottom: 24,
    borderWidth: 1,
    borderColor: '#BBF7D0',
  },
  targetTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#059669',
    marginBottom: 8,
  },
  targetDescription: {
    fontSize: 14,
    color: '#374151',
    lineHeight: 20,
    marginBottom: 16,
  },
  targetBreakdown: {
    gap: 8,
  },
  targetRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  targetLabel: {
    fontSize: 14,
    color: '#374151',
  },
  targetValue: {
    fontSize: 14,
    fontWeight: '600',
    color: '#111827',
  },
  scaleSection: {
    marginBottom: 24,
  },
  scaleTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#111827',
    marginBottom: 16,
  },
  scaleItem: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: 12,
    gap: 12,
  },
  scaleIndicator: {
    width: 16,
    height: 16,
    borderRadius: 8,
    marginTop: 2,
  },
  scaleContent: {
    flex: 1,
  },
  scaleLabel: {
    fontSize: 14,
    fontWeight: '600',
    color: '#111827',
    marginBottom: 2,
  },
  scaleDescription: {
    fontSize: 14,
    color: '#6B7280',
    lineHeight: 18,
  },
  disclaimerSection: {
    backgroundColor: '#FEF3C7',
    borderRadius: 12,
    padding: 16,
    borderWidth: 1,
    borderColor: '#FDE68A',
  },
  disclaimerTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#92400E',
    marginBottom: 8,
  },
  disclaimerText: {
    fontSize: 14,
    color: '#78350F',
    lineHeight: 20,
  },
});