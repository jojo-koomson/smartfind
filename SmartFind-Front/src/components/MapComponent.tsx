// MapComponent.tsx
import { useState, useEffect } from 'react';
import {
  APIProvider,
  Map,
  AdvancedMarker,
  // Pin,
  // InfoWindow,
} from '@vis.gl/react-google-maps';

const MapComponent = ({ coordinates }: { coordinates: { lat: number; lng: number } | null }) => {
  const [apiKey, setApiKey] = useState('');
  const [mapId, setmapId] = useState('');
  const [mapLoaded, setMapLoaded] = useState(false);


  const fetchData = async () => {
    try {
      const response = await fetch('https://smartfind-server2.vercel.app/api/data');
      const data = await response.json();
      // console.log(data);
      setApiKey(data.apiKey);
      setmapId(data.mapId)
    } catch (error) {
      console.error(error);
    }
  };

  // Ensure the apiKey is loaded before rendering the map
  useEffect(() => {
    fetchData();

    if (apiKey) {
      setMapLoaded(true);
    } 
  }, [apiKey]);

  return (
    <div>
    {!mapLoaded ? (
      <div>Map loading.....</div>
    ) : (
      <APIProvider apiKey={apiKey}>
        <Map style={{ height: '60vh', width: '95%', borderRadius: "5px", padding: '20px' }} mapId={mapId} zoom={15} center={coordinates}>
          <AdvancedMarker position={coordinates}></AdvancedMarker>
        </Map>
      </APIProvider>
    )}
  </div>
  
  );
};

export default MapComponent;

