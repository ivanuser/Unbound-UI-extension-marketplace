# Prompt Library Extension for Open WebUI

Save, organize, and reuse your most effective prompts with the Prompt Library extension for Open WebUI.

## Features

- **Save Prompts**: Capture effective prompts directly from your conversations
- **Organize**: Categorize and tag prompts for easy retrieval
- **Templates**: Use and customize pre-built prompt templates for common tasks
- **Import/Export**: Share prompt collections with others
- **Quick Access**: Insert prompts directly into your conversations

## Installation

1. Open the Extension Manager in Open WebUI (Settings > Extensions)
2. Click on the "Marketplace" tab
3. Find "Prompt Library" and click "Install"
4. Restart Open WebUI if prompted

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

### Managing Templates

The extension includes pre-built templates for common tasks:

- **Writing**: Essay outlines, story structures, content briefs
- **Coding**: Code reviews, algorithm design, debugging assistance
- **Research**: Literature reviews, data analysis, summarization
- **Business**: Email templates, meeting summaries, reports
- **Creative**: Art descriptions, character development, idea generation

## Customization

Adjust the extension settings by clicking the gear icon in the Prompt Library interface:

- **Default Category**: Set your preferred default category
- **Interface Position**: Choose sidebar or floating window
- **Auto-save**: Enable/disable automatic prompt saving
- **Template Variables**: Customize default template variables

## For Developers

### Extension Structure

The extension follows the standard Open WebUI extension structure:

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

### Data Storage

Prompts are stored in the Open WebUI database using the extension storage API.

## Roadmap

Future updates will include:

- **Collaborative sharing**: Share prompts with team members
- **Version history**: Track changes to prompts over time
- **Advanced templating**: More powerful template variables and conditionals
- **AI-assisted prompt improvement**: Get suggestions for improving prompts
- **Analytics**: Track prompt effectiveness and usage statistics

## Support

If you encounter any issues or have suggestions, please:

1. Check the [GitHub Issues](https://github.com/open-webui/prompt-library/issues)
2. Submit a new issue if needed
3. Join the [Open WebUI Discord](https://discord.gg/openwebui) for community support

## License

This extension is released under the MIT License.
