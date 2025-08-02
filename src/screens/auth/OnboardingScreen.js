import React, { useState } from 'react';
import { View, StyleSheet, Dimensions } from 'react-native';
import { Layout, Text, Button, Card } from '@ui-kitten/components';
import { LinearGradient } from 'expo-linear-gradient';

const { width } = Dimensions.get('window');

const onboardingData = [
  {
    title: 'Track Your Expenses',
    subtitle: 'Monitor your spending habits with ease',
    description: 'Get insights into where your money goes and make informed financial decisions.',
  },
  {
    title: 'Learn Through Gaming',
    subtitle: 'Financial education made fun',
    description: 'Play engaging games while learning essential financial literacy skills.',
  },
  {
    title: 'AI-Powered Advice',
    subtitle: 'Personal financial assistant',
    description: 'Get personalized financial advice from our AI coach tailored to your spending patterns.',
  },
];

export default function OnboardingScreen({ navigation }) {
  const [currentSlide, setCurrentSlide] = useState(0);

  const nextSlide = () => {
    if (currentSlide < onboardingData.length - 1) {
      setCurrentSlide(currentSlide + 1);
    } else {
      navigation.navigate('Login');
    }
  };

  const skipOnboarding = () => {
    navigation.navigate('Login');
  };

  return (
    <LinearGradient
      colors={['#6C5CE7', '#A29BFE']}
      style={styles.container}
    >
      <Layout style={styles.content}>
        <Card style={styles.card}>
          <Text category='h4' style={styles.title}>
            {onboardingData[currentSlide].title}
          </Text>
          <Text category='s1' style={styles.subtitle}>
            {onboardingData[currentSlide].subtitle}
          </Text>
          <Text category='p1' style={styles.description}>
            {onboardingData[currentSlide].description}
          </Text>
        </Card>
        
        <View style={styles.pagination}>
          {onboardingData.map((_, index) => (
            <View
              key={index}
              style={[
                styles.dot,
                { backgroundColor: index === currentSlide ? '#6C5CE7' : '#DDD' }
              ]}
            />
          ))}
        </View>

        <View style={styles.buttonContainer}>
          <Button 
            appearance='ghost' 
            onPress={skipOnboarding}
            style={styles.skipButton}
          >
            Skip
          </Button>
          <Button 
            onPress={nextSlide}
            style={styles.nextButton}
          >
            {currentSlide === onboardingData.length - 1 ? 'Get Started' : 'Next'}
          </Button>
        </View>
      </Layout>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  content: {
    flex: 1,
    backgroundColor: 'transparent',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  card: {
    width: width - 40,
    padding: 30,
    marginBottom: 40,
    borderRadius: 15,
  },
  title: {
    textAlign: 'center',
    marginBottom: 10,
    fontWeight: 'bold',
  },
  subtitle: {
    textAlign: 'center',
    marginBottom: 15,
    color: '#6C5CE7',
  },
  description: {
    textAlign: 'center',
    lineHeight: 22,
  },
  pagination: {
    flexDirection: 'row',
    marginBottom: 40,
  },
  dot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    marginHorizontal: 4,
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: width - 40,
  },
  skipButton: {
    flex: 1,
    marginRight: 10,
  },
  nextButton: {
    flex: 1,
    marginLeft: 10,
  },
});
