import React from 'react';
import { View, StyleSheet, ScrollView } from 'react-native';
import { Layout, Text, ListItem, TopNavigation } from '@ui-kitten/components';
import { Ionicons } from '@expo/vector-icons';

const TrophyIcon = (props) => <Ionicons name="trophy" size={20} color="#FFD700" />;

// Sample leaderboard data
const leaderboardData = [
  { id: 1, name: 'FinanceWiz', score: 2450, rank: 1 },
  { id: 2, name: 'MoneyMaster', score: 2380, rank: 2 },
  { id: 3, name: 'BudgetBoss', score: 2290, rank: 3 },
  { id: 4, name: 'SavingsGuru', score: 2150, rank: 4 },
  { id: 5, name: 'InvestorPro', score: 2050, rank: 5 },
  { id: 6, name: 'You', score: 1950, rank: 6 },
];

export default function Leaderboard({ navigation }) {
  const renderLeaderboardItem = (item) => {
    const isCurrentUser = item.name === 'You';
    
    return (
      <ListItem
        key={item.id}
        style={[styles.listItem, isCurrentUser && styles.currentUser]}
        title={`${item.rank}. ${item.name}`}
        description={`${item.score} points`}
        accessoryLeft={() => (
          item.rank <= 3 ? (
            <TrophyIcon />
          ) : (
            <Text style={styles.rankNumber}>{item.rank}</Text>
          )
        )}
      />
    );
  };

  return (
    <Layout style={styles.container}>
      <TopNavigation title='Global Leaderboard' alignment='center' />
      
      <ScrollView style={styles.content}>
        <Text category='h6' style={styles.title}>Top Players</Text>
        <View>
          {leaderboardData.map(renderLeaderboardItem)}
        </View>
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
  title: {
    marginBottom: 16,
    textAlign: 'center',
  },
  listItem: {
    marginBottom: 8,
  },
  currentUser: {
    backgroundColor: '#E8F4FD',
    borderLeftWidth: 4,
    borderLeftColor: '#6C5CE7',
  },
  trophyIcon: {
    width: 24,
    height: 24,
    marginRight: 8,
  },
  rankNumber: {
    fontWeight: 'bold',
    fontSize: 18,
    marginRight: 16,
    color: '#666',
  },
});
