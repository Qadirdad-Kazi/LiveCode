import { minify as minifyJS } from 'terser';
import cssnano from 'cssnano';
import postcss from 'postcss';
import { minify as minifyHTML } from 'html-minifier';

export async function minifyCode(type, code) {
  try {
    switch (type) {
      case 'javascript':
      case 'js':
        const jsResult = await minifyJS(code, {
          compress: true,
          mangle: true,
          format: {
            comments: false
          }
        });
        return jsResult.code || code;

      case 'css':
        const cssResult = await postcss([cssnano]).process(code, {
          from: undefined
        });
        return cssResult.css || code;

      case 'html':
        return minifyHTML(code, {
          collapseWhitespace: true,
          removeComments: true,
          minifyCSS: true,
          minifyJS: true,
          removeEmptyElements: false
        });

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

