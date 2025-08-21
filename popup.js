// popup.js - Main extension logic
class HubSpotLens {
  constructor() {
    this.accessToken = null;
    this.portalId = null;
    this.currentResults = [];
    this.filterCounter = 1;
    this.themeController = null;
    this.init();
  }

  async init() {
    // Initialize theme controller
    await this.initializeTheme();
    
    this.setupEventListeners();
    await this.checkConnection();
    await this.loadObjectTypes();
  }

  async initializeTheme() {
    try {
      // Load saved theme
      await this.loadSavedTheme();
      
      // Simple theme toggle functionality
      this.setupThemeToggle();
      console.log('🎨 Theme system initialized');
    } catch (error) {
      console.error('❌ Failed to initialize theme system:', error);
    }
  }

  async loadSavedTheme() {
    try {
      const result = await chrome.storage.sync.get(['theme']);
      const savedTheme = result.theme || 'system';
      
      if (savedTheme !== 'system') {
        document.documentElement.setAttribute('data-theme', savedTheme);
        this.updateThemeToggle(savedTheme);
      }
      
      console.log('🎨 Loaded saved theme:', savedTheme);
    } catch (error) {
      console.error('❌ Failed to load saved theme:', error);
    }
  }

  setupThemeToggle() {
    const themeToggle = document.getElementById('theme-toggle');
    if (themeToggle) {
      themeToggle.addEventListener('click', () => {
        this.cycleTheme();
      });
    }
  }

  cycleTheme() {
    const root = document.documentElement;
    const currentTheme = root.getAttribute('data-theme') || 'system';
    
    let nextTheme;
    switch (currentTheme) {
      case 'light':
        nextTheme = 'dark';
        break;
      case 'dark':
        nextTheme = 'system';
        break;
      default:
        nextTheme = 'light';
    }
    
    root.setAttribute('data-theme', nextTheme);
    this.updateThemeToggle(nextTheme);
    
    // Save to storage
    chrome.storage.sync.set({ theme: nextTheme });
    
    console.log('🎨 Theme changed to:', nextTheme);
  }

  updateThemeToggle(theme) {
    const toggle = document.getElementById('theme-toggle');
    if (toggle) {
      const icon = toggle.querySelector('.theme-icon');
      const text = toggle.querySelector('.theme-text');
      
      if (icon) {
        icon.innerHTML = this.getThemeIcon(theme);
      }
      
      if (text) {
        text.textContent = this.getThemeText(theme);
      }
      
      toggle.title = `Current theme: ${this.getThemeText(theme)}. Click to cycle.`;
    }
  }

  getThemeIcon(theme) {
    switch (theme) {
      case 'light':
        return `<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z" />
        </svg>`;
      case 'dark':
        return `<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z" />
        </svg>`;
      case 'system':
      default:
        return `<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
        </svg>`;
    }
  }

  getThemeText(theme) {
    switch (theme) {
      case 'light':
        return 'Light';
      case 'dark':
        return 'Dark';
      case 'system':
      default:
        return 'System';
    }
  }

  setupEventListeners() {
    // Tab switching
    document.querySelectorAll('.tab').forEach(tab => {
      tab.addEventListener('click', () => this.switchTab(tab.dataset.tab));
    });

    // Query execution
    document.getElementById('execute-query').addEventListener('click', () => this.executeQuery());
    
    // Filter management
    document.getElementById('add-filter').addEventListener('click', () => this.addFilter());
    this.setupFilterEventListeners();

    // Multi-field selection
    document.getElementById('add-field').addEventListener('click', () => this.addSelectedField());
    this.setupFieldSelection();

    // Export buttons
    document.getElementById('export-csv').addEventListener('click', () => this.exportResults('csv'));
    document.getElementById('export-json').addEventListener('click', () => this.exportResults('json'));

    // Metadata
    document.getElementById('load-metadata').addEventListener('click', () => this.loadMetadata());

    // Reconnect
    document.getElementById('reconnect').addEventListener('click', () => this.startOAuth());

    // Object type change for metadata
    document.getElementById('metadata-object-type').addEventListener('change', () => {
      const container = document.getElementById('metadata-container');
      container.innerHTML = '';
    });
  }

