import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import Leaderboard from '../screens/main/Leaderboard';
import Profile from '../screens/main/Profile';

const Stack = createNativeStackNavigator();

export default function SocialStackNavigator() {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="Leaderboard" component={Leaderboard} />
      <Stack.Screen name="Profile" component={Profile} />
    </Stack.Navigator>
  );
}
