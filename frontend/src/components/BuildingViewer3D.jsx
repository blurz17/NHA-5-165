import React, { useEffect, useRef, useState } from 'react';
import * as THREE from 'three';
import { useTheme } from '../context/ThemeContext';

export default function BuildingViewer3D({ features, prediction }) {
  const mountRef = useRef(null);
  const { isDark, colors } = useTheme();

  const [shadingMode, setShadingMode] = useState('architectural'); // 'architectural' or 'thermal'
  const [autoRotate, setAutoRotate] = useState(true);

  // References to preserve Three.js state across renders
  const sceneRef = useRef(null);
  const rendererRef = useRef(null);
  const cameraRef = useRef(null);
  const buildingGroupRef = useRef(null);
  const compassGroupRef = useRef(null);
  const animFrameId = useRef(null);

  // Mouse interaction state
  const isDragging = useRef(false);
  const previousMousePosition = useRef({ x: 0, y: 0 });
  const cameraDistance = useRef(15);
  const cameraRotation = useRef({ theta: Math.PI / 3.8, phi: Math.PI / 4.2 });

  useEffect(() => {
    const container = mountRef.current;
    if (!container) return;

    const width = container.clientWidth;
    const height = container.clientHeight || 440;

    // 1. Scene
    const scene = new THREE.Scene();
    sceneRef.current = scene;

    // 2. Camera
    const camera = new THREE.PerspectiveCamera(42, width / height, 0.1, 100);
    cameraRef.current = camera;
    updateCameraPosition();

    // 3. Renderer
    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    renderer.setSize(width, height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.shadowMap.enabled = true;
    renderer.shadowMap.type = THREE.PCFSoftShadowMap;
    rendererRef.current = renderer;

    container.innerHTML = '';
    container.appendChild(renderer.domElement);

    // 4. Lights (Architectural Daylight & Fill)
    const hemiLight = new THREE.HemisphereLight(
      isDark ? 0x93c5fd : 0xffffff,
      isDark ? 0x1e293b : 0x64748b,
      isDark ? 0.8 : 1.1
    );
    scene.add(hemiLight);

    const dirLight = new THREE.DirectionalLight(0xfffaed, isDark ? 1.4 : 1.8);
    dirLight.position.set(12, 22, 12);
    dirLight.castShadow = true;
    dirLight.shadow.mapSize.width = 2048;
    dirLight.shadow.mapSize.height = 2048;
    dirLight.shadow.bias = -0.0005;
    scene.add(dirLight);

    const softFill = new THREE.DirectionalLight(0x38bdf8, isDark ? 0.4 : 0.6);
    softFill.position.set(-14, 10, -12);
    scene.add(softFill);

    // 5. Cardinal Compass Ring
    const compassGroup = new THREE.Group();
    compassGroupRef.current = compassGroup;
    createCompass(compassGroup, isDark);
    scene.add(compassGroup);

    // 6. Building Group
    const buildingGroup = new THREE.Group();
    buildingGroupRef.current = buildingGroup;
    scene.add(buildingGroup);

    // 7. Mouse & Touch Interaction
    const onMouseDown = (e) => {
      isDragging.current = true;
      previousMousePosition.current = { x: e.clientX, y: e.clientY };
    };

    const onMouseMove = (e) => {
      if (!isDragging.current) return;
      const deltaX = e.clientX - previousMousePosition.current.x;
      const deltaY = e.clientY - previousMousePosition.current.y;

      cameraRotation.current.theta -= deltaX * 0.009;
      cameraRotation.current.phi = Math.max(0.12, Math.min(Math.PI / 2.15, cameraRotation.current.phi - deltaY * 0.009));

      previousMousePosition.current = { x: e.clientX, y: e.clientY };
      updateCameraPosition();
    };

    const onMouseUp = () => {
      isDragging.current = false;
    };

    const onWheel = (e) => {
      e.preventDefault();
      cameraDistance.current = Math.max(6.5, Math.min(28, cameraDistance.current + e.deltaY * 0.012));
      updateCameraPosition();
    };

    const domElement = renderer.domElement;
    domElement.addEventListener('mousedown', onMouseDown);
    window.addEventListener('mousemove', onMouseMove);
    window.addEventListener('mouseup', onMouseUp);
    domElement.addEventListener('wheel', onWheel, { passive: false });

    // 8. Resize Listener
    const handleResize = () => {
      if (!container || !renderer || !camera) return;
      const newWidth = container.clientWidth;
      const newHeight = container.clientHeight || 440;
      camera.aspect = newWidth / newHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(newWidth, newHeight);
    };
    window.addEventListener('resize', handleResize);

    // 9. Animation Loop
    const animate = () => {
      animFrameId.current = requestAnimationFrame(animate);
      if (autoRotate && !isDragging.current) {
        cameraRotation.current.theta += 0.0025;
        updateCameraPosition();
      }
      renderer.render(scene, camera);
    };
    animate();

    return () => {
      cancelAnimationFrame(animFrameId.current);
      window.removeEventListener('resize', handleResize);
      window.removeEventListener('mousemove', onMouseMove);
      window.removeEventListener('mouseup', onMouseUp);
      domElement.removeEventListener('mousedown', onMouseDown);
      domElement.removeEventListener('wheel', onWheel);
      if (renderer.domElement && container.contains(renderer.domElement)) {
        container.removeChild(renderer.domElement);
      }
      renderer.dispose();
    };
  }, [isDark]);

  function updateCameraPosition() {
    if (!cameraRef.current) return;
    const { theta, phi } = cameraRotation.current;
    const dist = cameraDistance.current;
    cameraRef.current.position.x = dist * Math.sin(phi) * Math.sin(theta);
    cameraRef.current.position.y = dist * Math.cos(phi);
    cameraRef.current.position.z = dist * Math.sin(phi) * Math.cos(theta);
    cameraRef.current.lookAt(0, 1.6, 0);
  }

  // Update Building Geometry when features, prediction, or theme change
  useEffect(() => {
    if (!buildingGroupRef.current) return;
    rebuildRealisticHouse(buildingGroupRef.current, features, prediction, shadingMode, isDark);
  }, [features, prediction, shadingMode, isDark]);

  return (
    <div style={{
      backgroundColor: colors.bgCard,
      borderRadius: '16px',
      border: `1px solid ${colors.border}`,
      boxShadow: isDark ? '0 8px 32px rgba(0,0,0,0.4)' : '0 4px 20px rgba(0,0,0,0.06)',
      overflow: 'hidden',
      display: 'flex',
      flexDirection: 'column'
    }}>
      {/* 3D Viewer Toolbar */}
      <div style={{
        padding: '12px 18px',
        backgroundColor: colors.bgSubtle,
        borderBottom: `1px solid ${colors.border}`,
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        flexWrap: 'wrap',
        gap: '10px'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <span style={{ fontSize: '15px' }}>🏡</span>
          <span style={{ fontSize: '14px', fontWeight: '800', color: colors.textPrimary }}>
            Architectural Residential Twin
          </span>
          <span style={{
            fontSize: '11px',
            padding: '2px 8px',
            borderRadius: '12px',
            backgroundColor: isDark ? 'rgba(56, 189, 248, 0.15)' : '#e0f2fe',
            color: '#0284c7',
            fontWeight: '700'
          }}>
            {features.Overall_Height === 7.0 ? '2-Story Residence (7.0m)' : 'Single-Story Villa (3.5m)'}
          </span>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          {/* Shading Mode Toggle */}
          <div style={{
            display: 'flex',
            backgroundColor: isDark ? '#1e293b' : '#e2e8f0',
            borderRadius: '8px',
            padding: '2px'
          }}>
            <button
              onClick={() => setShadingMode('architectural')}
              style={{
                fontSize: '11px',
                fontWeight: '700',
                padding: '5px 12px',
                borderRadius: '6px',
                border: 'none',
                cursor: 'pointer',
                backgroundColor: shadingMode === 'architectural' ? colors.accentPrimary : 'transparent',
                color: shadingMode === 'architectural' ? '#ffffff' : colors.textSecondary,
                transition: 'all 0.15s ease'
              }}
            >
              Architectural Design
            </button>
            <button
              onClick={() => setShadingMode('thermal')}
              style={{
                fontSize: '11px',
                fontWeight: '700',
                padding: '5px 12px',
                borderRadius: '6px',
                border: 'none',
                cursor: 'pointer',
                backgroundColor: shadingMode === 'thermal' ? '#ef4444' : 'transparent',
                color: shadingMode === 'thermal' ? '#ffffff' : colors.textSecondary,
                transition: 'all 0.15s ease'
              }}
            >
              🔥 Thermal Infrared
            </button>
          </div>

          {/* Auto Rotate Toggle */}
          <button
            onClick={() => setAutoRotate(!autoRotate)}
            title="Toggle Auto-Rotation"
            style={{
              padding: '5px 12px',
              borderRadius: '6px',
              border: `1px solid ${colors.border}`,
              backgroundColor: autoRotate ? (isDark ? '#1e293b' : '#f1f5f9') : 'transparent',
              color: colors.textSecondary,
              fontSize: '11px',
              fontWeight: '600',
              cursor: 'pointer'
            }}
          >
            {autoRotate ? '⏸ Pause' : '▶ Orbit'}
          </button>
        </div>
      </div>

      {/* 3D Canvas Mount Point */}
      <div
        ref={mountRef}
        style={{
          width: '100%',
          height: '440px',
          cursor: 'grab',
          position: 'relative'
        }}
      />

      {/* 3D Status Legend / Orientation Overlay */}
      <div style={{
        padding: '10px 18px',
        backgroundColor: colors.bgSubtle,
        borderTop: `1px solid ${colors.border}`,
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        flexWrap: 'wrap',
        gap: '10px',
        fontSize: '11px',
        color: colors.textSecondary
      }}>
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '14px' }}>
          <span><strong>Orientation:</strong> {getOrientationName(features.Orientation)}</span>
          <span><strong>Glazing:</strong> {(features.Glazing_Area * 100).toFixed(0)}% Wall</span>
          <span><strong>Roof Area:</strong> {features.Roof_Area} m²</span>
          <span><strong>Surface Area:</strong> {features.Surface_Area} m²</span>
          <span><strong>Wall Area:</strong> {features.Wall_Area} m²</span>
        </div>
        <span style={{ color: colors.textMuted }}>
          Drag to rotate &bull; Scroll to zoom
        </span>
      </div>
    </div>
  );
}

// ============================================================================
// HELPER: Rebuild Realistic Architectural Residential House Geometry
// ============================================================================
function rebuildRealisticHouse(group, features, prediction, mode, isDark) {
  // Clear previous meshes
  while (group.children.length > 0) {
    const child = group.children[0];
    if (child.geometry) child.geometry.dispose();
    if (child.material) {
      if (Array.isArray(child.material)) child.material.forEach((m) => m.dispose());
      else child.material.dispose();
    }
    group.remove(child);
  }

  // 1. Calculate Physical 3D Dimensions Responding to ALL Sliders:
  // - Roof_Area determines footprint base area
  // - Wall_Area and Overall_Height determine perimeter elongation
  // - Surface_Area determines overall exterior envelope scale
  // - Relative_Compactness scales cubic density vs elongated pavilion
  const roofArea = features.Roof_Area || 110.25;
  const wallArea = features.Wall_Area || 294.0;
  const surfaceArea = features.Surface_Area || 514.5;
  const rawHeight = features.Overall_Height || 7.0;
  const compactness = features.Relative_Compactness || 0.98;

  const baseL = Math.sqrt(roofArea) * 0.32;
  const deltaP = Math.max(1.0, wallArea / (2 * rawHeight * Math.sqrt(roofArea)));
  const aspect = Math.max(1.0, Math.min(3.0, 1.0 + (deltaP - 1.0) * 1.8 + (0.98 - compactness) * 2.2));
  const envelopeScale = 0.75 + 0.25 * (surfaceArea / 514.5);

  const width = baseL * Math.sqrt(aspect) * envelopeScale;
  const depth = (baseL / Math.sqrt(aspect)) * envelopeScale;
  const height = (rawHeight / 3.5) * 1.7; // 1.7 for 1-story (3.5m), 3.4 for 2-story (7.0m)
  const isTwoStory = rawHeight === 7.0;

  // 2. Materials Setup
  let wallMat, roofMat, trimMat, plinthMat, glassMat, doorMat, lawnMat;

  if (mode === 'thermal') {
    const heatLoad = prediction ? prediction.heating_load_kwh : 22.0;
    const coolLoad = prediction ? prediction.cooling_load_kwh : 24.0;
    const heatColor = getThermalColor(heatLoad, 8, 44);
    const coolColor = getThermalColor(coolLoad, 10, 48);

    wallMat = new THREE.MeshStandardMaterial({
      color: heatColor,
      roughness: 0.35,
      metalness: 0.1,
      emissive: heatColor,
      emissiveIntensity: 0.35
    });

    roofMat = new THREE.MeshStandardMaterial({
      color: getThermalColor((heatLoad + coolLoad) * 0.55, 10, 45),
      roughness: 0.4,
      emissive: heatColor,
      emissiveIntensity: 0.45
    });

    trimMat = new THREE.MeshStandardMaterial({ color: 0xffffff, roughness: 0.2, emissive: 0xffffff, emissiveIntensity: 0.2 });
    plinthMat = new THREE.MeshStandardMaterial({ color: 0x1e1b4b, roughness: 0.6 });
    glassMat = new THREE.MeshStandardMaterial({
      color: 0xffa500,
      roughness: 0.1,
      metalness: 0.9,
      emissive: 0xff4500,
      emissiveIntensity: 0.6
    });
    doorMat = new THREE.MeshStandardMaterial({ color: 0xff6347, roughness: 0.3, emissive: 0xff4500, emissiveIntensity: 0.3 });
    lawnMat = new THREE.MeshStandardMaterial({ color: 0x0f172a, roughness: 0.9 });
  } else {
    // Realistic Architectural Styling
    wallMat = new THREE.MeshStandardMaterial({
      color: isDark ? 0x27303f : 0xf8fafc,
      roughness: 0.45,
      metalness: 0.05
    });

    roofMat = new THREE.MeshStandardMaterial({
      color: isDark ? 0x0f172a : 0x334155, // Dark slate residential shingles
      roughness: 0.6,
      metalness: 0.2
    });

    trimMat = new THREE.MeshStandardMaterial({
      color: isDark ? 0x1e293b : 0xe2e8f0,
      roughness: 0.4
    });

    plinthMat = new THREE.MeshStandardMaterial({
      color: isDark ? 0x1e293b : 0x94a3b8, // Concrete structural base
      roughness: 0.7
    });

    glassMat = new THREE.MeshStandardMaterial({
      color: 0x0284c7,
      roughness: 0.1,
      metalness: 0.85,
      transparent: true,
      opacity: 0.78
    });

    doorMat = new THREE.MeshStandardMaterial({
      color: 0x78350f, // Warm rich oak wood door
      roughness: 0.5,
      metalness: 0.1
    });

    lawnMat = new THREE.MeshStandardMaterial({
      color: isDark ? 0x132e1b : 0x4ade80, // Landscape grass lawn
      roughness: 0.85
    });
  }

  // 3. Ground Lawn Base & Walkway Path
  const lawnRadius = Math.max(width, depth) * 1.5 + 2.4;
  const lawnGeom = new THREE.CylinderGeometry(lawnRadius, lawnRadius + 0.3, 0.14, 48);
  const lawnMesh = new THREE.Mesh(lawnGeom, lawnMat);
  lawnMesh.position.y = -0.07;
  lawnMesh.receiveShadow = true;
  group.add(lawnMesh);

  // Entrance Stone Walkway Path
  const pathLength = lawnRadius - depth / 2;
  const pathGeom = new THREE.BoxGeometry(1.2, 0.02, pathLength);
  const pathMat = new THREE.MeshStandardMaterial({
    color: isDark ? 0x334155 : 0xe2e8f0,
    roughness: 0.6
  });
  const pathMesh = new THREE.Mesh(pathGeom, pathMat);
  pathMesh.position.set(0, 0.01, depth / 2 + pathLength / 2);
  pathMesh.receiveShadow = true;
  group.add(pathMesh);

  // 4. Concrete Structural Foundation Plinth
  const plinthGeom = new THREE.BoxGeometry(width + 0.24, 0.22, depth + 0.24);
  const plinthMesh = new THREE.Mesh(plinthGeom, plinthMat);
  plinthMesh.position.y = 0.11;
  plinthMesh.castShadow = true;
  plinthMesh.receiveShadow = true;
  group.add(plinthMesh);

  // Concrete Entrance Steps leading up to the front door
  const step1 = new THREE.Mesh(new THREE.BoxGeometry(1.5, 0.1, 0.4), plinthMat);
  step1.position.set(0, 0.05, depth / 2 + 0.32);
  group.add(step1);

  const step2 = new THREE.Mesh(new THREE.BoxGeometry(1.3, 0.1, 0.3), plinthMat);
  step2.position.set(0, 0.15, depth / 2 + 0.16);
  group.add(step2);

  // 5. Main House Body Walls
  const houseGeom = new THREE.BoxGeometry(width, height, depth);
  const houseMesh = new THREE.Mesh(houseGeom, wallMat);
  houseMesh.position.y = 0.22 + height / 2;
  houseMesh.castShadow = true;
  houseMesh.receiveShadow = true;
  group.add(houseMesh);

  // Crisp Architectural Corner Columns
  const colW = 0.1;
  [-1, 1].forEach((cx) => {
    [-1, 1].forEach((cz) => {
      const colGeom = new THREE.BoxGeometry(colW, height, colW);
      const colMesh = new THREE.Mesh(colGeom, trimMat);
      colMesh.position.set((width / 2 - colW / 2) * cx, 0.22 + height / 2, (depth / 2 - colW / 2) * cz);
      group.add(colMesh);
    });
  });

  // Floor dividing frieze / cornice for 2-Story Houses
  if (isTwoStory) {
    const floorBandGeom = new THREE.BoxGeometry(width + 0.14, 0.12, depth + 0.14);
    const floorBandMesh = new THREE.Mesh(floorBandGeom, trimMat);
    floorBandMesh.position.y = 0.22 + height / 2;
    group.add(floorBandMesh);

    // Second-floor architectural balcony above front entrance
    const balconyGeom = new THREE.BoxGeometry(width * 0.38, 0.08, 0.7);
    const balconyMesh = new THREE.Mesh(balconyGeom, trimMat);
    balconyMesh.position.set(0, 0.22 + height / 2, depth / 2 + 0.35);
    group.add(balconyMesh);

    // Modern Balcony Railing
    const railingGeom = new THREE.BoxGeometry(width * 0.38, 0.45, 0.04);
    const railingMat = new THREE.MeshStandardMaterial({
      color: isDark ? 0x38bdf8 : 0x0284c7,
      transparent: true,
      opacity: 0.65,
      metalness: 0.9,
      roughness: 0.1
    });
    const railingMesh = new THREE.Mesh(railingGeom, railingMat);
    railingMesh.position.set(0, 0.22 + height / 2 + 0.26, depth / 2 + 0.68);
    group.add(railingMesh);
  }

  // 6. Realistic Pitched / Gabled Architectural Roof
  const roofOverhang = 0.35;
  const roofPitchHeight = Math.max(1.0, Math.min(1.6, width * 0.26));
  const roofW = width + roofOverhang * 2;
  const roofD = depth + roofOverhang * 2;

  // Triangular Gable Profile
  const roofShape = new THREE.Shape();
  roofShape.moveTo(-roofW / 2, 0);
  roofShape.lineTo(0, roofPitchHeight);
  roofShape.lineTo(roofW / 2, 0);
  roofShape.closePath();

  const roofGeom = new THREE.ExtrudeGeometry(roofShape, {
    depth: roofD,
    bevelEnabled: false
  });
  // Center extrusion along Z axis
  roofGeom.translate(0, 0, -roofD / 2);

  const roofMesh = new THREE.Mesh(roofGeom, roofMat);
  roofMesh.position.y = 0.22 + height;
  roofMesh.castShadow = true;
  roofMesh.receiveShadow = true;
  group.add(roofMesh);

  // Roof Ridge Beam capping the peak
  const ridgeGeom = new THREE.BoxGeometry(0.12, 0.12, roofD + 0.08);
  const ridgeMesh = new THREE.Mesh(ridgeGeom, trimMat);
  ridgeMesh.position.set(0, 0.22 + height + roofPitchHeight + 0.06, 0);
  group.add(ridgeMesh);

  // Stone Chimney Stack on roof
  const chimneyGeom = new THREE.BoxGeometry(0.45, 1.2, 0.45);
  const chimneyMat = new THREE.MeshStandardMaterial({
    color: isDark ? 0x334155 : 0x64748b,
    roughness: 0.7
  });
  const chimneyMesh = new THREE.Mesh(chimneyGeom, chimneyMat);
  chimneyMesh.position.set(width * 0.28, 0.22 + height + roofPitchHeight * 0.6, -depth * 0.2);
  chimneyMesh.castShadow = true;
  group.add(chimneyMesh);

  // Chimney Cap
  const chimneyCap = new THREE.Mesh(new THREE.BoxGeometry(0.55, 0.08, 0.55), trimMat);
  chimneyCap.position.set(width * 0.28, 0.22 + height + roofPitchHeight * 0.6 + 0.64, -depth * 0.2);
  group.add(chimneyCap);

  // Solar PV Panels flush on Sunward Roof Slope
  const solarW = width * 0.42;
  const solarD = depth * 0.55;
  const solarGeom = new THREE.BoxGeometry(solarW, 0.04, solarD);
  const solarMat = new THREE.MeshStandardMaterial({
    color: mode === 'thermal' ? 0xff4500 : 0x1e3a8a,
    roughness: 0.15,
    metalness: 0.85
  });
  const solarMesh = new THREE.Mesh(solarGeom, solarMat);
  const slopeAngle = Math.atan2(roofPitchHeight, roofW / 2);
  solarMesh.rotation.z = -slopeAngle;
  solarMesh.position.set(
    width * 0.2,
    0.22 + height + roofPitchHeight * 0.48,
    0
  );
  group.add(solarMesh);

  // 7. Front Porch & Entrance
  // Wooden Front Door
  const doorW = 0.85;
  const doorH = 1.35;
  const doorGeom = new THREE.BoxGeometry(doorW, doorH, 0.06);
  const doorMesh = new THREE.Mesh(doorGeom, doorMat);
  doorMesh.position.set(0, 0.22 + doorH / 2, depth / 2 + 0.02);
  group.add(doorMesh);

  // Door Frame
  const frameGeom = new THREE.EdgesGeometry(doorGeom);
  const frameMesh = new THREE.LineSegments(frameGeom, new THREE.LineBasicMaterial({ color: isDark ? 0x94a3b8 : 0x334155, linewidth: 2 }));
  frameMesh.position.copy(doorMesh.position);
  group.add(frameMesh);

  // Door Handle
  const handleGeom = new THREE.CylinderGeometry(0.015, 0.015, 0.12, 12);
  const handleMat = new THREE.MeshStandardMaterial({ color: 0xfacc15, metalness: 0.9, roughness: 0.2 });
  const handleMesh = new THREE.Mesh(handleGeom, handleMat);
  handleMesh.position.set(0.32, 0.22 + doorH / 2, depth / 2 + 0.06);
  group.add(handleMesh);

  // Front Porch Portico Awning (Entrance Canopy)
  const canopyGeom = new THREE.BoxGeometry(1.8, 0.08, 0.85);
  const canopyMesh = new THREE.Mesh(canopyGeom, trimMat);
  canopyMesh.position.set(0, 0.22 + doorH + 0.12, depth / 2 + 0.42);
  canopyMesh.castShadow = true;
  group.add(canopyMesh);

  // Porch Support Pillars
  const pillarGeom = new THREE.CylinderGeometry(0.04, 0.04, doorH + 0.12, 12);
  [-0.8, 0.8].forEach((px) => {
    const pillar = new THREE.Mesh(pillarGeom, trimMat);
    pillar.position.set(px, 0.22 + (doorH + 0.12) / 2, depth / 2 + 0.78);
    pillar.castShadow = true;
    group.add(pillar);
  });

  // Outdoor Wall Sconce Light next to Door
  const sconceGeom = new THREE.BoxGeometry(0.08, 0.14, 0.08);
  const sconceMat = new THREE.MeshStandardMaterial({ color: 0xfef08a, emissive: 0xfde047, emissiveIntensity: 0.6 });
  const sconceMesh = new THREE.Mesh(sconceGeom, sconceMat);
  sconceMesh.position.set(0.58, 0.22 + doorH * 0.72, depth / 2 + 0.05);
  group.add(sconceMesh);

  // 8. Detailed Architectural Windows with Frames, Mullions, and Sills
  const glazingRatio = features.Glazing_Area || 0.10;
  if (glazingRatio > 0.01) {
    addRealisticWindows(group, width, height, depth, glazingRatio, features.Glazing_Area_Distribution, isTwoStory, glassMat, trimMat, mode);
  }

  // 9. Apply Building Cardinal Orientation Rotation
  // Orientation: 2=North (0 rad), 3=East (PI/2), 4=South (PI), 5=West (3PI/2)
  const orientationRad = (features.Orientation - 2) * (Math.PI / 2);
  group.rotation.y = orientationRad;
}

// ============================================================================
// HELPER: Add Realistic Architectural Windows with Frames, Mullions & Sills
// ============================================================================
function addRealisticWindows(group, width, height, depth, ratio, distribution, isTwoStory, glassMat, trimMat, mode) {
  const numStories = isTwoStory ? 2 : 1;
  const storyH = height / numStories;

  // Window size dynamically scales with Glazing Area ratio
  const winW = (width / 4.2) * Math.min(1.2, Math.max(0.45, ratio * 2.8));
  const winH = (storyH * 0.52) * Math.min(1.2, Math.max(0.45, ratio * 2.8));

  // Frame Material
  const frameMat = new THREE.MeshStandardMaterial({
    color: 0x1e293b, // Dark charcoal aluminum window frame
    roughness: 0.4
  });

  // Helper to place a detailed window at position
  const placeWindow = (x, y, z, rotY, w, h) => {
    const winGroup = new THREE.Group();
    winGroup.position.set(x, y, z);
    winGroup.rotation.y = rotY;

    // Recessed Glass Pane
    const glass = new THREE.Mesh(new THREE.BoxGeometry(w, h, 0.02), glassMat);
    winGroup.add(glass);

    // Outer Frame (Surround)
    const frameThickness = 0.06;
    const outerFrame = new THREE.Mesh(
      new THREE.BoxGeometry(w + frameThickness * 2, h + frameThickness * 2, 0.04),
      frameMat
    );
    outerFrame.position.z = -0.01;
    winGroup.add(outerFrame);

    // Cross Mullions (Divided light panes)
    const vertMullion = new THREE.Mesh(new THREE.BoxGeometry(0.02, h, 0.03), frameMat);
    vertMullion.position.z = 0.01;
    winGroup.add(vertMullion);

    const horizMullion = new THREE.Mesh(new THREE.BoxGeometry(w, 0.02, 0.03), frameMat);
    horizMullion.position.z = 0.01;
    winGroup.add(horizMullion);

    // Projecting Window Sill
    const sill = new THREE.Mesh(new THREE.BoxGeometry(w + 0.18, 0.05, 0.12), trimMat);
    sill.position.set(0, -h / 2 - 0.025, 0.04);
    winGroup.add(sill);

    group.add(winGroup);
  };

  // Front Facade (South) Windows
  for (let s = 0; s < numStories; s++) {
    const storyY = 0.22 + s * storyH + storyH * 0.52;
    if (s === 0) {
      // Flanking the entrance door
      [-width * 0.28, width * 0.28].forEach((wx) => {
        placeWindow(wx, storyY, depth / 2 + 0.02, 0, winW, winH);
      });
    } else {
      // Second story: 3 upper windows
      [-width * 0.3, 0, width * 0.3].forEach((wx) => {
        placeWindow(wx, storyY, depth / 2 + 0.02, 0, winW * 0.9, winH * 0.9);
      });
    }
  }

  // Back Facade (North) Windows
  for (let s = 0; s < numStories; s++) {
    const storyY = 0.22 + s * storyH + storyH * 0.52;
    [-width * 0.25, width * 0.25].forEach((wx) => {
      placeWindow(wx, storyY, -depth / 2 - 0.02, Math.PI, winW, winH);
    });
  }

  // Side Facades (East & West)
  [-1, 1].forEach((side) => {
    for (let s = 0; s < numStories; s++) {
      const storyY = 0.22 + s * storyH + storyH * 0.52;
      const rot = side === 1 ? Math.PI / 2 : -Math.PI / 2;
      placeWindow((width / 2 + 0.02) * side, storyY, 0, rot, Math.min(depth * 0.45, winW), winH);
    }
  });
}

// ============================================================================
// HELPER: Create 3D Ground Compass Rose with Cardinal Directions
// ============================================================================
function createCompass(group, isDark) {
  const radius = 6.8;

  // Outer Ring
  const circleGeom = new THREE.RingGeometry(radius - 0.06, radius + 0.06, 64);
  const circleMat = new THREE.MeshBasicMaterial({
    color: isDark ? 0x38bdf8 : 0x0284c7,
    side: THREE.DoubleSide,
    transparent: true,
    opacity: 0.45
  });
  const circleMesh = new THREE.Mesh(circleGeom, circleMat);
  circleMesh.rotation.x = Math.PI / 2;
  group.add(circleMesh);

  // Direction Pointer Arrow pointing North
  const arrowGeom = new THREE.ConeGeometry(0.35, 0.9, 4);
  const arrowMat = new THREE.MeshBasicMaterial({ color: 0xef4444 });
  const arrowMesh = new THREE.Mesh(arrowGeom, arrowMat);
  arrowMesh.position.set(0, 0.05, -radius);
  arrowMesh.rotation.x = Math.PI / 2;
  group.add(arrowMesh);

  // Cardinal Markers (Tick marks)
  [
    { angle: 0, color: 0xef4444, label: 'N' },
    { angle: Math.PI / 2, color: 0x38bdf8, label: 'E' },
    { angle: Math.PI, color: 0x38bdf8, label: 'S' },
    { angle: (3 * Math.PI) / 2, color: 0x38bdf8, label: 'W' }
  ].forEach((card) => {
    const tickGeom = new THREE.BoxGeometry(0.08, 0.02, 0.4);
    const tickMat = new THREE.MeshBasicMaterial({ color: card.color });
    const tick = new THREE.Mesh(tickGeom, tickMat);
    tick.position.set(
      Math.sin(card.angle) * radius,
      0.02,
      -Math.cos(card.angle) * radius
    );
    tick.rotation.y = card.angle;
    group.add(tick);
  });
}

// Helper: Convert thermal load to false-color hex
function getThermalColor(value, minVal, maxVal) {
  const norm = Math.max(0, Math.min(1, (value - minVal) / (maxVal - minVal)));
  const color = new THREE.Color();
  // Hue from 0.65 (cool blue/cyan) down to 0.0 (hot red)
  color.setHSL((1.0 - norm) * 0.65, 0.95, 0.52);
  return color;
}

function getOrientationName(code) {
  switch (Number(code)) {
    case 2: return 'North (2)';
    case 3: return 'East (3)';
    case 4: return 'South (4)';
    case 5: return 'West (5)';
    default: return `${code}`;
  }
}
