import React from 'react';
import { useTheme } from '../context/ThemeContext';

export default function DocsPage() {
  const { isDark, colors } = useTheme();

  return (
    <div style={{
      display: 'flex',
      flexDirection: 'column',
      gap: '24px',
      maxWidth: '1000px',
      margin: '0 auto'
    }}>
      <div style={{ borderBottom: `1px solid ${colors.border}`, paddingBottom: '16px' }}>
        <h2 style={{
          fontSize: '24px',
          fontWeight: '800',
          letterSpacing: '-0.02em',
          color: colors.textPrimary,
          margin: 0
        }}>
          System Architecture & Technical Documentation
        </h2>
        <p style={{ fontSize: '13px', color: colors.textSecondary, margin: '4px 0 0 0' }}>
          DEPI Graduation Project &bull; AWS Machine Learning Track &bull; Team CloudXAi (NHA-5-165)
        </p>
      </div>

      <div style={{
        backgroundColor: colors.bgCard,
        borderRadius: '16px',
        padding: '32px',
        boxShadow: isDark ? '0 8px 32px rgba(0,0,0,0.4)' : '0 4px 20px rgba(0,0,0,0.06)',
        border: `1px solid ${colors.border}`,
        lineHeight: '1.7',
        display: 'flex',
        flexDirection: 'column',
        gap: '28px'
      }}>
        {/* Section 1: Overview */}
        <div>
          <h3 style={{ fontSize: '17px', fontWeight: '800', color: '#38bdf8', marginBottom: '8px' }}>
            1. System Overview
          </h3>
          <p style={{ color: colors.textSecondary, fontSize: '14px', margin: 0 }}>
            This production system models and predicts building energy requirements (Heating Load <code>Y1</code> and Cooling Load <code>Y2</code>) as a function of 8 architectural parameters. It integrates a 3D WebGL parametric CAD viewer, multi-model machine learning inference server (FastAPI), and continuous automated deployment on Vercel and Heroku.
          </p>
        </div>

        {/* Section 2: Input Feature Dictionary */}
        <div>
          <h3 style={{ fontSize: '17px', fontWeight: '800', color: '#38bdf8', marginBottom: '12px' }}>
            2. Architectural Feature Dictionary
          </h3>
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
            gap: '12px'
          }}>
            {[
              { code: 'X1', name: 'Relative Compactness', range: '0.62 – 0.98', desc: 'Ratio of building volume to envelope surface area. Higher values indicate cube-like compact structures.' },
              { code: 'X2', name: 'Surface Area', range: '514.5 – 808.5 m²', desc: 'Total external boundary surface area in contact with ambient climate.' },
              { code: 'X3', name: 'Wall Area', range: '245.0 – 416.5 m²', desc: 'Total vertical exterior perimeter wall area.' },
              { code: 'X4', name: 'Roof Area', range: '110.25 – 220.50 m²', desc: 'Horizontal top ceiling surface area directly exposed to solar radiation.' },
              { code: 'X5', name: 'Overall Height', range: '3.5 or 7.0 m', desc: 'Vertical height: 3.5m corresponds to single-story; 7.0m corresponds to 2-story.' },
              { code: 'X6', name: 'Orientation', range: '2, 3, 4, 5', desc: 'Cardinal direction: 2 = North, 3 = East, 4 = South, 5 = West.' },
              { code: 'X7', name: 'Glazing Area', range: '0.00 – 0.40', desc: 'Fenestration ratio (percentage of wall area fitted with glass windows).' },
              { code: 'X8', name: 'Glazing Distribution', range: '0 – 5', desc: 'Spatial placement: 0=None, 1=Uniform, 2=North, 3=East, 4=South, 5=West.' }
            ].map((f) => (
              <div key={f.code} style={{
                backgroundColor: colors.bgSurface,
                padding: '14px',
                borderRadius: '10px',
                border: `1px solid ${colors.border}`
              }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '4px' }}>
                  <span style={{ fontWeight: '800', color: colors.textPrimary, fontSize: '13px' }}>
                    {f.name} <code style={{ color: '#38bdf8' }}>({f.code})</code>
                  </span>
                  <span style={{ fontSize: '11px', color: colors.textMuted, fontFamily: 'monospace' }}>
                    {f.range}
                  </span>
                </div>
                <p style={{ fontSize: '12px', color: colors.textSecondary, margin: 0 }}>
                  {f.desc}
                </p>
              </div>
            ))}
          </div>
        </div>

        {/* Section 3: Feature Engineering */}
        <div>
          <h3 style={{ fontSize: '17px', fontWeight: '800', color: '#38bdf8', marginBottom: '8px' }}>
            3. Feature Engineering Pipeline
          </h3>
          <p style={{ color: colors.textSecondary, fontSize: '14px', marginBottom: '12px' }}>
            Two domain-informed interaction ratios were engineered to capture thermodynamic envelope proportions and vertical solar gains:
          </p>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
            <div style={{
              backgroundColor: colors.bgSurface,
              padding: '12px 16px',
              borderRadius: '8px',
              border: `1px solid ${colors.border}`,
              fontFamily: 'monospace',
              fontSize: '13px'
            }}>
              <strong style={{ color: colors.textPrimary }}>Wall_Surface_Ratio</strong> = Wall_Area / Surface_Area
              <span style={{ color: colors.textMuted, marginLeft: '12px', fontSize: '12px' }}>
                (Isolates the proportion of vertical facade relative to total envelope)
              </span>
            </div>
            <div style={{
              backgroundColor: colors.bgSurface,
              padding: '12px 16px',
              borderRadius: '8px',
              border: `1px solid ${colors.border}`,
              fontFamily: 'monospace',
              fontSize: '13px'
            }}>
              <strong style={{ color: colors.textPrimary }}>Glazing_x_Height</strong> = Glazing_Area * Overall_Height
              <span style={{ color: colors.textMuted, marginLeft: '12px', fontSize: '12px' }}>
                (Models total vertical fenestration exposure directly impacting solar heat gain)
              </span>
            </div>
          </div>
        </div>

        {/* Section 4: Production Deployment Spec */}
        <div>
          <h3 style={{ fontSize: '17px', fontWeight: '800', color: '#38bdf8', marginBottom: '8px' }}>
            4. Production Architecture & Deployment
          </h3>
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
            gap: '16px'
          }}>
            <div style={{
              backgroundColor: colors.bgSurface,
              padding: '16px',
              borderRadius: '10px',
              border: `1px solid ${colors.border}`
            }}>
              <h4 style={{ fontSize: '14px', fontWeight: '700', color: colors.textPrimary, margin: '0 0 8px 0' }}>
                🚀 FastAPI Backend (Heroku)
              </h4>
              <ul style={{ fontSize: '12px', color: colors.textSecondary, paddingLeft: '18px', margin: 0 }}>
                <li>Served via <code>uvicorn backend.app.main:app</code> configured in <code>Procfile</code>.</li>
                <li>Single self-contained bundle <code>artifacts/production/model_bundle.joblib</code> (13.4 MB compressed).</li>
                <li>Instantaneous inference latency: ~5ms per prediction.</li>
                <li>Full OpenAPI / Swagger specification at <code>/docs</code>.</li>
              </ul>
            </div>

            <div style={{
              backgroundColor: colors.bgSurface,
              padding: '16px',
              borderRadius: '10px',
              border: `1px solid ${colors.border}`
            }}>
              <h4 style={{ fontSize: '14px', fontWeight: '700', color: colors.textPrimary, margin: '0 0 8px 0' }}>
                ⚡ React 18 + Vite Frontend (Vercel)
              </h4>
              <ul style={{ fontSize: '12px', color: colors.textSecondary, paddingLeft: '18px', margin: 0 }}>
                <li>Built with Vite and Three.js WebGL 3D rendering.</li>
                <li>Theme system with dark/light mode and semantic design tokens.</li>
                <li>Interactive 3D building model with real-time parametric deformation and thermal heatmap false-color shading.</li>
                <li>Configured for automated edge deployments via <code>vercel.json</code>.</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
