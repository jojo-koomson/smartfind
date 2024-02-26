// Define the interface for props in OrderForms component
interface OrderFormsProps {
  coordinates: {
    lat: number;
    lng: number;
  };
}

// Now, you can use the OrderFormsProps interface in your component
import React from 'react';
import OrderForms from '../components/OrderForms';

const OrderPage: React.FC = () => {
  return (
    <>
      
      <OrderForms  
      initialCoordinates={{ lat: 0, lng: 0 }} 
      />
    </>
  );
};

export default OrderPage;
