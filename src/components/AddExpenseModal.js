import React, { useState, useEffect, useCallback } from 'react';
import { View, StyleSheet, TouchableOpacity } from 'react-native';
import Modal from 'react-native-modal';
import { Layout, Text, Button, Input } from '@ui-kitten/components';
import { useExpenseStore } from '../store/index.js';

export default function AddExpenseModal({ visible, onClose }) {
  const [amount, setAmount] = useState('');
  const [description, setDescription] = useState('');
  const [selectedCategoryIndex, setSelectedCategoryIndex] = useState(null);
  const [showCategoryPicker, setShowCategoryPicker] = useState(false);
  const [date, setDate] = useState(new Date().toLocaleDateString());
  const { categories, addExpense } = useExpenseStore();

  // Reset form when modal opens
  useEffect(() => {
    if (visible) {
      setAmount('');
      setDescription('');
      setSelectedCategoryIndex(null);
      setShowCategoryPicker(false);
      setDate(new Date().toLocaleDateString());
    }
  }, [visible]);

  const handleCategorySelect = (index) => {
    setSelectedCategoryIndex(index);
    setShowCategoryPicker(false);
  };

  const handleSave = () => {
    if (!amount || selectedCategoryIndex === null) {
      return;
    }
    const expense = {
      id: Date.now().toString(),
      amount: parseFloat(amount),
      category: categories[selectedCategoryIndex],
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
              onChangeText={setAmount}
              keyboardType='decimal-pad'
              returnKeyType="next"
            />

            <View style={styles.input}>
              <Text category='label' style={styles.label}>Category</Text>
              <TouchableOpacity
                style={styles.categoryButton}
                onPress={() => setShowCategoryPicker(true)}
              >
                <Text style={styles.categoryButtonText}>
                  {selectedCategoryIndex !== null 
                    ? categories[selectedCategoryIndex] 
                    : 'Select Category'}
                </Text>
              </TouchableOpacity>
            </View>

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
              disabled={!amount || selectedCategoryIndex === null}
            >
              Save
            </Button>
          </View>
        </Layout>

        {/* Category Picker Modal */}
        <Modal
          isVisible={showCategoryPicker}
          onBackdropPress={() => setShowCategoryPicker(false)}
          onBackButtonPress={() => setShowCategoryPicker(false)}
          style={styles.categoryModal}
        >
          <Layout style={styles.categoryContainer}>
            <Text category='h6' style={styles.categoryTitle}>Select Category</Text>
            {categories.map((category, index) => (
              <TouchableOpacity
                key={index}
                style={styles.categoryOption}
                onPress={() => handleCategorySelect(index)}
              >
                <Text style={styles.categoryOptionText}>{category}</Text>
              </TouchableOpacity>
            ))}
          </Layout>
        </Modal>
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
  label: {
    marginBottom: 8,
    fontSize: 12,
    fontWeight: '600',
    color: '#8F9BB3',
  },
  categoryButton: {
    borderWidth: 1,
    borderColor: '#E4E9F2',
    borderRadius: 4,
    padding: 16,
    backgroundColor: '#FFFFFF',
  },
  categoryButtonText: {
    fontSize: 16,
    color: '#222B45',
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
  categoryModal: {
    justifyContent: 'center',
    margin: 20,
  },
  categoryContainer: {
    backgroundColor: '#ffffff',
    borderRadius: 8,
    padding: 20,
    maxHeight: 400,
  },
  categoryTitle: {
    marginBottom: 16,
    textAlign: 'center',
  },
  categoryOption: {
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#E4E9F2',
  },
  categoryOptionText: {
    fontSize: 16,
    color: '#222B45',
  },
});