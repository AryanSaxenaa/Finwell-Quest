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
  const colors = [
    NeoBrutalism.colors.neonYellow,
    NeoBrutalism.colors.hotPink,
    NeoBrutalism.colors.electricBlue,
    NeoBrutalism.colors.brightGreen,
    NeoBrutalism.colors.hotPink,
    '#FFB84D', // Orange
    '#FF6B6B', // Red
    '#4ECDC4', // Teal
  ];

  // Prepare data for chart
  const displayData = categoryData.slice(0, 8); // Show max 8 categories
  const totalAmount = displayData.reduce((sum, item) => sum + item.total, 0);
  
  const pieChartData = displayData.map((item, index) => ({
    name: item.category,
    population: item.total,
    color: colors[index % colors.length],
    legendFontColor: NeoBrutalism.colors.black,
    legendFontSize: 12,
    amount: item.total
  }));

  return (
    <SafeAreaView style={styles.safeArea}>
      <Layout style={styles.container}>
        <BrutalHeader 
          title="FINPATH QUEST"
          leftAction={
            <TouchableOpacity onPress={() => navigation.openDrawer()}>
              <Ionicons name="menu" size={24} color={NeoBrutalism.colors.black} />
            </TouchableOpacity>
          }
          rightAction={
            <TouchableOpacity onPress={() => navigation.navigate('Profile')}>
              <View style={styles.profileButton}>
                <Text style={styles.profileInitial}>U</Text>
              </View>
            </TouchableOpacity>
          }
        />
        
        <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
          {/* Expense Overview */}
          <BrutalCard style={styles.overviewCard}>
            <View style={styles.overviewHeader}>
              <Text style={brutalTextStyle('h5', 'bold', 'black')}>
                SPENDING OVERVIEW
              </Text>
              <Text style={brutalTextStyle('caption', 'medium', 'gray')}>
                THIS MONTH
              </Text>
            </View>
            
            <BrutalStats
              label="TOTAL SPENT"
              value={`$${totalAmount.toLocaleString()}`}
              color="hotPink"
              size="large"
            />

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
          </BrutalCard>

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
  
  // Profile Button
  profileButton: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: NeoBrutalism.colors.hotPink,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 2,
    borderColor: NeoBrutalism.colors.black,
  },
  profileInitial: {
    color: NeoBrutalism.colors.black,
    fontSize: 14,
    fontWeight: 'bold',
  },
  
  // Overview Card
  overviewCard: {
    marginBottom: NeoBrutalism.spacing.lg,
  },
  overviewHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: NeoBrutalism.spacing.md,
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
