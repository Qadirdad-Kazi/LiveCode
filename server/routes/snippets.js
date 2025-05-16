// server/routes/snippets.js

const express = require('express');
const router = express.Router();
const shortid = require('shortid');
const Snippet = require('../models/Snippet');

// Save a new snippet
router.post('/', async (req, res) => {
  try {
    const { html, css, js } = req.body;
    const shortId = shortid.generate();
    const snippet = new Snippet({ html, css, js, shortId });
    await snippet.save();
    res.json({ id: shortId });
  } catch (err) {
    res.status(500).json({ error: 'Failed to save snippet' });
  }
});

// Get a snippet by shortId
router.get('/:id', async (req, res) => {
  try {
    const snippet = await Snippet.findOne({ shortId: req.params.id });
    if (!snippet) return res.status(404).json({ error: 'Snippet not found' });
    res.json(snippet);
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch snippet' });
  }
});

module.exports = router;
