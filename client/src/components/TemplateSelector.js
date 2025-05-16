import React, { useState, useEffect } from "react";

export function TemplateSelector({ templates, onSelectTemplate, onClose }) {
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedTemplate, setSelectedTemplate] = useState(null);
  
  // Extract unique categories from template tags
  const categories = ['all', ...new Set(templates.flatMap(t => t.tags))];
  
  // Filter templates based on category and search query
  const filteredTemplates = templates.filter(template => {
    const matchesCategory = selectedCategory === 'all' || template.tags.includes(selectedCategory);
    const matchesSearch = searchQuery === '' || 
      template.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      template.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      template.tags.some(tag => tag.toLowerCase().includes(searchQuery.toLowerCase()));
    
    return matchesCategory && matchesSearch;
  });
  
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
  
  // Handle template selection
  const handleTemplateSelect = (template) => {
    setSelectedTemplate(template);
  };
  
  // Apply selected template
  const applyTemplate = () => {
    if (selectedTemplate) {
      onSelectTemplate(selectedTemplate.id);
    }
  };

  return (
    <div className="modal-overlay" style={{
      position: 'fixed',
      inset: 0,
      backgroundColor: 'rgba(0, 0, 0, 0.6)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      zIndex: 50,
      backdropFilter: 'blur(4px)'
    }}>
      <div className="animate-fadeIn" style={{
        backgroundColor: 'white',
        borderRadius: '0.5rem',
        boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.25)',
        width: '100%',
        maxWidth: '56rem',
        maxHeight: '85vh',
        display: 'flex',
        flexDirection: 'column',
        overflow: 'hidden',
        transition: 'all 0.3s ease-in-out'
      }}>
      
        {/* Header */}
        <div style={{
          backgroundColor: '#f9fafb',
          padding: '1.5rem',
          borderBottom: '1px solid #e5e7eb',
          flexShrink: 0
        }}>
          <div style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center'
          }}>
            <h2 style={{
              fontSize: '1.25rem',
              fontWeight: 'bold',
              color: '#1f2937',
              display: 'flex',
              alignItems: 'center'
            }}>
              <i className="fa fa-file-code" style={{ color: '#3b82f6', marginRight: '0.5rem' }}></i>
              Choose a Template
            </h2>
            <button 
              onClick={onClose}
              style={{
                color: '#6b7280',
                padding: '0.25rem',
                borderRadius: '9999px',
                transition: 'all 0.2s ease',
                border: 'none',
                background: 'transparent',
                cursor: 'pointer'
              }}
              onMouseOver={(e) => {
                e.currentTarget.style.backgroundColor = '#e5e7eb';
                e.currentTarget.style.color = '#374151';
              }}
              onMouseOut={(e) => {
                e.currentTarget.style.backgroundColor = 'transparent';
                e.currentTarget.style.color = '#6b7280';
              }}
              aria-label="Close"
            >
              <i className="fa fa-times"></i>
            </button>
          </div>
          
          {/* Search and Filter */}
          <div style={{ marginTop: '1rem', display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
            <div style={{ position: 'relative', flexGrow: 1 }}>
              <div style={{ 
                position: 'absolute', 
                top: 0, 
                bottom: 0, 
                left: 0, 
                paddingLeft: '0.75rem', 
                display: 'flex', 
                alignItems: 'center', 
                pointerEvents: 'none' 
              }}>
                <i className="fa fa-search" style={{ color: '#9ca3af' }}></i>
              </div>
              <input
                type="text"
                placeholder="Search templates..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                style={{
                  paddingLeft: '2.5rem',
                  paddingRight: '1rem',
                  paddingTop: '0.5rem',
                  paddingBottom: '0.5rem',
                  width: '100%',
                  backgroundColor: 'white',
                  border: '1px solid #d1d5db',
                  borderRadius: '0.5rem',
                  color: '#374151',
                  outline: 'none',
                }}
                onFocus={(e) => e.target.style.boxShadow = '0 0 0 2px rgba(59, 130, 246, 0.5)'}
                onBlur={(e) => e.target.style.boxShadow = 'none'}
              />
            </div>
            
            <div style={{ 
              display: 'flex', 
              overflowX: 'auto', 
              gap: '0.5rem', 
              whiteSpace: 'nowrap',
              paddingBottom: '0.25rem'
            }}>
              {categories.map(category => {
                const isSelected = selectedCategory === category;
                return (
                  <button
                    key={category}
                    onClick={() => setSelectedCategory(category)}
                    style={{
                      padding: '0.5rem 0.75rem',
                      whiteSpace: 'nowrap',
                      borderRadius: '0.5rem',
                      fontSize: '0.875rem',
                      fontWeight: '500',
                      transition: 'all 0.2s ease',
                      backgroundColor: isSelected ? '#dbeafe' : '#f3f4f6',
                      color: isSelected ? '#1e40af' : '#4b5563',
                      border: 'none',
                      cursor: 'pointer'
                    }}
                    onMouseOver={(e) => {
                      if (!isSelected) {
                        e.currentTarget.style.backgroundColor = '#e5e7eb';
                      }
                    }}
                    onMouseOut={(e) => {
                      if (!isSelected) {
                        e.currentTarget.style.backgroundColor = '#f3f4f6';
                      }
                    }}
                  >
                    {category.charAt(0).toUpperCase() + category.slice(1)}
                  </button>
                );
              })}
            </div>
          </div>
        </div>
        
        {/* Templates Grid */}
        <div style={{ flexGrow: 1, overflowY: 'auto', padding: '1.5rem' }}>
          {filteredTemplates.length === 0 ? (
            <div style={{ textAlign: 'center', padding: '3rem 0' }}>
              <div style={{ color: '#9ca3af', fontSize: '3rem', marginBottom: '1rem' }}>
                <i className="fa fa-search"></i>
              </div>
              <h3 style={{ fontSize: '1.125rem', fontWeight: '500', color: '#374151', marginBottom: '0.5rem' }}>
                No templates found
              </h3>
              <p style={{ color: '#6b7280' }}>
                Try adjusting your search or filter to find a template
              </p>
            </div>
          ) : (
            <div style={{ 
              display: 'grid', 
              gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', 
              gap: '1.25rem' 
            }}>
              {filteredTemplates.map(template => {
                const isSelected = selectedTemplate?.id === template.id;
                return (
                  <div 
                    key={template.id}
                    onClick={() => handleTemplateSelect(template)}
                    className={isSelected ? 'animate-pulse' : ''}
                    style={{
                      border: isSelected ? '1px solid #3b82f6' : '1px solid #e5e7eb',
                      borderRadius: '0.5rem',
                      overflow: 'hidden',
                      transition: 'all 0.2s ease',
                      cursor: 'pointer',
                      boxShadow: isSelected ? '0 0 0 2px rgba(59, 130, 246, 0.3)' : 'none',
                      transform: isSelected ? 'scale(1.02)' : 'scale(1)',
                    }}
                    onMouseOver={(e) => {
                      if (!isSelected) {
                        e.currentTarget.style.boxShadow = '0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)';
                        e.currentTarget.style.transform = 'translateY(-2px)';
                      }
                    }}
                    onMouseOut={(e) => {
                      if (!isSelected) {
                        e.currentTarget.style.boxShadow = 'none';
                        e.currentTarget.style.transform = 'translateY(0)';
                      }
                    }}
                  >
                    <div style={{ padding: '1.25rem' }}>
                      <h3 style={{ fontWeight: 'bold', fontSize: '1.125rem', marginBottom: '0.5rem', color: '#1f2937' }}>
                        {template.name}
                      </h3>
                      <p style={{ 
                        fontSize: '0.875rem', 
                        color: '#4b5563', 
                        marginBottom: '0.75rem',
                        display: '-webkit-box',
                        WebkitLineClamp: 2,
                        WebkitBoxOrient: 'vertical',
                        overflow: 'hidden'
                      }}>
                        {template.description}
                      </p>
                      <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem' }}>
                        {template.tags.map(tag => (
                          <span 
                            key={tag}
                            style={{
                              padding: '0.25rem 0.5rem',
                              backgroundColor: '#f3f4f6',
                              color: '#4b5563',
                              fontSize: '0.75rem',
                              borderRadius: '9999px',
                              border: '1px solid #e5e7eb'
                            }}
                          >
                            {tag}
                          </span>
                        ))}
                      </div>
                    </div>
                    
                    {/* Code Preview */}
                    <div style={{ 
                      height: '8rem', 
                      backgroundColor: '#f9fafb', 
                      borderTop: '1px solid #e5e7eb', 
                      position: 'relative', 
                      overflow: 'hidden' 
                    }}>
                      <div style={{ 
                        position: 'absolute', 
                        inset: 0, 
                        opacity: 0.5, 
                        display: 'flex', 
                        alignItems: 'center', 
                        justifyContent: 'center' 
                      }}>
                        <div style={{ 
                          fontSize: '0.75rem', 
                          fontFamily: 'monospace', 
                          padding: '0.5rem', 
                          overflow: 'hidden', 
                          color: '#6b7280', 
                          width: '100%', 
                          height: '100%' 
                        }}>
                          <pre style={{ 
                            display: '-webkit-box',
                            WebkitLineClamp: 6,
                            WebkitBoxOrient: 'vertical',
                            overflow: 'hidden'
                          }}>
                            {template.html?.slice(0, 150)}...
                          </pre>
                        </div>
                      </div>
                      <div style={{ position: 'absolute', bottom: '0.5rem', right: '0.5rem' }}>
                        <div style={{ display: 'flex', gap: '0.25rem' }}>
                          <span style={{ width: '0.75rem', height: '0.75rem', borderRadius: '9999px', backgroundColor: '#3b82f6' }}></span>
                          <span style={{ width: '0.75rem', height: '0.75rem', borderRadius: '9999px', backgroundColor: '#f59e0b' }}></span>
                          <span style={{ width: '0.75rem', height: '0.75rem', borderRadius: '9999px', backgroundColor: '#10b981' }}></span>
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
        
        {/* Footer */}
        <div style={{
          backgroundColor: '#f9fafb',
          padding: '1rem 1.5rem',
          borderTop: '1px solid #e5e7eb',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          flexShrink: 0
        }}>
          <div style={{ fontSize: '0.875rem', color: '#6b7280' }}>
            {filteredTemplates.length} template{filteredTemplates.length !== 1 ? 's' : ''} available
          </div>
          <div style={{ display: 'flex', gap: '0.75rem' }}>
            <button 
              onClick={onClose}
              style={{
                padding: '0.5rem 1rem',
                border: '1px solid #d1d5db',
                color: '#4b5563',
                borderRadius: '0.5rem',
                transition: 'all 0.2s ease',
                backgroundColor: 'transparent',
                cursor: 'pointer',
                fontSize: '0.875rem',
                fontWeight: '500'
              }}
              onMouseOver={(e) => {
                e.currentTarget.style.backgroundColor = '#f3f4f6';
              }}
              onMouseOut={(e) => {
                e.currentTarget.style.backgroundColor = 'transparent';
              }}
            >
              Cancel
            </button>
            <button 
              onClick={applyTemplate}
              disabled={!selectedTemplate}
              style={{
                padding: '0.5rem 1rem',
                borderRadius: '0.5rem',
                transition: 'all 0.2s ease',
                backgroundColor: selectedTemplate ? '#3b82f6' : '#d1d5db',
                color: selectedTemplate ? 'white' : '#6b7280',
                border: 'none',
                cursor: selectedTemplate ? 'pointer' : 'not-allowed',
                boxShadow: selectedTemplate ? '0 1px 2px rgba(0, 0, 0, 0.05)' : 'none',
                fontSize: '0.875rem',
                fontWeight: '500',
                display: 'flex',
                alignItems: 'center',
                gap: '0.25rem'
              }}
              onMouseOver={(e) => {
                if (selectedTemplate) {
                  e.currentTarget.style.backgroundColor = '#2563eb';
                  e.currentTarget.style.boxShadow = '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)';
                  e.currentTarget.style.transform = 'translateY(-1px)';
                }
              }}
              onMouseOut={(e) => {
                if (selectedTemplate) {
                  e.currentTarget.style.backgroundColor = '#3b82f6';
                  e.currentTarget.style.boxShadow = '0 1px 2px rgba(0, 0, 0, 0.05)';
                  e.currentTarget.style.transform = 'translateY(0)';
                }
              }}
            >
              <i className="fa fa-check" style={{ marginRight: '0.25rem' }}></i>
              Apply Template
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
