import React, { useEffect, useState } from "react";
import { Handle } from "reactflow";
import { Eye, RefreshCw, MessageSquare } from "lucide-react";
import axios from "axios";
import del from "../assets/Delete.png"
import img from "../assets/Group 4753.png"

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
          console.log(res)
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
    <div className="w-[314px] bg-white rounded-[12px] border border-[#c0e7fe] shadow-md overflow-hidden text-[10px] ">
      {/* Header */}
      {/* <div className="flex bg-[#f5f1f1] p-[4px] rounded-t-[12px]">
        <MessageSquare className="bg-[#f2f9fa] p-[4px] rounded-[4px] h-[18px]" />
        <h5 className="text-[10px] font-ubuntu flex-1 text-start ml-2 mt-0.5">{label}</h5>
      </div> */}



            <div className="grid grid-cols-[5fr_1fr_1fr] justify-between items-start p-3 border-b border-[#f0f0f0]">
              <div>
                <h3 className="text-[14px] font-semibold text-[#0b0b0b]">{label}</h3>
                <p className="text-[10px] text-gray-500">Lorem ipsum dolor, sit amet consectetur adipisicing elit. Doloribus, vero?</p>
              </div>
              <div></div>
              <img src={del} alt="" />
            </div>

      {/* Dynamic Fields */}
      {!isStartNode && (
        <div className="">
          {fields.map(({ label, type }, idx) => {
            const key = `field-${idx}`;

            if (type === "text") {
              return (
                <div key={key} className="mb-2 p-2 m-1">
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
                <div key={key} className="mb-2 p-2 m-1">
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
                <div key={key} className="flex justify-between items-center mb-2 p-2 m-1">
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


      {/* React Flow Handles */}
      {!isStartNode && (
        // <Handle type="target" position="left" className="bg-[#22b1f8] w-[6px] h-[10px]" />
        <Handle
                type="target"
                position="left"
                style={{
                  bottom: 15,
                  top: "auto",
                  width: 15,
                  height: 15,
                  backgroundImage: `url(${img})`,
                  backgroundSize: "contain",
                  backgroundRepeat: "no-repeat",
                  backgroundPosition: "center",
                  backgroundColor: "transparent",
                  borderRadius: "50%",
                  border: "none",
                  left: "-10px",
                  position: "absolute",
                }}
              />
      )}
      {/* <Handle type="source" position="right" className="bg-[#22b1f8] w-[8px] h-[8px]" /> */}
            <Handle
              type="source"
              position="right"
              style={{
                bottom: 15,
                top: "auto",
                width: 15,
                height: 15,
                backgroundImage: `url(${img})`,
                backgroundSize: "contain",
                backgroundRepeat: "no-repeat",
                backgroundPosition: "center",
                backgroundColor: "transparent",
                borderRadius: "50%",
                border: "none",
                right: "-10px",
                position: "absolute",
              }}
            />
    </div>
  );
};

export default CustomNode;
