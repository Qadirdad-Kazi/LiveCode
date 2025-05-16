import React from "react";

export function Navbar({ 
  onSettingsClick, 
  onTemplateClick, 
  onExport,
  onSave,
  onReset,
  isDarkMode,
  onToggleDarkMode,
  toggleTheme
}) {
  return (
    <nav className={`navbar ${isDarkMode ? 'dark-theme' : 'light-theme'}`}>
      {/* Navbar Brand */}
      <div className="navbar-brand">
        <i className="fa fa-code mr-2"></i>
        <span className="text-blue-400">Live</span>
        <span className="text-green-400">Code</span>
      </div>
      
      {/* Navbar Buttons */}
      <div className="navbar-buttons">
        <button onClick={onReset} className="navbar-button">
          <i className="fa fa-file"></i> New
        </button>
        
        <button onClick={onSave} className="navbar-button">
          <i className="fa fa-save"></i> Save
        </button>
        
        <button onClick={onTemplateClick} className="navbar-button">
          <i className="fa fa-file-code"></i> Templates
        </button>
        
        <button onClick={onExport} className="navbar-button">
          <i className="fa fa-download"></i> Export
        </button>
      </div>
      
      {/* Right side buttons */}
      <div className="navbar-buttons">
        <button onClick={toggleTheme} className="navbar-button">
          <i className={`fa fa-${isDarkMode ? 'sun' : 'moon'}`}></i>
          {isDarkMode ? 'Light' : 'Dark'}
        </button>
        
        <button onClick={onSettingsClick} className="navbar-button">
          <i className="fa fa-cog"></i>
          Settings
        </button>
      </div>
    </nav>
  );
}
