import React, { useEffect } from 'react';
import { View, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { 
  Layout, 
  Text
} from '@ui-kitten/components';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { useGameStore } from '../../store';
import { 
  BrutalCard, 
  BrutalButton, 
  BrutalHeader,
  BrutalStats,
  BrutalProgressBar,
  brutalTextStyle 
} from '../../components/BrutalComponents';
import { NeoBrutalism } from '../../styles/neoBrutalism';

const TrophyIcon = (props) => <Ionicons name="trophy" size={32} color={NeoBrutalism.colors.neonYellow} />;
const StarIcon = (props) => <Ionicons name="star" size={32} color={NeoBrutalism.colors.neonYellow} />;
const FlashIcon = (props) => <Ionicons name="flash" size={32} color={NeoBrutalism.colors.neonGreen} />;
const HeartIcon = (props) => <Ionicons name="heart" size={32} color={NeoBrutalism.colors.hotPink} />;

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
    <BrutalCard style={styles.statCard}>
      <View style={styles.statContent}>
        {icon}
        <View style={styles.statText}>
          <Text style={brutalTextStyle('h5', 'bold', 'black')}>{value}</Text>
          <Text style={brutalTextStyle('caption', 'medium', 'gray')}>{title}</Text>
        </View>
      </View>
    </BrutalCard>
  );

  const DailyChallengeCard = () => (
    <BrutalCard style={styles.challengeCard}>
      <View style={styles.challengeHeader}>
        <Ionicons name="calendar" size={20} color={NeoBrutalism.colors.black} style={styles.challengeIcon} />
        <Text style={brutalTextStyle('h6', 'bold', 'black')}>DAILY CHALLENGE</Text>
        {dailyChallenge.completed && (
          <Ionicons name="checkmark-circle" size={20} color={NeoBrutalism.colors.neonGreen} style={{ marginLeft: 8 }} />
        )}
      </View>
      <Text style={[brutalTextStyle('body', 'medium', 'black'), styles.challengeText]}>
        {dailyChallenge.completed 
          ? dailyChallenge.wasCorrect 
            ? `COMPLETED! YOU EARNED ${dailyChallenge.xpEarned} XP!`
            : 'COMPLETED! COME BACK TOMORROW FOR A NEW CHALLENGE.'
          : 'COMPLETE TODAY\'S CHALLENGE FOR +50 XP!'
        }
      </Text>
      {!dailyChallenge.completed && (
        <BrutalButton
          title="VIEW CHALLENGE"
          onPress={() => navigation.navigate('DailyChallenge')}
          variant="primary"
          size="small"
        />
      )}
    </BrutalCard>
  );

  return (
    <SafeAreaView style={styles.safeArea} edges={['top', 'left', 'right']}>
      <Layout style={styles.container}>
        <BrutalHeader 
          title="GAME CENTER"
        />
      
        {/* Top Section with Level Progress and Leaderboard */}
        <View style={styles.topSection}>
          <BrutalButton
            title={`LEVEL ${level} • ${xpProgress} XP`}
            variant="secondary"
            size="small"
            style={styles.compactLevelButton}
            icon={<Ionicons name="trophy" size={20} color={NeoBrutalism.colors.black} />}
            textStyle={{ fontSize: 13 }}
          />
          <BrutalButton
            title="LEADERBOARD"
            variant="secondary"
            size="small"
            onPress={() => navigation.navigate('Leaderboard')}
            style={styles.compactLeaderboardButton}
            icon={<Ionicons name="podium" size={20} color={NeoBrutalism.colors.black} />}
            textStyle={{ fontSize: 13 }}
          />
        </View>
        
        <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
          <BrutalCard style={styles.playCard}>
            <Text style={brutalTextStyle('h4', 'bold', 'black')}>READY TO LEARN?</Text>
            <Text style={[brutalTextStyle('body', 'medium', 'gray'), styles.descriptionText]}>
              TEST YOUR FINANCIAL KNOWLEDGE WHILE HAVING FUN!
            </Text>
            <BrutalButton
              title="PLAY NOW"
              onPress={handleStartGame}
              variant="primary"
              size="large"
              style={styles.playButton}
              icon={<Ionicons name="play-circle" size={24} color={NeoBrutalism.colors.black} />}
            />
          </BrutalCard>

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

        <>
          <DailyChallengeCard />
          <View style={{ height: 40 }} />
        </>

      </ScrollView>
    </Layout>
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
    backgroundColor: NeoBrutalism.colors.background,
  },
  content: {
    flex: 1,
    padding: NeoBrutalism.spacing.lg,
  },
  topSection: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 20, // Added padding between header and buttons
    marginBottom: NeoBrutalism.spacing.lg,
    paddingHorizontal: NeoBrutalism.spacing.lg,
    gap: NeoBrutalism.spacing.md,
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
    paddingLeft: 2, // Further reduced left padding (was 8, now 2)
    paddingRight: 20, // Increased right padding
    paddingVertical: 8,
    minHeight: 44, // Ensure consistent height
    justifyContent: 'center', // Center content vertically
    alignItems: 'center', // Center content horizontally
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
    paddingLeft: 18, // Increased left padding (was 12, now 12 + 6 from level button reduction)
    paddingRight: 17, // Reduced by 3px (was 20, now 17)
    paddingVertical: 8,
    minHeight: 44, // Ensure consistent height
    justifyContent: 'center', // Center content vertically
    alignItems: 'center', // Center content horizontally
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
    backgroundColor: NeoBrutalism.colors.white, // Changed to white
    borderColor: NeoBrutalism.colors.black, // Black border for contrast
    borderWidth: 3, // Added border width
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
    borderWidth: 0, // Remove border
    borderColor: 'transparent',
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
    backgroundColor: '#FFF',
    borderColor: '#E4E9F2',
    borderWidth: 1,
    borderRadius: 8,
    paddingLeft: 0, // Reduced by 2
    paddingRight: 18, // Reduced by 2
    paddingVertical: 6, // Reduced by 2
    minHeight: 42, // Reduced by 2
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 3,
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
    backgroundColor: '#FFF',
    borderColor: '#E4E9F2',
    borderWidth: 1,
    borderRadius: 8,
    paddingLeft: 16, // Reduced by 2
    paddingRight: 15, // Reduced by 2
    paddingVertical: 6, // Reduced by 2
    minHeight: 42, // Reduced by 2
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 3,
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
