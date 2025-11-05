import React, { useState } from 'react';
import { diffLines } from 'diff';

export function CodeDiffViewer({ oldCode, newCode, language = 'text', onClose }) {
  const [diff, setDiff] = useState(null);

  React.useEffect(() => {
    if (oldCode && newCode) {
      const changes = diffLines(oldCode, newCode);
      setDiff(changes);
    }
  }, [oldCode, newCode]);

  const renderDiff = () => {
    if (!diff) return null;

    let lineNumber = 1;
    return diff.map((part, index) => {
      const lines = part.value.split('\n');
      const isRemoved = part.removed;
      const isAdded = part.added;

      return lines.map((line, lineIndex) => {
        if (lineIndex === lines.length - 1 && line === '') return null;
        
        const lineNum = lineNumber++;
        const className = isRemoved 
          ? 'diff-removed' 
          : isAdded 
          ? 'diff-added' 
          : 'diff-unchanged';

        return (
          <div key={`${index}-${lineIndex}`} className={`diff-line ${className}`}>
            <span className="diff-line-number">{lineNum}</span>
            <span className="diff-content">{line || ' '}</span>
          </div>
        );
      });
    });
  };

  return (
    <div className="code-diff-viewer-overlay" onClick={onClose}>
      <div className="code-diff-viewer" onClick={(e) => e.stopPropagation()}>
        <div className="diff-header">
          <h3>Code Diff</h3>
          <button onClick={onClose} className="diff-close-btn">
            <i className="fa fa-times"></i>
          </button>
        </div>
        <div className="diff-content-container">
          <div className="diff-legend">
            <span className="legend-item">
              <span className="legend-color diff-added"></span> Added
            </span>
            <span className="legend-item">
              <span className="legend-color diff-removed"></span> Removed
            </span>
            <span className="legend-item">
              <span className="legend-color diff-unchanged"></span> Unchanged
            </span>
          </div>
          <div className="diff-code">
            {renderDiff()}
          </div>
        </div>
      </div>
    </div>
  );
}

