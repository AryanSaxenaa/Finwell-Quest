import React from 'react';
import { View, StyleSheet, ScrollView } from 'react-native';
import { 
  Layout, 
  Text, 
  List, 
  ListItem, 
  TopNavigation,
  TopNavigationAction,
  Card 
} from '@ui-kitten/components';
import { Ionicons } from '@expo/vector-icons';
import { useExpenseStore } from '../../store';

const BackIcon = (props) => <Ionicons name="arrow-back" size={24} color="#8F9BB3" />;

export default function ExpenseHistory({ navigation }) {
  const { expenses } = useExpenseStore();

  const renderBackAction = () => (
    <TopNavigationAction 
      icon={BackIcon} 
      onPress={() => navigation.goBack()} 
    />
  );

  const renderExpenseItem = ({ item }) => (
    <ListItem
      title={item.description || item.category}
      description={new Date(item.date).toLocaleDateString()}
      accessoryRight={() => (
        <Text category='s1' style={{ color: '#E74C3C' }}>
          -${item.amount.toFixed(2)}
        </Text>
      )}
    />
  );

  // Group expenses by month for chart
  const monthlyData = expenses.reduce((acc, expense) => {
    const month = new Date(expense.date).toLocaleDateString('en-US', { 
      month: 'short' 
    });
    acc[month] = (acc[month] || 0) + expense.amount;
    return acc;
  }, {});

  const chartData = Object.entries(monthlyData).map(([month, amount]) => ({
    month,
    amount,
  }));

  return (
    <Layout style={styles.container}>
      <TopNavigation
        title='Expense History'
        accessoryLeft={renderBackAction}
      />
      
      <ScrollView style={styles.content}>
        {chartData.length > 0 && (
          <Card style={styles.chartCard}>
            <Text category='h6' style={styles.chartTitle}>Monthly Spending</Text>
            <View style={styles.chartPlaceholder}>
              <Text style={styles.chartIcon}>📊</Text>
              <Text style={styles.chartNote}>Interactive charts coming soon!</Text>
              {chartData.map((item, index) => (
                <View key={index} style={styles.monthItem}>
                  <Text>{item.month}</Text>
                  <Text style={styles.monthAmount}>${item.amount.toFixed(2)}</Text>
                </View>
              ))}
            </View>
          </Card>
        )}

        <Card style={styles.listCard}>
          <Text category='h6' style={styles.listTitle}>
            Recent Transactions ({expenses.length})
          </Text>
          {expenses.length > 0 ? (
            <List
              data={expenses.slice().reverse()}
              renderItem={renderExpenseItem}
            />
          ) : (
            <Text style={styles.noData}>No expenses recorded yet</Text>
          )}
        </Card>
      </ScrollView>
    </Layout>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F8F9FA',
  },
  content: {
    flex: 1,
    padding: 16,
  },
  chartCard: {
    marginBottom: 16,
  },
  chartTitle: {
    marginBottom: 12,
    fontWeight: 'bold',
  },
  chartPlaceholder: {
    alignItems: 'center',
    padding: 20,
  },
  chartIcon: {
    fontSize: 48,
    marginBottom: 8,
  },
  chartNote: {
    fontSize: 12,
    opacity: 0.6,
    marginBottom: 16,
  },
  monthItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 8,
    paddingHorizontal: 16,
    backgroundColor: '#F8F9FA',
    marginVertical: 2,
    borderRadius: 8,
    width: '100%',
  },
  monthAmount: {
    fontWeight: 'bold',
    color: '#6C5CE7',
  },
  listCard: {
    marginBottom: 16,
  },
  listTitle: {
    marginBottom: 12,
    fontWeight: 'bold',
  },
  noData: {
    textAlign: 'center',
    fontStyle: 'italic',
    opacity: 0.6,
    padding: 20,
  },
});
