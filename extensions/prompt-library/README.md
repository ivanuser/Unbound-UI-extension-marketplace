# Prompt Template Library

A comprehensive collection of curated prompt templates for various use cases including creative writing, code generation, analysis, and professional communications. Boost your productivity with proven prompts.

## Features

- **150+ Templates**: Carefully crafted prompts for diverse use cases
- **6 Categories**: Creative writing, code generation, analysis, communication, learning, brainstorming
- **Variable Substitution**: Customizable templates with placeholder variables
- **Search & Filter**: Find the perfect prompt quickly
- **Custom Templates**: Create and save your own prompt templates

## Installation

1. Open UnboundUI Extensions page
2. Search for "Prompt Template Library"
3. Click "Install"
4. Access templates via the prompt menu

## Usage

```javascript
// Get templates by category
const codeTemplates = promptLibrary.getTemplatesByCategory('code-generation');

// Apply a template with variables
const prompt = promptLibrary.applyTemplate('code-review', {
  code: 'function example() { return "hello"; }'
});

// Get all available templates
const allTemplates = promptLibrary.getAllTemplates();
```

## Template Categories

### Creative Writing
- Story starters and plot generators
- Character development prompts
- Poetry and creative exercises
- Dialogue generators

### Code Generation
- Code review templates
- Documentation generators
- Testing prompts
- Architecture planning

### Analysis
- Data analysis frameworks
- Research methodologies
- Critical thinking prompts
- Problem-solving templates

### Communication
- Email templates
- Meeting summaries
- Presentation outlines
- Professional correspondence

### Learning
- Study guides
- Quiz generators
- Explanation frameworks
- Teaching prompts

### Brainstorming
- Idea generation
- Innovation exercises
- Problem identification
- Solution frameworks

## Creating Custom Templates

```javascript
// Add your own template
promptLibrary.templates.set('my-template', {
  title: 'My Custom Template',
  category: 'custom',
  prompt: 'Create a {type} about {topic} for {audience}',
  variables: ['type', 'topic', 'audience']
});
```

## License

MIT License - see LICENSE file for details.
