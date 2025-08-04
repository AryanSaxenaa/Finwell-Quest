import React, { useState } from 'react';
import { View, StyleSheet, Alert } from 'react-native';
import { Layout, Card, Button, Text, Input } from '@ui-kitten/components';
import { Ionicons } from '@expo/vector-icons';
import { useExpenseStore } from '../store';

const BankIcon = (props) => <Ionicons name="business" size={24} color="#4CAF50" />;
const SyncIcon = (props) => <Ionicons name="sync" size={24} color="#2196F3" />;
const DisconnectIcon = (props) => <Ionicons name="unlink" size={24} color="#F44336" />;

export default function BankConnection() {
  const {
    isPlaidConnected,
    plaidAccounts,
    lastSyncDate,
    disconnectPlaid,
  } = useExpenseStore();

  const [isLoading, setIsLoading] = useState(false);

  // Simulate bank connection for testing
  const handleSimulateConnection = () => {
    setIsLoading(true);
    
    // Simulate connecting to a test bank with sample data
    setTimeout(() => {
      Alert.alert(
        'Demo Mode',
        'Bank connection simulation completed! In a real app, this would connect to your actual bank account.',
        [{ text: 'OK', style: 'default' }]
      );
      setIsLoading(false);
    }, 2000);
  };

  const handleDisconnect = () => {
    Alert.alert(
      'Disconnect Bank Account',
      'Are you sure you want to disconnect your bank account?',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Disconnect',
          style: 'destructive',
          onPress: () => {
            disconnectPlaid();
            Alert.alert('Disconnected', 'Your bank account has been disconnected.');
          },
        },
      ]
    );
  };

  return (
    <Layout style={styles.container}>
      <Card style={styles.card}>
        <View style={styles.header}>
          <Ionicons name="shield-checkmark" size={32} color="#4CAF50" />
          <Text category='h6' style={styles.title}>
            Bank Account Connection
          </Text>
        </View>

        <Text category='p2' style={styles.description}>
          Connect your bank account to automatically track expenses and get personalized insights.
          Your data is secured with bank-level encryption.
        </Text>

        {!isPlaidConnected ? (
          <View style={styles.connectSection}>
            <View style={styles.features}>
              <View style={styles.feature}>
                <Ionicons name="checkmark-circle" size={20} color="#4CAF50" />
                <Text category='c1' style={styles.featureText}>
                  Automatic expense categorization
                </Text>
              </View>
              <View style={styles.feature}>
                <Ionicons name="checkmark-circle" size={20} color="#4CAF50" />
                <Text category='c1' style={styles.featureText}>
                  Real-time spending insights
                </Text>
              </View>
              <View style={styles.feature}>
                <Ionicons name="checkmark-circle" size={20} color="#4CAF50" />
                <Text category='c1' style={styles.featureText}>
                  Personalized AI financial advice
                </Text>
              </View>
            </View>

            <Text category='c1' style={styles.demoNote}>
              🚧 Demo Mode: This simulates bank connection for testing
            </Text>

            <Button
              accessoryLeft={BankIcon}
              style={styles.connectButton}
              disabled={isLoading}
              onPress={handleSimulateConnection}
            >
              {isLoading ? 'Connecting...' : 'Connect Bank Account (Demo)'}
            </Button>
          </View>
        ) : (
          <View style={styles.connectedSection}>
            <View style={styles.accountInfo}>
              <Text category='s1' style={styles.accountTitle}>
                Connected Accounts ({plaidAccounts.length})
              </Text>
              {plaidAccounts.map((account, index) => (
                <View key={account.account_id || index} style={styles.accountItem}>
                  <Text category='p2'>{account.name || 'Demo Account'}</Text>
                  <Text category='c1' style={styles.accountType}>
                    {account.subtype || 'checking'} • {account.type || 'depository'}
                  </Text>
                </View>
              ))}
            </View>

            {lastSyncDate && (
              <Text category='c1' style={styles.lastSync}>
                Last synced: {new Date(lastSyncDate).toLocaleDateString()}
              </Text>
            )}

            <View style={styles.actions}>
              <Button
                accessoryLeft={DisconnectIcon}
                style={styles.disconnectButton}
                status='danger'
                appearance='outline'
                onPress={handleDisconnect}
              >
                Disconnect
              </Button>
            </View>
          </View>
        )}
      </Card>
    </Layout>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F8F9FA',
    padding: 16,
  },
  card: {
    marginBottom: 16,
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
  features: {
    marginBottom: 24,
    width: '100%',
  },
  feature: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  featureText: {
    marginLeft: 8,
    flex: 1,
  },
  demoNote: {
    textAlign: 'center',
    color: '#FF9500',
    marginBottom: 16,
    fontStyle: 'italic',
  },
  connectButton: {
    minWidth: 200,
  },
  connectedSection: {
    width: '100%',
  },
  accountInfo: {
    marginBottom: 16,
  },
  accountTitle: {
    marginBottom: 12,
    fontWeight: 'bold',
  },
  accountItem: {
    backgroundColor: '#F8F9FA',
    padding: 12,
    borderRadius: 8,
    marginBottom: 8,
  },
  accountType: {
    color: '#6C757D',
    marginTop: 2,
    textTransform: 'capitalize',
  },
  lastSync: {
    textAlign: 'center',
    color: '#6C757D',
    marginBottom: 16,
  },
  actions: {
    flexDirection: 'row',
    justifyContent: 'center',
  },
  disconnectButton: {
    borderColor: '#F44336',
    minWidth: 150,
  },
});
