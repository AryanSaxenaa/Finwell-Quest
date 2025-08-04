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
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { PieChart } from 'react-native-chart-kit';
import { useExpenseStore, useBudgetStore } from '../../store';
import AddExpenseModal from '../../components/AddExpenseModal';
import { 
  BrutalButton, 
  BrutalCard, 
  BrutalStats, 
  BrutalIllustration, 
  BrutalHeader,
  BrutalProgressBar 
} from '../../components/BrutalComponents';
import { NeoBrutalism, brutalTextStyle } from '../../styles/neoBrutalism';

const { width } = Dimensions.get('window');

export default function HomeDashboard({ navigation }) {
  const [showAddExpense, setShowAddExpense] = useState(false);
  
  const { 
    totalSpent, 
    getExpensesByCategory, 
    isPlaidConnected, 
    getSpendingInsights 
  } = useExpenseStore();
  const { getBudgetSummary } = useBudgetStore();
  
  const categoryData = getExpensesByCategory().filter(item => item.total > 0);
  const budgetSummary = getBudgetSummary();
  const spendingInsights = isPlaidConnected ? getSpendingInsights() : null;

  // Only show data if user has real expenses or is connected to bank
  const hasRealData = categoryData.length > 0 || isPlaidConnected;
  
  // Color palette for expense categories
  const categoryColors = ['#FF6B8A', '#4F9CF9', '#36C5F0', '#F59E0B', '#8B5CF6', '#10B981', '#F97316'];

  const displayData = hasRealData ? categoryData.map((item, index) => ({
    name: item.category,
    amount: item.total,
    color: categoryColors[index % categoryColors.length]
  })) : [];

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
    <SafeAreaView style={styles.safeArea} edges={['top']}>
      <Layout style={styles.brutalContainer}>
        {/* Neo-Brutalism Header */}
        <BrutalHeader
          title="FINPATH QUEST"
          subtitle="MASTER YOUR MONEY"
          backgroundColor="neonYellow"
          textColor="black"
          illustration={require('../../../assets/icon.png')}
        />
      
        <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
          {/* Spending Stats Section */}
          <BrutalCard 
            title="SPENDING OVERVIEW" 
            variant="default" 
            style={styles.overviewCard}
          >
            <View style={styles.totalSpentContainer}>
              <Text style={[brutalTextStyle('h1', 'bold', 'black'), styles.totalAmount]}>
                ${totalSpent.toFixed(2)}
              </Text>
              <Text style={brutalTextStyle('body', 'medium', 'black')}>
                TOTAL SPENT THIS MONTH
              </Text>
            </View>
            </TouchableOpacity>
          </View>

          {/* Chart Section */}
          {hasRealData ? (
            <View style={styles.brutalChartSection}>
              <View style={styles.chartWrapper}>
                <PieChart
                  data={pieChartData}
                  width={240}
                  height={240}
                  chartConfig={{
                    backgroundGradientFrom: NeoBrutalism.colors.white,
                    backgroundGradientTo: NeoBrutalism.colors.white,
                    color: (opacity = 1) => NeoBrutalism.colors.black,
                    strokeWidth: 4,
                  }}
                  accessor="population"
                  backgroundColor="transparent"
                  paddingLeft="60"
                  center={[0, 0]}
                  absolute={false}
                  hasLegend={false}
                  avoidFalseZero={true}
                />
                <View style={styles.brutalChartCenter}>
                  <Text style={brutalTextStyle('caption', 'bold', 'black')}>
                    TOTAL
                  </Text>
                  <Text style={[
                    brutalTextStyle('h3', 'bold', 'black'),
                    styles.brutalTotalAmount
                  ]}>
                    ${totalAmount.toLocaleString()}
                  </Text>
                </View>
              </View>
            </View>
          ) : (
            <View style={styles.emptyStateContainer}>
              <BrutalIllustration
                source={require('../../../assets/icon.png')}
                size="large"
                style={styles.emptyStateIllustration}
              />
              <Text style={[brutalTextStyle('h6', 'bold', 'black'), styles.emptyStateText]}>
                CONNECT YOUR BANK TO SEE SPENDING DATA
              </Text>
            </View>
          )}

          {/* Bank Connection Status */}
          {!isPlaidConnected ? (
            <BrutalCard style={styles.bankConnectionCard}>
              <View style={styles.bankConnectionContent}>
                <View style={styles.bankIconWrapper}>
                  <Ionicons name="business" size={32} color={NeoBrutalism.colors.black} />
                </View>
                <View style={styles.bankConnectionText}>
                  <Text style={brutalTextStyle('h6', 'bold', 'black')}>
                    CONNECT YOUR BANK
                  </Text>
                  <Text style={brutalTextStyle('caption', 'medium', 'gray')}>
                    Get automatic expense tracking and personalized insights
                  </Text>
                </View>
                <BrutalButton
                  onPress={() => navigation.navigate('BankConnection')}
                  variant="primary"
                  size="small"
                >
                  CONNECT
                </BrutalButton>
              </View>
            </BrutalCard>
          ) : spendingInsights && (
            <BrutalCard style={styles.insightsCard}>
              <Text style={[brutalTextStyle('h5', 'bold', 'black'), styles.insightsTitle]}>
                THIS WEEK'S INSIGHTS
              </Text>
              <View style={styles.insightsGrid}>
                <BrutalStats
                  label="WEEKLY SPENDING"
                  value={`$${spendingInsights.weeklySpent.toFixed(2)}`}
                  color="hotPink"
                />
                <BrutalStats
                  label="TOP CATEGORY"
                  value={spendingInsights.topSpendingCategory}
                  subtitle={`$${spendingInsights.topSpendingAmount.toFixed(2)}`}
                  color="electricBlue"
                />
                <BrutalStats
                  label="DAILY AVERAGE"
                  value={`$${spendingInsights.averageDailySpending.toFixed(2)}`}
                  color="neonYellow"
                />
              </View>
            </BrutalCard>
          )}

          {/* Category Legend */}
          {hasRealData && (
            <BrutalCard style={styles.categoryLegend}>
              <Text style={[brutalTextStyle('h6', 'bold', 'black'), styles.legendTitle]}>
                SPENDING BREAKDOWN
              </Text>
              <View style={styles.legendGrid}>
                {displayData.map((item, index) => (
                  <View key={index} style={styles.brutalLegendItem}>
                    <View style={[styles.brutalLegendDot, { backgroundColor: item.color }]} />
                    <Text style={brutalTextStyle('caption', 'bold', 'black')}>
                      {item.name.toUpperCase()}
                    </Text>
                    <Text style={brutalTextStyle('caption', 'bold', 'gray')}>
                      ${item.population.toLocaleString()}
                    </Text>
                  </View>
                ))}
              </View>
            </BrutalCard>
          )}

          {/* Action Buttons */}
          <View style={styles.actionButtonsContainer}>
            <BrutalButton
              onPress={() => setShowAddExpense(true)}
              variant="primary"
              style={styles.addExpenseButton}
            >
              <Ionicons name="add" size={20} color={NeoBrutalism.colors.black} />
              ADD EXPENSE
            </BrutalButton>

            <BrutalButton
              onPress={() => navigation.navigate('ExpenseHistory')}
              variant="secondary"
              style={styles.viewHistoryButton}
            >
              <Ionicons name="list" size={20} color={NeoBrutalism.colors.black} />
              VIEW HISTORY
            </BrutalButton>
          </View>

        {/* Budget Overview Section */}
        <BrutalCard style={styles.budgetSection}>
          <View style={styles.budgetHeader}>
            <Text style={brutalTextStyle('h5', 'bold', 'black')}>
              BUDGET OVERVIEW
            </Text>
            <Text style={brutalTextStyle('caption', 'medium', 'gray')}>
              THIS MONTH
            </Text>
          </View>

          {/* Budget Items */}
          <View style={styles.budgetCardsContainer}>
            {budgetSummary.length > 0 ? (
              budgetSummary.map((budget, index) => (
                <View key={budget.id || index} style={styles.brutalBudgetCard}>
                  <View style={styles.budgetCardHeader}>
                    <Text style={brutalTextStyle('h6', 'bold', 'black')}>
                      {budget.category.toUpperCase()}
                    </Text>
                    <Text style={brutalTextStyle('caption', 'bold', 'gray')}>
                      ${budget.spent} / ${budget.limit}
                    </Text>
                  </View>
                  <BrutalProgressBar
                    progress={budget.spent / budget.limit}
                    color={budget.spent > budget.limit ? 'hotPink' : budget.spent > budget.limit * 0.8 ? 'neonYellow' : 'electricBlue'}
                  />
                </View>
              ))
            ) : (
              <View style={styles.emptyBudgetState}>
                <BrutalIllustration
                  source={require('../../../assets/icon.png')}
                  size="medium"
                  style={styles.emptyBudgetIllustration}
                />
                <Text style={[brutalTextStyle('h6', 'bold', 'black'), styles.emptyBudgetTitle]}>
                  NO BUDGETS SET
                </Text>
                <Text style={brutalTextStyle('caption', 'medium', 'gray')}>
                  Create budgets to track your spending goals
                </Text>
              </View>
            )}
          </View>

          <BrutalButton
            onPress={() => navigation.navigate('BudgetManagement')}
            variant="secondary"
            style={styles.addBudgetButton}
          >
            <Ionicons name="add-circle" size={20} color={NeoBrutalism.colors.black} />
            MANAGE BUDGETS
          </BrutalButton>
        </BrutalCard>
      </ScrollView>

      <AddExpenseModal 
        visible={showAddExpense}
        onClose={() => setShowAddExpense(false)}
      />
      </Layout>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: NeoBrutalism.colors.white,
  },
  container: {
    flex: 1,
    backgroundColor: NeoBrutalism.colors.white,
  },
  scrollView: {
    flex: 1,
    padding: NeoBrutalism.spacing.lg,
  },
  
  // Chart Styles
  brutalChartSection: {
    alignItems: 'center',
    marginVertical: NeoBrutalism.spacing.md,
  },
  chartWrapper: {
    position: 'relative',
    alignItems: 'center',
  },
  brutalChartCenter: {
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: [{ translateX: -40 }, { translateY: -20 }],
    alignItems: 'center',
  },
  brutalTotalAmount: {
    marginTop: NeoBrutalism.spacing.xs,
  },
  
  // Empty States
  emptyStateContainer: {
    alignItems: 'center',
    paddingVertical: NeoBrutalism.spacing.xl,
  },
  emptyStateIllustration: {
    marginBottom: NeoBrutalism.spacing.md,
  },
  emptyStateText: {
    textAlign: 'center',
    maxWidth: 250,
  },
  
  // Bank Connection
  bankConnectionCard: {
    marginVertical: NeoBrutalism.spacing.md,
  },
  bankConnectionContent: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  bankIconWrapper: {
    marginRight: NeoBrutalism.spacing.md,
  },
  bankConnectionText: {
    flex: 1,
    marginRight: NeoBrutalism.spacing.md,
  },
  
  // Insights
  insightsCard: {
    marginVertical: NeoBrutalism.spacing.md,
  },
  insightsTitle: {
    marginBottom: NeoBrutalism.spacing.md,
  },
  insightsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  
  // Legend
  categoryLegend: {
    marginVertical: NeoBrutalism.spacing.md,
  },
  legendTitle: {
    marginBottom: NeoBrutalism.spacing.md,
  },
  legendGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  brutalLegendItem: {
    flexDirection: 'row',
    alignItems: 'center',
    width: '48%',
    marginBottom: NeoBrutalism.spacing.sm,
  },
  brutalLegendDot: {
    width: 12,
    height: 12,
    borderRadius: 6,
    marginRight: NeoBrutalism.spacing.sm,
    borderWidth: 2,
    borderColor: NeoBrutalism.colors.black,
  },
  
  // Action Buttons
  actionButtonsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginVertical: NeoBrutalism.spacing.lg,
  },
  addExpenseButton: {
    flex: 1,
    marginRight: NeoBrutalism.spacing.sm,
  },
  viewHistoryButton: {
    flex: 1,
    marginLeft: NeoBrutalism.spacing.sm,
  },
  
  // Budget Section
  budgetSection: {
    marginVertical: NeoBrutalism.spacing.md,
  },
  budgetHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: NeoBrutalism.spacing.md,
  },
  budgetCardsContainer: {
    marginBottom: NeoBrutalism.spacing.md,
  },
  brutalBudgetCard: {
    padding: NeoBrutalism.spacing.md,
    backgroundColor: NeoBrutalism.colors.lightGray,
    borderWidth: NeoBrutalism.borders.thick,
    borderColor: NeoBrutalism.colors.black,
    marginBottom: NeoBrutalism.spacing.sm,
  },
  budgetCardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: NeoBrutalism.spacing.sm,
  },
  
  // Empty Budget State
  emptyBudgetState: {
    alignItems: 'center',
    paddingVertical: NeoBrutalism.spacing.xl,
  },
  emptyBudgetIllustration: {
    marginBottom: NeoBrutalism.spacing.md,
  },
  emptyBudgetTitle: {
    marginBottom: NeoBrutalism.spacing.sm,
  },
  
  addBudgetButton: {
    marginTop: NeoBrutalism.spacing.md,
  },
});

