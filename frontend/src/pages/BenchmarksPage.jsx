import React, { useEffect, useState } from 'react';
import ModelComparisonTable from '../components/ModelComparisonTable';
import { fetchModelsMetadata } from '../services/prediction';

export default function BenchmarksPage() {
  const [benchmarks, setBenchmarks] = useState([]);

  useEffect(() => {
    fetchModelsMetadata().then((data) => {
      if (data && data.benchmarks) {
        setBenchmarks(data.benchmarks);
      }
    });
  }, []);

  return (
    <div>
      <ModelComparisonTable benchmarks={benchmarks} />
    </div>
  );
}
