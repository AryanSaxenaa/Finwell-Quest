export const PLAID_CONFIG = {
  clientId: '688e3fe6378a2e00257a4fb7',
  sandboxKey: 'e476098feb8cea92f388f44e1107fc',
  environment: 'sandbox', // Change to 'production' for live
  products: ['transactions'], // Remove 'accounts' and 'identity' - transactions includes account data
  countryCodes: ['US'],
  webhook: null, // Add webhook URL when available
};

export const PLAID_ENDPOINTS = {
  createLinkToken: '/link/token/create',
  exchangePublicToken: '/item/public_token/exchange',
  getAccounts: '/accounts/get',
  getTransactions: '/transactions/get',
  getTransactionsSync: '/transactions/sync',
  getCategories: '/categories/get',
  sandboxCreatePublicToken: '/sandbox/public_token/create',
};
