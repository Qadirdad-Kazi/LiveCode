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
import { templates } from './utils/templates';
import './styles/custom.css';

const editorTabs = [
  { label: 'HTML', lang: 'html', icon: 'html5' },
  { label: 'CSS', lang: 'css', icon: 'css3' },
  { label: 'JS', lang: 'javascript', icon: 'js' },
];

export default function App() {
  // Theme state
  const [isDarkMode, setIsDarkMode] = useState(() => {
    const savedTheme = localStorage.getItem('livecode-theme');
    return savedTheme ? savedTheme === 'dark' : window.matchMedia('(prefers-color-scheme: dark)').matches;
  });
  // Editor content state
  const [activeTab, setActiveTab] = useState('html');
  const [html, setHtml] = useState('<h1>Hello, LiveCode!</h1>\n<p>Start coding here!</p>');
  const [css, setCss] = useState('body {\n  font-family: sans-serif;\n  margin: 0;\n  padding: 20px;\n}\n\nh1 {\n  color: #333;\n}');
  const [js, setJs] = useState('console.log("Hello from LiveCode!");');

  // Editor settings
  const [editorSettings, setEditorSettings] = useState({
    fontSize: 14,
    tabSize: 2,
    wordWrap: 'on',
    minimap: false,
    lineNumbers: true,
    theme: isDarkMode ? 'vs-dark' : 'vs-light',
    autoFormat: false
  });

  // UI state
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [isTemplateOpen, setIsTemplateOpen] = useState(false);
  const [isMobileView, setIsMobileView] = useState(window.innerWidth < 768);
  const [consoleLogs, setConsoleLogs] = useState([]);
  const [isConsoleOpen, setIsConsoleOpen] = useState(true);
  const [pingResult, setPingResult] = useState('');

  // Version history
  const [versions, setVersions] = useState([]);
  const [currentVersionIndex, setCurrentVersionIndex] = useState(-1);

  // Refs
  const iframeRef = useRef(null);

  // Create sanitized source document for preview
  const createSrcDoc = () => {
    return `
      <!DOCTYPE html>
      <html>
        <head>
          <meta charset="UTF-8" />
          <meta name="viewport" content="width=device-width, initial-scale=1.0" />
          <style>${DOMPurify.sanitize(css)}</style>
        </head>
        <body>
          ${DOMPurify.sanitize(html)}
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
              ${DOMPurify.sanitize(js)}
            } catch (error) {
              console.error(error.message);
            }
          </script>
        </body>
      </html>
    `;
  };
  
  const srcDoc = createSrcDoc();

  // Handle editor content changes
  const getValue = () => {
    if (activeTab === 'html') return html;
    if (activeTab === 'css') return css;
    return js;
  };

  const setValue = (value) => {
    // Save current state to version history before updating
    if (value !== getValue()) {
      addToVersionHistory();
    }

    if (activeTab === 'html') setHtml(value || '');
    else if (activeTab === 'css') setCss(value || '');
    else setJs(value || '');
  };

  // Version history management
  const addToVersionHistory = () => {
    // Only add to history if there are changes
    const newVersion = { html, css, js, timestamp: new Date().toISOString() };

    // Remove any future versions if we're not at the latest version
    const updatedVersions = versions.slice(0, currentVersionIndex + 1);

    // Add the new version and update the current index
    setVersions([...updatedVersions, newVersion]);
    setCurrentVersionIndex(updatedVersions.length);
  };

  const loadVersion = (index) => {
    if (index >= 0 && index < versions.length) {
      const version = versions[index];
      setHtml(version.html);
      setCss(version.css);
      setJs(version.js);
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
    // Confirm with user if there are changes
    if (html !== '<h1>Hello, LiveCode!</h1>\n<p>Start coding here!</p>' || 
        css !== 'body {\n  font-family: sans-serif;\n  margin: 0;\n  padding: 20px;\n}\n\nh1 {\n  color: #333;\n}' || 
        js !== 'console.log("Hello from LiveCode!");') {
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

return (
  <div className={`app-container ${isDarkMode ? 'dark' : ''}`}>
    <Navbar 
      isDarkMode={isDarkMode} 
      toggleTheme={toggleDarkMode}
      onReset={resetCode}
      onExport={exportAsZip}
      onSave={saveSnippet}
      onTemplateClick={() => setIsTemplateOpen(true)}
      onSettingsClick={() => setIsSettingsOpen(true)}
      onToggleDarkMode={toggleDarkMode}
    />

    {/* Main Content */}
    <div className="main-content">
      {/* Mobile Tab Selector */}
      {isMobileView ? (
        <div className="editor-container">
          {/* Editor Tabs */}
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
          </div>
          
          {/* Preview with Resizable Console */}
          <Split
            className="preview-console-container"
            direction="vertical"
            sizes={isConsoleOpen ? [70, 30] : [100, 0]}
            minSize={isConsoleOpen ? 100 : 0}
            gutterSize={isConsoleOpen ? 8 : 0}
          >
            <Preview srcDoc={srcDoc} ref={iframeRef} />

            {isConsoleOpen && (
              <div className="console-container">
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
          </Split>
        </div>
      ) : (
        /* Mobile View */
        <div className="mobile-container">
          {/* Editor */}
          <div className="mobile-editor">
            <EditorPane 
              language={activeTab} 
              value={getValue()} 
              onChange={setValue}
              theme={editorSettings.theme}
              options={{
                fontSize: editorSettings.fontSize,
                tabSize: editorSettings.tabSize,
                wordWrap: editorSettings.wordWrap,
                minimap: { enabled: false },
                lineNumbers: editorSettings.lineNumbers ? 'on' : 'off',
              }}
            />
          </div>

          {/* Preview */}
          <div className="h-1/2 flex flex-col">
            <div className="bg-gray-800 text-white py-2 px-4 flex justify-between items-center">
              <span>Preview</span>
              <button 
                onClick={() => setIsConsoleOpen(!isConsoleOpen)}
                className="px-2 py-1 bg-gray-700 hover:bg-gray-600 rounded"
              >
                <i className={`fa fa-terminal ${isConsoleOpen ? 'text-green-400' : ''}`}></i>
              </button>
            </div>

            <div className="flex-grow relative">
              <Preview srcDoc={srcDoc} ref={iframeRef} />

              {isConsoleOpen && (
                <div className="absolute bottom-0 left-0 right-0 h-1/3 bg-gray-900 text-green-400 font-mono text-sm p-2 overflow-auto">
                  <div className="flex justify-between items-center mb-1">
                    <span className="text-xs">Console</span>
                    <button 
                      onClick={clearConsole}
                      className="text-xs px-1 py-0.5 bg-gray-800 hover:bg-gray-700 rounded"
                    >
                      Clear
                    </button>
                  </div>
                  <ConsoleOutput logs={consoleLogs} />
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>

    {/* Settings Panel */}
    {isSettingsOpen && (
      <SettingsPanel 
        settings={editorSettings}
        onSettingsChange={setEditorSettings}
        onClose={() => setIsSettingsOpen(false)}
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

    {/* Version History Panel (conditionally rendered) */}
    {versions.length > 0 && (
      <div className="fixed bottom-4 right-4 bg-white dark:bg-gray-800 shadow-lg rounded-lg p-4 w-64 z-50">
        <div className="flex justify-between items-center mb-2">
          <h3 className="font-bold">Version History</h3>
          <button 
            onClick={() => setVersions([])} 
            className="text-red-500 hover:text-red-700"
          >
            <i className="fa fa-times"></i>
          </button>
        </div>
        <div className="max-h-40 overflow-y-auto">
          {versions.map((version, index) => (
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