import React, { useState } from 'react';
import OptimizerTool from '../components/OptimizerTool';
import { useTheme } from '../context/ThemeContext';

export default function OptimizerPage() {
  const { colors } = useTheme();

  const [baseFeatures] = useState({
    Relative_Compactness: 0.82,
    Surface_Area: 612.5,
    Wall_Area: 318.5,
    Roof_Area: 147.0,
    Overall_Height: 7.0,
    Orientation: 2,
    Glazing_Area: 0.25,
    Glazing_Area_Distribution: 2,
  });

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
          Architectural Energy Optimization Engine
        </h2>
        <p style={{ fontSize: '13px', color: colors.textSecondary, margin: '4px 0 0 0' }}>
          Simulate multi-variable sensitivity curves to find the optimal passive solar building design.
        </p>
      </div>

      <OptimizerTool baseFeatures={baseFeatures} />
    </div>
  );
}
