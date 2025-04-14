import React, { useState, useEffect } from "react";
import { UploadCloud, X } from "lucide-react";
import axios from "axios";
import { useWorkflowStore } from "../store/Mystore";

const FileUploadForm = ({ setIsModalOpen, onFileUpdate, selectedNode, setSelectedNode }) => {
    const selectedWorkflowId = useWorkflowStore((state) => state.selectedWorkflowId);
    const [isFileUploading, setIsFileUploading] = useState(false);
    const [uploadError, setUploadError] = useState(null);
    const [fileName, setFileName] = useState("");

    // Initialize settings from selected node when component mounts or selected node changes
    useEffect(() => {
        if (selectedNode?.data?.config?.filename) {
            setFileName(selectedNode.data.config.filename);
        }
    }, [selectedNode]);

    const handleClose = () => {
        setIsModalOpen(false);
        setSelectedNode(null);
    };

    const handleFileChange = async (e) => {
        const file = e.target.files[0];

        if (!file || !selectedWorkflowId) return;

        setIsFileUploading(true);
        setUploadError(null);
        setFileName(file.name);

        try {
            const formData = new FormData();
            formData.append("file", file);

            const apiUrl = `${import.meta.env.VITE_API_URL}/workflows/upload?workflow_id=${selectedWorkflowId}`;

            const response = await axios.post(
                apiUrl,
                formData,
                {
                    headers: {
                        "Content-Type": "multipart/form-data"
                    }
                }
            );

            console.log("File upload response:", response.data);

            if (response.status === 200) {
                // For ReactFlow node UI update
                const fileConfig = {
                    filename: file.name,
                    label: file.name,
                    // This data structure matches what the store expects
                    data: {
                        config: {
                            filename: file.name
                        }
                    },
                    type: "File"
                };

                // Update parent component state
                onFileUpdate(fileConfig);

                console.log("File update completed with:", fileConfig);
            } else {
                throw new Error("File upload failed");
            }
        } catch (error) {
            console.error("File upload error:", error);
            setUploadError("Failed to upload file. Please try again.");
        } finally {
            setIsFileUploading(false);
        }
    };

    return (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
            <div className="bg-white text-black rounded-lg border border-blue-200 w-full max-w-lg max-h-[90vh] p-6 shadow-lg overflow-y-auto">
                <div className="flex items-center justify-between pb-4 mb-4 border-b border-gray-200">
                    <h2 className="text-lg font-semibold">File Upload Configuration</h2>
                    <button onClick={handleClose} className="text-gray-400 hover:text-black">
                        <X size={20} />
                    </button>
                </div>

                <div className="space-y-6">
                    <div className="flex flex-col space-y-3">
                        <div className="mt-2">
                            <label className="cursor-pointer flex items-center gap-2 text-blue-500 hover:text-blue-600 p-3 border border-dashed border-blue-300 rounded-md">
                                <UploadCloud className="w-5 h-5" />
                                {isFileUploading ? (
                                    <div className="flex items-center">
                                        <div className="animate-spin rounded-full h-4 w-4 border-2 border-blue-500 border-t-transparent mr-2"></div>
                                        <span>Uploading...</span>
                                    </div>
                                ) : (
                                    <span>{fileName || "Choose a file to upload..."}</span>
                                )}
                                <input
                                    type="file"
                                    className="hidden"
                                    onChange={handleFileChange}
                                    disabled={isFileUploading}
                                />
                            </label>

                            {uploadError && (
                                <p className="text-red-500 text-sm mt-2">{uploadError}</p>
                            )}

                            <div className="text-xs text-gray-500 mt-2">
                                Files will be processed and used in the workflow.
                            </div>
                        </div>
                    </div>

                    <div className="flex justify-end mt-4">
                        <button
                            onClick={handleClose}
                            className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600"
                        >
                            Done
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default FileUploadForm;