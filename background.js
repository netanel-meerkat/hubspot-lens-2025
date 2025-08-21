// background.js - OAuth and API handler
console.log('🚀 Background script loaded successfully');

chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  console.log('📥 Background script received message:', request);
  
  if (request.type === 'ping') {
    console.log('🏓 Ping received, responding with pong');
    sendResponse({ success: true, message: 'pong' });
    return true;
  }
  
  if (request.type === 'startOAuth') {
    console.log('🚀 Starting OAuth flow...');
    startOAuthFlow().then(response => {
      console.log('📤 Sending OAuth response:', response);
      sendResponse(response);
    });
    return true;
  }
  
  if (request.type === 'apiCall') {
    console.log('🌐 Making API call from background script:', request.endpoint);
    makeApiCall(request.endpoint, { 
      accessToken: request.accessToken,
      portalId: request.portalId,
      ...request.options 
    }).then(response => {
      console.log('📤 Sending API response:', response);
      sendResponse({ success: true, data: response });
    }).catch(error => {
      console.error('❌ API call failed:', error);
      sendResponse({ success: false, error: error.message });
    });
    return true;
  }
  
  if (request.type === 'executeQuery') {
    console.log('🔍 Executing HubSpot query from background script:', request.query);
    executeHubSpotQuery(request.query, request.portalId, request.accessToken).then(response => {
      console.log('📤 Sending query response:', response);
      sendResponse(response);
    }).catch(error => {
      console.error('❌ Query execution failed:', error);
      sendResponse({ success: false, error: error.message });
    });
    return true;
  }
  
  if (request.type === 'refreshToken') {
    console.log('🔄 Token refresh requested from content script');
    refreshToken().then(success => {
      console.log('📤 Sending token refresh response:', success);
      sendResponse({ success: success });
    }).catch(error => {
      console.error('❌ Token refresh failed:', error);
      sendResponse({ success: false, error: error.message });
    });
    return true;
  }
});

async function startOAuthFlow() {
  try {
    console.log('🔧 Setting up OAuth parameters...');
    const clientId = '14c07b03-9310-4dff-ba0c-f9e7f6e74ca4';
    const clientSecret = 'b3f2250c-f62d-4ba7-a62a-9f5d1cde4630';
    const redirectUrl = chrome.identity.getRedirectURL();
    
    // Required scopes for basic functionality (exactly as configured in HubSpot app)
    const requiredScopes = [
      'crm.lists.read',
      'crm.objects.companies.read',
      'crm.objects.contacts.read',
      'crm.objects.deals.read',
      'crm.objects.quotes.read',
      'crm.schemas.companies.read',
      'crm.schemas.contacts.read',
      'crm.schemas.deals.read',
      'crm.schemas.quotes.read',
      'oauth',
      'tickets'
    ].join(' ');
    
    // Optional scopes for enhanced functionality (exactly as configured in HubSpot app)
    const optionalScopes = [
      'crm.objects.custom.read',
      'crm.objects.invoices.read',
      'crm.objects.line_items.read',
      'crm.schemas.custom.read',
      'crm.schemas.invoices.read',
      'crm.schemas.line_items.read',
      'crm.schemas.subscriptions.read'
    ].join(' ');
    
    const scopes = requiredScopes;
    
    const authUrl = `https://app.hubspot.com/oauth/authorize?client_id=${clientId}&redirect_uri=${encodeURIComponent(redirectUrl)}&scope=${encodeURIComponent(scopes)}&optional_scope=${encodeURIComponent(optionalScopes)}`;

    console.log('🔗 Auth URL:', authUrl);
    console.log('📋 Scopes being sent:', scopes);
    console.log('🔍 Individual scopes:', scopes.split(' '));

    return new Promise((resolve) => {
      console.log('🌐 Launching web auth flow...');
      chrome.identity.launchWebAuthFlow({
        url: authUrl,
        interactive: true
      }, async (responseUrl) => {
        console.log('📥 Auth flow response URL:', responseUrl);
        
        if (chrome.runtime.lastError) {
          console.error('❌ Auth flow error:', chrome.runtime.lastError);
          resolve({ error: chrome.runtime.lastError.message });
          return;
        }

        const url = new URL(responseUrl);
        const code = url.searchParams.get('code');
        console.log('🔑 Authorization code received:', code ? 'Yes' : 'No');

        if (code) {
          try {
            console.log('🔄 Exchanging code for token...');
            const tokenData = await exchangeCodeForToken(code, clientId, clientSecret, redirectUrl);
            console.log('✅ Token exchange successful');
            
            // Store tokens
            console.log('💾 Storing tokens...');
            await chrome.storage.local.set({
              accessToken: tokenData.access_token,
              refreshToken: tokenData.refresh_token,
              expiresAt: Date.now() + tokenData.expires_in * 1000
            });

            // Get portal ID from token info
            console.log('🏢 Getting portal info...');
            const portalData = await getPortalInfo(tokenData.access_token);
            await chrome.storage.local.set({ portalId: portalData.hub_id });
            console.log('✅ Portal ID stored:', portalData.hub_id);

            resolve({ success: true, portalId: portalData.hub_id });
          } catch (error) {
            console.error('❌ Token exchange failed:', error);
            resolve({ error: error.message });
          }
        } else {
          console.error('❌ No authorization code in response');
          resolve({ error: 'No authorization code returned' });
        }
      });
    });
  } catch (error) {
    console.error('❌ OAuth flow setup failed:', error);
    return { error: error.message };
  }
}

