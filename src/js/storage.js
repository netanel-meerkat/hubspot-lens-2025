/**
 * HubSpot Lens Storage Utilities
 * Provides convenient methods for chrome.storage.sync operations
 */

class StorageManager {
  constructor() {
    this.defaults = {
      theme: 'system',
      uiSettings: {
        sidebarCollapsed: false,
        compactMode: false,
        showTooltips: true
      },
      userPreferences: {
        defaultObjectType: 'contacts',
        defaultLimit: 100,
        autoRefresh: false
      }
    };
  }

  /**
   * Get a value from storage with fallback to default
   */
  async get(key, defaultValue = null) {
    try {
      const result = await chrome.storage.sync.get([key]);
      return result[key] !== undefined ? result[key] : defaultValue;
    } catch (error) {
      console.error('❌ Storage get error:', error);
      return defaultValue;
    }
  }

  /**
   * Set a value in storage
   */
  async set(key, value) {
    try {
      await chrome.storage.sync.set({ [key]: value });
      console.log('💾 Storage set:', key, value);
      return true;
    } catch (error) {
      console.error('❌ Storage set error:', error);
      return false;
    }
  }

  /**
   * Remove a key from storage
   */
  async remove(key) {
    try {
      await chrome.storage.sync.remove([key]);
      console.log('🗑️ Storage removed:', key);
      return true;
    } catch (error) {
      console.error('❌ Storage remove error:', error);
      return false;
    }
  }

  /**
   * Clear all storage
   */
  async clear() {
    try {
      await chrome.storage.sync.clear();
      console.log('🗑️ Storage cleared');
      return true;
    } catch (error) {
      console.error('❌ Storage clear error:', error);
      return false;
    }
  }

  /**
   * Get multiple values at once
   */
  async getMultiple(keys) {
    try {
      const result = await chrome.storage.sync.get(keys);
      return result;
    } catch (error) {
      console.error('❌ Storage getMultiple error:', error);
      return {};
    }
  }

  /**
   * Set multiple values at once
   */
  async setMultiple(values) {
    try {
      await chrome.storage.sync.set(values);
      console.log('💾 Storage setMultiple:', Object.keys(values));
      return true;
    } catch (error) {
      console.error('❌ Storage setMultiple error:', error);
      return false;
    }
  }

  /**
   * Get all storage data
   */
  async getAll() {
    try {
      const result = await chrome.storage.sync.get(null);
      return result;
    } catch (error) {
      console.error('❌ Storage getAll error:', error);
      return {};
    }
  }

  /**
   * Initialize storage with defaults
   */
  async initialize() {
    try {
      const current = await this.getAll();
      const toSet = {};
      
      // Set defaults for missing keys
      Object.entries(this.defaults).forEach(([key, defaultValue]) => {
        if (current[key] === undefined) {
          toSet[key] = defaultValue;
        }
      });
      
      if (Object.keys(toSet).length > 0) {
        await this.setMultiple(toSet);
        console.log('🚀 Storage initialized with defaults:', Object.keys(toSet));
      }
      
      return true;
    } catch (error) {
      console.error('❌ Storage initialization error:', error);
      return false;
    }
  }

  /**
   * Reset storage to defaults
   */
  async reset() {
    try {
      await this.clear();
      await this.initialize();
      console.log('🔄 Storage reset to defaults');
      return true;
    } catch (error) {
      console.error('❌ Storage reset error:', error);
      return false;
    }
  }

  /**
   * Get storage usage information
   */
  async getUsage() {
    try {
      const data = await this.getAll();
      const totalBytes = new Blob([JSON.stringify(data)]).size;
      const maxBytes = 102400; // 100KB limit for sync storage
      const usagePercent = (totalBytes / maxBytes) * 100;
      
      return {
        used: totalBytes,
        max: maxBytes,
        percent: Math.round(usagePercent),
        items: Object.keys(data).length
      };
    } catch (error) {
      console.error('❌ Storage usage error:', error);
      return null;
    }
  }

  /**
   * Listen for storage changes
   */
  onChanged(callback) {
    chrome.storage.onChanged.addListener((changes, namespace) => {
      if (namespace === 'sync') {
        callback(changes);
      }
    });
  }

  /**
   * Export storage data
   */
  async export() {
    try {
      const data = await this.getAll();
      const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
      const url = URL.createObjectURL(blob);
      
      const a = document.createElement('a');
      a.href = url;
      a.download = `hubspot-lens-settings-${new Date().toISOString().split('T')[0]}.json`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
      
      console.log('📤 Storage exported');
      return true;
    } catch (error) {
      console.error('❌ Storage export error:', error);
      return false;
    }
  }

  /**
   * Import storage data
   */
  async import(file) {
    try {
      const text = await file.text();
      const data = JSON.parse(text);
      
      // Validate data structure
      if (typeof data !== 'object' || data === null) {
        throw new Error('Invalid data format');
      }
      
      await this.setMultiple(data);
      console.log('📥 Storage imported:', Object.keys(data));
      return true;
    } catch (error) {
      console.error('❌ Storage import error:', error);
      return false;
    }
  }
}

// Export for use in other modules
if (typeof module !== 'undefined' && module.exports) {
  module.exports = StorageManager;
} else {
  window.StorageManager = StorageManager;
}
