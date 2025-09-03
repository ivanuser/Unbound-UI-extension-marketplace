# UnboundUI Extension Marketplace

<p align="center">
  <img src="assets/images/extensplace-logo.png" alt="UnboundUI Extension Marketplace" width="300" />
</p>

## Overview

The UnboundUI Extension Marketplace is a centralized repository for discovering, distributing, and managing extensions for UnboundUI. This repository serves as both the backend API and extension registry for the marketplace, providing themes, tools, libraries, code interpreters, and prompt templates to enhance your UnboundUI experience.

## Features

- **Extension Discovery**: Browse and search for extensions by category and type
- **Quality Assurance**: All extensions undergo automated testing for security, performance, and compatibility
- **Detailed Information**: View comprehensive information about each extension including previews and documentation
- **Versioning**: Manage extension versions and updates with semantic versioning
- **Categorization**: Organized by function and use case (themes, tools, libraries, code-interpreters, prompt-templates)
- **Community-Driven**: Community ratings, reviews, and contributions

## Supported Extension Types

- **Themes**: Visual customization and UI styling
- **Tools**: Functional extensions that add new capabilities
- **Libraries**: Reusable components and utilities for other extensions
- **Code Interpreters**: Language-specific code execution environments
- **Prompt Templates**: Pre-built prompts and conversation starters

## Repository Structure

```
unboundui-extension-marketplace/
├── api/                        # Marketplace API endpoints
│   └── v1/                     # API version 1
│       ├── extensions.json     # Extensions listing
│       ├── categories.json     # Categories listing
│       ├── featured.json       # Featured extensions
│       └── search.json         # Search API
├── extensions/                 # Extension directories
│   └── {extension-id}/         # Individual extension
│       ├── manifest.json       # Extension metadata (UnboundUI format)
│       ├── README.md           # Extension documentation
│       ├── preview.png         # Extension preview image
│       ├── icon.png           # Extension icon (256x256px)
│       └── src/               # Extension source files
│           ├── main file      # Main extension file (theme.css, index.js, etc.)
│           └── assets/        # Additional assets
├── assets/                    # Marketplace assets
├── tests/                     # Quality assurance tests
└── index.json                # Marketplace index
```

## Extension Manifest Format

UnboundUI extensions use a comprehensive manifest format:

```json
{
  "id": "extension-unique-id",
  "title": "Extension Display Name",
  "description": "Detailed description of the extension functionality",
  "version": "1.0.0",
  "author": "Author Name",
  "email": "author@example.com",
  "license": "MIT",
  "type": "theme|tool|library|code-interpreter|prompt-templates",
  "category": "ui|productivity|development|ai|integration",
  "tags": ["tag1", "tag2", "tag3"],
  "compatibility": {
    "unboundUIVersion": ">=1.0.0"
  },
  "repository": "https://github.com/user/extension-repo",
  "mainFile": "src/main.js|theme.css|index.ts",
  "previewImageUrl": "preview.png",
  "icon": "icon.png",
  "keywords": ["unboundui", "extension", "keyword"],
  "permissions": {
    "filesystem": { "read": ["workspace"] },
    "network": false,
    "system": { "notifications": true }
  },
  "dependencies": {
    "unboundui": ">=1.0.0"
  },
  "downloads": 0,
  "averageRating": 0,
  "ratingCount": 0
}
```

## Quality Standards

All extensions in this marketplace undergo automated testing using the UnboundUI Extension Testing Framework, which validates:

- **Manifest Validation**: Required fields, format compliance, version compatibility
- **Security Testing**: Permission audit, code scanning, XSS prevention
- **Performance Testing**: Bundle size, load time, memory usage
- **Compatibility Testing**: UnboundUI version compatibility, browser support
- **Functional Testing**: Extension initialization, API integration, error handling

Extensions must achieve a quality score of 80+ to be included in the marketplace.

## Contributing

### For Extension Authors

