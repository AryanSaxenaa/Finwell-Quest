import React, { useState } from 'react';
import { View, StyleSheet, Alert } from 'react-native';
import { 
  Layout, 
  Text, 
  Input, 
  Button, 
  CheckBox
} from '@ui-kitten/components';
import { Ionicons } from '@expo/vector-icons';
import { useAuthStore } from '../../store';

export default function RegisterScreen({ navigation }) {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    username: '',
    password: '',
    confirmPassword: '',
  });
  const [agreedToTerms, setAgreedToTerms] = useState(false);
  const [secureTextEntry, setSecureTextEntry] = useState(true);
  const [loading, setLoading] = useState(false);
  
  const login = useAuthStore((state) => state.login);

  const updateField = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleRegister = async () => {
    const { name, email, username, password, confirmPassword } = formData;
    
    if (!name || !email || !username || !password || !confirmPassword) {
      Alert.alert('Error', 'Please fill in all fields');
      return;
    }

    if (password !== confirmPassword) {
      Alert.alert('Error', 'Passwords do not match');
      return;
    }

    if (!agreedToTerms) {
      Alert.alert('Error', 'Please agree to the terms and conditions');
      return;
    }

    setLoading(true);
    
    // Simulate API call
    setTimeout(() => {
      login({ email, name, username });
      setLoading(false);
      navigation.navigate('Main');
    }, 1000);
  };

  const renderPasswordIcon = (props) => (
    <Ionicons name={secureTextEntry ? 'eye-off-outline' : 'eye-outline'} size={24} color="#8F9BB3" />
  );

  return (
    <Layout style={styles.container}>
      <View style={styles.content}>
        <Text category='h2' style={styles.title}>Create Account</Text>
        <Text category='s1' style={styles.subtitle}>Join thousands learning financial literacy</Text>

        <Input
          style={styles.input}
          placeholder='Full Name'
          value={formData.name}
          onChangeText={(value) => updateField('name', value)}
        />

        <Input
          style={styles.input}
          placeholder='Email'
          value={formData.email}
          onChangeText={(value) => updateField('email', value)}
          keyboardType='email-address'
          autoCapitalize='none'
        />

        <Input
          style={styles.input}
          placeholder='Username'
          value={formData.username}
          onChangeText={(value) => updateField('username', value)}
          autoCapitalize='none'
        />

        <Input
          style={styles.input}
          placeholder='Password'
          value={formData.password}
          onChangeText={(value) => updateField('password', value)}
          secureTextEntry={secureTextEntry}
          accessoryRight={renderPasswordIcon}
          onTouchEnd={() => setSecureTextEntry(!secureTextEntry)}
        />

        <Input
          style={styles.input}
          placeholder='Confirm Password'
          value={formData.confirmPassword}
          onChangeText={(value) => updateField('confirmPassword', value)}
          secureTextEntry={secureTextEntry}
        />

        <CheckBox
          style={styles.checkbox}
          checked={agreedToTerms}
          onChange={setAgreedToTerms}
        >
          I agree to the Terms & Conditions
        </CheckBox>

        <Button
          style={styles.registerButton}
          onPress={handleRegister}
          disabled={loading}
        >
          {loading ? 'Creating Account...' : 'Create Account'}
        </Button>

        <Text style={styles.loginText}>
          Already have an account?{' '}
          <Text 
            style={styles.loginLink}
            onPress={() => navigation.navigate('Login')}
          >
            Sign In
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
    marginBottom: 30,
    opacity: 0.7,
  },
  input: {
    marginBottom: 16,
  },
  checkbox: {
    marginVertical: 20,
  },
  registerButton: {
    marginBottom: 20,
  },
  loginText: {
    textAlign: 'center',
  },
  loginLink: {
    color: '#6C5CE7',
    fontWeight: 'bold',
  },
});
