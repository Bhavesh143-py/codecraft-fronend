import React, { useState } from "react";
import { UploadCloud, X } from "lucide-react";
import { extractFileContent } from "../utilities/ContentExtract";

const FileUploadForm = ({ node, setSelectedNode, onFileUpdate }) => {
    const [file, setFile] = useState(null);
    const [fileContent, setFileContent] = useState("");

    const handleFileChange = async (e) => {
        const selectedFile = e.target.files[0];
        if (selectedFile) {
            try {
                // Extract file content
                const fileData = await extractFileContent(selectedFile);

                // Set local states
                setFile(selectedFile);
                setFileContent(fileData.fileText || "");

                // Call the onFileUpdate callback with extracted data
                onFileUpdate({
                    fileData: selectedFile,
                    fileText: fileData.fileText || "",
                    filepath: selectedFile.name,
                    fileBase64: fileData.fileBase64 || ""
                });
            } catch (error) {
                console.error("File extraction error:", error);
            }
        }
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        if (file) {
            // Prepare the full file configuration
            const fileConfig = {
                filepath: file.name,
                fileText: fileContent,
                fileType: file.type,
                fileSize: file.size,
                fileBase64: fileContent ? btoa(fileContent) : ""
            };

            // Call onFileUpdate with comprehensive file data
            onFileUpdate(fileConfig);

            console.log("File Uploaded:", file);
            console.log("File Content:", fileConfig);
            setSelectedNode(null);
        }
    };

    return (
        <div className="fixed inset-0 flex bg-black bg-opacity-50 z-50">
            <div className="bg-white text-black rounded-lg border border-blue-200 w-full max-w-lg max-h-[90vh] p-6 shadow-lg overflow-y-auto">
                <div className="flex items-center justify-between pb-4 mb-4 border-b border-gray-200">
                    <h2 className="text-lg font-semibold">File Configuration</h2>
                    <button
                        onClick={() => setSelectedNode(null)}
                        className="text-gray-400 hover:text-black mt-5"
                    >
                        <X size={20} />
                    </button>
                </div>
                <div className="space-y-6 overflow-y-auto">
                    <form onSubmit={handleSubmit} className="space-y-4">
                        <div>
                            <label className="cursor-pointer flex items-center gap-2 text-blue-500 hover:text-blue-600">
                                <UploadCloud className="w-5 h-5" />
                                <span>{file ? file.name : "Upload a file..."}</span>
                                <input
                                    type="file"
                                    className="hidden"
                                    onChange={handleFileChange}
                                />
                            </label>
                            {file && (
                                <div className="text-xs text-gray-500 mt-2">
                                    Selected: {file.name} ({file.type})
                                </div>
                            )}
                        </div>
                        {fileContent && (
                            <div className="mt-4">
                                <h3 className="font-semibold mb-2">File Preview:</h3>
                                <textarea
                                    readOnly
                                    value={fileContent}
                                    className="w-full h-40 p-2 border rounded bg-gray-100"
                                />
                            </div>
                        )}
                        <button
                            type="submit"
                            className="w-full bg-blue-600 text-white p-2 rounded-md font-semibold hover:bg-blue-700 transition"
                            disabled={!file}
                        >
                            Upload File
                        </button>
                    </form>
                </div>
            </div>
        </div>
    );
};

export default FileUploadForm;