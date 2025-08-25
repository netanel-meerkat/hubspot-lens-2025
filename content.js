// HubSpot Lens - Clean Content Script
console.log('🔍 HubSpot Lens initializing...');

// ===== QUICK LINKS FUNCTIONS - DEFINED AT THE VERY TOP =====
// These functions must be defined before any HTML is rendered

// Simple modal function that works immediately
function createQuickLinkDialog(slotIndex = null) {
  console.log('🔗 Creating quick link dialog for slot:', slotIndex);
  
  // Clean up ALL existing modals first
  window.cleanupAllModals();
  
  // Create a simple modal that works immediately
  const modal = document.createElement('div');
  modal.id = 'quicklink-dialog';
  modal.style.cssText = `
    position: fixed;
    top: 0;
    left: 0;
    width: 100vw;
    height: 100vh;
    background: rgba(0,0,0,0.5);
    z-index: 100000;
    display: flex;
    align-items: center;
    justify-content: center;
    padding: 20px;
  `;
  
  const modalContent = document.createElement('div');
  modalContent.style.cssText = `
    background: white;
    border-radius: 12px;
    max-width: 500px;
    width: 100%;
    padding: 20px;
    text-align: center;
  `;
  
  modalContent.innerHTML = `
    <h3 style="margin: 0 0 20px 0; color: #1e293b;">Add Quick Link</h3>
    <p style="color: #6b7280; margin-bottom: 20px;">Quick Links system is loading...</p>
    <button onclick="this.parentElement.parentElement.parentElement.remove()" style="
      background: #8b5cf6;
      color: white;
      border: none;
      padding: 10px 20px;
      border-radius: 6px;
      cursor: pointer;
    ">Close</button>
  `;
  
  modal.appendChild(modalContent);
  document.body.appendChild(modal);
  
  // Try to load the full modal after a short delay
  setTimeout(() => {
    if (window.QUICK_LINKS) {
      modal.remove();
      createFullQuickLinkDialog(slotIndex);
    }
  }, 1000);
}

// Full modal function that requires QUICK_LINKS to be ready
async function createFullQuickLinkDialog(slotIndex = null) {
  try {
    console.log('🔗 Creating full quick link dialog for slot:', slotIndex);
    
    // Clean up ALL existing modals first
    window.cleanupAllModals();
    
    // Check if QUICK_LINKS is available
    if (!window.QUICK_LINKS) {
      console.error('❌ QUICK_LINKS not available yet');
      alert('Quick Links system not ready. Please try again in a moment.');
      return;
    }
    
    // Get current quick links to filter out already used ones
    const currentQuickLinks = await window.QUICK_LINKS.getQuickLinks();
    const usedUrls = currentQuickLinks.map(link => link.url);
    
    // Filter out already used common pages
    const availableCommonPages = window.QUICK_LINKS.commonPages.filter(page => !usedUrls.includes(page.url));
    
    // Create the full modal here
    const modal = document.createElement('div');
    modal.id = 'quicklink-full-dialog';
    modal.style.cssText = `
      position: fixed;
      top: 0;
      left: 0;
      width: 100vw;
      height: 100vh;
      background: rgba(0,0,0,0.5);
      z-index: 100000;
      display: flex;
      align-items: center;
      justify-content: center;
      padding: 20px;
    `;
    
    const modalContent = document.createElement('div');
    modalContent.style.cssText = `
      background: white;
      border-radius: 12px;
      max-width: 500px;
      width: 100%;
      max-height: 80vh;
      overflow: hidden;
      box-shadow: 0 20px 40px rgba(0,0,0,0.3);
    `;
    
    modalContent.innerHTML = `
      <div style="
        background: linear-gradient(135deg, #8b5cf6 0%, #7c3aed 100%);
        color: white;
        padding: 20px;
        display: flex;
        justify-content: space-between;
        align-items: center;
      ">
        <h3 style="margin: 0; font-size: 18px;">Quick Link Manager</h3>
        <button id="close-full-dialog" style="
          background: rgba(255,255,255,0.2);
          border: none;
          color: white;
          font-size: 20px;
          cursor: pointer;
          padding: 8px;
          width: 36px;
          height: 36px;
          border-radius: 8px;
        ">×</button>
      </div>
      
      <div style="padding: 20px; display: flex; flex-direction: column; gap: 24px; max-height: 70vh;">
        <!-- Top Half: Custom Link Form -->
        <div>
          <h4 style="margin: 0 0 16px 0; color: #1e293b; font-size: 16px;">🔗 Create your own:</h4>
          <div style="display: flex; flex-direction: column; gap: 12px;">
            <input type="text" id="custom-link-name" placeholder="Link name (e.g., My Custom Page)" style="
              padding: 10px 12px;
              border: 1px solid #d1d5db;
              border-radius: 6px;
              font-size: 14px;
            ">
            <input type="text" id="custom-link-description" placeholder="Description (optional)" style="
              padding: 10px 12px;
              border: 1px solid #d1d5db;
              border-radius: 6px;
              font-size: 14px;
            ">
            <input type="url" id="custom-link-url" placeholder="https://app.hubspot.com/... or https://app-eu1.hubspot.com/..." style="
              padding: 10px 12px;
              border: 1px solid #d1d5db;
              border-radius: 6px;
              font-size: 14px;
            ">
            
            <!-- Color Selection -->
            <div>
              <label style="display: block; margin-bottom: 6px; color: #374151; font-size: 14px;">Choose color (optional):</label>
              <div style="display: flex; gap: 8px; flex-wrap: wrap;">
                <button type="button" class="color-option" data-color="" style="
                  width: 30px; height: 30px; border-radius: 50%; border: 2px solid #e5e7eb; 
                  background: #f8fafc; cursor: pointer; transition: all 0.2s ease;
                " title="Default"></button>
                <button type="button" class="color-option" data-color="#fef3c7" style="
                  width: 30px; height: 30px; border-radius: 50%; border: 2px solid #e5e7eb; 
                  background: #fef3c7; cursor: pointer; transition: all 0.2s ease;
                " title="Yellow"></button>
                <button type="button" class="color-option" data-color="#dbeafe" style="
                  width: 30px; height: 30px; border-radius: 50%; border: 2px solid #e5e7eb; 
                  background: #dbeafe; cursor: pointer; transition: all 0.2s ease;
                " title="Blue"></button>
                <button type="button" class="color-option" data-color="#d1fae5" style="
                  width: 30px; height: 30px; border-radius: 50%; border: 2px solid #e5e7eb; 
                  background: #d1fae5; cursor: pointer; transition: all 0.2s ease;
                " title="Green"></button>
                <button type="button" class="color-option" data-color="#fce7f3" style="
                  width: 30px; height: 30px; border-radius: 50%; border: 2px solid #e5e7eb; 
                  background: #fce7f3; cursor: pointer; transition: all 0.2s ease;
                " title="Pink"></button>
                <button type="button" class="color-option" data-color="#f3e8ff" style="
                  width: 30px; height: 30px; border-radius: 50%; border: 2px solid #e5e7eb; 
                  background: #f3e8ff; cursor: pointer; transition: all 0.2s ease;
                " title="Purple"></button>
                <button type="button" class="color-option" data-color="#fed7d7" style="
                  width: 30px; height: 30px; border-radius: 50%; border: 2px solid #e5e7eb; 
                  background: #fed7d7; cursor: pointer; transition: all 0.2s ease;
                " title="Red"></button>
                <button type="button" class="color-option" data-color="#e0e7ff" style="
                  width: 30px; height: 30px; border-radius: 50%; border: 2px solid #e5e7eb; 
                  background: #e0e7ff; cursor: pointer; transition: all 0.2s ease;
                " title="Indigo"></button>
              </div>
            </div>
            
            <button id="add-custom-link-btn" style="
              background: linear-gradient(135deg, #8b5cf6 0%, #7c3aed 100%);
              color: white;
              border: none;
              padding: 12px;
              border-radius: 6px;
              cursor: pointer;
              font-size: 14px;
              font-weight: 500;
            ">Add Custom Link</button>
          </div>
        </div>
        
        <!-- Bottom Half: Quick Suggestions -->
        <div>
          <h4 style="margin: 0 0 12px 0; color: #1e293b; font-size: 16px;">💡 Quick suggestions:</h4>
          ${availableCommonPages.length > 0 ? `
            <div id="suggestions-container">
              <!-- Initial grid view (first 4 suggestions) -->
              <div id="initial-suggestions" style="display: grid; grid-template-columns: 1fr 1fr; gap: 8px; margin-bottom: 12px;">
                ${availableCommonPages.slice(0, 4).map(page => `
                  <button class="common-page-btn" data-name="${page.name}" data-url="${page.url}" data-icon="${page.icon}" style="
                    background: #f8fafc;
                    border: 1px solid #e2e8f0;
                    padding: 8px 10px;
                    border-radius: 6px;
                    cursor: pointer;
                    text-align: left;
                    transition: all 0.2s ease;
                    display: flex;
                    align-items: center;
                    gap: 8px;
                    min-width: 0;
                  " onmouseover="this.style.background='#f1f5f9'" onmouseout="this.style.background='#f8fafc'">
                    <span style="font-size: 14px; flex-shrink: 0;">${page.icon}</span>
                    <div style="flex: 1; min-width: 0;">
                      <div style="font-weight: 500; color: #1e293b; font-size: 12px; margin-bottom: 1px; white-space: nowrap; overflow: hidden; text-overflow: ellipsis;">${page.name}</div>
                      <div style="font-size: 10px; color: #6b7280; white-space: nowrap; overflow: hidden; text-overflow: ellipsis;">${page.url}</div>
                    </div>
                  </button>
                `).join('')}
              </div>
              
              <!-- Expanded view (initially hidden) -->
              <div id="expanded-suggestions" style="display: none;">
                <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 8px; max-height: 300px; overflow-y: auto;">
                  ${availableCommonPages.map(page => `
                    <button class="common-page-btn" data-name="${page.name}" data-url="${page.url}" data-icon="${page.icon}" style="
                      background: #f8fafc;
                      border: 1px solid #e2e8f0;
                      padding: 8px 10px;
                      border-radius: 6px;
                      cursor: pointer;
                      text-align: left;
                      transition: all 0.2s ease;
                      display: flex;
                      align-items: center;
                      gap: 8px;
                      min-width: 0;
                    " onmouseover="this.style.background='#f1f5f9'" onmouseout="this.style.background='#f8fafc'">
                      <span style="font-size: 14px; flex-shrink: 0;">${page.icon}</span>
                      <div style="flex: 1; min-width: 0;">
                        <div style="font-weight: 500; color: #1e293b; font-size: 12px; margin-bottom: 1px; white-space: nowrap; overflow: hidden; text-overflow: ellipsis;">${page.name}</div>
                        <div style="font-size: 10px; color: #6b7280; white-space: nowrap; overflow: hidden; text-overflow: ellipsis;">${page.url}</div>
                      </div>
                    </button>
                  `).join('')}
                </div>
              </div>
              
              <!-- Show More/Less Button (if there are more than 4 suggestions) -->
              ${availableCommonPages.length > 4 ? `
                <button id="toggle-suggestions" style="
                  background: #f3f4f6;
                  border: 1px solid #d1d5db;
                  padding: 8px 16px;
                  border-radius: 6px;
                  cursor: pointer;
                  font-size: 12px;
                  color: #374151;
                  transition: all 0.2s ease;
                  width: 100%;
                " onmouseover="this.style.background='#e5e7eb'" onmouseout="this.style.background='#f3f4f6'">
                  Show ${availableCommonPages.length - 4} more suggestions
                </button>
              ` : ''}
            </div>
          ` : '<div style="text-align: center; color: #6b7280; padding: 20px; font-style: italic;">No suggestions available</div>'}
        </div>
      </div>
    `;
    
    modal.appendChild(modalContent);
    document.body.appendChild(modal);
    
    // Add event listeners for the modal
    addFullDialogEventListeners(modal, slotIndex);
    
  } catch (error) {
    console.error('❌ Error creating full quick link dialog:', error);
    alert('Error creating quick link dialog. Please try again.');
  }
}

// Remove quick link function
async function removeQuickLinkItem(linkId) {
  if (confirm('Are you sure you want to remove this quick link?')) {
    try {
      if (!window.QUICK_LINKS) {
        alert('Quick Links system not ready. Please try again.');
        return;
      }
      await window.QUICK_LINKS.removeQuickLink(linkId);
      window.QUICK_LINKS.updateUI();
      alert('Quick link removed successfully!');
    } catch (error) {
      alert('Error removing quick link: ' + error.message);
    }
  }
}

// Add event listeners for quick link elements
function addQuickLinkEventListeners() {
  // Add click listener for save current page button
      const saveCurrentPageBtn = document.getElementById('save-current-page-btn');
    if (saveCurrentPageBtn) {
      // Remove any existing event listeners first
      const newBtn = saveCurrentPageBtn.cloneNode(true);
      saveCurrentPageBtn.parentNode.replaceChild(newBtn, saveCurrentPageBtn);
      
      // Add the event listener to the new button
      newBtn.addEventListener('click', function() {
        saveCurrentPageAsQuickLink();
      });
      
      // Store reference to the new button for future use
      window.currentSaveButton = newBtn;
    }
  
  // Add click listeners for empty slots
  const emptySlots = document.querySelectorAll('.quicklink-slot.empty');
  emptySlots.forEach(slot => {
    slot.addEventListener('click', function() {
      const slotIndex = parseInt(this.getAttribute('data-slot-index'));
      createFullQuickLinkDialog(slotIndex);
    });
  });
  
  // Add click listeners for remove buttons (only the remove button, not the whole slot)
  const removeButtons = document.querySelectorAll('.remove-quicklink-btn');
  removeButtons.forEach(button => {
    button.addEventListener('click', async function(e) {
      e.stopPropagation(); // Prevent triggering the link click
      e.preventDefault(); // Prevent any default behavior
      
      // Add click animation
      this.style.transform = 'scale(0.95)';
      setTimeout(() => {
        this.style.transform = 'scale(1)';
      }, 150);
      
      const linkId = this.getAttribute('data-link-id');
      console.log('🗑️ Removing quick link:', linkId);
      
      const success = await QUICK_LINKS.removeQuickLink(linkId);
      if (success) {
        QUICK_LINKS.updateUI();
        // Visual feedback: briefly highlight the slot before it disappears
        const slot = this.closest('.quicklink-slot');
        if (slot) {
          slot.style.background = '#fef2f2';
          slot.style.borderColor = '#fecaca';
          setTimeout(() => {
            slot.style.transition = 'all 0.3s ease';
            slot.style.opacity = '0';
            slot.style.transform = 'translateX(20px)';
          }, 100);
        }
      }
    });
  });
  
  // Add click listeners for link content (to open URLs)
  const linkContents = document.querySelectorAll('.quicklink-content');
  linkContents.forEach(content => {
    content.addEventListener('click', function(e) {
      e.stopPropagation(); // Prevent triggering drag
      const url = this.getAttribute('data-url');
      if (url) {
        window.open(url, '_blank');
      }
    });
  });
}

// Add event listeners for move buttons
function addMoveButtonEventListeners() {
  // Move up buttons
  document.querySelectorAll('.move-up-btn').forEach(btn => {
    btn.addEventListener('click', async function(e) {
      e.preventDefault();
      e.stopPropagation();
      
      const linkId = this.getAttribute('data-link-id');
      const currentSlot = parseInt(this.getAttribute('data-slot'));
      
      if (currentSlot > 0) {
        // Add click animation
        this.style.transform = 'scale(0.95)';
        setTimeout(() => {
          this.style.transform = 'scale(1)';
        }, 150);
        
        console.log('⬆️ Moving link up:', linkId, 'from slot', currentSlot, 'to slot', currentSlot - 1);
        await moveQuickLink(currentSlot, currentSlot - 1);
      }
    });
  });
  
  // Move down buttons
  document.querySelectorAll('.move-down-btn').forEach(btn => {
    btn.addEventListener('click', async function(e) {
      e.preventDefault();
      e.stopPropagation();
      
      const linkId = this.getAttribute('data-link-id');
      const currentSlot = parseInt(this.getAttribute('data-slot'));
      
      if (currentSlot < 9) {
        // Add click animation
        this.style.transform = 'scale(0.95)';
        setTimeout(() => {
          this.style.transform = 'scale(1)';
        }, 150);
        
        console.log('⬇️ Moving link down:', linkId, 'from slot', currentSlot, 'to slot', currentSlot + 1);
        await moveQuickLink(currentSlot, currentSlot + 1);
      }
    });
  });
}

// Add event listeners for the full quick link dialog
function addFullDialogEventListeners(modal, slotIndex) {
  // Close button
  const closeBtn = document.getElementById('close-full-dialog');
  if (closeBtn) {
    closeBtn.addEventListener('click', () => {
      modal.remove();
    });
  }
  
  // Close on outside click
  modal.addEventListener('click', (e) => {
    if (e.target === modal) {
      modal.remove();
    }
  });
  
  // Common page buttons
  const commonPageBtns = modal.querySelectorAll('.common-page-btn');
  commonPageBtns.forEach(btn => {
    btn.addEventListener('click', async function() {
      const name = this.getAttribute('data-name');
      const url = this.getAttribute('data-url');
      const icon = this.getAttribute('data-icon');
      
      try {
        await window.QUICK_LINKS.addQuickLink(name, url, icon);
        window.QUICK_LINKS.updateUI();
        modal.remove();
        alert('Quick link added successfully!');
      } catch (error) {
        alert('Error adding quick link: ' + error.message);
      }
    });
  });
  
  // Color selection
  let selectedColor = '';
  const colorOptions = modal.querySelectorAll('.color-option');
  colorOptions.forEach(option => {
    option.addEventListener('click', function() {
      // Remove selection from all options
      colorOptions.forEach(opt => opt.style.border = '2px solid #e5e7eb');
      // Select this option
      this.style.border = '2px solid #8b5cf6';
      selectedColor = this.getAttribute('data-color');
    });
  });
  
  // Custom link button
  const addCustomBtn = document.getElementById('add-custom-link-btn');
  if (addCustomBtn) {
    addCustomBtn.addEventListener('click', async function() {
      const nameInput = document.getElementById('custom-link-name');
      const descriptionInput = document.getElementById('custom-link-description');
      const urlInput = document.getElementById('custom-link-url');
      
      const name = nameInput.value.trim();
      const description = descriptionInput.value.trim();
      const url = urlInput.value.trim();
      
      if (!name || !url) {
        alert('Please fill in both name and URL fields.');
        return;
      }
      
      try {
        this.textContent = 'Adding...';
        this.disabled = true;
        
        await window.QUICK_LINKS.addQuickLink(name, url, '🔗', description, selectedColor);
        window.QUICK_LINKS.updateUI();
        modal.remove();
        alert('Custom quick link added successfully!');
      } catch (error) {
        alert('Error adding custom quick link: ' + error.message);
      } finally {
        this.textContent = 'Add Custom Link';
        this.disabled = false;
      }
    });
  }
  
  // Allow Enter key for custom link inputs
  const customInputs = ['custom-link-name', 'custom-link-url'];
  customInputs.forEach(id => {
    const input = document.getElementById(id);
    if (input) {
      input.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') {
          addCustomBtn.click();
        }
      });
    }
  });
  
  // Toggle Suggestions button
  const toggleBtn = document.getElementById('toggle-suggestions');
  if (toggleBtn) {
    toggleBtn.addEventListener('click', function() {
      const initialView = document.getElementById('initial-suggestions');
      const expandedView = document.getElementById('expanded-suggestions');
      
      if (expandedView.style.display === 'none') {
        // Show expanded view
        initialView.style.display = 'none';
        expandedView.style.display = 'block';
        this.textContent = 'Show less';
      } else {
        // Show initial view
        initialView.style.display = 'grid';
        expandedView.style.display = 'none';
        const totalSuggestions = expandedView.querySelectorAll('.common-page-btn').length;
        this.textContent = `Show ${totalSuggestions - 4} more suggestions`;
      }
    });
  }
}

// Initialize global selected properties at the very top
if (typeof window.selectedProperties === 'undefined') {
  window.selectedProperties = new Set();
  console.log('🔧 Initialized global selectedProperties');
}



// Global functions for query cache operations - must be defined at top level
async function loadSavedQuery(queryId) {
  try {
    console.log('🔍 Loading query with ID:', queryId);
    
    // Check if QUERY_CACHE is available
    if (typeof QUERY_CACHE === 'undefined') {
      console.error('❌ QUERY_CACHE not available yet');
      showQueryLoadStatus('error', 'Query cache not ready. Please try again in a moment.');
      return;
    }
    
    console.log('🔍 QUERY_CACHE object:', QUERY_CACHE);
    
    const query = await QUERY_CACHE.loadQuery(queryId);
    console.log('🔍 Loaded query data:', query);
    
    // Show loading status
    showQueryLoadStatus('loading', `Loading query "${query.name}"...`);
    
    // Populate the form with the saved query
    const objectTypeSelect = document.getElementById('lens-object-type');
    if (objectTypeSelect) {
      objectTypeSelect.value = query.objectType;
      console.log('🔍 Set object type to:', query.objectType);
      // Trigger change event to load properties
      objectTypeSelect.dispatchEvent(new Event('change'));
    } else {
      console.error('❌ Object type select not found');
    }
    
    // Set limit
    const limitInput = document.getElementById('lens-limit');
    if (limitInput) {
      limitInput.value = query.limit || '';
      console.log('🔍 Set limit to:', query.limit);
    } else {
      console.error('❌ Limit input not found');
    }
    
    // Set properties in the new properties selection system
    console.log('🔍 Loading properties for object type:', query.objectType);
    
    // Check if loadPropertiesForNewSelection is available
    if (typeof window.loadPropertiesForNewSelection === 'function') {
      await window.loadPropertiesForNewSelection(query.objectType);
      console.log('🔍 Properties loaded, now populating selected properties:', query.properties);
      
      // Wait a bit for properties to be fully loaded
      setTimeout(async () => {
        // Check if populateSelectedProperties is available
        if (typeof window.populateSelectedProperties === 'function') {
          await window.populateSelectedProperties(query.properties);
        } else {
          console.error('❌ populateSelectedProperties function not available');
        }
      }, 200);
    } else {
      console.error('❌ loadPropertiesForNewSelection function not available');
    }
    
    // Set filters (this will need to be implemented based on your filters system)
    console.log('🔍 Loading saved query filters:', query.filters);
    
    // Show success status
    showQueryLoadStatus('success', `Query "${query.name}" loaded successfully!`);
    
    // Clear status after 3 seconds
    setTimeout(() => {
      hideQueryLoadStatus();
    }, 3000);
    
  } catch (error) {
    console.error('❌ Error loading query:', error);
    showQueryLoadStatus('error', 'Error loading query: ' + error.message);
  }
}

