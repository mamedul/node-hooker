# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/ "null"), and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html "null").

## \[v2025.09.07-3\] - 2025-09-07

### Updated & Changed
- ** Preview**


## \[v2025.09.07-2\] - 2025-09-07

### Updated & Changed
- ** Documentations**
- ** Previews**


## \[v2025.09.07-1\] - 2025-09-07

### Added
- **Browser Compatibility:** Implemented a Rollup build process to generate UMD bundles, allowing the library to be used directly in browsers.
- **Production Builds:** Added a minified version (`.min.js`) for optimal performance in production environments.
- **Build Scripts:** Included `npm run build` for a standard development build and `npm run build:minify` for a minified production build.



## \[v2025.09.07\] - 2025-09-07

### Updated & Changed
- ** Documentations only**

    
## \[v2025.09.06\] - 2025-09-06

### Added

*   **Initial Release:** First public version of `node-hooker`.
    
*   **Full WordPress Hook API Parity:** Implemented the complete WordPress hooks system for Node.js.
    
*   **Core Architecture:**
    
    *   `Hook.js` class to manage individual hooks.
        
    *   `Hooker` class to orchestrate all actions and filters.
        
    *   A default singleton instance is exported for ease of use, and the `Hooker` class is exported for creating isolated instances.
        
*   **Core API Methods:**
    
    *   `add`, `remove` for generic hook management.
        
    *   Action Functions: `add_action`, `remove_action`, `do_action`, `do_action_ref_array`, `remove_all_actions`.
        
    *   Filter Functions: `add_filter`, `remove_filter`, `apply_filters`, `apply_filters_ref_array`, `remove_all_filters`.
        
    *   Inspection Functions: `has_action`, `has_filter`, `did_action`, `current_action`, `current_filter`, `doing_action`, `doing_filter`.
        
*   **Features:** Support for callback priorities and defining the number of accepted arguments.
    
*   **Project Files:**
    
    *   Comprehensive `README.md` for documentation.
        
    *   `package.json` for NPM distribution.
        
    *   A full test suite (`test.js`) ensuring all functions work as expected.
