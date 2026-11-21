import React from 'react';

export default function DocsPage() {
  return (
    <div style={{
      backgroundColor: '#ffffff',
      borderRadius: '12px',
      padding: '32px',
      boxShadow: '0 1px 3px rgba(0,0,0,0.1)',
      border: '1px solid #e2e8f0',
      lineHeight: '1.6'
    }}>
      <h2 style={{ fontSize: '22px', fontWeight: '700', color: '#1e293b', marginBottom: '16px' }}>
        Project Documentation & Architecture
      </h2>

      <div style={{ marginBottom: '24px' }}>
        <h3 style={{ fontSize: '16px', fontWeight: '600', color: '#2563eb', marginBottom: '8px' }}>
          Overview
        </h3>
        <p style={{ color: '#475569', fontSize: '14px' }}>
          This system models heating and cooling energy loads of residential building forms as a function of 8 architectural parameters.
          The project is engineered for production deployment with an automated ML pipeline, Heroku FastAPI backend, and Vercel React frontend.
        </p>
      </div>

      <div style={{ marginBottom: '24px' }}>
        <h3 style={{ fontSize: '16px', fontWeight: '600', color: '#2563eb', marginBottom: '8px' }}>
          Feature Dictionary
        </h3>
        <ul style={{ color: '#475569', fontSize: '14px', paddingLeft: '20px' }}>
          <li><strong>Relative Compactness (X1):</strong> Ratio between building volume and surface area (0.62 - 0.98).</li>
          <li><strong>Surface Area (X2):</strong> Total building envelope surface in m² (514.5 - 808.5).</li>
          <li><strong>Wall Area (X3):</strong> Exterior vertical wall area in m² (245.0 - 416.5).</li>
          <li><strong>Roof Area (X4):</strong> Roof boundary area in m² (110.25 - 220.50).</li>
          <li><strong>Overall Height (X5):</strong> Total building height (3.5m = 1-story, 7.0m = 2-story).</li>
          <li><strong>Orientation (X6):</strong> Cardinal direction (2: North, 3: East, 4: South, 5: West).</li>
          <li><strong>Glazing Area (X7):</strong> Percentage of exterior wall glazed (0.00, 0.10, 0.25, 0.40).</li>
          <li><strong>Glazing Area Distribution (X8):</strong> Distribution symmetry pattern (0 to 5).</li>
        </ul>
      </div>

      <div style={{ marginBottom: '24px' }}>
        <h3 style={{ fontSize: '16px', fontWeight: '600', color: '#2563eb', marginBottom: '8px' }}>
          Engineered Features
        </h3>
        <ul style={{ color: '#475569', fontSize: '14px', paddingLeft: '20px' }}>
          <li><strong>Wall_Surface_Ratio:</strong> <code>Wall_Area / Surface_Area</code> (captures envelope proportion).</li>
          <li><strong>Glazing_x_Height:</strong> <code>Glazing_Area * Overall_Height</code> (captures total vertical solar exposure).</li>
        </ul>
      </div>

      <div style={{ backgroundColor: '#f8fafc', padding: '16px', borderRadius: '8px', border: '1px solid #e2e8f0' }}>
        <h4 style={{ fontSize: '14px', fontWeight: '600', color: '#334155', marginBottom: '4px' }}>
          Deployment & Engineering
        </h4>
        <p style={{ color: '#64748b', fontSize: '13px' }}>
          <strong>Backend:</strong> FastAPI deployed on Heroku with <code>Procfile</code> serving production <code>model_bundle.joblib</code>.<br />
          <strong>Frontend:</strong> React (Vite) deployed on Vercel with automated continuous delivery.
        </p>
      </div>
    </div>
  );
}
