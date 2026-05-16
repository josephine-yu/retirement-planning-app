import React, { useState, useEffect } from 'react';
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
import { Plus, CreditCard as Edit3, Save, X, TrendingUp, TrendingDown, Briefcase, Building2, PiggyBank, Crown, Laptop, Chrome as Home, Car, Utensils, Zap, Heart, Gamepad2, Receipt, ShoppingBag, Coffee, Shield, Droplets, Wrench, Fuel, Stethoscope, Dumbbell, CircleParking as ParkingCircle, Plane, Smartphone, ShoppingCart, Tv, MoveHorizontal as MoreHorizontal, Target, Percent } from 'lucide-react-native';
import { InteractiveDonutChart } from './InteractiveDonutChart';

interface BudgetCategory {
  id: string;
  name: string;
  icon: React.ReactNode;
  color: string;
  planned: number;
}

interface BudgetSection {
  id: string;
  name: string;
  categories: BudgetCategory[];
  color: string;
}

interface PensionData {
  currentPot: number;
  monthlyContribution: number;
  employerMatch: number;
}

const initialBudgetData: BudgetSection[] = [
  {
    id: 'income',
    name: 'Income',
    color: '#059669',
    categories: [
      { id: 'salary', name: 'Salary', icon: <Briefcase size={20} color="#FFFFFF" />, color: '#3B82F6', planned: 3000 },
      { id: 'savings', name: 'Savings Interest', icon: <PiggyBank size={20} color="#FFFFFF" />, color: '#10B981', planned: 200 },
      { id: 'dividends', name: 'Dividends', icon: <TrendingUp size={20} color="#FFFFFF" />, color: '#059669', planned: 150 },
      { id: 'rental', name: 'Rental Income', icon: <Building2 size={20} color="#FFFFFF" />, color: '#1E40AF', planned: 800 },
    ]
  },
  {
    id: 'household',
    name: 'Household',
    color: '#3B82F6',
    categories: [
      { id: 'rent', name: 'Rent/Mortgage', icon: <Home size={20} color="#FFFFFF" />, color: '#3B82F6', planned: 1200 },
      { id: 'insurance', name: 'Insurance', icon: <Shield size={20} color="#FFFFFF" />, color: '#6366F1', planned: 150 },
      { id: 'gas', name: 'Gas', icon: <Fuel size={20} color="#FFFFFF" />, color: '#8B5CF6', planned: 80 },
      { id: 'electricity', name: 'Electricity', icon: <Zap size={20} color="#FFFFFF" />, color: '#A855F7', planned: 120 },
      { id: 'water', name: 'Water', icon: <Droplets size={20} color="#FFFFFF" />, color: '#06B6D4', planned: 45 },
      { id: 'service', name: 'Service Charge', icon: <Wrench size={20} color="#FFFFFF" />, color: '#0891B2', planned: 75 },
    ]
  },
  {
    id: 'lifestyle',
    name: 'Lifestyle',
    color: '#F59E0B',
    categories: [
      { id: 'petrol', name: 'Petrol', icon: <Car size={20} color="#FFFFFF" />, color: '#DC2626', planned: 120 },
      { id: 'healthcare', name: 'Healthcare', icon: <Stethoscope size={20} color="#FFFFFF" />, color: '#EF4444', planned: 100 },
      { id: 'gym', name: 'Gym', icon: <Dumbbell size={20} color="#FFFFFF" />, color: '#F97316', planned: 50 },
      { id: 'parking', name: 'Parking', icon: <ParkingCircle size={20} color="#FFFFFF" />, color: '#F59E0B', planned: 60 },
      { id: 'travel', name: 'Travel', icon: <Plane size={20} color="#FFFFFF" />, color: '#D97706', planned: 200 },
    ]
  },
  {
    id: 'food',
    name: 'Food & Dining',
    color: '#10B981',
    categories: [
      { id: 'restaurant', name: 'Restaurants', icon: <Utensils size={20} color="#FFFFFF" />, color: '#059669', planned: 300 },
      { id: 'groceries', name: 'Groceries', icon: <ShoppingCart size={20} color="#FFFFFF" />, color: '#10B981', planned: 400 },
      { id: 'coffee', name: 'Coffee & Snacks', icon: <Coffee size={20} color="#FFFFFF" />, color: '#34D399', planned: 80 },
    ]
  },
  {
    id: 'entertainment',
    name: 'Entertainment',
    color: '#8B5CF6',
    categories: [
      { id: 'electronics', name: 'Electronics', icon: <Smartphone size={20} color="#FFFFFF" />, color: '#8B5CF6', planned: 200 },
      { id: 'shopping', name: 'Shopping', icon: <ShoppingBag size={20} color="#FFFFFF" />, color: '#A855F7', planned: 250 },
      { id: 'subscription', name: 'Subscriptions', icon: <Tv size={20} color="#FFFFFF" />, color: '#C084FC', planned: 45 },
    ]
  }
];

