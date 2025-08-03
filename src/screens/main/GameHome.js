import React, { useEffect } from 'react';
import { View, StyleSheet, ScrollView } from 'react-native';
import { 
  Layout, 
  Text, 
  Card, 
  Button, 
  TopNavigation
} from '@ui-kitten/components';
import { Ionicons } from '@expo/vector-icons';
import { useGameStore } from '../../store';

const TrophyIcon = (props) => <Ionicons name="trophy-outline" size={32} color="#FFD700" />;
const PlayIcon = (props) => <Ionicons name="play-circle-outline" size={24} color="white" />;
const StarIcon = (props) => <Ionicons name="star-outline" size={32} color="#FFD700" />;
const CalendarIcon = (props) => <Ionicons name="calendar-outline" size={24} color="#FFD700" />;
const FlashIcon = (props) => <Ionicons name="flash-outline" size={32} color="#00B894" />;
const HeartIcon = (props) => <Ionicons name="heart-outline" size={32} color="#E74C3C" />;

export default function GameHome({ navigation }) {
  const { 
    score, 
    level, 
    xp, 
    lives, 
    gameStats, 
    getXPForNextLevel, 
    getXPProgress,
    resetGame,
    dailyChallenge,
    checkDailyChallengeReset
  } = useGameStore();

  useEffect(() => {
    // Check if daily challenge needs to be reset for new day
    checkDailyChallengeReset();
  }, []);

  const handleStartGame = () => {
    resetGame(); // Reset game state before starting
    navigation.navigate('GameBoard');
  };

  const xpForNext = getXPForNextLevel(xp);
  const xpProgress = getXPProgress(xp);
  const progressPercentage = (xpProgress / 100) * 100;

  const StatCard = ({ title, value, icon }) => (
    <Card style={styles.statCard}>
      <View style={styles.statContent}>
        {icon}
        <View style={styles.statText}>
          <Text category='h5'>{value}</Text>
          <Text category='c1'>{title}</Text>
        </View>
      </View>
    </Card>
  );

  const DailyChallengeCard = () => (
    <Card style={styles.challengeCard}>
      <View style={styles.challengeHeader}>
        <Ionicons name="calendar" size={20} color="#D4AF37" style={styles.challengeIcon} />
        <Text category='h6' style={styles.challengeTitle}>Daily Challenge</Text>
        {dailyChallenge.completed && (
          <Ionicons name="checkmark-circle" size={20} color="#00D68F" style={{ marginLeft: 8 }} />
        )}
      </View>
      <Text category='p2' style={styles.challengeText}>
        {dailyChallenge.completed 
          ? dailyChallenge.wasCorrect 
            ? `Completed! You earned ${dailyChallenge.xpEarned} XP!`
            : 'Completed! Come back tomorrow for a new challenge.'
          : 'Complete today\'s challenge for +50 XP!'
        }
      </Text>
      {!dailyChallenge.completed && (
        <Button
          style={styles.challengeButton}
          size='small'
          onPress={() => navigation.navigate('DailyChallenge')}
        >
          View Challenge
        </Button>
      )}
    </Card>
  );

  return (
    <Layout style={styles.container}>
      <TopNavigation
        title='Game Center'
        alignment='center'
      />
      
      {/* Top Section with Level Progress and Leaderboard */}
      <View style={styles.topSection}>
        <Button
          style={styles.compactLevelButton}
          appearance='ghost'
          accessoryLeft={() => <Ionicons name="trophy" size={20} color="#FFD700" />}
        >
          Level {level} • {xpProgress} XP
        </Button>
        
        <Button
          style={styles.compactLeaderboardButton}
          appearance='ghost'
          onPress={() => navigation.navigate('SocialTab', { screen: 'Leaderboard' })}
          accessoryLeft={() => <Ionicons name="podium" size={20} color="#6C5CE7" />}
        >
          Leaderboard
        </Button>
      </View>
      
      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        <Card style={styles.playCard}>
          <Text category='h4' style={styles.welcomeText}>Ready to Learn?</Text>
          <Text category='p1' style={styles.descriptionText}>
            Test your financial knowledge while having fun!
          </Text>
          <Button
            style={styles.playButton}
            size='large'
            accessoryLeft={PlayIcon}
            onPress={handleStartGame}
            appearance='filled'
          >
            <Text style={styles.playButtonText}>Play Now</Text>
          </Button>
        </Card>

        <View style={styles.statsContainer}>
          <StatCard 
            title="Current Score" 
            value={score} 
            icon={<StarIcon />}
          />
          <StatCard 
            title="Experience" 
            value={xp} 
            icon={<FlashIcon />}
          />
        </View>

        <View style={styles.statsContainer}>
          <StatCard 
            title="Lives Left" 
            value={lives} 
            icon={<HeartIcon />}
          />
          <StatCard 
            title="Best Score" 
            value={gameStats.bestScore} 
            icon={<TrophyIcon />}
          />
        </View>

        <DailyChallengeCard />

        <Card style={styles.achievementsCard}>
          <Text category='h6' style={styles.achievementsTitle}>Game Statistics</Text>
          <View style={styles.achievementsList}>
            <View style={styles.achievementItem}>
              <Text category='s1'>Games Played</Text>
              <Text category='h6'>{gameStats.totalGamesPlayed}</Text>
            </View>
            <View style={styles.achievementItem}>
              <Text category='s1'>Accuracy</Text>
              <Text category='h6'>
                {gameStats.totalQuestionsAnswered > 0 
                  ? Math.round((gameStats.totalCorrectAnswers / gameStats.totalQuestionsAnswered) * 100)
                  : 0}%
              </Text>
            </View>
            <View style={styles.achievementItem}>
              <Text category='s1'>Best Streak</Text>
              <Text category='h6'>{gameStats.streaks?.longestStreak || 0}</Text>
            </View>
          </View>
        </Card>
      </ScrollView>
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
  topSection: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 20,
    paddingHorizontal: 4,
    gap: 12,
  },
  levelProgressContainer: {
    flex: 1,
    marginRight: 16,
  },
  levelProgressCard: {
    flex: 1,
    marginRight: 16,
    backgroundColor: '#FFF',
    borderColor: '#E4E9F2',
    borderWidth: 1,
  levelText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#2E384D',
    marginLeft: 6,
  },shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 3,
  },
  levelInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 6,
  },
  xpProgressContainer: {
    marginTop: 4,
  },
  levelProgressHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  levelText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#2E384D',
  },
  xpText: {
    fontSize: 12,
    color: '#8F9BB3',
  },
  progressBar: {
    height: 8,
    backgroundColor: '#EDF1F7',
    borderRadius: 4,
    overflow: 'hidden',
  },
  progressFill: {
    height: '100%',
    backgroundColor: '#6C5CE7',
    borderRadius: 4,
  },
  compactLevelButton: {
    backgroundColor: '#FFF',
    borderColor: '#E4E9F2',
    borderWidth: 1,
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 8,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 3,
  },
  compactLeaderboardButton: {
    backgroundColor: '#FFF',
    borderColor: '#E4E9F2',
    borderWidth: 1,
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 8,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 3,
  },
  playCard: {
    marginBottom: 20,
    backgroundColor: '#6C5CE7',
    alignItems: 'center',
    padding: 24,
  },
  welcomeText: {
    color: 'white',
    fontWeight: 'bold',
    marginBottom: 8,
  },
  descriptionText: {
    color: 'white',
    opacity: 0.9,
    textAlign: 'center',
    marginBottom: 20,
  },
  playButton: {
    backgroundColor: '#2E384D',
    borderColor: '#2E384D',
    borderRadius: 8,
  },
  playButtonText: {
    color: 'white',
    fontWeight: 'bold',
    fontSize: 16,
  },
  statsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 16,
  },
  statCard: {
    flex: 1,
    marginHorizontal: 4,
  },
  statContent: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  statIcon: {
    width: 32,
    height: 32,
    marginRight: 12,
  },
  statText: {
    flex: 1,
  },
  xpCard: {
    marginBottom: 16,
    backgroundColor: '#F0F8FF',
    borderLeftWidth: 4,
    borderLeftColor: '#6C5CE7',
  },
  xpHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  xpProgressBar: {
    height: 8,
    backgroundColor: '#E0E0E0',
    borderRadius: 4,
    marginBottom: 8,
    overflow: 'hidden',
  },
  xpProgressFill: {
    height: '100%',
    backgroundColor: '#6C5CE7',
    borderRadius: 4,
  },
  xpText: {
    textAlign: 'center',
    color: '#6C5CE7',
    fontWeight: '500',
  },
  challengeCard: {
    marginBottom: 16,
    backgroundColor: '#FFD700',
    borderRadius: 8,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 3,
  },
  challengeHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  challengeIcon: {
    marginRight: 8,
  },
  challengeTitle: {
    color: '#2E384D',
    fontWeight: 'bold',
  },
  challengeText: {
    marginBottom: 12,
    color: '#2E384D',
  },
  challengeButton: {
    backgroundColor: '#2E384D',
    borderColor: '#2E384D',
  },
  completedButton: {
    backgroundColor: '#8F9BB3',
    borderColor: '#8F9BB3',
  },
  challengeReward: {
    color: '#FFD700',
    fontWeight: 'bold',
  },
  achievementsCard: {
    marginBottom: 16,
  },
  achievementsTitle: {
    marginBottom: 16,
    fontWeight: 'bold',
  },
  achievementsList: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  achievementItem: {
    alignItems: 'center',
    flex: 1,
  },
  leaderboardButton: {
    marginBottom: 20,
  },
});
