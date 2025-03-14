import React, { useState } from 'react';
import Navbar from '../navbar/Navbar';

export default function Apps() {
  const [activeTab, setActiveTab] = useState('All');
  const [isSearchMode, setIsSearchMode] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  const handleTabClick = (tab) => {
    setActiveTab(tab);
  };

  const handleSearchClick = () => {
    setIsSearchMode(true);
  };

  const handleSearchBlur = () => {
    setIsSearchMode(false);
  };

  const handleSearchChange = (e) => {
    setSearchQuery(e.target.value);
  };

  // Sample card data
  const cardData = new Array(10).fill(null);

  return (
    <>
      <Navbar />
      <div className="bg-[#F2F4F7] min-h-screen pt-16 pb-12 flex flex-col items-center">
        {/* Tagline Section */}
        <div className="text-center px-8 pt-5 mb-8">
          <h1 className="text-xl sm:text-4xl font-extrabold text-gray-800 leading-tight mb-4 font-ubuntu">
            Empowering <br />
            <span className="text-[#05a8ed] font-ubuntu">Innovation Through AI</span>
          </h1>
          <p className="text-base sm:text-lg text-gray-700 max-w-3xl mx-auto leading-relaxed font-ubuntu">
            Leveraging the power of artificial intelligence to drive creative solutions, enhance productivity, and shape the future of technology.
          </p>
        </div>

        {/* Tabs Section */}
        <div className="flex flex-wrap items-center space-x-4 mb-6 w-full justify-start pl-4 rounded-lg">
          {isSearchMode ? (
            <input
              type="text"
              placeholder="Search..."
              className="py-3 px-6 rounded-full shadow-md border-2 border-gray-300 focus:outline-none focus:border-blue-500 w-full max-w-sm"
              autoFocus
              onBlur={handleSearchBlur}
              onChange={handleSearchChange}
              value={searchQuery}
            />
          ) : (
            <div className="flex items-center space-x-4">
              <button
                onClick={() => handleTabClick('All')}
                className={`${
                  activeTab === 'All'
                    ? 'bg-gradient-to-r from-blue-500 to-indigo-600 text-white font-semibold shadow-lg font-ubuntu'
                    : 'bg-white text-gray-800 border-2 border-gray-300 hover:border-blue-500 hover:bg-blue-500 hover:text-white'
                } py-2 px-4 rounded-full shadow-md hover:scale-105 hover:shadow-2xl transition-all duration-300 ease-in-out transform`}
              >
                All
              </button>
              <button
                onClick={handleSearchClick}
                className="bg-white text-gray-800 border-2 border-gray-300 hover:border-blue-500 hover:bg-blue-500 hover:text-white py-2 px-4 rounded-full shadow-md hover:scale-105 hover:shadow-2xl transition-all duration-300 ease-in-out transform font-ubuntu"
              >
                Search
              </button>
            </div>
          )}
        </div>

        {/* Card Section */}
        <div className="flex justify-center items-center w-full relative">
          {activeTab === 'All' && (
            <div className="w-full ml-5 mr-5">
              {/* Card Section */}
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4 w-full relative">
                {/* "No App Found" tagline over the 7th card */}
                <div className="absolute top-[30%] left-[50%] transform -translate-x-1/2 -translate-y-1/2 z-10">
                  <p className="text-sm sm:text-sm font-semibold text-gray-500">No App Found</p>
                </div>

                {/* Cards */}
                {cardData.map((_, index) => (
                  <div key={index} className="bg-[#F8F9FB] p-20 rounded-lg shadow-sm"></div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </>
  );
}
