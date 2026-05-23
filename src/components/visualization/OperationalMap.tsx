import React, { useEffect } from 'react';
import { MapContainer, TileLayer, ZoomControl, useMap } from 'react-leaflet';
import L from 'leaflet';
import { useMapStore } from '../../store/mapStore';
import { useFleetStore } from '../../store/fleetStore';
import { useLoadingStore } from '../../store/loadingStore';
import 'leaflet/dist/leaflet.css';

// Fix for default marker icons in Leaflet
import icon from 'leaflet/dist/images/marker-icon.png';
import iconShadow from 'leaflet/dist/images/marker-shadow.png';

let DefaultIcon = L.icon({
    iconUrl: icon,
    shadowUrl: iconShadow,
    iconSize: [25, 41],
    iconAnchor: [12, 41]
});

L.Marker.prototype.options.icon = DefaultIcon;

interface MapControllerProps {
  center: [number, number];
  zoom: number;
}

const MapController: React.FC<MapControllerProps> = ({ center, zoom }) => {
  const map = useMap();
  
  useEffect(() => {
    map.setView(center, zoom);
  }, [center, zoom, map]);

  return null;
};

const VehicleFocuser: React.FC = () => {
  const map = useMap();
  const { vehicles, selectedVehicleId } = useFleetStore();

  useEffect(() => {
    if (selectedVehicleId) {
      const vehicle = vehicles.find(v => v.id === selectedVehicleId);
      if (vehicle) {
        map.flyTo([vehicle.location.lat, vehicle.location.lng], 15, {
          duration: 1.5,
          easeLinearity: 0.25
        });
      }
    }
  }, [selectedVehicleId, vehicles, map]);

  return null;
};

interface OperationalMapProps {
  children?: React.ReactNode;
}

const OperationalMap: React.FC<OperationalMapProps> = ({ children }) => {
  const { center, zoom } = useMapStore();
  const setMapReady = useLoadingStore(state => state.setMapReady);

  useEffect(() => {
    // Leaflet initialises quickly, so we set ready state on mount
    setMapReady(true);
    return () => setMapReady(false);
  }, [setMapReady]);

  // Operational "clean" tile style - using a light grayscale or minimal colored map
  // CartoDB Positron is a great "clean enterprise" choice
  const tileUrl = "https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png";
  const attribution = '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors &copy; <a href="https://carto.com/attributions">CARTO</a>';

  return (
    <div className="relative w-full h-full bg-[#f1f5f9]">
      <MapContainer
        center={center}
        zoom={zoom}
        zoomControl={false}
        className="w-full h-full z-0 font-sans"
        attributionControl={false}
      >
        <TileLayer
          url={tileUrl}
          attribution={attribution}
        />
        <ZoomControl position="bottomright" />
        <MapController center={center} zoom={zoom} />
        <VehicleFocuser />
        {children}
      </MapContainer>
    </div>
  );
};

export default OperationalMap;
