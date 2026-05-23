import React, { useRef } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import * as Cesium from 'cesium';
import FleetLayer from './FleetLayer';
import BinLayer from './BinLayer';
import FacilityLayer from './FacilityLayer';
import IncidentLayer from './IncidentLayer';
import { useLoadingStore } from '@/store/loadingStore';

interface ThreeOverlayProps {
  cesiumViewer: Cesium.Viewer | null;
}

const SyncBridge: React.FC<{ viewer: Cesium.Viewer | null }> = ({ viewer }) => {
  useFrame(({ camera }) => {
    if (!viewer) return;

    // Report Three.js ready on first frame
    const setThreeReady = useLoadingStore.getState().setThreeReady;
    if (!useLoadingStore.getState().isThreeReady) {
      setThreeReady(true);
    }

    // Sync camera matrices
    const cvm = viewer.camera.viewMatrix;
    const cpm = viewer.camera.frustum.projectionMatrix;

    // Convert Cesium Matrix4 to Three.js Matrix4
    camera.matrixAutoUpdate = false;
    
    // View Matrix Sync
    camera.matrixWorldInverse.set(
      cvm[0], cvm[4], cvm[8], cvm[12],
      cvm[1], cvm[5], cvm[9], cvm[13],
      cvm[2], cvm[6], cvm[10], cvm[14],
      cvm[3], cvm[7], cvm[11], cvm[15]
    );
    
    camera.matrixWorld.copy(camera.matrixWorldInverse).invert();

    // Projection Matrix Sync (CRITICAL for alignment)
    camera.projectionMatrix.set(
      cpm[0], cpm[4], cpm[8], cpm[12],
      cpm[1], cpm[5], cpm[9], cpm[13],
      cpm[2], cpm[6], cpm[10], cpm[14],
      cpm[3], cpm[7], cpm[11], cpm[15]
    );
    camera.projectionMatrixInverse.copy(camera.projectionMatrix).invert();
  });

  return null;
};

const ThreeOverlay: React.FC<ThreeOverlayProps> = ({ cesiumViewer }) => {
  return (
    <div className="absolute inset-0 pointer-events-none z-10 overflow-hidden">
      <Canvas
        shadows={{ type: THREE.PCFShadowMap }}
        gl={{ 
          antialias: true, 
          alpha: true,
          powerPreference: 'high-performance',
          stencil: false,
          depth: true,
          logarithmicDepthBuffer: true
        }}
        // Remove default camera props as we sync them exactly from Cesium
        style={{ 
          background: 'transparent', 
          width: '100%', 
          height: '100%', 
          pointerEvents: 'none' // Ensure clicks fall through to Cesium by default
        }}
        onCreated={({ gl }) => {
          gl.setClearColor(0x000000, 0);
        }}
      >
        <SyncBridge viewer={cesiumViewer} />
        
        <ambientLight intensity={1.5} />
        <directionalLight 
          position={[10000000, 10000000, 10000000]} 
          intensity={2} 
        />
        <pointLight position={[0, 500, 0]} intensity={0.5} />

        <FleetLayer cesiumViewer={cesiumViewer} />
        <BinLayer />
        <FacilityLayer />
        <IncidentLayer />
      </Canvas>
    </div>
  );
};

export default ThreeOverlay;
