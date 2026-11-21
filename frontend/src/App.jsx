import React, { useState } from 'react';
import Header from './components/Header';
import SimulatorPage from './pages/SimulatorPage';
import OptimizerPage from './pages/OptimizerPage';
import BenchmarksPage from './pages/BenchmarksPage';
import DocsPage from './pages/DocsPage';
import { ThemeProvider, useTheme } from './context/ThemeContext';

function MainApp() {
  const [activeTab, setActiveTab] = useState('simulator');
  const { isDark, colors } = useTheme();

  return (
    <div style={{
      minHeight: '100vh',
      display: 'flex',
      flexDirection: 'column',
      backgroundColor: colors.bgPage,
      color: colors.textPrimary,
      fontFamily: "'Plus Jakarta Sans', system-ui, -apple-system, sans-serif",
      transition: 'background-color 0.25s ease, color 0.25s ease'
    }}>
      <Header activeTab={activeTab} setActiveTab={setActiveTab} />

      <main style={{
        flex: 1,
        maxWidth: '1380px',
        width: '100%',
        margin: '0 auto',
        padding: '28px 20px'
      }}>
        {activeTab === 'simulator' && <SimulatorPage />}
        {activeTab === 'optimizer' && <OptimizerPage />}
        {activeTab === 'benchmarks' && <BenchmarksPage />}
        {activeTab === 'docs' && <DocsPage />}
      </main>

      <footer style={{
        borderTop: `1px solid ${colors.border}`,
        padding: '20px 24px',
        textAlign: 'center',
        fontSize: '12px',
        color: colors.textMuted,
        backgroundColor: colors.bgCard,
        display: 'flex',
        flexWrap: 'wrap',
        justifyContent: 'space-between',
        alignItems: 'center',
        gap: '12px'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <span style={{ fontWeight: '700', color: colors.textPrimary }}>THERMOX AI</span>
          <span>&bull;</span>
          <span>DEPI Graduation Project (AWS ML Track)</span>
          <span>&bull;</span>
          <span>Team CloudXAi (NHA-5-165)</span>
        </div>
        <div style={{ display: 'flex', gap: '16px', fontSize: '12px' }}>
          <span>FastAPI Production Engine</span>
          <span>&bull;</span>
          <span>Three.js WebGL</span>
          <span>&bull;</span>
          <span>10 Calibrated ML Models</span>
        </div>
      </footer>
    </div>
  );
}

export default function App() {
  return (
    <ThemeProvider>
      <MainApp />
    </ThemeProvider>
  );
}
