import React from 'react';
import Logo from './Logo';
import { useTheme } from '../context/ThemeContext';

export default function Header({ activeTab, setActiveTab, backendOnline = true }) {
  const { isDark, toggleTheme, colors } = useTheme();

  const tabs = [
    { id: 'simulator', label: '3D Thermal Simulator' },
    { id: 'optimizer', label: 'Design Optimizer' },
    { id: 'benchmarks', label: 'Model Benchmarks' },
    { id: 'docs', label: 'Documentation' },
  ];

  return (
    <header style={{
      backgroundColor: isDark ? 'rgba(17, 24, 39, 0.85)' : 'rgba(255, 255, 255, 0.85)',
      backdropFilter: 'blur(12px)',
      WebkitBackdropFilter: 'blur(12px)',
      color: colors.textPrimary,
      padding: '14px 28px',
      borderBottom: `1px solid ${colors.border}`,
      position: 'sticky',
      top: 0,
      zIndex: 50,
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center',
      flexWrap: 'wrap',
      gap: '16px',
      transition: 'all 0.25s ease'
    }}>
      {/* Brand Identity */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
        <Logo size={38} />
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <h1 style={{
              fontSize: '19px',
              fontWeight: '800',
              letterSpacing: '-0.02em',
              color: isDark ? '#ffffff' : '#0f172a',
              margin: 0,
              display: 'flex',
              alignItems: 'center',
              gap: '6px'
            }}>
              <span>THERMOX</span>
              <span style={{ color: '#0ea5e9' }}>AI</span>
            </h1>
            
            {/* Live Backend Indicator */}
            <span style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '5px',
              fontSize: '10px',
              fontWeight: '600',
              padding: '2px 8px',
              borderRadius: '20px',
              backgroundColor: backendOnline
                ? (isDark ? 'rgba(16, 185, 129, 0.15)' : '#dcfce7')
                : (isDark ? 'rgba(239, 68, 68, 0.15)' : '#fee2e2'),
              color: backendOnline ? '#10b981' : '#ef4444',
              border: `1px solid ${backendOnline ? 'rgba(16, 185, 129, 0.3)' : 'rgba(239, 68, 68, 0.3)'}`
            }}>
              <span style={{
                width: '6px',
                height: '6px',
                borderRadius: '50%',
                backgroundColor: backendOnline ? '#10b981' : '#ef4444',
                boxShadow: backendOnline ? '0 0 6px #10b981' : 'none'
              }} />
              {backendOnline ? 'API LIVE' : 'DEMO MODE'}
            </span>
          </div>

          <p style={{ fontSize: '11px', color: colors.textSecondary, fontWeight: '500', marginTop: '1px' }}>
            DEPI Graduation Project &bull; AWS ML Track &bull; Team CloudXAi (NHA-5-165)
          </p>
        </div>
      </div>

      {/* Navigation Tabs & Theme Toggle */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
        <nav style={{
          display: 'flex',
          backgroundColor: isDark ? '#0b1120' : '#f1f5f9',
          padding: '4px',
          borderRadius: '10px',
          border: `1px solid ${colors.borderSubtle}`
        }}>
          {tabs.map((tab) => {
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                style={{
                  padding: '7px 16px',
                  borderRadius: '7px',
                  border: 'none',
                  cursor: 'pointer',
                  fontSize: '13px',
                  fontWeight: isActive ? '700' : '500',
                  transition: 'all 0.18s ease',
                  backgroundColor: isActive ? (isDark ? '#2563eb' : '#ffffff') : 'transparent',
                  color: isActive ? (isDark ? '#ffffff' : '#1e40af') : colors.textSecondary,
                  boxShadow: isActive ? (isDark ? '0 2px 10px rgba(37,99,235,0.4)' : '0 1px 4px rgba(0,0,0,0.08)') : 'none',
                }}
              >
                {tab.label}
              </button>
            );
          })}
        </nav>

        {/* Dark Mode Toggle Switch */}
        <button
          onClick={toggleTheme}
          title={isDark ? 'Switch to Light Mode' : 'Switch to Dark Mode'}
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            width: '38px',
            height: '38px',
            borderRadius: '10px',
            border: `1px solid ${colors.border}`,
            backgroundColor: isDark ? '#1e293b' : '#ffffff',
            color: isDark ? '#facc15' : '#475569',
            cursor: 'pointer',
            fontSize: '16px',
            transition: 'all 0.2s ease',
            boxShadow: '0 1px 3px rgba(0,0,0,0.05)'
          }}
        >
          {isDark ? '☀️' : '🌙'}
        </button>
      </div>
    </header>
  );
}
