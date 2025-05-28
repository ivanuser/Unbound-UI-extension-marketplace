/**
 * Text Transformer Tool for UnboundUI
 * Advanced text transformation utilities
 */

class TextTransformer {
  constructor() {
    this.transformations = new Map();
    this.history = [];
    this.isInitialized = false;
    this.setupTransformations();
  }

  /**
   * Initialize the text transformer
   */
  async initialize() {
    try {
      if (typeof unboundUI !== 'undefined') {
        unboundUI.registerExtension(this);
        this.setupUI();
        this.isInitialized = true;
        unboundUI.logger.info('Text Transformer extension initialized');
      }
    } catch (error) {
      console.error('Failed to initialize Text Transformer:', error);
    }
  }

  /**
   * Setup available transformations
   */
  setupTransformations() {
    // Case transformations
    this.transformations.set('uppercase', {
      name: 'UPPERCASE',
      description: 'Convert text to uppercase',
      category: 'case',
      transform: (text) => text.toUpperCase()
    });

    this.transformations.set('lowercase', {
      name: 'lowercase',
      description: 'Convert text to lowercase',
      category: 'case',
      transform: (text) => text.toLowerCase()
    });

    this.transformations.set('titlecase', {
      name: 'Title Case',
      description: 'Convert text to title case',
      category: 'case',
      transform: (text) => text.replace(/\w\S*/g, (txt) => 
        txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase()
      )
    });

    this.transformations.set('camelcase', {
      name: 'camelCase',
      description: 'Convert text to camelCase',
      category: 'case',
      transform: (text) => text.replace(/(?:^\w|[A-Z]|\b\w)/g, (word, index) => 
        index === 0 ? word.toLowerCase() : word.toUpperCase()
      ).replace(/\s+/g, '')
    });

    this.transformations.set('pascalcase', {
      name: 'PascalCase',
      description: 'Convert text to PascalCase',
      category: 'case',
      transform: (text) => text.replace(/(?:^\w|[A-Z]|\b\w)/g, (word) => 
        word.toUpperCase()
      ).replace(/\s+/g, '')
    });

    this.transformations.set('kebabcase', {
      name: 'kebab-case',
      description: 'Convert text to kebab-case',
      category: 'case',
      transform: (text) => text.toLowerCase().replace(/\s+/g, '-')
    });

    this.transformations.set('snakecase', {
      name: 'snake_case',
      description: 'Convert text to snake_case',
      category: 'case',
      transform: (text) => text.toLowerCase().replace(/\s+/g, '_')
    });

    // Formatting transformations
    this.transformations.set('trim', {
      name: 'Trim Whitespace',
      description: 'Remove leading and trailing whitespace',
      category: 'formatting',
      transform: (text) => text.trim()
    });

    this.transformations.set('removeextraspaces', {
      name: 'Remove Extra Spaces',
      description: 'Replace multiple spaces with single spaces',
      category: 'formatting',
      transform: (text) => text.replace(/\s+/g, ' ')
    });

    this.transformations.set('removelinebreaks', {
      name: 'Remove Line Breaks',
      description: 'Remove all line breaks',
      category: 'formatting',
      transform: (text) => text.replace(/\n/g, ' ')
    });

    this.transformations.set('addlinebreaks', {
      name: 'Add Line Breaks',
      description: 'Add line breaks at sentence ends',
      category: 'formatting',
      transform: (text) => text.replace(/\.\s+/g, '.\n')
    });

    // Encoding transformations
    this.transformations.set('base64encode', {
      name: 'Base64 Encode',
      description: 'Encode text to Base64',
      category: 'encoding',
      transform: (text) => btoa(text)
    });

    this.transformations.set('base64decode', {
      name: 'Base64 Decode',
      description: 'Decode Base64 text',
      category: 'encoding',
      transform: (text) => {
        try {
          return atob(text);
        } catch (e) {
          throw new Error('Invalid Base64 input');
        }
      }
    });

    this.transformations.set('urlencode', {
      name: 'URL Encode',
      description: 'Encode text for URLs',
      category: 'encoding',
      transform: (text) => encodeURIComponent(text)
    });

    this.transformations.set('urldecode', {
      name: 'URL Decode',
      description: 'Decode URL-encoded text',
      category: 'encoding',
      transform: (text) => decodeURIComponent(text)
    });

    // Text manipulation
    this.transformations.set('reverse', {
      name: 'Reverse Text',
      description: 'Reverse the order of characters',
      category: 'manipulation',
      transform: (text) => text.split('').reverse().join('')
    });

    this.transformations.set('removenonalphanumeric', {
      name: 'Remove Non-Alphanumeric',
      description: 'Keep only letters and numbers',
      category: 'manipulation',
      transform: (text) => text.replace(/[^a-zA-Z0-9]/g, '')
    });

    this.transformations.set('extractemails', {
      name: 'Extract Emails',
      description: 'Extract email addresses',
      category: 'extraction',
      transform: (text) => {
        const emailRegex = /\b[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Z|a-z]{2,}\b/g;
        const emails = text.match(emailRegex) || [];
        return emails.join('\n');
      }
    });

    this.transformations.set('extracturls', {
      name: 'Extract URLs',
      description: 'Extract web URLs',
      category: 'extraction',
      transform: (text) => {
        const urlRegex = /https?:\/\/(www\.)?[-a-zA-Z0-9@:%._\+~#=]{1,256}\.[a-zA-Z0-9()]{1,6}\b([-a-zA-Z0-9()@:%_\+.~#?&//=]*)/g;
        const urls = text.match(urlRegex) || [];
        return urls.join('\n');
      }
    });

    // Markdown transformations
    this.transformations.set('stripmarkdown', {
      name: 'Strip Markdown',
      description: 'Remove markdown formatting',
      category: 'markdown',
      transform: (text) => text
        .replace(/#{1,6}\s+/g, '') // Headers
        .replace(/\*\*(.*?)\*\*/g, '$1') // Bold
        .replace(/\*(.*?)\*/g, '$1') // Italic
        .replace(/\[(.*?)\]\(.*?\)/g, '$1') // Links
        .replace(/`(.*?)`/g, '$1') // Code
    });

    this.transformations.set('markdowntohtml', {
      name: 'Markdown to HTML',
      description: 'Convert basic markdown to HTML',
      category: 'markdown',
      transform: (text) => text
        .replace(/#{6}\s+(.*?)$/gm, '<h6>$1</h6>')
        .replace(/#{5}\s+(.*?)$/gm, '<h5>$1</h5>')
        .replace(/#{4}\s+(.*?)$/gm, '<h4>$1</h4>')
        .replace(/#{3}\s+(.*?)$/gm, '<h3>$1</h3>')
        .replace(/#{2}\s+(.*?)$/gm, '<h2>$1</h2>')
        .replace(/#{1}\s+(.*?)$/gm, '<h1>$1</h1>')
        .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
        .replace(/\*(.*?)\*/g, '<em>$1</em>')
        .replace(/\[(.*?)\]\((.*?)\)/g, '<a href="$2">$1</a>')
        .replace(/`(.*?)`/g, '<code>$1</code>')
    });
  }

  /**
   * Apply transformation to text
   */
  transform(text, transformationId) {
    const transformation = this.transformations.get(transformationId);
    if (!transformation) {
      throw new Error(`Transformation not found: ${transformationId}`);
    }

    try {
      const result = transformation.transform(text);
      
      // Add to history
      this.history.push({
        original: text,
        result,
        transformation: transformationId,
        timestamp: Date.now()
      });

      return result;
    } catch (error) {
      throw new Error(`Transformation failed: ${error.message}`);
    }
  }

  /**
   * Apply multiple transformations in sequence
   */
  transformBatch(text, transformationIds) {
    let result = text;
    
    for (const id of transformationIds) {
      result = this.transform(result, id);
    }
    
    return result;
  }

  /**
   * Get transformations by category
   */
  getTransformationsByCategory(category) {
    const transformations = Array.from(this.transformations.entries());
    return transformations.filter(([_, transform]) => transform.category === category);
  }

  /**
   * Get all transformation categories
   */
  getCategories() {
    const categories = new Set();
    for (const [_, transformation] of this.transformations) {
      categories.add(transformation.category);
    }
    return Array.from(categories);
  }

  /**
   * Copy result to clipboard
   */
  async copyToClipboard(text) {
    try {
      await navigator.clipboard.writeText(text);
      return true;
    } catch (error) {
      console.error('Failed to copy to clipboard:', error);
      return false;
    }
  }

  /**
   * Setup UI components
   */
  setupUI() {
    // Placeholder for UI setup
    console.log('Text Transformer UI initialized');
  }

  /**
   * Get transformation history
   */
  getHistory() {
    return this.history.slice(-50); // Last 50 transformations
  }

  /**
   * Clear transformation history
   */
  clearHistory() {
    this.history = [];
  }

  /**
   * Extension lifecycle methods
   */
  activate() {
    unboundUI.logger.info('Text Transformer extension activated');
  }

  deactivate() {
    unboundUI.logger.info('Text Transformer extension deactivated');
  }
}

// Initialize extension
const textTransformer = new TextTransformer();
textTransformer.initialize();

// Export for UnboundUI
if (typeof module !== 'undefined' && module.exports) {
  module.exports = TextTransformer;
}