async function deleteSavedQuery(queryId) {
  console.log('🔍 Deleting query with ID:', queryId);
  
  // Check if QUERY_CACHE is available
  if (typeof QUERY_CACHE === 'undefined') {
    console.error('❌ QUERY_CACHE not available yet');
    showQueryLoadStatus('error', 'Query cache not ready. Please try again in a moment.');
    return;
  }
  
  console.log('🔍 QUERY_CACHE object:', QUERY_CACHE);
  console.log('🔍 QUERY_CACHE.deleteSavedQuery available:', typeof QUERY_CACHE.deleteSavedQuery);
  
  if (confirm('Are you sure you want to delete this saved query?')) {
    try {
      showQueryLoadStatus('loading', 'Deleting query...');
      
      console.log('🔍 Calling QUERY_CACHE.deleteSavedQuery...');
      await QUERY_CACHE.deleteSavedQuery(queryId);
      console.log('✅ Query deleted successfully');
      
      // Refresh the UI
      if (typeof QUERY_CACHE.updateQueryCacheUI === 'function') {
        console.log('🔍 Calling updateQueryCacheUI...');
        QUERY_CACHE.updateQueryCacheUI();
      } else {
        console.error('❌ updateQueryCacheUI function not available');
      }
      
      showQueryLoadStatus('success', 'Query deleted successfully!');
      
      // Clear status after 3 seconds
      setTimeout(() => {
        hideQueryLoadStatus();
      }, 3000);
      
    } catch (error) {
      console.error('❌ Error deleting query:', error);
      showQueryLoadStatus('error', 'Error deleting query: ' + error.message);
    }
  } else {
    console.log('🔍 Delete cancelled by user');
  }
}

// UI Status functions for query operations
function showQueryLoadStatus(type, message) {
  // Remove any existing status
  hideQueryLoadStatus();
  
  const statusDiv = document.createElement('div');
  statusDiv.id = 'query-load-status';
  statusDiv.style.cssText = `
    position: fixed;
    top: 20px;
    right: 20px;
    padding: 12px 16px;
    border-radius: 6px;
    color: white;
    font-weight: 500;
    z-index: 100001;
    max-width: 300px;
    word-wrap: break-word;
    box-shadow: 0 4px 12px rgba(0,0,0,0.15);
    transition: all 0.3s ease;
  `;
  
  if (type === 'loading') {
    statusDiv.style.background = '#3b82f6';
    statusDiv.innerHTML = `⏳ ${message}`;
  } else if (type === 'success') {
    statusDiv.style.background = '#10b981';
    statusDiv.innerHTML = `✅ ${message}`;
  } else if (type === 'error') {
    statusDiv.style.background = '#ef4444';
    statusDiv.innerHTML = `❌ ${message}`;
  } else if (type === 'warning') {
    statusDiv.style.background = '#f59e0b';
    statusDiv.innerHTML = `⚠️ ${message}`;
  }
  
  document.body.appendChild(statusDiv);
}

function hideQueryLoadStatus() {
  const existingStatus = document.getElementById('query-load-status');
  if (existingStatus) {
    existingStatus.remove();
  }
}

// Make functions globally accessible immediately
window.loadSavedQuery = loadSavedQuery;
window.deleteSavedQuery = deleteSavedQuery;
window.showQueryLoadStatus = showQueryLoadStatus;
window.hideQueryLoadStatus = hideQueryLoadStatus;
window.switchToTab = switchToTab;

// Manual trigger for testing Settings tab opening
window.testSettingsTab = function() {
  console.log('🧪 Testing Settings tab opening...');
  switchToTab('settings');
};

// Manual trigger to clear session storage and test auto-opening
window.testTokenAutoOpen = function() {
  console.log('🧪 Testing token auto-opening...');
  sessionStorage.removeItem('token-warning-shown');
  console.log('🧪 Cleared session storage, now checking connection status...');
  checkConnectionStatus();
};

// Initialize the extension
document.addEventListener('DOMContentLoaded', () => {
  console.log('🚀 HubSpot Lens extension initializing...');
  
  // Check connection status
  checkConnectionStatus();
  
  // Proactively refresh token if it's expiring soon
  checkAndRefreshToken();
  
  // Set up periodic token checks
  setInterval(checkAndRefreshToken, 60000); // Check every minute
});

// Check and refresh token if needed
async function checkAndRefreshToken() {
  try {
    const data = await chrome.storage.local.get(['accessToken', 'expiresAt', 'refreshToken']);
    const now = Date.now();
    
    if (data.expiresAt && now >= data.expiresAt - 300000) { // Refresh if expires within 5 minutes
      console.log('🔄 Token expiring soon, proactively refreshing...');
      
      // Send message to background script to refresh token
      chrome.runtime.sendMessage({
        type: 'refreshToken'
      }, (response) => {
        if (response && response.success) {
          console.log('✅ Token refreshed proactively');
          checkConnectionStatus(); // Update UI
        } else {
          console.log('❌ Proactive token refresh failed');
        }
      });
    }
  } catch (error) {
    console.error('❌ Error checking token status:', error);
  }
}

// Simple initialization
setTimeout(() => {
  createLensDrawer();
  setupLensFunctionality();
  checkConnectionStatus(); // Check connection on load
}, 1000);

function createLensDrawer() {
  // Remove any existing elements
  const existing = document.getElementById('hubspot-lens-container');
  if (existing) existing.remove();
  
  // Create toggle button
  const toggle = document.createElement('div');
  toggle.id = 'lens-toggle';
  toggle.style.cssText = `
      position: fixed;
      top: 50%;
      right: 0;
      transform: translateY(-50%);
    background: linear-gradient(135deg, #8b5cf6 0%, #7c3aed 100%);
      color: white;
    padding: 16px 20px;
    border-radius: 50px 0 0 50px;
      cursor: pointer;
    z-index: 99999;
    box-shadow: -4px 0 20px rgba(139, 92, 246, 0.4);
    font-weight: 600;
    font-size: 16px;
      transition: all 0.3s ease;
    width: 60px;
    text-align: center;
    overflow: hidden;
    white-space: nowrap;
  `;
  toggle.innerHTML = '🔍';
  
  // Create drawer
  const drawer = document.createElement('div');
  drawer.id = 'hubspot-lens-container';
  drawer.style.cssText = `
      position: fixed;
      top: 0;
    right: -500px; /* Completely hidden, showing only the tip */
    width: 500px;
      height: 100vh;
      background: white;
    box-shadow: -4px 0 20px rgba(0,0,0,0.15);
    z-index: 100000;
      display: block;
    resize: horizontal;
      overflow: hidden;
    min-width: 450px;
    max-width: 90vw;
    transition: right 0.3s ease;
  `;
  
  drawer.innerHTML = `
    <div style="background: linear-gradient(135deg, #8b5cf6 0%, #7c3aed 100%); color: white; padding: 24px; text-align: center;">
      <h1 style="margin: 0; font-size: 24px;">🔍 HubSpot Lens</h1>
      <p style="margin: 8px 0 0 0; opacity: 0.9;">See everything, clearly</p>
      <div style="position: absolute; top: 20px; right: 20px; display: flex; gap: 8px;">
        <button id="lens-fullscreen" style="background: rgba(255,255,255,0.2); border: none; color: white; font-size: 16px; cursor: pointer; padding: 8px; width: 36px; height: 36px; border-radius: 8px;">⛶</button>
        <button id="lens-close" style="background: rgba(255,255,255,0.2); border: none; color: white; font-size: 20px; cursor: pointer; padding: 8px; width: 36px; height: 36px; border-radius: 8px; z-index: 100001; position: relative;">×</button>
      </div>
      </div>
        
    <div style="display: flex; background: #f8fafc; border-bottom: 1px solid #e2e8f0;">
      <div class="lens-tab active" data-tab="overview" style="padding: 16px 20px; cursor: pointer; border-bottom: 2px solid #8b5cf6; color: #8b5cf6;">Overview</div>
            <div class="lens-tab" data-tab="query" style="padding: 16px 20px; cursor: pointer; border-bottom: 2px solid transparent; color: #6b7280;">Query</div>
      <div class="lens-tab" data-tab="quicklinks" style="padding: 16px 20px; cursor: pointer; border-bottom: 2px solid transparent; color: #6b7280;">Quick Links</div>
        <div class="lens-tab" data-tab="results" style="padding: 16px 20px; cursor: pointer; border-bottom: 2px solid transparent; color: #6b7280;">Results</div>
      <div class="lens-tab" data-tab="settings" style="padding: 16px 20px; cursor: pointer; border-bottom: 2px solid transparent; color: #6b7280;">Settings</div>
        </div>
        
    <div style="padding: 24px; overflow-y: auto; height: calc(100vh - 140px);">
      <div id="overview-tab" class="lens-tab-content" style="display: block;">
        <h4>🎯 Welcome to HubSpot Lens</h4>
        <p>Your modern tool for exploring HubSpot data.</p>
        <button id="lens-record-inspector-btn" style="background: linear-gradient(135deg, #8b5cf6 0%, #7c3aed 100%); color: white; border: none; padding: 12px 24px; border-radius: 8px; cursor: pointer; display: none;">🔍 Inspect Current Record</button>
          </div>
          
      <div id="query-tab" class="lens-tab-content" style="display: none;">
        <h4>🔍 Query HubSpot Data</h4>
        
        <!-- Saved Queries Section -->
        <div style="margin-bottom: 16px;">
          <div style="
            display: flex;
            justify-content: space-between;
            align-items: center;
            padding: 8px 12px;
            background: #f8fafc;
            border: 1px solid #e2e8f0;
            border-radius: 6px;
            cursor: pointer;
            font-weight: 500;
            color: #1e293b;
          ">
            <span>💾 Saved Queries</span>
            <span id="saved-arrow" style="transition: transform 0.2s;">▼</span>
          </div>
          <div id="lens-saved-queries-container" style="
            border: 1px solid #e2e8f0;
            border-top: none;
            border-radius: 0 0 6px 6px;
            padding: 12px;
            background: white;
            display: none;
            max-height: 200px;
            overflow-y: auto;
          ">
            <div style="text-align: center; color: #9ca3af; font-style: italic; padding: 20px;">
              No saved queries yet. Execute a query and save it for quick access.
            </div>
          </div>
        </div>

        <!-- Recent Queries Section -->
        <div style="margin-bottom: 16px;">
          <div style="
            display: flex;
            justify-content: space-between;
            align-items: center;
            padding: 8px 12px;
            background: #f8fafc;
            border: 1px solid #e2e8f0;
            border-radius: 6px;
            cursor: pointer;
            font-weight: 500;
            color: #1e293b;
          ">
            <span>🕒 Recent Queries</span>
            <span id="recent-arrow" style="transition: transform 0.2s;">▼</span>
          </div>
          <div id="lens-recent-queries-container" style="
            border: 1px solid #e2e8f0;
            border-top: none;
            border-radius: 0 0 6px 6px;
            padding: 12px;
            background: white;
            display: none;
            max-height: 200px;
            overflow-y: auto;
          ">
            <div style="text-align: center; color: #9ca3af; font-style: italic; padding: 20px;">
              No recent queries yet. Execute a query to see it here.
            </div>
          </div>
        </div>

        <div style="margin-bottom: 20px;">
          <label>Object Type</label>
          <select id="lens-object-type" style="width: 100%; padding: 12px; border: 2px solid #e5e7eb; border-radius: 8px;">
            <option value="">Select object type...</option>
            <option value="contacts">Contacts</option>
            <option value="companies">Companies</option>
            <option value="deals">Deals</option>
            <option value="tickets">Tickets</option>
            <option value="notes">Notes</option>
            <option value="meetings">Meetings</option>
            <option value="calls">Calls</option>
            <option value="emails">Emails</option>
            <option value="tasks">Tasks</option>
            <option value="custom">Custom Objects</option>
          </select>
        </div>
        

        
        <!-- Properties Selection System -->
        <div style="margin-bottom: 20px;">
          <label>Properties</label>
          <div id="lens-new-properties-container" style="
            border: 2px solid #e5e7eb;
            border-radius: 8px;
            padding: 8px;
            background: white;
            transition: border-color 0.2s ease;
          ">
            <!-- Selected Properties Tags -->
            <div id="lens-new-selected-properties" style="
              display: flex;
              flex-wrap: wrap;
              gap: 4px;
              margin-bottom: 8px;
              min-height: 32px;
              padding: 4px;
              border-radius: 4px;
              background: #f8fafc;
            "></div>
            
            <!-- Search Input -->
            <input type="text" id="lens-new-properties-input" placeholder="Type to filter properties..." style="
              border: none;
              outline: none;
              width: 100%;
              padding: 8px;
              font-size: 14px;
              background: transparent;
            ">
            
            <!-- Horizontal Scrollable Properties List -->
            <div id="lens-new-properties-list" style="
              margin-top: 8px;
              overflow-x: auto;
              white-space: nowrap;
              padding: 4px;
              border-radius: 4px;
              background: #f8fafc;
              max-height: 120px;
              overflow-y: auto;
            "></div>
          </div>
          <small style="color: #6b7280; margin-top: 4px; display: block;">Click on properties or use Tab to navigate and Enter to select</small>
        </div>
        
        <div style="margin-bottom: 20px;">
          <label>Filters</label>
          <div id="lens-filters-container">
            <div class="lens-filter-row" style="display: flex; gap: 8px; margin-bottom: 8px; align-items: center;">
              <select class="lens-filter-property" style="flex: 1; padding: 8px; border: 1px solid #e5e7eb; border-radius: 4px;">
                <option value="">Select property...</option>
            </select>
              <select class="lens-filter-operator" style="flex: 1; padding: 8px; border: 1px solid #e5e7eb; border-radius: 4px;">
                <option value="eq">Equals (=)</option>
                <option value="ne">Not equals (≠)</option>
                <option value="gt">Greater than (>)</option>
                <option value="gte">Greater than or equal (≥)</option>
                <option value="lt">Less than (<)</option>
                <option value="lte">Less than or equal (≤)</option>
                <option value="contains">Contains</option>
                <option value="not_contains">Does not contain</option>
                <option value="starts_with">Starts with</option>
                <option value="ends_with">Ends with</option>
                <option value="is_known">Is known</option>
                <option value="is_unknown">Is unknown</option>
                </select>
              <input type="text" class="lens-filter-value" placeholder="Value..." style="flex: 1; padding: 8px; border: 1px solid #e5e7eb; border-radius: 4px;">
              <button class="lens-remove-filter" style="background: #ef4444; color: white; border: none; padding: 8px; border-radius: 4px; cursor: pointer; width: 32px; height: 32px;">×</button>
              </div>
            </div>
          <button id="lens-add-filter" style="background: #8b5cf6; color: white; border: none; padding: 8px 16px; border-radius: 4px; cursor: pointer; margin-top: 8px;">+ Add Filter</button>
          </div>
          
        <div style="margin-bottom: 20px;">
            <label>Order By</label>
          <div id="lens-order-container">
            <div class="lens-order-row" style="display: flex; gap: 8px; margin-bottom: 8px; align-items: center;">
              <select class="lens-order-property" style="flex: 1; padding: 8px; border: 1px solid #e5e7eb; border-radius: 4px;">
                <option value="">Select property...</option>
                  </select>
              <select class="lens-order-direction" style="flex: 1; padding: 8px; border: 1px solid #e5e7eb; border-radius: 4px;">
                <option value="asc">Ascending</option>
                <option value="desc">Descending</option>
                  </select>
              <button class="lens-remove-order" style="background: #ef4444; color: white; border: none; padding: 8px; border-radius: 4px; cursor: pointer; width: 32px; height: 32px;">×</button>
                </div>
                </div>
          <button id="lens-add-order" style="background: #8b5cf6; color: white; border: none; padding: 8px 16px; border-radius: 4px; cursor: pointer; margin-top: 8px;">+ Add Order</button>
            </div>
            
        <div style="margin-bottom: 20px;">
          <label>Limit</label>
          <input type="number" id="lens-limit" value="100" min="1" placeholder="Enter limit or leave empty for unlimited" style="width: 100%; padding: 12px; border: 2px solid #e5e7eb; border-radius: 8px;">
          <small style="color: #6b7280; margin-top: 4px; display: block;">Leave empty for unlimited records (fetched in batches of 100). Large exports (>1000 records) will show a bulk operation warning.</small>
        </div>

        <div style="background: #f0f9ff; border: 1px solid #0ea5e9; border-radius: 8px; padding: 16px; margin-bottom: 20px;">
          <div style="display: flex; align-items: center; gap: 8px; margin-bottom: 8px;">
            <span style="font-size: 16px;">💡</span>
            <strong style="color: #0c4a6e;">Pro Tip</strong>
          </div>
          <p style="margin: 0; font-size: 14px; color: #0c4a6e; line-height: 1.5;">
            <strong>Unlimited Records:</strong> Leave the limit field empty to fetch up to 100,000 records. The system automatically handles HubSpot's 100-record API limit by fetching data in batches. For bulk operations, you'll get warnings before export.
          </p>
        </div>



        <div style="display: flex; gap: 12px;">
          <button id="lens-execute-query" style="
            background: linear-gradient(135deg, #8b5cf6 0%, #7c3aed 100%);
        color: white;
            border: none;
            padding: 16px 24px;
            border-radius: 12px;
        cursor: pointer;
            font-size: 16px;
        font-weight: 600;
            transition: all 0.2s ease;
            box-shadow: 0 4px 15px rgba(139, 92, 246, 0.3);
            flex: 1;
          ">🚀 Execute Query</button>
          
          <button id="lens-save-current-query" style="
            background: linear-gradient(135deg, #10b981 0%, #059669 100%);
            color: white;
            border: none;
            padding: 16px 20px;
            border-radius: 12px;
            cursor: pointer;
            font-size: 14px;
            font-weight: 600;
            transition: all 0.2s ease;
            box-shadow: 0 4px 15px rgba(16, 185, 129, 0.3);
            white-space: nowrap;
          ">💾 Save Query</button>
        </div>
        
        <div id="lens-query-progress" style="display: none; margin-top: 16px; padding: 16px; background: #f0f9ff; border: 1px solid #0ea5e9; border-radius: 8px;">
          <div style="display: flex; align-items: center; gap: 8px; margin-bottom: 8px;">
            <span style="font-size: 16px;">⏳</span>
            <strong style="color: #0c4a6e;">Query Progress</strong>
          </div>
          <div id="lens-progress-text" style="font-size: 14px; color: #0c4a6e; line-height: 1.5;">
            Fetching records in batches...
          </div>
        </div>
      </div>
          

          
      <div id="quicklinks-tab" class="lens-tab-content" style="display: none;">
        <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 20px;">
          <div>
            <h4 style="margin: 0;">🔗 Quick Links</h4>
            <p style="margin: 4px 0 0 0; color: #475569; line-height: 1.6; font-size: 13px;">
              Drag to reorder • Click to edit • Up to 10 shortcuts
            </p>
          </div>
          <button id="save-current-page-btn" style="
            background: #8b5cf6;
            color: white;
            border: none;
            padding: 8px 16px;
            border-radius: 6px;
            cursor: pointer;
            font-size: 13px;
            font-weight: 500;
            transition: all 0.2s ease;
          " onmouseover="this.style.background='#7c3aed'" onmouseout="this.style.background='#8b5cf6'">
            💾 Save Current Page
          </button>
        </div>
        
        <!-- Quick Links List Container -->
        <div id="quicklinks-list-container" style="
          max-height: 600px;
          overflow-y: auto;
          border: 1px solid #e2e8f0;
          border-radius: 8px;
          background: white;
        ">
          <div id="quicklinks-list" style="padding: 8px;">
            <!-- Quick links will be populated here -->
          </div>
        </div>
      </div>
          
      <div id="results-tab" class="lens-tab-content" style="display: none;">
        <h4>📊 Query Results</h4>
        <div id="lens-results-container" style="padding: 20px; background: #f8fafc; border-radius: 8px; text-align: center; color: #6b7280;">
          <p>No results to display yet</p>
          <p>Run a query from the Query tab to see results here</p>
            </div>
        <div id="lens-export-buttons" style="display: none; margin-top: 20px;">
          <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 12px;">
            <button id="lens-export-csv" style="background: linear-gradient(135deg, #10b981 0%, #059669 100%); color: white; border: none; padding: 16px 24px; border-radius: 12px; cursor: pointer;">📊 Export CSV</button>
            <button id="lens-export-json" style="background: linear-gradient(135deg, #3b82f6 0%, #2563eb 100%); color: white; border: none; padding: 16px 24px; border-radius: 12px; cursor: pointer;">📄 Export JSON</button>
          </div>
        </div>
          </div>
          
      <div id="settings-tab" class="lens-tab-content" style="display: none;">
        <h4>⚙️ Settings</h4>
        <div id="lens-connection-status" style="padding: 16px; background: #fef2f2; border: 1px solid #fecaca; border-radius: 8px; color: #dc2626;">
          🔴 Not connected to HubSpot
        </div>
        <button id="lens-reconnect" style="background: linear-gradient(135deg, #8b5cf6 0%, #7c3aed 100%); color: white; border: none; padding: 12px 24px; border-radius: 8px; cursor: pointer; margin-top: 12px;">🔗 Connect to HubSpot</button>
      </div>
    </div>
  `;

  document.body.appendChild(drawer);
  document.body.appendChild(toggle);
}

