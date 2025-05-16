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
  }
];
