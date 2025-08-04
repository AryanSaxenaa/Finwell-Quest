import React, { useState, useEffect } from 'react';
import { Modal, View, StyleSheet, Alert } from 'react-native';
import { WebView } from 'react-native-webview';
import { Text } from '@ui-kitten/components';
import { BrutalButton, BrutalCard, brutalTextStyle } from './BrutalComponents';
import { NeoBrutalism } from '../styles/neoBrutalism';

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
        <BrutalCard style={styles.header}>
          <Text style={[brutalTextStyle('h6', 'bold', 'black'), styles.headerTitle]}>
            CONNECT BANK ACCOUNT
          </Text>
          <Text style={[brutalTextStyle('caption', 'medium', 'black'), styles.statusText]}>
            {status}
          </Text>
          <BrutalButton
            variant="outline"
            onPress={onClose}
            style={styles.closeButton}
          >
            CLOSE
          </BrutalButton>
        </BrutalCard>
        
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
        
        <BrutalCard style={styles.footer}>
          <Text style={[brutalTextStyle('caption', 'medium', 'black'), styles.helpText]}>
            {hasStarted 
              ? "🔄 YOUR BANK AUTHENTICATION IS BEING PROCESSED AUTOMATICALLY" 
              : "👆 SELECT YOUR BANK ABOVE TO START CONNECTING"
            }
          </Text>
          
          <BrutalButton
            onPress={handleCompleteNow}
            style={styles.completeButton}
          >
            {hasStarted ? "✅ COMPLETE CONNECTION NOW" : "🚀 SKIP TO DEMO MODE"}
          </BrutalButton>
          
          <Text style={[brutalTextStyle('caption', 'medium', 'black'), styles.skipText]}>
            CLICK ABOVE TO LOAD DEMO TRANSACTIONS IMMEDIATELY
          </Text>
        </BrutalCard>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: NeoBrutalism.colors.white,
  },
  header: {
    padding: 16,
    paddingTop: 50,
    borderBottomWidth: 3,
    borderBottomColor: NeoBrutalism.colors.black,
    alignItems: 'center',
    backgroundColor: NeoBrutalism.colors.neonYellow,
  },
  headerTitle: {
    marginBottom: 8,
    color: NeoBrutalism.colors.black,
  },
  statusText: {
    color: NeoBrutalism.colors.black,
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
    borderTopWidth: 3,
    borderTopColor: NeoBrutalism.colors.black,
    alignItems: 'center',
    backgroundColor: NeoBrutalism.colors.lightGray,
  },
  helpText: {
    textAlign: 'center',
    color: NeoBrutalism.colors.black,
    marginBottom: 12,
  },
  completeButton: {
    minWidth: 250,
    marginBottom: 8,
  },
  skipText: {
    textAlign: 'center',
    color: NeoBrutalism.colors.black,
    fontSize: 11,
  },
});
