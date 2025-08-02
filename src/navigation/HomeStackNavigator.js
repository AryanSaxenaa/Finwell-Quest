import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import HomeDashboard from '../screens/main/HomeDashboard';
import ExpenseHistory from '../screens/main/ExpenseHistory';
import BudgetManagement from '../screens/main/BudgetManagement';

const Stack = createNativeStackNavigator();

export default function HomeStackNavigator() {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="HomeDashboard" component={HomeDashboard} />
      <Stack.Screen name="ExpenseHistory" component={ExpenseHistory} />
      <Stack.Screen name="BudgetManagement" component={BudgetManagement} />
    </Stack.Navigator>
  );
}
