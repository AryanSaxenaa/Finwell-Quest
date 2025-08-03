import React from 'react';
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
    resetGame
  } = useGameStore();

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
        <CalendarIcon style={styles.challengeIcon} />
        <Text category='h6'>Daily Challenge</Text>
      </View>
      <Text category='p2' style={styles.challengeText}>
        Answer 5 questions correctly to earn a 2x XP bonus!
      </Text>
      <Text category='c1' style={styles.challengeReward}>
        Reward: 100 XP
      </Text>
    </Card>
  );

  return (
    <Layout style={styles.container}>
      <TopNavigation
        title='Game Center'
        alignment='center'
      />
      
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
          >
            Play Dice Game
          </Button>
        </Card>

        <View style={styles.statsContainer}>
          <StatCard 
            title="Current Score" 
            value={score} 
            icon={<StarIcon />}
          />
          <StatCard 
            title="Level" 
            value={level} 
            icon={<TrophyIcon />}
          />
        </View>

        {/* XP Progress Card */}
        <Card style={styles.xpCard}>
          <View style={styles.xpHeader}>
            <Text category='h6'>Level {level} Progress</Text>
            <Text category='c1'>{xpProgress}/100 XP</Text>
          </View>
          <View style={styles.xpProgressBar}>
            <View style={[styles.xpProgressFill, { width: `${progressPercentage}%` }]} />
          </View>
          <Text category='c1' style={styles.xpText}>
            {100 - xpProgress} XP until Level {level + 1}
          </Text>
        </Card>

        <View style={styles.statsContainer}>
          <StatCard 
            title="Experience" 
            value={xp} 
            icon={<FlashIcon />}
          />
          <StatCard 
            title="Lives Left" 
            value={lives} 
            icon={<HeartIcon />}
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

        <Button
          style={styles.leaderboardButton}
          appearance='outline'
          onPress={() => navigation.navigate('SocialTab', { screen: 'Leaderboard' })}
        >
          View Leaderboard
        </Button>
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
    backgroundColor: 'white',
    borderColor: 'white',
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
    backgroundColor: '#FFF9E6',
    borderLeftWidth: 4,
    borderLeftColor: '#FFD700',
  },
  challengeHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  challengeIcon: {
    width: 24,
    height: 24,
    marginRight: 8,
  },
  challengeText: {
    marginBottom: 8,
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
