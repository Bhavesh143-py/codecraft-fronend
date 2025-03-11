import React from "react";
import { Handle } from "reactflow";
import { File, Eye, RefreshCw } from "lucide-react";

const CustomFile = ({ data }) => {
    // Destructure file-related data with fallbacks
    const {
        label = "Untitled File",
        filepath = "",
        fileText = "",
        fileType = "",
        fileSize = 0
    } = data || {};

    // Helper function to format file size
    const formatFileSize = (bytes) => {
        if (bytes === 0) return "0 Bytes";
        const k = 1024;
        const sizes = ["Bytes", "KB", "MB", "GB", "TB"];
        const i = Math.floor(Math.log(bytes) / Math.log(k));
        return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + " " + sizes[i];
    };

    // Truncate long filenames
    const truncateFilename = (filename, maxLength = 20) => {
        if (!filename) return "";
        return filename.length > maxLength
            ? `${filename.slice(0, maxLength)}...`
            : filename;
    };
    const handleviewcontent =()=>{
        if(fileText) return(
            <div className="mt-2 text-xs max-h-20 overflow-y-auto border-t pt-2 text-gray-600">
                <span className="font-semibold block mb-1">Preview:</span>
                {fileText.length > 100
                    ? `${fileText.slice(0, 100)}...`
                    : fileText
                }
            </div>
        )
    }
    return (
        <div className="w-[250px] bg-white text-[#0b0b0b] rounded-[16px] border border-[#c0e7fe] text-center shadow-lg 
                    transition-all duration-300">
            {/* Header */}
            <div className="flex items-center bg-[#f5f1f1] p-3 rounded-t-[16px]">
                <File className="h-[18px] text-[#05a8ed] mr-2" />
                <h5 className="text-[12px] font-semibold flex-1 text-start text-[#0b0b0b]">
                    {truncateFilename(label)}
                </h5>
            </div>

            {/* File Information */}
            <div className="p-4 text-left">
                {filepath && (
                    <div className="mb-2 text-xs">
                        <span className="font-semibold">Filename:</span> {truncateFilename(filepath)}
                    </div>
                )}
                {fileType && (
                    <div className="mb-2 text-xs">
                        <span className="font-semibold">Type:</span> {fileType}
                    </div>
                )}
                {fileSize > 0 && (
                    <div className="mb-2 text-xs">
                        <span className="font-semibold">Size:</span> {formatFileSize(fileSize)}
                    </div>
                )}
                {fileText && (
                    <div className="mt-2 text-xs max-h-20 overflow-y-auto border-t pt-2 text-gray-600">
                        <span className="font-semibold block mb-1">Preview:</span>
                        {fileText.length > 100
                            ? `${fileText.slice(0, 100)}...`
                            : fileText
                        }
                    </div>
                )}
            </div>

            {/* Footer */}
            <div className="flex justify-between items-center bg-[#f5f1f1] text-[12px] p-3 rounded-b-[16px] border-t border-[#eae5e5]">
                <Eye className="cursor-pointer text-[#22b1f8] w-[16px] hover:text-[#05a8ed] transition-all duration-300" />
                <button onClick={handleviewcontent} className="bg-none border-none text-[#22b1f8] cursor-pointer font-medium hover:text-[#05a8ed] transition-all duration-300" >
                    View Content
                </button>
                <RefreshCw className="cursor-pointer text-[#22b1f8] w-[16px] hover:text-[#05a8ed] transition-all duration-300" />
            </div>

            {/* Connection Handles */}
            <Handle
                type="target"
                position="left"
                id="input"
                className="bg-[#22b1f8] w-[10px] h-[10px] rounded-full shadow-md transition-all duration-300 hover:scale-125"
                style={{ position: "absolute", left: "-6px", top: "50%", transform: "translateY(-50%)", zIndex: 10 }}
            />
            <Handle
                type="source"
                position="right"
                id="output"
                className="bg-[#22b1f8] w-[10px] h-[10px] rounded-full shadow-md transition-all duration-300 hover:scale-125"
                style={{ position: "absolute", right: "-6px", top: "50%", transform: "translateY(-50%)", zIndex: 10 }}
            />
        </div>
    );
};

export { CustomFile };