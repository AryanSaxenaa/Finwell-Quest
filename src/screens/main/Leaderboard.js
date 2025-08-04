import React from 'react';

import { View, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { Layout, Text } from '@ui-kitten/components';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { BrutalCard, BrutalHeader, brutalTextStyle } from '../../components/BrutalComponents';
import { NeoBrutalism } from '../../styles/neoBrutalism';

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
    <SafeAreaView style={styles.safeArea} edges={['top']}>
      <Layout style={styles.container}>
        <BrutalHeader
          title="LEADERBOARD"
          textColor="white"
          leftAction={
            <TouchableOpacity onPress={() => navigation.goBack()}>
              <Ionicons name="arrow-back" size={24} color={NeoBrutalism.colors.white} />
            </TouchableOpacity>
          }
        />
        <ScrollView style={styles.content}>
          <Text style={[brutalTextStyle('h5', 'bold', 'black'), styles.title]}>Top Players</Text>
          <View>
            {leaderboardData.map(item => (
              <BrutalCard
                key={item.id}
                style={[
                  styles.listItem,
                  item.name === 'You' && styles.currentUser
                ]}
              >
                <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                  {item.rank <= 3 ? (
                    <Ionicons name="trophy" size={20} color="#FFD700" style={styles.trophyIcon} />
                  ) : (
                    <Text style={styles.rankNumber}>{item.rank}</Text>
                  )}
                  <Text style={brutalTextStyle('body', 'bold', 'black')}>
                    {item.rank}. {item.name}
                  </Text>
                  <View style={{ flex: 1 }} />
                  <Text style={brutalTextStyle('body', 'medium', 'black')}>
                    {item.score} pts
                  </Text>
                </View>
              </BrutalCard>
            ))}
          </View>
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
    backgroundColor: NeoBrutalism.colors.white,
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
    marginBottom: 12,
    borderWidth: 3,
    borderColor: NeoBrutalism.colors.black,
    backgroundColor: NeoBrutalism.colors.lightGray,
    padding: 16,
  },
  currentUser: {
    backgroundColor: NeoBrutalism.colors.neonYellow,
    borderLeftWidth: 6,
    borderLeftColor: NeoBrutalism.colors.hotPink,
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
    color: NeoBrutalism.colors.deepPurple,
  },
});
