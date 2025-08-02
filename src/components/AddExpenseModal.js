import React, { useState, useEffect } from 'react';
import { View, StyleSheet } from 'react-native';
import Modal from 'react-native-modal';
import { Layout, Text, Button, Select, SelectItem, Input } from '@ui-kitten/components';
import { useExpenseStore } from '../store/index.js';

export default function AddExpenseModal({ visible, onClose }) {
  const [amount, setAmount] = useState('');
  const [description, setDescription] = useState('');
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [date, setDate] = useState(new Date().toLocaleDateString());
  const { categories, addExpense } = useExpenseStore();

  // Reset form when modal opens
  useEffect(() => {
    if (visible) {
      setAmount('');
      setDescription('');
      setSelectedCategory(null);
      setDate(new Date().toLocaleDateString());
    }
  }, [visible]);

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
    onClose();
  };

  return (
    <Modal
      isVisible={visible}
      onBackdropPress={onClose}
      onBackButtonPress={onClose}
      style={{ margin: 0, justifyContent: 'center' }}
    >
      <Layout style={styles.container}>
          <View style={styles.header}>
            <Text category='h5'>Add Expense</Text>
            <Button
              appearance='ghost'
              onPress={onClose}
              style={styles.closeButton}
            >
              ✕
            </Button>
          </View>

          <View style={styles.form}>
            <Input
              style={styles.input}
              placeholder='0.00'
              label='Amount ($)'
              value={amount}
              onChangeText={(text) => {
                console.log('Amount changed:', text);
                setAmount(text);
              }}
              keyboardType='decimal-pad'
              returnKeyType="next"
              autoFocus
            />

            <Select
              style={styles.input}
              placeholder='Select Category'
              label='Category'
              value={selectedCategory ? categories[selectedCategory.row] : null}
              selectedIndex={selectedCategory}
              onSelect={(index) => setSelectedCategory(index)}
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
              multiline={true}
              numberOfLines={3}
            />

            <Input
              style={styles.input}
              placeholder='Date'
              value={date}
              disabled
            />
          </View>

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
        </Layout>
    </Modal>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#ffffff',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingTop: 60,
    paddingBottom: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#E4E9F2',
  },
  closeButton: {
    paddingHorizontal: 0,
  },
  form: {
    flex: 1,
    paddingHorizontal: 20,
    paddingTop: 20,
  },
  input: {
    marginBottom: 16,
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingBottom: 40,
    paddingTop: 20,
  },
  button: {
    flex: 1,
    marginHorizontal: 8,
  },
});