function setupLensFunctionality() {
  // Toggle functionality
  const toggle = document.getElementById('lens-toggle');
  const drawer = document.getElementById('hubspot-lens-container');
  
  // Hover behavior - show full lens icon on hover
  toggle.addEventListener('mouseenter', () => {
    toggle.style.width = '120px';
    toggle.innerHTML = '🔍 LENS';
  });
  
  toggle.addEventListener('mouseleave', () => {
    toggle.style.width = '60px';
    toggle.innerHTML = '🔍';
  });
  
  // Click to open/close drawer
    toggle.addEventListener('click', () => {
    if (drawer.style.right === '0px') {
      drawer.style.right = '-500px';
  } else {
      drawer.style.right = '0';
      // Clear session storage and check connection status when drawer opens
      setTimeout(() => {
        sessionStorage.removeItem('token-warning-shown');
        console.log('🔐 Cleared session storage for new drawer session');
        checkConnectionStatus();
      }, 100);
  }
  });

  // Close button
  const closeBtn = document.getElementById('lens-close');
  if (closeBtn) {
    closeBtn.addEventListener('click', () => {
      console.log('🔒 Close button clicked, closing drawer');
      closeDrawer();
    });
  } else {
    console.error('❌ Close button not found');
    // Try again after a short delay
    setTimeout(() => {
      const retryCloseBtn = document.getElementById('lens-close');
      if (retryCloseBtn) {
        retryCloseBtn.addEventListener('click', () => {
          console.log('🔒 Close button clicked (retry), closing drawer');
          closeDrawer();
        });
      } else {
        console.error('❌ Close button still not found after retry');
      }
    }, 100);
  }
  
  // Keep drawer open when hovering over it
  drawer.addEventListener('mouseenter', () => {
    drawer.style.right = '0';
    // Clear session storage and check connection status when drawer opens via hover
    setTimeout(() => {
      sessionStorage.removeItem('token-warning-shown');
      console.log('🔐 Cleared session storage for new drawer session (hover)');
      checkConnectionStatus();
    }, 100);
  });
  
  drawer.addEventListener('mouseleave', () => {
    // Don't auto-close on drawer mouse leave - only close on button click or close button
  });
  
  // Event delegation for close button (more reliable)
  drawer.addEventListener('click', (e) => {
    if (e.target && e.target.id === 'lens-close') {
      console.log('🔒 Close button clicked via delegation, closing drawer');
      closeDrawer();
    }
  });
  
  // Robust close function
  function closeDrawer() {
    console.log('🔒 Closing drawer, current right value:', drawer.style.right);
    drawer.style.right = '-500px';
    console.log('🔒 Drawer closed, new right value:', drawer.style.right);
  }
  
  // Also bind to window for debugging
  window.closeLensDrawer = closeDrawer;
  
  // Test function to help debug close button
  window.testLensClose = function() {
    console.log('🧪 Testing lens close functionality...');
    console.log('🧪 Close button element:', document.getElementById('lens-close'));
    console.log('🧪 Drawer element:', document.getElementById('hubspot-lens-container'));
    console.log('🧪 Current drawer right value:', drawer.style.right);
    console.log('🧪 Close button click event listeners:', getEventListeners(document.getElementById('lens-close')));
  };
  
  // Test function to debug filter dropdowns
  window.testFilterDropdowns = function() {
    console.log('🧪 Testing filter dropdown functionality...');
    console.log('🧪 Available properties:', window.lensAllProperties);
    console.log('🧪 Filter property dropdowns:', document.querySelectorAll('.lens-filter-property'));
    console.log('🧪 Order property dropdowns:', document.querySelectorAll('.lens-order-property'));
    
    // Try to manually populate a dropdown
    const firstFilterDropdown = document.querySelector('.lens-filter-property');
    if (firstFilterDropdown) {
      console.log('🧪 First filter dropdown:', firstFilterDropdown);
      console.log('🧪 Current options:', firstFilterDropdown.innerHTML);
      populatePropertyDropdown(firstFilterDropdown);
      console.log('🧪 After population:', firstFilterDropdown.innerHTML);
    }
  };
  
  // Helper function to get event listeners (for debugging)
  function getEventListeners(element) {
    if (!element) return 'Element not found';
    try {
      return element.onclick ? 'Has onclick' : 'No onclick';
    } catch (e) {
      return 'Cannot access event listeners';
    }
  }
  
  // Full-screen button
  const fullscreenBtn = document.getElementById('lens-fullscreen');
  if (fullscreenBtn) {
    let originalWidth = '500px';
    fullscreenBtn.addEventListener('click', () => {
      if (drawer.style.width === '100vw') {
        drawer.style.width = originalWidth;
        fullscreenBtn.textContent = '⛶';
  } else {
        originalWidth = drawer.style.width || '500px';
        drawer.style.width = '100vw';
        fullscreenBtn.textContent = '⛶';
      }
    });
  }

  // Tab switching
  const tabs = document.querySelectorAll('.lens-tab');
  const tabContents = document.querySelectorAll('.lens-tab-content');
  
  tabs.forEach(tab => {
    tab.addEventListener('click', () => {
      const targetTab = tab.dataset.tab;
      
      // Update active tab
      tabs.forEach(t => {
        t.style.borderBottomColor = 'transparent';
        t.style.color = '#6b7280';
      });
      tab.style.borderBottomColor = '#8b5cf6';
      tab.style.color = '#8b5cf6';
      
      // Show content
      tabContents.forEach(content => {
        content.style.display = 'none';
      });
      document.getElementById(`${targetTab}-tab`).style.display = 'block';
    });
  });
  
  // Execute query - REAL FUNCTIONALITY
  const executeBtn = document.getElementById('lens-execute-query');
  executeBtn.addEventListener('click', () => {
    const objectType = document.getElementById('lens-object-type').value;
    const properties = getSelectedProperties();
    const limit = document.getElementById('lens-limit').value;
    const filters = getLensFilters();
    
    console.log('🔍 Debug - Object Type:', objectType);
    console.log('🔍 Debug - Properties:', properties);
    console.log('🔍 Debug - Properties Type:', typeof properties);
    console.log('🔍 Debug - Properties Length:', properties ? properties.length : 'undefined');
    
    if (!objectType) {
      alert('Please select an object type');
      return;
    }
    
    if (!properties || properties.length === 0) {
      alert('Please add at least one property');
      return;
    }
    
    console.log('🚀 Executing query:', { objectType, properties, limit, filters });
    executeBtn.textContent = '⏳ Executing...';
    executeBtn.disabled = true;
    
    // Execute REAL HubSpot query
    executeHubSpotQuery(objectType, properties, limit, filters);
    
    // Auto-save query to recent queries
    QUERY_CACHE.saveToRecent({
      objectType,
      properties,
      limit,
      filters
    });
  });
  
  // Record inspector - REAL FUNCTIONALITY
  const inspectorBtn = document.getElementById('lens-record-inspector-btn');
  inspectorBtn.addEventListener('click', () => {
    console.log('🔍 Record inspector clicked');
    openRecordInspectorInNewTab();
  });
  
  // Check if we're on a record page and show/hide the button
  checkAndUpdateRecordInspectorButton();
  
  // Listen for URL changes to update the record inspector button
  let currentUrl = window.location.href;
  const observer = new MutationObserver(() => {
    if (window.location.href !== currentUrl) {
      currentUrl = window.location.href;
      console.log('🔄 URL changed, updating record inspector button');
      checkAndUpdateRecordInspectorButton();
    }
  });
  
  observer.observe(document.body, {
    childList: true,
    subtree: true
  });
  
  // Reconnect - REAL FUNCTIONALITY
  const reconnectBtn = document.getElementById('lens-reconnect');
  reconnectBtn.addEventListener('click', () => {
    console.log('🔗 Reconnect clicked');
    startOAuth();
  });
  
  // Export functionality
  const exportCsvBtn = document.getElementById('lens-export-csv');
  const exportJsonBtn = document.getElementById('lens-export-json');
  
  if (exportCsvBtn) {
    exportCsvBtn.addEventListener('click', () => {
      exportResults('csv');
    });
  }
  
    if (exportJsonBtn) {
    exportJsonBtn.addEventListener('click', () => {
      exportResults('json');
    });
  }
  

  
  console.log('✅ Lens functionality setup complete');
  
  // Initialize properties autocomplete
  initializePropertiesAutocomplete();
  
  // Initialize new properties selection system
  initializeNewPropertiesSelection();
  
  // Initialize filter and order functionality
  initializeFilterAndOrder();
  
  // Initialize query cache functionality
  initializeQueryCache();
  
  // Initialize Quick Links functionality
  initializeQuickLinks();
}

// REAL HubSpot Query Functions
async function executeHubSpotQuery(objectType, properties, limit, filters) {
  try {
    console.log('🔍 Executing HubSpot query...');
    
    // Get access token
    const data = await chrome.storage.local.get(['accessToken', 'portalId']);
    if (!data.accessToken || !data.portalId) {
      alert('Please reconnect to HubSpot first');
      resetQueryButton();
      return;
    }

    // Build query parameters
    // Normalize properties to an array (chips already return array)
    const safeProperties = Array.isArray(properties)
      ? properties
      : (typeof properties === 'string' && properties.length > 0
          ? properties.split(',').map(p => p.trim()).filter(Boolean)
          : ['name', 'createdate']);

    const queryParams = {
      objectType: objectType,
      properties: safeProperties,
      limit: limit && limit.trim() !== '' ? parseInt(limit) : 100000, // Default to 100k for truly unlimited feel
      filters: Array.isArray(filters) ? filters : []
    };
    
    console.log('📊 Query params:', queryParams);
    
    // Show progress for large queries
    const isLargeQuery = queryParams.limit > 100;
    if (isLargeQuery) {
      const executeBtn = document.getElementById('lens-execute-query');
      executeBtn.textContent = '⏳ Fetching in batches...';
      executeBtn.disabled = true;
      
      // Show progress indicator
      const limitText = queryParams.limit >= 100000 ? 'unlimited' : queryParams.limit.toLocaleString();
      showQueryProgress(`Starting query for up to ${limitText} records...`);
    }
    
    // Send message to background script to execute query
    chrome.runtime.sendMessage({
      type: 'executeQuery',
      query: queryParams,
      portalId: data.portalId,
      accessToken: data.accessToken
    }, (response) => {
      if (response && response.success) {
        console.log('✅ Query successful:', response.data);
        
        // Show pagination info for large queries
        if (response.data.pagination && response.data.pagination.batches > 1) {
          console.log(`📊 Pagination: Fetched ${response.data.total} records in ${response.data.pagination.batches} batches`);
        }
        
        displayQueryResults(response.data.results);
        resetQueryButton();
        if (progressDiv) {
          progressDiv.style.display = 'none';
        }
        
        // Store results for export
        window.lensQueryResults = response.data.results;
        
        // Store pagination info for display
        if (response.data.pagination) {
          window.lensQueryPagination = response.data.pagination;
        }
      } else {
        console.error('❌ Query failed:', response?.error);
        alert('Query failed: ' + (response?.error || 'Unknown error'));
        resetQueryButton();
        if (progressDiv) {
          progressDiv.style.display = 'none';
        }
      }
    });
    
  } catch (error) {
    console.error('❌ Query execution error:', error);
    alert('Query execution error: ' + error.message);
    resetQueryButton();
  }
}

function resetQueryButton() {
  const btn = document.getElementById('lens-execute-query');
  if (btn) {
    btn.textContent = '🚀 Execute Query';
    btn.disabled = false;
  }
  
  // Hide progress indicator
  const progressDiv = document.getElementById('lens-query-progress');
  if (progressDiv) {
    progressDiv.style.display = 'none';
  }
}

// Show query progress for pagination
function showQueryProgress(message) {
  const progressDiv = document.getElementById('lens-query-progress');
  const progressText = document.getElementById('lens-progress-text');
  
  if (progressDiv && progressText) {
    progressDiv.style.display = 'block';
    progressText.textContent = message;
  }
}

// Collect filters from UI
function getLensFilters() {
  const filterRows = document.querySelectorAll('.lens-filter-row');
  const filters = [];
  const operatorMap = {
    eq: 'EQ',
    ne: 'NEQ',
    gt: 'GT',
    gte: 'GTE',
    lt: 'LT',
    lte: 'LTE',
    contains: 'CONTAINS_TOKEN',
    not_contains: 'NOT_CONTAINS_TOKEN',
    starts_with: 'STARTS_WITH',
    ends_with: 'ENDS_WITH',
    is_known: 'HAS_PROPERTY',
    is_unknown: 'NOT_HAS_PROPERTY'
  };
  
  filterRows.forEach(row => {
    const property = row.querySelector('.lens-filter-property')?.value?.trim();
    const operatorRaw = row.querySelector('.lens-filter-operator')?.value?.trim();
    const value = row.querySelector('.lens-filter-value')?.value?.trim();
    
    if (property && operatorRaw) {
      const operator = operatorMap[operatorRaw] || operatorRaw;
      const filter = {
        propertyName: property,
        operator: operator
      };
      
      const valueLess = ['HAS_PROPERTY', 'NOT_HAS_PROPERTY'];
      if (!valueLess.includes(operator) && value) {
        filter.value = value;
      }
      
      filters.push(filter);
    }
  });
  
  return filters.length > 0 ? [{ filters }] : [];
}

// Collect order by settings from UI
function getLensOrderBy() {
  const orderRows = document.querySelectorAll('.lens-order-row');
  const orderBy = [];
  
  orderRows.forEach(row => {
    const property = row.querySelector('.lens-order-property')?.value;
    const direction = row.querySelector('.lens-order-direction')?.value;
    
    if (property && direction) {
      orderBy.push({
        propertyName: property,
        direction: direction
      });
    }
  });
  
  return orderBy;
}

function displayQueryResults(results) {
  const container = document.getElementById('lens-results-container');
  const exportButtons = document.getElementById('lens-export-buttons');
  
  if (!container) return;
  
  if (results && results.length > 0) {
    // Create results table
    const table = createResultsTable(results);
    container.innerHTML = '';
    
    // Create scrollable wrapper for the table
    const tableWrapper = document.createElement('div');
    tableWrapper.style.cssText = `
      width: 100%;
      overflow-x: auto;
      border-radius: 8px;
      box-shadow: 0 2px 8px rgba(0,0,0,0.1);
    `;
    tableWrapper.appendChild(table);
    
    // Add record count and pagination info
    const infoDiv = document.createElement('div');
    infoDiv.style.cssText = `
      background: #f0f9ff;
      border: 1px solid #0ea5e9;
      border-radius: 8px;
      padding: 16px;
      margin-bottom: 20px;
      color: #0c4a6e;
    `;
    
    let infoText = `📊 <strong>${results.length.toLocaleString()} records</strong> fetched`;
    
    // Add pagination info if available
    if (window.lensQueryPagination) {
      const pagination = window.lensQueryPagination;
      infoText += ` in <strong>${pagination.batches}</strong> batches`;
      if (pagination.targetLimit && pagination.targetLimit !== pagination.actualLimit) {
        infoText += ` (target: ${pagination.targetLimit.toLocaleString()}, actual: ${pagination.actualLimit.toLocaleString()})`;
      }
    }
    
    infoDiv.innerHTML = infoText;
    container.appendChild(infoDiv);
    
    // Add bulk operation warning if many records
    if (results.length > 1000) {
      const warningDiv = document.createElement('div');
      warningDiv.style.cssText = `
        background: #fef3c7;
        border: 1px solid #f59e0b;
        border-radius: 8px;
        padding: 16px;
        margin-bottom: 20px;
        color: #92400e;
      `;
      warningDiv.innerHTML = `
        <div style="display: flex; align-items: center; gap: 8px; margin-bottom: 8px;">
          <span style="font-size: 18px;">⚠️</span>
          <strong>Bulk Operation Warning</strong>
        </div>
        <p style="margin: 0; font-size: 14px;">
          You have ${results.length.toLocaleString()} records. This is a bulk operation that may take longer to process and generate large export files.
        </p>
      `;
      container.appendChild(warningDiv);
    }
    
    container.appendChild(tableWrapper);
    
    // Show export buttons
    if (exportButtons) {
      exportButtons.style.display = 'block';
    }
    
    // Store results for export
    window.lensQueryResults = results;
    
    // Switch to Results tab
    switchToTab('results');
    
    console.log('📊 Results displayed:', results.length, 'records');
  } else {
    container.innerHTML = `
      <div>
        <p style="margin: 0 0 16px 0; font-size: 16px;">No results found</p>
        <p style="margin: 0; font-size: 14px;">Try adjusting your query parameters</p>
      </div>
    `;
    
    if (exportButtons) {
      exportButtons.style.display = 'none';
    }
    
    // Switch to Results tab even for no results
    switchToTab('results');
  }
}

function switchToTab(tabName) {
  console.log(`🔄 Switching to tab: ${tabName}`);
  
  const tabs = document.querySelectorAll('.lens-tab');
  const tabContents = document.querySelectorAll('.lens-tab-content');
  
  console.log(`📊 Found ${tabs.length} tabs and ${tabContents.length} tab contents`);
  
  // Update active tab styling
  tabs.forEach(t => {
    t.style.borderBottomColor = 'transparent';
    t.style.color = '#6b7280';
  });
  
  const targetTab = document.querySelector(`[data-tab="${tabName}"]`);
  if (targetTab) {
    targetTab.style.borderBottomColor = '#8b5cf6';
    targetTab.style.color = '#8b5cf6';
    console.log(`✅ Found and styled target tab: ${tabName}`);
  } else {
    console.error(`❌ Target tab not found: ${tabName}`);
  }
  
  // Show target content
  tabContents.forEach(content => {
    content.style.display = 'none';
  });
  
  const targetContent = document.getElementById(`${tabName}-tab`);
  if (targetContent) {
    targetContent.style.display = 'block';
    console.log(`✅ Found and displayed target content: ${tabName}-tab`);
  } else {
    console.error(`❌ Target content not found: ${tabName}-tab`);
  }
}

function createResultsTable(results) {
  const table = document.createElement('table');
  table.style.cssText = `
    min-width: 100%;
    border-collapse: collapse;
    font-size: 14px;
    background: white;
    border-radius: 8px;
  `;
  
  // Get all unique properties
  const allProperties = new Set();
  results.forEach(record => {
    if (record.properties) {
      Object.keys(record.properties).forEach(prop => allProperties.add(prop));
    }
  });
  
  const properties = Array.from(allProperties).slice(0, 10); // Limit to 10 columns

      // Create header
      const thead = document.createElement('thead');
      const headerRow = document.createElement('tr');
  headerRow.style.cssText = 'background: #f8fafc; border-bottom: 2px solid #e2e8f0;';
        
        // Add Actions column
        const actionsHeader = document.createElement('th');
        actionsHeader.textContent = 'Actions';
        actionsHeader.style.cssText = 'padding: 12px; text-align: center; font-weight: 600; color: #1e293b; min-width: 120px; white-space: nowrap;';
        headerRow.appendChild(actionsHeader);
        
        // Add ID column
        const idHeader = document.createElement('th');
        idHeader.textContent = 'ID';
  idHeader.style.cssText = 'padding: 12px; text-align: left; font-weight: 600; color: #1e293b; min-width: 150px; white-space: nowrap;';
        headerRow.appendChild(idHeader);
        
        // Add property columns
  properties.forEach(prop => {
          const th = document.createElement('th');
    th.textContent = prop;
    th.style.cssText = 'padding: 12px; text-align: left; font-weight: 600; color: #1e293b; min-width: 150px; white-space: nowrap;';
          headerRow.appendChild(th);
        });
      
      thead.appendChild(headerRow);
      table.appendChild(thead);

      // Create body
      const tbody = document.createElement('tbody');
  results.slice(0, 50).forEach(record => { // Limit to 50 rows
        const row = document.createElement('tr');
    row.style.cssText = 'border-bottom: 1px solid #f1f5f9;';
    
    // Add Actions cell
        const actionsCell = document.createElement('td');
        actionsCell.style.cssText = 'padding: 12px; text-align: center; min-width: 120px; white-space: nowrap;';
        
        // Get record ID and determine object type
        const recordId = record.id || record.hs_object_id || record.properties?.hs_object_id || record.properties?.id;
        const objectType = getObjectTypeFromResult(record);
        
        if (recordId && objectType) {
          // Extract portal ID from current URL
          const currentUrl = window.location.href;
          const portalMatch = currentUrl.match(/app-([^.]+)\.hubspot\.com/);
          const portalId = portalMatch ? portalMatch[1] : 'eu1';
          
          const recordUrl = `https://app-${portalId}.hubspot.com/contacts/${portalId}/record/0-1/${recordId}`;
          const inspectorUrl = `chrome-extension://${chrome.runtime.id}/record-inspector.html?recordId=${recordId}&objectType=${objectType}&portalId=${portalId}`;
          
          actionsCell.innerHTML = `
            <button onclick="window.open('${recordUrl}', '_blank')" style="margin-right: 4px; padding: 4px 8px; font-size: 12px; background: #8b5cf6; color: white; border: none; border-radius: 4px; cursor: pointer;" title="Open Record">📄</button>
            <button onclick="window.open('${inspectorUrl}', '_blank')" style="padding: 4px 8px; font-size: 12px; background: #8b5cf6; color: white; border: none; border-radius: 4px; cursor: pointer;" title="Open Record Inspector">🔍</button>
          `;
        } else {
          actionsCell.textContent = 'N/A';
        }
        
        row.appendChild(actionsCell);
    
    // Add ID cell
        const idCell = document.createElement('td');
    idCell.textContent = recordId || 'N/A';
    idCell.style.cssText = 'padding: 12px; font-weight: 600; color: #1e293b; background: #f8fafc; min-width: 150px; white-space: nowrap;';
        row.appendChild(idCell);
        
    // Add property cells
    properties.forEach(prop => {
      const td = document.createElement('td');
      const value = record.properties?.[prop] || '';
      td.textContent = typeof value === 'object' ? JSON.stringify(value) : String(value);
      td.style.cssText = 'padding: 12px; color: #475569; min-width: 150px; white-space: nowrap; overflow: hidden; text-overflow: ellipsis;';
      row.appendChild(td);
        });
        
        tbody.appendChild(row);
      });
      
      table.appendChild(tbody);
  return table;
}

