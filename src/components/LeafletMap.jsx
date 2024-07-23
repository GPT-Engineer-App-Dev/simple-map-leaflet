import { useEffect, useRef, useState } from 'react';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import 'leaflet-draw/dist/leaflet.draw.css';
import 'leaflet-draw';
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Search } from "lucide-react";

const LeafletMap = () => {
  const mapRef = useRef(null);
  const drawnItemsRef = useRef(null);
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    if (!mapRef.current) {
      const map = L.map('map').setView([51.505, -0.09], 13);

      L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
      }).addTo(map);

      drawnItemsRef.current = new L.FeatureGroup();
      map.addLayer(drawnItemsRef.current);

      const drawControl = new L.Control.Draw({
        edit: {
          featureGroup: drawnItemsRef.current
        },
        draw: {
          polygon: true,
          polyline: true,
          rectangle: true,
          circle: true,
          marker: true
        }
      });

      map.addControl(drawControl);

      map.on(L.Draw.Event.CREATED, (event) => {
        const layer = event.layer;
        drawnItemsRef.current.addLayer(layer);
      });

      mapRef.current = map;
    }

    return () => {
      if (mapRef.current) {
        mapRef.current.remove();
        mapRef.current = null;
      }
    };
  }, []);

  const handleSearch = async (e) => {
    e.preventDefault();
    if (!searchQuery) return;

    try {
      const response = await fetch(`https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(searchQuery)}`);
      const data = await response.json();

      if (data && data.length > 0) {
        const { lat, lon } = data[0];
        mapRef.current.setView([lat, lon], 13);
        L.marker([lat, lon]).addTo(mapRef.current)
          .bindPopup(searchQuery)
          .openPopup();
      } else {
        console.log('Location not found');
        // You might want to show a user-friendly message here
      }
    } catch (error) {
      console.error('Error during geocoding:', error);
      // You might want to show a user-friendly error message here
    }
  };

  return (
    <div className="space-y-4">
      <form onSubmit={handleSearch} className="flex gap-2">
        <Input
          type="text"
          placeholder="Search for a place..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="flex-grow"
        />
        <Button type="submit">
          <Search className="h-4 w-4 mr-2" />
          Search
        </Button>
      </form>
      <div id="map" className="h-[600px] w-full" />
    </div>
  );
};

export default LeafletMap;