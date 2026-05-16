import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  SafeAreaView,
  TextInput,
  TouchableOpacity,
  Alert,
  Modal,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { useRetirement } from '@/context/RetirementContext';
import { User, Calendar, Target, Clock, Globe, PoundSterling, Crown, Users, Phone, ExternalLink, Shield, Star, Check, TrendingUp, Save, Percent, Plus, CreditCard as Edit3, Trash2, X, Briefcase, Building2, PiggyBank, Laptop, Chrome as Home, Car, Utensils, Zap, Heart, Gamepad2, Receipt, ShoppingBag, Coffee, MoveHorizontal as MoreHorizontal } from 'lucide-react-native';

interface UserSettings {
  name: string;
  dateOfBirth: string;
  retirementAge: number;
  lifeExpectancy: number;
  country: string;
  currency: string;
}

interface CustomCategory {
  id: string;
  name: string;
  icon: string;
  color: string;
  type: 'income' | 'expense';
}

const countries = [
  { code: 'GB', name: 'United Kingdom', currency: 'GBP', lifeExpectancy: 81 },
  { code: 'US', name: 'United States', currency: 'USD', lifeExpectancy: 79 },
  { code: 'CA', name: 'Canada', currency: 'CAD', lifeExpectancy: 82 },
  { code: 'AU', name: 'Australia', currency: 'AUD', lifeExpectancy: 83 },
  { code: 'DE', name: 'Germany', currency: 'EUR', lifeExpectancy: 81 },
  { code: 'FR', name: 'France', currency: 'EUR', lifeExpectancy: 83 },
];

const availableIcons = [
  { name: 'Briefcase', component: Briefcase },
  { name: 'Building2', component: Building2 },
  { name: 'PiggyBank', component: PiggyBank },
  { name: 'Laptop', component: Laptop },
  { name: 'Crown', component: Crown },
  { name: 'Home', component: Home },
  { name: 'Car', component: Car },
  { name: 'Utensils', component: Utensils },
  { name: 'Zap', component: Zap },
  { name: 'Heart', component: Heart },
  { name: 'Gamepad2', component: Gamepad2 },
  { name: 'Receipt', component: Receipt },
  { name: 'ShoppingBag', component: ShoppingBag },
  { name: 'Coffee', component: Coffee },
  { name: 'MoreHorizontal', component: MoreHorizontal },
  { name: 'TrendingUp', component: TrendingUp },
  { name: 'Target', component: Target },
  { name: 'PoundSterling', component: PoundSterling },
];

const availableColors = [
  '#3B82F6', '#059669', '#10B981', '#1E40AF', '#7C3AED', '#F59E0B',
  '#DC2626', '#EF4444', '#8B5CF6', '#6B7280', '#9CA3AF', '#F97316',
  '#84CC16', '#06B6D4', '#EC4899', '#8B4513', '#4B5563', '#374151'
];

