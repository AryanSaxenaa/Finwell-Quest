import React, { useState } from 'react';
import { View, StyleSheet, ScrollView, KeyboardAvoidingView, Platform, Dimensions, Text as RNText, Alert, TouchableOpacity } from 'react-native';
import { 
  Layout, 
  Text, 
  Input
} from '@ui-kitten/components';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { useChatStore, useExpenseStore, useGameStore } from '../../store';
import { NeoBrutalism, brutalTextStyle } from '../../styles/neoBrutalism';
import { 
  BrutalCard, 
  BrutalButton, 
  BrutalHeader,
  BrutalIllustration 
} from '../../components/BrutalComponents';

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
    { 
      title: 'ADVISOR', 
      value: 'advisor', 
      icon: 'business-outline',
      color: 'electricBlue',
      description: 'PROFESSIONAL FINANCIAL ADVICE'
    },
    { 
      title: 'HYPE', 
      value: 'hype', 
      icon: 'rocket-outline',
      color: 'neonGreen',
      description: 'MOTIVATIONAL FINANCIAL COACH'
    },
    { 
      title: 'ROAST', 
      value: 'roast', 
      icon: 'flame-outline',
      color: 'hotPink',
      description: 'BRUTALLY HONEST FEEDBACK'
    },
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
      styles.messageContainer,
      msg.sender === 'user' ? styles.userMessageContainer : styles.aiMessageContainer
    ]}>
      <View style={[
        styles.message,
        msg.sender === 'user' ? styles.userMessage : styles.aiMessage
      ]}>
        <View style={styles.messageHeader}>
          <View style={[
            styles.messageSender,
            { backgroundColor: msg.sender === 'user' ? NeoBrutalism.colors.electricBlue : NeoBrutalism.colors.neonGreen }
          ]}>
            <Ionicons 
              name={msg.sender === 'user' ? 'person' : 'chatbubble-ellipses'} 
              size={12} 
              color={NeoBrutalism.colors.black} 
            />
            <Text style={brutalTextStyle('caption', 'bold', 'black')}>
              {msg.sender === 'user' ? 'YOU' : 'AI'}
            </Text>
          </View>
        </View>
        <Text style={[
          brutalTextStyle('body', 'medium', 'black'),
          styles.messageText
        ]}>
          {msg.text}
        </Text>
      </View>
    </View>
  );

  return (
    <SafeAreaView style={styles.safeArea} edges={['top', 'left', 'right']}>
      <Layout style={styles.container}>
        <BrutalHeader 
          title="AI ADVISOR"
          rightAction={
            <View style={styles.tokenBadge}>
              <Ionicons name="diamond" size={16} color={NeoBrutalism.colors.black} />
              <Text style={brutalTextStyle('caption', 'bold', 'black')}>
                {aiTokens}
              </Text>
            </View>
          }
        />
      
      <KeyboardAvoidingView 
        style={styles.content}
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        keyboardVerticalOffset={Platform.OS === 'ios' ? 90 : 0}
      >
        {/* Token Info Section */}
        <View style={styles.tokenSection}>
          <View style={styles.tokenHeader}>
            <Ionicons name="diamond" size={20} color={NeoBrutalism.colors.hotPink} />
            <Text style={brutalTextStyle('h6', 'bold', 'black')}>
              AI TOKENS: {aiTokens}
            </Text>
            <Text style={brutalTextStyle('caption', 'medium', 'gray')}>
              {aiTokens > 0 
                ? 'EACH MESSAGE COSTS 1 TOKEN' 
                : 'EARN TOKENS BY LEARNING!'}
            </Text>
          </View>
        </View>

        {/* AI Mode Selection */}
        <View style={styles.modeSection}>
          <View style={styles.modeGrid}>
            {aiModes.map((mode) => (
              <TouchableOpacity
                key={mode.value}
                style={[
                  styles.modeButton,
                  aiMode === mode.value && styles.activeModeButton
                ]}
                onPress={() => setAIMode(mode.value)}
              >
                <View style={[styles.modeIcon, { backgroundColor: NeoBrutalism.colors[mode.color] }]}>
                  <Ionicons 
                    name={mode.icon} 
                    size={20} 
                    color={NeoBrutalism.colors.black} 
                  />
                </View>
                <Text style={brutalTextStyle('caption', 'bold', 'black')}>
                  {mode.title}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        {/* Chat Area */}
        <ScrollView 
          style={styles.chatContainer}
          keyboardShouldPersistTaps="handled"
          showsVerticalScrollIndicator={false}
          contentContainerStyle={styles.chatContent}
        >
          {chatHistory.length === 0 ? (
            <View style={styles.emptyChatCard}>
              <BrutalIllustration
                source={require('../../../assets/icon.png')}
                size="large"
                style={[styles.emptyChatIcon, { borderWidth: 0 }]}
              />
              <Text style={[brutalTextStyle('h6', 'bold', 'black'), styles.emptyChatTitle]}>
                START CHATTING!
              </Text>
              <Text style={brutalTextStyle('caption', 'medium', 'gray')}>
                ASK YOUR AI FINANCIAL ASSISTANT ANYTHING!
              </Text>
            </View>
          ) : (
            chatHistory.map(renderMessage)
          )}
        </ScrollView>

        {/* Input Area */}
        <View style={styles.inputContainer}>
          <View style={styles.inputWrapper}>
            <Input
              style={styles.input}
              placeholder="ASK ABOUT YOUR FINANCES..."
              value={message}
              onChangeText={setMessage}
              onSubmitEditing={handleSend}
              returnKeyType="send"
              textStyle={styles.inputText}
            />
            <TouchableOpacity
              onPress={handleSend}
              disabled={!message.trim()}
              style={[
                styles.sendButton,
                { opacity: !message.trim() ? 0.5 : 1 }
              ]}
            >
              <Ionicons 
                name="paper-plane" 
                size={20} 
                color={NeoBrutalism.colors.black} 
              />
            </TouchableOpacity>
          </View>
        </View>
      </KeyboardAvoidingView>
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
    backgroundColor: NeoBrutalism.colors.white,
  },
  content: {
    flex: 1,
    paddingHorizontal: NeoBrutalism.spacing.md, // Reduced from lg
    paddingTop: NeoBrutalism.spacing.md, // Reduced from lg
    paddingBottom: NeoBrutalism.spacing.sm,
  },
  
  // Token Badge in Header
  tokenBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: NeoBrutalism.colors.neonYellow,
    paddingHorizontal: NeoBrutalism.spacing.sm,
    paddingVertical: NeoBrutalism.spacing.xs,
    borderWidth: NeoBrutalism.borders.thick,
    borderColor: NeoBrutalism.colors.black,
    gap: NeoBrutalism.spacing.xs,
  },
  
  // Token Section
  tokenSection: {
    marginBottom: NeoBrutalism.spacing.md,
    paddingVertical: NeoBrutalism.spacing.sm,
  },
  tokenHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: NeoBrutalism.spacing.sm,
    justifyContent: 'space-between',
  },
  
  // Mode Selection
  modeSection: {
    marginBottom: NeoBrutalism.spacing.lg,
  },
  modeTitle: {
    marginBottom: NeoBrutalism.spacing.md,
  },
  modeGrid: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: NeoBrutalism.spacing.sm,
  },
  modeButton: {
    flex: 1,
    alignItems: 'center',
    padding: NeoBrutalism.spacing.sm, // Reduced from md
    borderWidth: NeoBrutalism.borders.thick,
    borderColor: NeoBrutalism.colors.black,
    backgroundColor: NeoBrutalism.colors.white,
  },
  activeModeButton: {
    backgroundColor: NeoBrutalism.colors.lightGray,
    transform: [{ scale: 0.95 }],
  },
  modeIcon: {
    width: 28, // Reduced from 32
    height: 28, // Reduced from 32
    borderRadius: 6,
    borderWidth: NeoBrutalism.borders.medium,
    borderColor: NeoBrutalism.colors.black,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: NeoBrutalism.spacing.xs,
  },
  modeDescription: {
    textAlign: 'center',
    marginTop: NeoBrutalism.spacing.xs,
    fontSize: 9, // Reduced from 10
  },
  
  // Chat Area
  chatContainer: {
    flex: 1,
    marginBottom: NeoBrutalism.spacing.sm,
    backgroundColor: '#E8EDF3', // Darker blue-gray background
    borderWidth: 0, // Removed border
  },
  chatContent: {
    flexGrow: 1,
    paddingBottom: NeoBrutalism.spacing.lg,
  },
  emptyChatCard: {
    alignItems: 'center',
    padding: NeoBrutalism.spacing.xl,
    marginTop: NeoBrutalism.spacing.xl,
  },
  emptyChatIcon: {
    marginBottom: NeoBrutalism.spacing.md,
  },
  emptyChatTitle: {
    marginBottom: NeoBrutalism.spacing.sm,
  },
  
  // Messages
  messageContainer: {
    marginBottom: NeoBrutalism.spacing.md,
  },
  userMessageContainer: {
    alignItems: 'flex-end',
  },
  aiMessageContainer: {
    alignItems: 'flex-start',
  },
  message: {
    maxWidth: '85%',
    padding: NeoBrutalism.spacing.md,
    borderWidth: 0, // Removed black border
    borderRadius: 8, // Added slight border radius for modern look
  },
  userMessage: {
    backgroundColor: NeoBrutalism.colors.electricBlue,
  },
  aiMessage: {
    backgroundColor: NeoBrutalism.colors.white,
  },
  messageHeader: {
    marginBottom: NeoBrutalism.spacing.xs,
  },
  messageSender: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: NeoBrutalism.spacing.xs,
    paddingVertical: 2,
    borderWidth: 0, // Removed black border
    gap: 4,
    alignSelf: 'flex-start',
    borderRadius: 12, // Added border radius for modern pill shape
  },
  messageText: {
    lineHeight: 20,
  },
  
  // Input Area
  inputContainer: {
    paddingHorizontal: NeoBrutalism.spacing.lg,
    paddingVertical: NeoBrutalism.spacing.md,
    backgroundColor: NeoBrutalism.colors.white,
    borderTopWidth: NeoBrutalism.borders.thick,
    borderTopColor: NeoBrutalism.colors.black,
  },
  inputWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: NeoBrutalism.spacing.xs, // Reduced gap to give more space to input
  },
  input: {
    flex: 1,
    borderWidth: NeoBrutalism.borders.thick,
    borderColor: NeoBrutalism.colors.black,
    backgroundColor: NeoBrutalism.colors.white,
    minHeight: 50, // Ensure minimum height for placeholder visibility
    marginRight: NeoBrutalism.spacing.xs, // Add margin to increase text input width
  },
  inputText: {
    fontSize: 16,
    fontWeight: '500',
    paddingVertical: 8, // Add vertical padding for better text positioning
  },
  sendButton: {
    width: 40,
    height: 40,
    borderWidth: NeoBrutalism.borders.medium,
    borderColor: NeoBrutalism.colors.black,
    backgroundColor: NeoBrutalism.colors.neonYellow,
    justifyContent: 'center',
    alignItems: 'center',
  },
});
