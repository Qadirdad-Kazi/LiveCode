// server/app.js

const express = require('express');
const cors = require('cors');
const fs = require('fs');
const path = require('path');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 4000;

// In-memory storage for snippets
let snippetsData = [];
const dataFilePath = path.join(__dirname, 'data', 'snippets.json');

// Create data directory if it doesn't exist
if (!fs.existsSync(path.join(__dirname, 'data'))) {
  fs.mkdirSync(path.join(__dirname, 'data'));
}

// Load existing data if available
try {
  if (fs.existsSync(dataFilePath)) {
    const data = fs.readFileSync(dataFilePath, 'utf8');
    snippetsData = JSON.parse(data);
    console.log('Loaded snippets data from file');
  } else {
    // Create empty file
    fs.writeFileSync(dataFilePath, JSON.stringify([]), 'utf8');
    console.log('Created new snippets data file');
  }
} catch (error) {
  console.error('Error loading snippets data:', error);
}

// Save data to file
const saveData = () => {
  try {
    fs.writeFileSync(dataFilePath, JSON.stringify(snippetsData, null, 2), 'utf8');
  } catch (error) {
    console.error('Error saving snippets data:', error);
  }
};

// Configure CORS to allow requests from any origin
app.use(cors({
  origin: '*', // In production, you might want to restrict this to specific domains
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));

app.use(express.json());

// Snippets endpoints
app.get('/snippets', (req, res) => {
  res.json(snippetsData);
});

app.get('/snippets/:id', (req, res) => {
  const snippet = snippetsData.find(s => s.id === req.params.id);
  if (!snippet) {
    return res.status(404).json({ message: 'Snippet not found' });
  }
  res.json(snippet);
});

app.post('/snippets', (req, res) => {
  const { html, css, js, java, php, title, description } = req.body;
  
  if (!html && !css && !js && !java && !php) {
    return res.status(400).json({ message: 'At least one of html, css, js, java, or php is required' });
  }
  
  const newSnippet = {
    id: Date.now().toString(),
    title: title || 'Untitled Snippet',
    description: description || '',
    html: html || '',
    css: css || '',
    js: js || '',
    java: java || '',
    php: php || '',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  };
  
  snippetsData.push(newSnippet);
  saveData();
  
  res.status(201).json(newSnippet);
});

app.put('/snippets/:id', (req, res) => {
  const { html, css, js, java, php, title, description } = req.body;
  const index = snippetsData.findIndex(s => s.id === req.params.id);
  
  if (index === -1) {
    return res.status(404).json({ message: 'Snippet not found' });
  }
  
  const updatedSnippet = {
    ...snippetsData[index],
    title: title || snippetsData[index].title,
    description: description || snippetsData[index].description,
    html: html !== undefined ? html : snippetsData[index].html,
    css: css !== undefined ? css : snippetsData[index].css,
    js: js !== undefined ? js : snippetsData[index].js,
    java: java !== undefined ? java : snippetsData[index].java,
    php: php !== undefined ? php : snippetsData[index].php,
    updatedAt: new Date().toISOString()
  };
  
  snippetsData[index] = updatedSnippet;
  saveData();
  
  res.json(updatedSnippet);
});

app.delete('/snippets/:id', (req, res) => {
  const index = snippetsData.findIndex(s => s.id === req.params.id);
  
  if (index === -1) {
    return res.status(404).json({ message: 'Snippet not found' });
  }
  
  snippetsData.splice(index, 1);
  saveData();
  
  res.status(204).send();
});

// Root route handler
app.get('/', (req, res) => {
  res.json({ message: 'LiveCode API is running', version: '1.0.0' });
});

// Test endpoint for connectivity
app.get('/ping', (req, res) => {
  res.json({ message: 'pong' });
});

// Java execution endpoints
const { exec } = require('child_process');
const fs = require('fs');
const path = require('path');

// Compile Java code
app.post('/compile/java', (req, res) => {
  const { code } = req.body;
  
  if (!code) {
    return res.status(400).json({ message: 'Java code is required' });
  }

  // Create a temporary directory for Java files
  const tempDir = path.join(__dirname, 'temp');
  if (!fs.existsSync(tempDir)) {
    fs.mkdirSync(tempDir, { recursive: true });
  }

  // Extract class name from code (simple extraction)
  const classMatch = code.match(/public\s+class\s+(\w+)/);
  const className = classMatch ? classMatch[1] : 'Main';
  
  const javaFilePath = path.join(tempDir, `${className}.java`);
  fs.writeFileSync(javaFilePath, code);

  // Compile Java code
  exec(`javac ${javaFilePath}`, { timeout: 5000 }, (error, stdout, stderr) => {
    if (error) {
      // Clean up
      if (fs.existsSync(javaFilePath)) {
        fs.unlinkSync(javaFilePath);
      }
      return res.status(400).json({
        success: false,
        error: stderr || error.message,
        output: stdout
      });
    }

    res.json({
      success: true,
      message: 'Java code compiled successfully',
      className: className
    });
  });
});

// Execute Java code
app.post('/execute/java', (req, res) => {
  const { code } = req.body;
  
  if (!code) {
    return res.status(400).json({ message: 'Java code is required' });
  }

  const tempDir = path.join(__dirname, 'temp');
  if (!fs.existsSync(tempDir)) {
    fs.mkdirSync(tempDir, { recursive: true });
  }

  const classMatch = code.match(/public\s+class\s+(\w+)/);
  const className = classMatch ? classMatch[1] : 'Main';
  
  const javaFilePath = path.join(tempDir, `${className}.java`);
  fs.writeFileSync(javaFilePath, code);

  // Compile first, then execute
  exec(`javac ${javaFilePath}`, { timeout: 5000 }, (compileError, compileStdout, compileStderr) => {
    if (compileError) {
      if (fs.existsSync(javaFilePath)) {
        fs.unlinkSync(javaFilePath);
      }
      return res.status(400).json({
        success: false,
        error: compileStderr || compileError.message,
        output: compileStdout,
        type: 'compilation'
      });
    }

    // Execute compiled Java code
    exec(`cd ${tempDir} && java ${className}`, { timeout: 5000 }, (execError, execStdout, execStderr) => {
      // Clean up
      const classFile = path.join(tempDir, `${className}.class`);
      if (fs.existsSync(javaFilePath)) {
        fs.unlinkSync(javaFilePath);
      }
      if (fs.existsSync(classFile)) {
        fs.unlinkSync(classFile);
      }

      if (execError) {
        return res.status(400).json({
          success: false,
          error: execStderr || execError.message,
          output: execStdout,
          type: 'execution'
        });
      }

      res.json({
        success: true,
        output: execStdout,
        error: execStderr || null
      });
    });
  });
});

// PHP execution endpoint
app.post('/execute/php', (req, res) => {
  const { code } = req.body;
  
  if (!code) {
    return res.status(400).json({ message: 'PHP code is required' });
  }

  const tempDir = path.join(__dirname, 'temp');
  if (!fs.existsSync(tempDir)) {
    fs.mkdirSync(tempDir, { recursive: true });
  }

  const phpFilePath = path.join(tempDir, `script_${Date.now()}.php`);
  fs.writeFileSync(phpFilePath, code);

  // Execute PHP code
  exec(`php ${phpFilePath}`, { timeout: 5000 }, (error, stdout, stderr) => {
    // Clean up
    if (fs.existsSync(phpFilePath)) {
      fs.unlinkSync(phpFilePath);
    }

    if (error) {
      return res.status(400).json({
        success: false,
        error: stderr || error.message,
        output: stdout,
        type: 'execution'
      });
    }

    res.json({
      success: true,
      output: stdout,
      error: stderr || null
    });
  });
});

// Start listening when run directly (keeps app usable by tests when required)
if (require.main === module) {
  app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
    console.log(`Using file-based storage at ${dataFilePath}`);
  });
}

module.exports = app;
