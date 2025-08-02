import React, { useState } from 'react';
import { View, StyleSheet, Modal as RNModal } from 'react-native';
import { 
  Layout, 
  Text, 
  Input, 
  Button, 
  Select,
  SelectItem,
  Card
} from '@ui-kitten/components';
import { Ionicons } from '@expo/vector-icons';
import { useExpenseStore } from '../store';

const CalendarIcon = (props) => <Ionicons name="calendar-outline" size={24} color="#8F9BB3" />;
const CloseIcon = (props) => <Ionicons name="close-outline" size={24} color="#8F9BB3" />;

export default function AddExpenseModal({ visible, onClose }) {
  const [amount, setAmount] = useState('');
  const [description, setDescription] = useState('');
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [date, setDate] = useState(new Date().toLocaleDateString());
  
  const { categories, addExpense } = useExpenseStore();

  const handleSave = () => {
    if (!amount || !selectedCategory) {
      return;
    }

    const expense = {
      id: Date.now().toString(),
      amount: parseFloat(amount),
      category: categories[selectedCategory.row],
      description,
      date: new Date().toISOString(),
    };

    addExpense(expense);
    
    // Reset form
    setAmount('');
    setDescription('');
    setSelectedCategory(null);
    setDate(new Date().toLocaleDateString());
    
    onClose();
  };

  return (
    <RNModal
      visible={visible}
      animationType="slide"
      transparent={true}
    >
      <View style={styles.overlay}>
        <Card style={styles.modal}>
          <View style={styles.header}>
            <Text category='h5'>Add Expense</Text>
            <Button
              appearance='ghost'
              accessoryLeft={CloseIcon}
              onPress={onClose}
              style={styles.closeButton}
            />
          </View>

          <Input
            style={styles.input}
            placeholder='Amount'
            value={amount}
            onChangeText={setAmount}
            keyboardType='numeric'
            accessoryLeft={<Text>$</Text>}
          />

          <Select
            style={styles.input}
            placeholder='Select Category'
            value={selectedCategory ? categories[selectedCategory.row] : ''}
            selectedIndex={selectedCategory}
            onSelect={setSelectedCategory}
          >
            {categories.map((category, index) => (
              <SelectItem key={index} title={category} />
            ))}
          </Select>

          <Input
            style={styles.input}
            placeholder='Description (optional)'
            value={description}
            onChangeText={setDescription}
            multiline
          />

          <Input
            style={styles.input}
            placeholder='Date'
            value={date}
            accessoryLeft={CalendarIcon}
            disabled
          />

          <View style={styles.buttonContainer}>
            <Button
              style={styles.button}
              appearance='outline'
              onPress={onClose}
            >
              Cancel
            </Button>
            <Button
              style={styles.button}
              onPress={handleSave}
              disabled={!amount || !selectedCategory}
            >
              Save
            </Button>
          </View>
        </Card>
      </View>
    </RNModal>
  );
}

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modal: {
    width: '90%',
    maxWidth: 400,
    padding: 20,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
  },
  closeButton: {
    paddingHorizontal: 0,
  },
  input: {
    marginBottom: 16,
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 20,
  },
  button: {
    flex: 1,
    marginHorizontal: 8,
  },
});
