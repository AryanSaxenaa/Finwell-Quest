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
  BrutalStat,
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
    NeoBrutalism.colors.neonYellow,    // Housing
    NeoBrutalism.colors.hotPink,       // Transport  
    NeoBrutalism.colors.electricBlue,  // Food
    NeoBrutalism.colors.neonGreen,     // Entertainment (fixed from brightGreen)
    NeoBrutalism.colors.deepPurple,    // Shopping (changed from duplicate hotPink)
    '#FFB84D', // Orange - Bills
    '#FF6B6B', // Red - Other
    '#4ECDC4', // Teal - Additional
  ];

  // Prepare data for chart
  const displayData = categoryData.slice(0, 8); // Show max 8 categories
  const totalAmount = displayData.reduce((sum, item) => sum + item.total, 0);
  
  const pieChartData = displayData.map((item, index) => ({
    name: item.category || 'Unknown',
    population: item.total,
    color: colors[index % colors.length],
    legendFontColor: NeoBrutalism.colors.black,
    legendFontSize: 12,
    amount: item.total,
    category: item.category || 'Unknown'
  }));

  return (
    <SafeAreaView style={styles.safeArea} edges={['top', 'left', 'right']}>
      <Layout style={styles.container}>
        <BrutalHeader 
          title="      FINPATH QUEST"
          textColor="white"
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
            
            <BrutalStat
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
                  width={180}
                  height={180}
                  chartConfig={{
                    backgroundGradientFrom: NeoBrutalism.colors.white,
                    backgroundGradientTo: NeoBrutalism.colors.white,
                    color: (opacity = 1) => NeoBrutalism.colors.black,
                    strokeWidth: 4,
                  }}
                  accessor="population"
                  backgroundColor="transparent"
                  paddingLeft="45"
                  center={[0, 0]}
                  absolute={false}
                  hasLegend={false}
                  avoidFalseZero={true}
                />
              </View>
            </View>
          ) : (
            <View style={styles.emptyStateContainer}>
              <BrutalIllustration
                source={require('../../../assets/SharkWithSuitcase.png')}
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
                </View>
            <BrutalButton
              title="CONNECT"
              onPress={() => navigation.navigate('BankConnection')}
              variant="primary"
              size="small"
            />
              </View>
            </BrutalCard>
          ) : spendingInsights && (
            <BrutalCard style={styles.insightsCard}>
              <Text style={[brutalTextStyle('h5', 'bold', 'black'), styles.insightsTitle]}>
                THIS WEEK'S INSIGHTS
              </Text>
              <View style={styles.insightsGrid}>
                <BrutalStat
                  label="WEEKLY"
                  value={`$${(spendingInsights?.weeklySpent || 0).toFixed(0)}`}
                  subtitle="SPENT"
                  color="hotPink"
                  style={styles.insightStat}
                />
                <BrutalStat
                  label="TOP"
                  value={spendingInsights?.topSpendingCategory?.slice(0, 6) || 'N/A'}
                  subtitle={`$${(spendingInsights?.topSpendingAmount || 0).toFixed(0)}`}
                  color="electricBlue"
                  style={styles.insightStat}
                />
                <BrutalStat
                  label="DAILY"
                  value={`$${(spendingInsights?.averageDailySpending || 0).toFixed(0)}`}
                  subtitle="AVG"
                  color="neonYellow"
                  style={styles.insightStat}
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
                    <View style={[styles.brutalLegendDot, { backgroundColor: colors[index % colors.length] }]} />
                    <View style={styles.legendTextContainer}>
                      <Text 
                        style={brutalTextStyle('caption', 'bold', 'black')}
                        numberOfLines={1}
                        adjustsFontSizeToFit={true}
                      >
                        {item.category ? item.category.toUpperCase() : 'UNKNOWN'}
                      </Text>
                      <Text 
                        style={brutalTextStyle('caption', 'bold', 'gray')}
                        numberOfLines={1}
                      >
                        ${item.total.toLocaleString()}
                      </Text>
                    </View>
                  </View>
                ))}
              </View>
            </BrutalCard>
          )}

          {/* Action Buttons */}
          <View style={styles.actionButtonsContainer}>
            <BrutalButton
              title="ADD EXPENSE"
              onPress={() => setShowAddExpense(true)}
              variant="primary"
              style={styles.addExpenseButton}
              icon={<Ionicons name="add" size={20} color={NeoBrutalism.colors.black} />}
            />

            <BrutalButton
              title="VIEW HISTORY"
              onPress={() => navigation.navigate('ExpenseHistory')}
              variant="secondary"
              style={styles.viewHistoryButton}
              icon={<Ionicons name="list" size={20} color={NeoBrutalism.colors.black} />}
            />
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
              budgetSummary.map((budget, index) => {
                const progress = ((budget.spent || 0) / (budget.limit || 1)) * 100; // Convert to percentage
                const isOverspent = progress > 100;
                const isNearLimit = progress > 80;
                const isTemplate = (budget.spent || 0) === 0; // Check if this is a template budget
                
                return (
                  <View key={budget.id || index} style={[
                    styles.brutalBudgetCard,
                    isOverspent && styles.overspentBudgetCard,
                    isTemplate && styles.templateBudgetCard
                  ]}>
                    <View style={styles.budgetCardHeader}>
                      <View style={styles.budgetCategoryRow}>
                        <Text style={brutalTextStyle('h6', 'bold', 'black')}>
                          {budget.category ? budget.category.toUpperCase() : 'UNKNOWN CATEGORY'}
                        </Text>
                        {isTemplate && (
                          <View style={styles.templateBadge}>
                            <Text style={styles.templateIcon}>📋</Text>
                          </View>
                        )}
                        {isOverspent && !isTemplate && (
                          <View style={styles.overspentAlert}>
                            <Text style={styles.alertIcon}>⚠️</Text>
                          </View>
                        )}
                      </View>
                      <Text style={brutalTextStyle('caption', 'bold', 'gray')}>
                        {isTemplate ? `BUDGET: $${budget.limit || 0}` : `$${budget.spent || 0} / $${budget.limit || 0}`}
                      </Text>
                    </View>
                    <BrutalProgressBar
                      progress={isTemplate ? 0 : Math.min(progress, 100)}
                      color={isOverspent ? 'hotPink' : isNearLimit ? 'neonYellow' : 'electricBlue'}
                      fillColor={isOverspent ? 'hotPink' : isNearLimit ? 'neonYellow' : 'electricBlue'}
                      style={isOverspent ? styles.overspentProgressBar : {}}
                    />
                    {isTemplate ? (
                      <Text style={[
                        brutalTextStyle('caption', 'medium', 'gray'),
                        styles.templateText
                      ]}>
                        START TRACKING TO SEE PROGRESS
                      </Text>
                    ) : isOverspent && (
                      <Text style={[
                        brutalTextStyle('caption', 'bold', 'black'),
                        styles.overspentText
                      ]}>
                        OVER BY ${((budget.spent || 0) - (budget.limit || 0)).toFixed(0)}
                      </Text>
                    )}
                  </View>
                );
              })
            ) : (
              <View style={styles.emptyBudgetState}>
                <BrutalIllustration
                  source={require('../../../assets/SharkWithSuitcase.png')}
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
            title="MANAGE BUDGETS"
            onPress={() => navigation.navigate('BudgetManagement')}
            variant="secondary"
            style={styles.addBudgetButton}
            icon={<Ionicons name="add-circle" size={20} color={NeoBrutalism.colors.black} />}
          />
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
    marginBottom: NeoBrutalism.spacing.xl, // Increased from md to xl for more space
    borderWidth: 0, // No border
    borderColor: 'transparent',
    // backgroundColor remains unchanged
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
    marginVertical: NeoBrutalism.spacing.lg, // Increased from sm to lg for more space
  },
  chartWrapper: {
    position: 'relative',
    alignItems: 'center',
  },
  brutalChartCenter: {
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: [{ translateX: -30 }, { translateY: -15 }], // Adjusted for smaller chart
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
    marginTop: NeoBrutalism.spacing.xs, // Reduced from sm to xs
    marginBottom: NeoBrutalism.spacing.lg, // Increased from sm to lg
    borderWidth: 0, // No border
    borderColor: 'transparent',
  },
  insightsTitle: {
    marginBottom: NeoBrutalism.spacing.sm, // Reduced from md to sm
  },
  insightsGrid: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    flexWrap: 'wrap',
  },
  insightStat: {
    flex: 1,
    marginHorizontal: NeoBrutalism.spacing.xs,
    minHeight: 80,
  },
  
  // Legend
  categoryLegend: {
    marginVertical: NeoBrutalism.spacing.sm, // Reduced from md to sm
  },
  legendTitle: {
    marginBottom: NeoBrutalism.spacing.sm, // Reduced from md to sm
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
    paddingRight: NeoBrutalism.spacing.xs,
  },
  brutalLegendDot: {
    width: 12,
    height: 12,
    borderRadius: 6,
    marginRight: NeoBrutalism.spacing.sm,
    borderWidth: 0, // Removed black border
    flexShrink: 0,
  },
  legendTextContainer: {
    flex: 1,
    justifyContent: 'center',
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
    borderWidth: 0, // No border
    borderColor: 'transparent',
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
    borderWidth: 0, // No border
    borderColor: 'transparent',
    marginBottom: NeoBrutalism.spacing.sm,
  },
  overspentBudgetCard: {
    backgroundColor: '#FFE5E5',
    borderColor: NeoBrutalism.colors.hotPink,
    opacity: 0.9,
  },
  budgetCardHeader: {
    marginBottom: NeoBrutalism.spacing.sm,
  },
  budgetCategoryRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: NeoBrutalism.spacing.xs,
  },
  overspentAlert: {
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: NeoBrutalism.colors.hotPink,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 0, // Removed black border
  },
  alertIcon: {
    fontSize: 12,
  },
  overspentProgressBar: {
    opacity: 0.8,
  },
  overspentText: {
    textAlign: 'center',
    marginTop: NeoBrutalism.spacing.xs,
    color: NeoBrutalism.colors.hotPink,
  },
  
  // Template Budget Styles
  templateBudgetCard: {
    borderColor: NeoBrutalism.colors.gray,
    backgroundColor: NeoBrutalism.colors.lightGray,
    opacity: 0.9,
  },
  templateBadge: {
    backgroundColor: NeoBrutalism.colors.neonYellow,
    borderRadius: 12,
    paddingHorizontal: 6,
    paddingVertical: 2,
    marginLeft: NeoBrutalism.spacing.xs,
  },
  templateIcon: {
    fontSize: 12,
  },
  templateText: {
    textAlign: 'center',
    marginTop: NeoBrutalism.spacing.xs,
    fontStyle: 'italic',
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
