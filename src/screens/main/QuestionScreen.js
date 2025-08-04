import React, { useState, useEffect } from 'react';
import { View, StyleSheet, Animated, TouchableOpacity, Text } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { useGameStore } from '../../store';
import { getRandomQuestion } from '../../utils/questions';
import { 
  BrutalCard, 
  BrutalButton, 
  BrutalHeader,
  brutalTextStyle 
} from '../../components/BrutalComponents';
import { NeoBrutalism } from '../../styles/neoBrutalism';

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
        <View style={styles.container}>
          <BrutalHeader
            title='🏆 RESULT'
            textColor="white"
            leftAction={
              <TouchableOpacity onPress={() => navigation.goBack()}>
                <Ionicons name="arrow-back" size={24} color={NeoBrutalism.colors.white} />
              </TouchableOpacity>
            }
          />
        <View style={styles.resultContainer}>
          <Animated.View style={[
            styles.resultCard, 
            { 
              backgroundColor: isCorrect ? NeoBrutalism.colors.neonGreen : NeoBrutalism.colors.hotPink,
              transform: [{ scale: scaleValue }, { translateY: slideValue.interpolate({
                inputRange: [0, 1],
                outputRange: [50, 0]
              })}]
            }
          ]}>
            <BrutalCard style={styles.resultCardInner}>
              {/* Success/Failure Icon with Animation */}
              <Animated.View style={[
                styles.resultIconContainer,
                { transform: [{ scale: fadeValue }] }
              ]}>
                <Ionicons 
                  name={isCorrect ? 'checkmark-circle' : 'close-circle'} 
                  size={80}
                  color={NeoBrutalism.colors.black}
                />
              </Animated.View>
              
              <Text style={[
                brutalTextStyle('h4', 'bold', 'black'),
                styles.resultText
              ]}>
                {isCorrect ? '🎉 CORRECT!' : '❌ INCORRECT'}
              </Text>
              
              {/* Show correct answer if user was wrong */}
              {!isCorrect && (
                <BrutalCard style={styles.correctAnswerContainer}>
                  <Text style={[brutalTextStyle('body', 'bold', 'black'), styles.correctAnswerLabel]}>
                    CORRECT ANSWER:
                  </Text>
                  <Text style={[brutalTextStyle('h6', 'bold', 'black'), styles.correctAnswerText]}>
                    {question?.options[question?.correctAnswer]}
                  </Text>
                </BrutalCard>
              )}
              
              <Text style={[brutalTextStyle('body', 'medium', 'black'), styles.explanation]}>
                {question?.explanation}
              </Text>
              
              {isCorrect && (
                <View style={styles.pointsContainer}>
                  <Text style={[brutalTextStyle('h5', 'bold', 'black'), styles.pointsEarned]}>
                    +{question?.points} XP!
                  </Text>
                  {question?.difficulty === 'hard' && (
                    <Text style={[brutalTextStyle('body', 'bold', 'black'), styles.bonusText]}>
                      🌟 HARD QUESTION BONUS!
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
            </BrutalCard>
          </Animated.View>
        </View>
      </View>
      </SafeAreaView>
    );
  }

  if (!question) {
    return (
      <SafeAreaView style={styles.safeArea} edges={['top']}>
        <View style={styles.container}>
          <BrutalHeader
            title='⏳ LOADING...'
            textColor="white"
            leftAction={
              <TouchableOpacity onPress={() => navigation.goBack()}>
                <Ionicons name="arrow-back" size={24} color={NeoBrutalism.colors.white} />
              </TouchableOpacity>
            }
          />
          <View style={styles.content}>
            <BrutalCard style={styles.loadingCard}>
              <Text style={brutalTextStyle('h6', 'bold', 'black')}>
                🎲 LOADING QUESTION...
              </Text>
            </BrutalCard>
          </View>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.safeArea} edges={['top']}>
      <View style={styles.container}>
        <BrutalHeader
          title='🧠 QUIZ CHALLENGE'
          textColor="white"
          leftAction={
            <TouchableOpacity onPress={() => navigation.goBack()}>
              <Ionicons name="arrow-back" size={24} color={NeoBrutalism.colors.white} />
            </TouchableOpacity>
          }
        />
      
      <View style={styles.content}>
        <BrutalCard style={styles.progressCard}>
          <View style={styles.progressHeader}>
            <Text style={brutalTextStyle('caption', 'bold', 'black')}>QUESTION 1 OF 5</Text>
            <View style={styles.difficultyBadge}>
              <Text style={[
                brutalTextStyle('caption', 'bold', 'white'),
                styles.difficultyText,
                { backgroundColor: 
                  question.difficulty === 'easy' ? NeoBrutalism.colors.neonGreen :
                  question.difficulty === 'medium' ? NeoBrutalism.colors.brightOrange : NeoBrutalism.colors.pureRed
                }
              ]}>
                {question.difficulty ? question.difficulty.toUpperCase() : 'UNKNOWN'} • {question.points || 0} XP
              </Text>
            </View>
          </View>
          <View style={styles.progressBar}>
            <View style={[styles.progressFill, { width: '20%' }]} />
          </View>
        </BrutalCard>

        <Animated.View style={[
          styles.questionCard,
          { transform: [{ scale: scaleValue }] }
        ]}>
          <BrutalCard style={styles.questionCardInner}>
            <View style={styles.categoryBadge}>
              <Text style={brutalTextStyle('caption', 'bold', 'black')}>
                📊 {question.category ? question.category.charAt(0).toUpperCase() + question.category.slice(1) : 'Unknown'}
              </Text>
            </View>
            
            <Text style={[brutalTextStyle('h6', 'bold', 'black'), styles.questionText]}>
              {question.question}
            </Text>
            
            <View style={styles.optionsContainer}>
              {question.options.map((option, index) => (
                <TouchableOpacity 
                  key={index} 
                  style={[
                    styles.option,
                    selectedIndex === index && styles.selectedOption
                  ]}
                  onPress={() => setSelectedIndex(index)}
                >
                  <View style={styles.radioContainer}>
                    <View style={[
                      styles.radioButton,
                      selectedIndex === index && styles.radioSelected
                    ]}>
                      {selectedIndex === index && <Text style={styles.radioCheck}>✓</Text>}
                    </View>
                    <Text style={brutalTextStyle('body', 'medium', 'black')}>
                      {option}
                    </Text>
                  </View>
                </TouchableOpacity>
              ))}
            </View>
          </BrutalCard>
        </Animated.View>

        <View style={styles.buttonContainer}>
          <BrutalButton
            title="SKIP"
            variant="outline"
            style={styles.skipButton}
            onPress={handleSkip}
            icon={<Ionicons name="arrow-forward" size={18} color={NeoBrutalism.colors.black} />}
          />
          <BrutalButton
            title="SUBMIT"
            style={styles.submitButton}
            onPress={handleAnswer}
            disabled={selectedIndex === null}
            icon={<Ionicons name="checkmark" size={18} color={NeoBrutalism.colors.white} />}
          />
        </View>
      </View>
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
  progressCard: {
    marginBottom: 16,
    backgroundColor: NeoBrutalism.colors.lightGray,
  },
  progressHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  difficultyBadge: {
    borderWidth: 2,
    borderColor: NeoBrutalism.colors.black,
    overflow: 'hidden',
  },
  difficultyText: {
    fontSize: 10,
    fontWeight: '900',
    paddingHorizontal: 8,
    paddingVertical: 4,
  },
  progressBar: {
    height: 12,
    backgroundColor: NeoBrutalism.colors.white,
    borderWidth: 2,
    borderColor: NeoBrutalism.colors.black,
    marginTop: 8,
  },
  progressFill: {
    height: '100%',
    backgroundColor: NeoBrutalism.colors.electricBlue,
  },
  questionCard: {
    flex: 1,
    marginBottom: 16,
  },
  questionCardInner: {
    backgroundColor: NeoBrutalism.colors.white,
    borderWidth: 0, // Removed black border
  },
  categoryBadge: {
    alignSelf: 'flex-start',
    backgroundColor: NeoBrutalism.colors.neonGreen,
    borderWidth: 0, // Removed black border
    paddingHorizontal: 12,
    paddingVertical: 6,
    marginBottom: 16,
  },
  questionText: {
    marginBottom: 20,
    lineHeight: 26,
  },
  optionsContainer: {
    marginTop: 16,
  },
  option: {
    marginBottom: 12,
    backgroundColor: NeoBrutalism.colors.lightGray,
    borderWidth: 0, // Removed black border
    padding: 16,
    borderRadius: 8, // Added border radius for better appearance
  },
  selectedOption: {
    backgroundColor: NeoBrutalism.colors.neonYellow,
    borderWidth: 0, // Removed black border
    borderRadius: 8, // Added border radius for better appearance
  },
  radioContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  radioButton: {
    width: 20,
    height: 20,
    borderWidth: 0, // Removed black border
    backgroundColor: NeoBrutalism.colors.white,
    marginRight: 12,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 10, // Made circular
  },
  radioSelected: {
    backgroundColor: NeoBrutalism.colors.electricBlue,
  },
  radioCheck: {
    color: NeoBrutalism.colors.white,
    fontSize: 12,
    fontWeight: '900',
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    gap: 16,
    paddingHorizontal: 8,
  },
  skipButton: {
    flex: 0.4,
    minHeight: 50,
    borderWidth: 3,
    borderColor: NeoBrutalism.colors.black,
    justifyContent: 'center',
    alignItems: 'center',
  },
  submitButton: {
    flex: 0.6,
    minHeight: 50,
  },
  // Result screen styles
  resultContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 16,
  },
  resultCard: {
    width: '100%',
    borderWidth: 4,
    borderColor: NeoBrutalism.colors.black,
    padding: 8,
  },
  resultCardInner: {
    padding: 32,
    alignItems: 'center',
    backgroundColor: NeoBrutalism.colors.white,
  },
  resultIconContainer: {
    marginBottom: 20,
  },
  resultText: {
    marginBottom: 20,
    textAlign: 'center',
  },
  correctAnswerContainer: {
    backgroundColor: NeoBrutalism.colors.lightGray,
    borderWidth: 2,
    borderColor: NeoBrutalism.colors.black,
    padding: 16,
    marginBottom: 20,
    width: '100%',
  },
  correctAnswerLabel: {
    marginBottom: 8,
  },
  correctAnswerText: {
    textAlign: 'center',
  },
  explanation: {
    textAlign: 'center',
    marginBottom: 20,
    lineHeight: 24,
  },
  pointsContainer: {
    alignItems: 'center',
  },
  pointsEarned: {
    textAlign: 'center',
  },
  bonusText: {
    marginTop: 8,
    textAlign: 'center',
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
  },
  // Loading styles
  loadingCard: {
    padding: 32,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 50,
  },
});
