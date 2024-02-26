import React from 'react';
import { FaCartShopping } from 'react-icons/fa6';
import logo from '../assets/cropped-Smart-Infraco-Logo-Transparent-white.png';
import { NavLink } from 'react-router-dom';

const Navbar = () => {
  return (   
    <div className="flex items-center h-20 shadow-md bg-[#041428]">
      <div className="mx-auto relative px-5 max-w-screen-xl w-full flex items-center justify-between">
        <div className="text-4xl font-light uppercase">
          <img className="h-10 w-auto" src={logo} alt="Smart Infraco Logo" />
        </div>

        <div className="hidden md:flex gap-5">
          <NavLink to="/OrderPage" className="flex items-center">
            <FaCartShopping color="white" size={30} />
            <span className="text-white ml-1">Order</span>
          </NavLink>
        </div>

        <div className="md:hidden flex items-center">
          <NavLink to="/OrderPage" className="flex items-center">
            <FaCartShopping color="white" size={24} />
          </NavLink>
        </div>
      </div>
    </div>
  );
};

export default Navbar;
