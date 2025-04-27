import React, { useEffect, useState } from "react";
import { Handle } from "reactflow";
import { Cpu, Eye, RefreshCw } from "lucide-react";

const ModelNode = ({ data }) => {
    console.log(data)
  const [nodeFields, setNodeFields] = useState([]);
  const [formState, setFormState] = useState({});
  const [nodeLabel, setNodeLabel] = useState("Model Node");

  // useEffect(() => {
  //   console.log("Node ID:", data.nodeId);

  //   if (data?.label) {
  //     setNodeLabel(data.label);
  //     console.log(data)
  //   }

  //   if (data?.nodeId) {
  //     fetch(`http://3.80.140.249:8000/asset_configs?node_id=${data.nodeId}`)
  //       .then((res) => res.json())
  //       .then((configs) => {
  //         console.log("Parsed configs from backend:", configs);

  //         const fields = configs
  //           .map((item) => {
  //             const fieldStr = typeof item === "string" ? item : item[0];

  //             if (!fieldStr || !fieldStr.includes(":")) return null;

  //             const [label, typeRaw] = fieldStr.split(":", 2);
  //             let type = typeRaw?.trim();

  //             if (type?.startsWith("[")) {
  //               try {
  //                 const correctedJson = type.replace(/'/g, '"');
  //                 const options = JSON.parse(correctedJson);
  //                 return { label: "Model Name", type: "dropdown", options };
  //               } catch {
  //                 return { label: label.trim(), type: "textbox" };
  //               }
  //             }

  //             return { label: label.trim(), type: "textbox" };
  //           })
  //           .filter(Boolean);

  //         setNodeFields(fields);
  //       })
  //       .catch((error) => console.error("Error fetching config:", error));
  //   }
  // }, [data?.nodeId]);



  useEffect(() => {
    console.log("Node ID:", data.nodeId);
  
    if (data?.label) {
      setNodeLabel(data.label);
      console.log(data);
    }
  
    if (data?.nodeId) {
      fetch(`${import.meta.env.VITE_API_URL}/asset_configs?node_id=${data.nodeId}`)
        .then((res) => res.json())
        .then((configs) => {
          console.log("Parsed configs from backend:", configs);
  
          const fields = configs
            .map((item) => {
              const fieldStr = typeof item === "string" ? item : item[0];
  
              if (!fieldStr || !fieldStr.includes(":")) return null;
  
              const [label, typeRaw] = fieldStr.split(":", 2);
              let type = typeRaw?.trim();
  
              if (type?.startsWith("[")) {
                try {
                  const correctedJson = type.replace(/'/g, '"');
                  const options = JSON.parse(correctedJson);
                  return { label: "Model Name", type: "dropdown", options };
                } catch {
                  return { label: label.trim(), type: "textbox" };
                }
              }
  
              return { label: label.trim(), type: "textbox" };
            })
            .filter(Boolean);
  
          setNodeFields(fields);
        })
        .catch((error) => console.error("Error fetching config:", error));
    }
  }, [data?.nodeId]);
  





  const handleChange = (label, value) => {
    setFormState((prev) => ({ ...prev, [label]: value }));
    console.log(formState)
    data[label]=value
  };

  return (
    <div className="w-[200px] bg-white text-[#0b0b0b] rounded-[12px] border border-[#c0e7fe] overflow-hidden text-center shadow-lg">
      {/* Header */}
      <div className="flex bg-[#f5f1f1] p-[4px] rounded-t-[12px]">
        <Cpu className="bg-[#f2f9fa] p-[4px] rounded-[4px] h-[18px]" />
        <h5 className="text-[10px] font-ubuntu flex-1 text-start ml-2 mt-0.5">
          {typeof nodeLabel === "string" ? nodeLabel :nodeLabel}
        </h5>
      </div>

      {/* Dynamic Fields */}
      <div className="">
        {nodeFields.map((field, index) => (
          <div key={index} className="mb-2 text-left m-2">
            <label className="block text-xs mb-1">{field.label}</label>

            {field.type === "textbox" && (
              <input
              type={field.label.toLowerCase().includes("key") ? "password" : "text"}
                value={data[field.label] || ""} 
                onChange={(e) => handleChange(field.label, e.target.value)}
                placeholder={`Enter ${field.label.toLowerCase()}`}
                className="w-full border border-[#e4eaed] p-2 text-[10px] rounded-md placeholder-[#aaa] focus:outline-none focus:border-[#22b1f8]"
              />
            )}

            {field.type === "dropdown" && (
              <select
                value={data[field.label] || field.options?.[0]}
                onChange={(e) => handleChange(field.label, e.target.value)}
                className="w-full border border-[#e4eaed] p-2 text-[10px] rounded-md focus:outline-none focus:border-[#22b1f8]"
              >
                {field.options.map((option, i) => (
                  <option key={i} value={option}>
                    {option}
                  </option>
                ))}
              </select>
            )}
          </div>
        ))}
      </div>

      {/* Footer */}
      <div className="flex justify-between items-center bg-[#f5f1f1] text-xs rounded-b-[12px]  border-t border-[#eae5e5] p-2 h-8">
        <Eye className="cursor-pointer text-[#22b1f8] m-1 w-[16px]" />
        <button className="bg-none border-none text-[#22b1f8] cursor-pointer">
          Message
        </button>
        <RefreshCw className="cursor-pointer text-[#22b1f8] m-1 w-[16px]" />
      </div>

      {/* Handles */}
      <Handle
        type="target"
        position="left"
        className="bg-[#22b1f8] w-[6px] h-[10px]"
      />
      <Handle
        type="source"
        position="right"
        className="bg-[#22b1f8] w-[8px] h-[8px]"
      />
    </div>
  );
};

export { ModelNode };
