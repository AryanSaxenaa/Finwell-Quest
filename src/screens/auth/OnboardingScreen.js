import React, { useState } from 'react';
import { View, StyleSheet, Dimensions, SafeAreaView } from 'react-native';
import { Text } from '@ui-kitten/components';
import { BrutalCard, BrutalButton, brutalTextStyle } from '../../components/BrutalComponents';
import { NeoBrutalism } from '../../styles/neoBrutalism';

const { width } = Dimensions.get('window');

const onboardingData = [
  {
    title: 'CRUSH YOUR EXPENSES',
    subtitle: 'DOMINATE YOUR SPENDING HABITS',
    description: 'TRACK EVERY DOLLAR AND OBLITERATE WASTEFUL SPENDING WITH BRUTAL PRECISION.',
  },
  {
    title: 'GAME YOUR WAY TO RICHES',
    subtitle: 'FINANCIAL EDUCATION THROUGH BATTLE',
    description: 'DEFEAT FINANCIAL IGNORANCE WITH OUR HARDCORE GAMING EXPERIENCE.',
  },
  {
    title: 'AI FINANCIAL WARFARE',
    subtitle: 'YOUR PERSONAL MONEY GENERAL',
    description: 'GET RUTHLESS AI-POWERED ADVICE THAT DESTROYS BAD FINANCIAL HABITS.',
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
    <SafeAreaView style={styles.container}>
      <View style={styles.content}>
        <BrutalCard style={styles.card}>
          <Text style={[brutalTextStyle.title, styles.title]}>
            {onboardingData[currentSlide].title}
          </Text>
          <Text style={[brutalTextStyle.subtitle, styles.subtitle]}>
            {onboardingData[currentSlide].subtitle}
          </Text>
          <Text style={[brutalTextStyle.body, styles.description]}>
            {onboardingData[currentSlide].description}
          </Text>
        </BrutalCard>
        
        <View style={styles.pagination}>
          {onboardingData.map((_, index) => (
            <View
              key={index}
              style={[
                styles.dot,
                { backgroundColor: index === currentSlide ? NeoBrutalism.colors.neonYellow : NeoBrutalism.colors.gray }
              ]}
            />
          ))}
        </View>

        <View style={styles.buttonContainer}>
          <BrutalButton 
            title="SKIP"
            variant="outline"
            onPress={skipOnboarding}
            style={styles.skipButton}
          />
          <BrutalButton 
            title={currentSlide === onboardingData.length - 1 ? 'UNLEASH THE POWER' : 'NEXT'}
            onPress={nextSlide}
            style={styles.nextButton}
          />
        </View>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: NeoBrutalism.colors.white,
  },
  content: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  card: {
    width: width - 40,
    padding: 30,
    marginBottom: 40,
    backgroundColor: NeoBrutalism.colors.lightGray,
    borderWidth: 4,
    borderColor: NeoBrutalism.colors.black,
  },
  title: {
    textAlign: 'center',
    marginBottom: 15,
    color: NeoBrutalism.colors.black,
    fontSize: 28,
    fontWeight: '900',
    textShadowColor: NeoBrutalism.colors.neonBlue,
    textShadowOffset: { width: 2, height: 2 },
    textShadowRadius: 0,
  },
  subtitle: {
    textAlign: 'center',
    marginBottom: 20,
    color: NeoBrutalism.colors.black,
    fontSize: 18,
    fontWeight: '700',
  },
  description: {
    textAlign: 'center',
    lineHeight: 24,
    color: NeoBrutalism.colors.black,
    fontSize: 16,
    fontWeight: '600',
  },
  pagination: {
    flexDirection: 'row',
    marginBottom: 40,
  },
  dot: {
    width: 12,
    height: 12,
    borderWidth: 2,
    borderColor: NeoBrutalism.colors.black,
    marginHorizontal: 6,
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
