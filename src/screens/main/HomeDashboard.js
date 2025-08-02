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
  Card, 
  Button,
  TopNavigation,
  TopNavigationAction 
} from '@ui-kitten/components';
import { Ionicons } from '@expo/vector-icons';
import { PieChart } from 'react-native-chart-kit';
import { useExpenseStore, useGameStore, useBudgetStore } from '../../store';
import AddExpenseModal from '../../components/AddExpenseModal';

const { width, height } = Dimensions.get('window');

const MenuIcon = (props) => <Ionicons name="menu-outline" size={24} color="#8F9BB3" />;
const PlusIcon = (props) => <Ionicons name="add-outline" size={24} color="white" />;
const GameIcon = (props) => <Ionicons name="grid-outline" size={24} color="#8F9BB3" />;
const ChatIcon = (props) => <Ionicons name="chatbubble-outline" size={24} color="#8F9BB3" />;
const ChevronIcon = (props) => <Ionicons name="chevron-down" size={16} color="#8F9BB3" />;
const WarningIcon = (props) => <Ionicons name="warning" size={16} color="#E74C3C" />;

export default function HomeDashboard({ navigation }) {
  const [showAddExpense, setShowAddExpense] = useState(false);
  const [expandedBudgets, setExpandedBudgets] = useState(false);
  
  const { totalSpent, getExpensesByCategory } = useExpenseStore();
  const { level, xp } = useGameStore();
  const { getBudgetSummary } = useBudgetStore();
  
  const categoryData = getExpensesByCategory().filter(item => item.total > 0);
  const budgetSummary = getBudgetSummary();
  const overBudgetCategories = budgetSummary.filter(b => b.isOverBudget);

  // Prepare chart data - smaller size for better half-screen visibility
  const chartColors = ['#FF6384', '#36A2EB', '#FFCE56', '#4BC0C0', '#9966FF', '#FF9F40'];
  const pieChartData = categoryData.map((item, index) => ({
    name: item.category,
    amount: item.total,
    color: chartColors[index % chartColors.length],
    legendFontColor: '#222B45',
    legendFontSize: 10,
  }));

  const chartConfig = {
    backgroundColor: '#ffffff',
    backgroundGradientFrom: '#ffffff',
    backgroundGradientTo: '#ffffff',
    color: (opacity = 1) => `rgba(34, 43, 69, ${opacity})`,
    labelColor: (opacity = 1) => `rgba(34, 43, 69, ${opacity})`,
    strokeWidth: 2,
    barPercentage: 0.5,
    useShadowColorFromDataset: false,
  };

  const renderMenuAction = () => (
    <TopNavigationAction 
      icon={MenuIcon} 
      onPress={() => navigation.navigate('Profile')} 
    />
  );

  // Priority Alert Bar - shows budget overages at the top
  const PriorityAlerts = () => {
    if (overBudgetCategories.length === 0) return null;
    
    return (
      <Card style={styles.alertCard}>
        <View style={styles.alertContent}>
          <WarningIcon />
          <Text category='s2' style={styles.alertText}>
            {overBudgetCategories.length} budget{overBudgetCategories.length > 1 ? 's' : ''} over limit
          </Text>
          <TouchableOpacity onPress={() => navigation.navigate('BudgetManagement')}>
            <Text category='s2' style={styles.alertAction}>View</Text>
          </TouchableOpacity>
        </View>
      </Card>
    );
  };

  // AI Tip with compact design
  const CompactTipCard = () => (
    <Card style={styles.compactTipCard}>
      <View style={styles.tipContent}>
        <View style={styles.tipIcon}>
          <Ionicons name="bulb-outline" size={16} color="#FFD700" />
        </View>
        <Text category='s2' style={styles.tipText}>
          💡 Try setting a daily spending limit to stay on track!
        </Text>
      </View>
    </Card>
  );

  // Spending Summary with prominent total
  const SpendingSummary = () => (
    <View style={styles.spendingSummary}>
      <Text category='h3' style={styles.totalAmount}>${totalSpent.toFixed(2)}</Text>
      <Text category='s1' style={styles.totalLabel}>This Month's Spending</Text>
      {overBudgetCategories.length > 0 && (
        <Text category='c2' style={styles.overBudgetNote}>
          Over budget in {overBudgetCategories.length} categor{overBudgetCategories.length > 1 ? 'ies' : 'y'}
        </Text>
      )}
    </View>
  );

  // Compact Pie Chart with interactive segments
  const CompactSpendingChart = () => (
    <Card style={styles.chartCard}>
      {pieChartData.length > 0 ? (
        <View style={styles.chartContainer}>
          <PieChart
            data={pieChartData}
            width={width - 64}
            height={180}
            chartConfig={chartConfig}
            accessor="amount"
            backgroundColor="transparent"
            paddingLeft="15"
            center={[10, 0]}
            absolute={false}
          />
        </View>
      ) : (
        <View style={styles.noDataContainer}>
          <Text category='s1' style={styles.noDataText}>No expenses yet</Text>
          <Button size='small' onPress={() => setShowAddExpense(true)}>
            Add First Expense
          </Button>
        </View>
      )}
    </Card>
  );

  // Budget Status Bar - compact overview
  const BudgetStatusBar = () => (
    <Card style={styles.budgetStatusCard}>
      <TouchableOpacity 
        style={styles.budgetHeader}
        onPress={() => setExpandedBudgets(!expandedBudgets)}
      >
        <Text category='h6'>Budget Overview</Text>
        <View style={styles.budgetHeaderRight}>
          <Text category='c1' style={styles.budgetCount}>
            {budgetSummary.length} budget{budgetSummary.length !== 1 ? 's' : ''}
          </Text>
          <ChevronIcon style={{ transform: [{ rotate: expandedBudgets ? '180deg' : '0deg' }] }} />
        </View>
      </TouchableOpacity>
      
      {!expandedBudgets && (
        <View style={styles.budgetPreview}>
          {budgetSummary.slice(0, 2).map((budget) => (
            <View key={budget.id} style={styles.budgetPreviewItem}>
              <View style={styles.budgetPreviewInfo}>
                <View style={[styles.budgetDot, { backgroundColor: budget.color }]} />
                <Text category='s2'>{budget.category}</Text>
                {budget.isOverBudget && <WarningIcon />}
              </View>
              <Text category='s2' style={budget.isOverBudget ? styles.overBudgetText : null}>
                ${budget.spent}/${budget.limit}
              </Text>
            </View>
          ))}
          {budgetSummary.length > 2 && (
            <TouchableOpacity onPress={() => navigation.navigate('BudgetManagement')}>
              <Text category='c1' style={styles.viewAllText}>View all budgets</Text>
            </TouchableOpacity>
          )}
        </View>
      )}
      
      {expandedBudgets && (
        <View style={styles.expandedBudgets}>
          {budgetSummary.map((budget) => (
            <View key={budget.id} style={styles.budgetDetailItem}>
              <View style={styles.budgetDetailHeader}>
                <View style={styles.budgetDetailInfo}>
                  <View style={[styles.budgetDot, { backgroundColor: budget.color }]} />
                  <Text category='s1'>{budget.category}</Text>
                  {budget.isOverBudget && <WarningIcon />}
                </View>
                <Text category='s1' style={budget.isOverBudget ? styles.overBudgetText : null}>
                  ${budget.spent}/${budget.limit}
                </Text>
              </View>
              <View style={styles.progressContainer}>
                <View style={styles.progressBar}>
                  <View 
                    style={[
                      styles.progressFill, 
                      { 
                        width: `${Math.min(budget.percentage, 100)}%`,
                        backgroundColor: budget.isOverBudget ? '#E74C3C' : budget.color 
                      }
                    ]} 
                  />
                </View>
                <Text category='c2' style={styles.percentageText}>
                  {budget.percentage}%
                </Text>
              </View>
            </View>
          ))}
        </View>
      )}
    </Card>
  );

  const SpendingOverview = () => (
    <Card style={styles.card}>
      <Text category='h6' style={styles.cardTitle}>This Month's Spending</Text>
      <Text category='h4' style={styles.totalAmount}>${totalSpent.toFixed(2)}</Text>
      
      {categoryData.length > 0 ? (
        <View style={styles.chartContainer}>
          <PieChart
            data={pieChartData}
            width={width - 80}
            height={200}
            chartConfig={chartConfig}
            accessor="amount"
            backgroundColor="transparent"
            paddingLeft="15"
            center={[10, 0]}
            hasLegend={true}
          />
          <View style={styles.categoryList}>
            {categoryData.map((item, index) => (
              <View key={index} style={styles.categoryItem}>
                <View style={[styles.categoryDot, { backgroundColor: chartColors[index % chartColors.length] }]} />
                <Text style={styles.categoryName}>{item.category}</Text>
                <Text style={styles.categoryAmount}>${item.total.toFixed(2)}</Text>
              </View>
            ))}
          </View>
        </View>
      ) : (
        <Text style={styles.noData}>No expenses recorded yet</Text>
      )}
    </Card>
  );

  const QuickActions = () => (
    <Card style={styles.card}>
      <Text category='h6' style={styles.cardTitle}>Quick Actions</Text>
      <View style={styles.quickActionsRow}>
        <Button
          style={styles.compactActionButton}
          appearance='outline'
          accessoryLeft={GameIcon}
          onPress={() => navigation.navigate('GameTab')}
          size='small'
        >
          Play Game
        </Button>
        <Button
          style={styles.compactActionButton}
          appearance='outline'
          accessoryLeft={ChatIcon}
          onPress={() => navigation.navigate('LearnTab', { screen: 'AIChat' })}
          size='small'
        >
          AI Chat
        </Button>
      </View>
    </Card>
  );

  const GameStats = () => (
    <Card style={styles.card}>
      <Text category='h6' style={styles.cardTitle}>Your Progress</Text>
      <View style={styles.statsRow}>
        <View style={styles.statItem}>
          <Text category='h6'>{level}</Text>
          <Text category='c1'>Level</Text>
        </View>
        <View style={styles.statItem}>
          <Text category='h6'>{xp}</Text>
          <Text category='c1'>XP</Text>
        </View>
        <View style={styles.statItem}>
          <Text category='h6'>{categoryData.length}</Text>
          <Text category='c1'>Categories</Text>
        </View>
      </View>
    </Card>
  );

  return (
    <Layout style={styles.container}>
      <TopNavigation
        title='FinPath Quest'
        alignment='center'
        accessoryRight={renderMenuAction}
      />
      
      <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
        {/* Priority alerts at the very top */}
        <PriorityAlerts />
        
        {/* Essential info in top half of screen */}
        <CompactTipCard />
        <SpendingSummary />
        <CompactSpendingChart />
        <BudgetStatusBar />
        
        {/* Secondary content below the fold */}
        <GameStats />
        <QuickActions />
        
        <Button
          style={styles.historyButton}
          appearance='ghost'
          onPress={() => navigation.navigate('ExpenseHistory')}
        >
          View Expense History
        </Button>
      </ScrollView>

      {/* Floating Action Button */}
      <TouchableOpacity 
        style={styles.fab}
        onPress={() => setShowAddExpense(true)}
        activeOpacity={0.8}
      >
        <Ionicons name="add" size={24} color="white" />
      </TouchableOpacity>

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
    backgroundColor: '#F8F9FA',
  },
  scrollView: {
    flex: 1,
    padding: 16,
  },
  tipCard: {
    marginBottom: 16,
    backgroundColor: '#FFF9E6',
    borderLeftWidth: 4,
    borderLeftColor: '#FFD700',
  },
  tipHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  tipIcon: {
    width: 24,
    height: 24,
    marginRight: 8,
  },
  card: {
    marginBottom: 16,
  },
  cardTitle: {
    marginBottom: 12,
    fontWeight: 'bold',
  },
  totalAmount: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#6C5CE7',
    marginBottom: 4,
  },
  chartContainer: {
    alignItems: 'center',
    padding: 8,
  },
  categoryList: {
    width: '100%',
    marginTop: 16,
  },
  categoryItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 8,
    paddingHorizontal: 16,
    backgroundColor: '#F8F9FA',
    marginVertical: 2,
    borderRadius: 8,
    width: '100%',
  },
  categoryDot: {
    width: 12,
    height: 12,
    borderRadius: 6,
    marginRight: 12,
  },
  categoryName: {
    flex: 1,
    fontSize: 14,
    color: '#222B45',
  },
  categoryAmount: {
    fontWeight: 'bold',
    color: '#6C5CE7',
  },
  noData: {
    textAlign: 'center',
    fontStyle: 'italic',
    opacity: 0.6,
    padding: 20,
  },
  quickActions: {
    marginBottom: 16,
  },
  quickActionsRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: 12,
  },
  compactActionButton: {
    flex: 1,
  },
  actionButton: {
    marginBottom: 12,
  },
  statsRow: {
    flexDirection: 'row',
    justifyContent: 'space-around',
  },
  statItem: {
    alignItems: 'center',
  },
  historyButton: {
    marginBottom: 20,
  },
  
  // Priority Alert Styles
  alertCard: {
    marginBottom: 8,
    backgroundColor: '#FFF5F5',
    borderLeftWidth: 4,
    borderLeftColor: '#E74C3C',
  },
  alertContent: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 8,
  },
  alertText: {
    flex: 1,
    marginLeft: 8,
    color: '#E74C3C',
    fontWeight: '600',
  },
  alertAction: {
    color: '#E74C3C',
    fontWeight: 'bold',
    textDecorationLine: 'underline',
  },
  
  // Compact Tip Card Styles
  compactTipCard: {
    marginBottom: 12,
    backgroundColor: '#FFF9E6',
    borderLeftWidth: 3,
    borderLeftColor: '#FFD700',
  },
  tipContent: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 8,
  },
  tipText: {
    flex: 1,
    fontSize: 13,
    color: '#8F5F00',
  },
  
  // Spending Summary Styles
  spendingSummary: {
    alignItems: 'center',
    marginBottom: 16,
    paddingVertical: 12,
  },
  totalLabel: {
    fontSize: 16,
    color: '#8F9BB3',
    marginBottom: 4,
  },
  overBudgetNote: {
    color: '#E74C3C',
    fontSize: 12,
    fontStyle: 'italic',
  },
  
  // Budget Status Bar Styles
  budgetStatusCard: {
    marginBottom: 16,
  },
  budgetHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 4,
  },
  budgetHeaderRight: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  budgetCount: {
    marginRight: 8,
    color: '#8F9BB3',
  },
  budgetPreview: {
    marginTop: 12,
  },
  budgetPreviewItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 8,
    paddingHorizontal: 4,
  },
  budgetPreviewInfo: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  budgetDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    marginRight: 8,
  },
  overBudgetText: {
    color: '#E74C3C',
    fontWeight: '600',
  },
  viewAllText: {
    color: '#6C5CE7',
    textAlign: 'center',
    marginTop: 8,
    textDecorationLine: 'underline',
  },
  expandedBudgets: {
    marginTop: 12,
  },
  budgetDetailItem: {
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#E4E9F2',
  },
  budgetDetailHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  budgetDetailInfo: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  progressContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  progressBar: {
    flex: 1,
    height: 6,
    backgroundColor: '#E4E9F2',
    borderRadius: 3,
    overflow: 'hidden',
    marginRight: 8,
  },
  progressFill: {
    height: '100%',
    borderRadius: 3,
  },
  percentageText: {
    fontSize: 11,
    fontWeight: '600',
    color: '#8F9BB3',
    width: 30,
  },
  
  // Floating Action Button
  fab: {
    position: 'absolute',
    bottom: 24,
    right: 24,
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: '#6C5CE7',
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 8,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.3,
    shadowRadius: 4.65,
  },
  
  // Chart styles
  noDataContainer: {
    alignItems: 'center',
    paddingVertical: 20,
  },
  noDataText: {
    color: '#8F9BB3',
    marginBottom: 12,
  },
});
