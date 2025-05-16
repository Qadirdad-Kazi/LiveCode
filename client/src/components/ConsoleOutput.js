import React from "react";

export function ConsoleOutput({ logs }) {
  if (!logs || !logs.length) return <div className="text-gray-500 italic">No console output</div>;
  return (
    <div className="font-mono text-xs overflow-y-auto">
      {logs.map((log, i) => {
        let className = "";
        switch (log.type) {
          case "error":
            className = "text-red-400";
            break;
          case "warn":
            className = "text-yellow-400";
            break;
          case "info":
            className = "text-blue-400";
            break;
          default:
            className = "text-green-300";
        }
        
        return (
          <div key={i} className={className}>
            {Array.isArray(log.data) 
              ? log.data.map(item => 
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