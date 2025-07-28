import React, { useEffect, useRef } from 'react';
import { AlumniProfile } from '../types';

// Add a declaration for the Leaflet global object
declare const L: any;

interface MapViewProps {
  profiles: AlumniProfile[];
  onProfileSelect: (profile: AlumniProfile) => void;
}

const MapView: React.FC<MapViewProps> = ({ profiles, onProfileSelect }) => {
  const mapContainer = useRef<HTMLDivElement>(null);
  const mapRef = useRef<any>(null); // To hold the map instance

  useEffect(() => {
    // Initialize map only once
    if (!mapContainer.current || mapRef.current) return;

    mapRef.current = L.map(mapContainer.current).setView([13.7563, 100.5018], 6); // Default view of Thailand

    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
    }).addTo(mapRef.current);

    // Cleanup function to remove map on component unmount
    return () => {
      if (mapRef.current) {
        mapRef.current.remove();
        mapRef.current = null;
      }
    };
  }, []); // Empty dependency array ensures this runs only once

  useEffect(() => {
    if (!mapRef.current) return;

    // Clear existing markers
    mapRef.current.eachLayer((layer: any) => {
      if (layer instanceof L.Marker) {
        mapRef.current.removeLayer(layer);
      }
    });

    const markerGroup: any[] = [];

    profiles.forEach(profile => {
      // Use latitude and longitude directly from the profile data
      // Check for non-null and that they are numbers
      if (profile.latitude != null && profile.longitude != null && !isNaN(profile.latitude) && !isNaN(profile.longitude)) {
        const marker = L.marker([profile.latitude, profile.longitude]);

        const popupContent = `
          <div class="p-1 max-w-xs">
            <h3 class="font-bold text-base text-green-800">${profile.businessName}</h3>
            <p class="text-sm text-gray-600">${profile.name}</p>
            <button id="view-details-${profile.id}" class="mt-2 w-full text-center px-3 py-1 bg-green-700 text-white text-xs font-semibold rounded-md hover:bg-green-800 transition-colors">ดูรายละเอียด</button>
          </div>
        `;
        
        marker.bindPopup(popupContent);
        
        // Add event listener to the popup button
        marker.on('popupopen', () => {
          const btn = document.getElementById(`view-details-${profile.id}`);
          if (btn) {
            btn.onclick = () => onProfileSelect(profile);
          }
        });

        markerGroup.push(marker);
      }
    });

    if (markerGroup.length > 0) {
      const group = L.featureGroup(markerGroup).addTo(mapRef.current);
      // Adjust map view to fit all markers
      if (markerGroup.length > 1) {
          mapRef.current.fitBounds(group.getBounds().pad(0.2));
      } else {
          // If only one marker, center on it with a closer zoom
          mapRef.current.setView(markerGroup[0].getLatLng(), 14);
      }
    } else {
        // If no markers, reset to default view of Thailand
        mapRef.current.setView([13.7563, 100.5018], 6);
    }

  }, [profiles, onProfileSelect]); // Rerun when profiles change

  return (
    <div className="container mx-auto px-4 pb-8">
        <div ref={mapContainer} style={{ height: 'calc(100vh - 280px)', minHeight: '500px' }} className="w-full h-full rounded-lg shadow-lg bg-gray-200" />
    </div>
  );
};

export default MapView;
