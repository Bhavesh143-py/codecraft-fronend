import React, { useEffect, useState } from "react";
import { Handle } from "reactflow";
import { Eye, RefreshCw, MessageSquare } from "lucide-react";
import axios from "axios";

// Utility to parse API config response
const parseConfig = (configArray) => {
  return configArray.flat().map((entry) => {
    const [label, type] = entry.split(" : ").map((s) => s.trim());
    return { label, type };
  });
};

const CustomNode = ({ data }) => {
  console.log(data)
  const { label, nodeId, onUpdate, chatSettings } = data || {};

  const [fields, setFields] = useState([]);
  const [fieldValues, setFieldValues] = useState({});
  const [uploadedFile, setUploadedFile] = useState(null);

  const isStartNode = label === "Start Node";

  // Fetch config and initialize field values
  useEffect(() => {
    if (nodeId) {
      axios
        .get(`${import.meta.env.VITE_API_URL}/asset_configs`, {
          params: { node_id: nodeId },
        })
        .then((res) => {
          const parsedFields = parseConfig(res.data);
          setFields(parsedFields);
  
          const initialValues = {};
          parsedFields.forEach(({ label }) => {
            initialValues[label] = chatSettings?.[label] ?? data?.[label] ?? "";

          });
  
          setFieldValues(initialValues);
  
          if (onUpdate) onUpdate(initialValues);
        })
        .catch((err) => {
          console.error("Error fetching node config:", err);
        });
    }
  }, [nodeId, chatSettings]);
  

  // Handle text/checkbox field changes
  const handleFieldChange = (label, value) => {
    const updated = { ...fieldValues, [label]: value };
    setFieldValues(updated);
    if (chatSettings) chatSettings[label] = value;
    if (onUpdate) onUpdate(updated);
  };


  // Handle file upload
  const handleFileChange = (event) => {
    const file = event.target.files[0];
    setUploadedFile(file);
    if (onUpdate) onUpdate({ ...fieldValues, file });
  };


  return (
    <div className="w-[200px] bg-white text-[#0b0b0b] rounded-[12px] border border-[#c0e7fe] overflow-hidden text-center shadow-lg">
      {/* Header */}
      <div className="flex bg-[#f5f1f1] p-[4px] rounded-t-[12px]">
        <MessageSquare className="bg-[#f2f9fa] p-[4px] rounded-[4px] h-[18px]" />
        <h5 className="text-[10px] font-ubuntu flex-1 text-start ml-2 mt-0.5">{label}</h5>
      </div>

      {/* Dynamic Fields */}
      {!isStartNode && (
        <div className="">
          {fields.map(({ label, type }, idx) => {
            const key = `field-${idx}`;

            if (type === "textbox") {
              return (
                <div key={key} className="mb-2 p-2">
                  <label className="block text-xs text-left mb-1">{label}</label>
                  <input
                    type="text"
                    value={fieldValues[label] ?? ""}
                    onChange={(e) => handleFieldChange(label, e.target.value)}
                    placeholder={`Enter ${label.toLowerCase()}`}
                    className="w-full border border-[#e4eaed] p-2 text-[10px] rounded-md placeholder-[#aaa] focus:outline-none focus:border-[#22b1f8]"
                  />
                </div>
              );
            }

            if (type === "file") {
              return (
                <div key={key} className="mb-2">
                  <label className="block text-xs text-left mb-1">{label}</label>
                  <input
                    type="file"
                    onChange={handleFileChange}
                    className="w-full border border-[#e4eaed] p-2 text-[10px] rounded-md"
                  />
                  {uploadedFile && (
                    <p className="text-[10px] text-left mt-1 text-[#0b0b0b]">
                      Uploaded File: {uploadedFile.name}
                    </p>
                  )}
                </div>
              );
            }

            if (type === "checkbox") {
              return (
                <div key={key} className="flex justify-between items-center mb-2">
                  <label className="text-xs text-left">{label}</label>
                  <input
                    type="checkbox"
                    checked={!!fieldValues[label]}
                    onChange={(e) => handleFieldChange(label, e.target.checked)}
                  />
                </div>
              );
            }

            return null;
          })}
        </div>
      )}

      {/* Footer Icons */}
      {!isStartNode && (
        <div className="flex justify-between items-center bg-[#f5f1f1] text-xs rounded-b-[12px]  border-t border-[#eae5e5] p-2 h-8">
          <Eye className="cursor-pointer text-[#22b1f8] m-1 w-[16px]" />
          <button className="bg-none border-none text-[#22b1f8] cursor-pointer">Message</button>
          <RefreshCw className="cursor-pointer text-[#22b1f8] m-1 w-[16px]" />
        </div>
      )}

      {/* React Flow Handles */}
      {!isStartNode && (
        <Handle type="target" position="left" className="bg-[#22b1f8] w-[6px] h-[10px]" />
      )}
      <Handle type="source" position="right" className="bg-[#22b1f8] w-[8px] h-[8px]" />
    </div>
  );
};

export default CustomNode;
