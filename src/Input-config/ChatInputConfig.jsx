import React, { useState } from "react";
import { UploadCloud } from "lucide-react";

const ChatInputConfig = ({ setSelectedNode }) => {
    const [settings, setSettings] = useState({
        text: "",
        storeMessages: false,
        senderType: "User",
        senderName: "User",
        sessionId: "",
        files: null,
        backgroundColor: "",
        icon: "",
        textColor: "",
        showText: false,
        showStoreMessages: false,
        showSenderType: false,
        showSenderName: false,
        showSessionId: false,
        showFiles: false,
        showBackgroundColor: false,
        showIcon: false,
        showTextColor: false,
    });

    const handleClose = () => {
        setSelectedNode(null);
    };

    const handleShowToggle = (field) => {
        setSettings({
            ...settings,
            [`show${field}`]: !settings[`show${field}`],
        });
    };

    return (
        <div className="fixed inset-0 bg-black bg-opacity-70 m-5 z-50 flex justify-center items-center rounded-lg">
            <div className="bg-[#141414] text-white pt-5 rounded-lg w-full m-5 h-full">
                <div className="flex items-center justify-between">
                    <h2 className="text-xl font-semibold flex items-center gap-4">Chat Input</h2>
                    <button className="text-white text-lg" onClick={handleClose}>Close</button>
                </div>
                <p className="text-gray-400 text-sm mt-2">Get chat inputs from the Playground.</p>
                <div className="border border-gray-600 rounded-lg m-5 p-6 space-y-6 overflow-y-auto max-h-[calc(100vh-200px)]">
                    <table className="w-full text-sm border-collapse mx-auto">
                        <thead>
                            <tr className="border-b border-gray-300">
                                <th className="px-4 py-2 text-left">Field Name</th>
                                <th className="px-4 py-2 text-left">Description</th>
                                <th className="px-4 py-2 text-left">Value</th>
                                <th className="px-4 py-2 text-left">Show</th>
                            </tr>
                        </thead>
                        <tbody>
                            {[{
                                name: "Text", desc: "Message to be passed as input.", type: "text", key: "text"
                            }, {
                                name: "Store Messages", desc: "Store the message in history.", type: "toggle", key: "storeMessages"
                            }, {
                                name: "Sender Type", desc: "Type of sender.", type: "dropdown", key: "senderType", options: ["User", "Admin"]
                            }, {
                                name: "Sender Name", desc: "Name of the sender.", type: "text", key: "senderName"
                            }, {
                                name: "Session ID", desc: "The session ID of the chat.", type: "text", key: "sessionId"
                            }, {
                                name: "Files", desc: "Files to be sent with the message.", type: "file", key: "files"
                            }, {
                                name: "Background Color", desc: "Background color of the icon.", type: "text", key: "backgroundColor"
                            }, {
                                name: "Icon", desc: "The icon of the message.", type: "text", key: "icon"
                            }, {
                                name: "Text Color", desc: "The text color of the name.", type: "text", key: "textColor"
                            }].map((field) => (
                                <tr key={field.key} className="border-b border-gray-300">
                                    <td className="px-4 py-3">{field.name}</td>
                                    <td className="px-4 py-3 text-gray-400">{field.desc}</td>
                                    <td className="px-4 py-3">
                                        {field.type === "text" && (
                                            <input
                                                type="text" placeholder="Type something..."
                                                value={settings[field.key]}
                                                onChange={(e) => setSettings({ ...settings, [field.key]: e.target.value })}
                                                className="bg-gray-800 border border-gray-600 text-sm p-2 rounded-md w-full"
                                            />
                                        )}
                                        {field.type === "dropdown" && (
                                            <select
                                                value={settings[field.key]}
                                                onChange={(e) => setSettings({ ...settings, [field.key]: e.target.value })}
                                                className="bg-gray-800 border border-gray-600 text-sm p-2 rounded-md w-full"
                                            >
                                                {field.options.map((option) => (
                                                    <option key={option} value={option}>{option}</option>
                                                ))}
                                            </select>
                                        )}
                                        {field.type === "file" && (
                                            <label className="cursor-pointer flex items-center gap-2 text-blue-400">
                                                <UploadCloud className="w-5 h-5" />
                                                <span>{settings.files ? settings.files.name : "Upload a file..."}</span>
                                                <input
                                                    type="file"
                                                    className="hidden"
                                                    onChange={(e) => setSettings({ ...settings, files: e.target.files[0] })}
                                                />
                                            </label>
                                        )}
                                        {field.type === "toggle" && (
                                            <label className="relative inline-block w-12 h-6">
                                                <input
                                                    type="checkbox"
                                                    checked={settings[field.key]}
                                                    onChange={(e) => setSettings({ ...settings, [field.key]: e.target.checked })}
                                                    className="opacity-0 w-0 h-0 absolute"
                                                />
                                                <span
                                                    className={`block w-full h-full rounded-full cursor-pointer transition-all duration-300 
                          ${settings[field.key] ? "bg-[#12f4b7]" : "bg-gray-600"}`}
                                                >
                                                    <span
                                                        className={`block w-6 h-6 bg-white rounded-full transition-transform duration-300 
                            ${settings[field.key] ? "transform translate-x-6" : "transform translate-x-0"}`}
                                                    ></span>
                                                </span>
                                            </label>
                                        )}
                                    </td>
                                    <td className="px-4 py-3">
                                        <label className="relative inline-block w-12 h-6">
                                            <input
                                                type="checkbox"
                                                checked={settings[`show${field.key.charAt(0).toUpperCase() + field.key.slice(1)}`]}
                                                onChange={() => handleShowToggle(field.key.charAt(0).toUpperCase() + field.key.slice(1))}
                                                className="opacity-0 w-0 h-0 absolute"
                                            />
                                            <span
                                                className={`block w-full h-full rounded-full cursor-pointer transition-all duration-300 
                          ${settings[`show${field.key.charAt(0).toUpperCase() + field.key.slice(1)}`] ? "bg-[#12f4b7]" : "bg-gray-600"}`}
                                            >
                                                <span
                                                    className={`block w-6 h-6 bg-white rounded-full transition-transform duration-300 
                            ${settings[`show${field.key.charAt(0).toUpperCase() + field.key.slice(1)}`] ? "transform translate-x-6" : "transform translate-x-0"}`}
                                                ></span>
                                            </span>
                                        </label>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
};

export default ChatInputConfig;
