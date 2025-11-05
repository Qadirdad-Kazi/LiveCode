import React, { useState, useEffect, useRef } from 'react';

export function PerformanceMonitor({ iframeRef }) {
  const [metrics, setMetrics] = useState({
    fps: 0,
    memory: null,
    renderTime: 0,
    networkRequests: 0
  });
  const frameCountRef = useRef(0);
  const lastTimeRef = useRef(performance.now());
  const animationFrameRef = useRef(null);

  useEffect(() => {
    const measureFPS = () => {
      const now = performance.now();
      frameCountRef.current++;
      
      if (now - lastTimeRef.current >= 1000) {
        setMetrics(prev => ({
          ...prev,
          fps: frameCountRef.current
        }));
        frameCountRef.current = 0;
        lastTimeRef.current = now;
      }
      
      animationFrameRef.current = requestAnimationFrame(measureFPS);
    };

    animationFrameRef.current = requestAnimationFrame(measureFPS);

    // Measure memory if available
    const measureMemory = () => {
      if (performance.memory) {
        setMetrics(prev => ({
          ...prev,
          memory: {
            used: (performance.memory.usedJSHeapSize / 1048576).toFixed(2),
            total: (performance.memory.totalJSHeapSize / 1048576).toFixed(2),
            limit: (performance.memory.jsHeapSizeLimit / 1048576).toFixed(2)
          }
        }));
      }
    };

    const memoryInterval = setInterval(measureMemory, 1000);

    // Measure render time
    const measureRenderTime = () => {
      if (iframeRef.current) {
        const start = performance.now();
        iframeRef.current.contentWindow?.requestAnimationFrame(() => {
          const end = performance.now();
          setMetrics(prev => ({
            ...prev,
            renderTime: (end - start).toFixed(2)
          }));
        });
      }
    };

    const renderInterval = setInterval(measureRenderTime, 500);

    return () => {
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
      }
      clearInterval(memoryInterval);
      clearInterval(renderInterval);
    };
  }, [iframeRef]);

  const getFPSColor = (fps) => {
    if (fps >= 55) return 'text-green-500';
    if (fps >= 30) return 'text-yellow-500';
    return 'text-red-500';
  };

  return (
    <div className="performance-monitor">
      <div className="performance-header">
        <i className="fa fa-tachometer-alt" style={{ fontSize: '0.875rem' }}></i>
        <span>Performance</span>
      </div>
      <div className="performance-metrics">
        <div className="metric-item">
          <span className="metric-label">FPS</span>
          <span className={`metric-value ${getFPSColor(metrics.fps)}`}>
            {metrics.fps}
          </span>
        </div>
        <div className="metric-item">
          <span className="metric-label">Render</span>
          <span className="metric-value">{metrics.renderTime}ms</span>
        </div>
        {metrics.memory && (
          <div className="metric-item">
            <span className="metric-label">Memory</span>
            <span className="metric-value">{metrics.memory.used}MB</span>
          </div>
        )}
      </div>
    </div>
  );
}