// Helper function to determine object type from result
function getObjectTypeFromResult(result) {
  // Try to get from the current object type selection
  const objectTypeSelect = document.getElementById('lens-object-type');
  if (objectTypeSelect && objectTypeSelect.value) {
    return objectTypeSelect.value;
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

// REAL Record Inspector Function
function checkAndUpdateRecordInspectorButton() {
  const inspectorBtn = document.getElementById('lens-record-inspector-btn');
  if (!inspectorBtn) return;
  
  const url = window.location.href;
  const recordMatch = url.match(/\/record\/\d+-\d+\/(\d+)/);
  
  if (recordMatch) {
    console.log('📋 On record page, showing Inspect Current Record button');
    inspectorBtn.style.display = 'inline-block';
  } else {
    console.log('📋 Not on record page, hiding Inspect Current Record button');
    inspectorBtn.style.display = 'none';
  }
}

function openRecordInspectorInNewTab() {
  try {
    console.log('🔍 Opening Record Inspector in new tab...');
    
    // Parse current URL to get record info
    const url = window.location.href;
    console.log('🔗 Full URL:', url);
    
    // Extract record type ID and record ID from URL: /record/0-5/2030698469
    const recordMatch = url.match(/\/record\/(\d+-\d+)\/(\d+)/);
    
    if (!recordMatch) {
      alert('Not on a HubSpot record page. Please navigate to a contact, company, deal, or other record page.');
      return;
    }
    
    const recordTypeId = recordMatch[1]; // e.g., "0-5"
    const recordId = recordMatch[2]; // e.g., "2030698469"
    let objectType = null;
    let portalId = null;
    
    console.log('📋 Record Type ID:', recordTypeId);
    console.log('📋 Record ID:', recordId);
    
    // Extract portal ID from URL
    const portalMatch = url.match(/app-([^.]+)\.hubspot\.com/);
    if (portalMatch) {
      portalId = portalMatch[1];
    }
    
    // For custom objects, always use the record type ID as the object type
    // This ensures we get the correct API endpoints for custom objects
    console.log('🔍 Using record type ID as object type for custom object');
    objectType = recordTypeId; // Always use the record type ID (e.g., "0-5") as the object type
    
    if (!objectType || !portalId) {
      alert('Could not determine record information from URL. Please ensure you are on a valid HubSpot record page.');
      return;
    }
    
    console.log('📋 Record info:', { recordId, objectType, portalId });
    
    // Create the URL for the record inspector
    const inspectorUrl = `chrome-extension://${chrome.runtime.id}/record-inspector.html?recordId=${recordId}&objectType=${objectType}&portalId=${portalId}`;
    
    console.log('🔗 Opening Record Inspector URL:', inspectorUrl);
    
    // Open in new tab
    window.open(inspectorUrl, '_blank');
    
  } catch (error) {
    console.error('❌ Error opening Record Inspector:', error);
    alert('Error opening Record Inspector: ' + error.message);
  }
}

function inspectCurrentRecord() {
  try {
    console.log('🔍 Inspecting current record...');
    
    // Parse current URL to get record info
    const url = window.location.href;
    console.log('🔍 Current URL:', url);
    
    // Better URL parsing for HubSpot record pages
    let objectType = null;
    let recordId = null;
    let portalId = null;
    
    // Extract portal ID from URL (usually in the domain or path)
    const portalMatch = url.match(/app-([^.]+)\.hubspot\.com/);
    if (portalMatch) {
      portalId = portalMatch[1];
    }
    
    // Extract object type and record ID from URL path
    // HubSpot record URLs are in format: /contacts/26472064/record/0-1/123456789
    const recordMatch = url.match(/\/record\/\d+-\d+\/(\d+)/);
    if (recordMatch) {
      recordId = recordMatch[1];
      
      // Determine object type from URL path - use more precise matching
      console.log('🔍 Analyzing URL for object type:', url);
      
      // Use regex to match the exact path pattern
      const objectTypeMatch = url.match(/\/(contacts|companies|deals|tickets|notes|meetings|calls|emails|tasks)\//);
      if (objectTypeMatch) {
        objectType = objectTypeMatch[1];
        console.log('✅ Found object type:', objectType);
      } else {
        console.log('❌ Could not determine object type from URL');
      }
    }
    
    console.log('🔍 Parsed URL info:', { objectType, recordId, portalId, url });
    
    if (!objectType) {
      alert('Not on a HubSpot record page. Please navigate to a contact, company, deal, or other record page.');
      return;
    }
    
    if (!recordId) {
      alert('Could not determine record ID from URL. Please ensure you are on a valid HubSpot record page.');
      return;
    }

    console.log('📋 Record info:', { objectType, recordId, portalId });
    
    // Get access token
    chrome.storage.local.get(['accessToken'], (data) => {
      if (!data.accessToken) {
        alert('Please reconnect to HubSpot first');
        return;
      }

      // Fetch record properties
      fetchRecordProperties(objectType, recordId, portalId, data.accessToken);
    });
    
  } catch (error) {
    console.error('❌ Record inspection error:', error);
    alert('Record inspection error: ' + error.message);
  }
}

function fetchRecordProperties(objectType, recordId, portalId, accessToken) {
  // Map object types to correct API endpoints
  let endpoint;
  switch (objectType) {
    case 'contacts':
      endpoint = `/crm/v3/objects/contacts/${recordId}`;
      break;
    case 'companies':
      endpoint = `/crm/v3/objects/companies/${recordId}`;
      break;
    case 'deals':
      endpoint = `/crm/v3/objects/deals/${recordId}`;
      break;
    case 'tickets':
      endpoint = `/crm/v3/objects/tickets/${recordId}`;
      break;
    case 'notes':
      endpoint = `/crm/v3/objects/notes/${recordId}`;
      break;
    case 'meetings':
      endpoint = `/crm/v3/objects/meetings/${recordId}`;
      break;
    case 'calls':
      endpoint = `/crm/v3/objects/calls/${recordId}`;
      break;
    case 'emails':
      endpoint = `/crm/v3/objects/emails/${recordId}`;
      break;
    case 'tasks':
      endpoint = `/crm/v3/objects/tasks/${recordId}`;
      break;
    case 'custom':
      endpoint = `/crm/v3/objects/custom/${recordId}`;
      break;
    default:
      endpoint = `/crm/v3/objects/${objectType}/${recordId}`;
  }
  
  // Add common properties to the request
  const commonProperties = ['id', 'hs_object_id', 'createdate', 'lastmodifieddate'];
  const propertiesParam = commonProperties.join(',');
  
  const fullEndpoint = `${endpoint}?properties=${propertiesParam}`;
  console.log('🔍 Fetching record properties from:', fullEndpoint);
  
  chrome.runtime.sendMessage({
    type: 'apiCall',
    endpoint: fullEndpoint,
    accessToken: accessToken,
    portalId: portalId
  }, (response) => {
    console.log('📥 API response received:', response);
    
    if (response && response.success && response.data) {
      console.log('✅ Record properties fetched:', response.data);
      displayRecordProperties(response.data, objectType);
    } else {
      console.error('❌ Failed to fetch record properties:', response?.error);
      console.error('❌ Full response:', response);
      
      let errorMessage = 'Failed to fetch record properties';
      if (response?.error) {
        if (response.error.includes('404')) {
          errorMessage = `Record not found. The ${objectType} record may have been deleted or you may not have access to it.`;
        } else if (response.error.includes('401')) {
          errorMessage = 'Authentication failed. Please reconnect to HubSpot.';
        } else if (response.error.includes('403')) {
          errorMessage = 'Access denied. You may not have permission to view this object type.';
        } else if (response.error.includes('expired')) {
          errorMessage = 'OAuth token expired. Please reconnect to HubSpot.';
        } else {
          errorMessage = response.error;
        }
      }
      alert(errorMessage);
    }
  });
}

function displayRecordProperties(record, objectType) {
  // Create modal to display properties
  const modal = document.createElement('div');
  modal.style.cssText = `
    position: fixed;
    top: 0;
    left: 0;
    width: 100vw;
    height: 100vh;
    background: rgba(0,0,0,0.5);
    z-index: 100000;
    display: flex;
    align-items: center;
    justify-content: center;
    padding: 20px;
  `;
  
  const modalContent = document.createElement('div');
  modalContent.style.cssText = `
    background: white;
    border-radius: 16px;
    max-width: 90vw;
    max-height: 90vh;
    overflow: auto;
    box-shadow: 0 20px 40px rgba(0,0,0,0.3);
  `;
  
  const header = document.createElement('div');
  header.style.cssText = `
    background: linear-gradient(135deg, #8b5cf6 0%, #7c3aed 100%);
    color: white;
    padding: 24px;
    border-radius: 16px 16px 0 0;
    display: flex;
    justify-content: space-between;
    align-items: center;
  `;
  
  header.innerHTML = `
    <div>
      <h2 style="margin: 0; font-size: 20px;">📋 ${objectType.charAt(0).toUpperCase() + objectType.slice(1)} Record Properties</h2>
      <p style="margin: 4px 0 0 0; opacity: 0.9;">ID: ${record.id || record.hs_object_id}</p>
    </div>
    <button id="close-modal" style="
      background: rgba(255,255,255,0.2);
      border: none;
      color: white;
      font-size: 20px;
      cursor: pointer;
      padding: 8px;
      width: 36px;
      height: 36px;
      border-radius: 8px;
    ">×</button>
  `;
  
  const body = document.createElement('div');
  body.style.cssText = 'padding: 24px;';
  
  if (record.properties) {
    const table = document.createElement('table');
    table.style.cssText = `
      width: 100%;
      border-collapse: collapse;
      font-size: 14px;
      background: white;
      border-radius: 8px;
      overflow: hidden;
      box-shadow: 0 2px 8px rgba(0,0,0,0.1);
    `;
    
    const thead = document.createElement('thead');
    thead.innerHTML = `
      <tr style="background: #f8fafc; border-bottom: 2px solid #e2e8f0;">
        <th style="padding: 12px; text-align: left; font-weight: 600; color: #1e293b;">Property</th>
        <th style="padding: 12px; text-align: left; font-weight: 600; color: #1e293b;">Type</th>
        <th style="padding: 12px; text-align: left; font-weight: 600; color: #1e293b;">Value</th>
      </tr>
    `;
    
    const tbody = document.createElement('tbody');
    
    // Sort properties for better readability
    const sortedProperties = Object.entries(record.properties).sort(([a], [b]) => a.localeCompare(b));
    
    sortedProperties.forEach(([key, value]) => {
      const row = document.createElement('tr');
      row.style.cssText = 'border-bottom: 1px solid #f1f5f9;';
      
      // Better type detection
      let type = 'Unknown';
      let displayValue = 'N/A';
      
      if (value === null || value === undefined) {
        type = 'Null';
        displayValue = 'NULL';
      } else if (Array.isArray(value)) {
        type = 'Array';
        displayValue = value.length > 0 ? `[${value.length} items] ${JSON.stringify(value).substring(0, 100)}${JSON.stringify(value).length > 100 ? '...' : ''}` : '[]';
      } else if (typeof value === 'object') {
        type = 'Object';
        displayValue = JSON.stringify(value).substring(0, 100) + (JSON.stringify(value).length > 100 ? '...' : '');
      } else if (typeof value === 'string') {
        type = 'String';
        // Check if it's a date
        if (value.match(/^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}/)) {
          type = 'Date';
          try {
            const date = new Date(value);
            displayValue = date.toLocaleString();
          } catch (e) {
            displayValue = value;
          }
        } else {
          displayValue = value.length > 50 ? value.substring(0, 50) + '...' : value;
        }
      } else if (typeof value === 'number') {
        type = 'Number';
        displayValue = value.toLocaleString();
      } else if (typeof value === 'boolean') {
        type = 'Boolean';
        displayValue = value ? 'Yes' : 'No';
      } else {
        type = typeof value;
        displayValue = String(value);
      }
      
      row.innerHTML = `
        <td style="padding: 12px; font-weight: 500; color: #1e293b;">${key}</td>
        <td style="padding: 12px; color: #6b7280; font-family: monospace;">${type}</td>
        <td style="padding: 12px; color: #475569; max-width: 400px; word-wrap: break-word;">${displayValue}</td>
      `;
      
      tbody.appendChild(row);
    });
    
    table.appendChild(thead);
    table.appendChild(tbody);
    body.appendChild(table);
    
    // Add summary
    const summary = document.createElement('div');
    summary.style.cssText = `
      margin-top: 20px;
      padding: 16px;
      background: #f8fafc;
      border-radius: 8px;
      border: 1px solid #e2e8f0;
    `;
    summary.innerHTML = `
      <strong>📊 Summary:</strong> ${Object.keys(record.properties).length} properties found
      <br><small>Record ID: ${record.id || record.hs_object_id}</small>
    `;
    body.appendChild(summary);
  } else {
    body.innerHTML = '<p style="color: #6b7280; text-align: center;">No properties found</p>';
  }
  
  modalContent.appendChild(header);
  modalContent.appendChild(body);
  modal.appendChild(modalContent);
  document.body.appendChild(modal);
  
  // Close modal functionality
  const closeBtn = document.getElementById('close-modal');
  if (closeBtn) {
    closeBtn.addEventListener('click', () => {
      modal.remove();
    });
  }
  
  // Close on outside click
  modal.addEventListener('click', (e) => {
    if (e.target === modal) {
      modal.remove();
    }
  });
}

// REAL Connection Status Check
async function checkConnectionStatus() {
  try {
    console.log('🔍 Checking connection status...');
    const data = await chrome.storage.local.get(['accessToken', 'portalId', 'expiresAt']);
    console.log('🔍 Token data:', { 
      hasToken: !!data.accessToken, 
      hasPortalId: !!data.portalId, 
      expiresAt: data.expiresAt,
      currentTime: Date.now()
    });
    
    const statusElement = document.getElementById('lens-connection-status');
    const reconnectBtn = document.getElementById('lens-reconnect');
    
    if (data.accessToken && data.portalId) {
      // Check if token is expired or expiring soon
      const now = Date.now();
      const isExpired = data.expiresAt && now >= data.expiresAt;
      const isExpiringSoon = data.expiresAt && now >= data.expiresAt - 300000; // 5 minutes
      
      console.log('🔍 Token status check:', { 
        now, 
        expiresAt: data.expiresAt, 
        isExpired, 
        isExpiringSoon,
        timeUntilExpiry: data.expiresAt ? data.expiresAt - now : 'N/A'
      });
      
      if (statusElement) {
        if (isExpired) {
          statusElement.style.background = '#fef2f2';
          statusElement.style.borderColor = '#fecaca';
          statusElement.style.color = '#dc2626';
          statusElement.innerHTML = '🔴 Token expired - Please reconnect to HubSpot';
        } else if (isExpiringSoon) {
          statusElement.style.background = '#fef3c7';
          statusElement.style.borderColor = '#f59e0b';
          statusElement.style.color = '#92400e';
          statusElement.innerHTML = '🟡 Token expiring soon - Consider reconnecting';
        } else {
          statusElement.style.background = '#f0fdf4';
          statusElement.style.borderColor = '#bbf7d0';
          statusElement.style.color = '#166534';
          statusElement.innerHTML = '🟢 Connected to HubSpot';
        }
      }
      
      if (reconnectBtn) {
        reconnectBtn.textContent = isExpired ? '🔗 Reconnect to HubSpot' : '🔄 Refresh Connection';
      }
      
      // Auto-open Settings tab if token is expired or expiring soon
      if (isExpired || isExpiringSoon) {
        console.log('🔐 Token issue detected:', { isExpired, isExpiringSoon });
        
        // Only auto-switch if we haven't already shown a warning for this session
        const warningShown = sessionStorage.getItem('token-warning-shown');
        console.log('🔐 Warning already shown in session:', warningShown);
        
        if (!warningShown) {
          console.log('🔐 Auto-opening Settings tab for token management...');
          
          // Switch to Settings tab immediately
          switchToTab('settings');
          console.log('✅ Switched to Settings tab for token management');
          
          // Mark warning as shown for this session
          sessionStorage.setItem('token-warning-shown', 'true');
          console.log('🔐 Marked warning as shown in session storage');
          
          // Clear the warning flag after 1 hour
          setTimeout(() => {
            sessionStorage.removeItem('token-warning-shown');
            console.log('🔐 Cleared warning flag from session storage');
          }, 3600000); // 1 hour
        } else {
          console.log('🔐 Token warning already shown in this session');
        }
      } else {
        console.log('🔐 Token is valid, no need to open Settings tab');
      }
    } else {
      if (statusElement) {
        statusElement.style.background = '#fef2f2';
        statusElement.style.borderColor = '#fecaca';
        statusElement.style.color = '#dc2626';
        statusElement.innerHTML = '🔴 Not connected to HubSpot';
      }
      if (reconnectBtn) {
        reconnectBtn.textContent = '🔗 Connect to HubSpot';
      }
      
      // Auto-open Settings tab if not connected
      const warningShown = sessionStorage.getItem('token-warning-shown');
      if (!warningShown) {
        console.log('🔐 Not connected to HubSpot, auto-opening Settings tab...');
        
        // Switch to Settings tab immediately
        switchToTab('settings');
        console.log('✅ Switched to Settings tab for connection');
        
        sessionStorage.setItem('token-warning-shown', 'true');
        
        setTimeout(() => {
          sessionStorage.removeItem('token-warning-shown');
        }, 3600000); // 1 hour
      } else {
        console.log('🔐 Connection warning already shown in this session');
      }
    }
  } catch (error) {
    console.error('❌ Error checking connection status:', error);
  }
}

// REAL OAuth Start
function startOAuth() {
  console.log('🚀 Starting OAuth flow...');
  chrome.runtime.sendMessage({ type: 'startOAuth' }, (response) => {
    if (response && response.success) {
      console.log('✅ OAuth initiated successfully');
      // Check status again after a delay
      setTimeout(checkConnectionStatus, 2000);
    } else {
      console.error('❌ OAuth failed:', response?.error);
      alert('Failed to start OAuth: ' + (response?.error || 'Unknown error'));
    }
  });
}

// Export Functions
function exportResults(format) {
  const results = window.lensQueryResults;
  if (!results || results.length === 0) {
    alert('No results to export');
    return;
  }

  // Check for bulk operation warning
  if (results.length > 1000) {
    const confirmBulk = confirm(`⚠️ BULK OPERATION WARNING ⚠️\n\nYou are about to export ${results.length.toLocaleString()} records.\n\nThis is a bulk operation that may:\n• Take longer to process\n• Generate large files\n• Impact performance\n\nDo you want to continue with the export?`);
    if (!confirmBulk) {
      return;
    }
  }

  if (format === 'csv') {
    exportToCSV(results);
  } else if (format === 'json') {
    exportToJSON(results);
  }
}

function exportToCSV(results) {
  const headers = ['ID'];
  const allProperties = new Set();
  
  results.forEach(record => {
    if (record.properties) {
      Object.keys(record.properties).forEach(prop => allProperties.add(prop));
    }
  });
  
  headers.push(...Array.from(allProperties));
  
        const csvContent = [
    headers.join(','),
    ...results.map(record => {
      const row = [record.id || record.hs_object_id || ''];
      headers.slice(1).forEach(prop => {
        const value = record.properties?.[prop] || '';
        row.push(`"${String(value).replace(/"/g, '""')}"`);
      });
      return row.join(',');
          })
        ].join('\n');

  downloadFile(csvContent, 'hubspot-query-results.csv', 'text/csv');
}

function exportToJSON(results) {
  const jsonContent = JSON.stringify(results, null, 2);
  downloadFile(jsonContent, 'hubspot-query-results.json', 'application/json');
}

function downloadFile(content, filename, mimeType) {
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







// Query Cache Management System
const QUERY_CACHE = {
  // Save a query to recent queries (auto-save)
  saveToRecent: async function(queryData) {
    try {
      const data = await chrome.storage.local.get(['recentQueries', 'savedQueries']);
      const recentQueries = data.recentQueries || [];
      const savedQueries = data.savedQueries || [];
      
      // Create query object
      const query = {
        id: this.generateQueryId(),
        name: queryData.name || `Query ${new Date().toLocaleString()}`,
        objectType: queryData.objectType,
        properties: queryData.properties,
        filters: queryData.filters || [],
        limit: queryData.limit,
        createdAt: new Date().toISOString(),
        lastExecuted: new Date().toISOString(),
        executionCount: 1
      };
      
      // Check if this query already exists in recent
      const existingIndex = recentQueries.findIndex(q => 
        q.objectType === query.objectType &&
        JSON.stringify(q.properties) === JSON.stringify(query.properties) &&
        JSON.stringify(q.filters) === JSON.stringify(query.filters) &&
        q.limit === query.limit
      );
      
      if (existingIndex !== -1) {
        // Update existing query
        recentQueries[existingIndex].lastExecuted = query.lastExecuted;
        recentQueries[existingIndex].executionCount += 1;
        // Move to top
        const updatedQuery = recentQueries.splice(existingIndex, 1)[0];
        recentQueries.unshift(updatedQuery);
      } else {
        // Add new query to top
        recentQueries.unshift(query);
      }
      
      // Keep only last 20 recent queries
      if (recentQueries.length > 20) {
        recentQueries.splice(20);
      }
      
      // Save to storage
      await chrome.storage.local.set({ recentQueries });
      console.log('✅ Query saved to recent:', query.name);
      
      // Update UI if needed
      this.updateQueryCacheUI();
      
    } catch (error) {
      console.error('❌ Error saving query to recent:', error);
    }
  },
  
  // Save a query as a named saved query
  saveQuery: async function(queryData, customName) {
    try {
      const data = await chrome.storage.local.get(['savedQueries']);
      const savedQueries = data.savedQueries || [];
      
      // Check if name already exists
      const existingQuery = savedQueries.find(q => q.name === customName);
      if (existingQuery) {
        throw new Error(`A saved query with name "${customName}" already exists`);
      }
      
      // Create saved query object
      const query = {
        id: this.generateQueryId(),
        name: customName,
        objectType: queryData.objectType,
        properties: queryData.properties,
        filters: queryData.filters || [],
        limit: queryData.limit,
        createdAt: new Date().toISOString(),
        lastExecuted: new Date().toISOString(),
        executionCount: 1
      };
      
      // Add to saved queries
      savedQueries.push(query);
      
      // Save to storage
      await chrome.storage.local.set({ savedQueries });
      console.log('✅ Query saved:', customName);
      
      // Update UI
      this.updateQueryCacheUI();
      
      return query;
      
    } catch (error) {
      console.error('❌ Error saving query:', error);
      throw error;
    }
  },
  
  // Load a saved query
  loadQuery: async function(queryId) {
    try {
      const data = await chrome.storage.local.get(['savedQueries', 'recentQueries']);
      const savedQueries = data.savedQueries || [];
      const recentQueries = data.recentQueries || [];
      
      // Search in both saved and recent queries
      const query = savedQueries.find(q => q.id === queryId) || 
                   recentQueries.find(q => q.id === queryId);
      
      if (!query) {
        throw new Error('Query not found');
      }
      
      // Update execution count and timestamp
      query.lastExecuted = new Date().toISOString();
      query.executionCount += 1;
      
      // Save updated data
      await chrome.storage.local.set({ savedQueries, recentQueries });
      
      return query;
      
    } catch (error) {
      console.error('❌ Error loading query:', error);
      throw error;
    }
  },
  
  // Get all saved queries
  getSavedQueries: async function() {
    try {
      const data = await chrome.storage.local.get(['savedQueries']);
      return data.savedQueries || [];
    } catch (error) {
      console.error('❌ Error getting saved queries:', error);
      return [];
    }
  },
  
  // Get recent queries
  getRecentQueries: async function() {
    try {
      const data = await chrome.storage.local.get(['recentQueries']);
      return data.recentQueries || [];
    } catch (error) {
      console.error('❌ Error getting recent queries:', error);
      return [];
    }
  },
  
  // Delete a saved query
  deleteSavedQuery: async function(queryId) {
    try {
      const data = await chrome.storage.local.get(['savedQueries']);
      const savedQueries = data.savedQueries || [];
      
      const filteredQueries = savedQueries.filter(q => q.id !== queryId);
      await chrome.storage.local.set({ savedQueries: filteredQueries });
      
      console.log('✅ Query deleted:', queryId);
      this.updateQueryCacheUI();
      
    } catch (error) {
      console.error('❌ Error deleting query:', error);
      throw error;
    }
  },
  
  // Generate unique query ID
  generateQueryId: function() {
    return 'query_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9);
  },
  
  // Update UI elements for query cache
  updateQueryCacheUI: function() {
    // This will be implemented to update the UI when queries change
    console.log('🔄 Updating query cache UI...');
    // Call the loadQueryCacheUI function to refresh the display
    if (typeof loadQueryCacheUI === 'function') {
      loadQueryCacheUI();
    } else {
      console.error('❌ loadQueryCacheUI function not available');
    }
  }
};

// Properties Autocomplete System
function initializePropertiesAutocomplete() {
  console.log('🔍 Initializing properties autocomplete...');
  
  const input = document.getElementById('lens-properties-input');
  const suggestions = document.getElementById('lens-properties-suggestions');
  const chips = document.getElementById('lens-properties-chips');
  
  console.log('🔍 Debug - Input element:', input);
  console.log('🔍 Debug - Suggestions element:', suggestions);
  console.log('🔍 Debug - Chips element:', chips);
  
  if (!input || !suggestions || !chips) {
    console.log('❌ Missing required elements for autocomplete');
    return;
  }
  
  console.log('✅ All autocomplete elements found, setting up...');
  
  // Global selected properties - accessible from all functions
  window.selectedProperties = new Set();
  let allProperties = [];

  // Keep a global copy for other UI pieces (filters/order)
  function setAllProperties(list) {
    allProperties = Array.isArray(list) ? list : [];
    window.lensAllProperties = allProperties;
  }
  
  // Initialize global selected properties if not already set
  if (!window.selectedProperties) {
    window.selectedProperties = new Set();
  }
  
  // Common HubSpot properties
  const commonProperties = [
    'email', 'firstname', 'lastname', 'company', 'phone', 'address', 'city', 'state', 'zip',
    'country', 'website', 'jobtitle', 'lifecyclestage', 'leadstatus', 'createdate', 'lastmodifieddate',
    'dealname', 'amount', 'dealstage', 'closedate', 'pipeline', 'subject', 'content', 'ticket_pipeline'
  ];
  
  // Load properties when object type changes
  const objectTypeSelect = document.getElementById('lens-object-type');
  if (objectTypeSelect) {
    objectTypeSelect.addEventListener('change', () => {
      console.log('🔄 Object type changed to:', objectTypeSelect.value);
      // Clear selected properties when object type changes
      selectedProperties.clear();
      renderChips();
      loadPropertiesForObjectType(objectTypeSelect.value);
      
      // Also refresh filter dropdowns after a short delay to ensure properties are loaded
      setTimeout(() => {
        console.log('🔄 Refreshing filter dropdowns after object type change');
        console.log('🔄 Available properties:', window.lensAllProperties);
        refreshFilterAndOrderDropdowns();
      }, 500);
    });
  }
  
  // Input event for filtering
  input.addEventListener('input', (e) => {
    const query = e.target.value.toLowerCase();
    if (query.length < 2) {
      suggestions.style.display = 'none';
      return;
    }
    
    const filtered = allProperties.filter(prop => 
      prop.toLowerCase().includes(query)
    ).slice(0, 10);
    
    if (filtered.length > 0) {
      showSuggestions(filtered);
      } else {
      suggestions.style.display = 'none';
    }
  });
  
  // Focus events for better UX
  input.addEventListener('focus', () => {
    const container = document.getElementById('lens-properties-container');
    if (container) {
      container.style.borderColor = '#8b5cf6';
    }
  });
  
  input.addEventListener('blur', () => {
    const container = document.getElementById('lens-properties-container');
    if (container) {
      container.style.borderColor = '#e5e7eb';
    }
    // Hide suggestions after a delay to allow clicking
    setTimeout(() => {
      suggestions.style.display = 'none';
    }, 200);
  });
  
  // Keyboard navigation
  input.addEventListener('keydown', (e) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      const activeSuggestion = suggestions.querySelector('.active');
      if (activeSuggestion) {
        addProperty(activeSuggestion.dataset.value);
      }
    } else if (e.key === 'ArrowDown') {
      e.preventDefault();
      navigateSuggestions(1);
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      navigateSuggestions(-1);
    } else if (e.key === 'Escape') {
      suggestions.style.display = 'none';
    }
  });
  
  // Click outside to hide suggestions
  document.addEventListener('click', (e) => {
    if (!input.contains(e.target) && !suggestions.contains(e.target)) {
      suggestions.style.display = 'none';
    }
  });
  
  function showSuggestions(props) {
    suggestions.innerHTML = '';
    props.forEach((prop, index) => {
      const li = document.createElement('li');
      li.textContent = prop;
      li.dataset.value = prop;
      li.className = index === 0 ? 'active' : '';
      li.style.cssText = `
        padding: 8px 12px;
        cursor: pointer;
        border-bottom: 1px solid #f1f5f9;
        transition: background-color 0.2s;
        font-size: 14px;
        color: #374151;
      `;
      
      li.addEventListener('mouseenter', () => {
        li.style.backgroundColor = '#f8fafc';
      });
      
      li.addEventListener('mouseleave', () => {
        li.style.backgroundColor = 'white';
      });
      
      li.addEventListener('mouseenter', () => {
        suggestions.querySelectorAll('li').forEach(l => {
          l.className = '';
          l.style.backgroundColor = 'white';
        });
        li.className = 'active';
        li.style.backgroundColor = '#e0e7ff';
      });
      
      li.addEventListener('click', () => {
        addProperty(prop);
      });
      
      suggestions.appendChild(li);
    });
    
    suggestions.style.display = 'block';
  }
  
  function navigateSuggestions(direction) {
    const items = suggestions.querySelectorAll('li');
    if (items.length === 0) return;
    
    const current = suggestions.querySelector('.active');
    let nextIndex = 0;
    
    if (current) {
      const currentIndex = Array.from(items).indexOf(current);
      nextIndex = (currentIndex + direction + items.length) % items.length;
      current.className = '';
      current.style.backgroundColor = 'white';
    }
    
    items[nextIndex].className = 'active';
    items[nextIndex].style.backgroundColor = '#e0e7ff';
  }
  
  function addProperty(property) {
    console.log('🔍 Adding property:', property);
    console.log('🔍 Current selected properties:', Array.from(selectedProperties));
    
    if (selectedProperties.has(property)) {
      console.log('⚠️ Property already exists:', property);
      return;
    }

    selectedProperties.add(property);
    console.log('✅ Property added. New selected properties:', Array.from(selectedProperties));
    renderChips();
    input.value = '';
    suggestions.style.display = 'none';
  }
  
  function removeProperty(property) {
    selectedProperties.delete(property);
    renderChips();
  }
  
  function renderChips() {
    console.log('🔍 Rendering chips for properties:', Array.from(selectedProperties));
    chips.innerHTML = '';
    selectedProperties.forEach(property => {
      const chip = document.createElement('span');
      chip.style.cssText = `
        background: linear-gradient(135deg, #8b5cf6 0%, #7c3aed 100%);
        color: white;
        padding: 4px 8px;
        border-radius: 16px;
        font-size: 12px;
        display: flex;
        align-items: center;
        gap: 4px;
      `;
      
      chip.innerHTML = `
        ${property}
        <button class="remove-property-btn" style="
          background: none;
          border: none;
          color: white;
          cursor: pointer;
          font-size: 14px;
          padding: 0;
          margin-left: 4px;
        ">×</button>
      `;
      
      // Add click event for removal
      const removeBtn = chip.querySelector('.remove-property-btn');
      removeBtn.addEventListener('click', (e) => {
        e.stopPropagation();
        removeProperty(property);
      });
      
      chips.appendChild(chip);
    });
  }
  
  // Global function to remove property chips
  window.removePropertyChip = function(property) {
    removeProperty(property);
  };
  
  // Load properties for specific object type
  async function loadPropertiesForObjectType(objectType) {
    if (!objectType) {
      allProperties = commonProperties;
      return;
    }
    
    try {
      const data = await chrome.storage.local.get(['accessToken', 'portalId']);
      if (!data.accessToken) {
        setAllProperties(commonProperties);
      return;
    }

      // Try to fetch properties from HubSpot
      chrome.runtime.sendMessage({
        type: 'apiCall',
        endpoint: `/crm/v3/properties/${objectType}`,
        accessToken: data.accessToken,
        portalId: data.portalId
      }, (response) => {
        if (response && response.success && response.data && response.data.results) {
          setAllProperties(response.data.results.map(prop => prop.name));
          console.log(`✅ Loaded ${allProperties.length} properties for ${objectType}`);
          refreshFilterAndOrderDropdowns();
    } else {
          setAllProperties(commonProperties);
          console.log(`⚠️ Using fallback properties for ${objectType}`);
          refreshFilterAndOrderDropdowns();
        }
      });
      
    } catch (error) {
      console.error('❌ Error loading properties:', error);
      setAllProperties(commonProperties);
    }
  }
  
  // Initialize with common properties
  setAllProperties(commonProperties);
  
  // Also populate any existing filter/order dropdowns with common properties
  setTimeout(() => {
    console.log('🔍 Initializing filter dropdowns with common properties:', window.lensAllProperties);
    refreshFilterAndOrderDropdowns();
  }, 100);
}

// Initialize new properties selection system
function initializeNewPropertiesSelection() {
  console.log('🔍 Initializing new properties selection system...');
  
  const input = document.getElementById('lens-new-properties-input');
  const propertiesList = document.getElementById('lens-new-properties-list');
  const selectedContainer = document.getElementById('lens-new-selected-properties');
  
  if (!input || !propertiesList || !selectedContainer) {
    console.log('❌ Missing required elements for new properties selection');
    return;
  }
  
  console.log('✅ All new properties selection elements found, setting up...');
  
  let selectedProperties = new Set();
  let allProperties = [];
  let filteredProperties = [];
  let currentFocusIndex = -1;
  
  // Load properties when object type changes
  const objectTypeSelect = document.getElementById('lens-object-type');
  if (objectTypeSelect) {
    objectTypeSelect.addEventListener('change', () => {
      console.log('🔄 Object type changed, updating new properties selection');
      selectedProperties.clear();
      renderSelectedProperties();
      loadPropertiesForNewSelection(objectTypeSelect.value);
    });
  }
  
  // Input event for filtering
  input.addEventListener('input', (e) => {
    const query = e.target.value.toLowerCase();
    filterProperties(query);
  });
  
  // Keyboard navigation
  input.addEventListener('keydown', (e) => {
    if (e.key === 'Tab') {
      e.preventDefault();
      navigatePropertiesList(1);
    } else if (e.key === 'Enter') {
      e.preventDefault();
      selectFocusedProperty();
    } else if (e.key === 'Escape') {
      clearFocus();
    }
  });
  
  // Focus events
  input.addEventListener('focus', () => {
    const container = document.getElementById('lens-new-properties-container');
    if (container) {
      container.style.borderColor = '#8b5cf6';
    }
    filterProperties(input.value.toLowerCase());
  });
  
  input.addEventListener('blur', () => {
    const container = document.getElementById('lens-new-properties-container');
    if (container) {
      container.style.borderColor = '#e5e7eb';
    }
    // Don't clear focus immediately to allow clicking
    setTimeout(() => {
      if (!propertiesList.contains(document.activeElement)) {
        clearFocus();
      }
    }, 200);
  });
  
  function filterProperties(query) {
    if (!query) {
      filteredProperties = allProperties;
    } else {
      filteredProperties = allProperties.filter(prop => 
        prop.name.toLowerCase().includes(query) || prop.label.toLowerCase().includes(query)
      );
    }
    renderPropertiesList();
  }
  
  // Make renderPropertiesList globally accessible
  window.renderPropertiesList = function() {
    const propertiesList = document.getElementById('lens-new-properties-list');
    if (!propertiesList) {
      console.log('🔧 propertiesList not found, skipping render');
      return;
    }
    
    propertiesList.innerHTML = '';
    
    // Check if object type is selected
    const objectTypeSelect = document.getElementById('lens-object-type');
    if (!objectTypeSelect || !objectTypeSelect.value) {
      propertiesList.innerHTML = '<div style="padding: 8px; color: #6b7280; font-style: italic;">Please select an object type first</div>';
      return;
    }
    
    if (filteredProperties.length === 0) {
      propertiesList.innerHTML = '<div style="padding: 8px; color: #6b7280; font-style: italic;">No properties found</div>';
      return;
    }
    
    filteredProperties.forEach((property, index) => {
      const propertyElement = document.createElement('span');
      propertyElement.style.cssText = `
        display: inline-block;
        padding: 6px 12px;
        margin: 2px;
        background: ${window.selectedProperties.has(property.name) ? '#a78bfa' : '#e5e7eb'};
        color: ${window.selectedProperties.has(property.name) ? 'white' : '#374151'};
        border-radius: 16px;
        font-size: 12px;
        cursor: pointer;
        transition: all 0.2s ease;
        user-select: none;
      `;
      
      propertyElement.innerHTML = `
        <div style="display: flex; flex-direction: column; align-items: flex-start; line-height: 1;">
          <span style="font-size: 12px; font-weight: normal;">${property.label}</span>
          <span style="font-size: 10px; opacity: 0.8; font-weight: normal;">${property.name}</span>
        </div>
      `;
      
      propertyElement.addEventListener('click', () => {
        window.toggleProperty(property.name);
      });
      
      propertyElement.addEventListener('mouseenter', () => {
        if (!window.selectedProperties.has(property.name)) {
          propertyElement.style.background = '#d1d5db';
        }
      });
      
      propertyElement.addEventListener('mouseleave', () => {
        if (!window.selectedProperties.has(property.name)) {
          propertyElement.style.background = window.selectedProperties.has(property.name) ? '#a78bfa' : '#e5e7eb';
        }
      });
      
      propertiesList.appendChild(propertyElement);
    });
  };
  
  function navigatePropertiesList(direction) {
    const propertyElements = propertiesList.querySelectorAll('span');
    if (propertyElements.length === 0) return;
    
    // Clear previous focus
    clearFocus();
    
    // Set new focus
    if (direction > 0) {
      currentFocusIndex = 0;
    } else {
      currentFocusIndex = propertyElements.length - 1;
    }
    
    if (currentFocusIndex >= 0 && currentFocusIndex < propertyElements.length) {
      propertyElements[currentFocusIndex].style.background = '#8b5cf6';
      propertyElements[currentFocusIndex].style.color = 'white';
      propertyElements[currentFocusIndex].focus();
    }
  }
  
  function selectFocusedProperty() {
    if (currentFocusIndex >= 0 && currentFocusIndex < filteredProperties.length) {
      const property = filteredProperties[currentFocusIndex];
      toggleProperty(property.name);
    }
  }
  
  function clearFocus() {
    currentFocusIndex = -1;
    const propertyElements = propertiesList.querySelectorAll('span');
    propertyElements.forEach(element => {
      const propertyName = element.title ? element.title.match(/\(([^)]+)\)/)?.[1] : element.textContent;
      element.style.background = selectedProperties.has(propertyName) ? '#a78bfa' : '#e5e7eb';
      element.style.color = selectedProperties.has(propertyName) ? 'white' : '#374151';
    });
  }
  
  // Make toggleProperty globally accessible
  window.toggleProperty = function(property) {
    if (window.selectedProperties.has(property)) {
      window.selectedProperties.delete(property);
    } else {
      window.selectedProperties.add(property);
    }
    window.renderSelectedProperties();
    window.renderPropertiesList();
  };
  
  // Make renderSelectedProperties globally accessible
  window.renderSelectedProperties = function() {
    const selectedContainer = document.getElementById('lens-new-selected-properties');
    if (!selectedContainer) {
      console.log('🔧 selectedContainer not found, skipping render');
      return;
    }
    
    selectedContainer.innerHTML = '';
    
    // Safety check - ensure selectedProperties exists
    if (!window.selectedProperties) {
      window.selectedProperties = new Set();
      console.log('🔧 Created selectedProperties in renderSelectedProperties');
    }
    
    if (window.selectedProperties.size === 0) {
      selectedContainer.innerHTML = '<div style="color: #9ca3af; font-style: italic; padding: 4px;">No properties selected</div>';
      return;
    }
    
    window.selectedProperties.forEach(propertyName => {
      // Find the property object to get the label
      const propertyObj = allProperties.find(p => p.name === propertyName);
      const displayLabel = propertyObj ? propertyObj.label : propertyName;
      
      const tag = document.createElement('span');
      tag.style.cssText = `
        background: linear-gradient(135deg, #8b5cf6 0%, #7c3aed 100%);
        color: white;
        padding: 4px 8px;
        border-radius: 16px;
        font-size: 12px;
        display: flex;
        align-items: center;
        gap: 4px;
        margin: 2px;
        cursor: pointer;
      `;
      
      tag.title = `${displayLabel} (${propertyName})`; // Tooltip showing both label and API name
      
      tag.innerHTML = `
        ${displayLabel}
        <button class="remove-property-btn" style="
          background: none;
          border: none;
          color: white;
          cursor: pointer;
          font-size: 14px;
          padding: 0;
          margin-left: 4px;
        ">×</button>
      `;
      
      // Add click event for removal
      const removeBtn = tag.querySelector('.remove-property-btn');
      removeBtn.addEventListener('click', (e) => {
        e.stopPropagation();
        window.selectedProperties.delete(propertyName);
        window.renderSelectedProperties();
        window.renderPropertiesList();
      });
      
      selectedContainer.appendChild(tag);
    });
  };
  
  // Load properties for specific object type - moved to global scope
  window.loadPropertiesForNewSelection = async function(objectType) {
    if (!objectType) {
      allProperties = commonProperties.map(prop => ({ name: prop, label: prop }));
      renderPropertiesList();
      return;
    }
    
    try {
      const data = await chrome.storage.local.get(['accessToken', 'portalId']);
      if (!data.accessToken) {
        allProperties = commonProperties.map(prop => ({ name: prop, label: prop }));
        renderPropertiesList();
        return;
      }

      // Try to fetch properties from HubSpot
      chrome.runtime.sendMessage({
        type: 'apiCall',
        endpoint: `/crm/v3/properties/${objectType}`,
        accessToken: data.accessToken,
        portalId: data.portalId
      }, (response) => {
        if (response && response.success && response.data && response.data.results) {
          allProperties = response.data.results.map(prop => ({
            name: prop.name,
            label: prop.label || prop.name
          }));
          console.log(`✅ Loaded ${allProperties.length} properties for new selection`);
          
          // Update global properties for filters and order dropdowns
          window.lensAllProperties = allProperties.map(prop => prop.name);
          
          renderPropertiesList();
          refreshFilterAndOrderDropdowns();
        } else {
          allProperties = commonProperties.map(prop => ({ name: prop, label: prop }));
          console.log(`⚠️ Using fallback properties for new selection`);
          
          // Update global properties for filters and order dropdowns
          window.lensAllProperties = commonProperties;
          
          renderPropertiesList();
          refreshFilterAndOrderDropdowns();
        }
      });
      
    } catch (error) {
      console.error('❌ Error loading properties for new selection:', error);
      allProperties = commonProperties.map(prop => ({ name: prop, label: prop }));
      renderPropertiesList();
    }
  };
  
  // Common HubSpot properties
  const commonProperties = [
    'email', 'firstname', 'lastname', 'company', 'phone', 'address', 'city', 'state', 'zip',
    'country', 'website', 'jobtitle', 'lifecyclestage', 'leadstatus', 'createdate', 'lastmodifieddate',
    'dealname', 'amount', 'dealstage', 'closedate', 'pipeline', 'subject', 'content', 'ticket_pipeline'
  ];
  
  // Initialize with common properties
  allProperties = commonProperties;
  renderPropertiesList();
  renderSelectedProperties();
}

