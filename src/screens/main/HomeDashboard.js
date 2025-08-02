import React, { useState } from 'react';
import { 
  View, 
  StyleSheet, 
  ScrollView, 
  Dimensions,
  TouchableOpacity
} from 'react-native';
import { 
  Layout, 
  Text, 
  Button,
  TopNavigation
} from '@ui-kitten/components';
import { Ionicons } from '@expo/vector-icons';
import { PieChart } from 'react-native-chart-kit';
import { useExpenseStore, useBudgetStore } from '../../store';
import AddExpenseModal from '../../components/AddExpenseModal';

const { width } = Dimensions.get('window');

export default function HomeDashboard({ navigation }) {
  const [showAddExpense, setShowAddExpense] = useState(false);
  
  const { totalSpent, getExpensesByCategory } = useExpenseStore();
  const { getBudgetSummary } = useBudgetStore();
  
  const categoryData = getExpensesByCategory().filter(item => item.total > 0);
  const budgetSummary = getBudgetSummary();

  // Sample data for demonstration (matching the reference design)
  const sampleExpenseData = [
    { name: 'Food', amount: 450, color: '#FF6B8A' },
    { name: 'Transport', amount: 200, color: '#4F9CF9' },
    { name: 'Shopping', amount: 300, color: '#36C5F0' },
    { name: 'Utilities', amount: 150, color: '#F59E0B' },
    { name: 'Others', amount: 150, color: '#8B5CF6' },
  ];

  const sampleBudgetData = [
    { name: 'Housing', spent: 1053, limit: 1000, color: '#FF4757' },
    { name: 'Transport', spent: 70, limit: 200, color: '#FFA726' },
    { name: 'Food', spent: 195, limit: 400, color: '#FFA726' },
    { name: 'Entertainment', spent: 80, limit: 150, color: '#FFA726' },
  ];

  const displayData = categoryData.length > 0 ? categoryData.map((item, index) => ({
    name: item.category,
    amount: item.total,
    color: sampleExpenseData[index % sampleExpenseData.length]?.color || '#8B5CF6'
  })) : sampleExpenseData;

  const totalAmount = displayData.reduce((sum, item) => sum + item.amount, 0);

  const pieChartData = displayData.map(item => ({
    name: item.name,
    population: item.amount,
    color: item.color,
    legendFocusOnPress: false,
  }));

  const chartConfig = {
    backgroundGradientFrom: '#ffffff',
    backgroundGradientTo: '#ffffff',
    color: (opacity = 1) => `rgba(0, 0, 0, ${opacity})`,
    strokeWidth: 2,
    barPercentage: 0.5,
    useShadowColorFromDataset: false
  };

  return (
    <Layout style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity>
          <Ionicons name="notifications-outline" size={24} color="#6B7280" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>FinPath</Text>
        <TouchableOpacity onPress={() => navigation.navigate('SocialTab', { screen: 'Profile' })}>
          <View style={styles.profileButton}>
            <Text style={styles.profileInitial}>A</Text>
          </View>
        </TouchableOpacity>
      </View>
      
      <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
        {/* Spending Overview Section */}
        <View style={styles.sectionContainer}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Spending Overview</Text>
            <TouchableOpacity style={styles.dropdown}>
              <Text style={styles.dropdownText}>This Month</Text>
              <Ionicons name="chevron-down" size={16} color="#9CA3AF" />
            </TouchableOpacity>
          </View>

          {/* Doughnut Chart */}
          <View style={styles.chartContainer}>
            <View style={styles.chartWrapper}>
              <PieChart
                data={pieChartData}
                width={210}
                height={210}
                chartConfig={chartConfig}
                accessor="population"
                backgroundColor="transparent"
                paddingLeft="53"
                center={[0, 0]}
                absolute={false}
                hasLegend={false}
                avoidFalseZero={true}
              />
              {/* White center overlay for doughnut effect */}
              <View style={styles.doughnutOverlay}>
                <View style={styles.chartCenter}>
                  <Text style={styles.chartCenterLabel}>Total Spent</Text>
                  <Text style={styles.chartCenterAmount}>${totalAmount.toLocaleString()}</Text>
                </View>
              </View>
            </View>
          </View>

          {/* Category Legend */}
          <View style={styles.categoryLegend}>
            {displayData.map((item, index) => (
              <View key={index} style={styles.legendItem}>
                <View style={styles.legendLeft}>
                  <View style={[styles.legendDot, { backgroundColor: item.color }]} />
                  <Text style={styles.legendLabel}>{item.name}</Text>
                </View>
                <Text style={styles.legendAmount}>${item.amount}</Text>
              </View>
            ))}
          </View>

          <Button
            style={styles.addExpenseButton}
            onPress={() => setShowAddExpense(true)}
          >
            <Ionicons name="add" size={16} color="white" style={styles.buttonIcon} />
            <Text style={styles.buttonText}>Add Expense</Text>
          </Button>
        </View>

        {/* Budget Overview Section */}
        <View style={styles.sectionContainer}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Budget Overview</Text>
            <TouchableOpacity style={styles.dropdown}>
              <Text style={styles.dropdownText}>This Month</Text>
              <Ionicons name="chevron-down" size={16} color="#9CA3AF" />
            </TouchableOpacity>
          </View>

          {/* Budget Items */}
          <View style={styles.budgetList}>
            {sampleBudgetData.map((budget, index) => {
              const percentage = (budget.spent / budget.limit) * 100;
              const isOverBudget = percentage > 100;
              return (
                <View key={index} style={styles.budgetItem}>
                  <View style={styles.budgetHeader}>
                    <Text style={styles.budgetCategory}>{budget.name}</Text>
                    <TouchableOpacity>
                      <Ionicons name="chevron-down" size={16} color="#9CA3AF" />
                    </TouchableOpacity>
                  </View>
                  <Text style={styles.budgetAmount}>
                    ${budget.spent} / ${budget.limit}
                  </Text>
                  <View style={styles.progressBarContainer}>
                    <View style={styles.progressBar}>
                      <View 
                        style={[
                          styles.progressFill, 
                          { 
                            width: `${Math.min(percentage, 100)}%`,
                            backgroundColor: isOverBudget ? '#FF4757' : '#FFA726'
                          }
                        ]} 
                      />
                    </View>
                  </View>
                </View>
              );
            })}
          </View>

          <Button
            style={styles.addBudgetButton}
            appearance="outline"
            onPress={() => navigation.navigate('BudgetManagement')}
          >
            <Ionicons name="add" size={16} color="#6366F1" style={styles.buttonIcon} />
            <Text style={styles.outlineButtonText}>Add Budget</Text>
          </Button>
        </View>
      </ScrollView>

      <AddExpenseModal 
        visible={showAddExpense}
        onClose={() => setShowAddExpense(false)}
      />
    </Layout>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 16,
    backgroundColor: '#FFFFFF',
    borderBottomWidth: 1,
    borderBottomColor: '#E5E5E5',
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: '600',
    color: '#000000',
  },
  profileButton: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: '#FF6B35',
    justifyContent: 'center',
    alignItems: 'center',
  },
  profileInitial: {
    color: 'white',
    fontSize: 14,
    fontWeight: '600',
  },
  scrollView: {
    flex: 1,
    paddingHorizontal: 20,
    paddingTop: 20,
  },
  sectionContainer: {
    marginBottom: 32,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#000000',
  },
  card: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 20,
    marginBottom: 20,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 24,
  },
  cardTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#000000',
  },
  dropdown: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  dropdownText: {
    fontSize: 14,
    color: '#9CA3AF',
    marginRight: 4,
  },
  chartContainer: {
    alignItems: 'center',
    marginBottom: 24,
  },
  chartWrapper: {
    position: 'relative',
    alignItems: 'center',
    height: 220,
    width: 220,
    justifyContent: 'center',
  },
  doughnutOverlay: {
    position: 'absolute',
    top: 60,
    left: 60,
    width: 100,
    height: 100,
    borderRadius: 50,
    backgroundColor: '#FFFFFF',
    justifyContent: 'center',
    alignItems: 'center',
  },
  chartCenter: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  chartCenterLabel: {
    fontSize: 12,
    color: '#9CA3AF',
    marginBottom: 4,
  },
  chartCenterAmount: {
    fontSize: 24,
    fontWeight: '700',
    color: '#000000',
  },
  categoryLegend: {
    marginBottom: 24,
  },
  legendItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 8,
  },
  legendLeft: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  legendDot: {
    width: 12,
    height: 12,
    borderRadius: 6,
    marginRight: 12,
  },
  legendLabel: {
    fontSize: 14,
    color: '#374151',
  },
  legendAmount: {
    fontSize: 14,
    fontWeight: '600',
    color: '#000000',
  },
  addExpenseButton: {
    backgroundColor: '#6366F1',
    borderRadius: 12,
    paddingVertical: 16,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 0,
  },
  addBudgetButton: {
    borderColor: '#6366F1',
    borderRadius: 12,
    paddingVertical: 16,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'transparent',
  },
  buttonIcon: {
    marginRight: 8,
  },
  buttonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '600',
  },
  outlineButtonText: {
    color: '#6366F1',
    fontSize: 16,
    fontWeight: '600',
  },
  budgetList: {
    marginBottom: 24,
  },
  budgetItem: {
    marginBottom: 20,
  },
  budgetHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  budgetCategory: {
    fontSize: 16,
    fontWeight: '500',
    color: '#000000',
  },
  budgetAmount: {
    fontSize: 14,
    color: '#6B7280',
    marginBottom: 12,
  },
  progressBarContainer: {
    marginBottom: 4,
  },
  progressBar: {
    height: 8,
    backgroundColor: '#F3F4F6',
    borderRadius: 4,
    overflow: 'hidden',
  },
  progressFill: {
    height: '100%',
    borderRadius: 4,
  },
});
