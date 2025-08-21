# 🔍 HubSpot Lens

**See everything, clearly.**

Advanced HubSpot CRM data exploration with modern UI and enhanced filtering capabilities. Built as a Chrome extension to provide deep insights into your HubSpot data.

## ✨ Features

### 🔍 **Advanced Data Querying**
- **Multi-Object Support**: Query contacts, companies, deals, tickets, and custom objects
- **Smart Filtering**: Advanced operators (>, <, >=, <=, BETWEEN, IN, NOT_IN, STARTS_WITH, ENDS_WITH)
- **Dynamic Fields**: Automatic field detection and dropdown population
- **Bulk Export**: Export results to CSV or JSON formats

### 🎨 **Modern UI/UX**
- **Theme System**: Light, dark, and system theme support
- **Responsive Design**: Works on all screen sizes
- **Accessibility**: Keyboard navigation and screen reader support
- **Real-time Updates**: Live connection status and progress indicators

### 🔗 **Record Integration**
- **Record Inspector**: Deep dive into individual records
- **Association Types**: Support for all HubSpot association types (0-5)
- **Quick Actions**: Direct links to record and properties pages
- **Context Awareness**: Automatically detects current page context

### 🚀 **Performance & Reliability**
- **Chunked Loading**: Handles large datasets efficiently
- **Error Handling**: Graceful fallbacks and user-friendly error messages
- **Connection Management**: Automatic reconnection and token refresh
- **Storage Sync**: Settings persist across devices

## 🛠️ Installation

### **Chrome Extension Store (Recommended)**
1. Visit the Chrome Web Store
2. Search for "HubSpot Lens"
3. Click "Add to Chrome"
4. Grant necessary permissions

### **Manual Installation (Developer)**
1. Download or clone this repository
2. Open Chrome and navigate to `chrome://extensions/`
3. Enable "Developer mode" (top right toggle)
4. Click "Load unpacked" and select the extension folder
5. The extension icon should appear in your toolbar

## 🔧 Setup

### **First Time Setup**
1. Click the HubSpot Lens extension icon
2. Click "Connect to HubSpot" to authenticate
3. Grant necessary permissions to your HubSpot account
4. You're ready to start exploring data!

### **Required Permissions**
- **Identity**: For OAuth authentication with HubSpot
- **Storage**: To save your preferences and settings
- **Active Tab**: To interact with HubSpot pages

## 📖 Usage

### **Basic Query**
1. **Select Object Type**: Choose from contacts, companies, deals, etc.
2. **Add Fields**: Select the properties you want to retrieve
3. **Set Limit**: Choose how many records to fetch (100, 500, 1000, or all)
4. **Execute**: Click "Execute Query" to run your search

### **Advanced Filtering**
1. **Add Filters**: Click "+ Add Filter" to create filter rows
2. **Select Field**: Choose the property to filter on
3. **Choose Operator**: Select from available operators for that field type
4. **Set Value**: Enter the filter value or select from dropdown
5. **Combine**: Use AND/OR logic to combine multiple filters

### **Record Inspector**
- **On Record Pages**: Use the "Record Inspector" button in the drawer
- **From Results**: Click the "📄" button to open record details
- **Properties View**: Click the "⚙️" button to view/edit properties

### **Theme Switching**
- **Auto**: Follows your system theme preference
- **Light**: Clean, bright interface
- **Dark**: Easy on the eyes in low-light conditions
- **Toggle**: Click the theme button in the header to cycle through options

## 🎯 Supported HubSpot Objects

| Object Type | Description | Default Limit |
|-------------|-------------|---------------|
| **Contacts** | Individual people and leads | 1000 |
| **Companies** | Organizations and businesses | 1000 |
| **Deals** | Sales opportunities | 1000 |
| **Tickets** | Support cases | 1000 |
| **Custom Objects** | Your custom data models | 500 |
| **Quotes** | Sales proposals | 500 |
| **Invoices** | Billing documents | 500 |
| **Products** | Catalog items | 500 |

## 🔍 Filter Operators by Field Type

### **Text Fields**
- `EQ` - Equal to
- `CONTAINS_TOKEN` - Contains text
- `STARTS_WITH` - Begins with
- `ENDS_WITH` - Ends with
- `NOT_IN` - Not in list

### **Numeric Fields**
- `EQ` - Equal to
- `GT` - Greater than
- `LT` - Less than
- `GTE` - Greater than or equal
- `LTE` - Less than or equal
- `BETWEEN` - Within range

