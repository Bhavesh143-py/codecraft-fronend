import React, { useState, useEffect } from "react";
import axios from "axios";
import { toast } from "react-toastify";
import { X } from "lucide-react";

const ChatComponent = ({ workflowId, startworkflowwindow, onClose }) => {
    
    const [loading, setLoading] = useState(true);
    const [workflowData, setWorkflowData] = useState(null);
    const [error, setError] = useState(null);
    const [inputMessage, setInputMessage] = useState("");

    // Automatically start the workflow when the component mounts
    useEffect(() => {
        if (startworkflowwindow) {
            handleStartWorkflow();
        }
    }, []);

    const handleStartWorkflow = async () => {
        setLoading(true);
        try {
            const response = await axios.post(`${import.meta.env.VITE_API_URL}/workflows/${workflowId}/start`);
            console.log("Workflow started successfully:", response.data);
            toast.success("Workflow started successfully", {
                position: "top-right",
                autoClose: 3000,
                hideProgressBar: true,
            });
            setWorkflowData(response.data);
            setError(null);
        } catch (err) {
            console.error("Error starting workflow:", err);
            toast.error("Failed to Run the workflow. Please check all the Nodes.", {
                position: "top-right",
                autoClose: 3000,
                hideProgressBar: true,
            });
            setError("Failed to start workflow. Please check all the nodes.");
        } finally {
            setLoading(false);
        }
    };

    const handleSendMessage = (e) => {
        e.preventDefault();
        if (inputMessage.trim()) {
            // Here you would typically send the message to your workflow
            console.log("Sending message:", inputMessage);
            setInputMessage("");
            // You could add logic here to handle the message in your workflow
        }
    };

    return (
        <div className="flex flex-col h-full bg-white shadow-lg rounded-lg border border-gray-200">
            {/* Header */}
            <div className="flex items-center justify-between px-4 py-3 border-b border-gray-200">
                <div className="flex items-center">
                    <h3 className="text-lg font-medium">Workflow Execution</h3>
                    {workflowData && (
                        <span className="ml-2 px-2 py-1 bg-blue-100 text-blue-800 text-xs rounded-md">
                            ID: {workflowData.execution_id}
                        </span>
                    )}
                </div>
                <button
                    onClick={onClose}
                    className="p-1 rounded-full hover:bg-gray-100"
                    aria-label="Close"
                >
                    <X size={20} />
                </button>
            </div>

            {/* Main Content Area */}
            <div className="flex-1 overflow-y-auto p-4">
                {loading && (
                    <div className="flex items-center justify-center h-full">
                        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
                        <span className="ml-2">Starting workflow...</span>
                    </div>
                )}

                {error && (
                    <div className="bg-red-100 border-l-4 border-red-500 text-red-700 p-4 mb-4">
                        <p>{error}</p>
                    </div>
                )}

                {workflowData && !loading && (
                    <div className="space-y-4">
                        {/* Message */}
                        <div className="bg-gray-100 p-3 rounded-md">
                            <p className="text-sm text-gray-600">{workflowData.message}</p>
                        </div>

                        {/* Response */}
                        <div className="bg-gray-50 p-4 rounded-md border border-gray-200">
                            <div className="flex items-center mb-2">
                                <span className="font-medium text-gray-700">Answer :</span>
                            </div>
                            <p className="text-gray-800 whitespace-pre-wrap">{workflowData.Response}</p>
                        </div>
                    </div>
                )}
            </div>

            {/* Input Bar */}
            <div className="border-t border-gray-200 p-3">
                <form onSubmit={handleSendMessage} className="flex space-x-2">
                    <input
                        type="text"
                        value={inputMessage}
                        onChange={(e) => setInputMessage(e.target.value)}
                        placeholder="Type your message..."
                        className="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                    <button
                        type="submit"
                        disabled={!inputMessage.trim()}
                        className={`px-4 py-2 rounded-md ${!inputMessage.trim()
                                ? "bg-gray-300 cursor-not-allowed"
                                : "bg-blue-500 hover:bg-blue-600 text-white"
                            }`}
                    >
                        Send
                    </button>
                </form>
            </div>
        </div>
    );
};

export default ChatComponent;