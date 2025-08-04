import React, { useState, useEffect, useCallback } from 'react';
import { View, StyleSheet, TouchableOpacity, Text, TextInput } from 'react-native';
import Modal from 'react-native-modal';
import { useExpenseStore } from '../store/index.js';
import { 
  BrutalCard, 
  BrutalButton, 
  BrutalHeader,
  brutalTextStyle 
} from './BrutalComponents';
import { NeoBrutalism } from '../styles/neoBrutalism';

export default function AddExpenseModal({ visible, onClose }) {
  const [amount, setAmount] = useState('');
  const [description, setDescription] = useState('');
  const [selectedCategoryIndex, setSelectedCategoryIndex] = useState(null);
  const [showCategoryPicker, setShowCategoryPicker] = useState(false);
  const [showAmountInput, setShowAmountInput] = useState(false);
  const [showDescriptionInput, setShowDescriptionInput] = useState(false);
  const [tempAmount, setTempAmount] = useState('');
  const [tempDescription, setTempDescription] = useState('');
  const [date, setDate] = useState(new Date().toLocaleDateString());
  const { categories, addExpense } = useExpenseStore();

  // Reset form when modal opens
  useEffect(() => {
    if (visible) {
      setAmount('');
      setDescription('');
      setSelectedCategoryIndex(null);
      setShowCategoryPicker(false);
      setShowAmountInput(false);
      setShowDescriptionInput(false);
      setTempAmount('');
      setTempDescription('');
      setDate(new Date().toLocaleDateString());
    }
  }, [visible]);

  const handleCategorySelect = (index) => {
    setSelectedCategoryIndex(index);
    setShowCategoryPicker(false);
  };

  const handleAmountSave = () => {
    setAmount(tempAmount);
    setShowAmountInput(false);
    setTempAmount('');
  };

  const handleDescriptionSave = () => {
    setDescription(tempDescription);
    setShowDescriptionInput(false);
    setTempDescription('');
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
      <View style={styles.container}>
          <BrutalCard style={styles.header}>
            <Text style={brutalTextStyle('h5', 'bold', 'white')}>💰 ADD EXPENSE</Text>
            <BrutalButton
              title="✕"
              variant="secondary"
              onPress={onClose}
              style={styles.closeButton}
            />
          </BrutalCard>

          <View style={styles.form}>
            <View style={styles.inputContainer}>
              <Text style={brutalTextStyle('body', 'bold', 'black')}>AMOUNT ($)</Text>
              <TouchableOpacity 
                style={styles.brutaInput} 
                onPress={() => {
                  setTempAmount(amount);
                  setShowAmountInput(true);
                }}
              >
                <Text style={[brutalTextStyle('body', 'medium', 'black'), styles.inputText, !amount && styles.placeholderText]}>
                  {amount || '0.00'}
                </Text>
              </TouchableOpacity>
            </View>

            <View style={styles.inputContainer}>
              <Text style={brutalTextStyle('body', 'bold', 'black')}>CATEGORY</Text>
              <TouchableOpacity
                style={styles.categoryButton}
                onPress={() => setShowCategoryPicker(true)}
              >
                <Text style={brutalTextStyle('body', 'medium', 'black')}>
                  {selectedCategoryIndex !== null 
                    ? categories[selectedCategoryIndex].toUpperCase()
                    : 'SELECT CATEGORY'}
                </Text>
              </TouchableOpacity>
            </View>

            <View style={styles.inputContainer}>
              <Text style={brutalTextStyle('body', 'bold', 'black')}>DESCRIPTION</Text>
              <TouchableOpacity 
                style={styles.brutaInput} 
                onPress={() => {
                  setTempDescription(description);
                  setShowDescriptionInput(true);
                }}
              >
                <Text style={[brutalTextStyle('body', 'medium', 'black'), styles.inputText, !description && styles.placeholderText]}>
                  {description || 'DESCRIPTION (OPTIONAL)'}
                </Text>
              </TouchableOpacity>
            </View>

            <View style={styles.inputContainer}>
              <Text style={brutalTextStyle('body', 'bold', 'black')}>DATE</Text>
              <View style={styles.brutaInput}>
                <Text style={brutalTextStyle('body', 'medium', 'black')}>
                  {date}
                </Text>
              </View>
            </View>
          </View>

          <View style={styles.buttonContainer}>
            <BrutalButton
              title="CANCEL"
              variant="outline"
              style={styles.button}
              onPress={onClose}
            />
            <BrutalButton
              title="💾 SAVE"
              style={styles.button}
              onPress={handleSave}
              disabled={!amount || selectedCategoryIndex === null}
            />
          </View>
        </View>

        {/* Category Picker Modal */}
        <Modal
          isVisible={showCategoryPicker}
          onBackdropPress={() => setShowCategoryPicker(false)}
          onBackButtonPress={() => setShowCategoryPicker(false)}
          style={styles.categoryModal}
        >
          <BrutalCard style={styles.categoryContainer}>
            <Text style={[brutalTextStyle('h6', 'bold', 'black'), styles.categoryTitle]}>📊 SELECT CATEGORY</Text>
            <View style={styles.categoryScrollContainer}>
              {categories.map((category, index) => (
                <TouchableOpacity
                  key={index}
                  style={styles.categoryOption}
                  onPress={() => handleCategorySelect(index)}
                >
                  <Text style={brutalTextStyle('body', 'medium', 'black')}>{category.toUpperCase()}</Text>
                </TouchableOpacity>
              ))}
            </View>
          </BrutalCard>
        </Modal>

        {/* Amount Input Modal */}
        <Modal
          isVisible={showAmountInput}
          onBackdropPress={() => setShowAmountInput(false)}
          onBackButtonPress={() => setShowAmountInput(false)}
          style={styles.inputModal}
        >
          <BrutalCard style={styles.inputContainer}>
            <Text style={[brutalTextStyle('h6', 'bold', 'black'), styles.inputTitle]}>💰 ENTER AMOUNT</Text>
            <TextInput
              style={styles.textInput}
              value={tempAmount}
              onChangeText={setTempAmount}
              placeholder="0.00"
              keyboardType="numeric"
              autoFocus
            />
            <View style={styles.inputButtonContainer}>
              <BrutalButton
                title="CANCEL"
                variant="outline"
                style={styles.inputButton}
                onPress={() => setShowAmountInput(false)}
              />
              <BrutalButton
                title="SAVE"
                style={styles.inputButton}
                onPress={handleAmountSave}
              />
            </View>
          </BrutalCard>
        </Modal>

        {/* Description Input Modal */}
        <Modal
          isVisible={showDescriptionInput}
          onBackdropPress={() => setShowDescriptionInput(false)}
          onBackButtonPress={() => setShowDescriptionInput(false)}
          style={styles.inputModal}
        >
          <BrutalCard style={styles.inputContainer}>
            <Text style={[brutalTextStyle('h6', 'bold', 'black'), styles.inputTitle]}>📝 ENTER DESCRIPTION</Text>
            <TextInput
              style={styles.textInput}
              value={tempDescription}
              onChangeText={setTempDescription}
              placeholder="Description (optional)"
              multiline
              autoFocus
            />
            <View style={styles.inputButtonContainer}>
              <BrutalButton
                title="CANCEL"
                variant="outline"
                style={styles.inputButton}
                onPress={() => setShowDescriptionInput(false)}
              />
              <BrutalButton
                title="SAVE"
                style={styles.inputButton}
                onPress={handleDescriptionSave}
              />
            </View>
          </BrutalCard>
        </Modal>
    </Modal>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: NeoBrutalism.colors.white,
    margin: 20,
    borderWidth: 4,
    borderColor: NeoBrutalism.colors.black,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 16,
    backgroundColor: NeoBrutalism.colors.darkBlue,
    borderBottomWidth: 4,
    borderBottomColor: NeoBrutalism.colors.black,
  },
  closeButton: {
    minWidth: 40,
  },
  form: {
    flex: 1,
    paddingHorizontal: 20,
    paddingTop: 20,
  },
  inputContainer: {
    marginBottom: 20,
  },
  brutaInput: {
    borderWidth: 3,
    borderColor: NeoBrutalism.colors.black,
    backgroundColor: NeoBrutalism.colors.white,
    padding: 16,
    marginTop: 8,
    minHeight: 50,
    justifyContent: 'center',
  },
  inputText: {
    minHeight: 20,
  },
  placeholderText: {
    opacity: 0.6,
  },
  categoryButton: {
    borderWidth: 3,
    borderColor: NeoBrutalism.colors.black,
    backgroundColor: NeoBrutalism.colors.lightGray,
    padding: 16,
    marginTop: 8,
    minHeight: 50,
    justifyContent: 'center',
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingBottom: 20,
    paddingTop: 16,
    gap: 12,
  },
  button: {
    flex: 1,
  },
  categoryModal: {
    justifyContent: 'center',
    margin: 20,
  },
  categoryContainer: {
    backgroundColor: NeoBrutalism.colors.white,
    borderWidth: 4,
    borderColor: NeoBrutalism.colors.black,
    padding: 20,
    maxHeight: '70%', // Limit height to prevent overflow
  },
  categoryTitle: {
    marginBottom: 16,
    textAlign: 'center',
  },
  categoryScrollContainer: {
    maxHeight: 300, // Scrollable area for categories
  },
  categoryOption: {
    padding: 12, // Reduced padding for better fit
    borderWidth: 2,
    borderColor: NeoBrutalism.colors.black,
    backgroundColor: NeoBrutalism.colors.lightGray,
    marginBottom: 6, // Reduced margin
  },
  inputModal: {
    justifyContent: 'center',
    margin: 20,
  },
  inputTitle: {
    marginBottom: 16,
    textAlign: 'center',
  },
  textInput: {
    borderWidth: 3,
    borderColor: NeoBrutalism.colors.black,
    backgroundColor: NeoBrutalism.colors.white,
    padding: 16,
    marginBottom: 20,
    fontSize: 16,
    fontWeight: '600',
    minHeight: 50,
  },
  inputButtonContainer: {
    flexDirection: 'row',
    gap: 12,
  },
  inputButton: {
    flex: 1,
  },
});