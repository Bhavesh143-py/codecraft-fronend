import React from "react";
import { Handle } from "reactflow";
import { File, Eye, RefreshCw } from "lucide-react";
import del from "../assets/Delete.png";
import img from "../assets/Group 4753.png";

const CustomFile = ({ data }) => {
    // Destructure file-related data with fallbacks
    const {
        label = "Untitled File",
        filepath = "",
        fileText = "",
        fileType = "",
        fileSize = 0,
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

    const handleviewcontent = () => {
        if (fileText)
            return (
                <div className="mt-2 text-xs max-h-20 overflow-y-auto border-t pt-2 text-gray-600">
                    <span className="font-semibold block mb-1">Preview:</span>
                    {fileText.length > 100 ? `${fileText.slice(0, 100)}...` : fileText}
                </div>
            );
    };

    return (
        <div className="w-[314px] bg-white rounded-[12px] border border-[#c0e7fe] shadow-md overflow-hidden text-[10px] ">
            {/* Header */}
            {/* <div className="flex items-center bg-[#f5f1f1] p-3 rounded-t-[16px]">
                <File className="h-[18px] text-[#05a8ed] mr-2" />
                <h5 className="text-[12px] font-semibold flex-1 text-start text-[#0b0b0b]">
                    {truncateFilename(label)}
                </h5>
            </div> */}

            <div className="grid grid-cols-[5fr_1fr_1fr] justify-between items-start p-3 border-b border-[#f0f0f0]">
                <div>
                    <h3 className="text-[14px] font-semibold text-[#0b0b0b]">
                        {truncateFilename(label)}
                    </h3>
                    <p className="text-[10px] text-gray-500">
                        Lorem ipsum dolor, sit amet consectetur adipisicing elit.
                        Doloribus, vero?
                    </p>
                </div>
                <div></div>
                <img src={del} alt="" />
            </div>

            {/* File Information */}
            <div className="p-4 text-left">
                {filepath && (
                    <div className="mb-2 text-xs">
                        <span className="font-semibold">Filename:</span>{" "}
                        {truncateFilename(filepath)}
                    </div>
                )}
                {fileType && (
                    <div className="mb-2 text-xs">
                        <span className="font-semibold">Type:</span> {fileType}
                    </div>
                )}
                {fileSize > 0 && (
                    <div className="mb-2 text-xs">
                        <span className="font-semibold">Size:</span>{" "}
                        {formatFileSize(fileSize)}
                    </div>
                )}
                {fileText && (
                    <div className="mt-2 text-xs max-h-20 overflow-y-auto pt-2 text-gray-600">
                        <span className="font-semibold block mb-1">Preview:</span>
                        {fileText.length > 100
                            ? `${fileText.slice(0, 100)}...`
                            : fileText}
                    </div>
                )}
            </div>

            {/* Connection Handles */}
            <Handle
                type="target"
                position="left"
                id="input"
                className="bg-[#22b1f8] w-[10px] h-[10px] rounded-full shadow-md transition-all duration-300 hover:scale-125"
                style={{
                    bottom: 15,
                    top: "auto",
                    width: 15,
                    height: 15,
                    backgroundImage: `url(${img})`,
                    backgroundSize: "contain",
                    backgroundRepeat: "no-repeat",
                    backgroundPosition: "center",
                    backgroundColor: "transparent",
                    borderRadius: "50%",
                    border: "none",
                    left: "-10px",
                    position: "absolute",
                }}
            />
            <Handle
                type="source"
                position="right"
                id="output"
                className="bg-[#22b1f8] w-[10px] h-[10px] rounded-full shadow-md transition-all duration-300 hover:scale-125"
                style={{
                    bottom: 15,
                    top: "auto",
                    width: 15,
                    height: 15,
                    backgroundImage: `url(${img})`,
                    backgroundSize: "contain",
                    backgroundRepeat: "no-repeat",
                    backgroundPosition: "center",
                    backgroundColor: "transparent",
                    borderRadius: "50%",
                    border: "none",
                    right: "-10px",
                    position: "absolute",
                }}
            />
        </div>
    );
};

export { CustomFile };
