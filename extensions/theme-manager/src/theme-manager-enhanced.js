/**
 * Enhanced Theme Manager Extension for UnboundUI
 * Advanced theme management system with real-time preview and proper save functionality
 */
class EnhancedThemeManager {
  constructor() {
    this.themes = new Map();
    this.currentTheme = null;
    this.isInitialized = false;
    this.colorPicker = null;
    this.styleEditor = null;
    this.id = 'theme-manager';
    this.unsavedChanges = new Map(); // Track unsaved changes
    this.loadDefaultThemes();
    console.log('[EnhancedThemeManager] Constructor called');
    this.waitForUnboundUI();
  }

  /**
   * Wait for unboundUI global object to be available
   */
  async waitForUnboundUI() {
    console.log('[EnhancedThemeManager] Waiting for unboundUI...');
    const checkForUnboundUI = () => {
      if (typeof unboundUI !== 'undefined') {
        console.log('[EnhancedThemeManager] unboundUI found, initializing...');
        this.initialize();
      } else {
        console.log('[EnhancedThemeManager] unboundUI not yet available, retrying...');
        setTimeout(checkForUnboundUI, 100);
      }
    };
    checkForUnboundUI();
  }

  /**
   * Initialize the theme manager
   */
  async initialize() {
    try {
      console.log('[EnhancedThemeManager] Initialize called');
      if (typeof unboundUI !== 'undefined') {
        console.log('[EnhancedThemeManager] Registering extension...');
        unboundUI.registerExtension(this);
        this.isInitialized = true;
        unboundUI.logger.info('Enhanced Theme Manager extension initialized');
        console.log('[EnhancedThemeManager] Extension registered successfully');
      } else {
        console.error('[EnhancedThemeManager] unboundUI is not available');
      }
    } catch (error) {
      console.error('[EnhancedThemeManager] Failed to initialize:', error);
    }
  }

  /**
   * Called when the extension is activated
   */
  async activate(context) {
    console.log('[EnhancedThemeManager] Activate called with context:', context);
    this.context = context;
    this.setupUI();
    this.registerCommands();
    console.log('[EnhancedThemeManager] Extension activated successfully');
  }

  /**
   * Called when the extension is deactivated
   */
  async deactivate() {
    console.log('[EnhancedThemeManager] Deactivate called');
    if (this.context) {
      this.context.removeToolbarButton('theme-manager');
      this.context.removeSidebarPanel('theme-manager-panel');
    }
    console.log('[EnhancedThemeManager] Extension deactivated');
  }

  /**
   * Load default themes
   */
  loadDefaultThemes() {
    console.log('[EnhancedThemeManager] Loading default themes...');
    this.themes.set('light', {
      name: 'Light Theme',
      colors: {
        primary: '#3b82f6',
        secondary: '#64748b',
        background: '#ffffff',
        surface: '#f8fafc',
        text: '#1e293b',
        accent: '#f1f5f9',
        border: '#e2e8f0'
      }
    });
    this.themes.set('dark', {
      name: 'Dark Theme',
      colors: {
        primary: '#60a5fa',
        secondary: '#94a3b8',
        background: '#0f172a',
        surface: '#1e293b',
        text: '#f1f5f9',
        accent: '#334155',
        border: '#475569'
      }
    });
    this.themes.set('auto', {
      name: 'Auto (System)',
      colors: null
    });
    console.log('[EnhancedThemeManager] Default themes loaded:', this.themes.size);
  }

