import React, { useEffect } from 'react';
import { View, StyleSheet } from 'react-native';
import { Layout, Text, Spinner } from '@ui-kitten/components';
import { useAuthStore } from '../../store';

export default function SplashScreen({ navigation }) {
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated);

  useEffect(() => {
    const timer = setTimeout(() => {
      if (isAuthenticated) {
        navigation.replace('Main');
      } else {
        navigation.replace('Onboarding');
      }
    }, 2000);

    return () => clearTimeout(timer);
  }, [isAuthenticated, navigation]);

  return (
    <Layout style={styles.container}>
      <Text category='h1' style={styles.title}>FinPath Quest</Text>
      <Text category='s1' style={styles.subtitle}>Your Financial Journey Starts Here</Text>
      <Spinner size='large' style={styles.spinner} />
    </Layout>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#6C5CE7',
  },
  title: {
    color: 'white',
    fontWeight: 'bold',
    marginBottom: 8,
  },
  subtitle: {
    color: 'white',
    opacity: 0.8,
    marginBottom: 40,
  },
  spinner: {
    borderColor: 'white',
  },
});
