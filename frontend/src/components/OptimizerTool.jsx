import React, { useState } from 'react';
import { optimizeParameter } from '../services/prediction';
import { useTheme } from '../context/ThemeContext';

export default function OptimizerTool({ baseFeatures }) {
  const { isDark, colors } = useTheme();

  const [param, setParam] = useState('Glazing_Area');
  const [results, setResults] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const paramOptions = [
    { value: 'Glazing_Area', label: 'Glazing Area Ratio (0.00 to 0.40)', desc: 'Tests window-to-wall ratios to identify solar heat gain thresholds.' },
    { value: 'Orientation', label: 'Orientation (North, East, South, West)', desc: 'Tests cardinal directions to find optimal passive solar orientation.' },
    { value: 'Relative_Compactness', label: 'Relative Compactness (0.64 to 0.98)', desc: 'Tests building shape compactness from sprawling to high-density cubes.' },
  ];

  const getOrientationName = (val) => {
    switch (Number(val)) {
      case 2: return '2 (North)';
      case 3: return '3 (East)';
      case 4: return '4 (South)';
      case 5: return '5 (West)';
      default: return val;
    }
  };

  const handleRun = async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await optimizeParameter(baseFeatures, param);
      setResults(res);
    } catch (e) {
      console.error(e);
      setError('Optimization query failed. Ensure backend service is reachable.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{
      backgroundColor: colors.bgCard,
      borderRadius: '16px',
      padding: '28px',
      boxShadow: isDark ? '0 8px 32px rgba(0,0,0,0.4)' : '0 4px 20px rgba(0,0,0,0.06)',
      border: `1px solid ${colors.border}`,
      display: 'flex',
      flexDirection: 'column',
      gap: '24px'
    }}>
      {/* Header */}
      <div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '6px' }}>
          <span style={{ fontSize: '20px' }}>🎯</span>
          <h2 style={{ fontSize: '18px', fontWeight: '800', color: colors.textPrimary, margin: 0 }}>
            Passive Design Architectural Optimizer
          </h2>
        </div>
        <p style={{ fontSize: '13px', color: colors.textSecondary, margin: 0 }}>
          Iteratively evaluates design permutations against the calibrated ensemble to pinpoint minimal annual energy consumption configurations.
        </p>
      </div>

      {/* Control Bar */}
      <div style={{
        display: 'flex',
        flexWrap: 'wrap',
        gap: '16px',
        alignItems: 'center',
        backgroundColor: colors.bgSurface,
        padding: '16px',
        borderRadius: '12px',
        border: `1px solid ${colors.border}`
      }}>
        <div style={{ flex: 1, minWidth: '240px' }}>
          <label style={{
            display: 'block',
            fontSize: '12px',
            fontWeight: '700',
            color: colors.textSecondary,
            textTransform: 'uppercase',
            letterSpacing: '0.04em',
            marginBottom: '6px'
          }}>
            Optimization Parameter Target:
          </label>
          <select
            value={param}
            onChange={(e) => setParam(e.target.value)}
            style={{
              width: '100%',
              padding: '10px 14px',
              borderRadius: '8px',
              border: `1px solid ${colors.border}`,
              backgroundColor: colors.bgInput,
              color: colors.textPrimary,
              fontSize: '13px',
              fontWeight: '600',
              outline: 'none'
            }}
          >
            {paramOptions.map((opt) => (
              <option key={opt.value} value={opt.value}>
                {opt.label}
              </option>
            ))}
          </select>
        </div>

        <button
          onClick={handleRun}
          disabled={loading}
          style={{
            alignSelf: 'flex-end',
            padding: '11px 24px',
            borderRadius: '8px',
            border: 'none',
            fontSize: '13px',
            fontWeight: '700',
            cursor: loading ? 'not-allowed' : 'pointer',
            backgroundColor: '#10b981',
            color: '#ffffff',
            boxShadow: '0 4px 14px rgba(16, 185, 129, 0.3)',
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
            transition: 'all 0.2s ease',
            opacity: loading ? 0.7 : 1
          }}
        >
          {loading ? (
            <>
              <span style={{ display: 'inline-block', animation: 'spin 1s linear infinite' }}>⏳</span>
              Optimizing...
            </>
          ) : (
            <>
              <span>⚡</span>
              Run Optimization Sweep
            </>
          )}
        </button>
      </div>

      {error && (
        <div style={{
          backgroundColor: '#fee2e2',
          border: '1px solid #f87171',
          color: '#991b1b',
          padding: '12px 16px',
          borderRadius: '8px',
          fontSize: '13px'
        }}>
          {error}
        </div>
      )}

      {/* Results Rendering */}
      {results && results.evaluations && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
          {/* Best Recommendation Banner */}
          <div style={{
            backgroundColor: isDark ? 'rgba(16, 185, 129, 0.15)' : '#ecfdf5',
            border: '1px solid #10b981',
            borderRadius: '12px',
            padding: '18px 20px',
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            flexWrap: 'wrap',
            gap: '12px'
          }}>
            <div>
              <span style={{
                fontSize: '11px',
                fontWeight: '800',
                color: '#059669',
                textTransform: 'uppercase',
                letterSpacing: '0.05em'
              }}>
                Optimal Architectural Recommendation
              </span>
              <h4 style={{
                fontSize: '16px',
                fontWeight: '700',
                color: colors.textPrimary,
                margin: '4px 0 0 0'
              }}>
                Best Value: <strong style={{ color: '#10b981' }}>
                  {param === 'Orientation' ? getOrientationName(results.optimal_value) : results.optimal_value}
                </strong>
              </h4>
              <p style={{ fontSize: '12px', color: colors.textSecondary, margin: '2px 0 0 0' }}>
                Yields the lowest combined annual energy load across heating and cooling demands.
              </p>
            </div>

            <div style={{ textAlign: 'right' }}>
              <span style={{ fontSize: '12px', color: colors.textMuted }}>Minimum Total Load:</span>
              <div style={{ fontSize: '24px', fontWeight: '900', color: '#10b981', fontFamily: 'monospace' }}>
                {results.lowest_total_load} <span style={{ fontSize: '13px' }}>kWh/m²</span>
              </div>
            </div>
          </div>

          {/* Sweep Permutations Table */}
          <div style={{ overflowX: 'auto', borderRadius: '12px', border: `1px solid ${colors.border}` }}>
            <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '13px' }}>
              <thead>
                <tr style={{ backgroundColor: colors.bgSurface, borderBottom: `2px solid ${colors.border}` }}>
                  <th style={{ padding: '12px 16px', fontWeight: '700', color: colors.textSecondary }}>Sweep Value</th>
                  <th style={{ padding: '12px 16px', fontWeight: '700', color: colors.textSecondary }}>Heating Load</th>
                  <th style={{ padding: '12px 16px', fontWeight: '700', color: colors.textSecondary }}>Cooling Load</th>
                  <th style={{ padding: '12px 16px', fontWeight: '700', color: colors.textSecondary }}>Total Energy Load</th>
                  <th style={{ padding: '12px 16px', fontWeight: '700', color: colors.textSecondary }}>Comparative Delta</th>
                </tr>
              </thead>
              <tbody>
                {results.evaluations.map((row, idx) => {
                  const isBest = row.total_load === results.lowest_total_load;
                  const delta = (row.total_load - results.lowest_total_load).toFixed(2);
                  const displayVal = param === 'Orientation' ? getOrientationName(row.param_value) : row.param_value;

                  return (
                    <tr
                      key={idx}
                      style={{
                        borderBottom: `1px solid ${colors.border}`,
                        backgroundColor: isBest ? (isDark ? 'rgba(16, 185, 129, 0.12)' : '#f0fdf4') : 'transparent',
                        fontWeight: isBest ? '700' : 'normal'
                      }}
                    >
                      <td style={{ padding: '12px 16px', color: colors.textPrimary, fontFamily: 'monospace' }}>
                        {displayVal} {isBest && <span style={{ marginLeft: '6px', color: '#10b981', fontSize: '11px' }}>★ BEST</span>}
                      </td>
                      <td style={{ padding: '12px 16px', color: '#ef4444', fontFamily: 'monospace' }}>
                        {row.heating_load} kWh/m²
                      </td>
                      <td style={{ padding: '12px 16px', color: '#0ea5e9', fontFamily: 'monospace' }}>
                        {row.cooling_load} kWh/m²
                      </td>
                      <td style={{ padding: '12px 16px', color: colors.textPrimary, fontFamily: 'monospace', fontWeight: '700' }}>
                        {row.total_load} kWh/m²
                      </td>
                      <td style={{ padding: '12px 16px' }}>
                        {isBest ? (
                          <span style={{ color: '#10b981', fontSize: '12px', fontWeight: '700' }}>Baseline (0.00)</span>
                        ) : (
                          <span style={{ color: '#f59e0b', fontSize: '12px', fontFamily: 'monospace' }}>+{delta} kWh/m²</span>
                        )}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}
