import React from 'react';

export default function Header({ activeTab, setActiveTab }) {
  const tabs = [
    { id: 'simulator', label: 'Load Simulator' },
    { id: 'optimizer', label: 'Design Optimizer' },
    { id: 'benchmarks', label: 'Model Benchmarks' },
    { id: 'docs', label: 'Documentation' },
  ];

  return (
    <header style={{
      backgroundColor: '#1e293b',
      color: '#ffffff',
      padding: '16px 32px',
      boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)',
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center',
      flexWrap: 'wrap',
      gap: '16px'
    }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
        <div style={{
          width: '38px',
          height: '38px',
          borderRadius: '8px',
          backgroundColor: '#3b82f6',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          fontWeight: 'bold',
          fontSize: '20px'
        }}>
          ⚡
        </div>
        <div>
          <h1 style={{ fontSize: '18px', fontWeight: '700', letterSpacing: '-0.025em' }}>
            Building Energy Efficiency Predictor
          </h1>
          <p style={{ fontSize: '12px', color: '#94a3b8' }}>
            AWS ML Track &bull; DEPI Graduation Project &bull; Team CloudXAi
          </p>
        </div>
      </div>

      <nav style={{ display: 'flex', gap: '8px' }}>
        {tabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            style={{
              padding: '8px 16px',
              borderRadius: '6px',
              border: 'none',
              cursor: 'pointer',
              fontSize: '14px',
              fontWeight: '500',
              transition: 'all 0.15s ease',
              backgroundColor: activeTab === tab.id ? '#3b82f6' : 'transparent',
              color: activeTab === tab.id ? '#ffffff' : '#cbd5e1',
            }}
          >
            {tab.label}
          </button>
        ))}
      </nav>
    </header>
  );
}