  switchTab(tabName) {
    // Update active tab
    document.querySelectorAll('.tab').forEach(tab => tab.classList.remove('active'));
    document.querySelector(`[data-tab="${tabName}"]`).classList.add('active');

    // Update active content
    document.querySelectorAll('.tab-content').forEach(content => content.classList.remove('active'));
    document.getElementById(`${tabName}-tab`).classList.add('active');
  }

  async checkConnection() {
    const data = await chrome.storage.local.get(['accessToken', 'portalId']);
    this.accessToken = data.accessToken;
    this.portalId = data.portalId;

    this.updateConnectionStatus();
    this.updatePortalInfo();
  }

  updateConnectionStatus() {
    const statusDot = document.getElementById('status-dot');
    const statusText = document.getElementById('status-text');
    const connectionStatusValue = document.getElementById('connection-status-value');

    if (this.accessToken && this.portalId) {
      statusDot.className = 'status-dot connected';
      statusText.textContent = 'Connected';
      connectionStatusValue.textContent = 'Connected';
    } else {
      statusDot.className = 'status-dot disconnected';
      statusText.textContent = 'Disconnected';
      connectionStatusValue.textContent = 'Not connected';
    }
  }

  updatePortalInfo() {
    const portalIdValue = document.getElementById('portal-id-value');
    portalIdValue.textContent = this.portalId || '-';
  }

  async loadObjectTypes() {
    const objectTypeSelect = document.getElementById('object-type');
    const metadataObjectTypeSelect = document.getElementById('metadata-object-type');
    
    // Add change listener for object type to update filter field options
    objectTypeSelect.addEventListener('change', () => {
      this.updateFilterFieldOptions();
      this.updateFieldSelectorOptions();
    });
    
    if (!this.accessToken) {
      return;
    }

    try {
      // Try to get schemas first
      let objectTypes = [];
      try {
        const schemasResponse = await this.apiCall('/crm/v3/schemas');
        if (schemasResponse.results) {
          objectTypes = schemasResponse.results.map(schema => schema.objectTypeId);
        }
      } catch (error) {
        console.log('Schema endpoint failed, using discovery method');
      }

      // If schemas failed, use discovery method
      if (objectTypes.length === 0) {
        const commonObjects = [
          'contacts', 'companies', 'deals', 'tickets', 'emailmessages', 
          'calls', 'meetings', 'notes', 'tasks', 'emails', 'line_items', 
          'products', 'quotes', 'invoices', 'payments'
        ];

        for (const obj of commonObjects) {
          try {
            await this.apiCall(`/crm/v3/properties/${obj}`);
            objectTypes.push(obj);
          } catch (error) {
            // Object doesn't exist, skip
          }
        }

        // Try custom object patterns
        const customPatterns = ['custom_', 'hs_', 'hubspot_'];
        for (const pattern of customPatterns) {
          try {
            const response = await this.apiCall(`/crm/v3/properties/${pattern}test`);
            if (response.results) {
              objectTypes.push(pattern + 'test');
            }
          } catch (error) {
            // Pattern doesn't work, skip
          }
        }
      }

      // Fallback to hardcoded list if discovery fails
      if (objectTypes.length === 0) {
        objectTypes = ['contacts', 'companies', 'deals', 'tickets'];
      }

      // Populate selects
      const options = objectTypes.map(type => 
        `<option value="${type}">${type}</option>`
      ).join('');

      objectTypeSelect.innerHTML = '<option value="">Select object type...</option>' + options;
      metadataObjectTypeSelect.innerHTML = '<option value="">Select object type...</option>' + options;

    } catch (error) {
      console.error('Failed to load object types:', error);
      this.showMessage('Failed to load object types', 'error');
    }
  }

