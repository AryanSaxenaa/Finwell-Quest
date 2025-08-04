import React, { useState } from 'react';
import { Modal, View, StyleSheet, Alert, Text } from 'react-native';
import { WebView } from 'react-native-webview';
import { BrutalButton, BrutalCard, brutalTextStyle } from './BrutalComponents';
import { NeoBrutalism } from '../styles/neoBrutalism';

export default function PlaidWebLink({ linkToken, onSuccess, onExit, visible, onClose }) {
  const [webViewKey, setWebViewKey] = useState(0);
  const [status, setStatus] = useState('Loading Plaid...');

  const plaidHtml = `
<!DOCTYPE html>
<html>
<head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1">
    <title>Plaid Link</title>
    <style>
        body {
            margin: 0;
            padding: 20px;
            font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
            background: #F0F0F0;
            font-weight: 700;
        }
        .container {
            max-width: 400px;
            margin: 20px auto;
            text-align: center;
            background: #FFFFFF;
            border: 4px solid #000000;
            padding: 24px;
        }
        .button {
            background: #FFFF00;
            color: #000000;
            border: 3px solid #000000;
            padding: 15px 30px;
            border-radius: 0;
            font-size: 16px;
            font-weight: 800;
            cursor: pointer;
            width: 100%;
            margin: 10px 0;
            text-transform: uppercase;
            letter-spacing: 0.5px;
        }
        .button:hover {
            background: #FFFF66;
            transform: translate(-2px, -2px);
            box-shadow: 4px 4px 0px #000000;
        }
        .button:disabled {
            background: #CCCCCC;
            cursor: not-allowed;
            transform: none;
            box-shadow: none;
        }
        .close-button {
            background: #FF006B;
            color: #FFFFFF;
        }
        .close-button:hover {
            background: #FF3388;
        }
        .title {
            font-size: 28px;
            font-weight: 800;
            margin-bottom: 10px;
            color: #000000;
            text-transform: uppercase;
            letter-spacing: 1px;
        }
        .subtitle {
            font-size: 16px;
            color: #666666;
            margin-bottom: 30px;
            font-weight: 600;
            text-transform: uppercase;
        }
        .status {
            font-size: 14px;
            margin: 10px 0;
            color: #000000;
            font-weight: 600;
            text-transform: uppercase;
        }
        .error {
            color: #000000;
            background: #FF006B;
            padding: 15px;
            border: 3px solid #000000;
            margin: 10px 0;
            font-weight: 700;
            text-transform: uppercase;
        }
    </style>
</head>
<body>
    <div class="container">
        <div class="title">CONNECT YOUR BANK</div>
        <div class="subtitle">SECURELY LINK YOUR ACCOUNT TO TRACK EXPENSES</div>
        
        <div id="status" class="status">LOADING PLAID...</div>
        
        <button id="link-button" class="button" disabled>
            INITIALIZING...
        </button>
        
        <button id="close-button" class="button close-button">
            CANCEL
        </button>
        
        <div id="error-message" class="error" style="display: none;"></div>
    </div>

    <script>
        console.log('WebView HTML loaded');
        
        const linkToken = '${linkToken}';
        const statusEl = document.getElementById('status');
        const linkButton = document.getElementById('link-button');
        const errorEl = document.getElementById('error-message');
        
        function updateStatus(message) {
            statusEl.textContent = message;
            console.log('Status:', message);
            // Send status to React Native
            window.ReactNativeWebView.postMessage(JSON.stringify({
                type: 'status',
                message: message
            }));
        }
        
        function showError(message) {
            errorEl.textContent = message;
            errorEl.style.display = 'block';
            console.error('Error:', message);
            // Send error to React Native
            window.ReactNativeWebView.postMessage(JSON.stringify({
                type: 'error',
                error: message
            }));
        }
        
        if (!linkToken) {
            showError('Link token not available');
            linkButton.textContent = 'Token Error';
        } else {
            updateStatus('Loading Plaid SDK...');
            
            // Load Plaid SDK
            const script = document.createElement('script');
            script.src = 'https://cdn.plaid.com/link/v2/stable/link-initialize.js';
            script.onload = function() {
                console.log('Plaid SDK loaded');
                updateStatus('Initializing Plaid Link...');
                
                try {
                    console.log('Creating Plaid handler with token:', linkToken);
                    console.log('Plaid object available:', typeof Plaid);
                    console.log('Plaid.create function:', typeof Plaid.create);
                    
                    const handler = Plaid.create({
                        token: linkToken,
                        onSuccess: (public_token, metadata) => {
                            console.log('Plaid success:', public_token, metadata);
                            updateStatus('Connection successful!');
                            window.ReactNativeWebView.postMessage(JSON.stringify({
                                type: 'success',
                                public_token: public_token,
                                metadata: metadata
                            }));
                        },
                        onExit: (err, metadata) => {
                            console.log('Plaid exit:', err, metadata);
                            updateStatus('Connection cancelled');
                            window.ReactNativeWebView.postMessage(JSON.stringify({
                                type: 'exit',
                                error: err,
                                metadata: metadata
                            }));
                        },
                        onEvent: (eventName, metadata) => {
                            console.log('Plaid event:', eventName, metadata);
                            updateStatus('Event: ' + eventName);
                            // Send event updates to React Native
                            window.ReactNativeWebView.postMessage(JSON.stringify({
                                type: 'status',
                                message: 'Event: ' + eventName
                            }));
                        },
                        onLoad: () => {
                            console.log('Plaid Link loaded and ready!');
                            updateStatus('Ready to connect');
                            linkButton.disabled = false;
                            linkButton.textContent = 'Connect Bank Account';
                            // Send ready signal to React Native
                            window.ReactNativeWebView.postMessage(JSON.stringify({
                                type: 'ready'
                            }));
                        }
                    });

                    console.log('Plaid handler created successfully:', typeof handler);
                    console.log('Handler methods:', Object.keys(handler));
                    updateStatus('Handler created, waiting for onLoad...');

                    // Set a timeout to detect if onLoad never fires
                    setTimeout(() => {
                        if (linkButton.disabled) {
                            console.warn('onLoad callback did not fire within 10 seconds');
                            updateStatus('Link initialization timeout - trying manual enable');
                            linkButton.disabled = false;
                            linkButton.textContent = 'Connect Bank Account (Manual)';
                            
                            // Send a manual ready signal
                            window.ReactNativeWebView.postMessage(JSON.stringify({
                                type: 'manual_ready'
                            }));
                        }
                    }, 5000); // Reduced to 5 seconds

                    linkButton.addEventListener('click', () => {
                        console.log('Opening Plaid Link');
                        updateStatus('Opening bank selection...');
                        try {
                            console.log('Calling handler.open()...');
                            handler.open();
                            console.log('handler.open() called successfully');
                            
                            // Fallback: If the modal doesn't appear, try opening Plaid Link URL directly
                            setTimeout(() => {
                                console.log('Checking if Plaid modal appeared...');
                                updateStatus('If no bank selection appeared, trying direct URL...');
                                
                                // Create a direct Plaid Link URL as fallback
                                const plaidUrl = 'https://cdn.plaid.com/link/v2/stable/link.html?token=' + linkToken + '&isWebview=true&isMobile=true';
                                console.log('Fallback: Opening Plaid URL directly:', plaidUrl);
                                
                                // Navigate to Plaid URL directly
                                window.location.href = plaidUrl;
                            }, 3000);
                            
                        } catch (openError) {
                            console.error('Error opening Plaid Link:', openError);
                            showError('Failed to open Plaid Link: ' + openError.message);
                            
                            // Try direct URL method as final fallback
                            const plaidUrl = 'https://cdn.plaid.com/link/v2/stable/link.html?token=' + linkToken + '&isWebview=true&isMobile=true';
                            console.log('Error fallback: Opening Plaid URL directly:', plaidUrl);
                            window.location.href = plaidUrl;
                        }
                    });
                    
                } catch (error) {
                    console.error('Error creating Plaid handler:', error);
                    showError('Failed to initialize Plaid: ' + error.message);
                    updateStatus('Initialization failed');
                }
            };
            
            script.onerror = function() {
                console.error('Failed to load Plaid SDK');
                showError('Failed to load Plaid SDK. Please check your internet connection.');
            };
            
            document.head.appendChild(script);
        }

        document.getElementById('close-button').addEventListener('click', () => {
            window.ReactNativeWebView.postMessage(JSON.stringify({
                type: 'close'
            }));
        });
        
        // Send ready message
        window.ReactNativeWebView.postMessage(JSON.stringify({
            type: 'ready'
        }));
    </script>
</body>
</html>
  `;

  const handleWebViewMessage = (event) => {
    try {
      const data = JSON.parse(event.nativeEvent.data);
      console.log('WebView message received:', data);
      
      switch (data.type) {
        case 'status':
          console.log('Plaid status update:', data.message);
          setStatus(data.message);
          break;
          
        case 'ready':
          console.log('Plaid Link ready');
          setStatus('Ready to connect');
          break;
          
        case 'manual_ready':
          console.log('Plaid Link manually enabled (onLoad timeout)');
          setStatus('Ready to connect (Manual)');
          break;
          
        case 'error':
          console.error('Plaid error from WebView:', data.error);
          setStatus(`Error: ${data.error}`);
          break;
          
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
          onClose();
          break;
          
        default:
          console.log('Unknown message from WebView:', data);
      }
    } catch (error) {
      console.error('Error parsing WebView message:', error);
    }
  };

  const handleWebViewError = (syntheticEvent) => {
    const { nativeEvent } = syntheticEvent;
    console.error('WebView error:', nativeEvent);
    Alert.alert('Error', 'Failed to load Plaid Link. Please try again.');
  };

  const refreshWebView = () => {
    setWebViewKey(prev => prev + 1);
  };

  return (
    <Modal
      visible={visible}
      animationType="slide"
      presentationStyle="pageSheet"
    >
      <View style={styles.container}>
        <BrutalCard style={styles.header}>
          <View style={styles.headerTop}>
            <Text style={brutalTextStyle('h6', 'bold', 'black')}>
              🏦 CONNECT BANK ACCOUNT
            </Text>
            <BrutalButton
              title="✕ CLOSE"
              size="small"
              variant="secondary"
              onPress={onClose}
              style={styles.closeButton}
            />
          </View>
          <Text style={[brutalTextStyle('caption', 'medium', 'black'), styles.statusText]}>
            {status.toUpperCase()}
          </Text>
        </BrutalCard>
        
        <WebView
          key={webViewKey}
          source={{ html: plaidHtml }}
          style={styles.webView}
          onMessage={handleWebViewMessage}
          onError={handleWebViewError}
          javaScriptEnabled={true}
          domStorageEnabled={true}
          startInLoadingState={true}
          scalesPageToFit={true}
          bounces={false}
        />
        
        <BrutalCard style={styles.footer}>
          <BrutalButton
            title="🔄 REFRESH"
            size="small"
            variant="secondary"
            onPress={refreshWebView}
            style={styles.refreshButton}
          />
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
    flexDirection: 'column',
    padding: NeoBrutalism.spacing.lg,
    borderBottomWidth: NeoBrutalism.borders.thick,
    borderBottomColor: NeoBrutalism.colors.black,
    paddingTop: 50, // Account for status bar
    backgroundColor: NeoBrutalism.colors.neonYellow,
  },
  headerTop: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    width: '100%',
    marginBottom: NeoBrutalism.spacing.xs,
  },
  statusText: {
    textAlign: 'center',
    marginTop: NeoBrutalism.spacing.xs,
    color: NeoBrutalism.colors.black,
  },
  closeButton: {
    minWidth: 80,
  },
  webView: {
    flex: 1,
  },
  footer: {
    padding: NeoBrutalism.spacing.lg,
    borderTopWidth: NeoBrutalism.borders.thick,
    borderTopColor: NeoBrutalism.colors.black,
    backgroundColor: NeoBrutalism.colors.lightGray,
  },
  refreshButton: {
    alignSelf: 'center',
  },
});
