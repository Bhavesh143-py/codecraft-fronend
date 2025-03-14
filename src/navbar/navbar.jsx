import React, { useState, useEffect, useRef } from 'react';
import { useLocation } from 'react-router-dom'; // Import useLocation hook for page routing
import img1 from '../assets/Logo.png';
import { Plus } from 'lucide-react'; // Import Plus icon
import { ArrowRight } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export default function Navbar() {
  const navigate = useNavigate();
  const [isDropdownOpen, setIsDropdownOpen] = useState(false); // State for dropdown toggle
  const dropdownRef = useRef(null); // Reference to the dropdown menu
  const buttonRef = useRef(null); // Reference to the button that triggers the dropdown
  const location = useLocation(); // Get current route

  // Function to toggle dropdown visibility
  const toggleDropdown = () => {
    setIsDropdownOpen(!isDropdownOpen);
  };

  const handleCreateFromBlank = () => {
    navigate('/create-app');
  };

  // Close dropdown if clicked outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target) &&
        buttonRef.current &&
        !buttonRef.current.contains(event.target)
      ) {
        setIsDropdownOpen(false); // Close dropdown if clicked outside
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside); // Clean up the event listener
    };
  }, []);

  return (
    <nav className="fixed top-0 left-0 w-full bg-gray-800 text-white p-2 shadow-md z-50 flex justify-between items-center">
      <img src={img1} className="h-10" alt="Logo" />

      {/* Only show "Create App" button if we're not on the login page */}
      {location.pathname !== '/' && (
        <div className="relative">
          <button
            ref={buttonRef}
            onClick={toggleDropdown}
            className="bg-[#ffffff] text-black px-3 py-1.5 rounded-md hover:bg-[#05a8ed] flex items-center gap-1.5 transition font-ubuntu text-sm hover:text-white mr-5"
          >
            <Plus className="h-4 w-4 font-ubuntu" /> Create App
          </button>
          {isDropdownOpen && (
            <div
              ref={dropdownRef}
              className="absolute right-0 mt-2 w-52 bg-white text-black rounded-md shadow-md"
            >
              <button
                className="block w-full text-left px-4 py-2 hover:bg-gray-200 border-b-2 font-ubuntu"
                onClick={handleCreateFromBlank}
              >
                <span className="flex justify-between items-center">
                  From Blank
                  <ArrowRight size={24} color="#05a8ed" />
                </span>
              </button>
              <button
                className="block w-full text-left px-4 py-2 hover:bg-gray-200 font-ubuntu" 
              >
                <span className="flex justify-between items-center">
                  From Template
                  <ArrowRight size={24} color="#05a8ed" />
                </span>
              </button>
            </div>
          )}
        </div>
      )}
    </nav>
  );
}
