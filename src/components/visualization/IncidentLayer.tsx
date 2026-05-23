import React, { useMemo, useRef } from 'react';
import { useIncidentStore } from '@/store/incidentStore';
import * as THREE from 'three';
import { useFrame } from '@react-three/fiber';
import { Html } from '@react-three/drei';
import { motion, AnimatePresence } from 'motion/react';
import { AlertCircle } from 'lucide-react';
import { cn } from '@/lib/utils';

import * as Cesium from 'cesium';

const IncidentMarker: React.FC<{ 
  incident: any; 
  onClick: () => void;
  selected: boolean;
}> = ({ incident, onClick, selected }) => {
  const meshRef = useRef<THREE.Group>(null);
  const color = incident.severity === 'critical' ? '#ef4444' : incident.severity === 'high' ? '#f97316' : '#3b82f6';
  const ringRef = useRef<THREE.Mesh>(null);

  useFrame((state) => {
    if (meshRef.current) {
        const cartesian = Cesium.Cartesian3.fromDegrees(incident.location.lng, incident.location.lat, 20);
        const enuMatrix = Cesium.Transforms.eastNorthUpToFixedFrame(cartesian);
        
        const m = new THREE.Matrix4().set(
            enuMatrix[0], enuMatrix[4], enuMatrix[8], enuMatrix[12],
            enuMatrix[1], enuMatrix[5], enuMatrix[9], enuMatrix[13],
            enuMatrix[2], enuMatrix[6], enuMatrix[10], enuMatrix[14],
            enuMatrix[3], enuMatrix[7], enuMatrix[11], enuMatrix[15]
        );

        const rotationYtoZ = new THREE.Matrix4().makeRotationX(Math.PI / 2);
        m.multiply(rotationYtoZ);

        meshRef.current.matrixAutoUpdate = false;
        meshRef.current.matrix.copy(m);
        meshRef.current.matrixWorldNeedsUpdate = true;
    }

    if (ringRef.current) {
        const t = state.clock.getElapsedTime();
        const scale = 1 + Math.sin(t * 3) * 0.5;
        const opacity = 0.3 - Math.sin(t * 3) * 0.2;
        ringRef.current.scale.set(scale, scale, 1);
        (ringRef.current.material as THREE.MeshBasicMaterial).opacity = opacity;
    }
  });
  
  return (
    <group ref={meshRef}>
      {/* Pulse Outer Ring */}
      <mesh>
        <ringGeometry args={[20, 30, 32]} />
        <meshBasicMaterial 
          color={color} 
          transparent 
          opacity={0.3} 
          side={THREE.DoubleSide} 
        />
        <mesh ref={ringRef}>
           <ringGeometry args={[20, 30, 32]} />
           <meshBasicMaterial color={color} transparent opacity={0.3} />
        </mesh>
      </mesh>
      
      {/* HTML Overlay */}
      <Html distanceFactor={2000000 /* Adjust for ECEF scale */} occlude>
        <div 
          onClick={(e) => {
            e.stopPropagation();
            onClick();
          }}
          className={cn(
            "flex flex-col items-center gap-2 cursor-pointer group transition-all duration-300",
            selected ? "scale-125 z-40" : "scale-100 z-10"
          )}
        >
          <div className={cn(
            "p-1.5 rounded-full border-2 bg-slate-950/80 shadow-2xl relative",
            incident.severity === 'critical' ? "border-red-500 text-red-500" : 
            incident.severity === 'high' ? "border-orange-500 text-orange-500" : "border-blue-500 text-blue-500"
          )}>
            <AlertCircle size={selected ? 24 : 16} className={cn(
                "transition-transform",
                incident.severity === 'critical' && "animate-pulse"
            )} />
            
            <AnimatePresence>
                {selected && (
                    <motion.div 
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: 10 }}
                        className="absolute bottom-full mb-3 left-1/2 -translate-x-1/2 whitespace-nowrap"
                    >
                        <div className="glass-panel px-3 py-2 rounded-lg border-slate-700 shadow-xl flex flex-col items-center">
                            <span className="text-[10px] font-bold text-slate-100 uppercase tracking-widest">{incident.title}</span>
                            <span className="text-[8px] text-slate-500 font-mono mt-1">{incident.incidentCode}</span>
                            <div className="absolute top-full left-1/2 -translate-x-1/2 w-0 h-0 border-l-[6px] border-l-transparent border-r-[6px] border-r-transparent border-t-[6px] border-t-slate-800" />
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
          </div>
        </div>
      </Html>
    </group>
  );
};

const IncidentLayer: React.FC = () => {
  const { incidents, selectedIncidentId, setSelectedIncidentId } = useIncidentStore();

  const activeIncidents = useMemo(() => {
    return incidents.filter(i => i.status !== 'resolved');
  }, [incidents]);

  return (
    <group>
      {activeIncidents.map((incident) => {
        return (
          <IncidentMarker 
            key={incident.id} 
            incident={incident}
            selected={selectedIncidentId === incident.id}
            onClick={() => setSelectedIncidentId(incident.id)}
          />
        );
      })}
    </group>
  );
};

export default IncidentLayer;
