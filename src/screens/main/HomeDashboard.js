import React, { useState } from 'react';
import { 
  View, 
  StyleSheet, 
  ScrollView, 
  Dimensions
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
import { useExpenseStore, useGameStore } from '../../store';
import AddExpenseModal from '../../components/AddExpenseModal';
import BudgetCard from '../../components/BudgetCard';

const { width } = Dimensions.get('window');

const MenuIcon = (props) => <Ionicons name="menu-outline" size={24} color="#8F9BB3" />;
const PlusIcon = (props) => <Ionicons name="add-outline" size={24} color="white" />;
const GameIcon = (props) => <Ionicons name="grid-outline" size={24} color="#8F9BB3" />;
const ChatIcon = (props) => <Ionicons name="chatbubble-outline" size={24} color="#8F9BB3" />;

export default function HomeDashboard({ navigation }) {
  const [showAddExpense, setShowAddExpense] = useState(false);
  
  const { totalSpent, getExpensesByCategory } = useExpenseStore();
  const { level, xp } = useGameStore();
  
  const categoryData = getExpensesByCategory().filter(item => item.total > 0);

  // Prepare chart data
  const chartColors = ['#FF6384', '#36A2EB', '#FFCE56', '#4BC0C0', '#9966FF', '#FF9F40'];
  const pieChartData = categoryData.map((item, index) => ({
    name: item.category,
    amount: item.total,
    color: chartColors[index % chartColors.length],
    legendFontColor: '#222B45',
    legendFontSize: 12,
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

  const DailyTipCard = () => (
    <Card style={styles.tipCard}>
      <View style={styles.tipHeader}>
        <Ionicons name="bulb-outline" size={24} color="#FFD700" style={styles.tipIcon} />
        <Text category='h6'>Daily AI Tip</Text>
      </View>
      <Text category='p2'>
        Try the 50/30/20 rule: 50% needs, 30% wants, 20% savings. 
        Your current spending shows room for improvement in the entertainment category.
      </Text>
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
    <View style={styles.quickActions}>
      <Button
        style={styles.actionButton}
        accessoryLeft={PlusIcon}
        onPress={() => setShowAddExpense(true)}
      >
        Add Expense
      </Button>
      <Button
        style={styles.actionButton}
        appearance='outline'
        accessoryLeft={GameIcon}
        onPress={() => navigation.navigate('GameTab')}
      >
        Start Game
      </Button>
      <Button
        style={styles.actionButton}
        appearance='outline'
        accessoryLeft={ChatIcon}
        onPress={() => navigation.navigate('LearnTab', { screen: 'AIChat' })}
      >
        Chat AI
      </Button>
    </View>
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
        <DailyTipCard />
        <BudgetCard navigation={navigation} />
        <SpendingOverview />
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
    color: '#6C5CE7',
    fontWeight: 'bold',
    marginBottom: 16,
  },
  chartContainer: {
    alignItems: 'center',
    padding: 16,
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
});
