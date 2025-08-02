import React, { useState, useEffect } from 'react';
import { View, StyleSheet } from 'react-native';
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
import { Ionicons } from '@expo/vector-icons';
import { useGameStore } from '../../store';
import { getRandomQuestion } from '../../utils/questions';

const BackIcon = (props) => <Ionicons name="arrow-back" size={24} color="black" />;

export default function QuestionScreen({ navigation, route }) {
  const [selectedIndex, setSelectedIndex] = useState(null);
  const [showResult, setShowResult] = useState(false);
  const [isCorrect, setIsCorrect] = useState(false);
  const [question, setQuestion] = useState(null);
  
  const { updateScore, loseLife } = useGameStore();

  useEffect(() => {
    // Get a random question when component mounts
    const randomQuestion = getRandomQuestion();
    setQuestion(randomQuestion);
  }, []);

  const renderBackAction = () => (
    <TopNavigationAction 
      icon={BackIcon} 
      onPress={() => navigation.goBack()} 
    />
  );

  const handleAnswer = () => {
    if (selectedIndex === null) return;
    
    const correct = selectedIndex === question.correctAnswer;
    setIsCorrect(correct);
    setShowResult(true);
    
    if (correct) {
      updateScore(question.points);
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
      <Layout style={styles.container}>
        <TopNavigation
          title='Result'
          accessoryLeft={renderBackAction}
        />
        <View style={styles.resultContainer}>
          <Card style={[styles.resultCard, { backgroundColor: isCorrect ? '#E8F5E8' : '#FDE8E8' }]}>
            <Ionicons 
              name={isCorrect ? 'checkmark-circle' : 'close-circle'} 
              size={64}
              color={isCorrect ? '#00B894' : '#E74C3C'}
            />
            <Text category='h5' style={styles.resultText}>
              {isCorrect ? 'Correct!' : 'Incorrect'}
            </Text>
            <Text category='p1' style={styles.explanation}>
              {question?.explanation}
            </Text>
            {isCorrect && (
              <Text category='s1' style={styles.pointsEarned}>
                +{question?.points} points!
              </Text>
            )}
          </Card>
        </View>
      </Layout>
    );
  }

  if (!question) {
    return (
      <Layout style={styles.container}>
        <TopNavigation
          title='Loading...'
          accessoryLeft={renderBackAction}
        />
        <View style={styles.content}>
          <Text>Loading question...</Text>
        </View>
      </Layout>
    );
  }

  return (
    <Layout style={styles.container}>
      <TopNavigation
        title='Question'
        accessoryLeft={renderBackAction}
      />
      
      <View style={styles.content}>
        <Card style={styles.progressCard}>
          <Text category='c1'>Question 1 of 5</Text>
          <View style={styles.progressBar}>
            <View style={[styles.progressFill, { width: '20%' }]} />
          </View>
        </Card>

        <Card style={styles.questionCard}>
          <Text category='h6' style={styles.questionText}>
            {question.question}
          </Text>
          
          <RadioGroup
            selectedIndex={selectedIndex}
            onChange={setSelectedIndex}
            style={styles.optionsContainer}
          >
            {question.options.map((option, index) => (
              <Radio key={index} style={styles.option}>
                {option}
              </Radio>
            ))}
          </RadioGroup>
        </Card>

        <View style={styles.buttonContainer}>
          <Button
            style={styles.button}
            appearance='outline'
            onPress={handleSkip}
          >
            Skip
          </Button>
          <Button
            style={styles.button}
            onPress={handleAnswer}
            disabled={selectedIndex === null}
          >
            Submit
          </Button>
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
  progressCard: {
    marginBottom: 16,
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
  questionText: {
    marginBottom: 20,
    lineHeight: 24,
  },
  optionsContainer: {
    marginTop: 16,
  },
  option: {
    marginBottom: 12,
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  button: {
    flex: 1,
    marginHorizontal: 8,
  },
  resultContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 16,
  },
  resultCard: {
    padding: 32,
    alignItems: 'center',
    width: '100%',
  },
  resultIcon: {
    width: 64,
    height: 64,
    marginBottom: 16,
  },
  resultText: {
    marginBottom: 16,
    fontWeight: 'bold',
  },
  explanation: {
    textAlign: 'center',
    marginBottom: 16,
    lineHeight: 22,
  },
  pointsEarned: {
    color: '#00B894',
    fontWeight: 'bold',
  },
});
