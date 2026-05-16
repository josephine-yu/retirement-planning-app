import React, { useState, useMemo } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  TextInput,
  Alert,
  ScrollView,
  Modal,
  SafeAreaView,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Plus, Calendar, Repeat, X, Save, TrendingUp, TrendingDown, Filter, Search, CreditCard as Edit3, Trash2, ChevronLeft, ChevronRight, ChartBar as BarChart3 } from 'lucide-react-native';
import { TransactionBarChart } from './TransactionBarChart';

interface Transaction {
  id: string;
  type: 'income' | 'expense';
  category: string;
  amount: number;
  description: string;
  date: string;
  isRecurring: boolean;
  recurringFrequency?: 'weekly' | 'monthly' | 'yearly';
}

const initialTransactions: Transaction[] = [
  // December 2024
  {
    id: '1',
    type: 'income',
    category: 'Salary',
    amount: 3000,
    description: 'Monthly salary',
    date: '2024-12-01',
    isRecurring: true,
    recurringFrequency: 'monthly'
  },
  {
    id: '2',
    type: 'expense',
    category: 'Rent',
    amount: 1200,
    description: 'Monthly rent payment',
    date: '2024-12-01',
    isRecurring: true,
    recurringFrequency: 'monthly'
  },
  {
    id: '3',
    type: 'expense',
    category: 'Groceries',
    amount: 85,
    description: 'Weekly grocery shopping',
    date: '2024-12-15',
    isRecurring: false
  },
  {
    id: '4',
    type: 'expense',
    category: 'Coffee',
    amount: 4.50,
    description: 'Morning coffee',
    date: '2024-12-15',
    isRecurring: false
  },
  {
    id: '5',
    type: 'income',
    category: 'Freelance',
    amount: 500,
    description: 'Web design project',
    date: '2024-12-10',
    isRecurring: false
  },
  {
    id: '6',
    type: 'expense',
    category: 'Utilities',
    amount: 120,
    description: 'Electricity bill',
    date: '2024-12-05',
    isRecurring: false
  },
  {
    id: '7',
    type: 'expense',
    category: 'Transport',
    amount: 45,
    description: 'Petrol',
    date: '2024-12-08',
    isRecurring: false
  },
  {
    id: '8',
    type: 'expense',
    category: 'Entertainment',
    amount: 25,
    description: 'Netflix subscription',
    date: '2024-12-01',
    isRecurring: true,
    recurringFrequency: 'monthly'
  },
  {
    id: '9',
    type: 'expense',
    category: 'Healthcare',
    amount: 35,
    description: 'Pharmacy',
    date: '2024-12-12',
    isRecurring: false
  },
  {
    id: '10',
    type: 'expense',
    category: 'Groceries',
    amount: 92,
    description: 'Weekly grocery shopping',
    date: '2024-12-22',
    isRecurring: false
  },
  
  // November 2024
  {
    id: '11',
    type: 'income',
    category: 'Salary',
    amount: 3000,
    description: 'Monthly salary',
    date: '2024-11-01',
    isRecurring: true,
    recurringFrequency: 'monthly'
  },
  {
    id: '12',
    type: 'expense',
    category: 'Rent',
    amount: 1200,
    description: 'Monthly rent payment',
    date: '2024-11-01',
    isRecurring: true,
    recurringFrequency: 'monthly'
  },
  {
    id: '13',
    type: 'expense',
    category: 'Transport',
    amount: 120,
    description: 'Monthly travel card',
    date: '2024-11-01',
    isRecurring: true,
    recurringFrequency: 'monthly'
  },
  {
    id: '14',
    type: 'income',
    category: 'Dividends',
    amount: 75,
    description: 'Quarterly dividends',
    date: '2024-11-15',
    isRecurring: false
  },
  {
    id: '15',
    type: 'expense',
    category: 'Utilities',
    amount: 95,
    description: 'Gas bill',
    date: '2024-11-20',
    isRecurring: false
  },
  {
    id: '16',
    type: 'expense',
    category: 'Groceries',
    amount: 78,
    description: 'Weekly grocery shopping',
    date: '2024-11-10',
    isRecurring: false
  },
  {
    id: '17',
    type: 'expense',
    category: 'Entertainment',
    amount: 25,
    description: 'Netflix subscription',
    date: '2024-11-01',
    isRecurring: true,
    recurringFrequency: 'monthly'
  },
  {
    id: '18',
    type: 'expense',
    category: 'Healthcare',
    amount: 65,
    description: 'Doctor visit',
    date: '2024-11-18',
    isRecurring: false
  },
  {
    id: '19',
    type: 'expense',
    category: 'Entertainment',
    amount: 42,
    description: 'Cinema tickets',
    date: '2024-11-25',
    isRecurring: false
  },
  {
    id: '20',
    type: 'expense',
    category: 'Groceries',
    amount: 89,
    description: 'Weekly grocery shopping',
    date: '2024-11-24',
    isRecurring: false
  },

  // October 2024
  {
    id: '21',
    type: 'income',
    category: 'Salary',
    amount: 3000,
    description: 'Monthly salary',
    date: '2024-10-01',
    isRecurring: true,
    recurringFrequency: 'monthly'
  },
  {
    id: '22',
    type: 'expense',
    category: 'Rent',
    amount: 1200,
    description: 'Monthly rent payment',
    date: '2024-10-01',
    isRecurring: true,
    recurringFrequency: 'monthly'
  },
  {
    id: '23',
    type: 'expense',
    category: 'Transport',
    amount: 120,
    description: 'Monthly travel card',
    date: '2024-10-01',
    isRecurring: true,
    recurringFrequency: 'monthly'
  },
  {
    id: '24',
    type: 'expense',
    category: 'Entertainment',
    amount: 25,
    description: 'Netflix subscription',
    date: '2024-10-01',
    isRecurring: true,
    recurringFrequency: 'monthly'
  },
  {
    id: '25',
    type: 'expense',
    category: 'Groceries',
    amount: 82,
    description: 'Weekly grocery shopping',
    date: '2024-10-07',
    isRecurring: false
  },
  {
    id: '26',
    type: 'expense',
    category: 'Utilities',
    amount: 110,
    description: 'Water bill',
    date: '2024-10-15',
    isRecurring: false
  },
  {
    id: '27',
    type: 'income',
    category: 'Freelance',
    amount: 750,
    description: 'Logo design project',
    date: '2024-10-20',
    isRecurring: false
  },
  {
    id: '28',
    type: 'expense',
    category: 'Healthcare',
    amount: 45,
    description: 'Prescription',
    date: '2024-10-22',
    isRecurring: false
  },
  {
    id: '29',
    type: 'expense',
    category: 'Entertainment',
    amount: 38,
    description: 'Restaurant dinner',
    date: '2024-10-28',
    isRecurring: false
  },
  {
    id: '30',
    type: 'expense',
    category: 'Groceries',
    amount: 95,
    description: 'Weekly grocery shopping',
    date: '2024-10-29',
    isRecurring: false
  },

  // September 2024
  {
    id: '31',
    type: 'income',
    category: 'Salary',
    amount: 3000,
    description: 'Monthly salary',
    date: '2024-09-01',
    isRecurring: true,
    recurringFrequency: 'monthly'
  },
  {
    id: '32',
    type: 'expense',
    category: 'Rent',
    amount: 1200,
    description: 'Monthly rent payment',
    date: '2024-09-01',
    isRecurring: true,
    recurringFrequency: 'monthly'
  },
  {
    id: '33',
    type: 'expense',
    category: 'Transport',
    amount: 120,
    description: 'Monthly travel card',
    date: '2024-09-01',
    isRecurring: true,
    recurringFrequency: 'monthly'
  },
  {
    id: '34',
    type: 'expense',
    category: 'Entertainment',
    amount: 25,
    description: 'Netflix subscription',
    date: '2024-09-01',
    isRecurring: true,
    recurringFrequency: 'monthly'
  },
  {
    id: '35',
    type: 'expense',
    category: 'Groceries',
    amount: 88,
    description: 'Weekly grocery shopping',
    date: '2024-09-08',
    isRecurring: false
  },
  {
    id: '36',
    type: 'expense',
    category: 'Utilities',
    amount: 85,
    description: 'Electricity bill',
    date: '2024-09-12',
    isRecurring: false
  },
  {
    id: '37',
    type: 'income',
    category: 'Rental Income',
    amount: 800,
    description: 'Monthly rental income',
    date: '2024-09-01',
    isRecurring: true,
    recurringFrequency: 'monthly'
  },
  {
    id: '38',
    type: 'expense',
    category: 'Healthcare',
    amount: 55,
    description: 'Dental checkup',
    date: '2024-09-18',
    isRecurring: false
  },
  {
    id: '39',
    type: 'expense',
    category: 'Entertainment',
    amount: 65,
    description: 'Concert tickets',
    date: '2024-09-22',
    isRecurring: false
  },
  {
    id: '40',
    type: 'expense',
    category: 'Groceries',
    amount: 76,
    description: 'Weekly grocery shopping',
    date: '2024-09-29',
    isRecurring: false
  },

  // June 2025 (Future month for demonstration)
  {
    id: '41',
    type: 'income',
    category: 'Salary',
    amount: 3200,
    description: 'Monthly salary (projected)',
    date: '2025-06-01',
    isRecurring: true,
    recurringFrequency: 'monthly'
  },
  {
    id: '42',
    type: 'expense',
    category: 'Rent',
    amount: 1250,
    description: 'Monthly rent payment (projected)',
    date: '2025-06-01',
    isRecurring: true,
    recurringFrequency: 'monthly'
  },
  {
    id: '43',
    type: 'expense',
    category: 'Transport',
    amount: 130,
    description: 'Monthly travel card (projected)',
    date: '2025-06-01',
    isRecurring: true,
    recurringFrequency: 'monthly'
  },
  {
    id: '44',
    type: 'income',
    category: 'Rental Income',
    amount: 850,
    description: 'Monthly rental income (projected)',
    date: '2025-06-01',
    isRecurring: true,
    recurringFrequency: 'monthly'
  },
  {
    id: '45',
    type: 'expense',
    category: 'Entertainment',
    amount: 28,
    description: 'Streaming services (projected)',
    date: '2025-06-01',
    isRecurring: true,
    recurringFrequency: 'monthly'
  },

  // January 2025
  {
    id: '46',
    type: 'income',
    category: 'Salary',
    amount: 3100,
    description: 'Monthly salary (with raise)',
    date: '2025-01-01',
    isRecurring: true,
    recurringFrequency: 'monthly'
  },
  {
    id: '47',
    type: 'expense',
    category: 'Rent',
    amount: 1200,
    description: 'Monthly rent payment',
    date: '2025-01-01',
    isRecurring: true,
    recurringFrequency: 'monthly'
  },
  {
    id: '48',
    type: 'expense',
    category: 'Transport',
    amount: 125,
    description: 'Monthly travel card',
    date: '2025-01-01',
    isRecurring: true,
    recurringFrequency: 'monthly'
  },
  {
    id: '49',
    type: 'income',
    category: 'Rental Income',
    amount: 800,
    description: 'Monthly rental income',
    date: '2025-01-01',
    isRecurring: true,
    recurringFrequency: 'monthly'
  },
  {
    id: '50',
    type: 'expense',
    category: 'Entertainment',
    amount: 27,
    description: 'Streaming services',
    date: '2025-01-01',
    isRecurring: true,
    recurringFrequency: 'monthly'
  },
  {
    id: '51',
    type: 'expense',
    category: 'Groceries',
    amount: 95,
    description: 'New Year grocery shopping',
    date: '2025-01-02',
    isRecurring: false
  },
  {
    id: '52',
    type: 'expense',
    category: 'Healthcare',
    amount: 75,
    description: 'Annual health checkup',
    date: '2025-01-15',
    isRecurring: false
  },
  {
    id: '53',
    type: 'expense',
    category: 'Utilities',
    amount: 140,
    description: 'Winter heating bill',
    date: '2025-01-20',
    isRecurring: false
  },
  {
    id: '54',
    type: 'income',
    category: 'Freelance',
    amount: 600,
    description: 'Website maintenance',
    date: '2025-01-25',
    isRecurring: false
  },
  {
    id: '55',
    type: 'expense',
    category: 'Groceries',
    amount: 88,
    description: 'Weekly grocery shopping',
    date: '2025-01-28',
    isRecurring: false
  },
];

