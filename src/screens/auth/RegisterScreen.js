import React, { useState } from 'react';
import { View, StyleSheet, Alert, SafeAreaView } from 'react-native';
import { 
  Text, 
  Input, 
  CheckBox
} from '@ui-kitten/components';
import { Ionicons } from '@expo/vector-icons';
import { useAuthStore } from '../../store';
import { BrutalCard, BrutalButton, brutalTextStyle } from '../../components/BrutalComponents';
import { NeoBrutalism } from '../../styles/neoBrutalism';

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
    // Simulate registration (replace with real API call in production)
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
    <SafeAreaView style={styles.container}>
      <View style={styles.content}>
        <Text style={[brutalTextStyle.title, styles.title]}>CREATE ACCOUNT</Text>
        <Text style={[brutalTextStyle.body, styles.subtitle]}>JOIN THE FINANCIAL REVOLUTION</Text>

        <BrutalCard style={styles.formContainer}>
          <Input
            style={styles.input}
            placeholder='FULL NAME'
            value={formData.name}
            onChangeText={(value) => updateField('name', value)}
            textStyle={styles.inputText}
          />

          <Input
            style={styles.input}
            placeholder='EMAIL ADDRESS'
            value={formData.email}
            onChangeText={(value) => updateField('email', value)}
            keyboardType='email-address'
            autoCapitalize='none'
            textStyle={styles.inputText}
          />

          <Input
            style={styles.input}
            placeholder='USERNAME'
            value={formData.username}
            onChangeText={(value) => updateField('username', value)}
            autoCapitalize='none'
            textStyle={styles.inputText}
          />

          <Input
            style={styles.input}
            placeholder='PASSWORD'
            value={formData.password}
            onChangeText={(value) => updateField('password', value)}
            secureTextEntry={secureTextEntry}
            accessoryRight={renderPasswordIcon}
            onTouchEnd={() => setSecureTextEntry(!secureTextEntry)}
            textStyle={styles.inputText}
          />

          <Input
            style={styles.input}
            placeholder='CONFIRM PASSWORD'
            value={formData.confirmPassword}
            onChangeText={(value) => updateField('confirmPassword', value)}
            secureTextEntry={secureTextEntry}
            textStyle={styles.inputText}
          />

          <CheckBox
            style={styles.checkbox}
            checked={agreedToTerms}
            onChange={setAgreedToTerms}
            textStyle={[brutalTextStyle.body, { color: NeoBrutalism.colors.black }]}
          >
            I AGREE TO TERMS & CONDITIONS
          </CheckBox>

          <BrutalButton
            style={styles.registerButton}
            onPress={handleRegister}
            disabled={loading}
          >
            {loading ? 'CREATING ACCOUNT...' : 'CREATE ACCOUNT'}
          </BrutalButton>
        </BrutalCard>

        <View style={styles.loginContainer}>
          <Text style={[brutalTextStyle.body, styles.loginText]}>
            ALREADY HAVE AN ACCOUNT?
          </Text>
          <BrutalButton
            style={styles.loginButton}
            variant="outline"
            onPress={() => navigation.navigate('Login')}
          >
            SIGN IN
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
    paddingTop: 40,
    paddingBottom: 40,
  },
  title: {
    textAlign: 'center',
    marginBottom: 8,
    color: NeoBrutalism.colors.black,
    fontSize: 32,
    fontWeight: '900',
    textShadowColor: NeoBrutalism.colors.neonGreen,
    textShadowOffset: { width: 3, height: 3 },
    textShadowRadius: 0,
  },
  subtitle: {
    textAlign: 'center',
    marginBottom: 30,
    color: NeoBrutalism.colors.black,
    fontSize: 16,
    fontWeight: '700',
  },
  formContainer: {
    padding: 24,
    marginBottom: 20,
    backgroundColor: NeoBrutalism.colors.lightGray,
  },
  input: {
    marginBottom: 18,
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
  checkbox: {
    marginVertical: 20,
    backgroundColor: NeoBrutalism.colors.white,
    borderWidth: 3,
    borderColor: NeoBrutalism.colors.black,
    borderRadius: 0,
    paddingVertical: 12,
    paddingHorizontal: 16,
  },
  registerButton: {
    marginTop: 10,
  },
  loginContainer: {
    alignItems: 'center',
  },
  loginText: {
    textAlign: 'center',
    color: NeoBrutalism.colors.black,
    marginBottom: 15,
    fontSize: 16,
    fontWeight: '700',
  },
  loginButton: {
    paddingHorizontal: 30,
  },
});
