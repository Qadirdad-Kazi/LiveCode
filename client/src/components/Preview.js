import React, { forwardRef } from "react";

export const Preview = forwardRef(function Preview({ srcDoc }, ref) {
  return (
    <iframe
      ref={ref}
      title="Live Preview"
      srcDoc={srcDoc}
      className="w-full h-full border-0 bg-white dark:bg-gray-900"
      sandbox="allow-scripts allow-same-origin"
      loading="lazy"
    />
  );
});