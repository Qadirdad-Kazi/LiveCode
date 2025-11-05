import React, { forwardRef } from "react";

export const Preview = forwardRef(function Preview({ srcDoc, style = {} }, ref) {
  return (
    <iframe
      ref={ref}
      title="Live Preview"
      srcDoc={srcDoc}
      className="border-0 bg-white dark:bg-gray-900"
      style={{
        width: '100%',
        height: '100%',
        minHeight: '100%',
        border: 'none',
        ...style
      }}
      sandbox="allow-scripts allow-same-origin allow-popups"
      loading="lazy"
    />
  );
});