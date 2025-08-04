import React, { useState } from 'react';
import { View, StyleSheet, ScrollView, KeyboardAvoidingView, Platform, Dimensions, Text as RNText, Alert } from 'react-native';
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
  const { 
    totalSpent, 
    expenses, 
    isPlaidConnected, 
    getSpendingInsights 
  } = useExpenseStore();
  const { score, level, aiTokens, useAIToken, hasAITokens } = useGameStore();

  const aiModes = [
    { title: 'Advisor', value: 'advisor' },
    { title: 'Hype', value: 'hype' },
    { title: 'Roast', value: 'roast' },
  ];

  const handleSend = () => {
    if (!message.trim()) return;

    // Check if user has tokens
    if (!hasAITokens()) {
      Alert.alert(
        'No AI Tokens! 🪙',
        'You need tokens to chat with the AI advisor. Earn tokens by learning topics in the Learn section!',
        [
          {
            text: 'Go to Learn',
            onPress: () => navigation.getParent()?.navigate('LearnTab')
          },
          {
            text: 'Cancel',
            style: 'cancel'
          }
        ]
      );
      return;
    }

    // Use a token
    useAIToken();

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
      
      // Get real spending insights if Plaid is connected
      const spendingInsights = isPlaidConnected ? getSpendingInsights() : null;
      
      const generateContextualResponse = () => {
        if (spendingInsights) {
          const { 
            weeklySpent, 
            monthlySpent, 
            topSpendingCategory, 
            topSpendingAmount, 
            averageDailySpending,
            recentTransactions 
          } = spendingInsights;

          switch (aiMode) {
            case 'advisor':
              return `Based on your real transaction data: You've spent $${weeklySpent.toFixed(2)} this week and $${monthlySpent.toFixed(2)} this month. Your top spending category is ${topSpendingCategory} at $${topSpendingAmount.toFixed(2)}. Your daily average is $${averageDailySpending.toFixed(2)}. Consider setting a budget for ${topSpendingCategory} to better manage your finances. Your game level ${level} shows great learning progress!`;
              
            case 'hype':
              return `YO! Level ${level}?! That's LEGENDARY! 🔥 I see you've been spending $${weeklySpent.toFixed(2)} this week - you're living your life! Your ${topSpendingCategory} game is strong at $${topSpendingAmount.toFixed(2)}! But let's channel that energy into SMASHING your savings goals! You're a financial WARRIOR! 💪`;
              
            case 'roast':
              return `Oh look who's at level ${level} but spent $${weeklySpent.toFixed(2)} this week! 😏 $${topSpendingAmount.toFixed(2)} on ${topSpendingCategory}? Really? At $${averageDailySpending.toFixed(2)} per day, you're treating money like Monopoly cash! Time to put those game skills to work on your REAL budget! 🎯`;
              
            default:
              return `You've spent $${weeklySpent.toFixed(2)} this week with most going to ${topSpendingCategory}.`;
          }
        } else {
          // Fallback for manual expense tracking
          const context = `User has spent $${totalSpent} this month, level ${level}, score ${score}`;
          
          switch (aiMode) {
            case 'advisor':
              return `Based on your logged expenses of $${totalSpent} this month, I'd recommend reviewing your budget categories. Your game level ${level} shows you're learning well! Consider connecting your bank account for more personalized insights.`;
            case 'hype':
              return `YO! Level ${level}?! That's FIRE! 🔥 Keep crushing those financial goals! Your $${totalSpent} spending this month shows you're tracking your money like a BOSS!`;
            case 'roast':
              return `$${totalSpent} this month and only manual tracking? Come on! At level ${level}, I expected you to have your bank connected by now! Step up your money game! 😤`;
            default:
              return `Based on your expenses and game progress, here's my advice...`;
          }
        }
      };

      response = generateContextualResponse();

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
      <RNText style={msg.sender === 'user' ? styles.userText : styles.aiText}>
        {msg.text}
      </RNText>
    </View>
  );

  return (
    <Layout style={styles.container}>
      <TopNavigation title='AI Assistant' alignment='center' />
      
      <KeyboardAvoidingView 
        style={styles.content}
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        keyboardVerticalOffset={Platform.OS === 'ios' ? 90 : 0}
      >
        <Card style={styles.tokenCard}>
          <View style={styles.tokenHeader}>
            <Ionicons name="diamond" size={20} color="#FFD700" />
            <Text category='s1' style={styles.tokenTitle}>AI Tokens: {aiTokens}</Text>
          </View>
          <Text category='c1' style={styles.tokenSubtitle}>
            {aiTokens > 0 
              ? 'Each message costs 1 token' 
              : 'Earn tokens by learning topics!'}
          </Text>
        </Card>

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

        <ScrollView 
          style={styles.chatContainer}
          keyboardShouldPersistTaps="handled"
          showsVerticalScrollIndicator={false}
          contentContainerStyle={styles.chatContent}
        >
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
            onSubmitEditing={handleSend}
            returnKeyType="send"
          />
          <Button
            style={styles.sendButton}
            accessoryLeft={SendIcon}
            onPress={handleSend}
            disabled={!message.trim()}
          />
        </View>
      </KeyboardAvoidingView>
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
    paddingHorizontal: 16,
    paddingTop: 16,
    paddingBottom: 8,
  },
  tokenCard: {
    marginBottom: 16,
    backgroundColor: '#FFF9E6',
    borderLeftWidth: 4,
    borderLeftColor: '#FFD700',
  },
  tokenHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 4,
  },
  tokenTitle: {
    marginLeft: 8,
    fontWeight: 'bold',
    color: '#D4AF37',
  },
  tokenSubtitle: {
    color: '#8B7355',
    fontSize: 12,
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
    marginBottom: 8,
  },
  chatContent: {
    flexGrow: 1,
    paddingBottom: 20,
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
    backgroundColor: '#F3F4F6',
    borderWidth: 1,
    borderColor: '#D1D5DB',
  },
  userText: {
    color: '#FFFFFF',
    fontWeight: '600',
    fontSize: 16,
  },
  aiText: {
    color: '#000000',
    fontWeight: '700',
    fontSize: 16,
    lineHeight: 22,
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 12,
    backgroundColor: '#FFF',
    borderTopWidth: 1,
    borderTopColor: '#E5E7EB',
    minHeight: 60,
  },
  input: {
    flex: 1,
    marginRight: 8,
    backgroundColor: '#F8F9FA',
  },
  sendButton: {
    paddingHorizontal: 16,
  },
});
