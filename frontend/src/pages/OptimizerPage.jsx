import React, { useState } from 'react';
import OptimizerTool from '../components/OptimizerTool';

export default function OptimizerPage() {
  const [baseFeatures] = useState({
    Relative_Compactness: 0.82,
    Surface_Area: 612.5,
    Wall_Area: 318.5,
    Roof_Area: 147.0,
    Overall_Height: 7.0,
    Orientation: 2,
    Glazing_Area: 0.25,
    Glazing_Area_Distribution: 2,
  });

  return (
    <div>
      <OptimizerTool baseFeatures={baseFeatures} />
    </div>
  );
}
