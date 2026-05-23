import React, { useEffect, useRef } from 'react';
import * as Cesium from 'cesium';
import { useSurveillanceStore } from '@/store/surveillanceStore';
import { CameraStatus } from '@/types';

interface CesiumCCTVLayerProps {
  viewer: Cesium.Viewer | null;
}

const getStatusColor = (status: CameraStatus, isLinked: boolean) => {
  if (isLinked) return Cesium.Color.RED;
  switch (status) {
    case 'online': return Cesium.Color.CYAN;
    case 'degraded': return Cesium.Color.ORANGE;
    case 'offline': return Cesium.Color.GRAY;
    case 'maintenance': return Cesium.Color.YELLOW;
    default: return Cesium.Color.WHITE;
  }
};

const CesiumCCTVLayer: React.FC<CesiumCCTVLayerProps> = ({ viewer }) => {
  const { cameras, selectCamera } = useSurveillanceStore();
  const entitiesRef = useRef<{ [key: string]: Cesium.Entity }>({});

  useEffect(() => {
    if (!viewer) return;

    cameras.forEach((cam) => {
      const position = Cesium.Cartesian3.fromDegrees(cam.location.lng, cam.location.lat);
      const color = getStatusColor(cam.operationalStatus, cam.incidentLinked);

      if (entitiesRef.current[cam.id]) {
        const entity = entitiesRef.current[cam.id];
        entity.position = new Cesium.ConstantPositionProperty(position);
        if (entity.point) {
          entity.point.color = new Cesium.ConstantProperty(color.withAlpha(0.8));
          if (cam.incidentLinked) {
            entity.point.pixelSize = new Cesium.ConstantProperty(18 + Math.sin(Date.now() / 200) * 4);
          } else {
            entity.point.pixelSize = new Cesium.ConstantProperty(12);
          }
        }
      } else {
        const entity = viewer.entities.add({
          id: `cam-entity-${cam.id}`,
          position,
          point: {
            pixelSize: 12,
            color: color.withAlpha(0.8),
            outlineColor: Cesium.Color.BLACK,
            outlineWidth: 2,
            heightReference: Cesium.HeightReference.RELATIVE_TO_GROUND,
            disableDepthTestDistance: Number.POSITIVE_INFINITY
          },
          label: {
            text: cam.cameraCode,
            font: '10px monospace',
            fillColor: Cesium.Color.WHITE,
            outlineColor: Cesium.Color.BLACK,
            outlineWidth: 2,
            style: Cesium.LabelStyle.FILL_AND_OUTLINE,
            verticalOrigin: Cesium.VerticalOrigin.BOTTOM,
            pixelOffset: new Cesium.Cartesian2(0, -15),
            showBackground: true,
            backgroundColor: Cesium.Color.BLACK.withAlpha(0.7)
          },
          properties: { cameraId: cam.id }
        });
        entitiesRef.current[cam.id] = entity;
      }
    });

    // Cleanup removed cameras
    Object.keys(entitiesRef.current).forEach((id) => {
      if (!cameras.find((c) => c.id === id)) {
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
  }, [viewer, cameras]);

  return null;
};

export default CesiumCCTVLayer;
