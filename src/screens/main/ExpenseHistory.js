import React from 'react';
import { View, StyleSheet, ScrollView, Dimensions } from 'react-native';
import { 
  Layout, 
  Text, 
  ListItem, 
  TopNavigation,
  TopNavigationAction,
  Card 
} from '@ui-kitten/components';
import { Ionicons } from '@expo/vector-icons';
import { BarChart } from 'react-native-chart-kit';
import { useExpenseStore } from '../../store';

const { width } = Dimensions.get('window');

const BackIcon = (props) => <Ionicons name="arrow-back" size={24} color="#8F9BB3" />;

export default function ExpenseHistory({ navigation }) {
  const { expenses } = useExpenseStore();

  const renderBackAction = () => (
    <TopNavigationAction 
      icon={BackIcon} 
      onPress={() => navigation.goBack()} 
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

  // Prepare bar chart data
  const barChartData = {
    labels: chartData.map(item => item.month),
    datasets: [{
      data: chartData.map(item => item.amount)
    }]
  };

  const chartConfig = {
    backgroundColor: '#ffffff',
    backgroundGradientFrom: '#ffffff',
    backgroundGradientTo: '#ffffff',
    decimalPlaces: 0,
    color: (opacity = 1) => `rgba(108, 92, 231, ${opacity})`,
    labelColor: (opacity = 1) => `rgba(34, 43, 69, ${opacity})`,
    style: {
      borderRadius: 16
    },
    propsForDots: {
      r: "6",
      strokeWidth: "2",
      stroke: "#6C5CE7"
    }
  };

  return (
    <Layout style={styles.container}>
      <TopNavigation
        title='Expense History'
        accessoryLeft={renderBackAction}
      />
      
      <ScrollView style={styles.content}>
        {chartData.length > 0 && (
          <Card style={styles.chartCard}>
            <Text category='h6' style={styles.chartTitle}>Monthly Spending Trends</Text>
            <View style={styles.chartContainer}>
              <BarChart
                data={barChartData}
                width={width - 60}
                height={220}
                chartConfig={chartConfig}
                verticalLabelRotation={30}
                showValuesOnTopOfBars={true}
                fromZero={true}
                style={{
                  marginVertical: 8,
                  borderRadius: 16
                }}
              />
            </View>
            <View style={styles.monthlyBreakdown}>
              {chartData.map((item, index) => (
                <View key={index} style={styles.monthItem}>
                  <Text style={styles.monthLabel}>{item.month}</Text>
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
            <View>
              {expenses.slice().reverse().map((expense, index) => (
                <ListItem
                  key={expense.id || index}
                  title={expense.description || expense.category}
                  description={new Date(expense.date).toLocaleDateString()}
                  accessoryRight={() => (
                    <Text category='s1' style={{ color: '#E74C3C' }}>
                      -${expense.amount.toFixed(2)}
                    </Text>
                  )}
                />
              ))}
            </View>
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
  chartContainer: {
    alignItems: 'center',
    marginVertical: 10,
  },
  monthlyBreakdown: {
    marginTop: 16,
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
  monthLabel: {
    fontSize: 14,
    color: '#222B45',
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