// Function to populate selected properties from saved query - made global
window.populateSelectedProperties = async function(properties) {
  console.log('🔍 Populating selected properties:', properties);
  
  // Safety check - ensure selectedProperties exists
  if (!window.selectedProperties) {
    window.selectedProperties = new Set();
    console.log('🔧 Created selectedProperties in populateSelectedProperties');
  }
  
  // Clear current selection
  window.selectedProperties.clear();
  
  // Add properties from saved query
  properties.forEach(prop => {
    window.selectedProperties.add(prop);
  });
  
  console.log('🔍 Selected properties after population:', Array.from(window.selectedProperties));
  
  // Wait a bit for the UI to be ready, then re-render
  setTimeout(() => {
    if (typeof window.renderSelectedProperties === 'function') {
      window.renderSelectedProperties();
    } else {
      console.error('❌ renderSelectedProperties function not available');
    }
    
    if (typeof window.renderPropertiesList === 'function') {
      window.renderPropertiesList();
    } else {
      console.error('❌ renderPropertiesList function not available');
    }
  }, 100);
};

// Initialize query cache functionality
function initializeQueryCache() {
  console.log('🔍 Initializing query cache functionality...');
  
  // Load saved and recent queries on startup
  loadQueryCacheUI();
  
  // Add click handlers for collapsible sections
  setTimeout(() => {
    const savedHeader = document.querySelector('#lens-saved-queries-container').previousElementSibling;
    const recentHeader = document.querySelector('#lens-recent-queries-container').previousElementSibling;
    
    if (savedHeader) {
      savedHeader.addEventListener('click', () => toggleQuerySection('saved'));
      console.log('✅ Added click handler for saved queries');
    }
    if (recentHeader) {
      recentHeader.addEventListener('click', () => toggleQuerySection('recent'));
      console.log('✅ Added click handler for recent queries');
    }
  }, 100);
  
  // Save current query button
  const saveQueryBtn = document.getElementById('lens-save-current-query');
  if (saveQueryBtn) {
    saveQueryBtn.addEventListener('click', async () => {
      const queryName = prompt('Enter a name for this query:');
      if (!queryName) return;
      
      try {
        const objectType = document.getElementById('lens-object-type').value;
        const properties = getSelectedProperties();
        const limit = document.getElementById('lens-limit').value;
        const filters = getLensFilters();
        
        if (!objectType || !properties || properties.length === 0) {
          alert('Please configure a valid query first (object type and properties)');
          return;
        }
        
        await QUERY_CACHE.saveQuery({
          objectType,
          properties,
          limit,
          filters
        }, queryName);
        
        alert(`Query "${queryName}" saved successfully!`);
        
      } catch (error) {
        alert('Error saving query: ' + error.message);
      }
    });
  }
  
  // Update UI when queries change
  QUERY_CACHE.updateQueryCacheUI = loadQueryCacheUI;
}

