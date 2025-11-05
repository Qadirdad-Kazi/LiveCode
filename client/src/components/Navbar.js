import React, { useState, useEffect, useRef } from "react";

export function Navbar({ 
  onTemplateClick, 
  onExport,
  onSave,
  onReset,
  isDarkMode,
  onMinify,
  onExportScreenshot,
  onExportPDF,
  onSnippetLibrary,
  onLibraryPicker,
  onLanguageSelector
}) {
  const [isMobile, setIsMobile] = useState(window.innerWidth < 768);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [showLibraries, setShowLibraries] = useState(false);
  const [showLanguages, setShowLanguages] = useState(false);
  const containerRef = useRef(null);

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

  // Close dropdowns when clicking outside
  useEffect(() => {
    const onDocClick = (e) => {
      if (!containerRef.current) return;
      if (!containerRef.current.contains(e.target)) {
        setShowLibraries(false);
        setShowLanguages(false);
      }
    };

    document.addEventListener('click', onDocClick);
    return () => document.removeEventListener('click', onDocClick);
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
    <nav ref={containerRef} className={`navbar ${isDarkMode ? 'dark-theme' : 'light-theme'} ${isMenuOpen ? 'menu-open' : ''}`}>
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

          <button onClick={onTemplateClick} className="navbar-button">
            <i className="fa fa-file-code"></i> {(!isMobile || isMenuOpen) && 'Templates'}
          </button>
          
          <button onClick={onExport} className="navbar-button">
            <i className="fa fa-download"></i> {(!isMobile || isMenuOpen) && 'Export'}
          </button>
          
          <button onClick={onMinify} className="navbar-button" title="Minify Code">
            <i className="fa fa-compress"></i> {(!isMobile || isMenuOpen) && 'Minify'}
          </button>
          
          <button onClick={onExportScreenshot} className="navbar-button" title="Export Screenshot">
            <i className="fa fa-camera"></i> {(!isMobile || isMenuOpen) && 'Screenshot'}
          </button>
          
          <button onClick={onExportPDF} className="navbar-button" title="Export PDF">
            <i className="fa fa-file-pdf"></i> {(!isMobile || isMenuOpen) && 'PDF'}
          </button>
          
          <button onClick={onSnippetLibrary} className="navbar-button" title="Code Snippets">
            <i className="fa fa-code"></i> {(!isMobile || isMenuOpen) && 'Snippets'}
          </button>
          
          <div className="nav-dropdown-wrapper" style={{ position: 'relative' }}>
            <button onClick={() => { setShowLibraries(!showLibraries); setShowLanguages(false); }} className="navbar-button" title="Add Libraries">
              <i className="fa fa-book"></i> {(!isMobile || isMenuOpen) && 'Libraries'}
            </button>
            {showLibraries && (
              <div className="nav-dropdown nav-dropdown-right">
                <button className="nav-dropdown-item" onClick={() => { setShowLibraries(false); if (onLibraryPicker) onLibraryPicker(); }}>Add Libraries</button>
                <button className="nav-dropdown-item" onClick={() => { setShowLibraries(false); if (onSnippetLibrary) onSnippetLibrary(); }}>Open Snippets</button>
              </div>
            )}
          </div>
          
          <div className="nav-dropdown-wrapper" style={{ position: 'relative' }}>
            <button onClick={() => { setShowLanguages(!showLanguages); setShowLibraries(false); }} className="navbar-button" title="Select Languages">
              <i className="fa fa-language"></i> {(!isMobile || isMenuOpen) && 'Languages'}
            </button>
            {showLanguages && (
              <div className="nav-dropdown nav-dropdown-right">
                <button className="nav-dropdown-item" onClick={() => { setShowLanguages(false); if (onLanguageSelector) onLanguageSelector('javascript'); }}>JavaScript</button>
                <button className="nav-dropdown-item" onClick={() => { setShowLanguages(false); if (onLanguageSelector) onLanguageSelector('html'); }}>HTML</button>
                <button className="nav-dropdown-item" onClick={() => { setShowLanguages(false); if (onLanguageSelector) onLanguageSelector('css'); }}>CSS</button>
                <button className="nav-dropdown-item" onClick={() => { setShowLanguages(false); if (onLanguageSelector) onLanguageSelector('python'); }}>Python</button>
              </div>
            )}
          </div>
        </div>
        
        {/* Settings button has been moved to footer */}
      </div>
    </nav>
  );
}
