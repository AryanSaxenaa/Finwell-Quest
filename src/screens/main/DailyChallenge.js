import React, { useState, useEffect } from 'react';
import { View, StyleSheet, Alert } from 'react-native';
import { 
  Layout, 
  TopNavigation, 
  TopNavigationAction, 
  Card, 
  Text, 
  Button,
  Divider
} from '@ui-kitten/components';
import { Ionicons } from '@expo/vector-icons';
import { useGameStore } from '../../store';
import { QUESTIONS_DATABASE } from '../../utils/questions';

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
          <Card>
            <Text>Loading...</Text>
          </Card>
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
          <Card style={styles.completedCard}>
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
            
            <Button
              style={styles.backButton}
              onPress={() => navigation.goBack()}
            >
              Back to Game Center
            </Button>
          </Card>
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
          <Card>
            <Text>Loading today's challenge...</Text>
          </Card>
        </View>
      </Layout>
    );
  }

  return (
    <Layout style={styles.container}>
      <TopNavigation
        title='Daily Challenge'
        alignment='center'
        accessoryLeft={renderBackAction}
      />
      
      <View style={styles.content}>
        <Card style={styles.challengeHeader}>
          <View style={styles.headerContent}>
            <CalendarIcon />
            <Text category='h5' style={styles.challengeTitle}>
              Today's Financial Question
            </Text>
          </View>
          <Text category='c1' style={styles.rewardText}>
            Reward: 50 XP
          </Text>
        </Card>

        <Card style={styles.questionCard}>
          <Text category='h6' style={styles.questionText}>
            {currentQuestion?.question || 'Loading question...'}
          </Text>
          
          <Divider style={styles.divider} />
          
          <View style={styles.optionsContainer}>
            {currentQuestion?.options?.map((option, index) => (
              <Button
                key={index}
                style={[
                  styles.optionButton,
                  selectedAnswer === index && styles.selectedOption,
                  showResult && index === currentQuestion?.correctAnswer && styles.correctOption,
                  showResult && selectedAnswer === index && index !== currentQuestion?.correctAnswer && styles.incorrectOption
                ]}
                appearance={selectedAnswer === index ? 'filled' : 'outline'}
                onPress={() => handleAnswerSelect(index)}
                disabled={showResult}
              >
                {option}
              </Button>
            )) || []}
          </View>

          {showResult && currentQuestion?.explanation && (
            <View style={styles.explanationContainer}>
              <Divider style={styles.divider} />
              <Text category='h6' style={styles.explanationTitle}>
                Explanation:
              </Text>
              <Text category='p2' style={styles.explanationText}>
                {currentQuestion.explanation}
              </Text>
            </View>
          )}

          {!showResult && (
            <Button
              style={styles.submitButton}
              onPress={handleSubmitAnswer}
              disabled={selectedAnswer === null}
            >
              Submit Answer
            </Button>
          )}
        </Card>
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
  challengeHeader: {
    marginBottom: 16,
    backgroundColor: '#FFD700',
  },
  headerContent: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  challengeTitle: {
    marginLeft: 12,
    color: '#2E384D',
    fontWeight: 'bold',
  },
  rewardText: {
    color: '#2E384D',
    fontWeight: 'bold',
  },
  questionCard: {
    flex: 1,
  },
  questionText: {
    marginBottom: 20,
    lineHeight: 24,
  },
  divider: {
    marginVertical: 16,
  },
  optionsContainer: {
    marginBottom: 20,
  },
  optionButton: {
    marginBottom: 12,
    justifyContent: 'flex-start',
  },
  selectedOption: {
    backgroundColor: '#6C5CE7',
    borderColor: '#6C5CE7',
  },
  correctOption: {
    backgroundColor: '#00D68F',
    borderColor: '#00D68F',
  },
  incorrectOption: {
    backgroundColor: '#FF3D71',
    borderColor: '#FF3D71',
  },
  submitButton: {
    marginTop: 10,
  },
  explanationContainer: {
    marginTop: 16,
  },
  explanationTitle: {
    marginBottom: 8,
    color: '#6C5CE7',
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