// Load and display saved and recent queries
async function loadQueryCacheUI() {
  try {
    const savedQueries = await QUERY_CACHE.getSavedQueries();
    const recentQueries = await QUERY_CACHE.getRecentQueries();
    
    // Update saved queries container
    const savedContainer = document.getElementById('lens-saved-queries-container');
    if (savedContainer) {
      if (savedQueries.length === 0) {
        savedContainer.innerHTML = `
          <div style="text-align: center; color: #9ca3af; font-style: italic; padding: 20px;">
            No saved queries yet. Execute a query and save it for quick access.
          </div>
        `;
      } else {
        savedContainer.innerHTML = savedQueries.map(query => `
          <div style="
            display: flex;
            justify-content: space-between;
            align-items: center;
            padding: 8px 12px;
            margin-bottom: 8px;
            background: #f8fafc;
            border-radius: 6px;
            border: 1px solid #e2e8f0;
            cursor: pointer;
          " data-query-id="${query.id}" class="saved-query-item">
            <div style="flex: 1;">
              <div style="font-weight: 500; color: #1e293b; margin-bottom: 4px;">${query.name}</div>
              <div style="font-size: 12px; color: #6b7280;">
                ${query.objectType} • ${query.properties.length} properties • ${query.executionCount} executions
              </div>
            </div>
            <div style="display: flex; gap: 4px;">
              <button data-action="load" data-query-id="${query.id}" style="
                background: #8b5cf6;
                color: white;
                border: none;
                padding: 4px 8px;
                border-radius: 4px;
                cursor: pointer;
                font-size: 11px;
              ">Load</button>
              <button data-action="delete" data-query-id="${query.id}" style="
                background: #ef4444;
                color: white;
                border: none;
                padding: 4px 8px;
                border-radius: 4px;
                cursor: pointer;
                font-size: 11px;
              ">Delete</button>
            </div>
          </div>
        `).join('');
      }
    }
    
    // Update recent queries container
    const recentContainer = document.getElementById('lens-recent-queries-container');
    if (recentContainer) {
      if (recentQueries.length === 0) {
        recentContainer.innerHTML = `
          <div style="text-align: center; color: #9ca3af; font-style: italic; padding: 20px;">
            No recent queries yet. Execute a query to see it here.
          </div>
        `;
      } else {
        recentContainer.innerHTML = recentQueries.slice(0, 5).map(query => `
          <div style="
            display: flex;
            justify-content: space-between;
            align-items: center;
            padding: 8px 12px;
            margin-bottom: 8px;
            background: #f8fafc;
            border-radius: 6px;
            border: 1px solid #e2e8f0;
          ">
            <div style="flex: 1; cursor: pointer;" data-query-id="${query.id}" class="recent-query-item">
              <div style="font-weight: 500; color: #1e293b; margin-bottom: 4px;">${query.name}</div>
              <div style="font-size: 12px; color: #6b7280;">
                ${query.objectType} • ${query.properties.length} properties • ${new Date(query.lastExecuted).toLocaleDateString()}
              </div>
            </div>
            <div style="display: flex; gap: 4px;">
              <button data-action="load" data-query-id="${query.id}" style="
                background: #8b5cf6;
                color: white;
                border: none;
                padding: 4px 8px;
                border-radius: 4px;
                cursor: pointer;
                font-size: 11px;
              ">Load</button>
            </div>
          </div>
        `).join('');
      }
    }
    
  } catch (error) {
    console.error('❌ Error loading query cache UI:', error);
  }
  
  // Add event listeners for query cache buttons
  setTimeout(() => {
    // Event delegation for saved and recent query buttons
    document.addEventListener('click', (e) => {
      const target = e.target;
      
      // Handle Load and Delete buttons
      if (target.matches('[data-action="load"], [data-action="delete"]')) {
        e.preventDefault();
        e.stopPropagation();
        
        const action = target.getAttribute('data-action');
        const queryId = target.getAttribute('data-query-id');
        
        console.log(`🔍 Button clicked: ${action} for query ${queryId}`);
        
        if (action === 'load' && typeof window.loadSavedQuery === 'function') {
          window.loadSavedQuery(queryId);
        } else if (action === 'delete' && typeof window.deleteSavedQuery === 'function') {
          window.deleteSavedQuery(queryId);
        } else {
          console.error(`❌ Function not available for action: ${action}`);
        }
      }
      
      // Handle clicking on query items (load the query)
      if (target.closest('.saved-query-item, .recent-query-item')) {
        const queryItem = target.closest('.saved-query-item, .recent-query-item');
        const queryId = queryItem.getAttribute('data-query-id');
        
        if (queryId && typeof window.loadSavedQuery === 'function') {
          console.log(`🔍 Query item clicked: load query ${queryId}`);
          window.loadSavedQuery(queryId);
        }
      }
    });
    
    console.log('✅ Added event listeners for query cache buttons');
  }, 100);
}



// Global function to toggle query sections
window.toggleQuerySection = function(section) {
  const container = document.getElementById(`lens-${section}-queries-container`);
  const arrow = document.getElementById(`${section}-arrow`);
  
  if (container && arrow) {
    const isVisible = container.style.display !== 'none';
    
    if (isVisible) {
      container.style.display = 'none';
      arrow.style.transform = 'rotate(0deg)';
    } else {
      container.style.display = 'block';
      arrow.style.transform = 'rotate(180deg)';
    }
  }
};

// Get selected properties for query execution
function getSelectedProperties() {
  // Safety check - ensure selectedProperties exists
  if (!window.selectedProperties) {
    window.selectedProperties = new Set();
    console.log('🔧 Created selectedProperties in getSelectedProperties');
  }
  
  // Use global selected properties if available
  if (window.selectedProperties && window.selectedProperties.size > 0) {
    const properties = Array.from(window.selectedProperties);
    
    // Always include hs_object_id to ensure we have the correct record ID for action buttons
    if (!properties.includes('hs_object_id')) {
      properties.push('hs_object_id');
      console.log('🔍 Added hs_object_id to global properties');
    }
    
    console.log('🔍 Using global selected properties:', properties);
    return properties;
  }
  
  // Fallback to DOM reading for backward compatibility
  const newSelectedContainer = document.getElementById('lens-new-selected-properties');
  if (newSelectedContainer) {
    const newSelectedTags = newSelectedContainer.querySelectorAll('span');
    const newProperties = [];
    
    newSelectedTags.forEach(tag => {
      const propertyName = tag.textContent.replace('×', '').trim();
      if (propertyName && propertyName !== '×') {
        newProperties.push(propertyName);
      }
    });
    
    if (newProperties.length > 0) {
      // Always include hs_object_id to ensure we have the correct record ID for action buttons
      if (!newProperties.includes('hs_object_id')) {
        newProperties.push('hs_object_id');
        console.log('🔍 Added hs_object_id to new properties');
      }
      
      console.log('🔍 Using new properties selection:', newProperties);
      return newProperties;
    }
  }
  
  // Fallback to original system
  const chips = document.getElementById('lens-properties-chips');
  console.log('🔍 Debug - Chips element:', chips);
  
  if (!chips) {
    console.log('❌ No chips element found');
    return [];
  }
  
  // Get all chip spans and extract property names
  const chipSpans = chips.querySelectorAll('span');
  console.log('🔍 Debug - Chip spans found:', chipSpans.length);
  
  const properties = [];
  
  chipSpans.forEach((chip, index) => {
    // Get the text content before the × button
    const textContent = chip.textContent;
    console.log(`🔍 Debug - Chip ${index} text:`, textContent);
    const propertyName = textContent.replace('×', '').trim();
    console.log(`🔍 Debug - Chip ${index} property name:`, propertyName);
    if (propertyName && propertyName !== '×') {
      properties.push(propertyName);
    }
  });
  
  // Always include hs_object_id to ensure we have the correct record ID for action buttons
  if (!properties.includes('hs_object_id')) {
    properties.push('hs_object_id');
    console.log('🔍 Added hs_object_id to properties');
  }
  
  console.log('🔍 Final selected properties:', properties);
  return properties;
}

// Initialize filter and order functionality
function initializeFilterAndOrder() {
  // Add filter button
  const addFilterBtn = document.getElementById('lens-add-filter');
  if (addFilterBtn) {
    addFilterBtn.addEventListener('click', addFilterRow);
  }
  
  // Add order button
  const addOrderBtn = document.getElementById('lens-add-order');
  if (addOrderBtn) {
    addOrderBtn.addEventListener('click', addOrderRow);
  }
  
  // Initialize existing rows
  initializeExistingRows();
}

// Add new filter row
function addFilterRow() {
  const container = document.getElementById('lens-filters-container');
  if (!container) return;
  
  const filterRow = document.createElement('div');
  filterRow.className = 'lens-filter-row';
  filterRow.style.cssText = 'display: flex; gap: 8px; margin-bottom: 8px; align-items: center;';
  
  const propertiesOptions = (window.lensAllProperties || []).map(prop => `<option value="${prop}">${prop}</option>`).join('');
  filterRow.innerHTML = `
    <select class="lens-filter-property" style="flex: 1; padding: 8px; border: 1px solid #e5e7eb; border-radius: 4px;">
      <option value="">Select property...</option>
      ${propertiesOptions}
    </select>
    <select class="lens-filter-operator" style="flex: 1; padding: 8px; border: 1px solid #e5e7eb; border-radius: 4px;">
      <option value="eq">Equals (=)</option>
      <option value="ne">Not equals (≠)</option>
      <option value="gt">Greater than (>)</option>
      <option value="gte">Greater than or equal (≥)</option>
      <option value="lt">Less than (<)</option>
      <option value="lte">Less than or equal (≤)</option>
      <option value="contains">Contains</option>
      <option value="not_contains">Does not contain</option>
      <option value="starts_with">Starts with</option>
      <option value="ends_with">Ends with</option>
      <option value="is_known">Is known</option>
      <option value="is_unknown">Is unknown</option>
    </select>
    <input type="text" class="lens-filter-value" placeholder="Value..." style="flex: 1; padding: 8px; border: 1px solid #e5e7eb; border-radius: 4px;">
    <button class="lens-remove-filter" style="background: #ef4444; color: white; border: none; padding: 8px; border-radius: 4px; cursor: pointer; width: 32px; height: 32px;">×</button>
  `;
  
  // Add remove event
  const removeBtn = filterRow.querySelector('.lens-remove-filter');
  removeBtn.addEventListener('click', () => {
    container.removeChild(filterRow);
  });
  
  container.appendChild(filterRow);
}

// Add new order row
function addOrderRow() {
  const container = document.getElementById('lens-order-container');
  if (!container) return;
  
  const orderRow = document.createElement('div');
  orderRow.className = 'lens-order-row';
  orderRow.style.cssText = 'display: flex; gap: 8px; margin-bottom: 8px; align-items: center;';
  
  const orderOptions = (window.lensAllProperties || []).map(prop => `<option value="${prop}">${prop}</option>`).join('');
  orderRow.innerHTML = `
    <select class="lens-order-property" style="flex: 1; padding: 8px; border: 1px solid #e5e7eb; border-radius: 4px;">
      <option value="">Select property...</option>
      ${orderOptions}
    </select>
    <select class="lens-order-direction" style="flex: 1; padding: 8px; border: 1px solid #e5e7eb; border-radius: 4px;">
      <option value="asc">Ascending</option>
      <option value="desc">Descending</option>
    </select>
    <button class="lens-remove-order" style="background: #ef4444; color: white; border: none; padding: 8px; border-radius: 4px; cursor: pointer; width: 32px; height: 32px;">×</button>
  `;
  
  // Add remove event
  const removeBtn = orderRow.querySelector('.lens-remove-order');
  removeBtn.addEventListener('click', () => {
    container.removeChild(orderRow);
  });
  
  container.appendChild(orderRow);
}

  // Initialize existing rows with event listeners
  function initializeExistingRows() {
    // Initialize existing filter rows
    const filterRows = document.querySelectorAll('.lens-filter-row');
    filterRows.forEach(row => {
      const removeBtn = row.querySelector('.lens-remove-filter');
      if (removeBtn) {
        removeBtn.addEventListener('click', () => {
          row.remove();
        });
      }
      
      // Populate property dropdown
      const propertySelect = row.querySelector('.lens-filter-property');
      if (propertySelect) {
        populatePropertyDropdown(propertySelect);
      }
    });
    
    // Initialize existing order rows
    const orderRows = document.querySelectorAll('.lens-order-row');
    orderRows.forEach(row => {
      const removeBtn = row.querySelector('.lens-remove-order');
      if (removeBtn) {
        removeBtn.addEventListener('click', () => {
          row.remove();
        });
      }
      
      // Populate property dropdown
      const propertySelect = row.querySelector('.lens-order-property');
      if (propertySelect) {
        populatePropertyDropdown(propertySelect);
      }
    });
  }
  
  // Populate property dropdown with available properties - made global
  window.populatePropertyDropdown = function(selectElement) {
    if (!selectElement) return;
    
    // Keep the first option (placeholder)
    const placeholder = selectElement.querySelector('option[value=""]');
    const currentValue = selectElement.value; // Save current selection
    selectElement.innerHTML = '';
    
    if (placeholder) {
      selectElement.appendChild(placeholder);
    }
    
    // Use global properties instead of local allProperties
    let properties = window.lensAllProperties || [];
    console.log('🔍 Populating dropdown with properties:', properties);
    
    // Convert property objects to strings if needed
    if (properties.length > 0 && typeof properties[0] === 'object' && properties[0].name) {
      properties = properties.map(prop => prop.name);
    }
    
    // Add property options
    properties.forEach(prop => {
      const option = document.createElement('option');
      option.value = prop;
      option.textContent = prop;
      if (prop === currentValue) {
        option.selected = true; // Restore selection
      }
      selectElement.appendChild(option);
    });
  };

  // Refresh all existing filter and order dropdowns with latest properties
  function refreshFilterAndOrderDropdowns() {
    document.querySelectorAll('.lens-filter-property').forEach(select => {
      populatePropertyDropdown(select);
    });
    document.querySelectorAll('.lens-order-property').forEach(select => {
      populatePropertyDropdown(select);
    });
  }

// Proactively check and refresh tokens
async function checkAndRefreshTokens() {
  try {
    const data = await chrome.storage.local.get(['accessToken', 'expiresAt', 'refreshToken']);
    
    if (data.accessToken && data.expiresAt && data.refreshToken) {
      const now = Date.now();
      const timeUntilExpiry = data.expiresAt - now;
      
      console.log(`🔍 Token status: ${timeUntilExpiry}ms until expiry`);
      
      // If token expires within 10 minutes, try to refresh
      if (timeUntilExpiry < 600000) { // 10 minutes
        console.log('🔄 Token expiring soon, attempting proactive refresh...');
        
        // Send message to background script to refresh token
        chrome.runtime.sendMessage({
          type: 'refreshToken'
        }, (response) => {
          if (response && response.success) {
            console.log('✅ Token refreshed proactively');
            checkConnectionStatus(); // Update UI
          } else {
            console.log('❌ Proactive token refresh failed');
          }
        });
      }
    }
  } catch (error) {
    console.error('❌ Error checking token status:', error);
  }
}

