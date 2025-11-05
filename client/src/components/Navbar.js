import React, { useState, useEffect } from "react";

export function Navbar({ 
  onSettingsClick, 
  onTemplateClick, 
  onExport,
  onSave,
  onReset,
  onSaveToGist,
  onImportFromGist,
  isDarkMode,
  onToggleDarkMode,
  toggleTheme
}) {
  const [isMobile, setIsMobile] = useState(window.innerWidth < 768);
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 768);
      if (window.innerWidth >= 768) {
        setIsMenuOpen(false);
      }
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  const handleNavClick = (handler) => {
    if (handler) handler();
    if (isMobile) {
      setIsMenuOpen(false);
    }
  };

  return (
    <nav className={`navbar ${isDarkMode ? 'dark-theme' : 'light-theme'} ${isMenuOpen ? 'menu-open' : ''}`}>
      <div className="navbar-header">
        <div className="navbar-brand">
          <i className="fa fa-code mr-2"></i>
          <span className="text-blue-400">Live</span>
          <span className="text-green-400">Code</span>
        </div>
        <button 
          className="mobile-menu-toggle" 
          onClick={toggleMenu}
          aria-label="Toggle menu"
          aria-expanded={isMenuOpen}
        >
          <i className={`fa ${isMenuOpen ? 'fa-times' : 'fa-bars'}`}></i>
        </button>
      </div>
      
      <div className="navbar-content">
        {/* Main action buttons */}
        <div className="button-group main-actions">
          <button onClick={() => handleNavClick(onReset)} className="navbar-button">
            <i className="fa fa-file"></i> {!isMobile && 'New'}
          </button>
          
          <button onClick={() => handleNavClick(onSave)} className="navbar-button">
            <i className="fa fa-save"></i> {!isMobile && 'Save'}
          </button>

          <button onClick={() => { if (onSaveToGist) onSaveToGist(); }} className="navbar-button">
            <i className="fa fa-github"></i> {!isMobile && 'Save to Gist'}
          </button>

          <button onClick={() => { if (onImportFromGist) onImportFromGist(); }} className="navbar-button">
            <i className="fa fa-download"></i> {!isMobile && 'Import Gist'}
          </button>
          
          <button onClick={onTemplateClick} className="navbar-button">
            <i className="fa fa-file-code"></i> {(!isMobile || isMenuOpen) && 'Templates'}
          </button>
          
          <button onClick={onExport} className="navbar-button">
            <i className="fa fa-download"></i> {(!isMobile || isMenuOpen) && 'Export'}
          </button>
        </div>
        
        {/* Settings buttons */}
        <div className="button-group settings-actions">
          <button onClick={toggleTheme} className="navbar-button">
            <i className={`fa fa-${isDarkMode ? 'sun' : 'moon'}`}></i>
            {(!isMobile || isMenuOpen) && (isDarkMode ? 'Light' : 'Dark')}
          </button>
          
          <button onClick={onSettingsClick} className="navbar-button">
            <i className="fa fa-cog"></i>
            {(!isMobile || isMenuOpen) && 'Settings'}
          </button>
        </div>
      </div>
    </nav>
  );
}
