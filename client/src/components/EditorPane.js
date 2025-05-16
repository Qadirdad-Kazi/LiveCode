import React, { useEffect, useRef } from "react";
import MonacoEditor from "@monaco-editor/react";

export function EditorPane({ language, value, onChange, theme, options = {} }) {
  const editorRef = useRef(null);
  
  const handleEditorDidMount = (editor) => {
    editorRef.current = editor;
    
    // Apply editor customizations after mount
    editor.updateOptions({
      padding: { top: 16, bottom: 16 },
    });
    
    // Add focus styling
    const editorDomNode = editor.getDomNode();
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
  };
  
  return (
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
  );
}