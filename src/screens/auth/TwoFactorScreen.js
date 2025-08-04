import React, { useState, useEffect } from 'react';

import { View, StyleSheet } from 'react-native';
import { Text, Input, Button } from '@ui-kitten/components';
import { BrutalCard, BrutalButton, brutalTextStyle } from '../../components/BrutalComponents';
import { NeoBrutalism } from '../../styles/neoBrutalism';
import { sendOTP, verifyOTP } from '../../services/twoFactorService';

export default function TwoFactorScreen({ navigation, route }) {
  // Accept email and onVerified callback from navigation params
  const passedEmail = route?.params?.email || '';
  const onVerified = route?.params?.onVerified;
  const [email, setEmail] = useState(passedEmail);
  const [otp, setOTP] = useState('');
  const [step, setStep] = useState(passedEmail ? 'otp' : 'email');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const handleSendOTP = async () => {
    setLoading(true);
    setError('');
    setSuccess('');
    try {
      await sendOTP(email);
      setStep('otp');
      setSuccess('OTP sent to your email!');
    } catch (e) {
      setError(e.toString());
    } finally {
      setLoading(false);
    }
  };

  // Auto-send OTP if email is passed
  useEffect(() => {
    if (passedEmail) {
      handleSendOTP();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [passedEmail]);

  const handleVerifyOTP = async () => {
    setLoading(true);
    setError('');
    setSuccess('');
    try {
      await verifyOTP(email, otp);
      setSuccess('OTP verified! 2FA complete.');
      if (onVerified) {
        onVerified();
      }
      navigation.navigate('Main');
    } catch (e) {
      setError(e.toString());
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      <Text category='h5' style={styles.title}>Two-Factor Authentication</Text>
      {step === 'email' && (
        <>
          <Input
            label="Email"
            placeholder="Enter your email"
            value={email}
            onChangeText={setEmail}
            style={styles.input}
            keyboardType="email-address"
            autoCapitalize="none"
          />
          <Button onPress={handleSendOTP} disabled={loading || !email} style={styles.button}>
            Send OTP
          </Button>
        </>
      )}
      {step === 'otp' && (
        <>
          <Input
            label="OTP"
            placeholder="Enter the OTP sent to your email"
            value={otp}
            onChangeText={setOTP}
            style={styles.input}
            keyboardType="numeric"
            autoCapitalize="none"
          />
          <Button onPress={handleVerifyOTP} disabled={loading || !otp} style={styles.button}>
            Verify OTP
          </Button>
        </>
      )}
      {!!error && <Text status='danger' style={styles.error}>{error}</Text>}
      {!!success && <Text status='success' style={styles.success}>{success}</Text>}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    padding: 24,
    backgroundColor: '#fff',
  },
  title: {
    marginBottom: 24,
    textAlign: 'center',
  },
  input: {
    marginBottom: 16,
  },
  button: {
    marginBottom: 16,
  },
  error: {
    marginTop: 8,
    textAlign: 'center',
  },
  success: {
    marginTop: 8,
    textAlign: 'center',
  },
});
