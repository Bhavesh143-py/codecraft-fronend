import * as pdfjsLib from "pdfjs-dist";
import pdfWorker from "pdfjs-dist/build/pdf.worker?url";
import { useFileInputStore } from "../store/Mystore";
import { useState } from "react";

// Configure PDF.js worker
pdfjsLib.GlobalWorkerOptions.workerSrc = pdfWorker;

// Unified file content extraction function
export const extractFileContent = async (file) => {
    const reader = new FileReader();

    return new Promise((resolve, reject) => {
        // Handle Text, CSV, JSON
        if (file.type.startsWith("text/") || file.name.endsWith(".csv") || file.name.endsWith(".json")) {
            reader.onload = (e) => {
                const fileText = e.target.result;
                resolve({
                    fileText,
                    filepath: file.name,
                    fileType: file.type
                });
            };
            reader.readAsText(file);
        }
        // Handle Images
        else if (file.type.startsWith("image/")) {
            reader.onload = (e) => {
                const fileBase64 = e.target.result;
                resolve({
                    fileBase64,
                    filepath: file.name,
                    fileType: file.type
                });
            };
            reader.readAsDataURL(file);
        }
        // Handle PDFs
        else if (file.type === "application/pdf") {
            file.arrayBuffer().then(async (pdfArrayBuffer) => {
                try {
                    const pdf = await pdfjsLib.getDocument({ data: pdfArrayBuffer }).promise;
                    let extractedText = "";

                    for (let i = 1; i <= pdf.numPages; i++) {
                        const page = await pdf.getPage(i);
                        const textContent = await page.getTextContent();
                        const pageText = textContent.items.map((item) => item.str).join(" ");
                        extractedText += pageText + "\n";
                    }

                    resolve({
                        fileText: extractedText,
                        filepath: file.name,
                        fileType: file.type
                    });
                } catch (error) {
                    reject(error);
                }
            });
        }
        // Unsupported File Types
        else {
            reject(new Error(`Unsupported File Type: ${file.type}`));
        }
    });
};

// Reusable file upload hook
export const useFileUpload = (onUpdateCallback) => {
    const { setFileConfig } = useFileInputStore();
    const [file, setFile] = useState(null);

    const handleFileUpload = async (selectedFile) => {
        try {
            const fileData = await extractFileContent(selectedFile);

            // Update local state
            setFile(selectedFile);

            // Update global store
            setFileConfig(fileData);

            // Call optional update callback
            if (onUpdateCallback) {
                onUpdateCallback(fileData);
            }

            return fileData;
        } catch (error) {
            console.error("File upload error:", error);
            return null;
        }
    };

    return { file, handleFileUpload };
};