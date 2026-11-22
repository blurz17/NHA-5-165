import React, { useState, useEffect } from 'react';
import BuildingForm from '../components/BuildingForm';
import PredictionCard from '../components/PredictionCard';
import BuildingViewer3D from '../components/BuildingViewer3D';
import ThermalDistribution from '../components/ThermalDistribution';
import { predictEnergyLoad } from '../services/prediction';
import { useTheme } from '../context/ThemeContext';

export default function SimulatorPage() {
  const { isDark, colors } = useTheme();

  const [features, setFeatures] = useState({
    Relative_Compactness: 0.98,
    Surface_Area: 514.5,
    Wall_Area: 294.0,
    Roof_Area: 110.25,
    Overall_Height: 7.0,
    Orientation: 2,
    Glazing_Area: 0.10,
    Glazing_Area_Distribution: 1,
  });

  const [algorithm, setAlgorithm] = useState('Random Forest');
  const [prediction, setPrediction] = useState(null);
  const [engineered, setEngineered] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const handlePredict = async (currentFeatures = features, currentAlgo = algorithm) => {
    setLoading(true);
    setError(null);
    try {
      const res = await predictEnergyLoad(currentFeatures, currentAlgo);
      if (res && res.prediction) {
        setPrediction(res.prediction);
        setEngineered(res.engineered_features);
      }
    } catch (e) {
      console.error('Prediction failed:', e);
      setError('Failed to connect to backend inference server. Please ensure FastAPI is running.');
    } finally {
      setLoading(false);
    }
  };

  // Run initial prediction on mount so the 3D visualizer and load cards load immediately
  useEffect(() => {
    handlePredict(features, algorithm);
  }, []);

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
      {/* Banner / Title */}
      <div style={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'flex-end',
        flexWrap: 'wrap',
        gap: '16px',
        borderBottom: `1px solid ${colors.border}`,
        paddingBottom: '16px'
      }}>
        <div>
          <h2 style={{
            fontSize: '24px',
            fontWeight: '800',
            letterSpacing: '-0.02em',
            color: colors.textPrimary,
            margin: 0
          }}>
            Digital Twin 3D Thermal Simulation
          </h2>
          <p style={{
            fontSize: '13px',
            color: colors.textSecondary,
            margin: '4px 0 0 0'
          }}>
            Interactive parametric CAD modeling with multi-model heating & cooling load inference
          </p>
        </div>

        <div style={{
          display: 'flex',
          gap: '8px',
          fontSize: '11px',
          fontWeight: '600'
        }}>
          <span style={{
            backgroundColor: isDark ? 'rgba(56, 189, 248, 0.15)' : '#e0f2fe',
            color: '#0284c7',
            padding: '4px 10px',
            borderRadius: '6px',
            border: '1px solid rgba(56, 189, 248, 0.3)'
          }}>
            WebGL 3D Enabled
          </span>
          <span style={{
            backgroundColor: isDark ? 'rgba(239, 68, 68, 0.15)' : '#fee2e2',
            color: '#dc2626',
            padding: '4px 10px',
            borderRadius: '6px',
            border: '1px solid rgba(239, 68, 68, 0.3)'
          }}>
            Thermal IR Shading
          </span>
        </div>
      </div>

      {error && (
        <div style={{
          backgroundColor: '#fee2e2',
          border: '1px solid #f87171',
          color: '#991b1b',
          padding: '12px 16px',
          borderRadius: '8px',
          fontSize: '13px',
          display: 'flex',
          alignItems: 'center',
          gap: '10px'
        }}>
          <span>⚠️</span>
          <span>{error}</span>
        </div>
      )}

      {/* Main Grid: Left Controls, Right Visualizations */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(420px, 1fr))',
        gap: '24px',
        alignItems: 'start'
      }}>
        {/* Left Column: Form Controls */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
          <BuildingForm
            features={features}
            setFeatures={setFeatures}
            algorithm={algorithm}
            setAlgorithm={setAlgorithm}
            onPredict={() => handlePredict(features, algorithm)}
            loading={loading}
          />
        </div>

        {/* Right Column: 3D Viewer & Inference Analytics */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
          {/* 3D Interactive Building Viewer */}
          <BuildingViewer3D
            features={features}
            prediction={prediction}
          />

          {/* Thermal Distribution & EPC Card */}
          <ThermalDistribution
            features={features}
            prediction={prediction}
          />

          {/* Quantitative Prediction Metrics */}
          <PredictionCard
            prediction={prediction}
            engineeredFeatures={engineered}
          />
        </div>
      </div>
    </div>
  );
}