async function exchangeCodeForToken(code, clientId, clientSecret, redirectUrl) {
  const tokenUrl = 'https://api.hubapi.com/oauth/v1/token';
  const body = new URLSearchParams({
    grant_type: 'authorization_code',
    code: code,
    redirect_uri: redirectUrl,
    client_id: clientId,
    client_secret: clientSecret
  });

  const response = await fetch(tokenUrl, {
    method: 'POST',
    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
    body: body
  });

  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(errorData.error_description || 'Token exchange failed');
  }

  return response.json();
}

async function getPortalInfo(accessToken) {
  const response = await fetch(`https://api.hubapi.com/oauth/v1/access-tokens/${accessToken}`, {
    headers: { 'Authorization': `Bearer ${accessToken}` }
  });

  if (!response.ok) {
    throw new Error('Failed to get portal info');
  }

  return response.json();
}

// Token refresh function (for future use)
async function refreshToken() {
  return new Promise((resolve) => {
    chrome.storage.local.get(['refreshToken'], async (data) => {
      if (!data.refreshToken) {
        console.log('❌ No refresh token available');
        resolve(false);
        return;
      }
      
      console.log('🔄 Attempting to refresh OAuth token...');
      
      const tokenUrl = 'https://api.hubapi.com/oauth/v1/token';
      const body = new URLSearchParams({
        grant_type: 'refresh_token',
        refresh_token: data.refreshToken,
        client_id: '14c07b03-9310-4dff-ba0c-f9e7f6e74ca4',
        client_secret: 'b3f2250c-f62d-4ba7-a62a-9f5d1cde4630'
      });
      
      try {
        const response = await fetch(tokenUrl, {
          method: 'POST',
          headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
          body: body
        });
        
        console.log('📥 Token refresh response status:', response.status);
        
        if (!response.ok) {
          const errorData = await response.json();
          console.error('❌ Token refresh failed:', errorData);
          resolve(false);
          return;
        }
        
        const tokenData = await response.json();
        console.log('✅ Token refresh successful, new token received');
        
        if (tokenData.access_token) {
          await chrome.storage.local.set({ 
            accessToken: tokenData.access_token, 
            refreshToken: tokenData.refresh_token || data.refreshToken, // Keep old refresh token if new one not provided
            expiresAt: Date.now() + (tokenData.expires_in || 3600) * 1000 
          });
          console.log('💾 New tokens stored successfully');
          resolve(true);
        } else {
          console.error('❌ No access token in refresh response');
          resolve(false);
        }
      } catch (error) {
        console.error('❌ Token refresh error:', error);
        resolve(false);
      }
    });
  });
}

