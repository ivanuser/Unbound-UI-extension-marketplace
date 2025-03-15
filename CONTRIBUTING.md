# Contributing to the Open WebUI Extension Marketplace

Thank you for your interest in contributing to the Open WebUI Extension Marketplace! This guide will help you get started with contributing extensions to the marketplace.

## Table of Contents

- [Getting Started](#getting-started)
- [Extension Requirements](#extension-requirements)
- [Submitting an Extension](#submitting-an-extension)
- [Extension Manifest](#extension-manifest)
- [Quality Guidelines](#quality-guidelines)
- [Review Process](#review-process)
- [Updating Extensions](#updating-extensions)
- [Code of Conduct](#code-of-conduct)

## Getting Started

1. Fork the [Open WebUI Extension Marketplace](https://github.com/open-webui/open-webui-extension-marketplace) repository
2. Clone your fork to your local machine
3. Create a branch for your changes
4. Make your changes following this guide
5. Submit a pull request

## Extension Requirements

To be accepted into the marketplace, extensions must:

1. **Follow the Extension Structure**: Use the correct directory structure and file formats
2. **Include Documentation**: Provide clear and comprehensive documentation
3. **Use Semantic Versioning**: Follow [Semantic Versioning](https://semver.org/) for version numbers
4. **Be Compatible**: Work with the specified Open WebUI version
5. **Pass Security Review**: Not contain malicious code or severe security vulnerabilities
6. **Include Preview**: Provide at least one screenshot or preview image
7. **Declare Permissions**: Clearly state what permissions the extension requires

## Submitting an Extension

To submit an extension to the marketplace:

1. Create a directory in `extensions/` with your extension's ID (lowercase, hyphenated)
2. Add the required files:
   - `manifest.json`: Extension metadata (see [Extension Manifest](#extension-manifest))
   - `README.md`: Documentation and usage instructions
   - `preview.png`: At least one screenshot (min 800x600px, max 1.5MB)
   - `releases/`: Directory containing release files
     - `latest.json`: Latest version information
     - `[version].zip`: Packaged extension file for each version

3. Update the appropriate category file in `categories/`
4. Submit a pull request with your changes

## Extension Manifest

The `manifest.json` file describes your extension and must include:

```json
{
  "id": "your-extension-id",
  "name": "Your Extension Name",
  "description": "A brief description of your extension",
  "version": "1.0.0",
  "author": "Your Name",
  "license": "MIT",
  "type": "ui",
  "tags": ["tag1", "tag2"],
  "category": "category-id",
  "compatibility": {
    "openWebUIVersion": ">=0.1.0"
  },
  "repository": "https://github.com/username/repo",
  "entryPoint": "__init__.py",
  "config": {
    // Extension-specific configuration
  },
  "dependencies": [],
  "permissions": []
}
```

## Quality Guidelines

To ensure a high-quality marketplace:

1. **Documentation**: Provide clear installation and usage instructions
2. **Testing**: Test your extension thoroughly on the latest Open WebUI version
3. **Performance**: Extensions should not significantly impact Open WebUI performance
4. **Security**: Follow security best practices, especially with file and network access
5. **Maintenance**: Be responsive to issues and keep your extension updated

## Review Process

After submitting a pull request:

1. Automated checks will verify your extension structure and manifest
2. A reviewer will manually check your extension for quality and security
3. You may be asked to make changes or address issues
4. Once approved, your extension will be merged and published to the marketplace

The review process typically takes 3-5 business days.

## Updating Extensions

To update an existing extension:

1. Update your extension's code in your fork
2. Update the `version` in your `manifest.json`
3. Add a new entry to the `changelog` array
4. Add a new version ZIP file to the `releases/` directory
5. Update `releases/latest.json` to point to the new version
6. Submit a pull request

## Code of Conduct

All contributors are expected to follow our [Code of Conduct](CODE_OF_CONDUCT.md). Please be respectful and constructive in your interactions.

## Need Help?

If you need assistance or have questions, please:

- Open an issue on the repository
- Join our [Discord community](https://discord.gg/openwebui)
- Check our [documentation](https://github.com/open-webui/open-webui-extensions/docs)

Thank you for contributing to the Open WebUI ecosystem!