  async executeQuery() {
    const objectType = document.getElementById('object-type').value;
    const fields = this.getSelectedFields();
    const limit = document.getElementById('limit').value;

    console.log('🔍 Execute Query Debug:', { objectType, fields, limit });

    if (!objectType) {
      this.showMessage('Please select an object type', 'error');
      return;
    }

    if (!fields || fields.length === 0) {
      this.showMessage('Please select at least one field', 'error');
      return;
    }

    if (!this.accessToken) {
      this.showMessage('Please connect to HubSpot first', 'error');
      return;
    }

    try {
      this.showLoading();
      console.log('🚀 Starting query execution...');
      
      // Ensure we always include hs_object_id for proper record linking
      let fieldList = fields;
      if (!fieldList.includes('hs_object_id')) {
        fieldList.push('hs_object_id');
      }
      
      const filters = this.getFiltersForQuery();
      
      const queryBody = {
        properties: fieldList,
        limit: 100
      };

      // Add filters if any are specified
      if (filters.length > 0) {
        queryBody.filterGroups = this.buildFilterGroups(filters);
      }

      console.log('📋 Query body:', queryBody);

      let allResults = [];
      let after = null;
      let totalFetched = 0;
      const maxResults = limit === 'all' ? 10000 : parseInt(limit);
      const isLargeQuery = limit === 'all';

      console.log('📊 Query settings:', { maxResults, isLargeQuery });

      if (isLargeQuery) {
        console.log('📈 Showing progress bar for large query');
        this.showProgressBar();
      }

      do {
        if (after) {
          queryBody.after = after;
          console.log('🔄 Using pagination token:', after);
        }

        console.log('🌐 Making API call...');
        const response = await this.apiCall(`/crm/v3/objects/${objectType}/search`, {
          method: 'POST',
          body: JSON.stringify(queryBody)
        });

        console.log('📥 API Response:', response);

        // Handle different possible response structures
        let results = [];
        if (Array.isArray(response)) {
          results = response;
          console.log('📋 Response is direct array');
        } else if (Array.isArray(response.results)) {
          results = response.results;
          console.log('📋 Response has results array');
        } else if (response.data && Array.isArray(response.data)) {
          results = response.data;
          console.log('📋 Response has data array');
        } else {
          console.error('❌ Unexpected response structure:', response);
          throw new Error('API returned invalid results format');
        }

        console.log(`📊 Fetched ${results.length} results`);

        allResults = allResults.concat(results);
        totalFetched += results.length;
        
        // Update progress for large queries
        if (isLargeQuery) {
          console.log(`📈 Updating progress: ${totalFetched}/${maxResults}`);
          this.updateProgressBar(totalFetched, maxResults);
          
          // Add delay to avoid rate limiting
          if (totalFetched % 300 === 0) {
            console.log('⏳ Adding rate limit delay...');
            await this.delay(1000);
          }
        }

        after = response.paging?.next?.after;
        console.log('📄 Next page token:', after);
        
        // Stop if we've reached the limit or no more results
        if (totalFetched >= maxResults || !after) {
          console.log('🛑 Stopping pagination:', { totalFetched, maxResults, hasNextPage: !!after });
          break;
        }

      } while (after && totalFetched < maxResults);

      console.log(`✅ Query completed. Total results: ${allResults.length}`);
      this.hideProgressBar();
      this.currentResults = allResults;
      this.displayResults(allResults, fieldList);
      this.switchTab('results');
      
      if (isLargeQuery) {
        this.showMessage(`Successfully fetched ${allResults.length} records`, 'success');
      }
      
    } catch (error) {
      console.error('❌ Query execution failed:', error);
      this.hideProgressBar();
      this.showMessage(`Query failed: ${error.message}`, 'error');
    }
  }

  setupFilterEventListeners() {
    const container = document.getElementById('filters-container');
    container.addEventListener('click', (e) => {
      if (e.target.classList.contains('btn-remove-filter')) {
        this.removeFilter(e.target.closest('.filter-row'));
      }
    });
    
    // Add validation to existing filter rows
    const existingRows = container.querySelectorAll('.filter-row');
    existingRows.forEach(row => {
      const fieldSelect = row.querySelector('.filter-field');
      const valueInput = row.querySelector('.filter-value');
      
      if (fieldSelect) fieldSelect.addEventListener('change', () => this.validateFilterRow(row));
      if (valueInput) valueInput.addEventListener('input', () => this.validateFilterRow(row));
    });
    
    // Initial validation
    this.updateOperatorVisibility();
  }