export default function Settings() {
  const { state, dispatch } = useRetirement();
  const [activeTab, setActiveTab] = useState<'profile' | 'planning' | 'premium' | 'professional'>('planning');
  const [userSettings, setUserSettings] = useState<UserSettings>({
    name: '',
    dateOfBirth: state.userProfile.dateOfBirth,
    retirementAge: state.userProfile.retirementAge,
    lifeExpectancy: state.userProfile.lifeExpectancy,
    country: 'GB',
    currency: 'GBP',
  });
  const [economicSettings, setEconomicSettings] = useState({
    inflationRate: state.financialData.inflationRate,
    wageInflationRate: state.financialData.wageInflationRate,
  });
  
  // Category Management State
  const [customCategories, setCustomCategories] = useState<CustomCategory[]>([]);
  const [showCategoryModal, setShowCategoryModal] = useState(false);
  const [editingCategory, setEditingCategory] = useState<CustomCategory | null>(null);
  const [newCategory, setNewCategory] = useState({
    name: '',
    icon: 'MoreHorizontal',
    color: '#3B82F6',
    type: 'expense' as 'income' | 'expense',
  });

  const calculateAge = (birthDate: string) => {
    if (!birthDate) return 0;
    const today = new Date();
    const birth = new Date(birthDate);
    let age = today.getFullYear() - birth.getFullYear();
    const monthDiff = today.getMonth() - birth.getMonth();
    if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birth.getDate())) {
      age--;
    }
    return age;
  };

  const handleCountryChange = (countryCode: string) => {
    const country = countries.find(c => c.code === countryCode);
    if (country) {
      setUserSettings(prev => ({
        ...prev,
        country: countryCode,
        currency: country.currency,
        lifeExpectancy: country.lifeExpectancy,
      }));
    }
  };

  const handleSaveProfile = () => {
    if (!userSettings.dateOfBirth) {
      Alert.alert('Error', 'Please enter your date of birth');
      return;
    }

    const currentAge = calculateAge(userSettings.dateOfBirth);
    
    if (userSettings.retirementAge <= currentAge) {
      Alert.alert('Error', 'Retirement age must be greater than current age');
      return;
    }
    
    if (userSettings.lifeExpectancy <= userSettings.retirementAge) {
      Alert.alert('Error', 'Life expectancy must be greater than retirement age');
      return;
    }

    const updatedProfile = {
      ...state.userProfile,
      dateOfBirth: userSettings.dateOfBirth,
      currentAge: currentAge,
      retirementAge: userSettings.retirementAge,
      lifeExpectancy: userSettings.lifeExpectancy,
    };

    dispatch({ type: 'UPDATE_PROFILE', payload: updatedProfile });
    Alert.alert('Success', 'Your profile has been updated');
  };

  const handleSaveEconomicSettings = () => {
    const updatedData = {
      ...state.financialData,
      inflationRate: economicSettings.inflationRate,
      wageInflationRate: economicSettings.wageInflationRate,
    };
    dispatch({ type: 'UPDATE_FINANCIAL_DATA', payload: updatedData });
    Alert.alert('Success', 'Economic settings have been updated');
  };

  const handleSubscribe = (plan: string) => {
    Alert.alert(
      'Premium Subscription',
      `You selected the ${plan} plan. This would integrate with RevenueCat for mobile subscriptions in the UK market.`,
      [{ text: 'OK' }]
    );
  };

  const handleConnectProfessional = () => {
    Alert.alert(
      'Connect with Professional',
      'This feature would connect you with FCA-regulated financial advisors and pension specialists in the UK.',
      [{ text: 'OK' }]
    );
  };

  const handleAddCategory = () => {
    if (!newCategory.name.trim()) {
      Alert.alert('Error', 'Please enter a category name');
      return;
    }

    const category: CustomCategory = {
      id: Date.now().toString(),
      name: newCategory.name.trim(),
      icon: newCategory.icon,
      color: newCategory.color,
      type: newCategory.type,
    };

    if (editingCategory) {
      setCustomCategories(prev => 
        prev.map(cat => cat.id === editingCategory.id ? { ...category, id: editingCategory.id } : cat)
      );
    } else {
      setCustomCategories(prev => [...prev, category]);
    }

    setNewCategory({ name: '', icon: 'MoreHorizontal', color: '#3B82F6', type: 'expense' });
    setEditingCategory(null);
    setShowCategoryModal(false);
    Alert.alert('Success', `Category ${editingCategory ? 'updated' : 'added'} successfully`);
  };

  const handleEditCategory = (category: CustomCategory) => {
    setEditingCategory(category);
    setNewCategory({
      name: category.name,
      icon: category.icon,
      color: category.color,
      type: category.type,
    });
    setShowCategoryModal(true);
  };

  const handleDeleteCategory = (categoryId: string) => {
    Alert.alert(
      'Delete Category',
      'Are you sure you want to delete this category?',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Delete',
          style: 'destructive',
          onPress: () => {
            setCustomCategories(prev => prev.filter(cat => cat.id !== categoryId));
            Alert.alert('Success', 'Category deleted successfully');
          }
        }
      ]
    );
  };

  const getIconComponent = (iconName: string) => {
    const icon = availableIcons.find(i => i.name === iconName);
    return icon ? icon.component : MoreHorizontal;
  };

  const renderPlanningTabContent = () => (
  <View style={styles.subTabContent}>
    {/* ----- Retirement Planning Section ----- */}
    <Text style={styles.subTabTitle}>Retirement Planning</Text>
    <Text style={styles.subTabSubtitle}>Set your retirement goals and expectations</Text>

    <View style={styles.inputGroup}>
      <View style={styles.inputLabel}>
        <Target size={20} color="#059669" />
        <Text style={styles.labelText}>Expected Retirement Age</Text>
      </View>
      <TextInput
        style={styles.input}
        value={userSettings.retirementAge.toString()}
        onChangeText={(value) => setUserSettings(prev => ({ ...prev, retirementAge: parseInt(value) || 67 }))}
        placeholder="67"
        keyboardType="numeric"
        placeholderTextColor="#9CA3AF"
      />
      <Text style={styles.helperText}>
        {userSettings.country === 'GB' ? 'UK State Pension age is currently 67' : 'Standard retirement age varies by country'}
      </Text>
    </View>

    <View style={styles.inputGroup}>
      <View style={styles.inputLabel}>
        <Clock size={20} color="#059669" />
        <Text style={styles.labelText}>Life Expectancy</Text>
      </View>
      <TextInput
        style={styles.input}
        value={userSettings.lifeExpectancy.toString()}
        onChangeText={(value) => setUserSettings(prev => ({ ...prev, lifeExpectancy: parseInt(value) || 81 }))}
        placeholder="81"
        keyboardType="numeric"
        placeholderTextColor="#9CA3AF"
      />
      <Text style={styles.helperText}>
        Average life expectancy in {countries.find(c => c.code === userSettings.country)?.name}: {countries.find(c => c.code === userSettings.country)?.lifeExpectancy} years
      </Text>
    </View>

    {userSettings.dateOfBirth && (
      <View style={styles.summaryCard}>
        <Text style={styles.summaryTitle}>Your Retirement Summary</Text>
        <View style={styles.summaryRow}>
          <Text style={styles.summaryLabel}>Years to Retirement:</Text>
          <Text style={styles.summaryValue}>
            {Math.max(0, userSettings.retirementAge - calculateAge(userSettings.dateOfBirth))} years
          </Text>
        </View>
        <View style={styles.summaryRow}>
          <Text style={styles.summaryLabel}>Retirement Duration:</Text>
          <Text style={styles.summaryValue}>
            {userSettings.lifeExpectancy - userSettings.retirementAge} years
          </Text>
        </View>
      </View>
    )}

    <TouchableOpacity style={styles.saveButton} onPress={handleSaveProfile}>
      <LinearGradient
        colors={['#059669', '#10B981']}
        style={styles.saveButtonGradient}
      >
        <Save size={20} color="#FFFFFF" />
        <Text style={styles.saveButtonText}>Save Planning Settings</Text>
      </LinearGradient>
    </TouchableOpacity>

    {/* ----- Economic Settings Section ----- */}
    <Text style={[styles.subTabTitle, { marginTop: 36 }]}>Economic Settings</Text>
    <Text style={styles.subTabSubtitle}>UK economic assumptions for planning</Text>
    
    <View style={styles.inputGroup}>
      <View style={styles.inputLabel}>
        <Percent size={20} color="#F59E0B" />
        <Text style={styles.labelText}>UK Inflation Rate (%)</Text>
      </View>
      <TextInput
        style={styles.input}
        value={economicSettings.inflationRate.toString()}
        onChangeText={(value) => setEconomicSettings(prev => ({ 
          ...prev, 
          inflationRate: parseFloat(value) || 2.5 
        }))}
        placeholder="2.5"
        keyboardType="numeric"
        placeholderTextColor="#9CA3AF"
      />
      <Text style={styles.helperText}>Bank of England target: 2.0% - Current default: 2.5%</Text>
    </View>

    <View style={styles.inputGroup}>
      <View style={styles.inputLabel}>
        <TrendingUp size={20} color="#F59E0B" />
        <Text style={styles.labelText}>UK Wage Growth Rate (%)</Text>
      </View>
      <TextInput
        style={styles.input}
        value={economicSettings.wageInflationRate.toString()}
        onChangeText={(value) => setEconomicSettings(prev => ({ 
          ...prev, 
          wageInflationRate: parseFloat(value) || 2.0 
        }))}
        placeholder="2.0"
        keyboardType="numeric"
        placeholderTextColor="#9CA3AF"
      />
      <Text style={styles.helperText}>Historical UK average: 2.0% - Expected annual wage growth</Text>
    </View>

    <View style={styles.economicInfo}>
      <Text style={styles.economicInfoTitle}>About UK Economic Settings</Text>
      <Text style={styles.economicInfoText}>
        <Text>• Inflation Rate: How much prices increase annually in the UK{'\n'}</Text>
        <Text>• Wage Growth: How much UK salaries typically increase annually{'\n'}</Text>
        <Text>• Use custom values to model different economic scenarios{'\n'}</Text>
        <Text>• Consider Brexit and post-pandemic economic impacts</Text>
      </Text>
    </View>

    <TouchableOpacity style={styles.saveButton} onPress={handleSaveEconomicSettings}>
      <LinearGradient
        colors={['#F59E0B', '#D97706']}
        style={styles.saveButtonGradient}
      >
        <Save size={20} color="#FFFFFF" />
        <Text style={styles.saveButtonText}>Save Economic Settings</Text>
      </LinearGradient>
    </TouchableOpacity>
  </View>
);

  const renderCategoryManagementTab = () => (
    <View style={styles.subTabContent}>
      <View style={styles.categoryHeader}>
        <View>
          <Text style={styles.subTabTitle}>Category Management</Text>
          <Text style={styles.subTabSubtitle}>Create custom income and expense categories</Text>
        </View>
        <TouchableOpacity
          style={styles.addCategoryButton}
          onPress={() => {
            setEditingCategory(null);
            setNewCategory({ name: '', icon: 'MoreHorizontal', color: '#3B82F6', type: 'expense' });
            setShowCategoryModal(true);
          }}
        >
          <Plus size={20} color="#FFFFFF" />
        </TouchableOpacity>
      </View>

      {/* Income Categories */}
      <View style={styles.categorySection}>
        <Text style={styles.categorySectionTitle}>Income Categories</Text>
        <View style={styles.categoryGrid}>
          {customCategories.filter(cat => cat.type === 'income').map((category) => {
            const IconComponent = getIconComponent(category.icon);
            return (
              <View key={category.id} style={[styles.categoryCard, { backgroundColor: category.color }]}>
                <IconComponent size={20} color="#FFFFFF" />
                <Text style={styles.categoryName}>{category.name}</Text>
                <View style={styles.categoryActions}>
                  <TouchableOpacity
                    style={styles.categoryActionButton}
                    onPress={() => handleEditCategory(category)}
                  >
                    <Edit3 size={14} color="#FFFFFF" />
                  </TouchableOpacity>
                  <TouchableOpacity
                    style={styles.categoryActionButton}
                    onPress={() => handleDeleteCategory(category.id)}
                  >
                    <Trash2 size={14} color="#FFFFFF" />
                  </TouchableOpacity>
                </View>
              </View>
            );
          })}
        </View>
        {customCategories.filter(cat => cat.type === 'income').length === 0 && (
          <Text style={styles.emptyText}>No custom income categories yet</Text>
        )}
      </View>

      {/* Expense Categories */}
      <View style={styles.categorySection}>
        <Text style={styles.categorySectionTitle}>Expense Categories</Text>
        <View style={styles.categoryGrid}>
          {customCategories.filter(cat => cat.type === 'expense').map((category) => {
            const IconComponent = getIconComponent(category.icon);
            return (
              <View key={category.id} style={[styles.categoryCard, { backgroundColor: category.color }]}>
                <IconComponent size={20} color="#FFFFFF" />
                <Text style={styles.categoryName}>{category.name}</Text>
                <View style={styles.categoryActions}>
                  <TouchableOpacity
                    style={styles.categoryActionButton}
                    onPress={() => handleEditCategory(category)}
                  >
                    <Edit3 size={14} color="#FFFFFF" />
                  </TouchableOpacity>
                  <TouchableOpacity
                    style={styles.categoryActionButton}
                    onPress={() => handleDeleteCategory(category.id)}
                  >
                    <Trash2 size={14} color="#FFFFFF" />
                  </TouchableOpacity>
                </View>
              </View>
            );
          })}
        </View>
        {customCategories.filter(cat => cat.type === 'expense').length === 0 && (
          <Text style={styles.emptyText}>No custom expense categories yet</Text>
        )}
      </View>

      {/* Category Creation Modal */}
      <Modal
        visible={showCategoryModal}
        animationType="slide"
        presentationStyle="pageSheet"
        onRequestClose={() => setShowCategoryModal(false)}
      >
        <SafeAreaView style={styles.modalContainer}>
          <View style={styles.modalHeader}>
            <Text style={styles.modalTitle}>
              {editingCategory ? 'Edit Category' : 'Add New Category'}
            </Text>
            <TouchableOpacity
              style={styles.modalCloseButton}
              onPress={() => setShowCategoryModal(false)}
            >
              <X size={24} color="#6B7280" />
            </TouchableOpacity>
          </View>

          <ScrollView style={styles.modalContent}>
            {/* Category Name */}
            <View style={styles.inputGroup}>
              <Text style={styles.modalInputLabel}>Category Name</Text>
              <TextInput
                style={styles.input}
                value={newCategory.name}
                onChangeText={(value) => setNewCategory(prev => ({ ...prev, name: value }))}
                placeholder="Enter category name"
                placeholderTextColor="#9CA3AF"
              />
            </View>

            {/* Category Type */}
            <View style={styles.inputGroup}>
              <Text style={styles.modalInputLabel}>Category Type</Text>
              <View style={styles.typeSelector}>
                <TouchableOpacity
                  style={[
                    styles.typeButton,
                    newCategory.type === 'income' && styles.activeTypeButton
                  ]}
                  onPress={() => setNewCategory(prev => ({ ...prev, type: 'income' }))}
                >
                  <TrendingUp size={16} color={newCategory.type === 'income' ? '#FFFFFF' : '#059669'} />
                  <Text style={[
                    styles.typeButtonText,
                    newCategory.type === 'income' && styles.activeTypeButtonText
                  ]}>
                    Income
                  </Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={[
                    styles.typeButton,
                    newCategory.type === 'expense' && styles.activeTypeButton
                  ]}
                  onPress={() => setNewCategory(prev => ({ ...prev, type: 'expense' }))}
                >
                  <TrendingUp size={16} color={newCategory.type === 'expense' ? '#FFFFFF' : '#DC2626'} />
                  <Text style={[
                    styles.typeButtonText,
                    newCategory.type === 'expense' && styles.activeTypeButtonText
                  ]}>
                    Expense
                  </Text>
                </TouchableOpacity>
              </View>
            </View>

            {/* Icon Selection */}
            <View style={styles.inputGroup}>
              <Text style={styles.modalInputLabel}>Select Icon</Text>
              <View style={styles.iconGrid}>
                {availableIcons.map((icon) => {
                  const IconComponent = icon.component;
                  return (
                    <TouchableOpacity
                      key={icon.name}
                      style={[
                        styles.iconButton,
                        newCategory.icon === icon.name && styles.activeIconButton,
                        { backgroundColor: newCategory.icon === icon.name ? newCategory.color : '#F3F4F6' }
                      ]}
                      onPress={() => setNewCategory(prev => ({ ...prev, icon: icon.name }))}
                    >
                      <IconComponent 
                        size={20} 
                        color={newCategory.icon === icon.name ? '#FFFFFF' : '#6B7280'} 
                      />
                    </TouchableOpacity>
                  );
                })}
              </View>
            </View>

            {/* Color Selection */}
            <View style={styles.inputGroup}>
              <Text style={styles.modalInputLabel}>Select Color</Text>
              <View style={styles.colorGrid}>
                {availableColors.map((color) => (
                  <TouchableOpacity
                    key={color}
                    style={[
                      styles.colorButton,
                      { backgroundColor: color },
                      newCategory.color === color && styles.activeColorButton
                    ]}
                    onPress={() => setNewCategory(prev => ({ ...prev, color }))}
                  >
                    {newCategory.color === color && <Check size={16} color="#FFFFFF" />}
                  </TouchableOpacity>
                ))}
              </View>
            </View>

            {/* Preview */}
            <View style={styles.previewSection}>
              <Text style={styles.modalInputLabel}>Preview</Text>
              <View style={[styles.previewCard, { backgroundColor: newCategory.color }]}>
                {React.createElement(getIconComponent(newCategory.icon), { size: 24, color: '#FFFFFF' })}
                <Text style={styles.previewText}>{newCategory.name || 'Category Name'}</Text>
              </View>
            </View>
          </ScrollView>

          <View style={styles.modalFooter}>
            <TouchableOpacity
              style={styles.modalCancelButton}
              onPress={() => setShowCategoryModal(false)}
            >
              <Text style={styles.modalCancelText}>Cancel</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.modalSaveButton}
              onPress={handleAddCategory}
            >
              <LinearGradient
                colors={['#059669', '#10B981']}
                style={styles.modalSaveGradient}
              >
                <Text style={styles.modalSaveText}>
                  {editingCategory ? 'Update' : 'Add'} Category
                </Text>
              </LinearGradient>
            </TouchableOpacity>
          </View>
        </SafeAreaView>
      </Modal>
    </View>
  );

  const renderProfileTab = () => (
    <View style={styles.tabContent}>
      <Text style={styles.tabTitle}>Personal Profile</Text>
      <Text style={styles.tabSubtitle}>Your basic information and preferences</Text>

      <View style={styles.inputGroup}>
        <View style={styles.inputLabel}>
          <User size={20} color="#1E40AF" />
          <Text style={styles.labelText}>Full Name</Text>
        </View>
        <TextInput
          style={styles.input}
          value={userSettings.name}
          onChangeText={(value) => setUserSettings(prev => ({ ...prev, name: value }))}
          placeholder="Enter your full name"
          placeholderTextColor="#9CA3AF"
        />
      </View>

      <View style={styles.inputGroup}>
        <View style={styles.inputLabel}>
          <Calendar size={20} color="#1E40AF" />
          <Text style={styles.labelText}>Date of Birth</Text>
        </View>
        <TextInput
          style={styles.input}
          value={userSettings.dateOfBirth}
          onChangeText={(value) => setUserSettings(prev => ({ ...prev, dateOfBirth: value }))}
          placeholder="DD/MM/YYYY"
          placeholderTextColor="#9CA3AF"
        />
        {userSettings.dateOfBirth && (
          <Text style={styles.helperText}>Current Age: {calculateAge(userSettings.dateOfBirth)} years</Text>
        )}
      </View>

      <View style={styles.inputGroup}>
        <View style={styles.inputLabel}>
          <Globe size={20} color="#1E40AF" />
          <Text style={styles.labelText}>Country</Text>
        </View>
        <View style={styles.countryGrid}>
          {countries.map((country) => (
            <TouchableOpacity
              key={country.code}
              style={[
                styles.countryButton,
                userSettings.country === country.code && styles.activeCountryButton
              ]}
              onPress={() => handleCountryChange(country.code)}
            >
              <Text style={[
                styles.countryButtonText,
                userSettings.country === country.code && styles.activeCountryButtonText
              ]}>
                {country.name}
              </Text>
            </TouchableOpacity>
          ))}
        </View>
      </View>

      <View style={styles.inputGroup}>
        <View style={styles.inputLabel}>
          <PoundSterling size={20} color="#1E40AF" />
          <Text style={styles.labelText}>Base Currency</Text>
        </View>
        <TextInput
          style={[styles.input, styles.disabledInput]}
          value={userSettings.currency}
          editable={false}
          placeholderTextColor="#9CA3AF"
        />
        <Text style={styles.helperText}>Currency is automatically set based on your country</Text>
      </View>

      <TouchableOpacity style={styles.saveButton} onPress={handleSaveProfile}>
        <LinearGradient
          colors={['#1E40AF', '#3B82F6']}
          style={styles.saveButtonGradient}
        >
          <Save size={20} color="#FFFFFF" />
          <Text style={styles.saveButtonText}>Save Profile</Text>
        </LinearGradient>
      </TouchableOpacity>
    </View>
  );

  const renderPlanningTab = () => (
  <View style={styles.tabContent}>
    {renderPlanningTabContent()}
  </View>
);

  const renderPremiumTab = () => (
    <View style={styles.tabContent}>
      <Text style={styles.tabTitle}>Premium Features</Text>
      <Text style={styles.tabSubtitle}>Unlock advanced retirement planning tools</Text>

      {/* Basic Plan */}
      <View style={styles.planCard}>
        <View style={styles.planHeader}>
          <Text style={styles.planName}>Basic</Text>
          <Text style={styles.planPrice}>Free</Text>
        </View>
        <View style={styles.featuresList}>
          <View style={styles.feature}>
            <Check size={16} color="#059669" />
            <Text style={styles.featureText}>Basic retirement calculation</Text>
          </View>
          <View style={styles.feature}>
            <Check size={16} color="#059669" />
            <Text style={styles.featureText}>Simple expense tracking</Text>
          </View>
          <View style={styles.feature}>
            <Check size={16} color="#059669" />
            <Text style={styles.featureText}>4 scenario tests</Text>
          </View>
        </View>
        <TouchableOpacity style={styles.currentPlanButton}>
          <Text style={styles.currentPlanText}>Current Plan</Text>
        </TouchableOpacity>
      </View>

      {/* Pro Plan */}
      <View style={[styles.planCard, styles.featuredPlan]}>
        <View style={styles.featuredBadge}>
          <Star size={12} color="#FFFFFF" />
          <Text style={styles.featuredBadgeText}>Most Popular</Text>
        </View>
        <View style={styles.planHeader}>
          <Text style={styles.planName}>Pro</Text>
          <View style={styles.priceContainer}>
            <Text style={styles.planPrice}>£7.99</Text>
            <Text style={styles.planPeriod}>/month</Text>
          </View>
        </View>
        <View style={styles.featuresList}>
          <View style={styles.feature}>
            <Check size={16} color="#059669" />
            <Text style={styles.featureText}>Advanced pension modelling</Text>
          </View>
          <View style={styles.feature}>
            <Check size={16} color="#059669" />
            <Text style={styles.featureText}>Unlimited scenario testing</Text>
          </View>
          <View style={styles.feature}>
            <Check size={16} color="#059669" />
            <Text style={styles.featureText}>ISA and SIPP tracking</Text>
          </View>
          <View style={styles.feature}>
            <Check size={16} color="#059669" />
            <Text style={styles.featureText}>Tax optimization suggestions</Text>
          </View>
        </View>
        <TouchableOpacity 
          style={styles.subscribeButton}
          onPress={() => handleSubscribe('Pro')}
        >
          <LinearGradient
            colors={['#7C3AED', '#A855F7']}
            style={styles.subscribeButtonGradient}
          >
            <Text style={styles.subscribeButtonText}>Upgrade to Pro</Text>
          </LinearGradient>
        </TouchableOpacity>
      </View>

      {/* Premium Plan */}
      <View style={styles.planCard}>
        <View style={styles.planHeader}>
          <Text style={styles.planName}>Premium</Text>
          <View style={styles.priceContainer}>
            <Text style={styles.planPrice}>£15.99</Text>
            <Text style={styles.planPeriod}>/month</Text>
          </View>
        </View>
        <View style={styles.featuresList}>
          <View style={styles.feature}>
            <Check size={16} color="#059669" />
            <Text style={styles.featureText}>Everything in Pro</Text>
          </View>
          <View style={styles.feature}>
            <Check size={16} color="#059669" />
            <Text style={styles.featureText}>FCA-regulated advisor access</Text>
          </View>
          <View style={styles.feature}>
            <Check size={16} color="#059669" />
            <Text style={styles.featureText}>Custom investment strategies</Text>
          </View>
          <View style={styles.feature}>
            <Check size={16} color="#059669" />
            <Text style={styles.featureText}>Priority customer support</Text>
          </View>
        </View>
        <TouchableOpacity 
          style={styles.subscribeButton}
          onPress={() => handleSubscribe('Premium')}
        >
          <LinearGradient
            colors={['#7C3AED', '#A855F7']}
            style={styles.subscribeButtonGradient}
          >
            <Text style={styles.subscribeButtonText}>Upgrade to Premium</Text>
          </LinearGradient>
        </TouchableOpacity>
      </View>
    </View>
  );

  const renderProfessionalTab = () => (
    <View style={styles.tabContent}>
      <Text style={styles.tabTitle}>Professional Services</Text>
      <Text style={styles.tabSubtitle}>Connect with financial experts</Text>

      <View style={styles.professionalCard}>
        <View style={styles.professionalHeader}>
          <Users size={24} color="#3B82F6" />
          <Text style={styles.professionalTitle}>Find an FCA-Regulated Advisor</Text>
        </View>
        <Text style={styles.professionalDescription}>
          <Text>Get personalised advice from FCA-regulated financial advisors and pension specialists. </Text>
          <Text>Our network includes Chartered Financial Planners across the UK.</Text>
        </Text>
        
        <View style={styles.professionalFeatures}>
          <View style={styles.professionalFeature}>
            <Shield size={16} color="#3B82F6" />
            <Text style={styles.professionalFeatureText}>FCA-regulated professionals</Text>
          </View>
          <View style={styles.professionalFeature}>
            <Phone size={16} color="#3B82F6" />
            <Text style={styles.professionalFeatureText}>Free initial consultation</Text>
          </View>
        </View>

        <TouchableOpacity 
          style={styles.professionalButton}
          onPress={handleConnectProfessional}
        >
          <LinearGradient
            colors={['#3B82F6', '#2563EB']}
            style={styles.professionalButtonGradient}
          >
            <Users size={16} color="#FFFFFF" />
            <Text style={styles.professionalButtonText}>Find an Advisor</Text>
            <ExternalLink size={16} color="#FFFFFF" />
          </LinearGradient>
        </TouchableOpacity>
      </View>

      <View style={styles.professionalCard}>
        <View style={styles.professionalHeader}>
          <PoundSterling size={24} color="#F59E0B" />
          <Text style={styles.professionalTitle}>Tax & Pension Planning</Text>
        </View>
        <Text style={styles.professionalDescription}>
          <Text>Optimise your pension savings with professional tax planning strategies. </Text>
          <Text>Work with qualified tax advisors and pension transfer specialists.</Text>
        </Text>
        
        <TouchableOpacity 
          style={styles.professionalButton}
          onPress={handleConnectProfessional}
        >
          <LinearGradient
            colors={['#F59E0B', '#D97706']}
            style={styles.professionalButtonGradient}
          >
            <PoundSterling size={16} color="#FFFFFF" />
            <Text style={styles.professionalButtonText}>Find a Tax Advisor</Text>
            <ExternalLink size={16} color="#FFFFFF" />
          </LinearGradient>
        </TouchableOpacity>
      </View>

      <View style={styles.professionalCard}>
        <View style={styles.professionalHeader}>
          <TrendingUp size={24} color="#059669" />
          <Text style={styles.professionalTitle}>Best Savings Interest Rates</Text>
        </View>
        <Text style={styles.professionalDescription}>
          <Text>Find the best UK savings accounts, ISAs, and fixed-term deposits. </Text>
          <Text>Compare rates from top UK banks and building societies.</Text>
        </Text>
        
        <TouchableOpacity 
          style={styles.professionalButton}
          onPress={handleConnectProfessional}
        >
          <LinearGradient
            colors={['#059669', '#10B981']}
            style={styles.professionalButtonGradient}
          >
            <TrendingUp size={16} color="#FFFFFF" />
            <Text style={styles.professionalButtonText}>Compare Rates</Text>
            <ExternalLink size={16} color="#FFFFFF" />
          </LinearGradient>
        </TouchableOpacity>
      </View>
    </View>
  );

  return (
    <SafeAreaView style={styles.container}>
      {/* Header */}
      <LinearGradient
        colors={['#6B7280', '#9CA3AF']}
        style={styles.header}
      >
        <Text style={styles.headerTitle}>Settings</Text>
        <Text style={styles.headerSubtitle}>Manage your profile and preferences</Text>
      </LinearGradient>

      {/* Tab Navigation */}
      <View style={styles.tabNavigation}>
        <ScrollView horizontal showsHorizontalScrollIndicator={false}>
          {[
            { key: 'profile', label: 'Profile', icon: User },
            { key: 'planning', label: 'Planning', icon: Target },
            { key: 'premium', label: 'Premium', icon: Crown },
            { key: 'professional', label: 'Professional', icon: Users },
          ].map(({ key, label, icon: Icon }) => (
            <TouchableOpacity
              key={key}
              style={[styles.tab, activeTab === key && styles.activeTab]}
              onPress={() => setActiveTab(key as any)}
            >
              <Icon size={16} color={activeTab === key ? '#1E40AF' : '#6B7280'} />
              <Text style={[styles.tabText, activeTab === key && styles.activeTabText]}>
                {label}
              </Text>
            </TouchableOpacity>
          ))}
        </ScrollView>
      </View>

      {/* Tab Content */}
      <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
        {activeTab === 'profile' && renderProfileTab()}
        {activeTab === 'planning' && renderPlanningTab()}
        {activeTab === 'premium' && renderPremiumTab()}
        {activeTab === 'professional' && renderProfessionalTab()}
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F9FAFB',
  },
  header: {
    paddingHorizontal: 20,
    paddingTop: 60,
    paddingBottom: 30,
    borderBottomLeftRadius: 24,
    borderBottomRightRadius: 24,
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
  tabNavigation: {
    paddingHorizontal: 20,
    marginTop: 20,
    marginBottom: 20,
  },
  tab: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 10,
    marginRight: 12,
    backgroundColor: '#E5E7EB',
    borderRadius: 20,
    gap: 6,
  },
  activeTab: {
    backgroundColor: '#EFF6FF',
  },
  tabText: {
    fontSize: 14,
    fontWeight: '500',
    color: '#6B7280',
  },
  activeTabText: {
    color: '#1E40AF',
  },
  scrollView: {
    flex: 1,
  },
  tabContent: {
    paddingHorizontal: 20,
    paddingBottom: 32,
  },
  tabTitle: {
    fontSize: 20,
    fontWeight: '600',
    color: '#111827',
    marginBottom: 8,
  },
  tabSubtitle: {
    fontSize: 14,
    color: '#6B7280',
    marginBottom: 24,
  },
  subTabNavigation: {
    marginBottom: 24,
  },
  subTab: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 8,
    marginRight: 12,
    backgroundColor: '#F3F4F6',
    borderRadius: 16,
    gap: 6,
  },
  activeSubTab: {
    backgroundColor: '#DCFCE7',
  },
  subTabText: {
    fontSize: 14,
    fontWeight: '500',
    color: '#6B7280',
  },
  activeSubTabText: {
    color: '#059669',
  },
  subTabContent: {
    flex: 1,
  },
  subTabTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#111827',
    marginBottom: 8,
  },
  subTabSubtitle: {
    fontSize: 14,
    color: '#6B7280',
    marginBottom: 24,
  },
  inputGroup: {
    marginBottom: 20,
  },
  inputLabel: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
    gap: 8,
  },
  labelText: {
    fontSize: 16,
    fontWeight: '500',
    color: '#374151',
  },
  input: {
    borderWidth: 1,
    borderColor: '#D1D5DB',
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 12,
    fontSize: 16,
    color: '#111827',
    backgroundColor: '#FFFFFF',
  },
  disabledInput: {
    backgroundColor: '#F3F4F6',
    color: '#6B7280',
  },
  helperText: {
    fontSize: 14,
    color: '#6B7280',
    marginTop: 4,
  },
  countryGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  countryButton: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderWidth: 1,
    borderColor: '#D1D5DB',
    borderRadius: 20,
    marginBottom: 8,
  },
  activeCountryButton: {
    backgroundColor: '#1E40AF',
    borderColor: '#1E40AF',
  },
  countryButtonText: {
    fontSize: 14,
    color: '#374151',
  },
  activeCountryButtonText: {
    color: '#FFFFFF',
  },
  economicInfo: {
    backgroundColor: '#F3F4F6',
    borderRadius: 12,
    padding: 16,
    marginTop: 20,
    marginBottom: 20,
  },
  economicInfoTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#111827',
    marginBottom: 8,
  },
  economicInfoText: {
    fontSize: 14,
    color: '#6B7280',
    lineHeight: 20,
  },
  summaryCard: {
    backgroundColor: '#F0FDF4',
    borderRadius: 16,
    padding: 20,
    marginBottom: 20,
    borderWidth: 1,
    borderColor: '#BBF7D0',
  },
  summaryTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#059669',
    marginBottom: 16,
  },
  summaryRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 8,
  },
  summaryLabel: {
    fontSize: 14,
    color: '#374151',
  },
  summaryValue: {
    fontSize: 14,
    fontWeight: '600',
    color: '#059669',
  },
  saveButton: {
    marginTop: 8,
  },
  saveButtonGradient: {
    borderRadius: 12,
    paddingVertical: 16,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
  },
  saveButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#FFFFFF',
  },
  // Category Management Styles
  categoryHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 24,
  },
  addCategoryButton: {
    backgroundColor: '#059669',
    borderRadius: 12,
    padding: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  categorySection: {
    marginBottom: 32,
  },
  categorySectionTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#111827',
    marginBottom: 16,
  },
  categoryGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
  },
  categoryCard: {
    width: '48%',
    aspectRatio: 1.2,
    borderRadius: 12,
    padding: 16,
    alignItems: 'center',
    justifyContent: 'center',
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
    textAlign: 'center',
  },
  categoryActions: {
    position: 'absolute',
    top: 8,
    right: 8,
    flexDirection: 'row',
    gap: 4,
  },
  categoryActionButton: {
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    borderRadius: 6,
    padding: 4,
  },
  emptyText: {
    fontSize: 14,
    color: '#6B7280',
    fontStyle: 'italic',
    textAlign: 'center',
    paddingVertical: 20,
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
  modalInputLabel: {
    fontSize: 16,
    fontWeight: '500',
    color: '#374151',
    marginBottom: 8,
  },
  typeSelector: {
    flexDirection: 'row',
    gap: 12,
  },
  typeButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 12,
    borderWidth: 1,
    borderColor: '#D1D5DB',
    borderRadius: 12,
    gap: 8,
  },
  activeTypeButton: {
    backgroundColor: '#059669',
    borderColor: '#059669',
  },
  typeButtonText: {
    fontSize: 14,
    fontWeight: '500',
    color: '#374151',
  },
  activeTypeButtonText: {
    color: '#FFFFFF',
  },
  iconGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
  },
  iconButton: {
    width: 48,
    height: 48,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 2,
    borderColor: 'transparent',
  },
  activeIconButton: {
    borderColor: '#FFFFFF',
  },
  colorGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
  },
  colorButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 3,
    borderColor: 'transparent',
  },
  activeColorButton: {
    borderColor: '#FFFFFF',
  },
  previewSection: {
    marginTop: 24,
  },
  previewCard: {
    width: 120,
    height: 120,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
    alignSelf: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  previewText: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: '600',
    marginTop: 8,
    textAlign: 'center',
  },
  modalFooter: {
    flexDirection: 'row',
    paddingHorizontal: 20,
    paddingVertical: 16,
    backgroundColor: '#FFFFFF',
    borderTopWidth: 1,
    borderTopColor: '#E5E7EB',
    gap: 12,
  },
  modalCancelButton: {
    flex: 1,
    paddingVertical: 16,
    borderRadius: 12,
    backgroundColor: '#F3F4F6',
    alignItems: 'center',
  },
  modalCancelText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#6B7280',
  },
  modalSaveButton: {
    flex: 2,
  },
  modalSaveGradient: {
    paddingVertical: 16,
    borderRadius: 12,
    alignItems: 'center',
  },
  modalSaveText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#FFFFFF',
  },
  planCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 24,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
    position: 'relative',
  },
  featuredPlan: {
    borderWidth: 2,
    borderColor: '#7C3AED',
  },
  featuredBadge: {
    position: 'absolute',
    top: -12,
    left: 20,
    backgroundColor: '#7C3AED',
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 12,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  featuredBadgeText: {
    fontSize: 12,
    fontWeight: '600',
    color: '#FFFFFF',
  },
  planHeader: {
    marginBottom: 20,
  },
  planName: {
    fontSize: 24,
    fontWeight: '700',
    color: '#111827',
    marginBottom: 4,
  },
  priceContainer: {
    flexDirection: 'row',
    alignItems: 'baseline',
  },
  planPrice: {
    fontSize: 32,
    fontWeight: '700',
    color: '#7C3AED',
  },
  planPeriod: {
    fontSize: 16,
    color: '#6B7280',
    marginLeft: 4,
  },
  featuresList: {
    marginBottom: 24,
  },
  feature: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
    gap: 12,
  },
  featureText: {
    fontSize: 14,
    color: '#374151',
    flex: 1,
  },
  subscribeButton: {
    marginTop: 8,
  },
  subscribeButtonGradient: {
    borderRadius: 12,
    paddingVertical: 16,
    alignItems: 'center',
  },
  subscribeButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#FFFFFF',
  },
  currentPlanButton: {
    backgroundColor: '#F3F4F6',
    borderRadius: 12,
    paddingVertical: 16,
    alignItems: 'center',
  },
  currentPlanText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#6B7280',
  },
  professionalCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 20,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
  },
  professionalHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
    gap: 12,
  },
  professionalTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#111827',
  },
  professionalDescription: {
    fontSize: 14,
    color: '#6B7280',
    lineHeight: 20,
    marginBottom: 16,
  },
  professionalFeatures: {
    marginBottom: 20,
  },
  professionalFeature: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
    gap: 8,
  },
  professionalFeatureText: {
    fontSize: 14,
    color: '#374151',
  },
  professionalButton: {
    marginTop: 8,
  },
  professionalButtonGradient: {
    borderRadius: 12,
    paddingVertical: 12,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
  },
  professionalButtonText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#FFFFFF',
  },
});