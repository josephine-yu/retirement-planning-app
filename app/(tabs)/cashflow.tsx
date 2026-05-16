import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  SafeAreaView,
  TouchableOpacity,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { useRetirement } from '@/context/RetirementContext';
import { ChartBar as BarChart3, Receipt, Settings } from 'lucide-react-native';
import { router } from 'expo-router';
import { BudgetTab } from '@/components/cashflow/BudgetTab';
import { TransactionsTab } from '@/components/cashflow/TransactionsTab';

export default function Cashflow() {
  const { state } = useRetirement();
  const [activeTab, setActiveTab] = useState<'budget' | 'actuals'>('budget');

  const renderTabContent = () => {
    switch (activeTab) {
      case 'budget':
        return <BudgetTab />;
      case 'actuals':
        return <TransactionsTab />;
      default:
        return <BudgetTab />;
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      {/* Header */}
      <LinearGradient
        colors={['#7C3AED', '#A855F7']}
        style={styles.header}
      >
        <View style={styles.headerContent}>
          <View>
            <Text style={styles.headerTitle}>Expense Tracker</Text>
            <Text style={styles.headerSubtitle}>Manage your budget & actuals</Text>
          </View>
          <TouchableOpacity 
            style={styles.settingsButton}
            onPress={() => router.push('/settings')}
          >
            <Settings size={24} color="#FFFFFF" />
          </TouchableOpacity>
        </View>
      </LinearGradient>

      {/* Tab Navigation */}
      <View style={styles.tabNavigation}>
        {[
          { key: 'budget', label: 'Budget', icon: BarChart3 },
          { key: 'actuals', label: 'Actuals', icon: Receipt },
        ].map(({ key, label, icon: Icon }) => (
          <TouchableOpacity
            key={key}
            style={[styles.tab, activeTab === key && styles.activeTab]}
            onPress={() => setActiveTab(key as any)}
          >
            <Icon size={20} color={activeTab === key ? '#7C3AED' : '#6B7280'} />
            <Text style={[styles.tabText, activeTab === key && styles.activeTabText]}>
              {label}
            </Text>
          </TouchableOpacity>
        ))}
      </View>

      {/* Tab Content */}
      <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
        {renderTabContent()}
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
  tabNavigation: {
    flexDirection: 'row',
    paddingHorizontal: 20,
    marginTop: 20,
    marginBottom: 20,
    gap: 12,
  },
  tab: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 16,
    backgroundColor: '#E5E7EB',
    borderRadius: 16,
    gap: 8,
  },
  activeTab: {
    backgroundColor: '#EDE9FE',
    shadowColor: '#7C3AED',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
  },
  tabText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#6B7280',
  },
  activeTabText: {
    color: '#7C3AED',
  },
  scrollView: {
    flex: 1,
  },
});