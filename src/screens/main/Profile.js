import React, { useState } from 'react';
import { View, StyleSheet, ScrollView, Alert } from 'react-native';
import { 
  Layout, 
  Text, 
  Input, 
  Button, 
  Card, 
  TopNavigation, 
  Toggle,
  Avatar
} from '@ui-kitten/components';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { useAuthStore, useGameStore } from '../../store';

const PersonIcon = (props) => <Ionicons name="person-outline" size={64} color="#8F9BB3" />;
const LogoutIcon = (props) => <Ionicons name="log-out-outline" size={24} color="white" />;

export default function Profile({ navigation }) {
  const { user, logout } = useAuthStore();
  const { level, xp, gameStats } = useGameStore();
  
  const [username, setUsername] = useState(user?.name || 'User');
  const [notifications, setNotifications] = useState(true);
  const [biometric, setBiometric] = useState(false);

  const handleLogout = () => {
    Alert.alert(
      'Logout',
      'Are you sure you want to logout?',
      [
        { text: 'Cancel', style: 'cancel' },
        { 
          text: 'Logout', 
          style: 'destructive',
          onPress: () => {
            logout();
            navigation.replace('Login');
          }
        }
      ]
    );
  };

  const handleSaveProfile = () => {
    Alert.alert('Success', 'Profile updated successfully!');
  };

  return (
    <SafeAreaView style={styles.safeArea} edges={['top']}>
      <Layout style={styles.container}>
        <TopNavigation title='Profile & Settings' alignment='center' style={styles.topNavigation} />
      
      <ScrollView style={styles.content}>
        <Card style={styles.profileCard}>
          <View style={styles.avatarContainer}>
            <Avatar
              style={styles.avatar}
              source={{ uri: 'https://via.placeholder.com/100' }}
            />
            <Button size='small' appearance='ghost'>
              Change Photo
            </Button>
          </View>
          
          <Input
            style={styles.input}
            label='Username'
            value={username}
            onChangeText={setUsername}
            accessoryLeft={PersonIcon}
          />
          
          <View style={styles.statsContainer}>
            <View style={styles.statItem}>
              <Text category='h6'>{level}</Text>
              <Text category='c1'>Level</Text>
            </View>
            <View style={styles.statItem}>
              <Text category='h6'>{xp}</Text>
              <Text category='c1'>XP</Text>
            </View>
            <View style={styles.statItem}>
              <Text category='h6'>{gameStats.totalGamesPlayed}</Text>
              <Text category='c1'>Games</Text>
            </View>
          </View>
        </Card>

        <Card style={styles.settingsCard}>
          <Text category='h6' style={styles.sectionTitle}>Settings</Text>
          
          <View style={styles.settingItem}>
            <Text category='s1'>Push Notifications</Text>
            <Toggle
              checked={notifications}
              onChange={setNotifications}
            />
          </View>
          
          <View style={styles.settingItem}>
            <Text category='s1'>Biometric Login</Text>
            <Toggle
              checked={biometric}
              onChange={setBiometric}
            />
          </View>
        </Card>

        <Button
          style={styles.saveButton}
          onPress={handleSaveProfile}
        >
          Save Changes
        </Button>

        <Button
          style={styles.logoutButton}
          appearance='outline'
          status='danger'
          accessoryLeft={LogoutIcon}
          onPress={handleLogout}
        >
          Logout
        </Button>
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
  profileCard: {
    marginBottom: 16,
    alignItems: 'center',
  },
  avatarContainer: {
    alignItems: 'center',
    marginBottom: 20,
  },
  avatar: {
    width: 100,
    height: 100,
    marginBottom: 8,
  },
  input: {
    marginBottom: 16,
    width: '100%',
  },
  statsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    width: '100%',
    marginTop: 16,
  },
  statItem: {
    alignItems: 'center',
  },
  settingsCard: {
    marginBottom: 16,
  },
  sectionTitle: {
    marginBottom: 16,
    fontWeight: 'bold',
  },
  settingItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  saveButton: {
    marginBottom: 12,
  },
  logoutButton: {
    marginBottom: 20,
  },
});
