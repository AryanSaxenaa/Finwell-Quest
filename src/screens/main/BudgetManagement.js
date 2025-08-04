import React, { useState } from 'react';
import { View, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { 
  Layout, 
  Text, 
  Input,
  Modal 
} from '@ui-kitten/components';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { useBudgetStore, useExpenseStore } from '../../store';
import { 
  BrutalCard, 
  BrutalButton, 
  BrutalHeader,
  brutalTextStyle 
} from '../../components/BrutalComponents';
import { NeoBrutalism } from '../../styles/neoBrutalism';

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
      <BrutalCard style={styles.budgetCard}>
        <View style={styles.budgetHeader}>
          <View style={styles.categoryInfo}>
            <View 
              style={[styles.categoryDot, { backgroundColor: budget.color }]} 
            />
            <Text style={brutalTextStyle('h6', 'bold', 'black')}>
              {budget.category.toUpperCase()}
            </Text>
          </View>
          <Text 
            style={[
              brutalTextStyle('caption', 'bold', budget.isOverBudget ? 'white' : 'black'),
              styles.statusText,
              { 
                backgroundColor: budget.isOverBudget ? NeoBrutalism.colors.hotPink : NeoBrutalism.colors.neonGreen,
                paddingHorizontal: NeoBrutalism.spacing.sm,
                paddingVertical: NeoBrutalism.spacing.xs
              }
            ]}
          >
            {budget.isOverBudget ? 'OVER BUDGET' : 'ON TRACK'}
          </Text>
        </View>

        <View style={styles.amountSection}>
          <View style={styles.amountRow}>
            <Text style={brutalTextStyle('h4', 'bold', 'black')}>
              ${budget.spent}
            </Text>
            <Text style={brutalTextStyle('body', 'medium', 'gray')}>
              OF ${budget.limit}
            </Text>
          </View>
          
          <View style={styles.progressContainer}>
            <View style={styles.progressBar}>
              <View 
                style={[
                  styles.progressFill, 
                  { 
                    width: `${Math.min(budget.percentage, 100)}%`,
                    backgroundColor: budget.isOverBudget ? NeoBrutalism.colors.hotPink : budget.color 
                  }
                ]} 
              />
            </View>
            <Text style={brutalTextStyle('caption', 'bold', 'black')}>
              {budget.percentage}%
            </Text>
          </View>

          <Text 
            style={[
              brutalTextStyle('body', 'medium', budget.isOverBudget ? 'white' : 'gray'),
              styles.remainingText,
              { 
                backgroundColor: budget.isOverBudget ? NeoBrutalism.colors.hotPink : 'transparent',
                paddingHorizontal: budget.isOverBudget ? NeoBrutalism.spacing.sm : 0,
                paddingVertical: budget.isOverBudget ? NeoBrutalism.spacing.xs : 0
              }
            ]}
          >
            {budget.isOverBudget 
              ? `$${Math.abs(budget.remaining)} OVER BUDGET`
              : `$${budget.remaining} REMAINING THIS MONTH`
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
                placeholder="BUDGET LIMIT"
              />
              <BrutalButton title="SAVE" size="small" variant="primary" onPress={handleSaveLimit} />
              <BrutalButton 
                title="CANCEL"
                size="small" 
                variant="secondary"
                onPress={() => {
                  setEditLimit(budget.limit.toString());
                  setIsEditing(false);
                }}
              />
            </View>
          ) : (
            <BrutalButton 
              title="EDIT BUDGET LIMIT"
              size="small" 
              variant="secondary"
              onPress={() => setIsEditing(true)}
            />
          )}
        </View>
      </BrutalCard>
    );
  };

  return (
    <SafeAreaView style={styles.safeArea} edges={['top', 'left', 'right']}>
      <Layout style={styles.container}>
        <BrutalHeader 
          title="BUDGET MANAGEMENT"
          leftAction={
            <TouchableOpacity onPress={() => navigation.goBack()}>
              <Ionicons name="arrow-back" size={24} color={NeoBrutalism.colors.black} />
            </TouchableOpacity>
          }
          rightAction={
            <TouchableOpacity onPress={() => setShowAddModal(true)}>
              <Ionicons name="add" size={24} color={NeoBrutalism.colors.black} />
            </TouchableOpacity>
          }
        />
        
        <ScrollView style={styles.content}>
          <Text style={[brutalTextStyle('h6', 'bold', 'black'), styles.sectionTitle]}>
            MONTHLY BUDGETS
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
          <BrutalCard style={styles.modalCard}>
            <Text style={[brutalTextStyle('h6', 'bold', 'black'), styles.modalTitle]}>
              ADD NEW BUDGET
            </Text>
            
            <Input
              style={styles.input}
              label="CATEGORY"
              placeholder="ENTER CATEGORY NAME"
              value={newBudgetCategory}
              onChangeText={setNewBudgetCategory}
            />
            
            <Input
              style={styles.input}
              label="MONTHLY BUDGET LIMIT"
              placeholder="ENTER AMOUNT"
              value={newBudgetLimit}
              onChangeText={setNewBudgetLimit}
              keyboardType="numeric"
            />
            
            <View style={styles.modalButtons}>
              <BrutalButton 
                title="CANCEL"
                variant="secondary"
                style={styles.modalButton}
                onPress={() => setShowAddModal(false)}
              />
              <BrutalButton 
                title="ADD BUDGET"
                variant="primary"
                style={styles.modalButton}
                onPress={handleAddBudget}
              />
            </View>
          </BrutalCard>
        </Modal>
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
    backgroundColor: NeoBrutalism.colors.background,
  },
  content: {
    flex: 1,
    padding: NeoBrutalism.spacing.lg,
  },
  sectionTitle: {
    marginBottom: NeoBrutalism.spacing.lg,
  },
  budgetCard: {
    marginBottom: NeoBrutalism.spacing.lg,
  },
  budgetHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: NeoBrutalism.spacing.lg,
  },
  categoryInfo: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  categoryDot: {
    width: 16,
    height: 16,
    borderRadius: 0,
    marginRight: NeoBrutalism.spacing.sm,
    borderWidth: NeoBrutalism.borders.medium,
    borderColor: NeoBrutalism.colors.black,
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
