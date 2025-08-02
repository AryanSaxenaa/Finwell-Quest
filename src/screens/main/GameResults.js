import React from 'react';
import { View, StyleSheet } from 'react-native';
import { Layout, Text, Button, Card, TopNavigation } from '@ui-kitten/components';
import { Ionicons } from '@expo/vector-icons';
import { useGameStore } from '../../store';

const TrophyIcon = (props) => <Ionicons name="trophy" size={64} color="#FFD700" />;

export default function GameResults({ navigation }) {
  const { score, gameStats, resetGame, updateGameStats } = useGameStore();

  React.useEffect(() => {
    updateGameStats();
  }, []);

  const handlePlayAgain = () => {
    resetGame();
    navigation.navigate('GameBoard');
  };

  const handleReturnHome = () => {
    resetGame();
    navigation.navigate('GameHome');
  };

  return (
    <Layout style={styles.container}>
      <TopNavigation title='Game Results' alignment='center' />
      
      <View style={styles.content}>
        <Card style={styles.resultCard}>
          <TrophyIcon />
          <Text category='h4' style={styles.title}>Game Complete!</Text>
          <Text category='h2' style={styles.score}>{score}</Text>
          <Text category='s1' style={styles.scoreLabel}>Final Score</Text>
          
          <View style={styles.statsContainer}>
            <View style={styles.statItem}>
              <Text category='h6'>+{score}</Text>
              <Text category='c1'>XP Gained</Text>
            </View>
            <View style={styles.statItem}>
              <Text category='h6'>{gameStats.bestScore}</Text>
              <Text category='c1'>Best Score</Text>
            </View>
          </View>
        </Card>

        <View style={styles.buttonContainer}>
          <Button
            style={styles.button}
            onPress={handlePlayAgain}
          >
            Play Again
          </Button>
          <Button
            style={styles.button}
            appearance='outline'
            onPress={handleReturnHome}
          >
            Return Home
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
    justifyContent: 'center',
    alignItems: 'center',
    padding: 16,
  },
  resultCard: {
    padding: 32,
    alignItems: 'center',
    marginBottom: 32,
    width: '100%',
  },
  trophyIcon: {
    width: 64,
    height: 64,
    marginBottom: 16,
  },
  title: {
    marginBottom: 16,
  },
  score: {
    color: '#6C5CE7',
    fontWeight: 'bold',
    marginBottom: 8,
  },
  scoreLabel: {
    marginBottom: 24,
  },
  statsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    width: '100%',
  },
  statItem: {
    alignItems: 'center',
  },
  buttonContainer: {
    width: '100%',
  },
  button: {
    marginBottom: 12,
  },
});
