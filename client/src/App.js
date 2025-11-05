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
import { PerformanceMonitor } from './components/PerformanceMonitor';
import { CodeDiffViewer } from './components/CodeDiffViewer';
import { LibraryPicker } from './components/LibraryPicker';
import { SnippetLibrary } from './components/SnippetLibrary';
import { templates } from './utils/templates';
import { createGist, fetchGist } from './utils/gist';
import { minifyAll } from './utils/minifier';
import { exportAsScreenshot, exportAsPDF } from './utils/exportFormats';
import './styles/custom.css';

const editorTabs = [
  { label: 'HTML', lang: 'html', icon: 'html5' },
  { label: 'CSS', lang: 'css', icon: 'css3' },
  { label: 'JS', lang: 'javascript', icon: 'js' },
  { label: 'Java', lang: 'java', icon: 'java' },
];

export default function App() {
  // Theme state
  const [isDarkMode, setIsDarkMode] = useState(() => {
    // Check for saved theme first, then system preference
    const savedTheme = localStorage.getItem('livecode-theme');
    const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
    const initialMode = savedTheme ? savedTheme === 'dark' : prefersDark;
    
    // Apply theme class immediately to prevent flash of light theme
    if (initialMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
    
    return initialMode;
  });
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

  // New feature states
  const [previewMode, setPreviewMode] = useState({ name: 'Desktop', width: '100%', height: '100%' });
  const [selectedLibraries, setSelectedLibraries] = useState([]);
  const [isLibraryPickerOpen, setIsLibraryPickerOpen] = useState(false);
  const [isSnippetLibraryOpen, setIsSnippetLibraryOpen] = useState(false);
  const [isDiffViewerOpen, setIsDiffViewerOpen] = useState(false);
  const [diffVersions, setDiffVersions] = useState({ old: null, new: null });
  const [lintErrors, setLintErrors] = useState([]);

  // UI state
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [isTemplateOpen, setIsTemplateOpen] = useState(false);
  const [isMobileView, setIsMobileView] = useState(window.innerWidth < 768);
  
  // Version history state
  const [versionHistory, setVersionHistory] = useState(() => {
    const savedHistory = localStorage.getItem('versionHistory');
    return savedHistory ? JSON.parse(savedHistory) : [];
  });
  const [currentVersionIndex, setCurrentVersionIndex] = useState(-1);
  const [consoleLogs, setConsoleLogs] = useState([]);
  const [isConsoleOpen, setIsConsoleOpen] = useState(true);
  const [pingResult, setPingResult] = useState('');

  // Refs
  const iframeRef = useRef(null);

  // Create sanitized source document for preview with external libraries
  const createSrcDoc = (htmlContent, cssContent, jsContent) => {
    // Build library imports
    const cssLibraries = selectedLibraries
      .filter(lib => lib.type === 'css')
      .map(lib => `<link rel="stylesheet" href="${lib.cdn}">`)
      .join('\n    ');
    
    const scriptLibraries = selectedLibraries
      .filter(lib => lib.type === 'script')
      .map(lib => `<script src="${lib.cdn}"></script>`)
      .join('\n    ');

    return `
      <!DOCTYPE html>
      <html>
        <head>
          <meta charset="UTF-8" />
          <meta name="viewport" content="width=device-width, initial-scale=1.0" />
          ${cssLibraries}
          <style>${DOMPurify.sanitize(cssContent)}</style>
        </head>
        <body>
          ${DOMPurify.sanitize(htmlContent)}
          ${scriptLibraries}
          <script>
            // Console log capture
            const originalConsole = console;
            
            console = {
              log: (...args) => {
                originalConsole.log(...args);
                window.parent.postMessage({ type: 'console', method: 'log', args }, '*');
              },
              error: (...args) => {
                originalConsole.error(...args);
                window.parent.postMessage({ type: 'console', method: 'error', args }, '*');
              },
              warn: (...args) => {
                originalConsole.warn(...args);
                window.parent.postMessage({ type: 'console', method: 'warn', args }, '*');
              },
              info: (...args) => {
                originalConsole.info(...args);
                window.parent.postMessage({ type: 'console', method: 'info', args }, '*');
              }
            };
            
            // Error handling
            window.onerror = function(message, source, lineno, colno, error) {
              window.parent.postMessage({
                type: 'console',
                method: 'error',
                args: [message + ' (line: ' + lineno + ', col: ' + colno + ')']
              }, '*');
              return true;
            };
            
            // User JS code
            try {
              ${DOMPurify.sanitize(jsContent)}
            } catch (error) {
              console.error(error.message);
            }
          </script>
        </body>
      </html>
    `;
  };
  
  // Handle editor content changes
  const getValue = () => {
    if (activeTab === 'html') return html;
    if (activeTab === 'css') return css;
    if (activeTab === 'java') return java;
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
    const newVersion = { html, css, js, java, timestamp: new Date().toISOString() };

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
      setCurrentVersionIndex(index);
    }
  };

  // Console message handler
  useEffect(() => {
    const handleMessage = (event) => {
      if (event.data && event.data.type === 'console') {
        const { method, args } = event.data;
        setConsoleLogs(prev => [...prev, { type: method, data: args }]);
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
      setIsTemplateOpen(false);
    }
  };

  // Export as ZIP
  const exportAsZip = async () => {
    // Using JSZip library which should be added to dependencies
    const JSZip = (await import('jszip')).default;
    const zip = new JSZip();

    zip.file('index.html', `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>LiveCode Export</title>
  <link rel="stylesheet" href="style.css">
</head>
<body>
${html}
  <script src="script.js"></script>
</body>
</html>`);
    
    zip.file('style.css', css);
    zip.file('script.js', js);

    const content = await zip.generateAsync({ type: 'blob' });
    saveAs(content, 'livecode-export.zip');
  };

  // Clear console
  const clearConsole = () => {
    setConsoleLogs([]);
  };

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

  // Save current snippet to GitHub Gist via server
  const saveToGist = async () => {
    try {
      const makePublic = confirm('Make this gist public? (Cancel for private)');
      const payload = { html, css, js, title: prompt('Gist title:', 'LiveCode snippet'), public: makePublic };
      const data = await createGist(payload);
      setPingResult(`Gist created: ${data.html_url || data.id}`);
      setTimeout(() => setPingResult(''), 4000);
    } catch (err) {
      console.error('Failed to create gist', err);
      alert('Failed to create gist. Check server config and GITHUB_TOKEN.');
    }
  };

  // Import a gist by ID and load into editor
  const importFromGist = async () => {
    try {
      const gistId = prompt('Enter Gist ID to import:');
      if (!gistId) return;
      const snippet = await fetchGist(gistId);
      // Save current to history before importing
      addToVersionHistory();
      setHtml(snippet.html || '');
      setCss(snippet.css || '');
      setJs(snippet.js || '');
      setPingResult(`Imported gist: ${snippet.title}`);
      setTimeout(() => setPingResult(''), 4000);
    } catch (err) {
      console.error('Failed to import gist', err);
      alert('Failed to import gist. Make sure the ID is correct.');
    }
  };
  
  // Create new snippet
  const createNewSnippet = () => {
    const defaultJava = `public class Main {
    public static void main(String[] args) {
        System.out.println("Hello, LiveCode!");
    }
}`;
    
    // Confirm with user if there are changes
    if (html !== '<h1>Hello, LiveCode!</h1>\n<p>Start coding here!</p>' || 
        css !== 'body {\n  font-family: sans-serif;\n  margin: 0;\n  padding: 20px;\n}\n\nh1 {\n  color: #333;\n}' || 
        js !== 'console.log("Hello from LiveCode!");' ||
        java !== defaultJava) {
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
    localStorage.setItem('livecode-theme', newMode ? 'dark' : 'light');
  
  // Update editor theme
  setEditorSettings(prev => ({
    ...prev,
    theme: newMode ? 'vs-dark' : 'vs-light'
  }));
  
  // Update document class for Tailwind dark mode
  if (newMode) {
    document.documentElement.classList.add('dark');
  } else {
    document.documentElement.classList.remove('dark');
  }
};

  // Set initial dark mode class
  useEffect(() => {
    if (isDarkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [isDarkMode]);
  
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
        }
      }
      
      // Ctrl/Cmd + B: Toggle console
      if ((e.ctrlKey || e.metaKey) && e.key === 'b') {
        e.preventDefault();
        setIsConsoleOpen(!isConsoleOpen);
      }
      
      // Ctrl/Cmd + D: Toggle dark mode
      if ((e.ctrlKey || e.metaKey) && e.key === 'd') {
        e.preventDefault();
        toggleDarkMode();
      }
    };
    
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isConsoleOpen, saveSnippet, setActiveTab, setIsConsoleOpen, toggleDarkMode]); // Add other dependencies as needed

return (
  <div className={`app-container ${isDarkMode ? 'dark' : ''}`}>
    {/* Top Navigation Bar */}
    <Navbar 
      isDarkMode={isDarkMode} 
      toggleTheme={toggleDarkMode}
      onReset={resetCode}
      onExport={exportAsZip}
      onSave={saveSnippet}
      onSaveToGist={saveToGist}
      onImportFromGist={importFromGist}
      onTemplateClick={() => setIsTemplateOpen(true)}
      onSettingsClick={() => setIsSettingsOpen(true)}
      onToggleDarkMode={toggleDarkMode}
      onMinify={minifyCode}
      onExportScreenshot={handleExportScreenshot}
      onExportPDF={handleExportPDF}
      onSnippetLibrary={() => setIsSnippetLibraryOpen(true)}
      onLibraryPicker={() => setIsLibraryPickerOpen(true)}
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
            </div>
          </div>
          
          {/* Right Side - Preview and Console */}
          <div className="preview-section">
            <Split
              className="preview-console-split"
              sizes={isConsoleOpen ? [70, 30] : [100, 0]}
              minSize={isConsoleOpen ? 100 : 0}
              gutterSize={isConsoleOpen ? 8 : 0}
              snapOffset={30}
              direction="vertical"
            >
              {/* Preview Area */}
              <div className="preview-container">
                <div className="preview-header">
                  <span>Preview</span>
                  <div className="preview-controls">
                    <PreviewModes onModeChange={setPreviewMode} currentMode={previewMode} />
                    <button 
                      onClick={() => setIsLibraryPickerOpen(true)}
                      className="preview-control-btn"
                      title="Add Libraries"
                    >
                      <i className="fa fa-book"></i>
                    </button>
                    <button 
                      onClick={() => setIsConsoleOpen(!isConsoleOpen)}
                      className="console-toggle-btn"
                      title={isConsoleOpen ? "Hide Console" : "Show Console"}
                    >
                      <i className={`fa fa-terminal ${isConsoleOpen ? 'console-active' : ''}`}></i>
                    </button>
                  </div>
                </div>
                <div className="preview-content" style={{ width: previewMode.width, height: previewMode.height, maxWidth: '100%', maxHeight: '100%' }}>
                  <Preview srcDoc={createSrcDoc(debouncedHtml, debouncedCss, debouncedJs)} ref={iframeRef} />
                  <PerformanceMonitor iframeRef={iframeRef} />
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
    <footer className="app-footer">
      {/* Version History Timeline */}
      <div className="version-history-container">
        <div className="version-history-header">
          <h3>Version History</h3>
          {versionHistory.length > 0 && (
            <button 
              className="clear-history-btn"
              onClick={() => {
                if (confirm('Clear all version history? This cannot be undone.')) {
                  localStorage.removeItem('versionHistory');
                  setVersionHistory([]);
                }
              }}
            >
              Clear History
            </button>
          )}
        </div>
        <div className="version-history-timeline">
          {versionHistory.length > 0 ? (
            versionHistory.map((version, index) => (
              <div 
                key={index} 
                className={`version-item ${currentVersionIndex === index ? 'active-version' : ''}`}
                onClick={() => loadVersion(index)}
                title={`Version ${index + 1} - ${new Date(version.timestamp).toLocaleString()}`}
              >
                <div className="version-dot"></div>
                <div className="version-info">
                  <span className="version-number">V{index + 1}</span>
                  <span className="version-time">{new Date(version.timestamp).toLocaleTimeString()}</span>
                </div>
              </div>
            ))
          ) : (
            <div className="empty-history">No version history yet. Make changes to create versions.</div>
          )}
        </div>
      </div>
      
      {/* Footer Info */}
      <div className="footer-content">
        <div className="footer-logo">
          <i className="fas fa-code"></i> LiveCode
        </div>
        <div className="footer-links">
          <a href="https://github.com/Qadirdad-Kazi/LiveCode" target="_blank" rel="noopener noreferrer">
            <i className="fab fa-github"></i> GitHub
          </a>
          <span className="footer-divider">|</span>
          <button onClick={() => setIsSettingsOpen(true)}>
            <i className="fas fa-cog"></i> Settings
          </button>
          <span className="footer-divider">|</span>
          <span className="version">v1.0.0</span>
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
          setIsSettingsOpen(false);
        }}
        keyboardShortcuts={[
          { key: 'Ctrl/Cmd + S', description: 'Save snippet' },
          { key: 'Ctrl/Cmd + Enter', description: 'Run code / Refresh preview' },
          { key: 'Ctrl/Cmd + 1/2/3/4', description: 'Switch to HTML/CSS/JS/Java tabs' },
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