import React, { useState, useEffect } from "react";

export function SettingsPanel({ settings, onSettingsChange, onClose }) {
  const [activeTab, setActiveTab] = useState('appearance');
  const [localSettings, setLocalSettings] = useState({ ...settings });
  
  // Apply settings only when closing or saving
  const handleSave = () => {
    onSettingsChange(localSettings);
    onClose();
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

  return (
    <div className="fixed inset-0 bg-black bg-opacity-60 flex items-center justify-center z-50 modal-overlay backdrop-blur-sm">
      <div 
        className="
          bg-white dark:bg-gray-800 
          rounded-lg 
          shadow-2xl 
          w-full max-w-md 
          transform transition-all duration-300 ease-in-out
          scale-100 opacity-100
          overflow-hidden
        "
      >
        {/* Header */}
        <div className="bg-gray-50 dark:bg-gray-700 px-6 py-4 border-b border-gray-200 dark:border-gray-600">
          <div className="flex justify-between items-center">
            <h2 className="text-xl font-bold text-gray-800 dark:text-white flex items-center">
              <i className="fa fa-cog mr-2 text-blue-500"></i>
              Editor Settings
            </h2>
            <button 
              onClick={onClose}
              className="
                text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200
                p-1 rounded-full hover:bg-gray-200 dark:hover:bg-gray-600
                transition-colors duration-200
              "
              aria-label="Close"
            >
              <i className="fa fa-times"></i>
            </button>
          </div>
          
          {/* Tabs */}
          <div className="flex mt-4 border-b border-gray-200 dark:border-gray-600">
            <button
              className={`
                px-4 py-2 font-medium text-sm
                ${activeTab === 'appearance' 
                  ? 'text-blue-600 border-b-2 border-blue-600 dark:text-blue-400 dark:border-blue-400' 
                  : 'text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300'}
              `}
              onClick={() => setActiveTab('appearance')}
            >
              <i className="fa fa-paint-brush mr-1"></i> Appearance
            </button>
            <button
              className={`
                px-4 py-2 font-medium text-sm
                ${activeTab === 'editor' 
                  ? 'text-blue-600 border-b-2 border-blue-600 dark:text-blue-400 dark:border-blue-400' 
                  : 'text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300'}
              `}
              onClick={() => setActiveTab('editor')}
            >
              <i className="fa fa-keyboard-o mr-1"></i> Editor
            </button>
          </div>
        </div>
        
        {/* Content */}
        <div className="p-6">
          {activeTab === 'appearance' && (
            <div className="space-y-5 animate-fadeIn">
              {/* Font Size */}
              <div>
                <div className="flex justify-between mb-2">
                  <label className="text-sm font-medium text-gray-700 dark:text-gray-300">
                    Font Size
                  </label>
                  <span className="text-sm text-gray-500 dark:text-gray-400 bg-gray-100 dark:bg-gray-700 px-2 py-0.5 rounded">
                    {localSettings.fontSize}px
                  </span>
                </div>
                <input 
                  type="range" 
                  min="10" 
                  max="24" 
                  value={localSettings.fontSize} 
                  onChange={(e) => handleChange('fontSize', parseInt(e.target.value))}
                  className="
                    w-full h-2 
                    bg-gray-200 dark:bg-gray-700 
                    rounded-lg appearance-none cursor-pointer 
                    accent-blue-600
                  "
                />
                <div className="flex justify-between text-xs text-gray-500 dark:text-gray-400 mt-1">
                  <span>10px</span>
                  <span>24px</span>
                </div>
              </div>
              
              {/* Theme Selection */}
              <div>
                <label className="block mb-2 text-sm font-medium text-gray-700 dark:text-gray-300">
                  Editor Theme
                </label>
                <div className="grid grid-cols-2 gap-3">
                  <button
                    onClick={() => handleChange('theme', 'vs-light')}
                    className={`
                      p-3 border rounded-lg flex items-center justify-center
                      ${localSettings.theme === 'vs-light' 
                        ? 'border-blue-500 ring-2 ring-blue-200 dark:ring-blue-800' 
                        : 'border-gray-300 dark:border-gray-600'}
                      bg-white text-gray-800
                      transition-all duration-200
                    `}
                  >
                    <div className="flex items-center">
                      <i className="fa fa-sun text-yellow-500 mr-2"></i>
                      <span>Light</span>
                    </div>
                  </button>
                  <button
                    onClick={() => handleChange('theme', 'vs-dark')}
                    className={`
                      p-3 border rounded-lg flex items-center justify-center
                      ${localSettings.theme === 'vs-dark' 
                        ? 'border-blue-500 ring-2 ring-blue-200 dark:ring-blue-800' 
                        : 'border-gray-300 dark:border-gray-600'}
                      bg-gray-800 text-white
                      transition-all duration-200
                    `}
                  >
                    <div className="flex items-center">
                      <i className="fa fa-moon text-blue-400 mr-2"></i>
                      <span>Dark</span>
                    </div>
                  </button>
                </div>
              </div>
              
              {/* Minimap */}
              <div className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-700 rounded-lg">
                <div>
                  <label htmlFor="minimap" className="font-medium text-gray-700 dark:text-gray-300 text-sm">
                    Show Minimap
                  </label>
                  <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                    Display a miniature view of your code
                  </p>
                </div>
                <div className="relative inline-block w-12 h-6 transition duration-200 ease-in-out rounded-full">
                  <input 
                    id="minimap" 
                    type="checkbox" 
                    checked={localSettings.minimap} 
                    onChange={(e) => handleChange('minimap', e.target.checked)}
                    className="absolute w-6 h-6 opacity-0 z-10 cursor-pointer"
                  />
                  <span 
                    className={`
                      absolute left-0 top-0 right-0 bottom-0 rounded-full transition-all duration-300
                      ${localSettings.minimap ? 'bg-blue-600' : 'bg-gray-300 dark:bg-gray-600'}
                    `}
                  ></span>
                  <span 
                    className={`
                      absolute w-6 h-6 bg-white rounded-full shadow transform transition-transform duration-300
                      ${localSettings.minimap ? 'translate-x-6' : 'translate-x-0'}
                    `}
                  ></span>
                </div>
              </div>
            </div>
          )}
          
          {activeTab === 'editor' && (
            <div className="space-y-5 animate-fadeIn">
              {/* Tab Size */}
              <div>
                <label className="block mb-2 text-sm font-medium text-gray-700 dark:text-gray-300">
                  Tab Size
                </label>
                <div className="grid grid-cols-3 gap-3">
                  {[2, 4, 8].map(size => (
                    <button
                      key={size}
                      onClick={() => handleChange('tabSize', size)}
                      className={`
                        py-2 px-4 border rounded-lg
                        ${localSettings.tabSize === size 
                          ? 'bg-blue-100 border-blue-500 text-blue-700 dark:bg-blue-900 dark:border-blue-600 dark:text-blue-300' 
                          : 'bg-white border-gray-300 text-gray-700 dark:bg-gray-700 dark:border-gray-600 dark:text-gray-300'}
                        transition-colors duration-200
                      `}
                    >
                      {size} spaces
                    </button>
                  ))}
                </div>
              </div>
              
              {/* Word Wrap */}
              <div className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-700 rounded-lg">
                <div>
                  <label htmlFor="word-wrap" className="font-medium text-gray-700 dark:text-gray-300 text-sm">
                    Word Wrap
                  </label>
                  <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                    Wrap long lines to fit in the editor
                  </p>
                </div>
                <div className="relative inline-block w-12 h-6 transition duration-200 ease-in-out rounded-full">
                  <input 
                    id="word-wrap" 
                    type="checkbox" 
                    checked={localSettings.wordWrap === 'on'} 
                    onChange={(e) => handleChange('wordWrap', e.target.checked ? 'on' : 'off')}
                    className="absolute w-6 h-6 opacity-0 z-10 cursor-pointer"
                  />
                  <span 
                    className={`
                      absolute left-0 top-0 right-0 bottom-0 rounded-full transition-all duration-300
                      ${localSettings.wordWrap === 'on' ? 'bg-blue-600' : 'bg-gray-300 dark:bg-gray-600'}
                    `}
                  ></span>
                  <span 
                    className={`
                      absolute w-6 h-6 bg-white rounded-full shadow transform transition-transform duration-300
                      ${localSettings.wordWrap === 'on' ? 'translate-x-6' : 'translate-x-0'}
                    `}
                  ></span>
                </div>
              </div>
              
              {/* Line Numbers */}
              <div className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-700 rounded-lg">
                <div>
                  <label htmlFor="line-numbers" className="font-medium text-gray-700 dark:text-gray-300 text-sm">
                    Line Numbers
                  </label>
                  <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                    Show line numbers in the editor
                  </p>
                </div>
                <div className="relative inline-block w-12 h-6 transition duration-200 ease-in-out rounded-full">
                  <input 
                    id="line-numbers" 
                    type="checkbox" 
                    checked={localSettings.lineNumbers} 
                    onChange={(e) => handleChange('lineNumbers', e.target.checked)}
                    className="absolute w-6 h-6 opacity-0 z-10 cursor-pointer"
                  />
                  <span 
                    className={`
                      absolute left-0 top-0 right-0 bottom-0 rounded-full transition-all duration-300
                      ${localSettings.lineNumbers ? 'bg-blue-600' : 'bg-gray-300 dark:bg-gray-600'}
                    `}
                  ></span>
                  <span 
                    className={`
                      absolute w-6 h-6 bg-white rounded-full shadow transform transition-transform duration-300
                      ${localSettings.lineNumbers ? 'translate-x-6' : 'translate-x-0'}
                    `}
                  ></span>
                </div>
              </div>
              
              {/* Auto Format */}
              <div className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-700 rounded-lg">
                <div>
                  <label htmlFor="auto-format" className="font-medium text-gray-700 dark:text-gray-300 text-sm">
                    Auto Format Code
                  </label>
                  <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                    Format code on paste and type
                  </p>
                </div>
                <div className="relative inline-block w-12 h-6 transition duration-200 ease-in-out rounded-full">
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
        <div className="bg-gray-50 dark:bg-gray-700 px-6 py-4 border-t border-gray-200 dark:border-gray-600 flex justify-end space-x-3">
          <button 
            onClick={onClose}
            className="
              px-4 py-2 
              border border-gray-300 dark:border-gray-600 
              text-gray-700 dark:text-gray-300 
              rounded-lg 
              hover:bg-gray-100 dark:hover:bg-gray-600
              transition-colors duration-200
            "
          >
            Cancel
          </button>
          <button 
            onClick={handleSave}
            className="
              px-4 py-2 
              bg-blue-600 
              text-white 
              rounded-lg 
              hover:bg-blue-700 
              transition-colors duration-200
              shadow-sm hover:shadow
              transform hover:-translate-y-0.5
            "
          >
            Save Changes
          </button>
        </div>
      </div>
    </div>
  );
}
