import React, { useState, useEffect, useRef } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import img from "../assets/imges5.png";
import { motion } from 'framer-motion';
import AppCard from './Appcard';
import { ChevronLeft, ChevronRight, MoreVertical, Plus, ArrowRight } from 'lucide-react';
import axios from 'axios';
import { useWorkflowStore } from "../store/Mystore";


export default function Apps() {
  const [activeTab, setActiveTab] = useState('All');
  const [isSearchMode, setIsSearchMode] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [cardData, setCardData] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const itemsPerPage = 10;
  const dropdownRef = useRef(null);
  const buttonRef = useRef(null);
  const location = useLocation();
  const navigate = useNavigate();
  const { initializeWorkflow, selectWorkflow } = useWorkflowStore();

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
  const handleDeleteApp = async (workflowId) => {
    try {
      // Replace with your actual API endpoint for deleting workflows
      await axios.delete(`${import.meta.env.VITE_API_URL}/workflows/${workflowId}`);
      alert("App deleted successfully");
      setCardData(prevData => prevData.filter(item =>
        (item.id !== workflowId && item.workflow_id !== workflowId)
      ));
    } catch (error) {
      console.error("Error deleting workflow:", error);
      alert("Failed to delete the app. Please try again.");
    }
  };
  const handleWorkflowClick = (workflowId) => {
    try {
      axios.get(`${import.meta.env.VITE_API_URL}/workflows/${workflowId}`)
        .then(response => {
          const workflowData = response.data;

          // Extract the detailed workflow structure from dsl_file
          // If any required fields are missing, initialize them
          const formattedWorkflow = {
            workflow_id: workflowData.workflow_id,
            workflow_name: workflowData.workflow_name,
            description: workflowData.description,
            created_by: workflowData.created_by,
            nodes: workflowData.dsl_file?.nodes || {},
            connections: workflowData.dsl_file?.connections || [],
            chatlogs: workflowData.dsl_file?.chatlogs || [],
            status: workflowData.status || 'active',
            created_at: workflowData.created_at,
            updated_at: workflowData.updated_at
          };

          // Initialize in store
          initializeWorkflow(workflowData.workflow_id, formattedWorkflow);

          // Set as selected workflow
          selectWorkflow(workflowId);

          // Navigate to canvas
          navigate('/canvas');
        })
        .catch(error => {
          console.error("Error fetching workflow:", error);
        });
    } catch (error) {
      console.error("Error fetching workflow:", error);
    }
  };

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target) &&
        buttonRef.current &&
        !buttonRef.current.contains(event.target)
      ) {
        setIsDropdownOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleTabClick = (tab) => setActiveTab(tab);
  const handleSearchClick = () => setIsSearchMode(true);
  const handleSearchBlur = () => setIsSearchMode(false);
  const handleSearchChange = (e) => setSearchQuery(e.target.value);

  const handleCreateFromBlank = () => {
    navigate('/create-app');
  };

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
    <div className="w-full min-h-full" style={{ background: 'radial-gradient(circle at 20% 20%, #1a1d2b, #0f111a)' }}>

      {/* Navbar */}
      <nav className="w-full px-4 sm:px-6 py-6 flex flex-col sm:flex-row items-start sm:items-center justify-between font-sans gap-4">
        <h1 className="text-7xl sm:text-4xl font-extrabold bg-gradient-to-r from-[#12f4b7] to-[#05a8ed] bg-clip-text text-transparent tracking-wider drop-shadow-md font-ubuntu animate-pulse">
          GenAi <br /> LCNC Platform
        </h1>

        {location.pathname !== '/' && (
          <div className="relative">
            <button
              ref={buttonRef}
              onClick={() => setIsDropdownOpen((prev) => !prev)}
              className="flex items-center gap-2 px-5 py-3 text-sm font-semibold rounded-2xl bg-gradient-to-r from-[#12f4b7] to-[#05a8ed] text-white shadow-xl transition-all duration-300 hover:brightness-110 hover:scale-[1.04]"
            >
              <Plus className="w-5 h-5" />
              Create App
            </button>

            {isDropdownOpen && (
              <div
                ref={dropdownRef}
                className="absolute right-0 mt-3 w-64 rounded-2xl bg-[#10131f] text-white shadow-[0_4px_25px_rgba(5,168,237,0.4)] border border-[#1f2937] animate-slide-down z-50 overflow-hidden"
              >
                <div className="flex flex-col divide-y divide-[#1f2937]">
                  <button
                    onClick={handleCreateFromBlank}
                    className="group flex items-center justify-between px-5 py-4 hover:bg-[#151a28] transition-all duration-200"
                  >
                    <div className="flex items-center gap-3">
                      <Plus className="w-5 h-5 text-[#12f4b7] group-hover:text-white transition" />
                      <span className="text-sm font-medium group-hover:text-white">Create From Blank</span>
                    </div>
                    <ArrowRight size={18} className="text-[#05a8ed] group-hover:text-white transition" />
                  </button>
                  <button className="group flex items-center justify-between px-5 py-4 hover:bg-[#151a28] transition-all duration-200">
                    <div className="flex items-center gap-3">
                      <Plus className="w-5 h-5 text-[#12f4b7] group-hover:text-white transition" />
                      <span className="text-sm font-medium group-hover:text-white">Use a Template</span>
                    </div>
                    <ArrowRight size={18} className="text-[#05a8ed] group-hover:text-white transition" />
                  </button>
                </div>
              </div>
            )}
          </div>
        )}
      </nav>

      {/* Hero Section */}
      <div className="flex flex-col md:flex-row items-center justify-between mb-12 w-full max-w-7xl mx-auto mt-20 md:mt-32 px-4 gap-10">
        <motion.div
          className="w-full md:w-1/2"
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: 'easeOut' }}
        >
          <img
            src={img}
            alt="AI Illustration"
            className="w-full rounded-2xl shadow-[0_0_25px_#05a8ed60] border border-white/10"
          />
        </motion.div>

        <motion.div
          className="w-full md:w-1/2 text-white"
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
      <div className="flex flex-wrap items-center gap-4 w-full max-w-8xl mx-auto px-4 mb-10">
        {isSearchMode ? (
          <input
            type="text"
            placeholder="Search..."
            className="py-3 px-6 rounded-full shadow-md border border-gray-300 focus:outline-none focus:border-blue-500 w-full sm:max-w-sm bg-white/10 text-white placeholder-gray-300"
            autoFocus
            onBlur={handleSearchBlur}
            onChange={handleSearchChange}
            value={searchQuery}
          />
        ) : (
          <div className="flex space-x-4">
            <button
              onClick={() => handleTabClick('All')}
              className={`${activeTab === 'All'
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
      <div className="w-full max-w-8xl mx-auto px-4 pb-20">
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 2xl:grid-cols-5 gap-6">
          {paginatedData.length === 0
            ? Array.from({ length: 10 }).map((_, idx) => (
              <div
                key={idx}
                className="relative bg-[#1f2937]/60 border border-white/10 backdrop-blur-lg p-5 rounded-2xl shadow-lg flex justify-center items-center text-white min-h-[150px]"
              >
                {idx === 2 && (
                  <p className="text-base font-semibold text-gray-400 text-center">
                    No App Found
                  </p>
                )}
              </div>
            ))
            : paginatedData.map((card, index) => (
              <AppCard card={card} index={index} onDelete={handleDeleteApp} GetWorkflow={handleWorkflowClick} />
            ))}
        </div>

        {/* Pagination */}
        {paginatedData.length > 0 && (
          <div className="flex justify-end space-x-4 mt-6">
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
  );
}
