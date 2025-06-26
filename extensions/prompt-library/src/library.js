/**
 * Prompt Template Library for UnboundUI
 * Provides curated prompt templates for various use cases
 */

class PromptLibrary {
  constructor() {
    this.templates = new Map();
    this.categories = ['creative-writing', 'code-generation', 'analysis', 'communication', 'learning', 'brainstorming'];
    this.isInitialized = false;
    this.loadTemplates();
  }

  /**
   * Initialize the prompt library
   */
  async initialize() {
    try {
      if (typeof unboundUI !== 'undefined') {
        unboundUI.registerExtension(this);
        this.isInitialized = true;
        unboundUI.logger.info('Prompt Library extension initialized');
      }
    } catch (error) {
      console.error('Failed to initialize Prompt Library:', error);
    }
  }

  /**
   * Load prompt templates
   */
  loadTemplates() {
    // Sample templates
    this.templates.set('code-review', {
      title: 'Code Review Template',
      category: 'code-generation',
      prompt: 'Please review the following code for:\n1. Best practices\n2. Potential bugs\n3. Performance improvements\n4. Security concerns\n\nCode:\n{code}',
      variables: ['code']
    });

    this.templates.set('creative-story', {
      title: 'Creative Story Starter',
      category: 'creative-writing',
      prompt: 'Write a {genre} story about {character} who discovers {discovery} in {setting}. The story should be approximately {length} words.',
      variables: ['genre', 'character', 'discovery', 'setting', 'length']
    });

    this.templates.set('meeting-summary', {
      title: 'Meeting Summary Template',
      category: 'communication',
      prompt: 'Summarize the following meeting notes:\n\n{notes}\n\nPlease provide:\n1. Key decisions made\n2. Action items with owners\n3. Next steps\n4. Unresolved issues',
      variables: ['notes']
    });
  }

  /**
   * Get templates by category
   */
  getTemplatesByCategory(category) {
    const templates = Array.from(this.templates.entries());
    return templates.filter(([_, template]) => template.category === category);
  }

  /**
   * Get all templates
   */
  getAllTemplates() {
    return Array.from(this.templates.entries());
  }

  /**
   * Apply template with variables
   */
  applyTemplate(templateId, variables = {}) {
    const template = this.templates.get(templateId);
    if (!template) {
      throw new Error(`Template not found: ${templateId}`);
    }

    let prompt = template.prompt;
    for (const [key, value] of Object.entries(variables)) {
      prompt = prompt.replace(new RegExp(`{${key}}`, 'g'), value);
    }

    return prompt;
  }

  /**
   * Extension lifecycle methods
   */
  activate() {
    unboundUI.logger.info('Prompt Library extension activated');
  }

  deactivate() {
    unboundUI.logger.info('Prompt Library extension deactivated');
  }
}

// Initialize extension
const promptLibrary = new PromptLibrary();
promptLibrary.initialize();

// Export for UnboundUI
if (typeof module !== 'undefined' && module.exports) {
  module.exports = PromptLibrary;
}
