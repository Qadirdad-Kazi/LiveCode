import React, { useState } from 'react';

const POPULAR_LIBRARIES = [
  { name: 'React', cdn: 'https://unpkg.com/react@18/umd/react.production.min.js', type: 'script' },
  { name: 'React DOM', cdn: 'https://unpkg.com/react-dom@18/umd/react-dom.production.min.js', type: 'script' },
  { name: 'Vue 3', cdn: 'https://unpkg.com/vue@3/dist/vue.global.js', type: 'script' },
  { name: 'jQuery', cdn: 'https://code.jquery.com/jquery-3.7.1.min.js', type: 'script' },
  { name: 'Bootstrap CSS', cdn: 'https://cdn.jsdelivr.net/npm/bootstrap@5.3.0/dist/css/bootstrap.min.css', type: 'css' },
  { name: 'Bootstrap JS', cdn: 'https://cdn.jsdelivr.net/npm/bootstrap@5.3.0/dist/js/bootstrap.bundle.min.js', type: 'script' },
  { name: 'Tailwind CSS', cdn: 'https://cdn.tailwindcss.com', type: 'script' },
  { name: 'Lodash', cdn: 'https://cdn.jsdelivr.net/npm/lodash@4.17.21/lodash.min.js', type: 'script' },
  { name: 'Axios', cdn: 'https://cdn.jsdelivr.net/npm/axios/dist/axios.min.js', type: 'script' },
  { name: 'Chart.js', cdn: 'https://cdn.jsdelivr.net/npm/chart.js', type: 'script' },
  { name: 'Font Awesome', cdn: 'https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css', type: 'css' },
  { name: 'Google Fonts', cdn: 'https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap', type: 'css' },
];

export function LibraryPicker({ selectedLibraries = [], onLibrariesChange, onClose }) {
  const [searchTerm, setSearchTerm] = useState('');
  const [customCDN, setCustomCDN] = useState('');
  const [customName, setCustomName] = useState('');

  const filteredLibraries = POPULAR_LIBRARIES.filter(lib =>
    lib.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const toggleLibrary = (library) => {
    const isSelected = selectedLibraries.some(lib => lib.cdn === library.cdn);
    if (isSelected) {
      onLibrariesChange(selectedLibraries.filter(lib => lib.cdn !== library.cdn));
    } else {
      onLibrariesChange([...selectedLibraries, library]);
    }
  };

  const addCustomLibrary = () => {
    if (customCDN && customName) {
      const customLib = {
        name: customName,
        cdn: customCDN,
        type: customCDN.includes('.css') ? 'css' : 'script'
      };
      onLibrariesChange([...selectedLibraries, customLib]);
      setCustomCDN('');
      setCustomName('');
    }
  };

  const removeLibrary = (cdn) => {
    onLibrariesChange(selectedLibraries.filter(lib => lib.cdn !== cdn));
  };

  return (
    <div className="library-picker-overlay" onClick={onClose}>
      <div className="library-picker" onClick={(e) => e.stopPropagation()}>
        <div className="library-picker-header">
          <h3>External Libraries</h3>
          <button onClick={onClose} className="library-picker-close">
            <i className="fa fa-times"></i>
          </button>
        </div>
        
        <div className="library-picker-content">
          <div className="library-search">
            <input
              type="text"
              placeholder="Search libraries..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="library-search-input"
            />
          </div>

          <div className="library-list">
            {filteredLibraries.map(library => {
              const isSelected = selectedLibraries.some(lib => lib.cdn === library.cdn);
              return (
                <div
                  key={library.cdn}
                  className={`library-item ${isSelected ? 'selected' : ''}`}
                  onClick={() => toggleLibrary(library)}
                >
                  <input
                    type="checkbox"
                    checked={isSelected}
                    onChange={() => toggleLibrary(library)}
                  />
                  <div className="library-info">
                    <span className="library-name">{library.name}</span>
                    <span className="library-type">{library.type}</span>
                  </div>
                </div>
              );
            })}
          </div>

          <div className="custom-library">
            <h4>Add Custom Library</h4>
            <input
              type="text"
              placeholder="Library name"
              value={customName}
              onChange={(e) => setCustomName(e.target.value)}
              className="custom-library-input"
            />
            <input
              type="text"
              placeholder="CDN URL"
              value={customCDN}
              onChange={(e) => setCustomCDN(e.target.value)}
              className="custom-library-input"
            />
            <button onClick={addCustomLibrary} className="add-custom-btn">
              Add
            </button>
          </div>

          {selectedLibraries.length > 0 && (
            <div className="selected-libraries">
              <h4>Selected Libraries ({selectedLibraries.length})</h4>
              {selectedLibraries.map(lib => (
                <div key={lib.cdn} className="selected-library-item">
                  <span>{lib.name}</span>
                  <button onClick={() => removeLibrary(lib.cdn)} className="remove-library-btn">
                    <i className="fa fa-times"></i>
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

