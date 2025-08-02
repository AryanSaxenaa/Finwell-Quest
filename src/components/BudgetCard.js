import React from 'react';
import { View, StyleSheet, Dimensions } from 'react-native';
import { Card, Text, Button } from '@ui-kitten/components';
import { useBudgetStore } from '../store';

const { width } = Dimensions.get('window');

export default function BudgetCard({ navigation }) {
  const { getBudgetSummary } = useBudgetStore();
  const budgets = getBudgetSummary();

  const BudgetItem = ({ budget }) => {
    const progressWidth = Math.min(budget.percentage, 100);
    
    return (
      <View style={styles.budgetItem}>
        <View style={styles.budgetHeader}>
          <View style={styles.categoryInfo}>
            <View 
              style={[styles.categoryDot, { backgroundColor: budget.color }]} 
            />
            <Text category='s1' style={styles.categoryName}>
              {budget.category}
            </Text>
          </View>
          <Text category='c2' style={styles.monthlyLabel}>
            monthly
          </Text>
        </View>
        
        <View style={styles.amountRow}>
          <Text category='h6' style={styles.spentAmount}>
            ${budget.spent}
          </Text>
          <Text category='p2' style={styles.budgetLimit}>
            of ${budget.limit}
          </Text>
        </View>
        
        <View style={styles.progressContainer}>
          <View style={styles.progressBar}>
            <View 
              style={[
                styles.progressFill, 
                { 
                  width: `${progressWidth}%`,
                  backgroundColor: budget.isOverBudget ? '#E74C3C' : budget.color 
                }
              ]} 
            />
          </View>
        </View>
        
        <Text 
          category='c1' 
          style={[
            styles.remainingText,
            { color: budget.isOverBudget ? '#E74C3C' : '#8F9BB3' }
          ]}
        >
          {budget.isOverBudget 
            ? `$${Math.abs(budget.remaining)} over budget`
            : `$${budget.remaining} remaining`
          }
        </Text>
      </View>
    );
  };

  return (
    <Card style={styles.card}>
      <View style={styles.header}>
        <Text category='h6' style={styles.title}>Budgets</Text>
        <Button 
          size='tiny' 
          appearance='ghost'
          onPress={() => navigation?.navigate('BudgetManagement')}
        >
          View All
        </Button>
      </View>
      
      <View style={styles.budgetsGrid}>
        {budgets.slice(0, 4).map((budget) => (
          <View key={budget.id} style={styles.budgetWrapper}>
            <BudgetItem budget={budget} />
          </View>
        ))}
      </View>
    </Card>
  );
}

const styles = StyleSheet.create({
  card: {
    marginBottom: 16,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  title: {
    fontWeight: 'bold',
  },
  budgetsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  budgetWrapper: {
    width: '48%',
    marginBottom: 16,
  },
  budgetItem: {
    backgroundColor: '#F8F9FA',
    borderRadius: 12,
    padding: 12,
    minHeight: 120,
  },
  budgetHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  categoryInfo: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  categoryDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    marginRight: 6,
  },
  categoryName: {
    fontWeight: '600',
    color: '#222B45',
  },
  monthlyLabel: {
    color: '#8F9BB3',
    fontSize: 10,
  },
  amountRow: {
    flexDirection: 'row',
    alignItems: 'baseline',
    marginBottom: 8,
  },
  spentAmount: {
    fontWeight: 'bold',
    color: '#222B45',
    marginRight: 4,
  },
  budgetLimit: {
    color: '#8F9BB3',
    fontSize: 12,
  },
  progressContainer: {
    marginBottom: 6,
  },
  progressBar: {
    height: 4,
    backgroundColor: '#E4E9F2',
    borderRadius: 2,
    overflow: 'hidden',
  },
  progressFill: {
    height: '100%',
    borderRadius: 2,
  },
  remainingText: {
    fontSize: 10,
    fontWeight: '500',
  },
});
