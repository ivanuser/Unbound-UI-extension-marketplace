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
    this.id = 'theme-manager'; // Add explicit ID
    this.loadDefaultThemes();
    
    console.log('[ThemeManager] Constructor called');
    
    // Initialize when unboundUI is available
    this.waitForUnboundUI();
  }
  
  /**
   * Wait for unboundUI global object to be available
   */
  async waitForUnboundUI() {
    console.log('[ThemeManager] Waiting for unboundUI...');
    
    const checkForUnboundUI = () => {
      if (typeof unboundUI !== 'undefined') {
        console.log('[ThemeManager] unboundUI found, initializing...');
        this.initialize();
      } else {
        console.log('[ThemeManager] unboundUI not yet available, retrying...');
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
      console.log('[ThemeManager] Initialize called');
      
      if (typeof unboundUI !== 'undefined') {
        console.log('[ThemeManager] Registering extension...');
        unboundUI.registerExtension(this);
        this.isInitialized = true;
        unboundUI.logger.info('Theme Manager extension initialized');
        console.log('[ThemeManager] Extension registered successfully');
      } else {
        console.error('[ThemeManager] unboundUI is not available');
      }
    } catch (error) {
      console.error('[ThemeManager] Failed to initialize:', error);
    }
  }

  /**
   * Called when the extension is activated
   */
  async activate(context) {
    console.log('[ThemeManager] Activate called with context:', context);
    
    this.context = context;
    this.setupUI();
    
    // Register theme management commands
    this.registerCommands();
    
    console.log('[ThemeManager] Extension activated successfully');
  }

  /**
   * Called when the extension is deactivated
   */
  async  deactivate() {
    console.log('[ThemeManager] Deactivate called');
    
    // Cleanup UI elements
    if (this.context) {
      this.context.removeSidebarPanel('theme-manager-panel');
    }
    
    // Remove dynamic toolbar button
    this.removeDynamicToolbar();
    
    console.log('[ThemeManager] Extension deactivated');
  }

  /**
   * Load default themes
   */
  loadDefaultThemes() {
    console.log('[ThemeManager] Loading default themes...');
    
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
    
    console.log('[ThemeManager] Default themes loaded:', this.themes.size);
  }

  /**
   * Apply theme
   */
  applyTheme(themeId) {
    console.log('[ThemeManager] Applying theme:', themeId);
    
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
    
    console.log('[ThemeManager] Theme applied successfully:', themeId);
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
   * Register theme management commands
   */
  registerCommands() {
    console.log('[ThemeManager] Registering commands...');
    
    const commands = {
      'theme.manager.open': this.openThemeManager.bind(this),
      'theme.apply': this.applyTheme.bind(this),
      'theme.create': this.showCreateThemeDialog.bind(this),
      'theme.edit': this.editCurrentTheme.bind(this),
      'theme.export': this.exportTheme.bind(this),
      'theme.import': this.importTheme.bind(this),
      'theme.reset': this.resetToDefault.bind(this)
    };

    Object.entries(commands).forEach(([id, handler]) => {
      this.context.registerCommand(id, handler);
    });
    
    console.log('[ThemeManager] Commands registered:', Object.keys(commands).length);
  }

  /**
   * Setup theme manager UI
   */  setupUI() {
    console.log('[ThemeManager] Setting up UI...');
    
    try {
      // Create dynamic toolbar directly in the DOM instead of using addToolbarButton
      console.log('[ThemeManager] Creating dynamic toolbar...');
      this.createDynamicToolbar();
      console.log('[ThemeManager] Dynamic toolbar created');

      // Add sidebar panel for theme management
      console.log('[ThemeManager] Adding sidebar panel...');
      this.context.addSidebarPanel({
        id: 'theme-manager-panel',
        title: 'Theme Manager',
        icon: 'palette',
        component: this.createSidebarPanel()
      });
      console.log('[ThemeManager] Sidebar panel added');

      // Add context menu items
      console.log('[ThemeManager] Adding context menu...');
      this.context.addContextMenuItem({
        id: 'theme-manager-menu',
        label: 'Theme Manager',
        icon: 'palette',
        submenu: [
          { id: 'theme-open-manager', label: 'Open Theme Manager', command: 'theme.manager.open' },
          { id: 'theme-create-new', label: 'Create New Theme', command: 'theme.create' },
          { separator: true },
          { id: 'theme-apply-light', label: 'Apply Light Theme', command: 'theme.apply', args: ['light'] },
          { id: 'theme-apply-dark', label: 'Apply Dark Theme', command: 'theme.apply', args: ['dark'] },
          { id: 'theme-apply-auto', label: 'Apply Auto Theme', command: 'theme.apply', args: ['auto'] }
        ]
      });
      console.log('[ThemeManager] Context menu added');

      // Initialize UI components
      this.setupColorPicker();
      this.setupStyleEditor();
          console.log('[ThemeManager] UI setup completed successfully');
    } catch (error) {
      console.error('[ThemeManager] Error setting up UI:', error);
    }
  }

  /**
   * Create dynamic toolbar that injects directly into the DOM
   */
  createDynamicToolbar() {
    console.log('[ThemeManager] Creating dynamic toolbar...');
    
    // Wait for DOM to be ready
    const createButton = () => {
      const container = document.getElementById('extension-toolbar-container');
      if (!container) {
        console.log('[ThemeManager] Toolbar container not found, retrying...');
        setTimeout(createButton, 100);
        return;
      }

      // Remove any existing theme manager buttons
      const existingButton = container.querySelector('[data-extension-id="theme-manager"]');
      if (existingButton) {
        existingButton.remove();
      }

      // Create the toolbar button
      const button = document.createElement('button');
      button.setAttribute('data-extension-id', 'theme-manager');
      button.className = 'inline-flex items-center justify-center whitespace-nowrap rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 hover:bg-accent hover:text-accent-foreground h-8 w-8';
      button.innerHTML = `
        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="h-4 w-4">
          <circle cx="13.5" cy="6.5" r=".5" fill="currentColor"/>
          <circle cx="17.5" cy="10.5" r=".5" fill="currentColor"/>
          <circle cx="8.5" cy="7.5" r=".5" fill="currentColor"/>
          <circle cx="6.5" cy="12.5" r=".5" fill="currentColor"/>
          <circle cx="12.5" cy="16.5" r=".5" fill="currentColor"/>
          <circle cx="13.5" cy="20.5" r=".5" fill="currentColor"/>
          <circle cx="9.5" cy="19.5" r=".5" fill="currentColor"/>
          <circle cx="5.5" cy="17.5" r=".5" fill="currentColor"/>
          <circle cx="3.5" cy="13.5" r=".5" fill="currentColor"/>
          <circle cx="3.5" cy="8.5" r=".5" fill="currentColor"/>
          <circle cx="7.5" cy="4.5" r=".5" fill="currentColor"/>
          <circle cx="11.5" cy="3.5" r=".5" fill="currentColor"/>
          <circle cx="16.5" cy="4.5" r=".5" fill="currentColor"/>
          <circle cx="20.5" cy="7.5" r=".5" fill="currentColor"/>
          <circle cx="21.5" cy="12.5" r=".5" fill="currentColor"/>
          <circle cx="19.5" cy="17.5" r=".5" fill="currentColor"/>
          <circle cx="15.5" cy="20.5" r=".5" fill="currentColor"/>
        </svg>
        <span class="sr-only">Theme Manager</span>
      `;
      
      // Add click handler
      button.addEventListener('click', () => {
        console.log('[ThemeManager] Toolbar button clicked');
        this.openThemeManager();
      });

      // Add tooltip functionality
      button.title = 'Open Advanced Theme Manager';

      // Insert the button into the container
      container.appendChild(button);
      console.log('[ThemeManager] Dynamic toolbar button created and inserted');
    };    // Start creating the button
    if (document.readyState === 'loading') {
      document.addEventListener('DOMContentLoaded', createButton);
    } else {
      createButton();
    }
  }

  /**
   * Remove dynamic toolbar button
   */
  removeDynamicToolbar() {
    console.log('[ThemeManager] Removing dynamic toolbar...');
    const container = document.getElementById('extension-toolbar-container');
    if (container) {
      const button = container.querySelector('[data-extension-id="theme-manager"]');
      if (button) {
        button.remove();
        console.log('[ThemeManager] Dynamic toolbar button removed');
      }
    }
  }

  /**
   * Create sidebar panel component for theme management
   */
  createSidebarPanel() {
    console.log('[ThemeManager] Creating sidebar panel component...');
    
    return {
      render: () => {
        console.log('[ThemeManager] Rendering sidebar panel...');
        return `
          <div class="theme-manager-panel">
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
                  <input type="color" id="primary-color" value="#3b82f6" data-property="primary">
                </div>
                <div class="color-input">
                  <label>Background</label>
                  <input type="color" id="background-color" value="#ffffff" data-property="background">
                </div>
              </div>
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
          this.updateColorProperty(property, value);
        },
        
        'click .theme-item': (event) => {
          const themeId = event.target.dataset.themeId;
          if (themeId) {
            this.applyTheme(themeId);
            this.updateUI();
          }
        }
      },
      
      styles: `
        .theme-manager-panel {
          padding: 16px;
          font-size: 14px;
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
        
        .theme-actions {
          display: flex;
          gap: 8px;
          margin-bottom: 16px;
        }
        
        .color-controls {
          display: grid;
          gap: 12px;
        }
        
        .color-input {
          display: flex;
          justify-content: space-between;
          align-items: center;
        }
        
        .color-input label {
          font-size: 12px;
          font-weight: 500;
        }
        
        .color-input input[type="color"] {
          width: 40px;
          height: 30px;
          border: none;
          border-radius: 4px;
          cursor: pointer;
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
    return `
      <div class="current-theme">
        <p><strong>Name:</strong> ${theme.name}</p>
        <p><strong>Type:</strong> ${theme.custom ? 'Custom' : 'Built-in'}</p>
        ${theme.colors ? `<p><strong>Colors:</strong> ${Object.keys(theme.colors).length} defined</p>` : ''}
      </div>
    `;
  }

  /**
   * Setup color picker functionality
   */
  setupColorPicker() {
    this.colorPicker = {
      show: (callback) => {
        this.context.showDialog({
          title: 'Color Picker',
          component: 'ColorPickerDialog',
          props: {
            onColorSelect: callback
          },
          size: 'medium'
        });
      }
    };
  }

  /**
   * Setup style editor functionality
   */
  setupStyleEditor() {
    this.styleEditor = {
      open: (theme) => {
        this.context.showDialog({
          title: 'Advanced Theme Editor',
          component: 'ThemeEditorDialog',
          props: {
            theme: theme,
            onSave: this.saveTheme.bind(this),
            onPreview: this.previewTheme.bind(this)
          },
          size: 'large'
        });
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
   * Open main theme manager interface
   */
  async openThemeManager() {
    console.log('[ThemeManager] Opening theme manager dialog...');
    
    this.context.showDialog({
      title: 'Theme Manager',
      component: 'ThemeManagerDialog',
      props: {
        themes: this.getAllThemes(),
        currentTheme: this.currentTheme,
        onApplyTheme: this.applyTheme.bind(this),
        onCreateTheme: this.showCreateThemeDialog.bind(this),
        onEditTheme: this.editTheme.bind(this),
        onDeleteTheme: this.deleteTheme.bind(this)
      },
      size: 'large'
    });
  }

  /**
   * Show create theme dialog
   */
  async showCreateThemeDialog() {
    const result = await this.context.showDialog({
      title: 'Create New Theme',
      component: 'CreateThemeDialog',
      props: {
        baseTheme: this.currentTheme,
        onCreateTheme: this.createCustomTheme.bind(this)
      },
      size: 'medium'
    });

    if (result && result.theme) {
      this.context.showNotification(`Theme "${result.theme.name}" created successfully!`, 'success');
      this.updateUI();
    }
  }

  /**
   * Edit existing theme
   */
  async editTheme(themeId) {
    const theme = this.themes.get(themeId);
    if (!theme) return;

    if (!theme.custom) {
      this.context.showNotification('Built-in themes cannot be edited. Create a custom theme instead.', 'warning');
      return;
    }

    this.styleEditor.open(theme);
  }

  /**
   * Edit current theme
   */
  async editCurrentTheme() {
    if (this.currentTheme) {
      this.editTheme(this.currentTheme);
    } else {
      this.context.showNotification('No theme is currently selected', 'warning');
    }
  }

  /**
   * Delete custom theme
   */
  async deleteTheme(themeId) {
    const theme = this.themes.get(themeId);
    if (!theme) return;

    if (!theme.custom) {
      this.context.showNotification('Built-in themes cannot be deleted', 'warning');
      return;
    }

    const confirmed = await this.context.showConfirmDialog(
      `Are you sure you want to delete the theme "${theme.name}"?`
    );

    if (confirmed) {
      this.themes.delete(themeId);
      if (this.currentTheme === themeId) {
        this.applyTheme('light'); // Fallback to light theme
      }
      this.context.showNotification(`Theme "${theme.name}" deleted`, 'info');
      this.updateUI();
    }
  }

  /**
   * Export theme
   */
  async exportTheme(themeId = this.currentTheme) {
    const theme = this.themes.get(themeId);
    if (!theme) {
      this.context.showNotification('No theme selected for export', 'warning');
      return;
    }

    const exportData = {
      name: theme.name,
      colors: theme.colors,
      version: '1.0.0',
      exported: new Date().toISOString()
    };

    // Create download blob
    const blob = new Blob([JSON.stringify(exportData, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    
    // Trigger download
    const a = document.createElement('a');
    a.href = url;
    a.download = `${themeId}-theme.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);

    this.context.showNotification(`Theme "${theme.name}" exported successfully!`, 'success');
  }

  /**
   * Import theme
   */
  async importTheme() {
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = '.json';
    
    input.onchange = async (event) => {
      const file = event.target.files[0];
      if (!file) return;

      try {
        const text = await file.text();
        const themeData = JSON.parse(text);
        
        // Validate theme data
        if (!themeData.name || !themeData.colors) {
          throw new Error('Invalid theme file format');
        }

        // Create imported theme
        const themeId = this.createCustomTheme(themeData.name, themeData.colors);
        this.context.showNotification(`Theme "${themeData.name}" imported successfully!`, 'success');
        this.updateUI();
        
        // Ask if user wants to apply the imported theme
        const applyNow = await this.context.showConfirmDialog(
          `Would you like to apply the imported theme "${themeData.name}" now?`
        );
        
        if (applyNow) {
          this.applyTheme(themeId);
        }
      } catch (error) {
        this.context.showNotification(`Failed to import theme: ${error.message}`, 'error');
      }
    };
    
    input.click();
  }

  /**
   * Reset to default theme
   */
  async resetToDefault() {
    const confirmed = await this.context.showConfirmDialog(
      'Reset to default light theme? This will not delete your custom themes.'
    );
    
    if (confirmed) {
      this.applyTheme('light');
      this.context.showNotification('Reset to default light theme', 'info');
    }
  }

  /**
   * Update color property in real-time
   */
  updateColorProperty(property, value) {
    if (!this.currentTheme) return;
    
    const theme = this.themes.get(this.currentTheme);
    if (!theme || !theme.colors) return;
    
    // Update the color
    theme.colors[property] = value;
    
    // Apply the change immediately for preview
    this.applyColors(theme.colors);
    
    // Update UI to reflect changes
    this.updateUI();
  }

  /**
   * Save theme changes
   */
  async saveTheme(themeData) {
    try {
      const themeId = themeData.id || this.createThemeId(themeData.name);
      this.themes.set(themeId, {
        name: themeData.name,
        colors: themeData.colors,
        custom: true
      });
      
      this.context.showNotification(`Theme "${themeData.name}" saved successfully!`, 'success');
      this.updateUI();
      return themeId;
    } catch (error) {
      this.context.showNotification(`Failed to save theme: ${error.message}`, 'error');
      throw error;
    }
  }

  /**
   * Preview theme without applying
   */
  previewTheme(themeData) {
    if (themeData.colors) {
      this.applyColors(themeData.colors);
    }
  }

  /**
   * Update UI components
   */
  updateUI() {
    // Update sidebar panel if it exists
    const panel = document.getElementById('theme-manager-panel');
    if (panel) {
      const themeList = panel.querySelector('#theme-list');
      if (themeList) {
        themeList.innerHTML = this.renderThemeList();
      }
      
      const themeInfo = panel.querySelector('#current-theme-info');
      if (themeInfo) {
        themeInfo.innerHTML = this.renderCurrentThemeInfo();
      }
    }
  }

  /**
   * Create theme ID from name
   */
  createThemeId(name) {
    return name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-+|-+$/g, '');
  }
}

// Don't initialize immediately - let the extension manager handle this
console.log('[ThemeManager] Extension loaded, creating instance...');
const themeManager = new ThemeManager();

// Export for UnboundUI
if (typeof module !== 'undefined' && module.exports) {
  module.exports = ThemeManager;
}

console.log('[ThemeManager] Extension script completed');