async function makeApiCall(endpoint, options = {}) {
  console.log('🌐 Background script making API call to:', endpoint);
  console.log('📋 Options received:', options);
  
  // Check if token is expired and refresh if needed
  try {
    const tokenData = await chrome.storage.local.get(['accessToken', 'expiresAt', 'refreshToken']);
    const now = Date.now();
    
    if (tokenData.expiresAt && now >= tokenData.expiresAt - 60000) { // Refresh if expires within 1 minute
      console.log('🔄 Token expired or expiring soon, attempting refresh...');
      const refreshSuccess = await refreshToken();
      if (refreshSuccess) {
        console.log('✅ Token refreshed successfully');
        // Get the new token
        const newTokenData = await chrome.storage.local.get(['accessToken']);
        options.accessToken = newTokenData.accessToken;
      } else {
        console.log('❌ Token refresh failed, user needs to reconnect');
        throw new Error('Authentication failed. Please reconnect to HubSpot.');
      }
    }
  } catch (error) {
    console.error('❌ Token check/refresh error:', error);
    throw new Error('Authentication failed. Please reconnect to HubSpot.');
  }
  
  const url = `https://api.hubapi.com${endpoint}`;
  const headers = {
    'Authorization': `Bearer ${options.accessToken}`,
    'Content-Type': 'application/json',
    ...options.headers
  };
  
  console.log('📤 Request URL:', url);
  console.log('📤 Request headers:', headers);
  console.log('🔍 Full request details:', {
    endpoint: endpoint,
    url: url,
    method: options.method || 'GET',
    body: options.body,
    options: options
  });
  
  try {
    const response = await fetch(url, { 
      ...options, 
      headers,
      signal: AbortSignal.timeout(30000)
    });
    
    console.log('📥 Response status:', response.status);
    console.log('📥 Response ok:', response.ok);
    
    if (!response.ok) {
      let errorData = {};
      try {
        errorData = await response.json();
      } catch (parseError) {
        errorData = { message: `HTTP ${response.status}: ${response.statusText}` };
      }
      
      console.error('❌ API response error:', errorData);
      console.error('❌ Response details:', {
        status: response.status,
        statusText: response.statusText,
        url: url,
        endpoint: endpoint,
        errorData: errorData
      });
      
      if (response.status === 403) {
        throw new Error('Access denied. Please check your HubSpot app permissions and reconnect.');
      } else if (response.status === 401) {
        throw new Error('Authentication failed. Please reconnect to HubSpot.');
      } else if (response.status === 404) {
        // Check if this is a record not found error
        if (endpoint.includes('/objects/') && endpoint.match(/\/\d+$/)) {
          throw new Error('Record not found. The record may have been deleted or you may not have access to it.');
        } else {
          throw new Error('API endpoint not found. This might be a custom object or the endpoint doesn\'t exist.');
        }
      } else if (errorData.message && errorData.message.includes('scopes')) {
        throw new Error('Insufficient permissions. Please update your HubSpot app scopes.');
      } else if (errorData.message && errorData.message.includes('expired')) {
        throw new Error('OAuth token expired. Please reconnect to HubSpot.');
      } else {
        throw new Error(errorData.message || `API request failed: ${response.status}`);
      }
    }
    
    const data = await response.json();
    console.log('📥 API response data:', data);
    return data;
  } catch (error) {
    console.error('❌ Background API call failed:', error);
    throw error;
  }
}