  addFilter() {
    const container = document.getElementById('filters-container');
    const filterRow = document.createElement('div');
    filterRow.className = 'filter-row';
    filterRow.setAttribute('data-filter-id', this.filterCounter);

    const objectType = document.getElementById('object-type').value;
    const fieldsOptions = this.getFieldOptionsForObjectType(objectType);

    filterRow.innerHTML = `
      <div class="filter-fields">
        <select class="form-control filter-field" style="width: 35%;">
          <option value="">Field...</option>
          ${fieldsOptions}
        </select>
        <select class="form-control filter-operator-select" style="width: 20%;">
          <option value="EQ">= (exact)</option>
          <option value="CONTAINS_TOKEN">LIKE (contains)</option>
        </select>
        <input type="text" class="form-control filter-value" placeholder="Value" style="width: 30%;">
        <button type="button" class="btn-remove-filter" style="width: 12%; background: #dc3545; color: white; border: none; border-radius: 4px; padding: 6px; font-size: 11px;">×</button>
      </div>
      <div class="filter-operator" style="margin-top: 8px; display: none;">
        <span style="font-size: 12px; color: #6c757d;">Next:</span>
        <select class="form-control operator-select" style="width: 80px; font-size: 12px;">
          <option value="AND">AND</option>
          <option value="OR">OR</option>
        </select>
      </div>
    `;

    container.appendChild(filterRow);
    this.filterCounter++;
    this.updateOperatorVisibility();
    
    // Add event listeners for validation
    const fieldSelect = filterRow.querySelector('.filter-field');
    const valueInput = filterRow.querySelector('.filter-value');
    
    fieldSelect.addEventListener('change', () => this.validateFilterRow(filterRow));
    valueInput.addEventListener('input', () => this.validateFilterRow(filterRow));
  }

  removeFilter(filterRow) {
    const container = document.getElementById('filters-container');
    if (container.children.length > 1) {
      filterRow.remove();
      this.updateOperatorVisibility();
    } else {
      this.showMessage('At least one filter must remain', 'error');
    }
  }

  updateOperatorVisibility() {
    const filterRows = document.querySelectorAll('.filter-row');
    const filtersHeader = document.querySelector('.filters-header h3');
    
    // Update filter counter
    if (filtersHeader) {
      filtersHeader.setAttribute('data-filter-count', filterRows.length);
    }
    
    filterRows.forEach((row, index) => {
      const operatorDiv = row.querySelector('.filter-operator');
      if (index === filterRows.length - 1) {
        // Hide operator for the last filter
        operatorDiv.style.display = 'none';
      } else {
        // Show operator for all other filters
        operatorDiv.style.display = 'flex';
      }
      
      // Add validation classes
      this.validateFilterRow(row);
    });
  }

  validateFilterRow(row) {
    const field = row.querySelector('.filter-field').value;
    const value = row.querySelector('.filter-value').value.trim();
    
    row.classList.remove('valid', 'invalid');
    
    if (field && value) {
      row.classList.add('valid');
    } else if (field || value) {
      row.classList.add('invalid');
    }
    
    // Update active filters count
    this.updateActiveFiltersCount();
  }

  updateActiveFiltersCount() {
    const validFilters = document.querySelectorAll('.filter-row.valid');
    const filtersHeader = document.querySelector('.filters-header h3');
    
    if (filtersHeader) {
      const totalFilters = document.querySelectorAll('.filter-row').length;
      const activeFilters = validFilters.length;
      
      if (activeFilters > 0) {
        filtersHeader.setAttribute('data-filter-count', `${activeFilters}/${totalFilters}`);
        
        // Show success message when all filters are valid
        if (activeFilters === totalFilters && totalFilters > 1) {
          this.showMessage(`✅ All ${totalFilters} filters are properly configured!`, 'success');
        }
      } else {
        filtersHeader.setAttribute('data-filter-count', totalFilters);
      }
    }
  }

  getFieldOptionsForObjectType(objectType) {
    // Use the comprehensive field data from the API
    return this.getComprehensiveFieldOptions(objectType);
  }

