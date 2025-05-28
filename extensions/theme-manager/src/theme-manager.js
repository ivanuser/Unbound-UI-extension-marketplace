/**
 * Theme Manager Extension for UnboundUI
 * Advanced theme management system with real-time preview
 */

class ThemeManager {
  constructor() {
    this.themes = new Map();
    this.currentTheme = null;
    this.isInitialized = false;
    this.colorPicker = null;
    this.styleEditor = null;
    this.loadDefaultThemes();
  }

  /**
   * Initialize the theme manager
   */
  async initialize() {
    try {
      if (typeof unboundUI !== 'undefined') {
        unboundUI.registerExtension(this);
        this.setupUI();
        this.isInitialized = true;
        unboundUI.logger.info('Theme Manager extension initialized');
      }
    } catch (error) {
      console.error('Failed to initialize Theme Manager:', error);
    }
  }

  /**
   * Load default themes
   */
  loadDefaultThemes() {
    this.themes.set('light', {
      name: 'Light Theme',
      colors: {
        primary: '#3b82f6',
        secondary: '#64748b',
        background: '#ffffff',
        surface: '#f8fafc',
        text: '#1e293b'
      }
    });

    this.themes.set('dark', {
      name: 'Dark Theme', 
      colors: {
        primary: '#60a5fa',
        secondary: '#94a3b8',
        background: '#0f172a',
        surface: '#1e293b',
        text: '#f1f5f9'
      }
    });

    this.themes.set('auto', {
      name: 'Auto (System)',
      colors: null // Uses system preference
    });
  }

  /**
   * Apply theme
   */
  applyTheme(themeId) {
    const theme = this.themes.get(themeId);
    if (!theme) {
      throw new Error(`Theme not found: ${themeId}`);
    }

    this.currentTheme = themeId;
    
    if (theme.colors) {
      this.applyColors(theme.colors);
    } else if (themeId === 'auto') {
      this.applySystemTheme();
    }

    // Notify UnboundUI of theme change
    if (typeof unboundUI !== 'undefined') {
      unboundUI.events.emit('theme-changed', { themeId, theme });
    }
  }

  /**
   * Apply color scheme
   */
  applyColors(colors) {
    const root = document.documentElement;
    
    for (const [property, value] of Object.entries(colors)) {
      root.style.setProperty(`--color-${property}`, value);
    }
  }

  /**
   * Create custom theme
   */
  createCustomTheme(name, colors) {
    const themeId = name.toLowerCase().replace(/\s+/g, '-');
    
    this.themes.set(themeId, {
      name,
      colors,
      custom: true
    });

    return themeId;
  }

  /**
   * Setup theme manager UI
   */
  setupUI() {
    // Color picker setup
    this.colorPicker = {
      show: (callback) => {
        // Placeholder for color picker implementation
        console.log('Color picker opened');
      }
    };

    // Style editor setup
    this.styleEditor = {
      open: (theme) => {
        // Placeholder for style editor implementation
        console.log('Style editor opened for theme:', theme);
      }
    };
  }

  /**
   * Apply system theme preference
   */
  applySystemTheme() {
    const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
    this.applyTheme(prefersDark ? 'dark' : 'light');
  }

  /**
   * Get all themes
   */
  getAllThemes() {
    return Array.from(this.themes.entries());
  }

  /**
   * Extension lifecycle methods
   */
  activate() {
    unboundUI.logger.info('Theme Manager extension activated');
  }

  deactivate() {
    unboundUI.logger.info('Theme Manager extension deactivated');
  }
}

// Initialize extension
const themeManager = new ThemeManager();
themeManager.initialize();

// Export for UnboundUI
if (typeof module !== 'undefined' && module.exports) {
  module.exports = ThemeManager;
}