// Execute HubSpot Query Function
async function executeHubSpotQuery(query, portalId, accessToken) {
  try {
    console.log('🔍 Executing HubSpot query:', query);
    
    const { objectType, properties, limit, filters } = query;
    
    // Map object types to correct API endpoints
    let endpoint;
    switch (objectType) {
      case 'contacts':
        endpoint = '/crm/v3/objects/contacts';
        break;
      case 'companies':
        endpoint = '/crm/v3/objects/companies';
        break;
      case 'deals':
        endpoint = '/crm/v3/objects/deals';
        break;
      case 'tickets':
        endpoint = '/crm/v3/objects/tickets';
        break;
      case 'notes':
        endpoint = '/crm/v3/objects/notes';
        break;
      case 'meetings':
        endpoint = '/crm/v3/objects/meetings';
        break;
      case 'calls':
        endpoint = '/crm/v3/objects/calls';
        break;
      case 'emails':
        endpoint = '/crm/v3/objects/emails';
        break;
      case 'tasks':
        endpoint = '/crm/v3/objects/tasks';
        break;
      case 'custom':
        // For custom objects, the caller should pass the API name in objectType
        // e.g., objectType = 'p_customobject'
        endpoint = `/crm/v3/objects/${objectType}`;
        break;
      default:
        endpoint = `/crm/v3/objects/${objectType}`;
    }
    
    // Calculate pagination parameters
    const targetLimit = Number(limit) || 100000; // Default to 100k for truly unlimited feel
    const batchSize = 100; // HubSpot's hard limit per request
    const maxBatches = Math.ceil(targetLimit / batchSize);
    
    console.log(`📊 Pagination: Target ${targetLimit} records, max ${maxBatches} batches of ${batchSize}`);
    
    let allResults = [];
    let after = null; // Pagination cursor
    let batch = 1;
    
    // Fetch records in batches until no more data or limit reached
    while (true) {
      console.log(`📦 Fetching batch ${batch} (${allResults.length} records collected so far)`);
      
      const currentBatchSize = Math.min(batchSize, targetLimit - allResults.length);
      
      // If filters are present, use the search endpoint; otherwise use list endpoint
      let response;
      if (Array.isArray(filters) && filters.length > 0) {
        const searchUrl = `https://api.hubapi.com${endpoint}/search`;
        const body = {
          limit: currentBatchSize,
          properties: Array.isArray(properties) ? properties : [],
          filterGroups: filters,
          ...(after && { after }) // Add pagination cursor if available
        };
        console.log('📤 Search URL:', searchUrl);
        console.log('📦 Search body:', body);
        response = await fetch(searchUrl, {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${accessToken}`,
            'Content-Type': 'application/json'
          },
          body: JSON.stringify(body),
          signal: AbortSignal.timeout(60000) // Increase timeout for large queries
        });
      } else {
        const params = new URLSearchParams({
          limit: currentBatchSize.toString(),
          properties: (Array.isArray(properties) ? properties : []).join(',')
        });
        
        // Add pagination cursor if available
        if (after) {
          params.append('after', after);
        }
        
        const url = `https://api.hubapi.com${endpoint}?${params}`;
        console.log('📤 List URL:', url);
        response = await fetch(url, {
          method: 'GET',
          headers: {
            'Authorization': `Bearer ${accessToken}`,
            'Content-Type': 'application/json'
          },
          signal: AbortSignal.timeout(60000) // Increase timeout for large queries
        });
      }
      
      if (!response.ok) {
        let errorData = {};
        try {
          errorData = await response.json();
        } catch (parseError) {
          errorData = { message: `HTTP ${response.status}: ${response.statusText}` };
        }
        
        console.error('❌ Query API error:', errorData);
        throw new Error(errorData.message || `Query failed: ${response.status}`);
      }
      
      const data = await response.json();
      console.log(`✅ Batch ${batch} successful, got ${data.results?.length || 0} records`);
      
      // Add results to collection
      if (data.results && data.results.length > 0) {
        allResults.push(...data.results);
        console.log(`📊 Total records collected: ${allResults.length}`);
      }
      
      // Check if we have more pages
      if (data.paging && data.paging.next && data.paging.next.after) {
        after = data.paging.next.after;
        console.log(`📄 More pages available, next cursor: ${after.substring(0, 20)}...`);
      } else {
        console.log('📄 No more pages available - reached end of data');
        break;
      }
      
      // Check if we've reached our target limit
      if (allResults.length >= targetLimit) {
        console.log(`🎯 Reached target limit of ${targetLimit} records`);
        break;
      }
      
      // Safety check to prevent infinite loops
      if (batch > 100) {
        console.log('⚠️ Safety limit reached: stopping at 100 batches');
        break;
      }
      
      batch++;
      
      // Add small delay between requests to be respectful to the API
      await new Promise(resolve => setTimeout(resolve, 100));
    }
    
    console.log('✅ Query completed, total records fetched:', allResults.length);
    
    // Return the results
    return {
      success: true,
      data: {
        results: allResults,
        total: allResults.length,
        pagination: {
          batches: batch, // Actual batches executed
          targetLimit: targetLimit,
          actualLimit: allResults.length
        }
      }
    };
    
  } catch (error) {
    console.error('❌ Query execution error:', error);
    return {
      success: false,
      error: error.message
    };
  }
}