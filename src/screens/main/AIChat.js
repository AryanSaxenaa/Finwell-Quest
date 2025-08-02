import React, { useState } from 'react';
import { View, StyleSheet, ScrollView } from 'react-native';
import { 
  Layout, 
  Text, 
  Input, 
  Button, 
  Card, 
  TopNavigation,
  ButtonGroup 
} from '@ui-kitten/components';
import { Ionicons } from '@expo/vector-icons';
import { useChatStore, useExpenseStore, useGameStore } from '../../store';

const SendIcon = (props) => <Ionicons name="paper-plane-outline" size={24} color="white" />;

export default function AIChat({ navigation }) {
  const [message, setMessage] = useState('');
  const { chatHistory, aiMode, addMessage, setAIMode } = useChatStore();
  const { totalSpent, expenses } = useExpenseStore();
  const { score, level } = useGameStore();

  const aiModes = [
    { title: 'Advisor', value: 'advisor' },
    { title: 'Hype', value: 'hype' },
    { title: 'Roast', value: 'roast' },
  ];

  const handleSend = () => {
    if (!message.trim()) return;

    // Add user message
    addMessage({
      id: Date.now(),
      text: message,
      sender: 'user',
      timestamp: new Date().toISOString(),
    });

    // Simulate AI response based on mode and context
    setTimeout(() => {
      let response = '';
      const context = `User has spent $${totalSpent} this month, level ${level}, score ${score}`;
      
      switch (aiMode) {
        case 'advisor':
          response = `Based on your spending of $${totalSpent} this month, I'd recommend reviewing your budget categories. Your game level ${level} shows you're learning well!`;
          break;
        case 'hype':
          response = `YO! Level ${level}?! That's FIRE! 🔥 Keep crushing those financial goals! Your $${totalSpent} spending this month is data for SUCCESS!`;
          break;
        case 'roast':
          response = `$${totalSpent} this month? Really? At level ${level}, I thought you'd know better! Time to get serious about that budget! 😤`;
          break;
      }

      addMessage({
        id: Date.now() + 1,
        text: response,
        sender: 'ai',
        timestamp: new Date().toISOString(),
      });
    }, 1000);

    setMessage('');
  };

  const renderMessage = (msg) => (
    <View key={msg.id} style={[
      styles.message,
      msg.sender === 'user' ? styles.userMessage : styles.aiMessage
    ]}>
      <Text style={msg.sender === 'user' ? styles.userText : styles.aiText}>
        {msg.text}
      </Text>
    </View>
  );

  return (
    <Layout style={styles.container}>
      <TopNavigation title='AI Assistant' alignment='center' />
      
      <View style={styles.content}>
        <Card style={styles.modeCard}>
          <Text category='s1' style={styles.modeTitle}>AI Personality:</Text>
          <ButtonGroup style={styles.modeButtons}>
            {aiModes.map((mode, index) => (
              <Button
                key={mode.value}
                style={[
                  styles.modeButton,
                  aiMode === mode.value && styles.activeModeButton
                ]}
                appearance={aiMode === mode.value ? 'filled' : 'outline'}
                size='small'
                onPress={() => setAIMode(mode.value)}
              >
                {mode.title}
              </Button>
            ))}
          </ButtonGroup>
        </Card>

        <ScrollView style={styles.chatContainer}>
          {chatHistory.length === 0 ? (
            <Text style={styles.emptyChat}>
              Start a conversation with your AI financial assistant!
            </Text>
          ) : (
            chatHistory.map(renderMessage)
          )}
        </ScrollView>

        <View style={styles.inputContainer}>
          <Input
            style={styles.input}
            placeholder="Ask about your finances..."
            value={message}
            onChangeText={setMessage}
            multiline
          />
          <Button
            style={styles.sendButton}
            accessoryLeft={SendIcon}
            onPress={handleSend}
            disabled={!message.trim()}
          />
        </View>
      </View>
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
  modeCard: {
    marginBottom: 16,
  },
  modeTitle: {
    marginBottom: 8,
  },
  modeButtons: {
    flexDirection: 'row',
  },
  modeButton: {
    flex: 1,
    marginHorizontal: 4,
  },
  activeModeButton: {
    backgroundColor: '#6C5CE7',
  },
  chatContainer: {
    flex: 1,
    marginBottom: 16,
  },
  emptyChat: {
    textAlign: 'center',
    fontStyle: 'italic',
    opacity: 0.6,
    padding: 20,
  },
  message: {
    marginBottom: 12,
    padding: 12,
    borderRadius: 12,
    maxWidth: '80%',
  },
  userMessage: {
    alignSelf: 'flex-end',
    backgroundColor: '#6C5CE7',
  },
  aiMessage: {
    alignSelf: 'flex-start',
    backgroundColor: '#E5E5E5',
  },
  userText: {
    color: 'white',
  },
  aiText: {
    color: '#333',
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'flex-end',
  },
  input: {
    flex: 1,
    marginRight: 8,
  },
  sendButton: {
    paddingHorizontal: 16,
  },
});
