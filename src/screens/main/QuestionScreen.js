import React, { useState, useEffect } from 'react';
import { View, StyleSheet, Animated } from 'react-native';
import { 
  Layout, 
  Text, 
  Button, 
  Card,
  TopNavigation,
  TopNavigationAction,
  Radio,
  RadioGroup 
} from '@ui-kitten/components';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { useGameStore } from '../../store';
import { getRandomQuestion } from '../../utils/questions';

const BackIcon = (props) => <Ionicons name="arrow-back" size={24} color="black" />;

export default function QuestionScreen({ navigation, route }) {
  const [selectedIndex, setSelectedIndex] = useState(null);
  const [showResult, setShowResult] = useState(false);
  const [isCorrect, setIsCorrect] = useState(false);
  const [question, setQuestion] = useState(null);
  const [showConfetti, setShowConfetti] = useState(false);
  
  // Animation values
  const scaleValue = new Animated.Value(1);
  const fadeValue = new Animated.Value(1);
  const slideValue = new Animated.Value(0);
  
  const { updateScore, loseLife, levelUp, checkLevelUp } = useGameStore();

  useEffect(() => {
    // Get a random question when component mounts
    const randomQuestion = getRandomQuestion();
    setQuestion(randomQuestion);
  }, []);

  const renderBackAction = () => (
    <TopNavigationAction 
      icon={BackIcon} 
      onPress={() => {
        // Always allow back navigation from question screen
        navigation.goBack();
      }} 
    />
  );

  const handleAnswer = () => {
    if (selectedIndex === null) return;
    
    const correct = selectedIndex === question.correctAnswer;
    setIsCorrect(correct);
    
    // Start answer animation
    Animated.sequence([
      Animated.timing(scaleValue, {
        toValue: 0.95,
        duration: 150,
        useNativeDriver: true,
      }),
      Animated.timing(scaleValue, {
        toValue: 1,
        duration: 150,
        useNativeDriver: true,
      }),
    ]).start();
    
    // Slide in result
    Animated.timing(slideValue, {
      toValue: 1,
      duration: 300,
      useNativeDriver: true,
    }).start();
    
    setShowResult(true);
    
    if (correct) {
      updateScore(question.points);
      
      // Check for level up
      const leveledUp = checkLevelUp();
      if (leveledUp) {
        levelUp();
      }
      
      // Show confetti for hard questions
      if (question.difficulty === 'hard') {
        setShowConfetti(true);
        setTimeout(() => setShowConfetti(false), 3000);
      }
    } else {
      loseLife();
    }
    
    // Auto advance after showing result
    setTimeout(() => {
      navigation.goBack();
    }, 2500);
  };

  const handleSkip = () => {
    navigation.goBack();
  };

  if (showResult) {
    return (
      <SafeAreaView style={styles.safeArea} edges={['top']}>
        <Layout style={styles.container}>
          <TopNavigation
            title='Result'
            accessoryLeft={renderBackAction}
            style={styles.topNavigation}
          />
        <View style={styles.resultContainer}>
          <Animated.View style={[
            styles.resultCard, 
            { 
              backgroundColor: isCorrect ? '#E8F5E8' : '#FDE8E8',
              transform: [{ scale: scaleValue }, { translateY: slideValue.interpolate({
                inputRange: [0, 1],
                outputRange: [50, 0]
              })}]
            }
          ]}>
            <Card style={styles.resultCardInner}>
              {/* Success/Failure Icon with Animation */}
              <Animated.View style={[
                styles.resultIconContainer,
                { transform: [{ scale: fadeValue }] }
              ]}>
                <Ionicons 
                  name={isCorrect ? 'checkmark-circle' : 'close-circle'} 
                  size={80}
                  color={isCorrect ? '#00B894' : '#E74C3C'}
                />
              </Animated.View>
              
              <Text category='h4' style={[
                styles.resultText,
                { color: isCorrect ? '#00B894' : '#E74C3C' }
              ]}>
                {isCorrect ? '🎉 Correct!' : '❌ Incorrect'}
              </Text>
              
              {/* Show correct answer if user was wrong */}
              {!isCorrect && (
                <View style={styles.correctAnswerContainer}>
                  <Text category='s1' style={styles.correctAnswerLabel}>
                    Correct Answer:
                  </Text>
                  <Text category='h6' style={styles.correctAnswerText}>
                    {question?.options[question?.correctAnswer]}
                  </Text>
                </View>
              )}
              
              <Text category='p1' style={styles.explanation}>
                {question?.explanation}
              </Text>
              
              {isCorrect && (
                <View style={styles.pointsContainer}>
                  <Text category='h5' style={styles.pointsEarned}>
                    +{question?.points} XP!
                  </Text>
                  {question?.difficulty === 'hard' && (
                    <Text category='s1' style={styles.bonusText}>
                      🌟 Hard Question Bonus!
                    </Text>
                  )}
                </View>
              )}
              
              {/* Confetti Effect for Hard Questions */}
              {showConfetti && (
                <View style={styles.confettiContainer}>
                  <Text style={styles.confetti}>🎊🎉✨🎊🎉✨</Text>
                </View>
              )}
            </Card>
          </Animated.View>
        </View>
      </Layout>
      </SafeAreaView>
    );
  }

  if (!question) {
    return (
      <SafeAreaView style={styles.safeArea} edges={['top']}>
        <Layout style={styles.container}>
          <TopNavigation
            title='Loading...'
            accessoryLeft={renderBackAction}
            style={styles.topNavigation}
          />
          <View style={styles.content}>
            <Text>Loading question...</Text>
          </View>
        </Layout>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.safeArea} edges={['top']}>
      <Layout style={styles.container}>
        <TopNavigation
          title='Question'
          accessoryLeft={renderBackAction}
          style={styles.topNavigation}
        />
      
      <View style={styles.content}>
        <Card style={styles.progressCard}>
          <View style={styles.progressHeader}>
            <Text category='c1'>Question 1 of 5</Text>
            <View style={styles.difficultyBadge}>
              <Text style={[
                styles.difficultyText,
                { backgroundColor: 
                  question.difficulty === 'easy' ? '#00B894' :
                  question.difficulty === 'medium' ? '#F39C12' : '#E74C3C'
                }
              ]}>
                {question.difficulty.toUpperCase()} • {question.points} XP
              </Text>
            </View>
          </View>
          <View style={styles.progressBar}>
            <View style={[styles.progressFill, { width: '20%' }]} />
          </View>
        </Card>

        <Animated.View style={[
          styles.questionCard,
          { transform: [{ scale: scaleValue }] }
        ]}>
          <Card style={styles.questionCardInner}>
            <View style={styles.categoryBadge}>
              <Text style={styles.categoryText}>
                📊 {question.category.charAt(0).toUpperCase() + question.category.slice(1)}
              </Text>
            </View>
            
            <Text category='h6' style={styles.questionText}>
              {question.question}
            </Text>
            
            <RadioGroup
              selectedIndex={selectedIndex}
              onChange={setSelectedIndex}
              style={styles.optionsContainer}
            >
              {question.options.map((option, index) => (
                <Radio 
                  key={index} 
                  style={[
                    styles.option,
                    selectedIndex === index && styles.selectedOption
                  ]}
                >
                  {option}
                </Radio>
              ))}
            </RadioGroup>
          </Card>
        </Animated.View>

        <View style={styles.buttonContainer}>
          <Button
            style={styles.button}
            appearance='outline'
            onPress={handleSkip}
          >
            Skip Question
          </Button>
          <Button
            style={[styles.button, styles.submitButton]}
            onPress={handleAnswer}
            disabled={selectedIndex === null}
          >
            Submit Answer
          </Button>
        </View>
      </View>
    </Layout>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
  topNavigation: {
    backgroundColor: '#FFFFFF',
    paddingVertical: 8,
  },
  container: {
    flex: 1,
    backgroundColor: '#F8F9FA',
  },
  content: {
    flex: 1,
    padding: 16,
  },
  progressCard: {
    marginBottom: 16,
  },
  progressHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  difficultyBadge: {
    borderRadius: 12,
    overflow: 'hidden',
  },
  difficultyText: {
    color: 'white',
    fontSize: 10,
    fontWeight: 'bold',
    paddingHorizontal: 8,
    paddingVertical: 4,
  },
  progressBar: {
    height: 8,
    backgroundColor: '#E0E0E0',
    borderRadius: 4,
    marginTop: 8,
  },
  progressFill: {
    height: '100%',
    backgroundColor: '#6C5CE7',
    borderRadius: 4,
  },
  questionCard: {
    flex: 1,
    marginBottom: 16,
  },
  questionCardInner: {
    padding: 0,
  },
  categoryBadge: {
    alignSelf: 'flex-start',
    backgroundColor: '#F0F0FF',
    borderRadius: 20,
    paddingHorizontal: 12,
    paddingVertical: 6,
    marginBottom: 16,
  },
  categoryText: {
    color: '#6C5CE7',
    fontSize: 12,
    fontWeight: '600',
  },
  questionText: {
    marginBottom: 20,
    lineHeight: 26,
    fontSize: 18,
    fontWeight: '600',
  },
  optionsContainer: {
    marginTop: 16,
  },
  option: {
    marginBottom: 16,
    backgroundColor: '#FAFAFA',
    borderRadius: 12,
    padding: 4,
  },
  selectedOption: {
    backgroundColor: '#E8F5E8',
    borderColor: '#00B894',
    borderWidth: 2,
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  button: {
    flex: 1,
    marginHorizontal: 8,
  },
  submitButton: {
    backgroundColor: '#6C5CE7',
  },
  resultContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 16,
  },
  resultCard: {
    width: '100%',
    borderRadius: 20,
    padding: 8,
  },
  resultCardInner: {
    padding: 32,
    alignItems: 'center',
    backgroundColor: 'transparent',
  },
  resultIconContainer: {
    marginBottom: 20,
  },
  resultText: {
    marginBottom: 20,
    fontWeight: 'bold',
    fontSize: 24,
  },
  correctAnswerContainer: {
    backgroundColor: '#FFF3E0',
    borderRadius: 12,
    padding: 16,
    marginBottom: 20,
    width: '100%',
  },
  correctAnswerLabel: {
    color: '#F57C00',
    fontWeight: 'bold',
    marginBottom: 8,
  },
  correctAnswerText: {
    color: '#E65100',
    fontSize: 16,
  },
  explanation: {
    textAlign: 'center',
    marginBottom: 20,
    lineHeight: 24,
    fontSize: 16,
  },
  pointsContainer: {
    alignItems: 'center',
  },
  pointsEarned: {
    color: '#00B894',
    fontWeight: 'bold',
    fontSize: 20,
  },
  bonusText: {
    color: '#FFD700',
    fontWeight: 'bold',
    marginTop: 8,
  },
  confettiContainer: {
    position: 'absolute',
    top: -20,
    left: 0,
    right: 0,
    alignItems: 'center',
  },
  confetti: {
    fontSize: 24,
    letterSpacing: 4,
  },
});
