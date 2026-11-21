import React from 'react';
import { useTheme } from '../context/ThemeContext';

export default function ModelComparisonTable({ benchmarks }) {
  const { isDark, colors } = useTheme();

  if (!benchmarks || benchmarks.length === 0) {
    return (
      <div style={{
        backgroundColor: colors.bgCard,
        borderRadius: '16px',
        padding: '36px',
        textAlign: 'center',
        border: `1px solid ${colors.border}`,
        color: colors.textSecondary
      }}>
        <div style={{ fontSize: '32px', marginBottom: '8px' }}>📊</div>
        <p>Loading calibrated model benchmarks from inference cluster...</p>
      </div>
    );
  }

  return (
    <div style={{
      backgroundColor: colors.bgCard,
      borderRadius: '16px',
      padding: '28px',
      boxShadow: isDark ? '0 8px 32px rgba(0,0,0,0.4)' : '0 4px 20px rgba(0,0,0,0.06)',
      border: `1px solid ${colors.border}`,
      display: 'flex',
      flexDirection: 'column',
      gap: '20px'
    }}>
      <div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '6px' }}>
          <span style={{ fontSize: '20px' }}>🏆</span>
          <h2 style={{ fontSize: '18px', fontWeight: '800', color: colors.textPrimary, margin: 0 }}>
            Comprehensive 10-Model Benchmark Evaluation
          </h2>
        </div>
        <p style={{ fontSize: '13px', color: colors.textSecondary, margin: 0 }}>
          Benchmarked on an independent 20% holdout test partition (154 samples) with cross-validation across 5 ML algorithms for both Heating and Cooling loads.
        </p>
      </div>

      <div style={{ overflowX: 'auto', borderRadius: '12px', border: `1px solid ${colors.border}` }}>
        <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '13px' }}>
          <thead>
            <tr style={{ backgroundColor: colors.bgSurface, borderBottom: `2px solid ${colors.border}` }}>
              <th style={{ padding: '14px 18px', fontWeight: '700', color: colors.textSecondary }}>Algorithm</th>
              <th style={{ padding: '14px 18px', fontWeight: '700', color: colors.textSecondary }}>Target Load</th>
              <th style={{ padding: '14px 18px', fontWeight: '700', color: colors.textSecondary }}>MAE (kWh/m²)</th>
              <th style={{ padding: '14px 18px', fontWeight: '700', color: colors.textSecondary }}>RMSE (kWh/m²)</th>
              <th style={{ padding: '14px 18px', fontWeight: '700', color: colors.textSecondary }}>R² Score</th>
              <th style={{ padding: '14px 18px', fontWeight: '700', color: colors.textSecondary }}>Production Status</th>
            </tr>
          </thead>
          <tbody>
            {benchmarks.map((row, idx) => {
              const isBest = row.r2 >= 0.994;
              const isHeating = row.target.toLowerCase().includes('heating');

              return (
                <tr
                  key={idx}
                  style={{
                    borderBottom: `1px solid ${colors.border}`,
                    backgroundColor: isBest
                      ? (isDark ? 'rgba(16, 185, 129, 0.12)' : '#f0fdf4')
                      : 'transparent',
                    transition: 'background-color 0.15s ease'
                  }}
                >
                  <td style={{ padding: '14px 18px', fontWeight: '700', color: colors.textPrimary }}>
                    {row.algorithm}
                  </td>
                  <td style={{ padding: '14px 18px' }}>
                    <span style={{
                      padding: '4px 10px',
                      borderRadius: '20px',
                      fontSize: '11px',
                      fontWeight: '700',
                      backgroundColor: isHeating
                        ? (isDark ? 'rgba(239, 68, 68, 0.2)' : '#fee2e2')
                        : (isDark ? 'rgba(14, 165, 233, 0.2)' : '#e0f2fe'),
                      color: isHeating ? '#ef4444' : '#0ea5e9',
                      border: `1px solid ${isHeating ? 'rgba(239, 68, 68, 0.4)' : 'rgba(14, 165, 233, 0.4)'}`
                    }}>
                      {isHeating ? '🔥 Heating Load' : '❄️ Cooling Load'}
                    </span>
                  </td>
                  <td style={{ padding: '14px 18px', color: colors.textPrimary, fontFamily: 'monospace' }}>
                    {row.mae.toFixed(4)}
                  </td>
                  <td style={{ padding: '14px 18px', color: colors.textPrimary, fontFamily: 'monospace' }}>
                    {row.rmse.toFixed(4)}
                  </td>
                  <td style={{ padding: '14px 18px', fontFamily: 'monospace', fontWeight: '700' }}>
                    <span style={{
                      color: isBest ? '#10b981' : (row.r2 >= 0.95 ? colors.textPrimary : '#f59e0b')
                    }}>
                      {(row.r2 * 100).toFixed(2)}% ({row.r2.toFixed(4)})
                    </span>
                  </td>
                  <td style={{ padding: '14px 18px' }}>
                    {isBest ? (
                      <span style={{
                        padding: '3px 8px',
                        borderRadius: '6px',
                        fontSize: '11px',
                        fontWeight: '700',
                        backgroundColor: '#10b981',
                        color: '#ffffff'
                      }}>
                        ★ Champion Model
                      </span>
                    ) : (
                      <span style={{
                        padding: '3px 8px',
                        borderRadius: '6px',
                        fontSize: '11px',
                        fontWeight: '600',
                        backgroundColor: isDark ? 'rgba(255,255,255,0.06)' : '#f1f5f9',
                        color: colors.textMuted
                      }}>
                        Active Ensemble
                      </span>
                    )}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}
