import React, { useMemo, useRef, useEffect } from 'react';
import * as THREE from 'three';
import { useBinStore } from '@/store/binStore';
import { useFrame } from '@react-three/fiber';

import * as Cesium from 'cesium';

// Instanced rendering for 300+ bins
const BinLayer: React.FC = () => {
  const { bins, selectedBinId, selectBin } = useBinStore();
  const meshRef = useRef<THREE.InstancedMesh>(null);
  
  // Dummy object for matrix calculations
  const tempObject = new THREE.Object3D();
  const tempColor = new THREE.Color();

  // Pre-calculate matrices for bins only when they update
  const binMatrices = useMemo(() => {
    return bins.map(bin => {
        const cartesian = Cesium.Cartesian3.fromDegrees(bin.location.lng, bin.location.lat, 5);
        const enuMatrix = Cesium.Transforms.eastNorthUpToFixedFrame(cartesian);
        
        // Cesium Matrix4 has elements in index 0-15
        const m = new THREE.Matrix4().set(
            (enuMatrix as any)[0], (enuMatrix as any)[4], (enuMatrix as any)[8], (enuMatrix as any)[12],
            (enuMatrix as any)[1], (enuMatrix as any)[5], (enuMatrix as any)[9], (enuMatrix as any)[13],
            (enuMatrix as any)[2], (enuMatrix as any)[6], (enuMatrix as any)[10], (enuMatrix as any)[14],
            (enuMatrix as any)[3], (enuMatrix as any)[7], (enuMatrix as any)[11], (enuMatrix as any)[15]
        );
        
        const rotationYtoZ = new THREE.Matrix4().makeRotationX(Math.PI / 2);
        m.multiply(rotationYtoZ);

        const scale = bin.id === selectedBinId ? 80 : 40;
        const scaleMatrix = new THREE.Matrix4().makeScale(scale, scale, scale);
        m.multiply(scaleMatrix);
        return m;
    });
  }, [bins, selectedBinId]);

  useFrame(() => {
    if (!meshRef.current) return;

    binMatrices.forEach((m, i) => {
      meshRef.current!.setMatrixAt(i, m);

      // Color logic
      const bin = bins[i];
      if (bin.alertState === 'critical') tempColor.set('#f43f5e');
      else if (bin.alertState === 'warning') tempColor.set('#f59e0b');
      else if (bin.fillLevel > 50) tempColor.set('#10b981');
      else tempColor.set('#22d3ee');

      meshRef.current!.setColorAt(i, tempColor);
    });

    meshRef.current.instanceMatrix.needsUpdate = true;
    if (meshRef.current.instanceColor) meshRef.current.instanceColor.needsUpdate = true;
  });

  // Handle clicks - Raycasting against instanced mesh is tricky in plain R3F without helpers, 
  // but we can use an invisible click layer or just selection via the UI list for the prototype.
  // For this demo, we'll keep it simple.

  return (
    <instancedMesh 
      ref={meshRef} 
      args={[undefined, undefined, bins.length]} 
      frustumCulled={false}
      onClick={(e) => {
        e.stopPropagation();
        if (e.instanceId !== undefined) {
          const bin = bins[e.instanceId];
          if (bin) selectBin(bin.id);
        }
      }}
      onPointerOver={() => {
        document.body.style.cursor = 'pointer';
      }}
      onPointerOut={() => {
        document.body.style.cursor = 'auto';
      }}
    >
      <boxGeometry args={[1, 1.5, 1]} />
      <meshStandardMaterial />
    </instancedMesh>
  );
};

export default BinLayer;
