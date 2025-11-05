import React, { useState } from 'react';
import { CODE_SNIPPETS, getSnippetsByCategory, searchSnippets } from '../utils/codeSnippets';

export function SnippetLibrary({ language, onInsert, onClose }) {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState(null);

  const snippets = searchQuery
    ? searchSnippets(searchQuery, language)
    : CODE_SNIPPETS[language] || [];

  const categories = getSnippetsByCategory(language);

  const handleInsert = (snippet) => {
    onInsert(snippet.code);
    onClose();
  };

  const filteredSnippets = selectedCategory
    ? snippets.filter(s => s.category === selectedCategory)
    : snippets;

  return (
    <div className="snippet-library-overlay" onClick={onClose}>
      <div className="snippet-library" onClick={(e) => e.stopPropagation()}>
        <div className="snippet-library-header">
          <h3>Code Snippets - {language.toUpperCase()}</h3>
          <button onClick={onClose} className="snippet-library-close">
            <i className="fa fa-times"></i>
          </button>
        </div>

        <div className="snippet-library-content">
          <div className="snippet-search">
            <input
              type="text"
              placeholder="Search snippets..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="snippet-search-input"
            />
          </div>

          <div className="snippet-categories">
            <button
              className={`category-btn ${selectedCategory === null ? 'active' : ''}`}
              onClick={() => setSelectedCategory(null)}
            >
              All
            </button>
            {categories.map(({ category }) => (
              <button
                key={category}
                className={`category-btn ${selectedCategory === category ? 'active' : ''}`}
                onClick={() => setSelectedCategory(category)}
              >
                {category}
              </button>
            ))}
          </div>

          <div className="snippet-list">
            {filteredSnippets.length > 0 ? (
              filteredSnippets.map(snippet => (
                <div key={snippet.id} className="snippet-item">
                  <div className="snippet-header">
                    <span className="snippet-name">{snippet.name}</span>
                    <span className="snippet-category">{snippet.category}</span>
                  </div>
                  <pre className="snippet-preview">{snippet.code}</pre>
                  <button
                    onClick={() => handleInsert(snippet)}
                    className="snippet-insert-btn"
                  >
                    <i className="fa fa-plus"></i> Insert
                  </button>
                </div>
              ))
            ) : (
              <div className="no-snippets">No snippets found</div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

