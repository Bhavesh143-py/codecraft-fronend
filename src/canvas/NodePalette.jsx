import React, { useState } from "react";
import { useInputNodeStore } from "../store/Mystore";

const NodePalette = ({ onAddNode, onAddFile, onAddModelNode }) => {
    const [openInputs, setOpenInputs] = useState(true);
    const [openOutputs, setOpenOutputs] = useState(true);
    const [openFile, setOpenFile] = useState(true);
    const [isSidebarOpen, setIsSidebarOpen] = useState(true);

    const { inputNodeText } = useInputNodeStore();
    const Runsimulation = () => {
        console.log(inputNodeText);
    };

    return (
        <aside
            className={`overflow-y-auto bg-white text-gray-900 p-4 border-r border-gray-300 transition-all duration-300 ${isSidebarOpen ? "w-64" : "w-12"
                }`}
        >
            <button
                className="bg-gray-700 text-white p-2 rounded mb-2 w-full"
                onClick={() => setIsSidebarOpen(!isSidebarOpen)}
            >
                {isSidebarOpen ? "<<" : ">>"}
            </button>

            {isSidebarOpen && (
                <>
                    {/* Inputs Section */}
                    <div
                        className="p-3 font-bold cursor-pointer flex justify-between border-b border-gray-300"
                        onClick={() => setOpenInputs(!openInputs)}
                    >
                        Inputs <span>{openInputs ? "▲" : "▼"}</span>
                    </div>
                    {openInputs && (
                        <div className="p-3 w-full">
                            <button className="w-full p-2 bg-gray-200 text-black rounded mb-2 flex justify-between" onClick={() => onAddNode("Chat Input")}>
                                Chat Input <span>+</span>
                            </button>
                            <button className="w-full p-2 bg-gray-200 text-black rounded mb-2 flex justify-between" onClick={() => onAddNode("Text Input")}>
                                Text Input <span>+</span>
                            </button>
                        </div>
                    )}

                    {/* Outputs Section */}
                    <div
                        className="p-3 font-bold cursor-pointer flex justify-between border-b border-gray-300"
                        onClick={() => setOpenOutputs(!openOutputs)}
                    >
                        Outputs <span>{openOutputs ? "▲" : "▼"}</span>
                    </div>
                    {openOutputs && (
                        <div className="p-3 w-full">
                            <button className="w-full p-2 bg-gray-200 text-black rounded mb-2 flex justify-between" onClick={() => onAddNode("Chat Output")}>
                                Chat Output <span>+</span>
                            </button>
                            <button className="w-full p-2 bg-gray-200 text-black rounded mb-2 flex justify-between" onClick={() => onAddNode("Text Output")}>
                                Text Output <span>+</span>
                            </button>
                        </div>
                    )}

                    {/* File Upload Section */}
                    <div
                        className="p-3 font-bold cursor-pointer flex justify-between border-b border-gray-300"
                        onClick={() => setOpenFile(!openFile)}
                    >
                        Data <span>{openFile ? "▲" : "▼"}</span>
                    </div>
                    {openFile && (
                        <div className="p-3 w-full">
                            <button className="w-full p-2 bg-gray-200 text-black rounded mb-2 flex justify-between" onClick={() => onAddFile("Upload a file")}>
                                File Upload <span>+</span>
                            </button>
                        </div>
                    )}

                    <button className="w-full p-2 bg-blue-500 text-white rounded mb-2 flex justify-between" onClick={() => onAddModelNode("Model Node")}>
                        LLM Node <span>+</span>
                    </button>

                    <button className="w-full p-2 bg-green-500 text-white rounded" onClick={Runsimulation}>Run</button>
                </>
            )}
        </aside>
    );
};

export default NodePalette;
