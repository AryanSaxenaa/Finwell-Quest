import React, { useState } from 'react';
import { View, StyleSheet, Alert } from 'react-native';
import { 
  Layout, 
  Text, 
  Input, 
  Button,
  Divider 
} from '@ui-kitten/components';
import { Ionicons } from '@expo/vector-icons';
import { useAuthStore } from '../../store';

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
    
    // Simulate API call
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
    <Layout style={styles.container}>
      <View style={styles.content}>
        <Text category='h2' style={styles.title}>Welcome Back!</Text>
        <Text category='s1' style={styles.subtitle}>Sign in to continue your financial journey</Text>

        <Input
          style={styles.input}
          placeholder='Email'
          value={email}
          onChangeText={setEmail}
          keyboardType='email-address'
          autoCapitalize='none'
        />

        <Input
          style={styles.input}
          placeholder='Password'
          value={password}
          onChangeText={setPassword}
          secureTextEntry={secureTextEntry}
          accessoryRight={renderIcon}
          onTouchEnd={toggleSecureEntry}
        />

        <Button
          style={styles.loginButton}
          onPress={handleLogin}
          disabled={loading}
        >
          {loading ? 'Signing In...' : 'Sign In'}
        </Button>

        <Button
          style={styles.forgotButton}
          appearance='ghost'
          onPress={() => Alert.alert('Info', 'Forgot password functionality coming soon!')}
        >
          Forgot Password?
        </Button>

        <Divider style={styles.divider} />

        <Text style={styles.registerText}>
          Don't have an account?{' '}
          <Text 
            style={styles.registerLink}
            onPress={() => navigation.navigate('Register')}
          >
            Sign Up
          </Text>
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
    marginBottom: 16,
  },
  loginButton: {
    marginTop: 20,
    marginBottom: 10,
  },
  forgotButton: {
    marginBottom: 20,
  },
  divider: {
    marginVertical: 20,
  },
  registerText: {
    textAlign: 'center',
  },
  registerLink: {
    color: '#6C5CE7',
    fontWeight: 'bold',
  },
});