const initialPensionData: PensionData = {
  currentPot: 45000,
  monthlyContribution: 400,
  employerMatch: 200,
};

export function BudgetTab() {
  const { state, dispatch } = useRetirement();
  const [budgetData, setBudgetData] = useState<BudgetSection[]>(initialBudgetData);
  const [pensionData, setPensionData] = useState<PensionData>(initialPensionData);
  const [editingCategory, setEditingCategory] = useState<string | null>(null);
  const [editingPension, setEditingPension] = useState<string | null>(null);
  const [showAddCategory, setShowAddCategory] = useState<string | null>(null);
  const [showAddSection, setShowAddSection] = useState(false);
  const [newCategoryName, setNewCategoryName] = useState('');
  const [newSectionName, setNewSectionName] = useState('');

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-GB', {
      style: 'currency',
      currency: 'GBP',
      minimumFractionDigits: 0,
    }).format(amount);
  };

  // Update context when budget data changes
  useEffect(() => {
    const incomeSection = budgetData.find(s => s.id === 'income');
    const expenseSections = budgetData.filter(s => s.id !== 'income');
    
    if (incomeSection) {
      const income = {
        salary: incomeSection.categories.find(c => c.id === 'salary')?.planned || 0,
        savingsInterest: incomeSection.categories.find(c => c.id === 'savings')?.planned || 0,
        dividends: incomeSection.categories.find(c => c.id === 'dividends')?.planned || 0,
        rentalIncome: incomeSection.categories.find(c => c.id === 'rental')?.planned || 0,
        other: incomeSection.categories.filter(c => !['salary', 'savings', 'dividends', 'rental'].includes(c.id))
          .reduce((sum, cat) => sum + cat.planned, 0),
      };

      const expenses = {
        housing: budgetData.find(s => s.id === 'household')?.categories.find(c => c.id === 'rent')?.planned || 0,
        utilities: budgetData.find(s => s.id === 'household')?.categories
          .filter(c => ['gas', 'electricity', 'water', 'service'].includes(c.id))
          .reduce((sum, cat) => sum + cat.planned, 0) || 0,
        transport: budgetData.find(s => s.id === 'lifestyle')?.categories
          .filter(c => ['petrol', 'parking'].includes(c.id))
          .reduce((sum, cat) => sum + cat.planned, 0) || 0,
        food: budgetData.find(s => s.id === 'food')?.categories
          .reduce((sum, cat) => sum + cat.planned, 0) || 0,
        entertainment: budgetData.find(s => s.id === 'entertainment')?.categories
          .reduce((sum, cat) => sum + cat.planned, 0) || 0,
        healthcare: budgetData.find(s => s.id === 'lifestyle')?.categories.find(c => c.id === 'healthcare')?.planned || 0,
        insurance: budgetData.find(s => s.id === 'household')?.categories.find(c => c.id === 'insurance')?.planned || 0,
        other: expenseSections.reduce((sum, section) => {
          return sum + section.categories.filter(c => 
            !['rent', 'gas', 'electricity', 'water', 'service', 'petrol', 'parking', 'healthcare', 'insurance'].includes(c.id) &&
            section.id !== 'food' && section.id !== 'entertainment'
          ).reduce((catSum, cat) => catSum + cat.planned, 0);
        }, 0),
      };

      dispatch({ 
        type: 'UPDATE_BUDGET_DATA', 
        payload: { income, expenses } 
      });
    }
  }, [budgetData, dispatch]);

  // Update pension data in context
  useEffect(() => {
    const updatedFinancialData = {
      ...state.financialData,
      assets: {
        ...state.financialData.assets,
        pensionPot: pensionData.currentPot,
      },
      pensionContributions: pensionData.monthlyContribution,
      employerPensionMatch: pensionData.employerMatch,
    };
    
    dispatch({ 
      type: 'UPDATE_FINANCIAL_DATA', 
      payload: updatedFinancialData 
    });
  }, [pensionData, dispatch]);

  const handleUpdateCategory = (sectionId: string, categoryId: string, value: number) => {
    setBudgetData(prev => prev.map(section => 
      section.id === sectionId 
        ? {
            ...section,
            categories: section.categories.map(cat => 
              cat.id === categoryId 
                ? { ...cat, planned: value }
                : cat
            )
          }
        : section
    ));
  };

  const handleUpdatePension = (field: keyof PensionData, value: number) => {
    setPensionData(prev => ({
      ...prev,
      [field]: value,
    }));
  };

  const handleAddCategory = (sectionId: string) => {
    if (!newCategoryName.trim()) {
      Alert.alert('Error', 'Please enter a category name');
      return;
    }

    const newCategory: BudgetCategory = {
      id: Date.now().toString(),
      name: newCategoryName.trim(),
      icon: <MoreHorizontal size={20} color="#FFFFFF" />,
      color: '#6B7280',
      planned: 0,
    };

    setBudgetData(prev => prev.map(section => 
      section.id === sectionId 
        ? { ...section, categories: [...section.categories, newCategory] }
        : section
    ));

    setNewCategoryName('');
    setShowAddCategory(null);
    Alert.alert('Success', 'Category added successfully');
  };

  const handleAddSection = () => {
    if (!newSectionName.trim()) {
      Alert.alert('Error', 'Please enter a section name');
      return;
    }

    const newSection: BudgetSection = {
      id: Date.now().toString(),
      name: newSectionName.trim(),
      color: '#6B7280',
      categories: [],
    };

    setBudgetData(prev => [...prev, newSection]);
    setNewSectionName('');
    setShowAddSection(false);
    Alert.alert('Success', 'Section added successfully');
  };

  // Calculate totals
  const totalIncome = budgetData.find(s => s.id === 'income')?.categories.reduce((sum, cat) => sum + cat.planned, 0) || 0;
  const totalExpenses = budgetData.filter(s => s.id !== 'income').reduce((sum, section) => 
    sum + section.categories.reduce((catSum, cat) => catSum + cat.planned, 0), 0
  );
  const netCashflow = totalIncome - totalExpenses;

  // Calculate pension projections
  const yearsToRetirement = 37; // Demo: 67 - 30 = 37 years
  const taxRelief = pensionData.monthlyContribution * 0.25; // 25% basic rate tax relief
  const totalMonthlyContributions = pensionData.monthlyContribution + pensionData.employerMatch + taxRelief;
  const projectedPensionPot = (totalMonthlyContributions * 12 * yearsToRetirement * 1.05) + pensionData.currentPot;

  // Prepare data for interactive donut chart
  const incomeDonutData = budgetData
    .filter(s => s.id === 'income')
    .map(section => ({
      id: section.id,
      name: section.name,
      value: section.categories.reduce((sum, cat) => sum + cat.planned, 0),
      color: section.color,
      subcategories: section.categories.map(cat => ({
        id: cat.id,
        name: cat.name,
        value: cat.planned,
        color: cat.color,
      })),
    }));

  const expenseDonutData = budgetData
    .filter(s => s.id !== 'income')
    .map(section => ({
      id: section.id,
      name: section.name,
      value: section.categories.reduce((sum, cat) => sum + cat.planned, 0),
      color: section.color,
      subcategories: section.categories.map(cat => ({
        id: cat.id,
        name: cat.name,
        value: cat.planned,
        color: cat.color,
      })),
    }));

  return (
    <View style={styles.container}>
      {/* Overview Cards */}
      <View style={styles.overviewSection}>
        <View style={styles.overviewGrid}>
          <View style={styles.overviewCard}>
            <LinearGradient colors={['#059669', '#10B981']} style={styles.overviewGradient}>
              <TrendingUp size={24} color="#FFFFFF" />
              <Text style={styles.overviewLabel}>Planned Income</Text>
              <Text style={styles.overviewValue}>{formatCurrency(totalIncome)}</Text>
            </LinearGradient>
          </View>
          
          <View style={styles.overviewCard}>
            <LinearGradient colors={['#DC2626', '#EF4444']} style={styles.overviewGradient}>
              <TrendingDown size={24} color="#FFFFFF" />
              <Text style={styles.overviewLabel}>Planned Expenses</Text>
              <Text style={styles.overviewValue}>{formatCurrency(totalExpenses)}</Text>
            </LinearGradient>
          </View>
        </View>

        <View style={styles.netCashflowCard}>
          <LinearGradient 
            colors={netCashflow >= 0 ? ['#7C3AED', '#A855F7'] : ['#DC2626', '#EF4444']} 
            style={styles.netCashflowGradient}
          >
            <Text style={styles.netCashflowLabel}>Net Cashflow</Text>
            <Text style={styles.netCashflowValue}>
              {netCashflow >= 0 ? '+' : ''}{formatCurrency(netCashflow)}
            </Text>
            <Text style={styles.netCashflowSubtext}>
              {netCashflow >= 0 ? '✅ Positive cashflow' : '⚠️ Negative cashflow'}
            </Text>
          </LinearGradient>
        </View>
      </View>

      {/* Pension Contributions Section */}
      <View style={styles.pensionSection}>
        <View style={styles.pensionHeader}>
          <View style={styles.pensionTitleContainer}>
            <View style={[styles.sectionColorIndicator, { backgroundColor: '#7C3AED' }]} />
            <Text style={styles.sectionTitle}>Pension Contributions</Text>
          </View>
        </View>

        <View style={styles.pensionGrid}>
          {/* Current Pension Pot */}
          <View style={[styles.pensionCard, { backgroundColor: '#3B82F6' }]}>
            <PiggyBank size={20} color="#FFFFFF" />
            <Text style={styles.pensionName}>Current Pension Pot</Text>
            
            {editingPension === 'currentPot' ? (
              <View style={styles.editingContainer}>
                <View style={styles.inputRow}>
                  <TextInput
                    style={styles.input}
                    value={pensionData.currentPot.toString()}
                    onChangeText={(value) => handleUpdatePension('currentPot', parseFloat(value) || 0)}
                    keyboardType="numeric"
                    placeholder="0"
                    placeholderTextColor="rgba(255,255,255,0.6)"
                  />
                </View>
                <TouchableOpacity
                  style={styles.saveButton}
                  onPress={() => setEditingPension(null)}
                >
                  <Save size={14} color="#FFFFFF" />
                </TouchableOpacity>
              </View>
            ) : (
              <View style={styles.pensionDetails}>
                <Text style={styles.pensionAmount}>{formatCurrency(pensionData.currentPot)}</Text>
                <TouchableOpacity
                  style={styles.editButton}
                  onPress={() => setEditingPension('currentPot')}
                >
                  <Edit3 size={14} color="#FFFFFF" />
                </TouchableOpacity>
              </View>
            )}
          </View>

          {/* Monthly Contribution */}
          <View style={[styles.pensionCard, { backgroundColor: '#059669' }]}>
            <Target size={20} color="#FFFFFF" />
            <Text style={styles.pensionName}>Monthly Contribution</Text>
            
            {editingPension === 'monthlyContribution' ? (
              <View style={styles.editingContainer}>
                <View style={styles.inputRow}>
                  <TextInput
                    style={styles.input}
                    value={pensionData.monthlyContribution.toString()}
                    onChangeText={(value) => handleUpdatePension('monthlyContribution', parseFloat(value) || 0)}
                    keyboardType="numeric"
                    placeholder="0"
                    placeholderTextColor="rgba(255,255,255,0.6)"
                  />
                </View>
                <TouchableOpacity
                  style={styles.saveButton}
                  onPress={() => setEditingPension(null)}
                >
                  <Save size={14} color="#FFFFFF" />
                </TouchableOpacity>
              </View>
            ) : (
              <View style={styles.pensionDetails}>
                <Text style={styles.pensionAmount}>{formatCurrency(pensionData.monthlyContribution)}</Text>
                <TouchableOpacity
                  style={styles.editButton}
                  onPress={() => setEditingPension('monthlyContribution')}
                >
                  <Edit3 size={14} color="#FFFFFF" />
                </TouchableOpacity>
              </View>
            )}
          </View>

          {/* Employer Match */}
          <View style={[styles.pensionCard, { backgroundColor: '#F59E0B' }]}>
            <Crown size={20} color="#FFFFFF" />
            <Text style={styles.pensionName}>Employer Match</Text>
            
            {editingPension === 'employerMatch' ? (
              <View style={styles.editingContainer}>
                <View style={styles.inputRow}>
                  <TextInput
                    style={styles.input}
                    value={pensionData.employerMatch.toString()}
                    onChangeText={(value) => handleUpdatePension('employerMatch', parseFloat(value) || 0)}
                    keyboardType="numeric"
                    placeholder="0"
                    placeholderTextColor="rgba(255,255,255,0.6)"
                  />
                </View>
                <TouchableOpacity
                  style={styles.saveButton}
                  onPress={() => setEditingPension(null)}
                >
                  <Save size={14} color="#FFFFFF" />
                </TouchableOpacity>
              </View>
            ) : (
              <View style={styles.pensionDetails}>
                <Text style={styles.pensionAmount}>{formatCurrency(pensionData.employerMatch)}</Text>
                <TouchableOpacity
                  style={styles.editButton}
                  onPress={() => setEditingPension('employerMatch')}
                >
                  <Edit3 size={14} color="#FFFFFF" />
                </TouchableOpacity>
              </View>
            )}
          </View>

          {/* Tax Relief (Calculated) */}
          <View style={[styles.pensionCard, { backgroundColor: '#8B5CF6' }]}>
            <Percent size={20} color="#FFFFFF" />
            <Text style={styles.pensionName}>Tax Relief (25%)</Text>
            <View style={styles.pensionDetails}>
              <Text style={styles.pensionAmount}>{formatCurrency(taxRelief)}</Text>
              <Text style={styles.pensionSubtext}>Calculated</Text>
            </View>
          </View>
        </View>

        {/* Pension Summary */}
        <View style={styles.pensionSummaryCard}>
          <LinearGradient
            colors={['#7C3AED', '#A855F7']}
            style={styles.pensionSummaryGradient}
          >
            <Text style={styles.pensionSummaryTitle}>Pension Summary</Text>
            
            <View style={styles.pensionSummaryRow}>
              <View style={styles.pensionSummaryItem}>
                <Text style={styles.pensionSummaryLabel}>Total Monthly</Text>
                <Text style={styles.pensionSummaryValue}>
                  {formatCurrency(totalMonthlyContributions)}
                </Text>
                <Text style={styles.pensionSummarySubtext}>
                  Including tax relief
                </Text>
              </View>
              
              <View style={styles.pensionSummaryDivider} />
              
              <View style={styles.pensionSummaryItem}>
                <Text style={styles.pensionSummaryLabel}>Projected Pot</Text>
                <Text style={styles.pensionSummaryValue}>
                  {formatCurrency(projectedPensionPot)}
                </Text>
                <Text style={styles.pensionSummarySubtext}>
                  At retirement (37 years)
                </Text>
              </View>
            </View>

            <View style={styles.pensionInsightCard}>
              <Text style={styles.pensionInsightTitle}>Pension Insight</Text>
              <Text style={styles.pensionInsightText}>
                Your total monthly pension contributions (including employer match and tax relief) 
                are {formatCurrency(totalMonthlyContributions)}. This is projected to grow to{' '}
                {formatCurrency(projectedPensionPot)} by retirement.
              </Text>
            </View>
          </LinearGradient>
        </View>
      </View>

      {/* Interactive Donut Chart */}
      <View style={styles.chartSection}>
        <InteractiveDonutChart 
          incomeData={incomeDonutData}
          expenseData={expenseDonutData}
          title="Budget Breakdown"
        />
      </View>

      {/* Budget Sections */}
      <ScrollView showsVerticalScrollIndicator={false}>
        {budgetData.map((section) => (
          <View key={section.id} style={styles.budgetSection}>
            <View style={styles.sectionHeader}>
              <View style={styles.sectionTitleContainer}>
                <View style={[styles.sectionColorIndicator, { backgroundColor: section.color }]} />
                <Text style={styles.sectionTitle}>{section.name}</Text>
                <Text style={styles.sectionTotal}>
                  {formatCurrency(section.categories.reduce((sum, cat) => sum + cat.planned, 0))}
                </Text>
              </View>
              <TouchableOpacity
                style={[styles.addButton, { backgroundColor: section.color }]}
                onPress={() => setShowAddCategory(section.id)}
              >
                <Plus size={16} color="#FFFFFF" />
              </TouchableOpacity>
            </View>

            <View style={styles.categoriesGrid}>
              {section.categories.map((category) => {
                const isEditing = editingCategory === category.id;

                return (
                  <View key={category.id} style={[styles.categoryCard, { backgroundColor: category.color }]}>
                    {category.icon}
                    <Text style={styles.categoryName}>{category.name}</Text>
                    
                    {isEditing ? (
                      <View style={styles.editingContainer}>
                        <View style={styles.inputRow}>
                          <TextInput
                            style={styles.input}
                            value={category.planned.toString()}
                            onChangeText={(value) => handleUpdateCategory(section.id, category.id, parseFloat(value) || 0)}
                            keyboardType="numeric"
                            placeholder="0"
                            placeholderTextColor="rgba(255,255,255,0.6)"
                          />
                        </View>
                        <TouchableOpacity
                          style={styles.saveButton}
                          onPress={() => setEditingCategory(null)}
                        >
                          <Save size={14} color="#FFFFFF" />
                        </TouchableOpacity>
                      </View>
                    ) : (
                      <View style={styles.categoryDetails}>
                        <Text style={styles.categoryAmount}>{formatCurrency(category.planned)}</Text>
                        <TouchableOpacity
                          style={styles.editButton}
                          onPress={() => setEditingCategory(category.id)}
                        >
                          <Edit3 size={14} color="#FFFFFF" />
                        </TouchableOpacity>
                      </View>
                    )}
                  </View>
                );
              })}

              {/* Add Category Form */}
              {showAddCategory === section.id && (
                <View style={styles.addCategoryCard}>
                  <Text style={styles.addCategoryTitle}>Add Category</Text>
                  <TextInput
                    style={styles.addCategoryInput}
                    value={newCategoryName}
                    onChangeText={setNewCategoryName}
                    placeholder="Category name"
                    placeholderTextColor="#9CA3AF"
                  />
                  <View style={styles.addCategoryButtons}>
                    <TouchableOpacity
                      style={styles.cancelButton}
                      onPress={() => {
                        setShowAddCategory(null);
                        setNewCategoryName('');
                      }}
                    >
                      <X size={16} color="#6B7280" />
                    </TouchableOpacity>
                    <TouchableOpacity
                      style={[styles.confirmButton, { backgroundColor: section.color }]}
                      onPress={() => handleAddCategory(section.id)}
                    >
                      <Plus size={16} color="#FFFFFF" />
                    </TouchableOpacity>
                  </View>
                </View>
              )}
            </View>
          </View>
        ))}

        {/* Add New Section */}
        <View style={styles.addSectionContainer}>
          {showAddSection ? (
            <View style={styles.addSectionCard}>
              <Text style={styles.addSectionTitle}>Add New Section</Text>
              <TextInput
                style={styles.addSectionInput}
                value={newSectionName}
                onChangeText={setNewSectionName}
                placeholder="Section name"
                placeholderTextColor="#9CA3AF"
              />
              <View style={styles.addSectionButtons}>
                <TouchableOpacity
                  style={styles.cancelButton}
                  onPress={() => {
                    setShowAddSection(false);
                    setNewSectionName('');
                  }}
                >
                  <Text style={styles.cancelButtonText}>Cancel</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={styles.addSectionConfirmButton}
                  onPress={handleAddSection}
                >
                  <LinearGradient
                    colors={['#7C3AED', '#A855F7']}
                    style={styles.addSectionConfirmGradient}
                  >
                    <Plus size={16} color="#FFFFFF" />
                    <Text style={styles.addSectionConfirmText}>Add Section</Text>
                  </LinearGradient>
                </TouchableOpacity>
              </View>
            </View>
          ) : (
            <TouchableOpacity
              style={styles.addSectionButton}
              onPress={() => setShowAddSection(true)}
            >
              <LinearGradient
                colors={['#6B7280', '#9CA3AF']}
                style={styles.addSectionButtonGradient}
              >
                <Plus size={20} color="#FFFFFF" />
                <Text style={styles.addSectionButtonText}>Add New Section</Text>
              </LinearGradient>
            </TouchableOpacity>
          )}
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: 20,
    paddingBottom: 32,
  },
  overviewSection: {
    marginBottom: 24,
  },
  overviewGrid: {
    flexDirection: 'row',
    gap: 12,
    marginBottom: 12,
  },
  overviewCard: {
    flex: 1,
    borderRadius: 16,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
  },
  overviewGradient: {
    padding: 16,
    alignItems: 'center',
  },
  overviewLabel: {
    fontSize: 14,
    color: 'rgba(255, 255, 255, 0.8)',
    marginTop: 8,
    marginBottom: 4,
  },
  overviewValue: {
    fontSize: 18,
    fontWeight: '700',
    color: '#FFFFFF',
  },
  netCashflowCard: {
    borderRadius: 16,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
  },
  netCashflowGradient: {
    padding: 20,
    alignItems: 'center',
  },
  netCashflowLabel: {
    fontSize: 16,
    color: 'rgba(255, 255, 255, 0.8)',
    marginBottom: 8,
  },
  netCashflowValue: {
    fontSize: 28,
    fontWeight: '700',
    color: '#FFFFFF',
    marginBottom: 4,
  },
  netCashflowSubtext: {
    fontSize: 14,
    color: 'rgba(255, 255, 255, 0.9)',
  },
  // Pension Section Styles
  pensionSection: {
    marginBottom: 24,
  },
  pensionHeader: {
    marginBottom: 16,
  },
  pensionTitleContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  pensionGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
    marginBottom: 16,
  },
  pensionCard: {
    width: '48%',
    borderRadius: 12,
    padding: 16,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
    position: 'relative',
  },
  pensionName: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: '600',
    marginTop: 8,
    marginBottom: 8,
    textAlign: 'center',
  },
  pensionDetails: {
    alignItems: 'center',
    width: '100%',
  },
  pensionAmount: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '700',
    marginBottom: 8,
  },
  pensionSubtext: {
    color: 'rgba(255, 255, 255, 0.7)',
    fontSize: 12,
    fontStyle: 'italic',
  },
  pensionSummaryCard: {
    borderRadius: 16,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 12,
    elevation: 6,
  },
  pensionSummaryGradient: {
    padding: 20,
  },
  pensionSummaryTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#FFFFFF',
    marginBottom: 16,
    textAlign: 'center',
  },
  pensionSummaryRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 20,
  },
  pensionSummaryItem: {
    flex: 1,
    alignItems: 'center',
  },
  pensionSummaryDivider: {
    width: 1,
    height: 60,
    backgroundColor: 'rgba(255, 255, 255, 0.3)',
    marginHorizontal: 16,
  },
  pensionSummaryLabel: {
    fontSize: 14,
    color: 'rgba(255, 255, 255, 0.8)',
    marginBottom: 4,
  },
  pensionSummaryValue: {
    fontSize: 20,
    fontWeight: '700',
    color: '#FFFFFF',
    marginBottom: 2,
  },
  pensionSummarySubtext: {
    fontSize: 12,
    color: 'rgba(255, 255, 255, 0.7)',
  },
  pensionInsightCard: {
    backgroundColor: 'rgba(255, 255, 255, 0.15)',
    borderRadius: 12,
    padding: 16,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.2)',
  },
  pensionInsightTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: '#FFFFFF',
    marginBottom: 8,
  },
  pensionInsightText: {
    fontSize: 14,
    color: 'rgba(255, 255, 255, 0.9)',
    lineHeight: 20,
  },
  chartSection: {
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: '600',
    color: '#111827',
    marginBottom: 16,
  },
  budgetSection: {
    marginBottom: 32,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  sectionTitleContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    flex: 1,
  },
  sectionColorIndicator: {
    width: 4,
    height: 24,
    borderRadius: 2,
  },
  sectionTotal: {
    fontSize: 16,
    fontWeight: '600',
    color: '#6B7280',
    marginLeft: 'auto',
    marginRight: 16,
  },
  addButton: {
    padding: 8,
    borderRadius: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  categoriesGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
  },
  categoryCard: {
    width: '48%',
    borderRadius: 12,
    padding: 16,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
    position: 'relative',
  },
  categoryName: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: '600',
    marginTop: 8,
    marginBottom: 8,
    textAlign: 'center',
  },
  categoryDetails: {
    alignItems: 'center',
    width: '100%',
  },
  categoryAmount: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '700',
    marginBottom: 8,
  },
  editButton: {
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    padding: 6,
    borderRadius: 6,
  },
  editingContainer: {
    width: '100%',
    alignItems: 'center',
  },
  inputRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
    width: '100%',
    justifyContent: 'center',
  },
  inputLabel: {
    color: '#FFFFFF',
    fontSize: 12,
    flex: 1,
  },
  input: {
    width: 80,
    backgroundColor: 'rgba(255, 255, 255, 0.25)',
    borderRadius: 6,
    paddingHorizontal: 8,
    paddingVertical: 4,
    fontSize: 12,
    textAlign: 'center',
    color: '#FFFFFF',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.4)',
  },
  saveButton: {
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    padding: 6,
    borderRadius: 6,
    marginTop: 4,
  },
  addCategoryCard: {
    width: '48%',
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 16,
    alignItems: 'center',
    borderWidth: 2,
    borderColor: '#E5E7EB',
    borderStyle: 'dashed',
  },
  addCategoryTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: '#6B7280',
    marginBottom: 12,
  },
  addCategoryInput: {
    width: '100%',
    borderWidth: 1,
    borderColor: '#D1D5DB',
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 8,
    fontSize: 14,
    marginBottom: 12,
  },
  addCategoryButtons: {
    flexDirection: 'row',
    gap: 8,
  },
  cancelButton: {
    padding: 8,
    borderRadius: 6,
    backgroundColor: '#F3F4F6',
  },
  confirmButton: {
    padding: 8,
    borderRadius: 6,
  },
  addSectionContainer: {
    marginTop: 24,
  },
  addSectionButton: {
    borderRadius: 12,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  addSectionButtonGradient: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 16,
    gap: 8,
  },
  addSectionButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#FFFFFF',
  },
  addSectionCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
  },
  addSectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#111827',
    marginBottom: 16,
    textAlign: 'center',
  },
  addSectionInput: {
    borderWidth: 1,
    borderColor: '#D1D5DB',
    borderRadius: 8,
    paddingHorizontal: 16,
    paddingVertical: 12,
    fontSize: 16,
    marginBottom: 16,
  },
  addSectionButtons: {
    flexDirection: 'row',
    gap: 12,
  },
  cancelButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#6B7280',
  },
  addSectionConfirmButton: {
    flex: 2,
    borderRadius: 8,
    overflow: 'hidden',
  },
  addSectionConfirmGradient: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 12,
    gap: 8,
  },
  addSectionConfirmText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#FFFFFF',
  },
});