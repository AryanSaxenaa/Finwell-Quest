import React, { useState, useEffect } from 'react';
import { View, StyleSheet, SafeAreaView } from 'react-native';
import { Text, Input } from '@ui-kitten/components';
import { BrutalCard, BrutalButton, brutalTextStyle } from '../../components/BrutalComponents';
import { NeoBrutalism } from '../../styles/neoBrutalism';

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
    <SafeAreaView style={styles.container}>
      <View style={styles.content}>
        <Text style={[brutalTextStyle.title, styles.title]}>VERIFY ACCOUNT</Text>
        <Text style={[brutalTextStyle.body, styles.subtitle]}>
          ENTER THE 6-DIGIT BATTLEFIELD CODE
        </Text>

        <BrutalCard style={styles.codeContainer}>
          <Input
            style={styles.input}
            placeholder='XXXXXX'
            value={code}
            onChangeText={setCode}
            keyboardType='numeric'
            maxLength={6}
            textAlign='center'
            size='large'
            textStyle={styles.codeInput}
          />

          <BrutalButton
            style={styles.verifyButton}
            onPress={handleVerify}
            disabled={code.length !== 6}
          >
            VERIFY CODE
          </BrutalButton>

          <BrutalButton
            style={styles.resendButton}
            variant="secondary"
            onPress={handleResend}
            disabled={!canResend}
          >
            {canResend ? 'RESEND CODE' : `RESEND IN ${timer}S`}
          </BrutalButton>
        </BrutalCard>

        <BrutalButton
          style={styles.backButton}
          variant="outline"
          onPress={() => navigation.navigate('Login')}
        >
          BACK TO LOGIN
        </BrutalButton>
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
    paddingHorizontal: 20,
    justifyContent: 'center',
  },
  title: {
    textAlign: 'center',
    marginBottom: 8,
    color: NeoBrutalism.colors.black,
    fontSize: 32,
    fontWeight: '900',
    textShadowColor: NeoBrutalism.colors.neonPink,
    textShadowOffset: { width: 3, height: 3 },
    textShadowRadius: 0,
  },
  subtitle: {
    textAlign: 'center',
    marginBottom: 40,
    color: NeoBrutalism.colors.black,
    fontSize: 16,
    fontWeight: '700',
  },
  codeContainer: {
    padding: 30,
    marginBottom: 30,
    backgroundColor: NeoBrutalism.colors.lightGray,
  },
  input: {
    marginBottom: 30,
    backgroundColor: NeoBrutalism.colors.white,
    borderWidth: 4,
    borderColor: NeoBrutalism.colors.black,
    borderRadius: 0,
  },
  codeInput: {
    fontSize: 28,
    fontWeight: '900',
    textAlign: 'center',
    letterSpacing: 8,
    color: NeoBrutalism.colors.black,
  },
  verifyButton: {
    marginBottom: 20,
  },
  resendButton: {
    marginBottom: 10,
  },
  backButton: {
    alignSelf: 'center',
    paddingHorizontal: 40,
  },
});
