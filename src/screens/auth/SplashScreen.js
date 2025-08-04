import React, { useEffect } from 'react';
import { View, StyleSheet, ActivityIndicator } from 'react-native';
import { Layout, Text } from '@ui-kitten/components';
import { useAuthStore } from '../../store';
import { brutalTextStyle } from '../../components/BrutalComponents';
import { NeoBrutalism } from '../../styles/neoBrutalism';

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
      <View style={styles.logoContainer}>
        <Text style={brutalTextStyle('h1', 'bold', 'black')}>FINPATH</Text>
        <Text style={brutalTextStyle('h1', 'bold', 'neonYellow')}>QUEST</Text>
      </View>
      <Text style={[brutalTextStyle('h6', 'bold', 'black'), styles.subtitle]}>
        YOUR FINANCIAL JOURNEY STARTS HERE
      </Text>
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color={NeoBrutalism.colors.neonYellow} />
        <Text style={[brutalTextStyle('body', 'bold', 'black'), styles.loadingText]}>
          LOADING...
        </Text>
      </View>
    </Layout>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: NeoBrutalism.colors.white,
    padding: NeoBrutalism.spacing.xl,
  },
  logoContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: NeoBrutalism.spacing.lg,
  },
  subtitle: {
    textAlign: 'center',
    marginBottom: NeoBrutalism.spacing.xl,
    letterSpacing: 1,
    color: NeoBrutalism.colors.black,
  },
  loadingContainer: {
    alignItems: 'center',
    marginTop: NeoBrutalism.spacing.xl,
  },
  loadingText: {
    marginTop: NeoBrutalism.spacing.md,
    letterSpacing: 2,
  },
});