const categories = {
  income: ['Salary', 'Freelance', 'Dividends', 'Rental Income', 'Other'],
  expense: ['Rent', 'Groceries', 'Transport', 'Utilities', 'Entertainment', 'Healthcare', 'Insurance', 'Other']
};

const monthNames = [
  'January', 'February', 'March', 'April', 'May', 'June',
  'July', 'August', 'September', 'October', 'November', 'December'
];

export function TransactionsTab() {
  const [transactions, setTransactions] = useState<Transaction[]>(initialTransactions);
  const [showAddModal, setShowAddModal] = useState(false);
  const [editingTransaction, setEditingTransaction] = useState<Transaction | null>(null);
  const [filterType, setFilterType] = useState<'all' | 'income' | 'expense'>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [newTransaction, setNewTransaction] = useState({
    type: 'expense' as 'income' | 'expense',
    category: 'Other',
    amount: '',
    description: '',
    date: new Date().toISOString().split('T')[0],
    isRecurring: false,
    recurringFrequency: 'monthly' as 'weekly' | 'monthly' | 'yearly',
  });

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-GB', {
      style: 'currency',
      currency: 'GBP',
      minimumFractionDigits: 2,
    }).format(amount);
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-GB', {
      day: '2-digit',
      month: 'short',
      year: 'numeric'
    });
  };

  const formatMonthYear = (date: Date) => {
    return `${monthNames[date.getMonth()]} ${date.getFullYear()}`;
  };

  const navigateMonth = (direction: 'prev' | 'next') => {
    setSelectedDate(prevDate => {
      const newDate = new Date(prevDate);
      if (direction === 'prev') {
        newDate.setMonth(newDate.getMonth() - 1);
      } else {
        newDate.setMonth(newDate.getMonth() + 1);
      }
      return newDate;
    });
  };

  // Filter transactions by selected month and year
  const monthlyTransactions = useMemo(() => {
    return transactions.filter(transaction => {
      const transactionDate = new Date(transaction.date);
      return transactionDate.getMonth() === selectedDate.getMonth() &&
             transactionDate.getFullYear() === selectedDate.getFullYear();
    });
  }, [transactions, selectedDate]);

  // Apply additional filters to monthly transactions
  const filteredTransactions = useMemo(() => {
    return monthlyTransactions.filter(transaction => {
      const matchesType = filterType === 'all' || transaction.type === filterType;
      const matchesSearch = transaction.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
                           transaction.category.toLowerCase().includes(searchQuery.toLowerCase());
      return matchesType && matchesSearch;
    });
  }, [monthlyTransactions, filterType, searchQuery]);

  // Calculate monthly totals
  const monthlyTotals = useMemo(() => {
    const income = monthlyTransactions
      .filter(t => t.type === 'income')
      .reduce((sum, t) => sum + t.amount, 0);
    const expenses = monthlyTransactions
      .filter(t => t.type === 'expense')
      .reduce((sum, t) => sum + t.amount, 0);
    return { income, expenses, savings: income - expenses };
  }, [monthlyTransactions]);

  // Group transactions by date for better organization
  const groupedTransactions = useMemo(() => {
    const groups: { [key: string]: Transaction[] } = {};
    filteredTransactions.forEach(transaction => {
      const dateKey = transaction.date;
      if (!groups[dateKey]) {
        groups[dateKey] = [];
      }
      groups[dateKey].push(transaction);
    });
    
    // Sort dates in descending order
    const sortedDates = Object.keys(groups).sort((a, b) => 
      new Date(b).getTime() - new Date(a).getTime()
    );
    
    return sortedDates.map(date => ({
      date,
      transactions: groups[date].sort((a, b) => 
        new Date(b.date).getTime() - new Date(a.date).getTime()
      )
    }));
  }, [filteredTransactions]);

  const handleAddTransaction = () => {
    if (!newTransaction.amount || parseFloat(newTransaction.amount) <= 0) {
      Alert.alert('Error', 'Please enter a valid amount');
      return;
    }

    if (!newTransaction.description.trim()) {
      Alert.alert('Error', 'Please enter a description');
      return;
    }

    const transaction: Transaction = {
      id: editingTransaction?.id || Date.now().toString(),
      type: newTransaction.type,
      category: newTransaction.category,
      amount: parseFloat(newTransaction.amount),
      description: newTransaction.description.trim(),
      date: newTransaction.date,
      isRecurring: newTransaction.isRecurring,
      recurringFrequency: newTransaction.isRecurring ? newTransaction.recurringFrequency : undefined,
    };

    if (editingTransaction) {
      setTransactions(prev => prev.map(t => t.id === editingTransaction.id ? transaction : t));
    } else {
      setTransactions(prev => [...prev, transaction]);
    }

    // Reset form
    setNewTransaction({
      type: 'expense',
      category: 'Other',
      amount: '',
      description: '',
      date: new Date().toISOString().split('T')[0],
      isRecurring: false,
      recurringFrequency: 'monthly',
    });
    setEditingTransaction(null);
    setShowAddModal(false);
    Alert.alert('Success', `Transaction ${editingTransaction ? 'updated' : 'added'} successfully`);
  };

  const handleEditTransaction = (transaction: Transaction) => {
    setEditingTransaction(transaction);
    setNewTransaction({
      type: transaction.type,
      category: transaction.category,
      amount: transaction.amount.toString(),
      description: transaction.description,
      date: transaction.date,
      isRecurring: transaction.isRecurring,
      recurringFrequency: transaction.recurringFrequency || 'monthly',
    });
    setShowAddModal(true);
  };

  const handleDeleteTransaction = (transactionId: string) => {
    Alert.alert(
      'Delete Transaction',
      'Are you sure you want to delete this transaction?',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Delete',
          style: 'destructive',
          onPress: () => {
            setTransactions(prev => prev.filter(t => t.id !== transactionId));
            Alert.alert('Success', 'Transaction deleted successfully');
          }
        }
      ]
    );
  };

  return (
    <View style={styles.container}>
      {/* Month Navigation Header */}
      <View style={styles.monthNavigationContainer}>
        <LinearGradient
          colors={['#7C3AED', '#A855F7']}
          style={styles.monthNavigationGradient}
        >
          <View style={styles.monthNavigationContent}>
            <TouchableOpacity
              style={styles.monthNavButton}
              onPress={() => navigateMonth('prev')}
            >
              <ChevronLeft size={24} color="#FFFFFF" />
            </TouchableOpacity>
            
            <View style={styles.monthDisplayContainer}>
              <Calendar size={20} color="#FFFFFF" />
              <Text style={styles.monthDisplayText}>
                {formatMonthYear(selectedDate)}
              </Text>
            </View>
            
            <TouchableOpacity
              style={styles.monthNavButton}
              onPress={() => navigateMonth('next')}
            >
              <ChevronRight size={24} color="#FFFFFF" />
            </TouchableOpacity>
          </View>
        </LinearGradient>
      </View>

      {/* Monthly Overview Cards */}
      <View style={styles.monthlyOverviewSection}>
        <View style={styles.overviewGrid}>
          <View style={styles.overviewCard}>
            <LinearGradient colors={['#059669', '#10B981']} style={styles.overviewGradient}>
              <TrendingUp size={20} color="#FFFFFF" />
              <Text style={styles.overviewLabel}>Income</Text>
              <Text style={styles.overviewValue}>{formatCurrency(monthlyTotals.income)}</Text>
            </LinearGradient>
          </View>
          
          <View style={styles.overviewCard}>
            <LinearGradient colors={['#DC2626', '#EF4444']} style={styles.overviewGradient}>
              <TrendingDown size={20} color="#FFFFFF" />
              <Text style={styles.overviewLabel}>Expenses</Text>
              <Text style={styles.overviewValue}>{formatCurrency(monthlyTotals.expenses)}</Text>
            </LinearGradient>
          </View>
          
          <View style={styles.overviewCard}>
            <LinearGradient 
              colors={monthlyTotals.savings >= 0 ? ['#7C3AED', '#A855F7'] : ['#F59E0B', '#D97706']} 
              style={styles.overviewGradient}
            >
              <BarChart3 size={20} color="#FFFFFF" />
              <Text style={styles.overviewLabel}>
                {monthlyTotals.savings >= 0 ? 'Savings' : 'Deficit'}
              </Text>
              <Text style={styles.overviewValue}>
                {monthlyTotals.savings >= 0 ? '+' : ''}{formatCurrency(monthlyTotals.savings)}
              </Text>
            </LinearGradient>
          </View>
        </View>
      </View>

      {/* Controls */}
      <View style={styles.controlsSection}>
        <View style={styles.searchContainer}>
          <Search size={20} color="#6B7280" />
          <TextInput
            style={styles.searchInput}
            value={searchQuery}
            onChangeText={setSearchQuery}
            placeholder="Search transactions..."
            placeholderTextColor="#9CA3AF"
          />
        </View>

        <View style={styles.filtersContainer}>
          {['all', 'income', 'expense'].map((type) => (
            <TouchableOpacity
              key={type}
              style={[
                styles.filterButton,
                filterType === type && styles.activeFilterButton
              ]}
              onPress={() => setFilterType(type as any)}
            >
              <Text style={[
                styles.filterButtonText,
                filterType === type && styles.activeFilterButtonText
              ]}>
                {type.charAt(0).toUpperCase() + type.slice(1)}
              </Text>
            </TouchableOpacity>
          ))}
        </View>

        <TouchableOpacity
          style={styles.addTransactionButton}
          onPress={() => {
            setEditingTransaction(null);
            setNewTransaction({
              type: 'expense',
              category: 'Other',
              amount: '',
              description: '',
              date: new Date().toISOString().split('T')[0],
              isRecurring: false,
              recurringFrequency: 'monthly',
            });
            setShowAddModal(true);
          }}
        >
          <LinearGradient
            colors={['#7C3AED', '#A855F7']}
            style={styles.addTransactionGradient}
          >
            <Plus size={20} color="#FFFFFF" />
            <Text style={styles.addTransactionText}>Add Transaction</Text>
          </LinearGradient>
        </TouchableOpacity>
      </View>

      {/* Transactions List */}
      <ScrollView style={styles.transactionsList} showsVerticalScrollIndicator={false}>
        <Text style={styles.sectionTitle}>
          Transactions for {formatMonthYear(selectedDate)}
        </Text>
        
        {groupedTransactions.length === 0 ? (
          <View style={styles.emptyState}>
            <Calendar size={48} color="#D1D5DB" />
            <Text style={styles.emptyStateText}>No transactions found</Text>
            <Text style={styles.emptyStateSubtext}>
              {searchQuery 
                ? 'Try adjusting your search or filters' 
                : `No transactions recorded for ${formatMonthYear(selectedDate)}`
              }
            </Text>
          </View>
        ) : (
          groupedTransactions.map((group) => (
            <View key={group.date} style={styles.dateGroup}>
              <View style={styles.dateHeader}>
                <Text style={styles.dateHeaderText}>{formatDate(group.date)}</Text>
                <View style={styles.dateHeaderLine} />
              </View>
              
              {group.transactions.map((transaction) => (
                <View key={transaction.id} style={styles.transactionCard}>
                  <View style={styles.transactionMain}>
                    <View style={styles.transactionLeft}>
                      <View style={[
                        styles.transactionTypeIndicator,
                        { backgroundColor: transaction.type === 'income' ? '#059669' : '#DC2626' }
                      ]}>
                        {transaction.type === 'income' ? 
                          <TrendingUp size={16} color="#FFFFFF" /> : 
                          <TrendingDown size={16} color="#FFFFFF" />
                        }
                      </View>
                      <View style={styles.transactionDetails}>
                        <Text style={styles.transactionDescription}>{transaction.description}</Text>
                        <View style={styles.transactionMeta}>
                          <Text style={styles.transactionCategory}>{transaction.category}</Text>
                          {transaction.isRecurring && (
                            <View style={styles.recurringBadge}>
                              <Repeat size={12} color="#7C3AED" />
                              <Text style={styles.recurringText}>{transaction.recurringFrequency}</Text>
                            </View>
                          )}
                        </View>
                      </View>
                    </View>
                    
                    <View style={styles.transactionRight}>
                      <Text style={[
                        styles.transactionAmount,
                        { color: transaction.type === 'income' ? '#059669' : '#DC2626' }
                      ]}>
                        {transaction.type === 'income' ? '+' : '-'}{formatCurrency(transaction.amount)}
                      </Text>
                      <View style={styles.transactionActions}>
                        <TouchableOpacity
                          style={styles.actionButton}
                          onPress={() => handleEditTransaction(transaction)}
                        >
                          <Edit3 size={14} color="#6B7280" />
                        </TouchableOpacity>
                        <TouchableOpacity
                          style={styles.actionButton}
                          onPress={() => handleDeleteTransaction(transaction.id)}
                        >
                          <Trash2 size={14} color="#DC2626" />
                        </TouchableOpacity>
                      </View>
                    </View>
                  </View>
                </View>
              ))}
            </View>
          ))
        )}
      </ScrollView>

      {/* Add/Edit Transaction Modal */}
      <Modal
        visible={showAddModal}
        animationType="slide"
        presentationStyle="pageSheet"
        onRequestClose={() => setShowAddModal(false)}
      >
        <SafeAreaView style={styles.modalContainer}>
          <View style={styles.modalHeader}>
            <Text style={styles.modalTitle}>
              {editingTransaction ? 'Edit Transaction' : 'Add Transaction'}
            </Text>
            <TouchableOpacity
              style={styles.modalCloseButton}
              onPress={() => setShowAddModal(false)}
            >
              <X size={24} color="#6B7280" />
            </TouchableOpacity>
          </View>

          <ScrollView style={styles.modalContent}>
            {/* Transaction Type */}
            <View style={styles.inputGroup}>
              <Text style={styles.inputLabel}>Transaction Type</Text>
              <View style={styles.typeSelector}>
                <TouchableOpacity
                  style={[
                    styles.typeButton,
                    newTransaction.type === 'income' && styles.activeTypeButton
                  ]}
                  onPress={() => setNewTransaction(prev => ({ 
                    ...prev, 
                    type: 'income',
                    category: categories.income[0]
                  }))}
                >
                  <TrendingUp size={16} color={newTransaction.type === 'income' ? '#FFFFFF' : '#059669'} />
                  <Text style={[
                    styles.typeButtonText,
                    newTransaction.type === 'income' && styles.activeTypeButtonText
                  ]}>
                    Income
                  </Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={[
                    styles.typeButton,
                    newTransaction.type === 'expense' && styles.activeTypeButton
                  ]}
                  onPress={() => setNewTransaction(prev => ({ 
                    ...prev, 
                    type: 'expense',
                    category: categories.expense[0]
                  }))}
                >
                  <TrendingDown size={16} color={newTransaction.type === 'expense' ? '#FFFFFF' : '#DC2626'} />
                  <Text style={[
                    styles.typeButtonText,
                    newTransaction.type === 'expense' && styles.activeTypeButtonText
                  ]}>
                    Expense
                  </Text>
                </TouchableOpacity>
              </View>
            </View>

            {/* Category */}
            <View style={styles.inputGroup}>
              <Text style={styles.inputLabel}>Category</Text>
              <View style={styles.categoryGrid}>
                {categories[newTransaction.type].map((category) => (
                  <TouchableOpacity
                    key={category}
                    style={[
                      styles.categoryButton,
                      newTransaction.category === category && styles.activeCategoryButton
                    ]}
                    onPress={() => setNewTransaction(prev => ({ ...prev, category }))}
                  >
                    <Text style={[
                      styles.categoryButtonText,
                      newTransaction.category === category && styles.activeCategoryButtonText
                    ]}>
                      {category}
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>
            </View>

            {/* Amount */}
            <View style={styles.inputGroup}>
              <Text style={styles.inputLabel}>Amount (£)</Text>
              <TextInput
                style={styles.input}
                value={newTransaction.amount}
                onChangeText={(value) => setNewTransaction(prev => ({ ...prev, amount: value }))}
                placeholder="0.00"
                keyboardType="numeric"
                placeholderTextColor="#9CA3AF"
              />
            </View>

            {/* Description */}
            <View style={styles.inputGroup}>
              <Text style={styles.inputLabel}>Description</Text>
              <TextInput
                style={styles.input}
                value={newTransaction.description}
                onChangeText={(value) => setNewTransaction(prev => ({ ...prev, description: value }))}
                placeholder="Enter description..."
                placeholderTextColor="#9CA3AF"
              />
            </View>

            {/* Date */}
            <View style={styles.inputGroup}>
              <Text style={styles.inputLabel}>Date</Text>
              <View style={styles.dateContainer}>
                <Calendar size={20} color="#6B7280" />
                <TextInput
                  style={styles.dateInput}
                  value={newTransaction.date}
                  onChangeText={(value) => setNewTransaction(prev => ({ ...prev, date: value }))}
                  placeholder="YYYY-MM-DD"
                  placeholderTextColor="#9CA3AF"
                />
              </View>
            </View>

            {/* Recurring */}
            <View style={styles.inputGroup}>
              <View style={styles.recurringContainer}>
                <TouchableOpacity
                  style={styles.recurringToggle}
                  onPress={() => setNewTransaction(prev => ({ ...prev, isRecurring: !prev.isRecurring }))}
                >
                  <View style={[
                    styles.recurringCheckbox,
                    newTransaction.isRecurring && styles.recurringCheckboxActive
                  ]}>
                    {newTransaction.isRecurring && <Text style={styles.recurringCheckmark}>✓</Text>}
                  </View>
                  <Text style={styles.recurringLabel}>Recurring Transaction</Text>
                </TouchableOpacity>
              </View>

              {newTransaction.isRecurring && (
                <View style={styles.frequencyContainer}>
                  <Text style={styles.frequencyLabel}>Frequency</Text>
                  <View style={styles.frequencyButtons}>
                    {['weekly', 'monthly', 'yearly'].map((freq) => (
                      <TouchableOpacity
                        key={freq}
                        style={[
                          styles.frequencyButton,
                          newTransaction.recurringFrequency === freq && styles.activeFrequencyButton
                        ]}
                        onPress={() => setNewTransaction(prev => ({ 
                          ...prev, 
                          recurringFrequency: freq as 'weekly' | 'monthly' | 'yearly'
                        }))}
                      >
                        <Text style={[
                          styles.frequencyButtonText,
                          newTransaction.recurringFrequency === freq && styles.activeFrequencyButtonText
                        ]}>
                          {freq.charAt(0).toUpperCase() + freq.slice(1)}
                        </Text>
                      </TouchableOpacity>
                    ))}
                  </View>
                </View>
              )}
            </View>
          </ScrollView>

          <View style={styles.modalFooter}>
            <TouchableOpacity
              style={styles.modalCancelButton}
              onPress={() => setShowAddModal(false)}
            >
              <Text style={styles.modalCancelText}>Cancel</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.modalSaveButton}
              onPress={handleAddTransaction}
            >
              <LinearGradient
                colors={['#7C3AED', '#A855F7']}
                style={styles.modalSaveGradient}
              >
                <Save size={16} color="#FFFFFF" />
                <Text style={styles.modalSaveText}>
                  {editingTransaction ? 'Update' : 'Add'} Transaction
                </Text>
              </LinearGradient>
            </TouchableOpacity>
          </View>
        </SafeAreaView>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: 20,
    paddingBottom: 32,
  },
  monthNavigationContainer: {
    marginBottom: 20,
    borderRadius: 16,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 12,
    elevation: 6,
  },
  monthNavigationGradient: {
    paddingVertical: 20,
    paddingHorizontal: 24,
  },
  monthNavigationContent: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  monthNavButton: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  monthDisplayContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    backgroundColor: 'rgba(255, 255, 255, 0.15)',
    paddingHorizontal: 20,
    paddingVertical: 12,
    borderRadius: 12,
  },
  monthDisplayText: {
    fontSize: 18,
    fontWeight: '700',
    color: '#FFFFFF',
  },
  monthlyOverviewSection: {
    marginBottom: 24,
  },
  overviewGrid: {
    flexDirection: 'row',
    gap: 12,
  },
  overviewCard: {
    flex: 1,
    borderRadius: 12,
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
    gap: 4,
  },
  overviewLabel: {
    fontSize: 12,
    color: 'rgba(255, 255, 255, 0.8)',
    fontWeight: '500',
  },
  overviewValue: {
    fontSize: 16,
    fontWeight: '700',
    color: '#FFFFFF',
  },
  controlsSection: {
    marginBottom: 24,
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 12,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
    gap: 12,
  },
  searchInput: {
    flex: 1,
    fontSize: 16,
    color: '#111827',
  },
  filtersContainer: {
    flexDirection: 'row',
    gap: 8,
    marginBottom: 16,
  },
  filterButton: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    backgroundColor: '#F3F4F6',
  },
  activeFilterButton: {
    backgroundColor: '#7C3AED',
  },
  filterButtonText: {
    fontSize: 14,
    fontWeight: '500',
    color: '#6B7280',
  },
  activeFilterButtonText: {
    color: '#FFFFFF',
  },
  addTransactionButton: {
    borderRadius: 12,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  addTransactionGradient: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 16,
    gap: 8,
  },
  addTransactionText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#FFFFFF',
  },
  transactionsList: {
    flex: 1,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: '600',
    color: '#111827',
    marginBottom: 20,
  },
  emptyState: {
    alignItems: 'center',
    paddingVertical: 60,
    gap: 12,
  },
  emptyStateText: {
    fontSize: 18,
    fontWeight: '600',
    color: '#6B7280',
  },
  emptyStateSubtext: {
    fontSize: 14,
    color: '#9CA3AF',
    textAlign: 'center',
    maxWidth: 280,
    lineHeight: 20,
  },
  dateGroup: {
    marginBottom: 24,
  },
  dateHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
    gap: 12,
  },
  dateHeaderText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#7C3AED',
    minWidth: 100,
  },
  dateHeaderLine: {
    flex: 1,
    height: 1,
    backgroundColor: '#E5E7EB',
  },
  transactionCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 16,
    marginBottom: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  transactionMain: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  transactionLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
    gap: 12,
  },
  transactionTypeIndicator: {
    width: 40,
    height: 40,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
  },
  transactionDetails: {
    flex: 1,
  },
  transactionDescription: {
    fontSize: 16,
    fontWeight: '600',
    color: '#111827',
    marginBottom: 4,
  },
  transactionMeta: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 2,
  },
  transactionCategory: {
    fontSize: 14,
    color: '#6B7280',
  },
  recurringBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#EDE9FE',
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 8,
    gap: 4,
  },
  recurringText: {
    fontSize: 10,
    color: '#7C3AED',
    fontWeight: '500',
  },
  transactionRight: {
    alignItems: 'flex-end',
  },
  transactionAmount: {
    fontSize: 16,
    fontWeight: '700',
    marginBottom: 8,
  },
  transactionActions: {
    flexDirection: 'row',
    gap: 8,
  },
  actionButton: {
    padding: 6,
    borderRadius: 6,
    backgroundColor: '#F3F4F6',
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
  inputGroup: {
    marginBottom: 20,
  },
  inputLabel: {
    fontSize: 16,
    fontWeight: '500',
    color: '#374151',
    marginBottom: 8,
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
    backgroundColor: '#7C3AED',
    borderColor: '#7C3AED',
  },
  typeButtonText: {
    fontSize: 14,
    fontWeight: '500',
    color: '#374151',
  },
  activeTypeButtonText: {
    color: '#FFFFFF',
  },
  categoryGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  categoryButton: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderWidth: 1,
    borderColor: '#D1D5DB',
    borderRadius: 20,
    marginBottom: 8,
  },
  activeCategoryButton: {
    backgroundColor: '#7C3AED',
    borderColor: '#7C3AED',
  },
  categoryButtonText: {
    fontSize: 14,
    color: '#374151',
  },
  activeCategoryButtonText: {
    color: '#FFFFFF',
  },
  dateContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#D1D5DB',
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 12,
    backgroundColor: '#FFFFFF',
    gap: 12,
  },
  dateInput: {
    flex: 1,
    fontSize: 16,
    color: '#111827',
  },
  recurringContainer: {
    marginBottom: 16,
  },
  recurringToggle: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  recurringCheckbox: {
    width: 20,
    height: 20,
    borderWidth: 2,
    borderColor: '#D1D5DB',
    borderRadius: 4,
    alignItems: 'center',
    justifyContent: 'center',
  },
  recurringCheckboxActive: {
    backgroundColor: '#7C3AED',
    borderColor: '#7C3AED',
  },
  recurringCheckmark: {
    color: '#FFFFFF',
    fontSize: 12,
    fontWeight: '600',
  },
  recurringLabel: {
    fontSize: 16,
    color: '#374151',
  },
  frequencyContainer: {
    marginTop: 16,
  },
  frequencyLabel: {
    fontSize: 14,
    fontWeight: '500',
    color: '#374151',
    marginBottom: 8,
  },
  frequencyButtons: {
    flexDirection: 'row',
    gap: 8,
  },
  frequencyButton: {
    flex: 1,
    paddingVertical: 8,
    borderWidth: 1,
    borderColor: '#D1D5DB',
    borderRadius: 8,
    alignItems: 'center',
  },
  activeFrequencyButton: {
    backgroundColor: '#7C3AED',
    borderColor: '#7C3AED',
  },
  frequencyButtonText: {
    fontSize: 14,
    color: '#374151',
  },
  activeFrequencyButtonText: {
    color: '#FFFFFF',
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
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
  },
  modalSaveText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#FFFFFF',
  },
});