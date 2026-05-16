import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  TextInput,
  Alert,
  ScrollView,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { useRetirement } from '@/context/RetirementContext';
import { Plus, CreditCard as Edit3, Save, X, TrendingUp, Briefcase, Building2, PiggyBank, Crown, Laptop, MoveHorizontal as MoreHorizontal } from 'lucide-react-native';

interface IncomeCategory {
  key: keyof typeof initialIncome;
  name: string;
  icon: React.ReactNode;
  color: string;
}

const initialIncome = {
  salary: 0,
  rentalIncome: 0,
  dividends: 0,
  statePension: 0,
  privatePension: 0,
  other: 0,
};

const incomeCategories: IncomeCategory[] = [
  { key: 'salary', name: 'Salary', icon: <Briefcase size={20} color="#FFFFFF" />, color: '#3B82F6' },
  { key: 'rentalIncome', name: 'Rental Income', icon: <Building2 size={20} color="#FFFFFF" />, color: '#059669' },
  { key: 'dividends', name: 'Dividends', icon: <PiggyBank size={20} color="#FFFFFF" />, color: '#10B981' },
  { key: 'statePension', name: 'State Pension', icon: <Crown size={20} color="#FFFFFF" />, color: '#1E40AF' },
  { key: 'privatePension', name: 'Private Pension', icon: <Crown size={20} color="#FFFFFF" />, color: '#7C3AED' },
  { key: 'other', name: 'Freelance/Other', icon: <Laptop size={20} color="#FFFFFF" />, color: '#F59E0B' },
];

// Define quick add income items
const quickAddIncome = [
  { name: 'Salary', amount: 2500, category: 'salary', color: '#3B82F6', iconName: 'Briefcase' },
  { name: 'Freelance', amount: 500, category: 'other', color: '#F59E0B', iconName: 'Laptop' },
  { name: 'Dividends', amount: 100, category: 'dividends', color: '#10B981', iconName: 'PiggyBank' },
  { name: 'Rental', amount: 800, category: 'rentalIncome', color: '#059669', iconName: 'Building2' },
];

// Icon mapping for quick add
const LucideIcons = {
  Briefcase,
  Laptop,
  PiggyBank,
  Building2,
};

