import React, { useMemo, useRef } from 'react';
import * as THREE from 'three';
import { useFacilityStore } from '@/store/facilityStore';
import { useFrame } from '@react-three/fiber';

import * as Cesium from 'cesium';

const FacilityMarker: React.FC<{
  facility: any;
  isSelected: boolean;
  onClick: () => void;
}> = ({ facility, isSelected, onClick }) => {
  const meshRef = useRef<THREE.Group>(null);

  useFrame(() => {
    if (!meshRef.current) return;

    const cartesian = Cesium.Cartesian3.fromDegrees(facility.location.lng, facility.location.lat, 0);
    const enuMatrix = Cesium.Transforms.eastNorthUpToFixedFrame(cartesian);
    
    // Matrix decomposition for ENU to Three.js
    const m = new THREE.Matrix4().set(
      (enuMatrix as any)[0], (enuMatrix as any)[4], (enuMatrix as any)[8], (enuMatrix as any)[12],
      (enuMatrix as any)[1], (enuMatrix as any)[5], (enuMatrix as any)[9], (enuMatrix as any)[13],
      (enuMatrix as any)[2], (enuMatrix as any)[6], (enuMatrix as any)[10], (enuMatrix as any)[14],
      (enuMatrix as any)[3], (enuMatrix as any)[7], (enuMatrix as any)[11], (enuMatrix as any)[15]
    );

    // Scaling for high-altitude visibility
    const s = 4.0;
    m.multiply(new THREE.Matrix4().makeScale(s, s, s));

    // Geometry adjust: Up is Z in ENU vs Y in Three.js
    const rotationYtoZ = new THREE.Matrix4().makeRotationX(Math.PI / 2);
    m.multiply(rotationYtoZ);

    meshRef.current.matrixAutoUpdate = false;
    meshRef.current.matrix.copy(m);
    meshRef.current.matrixWorldNeedsUpdate = true;
  });

  const color = useMemo(() => {
    if (facility.environmentalRisk === 'critical') return '#f43f5e';
    if (facility.environmentalRisk === 'high') return '#f59e0b';
    if (facility.operationalStatus === 'degraded') return '#8b5cf6';
    return '#10b981';
  }, [facility.environmentalRisk, facility.operationalStatus]);

  return (
    <group 
      ref={meshRef}
      onClick={(e) => {
        e.stopPropagation();
        onClick();
      }}
    >
      {/* Industrial Base */}
      <mesh castShadow>
        <boxGeometry args={[40, 20, 40]} />
        <meshStandardMaterial color="#334155" />
      </mesh>

      {/* Main Structure */}
      <mesh position={[0, 20, 0]} castShadow>
        <cylinderGeometry args={[15, 20, 30, 6]} />
        <meshStandardMaterial color={color} emissive={isSelected ? color : '#000'} emissiveIntensity={isSelected ? 0.5 : 0} />
      </mesh>

      {/* Signal Beacon */}
      <mesh position={[0, 40, 0]}>
        <sphereGeometry args={[isSelected ? 8 : 4]} />
        <meshStandardMaterial color={color} emissive={color} emissiveIntensity={isSelected ? 2 : 1} transparent opacity={0.8} />
      </mesh>

      {/* Pulse Effect for Risky Facilities */}
      {facility.environmentalRisk !== 'low' && (
        <mesh position={[0, 20, 0]}>
           <sphereGeometry args={[isSelected ? 60 : 45]} />
           <meshStandardMaterial color={color} transparent opacity={0.1} wireframe />
        </mesh>
      )}
    </group>
  );
};

const FacilityLayer: React.FC = () => {
  const { facilities, selectedFacilityId, selectFacility } = useFacilityStore();

  return (
    <group>
      {facilities.map((f) => (
        <FacilityMarker 
          key={f.id} 
          facility={f} 
          isSelected={f.id === selectedFacilityId}
          onClick={() => selectFacility(f.id)}
        />
      ))}
    </group>
  );
};

export default FacilityLayer;
