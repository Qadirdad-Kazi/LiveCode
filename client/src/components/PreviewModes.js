import React, { useState } from 'react';

const PREVIEW_MODES = [
  { name: 'Desktop', width: '100%', height: '100%', icon: 'fa-desktop' },
  { name: 'Laptop', width: '1440px', height: '900px', icon: 'fa-laptop' },
  { name: 'Tablet', width: '768px', height: '1024px', icon: 'fa-tablet' },
  { name: 'Mobile', width: '375px', height: '667px', icon: 'fa-mobile-alt' },
  { name: 'Custom', width: null, height: null, icon: 'fa-edit' }
];

export function PreviewModes({ onModeChange, currentMode }) {
  const [customWidth, setCustomWidth] = useState('800');
  const [customHeight, setCustomHeight] = useState('600');
  const [showCustom, setShowCustom] = useState(false);

  const handleModeSelect = (mode) => {
    if (mode.name === 'Custom') {
      setShowCustom(true);
    } else {
      onModeChange(mode);
      setShowCustom(false);
    }
  };

  const handleCustomApply = () => {
    onModeChange({
      name: 'Custom',
      width: `${customWidth}px`,
      height: `${customHeight}px`,
      icon: 'fa-edit'
    });
    setShowCustom(false);
  };

  return (
    <div className="preview-modes-container">
      <div className="preview-modes-grid">
        {PREVIEW_MODES.map(mode => (
          <button
            key={mode.name}
            className={`preview-mode-btn ${currentMode?.name === mode.name ? 'active' : ''}`}
            onClick={() => handleModeSelect(mode)}
            title={mode.name}
          >
            <i className={`fa ${mode.icon}`}></i>
            <span>{mode.name}</span>
          </button>
        ))}
      </div>
      {showCustom && (
        <div className="custom-size-picker">
          <div className="custom-size-inputs">
            <div>
              <label style={{
                display: 'block',
                fontSize: '0.75rem',
                fontWeight: 500,
                color: 'var(--text-secondary)',
                marginBottom: '0.25rem'
              }}>Width (px)</label>
              <input
                type="number"
                value={customWidth}
                onChange={(e) => setCustomWidth(e.target.value)}
                min="100"
                max="5000"
                className="custom-library-input"
                style={{ marginBottom: 0 }}
              />
            </div>
            <div>
              <label style={{
                display: 'block',
                fontSize: '0.75rem',
                fontWeight: 500,
                color: 'var(--text-secondary)',
                marginBottom: '0.25rem'
              }}>Height (px)</label>
              <input
                type="number"
                value={customHeight}
                onChange={(e) => setCustomHeight(e.target.value)}
                min="100"
                max="5000"
                className="custom-library-input"
                style={{ marginBottom: 0 }}
              />
            </div>
          </div>
          <button onClick={handleCustomApply} className="add-custom-btn" style={{ marginTop: '0.75rem' }}>
            Apply
          </button>
        </div>
      )}
    </div>
  );
}

