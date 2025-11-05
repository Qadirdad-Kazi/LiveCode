import React, { useEffect, useRef, lazy, Suspense } from "react";
import { lintJavaScript, lintCSS, lintHTML } from "../utils/linting";

// Lazy-load Monaco so we can gracefully fallback if it fails to load
const MonacoEditor = lazy(() => import("@monaco-editor/react"));

class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError() {
    return { hasError: true };
  }

  componentDidCatch(err) {
    console.warn('Monaco failed to load, falling back to textarea editor. Error:', err);
  }

  render() {
    if (this.state.hasError) {
      return this.props.fallback || null;
    }
    return this.props.children;
  }
}

function TextareaFallback({ language, value, onChange, theme, options = {} }) {
  return (
    <div className="editor-container">
      <textarea
        className="editor-fallback"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        style={{
          width: '100%',
          height: '100%',
          boxSizing: 'border-box',
          padding: 16,
          fontFamily: "'Fira Mono', 'Consolas', 'Monaco', 'Courier New', monospace",
          fontSize: options.fontSize || 14,
          background: theme && theme.includes('dark') ? '#0f172a' : '#fff',
          color: theme && theme.includes('dark') ? '#e6eef8' : '#111827',
          border: 'none',
          outline: 'none',
          resize: 'none',
        }}
      />
    </div>
  );
}

export function EditorPane({ language, value, onChange, theme, options = {}, onLintErrors }) {
  const editorRef = useRef(null);
  const lintTimerRef = useRef(null);

  // Linting integration
  useEffect(() => {
    if (!options.enableLinting || !editorRef.current) return;

    const performLinting = async () => {
      try {
        let errors = [];
        if (language === 'javascript') {
          errors = await lintJavaScript(value);
        } else if (language === 'css') {
          errors = await lintCSS(value);
        } else if (language === 'html') {
          errors = lintHTML(value);
        }

        // Update Monaco editor markers
        if (editorRef.current && window.monaco) {
          const markers = errors.map(err => ({
            severity: err.severity === 'error' 
              ? window.monaco.MarkerSeverity.Error 
              : window.monaco.MarkerSeverity.Warning,
            startLineNumber: err.line || 1,
            startColumn: err.column || 1,
            endLineNumber: err.line || 1,
            endColumn: (err.column || 1) + 10,
            message: err.message
          }));

          window.monaco.editor.setModelMarkers(
            editorRef.current.getModel(),
            'linting',
            markers
          );
        }

        if (onLintErrors) {
          onLintErrors(errors);
        }
      } catch (error) {
        console.error('Linting error:', error);
      }
    };

    // Debounce linting
    if (lintTimerRef.current) {
      clearTimeout(lintTimerRef.current);
    }

    lintTimerRef.current = setTimeout(performLinting, 500);

    return () => {
      if (lintTimerRef.current) {
        clearTimeout(lintTimerRef.current);
      }
    };
  }, [value, language, options.enableLinting, onLintErrors]);

  const handleEditorDidMount = (editor, monaco) => {
    editorRef.current = editor;

    // Store monaco globally for linting
    if (monaco && !window.monaco) {
      window.monaco = monaco;
    }

    try {
      // Apply editor customizations after mount
      editor.updateOptions({
        padding: { top: 16, bottom: 16 },
      });

      // Enhanced autocomplete with custom snippets
      if (monaco) {
        // Add custom snippets based on language
        const snippets = getCustomSnippets(language);
        monaco.languages.registerCompletionItemProvider(language, {
          provideCompletionItems: () => ({
            suggestions: snippets
          })
        });
      }

      // Add focus styling
      const editorDomNode = editor.getDomNode && editor.getDomNode();
      if (editorDomNode) {
        editorDomNode.style.transition = 'all 0.3s ease';

        editor.onDidFocusEditorText(() => {
          if (editorDomNode.parentElement) {
            editorDomNode.parentElement.style.boxShadow = '0 0 0 2px rgba(59, 130, 246, 0.5)';
          }
        });

        editor.onDidBlurEditorText(() => {
          if (editorDomNode.parentElement) {
            editorDomNode.parentElement.style.boxShadow = 'none';
          }
        });
      }
    } catch (err) {
      // If anything on mount fails, log and allow ErrorBoundary to fallback
      console.warn('Error configuring Monaco editor:', err);
    }
  };

  const getCustomSnippets = (lang) => {
    const baseSnippets = [];
    if (lang === 'html') {
      baseSnippets.push(
        {
          label: 'div',
          kind: window.monaco?.languages.CompletionItemKind.Snippet,
          insertText: '<div>${1}</div>',
          insertTextRules: window.monaco?.languages.CompletionItemInsertTextRule.InsertAsSnippet
        },
        {
          label: 'button',
          kind: window.monaco?.languages.CompletionItemKind.Snippet,
          insertText: '<button>${1}</button>',
          insertTextRules: window.monaco?.languages.CompletionItemInsertTextRule.InsertAsSnippet
        }
      );
    }
    return baseSnippets;
  };

  return (
    <ErrorBoundary fallback={<TextareaFallback language={language} value={value} onChange={onChange} theme={theme} options={options} />}>
      <Suspense fallback={<div className="editor-loading">Loading editor...</div>}>
        <div className="editor-container">
          <MonacoEditor
            height="100%"
            defaultLanguage={language}
            value={value}
            theme={theme || "vs-dark"}
            options={{
              fontSize: options.fontSize || 14,
              tabSize: options.tabSize || 2,
              minimap: { enabled: options.minimap || false },
              lineNumbers: options.lineNumbers || "on",
              wordWrap: options.wordWrap || "on",
              fontFamily: "'Fira Mono', 'Consolas', 'Monaco', 'Courier New', monospace",
              scrollBeyondLastLine: false,
              automaticLayout: true,
              formatOnPaste: options.autoFormat || false,
              formatOnType: options.autoFormat || false,
              cursorBlinking: "smooth",
              cursorSmoothCaretAnimation: "on",
              smoothScrolling: true,
              contextmenu: true,
              renderLineHighlight: "all",
              renderWhitespace: "selection",
              bracketPairColorization: { enabled: true },
              guides: { bracketPairs: true, indentation: true },
              folding: true,
              foldingHighlight: true,
              links: true,
              renderControlCharacters: false,
              roundedSelection: true,
              selectionHighlight: true,
            }}
            onChange={(val) => onChange(val || "")}
            onMount={handleEditorDidMount}
            loading={<div className="editor-loading">Loading editor...</div>}
            beforeMount={(monaco) => {
              // Store monaco globally
              window.monaco = monaco;
            }}
          />
        </div>
      </Suspense>
    </ErrorBoundary>
  );
}