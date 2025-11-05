import React, { useState, useEffect, useRef } from 'react';
import { saveAs } from 'file-saver';
import { format } from 'prettier';
import parserHTML from 'prettier/parser-html';
import parserCSS from 'prettier/parser-postcss';
import parserBabel from 'prettier/parser-babel';
import DOMPurify from 'dompurify';
import Split from 'react-split';
import { EditorPane } from './components/EditorPane';
import { Preview } from './components/Preview';
import { ConsoleOutput } from './components/ConsoleOutput';
import { Navbar } from './components/Navbar';
import { SettingsPanel } from './components/SettingsPanel';
import { TemplateSelector } from './components/TemplateSelector';
import { Footer } from './components/Footer';
import { PreviewModes } from './components/PreviewModes';
import { CodeDiffViewer } from './components/CodeDiffViewer';
import { LibraryPicker } from './components/LibraryPicker';
import { SnippetLibrary } from './components/SnippetLibrary';
import { LanguageSelector } from './components/LanguageSelector';
import { templates } from './utils/templates';
import { minifyAll } from './utils/minifier';
import { exportAsScreenshot, exportAsPDF } from './utils/exportFormats';
import './styles/custom.css';
import './styles/modern-ui.css';
import './styles/components.css';
import './styles/languageSelector.css';

// All available languages
const ALL_LANGUAGES = [
  { label: 'HTML', lang: 'html', icon: 'html5' },
  { label: 'CSS', lang: 'css', icon: 'css3' },
  { label: 'JS', lang: 'javascript', icon: 'js' },
  { label: 'Java', lang: 'java', icon: 'java' },
  { label: 'PHP', lang: 'php', icon: 'php' },
];

// Get editor tabs based on selected languages
const getEditorTabs = (selectedLanguages) => {
  return ALL_LANGUAGES.filter(lang => selectedLanguages.includes(lang.lang));
};

// Theme application function (moved outside component to avoid initialization issues)
const applyTheme = (isDark, setEditorSettings) => {
  const root = document.documentElement;
  if (isDark) {
    root.classList.add('dark');
    root.style.colorScheme = 'dark';
    document.body.classList.add('dark');
  } else {
    root.classList.remove('dark');
    root.style.colorScheme = 'light';
    document.body.classList.remove('dark');
  }
  // Update Monaco editor theme if setEditorSettings is provided
  if (setEditorSettings) {
    setEditorSettings(prev => ({
      ...prev,
      theme: isDark ? 'vs-dark' : 'vs-light'
    }));
  } else {
    // Fallback for initial theme application before setEditorSettings is available
    const monaco = window.monaco;
    if (monaco) {
      monaco.editor.setTheme(isDark ? 'vs-dark' : 'vs-light');
    }
  }
};

