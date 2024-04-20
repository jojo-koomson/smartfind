import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { FaLocationPin } from 'react-icons/fa6';
import { useNavigate } from 'react-router-dom';

interface OrderFormsProps {
  initialCoordinates: { lat: number; lng: number } | null;
}

const OrderForms: React.FC<OrderFormsProps> = ({ initialCoordinates }) => {
  const [formData, setFormData] = useState({
    fullName: '',
    contact: '',
    email: '',
    location: {
      latitude: initialCoordinates?.lat || 0,
      longitude: initialCoordinates?.lng || 0,
    } 
  });

  const [formErrors, setFormErrors] = useState({
    fullName: '',
    contact: '',
    email: '',
  });

  const [searchQuery, setSearchQuery] = useState<string>('');
  const [apiKey, setApiKey] = useState('');
  const [myLocation, setMyLocation] = useState<{ lat: number; lng: number } | null>(null);
  const navigate = useNavigate();

  const fetchData = async () => {
    try {
      const response = await fetch('https://smartfind-server2.vercel.app/api/data');
      const data = await response.json();
      setApiKey(data.apiKey);
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prevData => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleLocationChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(e.target.value);
  };

  // Form validation

  const validateForm = () => {
    let errors = {} as any;
    let isValid = true;

    if (!formData.fullName.trim()) {
      errors.fullName = 'Full name is required';
      isValid = false;
    }

    if (!formData.contact.trim()) {
      errors.contact = 'Contact is required';
      isValid = false;
    } else if (!/^\d+$/.test(formData.contact)) {
      errors.contact = 'Contact must be a valid number';
      isValid = false;
    }

    if (!formData.email.trim()) {
      errors.email = 'Email is required';
      isValid = false;
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      errors.email = 'Email address is invalid';
      isValid = false;
    }

    setFormErrors(errors);
    return isValid;
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
        setFormData(prevData => ({
          ...prevData,
          location: { latitude, longitude },
        }));
      }, (error) => {
        console.error(error);
      });
    } else {
      console.error("Geolocation is not supported by this browser.");
    }
  };
  

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    try {
      const response = await fetch('https://smartfind-server2.vercel.app/submitForm', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });
      console.log("Form Object: ", formData)

      if (response.ok) {
        const data = await response.json();
        console.log(data); 
        setTimeout(()=>(navigate('/')), 3000)
      } else {
        console.error('Form submission failed');
      }
    } catch (error) {
      console.error('Error submitting form:', error);
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-950 bg-opacity-70">
      <div className="bg-white p-8 rounded-md shadow-md w-full md:w-1/2 lg:w-1/3">
        <h2 className="text-2xl font-semibold mb-6">Order Form</h2>

        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700">Full Name:</label>
            <input
              type="text"
              name="fullName"
              value={formData.fullName}
              onChange={handleChange}
              className="mt-1 p-2 w-full border bg-transparent rounded-md"
              required
            />
            {formErrors.fullName && <p className="text-red-500">{formErrors.fullName}</p>}
          </div>

          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700">Contact:</label>
            <input
              type="text"
              name="contact"
              value={formData.contact}
              onChange={handleChange}
              className="mt-1 p-2 w-full border bg-transparent rounded-md"
              required
            />
            {formErrors.contact && <p className="text-red-500">{formErrors.contact}</p>}
          </div>

          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700">Email:</label>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              className="mt-1 p-2 w-full border rounded-md bg-transparent"
              required
            />
            {formErrors.email && <p className="text-red-500">{formErrors.email}</p>}
          </div>

          <div className="flex items-center mb-4">
            <input
              type="text"
              value={searchQuery}
              onChange={handleLocationChange}
              placeholder="Enter location or get location"
              className="p-2 w-full text-gray-800 border rounded-md bg-transparent"
            />
            <button type="button" onClick={getLocation} className="h-[42.5px] ml-2 p-2 border bg-[#3b82f6] border-gray-300">
              <FaLocationPin className="w text-[#f5f5f5]" />
            </button>
          </div>

          <button
            type="submit"
            className="w-full bg-blue-500 text-white p-2 rounded-md hover:bg-blue-700 focus:outline-none focus:shadow-outline-blue active:bg-blue-800"
          >
            Submit Form
          </button>
        </form>
      </div>
    </div>
  );
};

export default OrderForms;
