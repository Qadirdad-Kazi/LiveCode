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
  
  // Handle scroll effect for navbar
  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 10) {
        setScrolled(true);
      } else {
        setScrolled(false);
      }
    };
    
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);
  
  // Close mobile menu when clicking outside
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (mobileMenuOpen && !e.target.closest('.mobile-menu-container')) {
        setMobileMenuOpen(false);
      }
    };
    
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [mobileMenuOpen]);
  
  return (
    <nav className={`navbar ${isDarkMode ? 'navbar-dark' : 'navbar-light'} ${scrolled ? 'backdrop-blur-md' : ''} ${isDarkMode 
      ? (scrolled ? 'bg-gray-900 bg-opacity-95' : 'bg-gray-800') 
      : (scrolled ? 'bg-white bg-opacity-95' : 'bg-blue-600')
    }`}>
      <div className="flex items-center">
        <div className="text-xl font-bold mr-6 flex items-center">
          <div className="mr-2 text-2xl">
            <i className="fa fa-code ${isDarkMode ? 'text-blue-400' : (scrolled ? 'text-blue-600' : 'text-white')}"></i>
          </div>
          <span className="${isDarkMode ? 'text-blue-400' : (scrolled ? 'text-blue-600' : 'text-white')} font-extrabold">Live</span>
          <span className="${isDarkMode ? 'text-green-400' : (scrolled ? 'text-green-500' : 'text-green-200')} font-extrabold">Code</span>
        </div>
        <div className="hidden md:flex space-x-2">
          <button 
            onClick={onNewClick}
            className={`
              px-3 py-2 
              ${isDarkMode 
                ? 'bg-gray-700 hover:bg-gray-600 border-transparent hover:border-gray-500' 
                : (scrolled ? 'bg-gray-100 hover:bg-gray-200 border-gray-200 hover:border-gray-300' : 'bg-blue-500 hover:bg-blue-400 border-blue-400 hover:border-blue-300')
              } 
              rounded-md 
              text-sm font-medium 
              transition-colors duration-200 
              flex items-center
              border
            `}
            title="Create new snippet"
          >
            <i className={`fa fa-file mr-2 ${isDarkMode ? 'text-blue-300' : (scrolled ? 'text-blue-500' : 'text-white')}`}></i> New
          </button>
          
          <div className="flex border rounded-md overflow-hidden" title="Undo/Redo">
            <button 
              onClick={onUndoClick}
              disabled={!canUndo}
              className={`
                px-2 py-2 
                ${isDarkMode 
                  ? (canUndo ? 'bg-gray-700 hover:bg-gray-600' : 'bg-gray-800 opacity-50 cursor-not-allowed') 
                  : (scrolled 
                      ? (canUndo ? 'bg-gray-100 hover:bg-gray-200' : 'bg-gray-100 opacity-50 cursor-not-allowed')
                      : (canUndo ? 'bg-blue-500 hover:bg-blue-400' : 'bg-blue-500 opacity-50 cursor-not-allowed')
                    )
                } 
                text-sm font-medium 
                transition-colors duration-200 
                flex items-center
                border-r ${isDarkMode ? 'border-gray-600' : (scrolled ? 'border-gray-300' : 'border-blue-400')}
              `}
            >
              <i className={`fa fa-undo ${isDarkMode ? 'text-gray-300' : (scrolled ? 'text-gray-600' : 'text-white')}`}></i>
            </button>
            <button 
              onClick={onRedoClick}
              disabled={!canRedo}
              className={`
                px-2 py-2 
                ${isDarkMode 
                  ? (canRedo ? 'bg-gray-700 hover:bg-gray-600' : 'bg-gray-800 opacity-50 cursor-not-allowed') 
                  : (scrolled 
                      ? (canRedo ? 'bg-gray-100 hover:bg-gray-200' : 'bg-gray-100 opacity-50 cursor-not-allowed')
                      : (canRedo ? 'bg-blue-500 hover:bg-blue-400' : 'bg-blue-500 opacity-50 cursor-not-allowed')
                    )
                } 
                text-sm font-medium 
                transition-colors duration-200 
                flex items-center
              `}
            >
              <i className={`fa fa-redo ${isDarkMode ? 'text-gray-300' : (scrolled ? 'text-gray-600' : 'text-white')}`}></i>
            </button>
          </div>
          
          <button 
            onClick={onTemplateClick}
            className={`
              px-3 py-2 
              ${isDarkMode 
                ? 'bg-gray-700 hover:bg-gray-600 border-transparent hover:border-gray-500' 
                : (scrolled ? 'bg-gray-100 hover:bg-gray-200 border-gray-200 hover:border-gray-300' : 'bg-blue-500 hover:bg-blue-400 border-blue-400 hover:border-blue-300')
              } 
              rounded-md 
              text-sm font-medium 
              transition-colors duration-200 
              flex items-center
              border
            `}
            title="Choose a template"
          >
            <i className={`fa fa-file-code mr-2 ${isDarkMode ? 'text-blue-300' : (scrolled ? 'text-blue-500' : 'text-white')}`}></i> Templates
          </button>
          
          <button 
            onClick={onExportClick}
            className={`
              px-3 py-2 
              ${isDarkMode 
                ? 'bg-gray-700 hover:bg-gray-600 border-transparent hover:border-gray-500' 
                : (scrolled ? 'bg-gray-100 hover:bg-gray-200 border-gray-200 hover:border-gray-300' : 'bg-blue-500 hover:bg-blue-400 border-blue-400 hover:border-blue-300')
              } 
              rounded-md 
              text-sm font-medium 
              transition-colors duration-200 
              flex items-center
              border
            `}
            title="Export as ZIP"
          >
            <i className={`fa fa-download mr-2 ${isDarkMode ? 'text-yellow-300' : (scrolled ? 'text-yellow-500' : 'text-yellow-200')}`}></i> Export
          </button>
          
          <div className="flex space-x-2">
            <button 
              onClick={onSaveClick}
              className={`
                px-3 py-2 
                ${isDarkMode ? 'bg-blue-600 hover:bg-blue-700' : (scrolled ? 'bg-blue-600 hover:bg-blue-700 text-white' : 'bg-white hover:bg-blue-50 text-blue-600')} 
                rounded-md 
                text-sm font-medium 
                transition-all duration-200 
                flex items-center
                shadow-md hover:shadow-lg
                transform hover:-translate-y-0.5
                border border-transparent
              `}
              title="Save snippet"
            >
              <i className="fa fa-save mr-2"></i> Save
            </button>
            
            <button 
              onClick={onLoadClick}
              className={`
                px-3 py-2 
                ${isDarkMode ? 'bg-green-600 hover:bg-green-700' : (scrolled ? 'bg-green-600 hover:bg-green-700 text-white' : 'bg-white hover:bg-green-50 text-green-600')} 
                rounded-md 
                text-sm font-medium 
                transition-all duration-200 
                flex items-center
                shadow-md hover:shadow-lg
                transform hover:-translate-y-0.5
                border border-transparent
              `}
              title="Load snippet"
            >
              <i className="fa fa-folder-open mr-2"></i> Load
            </button>
          </div>
        </div>
      </div>
      
      <div className="flex items-center space-x-3">
        <button 
          onClick={onToggleDarkMode}
          className={`
            p-2 
            rounded-full 
            ${isDarkMode 
              ? 'hover:bg-gray-700 hover:border-gray-600' 
              : (scrolled ? 'hover:bg-gray-200 hover:border-gray-300' : 'hover:bg-blue-500 hover:border-blue-400')
            } 
            transition-colors duration-200
            border border-transparent
            flex items-center justify-center
            w-9 h-9
            transform hover:rotate-12 transition-transform
          `}
          title={`Switch to ${isDarkMode ? 'light' : 'dark'} theme`}
          aria-label={`Switch to ${isDarkMode ? 'light' : 'dark'} theme`}
        >
          <i className={`
            fa fa-${isDarkMode ? 'sun' : 'moon'} 
            ${isDarkMode 
              ? 'text-yellow-300' 
              : (scrolled ? 'text-blue-600' : 'text-yellow-200')
            }
          `}></i>
        </button>
        <button 
          onClick={onSettingsClick}
          className={`
            p-2 
            rounded-full 
            ${isDarkMode 
              ? 'hover:bg-gray-700 hover:border-gray-600' 
              : (scrolled ? 'hover:bg-gray-200 hover:border-gray-300' : 'hover:bg-blue-500 hover:border-blue-400')
            } 
            transition-colors duration-200
            border border-transparent
            flex items-center justify-center
            w-9 h-9
            transform hover:rotate-45 transition-transform
          `}
          title="Editor settings"
          aria-label="Editor settings"
        >
          <i className={`
            fa fa-cog 
            ${isDarkMode 
              ? 'text-gray-300 hover:text-white' 
              : (scrolled ? 'text-gray-600 hover:text-gray-800' : 'text-white hover:text-white')
            }
          `}></i>
        </button>
        
        {/* Mobile menu */}
        <div className="md:hidden mobile-menu-container">
          <button 
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className={`
              p-2 
              rounded-full 
              ${isDarkMode 
                ? 'hover:bg-gray-700 hover:border-gray-600' 
                : (scrolled ? 'hover:bg-gray-200 hover:border-gray-300' : 'hover:bg-blue-500 hover:border-blue-400')
              } 
              transition-colors duration-200
              border border-transparent
              flex items-center justify-center
              w-9 h-9
            `}
          >
            <i className={`fa ${mobileMenuOpen ? 'fa-times' : 'fa-bars'}`}></i>
          </button>
          {mobileMenuOpen && (
            <div className={`
              absolute right-2 top-14 
              ${isDarkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'} 
              shadow-xl 
              rounded-md 
              p-2 
              w-48
              border
              animate-fade-in
              z-50
            `}>
              <button 
                onClick={() => {
                  onNewClick();
                  setMobileMenuOpen(false);
                }}
                className={`
                  block w-full 
                  text-left 
                  px-3 py-2 
                  ${isDarkMode ? 'hover:bg-gray-700 text-white' : 'hover:bg-gray-100 text-gray-800'} 
                  rounded-md
                  mb-1
                  transition-colors duration-150
                `}
              >
                <i className={`fa fa-file mr-2 ${isDarkMode ? 'text-blue-300' : 'text-blue-500'}`}></i> New
              </button>
              <button 
                onClick={() => {
                  onTemplateClick();
                  setMobileMenuOpen(false);
                }}
                className={`
                  block w-full 
                  text-left 
                  px-3 py-2 
                  ${isDarkMode ? 'hover:bg-gray-700 text-white' : 'hover:bg-gray-100 text-gray-800'} 
                  rounded-md
                  mb-1
                  transition-colors duration-150
                `}
              >
                <i className={`fa fa-file-code mr-2 ${isDarkMode ? 'text-blue-300' : 'text-blue-500'}`}></i> Templates
              </button>
              <button 
                onClick={() => {
                  onExportClick();
                  setMobileMenuOpen(false);
                }}
                className={`
                  block w-full 
                  text-left 
                  px-3 py-2 
                  ${isDarkMode ? 'hover:bg-gray-700 text-white' : 'hover:bg-gray-100 text-gray-800'} 
                  rounded-md
                  mb-1
                  transition-colors duration-150
                `}
              >
                <i className={`fa fa-download mr-2 ${isDarkMode ? 'text-yellow-300' : 'text-yellow-500'}`}></i> Export
              </button>
              <button 
                onClick={() => {
                  onSaveClick();
                  setMobileMenuOpen(false);
                }}
                className="
                  block w-full 
                  text-left 
                  px-3 py-2 
                  hover:bg-gray-700 
                  rounded-md
                  transition-colors duration-150
                  bg-blue-600 hover:bg-blue-700
                "
              >
                <i className="fa fa-save mr-2"></i> Save
              </button>
            </div>
          )}
        </div>
      </div>
    </nav>
  );
}
