import React, { useState } from 'react';
import NewAppCard from './NewAppCard';
import Navbar from '../navbar/navbar';
import AppsList from './Appcard';
export default function Apps() {
    const [activeTab, setActiveTab] = useState('All');
    const [isSearchMode, setIsSearchMode] = useState(false);

    const handleTabClick = (tab) => {
        setActiveTab(tab);
    };

    const handleSearchClick = () => {
        setIsSearchMode(true);
    };

    const handleSearchBlur = () => {
        setIsSearchMode(false);
    };

    return (
        <>
            <Navbar />
            <div className="bg-gradient-to-t from-blue-100 to-green-100 min-h-screen pt-20">
                <div className="text-center px-8 pt-12 mb-12">
                    <h1 className="text-4xl font-extrabold text-gray-800 leading-tight mb-4">
                        Empowering <br />
                        <span className="text-[#05a8ed] mt-4">Innovation Through AI</span>
                    </h1>
                    <p className="text-xl text-gray-700 max-w-3xl mx-auto leading-relaxed">
                        Leveraging the power of artificial intelligence to drive creative solutions, enhance productivity, and shape the future of technology.
                    </p>
                </div>

                <div className="flex flex-wrap justify-start space-x-4 px-12">
                    {isSearchMode ? (
                        <input
                            type="text"
                            placeholder="Search..."
                            className="py-2 px-6 rounded-full shadow-md border-2 border-gray-300 focus:outline-none focus:border-blue-500 w-full max-w-sm"
                            autoFocus
                            onBlur={handleSearchBlur}
                        />
                    ) : (
                        <>
                            {['All', 'Tab1', 'Tab2'].map((tab) => (
                                <button
                                    key={tab}
                                    onClick={() => handleTabClick(tab)}
                                    className={`${activeTab === tab
                                            ? 'bg-gradient-to-r from-blue-500 to-indigo-600 text-white font-semibold shadow-lg'
                                            : 'bg-white text-gray-800 border-2 border-gray-300 hover:border-blue-500'
                                        } py-2 px-6 rounded-full shadow-md hover:scale-110 hover:bg-blue-600 hover:shadow-2xl transition-all duration-300 ease-in-out transform`}
                                >
                                    {tab}
                                </button>
                            ))}

                            <button
                                onClick={handleSearchClick}
                                className="bg-white text-gray-800 border-2 border-gray-300 hover:border-blue-500 py-2 px-6 rounded-full shadow-md hover:scale-110 hover:bg-blue-600 hover:shadow-2xl transition-all duration-300 ease-in-out transform mt-4 sm:mt-0 sm:ml-4"
                            >
                                Search
                            </button>
                        </>
                    )}
                </div>

                <div className="grid content-start grid-cols-1 sm:grid-cols-1 md:grid-cols-2 xl:grid-cols-4 2xl:grid-cols-5 2k:grid-cols-6 gap-4 px-12 pt-6">
                    {activeTab === 'All' && <NewAppCard />}
                    <AppsList />  
                </div>
            </div>
        </>
    );
}
