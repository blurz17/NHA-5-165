import React, { useState } from 'react';
import Header from './components/Header';
import SimulatorPage from './pages/SimulatorPage';
import OptimizerPage from './pages/OptimizerPage';
import BenchmarksPage from './pages/BenchmarksPage';
import DocsPage from './pages/DocsPage';

export default function App() {
  const [activeTab, setActiveTab] = useState('simulator');

  return (
    <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
      <Header activeTab={activeTab} setActiveTab={setActiveTab} />

      <main style={{
        flex: 1,
        maxWidth: '1200px',
        width: '100%',
        margin: '0 auto',
        padding: '32px 16px'
      }}>
        {activeTab === 'simulator' && <SimulatorPage />}
        {activeTab === 'optimizer' && <OptimizerPage />}
        {activeTab === 'benchmarks' && <BenchmarksPage />}
        {activeTab === 'docs' && <DocsPage />}
      </main>

      <footer style={{
        borderTop: '1px solid #e2e8f0',
        padding: '16px',
        textAlign: 'center',
        fontSize: '12px',
        color: '#94a3b8',
        backgroundColor: '#ffffff'
      }}>
        DEPI Graduation Project &bull; Team CloudXAi (NHA-5-165) &bull; Building Energy Efficiency Prediction System
      </footer>
    </div>
  );
}
