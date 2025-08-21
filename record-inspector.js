class RecordInspector {
  constructor() {
    this.accessToken = null;
    this.portalId = null;
    this.recordId = null;
    this.objectType = null;
    this.init();
  }

  async init() {
    console.log('🚀 Initializing Record Inspector...');
    
    // Get parameters from URL
    const urlParams = new URLSearchParams(window.location.search);
    this.recordId = urlParams.get('recordId');
    this.objectType = urlParams.get('objectType');
    this.portalId = urlParams.get('portalId');
    
    console.log('📋 Record Inspector parameters:', {
      recordId: this.recordId,
      objectType: this.objectType,
      portalId: this.portalId
    });
    
    // Debug: Log the full URL to see what we're working with
    console.log('🔗 Full URL:', window.location.href);
    console.log('🔍 URL search params:', window.location.search);
    
    if (!this.recordId || !this.objectType || !this.portalId) {
      this.showError('Missing required parameters. Please use the Record Inspector button from a HubSpot record page.');
      return;
    }
    
    // Get access token from storage
    const hasToken = await this.getAccessToken();
    
    if (!hasToken) {
      return;
    }
    
    // Load record data
    await this.loadRecordData();
    
    // Setup search functionality
    this.setupSearch();
  }

  async getAccessToken() {
    try {
      const data = await chrome.storage.local.get(['accessToken']);
      this.accessToken = data.accessToken;
      console.log('🔑 Access token retrieved:', !!this.accessToken);
      
      if (!this.accessToken) {
        console.error('❌ No access token found in storage');
        this.showError('No access token found. Please reconnect to HubSpot in the main inspector.');
        return false;
      }
      
      return true;
    } catch (error) {
      console.error('❌ Failed to get access token:', error);
      this.showError('Failed to retrieve access token. Please reconnect to HubSpot.');
      return false;
    }
  }

  async loadRecordData() {
    try {
      console.log('🔍 Loading record data...');
      console.log('📋 Parameters:', { objectType: this.objectType, recordId: this.recordId, portalId: this.portalId });
      
      // Try to get available schemas first to validate object type
      try {
        const schemasResponse = await this.apiCall('/crm/v3/schemas');
        console.log('📋 Available schemas:', schemasResponse);
        
        if (schemasResponse && schemasResponse.results) {
          const availableObjectTypes = schemasResponse.results.map(schema => schema.objectTypeId);
          console.log('📋 Available object types:', availableObjectTypes);
          
          if (!availableObjectTypes.includes(this.objectType)) {
            console.warn('⚠️ Object type not found in schemas, trying to find correct type...');
            
            // Try alternative object type names for tickets
            if (this.objectType === 'tickets') {
              const alternativeTypes = ['ticket', 'support_tickets', 'support_ticket'];
              for (const altType of alternativeTypes) {
                if (availableObjectTypes.includes(altType)) {
                  console.log(`🔄 Found alternative object type: ${altType}`);
                  this.objectType = altType;
                  break;
                }
              }
            }
            
            // If still not found, try to find any object type that might work with this record ID
            if (!availableObjectTypes.includes(this.objectType)) {
              console.log('🔍 Trying to find correct object type by testing available types...');
              
              // Try each available object type to see which one works
              for (const testObjectType of availableObjectTypes) {
                try {
                  console.log(`🧪 Testing object type: ${testObjectType}`);
                  const testResponse = await this.apiCall(`/crm/v3/objects/${testObjectType}/${this.recordId}`);
                  if (testResponse && testResponse.id) {
                    console.log(`✅ Found working object type: ${testObjectType}`);
                    this.objectType = testObjectType;
                    break;
                  }
                } catch (testError) {
                  console.log(`❌ ${testObjectType} failed:`, testError.message);
                }
              }
            }
          }
        }
      } catch (schemaError) {
        console.warn('⚠️ Could not fetch schemas, continuing with direct API call...');
      }
      
      // Get record data
      const recordEndpoint = `/crm/v3/objects/${this.objectType}/${this.recordId}`;
      console.log('🔗 Record endpoint:', recordEndpoint);
      
      const recordResponse = await this.apiCall(recordEndpoint);
      console.log('📥 Record response:', recordResponse);
      
      // Get field metadata
      const fieldsEndpoint = `/crm/v3/properties/${this.objectType}`;
      console.log('🔗 Fields endpoint:', fieldsEndpoint);
      
      const fieldsResponse = await this.apiCall(fieldsEndpoint);
      console.log('📋 Fields response:', fieldsResponse);
      
      if (recordResponse && fieldsResponse) {
        this.displayRecordFields(recordResponse, fieldsResponse.results || []);
        this.updateRecordInfo();
        this.hideLoading();
      } else {
        this.showError('Failed to load record data');
      }
    } catch (error) {
      console.error('❌ Failed to load record data:', error);
      
      // Provide more specific error messages
      let errorMessage = 'Failed to load record data';
      if (error.message.includes('404')) {
        errorMessage = `API endpoint not found. This might be a custom object or the endpoint doesn't exist for object type: ${this.objectType}`;
      } else if (error.message.includes('401')) {
        errorMessage = 'Authentication failed. Please reconnect to HubSpot.';
      } else if (error.message.includes('403')) {
        errorMessage = 'Access denied. You may not have permission to view this object type.';
      } else {
        errorMessage = error.message;
      }
      
      this.showError(errorMessage);
    }
  }

  displayRecordFields(record, fields) {
    const tbody = document.getElementById('fields-tbody');
    const table = document.getElementById('fields-table');
    
    if (!tbody || !table) return;

    const properties = record.properties || {};
    const fieldsMap = {};
    
    // Create a map of field metadata
    fields.forEach(field => {
      fieldsMap[field.name] = {
        label: field.label || field.name,
        type: field.type || 'string'
      };
    });

    let html = '';
    
    // Display ALL fields from the properties endpoint, not just those with values
    fields.forEach(field => {
      const apiName = field.name;
      const value = properties[apiName]; // This will be undefined if field has no value
      const fieldInfo = {
        label: field.label || field.name,
        type: field.type || 'string'
      };
      
      html += `
        <tr class="field-row" data-field="${apiName}">
          <td class="api-name">${this.escapeHtml(apiName)}</td>
          <td class="field-name">${this.escapeHtml(fieldInfo.label)}</td>
          <td class="field-type">${this.escapeHtml(fieldInfo.type)}</td>
          <td class="field-value">${this.formatFieldValue(value)}</td>
        </tr>
      `;
    });

    tbody.innerHTML = html;
    table.style.display = 'table';
  }

  formatFieldValue(value) {
    if (value === null || value === undefined) {
      return '<span class="null-value">null</span>';
    }
    
    if (typeof value === 'object') {
      return `<span class="object-value">${this.escapeHtml(JSON.stringify(value))}</span>`;
    }
    
    if (typeof value === 'string' && value.includes('T') && value.includes('Z')) {
      // Format dates
      try {
        const date = new Date(value);
        return `<span class="date-value">${date.toLocaleString()}</span>`;
      } catch (e) {
        return this.escapeHtml(String(value));
      }
    }
    
    return this.escapeHtml(String(value));
  }

  updateRecordInfo() {
    const recordIdDisplay = document.getElementById('record-id-display');
    const recordTypeDisplay = document.getElementById('record-type-display');
    
    if (recordIdDisplay) {
      recordIdDisplay.textContent = `Record ID: ${this.recordId}`;
    }
    
    if (recordTypeDisplay) {
      recordTypeDisplay.textContent = `Type: ${this.objectType}`;
    }
  }

  setupSearch() {
    const searchInput = document.getElementById('search-input');
    if (!searchInput) return;

    searchInput.addEventListener('input', (e) => {
      const searchTerm = e.target.value.toLowerCase();
      const rows = document.querySelectorAll('.field-row');
      
      rows.forEach(row => {
        const apiName = row.querySelector('.api-name').textContent.toLowerCase();
        const fieldName = row.querySelector('.field-name').textContent.toLowerCase();
        const fieldType = row.querySelector('.field-type').textContent.toLowerCase();
        const value = row.querySelector('.field-value').textContent.toLowerCase();
        
        const matches = apiName.includes(searchTerm) || 
                       fieldName.includes(searchTerm) || 
                       fieldType.includes(searchTerm) || 
                       value.includes(searchTerm);
        
        row.style.display = matches ? '' : 'none';
      });
    });
  }

  async apiCall(endpoint, options = {}) {
    const baseUrl = 'https://api.hubapi.com';
    const url = `${baseUrl}${endpoint}`;
    
    const defaultOptions = {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${this.accessToken}`,
        'Content-Type': 'application/json'
      }
    };
    
    const finalOptions = { ...defaultOptions, ...options };
    
    console.log('🌐 Making API call:', url);
    console.log('🔑 Using access token:', this.accessToken ? 'Available' : 'Missing');
    console.log('📋 Request options:', finalOptions);
    
    try {
      const response = await fetch(url, finalOptions);
      
      console.log('📥 Response status:', response.status);
      console.log('📥 Response headers:', Object.fromEntries(response.headers.entries()));
      
      if (!response.ok) {
        const errorText = await response.text();
        console.error('❌ Response error text:', errorText);
        throw new Error(`HTTP ${response.status}: ${response.statusText} - ${errorText}`);
      }
      
      const data = await response.json();
      console.log('📥 API response:', data);
      return data;
    } catch (error) {
      console.error('❌ API call failed:', error);
      throw error;
    }
  }

  escapeHtml(text) {
    const div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
  }

  showError(message) {
    const errorDiv = document.getElementById('error');
    const errorMessage = document.getElementById('error-message');
    const loadingDiv = document.getElementById('loading');
    
    if (errorDiv && errorMessage) {
      errorMessage.textContent = message;
      errorDiv.style.display = 'block';
    }
    
    if (loadingDiv) {
      loadingDiv.style.display = 'none';
    }
  }

  hideLoading() {
    const loadingDiv = document.getElementById('loading');
    if (loadingDiv) {
      loadingDiv.style.display = 'none';
    }
  }
}

// Initialize the Record Inspector
document.addEventListener('DOMContentLoaded', () => {
  new RecordInspector();
}); 