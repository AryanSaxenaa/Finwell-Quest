import React, { useState } from 'react';
import { View, StyleSheet, ScrollView, Alert, TouchableOpacity, Text } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { useGameStore } from '../../store';
import { 
  BrutalCard, 
  BrutalButton, 
  BrutalHeader,
  brutalTextStyle 
} from '../../components/BrutalComponents';
import { NeoBrutalism } from '../../styles/neoBrutalism';

const BackIcon = (props) => <Ionicons name="arrow-back" size={24} color="black" />;

const topicContent = {
  1: {
    title: 'Budgeting Basics',
    content: [
      'A budget is a plan that shows how much money you have and how you will spend it.',
      'The 50/30/20 rule: 50% for needs, 30% for wants, 20% for savings.',
      'Track your income and expenses to see where your money goes.',
      'Review and adjust your budget regularly to stay on track.',
    ],
    quiz: {
      question: 'What is the 50/30/20 budgeting rule?',
      options: [
        '50% needs, 30% wants, 20% savings',
        '50% wants, 30% needs, 20% savings',
        '50% savings, 30% needs, 20% wants',
        '50% needs, 30% savings, 20% wants'
      ],
      correct: 0
    }
  },
  2: {
    title: 'Saving Strategies',
    content: [
      'Pay yourself first - save money before spending on other things.',
      'Set up automatic transfers to your savings account.',
      'Start with small amounts and gradually increase your savings.',
      'Create an emergency fund with 3-6 months of expenses.',
    ],
    quiz: {
      question: 'How much should you ideally have in an emergency fund?',
      options: [
        '1-2 months of expenses',
        '3-6 months of expenses',
        '12 months of expenses',
        '2-3 weeks of expenses'
      ],
      correct: 1
    }
  },
  3: {
    title: 'Investment 101',
    content: [
      'Investing helps your money grow over time through compound interest.',
      'Diversification means spreading your investments across different assets.',
      'Start early - time is your biggest advantage in investing.',
      'Understand your risk tolerance before choosing investments.',
    ],
    quiz: {
      question: 'What is the main benefit of starting to invest early?',
      options: [
        'Higher initial returns',
        'Lower fees',
        'Compound interest over time',
        'Better stock picks'
      ],
      correct: 2
    }
  },
  4: {
    title: 'Debt Management',
    content: [
      'List all your debts with balances and interest rates.',
      'Pay minimum amounts on all debts, then focus extra payments on highest interest debt.',
      'Consider the debt snowball method for motivation.',
      'Avoid taking on new debt while paying off existing debt.',
    ],
    quiz: {
      question: 'Which debt should you prioritize paying off first?',
      options: [
        'The smallest balance',
        'The highest interest rate',
        'The newest debt',
        'The oldest debt'
      ],
      correct: 1
    }
  }
};