  getComprehensiveFieldOptions(objectType) {
    // This will be populated by loadFieldsForObject
    if (this.fieldOptions && this.fieldOptions[objectType]) {
      return this.fieldOptions[objectType];
    }
    
    // Fallback to basic fields if API data not available
    const commonFields = {
      'contacts': [
        { name: 'firstname', label: 'First Name' },
        { name: 'lastname', label: 'Last Name' },
        { name: 'email', label: 'Email' },
        { name: 'phone', label: 'Phone' },
        { name: 'company', label: 'Company' },
        { name: 'website', label: 'Website' },
        { name: 'jobtitle', label: 'Job Title' },
        { name: 'createdate', label: 'Create Date' },
        { name: 'lastmodifieddate', label: 'Last Modified Date' }
      ],
      'companies': [
        { name: 'name', label: 'Company Name' },
        { name: 'domain', label: 'Domain' },
        { name: 'city', label: 'City' },
        { name: 'state', label: 'State' },
        { name: 'country', label: 'Country' },
        { name: 'industry', label: 'Industry' },
        { name: 'phone', label: 'Phone' },
        { name: 'createdate', label: 'Create Date' },
        { name: 'lastmodifieddate', label: 'Last Modified Date' }
      ],
      'deals': [
        { name: 'dealname', label: 'Deal Name' },
        { name: 'amount', label: 'Amount' },
        { name: 'dealstage', label: 'Deal Stage' },
        { name: 'pipeline', label: 'Pipeline' },
        { name: 'closedate', label: 'Close Date' },
        { name: 'dealtype', label: 'Deal Type' },
        { name: 'createdate', label: 'Create Date' },
        { name: 'lastmodifieddate', label: 'Last Modified Date' }
      ],
      'tickets': [
        { name: 'subject', label: 'Subject' },
        { name: 'content', label: 'Content' },
        { name: 'hs_pipeline_stage', label: 'Pipeline Stage' },
        { name: 'hs_ticket_priority', label: 'Priority' },
        { name: 'source_type', label: 'Source Type' },
        { name: 'createdate', label: 'Create Date' },
        { name: 'lastmodifieddate', label: 'Last Modified Date' }
      ]
    };

    const fields = commonFields[objectType] || commonFields['contacts'];
    return fields.map(field => 
      `<option value="${field.name}">${field.name} (${field.label})</option>`
    ).join('');
  }

  updateFilterFieldOptions() {
    const objectType = document.getElementById('object-type').value;
    
    // Use comprehensive field options if available
    let fieldsOptions;
    if (this.fieldOptions && this.fieldOptions[objectType]) {
      fieldsOptions = this.fieldOptions[objectType];
    } else {
      // Fallback to basic options
      fieldsOptions = this.getFieldOptionsForObjectType(objectType);
    }
    
    document.querySelectorAll('.filter-field').forEach(select => {
      const currentValue = select.value;
      select.innerHTML = `<option value="">Select field...</option>${fieldsOptions}`;
      select.value = currentValue; // Restore selected value if it exists
    });
  }

  getFiltersForQuery() {
    const filterRows = document.querySelectorAll('.filter-row');
    const filters = [];
    
    filterRows.forEach((row, index) => {
      const field = row.querySelector('.filter-field').value;
      const value = row.querySelector('.filter-value').value.trim();
      const filterOperator = row.querySelector('.filter-operator-select').value;
      const logicOperator = index < filterRows.length - 1 ? 
        row.querySelector('.operator-select').value : null;
      
      if (field && value) {
        filters.push({ field, value, filterOperator, logicOperator });
      }
    });
    
    return filters;
  }

  buildFilterGroups(filters) {
    // HubSpot API uses filterGroups structure
    // For now, we'll create groups based on OR operators
    const filterGroups = [];
    let currentGroup = { filters: [] };
    
    filters.forEach((filter, index) => {
      // Add current filter to current group
      currentGroup.filters.push({
        propertyName: filter.field,
        operator: filter.filterOperator, // Use the selected filter operator
        value: filter.value
      });
      
      // If this filter has an OR operator (or it's the last filter), close current group
      if (filter.logicOperator === 'OR' || index === filters.length - 1) {
        filterGroups.push(currentGroup);
        currentGroup = { filters: [] };
      }
      // AND operators keep adding to the same group
    });
    
    return filterGroups;
  }

