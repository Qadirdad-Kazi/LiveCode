// Linting utilities for real-time error detection
// Note: Full ESLint/Stylelint requires server-side processing
// This is a simplified browser-compatible version

// Basic JavaScript linting (browser-compatible)
export async function lintJavaScript(code) {
  const errors = [];
  const lines = code.split('\n');
  
  lines.forEach((line, index) => {
    const lineNum = index + 1;
    
    // Check for common issues
    // Unclosed brackets
    const openBrackets = (line.match(/\{/g) || []).length;
    const closeBrackets = (line.match(/\}/g) || []).length;
    if (Math.abs(openBrackets - closeBrackets) > 0) {
      errors.push({
        severity: 'warning',
        message: 'Possible unclosed bracket',
        line: lineNum,
        column: 1
      });
    }
    
    // Check for common typos
    if (line.includes('fucntion')) {
      errors.push({
        severity: 'error',
        message: "Typo: 'fucntion' should be 'function'",
        line: lineNum,
        column: line.indexOf('fucntion')
      });
    }
    
    // Check for undefined variables (basic check)
    if (line.match(/\bundefined\b/) && !line.includes('let') && !line.includes('const') && !line.includes('var')) {
      errors.push({
        severity: 'warning',
        message: 'Possible undefined variable',
        line: lineNum,
        column: 1
      });
    }
  });
  
  return errors;
}

// Basic CSS linting
export async function lintCSS(code) {
  const errors = [];
  const lines = code.split('\n');
  
  lines.forEach((line, index) => {
    const lineNum = index + 1;
    
    // Check for invalid hex colors
    const hexColorMatch = line.match(/#[0-9a-fA-F]{1,6}/g);
    if (hexColorMatch) {
      hexColorMatch.forEach(match => {
        if (match.length !== 4 && match.length !== 7) {
          errors.push({
            severity: 'error',
            message: `Invalid hex color: ${match}`,
            line: lineNum,
            column: line.indexOf(match)
          });
        }
      });
    }
    
    // Check for missing semicolons (basic)
    if (line.includes(':') && !line.includes(';') && !line.trim().endsWith('{') && !line.trim().endsWith('}')) {
      errors.push({
        severity: 'warning',
        message: 'Missing semicolon',
        line: lineNum,
        column: line.length
      });
    }
  });
  
  return errors;
}

// Lint HTML (basic validation)
export function lintHTML(code) {
  const errors = [];
  
  // Check for unclosed tags (basic check)
  const openTags = code.match(/<[^/][^>]*>/g) || [];
  const closeTags = code.match(/<\/[^>]+>/g) || [];
  
  // Basic validation
  const tagStack = [];
  const tagRegex = /<\/?([a-z][a-z0-9]*)\b[^>]*>/gi;
  let match;
  
  while ((match = tagRegex.exec(code)) !== null) {
    const tagName = match[1].toLowerCase();
    const isClosing = match[0].startsWith('</');
    
    if (isClosing) {
      if (tagStack.length === 0 || tagStack[tagStack.length - 1] !== tagName) {
        errors.push({
          severity: 'error',
          message: `Unexpected closing tag: </${tagName}>`,
          line: code.substring(0, match.index).split('\n').length,
          column: match.index
        });
      } else {
        tagStack.pop();
      }
    } else if (!match[0].endsWith('/>')) {
      // Self-closing tags are handled, skip them
      tagStack.push(tagName);
    }
  }
  
  // Check for remaining unclosed tags
  tagStack.forEach(tag => {
    errors.push({
      severity: 'warning',
      message: `Unclosed tag: <${tag}>`,
      line: 1,
      column: 0
    });
  });
  
  return errors;
}

