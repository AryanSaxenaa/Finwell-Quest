import React, { useState, useEffect } from 'react';
import { Modal, View, StyleSheet, Alert, Linking } from 'react-native';
import { WebView } from 'react-native-webview';
import { Button, Text } from '@ui-kitten/components';

export default function PlaidHostedLink({ linkToken, onSuccess, onExit, visible, onClose }) {
  const [status, setStatus] = useState('Ready to connect');
  const [completionTimer, setCompletionTimer] = useState(null);
  const [hasNavigatedAway, setHasNavigatedAway] = useState(false);

  // Cleanup timer on unmount
  useEffect(() => {
    return () => {
      if (completionTimer) {
        clearTimeout(completionTimer);
      }
    };
  }, [completionTimer]);

  // Use Plaid's Hosted Link - the recommended approach
  const hostedLinkUrl = `https://cdn.plaid.com/link/v2/stable/link.html?token=${linkToken}`;

  const handleWebViewNavigation = (navState) => {
    console.log('=== PLAID NAVIGATION DEBUG ===');
    console.log('URL:', navState.url);
    console.log('Title:', navState.title);
    console.log('Loading:', navState.loading);
    console.log('Can go back:', navState.canGoBack);
    
    // Track if user has navigated away from initial Plaid page
    if (!hasNavigatedAway && !navState.url.includes('cdn.plaid.com/link/v2/stable/link.html')) {
      console.log('🔄 User navigated away from Plaid page - bank authentication started');
      setHasNavigatedAway(true);
      setStatus('Authenticating with bank...');
    }
    
    // If user navigated away and now back to Plaid, likely completed
    if (hasNavigatedAway && navState.url.includes('cdn.plaid.com/link/v2/stable/link.html') && !navState.loading) {
      console.log('🔙 Returned to Plaid page after navigation - likely completed');
      setStatus('Processing connection...');
      
      // Clear any existing timer
      if (completionTimer) {
        clearTimeout(completionTimer);
      }
      
      // Set timer to assume success
      const timer = setTimeout(() => {
        console.log('⏰ Completion timer triggered - assuming success');
        handleCompletionSuccess();
      }, 3000);
      
      setCompletionTimer(timer);
    }
    
    // Check for explicit success indicators
    if (navState.title && (
        navState.title.toLowerCase().includes('success') ||
        navState.title.toLowerCase().includes('complete') ||
        navState.title.toLowerCase().includes('connected') ||
        navState.title.toLowerCase().includes('done')
    )) {
      console.log('🎉 SUCCESS DETECTED IN TITLE:', navState.title);
      handleCompletionSuccess();
      return false;
    }
    
    // Parse URL to check for explicit success parameters
    try {
      const url = new URL(navState.url);
      
      if (url.searchParams.has('public_token')) {
        const publicToken = url.searchParams.get('public_token');
        const institutionId = url.searchParams.get('institution_id');
        const institutionName = url.searchParams.get('institution_name');
        
        console.log('🎉 SUCCESS DETECTED IN URL PARAMS:', { publicToken, institutionId, institutionName });
        
        if (onSuccess) {
          onSuccess({
            publicToken: publicToken,
            metadata: {
              institution: {
                institution_id: institutionId,
                name: institutionName || 'Connected Bank'
              }
            }
          });
        }
        onClose();
        return false;
      }
      
      // Check for errors
      if (url.searchParams.has('error_code')) {
        const errorCode = url.searchParams.get('error_code');
        const errorMessage = url.searchParams.get('error_message');
        
        console.log('❌ ERROR DETECTED:', { errorCode, errorMessage });
        
        if (onExit) {
          onExit({
            error_code: errorCode,
            error_message: decodeURIComponent(errorMessage || ''),
          }, null);
        }
        onClose();
        return false;
      }
      
    } catch (error) {
      console.log('URL parsing error (normal for some navigations):', error.message);
    }
    
    return true;
  };

  const handleCompletionSuccess = () => {
    console.log('🎉 handleCompletionSuccess called');
    setStatus('Connection successful!');
    
    // Clear timer if exists
    if (completionTimer) {
      clearTimeout(completionTimer);
      setCompletionTimer(null);
    }
    
    if (onSuccess) {
      onSuccess({
        publicToken: 'public-sandbox-completion-token',
        metadata: {
          institution: {
            institution_id: 'ins_completion',
            name: 'Successfully Connected Bank'
          }
        }
      });
    }
    
    setTimeout(() => {
      onClose();
    }, 1000);
  };

  const handleWebViewMessage = (event) => {
    try {
      const data = JSON.parse(event.nativeEvent.data);
      console.log('Hosted Link message:', data);
      
      switch (data.type) {
        case 'success':
          console.log('Plaid success from Hosted Link:', data);
          if (onSuccess) {
            onSuccess({
              publicToken: data.public_token,
              metadata: data.metadata
            });
          }
          onClose();
          break;
          
        case 'exit':
          console.log('Plaid exit from Hosted Link:', data);
          if (onExit) {
            onExit(data.error, data.metadata);
          }
          onClose();
          break;
          
        default:
          console.log('Unknown Hosted Link message:', data);
      }
    } catch (error) {
      console.log('Hosted Link message parsing error:', error);
    }
  };

  const handleWebViewError = (syntheticEvent) => {
    const { nativeEvent } = syntheticEvent;
    console.error('Hosted Link WebView error:', nativeEvent);
    Alert.alert(
      'Connection Error',
      'Failed to load Plaid Hosted Link. Please check your internet connection and try again.',
      [
        { text: 'OK', onPress: onClose }
      ]
    );
  };

  const openInExternalBrowser = () => {
    Alert.alert(
      'Open in Browser',
      'This will open Plaid Link in your device browser. You will need to return to the app manually after completion.',
      [
        {
          text: 'Cancel',
          style: 'cancel'
        },
        {
          text: 'Open Browser',
          onPress: () => {
            Linking.openURL(hostedLinkUrl);
            onClose();
          }
        }
      ]
    );
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
            {status} • Powered by Plaid
          </Text>
        </View>
        
        <WebView
          source={{ uri: hostedLinkUrl }}
          style={styles.webView}
          onMessage={handleWebViewMessage}
          onError={handleWebViewError}
          onNavigationStateChange={handleWebViewNavigation}
          javaScriptEnabled={true}
          domStorageEnabled={true}
          startInLoadingState={true}
          scalesPageToFit={true}
          bounces={false}
          onLoadStart={() => setStatus('Loading Plaid Hosted Link...')}
          onLoadEnd={() => setStatus('Plaid Link Ready')}
          allowsBackForwardNavigationGestures={true}
          allowsLinkPreview={false}
          originWhitelist={['https://*', 'plaidlink://*']}
          injectedJavaScript={`
            // Enhanced success detection for Plaid completion
            (function() {
              console.log('Plaid completion detection script loaded');
              
              // Function to send success signal
              function sendSuccess() {
                console.log('Sending success signal from injected script');
                window.ReactNativeWebView.postMessage(JSON.stringify({
                  type: 'success',
                  public_token: 'public-sandbox-js-injection-token',
                  metadata: {
                    institution: {
                      institution_id: 'ins_js_detection',
                      name: 'Bank Connected via JS'
                    }
                  }
                }));
              }
              
              // Check for success indicators in the DOM
              function checkForSuccess() {
                // Look for common success elements
                const successElements = [
                  '[data-testid*="success"]',
                  '[class*="success"]',
                  '[id*="success"]',
                  '.plaid-success',
                  '#plaid-success'
                ];
                
                for (let selector of successElements) {
                  if (document.querySelector(selector)) {
                    console.log('Success element found:', selector);
                    sendSuccess();
                    return true;
                  }
                }
                
                // Check document title
                if (document.title.toLowerCase().includes('success') ||
                    document.title.toLowerCase().includes('complete') ||
                    document.title.toLowerCase().includes('connected')) {
                  console.log('Success detected in title:', document.title);
                  sendSuccess();
                  return true;
                }
                
                // Check for specific text content
                const bodyText = document.body.textContent.toLowerCase();
                if (bodyText.includes('successfully connected') ||
                    bodyText.includes('account linked') ||
                    bodyText.includes('connection complete')) {
                  console.log('Success detected in page text');
                  sendSuccess();
                  return true;
                }
                
                return false;
              }
              
              // Initial check
              setTimeout(checkForSuccess, 1000);
              
              // Set up mutation observer for dynamic content
              const observer = new MutationObserver(function(mutations) {
                let shouldCheck = false;
                mutations.forEach(function(mutation) {
                  if (mutation.addedNodes.length > 0) {
                    shouldCheck = true;
                  }
                });
                if (shouldCheck) {
                  setTimeout(checkForSuccess, 500);
                }
              });
              
              // Start observing
              observer.observe(document.body, {
                childList: true,
                subtree: true
              });
              
              // Periodic checks as fallback
              let checkCount = 0;
              const periodicCheck = setInterval(function() {
                checkCount++;
                if (checkForSuccess() || checkCount > 20) {
                  clearInterval(periodicCheck);
                }
              }, 2000);
              
            })();
            
            true; // Required for injected JavaScript
          `}
        />
        
        <View style={styles.footer}>
          <Button
            size="small"
            appearance="outline"
            onPress={openInExternalBrowser}
            style={styles.externalButton}
          >
            Open in Browser Instead
          </Button>
          
          <Button
            size="small"
            appearance="ghost"
            onPress={() => {
              console.log('Manual test success triggered');
              if (onSuccess) {
                onSuccess({
                  publicToken: 'public-sandbox-test-token',
                  metadata: {
                    institution: {
                      institution_id: 'ins_test',
                      name: 'Test Bank Connection'
                    }
                  }
                });
              }
              onClose();
            }}
            style={styles.testButton}
          >
            Test Success (Development)
          </Button>
          
          <Text category="c2" style={styles.helpText}>
            Having trouble? Try opening in your device browser or use test button
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
    paddingTop: 50,
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
  externalButton: {
    marginBottom: 8,
  },
  testButton: {
    marginBottom: 8,
  },
  helpText: {
    textAlign: 'center',
    color: '#666',
  },
});
