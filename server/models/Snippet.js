// server/models/Snippet.js

const mongoose = require('mongoose');

const SnippetSchema = new mongoose.Schema({
  html: { type: String, default: '' },
  css: { type: String, default: '' },
  js: { type: String, default: '' },
  createdAt: { type: Date, default: Date.now },
  shortId: { type: String, required: true, unique: true },
});

module.exports = mongoose.model('Snippet', SnippetSchema);
