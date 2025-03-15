# Prompt Library Extension for Open WebUI

Save, organize, and reuse your most effective prompts with the Prompt Library extension for Open WebUI.

![Prompt Library Screenshot](static/preview.png)

## Features

- **Save Prompts**: Capture effective prompts directly from your conversations
- **Organize**: Categorize and tag prompts for easy retrieval
- **Templates**: Use and customize pre-built prompt templates for common tasks
- **Import/Export**: Share prompt collections with others
- **Quick Access**: Insert prompts directly into your conversations

## Installation

### From Extension Manager

1. Open the Extension Manager in Open WebUI (Settings > Extensions)
2. Click on the "Marketplace" tab
3. Find "Prompt Library" and click "Install"
4. Restart Open WebUI if prompted

### Manual Installation

1. Download the extension package
2. Extract to your Open WebUI extensions directory
3. Restart Open WebUI
4. Enable the extension in the Extension Manager

## Usage

### Accessing the Prompt Library

- Click on the "Prompt Library" icon in the sidebar
- Use the search bar to find specific prompts
- Browse categories to explore available prompts

### Saving a Prompt

1. In any conversation, click the "Save to Library" button
2. Add a title, description, and tags
3. Select a category or create a new one
4. Click "Save"

### Using a Prompt

1. Open the Prompt Library
2. Find the prompt you want to use
3. Click "Use Prompt" to insert it into the current conversation
4. Or click "Copy" to copy the prompt to your clipboard

### Managing Categories

The extension comes with default categories:
- **General**: General-purpose prompts
- **Writing**: Prompts for writing tasks
- **Coding**: Prompts for programming tasks
- **Research**: Prompts for research tasks

You can also create your own custom categories.

## Built-in Templates

The extension includes pre-built templates for common tasks:

### Writing Templates
- Essay outlines
- Blog posts
- Creative stories
- Professional emails
- Product descriptions

### Coding Templates
- Code reviews
- Algorithm implementations
- Debugging assistance
- Code refactoring
- Unit test generation

### Research Templates
- Literature reviews
- Research methodology design
- Research proposals
- Data analysis plans
- Research paper summaries

## Customization

Adjust the extension settings by clicking the gear icon in the Prompt Library interface:

- **Default Category**: Set your preferred default category
- **Interface Position**: Choose sidebar or floating window
- **Auto-save**: Enable/disable automatic prompt saving
- **Template Variables**: Customize default template variables

## Import/Export

- **Export**: Save your prompt collection as a JSON file to back up or share
- **Import**: Load prompts from a JSON file (compatible with exported prompt collections)

## For Developers

### Extension Structure

```
prompt-library/
├── __init__.py                # Main entry point
├── extension.json             # Extension manifest
├── api.py                     # API endpoints
├── models.py                  # Data models
├── frontend/                  # Frontend components
├── static/                    # Static assets
└── templates/                 # Pre-built prompt templates
```

### API Endpoints

The extension provides REST API endpoints for integrating with other extensions:

- `GET /api/extensions/prompt-library/categories`: Get all categories
- `POST /api/extensions/prompt-library/categories`: Create a new category
- `GET /api/extensions/prompt-library/prompts`: Get all prompts
- `GET /api/extensions/prompt-library/prompts/{id}`: Get a specific prompt
- `POST /api/extensions/prompt-library/prompts`: Create a new prompt
- `PUT /api/extensions/prompt-library/prompts/{id}`: Update a prompt
- `DELETE /api/extensions/prompt-library/prompts/{id}`: Delete a prompt
- `GET /api/extensions/prompt-library/templates`: Get prompt templates
- `POST /api/extensions/prompt-library/export`: Export prompts
- `POST /api/extensions/prompt-library/import`: Import prompts

## Support

If you encounter any issues or have suggestions, please:

1. Check the [GitHub Issues](https://github.com/open-webui/prompt-library/issues)
2. Submit a new issue if needed
3. Join the [Open WebUI Discord](https://discord.gg/openwebui) for community support

## License

This extension is released under the MIT License.
