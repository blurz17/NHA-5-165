import React from 'react';
import { useTheme } from '../context/ThemeContext';

export default function BuildingForm({ features, setFeatures, algorithm, setAlgorithm, onPredict, loading }) {
  const { isDark, colors } = useTheme();

  const handleChange = (field, val) => {
    setFeatures((prev) => ({
      ...prev,
      [field]: parseFloat(val) || 0,
    }));
  };

  const presets = [
    {
      name: 'Compact High-Rise',
      icon: '🏙️',
      values: { Relative_Compactness: 0.98, Surface_Area: 514.5, Wall_Area: 294.0, Roof_Area: 110.25, Overall_Height: 7.0, Orientation: 2, Glazing_Area: 0.10, Glazing_Area_Distribution: 1 }
    },
    {
      name: 'Sprawling Low-Rise',
      icon: '🏡',
      values: { Relative_Compactness: 0.64, Surface_Area: 784.0, Wall_Area: 343.0, Roof_Area: 220.50, Overall_Height: 3.5, Orientation: 4, Glazing_Area: 0.25, Glazing_Area_Distribution: 3 }
    },
    {
      name: 'Glazed Office Tower',
      icon: '🏢',
      values: { Relative_Compactness: 0.90, Surface_Area: 563.5, Wall_Area: 318.5, Roof_Area: 122.50, Overall_Height: 7.0, Orientation: 3, Glazing_Area: 0.40, Glazing_Area_Distribution: 2 }
    },
  ];

  return (
    <div style={{
      backgroundColor: colors.bgCard,
      borderRadius: '16px',
      padding: '24px',
      boxShadow: isDark ? '0 8px 32px rgba(0,0,0,0.4)' : '0 4px 20px rgba(0,0,0,0.06)',
      border: `1px solid ${colors.border}`,
      display: 'flex',
      flexDirection: 'column',
      gap: '20px'
    }}>
      {/* Header & Presets */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '12px' }}>
        <div>
          <h2 style={{ fontSize: '16px', fontWeight: '700', color: colors.textPrimary, margin: 0 }}>
            Architectural Envelope Configuration
          </h2>
          <p style={{ fontSize: '12px', color: colors.textSecondary, marginTop: '2px' }}>
            Modify geometric variables to observe real-time 3D and thermal load shifts
          </p>
        </div>

        {/* Preset Archetypes */}
        <div style={{ display: 'flex', gap: '8px' }}>
          {presets.map((p) => (
            <button
              key={p.name}
              type="button"
              onClick={() => setFeatures(p.values)}
              style={{
                fontSize: '11px',
                fontWeight: '600',
                padding: '5px 10px',
                backgroundColor: isDark ? '#1e293b' : '#f1f5f9',
                border: `1px solid ${colors.border}`,
                borderRadius: '8px',
                cursor: 'pointer',
                color: colors.textPrimary,
                transition: 'all 0.15s ease',
                display: 'flex',
                alignItems: 'center',
                gap: '4px'
              }}
            >
              <span>{p.icon}</span>
              <span>{p.name}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Sliders & Dropdown Grid */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '18px' }}>
        {/* Relative Compactness */}
        <div style={{ backgroundColor: colors.bgSubtle, padding: '14px', borderRadius: '12px', border: `1px solid ${colors.borderSubtle}` }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '12px', fontWeight: '600', color: colors.textPrimary }}>
            <span>Relative Compactness</span>
            <span style={{ color: '#38bdf8', fontFamily: 'monospace' }}>{features.Relative_Compactness}</span>
          </div>
          <input
            type="range"
            min="0.62"
            max="0.98"
            step="0.02"
            value={features.Relative_Compactness}
            onChange={(e) => handleChange('Relative_Compactness', e.target.value)}
            style={{ width: '100%', marginTop: '10px', accentColor: '#38bdf8' }}
          />
          <span style={{ fontSize: '10px', color: colors.textMuted }}>Range: 0.62 (sprawling) to 0.98 (compact cube)</span>
        </div>

        {/* Surface Area */}
        <div style={{ backgroundColor: colors.bgSubtle, padding: '14px', borderRadius: '12px', border: `1px solid ${colors.borderSubtle}` }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '12px', fontWeight: '600', color: colors.textPrimary }}>
            <span>Surface Area</span>
            <span style={{ color: '#38bdf8', fontFamily: 'monospace' }}>{features.Surface_Area} m²</span>
          </div>
          <input
            type="range"
            min="514.5"
            max="808.5"
            step="24.5"
            value={features.Surface_Area}
            onChange={(e) => handleChange('Surface_Area', e.target.value)}
            style={{ width: '100%', marginTop: '10px', accentColor: '#38bdf8' }}
          />
          <span style={{ fontSize: '10px', color: colors.textMuted }}>Total exterior envelope boundary</span>
        </div>

        {/* Wall Area */}
        <div style={{ backgroundColor: colors.bgSubtle, padding: '14px', borderRadius: '12px', border: `1px solid ${colors.borderSubtle}` }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '12px', fontWeight: '600', color: colors.textPrimary }}>
            <span>Wall Area</span>
            <span style={{ color: '#38bdf8', fontFamily: 'monospace' }}>{features.Wall_Area} m²</span>
          </div>
          <input
            type="range"
            min="245.0"
            max="416.5"
            step="12.25"
            value={features.Wall_Area}
            onChange={(e) => handleChange('Wall_Area', e.target.value)}
            style={{ width: '100%', marginTop: '10px', accentColor: '#38bdf8' }}
          />
          <span style={{ fontSize: '10px', color: colors.textMuted }}>Vertical wall facade area</span>
        </div>

        {/* Roof Area */}
        <div style={{ backgroundColor: colors.bgSubtle, padding: '14px', borderRadius: '12px', border: `1px solid ${colors.borderSubtle}` }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '12px', fontWeight: '600', color: colors.textPrimary }}>
            <span>Roof Area</span>
            <span style={{ color: '#38bdf8', fontFamily: 'monospace' }}>{features.Roof_Area} m²</span>
          </div>
          <input
            type="range"
            min="110.25"
            max="220.50"
            step="12.25"
            value={features.Roof_Area}
            onChange={(e) => handleChange('Roof_Area', e.target.value)}
            style={{ width: '100%', marginTop: '10px', accentColor: '#38bdf8' }}
          />
          <span style={{ fontSize: '10px', color: colors.textMuted }}>Horizontal roof boundary area</span>
        </div>

        {/* Overall Height */}
        <div style={{ backgroundColor: colors.bgSubtle, padding: '14px', borderRadius: '12px', border: `1px solid ${colors.borderSubtle}` }}>
          <span style={{ fontSize: '12px', fontWeight: '600', color: colors.textPrimary }}>Vertical Stories</span>
          <div style={{ display: 'flex', gap: '8px', marginTop: '10px' }}>
            {[
              { label: '1 Story (3.5m)', val: 3.5 },
              { label: '2 Stories (7.0m)', val: 7.0 }
            ].map((opt) => (
              <button
                key={opt.val}
                type="button"
                onClick={() => handleChange('Overall_Height', opt.val)}
                style={{
                  flex: 1,
                  padding: '8px',
                  borderRadius: '8px',
                  border: `1px solid ${features.Overall_Height === opt.val ? '#3b82f6' : colors.border}`,
                  backgroundColor: features.Overall_Height === opt.val ? (isDark ? 'rgba(59,130,246,0.2)' : '#eff6ff') : 'transparent',
                  color: features.Overall_Height === opt.val ? '#3b82f6' : colors.textSecondary,
                  fontWeight: '600',
                  fontSize: '11px',
                  cursor: 'pointer'
                }}
              >
                {opt.label}
              </button>
            ))}
          </div>
        </div>

        {/* Cardinal Orientation */}
        <div style={{ backgroundColor: colors.bgSubtle, padding: '14px', borderRadius: '12px', border: `1px solid ${colors.borderSubtle}` }}>
          <span style={{ fontSize: '12px', fontWeight: '600', color: colors.textPrimary }}>Cardinal Orientation</span>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '6px', marginTop: '10px' }}>
            {[
              { code: 2, label: 'North', icon: 'N' },
              { code: 3, label: 'East', icon: 'E' },
              { code: 4, label: 'South', icon: 'S' },
              { code: 5, label: 'West', icon: 'W' }
            ].map((d) => (
              <button
                key={d.code}
                type="button"
                onClick={() => handleChange('Orientation', d.code)}
                style={{
                  padding: '7px 4px',
                  borderRadius: '8px',
                  border: `1px solid ${features.Orientation === d.code ? '#3b82f6' : colors.border}`,
                  backgroundColor: features.Orientation === d.code ? (isDark ? 'rgba(59,130,246,0.2)' : '#eff6ff') : 'transparent',
                  color: features.Orientation === d.code ? '#3b82f6' : colors.textSecondary,
                  fontWeight: '700',
                  fontSize: '11px',
                  cursor: 'pointer'
                }}
              >
                {d.icon}
              </button>
            ))}
          </div>
        </div>

        {/* Glazing Area Ratio */}
        <div style={{ backgroundColor: colors.bgSubtle, padding: '14px', borderRadius: '12px', border: `1px solid ${colors.borderSubtle}` }}>
          <span style={{ fontSize: '12px', fontWeight: '600', color: colors.textPrimary }}>Glazing Area (Window Ratio)</span>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '6px', marginTop: '10px' }}>
            {[
              { val: 0.0, label: '0%' },
              { val: 0.10, label: '10%' },
              { val: 0.25, label: '25%' },
              { val: 0.40, label: '40%' }
            ].map((g) => (
              <button
                key={g.val}
                type="button"
                onClick={() => handleChange('Glazing_Area', g.val)}
                style={{
                  padding: '7px 4px',
                  borderRadius: '8px',
                  border: `1px solid ${features.Glazing_Area === g.val ? '#0284c7' : colors.border}`,
                  backgroundColor: features.Glazing_Area === g.val ? (isDark ? 'rgba(2,132,199,0.2)' : '#e0f2fe') : 'transparent',
                  color: features.Glazing_Area === g.val ? '#0284c7' : colors.textSecondary,
                  fontWeight: '700',
                  fontSize: '11px',
                  cursor: 'pointer'
                }}
              >
                {g.label}
              </button>
            ))}
          </div>
        </div>

        {/* Glazing Area Distribution */}
        <div style={{ backgroundColor: colors.bgSubtle, padding: '14px', borderRadius: '12px', border: `1px solid ${colors.borderSubtle}` }}>
          <span style={{ fontSize: '12px', fontWeight: '600', color: colors.textPrimary }}>Glazing Distribution Mode</span>
          <select
            value={features.Glazing_Area_Distribution}
            onChange={(e) => handleChange('Glazing_Area_Distribution', e.target.value)}
            style={{
              width: '100%',
              padding: '8px',
              marginTop: '10px',
              borderRadius: '8px',
              border: `1px solid ${colors.border}`,
              backgroundColor: isDark ? '#1e293b' : '#ffffff',
              color: colors.textPrimary,
              fontSize: '12px',
              fontWeight: '500'
            }}
          >
            <option value="0">0: None (No Windows)</option>
            <option value="1">1: Uniform (All Facades)</option>
            <option value="2">2: North Facade Dominant</option>
            <option value="3">3: East Facade Dominant</option>
            <option value="4">4: South Facade Dominant</option>
            <option value="5">5: West Facade Dominant</option>
          </select>
        </div>
      </div>

      {/* Algorithm Selection & Action Button */}
      <div style={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        flexWrap: 'wrap',
        gap: '16px',
        paddingTop: '16px',
        borderTop: `1px solid ${colors.border}`
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          <span style={{ fontSize: '13px', fontWeight: '600', color: colors.textSecondary }}>
            Inference Engine:
          </span>
          <select
            value={algorithm}
            onChange={(e) => setAlgorithm(e.target.value)}
            style={{
              padding: '8px 14px',
              borderRadius: '8px',
              border: `1px solid ${colors.border}`,
              backgroundColor: isDark ? '#1e293b' : '#ffffff',
              color: colors.textPrimary,
              fontSize: '13px',
              fontWeight: '600'
            }}
          >
            <option value="Random Forest">Random Forest (Recommended &bull; R² 0.998 / 0.961)</option>
            <option value="XGBoost">XGBoost Tuned (Best Precision &bull; R² 0.998 / 0.994)</option>
            <option value="Gradient Boosting">Gradient Boosting (R² 0.997 / 0.977)</option>
            <option value="Decision Tree">Decision Tree (R² 0.997 / 0.945)</option>
            <option value="Linear Regression">Linear Regression Baseline (R² 0.925 / 0.900)</option>
          </select>
        </div>

        <button
          type="button"
          onClick={onPredict}
          disabled={loading}
          style={{
            background: 'linear-gradient(135deg, #2563eb 0%, #3b82f6 100%)',
            color: '#ffffff',
            padding: '12px 28px',
            borderRadius: '10px',
            border: 'none',
            fontSize: '14px',
            fontWeight: '700',
            letterSpacing: '-0.01em',
            cursor: loading ? 'not-allowed' : 'pointer',
            opacity: loading ? 0.7 : 1,
            boxShadow: '0 4px 14px rgba(37, 99, 235, 0.35)',
            transition: 'all 0.15s ease',
            display: 'flex',
            alignItems: 'center',
            gap: '8px'
          }}
        >
          <span>{loading ? '⚡ Running Model Inference...' : '⚡ Compute Thermal Loads'}</span>
        </button>
      </div>
    </div>
  );
}
