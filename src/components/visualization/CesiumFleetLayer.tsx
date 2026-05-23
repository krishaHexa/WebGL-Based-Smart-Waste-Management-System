import React, { useEffect, useRef } from 'react';
import * as Cesium from 'cesium';
import { useFleetStore } from '@/store/fleetStore';

interface CesiumFleetLayerProps {
  viewer: Cesium.Viewer | null;
}

const CesiumFleetLayer: React.FC<CesiumFleetLayerProps> = ({ viewer }) => {
  const { vehicles, selectedVehicleId } = useFleetStore();
  const routeEntitiesRef = useRef<Map<string, Cesium.Entity>>(new Map());

  useEffect(() => {
    if (!viewer) return;

    // Clear old entities if needed (though we're updating them)
    // For a prototype, we'll draw routes for the selected vehicle primarily to keep it clean
    const selectedVehicle = vehicles.find(v => v.id === selectedVehicleId);

    // Sync entities
    vehicles.forEach(vehicle => {
      // We could add simple labels or shadows in Cesium if needed
      // But per requirements: Route lines are Cesium's job
    });

    // Handle Route Highlighting for Selected Vehicle
    if (selectedVehicle && selectedVehicleId) {
      const routeId = `route-${selectedVehicleId}`;
      let entity = routeEntitiesRef.current.get(routeId);

      // Generating a slightly more realistic operational path
      const points = [
        selectedVehicle.location.lng, selectedVehicle.location.lat,
        selectedVehicle.location.lng + 0.002, selectedVehicle.location.lat + 0.001,
        selectedVehicle.location.lng + 0.005, selectedVehicle.location.lat + 0.004,
        selectedVehicle.location.lng + 0.008, selectedVehicle.location.lat + 0.003,
        selectedVehicle.location.lng + 0.012, selectedVehicle.location.lat + 0.006,
      ];

      if (!entity) {
        entity = viewer.entities.add({
          id: routeId,
          polyline: {
            positions: Cesium.Cartesian3.fromDegreesArray(points),
            width: 6,
            material: new Cesium.PolylineGlowMaterialProperty({
              glowPower: 0.3,
              color: Cesium.Color.fromCssColorString('#3b82f6').withAlpha(0.8),
            }),
            clampToGround: true,
            zIndex: 10,
          }
        });
        routeEntitiesRef.current.set(routeId, entity);
      } else {
        // Update positions 
        if (entity.polyline) {
            (entity.polyline.positions as any) = Cesium.Cartesian3.fromDegreesArray(points);
        }
      }
    } else {
      // Remove or hide routes when no selection
      routeEntitiesRef.current.forEach((entity, id) => {
        viewer.entities.removeById(id);
      });
      routeEntitiesRef.current.clear();
    }

    return () => {
        // Cleanup entities on unmount
        if (viewer && !viewer.isDestroyed()) {
            routeEntitiesRef.current.forEach((entity, id) => {
                viewer.entities.removeById(id);
            });
        }
    };
  }, [viewer, selectedVehicleId, vehicles]);

  return null;
};

export default CesiumFleetLayer;
