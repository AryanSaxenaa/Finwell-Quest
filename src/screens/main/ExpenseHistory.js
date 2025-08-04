import React from 'react';
import { View, StyleSheet, ScrollView, Dimensions, TouchableOpacity, Text } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { BarChart } from 'react-native-chart-kit';
import { useExpenseStore } from '../../store';
import { SafeAreaView } from 'react-native-safe-area-context';
import { 
  BrutalCard, 
  BrutalButton, 
  BrutalHeader,
  brutalTextStyle 
} from '../../components/BrutalComponents';
import { NeoBrutalism } from '../../styles/neoBrutalism';

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
    <SafeAreaView style={styles.safeArea} edges={['top', 'left', 'right']}>
      <View style={styles.container}>
        <BrutalHeader
          title='💳 EXPENSE HISTORY'
          textColor="white"
          leftAction={
            <TouchableOpacity onPress={() => navigation.goBack()}>
              <Ionicons name="arrow-back" size={24} color={NeoBrutalism.colors.white} />
            </TouchableOpacity>
          }
        />
        
        <ScrollView style={styles.content}>
          {chartData.length > 0 && (
            <BrutalCard style={styles.chartCard}>
              <Text style={[brutalTextStyle('h6', 'bold', 'black'), styles.chartTitle]}>📊 MONTHLY SPENDING TRENDS</Text>
              <View style={styles.chartContainer}>
                <BarChart
                  data={barChartData}
                  width={width - 80}
                  height={220}
                  chartConfig={chartConfig}
                  verticalLabelRotation={30}
                  showValuesOnTopOfBars={true}
                  fromZero={true}
                  style={{
                    marginVertical: 8,
                  }}
                />
              </View>
              <View style={styles.monthlyBreakdown}>
                {chartData.map((item, index) => (
                  <BrutalCard key={index} style={styles.monthItem}>
                    <Text style={brutalTextStyle('caption', 'bold', 'black')}>{item.month.toUpperCase()}</Text>
                    <Text style={brutalTextStyle('body', 'bold', 'black')}>${item.amount.toFixed(2)}</Text>
                  </BrutalCard>
                ))}
              </View>
            </BrutalCard>
          )}

          <BrutalCard style={styles.listCard}>
            <Text style={[brutalTextStyle('h6', 'bold', 'black'), styles.listTitle]}>
              🧾 RECENT TRANSACTIONS ({expenses.length})
            </Text>
            {expenses.length > 0 ? (
              <View>
                {expenses.slice().reverse().map((expense, index) => (
                  <BrutalCard
                    key={expense.id || index}
                    style={styles.expenseItem}
                  >
                    <View style={styles.expenseContent}>
                      <View style={styles.expenseInfo}>
                        <Text style={brutalTextStyle('body', 'bold', 'black')}>
                          {(expense.description || expense.category).toUpperCase()}
                        </Text>
                        <Text style={brutalTextStyle('caption', 'medium', 'black')}>
                          {new Date(expense.date).toLocaleDateString()}
                        </Text>
                      </View>
                      <Text style={[brutalTextStyle('body', 'bold', 'black'), styles.expenseAmount]}>
                        -${expense.amount.toFixed(2)}
                      </Text>
                    </View>
                  </BrutalCard>
                ))}
              </View>
            ) : (
              <Text style={[brutalTextStyle('body', 'medium', 'black'), styles.noData]}>NO EXPENSES RECORDED YET</Text>
            )}
          </BrutalCard>
        </ScrollView>
      </View>
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
  content: {
    flex: 1,
    padding: 16,
  },
  chartCard: {
    marginBottom: 16,
    backgroundColor: NeoBrutalism.colors.lightGray,
  },
  chartTitle: {
    marginBottom: 12,
    textAlign: 'center',
  },
  chartContainer: {
    alignItems: 'center',
    marginVertical: 10,
    borderWidth: 0, // Removed black border
    backgroundColor: NeoBrutalism.colors.white,
    padding: 8,
  },
  monthlyBreakdown: {
    marginTop: 16,
    gap: 8,
  },
  monthItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 8,
    paddingHorizontal: 16,
    backgroundColor: NeoBrutalism.colors.neonYellow,
    borderWidth: 2,
    borderColor: NeoBrutalism.colors.black,
  },
  listCard: {
    marginBottom: 16,
    backgroundColor: NeoBrutalism.colors.lightGray,
  },
  listTitle: {
    marginBottom: 16,
    textAlign: 'center',
  },
  expenseItem: {
    marginBottom: 8,
    backgroundColor: NeoBrutalism.colors.white,
    borderWidth: 2,
    borderColor: NeoBrutalism.colors.black,
  },
  expenseContent: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 8,
  },
  expenseInfo: {
    flex: 1,
  },
  expenseAmount: {
    color: NeoBrutalism.colors.pureRed,
  },
  noData: {
    textAlign: 'center',
    marginTop: 20,
    fontStyle: 'italic',
  },
});