export function IncomeTab() {
  const { state, dispatch } = useRetirement();
  const [editingCategory, setEditingCategory] = useState<string | null>(null);
  const [budgetValues, setBudgetValues] = useState(state.financialData.income);
  const [actualValues, setActualValues] = useState({
    ...state.financialData.income,
    // Simulate some actual values with slight variations
    salary: state.financialData.income.salary * 1.02,
    dividends: state.financialData.income.dividends * 0.95,
    other: state.financialData.income.other * 1.1,
  });

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-GB', {
      style: 'currency',
      currency: 'GBP',
      minimumFractionDigits: 0,
    }).format(amount);
  };

  const handleSave = (category: keyof typeof initialIncome) => {
    const updatedData = {
      ...state.financialData,
      income: budgetValues,
    };
    dispatch({ type: 'UPDATE_FINANCIAL_DATA', payload: updatedData });
    setEditingCategory(null);
    Alert.alert('Success', 'Income budget updated successfully');
  };

  const getVarianceColor = (budgeted: number, actual: number) => {
    if (actual >= budgeted) return '#059669'; // Green - meeting or exceeding target
    if (actual >= budgeted * 0.9) return '#F59E0B'; // Amber - slightly under
    return '#DC2626'; // Red - significantly under
  };

  const getVariancePercentage = (budgeted: number, actual: number) => {
    if (budgeted === 0) return 0;
    return ((actual - budgeted) / budgeted) * 100;
  };

  const totalBudgeted = Object.values(budgetValues).reduce((sum, val) => sum + val, 0);
  const totalActual = Object.values(actualValues).reduce((sum, val) => sum + val, 0);

  return (
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
      {/* Summary Card */}
      <View style={styles.summaryCard}>
        <LinearGradient
          colors={['#059669', '#10B981']}
          style={styles.summaryGradient}
        >
          <Text style={styles.summaryTitle}>Monthly Income</Text>
          <View style={styles.summaryRow}>
            <View style={styles.summaryItem}>
              <Text style={styles.summaryLabel}>Target</Text>
              <Text style={styles.summaryValue}>{formatCurrency(totalBudgeted)}</Text>
            </View>
            <View style={styles.summaryDivider} />
            <View style={styles.summaryItem}>
              <Text style={styles.summaryLabel}>Actual</Text>
              <Text style={styles.summaryValue}>{formatCurrency(totalActual)}</Text>
            </View>
          </View>
          <View style={styles.varianceBar}>
            <View style={styles.varianceBarBackground}>
              <View 
                style={[
                  styles.varianceBarFill,
                  { 
                    width: `${Math.min(100, (totalActual / totalBudgeted) * 100)}%`,
                    backgroundColor: getVarianceColor(totalBudgeted, totalActual)
                  }
                ]} 
              />
            </View>
            <Text style={styles.varianceText}>
              {getVariancePercentage(totalBudgeted, totalActual) >= 0 ? '+' : ''}
              {getVariancePercentage(totalBudgeted, totalActual).toFixed(1)}%
            </Text>
          </View>
        </LinearGradient>
      </View>

      {/* Income Categories */}
      <Text style={styles.sectionTitle}>Income Sources</Text>
      <View style={styles.categoriesGrid}>
        {incomeCategories.map((category) => {
          const budgeted = budgetValues[category.key];
          const actual = actualValues[category.key];
          const isEditing = editingCategory === category.key;
          return (
            <View
              key={category.key}
              style={[
                styles.incomeCard,
                { backgroundColor: category.color, marginBottom: 12 }
              ]}
            >
              {category.icon}
              <Text style={styles.incomeName}>{category.name}</Text>
              <Text style={styles.incomeAmount}>
                Target: {formatCurrency(budgeted)}
              </Text>
              <Text style={styles.incomeAmount}>
                Actual: {formatCurrency(actual)}
              </Text>
              <Text style={styles.incomeAmount}>
                Var: {getVariancePercentage(budgeted, actual) >= 0 ? '+' : ''}
                {getVariancePercentage(budgeted, actual).toFixed(1)}%
              </Text>
              <TouchableOpacity
                style={[styles.editButton, { marginTop: 6, backgroundColor: '#FFF2' }]}
                onPress={() => setEditingCategory(isEditing ? null : category.key)}
              >
                {isEditing ? <X size={16} color="#FFF" /> : <Edit3 size={16} color="#FFF" />}
              </TouchableOpacity>
              {isEditing && (
                <View style={{ width: '100%', marginTop: 8 }}>
                  <View style={styles.inputRow}>
                    <Text style={[styles.inputLabel, { color: '#fff' }]}>Target</Text>
                    <TextInput
                      style={styles.input}
                      value={budgeted.toString()}
                      onChangeText={(value) => setBudgetValues(prev => ({
                        ...prev,
                        [category.key]: parseFloat(value) || 0
                      }))}
                      keyboardType="numeric"
                      placeholder="0"
                    />
                  </View>
                  <View style={styles.inputRow}>
                    <Text style={[styles.inputLabel, { color: '#fff' }]}>Actual</Text>
                    <TextInput
                      style={styles.input}
                      value={actual.toString()}
                      onChangeText={(value) => setActualValues(prev => ({
                        ...prev,
                        [category.key]: parseFloat(value) || 0
                      }))}
                      keyboardType="numeric"
                      placeholder="0"
                    />
                  </View>
                  <TouchableOpacity
                    style={styles.saveButton}
                    onPress={() => handleSave(category.key)}
                  >
                    <LinearGradient
                      colors={['#059669', '#10B981']}
                      style={styles.saveButtonGradient}
                    >
                      <Save size={16} color="#FFFFFF" />
                      <Text style={styles.saveButtonText}>Save</Text>
                    </LinearGradient>
                  </TouchableOpacity>
                </View>
              )}
            </View>
          );
        })}
      </View>

      {/* Quick Add Section */}
      <View style={styles.quickAddSection}>
        <Text style={styles.sectionTitle}>Quick Add Income</Text>
        <View style={styles.quickAddGrid}>
          {quickAddIncome.map((item, index) => {
            const IconComponent = LucideIcons[item.iconName as keyof typeof LucideIcons];
            return (
              <TouchableOpacity
                key={index}
                style={[styles.quickAddCard, { backgroundColor: item.color }]}
                onPress={() => {
                  setActualValues(prev => ({
                    ...prev,
                    [item.category]: prev[item.category as keyof typeof prev] + item.amount
                  }));
                  Alert.alert('Added', `£${item.amount} added to ${item.name}`);
                }}
              >
                {IconComponent && <IconComponent size={18} color="#FFFFFF" />}
                <Text style={styles.quickAddName}>{item.name}</Text>
                <Text style={styles.quickAddAmount}>+£{item.amount}</Text>
              </TouchableOpacity>
            );
          })}
        </View>
      </View>

      {/* Income Tips */}
      <View style={styles.tipsSection}>
        <Text style={styles.sectionTitle}>Income Optimization Tips</Text>
        
        <View style={styles.tipCard}>
          <View style={styles.tipHeader}>
            <View style={[styles.tipIcon, { backgroundColor: '#3B82F6' }]}>
              <Briefcase size={20} color="#FFFFFF" />
            </View>
            <Text style={styles.tipTitle}>Salary Negotiation</Text>
          </View>
          <Text style={styles.tipText}>
            Research market rates for your role and consider negotiating your salary annually. 
            Even a 5% increase can significantly impact your retirement savings.
          </Text>
        </View>

        <View style={styles.tipCard}>
          <View style={styles.tipHeader}>
            <View style={[styles.tipIcon, { backgroundColor: '#10B981' }]}>
              <PiggyBank size={20} color="#FFFFFF" />
            </View>
            <Text style={styles.tipTitle}>Dividend Income</Text>
          </View>
          <Text style={styles.tipText}>
            Consider investing in dividend-paying stocks or funds within your ISA allowance. 
            Dividends can provide regular income while growing tax-free.
          </Text>
        </View>

        <View style={styles.tipCard}>
          <View style={styles.tipHeader}>
            <View style={[styles.tipIcon, { backgroundColor: '#059669' }]}>
              <Building2 size={20} color="#FFFFFF" />
            </View>
            <Text style={styles.tipTitle}>Property Investment</Text>
          </View>
          <Text style={styles.tipText}>
            Rental income can provide steady cash flow. Consider buy-to-let properties 
            in areas with strong rental demand and good transport links.
          </Text>
        </View>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F8FAFC',
    paddingHorizontal: 20,
    paddingBottom: 32,
  },

  categoriesGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
    justifyContent: 'space-between',
    marginBottom: 24,
  },

  summaryCard: {
    borderRadius: 16,
    marginBottom: 24,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
  },
  summaryGradient: {
    padding: 20,
  },
  summaryTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: '#FFFFFF',
    marginBottom: 16,
  },
  summaryRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  summaryItem: {
    flex: 1,
    alignItems: 'center',
  },
  summaryDivider: {
    width: 1,
    height: 40,
    backgroundColor: 'rgba(255, 255, 255, 0.3)',
    marginHorizontal: 16,
  },
  summaryLabel: {
    fontSize: 14,
    color: 'rgba(255, 255, 255, 0.8)',
    marginBottom: 4,
  },
  summaryValue: {
    fontSize: 24,
    fontWeight: '700',
    color: '#FFFFFF',
  },
  varianceBar: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  varianceBarBackground: {
    flex: 1,
    height: 8,
    backgroundColor: 'rgba(255, 255, 255, 0.3)',
    borderRadius: 4,
    overflow: 'hidden',
  },
  varianceBarFill: {
    height: '100%',
    borderRadius: 4,
  },
  varianceText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#FFFFFF',
    minWidth: 50,
    textAlign: 'right',
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#1F2937',
    marginBottom: 16,
  },
  
  editButton: {
    padding: 8,
    borderRadius: 8,
    backgroundColor: '#F3F4F6',
  },
  inputRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  inputLabel: {
    fontSize: 14,
    fontWeight: '500',
    color: '#374151',
    flex: 1,
  },
  input: {
    flex: 2,
    height: 40,
    borderWidth: 1,
    borderColor: '#D1D5DB',
    borderRadius: 8,
    paddingHorizontal: 12,
    fontSize: 16,
    backgroundColor: '#FFFFFF',
  },
  saveButton: {
    borderRadius: 8,
    overflow: 'hidden',
    marginTop: 8,
  },
  saveButtonGradient: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 12,
    paddingHorizontal: 16,
    gap: 8,
  },
  saveButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '600',
  },
  quickAddSection: {
    marginTop: 24,
  },
  quickAddGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
  },
  incomeCard: {
    width: '48%',         // Show two per row, with a gap
    aspectRatio: 1,       // Perfect square
    padding: 10,          // Less padding for a tighter look
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
    marginBottom: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 3,
    elevation: 2,
  },
  quickAddCard: {
    width: '48%',         // Show two per row, with a gap
    aspectRatio: 1,       // Perfect square
    padding: 10,          // Less padding for a tighter look
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
    marginBottom: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 3,
    elevation: 2,
  },

  incomeName: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: '600',
  },
  incomeAmount: {
    color: '#FFFFFF',
    fontSize: 12,
    opacity: 0.9,
  },
  quickAddName: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: '600',
  },
  quickAddAmount: {
    color: '#FFFFFF',
    fontSize: 12,
    opacity: 0.9,
  },
  tipsSection: {
    marginTop: 24,
  },
  tipCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  tipHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
    gap: 12,
  },
  tipIcon: {
    width: 32,
    height: 32,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  tipTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#111827',
  },
  tipText: {
    fontSize: 14,
    color: '#6B7280',
    lineHeight: 20,
  },
});