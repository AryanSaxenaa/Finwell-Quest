import React from 'react';
import { View, StyleSheet, ScrollView } from 'react-native';
import { Layout, Text, Button, Card, TopNavigation, List, ListItem } from '@ui-kitten/components';

const learningTopics = [
  { id: 1, title: 'Budgeting Basics', description: 'Learn how to create and stick to a budget' },
  { id: 2, title: 'Saving Strategies', description: 'Effective ways to build your savings' },
  { id: 3, title: 'Investment 101', description: 'Introduction to investing and growing wealth' },
  { id: 4, title: 'Debt Management', description: 'How to manage and eliminate debt' },
];

export default function LearningHub({ navigation }) {
  const renderTopicItem = ({ item }) => (
    <ListItem
      title={item.title}
      description={item.description}
      accessoryRight={() => (
        <Button size='small' onPress={() => navigation.navigate('QuizDetail', { topic: item })}>
          Take Quiz
        </Button>
      )}
    />
  );

  return (
    <Layout style={styles.container}>
      <TopNavigation title='Learning Hub' alignment='center' />
      
      <ScrollView style={styles.content}>
        <Button
          style={styles.chatButton}
          onPress={() => navigation.navigate('AIChat')}
        >
          Chat with AI Assistant
        </Button>
        
        <Card style={styles.topicsCard}>
          <Text category='h6' style={styles.cardTitle}>Learning Topics</Text>
          <List
            data={learningTopics}
            renderItem={renderTopicItem}
          />
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
  chatButton: {
    marginBottom: 16,
  },
  topicsCard: {
    marginBottom: 16,
  },
  cardTitle: {
    marginBottom: 12,
    fontWeight: 'bold',
  },
});
