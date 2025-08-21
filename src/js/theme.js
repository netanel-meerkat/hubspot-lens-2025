/**
 * HubSpot Lens Theme Controller
 * Manages light/dark/system themes with chrome.storage.sync persistence
 */

class ThemeController {
  constructor() {
    this.themes = ['light', 'dark', 'system'];
    this.currentTheme = 'system';
    this.init();
  }

  async init() {
    // Load saved theme preference
    await this.loadTheme();
    
    // Apply theme
    this.applyTheme();
    
    // Listen for system theme changes
    this.setupSystemThemeListener();
    
    // Setup theme toggle if it exists
    this.setupThemeToggle();
  }

  async loadTheme() {
    try {
      const result = await chrome.storage.sync.get(['theme']);
      this.currentTheme = result.theme || 'system';
      console.log('🎨 Loaded theme preference:', this.currentTheme);
    } catch (error) {
      console.error('❌ Failed to load theme preference:', error);
      this.currentTheme = 'system';
    }
  }

  async saveTheme(theme) {
    try {
      await chrome.storage.sync.set({ theme });
      console.log('💾 Saved theme preference:', theme);
    } catch (error) {
      console.error('❌ Failed to save theme preference:', error);
    }
  }

  async setTheme(theme) {
    if (!this.themes.includes(theme)) {
      console.error('❌ Invalid theme:', theme);
      return;
    }

    this.currentTheme = theme;
    await this.saveTheme(theme);
    this.applyTheme();
    
    // Dispatch theme change event
    window.dispatchEvent(new CustomEvent('themechange', { detail: { theme } }));
    
    console.log('🎨 Theme changed to:', theme);
  }

  applyTheme() {
    const root = document.documentElement;
    
    // Remove all theme attributes
    root.removeAttribute('data-theme');
    
    // Apply current theme
    if (this.currentTheme === 'system') {
      // Let CSS media query handle it
      console.log('🎨 Using system theme preference');
    } else {
      root.setAttribute('data-theme', this.currentTheme);
      console.log('🎨 Applied theme:', this.currentTheme);
    }
    
    // Update theme toggle if it exists
    this.updateThemeToggle();
  }

  setupSystemThemeListener() {
    // Listen for system theme changes
    const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
    
    const handleChange = (e) => {
      if (this.currentTheme === 'system') {
        console.log('🎨 System theme changed to:', e.matches ? 'dark' : 'light');
        this.applyTheme();
      }
    };
    
    mediaQuery.addEventListener('change', handleChange);
    
    // Store reference for cleanup
    this.mediaQuery = mediaQuery;
    this.handleChange = handleChange;
  }

  setupThemeToggle() {
    const toggle = document.getElementById('theme-toggle');
    if (toggle) {
      toggle.addEventListener('click', () => {
        this.cycleTheme();
      });
      console.log('✅ Theme toggle setup complete');
    }
  }

  updateThemeToggle() {
    const toggle = document.getElementById('theme-toggle');
    if (toggle) {
      const icon = toggle.querySelector('.theme-icon');
      const text = toggle.querySelector('.theme-text');
      
      if (icon) {
        icon.innerHTML = this.getThemeIcon();
      }
      
      if (text) {
        text.textContent = this.getThemeText();
      }
      
      toggle.title = `Current theme: ${this.getThemeText()}. Click to cycle.`;
    }
  }

  cycleTheme() {
    const currentIndex = this.themes.indexOf(this.currentTheme);
    const nextIndex = (currentIndex + 1) % this.themes.length;
    const nextTheme = this.themes[nextIndex];
    
    this.setTheme(nextTheme);
  }

  getThemeIcon() {
    switch (this.currentTheme) {
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

  getThemeText() {
    switch (this.currentTheme) {
      case 'light':
        return 'Light';
      case 'dark':
        return 'Dark';
      case 'system':
      default:
        return 'System';
    }
  }

  getCurrentTheme() {
    return this.currentTheme;
  }

  isDark() {
    if (this.currentTheme === 'system') {
      return window.matchMedia('(prefers-color-scheme: dark)').matches;
    }
    return this.currentTheme === 'dark';
  }

  isLight() {
    if (this.currentTheme === 'system') {
      return window.matchMedia('(prefers-color-scheme: light)').matches;
    }
    return this.currentTheme === 'light';
  }

  destroy() {
    if (this.mediaQuery && this.handleChange) {
      this.mediaQuery.removeEventListener('change', this.handleChange);
    }
  }
}

// Export for use in other modules
if (typeof module !== 'undefined' && module.exports) {
  module.exports = ThemeController;
} else {
  window.ThemeController = ThemeController;
}
