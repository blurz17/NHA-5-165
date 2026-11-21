import React from 'react';

export default function PredictionCard({ prediction, engineeredFeatures }) {
  if (!prediction) {
    return (
      <div style={{
        backgroundColor: '#ffffff',
        borderRadius: '12px',
        padding: '32px',
        textAlign: 'center',
        border: '2px dashed #cbd5e1',
        color: '#94a3b8'
      }}>
        <div style={{ fontSize: '36px', marginBottom: '8px' }}>📊</div>
        <p style={{ fontWeight: '500' }}>Adjust parameters and click "Calculate Thermal Loads" to see predictions</p>
      </div>
    );
  }

  const { heating_load_kwh, cooling_load_kwh, total_load_kwh, algorithm_used } = prediction;

  return (
    <div style={{
      backgroundColor: '#ffffff',
      borderRadius: '12px',
      padding: '24px',
      boxShadow: '0 1px 3px rgba(0,0,0,0.1)',
      border: '1px solid #e2e8f0'
    }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
        <h2 style={{ fontSize: '16px', fontWeight: '600', color: '#1e293b' }}>
          Thermal Load Predictions
        </h2>
        <span style={{
          fontSize: '11px',
          fontWeight: '600',
          backgroundColor: '#eff6ff',
          color: '#2563eb',
          padding: '4px 10px',
          borderRadius: '20px',
          border: '1px solid #bfdbfe'
        }}>
          {algorithm_used}
        </span>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '16px', marginBottom: '24px' }}>
        <div style={{
          backgroundColor: '#fef2f2',
          border: '1px solid #fee2e2',
          borderRadius: '10px',
          padding: '16px',
          textAlign: 'center'
        }}>
          <span style={{ fontSize: '12px', fontWeight: '600', color: '#dc2626' }}>🔥 Heating Load</span>
          <div style={{ fontSize: '26px', fontWeight: '700', color: '#991b1b', marginTop: '6px' }}>
            {heating_load_kwh}
          </div>
          <span style={{ fontSize: '11px', color: '#ef4444' }}>kWh/m²</span>
        </div>

        <div style={{
          backgroundColor: '#f0fdf4',
          border: '1px solid #dcfce7',
          borderRadius: '10px',
          padding: '16px',
          textAlign: 'center'
        }}>
          <span style={{ fontSize: '12px', fontWeight: '600', color: '#16a34a' }}>❄️ Cooling Load</span>
          <div style={{ fontSize: '26px', fontWeight: '700', color: '#166534', marginTop: '6px' }}>
            {cooling_load_kwh}
          </div>
          <span style={{ fontSize: '11px', color: '#22c55e' }}>kWh/m²</span>
        </div>

        <div style={{
          backgroundColor: '#eff6ff',
          border: '1px solid #dbeafe',
          borderRadius: '10px',
          padding: '16px',
          textAlign: 'center'
        }}>
          <span style={{ fontSize: '12px', fontWeight: '600', color: '#2563eb' }}>⚡ Total Load</span>
          <div style={{ fontSize: '26px', fontWeight: '700', color: '#1e40af', marginTop: '6px' }}>
            {total_load_kwh}
          </div>
          <span style={{ fontSize: '11px', color: '#3b82f6' }}>kWh/m²</span>
        </div>
      </div>

      {engineeredFeatures && (
        <div style={{ backgroundColor: '#f8fafc', borderRadius: '8px', padding: '12px', border: '1px solid #e2e8f0' }}>
          <h4 style={{ fontSize: '12px', fontWeight: '600', color: '#475569', marginBottom: '8px' }}>
            Engineered Features (Pipeline Computed):
          </h4>
          <div style={{ display: 'flex', gap: '24px', fontSize: '12px', color: '#64748b' }}>
            <div>
              <strong>Wall Surface Ratio:</strong> {engineeredFeatures.Wall_Surface_Ratio}
            </div>
            <div>
              <strong>Glazing &times; Height:</strong> {engineeredFeatures.Glazing_x_Height} m
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
