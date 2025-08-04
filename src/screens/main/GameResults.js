import React from 'react';
import { View, StyleSheet } from 'react-native';
import { 
  Layout, 
  Text, 
  Button, 
  Card, 
  TopNavigation,
  TopNavigationAction 
} from '@ui-kitten/components';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { useGameStore } from '../../store';

const TrophyIcon = (props) => <Ionicons name="trophy" size={64} color="#FFD700" />;
const BackIcon = (props) => <Ionicons name="arrow-back" size={24} color="#8F9BB3" />;

export default function GameResults({ navigation }) {
  const { score, gameStats, resetGame, updateGameStats, level, xp } = useGameStore();

  React.useEffect(() => {
    updateGameStats();
  }, []);

  const handlePlayAgain = () => {
    resetGame();
    // Use reset navigation to clear the stack and start fresh
    navigation.reset({
      index: 0,
      routes: [
        { name: 'GameHome' },
        { name: 'GameBoard' }
      ],
    });
  };

  const handleReturnHome = () => {
    resetGame();
    // Reset navigation stack and go to GameHome
    navigation.reset({
      index: 0,
      routes: [{ name: 'GameHome' }],
    });
  };

  const renderBackAction = () => (
    <TopNavigationAction 
      icon={BackIcon} 
      onPress={() => {
        resetGame();
        navigation.goBack();
      }} 
    />
  );

  // Calculate performance percentage
  const performancePercentage = Math.min(100, (score / 100) * 100);
  
  // Determine performance level and rewards
  const getPerformanceLevel = () => {
    if (performancePercentage >= 90) return { level: 'Excellent', icon: '🏆', color: '#FFD700' };
    if (performancePercentage >= 75) return { level: 'Great', icon: '🥇', color: '#C0C0C0' };
    if (performancePercentage >= 60) return { level: 'Good', icon: '🥈', color: '#CD7F32' };
    if (performancePercentage >= 40) return { level: 'Fair', icon: '📈', color: '#6C5CE7' };
    return { level: 'Try Again', icon: '💪', color: '#E74C3C' };
  };

  const performance = getPerformanceLevel();

  // Calculate badges earned
  const badges = [];
  if (score >= 100) badges.push({ name: 'High Scorer', icon: '⭐' });
  if (performancePercentage >= 90) badges.push({ name: 'Quiz Master', icon: '🎓' });
  if (gameStats.totalGamesPlayed === 1) badges.push({ name: 'First Game', icon: '🎮' });
  if (gameStats.totalGamesPlayed >= 5) badges.push({ name: 'Dedicated Player', icon: '🏅' });

  return (
    <SafeAreaView style={styles.safeArea} edges={['top']}>
      <Layout style={styles.container}>
        <TopNavigation
          title='Game Results'
          alignment='center'
          accessoryLeft={renderBackAction}
          style={styles.topNavigation}
        />      <View style={styles.content}>
        {/* Performance Card */}
        <Card style={styles.performanceCard}>
          <Text style={styles.performanceIcon}>{performance.icon}</Text>
          <Text category='h5' style={[styles.performanceText, { color: performance.color }]}>
            {performance.level}
          </Text>
          <Text category='c1'>Performance Level</Text>
        </Card>

        {/* Main Results Card */}
        <Card style={styles.resultCard}>
          <TrophyIcon />
          <Text category='h4' style={styles.title}>Game Complete!</Text>
          <Text category='h1' style={styles.score}>{score}</Text>
          <Text category='s1' style={styles.scoreLabel}>Final Score</Text>
          
          {/* Progress Bar */}
          <View style={styles.progressContainer}>
            <Text category='c1' style={styles.progressLabel}>
              Performance: {performancePercentage.toFixed(0)}%
            </Text>
            <View style={styles.progressBar}>
              <View style={[
                styles.progressFill, 
                { 
                  width: `${performancePercentage}%`,
                  backgroundColor: performance.color
                }
              ]} />
            </View>
          </View>
          
          <View style={styles.statsContainer}>
            <View style={styles.statItem}>
              <Text category='h6'>+{score}</Text>
              <Text category='c1'>XP Gained</Text>
            </View>
            <View style={styles.statItem}>
              <Text category='h6'>Level {level}</Text>
              <Text category='c1'>Current Level</Text>
            </View>
            <View style={styles.statItem}>
              <Text category='h6'>{gameStats.bestScore}</Text>
              <Text category='c1'>Best Score</Text>
            </View>
          </View>
        </Card>

        {/* Badges Section */}
        {badges.length > 0 && (
          <Card style={styles.badgesCard}>
            <Text category='h6' style={styles.badgesTitle}>🏆 Badges Earned</Text>
            <View style={styles.badgesContainer}>
              {badges.map((badge, index) => (
                <View key={index} style={styles.badge}>
                  <Text style={styles.badgeIcon}>{badge.icon}</Text>
                  <Text category='c1' style={styles.badgeName}>{badge.name}</Text>
                </View>
              ))}
            </View>
          </Card>
        )}

        {/* Statistics Card */}
        <Card style={styles.detailedStatsCard}>
          <Text category='h6' style={styles.statsTitle}>📊 Game Statistics</Text>
          <View style={styles.statRow}>
            <Text category='s1'>Games Played:</Text>
            <Text category='h6'>{gameStats.totalGamesPlayed}</Text>
          </View>
          <View style={styles.statRow}>
            <Text category='s1'>Total XP Earned:</Text>
            <Text category='h6'>{gameStats.totalScore}</Text>
          </View>
          <View style={styles.statRow}>
            <Text category='s1'>Average Score:</Text>
            <Text category='h6'>
              {gameStats.totalGamesPlayed > 0 
                ? Math.round(gameStats.totalScore / gameStats.totalGamesPlayed)
                : 0
              }
            </Text>
          </View>
        </Card>

        <View style={styles.buttonContainer}>
          <Button
            style={styles.button}
            onPress={handlePlayAgain}
          >
            🎮 Play Again
          </Button>
          <Button
            style={styles.button}
            appearance='outline'
            onPress={handleReturnHome}
          >
            🏠 Return Home
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
  performanceCard: {
    alignItems: 'center',
    marginBottom: 16,
    padding: 20,
    backgroundColor: '#FFFFFF',
  },
  performanceIcon: {
    fontSize: 48,
    marginBottom: 8,
  },
  performanceText: {
    fontWeight: 'bold',
    marginBottom: 4,
  },
  resultCard: {
    padding: 24,
    alignItems: 'center',
    marginBottom: 16,
    width: '100%',
  },
  title: {
    marginBottom: 12,
    textAlign: 'center',
  },
  score: {
    color: '#6C5CE7',
    fontWeight: 'bold',
    marginBottom: 8,
    fontSize: 48,
  },
  scoreLabel: {
    marginBottom: 20,
    color: '#8F9BB3',
  },
  progressContainer: {
    width: '100%',
    marginBottom: 24,
  },
  progressLabel: {
    textAlign: 'center',
    marginBottom: 8,
    color: '#8F9BB3',
  },
  progressBar: {
    height: 8,
    backgroundColor: '#E4E9F2',
    borderRadius: 4,
    overflow: 'hidden',
  },
  progressFill: {
    height: '100%',
    borderRadius: 4,
  },
  statsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    width: '100%',
  },
  statItem: {
    alignItems: 'center',
    flex: 1,
  },
  badgesCard: {
    marginBottom: 16,
    padding: 16,
    width: '100%',
  },
  badgesTitle: {
    textAlign: 'center',
    marginBottom: 16,
    fontWeight: 'bold',
  },
  badgesContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'center',
  },
  badge: {
    alignItems: 'center',
    margin: 8,
    padding: 12,
    backgroundColor: '#F8F9FA',
    borderRadius: 12,
    minWidth: 80,
  },
  badgeIcon: {
    fontSize: 24,
    marginBottom: 4,
  },
  badgeName: {
    textAlign: 'center',
    fontSize: 10,
    fontWeight: '600',
  },
  detailedStatsCard: {
    marginBottom: 20,
    padding: 16,
    width: '100%',
  },
  statsTitle: {
    textAlign: 'center',
    marginBottom: 16,
    fontWeight: 'bold',
  },
  statRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 8,
    borderBottomWidth: 1,
    borderBottomColor: '#F0F0F0',
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '100%',
  },
  button: {
    flex: 1,
    marginHorizontal: 8,
  },
});
