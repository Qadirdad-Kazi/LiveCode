import React, { useState, useEffect } from 'react';

const ALL_LANGUAGES = [
  { id: 'html', label: 'HTML', icon: 'html5', default: true },
  { id: 'css', label: 'CSS', icon: 'css3', default: true },
  { id: 'javascript', label: 'JavaScript', icon: 'js', default: true },
  { id: 'java', label: 'Java', icon: 'java', default: false },
  { id: 'php', label: 'PHP', icon: 'php', default: false },
];

export function LanguageSelector({ selectedLanguages, onLanguagesChange, onClose }) {
  const [localSelection, setLocalSelection] = useState(selectedLanguages);

  useEffect(() => {
    setLocalSelection(selectedLanguages);
  }, [selectedLanguages]);

  const toggleLanguage = (langId) => {
    const newSelection = localSelection.includes(langId)
      ? localSelection.filter(id => id !== langId)
      : [...localSelection, langId];
    
    // Ensure at least one language is selected
    if (newSelection.length === 0) {
      return;
    }
    
    setLocalSelection(newSelection);
  };

  const handleSave = () => {
    onLanguagesChange(localSelection);
    onClose();
  };

  const handleReset = () => {
    const defaultLanguages = ALL_LANGUAGES
      .filter(lang => lang.default)
      .map(lang => lang.id);
    setLocalSelection(defaultLanguages);
    onLanguagesChange(defaultLanguages);
    onClose();
  };

  return (
    <div className="language-selector-overlay" onClick={onClose}>
      <div className="language-selector" onClick={(e) => e.stopPropagation()}>
        <div className="language-selector-header">
          <h3>
            <i className="fa fa-language mr-2"></i>
            Select Languages
          </h3>
          <button onClick={onClose} className="language-selector-close">
            <i className="fa fa-times"></i>
          </button>
        </div>

        <div className="language-selector-content">
          <p className="language-selector-description">
            Choose which languages to display in the editor tabs. At least one language must be selected.
          </p>

          <div className="language-list">
            {ALL_LANGUAGES.map(language => {
              const isSelected = localSelection.includes(language.id);
              const isDefault = language.default;
              
              return (
                <div
                  key={language.id}
                  className={`language-item ${isSelected ? 'selected' : ''} ${!isSelected && localSelection.length === 1 ? 'disabled' : ''}`}
                  onClick={() => localSelection.length > 1 || !isSelected ? toggleLanguage(language.id) : null}
                >
                  <div className="language-item-content">
                    <input
                      type="checkbox"
                      checked={isSelected}
                      onChange={() => localSelection.length > 1 || !isSelected ? toggleLanguage(language.id) : null}
                      disabled={isSelected && localSelection.length === 1}
                      className="language-checkbox"
                    />
                    <div className="language-info">
                      <i className={`fab fa-${language.icon} language-icon`}></i>
                      <span className="language-label">{language.label}</span>
                      {isDefault && (
                        <span className="language-badge">Default</span>
                      )}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          <div className="language-selector-info">
            <p>
              <i className="fa fa-info-circle"></i>
              Selected: {localSelection.length} language(s)
            </p>
          </div>
        </div>

        <div className="language-selector-actions">
          <button onClick={handleReset} className="language-reset-btn">
            <i className="fa fa-undo"></i> Reset to Defaults
          </button>
          <div className="language-action-buttons">
            <button onClick={onClose} className="language-cancel-btn">
              Cancel
            </button>
            <button onClick={handleSave} className="language-save-btn">
              <i className="fa fa-check"></i> Save
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

