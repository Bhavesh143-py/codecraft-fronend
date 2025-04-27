import React, { useState, useEffect } from "react";
import { X } from "lucide-react";
import axios from "axios";

const ChatInputConfig = ({ setIsModalOpen, onSettingsChange, selectedNode, nodeLabel, setSelectedNode }) => {
    console.log(setSelectedNode)
    const [settings, setSettings] = useState({});
    const [fields, setFields] = useState([]);

    
    useEffect(() => {
        const fetchFields = async () => {
            try {
                const response = await axios.get(`${import.meta.env.VITE_API_URL}/asset_configs`, {
                    params: {
                        node_id: setSelectedNode.data.nodeId
                    }
                });
    
                const data = response.data;
                console.log(data);
    
                const parsedFields = data.flat().map(item => {
                    const [label, type] = item.split(" : ");
                    return { label: label.trim(), type: type.trim() };
                });
    
                console.log(parsedFields);
                setFields(parsedFields);
    
            } catch (error) {
                console.error("Failed to fetch node config fields", error);
            }
        };
    
        fetchFields();
    }, [selectedNode]);
    


    useEffect(() => {
        if (fields.length === 0) return;

        const initialSettings = {};
        fields.forEach(({ label }) => {
            initialSettings[label] =
            setSelectedNode?.data?.chatSettings?.[label] ??
            setSelectedNode?.data?.[label] ??
            "";          
            console.log(settings)
        });

        setSettings(initialSettings);
    }, [fields, setSelectedNode]);






    const handleClose = () => {
        setIsModalOpen(false);
    };

    const dataSubmit = () => {
        onSettingsChange(settings);
    };

    const handleInputChange = (e, key) => {
        setSettings(prev => ({ ...prev, [key]: e.target.value }));
        console.log(settings)
    };


    const renderDynamicFields = () => {
        return fields.map(({ label, type }) => {
            switch (type) {
                case "textbox":
                    return (
                        <div key={label} className="flex flex-col space-y-2 group relative">
                            <label className=" text-gray-600">{label}</label>
                            <input
                                type="text"
                                value={settings[label] || ""}
                                onChange={(e) => handleInputChange(e, label)}
                                className="bg-gray-100 border border-gray-300 rounded-lg p-2 text-black focus:ring-2 focus:ring-blue-500"
                                placeholder={`Enter ${label}`}
                            />
                        </div>
                    );
                // Add more cases like checkbox, select, etc., as needed
                default:
                    return null;
            }
        });
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
                    {renderDynamicFields()}
                </div>
                {/* <div
                    onClick={dataSubmit}
                    className="w-full p-2 bg-blue-500 text-center mt-4 rounded-lg text-lg font-semibold text-white cursor-pointer hover:bg-blue-600 transition"
                >
                    Submit
                </div> */}
                {fields.length > 0 && (
    <div
        onClick={dataSubmit}
        className="w-full p-2 bg-blue-500 text-center mt-4 rounded-lg text-lg font-semibold text-white cursor-pointer hover:bg-blue-600 transition"
    >
        Submit
    </div>
)}


            </div>
        </div>
    );
};

export default ChatInputConfig;
