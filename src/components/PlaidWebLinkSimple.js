import React, { useState } from 'react';
import { Modal, View, StyleSheet, Alert } from 'react-native';
import { WebView } from 'react-native-webview';
import { Button, Text } from '@ui-kitten/components';

export default function PlaidWebLinkSimple({ linkToken, onSuccess, onExit, visible, onClose }) {
  const [status, setStatus] = useState('Ready to connect');

  const plaidDirectUrl = `https://cdn.plaid.com/link/v2/stable/link.html?token=${linkToken}&isWebview=true&isMobile=true&redirect_uri=https://cdn.plaid.com/link/v2/stable/link.html`;

  const handleWebViewNavigation = (navState) => {
    console.log('Navigation state changed:', navState.url);
    
    // Parse URL parameters to check for Plaid results
    const url = new URL(navState.url);
    const params = new URLSearchParams(url.search);
    
    // Check for success parameters
    if (params.has('public_token')) {
      console.log('Plaid success detected in URL');
      const publicToken = params.get('public_token');
      const institutionId = params.get('institution_id');
      const institutionName = params.get('institution_name');
      
      console.log('Success data:', { publicToken, institutionId, institutionName });
      
      if (onSuccess) {
        onSuccess({
          publicToken: publicToken,
          metadata: {
            institution: {
              institution_id: institutionId,
              name: institutionName
            }
          }
        });
      }
      onClose();
      return false; // Prevent navigation
    }
    
    // Check for error parameters
    if (params.has('error_code')) {
      console.log('Plaid error detected in URL');
      const errorCode = params.get('error_code');
      const errorMessage = params.get('error_message');
      const errorType = params.get('error_type');
      
      console.log('Error data:', { errorCode, errorMessage, errorType });
      
      if (onExit) {
        onExit({
          error_code: errorCode,
          error_message: decodeURIComponent(errorMessage || ''),
          error_type: errorType
        }, null);
      }
      onClose();
      return false; // Prevent navigation
    }
    
    // Check for exit/cancel
    if (url.hostname === 'cdn.plaid.com' && url.pathname.includes('exit')) {
      console.log('Plaid exit detected');
      if (onExit) {
        onExit(null, null);
      }
      onClose();
      return false; // Prevent navigation
    }
    
    return true; // Allow navigation
  };

  const handleWebViewMessage = (event) => {
    try {
      const data = JSON.parse(event.nativeEvent.data);
      console.log('WebView message received:', data);
      
      switch (data.type) {
        case 'success':
          console.log('Plaid success from WebView:', data);
          if (onSuccess) {
            onSuccess({
              publicToken: data.public_token,
              metadata: data.metadata
            });
          }
          onClose();
          break;
          
        case 'exit':
          console.log('Plaid exit from WebView:', data);
          if (onExit) {
            onExit(data.error, data.metadata);
          }
          onClose();
          break;
          
        case 'close':
          console.log('Plaid close from WebView');
          onClose();
          break;
          
        default:
          console.log('Unknown message type:', data.type);
      }
    } catch (error) {
      console.error('Error parsing WebView message:', error);
    }
  };

  const handleWebViewError = (syntheticEvent) => {
    const { nativeEvent } = syntheticEvent;
    console.error('WebView error:', nativeEvent);
    Alert.alert(
      'Connection Error',
      'Failed to load Plaid Link. Please check your internet connection and try again.',
      [
        { text: 'OK', onPress: onClose }
      ]
    );
  };

  const reloadWebView = () => {
    setWebViewKey(prev => prev + 1);
  };

  return (
    <Modal
      visible={visible}
      animationType="slide"
      presentationStyle="fullScreen"
      onRequestClose={onClose}
    >
      <View style={styles.container}>
        <View style={styles.header}>
          <View style={styles.headerTop}>
            <Text category="h6" style={styles.headerTitle}>
              Connect Bank Account
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
          <Text category="c1" style={styles.statusText}>
            {status}
          </Text>
        </View>
        
        <WebView
          source={{ uri: plaidDirectUrl }}
          style={styles.webView}
          onMessage={handleWebViewMessage}
          onError={handleWebViewError}
          onNavigationStateChange={handleWebViewNavigation}
          onShouldStartLoadWithRequest={(request) => {
            console.log('Load request:', request.url);
            
            // Intercept plaidlink:// URLs
            if (request.url.startsWith('plaidlink://')) {
              console.log('Intercepted plaidlink URL:', request.url);
              
              // Parse the plaidlink URL
              const url = request.url.replace('plaidlink://', 'https://plaidlink/');
              const parsedUrl = new URL(url);
              const params = new URLSearchParams(parsedUrl.search);
              
              if (parsedUrl.pathname.includes('exit')) {
                const errorCode = params.get('error_code');
                const errorMessage = params.get('error_message');
                const errorType = params.get('error_type');
                
                if (errorCode) {
                  console.log('Plaid error from deep link:', { errorCode, errorMessage, errorType });
                  if (onExit) {
                    onExit({
                      error_code: errorCode,
                      error_message: decodeURIComponent(errorMessage || ''),
                      error_type: errorType
                    }, null);
                  }
                } else {
                  console.log('Plaid cancelled from deep link');
                  if (onExit) {
                    onExit(null, null);
                  }
                }
                onClose();
              } else if (parsedUrl.pathname.includes('success')) {
                const publicToken = params.get('public_token');
                const institutionId = params.get('institution_id');
                const institutionName = params.get('institution_name');
                
                console.log('Plaid success from deep link:', { publicToken, institutionId, institutionName });
                
                if (onSuccess) {
                  onSuccess({
                    publicToken: publicToken,
                    metadata: {
                      institution: {
                        institution_id: institutionId,
                        name: decodeURIComponent(institutionName || '')
                      }
                    }
                  });
                }
                onClose();
              }
              
              return false; // Don't load the plaidlink URL
            }
            
            return true; // Allow other URLs to load
          }}
          javaScriptEnabled={true}
          domStorageEnabled={true}
          startInLoadingState={true}
          scalesPageToFit={true}
          bounces={false}
          onLoadStart={() => setStatus('Loading Plaid...')}
          onLoadEnd={() => setStatus('Plaid Link loaded')}
        />
        
        <View style={styles.footer}>
          <Text category="c2" style={styles.helpText}>
            If you experience any issues, please close and try again
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
    flexDirection: 'column',
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#e5e5e5',
    paddingTop: 50, // Account for status bar
  },
  headerTop: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    width: '100%',
    marginBottom: 4,
  },
  headerTitle: {
    flex: 1,
    textAlign: 'center',
  },
  statusText: {
    textAlign: 'center',
    color: '#666',
    fontSize: 12,
  },
  closeButton: {
    minWidth: 60,
  },
  webView: {
    flex: 1,
  },
  footer: {
    padding: 16,
    borderTopWidth: 1,
    borderTopColor: '#e5e5e5',
  },
  helpText: {
    textAlign: 'center',
    color: '#666',
  },
});
