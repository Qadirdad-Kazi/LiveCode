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

app.use(cors());
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

// Test endpoint for connectivity
app.get('/ping', (req, res) => {
  res.json({ message: 'pong' });
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
  console.log(`Using file-based storage at ${dataFilePath}`);
});
