import React, { useState, useEffect } from "react";
import { UploadCloud, X } from "lucide-react";
import { extractFileContent } from "../utilities/ContentExtract";

const FileUploadForm = ({ setIsModalOpen, onFileUpdate, selectedNode, setSelectedNode }) => {
    const [settings, setSettings] = useState({
        showUploadFile: selectedNode?.data?.fileSettings?.showUploadFile ?? true,
        uploadFiles: selectedNode?.data?.fileSettings?.uploadFiles || null
    });

    useEffect(() => {
        if (selectedNode) {
            setSettings({
                showUploadFile: selectedNode?.data?.fileSettings?.showUploadFile ?? true,
                uploadFiles: selectedNode?.data?.fileSettings?.uploadFiles || null
            });
        }
    }, [selectedNode]);

    useEffect(() => {
        if (settings.uploadFiles) {
            handleFileContent(settings.uploadFiles);
        }
    }, [settings.uploadFiles]);

    const handleClose = () => {
        setIsModalOpen(false);
        setSelectedNode(null);
    };

    const handleCheckboxChange = (key) => {
        setSettings((prev) => ({ ...prev, [key]: !prev[key] }));
    };

    const handleFileChange = async (e) => {
        const file = e.target.files[0];
        if (!file) return;

        setSettings((prev) => ({ ...prev, uploadFiles: file }));
    };

    const handleFileContent = async (file) => {
        try {
            // Extract file content
            const fileData = await extractFileContent(file);

            // Call the onFileUpdate callback with extracted data
            onFileUpdate({
                fileData: file,
                fileText: fileData.fileText || "",
                filepath: file.name,
                fileBase64: fileData.fileBase64 || "",
                fileType: file.type,
                fileSize: file.size,
                showUploadFile: settings.showUploadFile
            });
        } catch (error) {
            console.error("File extraction error:", error);
        }
    };

    return (
        <div className="fixed inset-0 flex bg-black bg-opacity-50 z-50">
            <div className="bg-white text-black rounded-lg border border-blue-200 w-full max-w-lg max-h-[90vh] p-6 shadow-lg overflow-y-auto">
                <div className="flex items-center justify-between pb-4 mb-4 border-b border-gray-200">
                    <h2 className="text-lg font-semibold">File Upload Configuration</h2>
                    <button onClick={handleClose} className="text-gray-400 hover:text-black mt-5">
                        <X size={20} />
                    </button>
                </div>
                <div className="space-y-6 overflow-y-auto">
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
                            <span>{settings.uploadFiles ? settings.uploadFiles.name : "Upload a file..."}</span>
                            <input type="file" className="hidden" onChange={handleFileChange} />
                        </label>
                        <div className="text-xs text-gray-500">Files to be processed and used in the workflow.</div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default FileUploadForm;