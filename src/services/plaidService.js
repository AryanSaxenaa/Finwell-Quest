import { PLAID_CONFIG, PLAID_ENDPOINTS } from '../config/plaid';

class PlaidService {
  constructor() {
    this.baseURL = 'https://sandbox.plaid.com'; // Change for production
    this.clientId = PLAID_CONFIG.clientId;
    this.secret = PLAID_CONFIG.sandboxKey;
  }

  async makeRequest(endpoint, data) {
    try {
      const response = await fetch(`${this.baseURL}${endpoint}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          client_id: this.clientId,
          secret: this.secret,
          ...data,
        }),
      });

      const result = await response.json();
      
      if (!response.ok) {
        // Check for common expected errors that we don't want to show as scary red errors
        const isExpectedError = result.error_message && 
          (result.error_message.includes('not yet ready') || 
           result.error_message.includes('webhook'));
           
        if (isExpectedError) {
          // For expected errors, just throw without logging scary error messages
          throw new Error(result.error_message);
        } else {
          // For unexpected errors, log them normally
          console.error('Unexpected Plaid API Error:', result.error_message);
          throw new Error(result.error_message || 'Plaid API request failed');
        }
      }

      return result;
    } catch (error) {
      // Only log if it's not an expected/handled error
      if (!error.message.includes('not yet ready') && !error.message.includes('webhook')) {
        console.error('Plaid API Error:', error);
      }
      throw error;
    }
  }

  async createLinkToken(userId) {
    return this.makeRequest(PLAID_ENDPOINTS.createLinkToken, {
      products: PLAID_CONFIG.products,
      client_name: 'FinPath Quest', // Required: Your app name shown to users
      country_codes: PLAID_CONFIG.countryCodes,
      language: 'en',
      user: {
        client_user_id: userId,
      },
      // Optional but recommended fields
      link_customization_name: 'default',
      // android_package_name: 'com.finpathquest.app', // Removed - requires dashboard configuration
      // webhook: PLAID_CONFIG.webhook, // Uncomment when you have a webhook URL
    });
  }

  async exchangePublicToken(publicToken) {
    console.log('📤 PlaidService.exchangePublicToken called with:', publicToken);
    
    // For our demo app using auto-success tokens, use real Plaid sandbox
    if (publicToken.includes('auto-success') || publicToken.includes('sandbox')) {
      console.log('🎭 Creating real Plaid sandbox Item with transactions');
      
      try {
        // Use Plaid's sandbox endpoint to create a real Item with transactions
        const sandboxResponse = await this.makeRequest('/sandbox/public_token/create', {
          institution_id: 'ins_109508', // First Platypus Bank (sandbox test institution)
          initial_products: ['transactions'],
          options: {
            override_username: 'user_good',
            override_password: 'pass_good',
            transactions: {
              start_date: '2025-01-01',
              end_date: '2025-08-04',
            }
          }
        });
        
        console.log('📥 Sandbox public token created:', sandboxResponse.public_token);
        
        // Now exchange the real sandbox public token for access token
        const realExchangeResponse = await this.makeRequest('/item/public_token/exchange', {
          public_token: sandboxResponse.public_token,
        });
        
        console.log('📥 Real Plaid sandbox exchange result:', realExchangeResponse);
        return realExchangeResponse;
        
      } catch (error) {
        console.error('❌ Failed to create real Plaid sandbox item:', error);
        
        // Fallback to mock data if Plaid sandbox fails
        console.log('🎭 Falling back to mock data');
        await new Promise(resolve => setTimeout(resolve, 1000));
        
        const mockResult = {
          access_token: 'access-sandbox-demo-token-' + Date.now(),
          item_id: 'mock-item-id-' + Date.now(),
          request_id: 'mock-request-' + Date.now(),
        };
        
        console.log('📥 PlaidService.exchangePublicToken mock result:', mockResult);
        return mockResult;
      }
    }
    
    // For real tokens, this would call your backend
    throw new Error('Real token exchange requires backend server. Use test mode for demo.');
  }

  async getAccounts(accessToken) {
    // Try real Plaid API first
    if (accessToken.includes('access-sandbox-') || accessToken.includes('access-production-')) {
      try {
        console.log('🏦 Getting real Plaid accounts');
        return await this.makeRequest(PLAID_ENDPOINTS.getAccounts, {
          access_token: accessToken,
        });
      } catch (error) {
        console.error('❌ Real Plaid accounts failed:', error);
        // Fall through to mock data
      }
    }
    
    // Fallback to mock account data
    console.log('🎭 Using mock account data');
    
    return {
      accounts: [
        {
          account_id: 'demo-checking-001',
          balances: {
            available: 2450.75,
            current: 2450.75,
            limit: null,
            iso_currency_code: 'USD',
          },
          mask: '0000',
          name: 'Plaid Checking',
          official_name: 'Plaid Gold Standard 0% Interest Checking',
          subtype: 'checking',
          type: 'depository',
        },
        {
          account_id: 'demo-savings-001', 
          balances: {
            available: 8750.30,
            current: 8750.30,
            limit: null,
            iso_currency_code: 'USD',
          },
          mask: '1111',
          name: 'Plaid Saving',
          official_name: 'Plaid Silver Standard 0.1% Interest Saving',
          subtype: 'savings',
          type: 'depository',
        },
      ],
      item: {
        item_id: accessToken.split('-').pop(),
        institution_id: 'ins_demo_bank',
        available_products: ['transactions', 'accounts'],
        billed_products: ['transactions'],
      },
      request_id: 'mock-accounts-request-' + Date.now(),
    };
  }

  async getTransactions(accessToken, startDate, endDate, count = 100) {
    // Try real Plaid API first
    if (accessToken.includes('access-sandbox-') || accessToken.includes('access-production-')) {
      try {
        console.log('💳 Getting real Plaid transactions with correct parameters');
        // Use correct Plaid API format
        return await this.makeRequest(PLAID_ENDPOINTS.getTransactions, {
          access_token: accessToken,
          start_date: startDate,
          end_date: endDate,
          options: {
            count: Math.min(count, 500), // Max 500 per request
            offset: 0,
          }
        });
      } catch (error) {
        // Check if it's the common "product not yet ready" error
        const isProductNotReady = error.message && error.message.includes('not yet ready');
        
        if (isProductNotReady) {
          console.log('⏳ Transactions not ready, waiting 3 seconds and trying sync endpoint...');
          // Small delay to let transactions process
          await new Promise(resolve => setTimeout(resolve, 3000));
        } else {
          console.warn('⚠️ Transactions endpoint failed, trying alternative:', error.message);
        }
        
        // Try with /transactions/sync endpoint as alternative
        try {
          console.log('🔄 Using /transactions/sync endpoint (note: may have limited category data)');
          const syncResult = await this.makeRequest(PLAID_ENDPOINTS.getTransactionsSync, {
            access_token: accessToken,
            cursor: null, // Get all transactions from beginning
          });
          
          console.log('✅ Successfully retrieved transactions via sync endpoint');
          
          // Convert sync format to get format
          return {
            transactions: syncResult.added || [],
            accounts: syncResult.accounts || [],
            total_transactions: (syncResult.added || []).length,
            request_id: syncResult.request_id,
          };
        } catch (syncError) {
          console.error('❌ Both transaction endpoints failed:', syncError);
          // Fall through to error
        }
      }
    }
    
    // Remove mock data fallback - we want only real Plaid data
    throw new Error('Unable to fetch real Plaid transactions. Only real Plaid API data should be used.');
  }

  async getCategories() {
    return this.makeRequest(PLAID_ENDPOINTS.getCategories, {});
  }

  // Helper method to categorize transactions
  categorizeTransaction(transaction) {
    // Plaid categories are arrays like ["Food and Drink", "Restaurants", "Coffee Shop"]
    const categories = transaction.category || [];
    const primaryCategory = categories[0]?.toLowerCase() || '';
    const secondaryCategory = categories[1]?.toLowerCase() || '';
    const merchantName = (transaction.merchant_name || transaction.name || '').toLowerCase();
    
    console.log('🏷️ Categorizing transaction:', transaction.name, 'Categories:', categories, 'Merchant:', transaction.merchant_name);
    
    // If we have Plaid categories, use them
    if (categories.length > 0) {
      return this.mapPlaidCategories(primaryCategory, secondaryCategory);
    }
    
    // Fallback to merchant name-based categorization
    return this.categorizeByMerchant(merchantName);
  }

  mapPlaidCategories(primaryCategory, secondaryCategory) {
    // Map to match store categories: ['Housing', 'Transport', 'Food', 'Entertainment', 'Shopping', 'Bills', 'Other']
    const categoryMap = {
      // Food & Dining
      'food and drink': 'Food',
      'restaurants': 'Food',
      'fast food': 'Food',
      'coffee shop': 'Food',
      'groceries': 'Food',
      'food and beverage store': 'Food',
      'supermarkets and groceries': 'Food',
      
      // Shopping
      'shops': 'Shopping',
      'general merchandise': 'Shopping',
      'clothing': 'Shopping',
      'electronics': 'Shopping',
      'pharmacy': 'Shopping',
      'digital purchase': 'Shopping',
      
      // Transportation -> Transport (to match store)
      'transportation': 'Transport',
      'gas stations': 'Transport',
      'taxi': 'Transport',
      'public transportation': 'Transport',
      'automotive': 'Transport',
      
      // Entertainment
      'entertainment': 'Entertainment',
      'recreation': 'Entertainment',
      'arts and entertainment': 'Entertainment',
      'movie theaters': 'Entertainment',
      'music and audio': 'Entertainment',
      'digital entertainment': 'Entertainment',
      
      // Bills & Utilities
      'payment': 'Bills',
      'utilities': 'Bills',
      'internet': 'Bills',
      'phone': 'Bills',
      'electric': 'Bills',
      'bank fees': 'Bills',
      
      // Housing
      'rent': 'Housing',
      'mortgage': 'Housing',
      'home improvement': 'Housing',
      
      // Financial - these might not show in pie chart
      'transfer': 'Other',
      'deposit': 'Other',
      'payroll': 'Other',
    };

    // Try to match primary category first
    let mappedCategory = categoryMap[primaryCategory];
    
    // If no match, try secondary category
    if (!mappedCategory && secondaryCategory) {
      mappedCategory = categoryMap[secondaryCategory];
    }
    
    // If still no match, try partial matching
    if (!mappedCategory) {
      for (const [key, value] of Object.entries(categoryMap)) {
        if (primaryCategory.includes(key) || secondaryCategory.includes(key)) {
          mappedCategory = value;
          break;
        }
      }
    }
    
    return mappedCategory || 'Other';
  }

  categorizeByMerchant(merchantName) {
    console.log('🏪 Categorizing by merchant name:', merchantName);
    
    // Merchant name-based categorization patterns
    const merchantPatterns = {
      // Food & Dining
      'Food': [
        'mcdonald', 'starbucks', 'kfc', 'subway', 'pizza', 'burger', 'taco', 'coffee',
        'restaurant', 'cafe', 'food', 'grocery', 'market', 'deli', 'bakery'
      ],
      
      // Transport
      'Transport': [
        'uber', 'lyft', 'taxi', 'gas', 'shell', 'chevron', 'exxon', 'bp',
        'parking', 'metro', 'transit', 'airline', 'united airlines', 'delta'
      ],
      
      // Shopping
      'Shopping': [
        'amazon', 'walmart', 'target', 'costco', 'shop', 'store', 'mall',
        'sparkfun', 'electronics', 'bicycle shop', 'madison bicycle'
      ],
      
      // Entertainment
      'Entertainment': [
        'climbing', 'touchstone', 'movie', 'theater', 'gym', 'fitness',
        'spotify', 'netflix', 'entertainment', 'game'
      ],
      
      // Bills
      'Bills': [
        'payment', 'electric', 'internet', 'phone', 'utility', 'insurance',
        'automatic payment', 'credit card', 'loan payment'
      ],
      
      // Housing
      'Housing': [
        'rent', 'mortgage', 'apartment', 'housing', 'property'
      ]
    };

    // Check each category for merchant name matches
    for (const [category, patterns] of Object.entries(merchantPatterns)) {
      for (const pattern of patterns) {
        if (merchantName.includes(pattern)) {
          console.log(`📋 Merchant "${merchantName}" matched pattern "${pattern}" -> Category: ${category}`);
          return category;
        }
      }
    }
    
    console.log(`📋 No merchant pattern match for "${merchantName}" -> Category: Other`);
    return 'Other';
  }

  // Format transaction for our expense store
  formatTransaction(transaction) {
    return {
      id: transaction.transaction_id,
      amount: Math.abs(transaction.amount),
      category: this.categorizeTransaction(transaction),
      description: transaction.name,
      date: transaction.date,
      account: transaction.account_id,
      isIncome: transaction.amount < 0, // Plaid uses negative for income
      merchant: transaction.merchant_name || transaction.name,
      plaidData: transaction, // Keep original data for reference
    };
  }
}

export default new PlaidService();