  // Multi-field selection methods
  setupFieldSelection() {
    const selectedFieldsContainer = document.getElementById('selected-fields');
    if (selectedFieldsContainer) {
      selectedFieldsContainer.addEventListener('click', (e) => {
        if (e.target.classList.contains('remove-tag')) {
          const tag = e.target.closest('.field-tag');
          if (tag) {
            this.removeFieldTag(tag);
          }
        }
      });
    }
    
    // Add placeholder when no fields are selected
    this.updateFieldsPlaceholder();
  }

  addSelectedField() {
    const fieldSelector = document.getElementById('field-selector');
    const selectedField = fieldSelector.value;
    
    if (!selectedField) {
      this.showMessage('Please select a field first', 'error');
      return;
    }

    // Check if field is already selected
    const existingTags = document.querySelectorAll('.field-tag');
    for (let tag of existingTags) {
      if (tag.dataset.field === selectedField) {
        this.showMessage('Field already selected', 'error');
        return;
      }
    }

    this.createFieldTag(selectedField);
    fieldSelector.value = ''; // Reset selector
    this.updateFieldsPlaceholder();
  }

  createFieldTag(fieldName) {
    const container = document.getElementById('selected-fields');
    const tag = document.createElement('div');
    tag.className = 'field-tag';
    tag.dataset.field = fieldName;
    
    tag.innerHTML = `
      <span>${fieldName}</span>
      <button class="remove-tag" title="Remove field">×</button>
    `;
    
    container.appendChild(tag);
  }

  removeFieldTag(tag) {
    tag.remove();
    this.updateFieldsPlaceholder();
  }

  updateFieldsPlaceholder() {
    const container = document.getElementById('selected-fields');
    const existingPlaceholder = container.querySelector('.fields-placeholder');
    
    if (container.children.length === 0) {
      if (!existingPlaceholder) {
        const placeholder = document.createElement('div');
        placeholder.className = 'fields-placeholder';
        placeholder.textContent = 'No fields selected';
        container.appendChild(placeholder);
      }
    } else {
      if (existingPlaceholder) {
        existingPlaceholder.remove();
      }
    }
  }

  getSelectedFields() {
    const tags = document.querySelectorAll('.field-tag');
    return Array.from(tags).map(tag => tag.dataset.field);
  }

  updateFieldSelectorOptions() {
    const fieldSelector = document.getElementById('field-selector');
    const objectType = document.getElementById('object-type').value;
    
    if (!objectType) {
      fieldSelector.innerHTML = '<option value="">Select object type first...</option>';
      return;
    }

    // Use comprehensive field options if available
    if (this.fieldOptions && this.fieldOptions[objectType]) {
      fieldSelector.innerHTML = '<option value="">Select field...</option>' + this.fieldOptions[objectType];
    } else {
      // Fallback to basic options
      const fieldsOptions = this.getFieldOptionsForObjectType(objectType);
      fieldSelector.innerHTML = '<option value="">Select field...</option>' + fieldsOptions;
    }
  }

  async loadFieldsForObject(objectType) {
    if (!objectType || !this.accessToken) {
      return;
    }

    try {
      console.log('🔍 Loading fields for object type:', objectType);
      
      const response = await this.apiCall(`/crm/v3/properties/${objectType}`);
      console.log('📥 Properties response:', response);
      
      if (response.results) {
        // Store comprehensive field options for the field selector
        if (!this.fieldOptions) {
          this.fieldOptions = {};
        }
        
        const fieldOptions = response.results.map(prop => ({
          name: prop.name,
          label: prop.label || prop.name,
          type: prop.type || 'string'
        }));
        
        this.fieldOptions[objectType] = fieldOptions.map(field => 
          `<option value="${field.name}">${field.name} (${field.label})</option>`
        ).join('');
        
        console.log('📋 Stored', fieldOptions.length, 'fields for', objectType);
        
        // Update field selector options
        this.updateFieldSelectorOptions();
        this.updateFilterFieldOptions();
      }
    } catch (error) {
      console.error('❌ Failed to load fields for object type:', objectType, error);
    }
  }