// Quick Links Management System
window.QUICK_LINKS = {
  // Common HubSpot pages for suggestions
  commonPages: [
    { name: 'Contacts List', url: 'https://app.hubspot.com/contacts', icon: '👥' },
    { name: 'Companies List', url: 'https://app.hubspot.com/contacts/companies', icon: '🏢' },
    { name: 'Deals Pipeline', url: 'https://app.hubspot.com/sales/deals', icon: '💰' },
    { name: 'Analytics Dashboard', url: 'https://app.hubspot.com/analytics', icon: '📊' },
    { name: 'Settings', url: 'https://app.hubspot.com/settings', icon: '⚙️' },
    { name: 'Workflows', url: 'https://app.hubspot.com/workflows', icon: '🔄' },
    { name: 'Email Campaigns', url: 'https://app.hubspot.com/marketing/email', icon: '📧' },
    { name: 'Forms', url: 'https://app.hubspot.com/marketing/forms', icon: '📝' },
    { name: 'Landing Pages', url: 'https://app.hubspot.com/marketing/landing-pages', icon: '🌐' },
    { name: 'Tickets', url: 'https://app.hubspot.com/service/tickets', icon: '🎫' },
    { name: 'Knowledge Base', url: 'https://app.hubspot.com/service/knowledge', icon: '📚' },
    { name: 'Chatbots', url: 'https://app.hubspot.com/service/bots', icon: '🤖' }
  ],

  // Get all quick links
  getQuickLinks: async function() {
    try {
      const data = await chrome.storage.local.get(['quickLinks']);
      return data.quickLinks || [];
    } catch (error) {
      console.error('❌ Error getting quick links:', error);
      return [];
    }
  },

  // Save quick links
  saveQuickLinks: async function(quickLinks) {
    try {
      await chrome.storage.local.set({ quickLinks });
      console.log('💾 Quick links saved:', quickLinks.length);
      return true;
    } catch (error) {
      console.error('❌ Error saving quick links:', error);
      return false;
    }
  },

  // Add a new quick link
  addQuickLink: async function(name, url, icon = '🔗', description = '', color = '') {
    try {
      const quickLinks = await this.getQuickLinks();
      
      // Check if we already have 10 links
      if (quickLinks.length >= 10) {
        throw new Error('Maximum of 10 quick links allowed. Please remove one first.');
      }
      
      // Check if URL already exists
      const existingLink = quickLinks.find(link => link.url === url);
      if (existingLink) {
        throw new Error('This URL is already in your quick links.');
      }
      
      // Validate URL
      if (!this.validateUrl(url)) {
        throw new Error('Please enter a valid HubSpot URL starting with https://app.hubspot.com/');
      }
      
      const newLink = {
        id: this.generateId(),
        name: name.trim(),
        url: url.trim(),
        icon: icon,
        description: description.trim(),
        color: color,
        createdAt: new Date().toISOString()
      };
      
      quickLinks.push(newLink);
      await this.saveQuickLinks(quickLinks);
      
      console.log('✅ Quick link added:', newLink);
      return newLink;
      
    } catch (error) {
      console.error('❌ Error adding quick link:', error);
      throw error;
    }
  },

  // Remove a quick link
  removeQuickLink: async function(linkId) {
    try {
      const quickLinks = await this.getQuickLinks();
      const filteredLinks = quickLinks.filter(link => link.id !== linkId);
      await this.saveQuickLinks(filteredLinks);
      
      console.log('✅ Quick link removed:', linkId);
      return true;
      
    } catch (error) {
      console.error('❌ Error removing quick link:', error);
      return false;
    }
  },

  // Validate URL
  validateUrl: function(url) {
    try {
      const urlObj = new URL(url);
      return urlObj.hostname.match(/^app(-[a-z0-9]+)?\.hubspot\.com$/) && urlObj.protocol === 'https:';
    } catch (error) {
      return false;
    }
  },

  // Generate unique ID
  generateId: function() {
    return 'ql_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9);
  },

  // Format URL for display (remove domain prefix)
  formatUrlForDisplay: function(url) {
    try {
      const urlObj = new URL(url);
      // Remove the domain and protocol, keep only the path
      return urlObj.pathname + urlObj.search + urlObj.hash;
    } catch (error) {
      // Fallback: try to remove common HubSpot prefixes
      return url.replace(/^https?:\/\/(app(-[a-z0-9]+)?\.)?hubspot\.com/, '');
    }
  },

  // Update UI
  updateUI: function() {
    this.renderQuickLinks();
  }
};

// Initialize Quick Links functionality
function initializeQuickLinks() {
  console.log('🔗 Initializing Quick Links functionality...');
  
  // Load and display quick links
  QUICK_LINKS.updateUI();
  

  
  console.log('✅ Quick Links functionality initialized');
}



// Global function to clean up all modals
window.cleanupAllModals = function() {
  console.log('🧹 Cleaning up modals...');
  
  // Remove specific modal IDs only - more targeted cleanup
  const specificModals = document.querySelectorAll('#current-page-dialog, #quicklink-full-dialog, #quicklink-selector-modal, #quicklink-dialog');
  console.log('Found modals to remove:', specificModals.length);
  
  specificModals.forEach(modal => {
    if (modal && document.body.contains(modal)) {
      console.log('Removing modal:', modal.id);
      modal.remove();
    }
  });
  
  // Remove any fixed positioned overlays that are NOT the extension itself
  const overlays = document.querySelectorAll('[style*="position: fixed"][style*="z-index: 100000"]');
  overlays.forEach(overlay => {
    if (overlay && document.body.contains(overlay)) {
      // Don't remove the extension container
      const isExtension = overlay.id === 'hubspot-lens-extension' || 
                         overlay.id === 'hubspot-lens-container' ||
                         overlay.classList.contains('lens-container') ||
                         overlay.getAttribute('data-extension') === 'true';
      if (!isExtension) {
        overlay.remove();
      }
    }
  });
  
  // Remove any backdrop elements that are NOT the extension
  const backdrops = document.querySelectorAll('[style*="backdrop-filter"]');
  backdrops.forEach(backdrop => {
    if (backdrop && document.body.contains(backdrop)) {
      // Don't remove the extension container
      const isExtension = backdrop.id === 'hubspot-lens-extension' || 
                         backdrop.id === 'hubspot-lens-container' ||
                         backdrop.classList.contains('lens-container') ||
                         backdrop.getAttribute('data-extension') === 'true';
      if (!isExtension) {
        backdrop.remove();
      }
    }
  });
  
  // Reset the flag
  isCreatingCurrentPageModal = false;
  
  // Re-attach event listener to the save button if it exists
  if (window.currentSaveButton) {
    console.log('🔗 Re-attaching event listener to save button');
    // Remove any existing listeners by cloning
    const newBtn = window.currentSaveButton.cloneNode(true);
    window.currentSaveButton.parentNode.replaceChild(newBtn, window.currentSaveButton);
    window.currentSaveButton = newBtn;
    
    newBtn.addEventListener('click', function() {
      saveCurrentPageAsQuickLink();
    });
  }
};

// Flag to prevent multiple simultaneous calls
let isCreatingCurrentPageModal = false;

// Save current page as quick link
window.saveCurrentPageAsQuickLink = function() {
  console.log('🔗 saveCurrentPageAsQuickLink called');
  
  // Prevent multiple simultaneous calls
  if (isCreatingCurrentPageModal) {
    console.log('🔗 Already creating modal, ignoring call');
    return;
  }
  
  isCreatingCurrentPageModal = true;
  
  const currentUrl = window.location.href;
  
  // Check if current URL is a valid HubSpot URL
  if (!QUICK_LINKS.validateUrl(currentUrl)) {
    console.log('🔗 Invalid HubSpot URL');
    isCreatingCurrentPageModal = false;
    return;
  }
  
  // Clean up ALL existing modals first
  console.log('🔗 About to cleanup modals');
  window.cleanupAllModals();
  
  // Check if URL is already in quick links
  QUICK_LINKS.getQuickLinks().then(quickLinks => {
    const isAlreadyAdded = quickLinks.some(link => link.url === currentUrl);
    if (isAlreadyAdded) {
      console.log('🔗 URL already in quick links');
      isCreatingCurrentPageModal = false;
      return;
    }
    
    // Check if we have space for more links
    if (quickLinks.length >= 10) {
      console.log('🔗 Maximum quick links reached');
      isCreatingCurrentPageModal = false;
      return;
    }
    
    // Create dialog for naming the current page
    createCurrentPageDialog(currentUrl);
  }).catch(error => {
    console.error('🔗 Error checking quick links:', error);
    isCreatingCurrentPageModal = false;
  });
  
  // Safety timeout to reset flag if something goes wrong
  setTimeout(() => {
    if (isCreatingCurrentPageModal) {
      console.log('🔗 Safety timeout - resetting flag');
      isCreatingCurrentPageModal = false;
    }
  }, 5000);
};

// Create dialog for saving current page
window.createCurrentPageDialog = function(url) {
  console.log('🔗 createCurrentPageDialog called with URL:', url);
  const modal = document.createElement('div');
  modal.id = 'current-page-dialog';
  modal.style.cssText = `
    position: fixed;
    top: 0;
    left: 0;
    width: 100vw;
    height: 100vh;
    background: rgba(0,0,0,0.3);
    backdrop-filter: blur(4px);
    -webkit-backdrop-filter: blur(4px);
    z-index: 100000;
    display: flex;
    align-items: center;
    justify-content: center;
    padding: 20px;
  `;
  
  modal.innerHTML = `
    <div style="
      background: white;
      border-radius: 12px;
      padding: 24px;
      max-width: 500px;
      width: 100%;
      max-height: 80vh;
      overflow-y: auto;
      box-shadow: 0 20px 25px -5px rgba(0,0,0,0.1);
    ">
      <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 20px;">
        <h3 style="margin: 0; font-size: 18px;">💾 Save Current Page</h3>
        <button id="close-current-page-dialog" style="
          background: rgba(255,255,255,0.2);
          border: none;
          color: #6b7280;
          font-size: 20px;
          cursor: pointer;
          padding: 8px;
          width: 36px;
          height: 36px;
          border-radius: 8px;
        ">×</button>
      </div>
      
      <div style="margin-bottom: 16px;">
        <label style="display: block; margin-bottom: 6px; color: #374151; font-size: 14px;">Page Name:</label>
        <input type="text" id="current-page-name" placeholder="Enter a name for this page" style="
          width: 100%;
          padding: 10px 12px;
          border: 1px solid #d1d5db;
          border-radius: 6px;
          font-size: 14px;
          box-sizing: border-box;
        ">
      </div>
      
      <div style="margin-bottom: 16px;">
        <label style="display: block; margin-bottom: 6px; color: #374151; font-size: 14px;">Description (optional):</label>
        <input type="text" id="current-page-description" placeholder="Enter a description" style="
          width: 100%;
          padding: 10px 12px;
          border: 1px solid #d1d5db;
          border-radius: 6px;
          font-size: 14px;
          box-sizing: border-box;
        ">
      </div>
      
      <!-- Symbol Selection -->
      <div style="margin-bottom: 16px;">
        <label style="display: block; margin-bottom: 6px; color: #374151; font-size: 14px;">Choose symbol (optional):</label>
        <div style="display: flex; gap: 8px; flex-wrap: wrap;">
          <button type="button" class="current-page-symbol-option" data-symbol="🔗" style="
            width: 40px; height: 40px; border-radius: 8px; border: 2px solid #e5e7eb; 
            background: #f8fafc; cursor: pointer; transition: all 0.2s ease; font-size: 16px;
          " title="Link">🔗</button>
          <button type="button" class="current-page-symbol-option" data-symbol="📊" style="
            width: 40px; height: 40px; border-radius: 8px; border: 2px solid #e5e7eb; 
            background: #f8fafc; cursor: pointer; transition: all 0.2s ease; font-size: 16px;
          " title="Analytics">📊</button>
          <button type="button" class="current-page-symbol-option" data-symbol="👥" style="
            width: 40px; height: 40px; border-radius: 8px; border: 2px solid #e5e7eb; 
            background: #f8fafc; cursor: pointer; transition: all 0.2s ease; font-size: 16px;
          " title="Contacts">👥</button>
          <button type="button" class="current-page-symbol-option" data-symbol="🏢" style="
            width: 40px; height: 40px; border-radius: 8px; border: 2px solid #e5e7eb; 
            background: #f8fafc; cursor: pointer; transition: all 0.2s ease; font-size: 16px;
          " title="Companies">🏢</button>
          <button type="button" class="current-page-symbol-option" data-symbol="💰" style="
            width: 40px; height: 40px; border-radius: 8px; border: 2px solid #e5e7eb; 
            background: #f8fafc; cursor: pointer; transition: all 0.2s ease; font-size: 16px;
          " title="Deals">💰</button>
          <button type="button" class="current-page-symbol-option" data-symbol="🎫" style="
            width: 40px; height: 40px; border-radius: 8px; border: 2px solid #e5e7eb; 
            background: #f8fafc; cursor: pointer; transition: all 0.2s ease; font-size: 16px;
          " title="Tickets">🎫</button>
          <button type="button" class="current-page-symbol-option" data-symbol="📧" style="
            width: 40px; height: 40px; border-radius: 8px; border: 2px solid #e5e7eb; 
            background: #f8fafc; cursor: pointer; transition: all 0.2s ease; font-size: 16px;
          " title="Email">📧</button>
          <button type="button" class="current-page-symbol-option" data-symbol="📞" style="
            width: 40px; height: 40px; border-radius: 8px; border: 2px solid #e5e7eb; 
            background: #f8fafc; cursor: pointer; transition: all 0.2s ease; font-size: 16px;
          " title="Phone">📞</button>
          <button type="button" class="current-page-symbol-option" data-symbol="📅" style="
            width: 40px; height: 40px; border-radius: 8px; border: 2px solid #e5e7eb; 
            background: #f8fafc; cursor: pointer; transition: all 0.2s ease; font-size: 16px;
          " title="Calendar">📅</button>
          <button type="button" class="current-page-symbol-option" data-symbol="⚙️" style="
            width: 40px; height: 40px; border-radius: 8px; border: 2px solid #e5e7eb; 
            background: #f8fafc; cursor: pointer; transition: all 0.2s ease; font-size: 16px;
          " title="Settings">⚙️</button>
          <button type="button" class="current-page-symbol-option" data-symbol="⭐" style="
            width: 40px; height: 40px; border-radius: 8px; border: 2px solid #e5e7eb; 
            background: #f8fafc; cursor: pointer; transition: all 0.2s ease; font-size: 16px;
          " title="Star">⭐</button>
        </div>
      </div>
      
      <!-- Color Selection -->
      <div style="margin-bottom: 20px;">
        <label style="display: block; margin-bottom: 6px; color: #374151; font-size: 14px;">Choose color (optional):</label>
        <div style="display: flex; gap: 8px; flex-wrap: wrap;">
          <button type="button" class="current-page-color-option" data-color="" style="
            width: 30px; height: 30px; border-radius: 50%; border: 2px solid #e5e7eb; 
            background: #f8fafc; cursor: pointer; transition: all 0.2s ease;
          " title="Default"></button>
          <button type="button" class="current-page-color-option" data-color="#fef3c7" style="
            width: 30px; height: 30px; border-radius: 50%; border: 2px solid #e5e7eb; 
            background: #fef3c7; cursor: pointer; transition: all 0.2s ease;
          " title="Yellow"></button>
          <button type="button" class="current-page-color-option" data-color="#dbeafe" style="
            width: 30px; height: 30px; border-radius: 50%; border: 2px solid #e5e7eb; 
            background: #dbeafe; cursor: pointer; transition: all 0.2s ease;
          " title="Blue"></button>
          <button type="button" class="current-page-color-option" data-color="#d1fae5" style="
            width: 30px; height: 30px; border-radius: 50%; border: 2px solid #e5e7eb; 
            background: #d1fae5; cursor: pointer; transition: all 0.2s ease;
          " title="Green"></button>
          <button type="button" class="current-page-color-option" data-color="#fce7f3" style="
            width: 30px; height: 30px; border-radius: 50%; border: 2px solid #e5e7eb; 
            background: #fce7f3; cursor: pointer; transition: all 0.2s ease;
          " title="Pink"></button>
          <button type="button" class="current-page-color-option" data-color="#f3e8ff" style="
            width: 30px; height: 30px; border-radius: 50%; border: 2px solid #e5e7eb; 
            background: #f3e8ff; cursor: pointer; transition: all 0.2s ease;
          " title="Purple"></button>
          <button type="button" class="current-page-color-option" data-color="#fed7d7" style="
            width: 30px; height: 30px; border-radius: 50%; border: 2px solid #e5e7eb; 
            background: #fed7d7; cursor: pointer; transition: all 0.2s ease;
          " title="Red"></button>
          <button type="button" class="current-page-color-option" data-color="#e0e7ff" style="
            width: 30px; height: 30px; border-radius: 50%; border: 2px solid #e5e7eb; 
            background: #e0e7ff; cursor: pointer; transition: all 0.2s ease;
          " title="Indigo"></button>
        </div>
      </div>
      
      <div style="display: flex; gap: 12px; justify-content: flex-end;">
        <button id="cancel-current-page" style="
          background: #f3f4f6;
          color: #374151;
          border: none;
          padding: 10px 20px;
          border-radius: 6px;
          cursor: pointer;
          font-size: 14px;
        ">Cancel</button>
        <button id="save-current-page" style="
          background: #8b5cf6;
          color: white;
          border: none;
          padding: 10px 20px;
          border-radius: 6px;
          cursor: pointer;
          font-size: 14px;
        ">Save Page</button>
      </div>
    </div>
  `;
  
  document.body.appendChild(modal);
  
  // Add event listeners with proper error handling
  let selectedSymbol = '🔗';
  let selectedColor = '';
  
  // Symbol selection
  const symbolButtons = modal.querySelectorAll('.current-page-symbol-option');
  symbolButtons.forEach(btn => {
    btn.addEventListener('click', function() {
      symbolButtons.forEach(b => b.style.borderColor = '#e5e7eb');
      this.style.borderColor = '#8b5cf6';
      selectedSymbol = this.getAttribute('data-symbol');
    });
  });
  
  // Color selection
  const colorButtons = modal.querySelectorAll('.current-page-color-option');
  colorButtons.forEach(btn => {
    btn.addEventListener('click', function() {
      colorButtons.forEach(b => b.style.borderColor = '#e5e7eb');
      this.style.borderColor = '#8b5cf6';
      selectedColor = this.getAttribute('data-color');
    });
  });
  
  // Close button
  const closeBtn = modal.querySelector('#close-current-page-dialog');
  if (closeBtn) {
    closeBtn.addEventListener('click', () => {
      if (document.body.contains(modal)) {
        document.body.removeChild(modal);
      }
    });
  }
  
  // Cancel button
  const cancelBtn = modal.querySelector('#cancel-current-page');
  if (cancelBtn) {
    cancelBtn.addEventListener('click', () => {
      if (document.body.contains(modal)) {
        document.body.removeChild(modal);
      }
    });
  }
  
  // Save button
  const saveBtn = modal.querySelector('#save-current-page');
  if (saveBtn) {
    saveBtn.addEventListener('click', async () => {
      const nameInput = modal.querySelector('#current-page-name');
      const descriptionInput = modal.querySelector('#current-page-description');
      
      if (!nameInput) return;
      
      const name = nameInput.value.trim();
      const description = descriptionInput ? descriptionInput.value.trim() : '';
      
      if (!name) {
        return;
      }
      
      try {
        await QUICK_LINKS.addQuickLink(name, url, selectedSymbol, description, selectedColor);
        
        QUICK_LINKS.updateUI();
        if (document.body.contains(modal)) {
          document.body.removeChild(modal);
        }
      } catch (error) {
        console.error('Error saving current page:', error);
      }
    });
  }
};

// Remove quick link function
window.removeQuickLink = async function(linkId) {
  if (confirm('Are you sure you want to remove this quick link?')) {
    try {
      await QUICK_LINKS.removeQuickLink(linkId);
      QUICK_LINKS.updateUI();
      showQuickLinkMessage('Quick link removed successfully!', 'success');
    } catch (error) {
      showQuickLinkMessage('Error removing quick link: ' + error.message, 'error');
    }
  }
}

