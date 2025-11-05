// server/app.js

const express = require('express');
const cors = require('cors');
const fs = require('fs');
const path = require('path');
const axios = require('axios');
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
  const { html, css, js, title, description } = req.body;
  
  if (!html && !css && !js) {
    return res.status(400).json({ message: 'At least one of html, css, or js is required' });
  }
  
  const newSnippet = {
    id: Date.now().toString(),
    title: title || 'Untitled Snippet',
    description: description || '',
    html: html || '',
    css: css || '',
    js: js || '',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  };
  
  snippetsData.push(newSnippet);
  saveData();
  
  res.status(201).json(newSnippet);
});

app.put('/snippets/:id', (req, res) => {
  const { html, css, js, title, description } = req.body;
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

// Gist endpoints (requires GITHUB_TOKEN in env for authenticated operations)
app.post('/gists', async (req, res) => {
  try {
    const githubToken = process.env.GITHUB_TOKEN;
    if (!githubToken) {
      return res.status(400).json({ message: 'GITHUB_TOKEN not configured on server' });
    }

    const { snippetId, html, css, js, title, description, public: isPublic = false } = req.body;

    let snippetPayload = { html: html || '', css: css || '', js: js || '', title: title || 'LiveCode Snippet', description: description || '' };

    if (snippetId) {
      const found = snippetsData.find(s => s.id === snippetId);
      if (!found) return res.status(404).json({ message: 'Snippet not found' });
      snippetPayload = { html: found.html, css: found.css, js: found.js, title: found.title, description: found.description };
    }

    const files = {};
    files['index.html'] = { content: `<!-- ${snippetPayload.title} -->\n${snippetPayload.html}` };
  files['style.css'] = { content: snippetPayload.css };
  files['script.js'] = { content: snippetPayload.js };

    // Create gist request body
    const gistBody = {
      description: snippetPayload.description || snippetPayload.title,
      public: !!isPublic,
      files
    };

    const response = await axios.post('https://api.github.com/gists', gistBody, {
      headers: {
        Authorization: `token ${githubToken}`,
        'User-Agent': 'LiveCode-App'
      }
    });

    return res.status(201).json(response.data);
  } catch (error) {
    console.error('Error creating gist:', error?.response?.data || error.message);
    return res.status(500).json({ message: 'Failed to create gist', error: error?.response?.data || error.message });
  }
});

// Import gist by ID and create a snippet from it
app.get('/gists/:gistId', async (req, res) => {
  try {
    const gistId = req.params.gistId;
    const response = await axios.get(`https://api.github.com/gists/${gistId}`, {
      headers: { 'User-Agent': 'LiveCode-App' }
    });

    const gist = response.data;
    const files = gist.files || {};
    const html = files['index.html']?.content || files['index.htm']?.content || '';
    const css = files['style.css']?.content || '';
    const js = files['script.js']?.content || '';

    const newSnippet = {
      id: Date.now().toString(),
      title: gist.description || `Imported gist ${gistId}`,
      description: gist.description || '',
      html,
      css,
      js,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };

    snippetsData.push(newSnippet);
    saveData();

    res.json(newSnippet);
  } catch (error) {
    console.error('Error importing gist:', error?.response?.data || error.message);
    res.status(500).json({ message: 'Failed to import gist', error: error?.response?.data || error.message });
  }
});

// Start listening when run directly (keeps app usable by tests when required)
if (require.main === module) {
  app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
    console.log(`Using file-based storage at ${dataFilePath}`);
  });
}

module.exports = app;
