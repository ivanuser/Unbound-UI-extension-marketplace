# Open WebUI Extension Marketplace

A central repository of extensions for [Open WebUI](https://github.com/open-webui/open-webui), allowing users to discover, install, and manage extensions through the Extension Manager.

## About the Marketplace

The Open WebUI Extension Marketplace provides:

- A curated collection of extensions for enhancing Open WebUI
- Simple discovery and installation of extensions
- Categorization and tagging for easy browsing
- Versioning and updates management
- Community-driven extension ecosystem

## For Users

### Using the Marketplace

1. Open the Extension Manager in Open WebUI (Settings > Extensions)
2. Click on the "Marketplace" tab
3. Browse or search for extensions
4. Click "Install" to add an extension to your Open WebUI instance

### Popular Extensions

- **Prompt Library**: Save, organize, and reuse effective prompts
- **Theme Manager**: Customize the appearance of Open WebUI
- **Model Adapters**: Connect to additional AI models
- **Tool Extensions**: Add new capabilities to your AI assistants

## For Developers

### Adding Your Extension

To add your extension to the marketplace:

1. Fork this repository
2. Create a new directory in `extensions/` with your extension name
3. Add required files:
   - `manifest.json`: Extension metadata
   - `README.md`: Documentation and usage instructions
   - `preview.png`: Screenshot or preview image
   - `releases/latest.json`: Latest version information
   - `releases/[version].zip`: Extension package
4. Submit a pull request

### Extension Requirements

All extensions must:

- Include complete documentation
- Follow the [Extension Development Guidelines](https://github.com/open-webui/open-webui-extensions/docs/creating_extensions.md)
- Use semantic versioning
- Be compatible with the latest Open WebUI version
- Pass basic security checks

## API Usage

The marketplace provides a JSON API for integration with the Extension Manager:

- `api/v1/extensions.json`: Complete list of extensions
- `api/v1/categories.json`: Available categories
- `api/v1/featured.json`: Featured extensions

## Contributing

Contributions to the Extension Marketplace are welcome! Please read our [Contributing Guidelines](CONTRIBUTING.md) before submitting changes.

## License

This repository is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.