// Render quick links
QUICK_LINKS.renderQuickLinks = async function() {
  const container = document.getElementById('quicklinks-list');
  
  if (!container) return;
  
  const quickLinks = await this.getQuickLinks();
  
  // Create 10 slots (filled or empty)
  const slots = [];
  for (let i = 0; i < 10; i++) {
    const link = quickLinks[i];
    if (link) {
      // Filled slot
      slots.push(`
                <div class="quicklink-slot" data-slot="${i}" data-link-id="${link.id}" style="
          padding: 16px 20px;
          margin-bottom: 8px;
          background: ${link.color || '#f8fafc'};
          border: 1px solid #e2e8f0;
          border-radius: 10px;
          transition: all 0.3s ease;
          position: relative;
          height: 80px;
          display: flex;
          align-items: center;
          box-shadow: 0 2px 4px rgba(0,0,0,0.05);
          cursor: pointer;
        " onmouseover="this.style.background='${link.color ? link.color + 'dd' : '#f1f5f9'}'; this.style.boxShadow='0 4px 12px rgba(0,0,0,0.1)'; this.style.transform='translateY(-1px)'; this.querySelector('.action-buttons').style.opacity='1'" onmouseout="this.style.background='${link.color || '#f8fafc'}'; this.style.boxShadow='0 2px 4px rgba(0,0,0,0.05)'; this.style.transform='translateY(0)'; this.querySelector('.action-buttons').style.opacity='0'">
          
          <!-- Link Content -->
          <div class="quicklink-content" data-url="${link.url}" style="
            display: flex; 
            align-items: center; 
            gap: 16px; 
            flex: 1;
            cursor: pointer;
            min-height: 48px;
          " title="Click to open link">
            <div style="
              width: 32px;
              height: 32px;
              background: linear-gradient(135deg, #8b5cf6 0%, #7c3aed 100%);
              border-radius: 8px;
              display: flex;
              align-items: center;
              justify-content: center;
              color: white;
              font-size: 14px;
              font-weight: 600;
              flex-shrink: 0;
              box-shadow: 0 2px 8px rgba(139, 92, 246, 0.3);
            ">${link.icon || '🔗'}</div>
            
            <div style="flex: 1; min-width: 0; display: flex; flex-direction: column; justify-content: center; height: 48px;">
              <div style="font-weight: 600; color: #1e293b; font-size: 15px; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; line-height: 1.3; margin-bottom: 2px;">${link.name}</div>
              ${link.description ? `<div style="font-size: 12px; color: #6b7280; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; line-height: 1.2; margin-bottom: 2px;">${link.description}</div>` : ''}
              <div style="font-size: 11px; color: #9ca3af; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; line-height: 1.2; max-width: calc(100% - 80px);" title="${link.url}">${QUICK_LINKS.formatUrlForDisplay(link.url)}</div>
            </div>
          </div>
          
          <!-- Action Buttons Container -->
          <div class="action-buttons" style="
            position: absolute;
            right: 12px;
            top: 50%;
            transform: translateY(-50%);
            display: flex;
            flex-direction: row;
            gap: 4px;
            opacity: 0;
            transition: all 0.3s ease;
            z-index: 10;
          ">
            <!-- Move Up Button -->
            <button class="move-up-btn" data-link-id="${link.id}" data-slot="${i}" style="
              background: #8b5cf6;
              color: white;
              border: none;
              padding: 4px 8px;
              border-radius: 4px;
              cursor: ${i === 0 ? 'not-allowed' : 'pointer'};
              font-size: 11px;
              transition: all 0.15s ease;
              ${i === 0 ? 'opacity: 0.4; background: #9ca3af;' : ''}
            " onmouseover="this.style.background='${i === 0 ? '#9ca3af' : '#7c3aed'}'" onmouseout="this.style.background='${i === 0 ? '#9ca3af' : '#8b5cf6'}'" ${i === 0 ? 'disabled' : ''}>↑</button>
            
            <!-- Move Down Button -->
            <button class="move-down-btn" data-link-id="${link.id}" data-slot="${i}" style="
              background: #8b5cf6;
              color: white;
              border: none;
              padding: 4px 8px;
              border-radius: 4px;
              cursor: ${i === 9 ? 'not-allowed' : 'pointer'};
              font-size: 11px;
              transition: all 0.15s ease;
              ${i === 9 ? 'opacity: 0.4; background: #9ca3af;' : ''}
            " onmouseover="this.style.background='${i === 9 ? '#9ca3af' : '#7c3aed'}'" onmouseout="this.style.background='${i === 9 ? '#9ca3af' : '#8b5cf6'}'" ${i === 9 ? 'disabled' : ''}>↓</button>
            
            <!-- Remove Button -->
            <button class="remove-quicklink-btn" data-link-id="${link.id}" style="
              background: #ef4444;
              color: white;
              border: none;
              padding: 4px 8px;
              border-radius: 4px;
              cursor: pointer;
              font-size: 11px;
              transition: all 0.15s ease;
            " onmouseover="this.style.background='#dc2626'" onmouseout="this.style.background='#ef4444'">×</button>
          </div>
        </div>
      `);
    } else {
      // Empty slot
      slots.push(`
        <div class="quicklink-slot empty" data-slot="${i}" style="
          padding: 16px 20px;
          margin-bottom: 8px;
          background: #f9fafb;
          border: 2px dashed #d1d5db;
          border-radius: 10px;
          transition: all 0.3s ease;
          cursor: pointer;
          text-align: center;
          color: #6b7280;
          height: 80px;
          display: flex;
          align-items: center;
          justify-content: center;
          box-shadow: 0 2px 4px rgba(0,0,0,0.05);
        " data-slot-index="${i}" onmouseover="this.style.background='#f3f4f6'; this.style.borderColor='#9ca3af'; this.style.boxShadow='0 4px 12px rgba(0,0,0,0.1)'; this.style.transform='translateY(-1px)'" onmouseout="this.style.background='#f9fafb'; this.style.borderColor='#d1d5db'; this.style.boxShadow='0 2px 4px rgba(0,0,0,0.05)'; this.style.transform='translateY(0)'">
          <div style="
            display: flex;
            flex-direction: column;
            align-items: center;
            gap: 4px;
          ">
            <div style="
              width: 32px;
              height: 32px;
              background: linear-gradient(135deg, #e5e7eb 0%, #d1d5db 100%);
              border-radius: 8px;
              display: flex;
              align-items: center;
              justify-content: center;
              color: #9ca3af;
              font-size: 16px;
              font-weight: 600;
              box-shadow: 0 2px 8px rgba(0,0,0,0.1);
            ">➕</div>
            <div style="font-size: 14px; font-weight: 600; color: #6b7280;">Add Quick Link</div>
            <div style="font-size: 11px; color: #9ca3af;">Click to add a new link</div>
          </div>
        </div>
      `);
    }
  }
  
  container.innerHTML = slots.join('');
  
  // Add event listeners for the rendered elements
  addQuickLinkEventListeners();
  
  // Add event listeners for move buttons
  addMoveButtonEventListeners();
};



// Show Quick Link Selector Modal
window.showQuickLinkSelector = function(slotIndex = null) {
  const quickLinks = QUICK_LINKS.getQuickLinks();
  const usedUrls = quickLinks.map(link => link.url);
  
  // Filter out already used common pages
  const availableCommonPages = QUICK_LINKS.commonPages.filter(page => !usedUrls.includes(page.url));
  
  // Create modal
  const modal = document.createElement('div');
  modal.id = 'quicklink-selector-modal';
  modal.style.cssText = `
    position: fixed;
    top: 0;
    left: 0;
    width: 100vw;
    height: 100vh;
    background: rgba(0,0,0,0.5);
    z-index: 100000;
    display: flex;
    align-items: center;
    justify-content: center;
    padding: 20px;
  `;
  
  const modalContent = document.createElement('div');
  modalContent.style.cssText = `
    background: white;
    border-radius: 12px;
    max-width: 500px;
    width: 100%;
    max-height: 80vh;
    overflow: hidden;
    box-shadow: 0 20px 40px rgba(0,0,0,0.3);
  `;
  
  modalContent.innerHTML = `
    <div style="
      background: linear-gradient(135deg, #8b5cf6 0%, #7c3aed 100%);
      color: white;
      padding: 20px;
      display: flex;
      justify-content: space-between;
      align-items: center;
    ">
              <h3 style="margin: 0; font-size: 18px;">Quick Link Manager</h3>
      <button id="close-selector-modal" style="
        background: rgba(255,255,255,0.2);
        border: none;
        color: white;
        font-size: 20px;
        cursor: pointer;
        padding: 8px;
        width: 36px;
        height: 36px;
        border-radius: 8px;
      ">×</button>
    </div>
    
    <div style="padding: 20px; display: flex; gap: 24px; max-height: 80vh; overflow-y: auto;">
      <!-- Left Column: Common Pages -->
      <div style="flex: 1; min-width: 0;">
        <h4 style="margin: 0 0 12px 0; color: #1e293b; font-size: 16px;">💡 Please choose an existing link:</h4>
        ${availableCommonPages.length > 0 ? `
          <div style="display: flex; flex-direction: column; gap: 8px; max-height: 400px; overflow-y: auto; padding-right: 8px;">
            ${availableCommonPages.map(page => `
              <button onclick="selectCommonPage('${page.name}', '${page.url}', '${page.icon}', ${slotIndex})" style="
                background: #f8fafc;
                border: 1px solid #e2e8f0;
                padding: 10px 12px;
                border-radius: 6px;
                cursor: pointer;
                text-align: left;
                transition: all 0.2s ease;
                display: flex;
                align-items: center;
                gap: 10px;
                width: 100%;
              " onmouseover="this.style.background='#f1f5f9'" onmouseout="this.style.background='#f8fafc'">
                <span style="font-size: 16px; flex-shrink: 0;">${page.icon}</span>
                <div style="flex: 1; min-width: 0;">
                  <div style="font-weight: 500; color: #1e293b; font-size: 13px; margin-bottom: 2px;">${page.name}</div>
                  <div style="font-size: 11px; color: #6b7280; white-space: nowrap; overflow: hidden; text-overflow: ellipsis;">${page.url}</div>
                </div>
              </button>
            `).join('')}
          </div>
        ` : '<div style="text-align: center; color: #6b7280; padding: 20px;">No common pages available</div>'}
      </div>
      
      <!-- Right Column: Custom Link -->
      <div style="flex: 1; min-width: 0;">
        <h4 style="margin: 0 0 12px 0; color: #1e293b; font-size: 16px;">🔗 Or add your own:</h4>
        <div style="display: flex; flex-direction: column; gap: 12px;">
          <input type="text" id="custom-link-name" placeholder="Link name (e.g., My Custom Page)" style="
            padding: 10px 12px;
            border: 1px solid #d1d5db;
            border-radius: 6px;
            font-size: 14px;
          ">
          <input type="text" id="custom-link-description" placeholder="Description (optional)" style="
            padding: 10px 12px;
            border: 1px solid #d1d5db;
            border-radius: 6px;
            font-size: 14px;
          ">
          <input type="url" id="custom-link-url" placeholder="https://app.hubspot.com/... or https://app-eu1.hubspot.com/..." style="
            padding: 10px 12px;
            border: 1px solid #d1d5db;
            border-radius: 6px;
            font-size: 14px;
          ">
          
          <!-- Symbol Selection -->
          <div>
            <label style="display: block; margin-bottom: 6px; color: #374151; font-size: 14px;">Choose symbol (optional):</label>
            <div style="display: flex; gap: 8px; flex-wrap: wrap;">
              <button type="button" class="symbol-option" data-symbol="🔗" style="
                width: 40px; height: 40px; border-radius: 8px; border: 2px solid #e5e7eb; 
                background: #f8fafc; cursor: pointer; transition: all 0.2s ease; font-size: 16px;
              " title="Link">🔗</button>
              <button type="button" class="symbol-option" data-symbol="📊" style="
                width: 40px; height: 40px; border-radius: 8px; border: 2px solid #e5e7eb; 
                background: #f8fafc; cursor: pointer; transition: all 0.2s ease; font-size: 16px;
              " title="Analytics">📊</button>
              <button type="button" class="symbol-option" data-symbol="👥" style="
                width: 40px; height: 40px; border-radius: 8px; border: 2px solid #e5e7eb; 
                background: #f8fafc; cursor: pointer; transition: all 0.2s ease; font-size: 16px;
              " title="Contacts">👥</button>
              <button type="button" class="symbol-option" data-symbol="🏢" style="
                width: 40px; height: 40px; border-radius: 8px; border: 2px solid #e5e7eb; 
                background: #f8fafc; cursor: pointer; transition: all 0.2s ease; font-size: 16px;
              " title="Companies">🏢</button>
              <button type="button" class="symbol-option" data-symbol="💰" style="
                width: 40px; height: 40px; border-radius: 8px; border: 2px solid #e5e7eb; 
                background: #f8fafc; cursor: pointer; transition: all 0.2s ease; font-size: 16px;
              " title="Deals">💰</button>
              <button type="button" class="symbol-option" data-symbol="🎫" style="
                width: 40px; height: 40px; border-radius: 8px; border: 2px solid #e5e7eb; 
                background: #f8fafc; cursor: pointer; transition: all 0.2s ease; font-size: 16px;
              " title="Tickets">🎫</button>
              <button type="button" class="symbol-option" data-symbol="📧" style="
                width: 40px; height: 40px; border-radius: 8px; border: 2px solid #e5e7eb; 
                background: #f8fafc; cursor: pointer; transition: all 0.2s ease; font-size: 16px;
              " title="Email">📧</button>
              <button type="button" class="symbol-option" data-symbol="📞" style="
                width: 40px; height: 40px; border-radius: 8px; border: 2px solid #e5e7eb; 
                background: #f8fafc; cursor: pointer; transition: all 0.2s ease; font-size: 16px;
              " title="Phone">📞</button>
              <button type="button" class="symbol-option" data-symbol="📅" style="
                width: 40px; height: 40px; border-radius: 8px; border: 2px solid #e5e7eb; 
                background: #f8fafc; cursor: pointer; transition: all 0.2s ease; font-size: 16px;
              " title="Calendar">📅</button>
              <button type="button" class="symbol-option" data-symbol="⚙️" style="
                width: 40px; height: 40px; border-radius: 8px; border: 2px solid #e5e7eb; 
                background: #f8fafc; cursor: pointer; transition: all 0.2s ease; font-size: 16px;
              " title="Settings">⚙️</button>
              <button type="button" class="symbol-option" data-symbol="⭐" style="
                width: 40px; height: 40px; border-radius: 8px; border: 2px solid #e5e7eb; 
                background: #f8fafc; cursor: pointer; transition: all 0.2s ease; font-size: 16px;
              " title="Star">⭐</button>
            </div>
          </div>
          
          <!-- Color Selection -->
          <div>
            <label style="display: block; margin-bottom: 6px; color: #374151; font-size: 14px;">Choose color (optional):</label>
            <div style="display: flex; gap: 8px; flex-wrap: wrap;">
              <button type="button" class="color-option" data-color="" style="
                width: 30px; height: 30px; border-radius: 50%; border: 2px solid #e5e7eb; 
                background: #f8fafc; cursor: pointer; transition: all 0.2s ease;
              " title="Default"></button>
              <button type="button" class="color-option" data-color="#fef3c7" style="
                width: 30px; height: 30px; border-radius: 50%; border: 2px solid #e5e7eb; 
                background: #fef3c7; cursor: pointer; transition: all 0.2s ease;
              " title="Yellow"></button>
              <button type="button" class="color-option" data-color="#dbeafe" style="
                width: 30px; height: 30px; border-radius: 50%; border: 2px solid #e5e7eb; 
                background: #dbeafe; cursor: pointer; transition: all 0.2s ease;
              " title="Blue"></button>
              <button type="button" class="color-option" data-color="#d1fae5" style="
                width: 30px; height: 30px; border-radius: 50%; border: 2px solid #e5e7eb; 
                background: #d1fae5; cursor: pointer; transition: all 0.2s ease;
              " title="Green"></button>
              <button type="button" class="color-option" data-color="#fce7f3" style="
                width: 30px; height: 30px; border-radius: 50%; border: 2px solid #e5e7eb; 
                background: #fce7f3; cursor: pointer; transition: all 0.2s ease;
              " title="Pink"></button>
              <button type="button" class="color-option" data-color="#f3e8ff" style="
                width: 30px; height: 30px; border-radius: 50%; border: 2px solid #e5e7eb; 
                background: #f3e8ff; cursor: pointer; transition: all 0.2s ease;
              " title="Purple"></button>
              <button type="button" class="color-option" data-color="#fed7d7" style="
                width: 30px; height: 30px; border-radius: 50%; border: 2px solid #e5e7eb; 
                background: #fed7d7; cursor: pointer; transition: all 0.2s ease;
              " title="Red"></button>
              <button type="button" class="color-option" data-color="#e0e7ff" style="
                width: 30px; height: 30px; border-radius: 50%; border: 2px solid #e5e7eb; 
                background: #e0e7ff; cursor: pointer; transition: all 0.2s ease;
              " title="Indigo"></button>
            </div>
          </div>
          
          <button id="add-custom-link-btn" style="
            background: linear-gradient(135deg, #10b981 0%, #059669 100%);
            color: white;
            border: none;
            padding: 12px;
            border-radius: 6px;
            cursor: pointer;
            font-size: 14px;
            font-weight: 500;
          ">Add Custom Link</button>
        </div>
      </div>
    </div>
  `;
  
  modal.appendChild(modalContent);
  document.body.appendChild(modal);
  

  
  // Add event listeners
  const closeBtn = document.getElementById('close-selector-modal');
  const addCustomBtn = document.getElementById('add-custom-link-btn');
  
  if (closeBtn) {
    closeBtn.addEventListener('click', () => {
      if (document.body.contains(modal)) {
        modal.remove();
      }
    });
  }
  
  if (addCustomBtn) {
    addCustomBtn.addEventListener('click', () => {
      addCustomQuickLink(slotIndex, selectedSymbol, selectedColor);
    });
  }
  
  // Close on outside click
  modal.addEventListener('click', (e) => {
    if (e.target === modal) {
      modal.remove();
    }
  });
  
  // Add symbol selection event listeners
  let selectedSymbol = '🔗';
  let selectedColor = '';
  
  document.querySelectorAll('.symbol-option').forEach(btn => {
    btn.addEventListener('click', function() {
      document.querySelectorAll('.symbol-option').forEach(b => b.style.borderColor = '#e5e7eb');
      this.style.borderColor = '#8b5cf6';
      selectedSymbol = this.getAttribute('data-symbol');
    });
  });
  
  // Add color selection event listeners
  document.querySelectorAll('.color-option').forEach(btn => {
    btn.addEventListener('click', function() {
      document.querySelectorAll('.color-option').forEach(b => b.style.borderColor = '#e5e7eb');
      this.style.borderColor = '#8b5cf6';
      selectedColor = this.getAttribute('data-color');
    });
  });
  
  // Allow Enter key for custom link
  const customInputs = ['custom-link-name', 'custom-link-url'];
  customInputs.forEach(id => {
    const input = document.getElementById(id);
    if (input) {
      input.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') {
          addCustomQuickLink(slotIndex, selectedSymbol, selectedColor);
        }
      });
    }
  });
}

// Select common page
window.selectCommonPage = async function(name, url, icon, slotIndex) {
  try {
    const newLink = await QUICK_LINKS.addQuickLink(name, url, icon);
    QUICK_LINKS.updateUI();
    showQuickLinkMessage('Quick link added successfully!', 'success');
    
    // Close modal
    const modal = document.getElementById('quicklink-selector-modal');
    if (modal) modal.remove();
    
  } catch (error) {
    showQuickLinkMessage(error.message, 'error');
  }
}

// Add custom quick link
window.addCustomQuickLink = async function(slotIndex, selectedSymbol = '🔗', selectedColor = '') {
  const nameInput = document.getElementById('custom-link-name');
  const descriptionInput = document.getElementById('custom-link-description');
  const urlInput = document.getElementById('custom-link-url');
  const addBtn = document.getElementById('add-custom-link-btn');
  
  if (!nameInput || !urlInput || !addBtn) return;
  
  const name = nameInput.value.trim();
  const description = descriptionInput.value.trim();
  const url = urlInput.value.trim();
  
  if (!name || !url) {
    return;
  }
  
  try {
    addBtn.textContent = 'Adding...';
    addBtn.disabled = true;
    
    const newLink = await QUICK_LINKS.addQuickLink(name, url, selectedSymbol, description, selectedColor);
    QUICK_LINKS.updateUI();
    
    // Close modal
    const modal = document.getElementById('quicklink-selector-modal');
    if (modal) modal.remove();
    
  } catch (error) {
    // Silent error handling
  } finally {
    addBtn.textContent = 'Add Custom Link';
    addBtn.disabled = false;
  }
}





// Move quick link to a new position
async function moveQuickLink(fromSlot, toSlot) {
  try {
    console.log('🔄 Moving quick link from slot', fromSlot, 'to slot', toSlot);
    
    const quickLinks = await QUICK_LINKS.getQuickLinks();
    console.log('🔗 Current quick links:', quickLinks.length);
    
    // Get the link at the fromSlot
    const linkToMove = quickLinks[fromSlot];
    if (!linkToMove) {
      console.log('🔗 No link found at slot', fromSlot);
      return;
    }
    
    console.log('🔗 Moving link:', linkToMove.name);
    
    // Create new array with the moved link
    const newQuickLinks = [...quickLinks];
    
    // Remove from current position
    newQuickLinks.splice(fromSlot, 1);
    
    // Insert at new position
    newQuickLinks.splice(toSlot, 0, linkToMove);
    
    console.log('🔗 New order:', newQuickLinks.map((link, index) => `${index}: ${link.name}`));
    
    // Save the new order
    await QUICK_LINKS.saveQuickLinks(newQuickLinks);
    console.log('🔗 Saved new order');
    
    // Update UI
    QUICK_LINKS.updateUI();
    console.log('🔗 Updated UI');
    
    // Visual feedback: briefly highlight the moved item
    setTimeout(() => {
      const movedSlot = document.querySelector(`[data-slot="${toSlot}"]`);
      if (movedSlot) {
        movedSlot.style.background = '#f0f9ff';
        movedSlot.style.borderColor = '#7dd3fc';
        setTimeout(() => {
          movedSlot.style.transition = 'all 0.3s ease';
          movedSlot.style.background = '';
          movedSlot.style.borderColor = '';
        }, 300);
      }
    }, 100);
    
  } catch (error) {
    console.error('❌ Error moving quick link:', error);
    showQuickLinkMessage('Error moving quick link', 'error');
  }
}

// Reorder quick links




// Show quick link message
function showQuickLinkMessage(message, type = 'info') {
  // Create temporary message element
  const messageEl = document.createElement('div');
  messageEl.style.cssText = `
    position: fixed;
    top: 20px;
    right: 20px;
    padding: 12px 16px;
    border-radius: 6px;
    color: white;
    font-weight: 500;
    z-index: 100001;
    max-width: 300px;
    word-wrap: break-word;
    box-shadow: 0 4px 12px rgba(0,0,0,0.15);
    transition: all 0.3s ease;
  `;
  
  if (type === 'success') {
    messageEl.style.background = '#10b981';
  } else if (type === 'error') {
    messageEl.style.background = '#ef4444';
  } else {
    messageEl.style.background = '#3b82f6';
  }
  
  messageEl.textContent = message;
  document.body.appendChild(messageEl);
  
  // Remove after 3 seconds
  setTimeout(() => {
    if (messageEl.parentNode) {
      messageEl.parentNode.removeChild(messageEl);
    }
  }, 3000);
}

