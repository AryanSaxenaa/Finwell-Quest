import React, { useState } from 'react';
import { View, StyleSheet, ScrollView, Alert } from 'react-native';
import { Layout, Text, Button, Card, TopNavigation, ListItem } from '@ui-kitten/components';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useGameStore } from '../../store';

const learningTopics = [
  { id: 1, title: 'Budgeting Basics', description: 'Learn how to create and stick to a budget', tokenReward: 2 },
  { id: 2, title: 'Saving Strategies', description: 'Effective ways to build your savings', tokenReward: 2 },
  { id: 3, title: 'Investment 101', description: 'Introduction to investing and growing wealth', tokenReward: 3 },
  { id: 4, title: 'Debt Management', description: 'How to manage and eliminate debt', tokenReward: 2 },
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
    <SafeAreaView style={styles.safeArea} edges={['top']}>
      <Layout style={styles.container}>
        <TopNavigation title='Learning Hub' alignment='center' style={styles.topNavigation} />
      
      <ScrollView style={styles.content}>
        {/* Token Display Card */}
        <Card style={styles.tokenCard}>
          <View style={styles.tokenContainer}>
            <Text category='h6' style={styles.tokenText}>AI Tokens</Text>
            <Text category='h4' style={styles.tokenCount}>{getAITokens()}</Text>
          </View>
          <Text category='c1' style={styles.tokenDescription}>
            Read topics and complete quizzes to earn AI tokens!
          </Text>
        </Card>

        <Card style={styles.topicsCard}>
          <Text category='h6' style={styles.cardTitle}>Learning Topics</Text>
          <View>
            {learningTopics.map((topic) => (
              <ListItem
                key={topic.id}
                title={topic.title}
                description={topic.description}
                accessoryRight={() => (
                  <View style={styles.topicActions}>
                    <Text style={styles.tokenReward}>+{topic.tokenReward} tokens</Text>
                    <Button 
                      size='small' 
                      onPress={() => handleTopicRead(topic)}
                      disabled={readTopics.has(topic.id)}
                    >
                      {readTopics.has(topic.id) ? 'Completed' : 'Take Quiz'}
                    </Button>
                  </View>
                )}
              />
            ))}
          </View>
        </Card>
      </ScrollView>
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
  tokenCard: {
    marginBottom: 16,
    backgroundColor: '#FFF9E6',
    borderColor: '#FFD700',
    borderWidth: 1,
  },
  tokenContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  tokenText: {
    color: '#B8860B',
    fontWeight: 'bold',
  },
  tokenCount: {
    color: '#FFD700',
    fontWeight: 'bold',
  },
  tokenDescription: {
    color: '#8B7355',
    fontStyle: 'italic',
  },
  topicsCard: {
    marginBottom: 16,
  },
  cardTitle: {
    marginBottom: 12,
    fontWeight: 'bold',
  },
  topicActions: {
    alignItems: 'flex-end',
  },
  tokenReward: {
    fontSize: 12,
    color: '#FFD700',
    fontWeight: 'bold',
    marginBottom: 4,
  },
});
