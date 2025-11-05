// Enhanced code snippets library
export const CODE_SNIPPETS = {
  html: [
    {
      id: 'html-button',
      name: 'Button',
      code: '<button class="btn">Click me</button>',
      category: 'UI Elements'
    },
    {
      id: 'html-card',
      name: 'Card',
      code: `<div class="card">
  <div class="card-header">Title</div>
  <div class="card-body">Content goes here</div>
</div>`,
      category: 'UI Elements'
    },
    {
      id: 'html-modal',
      name: 'Modal',
      code: `<div class="modal">
  <div class="modal-content">
    <span class="close">&times;</span>
    <p>Modal content</p>
  </div>
</div>`,
      category: 'UI Elements'
    },
    {
      id: 'html-form',
      name: 'Form',
      code: `<form>
  <input type="text" placeholder="Name">
  <input type="email" placeholder="Email">
  <button type="submit">Submit</button>
</form>`,
      category: 'Forms'
    }
  ],
  css: [
    {
      id: 'css-flex-center',
      name: 'Flexbox Center',
      code: `.container {
  display: flex;
  justify-content: center;
  align-items: center;
}`,
      category: 'Layout'
    },
    {
      id: 'css-grid',
      name: 'CSS Grid',
      code: `.grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 20px;
}`,
      category: 'Layout'
    },
    {
      id: 'css-animation',
      name: 'Fade In Animation',
      code: `@keyframes fadeIn {
  from { opacity: 0; }
  to { opacity: 1; }
}

.element {
  animation: fadeIn 0.5s ease-in;
}`,
      category: 'Animations'
    },
    {
      id: 'css-hover',
      name: 'Hover Effect',
      code: `.button {
  transition: transform 0.3s;
}

.button:hover {
  transform: scale(1.1);
}`,
      category: 'Effects'
    }
  ],
  javascript: [
    {
      id: 'js-debounce',
      name: 'Debounce Function',
      code: `function debounce(func, wait) {
  let timeout;
  return function executedFunction(...args) {
    const later = () => {
      clearTimeout(timeout);
      func(...args);
    };
    clearTimeout(timeout);
    timeout = setTimeout(later, wait);
  };
}`,
      category: 'Utilities'
    },
    {
      id: 'js-fetch',
      name: 'Fetch API',
      code: `async function fetchData(url) {
  try {
    const response = await fetch(url);
    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Error:', error);
  }
}`,
      category: 'API'
    },
    {
      id: 'js-event-listener',
      name: 'Event Listener',
      code: `document.addEventListener('DOMContentLoaded', () => {
  const button = document.querySelector('.btn');
  button.addEventListener('click', () => {
    console.log('Button clicked!');
  });
});`,
      category: 'Events'
    },
    {
      id: 'js-localstorage',
      name: 'LocalStorage',
      code: `// Save
localStorage.setItem('key', 'value');

// Get
const value = localStorage.getItem('key');

// Remove
localStorage.removeItem('key');`,
      category: 'Storage'
    }
  ]
};

export function getSnippetsByCategory(language) {
  const snippets = CODE_SNIPPETS[language] || [];
  const categories = [...new Set(snippets.map(s => s.category))];
  return categories.map(category => ({
    category,
    snippets: snippets.filter(s => s.category === category)
  }));
}

export function searchSnippets(query, language) {
  const snippets = CODE_SNIPPETS[language] || [];
  const lowerQuery = query.toLowerCase();
  return snippets.filter(snippet =>
    snippet.name.toLowerCase().includes(lowerQuery) ||
    snippet.code.toLowerCase().includes(lowerQuery) ||
    snippet.category.toLowerCase().includes(lowerQuery)
  );
}

