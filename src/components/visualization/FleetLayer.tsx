import React, { useMemo, useRef } from 'react';
import * as THREE from 'three';
import { useFleetStore } from '@/store/fleetStore';
import { useFrame } from '@react-three/fiber';
import * as Cesium from 'cesium';

interface FleetLayerProps {
  cesiumViewer: Cesium.Viewer | null;
}

const VehicleMarker: React.FC<{ 
  vehicle: any; 
  viewer: Cesium.Viewer; 
  isSelected: boolean;
  onClick: () => void;
}> = ({ vehicle, viewer, isSelected, onClick }) => {
  const meshRef = React.useRef<THREE.Group>(null);

  // Use Cesium's Transforms to create an ENU matrix for this location
  // This ensures "up" is truly up relative to the Earth's surface at this position
  const targetMatrix = useMemo(() => {
    const cartesian = Cesium.Cartesian3.fromDegrees(vehicle.location.lng, vehicle.location.lat, 10);
    const enuMatrix = Cesium.Transforms.eastNorthUpToFixedFrame(cartesian);
    
    const m = new THREE.Matrix4().set(
      (enuMatrix as any)[0], (enuMatrix as any)[4], (enuMatrix as any)[8], (enuMatrix as any)[12],
      (enuMatrix as any)[1], (enuMatrix as any)[5], (enuMatrix as any)[9], (enuMatrix as any)[13],
      (enuMatrix as any)[2], (enuMatrix as any)[6], (enuMatrix as any)[10], (enuMatrix as any)[14],
      (enuMatrix as any)[3], (enuMatrix as any)[7], (enuMatrix as any)[11], (enuMatrix as any)[15]
    );

    const headingRotation = new THREE.Matrix4().makeRotationZ(THREE.MathUtils.degToRad(-vehicle.heading));
    m.multiply(headingRotation);

    const s = 4.0; 
    m.multiply(new THREE.Matrix4().makeScale(s, s, s));
    
    return m;
  }, [vehicle.location.lat, vehicle.location.lng, vehicle.heading]);

  useFrame(() => {
    if (!meshRef.current) return;
    
    // Decompose target matrix into position, quaternion, and scale
    const targetPos = new THREE.Vector3();
    const targetQuat = new THREE.Quaternion();
    const targetScale = new THREE.Vector3();
    targetMatrix.decompose(targetPos, targetQuat, targetScale);

    // Smoothly interpolate position and rotation
    meshRef.current.position.lerp(targetPos, 0.1);
    meshRef.current.quaternion.slerp(targetQuat, 0.1);
    meshRef.current.scale.copy(targetScale);
    
    meshRef.current.updateMatrixWorld();
  });

  const color = useMemo(() => {
    if (vehicle.alertState === 'critical') return '#ef4444';
    if (vehicle.alertState === 'warning') return '#f59e0b';
    if (vehicle.status === 'idle') return '#94a3b8';
    if (vehicle.status === 'maintenance') return '#8b5cf6';
    return '#22d3ee';
  }, [vehicle.alertState, vehicle.status]);

  return (
    <group 
      ref={meshRef} 
      onClick={(e) => {
        e.stopPropagation();
        onClick();
      }}
    >
      {/* Vehicle Body Placeholder - Up is Z in ENU, adjust geometry rotation if needed */}
      <group rotation={[Math.PI / 2, 0, 0]}>
        <mesh castShadow>
          <boxGeometry args={[12, 12, 30]} />
          <meshStandardMaterial 
            color={color} 
            emissive={isSelected ? color : '#000'} 
            emissiveIntensity={isSelected ? 1 : 0}
            transparent
            opacity={0.9}
          />
        </mesh>

        {/* Cabin */}
        <mesh position={[0, 8, 8]} castShadow>
          <boxGeometry args={[10, 8, 12]} />
          <meshStandardMaterial color="#334155" />
        </mesh>
      </group>

      {/* Selected Indicator */}
      {isSelected && (
        <mesh position={[0, 0, 35]} rotation={[Math.PI / 2, 0, 0]}>
          <coneGeometry args={[4, 10, 4]} />
          <meshStandardMaterial color="#22d3ee" emissive="#22d3ee" emissiveIntensity={2} />
        </mesh>
      )}

      {/* Alert Pulse */}
      {vehicle.alertState !== 'normal' && (
        <mesh position={[0, 15, 0]}>
            <sphereGeometry args={[isSelected ? 8 : 4]} />
            <meshStandardMaterial 
                color={vehicle.alertState === 'critical' ? '#ef4444' : '#f59e0b'} 
                transparent 
                opacity={0.3} 
                wireframe
            />
        </mesh>
      )}
    </group>
  );
};

const FleetLayer: React.FC<FleetLayerProps> = ({ cesiumViewer }) => {
  const { vehicles, selectedVehicleId, selectVehicle } = useFleetStore();

  if (!cesiumViewer) return null;

  return (
    <group>
      {vehicles.map((v) => (
        <VehicleMarker 
          key={v.id} 
          vehicle={v} 
          viewer={cesiumViewer}
          isSelected={v.id === selectedVehicleId}
          onClick={() => selectVehicle(v.id)}
        />
      ))}
    </group>
  );
};

export default FleetLayer;