export default HomeDashboard;
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
    paddingHorizontal: 8, // Add padding to prevent text overflow
  },
  chartCenter: {
    alignItems: 'center',
    justifyContent: 'center',
    maxWidth: 84, // Slightly less than overlay width to ensure text fits
  },
  chartCenterLabel: {
    fontSize: 12,
    color: '#9CA3AF',
    marginBottom: 4,
    textAlign: 'center',
  },
  chartCenterAmount: {
    fontSize: 24,
    fontWeight: '700',
    color: '#000000',
    textAlign: 'center',
    lineHeight: 26,
  },
  chartCenterAmountLarge: {
    fontSize: 18, // Smaller font for amounts >= $10,000
    lineHeight: 20,
  },
  chartCenterAmountVeryLarge: {
    fontSize: 14, // Even smaller font for amounts >= $100,000
    lineHeight: 16,
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
  buttonIcon: {
    marginRight: 8,
  },
  buttonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '600',
  },
  viewAllExpensesButton: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    paddingVertical: 16,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#6366F1',
    marginTop: 12,
  },
  viewAllExpensesButtonText: {
    color: '#6366F1',
    fontSize: 16,
    fontWeight: '600',
  },
  budgetList: {
    marginBottom: 24,
  },
  budgetItem: {
    paddingVertical: 16,
  },
  budgetCardsContainer: {
    marginBottom: 24,
  },
  budgetCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    marginBottom: 16,
    paddingHorizontal: 20,
    paddingVertical: 18,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
  },
  budgetCardContent: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  budgetCardLeft: {
    flex: 1,
  },
  budgetCardCategory: {
    fontSize: 18,
    fontWeight: '600',
    color: '#000000',
  },
  budgetCardRight: {
    alignItems: 'center',
  },
  budgetCardAmount: {
    fontSize: 16,
    fontWeight: '500',
    color: '#6B7280',
  },
  addBudgetButton: {
    backgroundColor: '#6366F1',
    borderRadius: 12,
    paddingVertical: 16,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 0,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.15,
    shadowRadius: 8,
    elevation: 4,
  },
  bankConnectionCard: {
    backgroundColor: '#E8F5E8',
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
    borderLeftWidth: 4,
    borderLeftColor: '#4CAF50',
  },
  bankConnectionContent: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  bankConnectionText: {
    flex: 1,
    marginLeft: 12,
    marginRight: 12,
  },
  bankConnectionTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#2E7D32',
    marginBottom: 4,
  },
  bankConnectionSubtitle: {
    fontSize: 14,
    color: '#4CAF50',
  },
  insightsCard: {
    backgroundColor: '#F0F4F8',
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
    borderLeftWidth: 4,
    borderLeftColor: '#2196F3',
  },
  insightsTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#1976D2',
    marginBottom: 12,
  },
  insightsRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 8,
  },
  insightsLabel: {
    fontSize: 14,
    color: '#455A64',
  },
  insightsValue: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#1976D2',
  },
  emptyStateContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 40,
    paddingHorizontal: 20,
  },
  emptyStateTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#6B7280',
    marginTop: 16,
    marginBottom: 8,
  },
  emptyStateSubtitle: {
    fontSize: 14,
    color: '#9CA3AF',
    textAlign: 'center',
    lineHeight: 20,
  },
  emptyBudgetState: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 30,
    paddingHorizontal: 20,
  },
  emptyBudgetTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#6B7280',
    marginTop: 12,
    marginBottom: 6,
  },
  emptyBudgetSubtitle: {
    fontSize: 14,
    color: '#9CA3AF',
    textAlign: 'center',
  },
});

export default HomeDashboard;
