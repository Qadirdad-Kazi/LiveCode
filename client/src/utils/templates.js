export const templates = [
  {
    id: 'html-boilerplate',
    name: 'HTML5 Boilerplate',
    description: 'A basic HTML5 starter template',
    tags: ['HTML', 'Starter'],
    html: `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>My Page</title>
</head>
<body>
  <header>
    <h1>Welcome to My Page</h1>
  </header>
  
  <main>
    <section>
      <h2>About</h2>
      <p>This is a simple HTML5 boilerplate template.</p>
    </section>
  </main>
  
  <footer>
    <p>&copy; 2025 My Website</p>
  </footer>
</body>
</html>`,
    css: `/* Basic Reset */
* {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
}

body {
  font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
  line-height: 1.6;
  color: #333;
  max-width: 1200px;
  margin: 0 auto;
  padding: 20px;
}

header, footer {
  text-align: center;
  padding: 20px 0;
  margin-bottom: 20px;
}

footer {
  margin-top: 40px;
  font-size: 0.9rem;
  color: #666;
  border-top: 1px solid #eee;
}

h1 {
  color: #2c3e50;
}

h2 {
  margin-bottom: 15px;
  color: #3498db;
}

section {
  margin-bottom: 30px;
}`,
    js: `// You can add your JavaScript here
console.log('HTML5 Boilerplate loaded!');

// Example: Add a click event to the h1
document.addEventListener('DOMContentLoaded', () => {
  const heading = document.querySelector('h1');
  if (heading) {
    heading.addEventListener('click', () => {
      alert('Welcome to my page!');
    });
  }
});`
  },
  {
    id: 'react-umd-starter',
    name: 'React (UMD) Starter',
    description: 'A minimal React starter using UMD builds (good for quick demos).',
    tags: ['react', 'javascript', 'framework'],
    languages: ['html', 'css', 'javascript'],
    libraries: [
      { name: 'React', cdn: 'https://unpkg.com/react@17/umd/react.development.js', type: 'script' },
      { name: 'React DOM', cdn: 'https://unpkg.com/react-dom@17/umd/react-dom.development.js', type: 'script' }
    ],
    html: `<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>React UMD Starter</title>
  </head>
  <body>
    <div id="root"></div>
  </body>
</html>`,
    css: `/* Simple centering */
body { font-family: Arial, Helvetica, sans-serif; display:flex; align-items:center; justify-content:center; height:100vh; margin:0; }
#root { width:90%; max-width:720px; text-align:center; }`,
    js: `// React (UMD) example
const e = React.createElement;
ReactDOM.render(
  e('div', null, e('h1', null, 'Hello from React (UMD)!'), e('p', null, 'This is a quick demo.')),
  document.getElementById('root')
);`
  },
  {
    id: 'vue3-starter',
    name: 'Vue 3 Starter',
    description: 'A small Vue 3 starter using the global build.',
    tags: ['vue', 'javascript', 'framework'],
    languages: ['html', 'css', 'javascript'],
    libraries: [
      { name: 'Vue 3', cdn: 'https://unpkg.com/vue@3/dist/vue.global.js', type: 'script' }
    ],
    html: `<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>Vue 3 Starter</title>
  </head>
  <body>
    <div id="app">
      <h1>{{ message }}</h1>
    </div>
  </body>
</html>`,
    css: `body { font-family: Inter, system-ui, -apple-system, 'Segoe UI', Roboto, 'Helvetica Neue', Arial; padding: 40px; }
#app { text-align: center; }`,
    js: `const { createApp } = Vue;
createApp({
  data() { return { message: 'Hello from Vue 3!' } }
}).mount('#app');`
  },
  {
    id: 'tailwind-starter',
    name: 'Tailwind CDN Starter',
    description: 'Start with Tailwind via the CDN (good for quick layouts).',
    tags: ['tailwind', 'css', 'utility'],
    languages: ['html', 'css'],
    libraries: [
      { name: 'Tailwind CDN', cdn: 'https://cdn.tailwindcss.com', type: 'script' }
    ],
    html: `<!doctype html>
<html>
  <head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width,initial-scale=1">
    <title>Tailwind Starter</title>
  </head>
  <body class="bg-gray-100">
    <div class="min-h-screen flex items-center justify-center">
      <div class="bg-white rounded-lg shadow p-8 max-w-xl w-full">
        <h1 class="text-2xl font-bold mb-4">Tailwind CDN Starter</h1>
        <p class="text-gray-600">This uses the Tailwind CDN for quick prototyping.</p>
      </div>
    </div>
  </body>
</html>`,
    css: `/* Tailwind via CDN handles most styles; include small additions here */
` ,
    js: `// Tailwind loaded via CDN; add JS here if needed
console.log('Tailwind demo loaded');`
  },
  {
    id: 'jquery-quick',
    name: 'jQuery Quick',
    description: 'Simple jQuery example wired via CDN.',
    tags: ['jquery', 'javascript'],
    languages: ['html', 'css', 'javascript'],
    libraries: [
      { name: 'jQuery', cdn: 'https://code.jquery.com/jquery-3.7.1.min.js', type: 'script' }
    ],
    html: `<!DOCTYPE html>
<html>
  <head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width,initial-scale=1">
    <title>jQuery Quick</title>
  </head>
  <body>
    <div style="padding:40px; text-align:center;">
      <button id="btn">Click me</button>
      <div id="out" style="margin-top:20px;color:#333"></div>
    </div>
  </body>
</html>`,
    css: `button { padding: 10px 16px; border-radius: 6px; border: none; background:#2563eb; color:white; cursor:pointer; }`,
    js: `$('#btn').on('click', function(){ $('#out').text('Button clicked via jQuery!'); });`
  },
  {
    id: 'responsive-layout',
    name: 'Responsive Flexbox Layout',
    description: 'A responsive layout using flexbox',
    tags: ['CSS', 'Flexbox', 'Responsive'],
    html: `<div class="container">
  <header class="header">
    <h1>Flexbox Layout</h1>
    <nav>
      <ul class="nav-links">
        <li><a href="#">Home</a></li>
        <li><a href="#">About</a></li>
        <li><a href="#">Services</a></li>
        <li><a href="#">Contact</a></li>
      </ul>
    </nav>
  </header>
  
  <div class="main-content">
    <main class="content">
      <h2>Main Content</h2>
      <p>This is a responsive layout using flexbox. Resize the browser to see how it adapts.</p>
      <p>Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nullam in dui mauris.</p>
    </main>
    
    <aside class="sidebar">
      <h3>Sidebar</h3>
      <p>This is the sidebar content.</p>
      <ul>
        <li>Item 1</li>
        <li>Item 2</li>
        <li>Item 3</li>
      </ul>
    </aside>
  </div>
  
  <footer class="footer">
    <p>&copy; 2025 Flexbox Layout</p>
  </footer>
</div>`,
    css: `/* Basic Reset */
* {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
}

body {
  font-family: 'Arial', sans-serif;
  line-height: 1.6;
  color: #333;
}

.container {
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 20px;
  display: flex;
  flex-direction: column;
  min-height: 100vh;
}

/* Header Styles */
.header {
  background-color: #2c3e50;
  color: white;
  padding: 1rem;
  display: flex;
  justify-content: space-between;
  align-items: center;
  flex-wrap: wrap;
}

.nav-links {
  display: flex;
  list-style: none;
}

.nav-links li {
  margin-left: 1rem;
}

.nav-links a {
  color: white;
  text-decoration: none;
}

.nav-links a:hover {
  text-decoration: underline;
}

/* Main Content Styles */
.main-content {
  display: flex;
  flex: 1;
  flex-wrap: wrap;
  margin: 20px 0;
}

.content {
  flex: 3;
  min-width: 60%;
  padding: 20px;
  background-color: #f9f9f9;
}

.sidebar {
  flex: 1;
  min-width: 200px;
  padding: 20px;
  background-color: #f1f1f1;
}

/* Footer Styles */
.footer {
  background-color: #2c3e50;
  color: white;
  text-align: center;
  padding: 1rem;
  margin-top: auto;
}

/* Responsive Adjustments */
@media (max-width: 768px) {
  .header {
    flex-direction: column;
    text-align: center;
  }
  
  .nav-links {
    margin-top: 1rem;
    justify-content: center;
  }
  
  .nav-links li:first-child {
    margin-left: 0;
  }
  
  .main-content {
    flex-direction: column;
  }
  
  .sidebar {
    margin-top: 20px;
  }
}`,
    js: `// Mobile menu toggle functionality
document.addEventListener('DOMContentLoaded', () => {
  // This is just a placeholder for potential JavaScript functionality
  console.log('Responsive layout loaded!');
  
  // You could add a mobile menu toggle here
  // Example:
  // const menuButton = document.createElement('button');
  // menuButton.textContent = 'Menu';
  // menuButton.classList.add('menu-toggle');
  // document.querySelector('.header').prepend(menuButton);
  
  // menuButton.addEventListener('click', () => {
  //   document.querySelector('.nav-links').classList.toggle('show');
  // });
});`
  },
  {
    id: 'interactive-form',
    name: 'Interactive Form',
    description: 'A form with validation and interactive elements',
    tags: ['Form', 'JavaScript', 'Validation'],
    html: `<div class="form-container">
  <h2>Contact Form</h2>
  <form id="contact-form">
    <div class="form-group">
      <label for="name">Name</label>
      <input type="text" id="name" name="name" placeholder="Your name" required>
      <div class="error-message" id="name-error"></div>
    </div>
    
    <div class="form-group">
      <label for="email">Email</label>
      <input type="email" id="email" name="email" placeholder="Your email" required>
      <div class="error-message" id="email-error"></div>
    </div>
    
    <div class="form-group">
      <label for="subject">Subject</label>
      <select id="subject" name="subject">
        <option value="" disabled selected>Choose a subject</option>
        <option value="general">General Inquiry</option>
        <option value="support">Technical Support</option>
        <option value="feedback">Feedback</option>
        <option value="other">Other</option>
      </select>
    </div>
    
    <div class="form-group">
      <label for="message">Message</label>
      <textarea id="message" name="message" placeholder="Your message" rows="5" required></textarea>
      <div class="error-message" id="message-error"></div>
    </div>
    
    <div class="form-group">
      <label class="checkbox-label">
        <input type="checkbox" id="terms" name="terms" required>
        I agree to the terms and conditions
      </label>
      <div class="error-message" id="terms-error"></div>
    </div>
    
    <button type="submit" class="submit-btn">Send Message</button>
  </form>
  
  <div id="form-success" class="success-message hidden">
    Thank you! Your message has been sent successfully.
  </div>
</div>`,
    css: `/* Form Styles */
.form-container {
  max-width: 600px;
  margin: 0 auto;
  padding: 20px;
  background-color: #f9f9f9;
  border-radius: 8px;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
}

h2 {
  text-align: center;
  margin-bottom: 20px;
  color: #333;
}

.form-group {
  margin-bottom: 20px;
}

label {
  display: block;
  margin-bottom: 5px;
  font-weight: bold;
  color: #555;
}

input[type="text"],
input[type="email"],
select,
textarea {
  width: 100%;
  padding: 10px;
  border: 1px solid #ddd;
  border-radius: 4px;
  font-size: 16px;
  transition: border-color 0.3s;
}

input[type="text"]:focus,
input[type="email"]:focus,
select:focus,
textarea:focus {
  border-color: #4CAF50;
  outline: none;
  box-shadow: 0 0 5px rgba(76, 175, 80, 0.3);
}

.checkbox-label {
  display: flex;
  align-items: center;
  font-weight: normal;
}

input[type="checkbox"] {
  margin-right: 10px;
}

.submit-btn {
  display: block;
  width: 100%;
  padding: 12px;
  background-color: #4CAF50;
  color: white;
  border: none;
  border-radius: 4px;
  font-size: 16px;
  cursor: pointer;
  transition: background-color 0.3s;
}

.submit-btn:hover {
  background-color: #45a049;
}

.error-message {
  color: #d9534f;
  font-size: 14px;
  margin-top: 5px;
  min-height: 20px;
}

.success-message {
  text-align: center;
  padding: 20px;
  background-color: #dff0d8;
  color: #3c763d;
  border-radius: 4px;
  margin-top: 20px;
}

.hidden {
  display: none;
}

/* Form validation visual cues */
input:invalid,
textarea:invalid {
  border-color: #d9534f;
}

input:valid,
textarea:valid {
  border-color: #4CAF50;
}`,
    js: `document.addEventListener('DOMContentLoaded', () => {
  const form = document.getElementById('contact-form');
  const formSuccess = document.getElementById('form-success');
  
  // Form validation
  form.addEventListener('submit', (e) => {
    e.preventDefault();
    
    // Reset error messages
    document.querySelectorAll('.error-message').forEach(el => {
      el.textContent = '';
    });
    
    let isValid = true;
    
    // Validate name
    const nameInput = document.getElementById('name');
    if (nameInput.value.trim() === '') {
      document.getElementById('name-error').textContent = 'Name is required';
      isValid = false;
    }
    
    // Validate email
    const emailInput = document.getElementById('email');
    const emailRegex = /^[^\\s@]+@[^\\s@]+\\.[^\\s@]+$/;
    if (!emailRegex.test(emailInput.value)) {
      document.getElementById('email-error').textContent = 'Please enter a valid email address';
      isValid = false;
    }
    
    // Validate message
    const messageInput = document.getElementById('message');
    if (messageInput.value.trim().length < 10) {
      document.getElementById('message-error').textContent = 'Message must be at least 10 characters';
      isValid = false;
    }
    
    // Validate terms checkbox
    const termsInput = document.getElementById('terms');
    if (!termsInput.checked) {
      document.getElementById('terms-error').textContent = 'You must agree to the terms';
      isValid = false;
    }
    
    // If form is valid, show success message
    if (isValid) {
      form.classList.add('hidden');
      formSuccess.classList.remove('hidden');
      
      // In a real application, you would send the form data to a server here
      console.log('Form submitted with data:', {
        name: nameInput.value,
        email: emailInput.value,
        subject: document.getElementById('subject').value,
        message: messageInput.value,
        terms: termsInput.checked
      });
    }
  });
  
  // Real-time validation feedback
  const inputs = form.querySelectorAll('input, textarea, select');
  inputs.forEach(input => {
    input.addEventListener('input', () => {
      // Clear error message when user starts typing
      const errorId = input.id + '-error';
      const errorElement = document.getElementById(errorId);
      if (errorElement) {
        errorElement.textContent = '';
      }
    });
  });
});`
  },
  {
    id: 'dark-mode-toggle',
    name: 'Dark Mode Toggle',
    description: 'A page with dark/light mode toggle functionality',
    tags: ['JavaScript', 'CSS', 'Theme'],
    html: `<div class="theme-container">
  <header>
    <h1>Dark Mode Toggle</h1>
    <div class="theme-toggle">
      <input type="checkbox" id="theme-switch" class="theme-switch">
      <label for="theme-switch" class="theme-label">
        <span class="theme-icon">🌙</span>
        <span class="theme-icon">☀️</span>
        <span class="theme-slider"></span>
      </label>
    </div>
  </header>
  
  <main>
    <section class="content-section">
      <h2>About Dark Mode</h2>
      <p>Dark mode reduces the light emitted by device screens while maintaining the minimum color contrast ratios required for readability.</p>
      <p>Toggle the switch in the header to change between light and dark themes.</p>
    </section>
    
    <section class="content-section">
      <h2>Benefits</h2>
      <ul>
        <li>Reduces eye strain in low-light conditions</li>
        <li>Improves battery life on devices with OLED screens</li>
        <li>Can help some people sleep better if used before bedtime</li>
        <li>Looks cool and modern</li>
      </ul>
    </section>
    
    <section class="content-section">
      <h2>Try It Out</h2>
      <p>Click the toggle switch in the header to see the theme change in real-time.</p>
      <button class="theme-button">Sample Button</button>
    </section>
  </main>
  
  <footer>
    <p>Dark Mode Toggle Example &copy; 2025</p>
  </footer>
</div>`,
    css: `/* Base styles */
:root {
  --bg-primary: #ffffff;
  --bg-secondary: #f5f7fa;
  --text-primary: #333333;
  --text-secondary: #666666;
  --accent-color: #4a6cf7;
  --border-color: #e1e4e8;
  --shadow-color: rgba(0, 0, 0, 0.1);
  --transition-speed: 0.3s;
}

/* Dark theme variables */
.dark-theme {
  --bg-primary: #1a1a2e;
  --bg-secondary: #16213e;
  --text-primary: #e6e6e6;
  --text-secondary: #b0b0b0;
  --accent-color: #6a8fff;
  --border-color: #2a2a3a;
  --shadow-color: rgba(0, 0, 0, 0.3);
}

/* Global styles */
body {
  font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
  background-color: var(--bg-primary);
  color: var(--text-primary);
  line-height: 1.6;
  transition: background-color var(--transition-speed), color var(--transition-speed);
  margin: 0;
  padding: 0;
}

.theme-container {
  max-width: 800px;
  margin: 0 auto;
  padding: 20px;
}

/* Header styles */
header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding-bottom: 20px;
  border-bottom: 1px solid var(--border-color);
  margin-bottom: 30px;
}

h1, h2 {
  color: var(--text-primary);
  transition: color var(--transition-speed);
}

/* Theme toggle styles */
.theme-toggle {
  position: relative;
}

.theme-switch {
  opacity: 0;
  position: absolute;
}

.theme-label {
  display: flex;
  align-items: center;
  justify-content: space-between;
  cursor: pointer;
  width: 60px;
  height: 30px;
  background-color: var(--bg-secondary);
  border-radius: 100px;
  position: relative;
  transition: background-color var(--transition-speed);
  padding: 0 5px;
}

.theme-slider {
  position: absolute;
  top: 2px;
  left: 2px;
  width: 26px;
  height: 26px;
  border-radius: 50%;
  background-color: white;
  transition: transform var(--transition-speed);
  box-shadow: 0 2px 4px var(--shadow-color);
}

.theme-switch:checked + .theme-label .theme-slider {
  transform: translateX(30px);
}

.theme-icon {
  font-size: 14px;
  transition: opacity var(--transition-speed);
}

/* Content section styles */
.content-section {
  background-color: var(--bg-secondary);
  padding: 20px;
  border-radius: 8px;
  margin-bottom: 20px;
  box-shadow: 0 2px 10px var(--shadow-color);
  transition: background-color var(--transition-speed), box-shadow var(--transition-speed);
}

p, li {
  color: var(--text-secondary);
  transition: color var(--transition-speed);
}

ul {
  padding-left: 20px;
}

/* Button styles */
.theme-button {
  background-color: var(--accent-color);
  color: white;
  border: none;
  padding: 10px 20px;
  border-radius: 4px;
  font-weight: bold;
  cursor: pointer;
  transition: background-color var(--transition-speed);
}

.theme-button:hover {
  opacity: 0.9;
}

/* Footer styles */
footer {
  text-align: center;
  padding-top: 20px;
  border-top: 1px solid var(--border-color);
  margin-top: 30px;
  color: var(--text-secondary);
  transition: color var(--transition-speed), border-color var(--transition-speed);
}`,
    js: `document.addEventListener('DOMContentLoaded', () => {
  const themeSwitch = document.getElementById('theme-switch');
  const body = document.body;
  
  // Check for saved theme preference or prefer-color-scheme
  const prefersDarkScheme = window.matchMedia('(prefers-color-scheme: dark)');
  const savedTheme = localStorage.getItem('theme');
  
  // Apply saved theme or use system preference
  if (savedTheme === 'dark' || (!savedTheme && prefersDarkScheme.matches)) {
    body.classList.add('dark-theme');
    themeSwitch.checked = true;
  }
  
  // Toggle theme when switch is clicked
  themeSwitch.addEventListener('change', () => {
    if (themeSwitch.checked) {
      body.classList.add('dark-theme');
      localStorage.setItem('theme', 'dark');
    } else {
      body.classList.remove('dark-theme');
      localStorage.setItem('theme', 'light');
    }
  });
  
  // Sample button click event
  const themeButton = document.querySelector('.theme-button');
  themeButton.addEventListener('click', () => {
    alert(\`You're currently using \${themeSwitch.checked ? 'dark' : 'light'} mode!\`);
  });
  
  // Listen for system theme changes
  prefersDarkScheme.addEventListener('change', (e) => {
    // Only auto-switch if user hasn't manually set a preference
    if (!localStorage.getItem('theme')) {
      if (e.matches) {
        body.classList.add('dark-theme');
        themeSwitch.checked = true;
      } else {
        body.classList.remove('dark-theme');
        themeSwitch.checked = false;
      }
    }
  });
});`
  },
  {
    id: 'pyodide-python',
    name: 'Python (Pyodide) Demo',
    description: 'Run Python in the browser using Pyodide for quick Python experiments.',
    tags: ['python', 'pyodide', 'wasm'],
    languages: ['html', 'css', 'javascript'],
    libraries: [
      { name: 'Pyodide', cdn: 'https://cdn.jsdelivr.net/pyodide/v0.23.4/full/pyodide.js', type: 'script' }
    ],
    html: `<!doctype html>
<html>
  <head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width,initial-scale=1">
    <title>Pyodide Python Demo</title>
  </head>
  <body style="font-family:Inter,system-ui,Arial,Helvetica,sans-serif;padding:24px;">
    <h1>Pyodide: Python in the Browser</h1>
    <textarea id="pycode" style="width:100%;height:120px">print('Hello from Pyodide!')\nfor i in range(3):\n    print(i)</textarea>
    <div style="margin-top:12px;"><button id="run">Run Python</button></div>
    <pre id="output" style="background:#f5f5f5;padding:12px;border-radius:6px;margin-top:12px;white-space:pre-wrap"></pre>
  </body>
</html>`,
    css: `button { padding: 8px 12px; border-radius:6px; border: none; background:#0ea5e9; color:white; cursor:pointer }
#output { min-height: 60px; }`,
    js: `// Wait for pyodide to load
async function main(){
  const output = document.getElementById('output');
  output.textContent = 'Loading Pyodide...';
  const pyodide = await loadPyodide({ indexURL: 'https://cdn.jsdelivr.net/pyodide/v0.23.4/full/' });
  output.textContent = 'Pyodide ready. Click Run.';
  document.getElementById('run').addEventListener('click', async () => {
    output.textContent = '';
    const code = document.getElementById('pycode').value;
    try {
      const result = await pyodide.runPythonAsync(code);
      // When Python prints, it goes to stdout; capture by redirecting later if needed
      output.textContent = result === undefined ? 'Executed (no return value)' : String(result);
    } catch (err) {
      output.textContent = 'Error: ' + err;
    }
  });
}
main();`
  },
  {
    id: 'preact-starter',
    name: 'Preact Starter (UMD)',
    description: 'Small Preact example using the UMD build for tiny React-like demos.',
    tags: ['preact', 'javascript', 'framework'],
    languages: ['html', 'css', 'javascript'],
    libraries: [
      { name: 'Preact', cdn: 'https://unpkg.com/preact@10.13.2/dist/preact.umd.js', type: 'script' }
    ],
    html: `<!doctype html>
<html>
  <head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width,initial-scale=1">
    <title>Preact Starter</title>
  </head>
  <body>
    <div id="app"></div>
  </body>
</html>`,
    css: `body { font-family: Inter, system-ui, Arial, sans-serif; padding:24px; }
#app { max-width:720px; margin:0 auto; }`,
    js: `const { h, render, Component } = preact;
class App extends Component {
  render() {
    return h('div', null, h('h1', null, 'Hello from Preact!'), h('p', null, 'A minimal UMD-based example.'));
  }
}
render(h(App, null), document.getElementById('app'));`
  },
  {
    id: 'd3-visualization',
    name: 'D3.js Visualization',
    description: 'A small D3 bar chart demo.',
    tags: ['d3', 'visualization', 'javascript'],
    languages: ['html', 'css', 'javascript'],
    libraries: [
      { name: 'D3', cdn: 'https://d3js.org/d3.v7.min.js', type: 'script' }
    ],
    html: `<!doctype html>
<html>
  <body>
    <h2 style="font-family:Inter,system-ui;padding:16px 24px">D3 Bar Chart</h2>
    <div id="chart"></div>
  </body>
</html>`,
    css: `#chart svg { width:100%; height:300px; display:block; }
body { margin:0; }`,
    js: `const data = [30, 86, 168, 281, 303, 365];
const width = 600; const height = 300;
const svg = d3.select('#chart').append('svg').attr('viewBox', '0 0 600 300');
const x = d3.scaleBand().domain(d3.range(data.length)).range([0, width]).padding(0.1);
const y = d3.scaleLinear().domain([0, d3.max(data)]).range([height, 0]);
svg.selectAll('rect').data(data).enter().append('rect')
  .attr('x', (d,i)=> x(i))
  .attr('y', d=> y(d))
  .attr('height', d=> height - y(d))
  .attr('width', x.bandwidth())
  .attr('fill', '#3b82f6');`
  },
  {
    id: 'threejs-basic',
    name: 'Three.js Basic',
    description: 'Basic Three.js scene with a rotating cube.',
    tags: ['threejs', '3d', 'webgl'],
    languages: ['html', 'css', 'javascript'],
    libraries: [
      { name: 'Three.js', cdn: 'https://cdnjs.cloudflare.com/ajax/libs/three.js/r152/three.min.js', type: 'script' }
    ],
    html: `<!doctype html>
<html>
  <body style="margin:0;overflow:hidden">
    <canvas id="c"></canvas>
  </body>
</html>`,
    css: `canvas { display:block; width:100vw; height:100vh; }`,
    js: `const canvas = document.getElementById('c');
const renderer = new THREE.WebGLRenderer({ canvas });
const fov = 75; const aspect = innerWidth/innerHeight; const near=0.1; const far=1000;
const camera = new THREE.PerspectiveCamera(fov, aspect, near, far);
camera.position.z = 5;
const scene = new THREE.Scene();
const geometry = new THREE.BoxGeometry();
const material = new THREE.MeshNormalMaterial();
const cube = new THREE.Mesh(geometry, material);
scene.add(cube);
function onResize(){ renderer.setSize(innerWidth, innerHeight); camera.aspect = innerWidth/innerHeight; camera.updateProjectionMatrix(); }
onResize(); window.addEventListener('resize', onResize);
function animate(){ requestAnimationFrame(animate); cube.rotation.x += 0.01; cube.rotation.y += 0.01; renderer.render(scene, camera); }
animate();`
  },
  {
    id: 'chartjs-line',
    name: 'Chart.js Line Chart',
    description: 'Simple Chart.js line chart example.',
    tags: ['chartjs', 'charts', 'visualization'],
    languages: ['html', 'css', 'javascript'],
    libraries: [
      { name: 'Chart.js', cdn: 'https://cdn.jsdelivr.net/npm/chart.js', type: 'script' }
    ],
    html: `<!doctype html>
<html>
  <body style="font-family:Inter,system-ui;padding:24px">
    <canvas id="myChart"></canvas>
  </body>
</html>`,
    css: `canvas { max-width:720px; }`,
    js: `const ctx = document.getElementById('myChart').getContext('2d');
new Chart(ctx, { type: 'line', data: { labels: ['Jan','Feb','Mar','Apr','May','Jun'], datasets: [{ label: 'Sales', data: [12,19,3,5,2,3], borderColor:'#ef4444', tension:0.3 }] }, options: {} });`
  },
  {
    id: 'lodash-utilities',
    name: 'Lodash Utilities',
    description: 'Examples using Lodash utilities loaded from CDN.',
    tags: ['lodash', 'utilities', 'javascript'],
    languages: ['html', 'javascript'],
    libraries: [
      { name: 'Lodash', cdn: 'https://cdn.jsdelivr.net/npm/lodash@4.17.21/lodash.min.js', type: 'script' }
    ],
    html: `<!doctype html>
<html>
  <body style="font-family:Inter,system-ui;padding:24px">
    <pre id="out"></pre>
  </body>
</html>`,
    css: `pre { background:#f8fafc;padding:12px;border-radius:6px; }`,
    js: `const arr = [1,2,3,4,5,6,7,8];
const chunked = _.chunk(arr, 3);
document.getElementById('out').textContent = 'Chunked: ' + JSON.stringify(chunked, null, 2);`
  },
  {
    id: 'bootstrap-starter',
    name: 'Bootstrap 5 Starter',
    description: 'A quick Bootstrap 5 page (CSS + JS) via CDN.',
    tags: ['bootstrap', 'css', 'framework'],
    languages: ['html', 'css'],
    libraries: [
      { name: 'Bootstrap CSS', cdn: 'https://cdn.jsdelivr.net/npm/bootstrap@5.3.0/dist/css/bootstrap.min.css', type: 'css' },
      { name: 'Bootstrap JS', cdn: 'https://cdn.jsdelivr.net/npm/bootstrap@5.3.0/dist/js/bootstrap.bundle.min.js', type: 'script' }
    ],
    html: `<!doctype html>
<html>
  <body class="p-4">
    <div class="container">
      <div class="alert alert-primary" role="alert">Bootstrap CDN starter</div>
      <button class="btn btn-primary">Primary Button</button>
    </div>
  </body>
</html>`,
    css: `/* Bootstrap provides the styles; add minimal custom rules here */`,
    js: `// Bootstrap JS via CDN; add custom JS here if needed` 
  }
];
