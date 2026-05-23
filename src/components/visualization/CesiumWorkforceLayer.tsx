import React, { useEffect, useRef } from 'react';
import * as Cesium from 'cesium';
import { useWorkforceStore } from '@/store/workforceStore';
import { WorkforceStatus } from '@/types';

interface CesiumWorkforceLayerProps {
  viewer: Cesium.Viewer | null;
}

const getStatusColor = (status: WorkforceStatus) => {
  switch (status) {
    case 'available': return Cesium.Color.CYAN;
    case 'dispatched': return Cesium.Color.ORANGE;
    case 'responding': return Cesium.Color.RED;
    case 'maintenance': return Cesium.Color.YELLOW;
    case 'offline': return Cesium.Color.GRAY;
    default: return Cesium.Color.WHITE;
  }
};

const CesiumWorkforceLayer: React.FC<CesiumWorkforceLayerProps> = ({ viewer }) => {
  const { crews, selectCrew } = useWorkforceStore();
  const entitiesRef = useRef<{ [key: string]: Cesium.Entity }>({});

  useEffect(() => {
    if (!viewer) return;

    crews.forEach((crew) => {
      const position = Cesium.Cartesian3.fromDegrees(crew.location.lng, crew.location.lat);
      const color = getStatusColor(crew.operationalStatus);

      if (entitiesRef.current[crew.id]) {
        const entity = entitiesRef.current[crew.id];
        entity.position = new Cesium.ConstantPositionProperty(position);
        if (entity.point) {
          entity.point.color = new Cesium.ConstantProperty(color.withAlpha(0.8));
          if (crew.operationalStatus === 'responding') {
             entity.point.pixelSize = new Cesium.ConstantProperty(14 + Math.sin(Date.now() / 300) * 4);
          } else {
             entity.point.pixelSize = new Cesium.ConstantProperty(10);
          }
        }
      } else {
        const entity = viewer.entities.add({
          id: `crew-entity-${crew.id}`,
          position,
          point: {
            pixelSize: 10,
            color: color.withAlpha(0.8),
            outlineColor: Cesium.Color.BLACK,
            outlineWidth: 2,
            heightReference: Cesium.HeightReference.RELATIVE_TO_GROUND,
            disableDepthTestDistance: Number.POSITIVE_INFINITY
          },
          label: {
            text: `${crew.name} (${crew.crewType})`,
            font: '10px monospace',
            fillColor: Cesium.Color.WHITE,
            outlineColor: Cesium.Color.BLACK,
            outlineWidth: 2,
            style: Cesium.LabelStyle.FILL_AND_OUTLINE,
            verticalOrigin: Cesium.VerticalOrigin.BOTTOM,
            pixelOffset: new Cesium.Cartesian2(0, -15),
            showBackground: true,
            backgroundColor: Cesium.Color.BLACK.withAlpha(0.6)
          },
          properties: { crewId: crew.id }
        });
        entitiesRef.current[crew.id] = entity;
      }
    });

    // Cleanup removed crews
    Object.keys(entitiesRef.current).forEach((id) => {
      if (!crews.find((c) => c.id === id)) {
        viewer.entities.remove(entitiesRef.current[id]);
        delete entitiesRef.current[id];
      }
    });

    return () => {
      if (viewer && !viewer.isDestroyed()) {
        Object.values(entitiesRef.current).forEach(entity => {
          viewer.entities.remove(entity);
        });
      }
      entitiesRef.current = {};
    };
  }, [viewer, crews]);

  return null;
};

export default CesiumWorkforceLayer;
