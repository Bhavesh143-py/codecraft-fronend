import React, { useState, useEffect } from "react";
import { useModelConfigStore } from "../store/Mystore";

const ModelNodeForm = ({ selectedNode, setSelectedNode, onUpdate }) => {
    const { setModelConfig } = useModelConfigStore();
    const defaultConfig = {
        modelName: "ChatGPT",
        temperature: 0.5,
        input: "",
        system_message: "",
        maximum_tokens: 4096,
        API_key: ""
    };
    const [config, setConfig] = useState(defaultConfig);

    useEffect(() => {
        if (selectedNode?.config) {
            setConfig({ ...defaultConfig, ...selectedNode.config });  // Merge defaults with existing config
        }
    }, [selectedNode]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setConfig({
            ...config,
            [name]: name === "temperature" || name === "maximum_tokens" ? parseFloat(value) : value,
        });
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        setModelConfig(config);
        onUpdate(config);
        setSelectedNode(null);
        console.log("Configuration Submitted:", config);
    };

    return (
        <div className="max-w-md mx-auto mt-6 p-6 bg-white text-slate-900 shadow-lg rounded-lg border border-slate-300">
            <h2 className="text-xl font-semibold mb-4 text-slate-800">LLM Configuration</h2>
            <form onSubmit={handleSubmit} className="space-y-4">
                {/* Model Name */}
                <div>
                    <label className="block text-slate-700">Model Name</label>
                    <select
                        name="modelName"
                        value={config.modelName}
                        onChange={handleChange}
                        className="w-full p-2 border border-slate-400 bg-white rounded-md text-slate-900 focus:ring-2 focus:ring-blue-500 outline-none"
                    >
                        <option value="ChatGPT">ChatGPT</option>
                        <option value="Claude">Claude</option>
                        <option value="Mistral">Mistral</option>
                    </select>
                </div>

                {/* Temperature */}
                <div>
                    <label className="block text-slate-700">Temperature</label>
                    <input
                        type="number"
                        name="temperature"
                        step="0.1"
                        value={config.temperature}
                        onChange={handleChange}
                        className="w-full p-2 border border-slate-400 bg-slate-100 rounded-md text-slate-900 focus:ring-2 focus:ring-blue-500 outline-none"
                    />
                </div>

                {/* Input */}
                <div>
                    <label className="block text-slate-700">Input</label>
                    <input
                        type="text"
                        name="input"
                        placeholder="Type something..."
                        value={config.input}
                        onChange={handleChange}
                        className="w-full p-2 border border-slate-400 bg-slate-100 rounded-md text-slate-900 focus:ring-2 focus:ring-blue-500 outline-none"
                    />
                </div>

                {/* System Message */}
                <div>
                    <label className="block text-slate-700">System Message</label>
                    <input
                        type="text"
                        name="system_message"
                        placeholder="Type some system command..."
                        value={config.system_message}
                        onChange={handleChange}
                        className="w-full p-2 border border-slate-400 bg-slate-100 rounded-md text-slate-900 focus:ring-2 focus:ring-blue-500 outline-none"
                    />
                </div>

                {/* Maximum Tokens */}
                <div>
                    <label className="block text-slate-700">Maximum Tokens</label>
                    <input
                        type="number"
                        name="maximum_tokens"
                        value={config.maximum_tokens}
                        onChange={handleChange}
                        className="w-full p-2 border border-slate-400 bg-slate-100 rounded-md text-slate-900 focus:ring-2 focus:ring-blue-500 outline-none"
                    />
                </div>

                {/* API Key */}
                <div>
                    <label className="block text-slate-700">API Key</label>
                    <input
                        type="password"
                        name="API_key"
                        value={config.API_key}
                        onChange={handleChange}
                        className="w-full p-2 border border-slate-400 bg-slate-100 rounded-md text-slate-900 focus:ring-2 focus:ring-blue-500 outline-none"
                    />
                </div>

                {/* Save Button */}
                <button
                    type="submit"
                    className="w-full bg-blue-600 text-white p-2 rounded-md font-semibold hover:bg-blue-700 transition"
                >
                    Save Configuration
                </button>
            </form>
        </div>
    );
};

export default ModelNodeForm;
