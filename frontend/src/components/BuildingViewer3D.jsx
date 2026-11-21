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
  const cameraDistance = useRef(14);
  const cameraRotation = useRef({ theta: Math.PI / 4, phi: Math.PI / 6 });

  useEffect(() => {
    const container = mountRef.current;
    if (!container) return;

    const width = container.clientWidth;
    const height = container.clientHeight || 420;

    // 1. Scene
    const scene = new THREE.Scene();
    sceneRef.current = scene;

    // 2. Camera
    const camera = new THREE.PerspectiveCamera(45, width / height, 0.1, 100);
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

    // 4. Lights
    const ambientLight = new THREE.AmbientLight(0xffffff, isDark ? 0.6 : 0.85);
    scene.add(ambientLight);

    const dirLight = new THREE.DirectionalLight(0xffffff, isDark ? 1.2 : 1.5);
    dirLight.position.set(10, 20, 10);
    dirLight.castShadow = true;
    dirLight.shadow.mapSize.width = 1024;
    dirLight.shadow.mapSize.height = 1024;
    scene.add(dirLight);

    const fillLight = new THREE.DirectionalLight(0x38bdf8, 0.4);
    fillLight.position.set(-10, 10, -10);
    scene.add(fillLight);

    // 5. Ground Grid
    const gridColor = isDark ? 0x1e293b : 0xcbd5e1;
    const gridCenterColor = isDark ? 0x38bdf8 : 0x2563eb;
    const gridHelper = new THREE.GridHelper(20, 20, gridCenterColor, gridColor);
    gridHelper.position.y = -0.01;
    scene.add(gridHelper);

    // 6. Cardinal Compass
    const compassGroup = new THREE.Group();
    compassGroupRef.current = compassGroup;
    createCompass(compassGroup, isDark);
    scene.add(compassGroup);

    // 7. Building Group
    const buildingGroup = new THREE.Group();
    buildingGroupRef.current = buildingGroup;
    scene.add(buildingGroup);

    // 8. Mouse / Touch Controls
    const onMouseDown = (e) => {
      isDragging.current = true;
      previousMousePosition.current = { x: e.clientX, y: e.clientY };
    };

    const onMouseMove = (e) => {
      if (!isDragging.current) return;
      const deltaX = e.clientX - previousMousePosition.current.x;
      const deltaY = e.clientY - previousMousePosition.current.y;

      cameraRotation.current.theta -= deltaX * 0.01;
      cameraRotation.current.phi = Math.max(0.1, Math.min(Math.PI / 2.2, cameraRotation.current.phi - deltaY * 0.01));

      previousMousePosition.current = { x: e.clientX, y: e.clientY };
      updateCameraPosition();
    };

    const onMouseUp = () => {
      isDragging.current = false;
    };

    const onWheel = (e) => {
      e.preventDefault();
      cameraDistance.current = Math.max(6, Math.min(26, cameraDistance.current + e.deltaY * 0.01));
      updateCameraPosition();
    };

    const domElement = renderer.domElement;
    domElement.addEventListener('mousedown', onMouseDown);
    window.addEventListener('mousemove', onMouseMove);
    window.addEventListener('mouseup', onMouseUp);
    domElement.addEventListener('wheel', onWheel, { passive: false });

    // 9. Resize Listener
    const handleResize = () => {
      if (!container || !renderer || !camera) return;
      const newWidth = container.clientWidth;
      const newHeight = container.clientHeight || 420;
      camera.aspect = newWidth / newHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(newWidth, newHeight);
    };
    window.addEventListener('resize', handleResize);

    // 10. Animation Loop
    let clock = new THREE.Clock();
    const animate = () => {
      animFrameId.current = requestAnimationFrame(animate);
      if (autoRotate && !isDragging.current) {
        cameraRotation.current.theta += 0.003;
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
    cameraRef.current.lookAt(0, 1.8, 0);
  }

  // Update Building Geometry when features or shading change
  useEffect(() => {
    if (!buildingGroupRef.current) return;
    rebuildBuilding(buildingGroupRef.current, features, prediction, shadingMode, isDark);
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
          <span style={{ fontSize: '14px', fontWeight: '700', color: colors.textPrimary }}>
            🏛️ 3D Architectural Digital Twin
          </span>
          <span style={{
            fontSize: '11px',
            padding: '2px 8px',
            borderRadius: '12px',
            backgroundColor: isDark ? 'rgba(56, 189, 248, 0.15)' : '#e0f2fe',
            color: '#0284c7',
            fontWeight: '600'
          }}>
            {features.Overall_Height === 7.0 ? '2 Stories (7.0m)' : '1 Story (3.5m)'}
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
                fontWeight: '600',
                padding: '4px 10px',
                borderRadius: '6px',
                border: 'none',
                cursor: 'pointer',
                backgroundColor: shadingMode === 'architectural' ? colors.accentPrimary : 'transparent',
                color: shadingMode === 'architectural' ? '#ffffff' : colors.textSecondary,
                transition: 'all 0.15s ease'
              }}
            >
              Architectural
            </button>
            <button
              onClick={() => setShadingMode('thermal')}
              style={{
                fontSize: '11px',
                fontWeight: '600',
                padding: '4px 10px',
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
              padding: '5px 10px',
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
          height: '400px',
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
        fontSize: '11px',
        color: colors.textSecondary
      }}>
        <div style={{ display: 'flex', gap: '16px' }}>
          <span><strong>Orientation:</strong> {getOrientationName(features.Orientation)}</span>
          <span><strong>Glazing:</strong> {(features.Glazing_Area * 100).toFixed(0)}% Facade</span>
          <span><strong>Compactness:</strong> {features.Relative_Compactness}</span>
        </div>
        <span style={{ color: colors.textMuted }}>
          Drag to orbit &bull; Scroll to zoom
        </span>
      </div>
    </div>
  );
}

// Helper to rebuild Three.js building geometry
function rebuildBuilding(group, features, prediction, mode, isDark) {
  // Clear previous meshes
  while (group.children.length > 0) {
    const child = group.children[0];
    if (child.geometry) child.geometry.dispose();
    if (child.material) {
      if (Array.isArray(child.material)) child.material.forEach(m => m.dispose());
      else child.material.dispose();
    }
    group.remove(child);
  }

  // Calculate proportional 3D dimensions (scaled for pleasing visualization)
  const height = features.Overall_Height === 7.0 ? 3.6 : 1.8;
  const isTwoStory = features.Overall_Height === 7.0;

  // Derive width & depth from surface area and relative compactness
  const compactness = features.Relative_Compactness; // 0.62 to 0.98
  const baseAspect = 1.0 + (0.98 - compactness) * 2.0; // elongates sprawling buildings
  const width = 3.6 * Math.sqrt(baseAspect);
  const depth = 3.6 / Math.sqrt(baseAspect);

  // Thermal Heatmap Color Gradient based on predicted loads
  let wallMat, roofMat;

  if (mode === 'thermal') {
    const heatLoad = prediction ? prediction.heating_load_kwh : 22.0;
    const coolLoad = prediction ? prediction.cooling_load_kwh : 24.0;
    
    // Normalize to thermal infrared palette (Cyan -> Green -> Yellow -> Orange -> Red)
    const heatColor = getThermalColor(heatLoad, 10, 45);
    const coolColor = getThermalColor(coolLoad, 10, 45);

    wallMat = new THREE.MeshStandardMaterial({
      color: heatColor,
      roughness: 0.3,
      metalness: 0.1,
      emissive: heatColor,
      emissiveIntensity: 0.25
    });

    roofMat = new THREE.MeshStandardMaterial({
      color: getThermalColor((heatLoad + coolLoad) * 0.55, 10, 45),
      roughness: 0.4,
      emissive: heatColor,
      emissiveIntensity: 0.2
    });
  } else {
    // Architectural mode
    wallMat = new THREE.MeshStandardMaterial({
      color: isDark ? 0x243048 : 0xf1f5f9,
      roughness: 0.4,
      metalness: 0.2
    });

    roofMat = new THREE.MeshStandardMaterial({
      color: isDark ? 0x1e293b : 0x334155,
      roughness: 0.6,
      metalness: 0.3
    });
  }

  // Main Building Mass
  const buildingGeom = new THREE.BoxGeometry(width, height, depth);
  const buildingMesh = new THREE.Mesh(buildingGeom, wallMat);
  buildingMesh.position.y = height / 2;
  buildingMesh.castShadow = true;
  buildingMesh.receiveShadow = true;
  group.add(buildingMesh);

  // Floor Divider Line for 2-Story Buildings
  if (isTwoStory) {
    const floorSlabGeom = new THREE.BoxGeometry(width + 0.08, 0.08, depth + 0.08);
    const slabMat = new THREE.MeshStandardMaterial({ color: isDark ? 0x0f172a : 0x94a3b8 });
    const slabMesh = new THREE.Mesh(floorSlabGeom, slabMat);
    slabMesh.position.y = height / 2;
    group.add(slabMesh);
  }

  // Roof Structure / Parapet
  const roofGeom = new THREE.BoxGeometry(width + 0.16, 0.15, depth + 0.16);
  const roofMesh = new THREE.Mesh(roofGeom, roofMat);
  roofMesh.position.y = height + 0.075;
  roofMesh.castShadow = true;
  group.add(roofMesh);

  // Roof Equipment / Solar Collector Simulation
  const solarGeom = new THREE.BoxGeometry(width * 0.5, 0.06, depth * 0.5);
  const solarMat = new THREE.MeshStandardMaterial({
    color: mode === 'thermal' ? 0xff4500 : 0x1e3a8a,
    roughness: 0.2,
    metalness: 0.8
  });
  const solarMesh = new THREE.Mesh(solarGeom, solarMat);
  solarMesh.position.set(0, height + 0.18, 0);
  group.add(solarMesh);

  // Window Glazing Panels on Facades
  const glazingRatio = features.Glazing_Area; // 0.0, 0.10, 0.25, 0.40
  if (glazingRatio > 0.01) {
    addWindows(group, width, height, depth, glazingRatio, features.Glazing_Area_Distribution, isTwoStory, mode, isDark);
  }

  // Wireframe outline for technical architectural look
  const wireGeom = new THREE.EdgesGeometry(buildingGeom);
  const wireMat = new THREE.LineBasicMaterial({
    color: mode === 'thermal' ? 0xffffff : (isDark ? 0x38bdf8 : 0x0284c7),
    opacity: 0.5,
    transparent: true
  });
  const wireframe = new THREE.LineSegments(wireGeom, wireMat);
  wireframe.position.y = height / 2;
  group.add(wireframe);

  // Apply Building Cardinal Orientation Rotation
  // Orientation: 2=North (0 rad), 3=East (PI/2), 4=South (PI), 5=West (3PI/2)
  const orientationRad = (features.Orientation - 2) * (Math.PI / 2);
  group.rotation.y = orientationRad;
}

// Generate Windows dynamically across building facades
function addWindows(group, width, height, depth, ratio, distribution, isTwoStory, mode, isDark) {
  const windowGlassMat = new THREE.MeshStandardMaterial({
    color: mode === 'thermal' ? 0xffa500 : (isDark ? 0x38bdf8 : 0x0284c7),
    roughness: 0.1,
    metalness: 0.9,
    transparent: true,
    opacity: mode === 'thermal' ? 0.95 : 0.75,
    emissive: mode === 'thermal' ? 0xff8c00 : (isDark ? 0x0284c7 : 0x000000),
    emissiveIntensity: mode === 'thermal' ? 0.4 : 0.1
  });

  const frameMat = new THREE.MeshStandardMaterial({ color: isDark ? 0x0f172a : 0x64748b, roughness: 0.5 });

  const numStories = isTwoStory ? 2 : 1;
  const storyHeight = height / numStories;

  // Window dimensions scaled by glazing ratio
  const winW = (width / 4) * Math.min(0.9, ratio * 2.2);
  const winH = (storyHeight * 0.55) * Math.min(0.95, ratio * 2.4);

  // Place windows on Front (South) & Back (North) Facades
  [-1, 1].forEach((faceZ) => {
    for (let story = 0; story < numStories; story++) {
      const storyY = story * storyHeight + storyHeight * 0.5;
      [-width * 0.25, width * 0.25].forEach((xPos) => {
        const winGeom = new THREE.BoxGeometry(winW, winH, 0.04);
        const winMesh = new THREE.Mesh(winGeom, windowGlassMat);
        winMesh.position.set(xPos, storyY, (depth / 2 + 0.02) * faceZ);
        group.add(winMesh);

        // Window Frame
        const frameGeom = new THREE.EdgesGeometry(winGeom);
        const frameMesh = new THREE.LineSegments(frameGeom, new THREE.LineBasicMaterial({ color: 0xffffff, opacity: 0.6, transparent: true }));
        frameMesh.position.copy(winMesh.position);
        group.add(frameMesh);
      });
    }
  });

  // Place windows on Side Facades (East & West)
  [-1, 1].forEach((faceX) => {
    for (let story = 0; story < numStories; story++) {
      const storyY = story * storyHeight + storyHeight * 0.5;
      const winGeom = new THREE.BoxGeometry(0.04, winH, Math.min(depth * 0.5, winW));
      const winMesh = new THREE.Mesh(winGeom, windowGlassMat);
      winMesh.position.set((width / 2 + 0.02) * faceX, storyY, 0);
      group.add(winMesh);
    }
  });
}

// Create Compass Rose on the ground with cardinal direction labels
function createCompass(group, isDark) {
  const radius = 6.2;
  const circleGeom = new THREE.RingGeometry(radius - 0.05, radius + 0.05, 64);
  const circleMat = new THREE.MeshBasicMaterial({
    color: isDark ? 0x38bdf8 : 0x2563eb,
    side: THREE.DoubleSide,
    transparent: true,
    opacity: 0.4
  });
  const circleMesh = new THREE.Mesh(circleGeom, circleMat);
  circleMesh.rotation.x = Math.PI / 2;
  group.add(circleMesh);

  // Direction Pointer Arrow to North
  const arrowGeom = new THREE.ConeGeometry(0.3, 0.8, 4);
  const arrowMat = new THREE.MeshBasicMaterial({ color: 0xef4444 });
  const arrowMesh = new THREE.Mesh(arrowGeom, arrowMat);
  arrowMesh.position.set(0, 0.05, -radius);
  arrowMesh.rotation.x = Math.PI / 2;
  group.add(arrowMesh);
}

// Helper: Convert thermal load to false-color hex
function getThermalColor(value, minVal, maxVal) {
  const norm = Math.max(0, Math.min(1, (value - minVal) / (maxVal - minVal)));
  const color = new THREE.Color();
  // Hue from 0.65 (cool blue) down to 0.0 (hot red)
  color.setHSL((1.0 - norm) * 0.65, 0.9, 0.5);
  return color;
}

function getOrientationName(code) {
  switch (code) {
    case 2: return 'North (2)';
    case 3: return 'East (3)';
    case 4: return 'South (4)';
    case 5: return 'West (5)';
    default: return `${code}`;
  }
}
