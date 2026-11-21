import React, { useState } from 'react';
import { optimizeParameter } from '../services/prediction';

export default function OptimizerTool({ baseFeatures }) {
  const [param, setParam] = useState('Glazing_Area');
  const [results, setResults] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleRun = async () => {
    setLoading(true);
    try {
      const res = await optimizeParameter(baseFeatures, param);
      setResults(res);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{
      backgroundColor: '#ffffff',
      borderRadius: '12px',
      padding: '24px',
      boxShadow: '0 1px 3px rgba(0,0,0,0.1)',
      border: '1px solid #e2e8f0'
    }}>
      <h2 style={{ fontSize: '18px', fontWeight: '700', color: '#1e293b', marginBottom: '8px' }}>
        Passive Design Architectural Optimizer
      </h2>
      <p style={{ fontSize: '13px', color: '#64748b', marginBottom: '20px' }}>
        Test configurations across key building parameters to find the lowest energy consumption design.
      </p>

      <div style={{ display: 'flex', gap: '16px', alignItems: 'center', marginBottom: '24px' }}>
        <label style={{ fontSize: '13px', fontWeight: '600', color: '#334155' }}>Select Parameter:</label>
        <select
          value={param}
          onChange={(e) => setParam(e.target.value)}
          style={{ padding: '8px 16px', borderRadius: '6px', border: '1px solid #cbd5e1', fontSize: '13px' }}
        >
          <option value="Glazing_Area">Glazing Area Ratio (0.0 to 0.40)</option>
          <option value="Orientation">Orientation (North, East, South, West)</option>
          <option value="Relative_Compactness">Relative Compactness (0.64 to 0.98)</option>
        </select>

        <button
          onClick={handleRun}
          disabled={loading}
          style={{
            backgroundColor: '#16a34a',
            color: '#ffffff',
            padding: '8px 20px',
            borderRadius: '6px',
            border: 'none',
            fontSize: '13px',
            fontWeight: '600',
            cursor: loading ? 'not-allowed' : 'pointer'
          }}
        >
          {loading ? 'Optimizing...' : 'Run Simulation Scan'}
        </button>
      </div>

      {results && (
        <div>
          <div style={{
            backgroundColor: '#ecfdf5',
            border: '1px solid #a7f3d0',
            borderRadius: '8px',
            padding: '16px',
            marginBottom: '20px'
          }}>
            <h4 style={{ fontSize: '14px', fontWeight: '700', color: '#065f46', marginBottom: '4px' }}>
              ✓ Optimal Configuration Found
            </h4>
            <p style={{ fontSize: '13px', color: '#047857' }}>
              Setting <strong>{results.parameter_optimized}</strong> to <strong>{results.optimal_value}</strong> achieves the minimum combined load of <strong>{results.lowest_total_load} kWh/m²</strong>.
            </p>
          </div>

          <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '13px' }}>
            <thead>
              <tr style={{ backgroundColor: '#f8fafc', borderBottom: '2px solid #e2e8f0' }}>
                <th style={{ padding: '10px 14px', textAlign: 'left' }}>Parameter Value</th>
                <th style={{ padding: '10px 14px', textAlign: 'right' }}>Heating Load (kWh/m²)</th>
                <th style={{ padding: '10px 14px', textAlign: 'right' }}>Cooling Load (kWh/m²)</th>
                <th style={{ padding: '10px 14px', textAlign: 'right' }}>Total Load (kWh/m²)</th>
              </tr>
            </thead>
            <tbody>
              {results.evaluations.map((ev, i) => {
                const isOpt = ev.param_value === results.optimal_value;
                return (
                  <tr key={i} style={{ borderBottom: '1px solid #f1f5f9', backgroundColor: isOpt ? '#f0fdf4' : 'transparent' }}>
                    <td style={{ padding: '10px 14px', fontWeight: isOpt ? '700' : '400' }}>
                      {ev.param_value} {isOpt && '★ (Best)'}
                    </td>
                    <td style={{ padding: '10px 14px', textAlign: 'right', color: '#b91c1c' }}>{ev.heating_load}</td>
                    <td style={{ padding: '10px 14px', textAlign: 'right', color: '#15803d' }}>{ev.cooling_load}</td>
                    <td style={{ padding: '10px 14px', textAlign: 'right', fontWeight: '700', color: '#1e40af' }}>{ev.total_load}</td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
