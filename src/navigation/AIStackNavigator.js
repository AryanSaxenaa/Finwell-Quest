import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import AIChat from '../screens/main/AIChat';
import Profile from '../screens/main/Profile';

const Stack = createNativeStackNavigator();

export default function AIStackNavigator() {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="AIChat" component={AIChat} />
      <Stack.Screen name="Profile" component={Profile} />
    </Stack.Navigator>
  );
}
