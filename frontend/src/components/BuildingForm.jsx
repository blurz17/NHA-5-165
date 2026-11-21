import React from 'react';

export default function BuildingForm({ features, setFeatures, algorithm, setAlgorithm, onPredict, loading }) {
  const handleChange = (field, val) => {
    setFeatures((prev) => ({
      ...prev,
      [field]: parseFloat(val) || 0,
    }));
  };

  const presets = [
    { name: 'Compact High-Rise', values: { Relative_Compactness: 0.98, Surface_Area: 514.5, Wall_Area: 294.0, Roof_Area: 110.25, Overall_Height: 7.0, Orientation: 2, Glazing_Area: 0.10, Glazing_Area_Distribution: 1 } },
    { name: 'Sprawling Low-Rise', values: { Relative_Compactness: 0.64, Surface_Area: 784.0, Wall_Area: 343.0, Roof_Area: 220.50, Overall_Height: 3.5, Orientation: 4, Glazing_Area: 0.25, Glazing_Area_Distribution: 3 } },
    { name: 'Glazed Office Tower', values: { Relative_Compactness: 0.90, Surface_Area: 563.5, Wall_Area: 318.5, Roof_Area: 122.50, Overall_Height: 7.0, Orientation: 3, Glazing_Area: 0.40, Glazing_Area_Distribution: 2 } },
  ];

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
          Building Architectural Parameters
        </h2>
        <div style={{ display: 'flex', gap: '8px' }}>
          {presets.map((p) => (
            <button
              key={p.name}
              type="button"
              onClick={() => setFeatures(p.values)}
              style={{
                fontSize: '11px',
                padding: '4px 8px',
                backgroundColor: '#f1f5f9',
                border: '1px solid #cbd5e1',
                borderRadius: '4px',
                cursor: 'pointer',
                color: '#475569'
              }}
            >
              {p.name}
            </button>
          ))}
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '16px', marginBottom: '20px' }}>
        <div>
          <label style={{ fontSize: '12px', fontWeight: '500', color: '#64748b' }}>
            Relative Compactness ({features.Relative_Compactness})
          </label>
          <input
            type="range"
            min="0.62"
            max="0.98"
            step="0.02"
            value={features.Relative_Compactness}
            onChange={(e) => handleChange('Relative_Compactness', e.target.value)}
            style={{ width: '100%', marginTop: '6px' }}
          />
        </div>

        <div>
          <label style={{ fontSize: '12px', fontWeight: '500', color: '#64748b' }}>
            Surface Area: {features.Surface_Area} m²
          </label>
          <input
            type="range"
            min="514.5"
            max="808.5"
            step="24.5"
            value={features.Surface_Area}
            onChange={(e) => handleChange('Surface_Area', e.target.value)}
            style={{ width: '100%', marginTop: '6px' }}
          />
        </div>

        <div>
          <label style={{ fontSize: '12px', fontWeight: '500', color: '#64748b' }}>
            Wall Area: {features.Wall_Area} m²
          </label>
          <input
            type="range"
            min="245.0"
            max="416.5"
            step="12.25"
            value={features.Wall_Area}
            onChange={(e) => handleChange('Wall_Area', e.target.value)}
            style={{ width: '100%', marginTop: '6px' }}
          />
        </div>

        <div>
          <label style={{ fontSize: '12px', fontWeight: '500', color: '#64748b' }}>
            Roof Area: {features.Roof_Area} m²
          </label>
          <input
            type="range"
            min="110.25"
            max="220.50"
            step="12.25"
            value={features.Roof_Area}
            onChange={(e) => handleChange('Roof_Area', e.target.value)}
            style={{ width: '100%', marginTop: '6px' }}
          />
        </div>

        <div>
          <label style={{ fontSize: '12px', fontWeight: '500', color: '#64748b' }}>
            Overall Height
          </label>
          <select
            value={features.Overall_Height}
            onChange={(e) => handleChange('Overall_Height', e.target.value)}
            style={{ width: '100%', padding: '8px', marginTop: '6px', borderRadius: '6px', border: '1px solid #cbd5e1' }}
          >
            <option value="3.5">3.5 meters (1 Story)</option>
            <option value="7.0">7.0 meters (2 Stories)</option>
          </select>
        </div>

        <div>
          <label style={{ fontSize: '12px', fontWeight: '500', color: '#64748b' }}>
            Orientation
          </label>
          <select
            value={features.Orientation}
            onChange={(e) => handleChange('Orientation', e.target.value)}
            style={{ width: '100%', padding: '8px', marginTop: '6px', borderRadius: '6px', border: '1px solid #cbd5e1' }}
          >
            <option value="2">North (2)</option>
            <option value="3">East (3)</option>
            <option value="4">South (4)</option>
            <option value="5">West (5)</option>
          </select>
        </div>

        <div>
          <label style={{ fontSize: '12px', fontWeight: '500', color: '#64748b' }}>
            Glazing Area Ratio
          </label>
          <select
            value={features.Glazing_Area}
            onChange={(e) => handleChange('Glazing_Area', e.target.value)}
            style={{ width: '100%', padding: '8px', marginTop: '6px', borderRadius: '6px', border: '1px solid #cbd5e1' }}
          >
            <option value="0.0">0.0 (No Windows)</option>
            <option value="0.10">0.10 (10% Glazed)</option>
            <option value="0.25">0.25 (25% Glazed)</option>
            <option value="0.40">0.40 (40% Glazed)</option>
          </select>
        </div>

        <div>
          <label style={{ fontSize: '12px', fontWeight: '500', color: '#64748b' }}>
            Glazing Distribution
          </label>
          <select
            value={features.Glazing_Area_Distribution}
            onChange={(e) => handleChange('Glazing_Area_Distribution', e.target.value)}
            style={{ width: '100%', padding: '8px', marginTop: '6px', borderRadius: '6px', border: '1px solid #cbd5e1' }}
          >
            <option value="0">0 - None</option>
            <option value="1">1 - Uniform</option>
            <option value="2">2 - North Dominant</option>
            <option value="3">3 - East Dominant</option>
            <option value="4">4 - South Dominant</option>
            <option value="5">5 - West Dominant</option>
          </select>
        </div>
      </div>

      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', paddingTop: '16px', borderTop: '1px solid #f1f5f9' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <span style={{ fontSize: '13px', fontWeight: '500', color: '#475569' }}>Algorithm:</span>
          <select
            value={algorithm}
            onChange={(e) => setAlgorithm(e.target.value)}
            style={{ padding: '6px 12px', borderRadius: '6px', border: '1px solid #cbd5e1', fontSize: '13px' }}
          >
            <option value="Random Forest">Random Forest (Recommended - R²: 0.998 / 0.961)</option>
            <option value="XGBoost">XGBoost Tuned (Best Precision - R²: 0.998 / 0.994)</option>
            <option value="Gradient Boosting">Gradient Boosting (R²: 0.997 / 0.977)</option>
            <option value="Decision Tree">Decision Tree (R²: 0.997 / 0.945)</option>
            <option value="Linear Regression">Linear Regression (Baseline - R²: 0.925 / 0.900)</option>
          </select>
        </div>

        <button
          type="button"
          onClick={onPredict}
          disabled={loading}
          style={{
            backgroundColor: '#2563eb',
            color: '#ffffff',
            padding: '10px 24px',
            borderRadius: '8px',
            border: 'none',
            fontSize: '14px',
            fontWeight: '600',
            cursor: loading ? 'not-allowed' : 'pointer',
            opacity: loading ? 0.7 : 1,
            boxShadow: '0 2px 4px rgba(37, 99, 235, 0.2)'
          }}
        >
          {loading ? 'Predicting...' : 'Calculate Thermal Loads'}
        </button>
      </div>
    </div>
  );
}
