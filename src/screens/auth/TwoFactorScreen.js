import React, { useState, useEffect } from 'react';
import { View, StyleSheet } from 'react-native';
import { Layout, Text, Input, Button } from '@ui-kitten/components';

export default function TwoFactorScreen({ navigation }) {
  const [code, setCode] = useState('');
  const [timer, setTimer] = useState(60);
  const [canResend, setCanResend] = useState(false);

  useEffect(() => {
    const interval = setInterval(() => {
      setTimer((prev) => {
        if (prev <= 1) {
          setCanResend(true);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(interval);
  }, []);

  const handleVerify = () => {
    if (code.length === 6) {
      // Simulate verification
      navigation.navigate('Main');
    }
  };

  const handleResend = () => {
    setTimer(60);
    setCanResend(false);
    // Implement resend logic
  };

  return (
    <Layout style={styles.container}>
      <View style={styles.content}>
        <Text category='h3' style={styles.title}>Verify Your Account</Text>
        <Text category='s1' style={styles.subtitle}>
          Enter the 6-digit code sent to your email
        </Text>

        <Input
          style={styles.input}
          placeholder='6-digit code'
          value={code}
          onChangeText={setCode}
          keyboardType='numeric'
          maxLength={6}
          textAlign='center'
          size='large'
        />

        <Button
          style={styles.verifyButton}
          onPress={handleVerify}
          disabled={code.length !== 6}
        >
          Verify Code
        </Button>

        <Button
          style={styles.resendButton}
          appearance='ghost'
          onPress={handleResend}
          disabled={!canResend}
        >
          {canResend ? 'Resend Code' : `Resend in ${timer}s`}
        </Button>

        <Text 
          style={styles.backToLogin}
          onPress={() => navigation.navigate('Login')}
        >
          Back to Login
        </Text>
      </View>
    </Layout>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F8F9FA',
  },
  content: {
    flex: 1,
    paddingHorizontal: 30,
    justifyContent: 'center',
  },
  title: {
    textAlign: 'center',
    marginBottom: 8,
    fontWeight: 'bold',
  },
  subtitle: {
    textAlign: 'center',
    marginBottom: 40,
    opacity: 0.7,
  },
  input: {
    marginBottom: 30,
    fontSize: 24,
  },
  verifyButton: {
    marginBottom: 20,
  },
  resendButton: {
    marginBottom: 30,
  },
  backToLogin: {
    textAlign: 'center',
    color: '#6C5CE7',
    textDecorationLine: 'underline',
  },
});
