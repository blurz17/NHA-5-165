import React from 'react';
import { useTheme } from '../context/ThemeContext';

export default function ThermalDistribution({ features, prediction }) {
  const { isDark, colors } = useTheme();

  if (!prediction) return null;

  const { heating_load_kwh, cooling_load_kwh, total_load_kwh } = prediction;
  const heatRatio = Math.round((heating_load_kwh / total_load_kwh) * 100);
  const coolRatio = 100 - heatRatio;

  // Energy Performance Certificate (EPC) calculation based on standard European building benchmarks
  let epcGrade = 'B';
  let epcColor = '#10b981'; // Green
  if (total_load_kwh < 25) {
    epcGrade = 'A+';
    epcColor = '#059669';
  } else if (total_load_kwh < 38) {
    epcGrade = 'A';
    epcColor = '#10b981';
  } else if (total_load_kwh < 50) {
    epcGrade = 'B';
    epcColor = '#3b82f6';
  } else if (total_load_kwh < 65) {
    epcGrade = 'C';
    epcColor = '#f59e0b';
  } else if (total_load_kwh < 80) {
    epcGrade = 'D';
    epcColor = '#f97316';
  } else {
    epcGrade = 'E';
    epcColor = '#ef4444';
  }

  // Estimated envelope heat loss distribution based on architectural geometry
  const totalEnvelope = features.Surface_Area;
  const wallPct = Math.round((features.Wall_Area / totalEnvelope) * 100);
  const roofPct = Math.round((features.Roof_Area / totalEnvelope) * 100);
  const glazingPct = Math.round(features.Glazing_Area * 100);

  return (
    <div style={{
      backgroundColor: colors.bgCard,
      borderRadius: '16px',
      padding: '24px',
      border: `1px solid ${colors.border}`,
      boxShadow: isDark ? '0 8px 32px rgba(0,0,0,0.4)' : '0 4px 20px rgba(0,0,0,0.06)',
      display: 'flex',
      flexDirection: 'column',
      gap: '20px'
    }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div>
          <h3 style={{ fontSize: '15px', fontWeight: '700', color: colors.textPrimary }}>
            Thermal Load Balance & Energy Rating
          </h3>
          <p style={{ fontSize: '12px', color: colors.textSecondary, marginTop: '2px' }}>
            Building envelope energy partitioning and operational classification
          </p>
        </div>

        {/* EPC Energy Efficiency Badge */}
        <div style={{
          display: 'flex',
          alignItems: 'center',
          gap: '8px',
          padding: '6px 14px',
          borderRadius: '10px',
          backgroundColor: isDark ? 'rgba(255,255,255,0.05)' : '#f1f5f9',
          border: `1px solid ${colors.border}`
        }}>
          <span style={{ fontSize: '11px', fontWeight: '600', color: colors.textSecondary }}>EPC Rating:</span>
          <span style={{
            fontSize: '16px',
            fontWeight: '800',
            color: epcColor,
            fontFamily: 'monospace'
          }}>
            {epcGrade}
          </span>
        </div>
      </div>

      {/* Heating vs Cooling Energy Ratio Bar */}
      <div>
        <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '12px', fontWeight: '600', marginBottom: '8px' }}>
          <span style={{ color: colors.heatText }}>🔥 Heating Demand: {heatRatio}% ({heating_load_kwh} kWh/m²)</span>
          <span style={{ color: colors.coolText }}>❄️ Cooling Demand: {coolRatio}% ({cooling_load_kwh} kWh/m²)</span>
        </div>
        <div style={{
          height: '12px',
          borderRadius: '6px',
          overflow: 'hidden',
          display: 'flex',
          backgroundColor: colors.borderSubtle
        }}>
          <div style={{ width: `${heatRatio}%`, background: colors.heatGrad, transition: 'width 0.4s ease' }} />
          <div style={{ width: `${coolRatio}%`, background: colors.coolGrad, transition: 'width 0.4s ease' }} />
        </div>
      </div>

      {/* Envelope Distribution Metrics Grid */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(130px, 1fr))',
        gap: '12px',
        paddingTop: '8px'
      }}>
        <div style={{
          backgroundColor: colors.bgSubtle,
          padding: '12px',
          borderRadius: '10px',
          border: `1px solid ${colors.borderSubtle}`
        }}>
          <span style={{ fontSize: '11px', color: colors.textSecondary, fontWeight: '500' }}>Roof Area Share</span>
          <div style={{ fontSize: '18px', fontWeight: '700', color: colors.textPrimary, marginTop: '4px' }}>
            {roofPct}%
          </div>
          <span style={{ fontSize: '11px', color: colors.textMuted }}>{features.Roof_Area} m²</span>
        </div>

        <div style={{
          backgroundColor: colors.bgSubtle,
          padding: '12px',
          borderRadius: '10px',
          border: `1px solid ${colors.borderSubtle}`
        }}>
          <span style={{ fontSize: '11px', color: colors.textSecondary, fontWeight: '500' }}>Vertical Wall Share</span>
          <div style={{ fontSize: '18px', fontWeight: '700', color: colors.textPrimary, marginTop: '4px' }}>
            {wallPct}%
          </div>
          <span style={{ fontSize: '11px', color: colors.textMuted }}>{features.Wall_Area} m²</span>
        </div>

        <div style={{
          backgroundColor: colors.bgSubtle,
          padding: '12px',
          borderRadius: '10px',
          border: `1px solid ${colors.borderSubtle}`
        }}>
          <span style={{ fontSize: '11px', color: colors.textSecondary, fontWeight: '500' }}>Window Aperture</span>
          <div style={{ fontSize: '18px', fontWeight: '700', color: '#0284c7', marginTop: '4px' }}>
            {glazingPct}%
          </div>
          <span style={{ fontSize: '11px', color: colors.textMuted }}>Glazing Ratio</span>
        </div>

        <div style={{
          backgroundColor: colors.bgSubtle,
          padding: '12px',
          borderRadius: '10px',
          border: `1px solid ${colors.borderSubtle}`
        }}>
          <span style={{ fontSize: '11px', color: colors.textSecondary, fontWeight: '500' }}>Compactness Index</span>
          <div style={{ fontSize: '18px', fontWeight: '700', color: '#8b5cf6', marginTop: '4px' }}>
            {features.Relative_Compactness}
          </div>
          <span style={{ fontSize: '11px', color: colors.textMuted }}>Volume/Area Ratio</span>
        </div>
      </div>
    </div>
  );
}
