import React from "react";

export function ConsoleOutput({ logs }) {
  if (!logs || !logs.length) {
    return (
      <div style={{
        padding: '2rem',
        textAlign: 'center',
        color: 'var(--text-tertiary)',
        fontStyle: 'italic',
        fontSize: '0.875rem'
      }}>
        No console output
      </div>
    );
  }
  
  return (
    <div className="console-output">
      {logs.map((log, i) => {
        let typeClass = `console-log-item ${log.type}`;
        
        return (
          <div key={i} className={typeClass}>
            <span style={{ fontWeight: 600, marginRight: '0.5rem' }}>
              [{log.type.toUpperCase()}]
            </span>
            {Array.isArray(log.data) 
              ? log.data.map((item, idx) => 
                  typeof item === 'object' 
                    ? JSON.stringify(item, null, 2) 
                    : String(item)
                ).join(' ')
              : String(log.data)
            }
          </div>
        );
      })}
    </div>
  );
}