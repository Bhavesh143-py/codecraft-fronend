import React, { useState, useEffect } from 'react';
import Navbar from '../navbar/Navbar';
import img from "../assets/imges5.png";
import { motion } from 'framer-motion';
import { ChevronLeft, ChevronRight, MoreVertical } from 'lucide-react';
import axios from 'axios';

export default function Apps() {
  const [activeTab, setActiveTab] = useState('All');
  const [isSearchMode, setIsSearchMode] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [cardData, setCardData] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  const fetchWorkflows = async () => {
    try {
      const user_id = "3fa85f64-5717-4562-b3fc-2c963f66afa6";
      const response = await axios.get(`${import.meta.env.VITE_API_URL}/workflows/all/${user_id}`);
      setCardData(response.data || []);
    } catch (error) {
      console.error("Error fetching workflows:", error);
    }
  };

  useEffect(() => {
    fetchWorkflows();
  }, []);

  const handleTabClick = (tab) => setActiveTab(tab);
  const handleSearchClick = () => setIsSearchMode(true);
  const handleSearchBlur = () => setIsSearchMode(false);
  const handleSearchChange = (e) => setSearchQuery(e.target.value);

  const filteredData = cardData.filter((card) =>
    card.workflow_name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const totalPages = Math.ceil(filteredData.length / itemsPerPage);
  const paginatedData = filteredData.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);

  const handlePrevPage = () => {
    if (currentPage > 1) setCurrentPage(currentPage - 1);
  };

  const handleNextPage = () => {
    if (currentPage < totalPages) setCurrentPage(currentPage + 1);
  };

  return (
    <>
      <Navbar />
      <div
        className="min-h-screen pb-12 flex flex-col items-center px-4"
        style={{
          background: 'radial-gradient(circle at 20% 20%, #1a1d2b, #0f111a)',
        }}
      >
        {/* Hero Section */}
        <div className="flex flex-col md:flex-row items-center justify-between mb-12 w-full max-w-7xl mt-20 md:mt-32">
          <motion.div
            className="flex px-4 md:px-0 mb-6 md:mb-0"
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: 'easeOut' }}
          >
            <img
              src={img}
              alt="AI Illustration"
              className="w-full max-w-xl rounded-2xl shadow-[0_0_25px_#05a8ed60] border border-white/10 transition-all duration-300"
            />
          </motion.div>

          <motion.div
            className="md:w-1/2 text-white md:text-left px-4"
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.9, delay: 0.6, ease: 'easeOut' }}
          >
            <h1 className="text-3xl sm:text-5xl font-extrabold leading-tight mb-6 font-ubuntu">
              Empowering <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-blue-500">
                Innovation Through AI
              </span>
            </h1>
            <p className="text-base sm:text-lg text-gray-300 max-w-xl leading-relaxed font-ubuntu">
              Leveraging the power of artificial intelligence to drive creative solutions,
              enhance productivity, and shape the future of technology.
            </p>
          </motion.div>
        </div>

        {/* Tabs + Search */}
        <div className="flex items-center w-full ml-5 mb-10 px-4 mt-5">
          {isSearchMode ? (
            <input
              type="text"
              placeholder="Search..."
              className="py-3 px-6 rounded-full shadow-md border-2 border-gray-300 focus:outline-none focus:border-blue-500 w-full max-w-sm bg-white/10 text-white placeholder-gray-300"
              autoFocus
              onBlur={handleSearchBlur}
              onChange={handleSearchChange}
              value={searchQuery}
            />
          ) : (
            <div className="flex space-x-4">
              <button
                onClick={() => handleTabClick('All')}
                className={`${
                  activeTab === 'All'
                    ? 'bg-gradient-to-r from-blue-500 to-indigo-600 text-white font-semibold shadow-lg'
                    : 'bg-white text-gray-800 border border-gray-300 hover:border-blue-500 hover:bg-blue-500 hover:text-white'
                } py-2 px-6 rounded-full transition-all duration-300 font-ubuntu`}
              >
                All
              </button>
              <button
                onClick={handleSearchClick}
                className="bg-white text-gray-800 border border-gray-300 hover:border-blue-500 hover:bg-blue-500 hover:text-white py-2 px-6 rounded-full transition-all duration-300 font-ubuntu"
              >
                Search
              </button>
            </div>
          )}
        </div>

        {/* Cards Section */}
        <div className="w-full px-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6">
            {paginatedData.length === 0
              ? Array.from({ length: 10 }).map((_, idx) => (
                  <div
                    key={idx}
                    className="relative bg-[#1f2937]/60 border border-white/10 backdrop-blur-lg p-5 rounded-2xl shadow-lg transition-all duration-300 flex flex-col justify-center items-center text-white min-h-[150px]"
                  >
                    {idx === 2 && (
                      <p className="text-base font-semibold text-gray-400 text-center">
                        No App Found
                      </p>
                    )}
                  </div>
                ))
              : paginatedData.map((card, index) => (
                  <div
                    key={index}
                    className="relative bg-[#1f2937]/60 border border-white/10 backdrop-blur-lg p-5 rounded-2xl shadow-lg hover:shadow-blue-500/30 hover:scale-[1.03] transition-all duration-300 flex flex-col justify-between text-white min-h-[150px]"
                  >
                    <div className="absolute top-3 right-3">
                      <button className="text-gray-400 hover:text-white transition">
                        <MoreVertical size={20} />
                      </button>
                    </div>
                    <div className="flex flex-col gap-3">
                      <h2 className="text-lg font-bold text-white">{card.workflow_name}</h2>
                      <p className="text-sm text-gray-300 leading-relaxed line-clamp-3">
                        {card.description}
                      </p>
                    </div>
                  </div>
                ))}
          </div>

          {/* Pagination */}
          {paginatedData.length > 0 && (
            <div className="flex float-end space-x-4 mt-6">
              <button
                onClick={handlePrevPage}
                className="text-white bg-blue-500 rounded-full p-3 hover:bg-blue-600 transition-all"
                disabled={currentPage === 1}
              >
                <ChevronLeft size={24} />
              </button>
              <button
                onClick={handleNextPage}
                className="text-white bg-blue-500 rounded-full p-3 hover:bg-blue-600 transition-all"
                disabled={currentPage === totalPages}
              >
                <ChevronRight size={24} />
              </button>
            </div>
          )}
        </div>
      </div>
    </>
  );
}
