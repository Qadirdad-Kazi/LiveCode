import React, { useState, useEffect } from "react";

export function Navbar({ 
  onSettingsClick, 
  onTemplateClick, 
  onExportClick, 
  onSaveClick,
  onLoadClick,
  onNewClick,
  onUndoClick,
  onRedoClick,
  canUndo,
  canRedo,
  isDarkMode,
  onToggleDarkMode
}) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  // Scroll effect
  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 10);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Click outside to close mobile menu
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (mobileMenuOpen && !e.target.closest(".mobile-menu-container")) {
        setMobileMenuOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [mobileMenuOpen]);

  return (
    <nav className={`flex items-center justify-between px-4 py-3 shadow-md fixed top-0 w-full z-50 transition-colors duration-300 ${scrolled ? 'bg-opacity-90 backdrop-blur-md' : ''} ${isDarkMode ? 'bg-gray-900 text-white' : 'bg-white text-gray-800'}`}>
      
      {/* Logo */}
      <div className="flex items-center space-x-2 text-xl font-bold">
        <i className="fa fa-code text-blue-500"></i>
        <span className="text-blue-500">Live</span>
        <span className="text-green-500">Code</span>
      </div>

      {/* Desktop Buttons */}
      <div className="hidden md:flex space-x-2">
        <button onClick={onNewClick} className="btn bg-blue-500">
          <i className="fa fa-file mr-1"></i> New
        </button>
        <button onClick={onUndoClick} disabled={!canUndo} className={`btn bg-blue-500 ${!canUndo ? 'opacity-50 cursor-not-allowed' : ''}`}>
          <i className="fa fa-undo mr-1"></i> Undo
        </button>
        <button onClick={onRedoClick} disabled={!canRedo} className={`btn bg-blue-500 ${!canRedo ? 'opacity-50 cursor-not-allowed' : ''}`}>
          <i className="fa fa-redo mr-1"></i> Redo
        </button>
        <button onClick={onTemplateClick} className="btn bg-blue-500">
          <i className="fa fa-file-code mr-1"></i> Templates
        </button>
        <button onClick={onExportClick} className="btn bg-yellow-500">
          <i className="fa fa-download mr-1"></i> Export
        </button>
        <button onClick={onSaveClick} className="btn bg-blue-600">
          <i className="fa fa-save mr-1"></i> Save
        </button>
        <button onClick={onLoadClick} className="btn bg-green-600">
          <i className="fa fa-folder-open mr-1"></i> Load
        </button>
        <button onClick={onToggleDarkMode} className="btn bg-purple-600">
          <i className={`fa fa-${isDarkMode ? 'sun' : 'moon'} mr-1`}></i>
          {isDarkMode ? 'Light Mode' : 'Dark Mode'}
        </button>
        <button onClick={onSettingsClick} className="btn bg-gray-600">
          <i className="fa fa-cog mr-1"></i> Settings
        </button>
      </div>

      {/* Mobile Menu */}
      <div className="md:hidden mobile-menu-container relative">
        <button
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          className={`p-2 rounded-full border transition-colors duration-200 ${isDarkMode ? 'hover:bg-gray-700' : (scrolled ? 'hover:bg-gray-200' : 'hover:bg-blue-500')}`}
        >
          <i className={`fa ${mobileMenuOpen ? 'fa-times' : 'fa-bars'}`}></i>
        </button>

        {mobileMenuOpen && (
          <div className={`absolute right-0 top-12 w-52 p-2 border rounded-md shadow-lg z-50 ${isDarkMode ? 'bg-gray-800 text-white border-gray-600' : 'bg-white text-gray-800 border-gray-300'}`}>
            <MobileButton icon="file" label="New" onClick={() => { onNewClick(); setMobileMenuOpen(false); }} />
            <MobileButton icon="file-code" label="Templates" onClick={() => { onTemplateClick(); setMobileMenuOpen(false); }} />
            <MobileButton icon="download" label="Export" onClick={() => { onExportClick(); setMobileMenuOpen(false); }} />
            <MobileButton icon="save" label="Save" onClick={() => { onSaveClick(); setMobileMenuOpen(false); }} bg="bg-blue-600 hover:bg-blue-700" />
            <MobileButton icon="folder-open" label="Load" onClick={() => { onLoadClick(); setMobileMenuOpen(false); }} bg="bg-green-600 hover:bg-green-700" />
            <MobileButton icon={isDarkMode ? "sun" : "moon"} label={isDarkMode ? "Light Mode" : "Dark Mode"} onClick={() => { onToggleDarkMode(); setMobileMenuOpen(false); }} bg="bg-purple-600 hover:bg-purple-700" />
            <MobileButton icon="cog" label="Settings" onClick={() => { onSettingsClick(); setMobileMenuOpen(false); }} bg="bg-gray-600 hover:bg-gray-700" />
          </div>
        )}
      </div>
    </nav>
  );
}

function MobileButton({ icon, label, onClick, bg = "hover:bg-gray-100" }) {
  return (
    <button
      onClick={onClick}
      className={`flex items-center w-full px-3 py-2 rounded-md transition-colors ${bg}`}
    >
      <i className={`fa fa-${icon} mr-2`}></i> {label}
    </button>
  );
}
