import React, { useState, useEffect } from "react";
import { Handle } from "reactflow";
import { Eye, RefreshCw, MessageSquare } from "lucide-react";

const CustomNode = ({ data }) => {
  const { label, chatSettings = {}, onUpdate } = data || {};

  // State initialization with chatSettings fallback values
  const [inputValue, setInputValue] = useState(chatSettings.text || "");
  const [sessionId, setSessionId] = useState(chatSettings.sessionId || "");
  const [isToggled, setIsToggled] = useState(chatSettings.storeMessages || false);
  const [showText, setShowText] = useState(chatSettings.showText ?? true);
  const [uploadedFile, setUploadedFile] = useState(chatSettings.files || null);

  // Sync state with chatSettings changes
  useEffect(() => {
    setInputValue(chatSettings.text || "");
    setSessionId(chatSettings.sessionId || "");
    setIsToggled(chatSettings.storeMessages || false);
    setShowText(chatSettings.showText ?? true);
    setUploadedFile(chatSettings.files || null);
  }, [chatSettings]);

  // Function to update chatSettings and reflect in parent component
  const updateNodeData = (updatedSettings) => {
    if (onUpdate) {
      onUpdate({
        ...chatSettings, // Keep existing values
        ...updatedSettings, // Update changed values
      });
    }
  };







  // Input handlers
  const handleInputChange = (event) => {
    const newValue = event.target.value;
    chatSettings.text = event.target.value;
    setInputValue(newValue);
    updateNodeData({ text: newValue });
  };

  const handleSessionId = (event) => {
    const newSessionId = event.target.value;
    chatSettings.sessionId = event.target.value;
    setSessionId(newSessionId);
    updateNodeData({ sessionId: newSessionId });
  };

  const handleFileChange = (event) => {
    const file = event.target.files[0];
    chatSettings.files=event.target.files[0]
    setUploadedFile(file);
    updateNodeData({ files: file });
  };

  const handleStoreToggle = () => {
    const newToggleState = !isToggled;
    chatSettings.storeMessages = newToggleState;
    setIsToggled(newToggleState);
    updateNodeData({ storeMessages: newToggleState });
  };

  const isStartNode = label === "Start Node";

  return (
    <div className="w-[180px] bg-white text-[#0b0b0b] rounded-[12px] border border-[#c0e7fe] overflow-hidden text-center shadow-lg">
      {/* Header */}
      <div className="flex bg-[#f5f1f1] p-[4px] rounded-t-[12px]">
        <MessageSquare className="bg-[#f2f9fa] p-[4px] rounded-[4px] h-[18px]" />
        <h5 className="text-[10px] font-ubuntu flex-1 text-start ml-2 mt-0.5">{label}</h5>
      </div>

      {/* Node Content */}
      {!isStartNode && (
        <div className="p-2">
          {/* Text Input */}
          {showText && (
            <div>
              <label htmlFor="chat-input-text" className="block text-xs text-[#0b0b0b] mb-[6px] text-left">
                Text
              </label>
              <input
                id="chat-input-text"
                type="text"
                value={inputValue}
                onChange={handleInputChange}
                placeholder="Type something..."
                className="w-full rounded-md border border-[#e4eaed] p-2 text-[8px] h-6 placeholder-[#aaa] focus:outline-none focus:border-[#22b1f8]"
              />
            </div>
          )}

          {/* Store Message Toggle */}
          {chatSettings.showStoreMessages && (
            <div className="mt-2 flex justify-between items-center">
              <label htmlFor="store-message" className="text-xs text-[#0b0b0b]">Store Message</label>
              <label className="relative inline-block w-6 h-3">
                <input type="checkbox" checked={isToggled} onChange={handleStoreToggle} className="opacity-0 w-0 h-0 absolute" />
                <span className={`block w-full h-full rounded-full cursor-pointer transition-all duration-300 ${isToggled ? "bg-[#12f4b7]" : "bg-gray-600"}`}>
                  <span className={`block w-3 h-3 bg-white rounded-full transition-transform duration-300 ${isToggled ? "transform translate-x-3" : "transform translate-x-0"}`}></span>
                </span>
              </label>
            </div>
          )}

          {/* File Upload */}
          {chatSettings.showUploadFile && (
            <div className="mt-3">
              <label htmlFor="file-upload" className="block text-xs text-[#0b0b0b] mb-[6px] text-left">
                Upload File
              </label>
              <input
                id="file-upload"
                type="file"
                onChange={handleFileChange}
                className="w-full rounded-md border border-[#e4eaed] p-2 text-xs placeholder-[#aaa] focus:outline-none focus:border-[#22b1f8]"
              />
              {uploadedFile && <p className="mt-2 text-xs text-[#0b0b0b]">Uploaded File: {uploadedFile.name}</p>}
            </div>
          )}

          {/* Session ID */}
          {chatSettings.showSessionId && (
            <div className="mt-3">
              <label htmlFor="chat-input-session" className="block text-xs text-[#0b0b0b] mb-[6px] text-left">
                Session Id
              </label>
              <input
                id="chat-input-session"
                type="text"
                value={sessionId}
                onChange={handleSessionId}
                placeholder="Enter session ID..."
                className="w-full rounded-md border border-[#e4eaed] p-2 text-xs placeholder-[#aaa] focus:outline-none focus:border-[#22b1f8]"
              />
            </div>
          )}
        </div>
      )}

      {/* Footer with Icons */}
      {!isStartNode && (
        <div className="flex justify-between items-center bg-[#f5f1f1] text-xs rounded-b-[12px] mt-2 border-t border-[#eae5e5] p-2 h-8">
          <Eye className="cursor-pointer text-[#22b1f8] m-1 w-[16px]" />
          <button className="bg-none border-none text-[#22b1f8] cursor-pointer">Message</button>
          <RefreshCw className="cursor-pointer text-[#22b1f8] m-1 w-[16px]" />
        </div>
      )}

      {/* Connection Points */}
      {!isStartNode && <Handle type="target" position="left" className="bg-[#22b1f8] w-[6px] h-[10px]" />}
      <Handle type="source" position="right" className="bg-[#22b1f8] w-[8px] h-[8px]" />
    </div>
  );
};

export default CustomNode;
