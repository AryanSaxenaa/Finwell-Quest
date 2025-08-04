import React, { useState } from 'react';
import { View, StyleSheet, Alert, TouchableOpacity } from 'react-native';
import { 
  Layout, 
  Text, 
  Input
} from '@ui-kitten/components';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { useAuthStore } from '../../store';
import { 
  BrutalCard, 
  BrutalButton, 
  brutalTextStyle 
} from '../../components/BrutalComponents';
import { NeoBrutalism } from '../../styles/neoBrutalism';

const EyeIcon = (props) => <Ionicons name="eye-outline" size={24} color="#8F9BB3" />;
const EyeOffIcon = (props) => <Ionicons name="eye-off-outline" size={24} color="#8F9BB3" />;

export default function LoginScreen({ navigation }) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [secureTextEntry, setSecureTextEntry] = useState(true);
  const [loading, setLoading] = useState(false);
  
  const login = useAuthStore((state) => state.login);

  const toggleSecureEntry = () => {
    setSecureTextEntry(!secureTextEntry);
  };

  const handleLogin = async () => {
    if (!email || !password) {
      Alert.alert('Error', 'Please fill in all fields');
      return;
    }

    setLoading(true);
    // Simulate credential check (replace with real API call in production)
    setTimeout(() => {
      login({ email, name: 'User' });
      setLoading(false);
      navigation.navigate('Main');
    }, 1000);
  };

  const renderIcon = (props) => (
    <Ionicons name={secureTextEntry ? 'eye-off-outline' : 'eye-outline'} size={24} color="#8F9BB3" />
  );

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.content}>
        <Text style={[brutalTextStyle.title, styles.title]}>WELCOME BACK!</Text>
        <Text style={[brutalTextStyle.body, styles.subtitle]}>LOG IN TO DOMINATE YOUR FINANCES</Text>

        <BrutalCard style={styles.formContainer}>
          <Input
            style={styles.input}
            placeholder='EMAIL ADDRESS'
            value={email}
            onChangeText={setEmail}
            keyboardType='email-address'
            autoCapitalize='none'
            textStyle={styles.inputText}
          />

          <Input
            style={styles.input}
            placeholder='PASSWORD'
            value={password}
            onChangeText={setPassword}
            secureTextEntry={secureTextEntry}
            accessoryRight={renderIcon}
            onTouchEnd={toggleSecureEntry}
            textStyle={styles.inputText}
          />

          <BrutalButton
            style={styles.loginButton}
            onPress={handleLogin}
            disabled={loading}
          >
            {loading ? 'LOGGING IN...' : 'LOG IN'}
          </BrutalButton>

          <BrutalButton
            style={styles.forgotButton}
            variant="secondary"
            onPress={() => Alert.alert('INFO', 'Forgot password functionality coming soon!')}
          >
            FORGOT PASSWORD?
          </BrutalButton>
        </BrutalCard>

        <View style={styles.divider} />

        <View style={styles.registerContainer}>
          <Text style={[brutalTextStyle.body, styles.registerText]}>
            DON'T HAVE AN ACCOUNT?
          </Text>
          <BrutalButton
            style={styles.registerButton}
            variant="outline"
            onPress={() => navigation.navigate('Register')}
          >
            SIGN UP
          </BrutalButton>
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
    paddingHorizontal: 20,
    justifyContent: 'center',
    paddingTop: 60,
    paddingBottom: 40,
  },
  title: {
    textAlign: 'center',
    marginBottom: 8,
    color: NeoBrutalism.colors.black,
    fontSize: 32,
    fontWeight: '900',
    textShadowColor: NeoBrutalism.colors.neonYellow,
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
  formContainer: {
    padding: 24,
    marginBottom: 30,
    backgroundColor: NeoBrutalism.colors.lightGray,
  },
  input: {
    marginBottom: 20,
    backgroundColor: NeoBrutalism.colors.white,
    borderWidth: 3,
    borderColor: NeoBrutalism.colors.black,
    borderRadius: 0,
  },
  inputText: {
    color: NeoBrutalism.colors.black,
    fontSize: 16,
    fontWeight: '600',
  },
  loginButton: {
    marginTop: 10,
    marginBottom: 15,
  },
  forgotButton: {
    marginBottom: 10,
  },
  divider: {
    height: 3,
    backgroundColor: NeoBrutalism.colors.neonPink,
    marginVertical: 30,
    borderRadius: 0,
  },
  registerContainer: {
    alignItems: 'center',
  },
  registerText: {
    textAlign: 'center',
    color: NeoBrutalism.colors.black,
    marginBottom: 15,
    fontSize: 16,
    fontWeight: '700',
  },
  registerButton: {
    paddingHorizontal: 30,
  },
});