1. **Develop Your Extension**: Follow the [UnboundUI Extension Development Guide](https://docs.unboundui.com/extensions/development)
2. **Test Your Extension**: Use the UnboundUI testing framework to ensure quality
3. **Create a Pull Request**: Submit your extension following our guidelines
4. **Review Process**: Our automated systems and maintainers will review your submission

### Guidelines

- Extensions must pass all automated quality tests
- Include comprehensive documentation and examples
- Provide high-quality preview images and icons
- Follow security best practices
- Use semantic versioning for releases
- Include proper license information

### Submission Process

1. Fork this repository
2. Create a new directory under `extensions/` with your extension ID
3. Add your extension files following the structure above
4. Ensure your manifest.json follows the UnboundUI format
5. Test your extension with the UnboundUI testing tools
6. Submit a pull request with a clear description

## API Documentation

The marketplace provides RESTful API endpoints for integration:

- `GET /api/v1/extensions.json` - List all extensions
- `GET /api/v1/categories.json` - List extension categories
- `GET /api/v1/featured.json` - Get featured extensions
- `GET /api/v1/search.json?q={query}` - Search extensions

## Local Development

```bash
# Clone the repository
git clone https://github.com/ivanuser/Unbound-UI-extension-marketplace.git

# Test extensions using UnboundUI tools
cd UnboundUI
npm run test-marketplace

# Test specific extension
npm run test-extension extensions/your-extension-id
```

## Automation & CI/CD (v2.0 Features)

### GitHub Webhooks Integration

The marketplace now supports automated extension deployment through GitHub webhooks:

#### Setup for Extension Developers

1. **Copy CI/CD Template**: Use the provided GitHub Actions workflow template
   ```bash
   # Copy from UnboundUI repository
   cp templates/extension-ci-workflow.yml .github/workflows/ci.yml
   ```

2. **Configure Webhooks**: Set up webhooks in your extension repository
   - **Payload URL**: `https://your-unboundui-instance.com/api/webhooks/github`
   - **Content Type**: `application/json`  
   - **Events**: Push, Release
   - **Secret**: Contact your UnboundUI administrator for webhook secret

3. **Automated Processing**: Extensions automatically update when you:
   - Push changes to extensions/ directory
   - Create new releases
   - Update manifest.json files

#### CI/CD Pipeline Features

- **Extension Detection**: Automatically detects changed extensions in commits
- **Schema Validation**: Validates manifest.json against UnboundUI schema
- **Security Scanning**: Checks for vulnerabilities and malicious content
- **Performance Testing**: Validates extension size and optimization
- **Multi-Extension Support**: Processes multiple extensions in parallel
- **Deployment**: Automatically deploys passing extensions

### Extension Testing Framework

Comprehensive validation system for extension quality:

#### Test Categories

- **Manifest Validation**: Schema compliance and required field verification
- **File Structure**: Referenced file existence and accessibility checks  
- **Security Analysis**: Permission verification and content scanning
- **Compatibility Testing**: UnboundUI version compatibility validation
- **Performance Metrics**: Size limits and optimization recommendations

#### Quality Gates

Extensions must pass all tests to be accepted:
- ✅ **Manifest Schema**: Valid JSON structure with required fields
- ✅ **File References**: All referenced files exist and are accessible  
- ✅ **Security Check**: No dangerous permissions or suspicious content
- ✅ **Size Limits**: Extension size under 50MB limit
- ✅ **Version Format**: Semantic versioning compliance

### Developer Portal Integration

Enhanced developer experience with automated tools:

#### GitHub OAuth Integration
- **Secure Authentication**: Link your GitHub account to UnboundUI
- **Repository Connection**: Automatically link extensions to GitHub repos
- **Sync Management**: Control when extensions update from repository changes

#### Analytics Dashboard
- **Download Metrics**: Track extension popularity and usage
- **Performance Data**: Monitor extension load times and errors  
- **User Feedback**: Access ratings and reviews from users
- **Update Statistics**: See deployment success rates and CI/CD metrics

### Extension Schema v2.0

Enhanced manifest format with automation support:

```json
{
  "id": "your-extension",
  "title": "Extension Title",
  "description": "Extension description (min 10 chars)",
  "version": "1.0.0",
  "author": "Your Name",
  "type": "theme|tool|library|code-interpreter|prompt-template",
  "license": "MIT",
  "repository": "https://github.com/username/repo",
  "compatibility": {
    "unboundui": ">=2.0.0"
  },
  "permissions": ["ui.modify", "storage.read"],
  "build": {
    "scripts": {
      "build": "npm run build"
    },
    "outputDir": "dist"
  },
  "testing": {
    "testCommand": "npm test",
    "coverage": true
  }
}
```

#### Schema Enhancements
- **Repository Integration**: GitHub repository linking for automated updates
- **Build Configuration**: Custom build scripts and output directories
- **Permission System**: Granular permission declarations
- **Testing Setup**: Automated test execution configuration
- **Compatibility Matrix**: Detailed version compatibility specifications

### Automated Quality Assurance

Every extension submission undergoes automated validation:

#### Pre-Submission Checks
- **Syntax Validation**: JSON manifest parsing and structure verification
- **File Integrity**: Verify all referenced files are present and valid
- **Security Scanning**: Check for potentially dangerous code or permissions
- **Performance Analysis**: Size optimization and loading time assessment

#### Continuous Monitoring  
- **Update Validation**: Re-test extensions when dependencies change
- **Security Alerts**: Notify developers of newly discovered vulnerabilities
- **Performance Tracking**: Monitor extension impact on UnboundUI performance
- **Usage Analytics**: Track adoption rates and user satisfaction

### Migration from v1.0

#### For Existing Extensions
1. **Update Manifest**: Add new v2.0 schema fields (repository, permissions, etc.)
2. **GitHub Integration**: Link your extension to a GitHub repository
3. **CI/CD Setup**: Implement the provided GitHub Actions workflow
4. **Testing**: Use the new automated testing framework

#### Backward Compatibility
- v1.0 manifests continue to work but with limited automation features
- Gradual migration path with automated schema upgrade assistance
- Documentation and tooling to ease transition process

## Community

- **Documentation**: [UnboundUI Extension Docs](https://docs.unboundui.com/extensions)
- **GitHub Issues**: [Report bugs and request features](https://github.com/ivanuser/Unbound-UI-extension-marketplace/issues)
- **Discussions**: [Community discussions](https://github.com/ivanuser/Unbound-UI-extension-marketplace/discussions)
- **Discord**: [Join our community](https://discord.gg/unboundui)

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## Acknowledgments

- UnboundUI development team for the extensible architecture
- Extension authors and contributors
- Community members providing feedback and testing

---

**Note**: This marketplace is specifically designed for UnboundUI extensions. For the best experience, ensure you're running UnboundUI v1.0.0 or higher.
