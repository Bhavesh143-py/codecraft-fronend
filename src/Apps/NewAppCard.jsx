import React from 'react';
import { useNavigate } from 'react-router-dom';


export default function NewAppCard() {
    const navigate = useNavigate();

    const handleCreateFromBlank = () => {

        navigate('/create-app');
    };

    return (
        <div className="card w-full max-w-sm sm:max-w-full p-6 bg-gradient-to-b from-white to-gray-50 rounded-xl shadow-lg border border-gray-200 hover:shadow-2xl transform hover:scale-105 transition-all duration-300 mt-6 ml-4">
            {/* Card Header */}
            <div className="text-2xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-green-400 to-blue-500 text-center mb-6 animate-pulse" aria-label="Create a New App">
                Create a New App
            </div>

            {/* Create Section Border */}
            <div className="border-t border-gray-300 mt-6 pt-4">
                {/* New Heading for "Create From" */}
                <div className="text-lg font-semibold text-gray-700 text-center mb-4">
                    Choose a Creation Option
                </div>

                {/* Buttons for Blank and Template */}
                <div className="flex flex-col sm:flex-row justify-center gap-4 sm:gap-6">
                    {/* Button: Create from Blank */}
                    <button
                        onClick={handleCreateFromBlank}
                        aria-label="Create a new app from blank template"
                        className="flex items-center px-4 py-2 w-full sm:w-auto rounded-lg text-xs font-semibold text-white bg-gradient-to-r from-teal-400 to-green-500 hover:from-green-500 hover:to-teal-400 shadow-md hover:shadow-lg transform hover:scale-105 transition-all duration-300 active:scale-95 focus:outline-none focus:ring-4 focus:ring-teal-300"
                    >
                        <svg
                            className="shrink-0 mr-2 w-4 h-4"
                            viewBox="0 0 16 16"
                            fill="none"
                            xmlns="http://www.w3.org/2000/svg"
                        >
                            <path
                                d="M13.3332 6.99967V4.53301C13.3332 3.4129 13.3332 2.85285 13.1152 2.42503C12.9234 2.0487 12.6175 1.74274 12.2412 1.55099C11.8133 1.33301 11.2533 1.33301 10.1332 1.33301H5.8665C4.7464 1.33301 4.18635 1.33301 3.75852 1.55099C3.3822 1.74274 3.07624 2.0487 2.88449 2.42503C2.6665 2.85285 2.6665 3.4129 2.6665 4.53301V11.4663C2.6665 12.5864 2.6665 13.1465 2.88449 13.5743C3.07624 13.9506 3.3822 14.2566 3.75852 14.4484C4.18635 14.6663 4.7464 14.6663 5.8665 14.6663H7.99984M11.9998 13.9997V9.99967M9.99984 11.9997H13.9998"
                                stroke="currentColor"
                                strokeWidth="1.5"
                                strokeLinecap="round"
                                strokeLinejoin="round"
                            />
                        </svg>
                        Blank
                    </button>

                    {/* Button: Create from Template */}
                    <button
                        aria-label="Create a new app from a template"
                        className="flex items-center px-4 py-2 w-full sm:w-auto rounded-lg text-xs font-semibold text-white bg-gradient-to-r from-blue-400 to-indigo-500 hover:from-indigo-500 hover:to-blue-400 shadow-md hover:shadow-lg transform hover:scale-105 transition-all duration-300 active:scale-95 focus:outline-none focus:ring-4 focus:ring-indigo-300"
                    >
                        <svg
                            className="shrink-0 mr-2 w-4 h-4"
                            viewBox="0 0 16 16"
                            fill="none"
                            xmlns="http://www.w3.org/2000/svg"
                        >
                            <path
                                d="M13.3333 6.99992V4.53325C13.3333 3.41315 13.3333 2.85309 13.1153 2.42527C12.9236 2.04895 12.6176 1.74299 12.2413 1.55124C11.8135 1.33325 11.2534 1.33325 10.1333 1.33325H5.86666C4.74655 1.33325 4.1865 1.33325 3.75868 1.55124C3.38235 1.74299 3.07639 2.04895 2.88464 2.42527C2.66666 2.85309 2.66666 3.41315 2.66666 4.53325V11.4666C2.66666 12.5867 2.66666 13.1467 2.88464 13.5746C3.07639 13.9509 3.38235 14.2569 3.75868 14.4486C4.1865 14.6666 4.74655 14.6666 5.86666 14.6666H7.99999M9.33332 7.33325H5.33332M6.66666 9.99992H5.33332M10.6667 4.66659H5.33332M12 13.9999V9.99992M9.99999 11.9999H14"
                                stroke="currentColor"
                                strokeWidth="1.5"
                                strokeLinecap="round"
                                strokeLinejoin="round"
                            />
                        </svg>
                        Template
                    </button>
                </div>
            </div>
        </div>
    );
}
