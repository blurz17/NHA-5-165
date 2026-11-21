import React from 'react';

export default function ModelComparisonTable({ benchmarks }) {
  if (!benchmarks || benchmarks.length === 0) {
    return <p>Loading model benchmarks...</p>;
  }

  return (
    <div style={{
      backgroundColor: '#ffffff',
      borderRadius: '12px',
      padding: '24px',
      boxShadow: '0 1px 3px rgba(0,0,0,0.1)',
      border: '1px solid #e2e8f0',
      overflowX: 'auto'
    }}>
      <h2 style={{ fontSize: '18px', fontWeight: '700', color: '#1e293b', marginBottom: '8px' }}>
        All 10 Models Evaluation Benchmark
      </h2>
      <p style={{ fontSize: '13px', color: '#64748b', marginBottom: '20px' }}>
        5 Algorithms evaluated across both Heating and Cooling load targets on the independent 20% test partition (154 samples).
      </p>

      <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '13px' }}>
        <thead>
          <tr style={{ backgroundColor: '#f8fafc', borderBottom: '2px solid #e2e8f0' }}>
            <th style={{ padding: '12px 16px', fontWeight: '600', color: '#475569' }}>Algorithm</th>
            <th style={{ padding: '12px 16px', fontWeight: '600', color: '#475569' }}>Target Variable</th>
            <th style={{ padding: '12px 16px', fontWeight: '600', color: '#475569' }}>MAE (kWh/m²)</th>
            <th style={{ padding: '12px 16px', fontWeight: '600', color: '#475569' }}>RMSE (kWh/m²)</th>
            <th style={{ padding: '12px 16px', fontWeight: '600', color: '#475569' }}>R² Score</th>
            <th style={{ padding: '12px 16px', fontWeight: '600', color: '#475569' }}>Status</th>
          </tr>
        </thead>
        <tbody>
          {benchmarks.map((row, idx) => {
            const isBest = row.r2 >= 0.994;
            return (
              <tr
                key={idx}
                style={{
                  borderBottom: '1px solid #f1f5f9',
                  backgroundColor: isBest ? '#f0fdf4' : 'transparent'
                }}
              >
                <td style={{ padding: '12px 16px', fontWeight: '600', color: '#1e293b' }}>
                  {row.algorithm}
                </td>
                <td style={{ padding: '12px 16px' }}>
                  <span style={{
                    padding: '3px 8px',
                    borderRadius: '4px',
                    fontSize: '11px',
                    fontWeight: '600',
                    backgroundColor: row.target.includes('Heating') ? '#fee2e2' : '#dcfce7',
                    color: row.target.includes('Heating') ? '#b91c1c' : '#15803d',
                  }}>
                    {row.target.replace('_', ' ')}
                  </span>
                </td>
                <td style={{ padding: '12px 16px', color: '#334155' }}>{row.mae.toFixed(4)}</td>
                <td style={{ padding: '12px 16px', color: '#334155' }}>{row.rmse.toFixed(4)}</td>
                <td style={{ padding: '12px 16px', fontWeight: '700', color: isBest ? '#15803d' : '#1e293b' }}>
                  {(row.r2 * 100).toFixed(2)}%
                </td>
                <td style={{ padding: '12px 16px' }}>
                  {isBest ? (
                    <span style={{ fontSize: '11px', fontWeight: '600', color: '#16a34a' }}>★ Production Ready</span>
                  ) : (
                    <span style={{ fontSize: '11px', color: '#64748b' }}>Candidate</span>
                  )}
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}
