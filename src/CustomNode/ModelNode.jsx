import React, { useEffect, useState } from "react";
import { Handle } from "reactflow";
import { Cpu } from "lucide-react";

const ModelNode = ({ data }) => {
    const [nodeData, setNodeData] = useState(data); // Store data in local state

    useEffect(() => {
        setNodeData(data); // Update state when data changes
    }, [data]);

    return (
        <div className="bg-white shadow-lg rounded-lg border border-gray-300 p-4 text-gray-800 w-full">
            {/* Header */}
            <div className="flex items-center gap-2 border-b pb-2 mb-2">
                <Cpu className="w-6 h-6 text-blue-500" />
                <h2 className="text-lg font-semibold">LLM Model</h2>
            </div>

            {/* Content */}
            <div className="space-y-2">
                <p className="text-sm font-medium text-gray-600">Configure Model:</p>

                <div className="flex justify-between text-sm">
                    <span className="font-medium text-gray-700">Model:</span>
                    <span className="text-gray-900">{nodeData?.modelName ?? "ChatGPT"}</span>
                </div>

                <div className="flex justify-between text-sm">
                    <span className="font-medium text-gray-700">Temperature:</span>
                    <span className="text-gray-900">{nodeData?.temperature ?? "0.5"}</span>
                </div>
            </div>

            <Handle type="target" position="left" className="w-2 h-2 bg-gray-600 rounded-full" />
            <Handle type="source" position="right" className="w-2 h-2 bg-gray-600 rounded-full" />
        </div>
    );
};

export { ModelNode };
