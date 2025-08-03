import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import GameHome from '../screens/main/GameHome';
import GameBoard from '../screens/main/GameBoard';
import QuestionScreen from '../screens/main/QuestionScreen';
import GameResults from '../screens/main/GameResults';
import DailyChallenge from '../screens/main/DailyChallenge';

const Stack = createNativeStackNavigator();

export default function GameStackNavigator() {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="GameHome" component={GameHome} />
      <Stack.Screen name="GameBoard" component={GameBoard} />
      <Stack.Screen name="QuestionScreen" component={QuestionScreen} />
      <Stack.Screen name="GameResults" component={GameResults} />
      <Stack.Screen name="DailyChallenge" component={DailyChallenge} />
    </Stack.Navigator>
  );
}
