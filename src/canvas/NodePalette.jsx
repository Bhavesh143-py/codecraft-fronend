import React, { useState } from "react";
import  handleStartworkflow  from "../utilities/Startworkflow";
const NodePalette = ({ onAddNode, onAddFile, onAddModelNode, selectedWorkflowId }) => {
    const [openInputs, setOpenInputs] = useState(false);
    const [openOutputs, setOpenOutputs] = useState(false);
    const [openFile, setOpenFile] = useState(false);

    return (
        <aside className="w-64 bg-[#fefefe] rounded-lg shadow-lg p-2 font-ubuntu">
            {/* <h1>{data}</h1> */}
            <div className="text-lg font-semibold text-gray-800 mb-2">Component</div>

            {/* Inputs Section */}
            <div
                className="p-3 font-bold cursor-pointer flex justify-between items-center border-b border-[#d9d9d9] transition-all duration-300 ease-in-out"
                onClick={() => setOpenInputs(!openInputs)}
            >
                <span className="text-[#4c4c4c]"><h5>Inputs</h5></span>
                <span className={`transition-transform ${openInputs ? "rotate-180" : ""}`}>▲</span>
            </div>
            {openInputs && (
                <div className="p-1.5 space-y-2">
                    <button
                        className="w-full p-3 text-sm font-bold font-ubuntu rounded-md cursor-pointer flex justify-between items-center bg-[rgb(249,244,244)] text-[rgb(12,12,12)] hover:bg-[#eae5e5] transition-all"
                        onClick={() => onAddNode("Chat Input")}
                    >
                        Chat Input <span>+</span>
                    </button>
                    <button
                        className="w-full p-3 text-sm font-bold font-ubuntu rounded-md cursor-pointer flex justify-between items-center bg-[rgb(249,244,244)] text-[rgb(12,12,12)] hover:bg-[#eae5e5] transition-all"
                        onClick={() => onAddNode("Text Input")}
                    >
                        Text Input <span>+</span>
                    </button>
                </div>
            )}

            {/* Outputs Section */}
            <div
                className="p-3 font-bold cursor-pointer flex justify-between items-center border-b border-[#d9d9d9] transition-all duration-300 ease-in-out"
                onClick={() => setOpenOutputs(!openOutputs)}
            >
                <span className="text-[#4c4c4c]"><h5>Outputs</h5></span>
                <span className={`transition-transform ${openOutputs ? "rotate-180" : ""}`}>▲</span>
            </div>
            {openOutputs && (
                <div className="p-2.5 space-y-2">
                    <button
                        className="w-full p-3 text-sm font-ubuntu rounded-md cursor-pointer font-bold flex justify-between items-center bg-[rgb(249,244,244)] text-[rgb(12,12,12)] hover:bg-[#eae5e5] transition-all"
                        onClick={() => onAddNode("Chat Output")}
                    >
                        Chat Output <span>+</span>
                    </button>
                    <button
                        className="w-full p-3 text-sm font-bold font-ubuntu rounded-md cursor-pointer flex justify-between items-center bg-[rgb(249,244,244)] text-[rgb(12,12,12)] hover:bg-[#eae5e5] transition-all"
                        onClick={() => onAddNode("Text Output")}
                    >
                        Text Output <span>+</span>
                    </button>
                </div>
            )}

            {/* File Upload Section */}
            <div
                className="p-3 font-bold cursor-pointer flex justify-between items-center border-b border-[#d9d9d9] transition-all duration-300 ease-in-out"
                onClick={() => setOpenFile(!openFile)}
            >
                <span className="text-[#4c4c4c]"><h5>Data</h5></span>
                <span className={`transition-transform ${openFile ? "rotate-180" : ""}`}>▲</span>
            </div>
            {openFile && (
                <div className="p-2.5 space-y-2">
                    <button
                        className="w-full p-3 text-sm font-bold font-ubuntu rounded-md cursor-pointer flex justify-between items-center bg-[rgb(249,244,244)] text-[rgb(12,12,12)] hover:bg-[#eae5e5] transition-all"
                        onClick={() => onAddFile("Upload a file")}
                    >
                        File Upload <span>+</span>
                    </button>

                    <button
                        className="w-full p-3 text-sm font-bold font-ubuntu rounded-md cursor-pointer flex justify-between items-center bg-[rgb(249,244,244)] text-[rgb(12,12,12)] hover:bg-[#eae5e5] transition-all"
                        onClick={() => onAddModelNode("Model Node")}
                    >
                        LLM Node <span>+</span>
                    </button>

                    <button
                     onClick={()=>{handleStartworkflow(selectedWorkflowId)}}
                        className="w-full p-3 text-sm font-bold font-ubuntu rounded-md cursor-pointer flex justify-between items-center bg-[rgb(249,244,244)] text-[rgb(12,12,12)] hover:bg-[#eae5e5] transition-all"
                    >
                        Run
                    </button>
                </div>
            )}
        </aside>
    );
};

export default NodePalette;