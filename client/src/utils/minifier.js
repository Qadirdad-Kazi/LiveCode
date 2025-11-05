// Browser-compatible minifiers

// CSS minifier
function minifyCSS(css) {
  return css
    // Remove comments
    .replace(/\/\*[\s\S]*?\*\//g, '')
    // Remove whitespace around rules
    .replace(/\s*([{}:;,])\s*/g, '$1')
    // Remove leading/trailing whitespace
    .trim()
    // Remove empty rules
    .replace(/[^{}]+{\s*}/g, '')
    // Remove multiple spaces
    .replace(/\s+/g, ' ')
    // Remove spaces around operators
    .replace(/\s*([=~|^$*])\s*/g, '$1');
}

// JavaScript minifier (basic)
function minifyJS(code) {
  return code
    // Remove single-line comments
    .replace(/\/\/.*$/gm, '')
    // Remove multi-line comments
    .replace(/\/\*[\s\S]*?\*\//g, '')
    // Remove leading/trailing whitespace
    .trim()
    // Remove multiple spaces/newlines
    .replace(/\s+/g, ' ')
    // Remove spaces around operators (but be careful with strings)
    .replace(/\s*([=+\-*/%!&|<>?])\s*/g, '$1')
    // Remove spaces around semicolons and commas
    .replace(/\s*([;,])\s*/g, '$1')
    // Remove spaces around brackets (but keep string content)
    .replace(/\s*([(){}[\]])\s*/g, '$1');
}

// HTML minifier (basic)
function minifyHTML(html) {
  return html
    // Remove HTML comments
    .replace(/<!--[\s\S]*?-->/g, '')
    // Remove whitespace between tags
    .replace(/>\s+</g, '><')
    // Remove leading/trailing whitespace
    .trim()
    // Collapse multiple spaces
    .replace(/\s+/g, ' ')
    // Remove spaces around attributes
    .replace(/\s*=\s*/g, '=')
    .replace(/\s+>/g, '>');
}

export async function minifyCode(type, code) {
  try {
    switch (type) {
      case 'javascript':
      case 'js':
        return minifyJS(code);

      case 'css':
        return minifyCSS(code);

      case 'html':
        return minifyHTML(code);

      default:
        return code;
    }
  } catch (error) {
    console.error('Minification error:', error);
    return code; // Return original code if minification fails
  }
}

export async function minifyAll(html, css, js) {
  const [minifiedHtml, minifiedCss, minifiedJs] = await Promise.all([
    minifyCode('html', html),
    minifyCode('css', css),
    minifyCode('javascript', js)
  ]);

  return {
    html: minifiedHtml,
    css: minifiedCss,
    js: minifiedJs
  };
}
