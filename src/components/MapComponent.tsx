"use client";
import { useState } from "react";
import { MapContainer, TileLayer, Marker, Popup, Circle } from "react-leaflet";
import L from "leaflet";
import "leaflet/dist/leaflet.css";

// Define outlet structure
interface Outlet {
  id: string;
  name: string;
  address: string;
  latitude: number;
  longitude: number;
  waze_link: string;
}

interface MapComponentProps {
  outlets: Outlet[];
}

export default function MapComponent({ outlets }: MapComponentProps) {
  const [selectedOutlet, setSelectedOutlet] = useState<Outlet | null>(null);
  const [intersectingOutlets, setIntersectingOutlets] = useState<Set<string>>(
    new Set()
  );

  // Function to check if two outlets are within 5KM of each other
  function areOutletsIntersecting(outlet1: Outlet, outlet2: Outlet): boolean {
    const R = 6371; // Earth's radius in KM
    const dLat = ((outlet2.latitude - outlet1.latitude) * Math.PI) / 180;
    const dLon = ((outlet2.longitude - outlet1.longitude) * Math.PI) / 180;

    const a =
      Math.sin(dLat / 2) * Math.sin(dLat / 2) +
      Math.cos((outlet1.latitude * Math.PI) / 180) *
        Math.cos((outlet2.latitude * Math.PI) / 180) *
        Math.sin(dLon / 2) *
        Math.sin(dLon / 2);

    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    const distance = R * c; // Distance in KM

    return distance <= 5; // Returns true if within 5KM
  }

  // Handle outlet click
  function handleOutletClick(outlet: Outlet) {
    setSelectedOutlet(outlet);

    // Find intersecting outlets
    const intersecting = new Set<string>();
    outlets.forEach((otherOutlet) => {
      if (
        outlet.id !== otherOutlet.id &&
        areOutletsIntersecting(outlet, otherOutlet)
      ) {
        intersecting.add(otherOutlet.id);
      }
    });

    setIntersectingOutlets(intersecting);
  }

  // Define icons
  const defaultIcon = new L.Icon({
    iconUrl:
      "https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-green.png",
    iconSize: [25, 41],
    iconAnchor: [12, 41],
    popupAnchor: [1, -34],
    shadowUrl:
      "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png",
    shadowSize: [41, 41],
  });

  const highlightedIcon = new L.Icon({
    iconUrl:
      "https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-red.png",
    iconSize: [25, 41],
    iconAnchor: [12, 41],
    popupAnchor: [1, -34],
    shadowUrl:
      "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png",
    shadowSize: [41, 41],
  });

  const clickedIcon = new L.Icon({
    iconUrl:
      "https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-blue.png",
    iconSize: [25, 41],
    iconAnchor: [12, 41],
    popupAnchor: [1, -34],
    shadowUrl:
      "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png",
    shadowSize: [41, 41],
  });

  return (
    <MapContainer
      center={[3.1408, 101.6938]}
      zoom={12}
      className="h-screen w-full"
    >
      {/* Base Map Layer */}
      <TileLayer
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
      />

      {/* Render Outlets */}
      {outlets.map((outlet) => {
        const isIntersecting = intersectingOutlets.has(outlet.id);
        const isSelected = selectedOutlet?.id === outlet.id;

        return (
          <Marker
            key={outlet.id}
            position={[outlet.latitude, outlet.longitude]}
            icon={
              isSelected
                ? clickedIcon
                : isIntersecting
                ? highlightedIcon
                : defaultIcon
            }
            eventHandlers={{
              click: () => handleOutletClick(outlet),
            }}
          >
            <Popup>
              <strong>{outlet.name}</strong>
              <br />
              {outlet.address}
              <br />
              <a
                href={outlet.waze_link}
                target="_blank"
                rel="noopener noreferrer"
              >
                Open in Waze
              </a>
            </Popup>
          </Marker>
        );
      })}

      {/* 5KM Radius Circle - Only Show on Click */}
      {selectedOutlet && (
        <Circle
          center={[selectedOutlet.latitude, selectedOutlet.longitude]}
          radius={5000} // 5KM Radius
          pathOptions={{
            color: "blue",
            fillOpacity: 0.2,
          }}
        />
      )}
    </MapContainer>
  );
}