  displayResults(results, fields) {
    const container = document.getElementById('results-container');
    const count = document.getElementById('results-count');
    const time = document.getElementById('results-time');

    if (!results || results.length === 0) {
      container.innerHTML = '<div class="loading"><p>📊 No results found</p></div>';
      count.textContent = '0 results';
      time.textContent = '';
      return;
    }

    // Create table
    let table = '<table class="results-table"><thead><tr>';
    table += '<th style="min-width: 140px;">Actions</th>';
    table += '<th>ID</th>';
    fields.forEach(field => {
      table += `<th>${field}</th>`;
    });
    table += '</tr></thead><tbody>';

    results.forEach(result => {
      table += '<tr>';
      
      // Add action buttons
      // Try multiple ID fields that HubSpot might use
      const recordId = result.id || result.hs_object_id || result.properties?.hs_object_id || result.properties?.id;
      const objectType = this.getObjectTypeFromResult(result);
      
      if (recordId && objectType && this.portalId) {
        const recordUrl = `https://app-eu1.hubspot.com/contacts/${this.portalId}/record/0-1/${recordId}`;
        const propertiesUrl = `https://app-eu1.hubspot.com/contacts/${this.portalId}/record/0-1/${recordId}/properties`;
        
        table += `<td style="text-align: center;">
          <button onclick="window.open('${recordUrl}', '_blank')" class="btn btn-secondary" style="margin-right: 4px; padding: 4px 8px; font-size: 12px;" title="Open Record">📄</button>
          <button onclick="window.open('${propertiesUrl}', '_blank')" class="btn btn-secondary" style="padding: 4px 8px; font-size: 12px;" title="Open Properties">⚙️</button>
        </td>`;
      } else {
        table += '<td>N/A</td>';
      }
      
      // Add ID column
      table += `<td style="font-weight: bold; background-color: #f8f9fa;">${recordId || 'N/A'}</td>`;
      
      // Add field values
      fields.forEach(field => {
        const value = result.properties?.[field] || result[field] || '';
        table += `<td>${this.escapeHtml(String(value))}</td>`;
      });
      
      table += '</tr>';
    });

    table += '</tbody></table>';
    container.innerHTML = table;

    count.textContent = `${results.length} results`;
    time.textContent = new Date().toLocaleTimeString();
  }

  getObjectTypeFromResult(result) {
    // Try to determine object type from the result
    const objectType = document.getElementById('object-type').value;
    if (objectType) {
      return objectType;
    }
    
    // Fallback: try to infer from properties
    if (result.properties) {
      if (result.properties.firstname || result.properties.lastname || result.properties.email) {
        return 'contacts';
      }
      if (result.properties.name && result.properties.domain) {
        return 'companies';
      }
      if (result.properties.dealname || result.properties.amount) {
        return 'deals';
      }
      if (result.properties.subject && result.properties.hs_pipeline_stage) {
        return 'tickets';
      }
    }
    
    // Default fallback
    return 'contacts';
  }

  escapeHtml(text) {
    const div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
  }

  async loadMetadata() {
    const objectType = document.getElementById('metadata-object-type').value;
    
    if (!objectType) {
      this.showMessage('Please select an object type', 'error');
      return;
    }

    if (!this.accessToken) {
      this.showMessage('Please connect to HubSpot first', 'error');
      return;
    }

    try {
      this.showLoading();
      const response = await this.apiCall(`/crm/v3/properties/${objectType}`);
      
      const container = document.getElementById('metadata-container');
      let html = `<div class="metadata-item"><h3>📋 ${objectType} Properties</h3>`;
      
      if (response.results) {
        response.results.forEach(prop => {
          html += `
            <div style="margin-bottom: 8px; padding: 8px; background: #f8f9fa; border-radius: 4px;">
              <p><strong>${prop.name}</strong> (${prop.type})</p>
              <p style="font-size: 12px; color: #6c757d;">${prop.description || 'No description'}</p>
            </div>
          `;
        });
      }
      
      html += '</div>';
      container.innerHTML = html;
      
    } catch (error) {
      console.error('Metadata loading failed:', error);
      this.showMessage(`Failed to load metadata: ${error.message}`, 'error');
    }
  }

