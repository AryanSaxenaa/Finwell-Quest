import React, { useState, useEffect } from 'react';
import { View, StyleSheet, Alert } from 'react-native';
import { 
  Layout, 
  TopNavigation, 
  TopNavigationAction, 
  Text,
  Card,
  Button
} from '@ui-kitten/components';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { useGameStore } from '../../store';
import { QUESTIONS_DATABASE } from '../../utils/questions';
import { BrutalCard, BrutalButton, brutalTextStyle } from '../../components/BrutalComponents';
import { NeoBrutalism } from '../../styles/neoBrutalism';

const BackIcon = (props) => (
  <Ionicons name="arrow-back" size={24} color="#2E384D" />
);

const CalendarIcon = (props) => (
  <Ionicons name="calendar" size={24} color="#FFD700" />
);

const TrophyIcon = (props) => (
  <Ionicons name="trophy" size={24} color="#FFD700" />
);

export default function DailyChallenge({ navigation }) {
  const gameStore = useGameStore();
  
  if (!gameStore) {
    return (
      <Layout style={styles.container}>
        <TopNavigation
          title='Daily Challenge'
          alignment='center'
        />
        <View style={styles.content}>
          <BrutalCard>
            <Text>Loading...</Text>
          </BrutalCard>
        </View>
      </Layout>
    );
  }

  const { 
    dailyChallenge = {}, 
    completeDailyChallenge, 
    generateDailyChallenge,
    addXP,
    xp 
  } = gameStore;

  const [selectedAnswer, setSelectedAnswer] = useState(null);
  const [showResult, setShowResult] = useState(false);
  const [currentQuestion, setCurrentQuestion] = useState(null);

  useEffect(() => {
    // Generate today's challenge if not already done
    if (!dailyChallenge?.completed && !dailyChallenge?.question) {
      generateTodaysChallenge();
    } else if (dailyChallenge?.question) {
      setCurrentQuestion(dailyChallenge.question);
    }
  }, [dailyChallenge]);

  const generateTodaysChallenge = () => {
    const today = new Date().toDateString();
    
    // Check if we already have today's challenge
    if (dailyChallenge?.date === today && dailyChallenge?.question) {
      setCurrentQuestion(dailyChallenge.question);
      return;
    }

    // Get a random question for today's challenge
    const availableQuestions = QUESTIONS_DATABASE.filter(q => 
      q.difficulty === 'easy' || q.difficulty === 'medium'
    );
    
    if (availableQuestions.length === 0) {
      console.error('No questions available for daily challenge');
      return;
    }
    
    const randomIndex = Math.floor(Math.random() * availableQuestions.length);
    const todaysQuestion = availableQuestions[randomIndex];
    
    if (generateDailyChallenge && todaysQuestion) {
      generateDailyChallenge(todaysQuestion, today);
      setCurrentQuestion(todaysQuestion);
    }
  };

  const handleAnswerSelect = (answerIndex) => {
    if (showResult) return;
    setSelectedAnswer(answerIndex);
  };

  const handleSubmitAnswer = () => {
    if (selectedAnswer === null || !currentQuestion) {
      Alert.alert('Please select an answer', 'Choose one of the options before submitting.');
      return;
    }

    setShowResult(true);
    
    const isCorrect = selectedAnswer === currentQuestion?.correctAnswer;
    
    if (isCorrect) {
      const bonusXP = 50;
      if (addXP) addXP(bonusXP);
      if (completeDailyChallenge) completeDailyChallenge(true, bonusXP);
      
      setTimeout(() => {
        Alert.alert(
          'Correct! 🎉',
          `Great job! You earned ${bonusXP} XP!`,
          [
            {
              text: 'Continue',
              onPress: () => navigation.goBack()
            }
          ]
        );
      }, 1000);
    } else {
      if (completeDailyChallenge) completeDailyChallenge(false, 0);
      
      setTimeout(() => {
        Alert.alert(
          'Not quite right 😅',
          'Better luck tomorrow! Keep learning and come back for tomorrow\'s challenge.',
          [
            {
              text: 'Continue',
              onPress: () => navigation.goBack()
            }
          ]
        );
      }, 1000);
    }
  };

  const renderBackAction = () => (
    <TopNavigationAction icon={BackIcon} onPress={() => navigation.goBack()} />
  );

  if (dailyChallenge?.completed) {
    return (
      <Layout style={styles.container}>
        <TopNavigation
          title='Daily Challenge'
          alignment='center'
          accessoryLeft={renderBackAction}
        />
        
        <View style={styles.content}>
          <BrutalCard style={styles.completedCard}>
            <View style={styles.completedHeader}>
              <TrophyIcon />
              <Text category='h4' style={styles.completedTitle}>
                Challenge Complete!
              </Text>
            </View>
            
            <Text category='p1' style={styles.completedText}>
              {dailyChallenge?.wasCorrect 
                ? `Congratulations! You answered correctly and earned ${dailyChallenge?.xpEarned || 0} XP!`
                : 'You completed today\'s challenge. Come back tomorrow for a new question!'
              }
            </Text>
            
            <Text category='c1' style={styles.nextChallengeText}>
              Next challenge available tomorrow
            </Text>
            
            <BrutalButton
              style={styles.backButton}
              onPress={() => navigation.goBack()}
            >
              Back to Game Center
            </BrutalButton>
          </BrutalCard>
        </View>
      </Layout>
    );
  }

  if (!currentQuestion) {
    return (
      <Layout style={styles.container}>
        <TopNavigation
          title='Daily Challenge'
          alignment='center'
          accessoryLeft={renderBackAction}
        />
        
        <View style={styles.content}>
          <BrutalCard>
            <Text>Loading today's challenge...</Text>
          </BrutalCard>
        </View>
      </Layout>
    );
  }

  return (
    <SafeAreaView style={styles.safeArea} edges={['top']}>
      <Layout style={styles.container}>
        <TopNavigation
          title='Daily Challenge'
          alignment='center'
          accessoryLeft={renderBackAction}
          style={styles.topNavigation}
        />
      
      <View style={styles.content}>
        <BrutalCard style={styles.challengeHeader}>
          <View style={styles.headerContent}>
            <CalendarIcon />
            <Text style={[brutalTextStyle('h5', 'bold', 'black'), styles.challengeTitle]}>
              TODAY'S FINANCIAL QUESTION
            </Text>
          </View>
          <Text style={[brutalTextStyle('caption', 'bold', 'black'), styles.rewardText]}>
            REWARD: 50 XP
          </Text>
        </BrutalCard>

        <BrutalCard style={styles.questionCard}>
          <Text style={[brutalTextStyle('h6', 'bold', 'black'), styles.questionText]}>
            {currentQuestion?.question || 'LOADING QUESTION...'}
          </Text>
          
          <View style={styles.divider} />
          
          <View style={styles.optionsContainer}>
            {currentQuestion?.options?.map((option, index) => (
              <BrutalButton
                key={index}
                style={[
                  styles.optionButton,
                  selectedAnswer === index && styles.selectedOption,
                  showResult && index === currentQuestion?.correctAnswer && styles.correctOption,
                  showResult && selectedAnswer === index && index !== currentQuestion?.correctAnswer && styles.incorrectOption
                ]}
                variant={selectedAnswer === index ? 'primary' : 'outline'}
                onPress={() => handleAnswerSelect(index)}
                disabled={showResult}
              >
                {option}
              </BrutalButton>
            )) || []}
          </View>

          {showResult && currentQuestion?.explanation && (
            <View style={styles.explanationContainer}>
              <View style={styles.divider} />
              <Text style={[brutalTextStyle('h6', 'bold', 'black'), styles.explanationTitle]}>
                EXPLANATION:
              </Text>
              <Text style={[brutalTextStyle('body', 'medium', 'black'), styles.explanationText]}>
                {currentQuestion.explanation}
              </Text>
            </View>
          )}

          {!showResult && (
            <BrutalButton
              style={styles.submitButton}
              onPress={handleSubmitAnswer}
              disabled={selectedAnswer === null}
            >
              SUBMIT ANSWER
            </BrutalButton>
          )}
        </BrutalCard>
      </View>
    </Layout>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: NeoBrutalism.colors.white,
  },
  topNavigation: {
    backgroundColor: NeoBrutalism.colors.white,
    paddingVertical: 8,
  },
  container: {
    flex: 1,
    backgroundColor: NeoBrutalism.colors.white,
  },
  content: {
    flex: 1,
    padding: 16,
  },
  challengeHeader: {
    marginBottom: 16,
    backgroundColor: NeoBrutalism.colors.neonYellow,
    borderWidth: 0,
  },
  headerContent: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  challengeTitle: {
    marginLeft: 12,
    color: NeoBrutalism.colors.black,
    fontWeight: 'bold',
  },
  rewardText: {
    color: NeoBrutalism.colors.black,
    fontWeight: 'bold',
  },
  questionCard: {
    flex: 1,
    borderWidth: 0,
    backgroundColor: NeoBrutalism.colors.lightGray,
  },
  questionText: {
    marginBottom: 20,
    lineHeight: 24,
  },
  divider: {
    marginVertical: 16,
    height: 3,
    backgroundColor: NeoBrutalism.colors.black,
  },
  optionsContainer: {
    marginBottom: 20,
  },
  optionButton: {
    marginBottom: 12,
    justifyContent: 'flex-start',
  },
  selectedOption: {
    backgroundColor: NeoBrutalism.colors.neonBlue,
    borderColor: NeoBrutalism.colors.black,
  },
  correctOption: {
    backgroundColor: NeoBrutalism.colors.neonGreen,
    borderColor: NeoBrutalism.colors.black,
  },
  incorrectOption: {
    backgroundColor: NeoBrutalism.colors.hotPink,
    borderColor: NeoBrutalism.colors.black,
  },
  submitButton: {
    marginTop: 10,
  },
  explanationContainer: {
    marginTop: 16,
  },
  explanationTitle: {
    marginBottom: 8,
    color: NeoBrutalism.colors.black,
  },
  explanationText: {
    lineHeight: 20,
  },
  completedCard: {
    backgroundColor: '#F0F8FF',
    borderColor: '#6C5CE7',
    borderWidth: 2,
  },
  completedHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  completedTitle: {
    marginLeft: 12,
    color: '#6C5CE7',
  },
  completedText: {
    marginBottom: 16,
    textAlign: 'center',
    lineHeight: 22,
  },
  nextChallengeText: {
    textAlign: 'center',
    color: '#8F9BB3',
    marginBottom: 20,
  },
  backButton: {
    marginTop: 10,
  },
});
