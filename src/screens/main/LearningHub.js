import React, { useState } from 'react';
import { View, StyleSheet, ScrollView, Alert, TouchableOpacity, Text } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { useGameStore } from '../../store';
import { NeoBrutalism, brutalTextStyle } from '../../styles/neoBrutalism';
import { 
  BrutalCard, 
  BrutalButton, 
  BrutalHeader,
  BrutalIllustration 
} from '../../components/BrutalComponents';

const learningTopics = [
  { 
    id: 1, 
    title: 'Budgeting Basics', 
    description: 'Learn how to create and stick to a budget', 
    tokenReward: 2,
    icon: 'calculator-outline',
    color: 'neonYellow'
  },
  { 
    id: 2, 
    title: 'Saving Strategies', 
    description: 'Effective ways to build your savings', 
    tokenReward: 2,
    icon: 'wallet-outline',
    color: 'electricBlue'
  },
  { 
    id: 3, 
    title: 'Investment 101', 
    description: 'Introduction to investing and growing wealth', 
    tokenReward: 3,
    icon: 'trending-up-outline',
    color: 'neonGreen'
  },
  { 
    id: 4, 
    title: 'Debt Management', 
    description: 'How to manage and eliminate debt', 
    tokenReward: 2,
    icon: 'card-outline',
    color: 'hotPink'
  },
];

export default function LearningHub({ navigation }) {
  const { earnAITokens, getAITokens } = useGameStore();
  const [readTopics, setReadTopics] = useState(new Set());

  const handleTopicRead = (topic) => {
    if (!readTopics.has(topic.id)) {
      setReadTopics(prev => new Set(prev).add(topic.id));
      earnAITokens(topic.tokenReward);
      Alert.alert(
        'Learning Reward!',
        `You earned ${topic.tokenReward} AI tokens for reading ${topic.title}!`,
        [{ text: 'Great!', style: 'default' }]
      );
    }
    navigation.navigate('QuizDetail', { topic });
  };
  return (
    <SafeAreaView style={styles.safeArea} edges={['top', 'left', 'right']}>
      <View style={styles.container}>
        <BrutalHeader 
          title="📚 LEARNING HUB"
          textColor="white"
          rightAction={
            <View style={styles.tokenBadge}>
              <Ionicons name="diamond" size={16} color={NeoBrutalism.colors.black} />
              <Text style={brutalTextStyle('caption', 'bold', 'black')}>
                {getAITokens()}
              </Text>
            </View>
          }
        />
      
      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        {/* Token Display Card */}
        <View style={styles.tokenSection}>
          <View style={styles.tokenContainer}>
            <Ionicons name="diamond" size={24} color={NeoBrutalism.colors.electricBlue} />
            <View style={styles.tokenInfo}>
              <Text style={brutalTextStyle('h5', 'bold', 'black')}>
                AI TOKENS: {getAITokens()}
              </Text>
              <Text style={brutalTextStyle('caption', 'medium', 'gray')}>
                READ TOPICS AND COMPLETE QUIZZES TO EARN MORE!
              </Text>
            </View>
          </View>
        </View>

        {/* Learning Topics Section */}
        <View style={styles.topicsSection}>
          <Text style={[brutalTextStyle('h5', 'bold', 'black'), styles.sectionTitle]}>
            LEARNING TOPICS
          </Text>
          <View style={styles.topicsGrid}>
            {learningTopics.map((topic) => (
              <BrutalCard 
                key={topic.id} 
                style={[
                  styles.topicCard,
                  readTopics.has(topic.id) && styles.completedTopicCard
                ]}
              >
                <View style={styles.topicHeader}>
                  <View style={[styles.topicIcon, { backgroundColor: NeoBrutalism.colors[topic.color] }]}>
                    <Ionicons 
                      name={topic.icon} 
                      size={24} 
                      color={NeoBrutalism.colors.black} 
                    />
                  </View>
                  <View style={styles.tokenReward}>
                    <Text style={brutalTextStyle('caption', 'bold', 'black')}>
                      +{topic.tokenReward} 🪙
                    </Text>
                  </View>
                </View>
                
                <Text style={brutalTextStyle('h6', 'bold', 'black')}>
                  {topic.title.toUpperCase()}
                </Text>
                
                <Text style={[brutalTextStyle('caption', 'medium', 'gray'), styles.topicDescription]}>
                  {topic.description.toUpperCase()}
                </Text>
                
                <BrutalButton
                  title={readTopics.has(topic.id) ? 'COMPLETED ✓' : 'TAKE QUIZ'}
                  onPress={() => handleTopicRead(topic)}
                  variant={readTopics.has(topic.id) ? 'secondary' : 'primary'}
                  size="small"
                  style={styles.topicButton}
                  disabled={readTopics.has(topic.id)}
                />
              </BrutalCard>
            ))}
          </View>
        </View>
      </ScrollView>
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
    padding: NeoBrutalism.spacing.md, // Reduced from lg
  },
  
  // Token Badge in Header
  tokenBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: NeoBrutalism.colors.neonYellow,
    paddingHorizontal: NeoBrutalism.spacing.sm,
    paddingVertical: NeoBrutalism.spacing.xs,
    borderWidth: NeoBrutalism.borders.thick,
    borderColor: NeoBrutalism.colors.black,
    gap: NeoBrutalism.spacing.xs,
  },
  
  // Token Display Section
  tokenSection: {
    marginBottom: NeoBrutalism.spacing.md,
    paddingVertical: NeoBrutalism.spacing.sm,
  },
  tokenContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: NeoBrutalism.spacing.sm, // Reduced gap
  },
  tokenInfo: {
    flex: 1,
  },
  
  // Topics Section
  topicsSection: {
    marginBottom: NeoBrutalism.spacing.lg,
  },
  sectionTitle: {
    marginBottom: NeoBrutalism.spacing.md,
  },
  topicsGrid: {
    gap: NeoBrutalism.spacing.md,
  },
  
  // Individual Topic Cards
  topicCard: {
    marginBottom: NeoBrutalism.spacing.sm, // Reduced from md
    padding: NeoBrutalism.spacing.sm, // Reduced from md
  },
  completedTopicCard: {
    backgroundColor: NeoBrutalism.colors.lightGray,
    opacity: 0.8,
  },
  topicHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: NeoBrutalism.spacing.sm,
  },
  topicIcon: {
    width: 40, // Reduced from 48
    height: 40, // Reduced from 48
    borderRadius: 6, // Reduced from 8
    borderWidth: NeoBrutalism.borders.thick,
    borderColor: NeoBrutalism.colors.black,
    justifyContent: 'center',
    alignItems: 'center',
  },
  tokenReward: {
    backgroundColor: NeoBrutalism.colors.neonYellow,
    paddingHorizontal: NeoBrutalism.spacing.sm,
    paddingVertical: NeoBrutalism.spacing.xs,
    borderWidth: NeoBrutalism.borders.medium,
    borderColor: NeoBrutalism.colors.black,
  },
  topicDescription: {
    marginBottom: NeoBrutalism.spacing.sm, // Reduced from md
    lineHeight: 20,
  },
  topicButton: {
    marginTop: NeoBrutalism.spacing.sm,
  },
});