  exportResults(format) {
    if (!this.currentResults || this.currentResults.length === 0) {
      this.showMessage('No results to export', 'error');
      return;
    }

    try {
      let content, filename, mimeType;

      if (format === 'csv') {
        const fields = Object.keys(this.currentResults[0].properties || this.currentResults[0]);
        const csvContent = [
          fields.join(','),
          ...this.currentResults.map(result => {
            const props = result.properties || result;
            return fields.map(field => {
              const value = props[field] || '';
              return `"${String(value).replace(/"/g, '""')}"`;
            }).join(',');
          })
        ].join('\n');

        content = csvContent;
        filename = `hubspot_export_${new Date().toISOString().split('T')[0]}.csv`;
        mimeType = 'text/csv';
      } else {
        content = JSON.stringify(this.currentResults, null, 2);
        filename = `hubspot_export_${new Date().toISOString().split('T')[0]}.json`;
        mimeType = 'application/json';
      }

      this.downloadFile(content, filename, mimeType);
      this.showMessage(`Exported ${this.currentResults.length} records as ${format.toUpperCase()}`, 'success');
      
    } catch (error) {
      console.error('Export failed:', error);
      this.showMessage(`Export failed: ${error.message}`, 'error');
    }
  }

  downloadFile(content, filename, mimeType) {
    const blob = new Blob([content], { type: mimeType });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = filename;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  }

  async apiCall(endpoint, options = {}) {
    if (!this.accessToken) {
      throw new Error('No access token available');
    }

    const url = `https://api.hubapi.com${endpoint}`;
    const headers = {
      'Authorization': `Bearer ${this.accessToken}`,
      'Content-Type': 'application/json',
      ...options.headers
    };

    const response = await fetch(url, {
      ...options,
      headers
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(errorData.message || `API request failed: ${response.status}`);
    }

    return response.json();
  }

  async startOAuth() {
    try {
      const response = await chrome.runtime.sendMessage({ type: 'startOAuth' });
      
      if (response.error) {
        this.showMessage(`OAuth failed: ${response.error}`, 'error');
        return;
      }

      if (response.success) {
        await this.checkConnection();
        await this.loadObjectTypes();
        this.showMessage('Successfully connected to HubSpot!', 'success');
      }
      
    } catch (error) {
      console.error('OAuth error:', error);
      this.showMessage(`OAuth failed: ${error.message}`, 'error');
    }
  }

  showLoading() {
    const container = document.getElementById('results-container');
    container.innerHTML = '<div class="loading"><p>⏳ Loading...</p></div>';
  }

  showMessage(message, type = 'info') {
    const container = document.getElementById('message-container');
    const messageEl = document.createElement('div');
    messageEl.className = `message ${type}`;
    messageEl.textContent = message;
    
    container.appendChild(messageEl);
    
    // Show message
    setTimeout(() => messageEl.classList.add('show'), 100);
    
    // Remove message after 3 seconds
    setTimeout(() => {
      messageEl.classList.remove('show');
      setTimeout(() => container.removeChild(messageEl), 300);
    }, 3000);
  }

  showProgressBar() {
    const container = document.getElementById('progress-container');
    const progressText = document.getElementById('progress-text');
    const progressCount = document.getElementById('progress-count');
    const progressBar = document.getElementById('progress-bar');
    
    container.style.display = 'block';
    progressText.textContent = 'Fetching records...';
    progressCount.textContent = '0 records';
    progressBar.style.width = '0%';
  }

  updateProgressBar(current, total) {
    const progressText = document.getElementById('progress-text');
    const progressCount = document.getElementById('progress-count');
    const progressBar = document.getElementById('progress-bar');
    
    const percentage = Math.min((current / total) * 100, 100);
    progressText.textContent = `Fetching records... (${Math.round(percentage)}%)`;
    progressCount.textContent = `${current} records`;
    progressBar.style.width = `${percentage}%`;
  }

  hideProgressBar() {
    const container = document.getElementById('progress-container');
    container.style.display = 'none';
  }

  delay(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
  }
}

// Initialize the app
document.addEventListener('DOMContentLoaded', () => {
  new HubSpotLens();
});