### **Dropdown Fields**
- `EQ` - Equal to
- `IN` - In list
- `NOT_IN` - Not in list

### **Date Fields**
- `EQ` - Equal to
- `GT` - After date
- `LT` - Before date
- `BETWEEN` - Within date range

## 🎨 Theme System

### **Light Theme**
- Clean, professional appearance
- High contrast for readability
- Perfect for well-lit environments

### **Dark Theme**
- Easy on the eyes
- Reduces eye strain
- Ideal for low-light conditions

### **System Theme**
- Automatically follows your OS preference
- Seamlessly adapts to light/dark mode changes
- Best of both worlds

## 🔧 Troubleshooting

### **Connection Issues**
- **Check Permissions**: Ensure the extension has necessary permissions
- **Reconnect**: Use the "Reconnect" button in Settings
- **Clear Cache**: Clear browser cache and cookies
- **Check HubSpot**: Verify your HubSpot account is active

### **Performance Issues**
- **Reduce Limit**: Try smaller record limits (100 instead of 1000)
- **Simplify Filters**: Remove complex filter combinations
- **Check Network**: Ensure stable internet connection

### **UI Issues**
- **Refresh Page**: Reload the HubSpot page
- **Check Theme**: Try switching themes
- **Clear Storage**: Reset extension settings if needed

## 🚀 Development

### **Project Structure**
```
hubspot-lens/
├── assets/icons/          # Extension icons
├── src/
│   ├── ui/               # CSS and styling
│   │   ├── theme.css     # Theme system
│   │   ├── components.css # Component library
│   │   └── app.css       # Main application styles
│   └── js/               # JavaScript modules
│       ├── theme.js      # Theme controller
│       └── storage.js    # Storage utilities
├── popup.html            # Extension popup
├── popup.js              # Popup logic
├── content.js            # Page injection script
├── background.js         # Background service worker
└── manifest.json         # Extension manifest
```

### **Building Icons**
1. Open `assets/icons/generate-icons.html` in a browser
2. Use the download buttons to save PNG icons
3. Replace existing icons in the `assets/icons/` folder
4. Update `manifest.json` if icon paths change

### **Adding New Features**
1. **UI Components**: Add to `src/ui/components.css`
2. **Theme Variables**: Extend `src/ui/theme.css`
3. **JavaScript**: Create modules in `src/js/`
4. **Testing**: Test on various HubSpot page types

## 📝 Changelog

### **v3.0.0 - HubSpot Lens Rebrand** 🎉
- **Rebrand**: "HubSpot Inspector" → "HubSpot Lens"
- **New Tagline**: "See everything, clearly."
- **Modern UI**: Complete redesign with CSS variables and theme system
- **Theme Support**: Light, dark, and system theme options
- **Enhanced Icons**: New lens-themed icon set
- **Improved UX**: Better accessibility and responsive design
- **Code Organization**: Modular structure with separate theme and component systems

### **v2.0.0 - Enhanced Filtering**
- Advanced filter operators for numeric and currency fields
- Dropdown value support for enumeration properties
- Association type awareness for all HubSpot objects
- Improved record inspector functionality

### **v1.0.0 - Initial Release**
- Basic HubSpot data querying
- Contact, company, and deal support
- CSV/JSON export functionality
- Simple filtering system

## 🤝 Contributing

We welcome contributions! Here's how to get started:

1. **Fork** the repository
2. **Create** a feature branch (`git checkout -b feature/amazing-feature`)
3. **Commit** your changes (`git commit -m 'Add amazing feature'`)
4. **Push** to the branch (`git push origin feature/amazing-feature`)
5. **Open** a Pull Request

### **Development Guidelines**
- Follow existing code style and patterns
- Test on multiple HubSpot page types
- Ensure accessibility compliance
- Update documentation for new features

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- **HubSpot** for their excellent API and documentation
- **Chrome Extensions** team for the powerful extension platform
- **Open Source Community** for inspiration and tools

## 📞 Support

- **Issues**: [GitHub Issues](https://github.com/your-repo/hubspot-lens/issues)
- **Discussions**: [GitHub Discussions](https://github.com/your-repo/hubspot-lens/discussions)
- **Documentation**: [Wiki](https://github.com/your-repo/hubspot-lens/wiki)

---

**Made with ❤️ for the HubSpot community**

*HubSpot Lens - See everything, clearly.*
