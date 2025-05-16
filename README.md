# 🌐 LiveCode - Real-time HTML/CSS/JS Editor

A modern, responsive web application for coding and prototyping web projects in real-time. Inspired by tools like CodePen and JSFiddle, LiveCode provides a seamless environment for writing, testing, and sharing web code.

![LiveCode Screenshot](https://via.placeholder.com/800x450.png?text=LiveCode+Editor)

## ✨ Features

- **Real-time Preview**: See your changes instantly as you type
- **Multi-language Support**: Write HTML, CSS, and JavaScript in separate tabs
- **Dark/Light Theme**: Choose your preferred coding environment
- **Code Formatting**: Automatically format your code with Prettier
- **Console Output**: View JavaScript logs and errors in the integrated console
- **Responsive Design**: Works on desktop and mobile devices
- **Save & Share**: Store your snippets and share them via unique URLs
- **File Export**: Download your work as HTML files
- **Templates**: Choose from various starter templates

---

## 🛠️ Tech Stack

- **Frontend**:
  - React for UI components
  - Monaco Editor (same as VS Code) for code editing
  - Custom CSS for styling
  - Prettier for code formatting

- **Backend**:
  - Node.js and Express for the server
  - File-based storage for snippets (no database required)
  - RESTful API for saving and loading code snippets

## 📂 Project Structure

```
/client
  /src
    /components      # React components
    /styles          # CSS styles
    /utils           # Utility functions and templates
    App.js           # Main application component
    index.js         # Entry point
/server
  app.js            # Express server
  snippets.json     # File storage for code snippets
```

## 🚀 Getting Started

### Prerequisites

- Node.js (v14 or later)
- npm or yarn

### Installation

1. **Clone the repository**

   ```bash
   git clone https://github.com/yourusername/livecode.git
   cd livecode
   ```

1. **Set up the server**

   ```bash
   cd server
   npm install
   npm start
   ```

   The server will run on [http://localhost:4000](http://localhost:4000)

1. **Set up the client**

   ```bash
   cd client
   npm install
   npm start
   ```

   The application will open in your browser at [http://localhost:3000](http://localhost:3000)

## 📝 Usage Guide

### Basic Usage

1. **Write Code**: Use the HTML, CSS, and JavaScript tabs to write your code
2. **See Changes**: Your code will be rendered in real-time in the preview panel
3. **Format Code**: Click the format button in each tab to beautify your code
4. **Toggle Theme**: Switch between light and dark themes using the theme toggle

### Advanced Features

1. **Save Your Work**: Click the Save button to store your code and get a shareable link
2. **Export Code**: Download your work as an HTML file with embedded CSS and JavaScript
3. **Use Templates**: Start from pre-built templates for common web components
4. **View Console**: Check JavaScript console output in the console panel
5. **Responsive Testing**: Resize the browser to test your design on different screen sizes

---

## 🛠️ Customization & Extension

- Add user authentication (JWT) for private snippets/history.
- Add collaborative editing features.
- Integrate HTML/JS validation or linting.
- Deploy backend to cloud (Render, Heroku, etc.) and frontend to Vercel/Netlify.

---

## 🙏 Credits

- [Monaco Editor](https://microsoft.github.io/monaco-editor/)
- [Prettier](https://prettier.io/)
- [Tailwind CSS](https://tailwindcss.com/)
- [CodePen](https://codepen.io/), [JSFiddle](https://jsfiddle.net/)

---

**Enjoy coding in your own live playground!**