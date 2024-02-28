import React, { useState, useEffect } from 'react';
import { useLoadScript } from '@react-google-maps/api'; 
import usePlacesAutocomplete, { getGeocode, getLatLng} from 'use-places-autocomplete';
import { Combobox, ComboboxInput, ComboboxPopover, ComboboxList, ComboboxOption } from '@reach/combobox';
import '@reach/combobox/styles.css';

const PlaceAutocomplete = ({ onSelect }) => {
  const [searchValue, setSearchValue] = useState('');
  const [apiKey, setApiKey] = useState('');

  const { isLoaded, loadError } = useLoadScript({
    googleMapsApiKey: apiKey,
    libraries: ['places'],
  });

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch('http://localhost:3005/api/data');
        const data = await response.json();
        setApiKey(data.apiKey);
      } catch (error) {
        console.error('Error fetching API key:', error);
      }
    };

    fetchData();
  }, []);

  useEffect(() => {
    if (isLoaded && apiKey) { // Check if both Google Maps and API key are loaded
      initializePlacesAutocomplete();
    }
  }, [isLoaded, apiKey]);

  const initializePlacesAutocomplete = () => {
    if (!window.google || !window.google.maps || !window.google.maps.places) {
      console.error('Google Maps Places API library failed to load');
      return;
    }

    // Places API script loaded successfully, initialize usePlacesAutocomplete
    // This will ensure that the Places API library is available for use
  };

  const {
    suggestions: { data, status },
    setValue,
    clearSuggestions,
  } = usePlacesAutocomplete({
    requestOptions: {
      /* Define search scope here */
    },
    debounce: 300,
  });

  const handleSelect = (address) => async () => {
    setValue(address, false);
    clearSuggestions();

    try {
      const results = await getGeocode({ address });
      const { lat, lng } = await getLatLng(results[0]);
      onSelect({ lat, lng });
    } catch (error) {
      console.error('Error fetching coordinates:', error);
    }
  };

  const handleChange = (e) => {
    setSearchValue(e.target.value);
    setValue(e.target.value);
  };

  if (loadError) return <div>Error loading Google Maps API</div>; // Handle load error
  if (!isLoaded) return <div>Loading...</div>; // Handle loading state

  return (
    <Combobox onSelect={handleSelect} aria-label="Location Search">
      <ComboboxInput
        value={searchValue}
        onChange={handleChange}
        placeholder="Enter location"
        className="p-2 border w-96 text-gray-800 bg-neutral-100 border-gray-300"
      />
      <ComboboxPopover>
        <ComboboxList>
          {status === 'OK' && data.map(({ description }) => (
            <ComboboxOption key={description} value={description} />
          ))}
        </ComboboxList>
      </ComboboxPopover>
    </Combobox>
  );
};

export default PlaceAutocomplete;
