import React, { useEffect, useRef, lazy, Suspense } from "react";

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

export function EditorPane({ language, value, onChange, theme, options = {} }) {
  const editorRef = useRef(null);

  const handleEditorDidMount = (editor) => {
    editorRef.current = editor;

    try {
      // Apply editor customizations after mount
      editor.updateOptions({
        padding: { top: 16, bottom: 16 },
      });

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
          />
        </div>
      </Suspense>
    </ErrorBoundary>
  );
}