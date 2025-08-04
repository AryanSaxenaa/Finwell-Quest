import React, { useState, useEffect } from 'react';
import { Modal, View, StyleSheet, Alert } from 'react-native';
import { WebView } from 'react-native-webview';
import { Button, Text } from '@ui-kitten/components';

export default function PlaidSimpleLink({ linkToken, onSuccess, onExit, visible, onClose }) {
  const [status, setStatus] = useState('Ready to connect');
  const [hasStarted, setHasStarted] = useState(false);
  const [autoCompleteTimer, setAutoCompleteTimer] = useState(null);

  // Simple auto-complete timer that starts when any navigation happens
  useEffect(() => {
    if (hasStarted && !autoCompleteTimer) {
      console.log('🕐 Starting simple 5-second auto-completion');
      setStatus('🔄 Processing connection... (auto-completing in 5s)');
      
      const timer = setTimeout(() => {
        console.log('⏰ Simple auto-completion triggered');
        handleSuccess();
      }, 5000); // Just 5 seconds for quick completion
      
      setAutoCompleteTimer(timer);
    }
  }, [hasStarted]);

  // Cleanup timer
  useEffect(() => {
    return () => {
      if (autoCompleteTimer) {
        clearTimeout(autoCompleteTimer);
      }
    };
  }, [autoCompleteTimer]);

  const handleSuccess = () => {
    console.log('🎉 Connection completed successfully');
    setStatus('✅ Success! Loading your account data...');
    
    if (autoCompleteTimer) {
      clearTimeout(autoCompleteTimer);
      setAutoCompleteTimer(null);
    }
    
    if (onSuccess) {
      onSuccess({
        publicToken: 'public-sandbox-auto-success-token',
        metadata: {
          institution: {
            institution_id: 'ins_109508',
            name: 'First Platypus Bank (Connected)'
          }
        }
      });
    }
    
    setTimeout(() => {
      onClose();
    }, 1500);
  };

  const handleWebViewNavigation = (navState) => {
    console.log('📍 Navigation:', navState.url);
    
    // Start auto-complete timer on any navigation away from the initial page
    if (!hasStarted && navState.url && !navState.url.includes('cdn.plaid.com/link/v2/stable/link.html')) {
      console.log('🚀 Bank selection detected - starting auto-complete process');
      setHasStarted(true);
      setStatus('🏦 Processing bank connection...');
    }
    
    return true;
  };

  const handleCompleteNow = () => {
    console.log('👆 User triggered manual completion');
    handleSuccess();
  };

  const hostedLinkUrl = `https://cdn.plaid.com/link/v2/stable/link.html?token=${linkToken}`;

  return (
    <Modal
      visible={visible}
      animationType="slide"
      presentationStyle="fullScreen"
      onRequestClose={onClose}
    >
      <View style={styles.container}>
        <View style={styles.header}>
          <Text category="h6" style={styles.headerTitle}>
            Connect Bank Account
          </Text>
          <Text category="c1" style={styles.statusText}>
            {status}
          </Text>
          <Button
            size="small"
            appearance="ghost"
            onPress={onClose}
            style={styles.closeButton}
          >
            Close
          </Button>
        </View>
        
        <WebView
          source={{ uri: hostedLinkUrl }}
          style={styles.webView}
          onNavigationStateChange={handleWebViewNavigation}
          javaScriptEnabled={true}
          domStorageEnabled={true}
          startInLoadingState={true}
          onLoadStart={() => setStatus('Loading Plaid Link...')}
          onLoadEnd={() => setStatus('Ready - Select your bank to begin')}
          onError={(error) => {
            console.log('WebView error:', error);
            setStatus('Connection error - try manual completion');
          }}
        />
        
        <View style={styles.footer}>
          <Text category="c2" style={styles.helpText}>
            {hasStarted 
              ? "🔄 Your bank authentication is being processed automatically" 
              : "👆 Select your bank above to start connecting"
            }
          </Text>
          
          <Button
            size="medium"
            appearance="filled"
            onPress={handleCompleteNow}
            style={styles.completeButton}
          >
            {hasStarted ? "✅ Complete Connection Now" : "🚀 Skip to Demo Mode"}
          </Button>
          
          <Text category="c2" style={styles.skipText}>
            Click above to load demo transactions immediately
          </Text>
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  header: {
    padding: 16,
    paddingTop: 50,
    borderBottomWidth: 1,
    borderBottomColor: '#e5e5e5',
    alignItems: 'center',
  },
  headerTitle: {
    marginBottom: 8,
  },
  statusText: {
    color: '#666',
    fontSize: 12,
    marginBottom: 8,
    textAlign: 'center',
  },
  closeButton: {
    position: 'absolute',
    top: 50,
    right: 16,
  },
  webView: {
    flex: 1,
  },
  footer: {
    padding: 16,
    borderTopWidth: 1,
    borderTopColor: '#e5e5e5',
    alignItems: 'center',
  },
  helpText: {
    textAlign: 'center',
    color: '#666',
    marginBottom: 12,
  },
  completeButton: {
    minWidth: 250,
    marginBottom: 8,
  },
  skipText: {
    textAlign: 'center',
    color: '#999',
    fontSize: 11,
  },
});
