import React, { useState } from "react";
import { Handle } from "reactflow";
import { Eye, RefreshCw, MessageSquare } from "lucide-react";

const CustomNode = ({ data }) => {
    const [inputValue, setInputValue] = useState(""); // Manage input value

    const handleInputChange = (event) => {
        setInputValue(event.target.value); // Update state when input changes
    };

    const handleInputBlur = () => {
        console.log(inputValue); // Log value when input loses focus
    };

    const isStartNode = data.label === "Start Node"; // Check if it's a Start Node

    return (
        <div className="w-[160px] bg-white text-[#0b0b0b] rounded-[12px] border border-[#c0e7fe] overflow-hidden text-center shadow-lg">
            {/* Header */}
            <div className="flex bg-[#f5f1f1] p-[4px] rounded-t-[12px]">
                <MessageSquare className="bg-[#f2f9fa] p-[4px] rounded-[4px] h-[18px]" />
                <h5 className="text-[10px] font-ubuntu flex-1 text-start ml-2">{data.label}</h5>
                <div></div> {/* Empty div for spacing */}
            </div>

            {/* Conditionally Render Content */}
            {!isStartNode && (
                <div className="mt-[4px] px-[8px]">
                    <div className="border-b p-1 border-[#eae5e5]">
                        <p className="text-[8px] text-[#0b0b0b]">Get chat inputs from the Playground.</p>
                    </div>

                    {/* Conditionally Render Input */}
                    <div className="mt-[10px]">
                        <label htmlFor={data.label} className="block text-[10px] text-[#0b0b0b] mb-[4px] text-left">
                            Text
                        </label>
                        <input
                            id= {data.label}
                            type="text"
                            onChange={handleInputChange} // Handle changes in input
                            onBlur={handleInputBlur} // Console the value when input loses focus
                            placeholder="Type something..."
                            className="flex-grow rounded-[6px] border border-[#e4eaed] p-[4px] text-[10px] placeholder-[#aaa] focus:outline-none focus:border-[#22b1f8]"
                        />
                    </div>
                </div>
            )}

            {/* Footer with More Icons */}
            {!isStartNode && (
                <div className="flex justify-between items-center bg-[#f5f1f1] text-[10px] rounded-b-[12px] mt-[10px] border-t border-[#eae5e5]">
                    <Eye className="cursor-pointer text-[#22b1f8] m-1 w-[12px]" />
                    <button className="bg-none border-none text-[#22b1f8] cursor-pointer">Message</button>
                    <RefreshCw className="cursor-pointer text-[#22b1f8] m-1 w-[12px]" />
                </div>
            )}

            {/* Conditional Connection Points */}
            {!isStartNode && (
                <>
                    <Handle type="target" position="left" className="bg-[#22b1f8] w-[5px] h-[8px]" />
                </>
            )}
            <Handle type="source" position="right" className="bg-[#22b1f8] w-[8px] h-[8px]" />
        </div>
    );
};

export default CustomNode;
