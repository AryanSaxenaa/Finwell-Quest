
import React, { useState, useEffect } from 'react';
import { View, StyleSheet, Alert, Platform, TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Layout, Text, Spinner } from '@ui-kitten/components';
import { create, open, dismissLink } from 'react-native-plaid-link-sdk';
import { Ionicons } from '@expo/vector-icons';
import { useExpenseStore } from '../store';
import PlaidService from '../services/plaidService';
import PlaidSimpleLink from './PlaidSimpleLink';
import { BrutalCard, BrutalHeader, BrutalButton, brutalTextStyle } from './BrutalComponents';
import { NeoBrutalism } from '../styles/neoBrutalism';

export default function BankConnection() {
  const { isPlaidConnected, connectPlaidAccount } = useExpenseStore();
  const [linkToken, setLinkToken] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [showWebLink, setShowWebLink] = useState(false);
  const [useNativeSDK, setUseNativeSDK] = useState(Platform.OS !== 'web');

  useEffect(() => {
    createLinkToken();
  }, []);

  const createLinkToken = async () => {
    try {
      setIsLoading(true);
      console.log('Creating link token...');
      
      const response = await PlaidService.createLinkToken('user_123');
      console.log('Link token response:', response);
      
      const token = response.link_token;
      setLinkToken(token);
      
      if (token) {
        console.log('Token received, storing for later use');
        // Don't call create here - we'll do it in openPlaidLink
      }
    } catch (error) {
      console.error('Link token creation failed:', error);
      Alert.alert('Error', 'Failed to initialize bank connection: ' + error.message);
    } finally {
      setIsLoading(false);
    }
  };

  const handleOnSuccess = async (success) => {
    console.log('🎉 handleOnSuccess called with:', success);
    setIsLoading(true);
    try {
      console.log('Calling connectPlaidAccount with publicToken:', success.publicToken);
      const result = await connectPlaidAccount(success.publicToken);
      console.log('connectPlaidAccount result:', result);
      
      if (result.success) {
        Alert.alert(
          '🎉 Success!', 
          'Bank account connected successfully!\n\nYour real transaction data has been loaded.',
          [{ text: 'Great!', style: 'default' }]
        );
      } else {
        Alert.alert('Connection Failed', result.error);
      }
    } catch (error) {
      console.error('Error in handleOnSuccess:', error);
      Alert.alert('Error', 'Failed to connect your bank account');
    } finally {
      setIsLoading(false);
    }
  };

  const handleOnExit = (exit) => {
    console.log('Plaid Link exit:', exit);
    dismissLink();
  };

  const openPlaidLink = async () => {
    console.log('=== openPlaidLink DEBUG START ===');
    console.log('openPlaidLink called, linkToken:', linkToken);
    console.log('Platform:', Platform.OS);
    console.log('useNativeSDK:', useNativeSDK);
    
    if (!linkToken) {
      Alert.alert('Error', 'Link token not ready. Please try again.');
      return;
    }

    // For Expo Go, we must use WebView since native modules don't work
    if (__DEV__ && Platform.OS !== 'web') {
      console.log('Development mode detected - checking if running in Expo Go');
      // In Expo Go, native modules don't work, so use WebView fallback
      console.log('Using WebView implementation for Expo Go compatibility');
      setShowWebLink(true);
      return;
    }

    // If we should use WebView or this is web platform
    if (!useNativeSDK || Platform.OS === 'web') {
      console.log('Using WebView implementation');
      setShowWebLink(true);
      return;
    }

    try {
      setIsLoading(true);
      console.log('Step 1: Trying native SDK - Calling create() with token...');
      
      // Step 1: Create the link with the token
      const createResult = await create({
        token: linkToken,
        noLoadingState: false,
      });
      
      console.log('Step 2: create() completed with result:', createResult);
      console.log('Step 3: calling open()...');
      
      // Step 2: Immediately open the link
      const openResult = await open({
        onSuccess: handleOnSuccess,
        onExit: handleOnExit,
      });
      
      console.log('Step 4: open() completed with result:', openResult);
      console.log('=== openPlaidLink DEBUG END ===');
      
      // Add a timeout to check if the UI actually appeared
      setTimeout(() => {
        console.log('Checking if native Plaid UI appeared...');
        // If we get here and no UI appeared, we'll assume it failed
        Alert.alert(
          'Connection Method',
          'The native Plaid interface may not have appeared. Would you like to try the web version?',
          [
            { text: 'Cancel', style: 'cancel' },
            { 
              text: 'Try Web Version', 
              onPress: () => {
                setUseNativeSDK(false);
                setShowWebLink(true);
              }
            }
          ]
        );
      }, 3000);
      
    } catch (error) {
      console.error('Native SDK failed:', error);
      console.log('Falling back to WebView implementation');
      
      Alert.alert(
        'Native SDK Unavailable',
        'The native Plaid SDK is not available. Using web version instead.',
        [
          { text: 'Cancel', style: 'cancel' },
          { 
            text: 'Continue with Web', 
            onPress: () => {
              setUseNativeSDK(false);
              setShowWebLink(true);
            }
          }
        ]
      );
    } finally {
      setIsLoading(false);
    }
  };

  if (isLoading && !linkToken) {
    return (
      <SafeAreaView style={styles.safeArea} edges={["top"]}>
        <Layout style={styles.container}>
          <BrutalHeader
            title="BANK CONNECTION"
            textColor="white"
            leftAction={
              <TouchableOpacity onPress={() => { if (typeof navigation !== 'undefined') navigation.goBack && navigation.goBack(); }}>
                <Ionicons name="arrow-back" size={24} color={NeoBrutalism.colors.white} />
              </TouchableOpacity>
            }
          />
          <View style={styles.loadingContainer}>
            <Spinner size='large' />
            <Text style={[brutalTextStyle('body', 'medium', 'black'), styles.loadingText]}>
              Setting up bank connection...
            </Text>
          </View>
        </Layout>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.safeArea} edges={["top"]}>
      <Layout style={styles.container}>
        <BrutalHeader
          title="BANK CONNECTION"
          textColor="white"
          leftAction={
            <TouchableOpacity onPress={() => { if (typeof navigation !== 'undefined') navigation.goBack && navigation.goBack(); }}>
              <Ionicons name="arrow-back" size={24} color={NeoBrutalism.colors.white} />
            </TouchableOpacity>
          }
        />
        <BrutalCard style={styles.card}>
          <View style={styles.header}>
            {!isPlaidConnected ? (
              <View style={styles.connectSection}>
                {linkToken && (
                  <View>
                    <BrutalButton
                      style={styles.connectButton}
                      disabled={isLoading}
                      onPress={openPlaidLink}
                      title={isLoading ? 'Connecting...' : 'Connect Bank Account'}
                    />
                    <BrutalButton
                      style={[styles.connectButton, { marginTop: 10 }]}
                      variant="secondary"
                      onPress={() => {
                        setUseNativeSDK(false);
                        setShowWebLink(true);
                      }}
                      disabled={isLoading}
                      title="Use Hosted Link (Recommended)"
                    />
                  </View>
                )}
                {!linkToken && !isLoading && (
                  <Text style={{ color: NeoBrutalism.colors.hotPink, textAlign: 'center' }}>
                    Failed to initialize. Check console for errors.
                  </Text>
                )}
              </View>
            ) : (
              <View style={styles.connectedSection}>
                <Text style={[brutalTextStyle('body', 'bold', 'neonGreen'), styles.successText]}>
                  ✅ Bank account connected successfully!
                </Text>
              </View>
            )}
          </View>
        </BrutalCard>
        <PlaidSimpleLink
          linkToken={linkToken}
          visible={showWebLink}
          onSuccess={handleOnSuccess}
          onExit={handleOnExit}
          onClose={() => setShowWebLink(false)}
        />
      </Layout>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: NeoBrutalism.colors.white,
  },
  container: {
    flex: 1,
    backgroundColor: NeoBrutalism.colors.white,
    padding: 16,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    marginTop: 16,
    textAlign: 'center',
  },
  card: {
    marginBottom: 16,
    borderWidth: 3,
    borderColor: NeoBrutalism.colors.black,
    backgroundColor: NeoBrutalism.colors.lightGray,
    padding: 16,
  },
  header: {
    alignItems: 'center',
    marginBottom: 16,
  },
  title: {
    marginTop: 8,
    textAlign: 'center',
    fontWeight: 'bold',
  },
  description: {
    textAlign: 'center',
    marginBottom: 20,
    color: '#6C757D',
    lineHeight: 20,
  },
  connectSection: {
    alignItems: 'center',
  },
  connectButton: {
    minWidth: 200,
    marginBottom: 0,
  },
  connectedSection: {
    alignItems: 'center',
  },
  successText: {
    color: NeoBrutalism.colors.neonGreen,
    textAlign: 'center',
  },
});