  /**
   * Apply theme with persistence
   */
  applyTheme(themeId, save = true) {
    console.log('[EnhancedThemeManager] Applying theme:', themeId);
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

    if (save) {
      this.saveCurrentThemeToStorage(themeId);
    }

    // Clear any unsaved changes
    this.unsavedChanges.clear();

    // Notify UnboundUI of theme change
    if (typeof unboundUI !== 'undefined') {
      unboundUI.events.emit('theme-changed', { themeId, theme });
    }

    this.updateUI();
    console.log('[EnhancedThemeManager] Theme applied successfully:', themeId);
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
   * Save current theme to localStorage
   */
  saveCurrentThemeToStorage(themeId) {
    try {
      localStorage.setItem('unboundui-current-theme', themeId);
      localStorage.setItem('unboundui-theme-last-updated', new Date().toISOString());
    } catch (error) {
      console.error('[EnhancedThemeManager] Failed to save theme to storage:', error);
    }
  }

  /**
   * Load theme from localStorage
   */
  loadThemeFromStorage() {
    try {
      const savedTheme = localStorage.getItem('unboundui-current-theme');
      if (savedTheme && this.themes.has(savedTheme)) {
        this.applyTheme(savedTheme, false); // Don't save again
        return savedTheme;
      }
    } catch (error) {
      console.error('[EnhancedThemeManager] Failed to load theme from storage:', error);
    }
    return null;
  }

  /**
   * Register theme management commands
   */
  registerCommands() {
    console.log('[EnhancedThemeManager] Registering commands...');
    const commands = {
      'theme.manager.open': this.openThemeManager.bind(this),
      'theme.apply': this.applyTheme.bind(this),
      'theme.create': this.showCreateThemeDialog.bind(this),
      'theme.edit': this.editCurrentTheme.bind(this),
      'theme.save': this.saveUnsavedChanges.bind(this),
      'theme.revert': this.revertUnsavedChanges.bind(this),
      'theme.export': this.exportTheme.bind(this),
      'theme.import': this.importTheme.bind(this),
      'theme.reset': this.resetToDefault.bind(this)
    };
    Object.entries(commands).forEach(([id, handler]) => {
      this.context.registerCommand(id, handler);
    });
    console.log('[EnhancedThemeManager] Commands registered:', Object.keys(commands).length);
  }

  /**
   * Setup enhanced theme manager UI
   */
  setupUI() {
    console.log('[EnhancedThemeManager] Setting up enhanced UI...');
    try {
      // Add toolbar button for quick access
      this.context.addToolbarButton({
        id: 'theme-manager',
        label: 'Theme Manager',
        icon: 'palette',
        tooltip: 'Open Advanced Theme Manager',
        contextAware: true, // Only show when relevant
        onClick: this.openThemeManager.bind(this)
      });

      // Add sidebar panel for theme management
      this.context.addSidebarPanel({
        id: 'theme-manager-panel',
        title: 'Enhanced Theme Manager',
        icon: 'palette',
        component: this.createEnhancedSidebarPanel()
      });

      console.log('[EnhancedThemeManager] Enhanced UI setup completed successfully');
    } catch (error) {
      console.error('[EnhancedThemeManager] Error setting up UI:', error);
    }
  }

  /**
   * Create enhanced sidebar panel with save functionality
   */
  createEnhancedSidebarPanel() {
    console.log('[EnhancedThemeManager] Creating enhanced sidebar panel...');
    return {
      render: () => {
        const hasUnsavedChanges = this.unsavedChanges.size > 0;
        return `
          <div class="theme-manager-panel">
            ${hasUnsavedChanges ? `
              <div class="unsaved-changes-banner">
                <div class="unsaved-indicator">
                  <span class="unsaved-dot"></span>
                  <span>Unsaved changes</span>
                </div>
                <div class="unsaved-actions">
                  <button class="btn btn-sm btn-success" data-command="theme.save">Save</button>
                  <button class="btn btn-sm btn-outline" data-command="theme.revert">Revert</button>
                </div>
              </div>
            ` : ''}
            
            <div class="theme-selector">
              <h3>Available Themes</h3>
              <div class="theme-list" id="theme-list">
                ${this.renderThemeList()}
              </div>
            </div>

            <div class="theme-actions">
              <button class="btn btn-primary" data-command="theme.create">
                <i class="icon-plus"></i> Create Theme
              </button>
              <button class="btn btn-outline" data-command="theme.manager.open">
                <i class="icon-edit"></i> Advanced Editor
              </button>
            </div>

            <div class="quick-colors">
              <h3>Quick Color Adjustment</h3>
              <div class="color-controls">
                <div class="color-input">
                  <label>Primary Color</label>
                  <div class="color-with-save">
                    <input type="color" id="primary-color" value="${this.getCurrentColorValue('primary')}" data-property="primary">
                    <button class="btn btn-xs btn-save" data-save-property="primary" style="display: none;">Save</button>
                  </div>
                </div>
                <div class="color-input">
                  <label>Background</label>
                  <div class="color-with-save">
                    <input type="color" id="background-color" value="${this.getCurrentColorValue('background')}" data-property="background">
                    <button class="btn btn-xs btn-save" data-save-property="background" style="display: none;">Save</button>
                  </div>
                </div>
                <div class="color-input">
                  <label>Text Color</label>
                  <div class="color-with-save">
                    <input type="color" id="text-color" value="${this.getCurrentColorValue('text')}" data-property="text">
                    <button class="btn btn-xs btn-save" data-save-property="text" style="display: none;">Save</button>
                  </div>
                </div>
                <div class="color-input">
                  <label>Accent Color</label>
                  <div class="color-with-save">
                    <input type="color" id="accent-color" value="${this.getCurrentColorValue('accent')}" data-property="accent">
                    <button class="btn btn-xs btn-save" data-save-property="accent" style="display: none;">Save</button>
                  </div>
                </div>
              </div>
              
              ${hasUnsavedChanges ? `
                <div class="save-all-section">
                  <button class="btn btn-primary btn-full" data-command="theme.save">
                    <i class="icon-save"></i> Save All Changes
                  </button>
                </div>
              ` : ''}
            </div>

            <div class="theme-info">
              <h3>Current Theme</h3>
              <div id="current-theme-info">
                ${this.renderCurrentThemeInfo()}
              </div>
            </div>
          </div>
        `;
      },

      events: {
        'click [data-command]': (event) => {
          const command = event.target.dataset.command;
          this.context.executeCommand(command);
        },

        'change [data-property]': (event) => {
          const property = event.target.dataset.property;
          const value = event.target.value;
          this.updateColorPropertyPreview(property, value);
          
          // Show individual save button
          const saveBtn = event.target.parentElement.querySelector('[data-save-property]');
          if (saveBtn) {
            saveBtn.style.display = 'inline-block';
          }
        },

        'click [data-save-property]': (event) => {
          const property = event.target.dataset.saveProperty;
          const colorInput = event.target.parentElement.querySelector(`[data-property="${property}"]`);
          if (colorInput) {
            this.saveColorProperty(property, colorInput.value);
            event.target.style.display = 'none';
          }
        },

        'click .theme-item': (event) => {
          const themeId = event.target.dataset.themeId;
          if (themeId) {
            if (this.unsavedChanges.size > 0) {
              this.confirmUnsavedChanges(() => {
                this.applyTheme(themeId);
              });
            } else {
              this.applyTheme(themeId);
            }
          }
        }
      },

      styles: `
        .theme-manager-panel {
          padding: 16px;
          font-size: 14px;
        }

        .unsaved-changes-banner {
          background: #fef3c7;
          border: 1px solid #fbbf24;
          border-radius: 6px;
          padding: 12px;
          margin-bottom: 16px;
          display: flex;
          justify-content: space-between;
          align-items: center;
        }

        .unsaved-indicator {
          display: flex;
          align-items: center;
          gap: 8px;
          color: #92400e;
          font-weight: 500;
        }

        .unsaved-dot {
          width: 8px;
          height: 8px;
          background: #f59e0b;
          border-radius: 50%;
          animation: pulse 2s infinite;
        }

        @keyframes pulse {
          0%, 100% { opacity: 1; }
          50% { opacity: 0.5; }
        }

        .unsaved-actions {
          display: flex;
          gap: 8px;
        }

        .color-with-save {
          display: flex;
          align-items: center;
          gap: 8px;
        }

        .color-input {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 12px;
        }

        .color-input label {
          font-size: 12px;
          font-weight: 500;
          flex: 1;
        }

        .color-input input[type="color"] {
          width: 40px;
          height: 30px;
          border: none;
          border-radius: 4px;
          cursor: pointer;
        }

        .btn-xs {
          padding: 2px 6px;
          font-size: 10px;
          line-height: 1;
        }

        .btn-save {
          background: #10b981;
          color: white;
          border: none;
        }

        .btn-success {
          background: #10b981;
          color: white;
          border-color: #10b981;
        }

        .btn-full {
          width: 100%;
          margin-top: 12px;
        }

        .save-all-section {
          border-top: 1px solid var(--border);
          padding-top: 12px;
          margin-top: 12px;
        }

        .theme-list {
          margin-bottom: 16px;
        }

        .theme-item {
          display: flex;
          justify-content: space-between;
          align-items: center;
          padding: 8px 12px;
          border: 1px solid var(--border);
          border-radius: 6px;
          margin-bottom: 4px;
          cursor: pointer;
          transition: background-color 0.2s;
        }

        .theme-item:hover {
          background-color: var(--accent);
        }

        .theme-item.active {
          background-color: var(--primary);
          color: var(--primary-foreground);
        }

        .btn {
          padding: 8px 12px;
          border-radius: 6px;
          border: 1px solid var(--border);
          background: var(--background);
          color: var(--foreground);
          cursor: pointer;
          font-size: 12px;
          transition: all 0.2s;
        }

        .btn-primary {
          background: var(--primary);
          color: var(--primary-foreground);
          border-color: var(--primary);
        }

        .btn-outline {
          background: transparent;
        }

        .btn:hover {
          opacity: 0.8;
        }
      `
    };
  }

  /**
   * Get current color value for a property
   */
  getCurrentColorValue(property) {
    if (this.unsavedChanges.has(property)) {
      return this.unsavedChanges.get(property);
    }
    
    if (this.currentTheme) {
      const theme = this.themes.get(this.currentTheme);
      if (theme && theme.colors && theme.colors[property]) {
        return theme.colors[property];
      }
    }
    
    // Default fallbacks
    const defaults = {
      primary: '#3b82f6',
      background: '#ffffff',
      text: '#1e293b',
      accent: '#f1f5f9'
    };
    
    return defaults[property] || '#000000';
  }

  /**
   * Update color property for preview only
   */
  updateColorPropertyPreview(property, value) {
    console.log('[EnhancedThemeManager] Previewing color change:', property, value);
    
    // Store as unsaved change
    this.unsavedChanges.set(property, value);
    
    // Apply for preview
    const root = document.documentElement;
    root.style.setProperty(`--color-${property}`, value);
    
    // Update UI to show unsaved changes
    this.updateUI();
  }

  /**
   * Save a specific color property
   */
  saveColorProperty(property, value) {
    console.log('[EnhancedThemeManager] Saving color property:', property, value);
    
    if (!this.currentTheme) {
      this.context.showNotification('No theme selected to save changes to', 'warning');
      return;
    }

    const theme = this.themes.get(this.currentTheme);
    if (!theme || !theme.colors) {
      this.context.showNotification('Cannot save to this theme type', 'warning');
      return;
    }

    // Save the change
    theme.colors[property] = value;
    
    // Remove from unsaved changes
    this.unsavedChanges.delete(property);
    
    // Apply the change
    this.applyColors(theme.colors);
    
    // Save to storage
    this.saveCurrentThemeToStorage(this.currentTheme);
    
    // Update UI
    this.updateUI();
    
    this.context.showNotification(`${property} color saved successfully!`, 'success');
  }

  /**
   * Save all unsaved changes
   */
  async saveUnsavedChanges() {
    if (this.unsavedChanges.size === 0) {
      this.context.showNotification('No changes to save', 'info');
      return;
    }

    if (!this.currentTheme) {
      this.context.showNotification('No theme selected to save changes to', 'warning');
      return;
    }

    const theme = this.themes.get(this.currentTheme);
    if (!theme || !theme.colors) {
      // Offer to create a new custom theme
      const createNew = await this.context.showConfirmDialog(
        'This theme cannot be modified. Would you like to create a new custom theme with your changes?'
      );
      
      if (createNew) {
        this.createThemeFromUnsavedChanges();
      }
      return;
    }

    // Apply all unsaved changes
    for (const [property, value] of this.unsavedChanges.entries()) {
      theme.colors[property] = value;
    }

    // Clear unsaved changes
    this.unsavedChanges.clear();

    // Apply and save
    this.applyColors(theme.colors);
    this.saveCurrentThemeToStorage(this.currentTheme);

    // Update UI
    this.updateUI();

    this.context.showNotification('All changes saved successfully!', 'success');
  }

  /**
   * Revert unsaved changes
   */
  async revertUnsavedChanges() {
    if (this.unsavedChanges.size === 0) {
      return;
    }

    const confirmed = await this.context.showConfirmDialog(
      `Revert ${this.unsavedChanges.size} unsaved change(s)?`
    );

    if (confirmed) {
      this.unsavedChanges.clear();
      
      // Reapply current theme
      if (this.currentTheme) {
        this.applyTheme(this.currentTheme, false);
      }
      
      this.updateUI();
      this.context.showNotification('Changes reverted', 'info');
    }
  }

  /**
   * Create new theme from unsaved changes
   */
  async createThemeFromUnsavedChanges() {
    const baseTheme = this.themes.get(this.currentTheme) || this.themes.get('light');
    const newColors = { ...baseTheme.colors };

    // Apply unsaved changes
    for (const [property, value] of this.unsavedChanges.entries()) {
      newColors[property] = value;
    }

    const name = `Custom Theme ${Date.now()}`;
    const themeId = this.createCustomTheme(name, newColors);

    // Clear unsaved changes and apply new theme
    this.unsavedChanges.clear();
    this.applyTheme(themeId);

    this.context.showNotification(`Created and applied new theme: ${name}`, 'success');
  }

  /**
   * Confirm action with unsaved changes
   */
  async confirmUnsavedChanges(callback) {
    const confirmed = await this.context.showConfirmDialog(
      'You have unsaved changes. Do you want to continue and lose these changes?'
    );

    if (confirmed) {
      this.unsavedChanges.clear();
      callback();
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
   * Open enhanced theme manager interface
   */
  async openThemeManager() {
    console.log('[EnhancedThemeManager] Opening enhanced theme manager...');
    // Implementation for full theme manager dialog
    this.context.showNotification('Enhanced Theme Manager opened!', 'info');
  }

  /**
   * Render theme list for sidebar
   */
  renderThemeList() {
    return Array.from(this.themes.entries())
      .map(([id, theme]) => `
        <div class="theme-item ${this.currentTheme === id ? 'active' : ''}" data-theme-id="${id}">
          <span>${theme.name}</span>
          <span class="theme-type">${theme.custom ? 'Custom' : 'Built-in'}</span>
        </div>
      `).join('');
  }

  /**
   * Render current theme information
   */
  renderCurrentThemeInfo() {
    if (!this.currentTheme) {
      return '<p>No theme selected</p>';
    }

    const theme = this.themes.get(this.currentTheme);
    const unsavedCount = this.unsavedChanges.size;
    
    return `
      <div class="current-theme">
        <p><strong>Name:</strong> ${theme.name}</p>
        <p><strong>Type:</strong> ${theme.custom ? 'Custom' : 'Built-in'}</p>
        ${theme.colors ? `<p><strong>Colors:</strong> ${Object.keys(theme.colors).length} defined</p>` : ''}
        ${unsavedCount > 0 ? `<p><strong>Unsaved:</strong> ${unsavedCount} change(s)</p>` : ''}
      </div>
    `;
  }

  /**
   * Apply system theme preference
   */
  applySystemTheme() {
    const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
    this.applyTheme(prefersDark ? 'dark' : 'light', false);
  }

  /**
   * Update UI components
   */
  updateUI() {
    // Update sidebar panel if it exists
    const panel = document.getElementById('theme-manager-panel');
    if (panel) {
      // Re-render the entire panel to reflect changes
      const component = this.createEnhancedSidebarPanel();
      panel.innerHTML = component.render();
    }
  }

  // ... Additional methods from original theme manager ...
  async showCreateThemeDialog() { /* Implementation */ }
  async editCurrentTheme() { /* Implementation */ }
  async exportTheme() { /* Implementation */ }
  async importTheme() { /* Implementation */ }
  async resetToDefault() { /* Implementation */ }
}

// Initialize the enhanced theme manager
console.log('[EnhancedThemeManager] Enhanced extension loaded, creating instance...');
const enhancedThemeManager = new EnhancedThemeManager();

// Export for UnboundUI
if (typeof module !== 'undefined' && module.exports) {
  module.exports = EnhancedThemeManager;
}

console.log('[EnhancedThemeManager] Enhanced extension script completed');
