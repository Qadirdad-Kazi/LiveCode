import React, { useState, useEffect } from "react";
import "../styles/settings-panel.css";

export function SettingsPanel({ settings, onSave, onClose, keyboardShortcuts = [] }) {
  const [activeTab, setActiveTab] = useState('appearance');
  const tabs = [
    { id: 'appearance', label: 'Appearance', icon: 'fa-palette' },
    { id: 'editor', label: 'Editor', icon: 'fa-code' },
    { id: 'shortcuts', label: 'Shortcuts', icon: 'fa-keyboard' }
  ];
  const [localSettings, setLocalSettings] = useState({ ...settings });
  
  // Apply settings only when closing or saving
  const handleSave = () => {
    onSave(localSettings);
  };
  
  const handleChange = (key, value) => {
    setLocalSettings(prev => ({
      ...prev,
      [key]: value
    }));
  };
  
  // Handle escape key to close panel
  useEffect(() => {
    const handleEscape = (e) => {
      if (e.key === 'Escape') {
        onClose();
      }
    };
    
    window.addEventListener('keydown', handleEscape);
    return () => window.removeEventListener('keydown', handleEscape);
  }, [onClose]);
  
  // Handle click outside to close panel
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (e.target.classList.contains('modal-overlay')) {
        onClose();
      }
    };
    
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [onClose]);

  // Animation styles
  const overlayAnimation = {
    initial: { opacity: 0 },
    animate: { opacity: 1 },
    exit: { opacity: 0 },
    transition: { duration: 0.2 }
  };

  const panelAnimation = {
    initial: { y: -20, opacity: 0 },
    animate: { y: 0, opacity: 1 },
    exit: { y: 20, opacity: 0 },
    transition: { duration: 0.2, ease: 'easeOut' }
  };

  return (
    <div className="settings-overlay" onClick={(e) => e.target === e.currentTarget && onClose()}>
      <div className="settings-modal">
        {/* Header */}
        <div className="settings-header">
          <h2 className="settings-title">
            <i className="fas fa-cog mr-3 text-blue-500"></i>
            Editor Settings
          </h2>
          <button 
            onClick={onClose}
            className="settings-close"
            aria-label="Close"
          >
            <i className="fas fa-times"></i>
          </button>
        </div>
        
        {/* Tabs */}
        <div className="settings-tabs">
          <ul className="settings-tab-list">
            {tabs.map(tab => (
              <li 
                key={tab.id}
                className={`settings-tab ${activeTab === tab.id ? 'active' : ''}`}
                onClick={() => setActiveTab(tab.id)}
              >
                <i className={`fas ${tab.icon}`}></i>
                {tab.label}
              </li>
            ))}
          </ul>
        </div>
        
        {/* Content */}
        <div className="settings-content">
          {activeTab === 'appearance' && (
            <div className="settings-section">
              <h3 className="settings-section-title">Appearance Settings</h3>
              
              {/* Font Size */}
              <div className="settings-option">
                <label className="settings-label">
                  Font Size: {localSettings.fontSize}px
                </label>
                <div className="settings-control">
                  <input 
                    type="range" 
                    min="10" 
                    max="24" 
                    value={localSettings.fontSize} 
                    onChange={(e) => handleChange('fontSize', parseInt(e.target.value))}
                    className="settings-range"
                  />
                  <div className="settings-range-labels">
                    <span>10px</span>
                    <span>24px</span>
                  </div>
                </div>
              </div>
              
              {/* Theme Selection */}
              <div className="settings-option">
                <label className="settings-label">Editor Theme</label>
                <div className="settings-theme-buttons">
                  <button
                    onClick={() => handleChange('theme', 'vs-light')}
                    className={`settings-theme-button ${localSettings.theme === 'vs-light' ? 'active' : ''}`}
                  >
                    <i className="fa fa-sun"></i> Light
                  </button>
                  <button
                    onClick={() => handleChange('theme', 'vs-dark')}
                    className={`settings-theme-button ${localSettings.theme === 'vs-dark' ? 'active' : ''}`}
                  >
                    <i className="fa fa-moon"></i> Dark
                  </button>
                </div>
              </div>
              
              {/* Minimap Toggle */}
              <div className="settings-option">
                <label className="settings-label">
                  Show Minimap
                  <span className="settings-description">Display a miniature view of your code</span>
                </label>
                <div className="settings-toggle">
                  <input 
                    id="minimap" 
                    type="checkbox" 
                    checked={localSettings.minimap} 
                    onChange={(e) => handleChange('minimap', e.target.checked)}
                    className="settings-toggle-input"
                  />
                  <label htmlFor="minimap" className="settings-toggle-label"></label>
                </div>
              </div>
            </div>
          )}
          
          {activeTab === 'editor' && (
            <div className="settings-section">
              <h3 className="settings-section-title">Editor Settings</h3>
              
              {/* Tab Size */}
              <div className="settings-option">
                <label className="settings-label">Tab Size</label>
                <div className="settings-button-group">
                  {[2, 4, 8].map(size => (
                    <button
                      key={size}
                      onClick={() => handleChange('tabSize', size)}
                      className={`settings-choice-button ${localSettings.tabSize === size ? 'active' : ''}`}
                    >
                      {size} spaces
                    </button>
                  ))}
                </div>
              </div>
              
              {/* Word Wrap */}
              <div className="settings-option">
                <label className="settings-label">
                  Word Wrap
                  <span className="settings-description">Wrap long lines to fit in the editor</span>
                </label>
                <div className="settings-toggle">
                  <input 
                    id="word-wrap" 
                    type="checkbox" 
                    checked={localSettings.wordWrap === 'on'} 
                    onChange={(e) => handleChange('wordWrap', e.target.checked ? 'on' : 'off')}
                    className="settings-toggle-input"
                  />
                  <label htmlFor="word-wrap" className="settings-toggle-label"></label>
                </div>
              </div>
              
              {/* Auto Format */}
              <div className="settings-option">
                <label className="settings-label">
                  Auto Format
                  <span className="settings-description">Automatically format code on save</span>
                </label>
                <div className="settings-toggle">
                  <input 
                    id="auto-format" 
                    type="checkbox" 
                    checked={localSettings.autoFormat} 
                    onChange={(e) => handleChange('autoFormat', e.target.checked)}
                    className="absolute w-6 h-6 opacity-0 z-10 cursor-pointer"
                  />
                  <span 
                    className={`
                      absolute left-0 top-0 right-0 bottom-0 rounded-full transition-all duration-300
                      ${localSettings.autoFormat ? 'bg-blue-600' : 'bg-gray-300 dark:bg-gray-600'}
                    `}
                  ></span>
                  <span 
                    className={`
                      absolute w-6 h-6 bg-white rounded-full shadow transform transition-transform duration-300
                      ${localSettings.autoFormat ? 'translate-x-6' : 'translate-x-0'}
                    `}
                  ></span>
                </div>
              </div>
            </div>
          )}
        </div>
        
        {/* Footer */}
        <div className="settings-actions">
          <button 
            onClick={onClose}
            className="settings-button settings-button-cancel"
          >
            Cancel
          </button>
          <button 
            onClick={handleSave}
            className="settings-button settings-button-save"
          >
            Save Changes
          </button>
        </div>
      </div>
    </div>
  );
}
