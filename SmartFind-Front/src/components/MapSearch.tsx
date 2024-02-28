import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { FaLocationPin } from 'react-icons/fa6';
import MapComponent from './MapComponent';

const MapSearch: React.FC = () => {
  const [apiKey, setApiKey] = useState('');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [coordinates, setCoordinates] = useState<{ lat: number; lng: number } | null>(null);
  const [myLocation, setMyLocation] = useState<{ lat: number; lng: number } | null>(null);
  const [connectivityStatus, setConnectivityStatus] = useState<string>('');
  const [searchInitiated, setSearchInitiated] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(false); // Track loading state
  
  const fetchData = async () => {
    try {
      const response = await fetch('http://10.247.5.180:3005/api/data');
      const data = await response.json();
      setApiKey(data.apiKey);
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleSearch = async () => {
    if (!searchQuery || loading) return; // Avoid making unnecessary calls
    setLoading(true);
    try {
      const response = await axios.get(`https://maps.googleapis.com/maps/api/geocode/json`, {
        params: {
          address: searchQuery,
          key: apiKey,
        },
      });
      const location = response.data.results[0].geometry.location;
      setCoordinates({ lat: location.lat, lng: location.lng });
      await checkConnectivity(location.lat, location.lng);
    } catch (error) {
      console.error('Error:', error);
      setConnectivityStatus('Error');
    } finally {
      setLoading(false);
    }
  };

  const checkConnectivity = async (lat: number, lng: number) => {
    const postResponse = await axios.post('http://10.247.5.180:3005/checkConnectivity', {
      clientlatitude: lat,
      clientlongitude: lng,
    });
    const { message } = postResponse.data;
    setConnectivityStatus(message);
    console.log(message)
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(e.target.value);
  };

  const getLocation = async () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(async (position) => {
        const { latitude, longitude } = position.coords;
        setMyLocation({ lat: latitude, lng: longitude });
        const searchResponse = await axios.get(`https://maps.googleapis.com/maps/api/geocode/json`, {
          params: {
            latlng: `${latitude},${longitude}`,
            key: apiKey,
          },
        });
        const searchLocation = searchResponse.data.results[0].formatted_address;
        setSearchQuery(searchLocation);
        await checkConnectivity(latitude, longitude);
      }, (error) => {
        console.error(error);
      });
    } else {
      console.error("Geolocation is not supported by this browser.");
    }
  };

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">LTE Signal Availability</h1>
      <div className="flex flex-col sm:flex-row items-center mb-4">
        <input
          type="text"
          value={searchQuery}
          onChange={handleInputChange}
          placeholder="Enter location"
          className="p-2 border mb-2 sm:mb-0 sm:mr-2 w-full sm:w-96 text-gray-800 bg-neutral-100 border-gray-300"
        />
        <div className="flex">
          <button onClick={getLocation} className="h-[42.5px] w-[42.5px] p-2 border bg-[#0c4a6e] border-gray-300">
            <FaLocationPin className="w text-[#f5f5f5]" />
          </button>
          <button onClick={handleSearch} className="p-2 rounded-md ml-2 bg-sky-900 py-2 text-white">
            Search
          </button>
        </div>
      </div>

      {searchInitiated || connectivityStatus && (
        <div>
          <p className={`py-3 ${connectivityStatus === "Network is Available" ? "text-green-500 text-xl font-bold uppercase" : "text-red-500 text-xl font-bold uppercase"}`}>
            {connectivityStatus}
          </p>
        </div>
      )}

      { (myLocation || coordinates) &&  (
        <div>
          <MapComponent coordinates={myLocation || coordinates} />
        </div>
      )}
    </div>
  );
};

export default MapSearch;
