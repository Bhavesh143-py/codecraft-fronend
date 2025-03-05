import React, { useState } from 'react';
import img1 from '../assets/Logo.png';

export default function Navbar() {
    const [isOpen, setIsOpen] = useState(false); // State for mobile menu toggle

    const toggleMenu = () => {
        setIsOpen(!isOpen);
    };

    return (
        <div>
            {/* Fixed Navbar */}
            <nav className="fixed top-0 left-0 w-full bg-gray-800 text-white p-4 shadow-md z-50">
                <div className="max-w-7xl mx-auto flex justify-between items-center">
                    {/* Logo */}
                    <div className="flex items-center">
                        <img src={img1} className="h-10" alt="Logo" />
                    </div>


                    {/* Mobile Menu Button */}
                    <div className="md:hidden">
                        <button onClick={toggleMenu} className="text-white">
                            <svg
                                xmlns="http://www.w3.org/2000/svg"
                                fill="none"
                                viewBox="0 0 24 24"
                                stroke="currentColor"
                                className="h-6 w-6"
                            >
                                <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth="2"
                                    d="M4 6h16M4 12h16M4 18h16"
                                />
                            </svg>
                        </button>
                    </div>
                </div>
            </nav>
        </div>
    );
}
