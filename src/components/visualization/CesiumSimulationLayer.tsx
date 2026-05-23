import React, { useEffect, useRef } from 'react';
import * as Cesium from 'cesium';
import { useSimulationStore } from '@/store/simulationStore';

interface CesiumSimulationLayerProps {
  viewer: Cesium.Viewer | null;
}

const CesiumSimulationLayer: React.FC<CesiumSimulationLayerProps> = ({ viewer }) => {
  const { state } = useSimulationStore();
  const entitiesRef = useRef<Cesium.Entity[]>([]);

  useEffect(() => {
    if (!viewer || !state.isActive) {
      // Cleanup
      entitiesRef.current.forEach(entity => viewer?.entities.remove(entity));
      entitiesRef.current = [];
      return;
    }

    // Add simulation-specific visual markers
    const addVisuals = () => {
      const entities: Cesium.Entity[] = [];

      // Add a large circular area to represent the "Impact Zone"
      const impactZone = viewer.entities.add({
        name: 'Simulation Impact Zone',
        position: Cesium.Cartesian3.fromDegrees(46.6753, 24.7136),
        ellipse: {
          semiMinorAxis: 5000.0,
          semiMajorAxis: 5000.0,
          material: Cesium.Color.PURPLE.withAlpha(0.2),
          outline: true,
          outlineColor: Cesium.Color.PURPLE,
          outlineWidth: 2,
          height: 100
        }
      });
      entities.push(impactZone);

      // Add pulse markers for "Stress Points"
      for (let i = 0; i < state.metrics.affectedZones; i++) {
        const offset = 0.02 * (i + 1);
        const stressPoint = viewer.entities.add({
          position: Cesium.Cartesian3.fromDegrees(46.6753 + (Math.random() - 0.5) * 0.1, 24.7136 + (Math.random() - 0.5) * 0.1),
          point: {
            pixelSize: 15,
            color: Cesium.Color.RED.withAlpha(0.6),
            outlineColor: Cesium.Color.WHITE,
            outlineWidth: 2,
            heightReference: Cesium.HeightReference.RELATIVE_TO_GROUND,
            disableDepthTestDistance: Number.POSITIVE_INFINITY
          },
          label: {
            text: 'STRESS_DETECTION',
            font: '10px monospace',
            fillColor: Cesium.Color.WHITE,
            outlineColor: Cesium.Color.BLACK,
            outlineWidth: 2,
            style: Cesium.LabelStyle.FILL_AND_OUTLINE,
            verticalOrigin: Cesium.VerticalOrigin.BOTTOM,
            pixelOffset: new Cesium.Cartesian2(0, -20)
          }
        });
        entities.push(stressPoint);
      }

      entitiesRef.current = entities;
    };

    addVisuals();

    return () => {
      entitiesRef.current.forEach(entity => viewer.entities.remove(entity));
      entitiesRef.current = [];
    };
  }, [viewer, state.isActive, state.activeScenarioId, state.metrics.affectedZones]);

  return null;
};

export default CesiumSimulationLayer;
