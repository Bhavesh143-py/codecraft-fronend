import React, { useState, useEffect } from "react";
import { UploadCloud, X } from "lucide-react";

const ChatInputConfig = ({ setIsModalOpen, onSettingsChange, selectedNode, nodeLabel, setSelectedNode }) => {
    const [settings, setSettings] = useState({});



    useEffect(() => {
        if (nodeLabel === "Chat Input") {
            setSettings({
                text: setSelectedNode?.data?.chatSettings?.text || "",
                storeMessages: setSelectedNode?.data?.chatSettings?.storeMessages || false,
                senderName: setSelectedNode?.data?.chatSettings?.senderName || "User",
                sessionId: setSelectedNode?.data?.chatSettings?.sessionId || "",
                files: setSelectedNode?.data?.chatSettings?.files || null,
                showText: setSelectedNode?.data?.chatSettings?.showText ?? true,
                showSessionId: setSelectedNode?.data?.chatSettings?.showSessionId ?? false,
                showStoreMessages: setSelectedNode?.data?.chatSettings?.showStoreMessages ?? false,
                showUploadFile: setSelectedNode?.data?.chatSettings?.showUploadFile ?? false,
            });
        } else if (nodeLabel === "Text Input") {
            setSettings({
                text: setSelectedNode?.data?.chatSettings?.text || "",
                showText: setSelectedNode?.data?.chatSettings?.showText ?? true,
            });
        }
    }, [setSelectedNode, nodeLabel]);

    // useEffect(() => {
    //     onSettingsChange(settings);
    // }, [settings, onSettingsChange]);

    const dataSubmit=()=>{
        onSettingsChange(settings);
    }

    const handleClose = () => {
        setIsModalOpen(false)
        setSelectedNode(null);
    };

    const handleInputChange = (e, key) => {
        console.log(key)
        setSettings((prev) => ({ ...prev, [key]: e.target.value }));
    };

    const handleToggleChange = (key) => {
        setSettings((prev) => ({ ...prev, [key]: !prev[key] }));
    };

    const handleFileChange = (e) => {
        setSettings((prev) => ({ ...prev, files: e.target.files[0] }));
    };

    const handleAFileChange = async (e) => {
        const file = e.target.files[0];
        if (!file) return;

        setSettings((prev) => ({ ...prev, files: file }))
    };

    const handleCheckboxChange = (key) => {
        setSettings((prev) => ({ ...prev, [key]: !prev[key] }));
    };

    const renderFields = () => {
        if (nodeLabel === "Chat Input") {
            return (
                <>
                    <div className="flex flex-col space-y-3 group relative">
                        <label className="text-sm text-gray-600 flex items-center gap-2">
                            <input
                                type="checkbox"
                                name="text"
                                className="mr-2 w-4 h-4"
                                checked={settings.showText}
                                onChange={() => handleCheckboxChange("showText")}
                            />
                            Text
                        </label>
                        <input
                            type="text"
                            value={settings.text}
                            onChange={(e) => handleInputChange(e, "text")}
                            className="bg-gray-100 border border-gray-300 rounded-lg p-3 text-black focus:ring-2 focus:ring-blue-500"
                            placeholder="Enter Text"
                        />
                        <div className="text-xs text-gray-500">Message to be passed as input.</div>
                    </div>

                    <div className="flex flex-col space-y-3 group relative">
                        <label className="text-sm text-gray-600 flex items-center gap-2">
                            <input
                                type="checkbox"
                                name="sessionId"
                                className="mr-2 w-4 h-4"
                                checked={settings.showSessionId}
                                onChange={() => handleCheckboxChange("showSessionId")}
                            />
                            Session ID
                        </label>
                        <input
                            type="text"
                            value={settings.sessionId}
                            onChange={(e) => handleInputChange(e, "sessionId")}
                            className="bg-gray-100 border border-gray-300 rounded-lg p-3 text-black focus:ring-2 focus:ring-blue-500"
                            placeholder="Enter Session ID"
                        />
                        <div className="text-xs text-gray-500">The session ID of the chat.</div>
                    </div>

                    <div className="flex items-center justify-between group relative">
                        <label className="flex items-center gap-2 text-sm text-gray-600">
                            <input
                                type="checkbox"
                                name="showStoreMessages"
                                checked={settings.showStoreMessages}
                                onChange={() => handleCheckboxChange("showStoreMessages")}
                                className="mr-2 w-4 h-4"
                            />
                            Store Messages
                        </label>
                        <label className="relative inline-block w-12 h-6">
                            <input
                                type="checkbox"
                                checked={settings.storeMessages}
                                onChange={() => handleToggleChange("storeMessages")}
                                className="hidden"
                            />
                            <span className={`block w-full h-full rounded-full cursor-pointer transition-all duration-300 ${settings.storeMessages ? "bg-green-500" : "bg-gray-300"}`}>
                                <span className={`block w-6 h-6 bg-white rounded-full shadow transform transition-transform duration-300 ${settings.storeMessages ? "translate-x-6" : "translate-x-0"}`}></span>
                            </span>
                        </label>
                        <div className="text-xs text-gray-500">Store the message in the history.</div>
                    </div>

                    <div className="flex flex-col space-y-3 group relative">
                        <label className="text-sm text-gray-600 flex items-center gap-2">
                            <input
                                type="checkbox"
                                name="uploadFile"
                                className="mr-2 w-4 h-4"
                                checked={settings.showUploadFile}
                                onChange={() => handleCheckboxChange("showUploadFile")}
                            />
                            Upload File
                        </label>
                        <label className="cursor-pointer flex items-center gap-2 text-blue-500 hover:text-blue-600">
                            <UploadCloud className="w-5 h-5" />
                            <span>{settings.files ? settings.files.name : "Upload a file..."}</span>
                            <input type="file" className="hidden" onChange={handleFileChange} />
                        </label>
                        <div className="text-xs text-gray-500">Files to be sent with the message.</div>
                    </div>
                </>
            );
        }
        
        else if (nodeLabel === "Text Input") {
            return (
                <div className="flex flex-col space-y-3 group relative">
                    <label className="text-sm text-gray-600 flex items-center gap-2">
                        <input
                            type="checkbox"
                            name="text"
                            className="mr-2 w-4 h-4"
                            checked={settings.showText}
                            onChange={() => handleCheckboxChange("showText")}
                        />
                        Text
                    </label>
                    <input
                        type="text"
                        value={settings.text}
                        onChange={(e) => handleInputChange(e, "text")}
                        className="bg-gray-100 border border-gray-300 rounded-lg p-3 text-black focus:ring-2 focus:ring-blue-500"
                        placeholder="Enter Text"
                    />
                    <div className="text-xs text-gray-500">Message to be passed as input.</div>
                </div>
            );
        } else if (nodeLabel === "Upload a file") {
            return (
                <div className="flex flex-col space-y-3 group relative">
                    <label className="text-sm text-gray-600 flex items-center gap-2">
                        <input
                            type="checkbox"
                            name="uploadFile"
                            className="mr-2 w-4 h-4"
                            checked={settings.showAUploadFile}
                            onChange={() => handleCheckboxChange("showAUploadFile")}
                        />
                        Upload File
                    </label>
                    <label className="cursor-pointer flex items-center gap-2 text-blue-500 hover:text-blue-600">
                        <UploadCloud className="w-5 h-5" />
                        <span>{settings.uploadFiles ? settings.uploadFiles.name : "Upload a file..."}</span>
                        <input type="file" className="hidden" onChange={handleAFileChange} />
                    </label>
                    <div className="text-xs text-gray-500">Files to be sent with the message.</div>
                </div>
            );
        }
    };

    return (
<div className="fixed inset-0 flex bg-black bg-opacity-50 z-50">
    <div className="bg-white text-black rounded-lg border border-blue-200 w-full max-w-lg max-h-[90vh] p-6 shadow-lg overflow-y-auto">
        <div className="flex items-center justify-between pb-4 mb-4 border-b border-gray-200">
            <h2 className="text-lg font-semibold">{nodeLabel} Configuration</h2>
            <button onClick={handleClose} className="text-gray-400 hover:text-black mt-5">
                <X size={20} />
            </button>
        </div>
        <div className="space-y-6 overflow-y-auto">
            {renderFields()}
        </div>
        {nodeLabel !== "Start Node" && nodeLabel!== "Text Output" && nodeLabel!== "Chat Output"  && (
            <div
                onClick={dataSubmit}
                className="w-full p-2 bg-blue-500 text-center mt-2 rounded-lg text-lg font-semibold"
            >
                Submit
            </div>
        )}
    </div>
</div>

    );
};

export default ChatInputConfig;