export default function App() {
  // Initialize theme state
  const [isDarkMode, setIsDarkMode] = useState(() => {
    // Check for saved theme first, then system preference
    const savedTheme = localStorage.getItem('livecode-theme');
    const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
    const initialDarkMode = savedTheme ? savedTheme === 'dark' : prefersDark;
    
    // Apply initial theme (without editor settings for now)
    applyTheme(initialDarkMode);
    
    return initialDarkMode;
  });
  
  // Set up theme change listener after component mounts
  useEffect(() => {
    // Apply theme with editor settings
    applyTheme(isDarkMode, setEditorSettings);
    
    // Listen for system theme changes
    const darkModeMediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
    const handleSystemThemeChange = (e) => {
      if (!localStorage.getItem('livecode-theme')) {
        const newMode = e.matches;
        setIsDarkMode(newMode);
        applyTheme(newMode, setEditorSettings);
      }
    };
    
    darkModeMediaQuery.addListener(handleSystemThemeChange);
    
    // Cleanup listener on component unmount
    return () => darkModeMediaQuery.removeListener(handleSystemThemeChange);
  }, [isDarkMode]);
  // Editor content state
  const [activeTab, setActiveTab] = useState('html');
  const [html, setHtml] = useState('<h1>Hello, LiveCode!</h1>\n<p>Start coding here!</p>');
  const [css, setCss] = useState('body {\n  font-family: sans-serif;\n  margin: 0;\n  padding: 20px;\n}\n\nh1 {\n  color: #333;\n}');
  const [js, setJs] = useState('console.log("Hello from LiveCode!");');
  const [java, setJava] = useState(`public class Main {
    public static void main(String[] args) {
        System.out.println("Hello, LiveCode!");
    }
}`);
  const [php, setPhp] = useState(`<?php
echo "Hello, LiveCode!";
?>`);

  // Editor settings
  const [editorSettings, setEditorSettings] = useState({
    fontSize: 14,
    tabSize: 2,
    wordWrap: 'on',
    minimap: false,
    lineNumbers: true,
    theme: isDarkMode ? 'vs-dark' : 'vs-light',
    autoFormat: false,
    enableLinting: true
  });

  // UI State
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [isTemplateOpen, setIsTemplateOpen] = useState(false);
  const [isMobileView, setIsMobileView] = useState(window.innerWidth < 768);
  const [previewMode, setPreviewMode] = useState({
    name: 'Desktop',
    width: '100%',
    height: '100%',
    icon: 'fa-desktop'
  });
  
  // Calculate preview container styles based on selected mode
  const getPreviewContainerStyle = () => {
    if (previewMode.name === 'Desktop') {
      return {
        width: '100%',
        height: '100%',
        margin: 0,
        padding: 0,
        border: 'none',
        borderRadius: 0,
        boxShadow: 'none',
        overflow: 'hidden',
        position: 'relative',
        zIndex: 1
      };
    }
    
    return {
      width: previewMode.width,
      height: previewMode.height,
      margin: '0 auto',
      overflow: 'hidden',
      border: '1px solid var(--border-color)',
      borderRadius: '8px',
      boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)',
      position: 'relative',
      zIndex: 1
    };
  };
  
  const previewContainerStyle = getPreviewContainerStyle();

  const [selectedLibraries, setSelectedLibraries] = useState([]);
  const [isLibraryPickerOpen, setIsLibraryPickerOpen] = useState(false);
  const [isSnippetLibraryOpen, setIsSnippetLibraryOpen] = useState(false);
  const [isDiffViewerOpen, setIsDiffViewerOpen] = useState(false);
  const [diffVersions, setDiffVersions] = useState({ old: null, new: null });
  const [lintErrors, setLintErrors] = useState([]);
  
  // Language selector state
  const [selectedLanguages, setSelectedLanguages] = useState(() => {
    const saved = localStorage.getItem('selectedLanguages');
    if (saved) {
      return JSON.parse(saved);
    }
    // Default: HTML, CSS, JS
    return ['html', 'css', 'javascript'];
  });
  const [isLanguageSelectorOpen, setIsLanguageSelectorOpen] = useState(false);
  
  // Get editor tabs based on selected languages
  const editorTabs = getEditorTabs(selectedLanguages);
  
  // Ensure activeTab is valid when languages change
  useEffect(() => {
    if (!selectedLanguages.includes(activeTab)) {
      // Switch to first available language
      setActiveTab(selectedLanguages[0] || 'html');
    }
  }, [selectedLanguages]);
  
  // Save selected languages to localStorage
  useEffect(() => {
    localStorage.setItem('selectedLanguages', JSON.stringify(selectedLanguages));
  }, [selectedLanguages]);
  
  // Version history state
  const [versionHistory, setVersionHistory] = useState(() => {
    const savedHistory = localStorage.getItem('versionHistory');
    return savedHistory ? JSON.parse(savedHistory) : [];
  });
  const [currentVersionIndex, setCurrentVersionIndex] = useState(-1);
  const [showVersionHistory, setShowVersionHistory] = useState(false);
  const [consoleLogs, setConsoleLogs] = useState([]);
  // Start console closed by default; open when logs arrive
  const [isConsoleOpen, setIsConsoleOpen] = useState(false);
  const [pingResult, setPingResult] = useState('');

  // Refs
  const iframeRef = useRef(null);

  // Create sanitized source document for preview with external libraries
  const createSrcDoc = (htmlContent = html, cssContent = css, jsContent = js) => {
    // Build library imports
    const cssLibraries = selectedLibraries
      .filter(lib => lib.type === 'css')
      .map(lib => `<link rel="stylesheet" href="${lib.cdn}">`)
      .join('\n    ');
    
    const scriptLibraries = selectedLibraries
      .filter(lib => lib.type === 'script')
      .map(lib => `<script src="${lib.cdn}"></script>`)
      .join('\n    ');

    // Add dark mode class and styles
    const isDark = isDarkMode;
    const darkModeStyles = `
      <style id="dark-mode-styles">
        :root {
          --bg-color: ${isDark ? '#1a202c' : '#ffffff'};
          --text-color: ${isDark ? '#f7fafc' : '#1a202c'};
          --border-color: ${isDark ? '#4a5568' : '#e2e8f0'};
          --console-bg: ${isDark ? '#2d3748' : '#f7fafc'};
          --console-text: ${isDark ? '#f9fafb' : '#1a202c'};
          --console-border: ${isDark ? '#4b5563' : '#e2e8f0'};
        }
        
        body {
          background-color: var(--bg-color);
          color: var(--text-color);
          transition: background-color 0.3s, color 0.3s;
          margin: 0;
          padding: 1rem;
          min-height: 100vh;
        }
        
        /* In-iframe console removed: parent app receives console messages via postMessage */
      </style>
    `;
    
    const htmlClass = isDark ? 'class="dark"' : '';
    
    return `
      <!DOCTYPE html>
      <html ${htmlClass}>
      <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>LiveCode Preview</title>
        ${cssLibraries}
        ${darkModeStyles}
        <style>
          ${cssContent}
        </style>
      </head>
      <body class="${isDark ? 'dark' : ''}">
        ${htmlContent}
  ${scriptLibraries}
        <script>
          // Override console methods to send messages to parent window
          const originalConsole = {
            log: console.log,
            error: console.error,
            warn: console.warn,
            info: console.info
          };
          
          function logToConsole(type, ...args) {
            // Convert all arguments to strings
            const messages = args.map(arg => 
              typeof arg === 'object' ? JSON.stringify(arg, null, 2) : String(arg)
            );
            
            // Send message to parent window
            window.parent.postMessage({
              type: 'console',
              method: type,
              data: messages.length === 1 ? messages[0] : messages
            }, '*');
            
            // Also log to the original console
            originalConsole[type](...args);
          }
          
          console.log = (...args) => logToConsole('log', ...args);
          console.error = (...args) => logToConsole('error', ...args);
          console.warn = (...args) => logToConsole('warn', ...args);
          console.info = (...args) => logToConsole('info', ...args);
          
          // Handle uncaught errors
          window.onerror = function(message, source, lineno, colno, error) {
            const errorMessage = message + ' (line: ' + lineno + ', col: ' + colno + ')';
            window.parent.postMessage({
              type: 'console',
              method: 'error',
              data: [errorMessage]
            }, '*');
            return true; // Prevent default error handling
          };
          
          // Handle unhandled promise rejections
          window.onunhandledrejection = function(event) {
            const errorMessage = 'Unhandled promise rejection: ' + event.reason;
            window.parent.postMessage({
              type: 'console',
              method: 'error',
              data: [errorMessage]
            }, '*');
          };
          
          // Execute the user's JavaScript
          document.addEventListener('DOMContentLoaded', () => {
            try {
              ${DOMPurify.sanitize(jsContent)}
            } catch (error) {
              console.error('Error in JavaScript:', error);
            }
          });
        </script>
      </body>
      </html>`;
  };
  
  // Handle editor content changes
  const getValue = () => {
    if (activeTab === 'html') return html;
    if (activeTab === 'css') return css;
    if (activeTab === 'java') return java;
    if (activeTab === 'php') return php;
    return js;
  };

  // Debounce timers for auto-save and preview update
  const autoSaveTimerRef = useRef(null);
  const previewUpdateTimerRef = useRef(null);
  const [debouncedHtml, setDebouncedHtml] = useState(html);
  const [debouncedCss, setDebouncedCss] = useState(css);
  const [debouncedJs, setDebouncedJs] = useState(js);
  
  // Update preview content with debounce
  useEffect(() => {
    if (previewUpdateTimerRef.current) {
      clearTimeout(previewUpdateTimerRef.current);
    }
    
    previewUpdateTimerRef.current = setTimeout(() => {
      setDebouncedHtml(html);
      setDebouncedCss(css);
      setDebouncedJs(js);
    }, 1000); // 1 second delay for preview update
    
    return () => {
      if (previewUpdateTimerRef.current) {
        clearTimeout(previewUpdateTimerRef.current);
      }
    };
  }, [html, css, js]);
  
  const setValue = (value) => {
    if (activeTab === 'html') setHtml(value || '');
    else if (activeTab === 'css') setCss(value || '');
    else if (activeTab === 'java') setJava(value || '');
    else if (activeTab === 'php') setPhp(value || '');
    else setJs(value || '');
    
    // Clear previous timer if it exists
    if (autoSaveTimerRef.current) {
      clearTimeout(autoSaveTimerRef.current);
    }
    
    // Set a new timer for auto-save (3 seconds delay)
    autoSaveTimerRef.current = setTimeout(() => {
      addToVersionHistory();
    }, 3000);
  };

  // Version history management
  const addToVersionHistory = () => {
    // Only add to history if there are changes
    const newVersion = { html, css, js, java, php, timestamp: new Date().toISOString() };

    // Remove any future versions if we're not at the latest version
    const updatedVersions = versionHistory.slice(0, currentVersionIndex + 1);

    // Add the new version and update the current index
    const newHistory = [...updatedVersions, newVersion];
    setVersionHistory(newHistory);
    setCurrentVersionIndex(updatedVersions.length);
    
    // Save to localStorage
    localStorage.setItem('versionHistory', JSON.stringify(newHistory));
  };

  const loadVersion = (index) => {
    if (index >= 0 && index < versionHistory.length) {
      const version = versionHistory[index];
      setHtml(version.html || '');
      setCss(version.css || '');
      setJs(version.js || '');
      setJava(version.java || '');
      setPhp(version.php || '');
      setCurrentVersionIndex(index);
    }
  };

  // Console message handler
  useEffect(() => {
    const handleMessage = (event) => {
      if (event.data && event.data.type === 'console') {
        const { method, data } = event.data;
        // Ensure we're working with an array of messages
        const messages = Array.isArray(data) ? data : [data];
        setConsoleLogs(prev => [...prev, { 
          type: method, 
          data: messages.join(' ') 
        }]);
      }
    };

    window.addEventListener('message', handleMessage);
    return () => window.removeEventListener('message', handleMessage);
  }, []);

  // Responsive layout handler
  useEffect(() => {
    const handleResize = () => {
      setIsMobileView(window.innerWidth < 768);
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // Format code using Prettier
  const formatCode = () => {
    try {
      let formattedCode;

      if (activeTab === 'html') {
        formattedCode = format(html, { parser: 'html' });
        setHtml(formattedCode);
      } else if (activeTab === 'css') {
        formattedCode = format(css, { parser: 'css' });
        setCss(formattedCode);
      } else if (activeTab === 'java') {
        // Java doesn't have a Prettier parser, show message
        setConsoleLogs(prev => [...prev, { 
          type: 'info', 
          data: ['Java formatting is not available. Use your IDE for Java formatting.'] 
        }]);
        return;
      } else if (activeTab === 'php') {
        // PHP doesn't have a Prettier parser, show message
        setConsoleLogs(prev => [...prev, { 
          type: 'info', 
          data: ['PHP formatting is not available. Use your IDE for PHP formatting.'] 
        }]);
        return;
      } else {
        formattedCode = format(js, { parser: 'babel' });
        setJs(formattedCode);
      }
    } catch (error) {
      console.error('Formatting error:', error);
      setConsoleLogs(prev => [...prev, { 
        type: 'error', 
        data: [`Formatting error: ${error.message}`] 
      }]);
    }
  };

  // Apply template
  const applyTemplate = (templateId) => {
    const template = templates.find(t => t.id === templateId);
    if (template) {
      addToVersionHistory(); // Save current state before applying template
      setHtml(template.html);
      setCss(template.css);
      setJs(template.js);
      // If template defines libraries, apply them to the library picker
      if (template.libraries) {
        setSelectedLibraries(template.libraries);
      }
      // If template defines preferred languages/tabs, apply them
      if (template.languages) {
        setSelectedLanguages(template.languages);
      }
      setIsTemplateOpen(false);
    }
  };

  // Export as ZIP
  const exportAsZip = async () => {
    // Using JSZip
    const createSrcDoc = (customHtml = null, customCss = null, customJs = null) => {
      // ...
      const htmlContent = customHtml || html;
      const cssContent = customCss || css;
      const jsContent = customJs || js;
      
      return `<!DOCTYPE html>
      <html lang="en" class="${isDarkMode ? 'dark' : ''}">
      <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>LiveCode Preview</title>
        <style>
          :root {
            --bg-color: ${isDarkMode ? '#1a202c' : '#ffffff'};
            --text-color: ${isDarkMode ? '#f7fafc' : '#1a202c'};
            --border-color: ${isDarkMode ? '#4a5568' : '#e2e8f0'};
          }
          
          body {
            background-color: var(--bg-color);
            color: var(--text-color);
            transition: background-color 0.3s, color 0.3s;
            margin: 0;
            padding: 1rem;
            min-height: 100vh;
          }
          
          ${cssContent}
          
          /* Console styles */
          #console {
            position: fixed;
            bottom: 0;
            left: 0;
            right: 0;
            height: 200px;
            background-color: ${isDarkMode ? '#2d3748' : '#f7fafc'};
            border-top: 1px solid var(--border-color);
            overflow-y: auto;
            padding: 0.5rem;
            font-family: monospace;
            font-size: 14px;
          }
          
          .console-log { color: ${isDarkMode ? '#a0aec0' : '#4a5568'}; }
          .console-error { color: #f56565; }
          .console-warn { color: #ecc94b; }
          .console-info { color: #63b3ed; }
        </style>
      </head>
      <body class="${isDarkMode ? 'dark' : ''}">
        ${htmlContent}
        <script>
          // Override console methods to display in the console div
          const originalConsole = {
            log: console.log,
            error: console.error,
            warn: console.warn,
            info: console.info
          };
          
          const consoleDiv = document.createElement('div');
          consoleDiv.id = 'console';
          document.body.appendChild(consoleDiv);
          
          function logToConsole(type, ...args) {
            const message = args.map(arg => 
              typeof arg === 'object' ? JSON.stringify(arg, null, 2) : String(arg)
            ).join(' ');
            
            const logEntry = document.createElement('div');
            logEntry.className = 'console-' + type;
            logEntry.textContent = message;
            consoleDiv.appendChild(logEntry);
            consoleDiv.scrollTop = consoleDiv.scrollHeight;
            
            // Call original console method
            originalConsole[type].apply(console, args);
          }
          
          console.log = (...args) => logToConsole('log', ...args);
          console.error = (...args) => logToConsole('error', ...args);
          console.warn = (...args) => logToConsole('warn', ...args);
          console.info = (...args) => logToConsole('info', ...args);
          
          // Handle uncaught errors
          window.onerror = function(message, source, lineno, colno, error) {
            logToConsole('error', message);
            return false;
          };
          
          // Handle unhandled promise rejections
          window.onunhandledrejection = function(event) {
            logToConsole('error', event.reason);
          };
          
          ${jsContent}
        </script>
      </body>
      </html>`;
    };
    
    const content = await zip.generateAsync({ type: 'blob' });
    saveAs(content, 'livecode-export.zip');
  };

  // Clear console
  const clearConsole = () => {
    setConsoleLogs([]);
    setIsConsoleOpen(false);
  };

  // Auto-open console when logs arrive
  useEffect(() => {
    if (consoleLogs && consoleLogs.length > 0) {
      setIsConsoleOpen(true);
    }
  }, [consoleLogs]);

  // Minify code
  const minifyCode = async () => {
    try {
      setPingResult('Minifying code...');
      const minified = await minifyAll(html, css, js);
      setHtml(minified.html);
      setCss(minified.css);
      setJs(minified.js);
      setPingResult('Code minified successfully!');
      setTimeout(() => setPingResult(''), 3000);
    } catch (error) {
      console.error('Minification error:', error);
      setPingResult('Error minifying code');
      setTimeout(() => setPingResult(''), 3000);
    }
  };

  // Export as screenshot
  const handleExportScreenshot = async () => {
    try {
      if (iframeRef.current) {
        await exportAsScreenshot(iframeRef.current);
        setPingResult('Screenshot exported!');
        setTimeout(() => setPingResult(''), 3000);
      }
    } catch (error) {
      console.error('Screenshot export error:', error);
      alert('Failed to export screenshot');
    }
  };

  // Export as PDF
  const handleExportPDF = async () => {
    try {
      if (iframeRef.current) {
        await exportAsPDF(iframeRef.current);
        setPingResult('PDF exported!');
        setTimeout(() => setPingResult(''), 3000);
      }
    } catch (error) {
      console.error('PDF export error:', error);
      alert('Failed to export PDF');
    }
  };

  // Show code diff
  const showCodeDiff = (oldVersionIndex, newVersionIndex) => {
    if (oldVersionIndex >= 0 && oldVersionIndex < versionHistory.length &&
        newVersionIndex >= 0 && newVersionIndex < versionHistory.length) {
      const oldVersion = versionHistory[oldVersionIndex];
      const newVersion = versionHistory[newVersionIndex];
      const oldCode = `${oldVersion.html}\n/* CSS */\n${oldVersion.css}\n/* JS */\n${oldVersion.js}`;
      const newCode = `${newVersion.html}\n/* CSS */\n${newVersion.css}\n/* JS */\n${newVersion.js}`;
      setDiffVersions({ old: oldCode, new: newCode });
      setIsDiffViewerOpen(true);
    }
  };

  // Insert code snippet
  const handleInsertSnippet = (snippetCode) => {
    if (activeTab === 'html') {
      setHtml(prev => prev + '\n' + snippetCode);
    } else if (activeTab === 'css') {
      setCss(prev => prev + '\n' + snippetCode);
    } else {
      setJs(prev => prev + '\n' + snippetCode);
    }
  };

  // Handle lint errors
  const handleLintErrors = (errors) => {
    setLintErrors(errors);
  };

  // Test backend connection
  const testBackend = async () => {
    setPingResult('Testing...');
    try {
      const res = await fetch('http://localhost:4000/ping');
      const data = await res.json();
      setPingResult('Backend says: ' + data.message);
    } catch (err) {
      setPingResult('Error: ' + err.message);
    }
  };

  // Save snippet to server
  const saveSnippet = async () => {
    try {
      const response = await fetch('http://localhost:4000/snippets', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          html,
          css,
          js,
          java,
          php,
          title: prompt('Enter a title for your snippet:', 'My LiveCode Snippet'),
          description: prompt('Enter a description (optional):', ''),
        }),
      });

      if (response.ok) {
        const data = await response.json();
        setPingResult(`Snippet saved with ID: ${data.id}`);
        setTimeout(() => setPingResult(''), 3000);
      } else {
        alert('Failed to save snippet. Please try again.');
      }
    } catch (error) {
      console.error('Error saving snippet:', error);
      alert('Failed to save snippet. Please try again.');
    }
  };

  // Load snippet from server
  const loadSnippet = async () => {
    try {
      const snippetId = prompt('Enter the snippet ID:');
      
      if (!snippetId) return;
      
      const response = await fetch(`http://localhost:4000/snippets/${snippetId}`);
      
      if (response.ok) {
        const data = await response.json();
        
        // Add current state to version history before loading
        addToVersionHistory();
        
        // Update editor content
        setHtml(data.html || '');
        setCss(data.css || '');
        setJs(data.js || '');
        setJava(data.java || '');
        setPhp(data.php || '');
        
        setPingResult(`Snippet loaded: ${data.title}`);
        setTimeout(() => setPingResult(''), 3000);
      } else {
        alert('Failed to load snippet. Please check the ID and try again.');
      }
    } catch (error) {
      console.error('Error loading snippet:', error);
      alert('Failed to load snippet. Please try again.');
    }
  };

  // Create new snippet
  const createNewSnippet = () => {
    const defaultJava = `public class Main {
    public static void main(String[] args) {
        System.out.println("Hello, LiveCode!");
    }
}`;
    const defaultPhp = `<?php
echo "Hello, LiveCode!";
?>`;
    
    // Confirm with user if there are changes
    if (html !== '<h1>Hello, LiveCode!</h1>\n<p>Start coding here!</p>' || 
        css !== 'body {\n  font-family: sans-serif;\n  margin: 0;\n  padding: 20px;\n}\n\nh1 {\n  color: #333;\n}' || 
        js !== 'console.log("Hello from LiveCode!");' ||
        java !== defaultJava ||
        php !== defaultPhp) {
      if (!confirm('Create a new snippet? Your current changes will be saved to version history.')) {
        return;
      }
      
      // Save current state to version history
      addToVersionHistory();
    }
    
    // Reset to default content
    setHtml('<h1>Hello, LiveCode!</h1>\n<p>Start coding here!</p>');
    setCss('body {\n  font-family: sans-serif;\n  margin: 0;\n  padding: 20px;\n}\n\nh1 {\n  color: #333;\n}');
    setJs('console.log("Hello from LiveCode!");');
    setJava(defaultJava);
    setPhp(defaultPhp);
    
    // Clear console logs
    setConsoleLogs([]);
    
    setPingResult('Created new snippet');
    setTimeout(() => setPingResult(''), 3000);
  };
  
  // Reset code function
  const resetCode = () => {
    if (confirm('Reset all code? This will clear your current work.')) {
      createNewSnippet();
    }
  };

  // Toggle dark mode
  const toggleDarkMode = () => {
    const newMode = !isDarkMode;
    setIsDarkMode(newMode);
    // Save preference
    localStorage.setItem('livecode-theme', newMode ? 'dark' : 'light');
    // Theme will be applied via the useEffect hook
  };

  // Keyboard shortcuts
  useEffect(() => {
    const handleKeyDown = (e) => {
      // Ctrl/Cmd + S: Save
      if ((e.ctrlKey || e.metaKey) && e.key === 's') {
        e.preventDefault();
        saveSnippet();
      }
      
      // Ctrl/Cmd + Enter: Run code (refresh preview)
      if ((e.ctrlKey || e.metaKey) && e.key === 'Enter') {
        e.preventDefault();
        // Force refresh the preview by recreating the srcDoc
        const iframe = iframeRef.current;
        if (iframe) {
          iframe.srcdoc = createSrcDoc();
        }
      }
      
      // Ctrl/Cmd + 1/2/3/4: Switch tabs
      if (e.ctrlKey || e.metaKey) {
        if (e.key === '1') {
          e.preventDefault();
          setActiveTab('html');
        } else if (e.key === '2') {
          e.preventDefault();
          setActiveTab('css');
        } else if (e.key === '3') {
          e.preventDefault();
          setActiveTab('javascript');
        } else if (e.key === '4') {
          e.preventDefault();
          setActiveTab('java');
        } else if (e.key === '5') {
          e.preventDefault();
          setActiveTab('php');
        }
      }
      
      // Ctrl/Cmd + B: Toggle console
      if ((e.ctrlKey || e.metaKey) && e.key === 'b') {
        e.preventDefault();
        setIsConsoleOpen(!isConsoleOpen);
      }
      
      // (Removed) Ctrl/Cmd + D shortcut — theme is managed from Settings only
    };
    
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isConsoleOpen, saveSnippet, setActiveTab, setIsConsoleOpen, toggleDarkMode]); // Add other dependencies as needed

