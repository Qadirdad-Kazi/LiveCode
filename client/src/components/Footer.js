import React from 'react';

export function Footer() {
  const currentYear = new Date().getFullYear();
  
  return (
    <footer className="footer">
      <div style={{ 
        maxWidth: '1200px', 
        margin: '0 auto', 
        display: 'flex', 
        flexDirection: 'column', 
        alignItems: 'center',
        justifyContent: 'space-between'
      }}>
        <div style={{ 
          display: 'flex', 
          alignItems: 'center', 
          marginBottom: '0.75rem'
        }}>
          <div style={{ color: '#2563eb', marginRight: '0.5rem' }}>
            <i className="fas fa-code" style={{ fontSize: '1.25rem' }}></i>
          </div>
          <span style={{ fontWeight: 600, color: '#374151' }}>LiveCode</span>
          <span style={{ color: '#6b7280', fontSize: '0.875rem', marginLeft: '0.5rem' }}>v1.0.0</span>
        </div>
        
        <div style={{ 
          display: 'flex', 
          flexWrap: 'wrap', 
          justifyContent: 'center', 
          gap: '1.5rem', 
          fontSize: '0.875rem', 
          color: '#4b5563'
        }}>
          <a href="#" style={{ 
            color: '#4b5563', 
            display: 'flex', 
            alignItems: 'center',
            textDecoration: 'none',
            transition: 'color 0.2s ease'
          }} onMouseOver={(e) => e.currentTarget.style.color = '#2563eb'} 
             onMouseOut={(e) => e.currentTarget.style.color = '#4b5563'}>
            <i className="fas fa-book" style={{ marginRight: '0.25rem' }}></i>
            <span>Documentation</span>
          </a>
          <a href="#" style={{ 
            color: '#4b5563', 
            display: 'flex', 
            alignItems: 'center',
            textDecoration: 'none',
            transition: 'color 0.2s ease'
          }} onMouseOver={(e) => e.currentTarget.style.color = '#2563eb'} 
             onMouseOut={(e) => e.currentTarget.style.color = '#4b5563'}>
            <i className="fas fa-question-circle" style={{ marginRight: '0.25rem' }}></i>
            <span>Help</span>
          </a>
        </div>
        
        <div style={{ fontSize: '0.75rem', color: '#6b7280', marginTop: '0.75rem' }}>
          &copy; {currentYear} LiveCode. All rights reserved.
        </div>
      </div>
      
      <div style={{ marginTop: '0.75rem', textAlign: 'center', fontSize: '0.75rem', color: '#9ca3af' }}>
        <span>Made with </span>
        <span style={{ color: '#ef4444', animation: 'pulse 2s infinite' }}>❤</span>
        <span> for developers</span>
      </div>
    </footer>
  );
}
