import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { BottomNavigation, BottomNavigationTab } from '@ui-kitten/components';
import { Ionicons } from '@expo/vector-icons';
import HomeStackNavigator from './HomeStackNavigator';
import GameStackNavigator from './GameStackNavigator';
import LearnStackNavigator from './LearnStackNavigator';
import SocialStackNavigator from './SocialStackNavigator';

const Tab = createBottomTabNavigator();

const HomeIcon = (props) => <Ionicons name="home-outline" size={24} color={props.tintColor} />;
const GameIcon = (props) => <Ionicons name="grid-outline" size={24} color={props.tintColor} />;
const LearnIcon = (props) => <Ionicons name="book-outline" size={24} color={props.tintColor} />;
const SocialIcon = (props) => <Ionicons name="people-outline" size={24} color={props.tintColor} />;

const BottomTabBar = ({ navigation, state }) => (
  <BottomNavigation
    selectedIndex={state.index}
    onSelect={index => navigation.navigate(state.routeNames[index])}
  >
    <BottomNavigationTab title='Home' icon={HomeIcon} />
    <BottomNavigationTab title='Game' icon={GameIcon} />
    <BottomNavigationTab title='Learn' icon={LearnIcon} />
    <BottomNavigationTab title='Social' icon={SocialIcon} />
  </BottomNavigation>
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
      <Tab.Screen name="SocialTab" component={SocialStackNavigator} />
    </Tab.Navigator>
  );
}
