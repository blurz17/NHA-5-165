import React, { useState } from 'react';
import BuildingForm from '../components/BuildingForm';
import PredictionCard from '../components/PredictionCard';
import { predictEnergyLoad } from '../services/prediction';

export default function SimulatorPage() {
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

  const handlePredict = async () => {
    setLoading(true);
    try {
      const res = await predictEnergyLoad(features, algorithm);
      if (res && res.prediction) {
        setPrediction(res.prediction);
        setEngineered(res.engineered_features);
      }
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ display: 'grid', gridTemplateColumns: '1fr', gap: '24px' }}>
      <BuildingForm
        features={features}
        setFeatures={setFeatures}
        algorithm={algorithm}
        setAlgorithm={setAlgorithm}
        onPredict={handlePredict}
        loading={loading}
      />
      <PredictionCard
        prediction={prediction}
        engineeredFeatures={engineered}
      />
    </div>
  );
}
