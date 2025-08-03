import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import LearningHub from '../screens/main/LearningHub';
import QuizDetail from '../screens/main/QuizDetail';

const Stack = createNativeStackNavigator();

export default function LearnStackNavigator() {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="LearningHub" component={LearningHub} />
      <Stack.Screen name="QuizDetail" component={QuizDetail} />
    </Stack.Navigator>
  );
}
