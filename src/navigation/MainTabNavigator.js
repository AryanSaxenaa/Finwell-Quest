import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { BottomNavigation, BottomNavigationTab } from '@ui-kitten/components';
import { Ionicons } from '@expo/vector-icons';
import { StyleSheet } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import HomeStackNavigator from './HomeStackNavigator';
import GameStackNavigator from './GameStackNavigator';
import LearnStackNavigator from './LearnStackNavigator';
import AIStackNavigator from './AIStackNavigator';

const Tab = createBottomTabNavigator();

const HomeIcon = (props) => <Ionicons name="home-outline" size={24} color={props.tintColor} />;
const GameIcon = (props) => <Ionicons name="grid-outline" size={24} color={props.tintColor} />;
const LearnIcon = (props) => <Ionicons name="book-outline" size={24} color={props.tintColor} />;
const AIIcon = (props) => <Ionicons name="chatbubble-ellipses-outline" size={24} color={props.tintColor} />;

const BottomTabBar = ({ navigation, state }) => (
  <SafeAreaView edges={['bottom']} style={styles.safeAreaBottom}>
    <BottomNavigation
      selectedIndex={state.index}
      onSelect={index => navigation.navigate(state.routeNames[index])}
      style={styles.bottomNavigation}
    >
      <BottomNavigationTab 
        title='Home' 
        icon={HomeIcon} 
        style={styles.bottomTab}
      />
      <BottomNavigationTab 
        title='Game' 
        icon={GameIcon} 
        style={styles.bottomTab}
      />
      <BottomNavigationTab 
        title='Learn' 
        icon={LearnIcon} 
        style={styles.bottomTab}
      />
      <BottomNavigationTab 
        title='AI Advisor' 
        icon={AIIcon} 
        style={styles.bottomTab}
      />
    </BottomNavigation>
  </SafeAreaView>
);

export default function MainTabNavigator() {
  return (
    <Tab.Navigator 
      tabBar={props => <BottomTabBar {...props} />}
      screenOptions={{ headerShown: false }}
    >
      <Tab.Screen name="HomeTab" component={HomeStackNavigator} />
      <Tab.Screen name="GameTab" component={GameStackNavigator} />
      <Tab.Screen name="LearnTab" component={LearnStackNavigator} />
      <Tab.Screen name="AITab" component={AIStackNavigator} />
    </Tab.Navigator>
  );
}

const styles = StyleSheet.create({
  safeAreaBottom: {
    backgroundColor: '#FFFFFF',
  },
  bottomNavigation: {
    paddingVertical: 8,
    backgroundColor: '#FFFFFF',
    borderTopWidth: 1,
    borderTopColor: '#E5E7EB',
  },
  bottomTab: {
    paddingVertical: 4,
  },
});
