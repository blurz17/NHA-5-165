import React, { useEffect, useState } from 'react';
import ModelComparisonTable from '../components/ModelComparisonTable';
import { fetchModelsMetadata } from '../services/prediction';
import { useTheme } from '../context/ThemeContext';

export default function BenchmarksPage() {
  const { colors } = useTheme();
  const [benchmarks, setBenchmarks] = useState([]);

  useEffect(() => {
    fetchModelsMetadata().then((data) => {
      if (data && data.benchmarks) {
        setBenchmarks(data.benchmarks);
      }
    });
  }, []);

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
      <div style={{ borderBottom: `1px solid ${colors.border}`, paddingBottom: '16px' }}>
        <h2 style={{
          fontSize: '24px',
          fontWeight: '800',
          letterSpacing: '-0.02em',
          color: colors.textPrimary,
          margin: 0
        }}>
          Model Performance & Evaluation Suite
        </h2>
        <p style={{ fontSize: '13px', color: colors.textSecondary, margin: '4px 0 0 0' }}>
          Compare performance metrics across 5 machine learning architectures across both Heating and Cooling targets.
        </p>
      </div>

      <ModelComparisonTable benchmarks={benchmarks} />
    </div>
  );
}