export default function QuizDetail({ navigation, route }) {
  const { topic } = route.params || { topic: { id: 1, title: 'Sample Quiz', tokenReward: 2 } };
  const { earnAITokens } = useGameStore();
  const [currentStep, setCurrentStep] = useState('content'); // 'content', 'quiz', 'completed'
  const [selectedAnswer, setSelectedAnswer] = useState(null);
  const [hasCompleted, setHasCompleted] = useState(false);

  const topicData = topicContent[topic.id] || topicContent[1];

  const handleStartQuiz = () => {
    setCurrentStep('quiz');
  };

  const handleAnswerSelect = (index) => {
    setSelectedAnswer(index);
  };

  const handleSubmitAnswer = () => {
    const isCorrect = selectedAnswer === topicData.quiz.correct;
    if (isCorrect && !hasCompleted) {
      earnAITokens(topic.tokenReward);
      setHasCompleted(true);
      Alert.alert(
        'Correct! 🎉',
        `Great job! You earned ${topic.tokenReward} AI tokens for completing this topic!`,
        [{ text: 'Continue Learning', onPress: () => setCurrentStep('completed') }]
      );
    } else if (isCorrect && hasCompleted) {
      Alert.alert('Already Completed', 'You have already earned tokens for this topic!');
      setCurrentStep('completed');
    } else {
      Alert.alert(
        'Not quite right',
        'Try again! Review the content and think about the correct answer.',
        [{ text: 'Try Again', onPress: () => setSelectedAnswer(null) }]
      );
    }
  };

  const renderBackAction = () => (
    <TopNavigationAction 
      icon={BackIcon} 
      onPress={() => navigation.goBack()} 
    />
  );

  return (
    <SafeAreaView style={styles.safeArea} edges={['top']}>
      <View style={styles.container}>
        <BrutalHeader
          title={`📖 ${topicData.title.toUpperCase()}`}
          textColor="white"
          leftAction={
            <TouchableOpacity onPress={() => navigation.goBack()}>
              <Ionicons name="arrow-back" size={24} color={NeoBrutalism.colors.white} />
            </TouchableOpacity>
          }
        />
      
      <ScrollView style={styles.content}>
        {currentStep === 'content' && (
          <BrutalCard style={styles.contentCard}>
            <Text style={[brutalTextStyle('h6', 'bold', 'black'), styles.sectionTitle]}>📚 LEARNING CONTENT</Text>
            {topicData.content.map((point, index) => (
              <View key={index} style={styles.contentPoint}>
                <Text style={brutalTextStyle('body', 'bold', 'black')}>•</Text>
                <Text style={[brutalTextStyle('body', 'medium', 'black'), styles.contentText]}>{point.toUpperCase()}</Text>
              </View>
            ))}
            <BrutalButton 
              title="🚀 START QUIZ"
              style={styles.startQuizButton}
              onPress={handleStartQuiz}
            />
          </BrutalCard>
        )}

        {currentStep === 'quiz' && (
          <BrutalCard style={styles.quizCard}>
            <Text style={[brutalTextStyle('h6', 'bold', 'black'), styles.sectionTitle]}>🧠 QUIZ QUESTION</Text>
            <Text style={[brutalTextStyle('body', 'medium', 'black'), styles.questionText]}>
              {topicData.quiz.question.toUpperCase()}
            </Text>
            
            <View style={styles.optionsContainer}>
              {topicData.quiz.options.map((option, index) => (
                <TouchableOpacity
                  key={index}
                  style={[
                    styles.optionButton,
                    selectedAnswer === index && styles.selectedOption
                  ]}
                  onPress={() => handleAnswerSelect(index)}
                >
                  <Text style={brutalTextStyle('body', 'medium', 'black')}>
                    {option.toUpperCase()}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>

            <BrutalButton 
              title="💥 SUBMIT ANSWER"
              style={styles.submitButton}
              disabled={selectedAnswer === null}
              onPress={handleSubmitAnswer}
            />
          </BrutalCard>
        )}

        {currentStep === 'completed' && (
          <BrutalCard style={styles.completedCard}>
            <Text category='h5' style={styles.completedTitle}>🎉 Topic Completed!</Text>
            <Text category='p1' style={styles.completedText}>
              Congratulations! You've successfully completed {topicData.title}.
            </Text>
            <Text category='p2' style={styles.tokenEarned}>
              Tokens Earned: +{topic.tokenReward} AI Tokens
            </Text>
            <BrutalButton 
              style={styles.backToLearningButton}
              onPress={() => navigation.goBack()}
              title="Back to Learning Hub"
              variant="primary"
            />
          </BrutalCard>
        )}
      </ScrollView>
    </View>
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
    padding: 16,
  },
  contentCard: {
    marginBottom: 16,
    backgroundColor: NeoBrutalism.colors.lightGray,
  },
  quizCard: {
    marginBottom: 16,
    backgroundColor: NeoBrutalism.colors.lightGray,
  },
  completedCard: {
    marginBottom: 16,
    backgroundColor: NeoBrutalism.colors.neonGreen,
  },
  sectionTitle: {
    marginBottom: 16,
    textAlign: 'center',
  },
  contentPoint: {
    flexDirection: 'row',
    marginBottom: 12,
    paddingRight: 16,
  },
  contentText: {
    flex: 1,
    lineHeight: 20,
    marginLeft: 8,
  },
  startQuizButton: {
    marginTop: 20,
  },
  questionText: {
    marginBottom: 20,
    textAlign: 'center',
    lineHeight: 24,
  },
  optionsContainer: {
    marginBottom: 20,
    gap: 8,
  },
  optionButton: {
    padding: 16,
    borderWidth: 3,
    borderColor: NeoBrutalism.colors.black,
    backgroundColor: NeoBrutalism.colors.white,
  },
  selectedOption: {
    backgroundColor: NeoBrutalism.colors.neonYellow,
    borderWidth: 4,
  },
  submitButton: {
    marginTop: 16,
  },
  completedTitle: {
    textAlign: 'center',
    marginBottom: 16,
  },
  completedText: {
    textAlign: 'center',
    marginBottom: 16,
  },
  tokenEarned: {
    textAlign: 'center',
    marginBottom: 20,
  },
  backToLearningButton: {
    marginTop: 10,
  },
});