return (
  <div className="app-container">
    {/* Top Navigation Bar */}
    <Navbar 
      isDarkMode={isDarkMode} 
      toggleTheme={toggleDarkMode}
      onReset={resetCode}
      onExport={exportAsZip}
      onSave={saveSnippet}
      onTemplateClick={() => setIsTemplateOpen(true)}
      onSettingsClick={() => setIsSettingsOpen(true)}
      onToggleDarkMode={toggleDarkMode}
      onMinify={minifyCode}
      onExportScreenshot={handleExportScreenshot}
      onExportPDF={handleExportPDF}
      onSnippetLibrary={() => setIsSnippetLibraryOpen(true)}
      onLibraryPicker={() => setIsLibraryPickerOpen(true)}
      onLanguageSelector={() => setIsLanguageSelectorOpen(true)}
    />

    {/* Main Content - Split Horizontally */}
    <div className="main-content">
      {isMobileView ? (
        <div className="mobile-layout">
          {/* Editor Section */}
          <div className="mobile-editor-container">
            {/* Editor Tabs */}
            <div className="editor-tabs" style={{ flexShrink: 0 }}>
              {editorTabs.map(tab => (
                <button
                  key={tab.lang}
                  className={`editor-tab ${activeTab === tab.lang ? 'editor-tab-active' : ''}`}
                  onClick={() => setActiveTab(tab.lang)}
                >
                  <i className={`fab fa-${tab.icon} tab-icon`}></i>
                  {tab.label}
                  <div className="tab-actions">
                    <button 
                      className="tab-action-btn" 
                      title="Format code"
                      onClick={(e) => {
                        e.stopPropagation();
                        formatCode(tab.lang);
                      }}
                    >
                      <i className="fas fa-magic"></i>
                    </button>
                  </div>
                </button>
              ))}
            </div>
            
            {/* Editor Content */}
            <div className="editor-content">
              {activeTab === 'html' && (
                <EditorPane
                  language="html"
                  value={html}
                  onChange={setHtml}
                  theme={editorSettings.theme}
                  options={editorSettings}
                />
              )}
              {activeTab === 'css' && (
                <EditorPane
                  language="css"
                  value={css}
                  onChange={setCss}
                  theme={editorSettings.theme}
                  options={editorSettings}
                />
              )}
              {activeTab === 'javascript' && (
                <EditorPane
                  language="javascript"
                  value={js}
                  onChange={setJs}
                  theme={editorSettings.theme}
                  options={editorSettings}
                />
              )}
              {activeTab === 'java' && (
                <EditorPane
                  language="java"
                  value={java}
                  onChange={setJava}
                  theme={editorSettings.theme}
                  options={editorSettings}
                />
              )}
              {activeTab === 'php' && (
                <EditorPane
                  language="php"
                  value={php}
                  onChange={setPhp}
                  theme={editorSettings.theme}
                  options={editorSettings}
                />
              )}
            </div>
          </div>
          
          {/* Preview Section */}
          <div className="mobile-preview-container">
            <div className="preview-header">
              <span>Preview</span>
              <button 
                onClick={() => setIsConsoleOpen(!isConsoleOpen)}
                className="console-toggle-btn"
              >
                {isConsoleOpen ? 'Hide Console' : 'Show Console'}
              </button>
            </div>
            
            <div className="preview-content">
              <Preview srcDoc={createSrcDoc(html, css, js)} ref={iframeRef} />
            </div>
            
            {isConsoleOpen && (
              <div className="mobile-console-container">
                <div className="console-header">
                  <span>Console</span>
                  <button 
                    onClick={clearConsole}
                    className="console-clear-btn"
                  >
                    Clear
                  </button>
                </div>
                <ConsoleOutput logs={consoleLogs} />
              </div>
            )}
          </div>
        </div>
      ) : (
        /* Desktop View */
        <Split
          className="split-layout"
          sizes={[40, 60]}
          minSize={200}
          gutterSize={10}
          gutterAlign="center"
          snapOffset={30}
          dragInterval={1}
          direction="horizontal"
        >
          {/* Left Side - Code Editors with Tabs */}
          <div className="code-section">
            <div className="editor-tabs">
              {editorTabs.map(tab => (
                <button
                  key={tab.lang}
                  className={`editor-tab ${activeTab === tab.lang ? 'editor-tab-active' : ''}`}
                  onClick={() => setActiveTab(tab.lang)}
                >
                  <i className={`fab fa-${tab.icon} tab-icon`}></i>
                  {tab.label}
                  <div className="tab-actions">
                    <button 
                      className="tab-action-btn" 
                      title="Format code"
                      onClick={(e) => {
                        e.stopPropagation();
                        formatCode(tab.lang);
                      }}
                    >
                      <i className="fas fa-magic"></i>
                    </button>
                  </div>
                </button>
              ))}
            </div>
            
            <div className="editor-content">
              {activeTab === 'html' && (
                <EditorPane
                  language="html"
                  value={html}
                  onChange={setHtml}
                  theme={editorSettings.theme}
                  options={{
                    fontSize: editorSettings.fontSize,
                    tabSize: editorSettings.tabSize,
                    wordWrap: editorSettings.wordWrap,
                    minimap: { enabled: false },
                    lineNumbers: editorSettings.lineNumbers ? 'on' : 'off',
                    enableLinting: editorSettings.enableLinting,
                  }}
                  onLintErrors={handleLintErrors}
                />
              )}
              {activeTab === 'css' && (
                <EditorPane
                  language="css"
                  value={css}
                  onChange={setCss}
                  theme={editorSettings.theme}
                  options={{
                    fontSize: editorSettings.fontSize,
                    tabSize: editorSettings.tabSize,
                    wordWrap: editorSettings.wordWrap,
                    minimap: { enabled: false },
                    lineNumbers: editorSettings.lineNumbers ? 'on' : 'off',
                    enableLinting: editorSettings.enableLinting,
                  }}
                  onLintErrors={handleLintErrors}
                />
              )}
              {activeTab === 'javascript' && (
                <EditorPane
                  language="javascript"
                  value={js}
                  onChange={setJs}
                  theme={editorSettings.theme}
                  options={{
                    fontSize: editorSettings.fontSize,
                    tabSize: editorSettings.tabSize,
                    wordWrap: editorSettings.wordWrap,
                    minimap: { enabled: false },
                    lineNumbers: editorSettings.lineNumbers ? 'on' : 'off',
                    enableLinting: editorSettings.enableLinting,
                  }}
                  onLintErrors={handleLintErrors}
                />
              )}
              {activeTab === 'java' && (
                <EditorPane
                  language="java"
                  value={java}
                  onChange={setJava}
                  theme={editorSettings.theme}
                  options={{
                    fontSize: editorSettings.fontSize,
                    tabSize: editorSettings.tabSize,
                    wordWrap: editorSettings.wordWrap,
                    minimap: { enabled: false },
                    lineNumbers: editorSettings.lineNumbers ? 'on' : 'off',
                    enableLinting: editorSettings.enableLinting,
                  }}
                  onLintErrors={handleLintErrors}
                />
              )}
              {activeTab === 'php' && (
                <EditorPane
                  language="php"
                  value={php}
                  onChange={setPhp}
                  theme={editorSettings.theme}
                  options={{
                    fontSize: editorSettings.fontSize,
                    tabSize: editorSettings.tabSize,
                    wordWrap: editorSettings.wordWrap,
                    minimap: { enabled: false },
                    lineNumbers: editorSettings.lineNumbers ? 'on' : 'off',
                    enableLinting: editorSettings.enableLinting,
                  }}
                  onLintErrors={handleLintErrors}
                />
              )}
            </div>
          </div>
          
          {/* Right Side - Preview and Console */}
          <div className="preview-section" style={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
            <Split
              sizes={isConsoleOpen ? [70, 30] : [100, 0]}
              minSize={isConsoleOpen ? 100 : 0}
              gutterSize={isConsoleOpen ? 8 : 0}
              direction="vertical"
              style={{ display: 'flex', flexDirection: 'column', flex: 1, minHeight: 0 }}
            >
              {/* Preview Area */}
              <div style={{ 
                display: 'flex', 
                flexDirection: 'column', 
                flex: 1, 
                minHeight: 0,
                position: 'relative',
                backgroundColor: 'var(--bg-primary)'
              }}>
                <div style={{ 
                  display: 'flex', 
                  justifyContent: 'space-between', 
                  alignItems: 'center',
                  padding: '0.5rem 1rem',
                  borderBottom: '1px solid var(--border-color)',
                  backgroundColor: 'var(--bg-secondary)',
                  zIndex: 2,
                  position: 'relative'
                }}>
                  <span style={{ fontWeight: 500 }}>Preview</span>
                  <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'center' }}>
                    <PreviewModes onModeChange={setPreviewMode} currentMode={previewMode} />
                    <button 
                      onClick={() => setIsLibraryPickerOpen(true)}
                      style={{
                        background: 'none',
                        border: 'none',
                        color: 'var(--text-secondary)',
                        cursor: 'pointer',
                        padding: '0.25rem 0.5rem',
                        borderRadius: '4px',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        width: '28px',
                        height: '28px',
                        ':hover': {
                          backgroundColor: 'var(--hover-bg)'
                        }
                      }}
                      title="Add Libraries"
                    >
                      <i className="fa fa-book"></i>
                    </button>
                    <button 
                      onClick={() => setIsConsoleOpen(!isConsoleOpen)}
                      style={{
                        background: 'none',
                        border: 'none',
                        color: isConsoleOpen ? 'var(--primary-color)' : 'var(--text-secondary)',
                        cursor: 'pointer',
                        padding: '0.25rem 0.5rem',
                        borderRadius: '4px',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        width: '28px',
                        height: '28px',
                        ':hover': {
                          backgroundColor: 'var(--hover-bg)'
                        }
                      }}
                      title={isConsoleOpen ? "Hide Console" : "Show Console"}
                    >
                      <i className="fa fa-terminal"></i>
                    </button>
                  </div>
                </div>
                <div style={{ 
                  position: 'absolute',
                  top: '41px', // Height of header
                  left: 0,
                  right: 0,
                  bottom: 0,
                  display: 'flex', 
                  justifyContent: 'center',
                  alignItems: 'center',
                  overflow: 'auto',
                  padding: previewMode.name === 'Desktop' ? 0 : '1rem',
                  backgroundColor: 'var(--bg-primary)'
                }}>
                  <div style={{
                    ...previewContainerStyle,
                    display: 'flex',
                    flexDirection: 'column',
                    backgroundColor: previewMode.name === 'Desktop' ? 'transparent' : 'var(--bg-secondary)',
                    transition: 'all 0.3s ease',
                    maxWidth: '100%',
                    maxHeight: '100%',
                    boxSizing: 'border-box'
                  }}>
                    <div style={{
                      width: '100%',
                      height: '100%',
                      overflow: 'hidden',
                      borderRadius: previewMode.name !== 'Desktop' ? '0 0 8px 8px' : 0
                    }}>
                      <Preview 
                        srcDoc={createSrcDoc(debouncedHtml, debouncedCss, debouncedJs)} 
                        ref={iframeRef} 
                        style={{
                          width: '100%',
                          height: '100%',
                          border: 'none',
                          display: 'block'
                        }}
                      />
                    </div>
                    {previewMode.name !== 'Desktop' && (
                      <div style={{
                        padding: '0.5rem',
                        textAlign: 'center',
                        fontSize: '0.75rem',
                        color: 'var(--text-secondary)',
                        borderTop: '1px solid var(--border-color)',
                        backgroundColor: 'var(--bg-secondary)',
                        borderRadius: '0 0 8px 8px'
                      }}>
                        {previewMode.width} × {previewMode.height}
                      </div>
                    )}
                  </div>
                </div>
              </div>
              
              {/* Console Area */}
              {isConsoleOpen && (
                <div className="console-section">
                  <div className="console-header">
                    <span>Console</span>
                    <button 
                      onClick={clearConsole}
                      className="console-clear-btn"
                    >
                      Clear
                    </button>
                  </div>
                  <div className="console-content">
                    <ConsoleOutput logs={consoleLogs} />
                  </div>
                </div>
              )}
            </Split>
          </div>
        </Split>
      )}
    </div>

    {/* Footer with Version History */}
    <footer className="fixed bottom-0 left-0 right-0 bg-white dark:bg-gray-800 border-t border-gray-200 dark:border-gray-700 z-30">
      <div className="max-w-7xl mx-auto px-4 py-2">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <button 
              onClick={() => setIsSettingsOpen(true)}
              className="p-2 text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300 transition-colors duration-200 rounded-full hover:bg-blue-100 dark:hover:bg-blue-900/30"
              title="Settings"
              aria-label="Settings"
            >
              <i className="fas fa-cog text-lg"></i>
            </button>
            <span className="text-sm text-gray-500 dark:text-gray-400">
              v1.0.0
            </span>
          </div>
          
          <div className="flex items-center space-x-2">
            {versionHistory.length > 0 && (
              <div className="flex items-center space-x-1">
                <span className="text-xs text-gray-500 dark:text-gray-400">
                  {versionHistory.length} {versionHistory.length === 1 ? 'version' : 'versions'}
                </span>
                <button 
                  onClick={() => {
                    if (confirm('Clear all version history?')) {
                      localStorage.removeItem('versionHistory');
                      setVersionHistory([]);
                      setCurrentVersionIndex(-1);
                    }
                  }}
                  className="p-1 text-gray-400 hover:text-red-500 dark:text-gray-500 dark:hover:text-red-400"
                  title="Clear history"
                >
                  <i className="fas fa-trash-alt text-xs"></i>
                </button>
              </div>
            )}
            
            <div className="relative group">
              <button 
                className="px-3 py-1.5 text-sm font-medium text-gray-700 dark:text-gray-200 bg-gray-100 dark:bg-gray-700 rounded-md flex items-center space-x-1"
                onClick={() => setShowVersionHistory(!showVersionHistory)}
              >
                <i className="fas fa-history"></i>
                <span>Versions</span>
                <i className={`fas fa-chevron-${showVersionHistory ? 'up' : 'down'} text-xs`}></i>
              </button>
              
              {showVersionHistory && (
                <div className="absolute bottom-full right-0 mb-2 w-64 bg-white dark:bg-gray-800 rounded-md shadow-lg border border-gray-200 dark:border-gray-700 overflow-hidden">
                  <div className="max-h-60 overflow-y-auto">
                    {versionHistory.length > 0 ? (
                      <div className="divide-y divide-gray-200 dark:divide-gray-700">
                        {versionHistory.map((version, index) => {
                          const isActive = currentVersionIndex === index;
                          const date = new Date(version.timestamp);
                          const timeString = date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
                          const dateString = date.toLocaleDateString([], { month: 'short', day: 'numeric' });
                          
                          return (
                            <div 
                              key={index}
                              className={`p-2 text-sm cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-700 ${
                                isActive ? 'bg-blue-50 dark:bg-blue-900/30' : ''
                              }`}
                              onClick={() => {
                                loadVersion(index);
                                setShowVersionHistory(false);
                              }}
                            >
                              <div className="flex justify-between items-center">
                                <span className="font-medium">Version {versionHistory.length - index}</span>
                                <span className="text-xs text-gray-500 dark:text-gray-400">
                                  {dateString} {timeString}
                                </span>
                              </div>
                              {isActive && (
                                <span className="inline-block mt-1 px-1.5 py-0.5 text-xs bg-blue-100 dark:bg-blue-800 text-blue-800 dark:text-blue-100 rounded">
                                  Current
                                </span>
                              )}
                            </div>
                          );
                        })}
                      </div>
                    ) : (
                      <div className="p-4 text-center text-sm text-gray-500 dark:text-gray-400">
                        <i className="fas fa-history text-2xl mb-2 text-gray-300 dark:text-gray-600"></i>
                        <p>No versions yet</p>
                        <p className="text-xs mt-1">Save changes to create versions</p>
                      </div>
                    )}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </footer>

    {/* Settings Panel */}
    {isSettingsOpen && (
      <SettingsPanel 
          settings={editorSettings}
          onClose={() => setIsSettingsOpen(false)}
          onSave={(newSettings) => {
            setEditorSettings(newSettings);
            localStorage.setItem('editorSettings', JSON.stringify(newSettings));
            // If user changed the editor theme, also reflect that as the app theme
            if (newSettings.theme === 'vs-dark') {
              setIsDarkMode(true);
              applyTheme(true, setEditorSettings);
              localStorage.setItem('livecode-theme', 'dark');
            } else if (newSettings.theme === 'vs-light') {
              setIsDarkMode(false);
              applyTheme(false, setEditorSettings);
              localStorage.setItem('livecode-theme', 'light');
            }
            setIsSettingsOpen(false);
          }}
        keyboardShortcuts={[
          { key: 'Ctrl/Cmd + S', description: 'Save snippet' },
          { key: 'Ctrl/Cmd + Enter', description: 'Run code / Refresh preview' },
          { key: 'Ctrl/Cmd + 1/2/3/4/5', description: 'Switch to HTML/CSS/JS/Java/PHP tabs' },
          { key: 'Ctrl/Cmd + B', description: 'Toggle console' },
          { key: 'Ctrl/Cmd + D', description: 'Toggle dark mode' }
        ]}
      />
    )}

    {/* Template Selector */}
    {isTemplateOpen && (
      <TemplateSelector 
        templates={templates}
        onSelectTemplate={applyTemplate}
        onClose={() => setIsTemplateOpen(false)}
      />
    )}

    {/* Library Picker */}
    {isLibraryPickerOpen && (
      <LibraryPicker
        selectedLibraries={selectedLibraries}
        onLibrariesChange={setSelectedLibraries}
        onClose={() => setIsLibraryPickerOpen(false)}
      />
    )}

    {/* Snippet Library */}
    {isSnippetLibraryOpen && (
      <SnippetLibrary
        language={activeTab}
        onInsert={handleInsertSnippet}
        onClose={() => setIsSnippetLibraryOpen(false)}
      />
    )}

    {/* Code Diff Viewer */}
    {isDiffViewerOpen && diffVersions.old && diffVersions.new && (
      <CodeDiffViewer
        oldCode={diffVersions.old}
        newCode={diffVersions.new}
        onClose={() => setIsDiffViewerOpen(false)}
      />
    )}

    {/* Language Selector */}
    {isLanguageSelectorOpen && (
      <LanguageSelector
        selectedLanguages={selectedLanguages}
        onLanguagesChange={setSelectedLanguages}
        onClose={() => setIsLanguageSelectorOpen(false)}
      />
    )}

    {/* Version History Panel (conditionally rendered) */}
    {versionHistory.length > 0 && (
      <div className="fixed bottom-4 right-4 bg-white dark:bg-gray-800 shadow-lg rounded-lg p-4 w-64 z-50">
        <div className="flex justify-between items-center mb-2">
          <h3 className="font-bold">Version History</h3>
          <button 
            onClick={() => {
              setVersionHistory([]);
              localStorage.removeItem('versionHistory');
              setCurrentVersionIndex(-1);
            }} 
            className="text-red-500 hover:text-red-700"
          >
            <i className="fa fa-times"></i>
          </button>
        </div>
        <div className="max-h-40 overflow-y-auto">
          {versionHistory.map((version, index) => (
            <button
              key={index}
              onClick={() => loadVersion(index)}
              className={`w-full text-left p-2 mb-1 rounded ${index === currentVersionIndex ? 'bg-blue-500 text-white' : 'bg-gray-100 dark:bg-gray-700'}`}
            >
              Version {index + 1} - {new Date(version.timestamp).toLocaleTimeString()}
            </button>
          ))}
        </div>
      </div>
    )}
    
    <Footer />
    
    {/* Toast notification for save/load operations */}
    {pingResult && (
      <div className="fixed bottom-4 right-4 bg-blue-600 text-white px-4 py-2 rounded-lg shadow-lg animate-fade-in-out flex items-center">
        <i className="fas fa-info-circle mr-2"></i>
        {pingResult}
      </div>
    )}
  </div>
  );
}