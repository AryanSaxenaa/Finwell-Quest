import React, { useState } from 'react';
import { View, StyleSheet, ScrollView } from 'react-native';
import { 
  Layout, 
  Text, 
  Card, 
  Button,
  TopNavigation,
  TopNavigationAction,
  Input,
  Modal 
} from '@ui-kitten/components';
import { Ionicons } from '@expo/vector-icons';
import { useBudgetStore, useExpenseStore } from '../../store';

const BackIcon = (props) => <Ionicons name="arrow-back" size={24} color="#8F9BB3" />;
const PlusIcon = (props) => <Ionicons name="add-outline" size={24} color="#8F9BB3" />;

export default function BudgetManagement({ navigation }) {
  const { getBudgetSummary, setBudgetLimit, addBudget } = useBudgetStore();
  const { categories } = useExpenseStore();
  const [showAddModal, setShowAddModal] = useState(false);
  const [newBudgetCategory, setNewBudgetCategory] = useState('');
  const [newBudgetLimit, setNewBudgetLimit] = useState('');
  
  const budgets = getBudgetSummary();

  const renderBackAction = () => (
    <TopNavigationAction 
      icon={BackIcon} 
      onPress={() => navigation.goBack()} 
    />
  );

  const renderAddAction = () => (
    <TopNavigationAction 
      icon={PlusIcon} 
      onPress={() => setShowAddModal(true)} 
    />
  );

  const handleAddBudget = () => {
    if (newBudgetCategory && newBudgetLimit) {
      const colors = ['#FF6384', '#36A2EB', '#FFCE56', '#4BC0C0', '#9966FF', '#FF9F40'];
      addBudget({
        category: newBudgetCategory,
        limit: parseFloat(newBudgetLimit),
        spent: 0,
        color: colors[budgets.length % colors.length]
      });
      setNewBudgetCategory('');
      setNewBudgetLimit('');
      setShowAddModal(false);
    }
  };

  const BudgetDetailCard = ({ budget }) => {
    const [editLimit, setEditLimit] = useState(budget.limit.toString());
    const [isEditing, setIsEditing] = useState(false);

    const handleSaveLimit = () => {
      setBudgetLimit(budget.category, parseFloat(editLimit));
      setIsEditing(false);
    };

    return (
      <Card style={styles.budgetCard}>
        <View style={styles.budgetHeader}>
          <View style={styles.categoryInfo}>
            <View 
              style={[styles.categoryDot, { backgroundColor: budget.color }]} 
            />
            <Text category='h6' style={styles.categoryName}>
              {budget.category}
            </Text>
          </View>
          <Text 
            category='c1' 
            style={[
              styles.statusText,
              { color: budget.isOverBudget ? '#E74C3C' : '#27AE60' }
            ]}
          >
            {budget.isOverBudget ? 'Over Budget' : 'On Track'}
          </Text>
        </View>

        <View style={styles.amountSection}>
          <View style={styles.amountRow}>
            <Text category='h4' style={styles.spentAmount}>
              ${budget.spent}
            </Text>
            <Text category='p1' style={styles.limitText}>
              of ${budget.limit}
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
            <Text category='c1' style={styles.percentageText}>
              {budget.percentage}%
            </Text>
          </View>

          <Text 
            category='p2' 
            style={[
              styles.remainingText,
              { color: budget.isOverBudget ? '#E74C3C' : '#8F9BB3' }
            ]}
          >
            {budget.isOverBudget 
              ? `$${Math.abs(budget.remaining)} over budget`
              : `$${budget.remaining} remaining this month`
            }
          </Text>
        </View>

        <View style={styles.editSection}>
          {isEditing ? (
            <View style={styles.editRow}>
              <Input
                style={styles.editInput}
                value={editLimit}
                onChangeText={setEditLimit}
                keyboardType="numeric"
                placeholder="Budget limit"
              />
              <Button size="small" onPress={handleSaveLimit}>
                Save
              </Button>
              <Button 
                size="small" 
                appearance="ghost" 
                onPress={() => {
                  setEditLimit(budget.limit.toString());
                  setIsEditing(false);
                }}
              >
                Cancel
              </Button>
            </View>
          ) : (
            <Button 
              size="small" 
              appearance="outline"
              onPress={() => setIsEditing(true)}
            >
              Edit Budget Limit
            </Button>
          )}
        </View>
      </Card>
    );
  };

  return (
    <Layout style={styles.container}>
      <TopNavigation
        title='Budget Management'
        accessoryLeft={renderBackAction}
        accessoryRight={renderAddAction}
      />
      
      <ScrollView style={styles.content}>
        <Text category='h6' style={styles.sectionTitle}>
          Monthly Budgets
        </Text>
        
        {budgets.map((budget) => (
          <BudgetDetailCard key={budget.id} budget={budget} />
        ))}
      </ScrollView>

      <Modal
        visible={showAddModal}
        backdropStyle={styles.backdrop}
        onBackdropPress={() => setShowAddModal(false)}
      >
        <Card disabled={true}>
          <Text category='h6' style={styles.modalTitle}>
            Add New Budget
          </Text>
          
          <Input
            style={styles.input}
            label="Category"
            placeholder="Enter category name"
            value={newBudgetCategory}
            onChangeText={setNewBudgetCategory}
          />
          
          <Input
            style={styles.input}
            label="Monthly Budget Limit"
            placeholder="Enter amount"
            value={newBudgetLimit}
            onChangeText={setNewBudgetLimit}
            keyboardType="numeric"
          />
          
          <View style={styles.modalButtons}>
            <Button 
              style={styles.modalButton}
              appearance="outline"
              onPress={() => setShowAddModal(false)}
            >
              Cancel
            </Button>
            <Button 
              style={styles.modalButton}
              onPress={handleAddBudget}
            >
              Add Budget
            </Button>
          </View>
        </Card>
      </Modal>
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
  sectionTitle: {
    marginBottom: 16,
    fontWeight: 'bold',
  },
  budgetCard: {
    marginBottom: 16,
  },
  budgetHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  categoryInfo: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  categoryDot: {
    width: 12,
    height: 12,
    borderRadius: 6,
    marginRight: 8,
  },
  categoryName: {
    fontWeight: 'bold',
  },
  statusText: {
    fontWeight: '600',
    fontSize: 12,
  },
  amountSection: {
    marginBottom: 16,
  },
  amountRow: {
    flexDirection: 'row',
    alignItems: 'baseline',
    marginBottom: 12,
  },
  spentAmount: {
    fontWeight: 'bold',
    color: '#222B45',
    marginRight: 8,
  },
  limitText: {
    color: '#8F9BB3',
  },
  progressContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  progressBar: {
    flex: 1,
    height: 8,
    backgroundColor: '#E4E9F2',
    borderRadius: 4,
    overflow: 'hidden',
    marginRight: 8,
  },
  progressFill: {
    height: '100%',
    borderRadius: 4,
  },
  percentageText: {
    fontSize: 12,
    fontWeight: '600',
    color: '#8F9BB3',
    width: 35,
  },
  remainingText: {
    fontSize: 12,
  },
  editSection: {
    borderTopWidth: 1,
    borderTopColor: '#E4E9F2',
    paddingTop: 12,
  },
  editRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  editInput: {
    flex: 1,
  },
  backdrop: {
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  modalTitle: {
    marginBottom: 16,
    textAlign: 'center',
  },
  input: {
    marginBottom: 16,
  },
  modalButtons: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  modalButton: {
    flex: 1,
    marginHorizontal: 4,
  },
});
