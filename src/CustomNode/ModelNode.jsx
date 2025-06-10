import React, { useEffect, useState } from "react";
import { Handle } from "reactflow";
import { Cpu, Eye, RefreshCw, Trash } from "lucide-react";
import del from "../assets/Delete.png"
import img from "../assets/Group 4753.png"

const ModelNode = ({ data }) => {
  const [nodeFields, setNodeFields] = useState([]);
  const [formState, setFormState] = useState({});
  const [nodeLabel, setNodeLabel] = useState("Single Agent");

  useEffect(() => {
    if (data?.label) {
      setNodeLabel(data.label);
    }

    if (data?.nodeId) {
      fetch(`${import.meta.env.VITE_API_URL}/asset_configs?node_id=${data.nodeId}`)
        .then((res) => res.json())
        .then((configs) => {
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
                  return { label: label.trim(), type: "dropdown", options };
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
    data[label] = value;
  };

  return (
    <div className="w-[314px] bg-white rounded-[12px] border border-[#c0e7fe] shadow-md overflow-hidden text-[10px] ">
      {/* Top Header */}
      <div className="grid grid-cols-[5fr_1fr_1fr] justify-between items-start p-3 border-b border-[#f0f0f0]">
        <div>
          <h3 className="text-[14px] font-semibold text-[#0b0b0b]">{nodeLabel}</h3>
          <p className="text-[10px] text-gray-500">Lorem ipsum dolor, sit amet consectetur adipisicing elit. Doloribus, vero?</p>
        </div>
        <div></div>
        <img src={del} alt="" />
      </div>

      {/* Dynamic Fields */}
      <div className="p-3">
        {nodeFields.map((field, index) => (
          <div key={index} className="mb-3 m-1">
            <label className="block mb-1 text-[#0b0b0b] text-[10px]">{field.label}</label>

            {field.type === "textbox" && (
              <input
                type={field.label.toLowerCase().includes("key") ? "password" : "text"}
                value={data[field.label] || ""}
                onChange={(e) => handleChange(field.label, e.target.value)}
                placeholder={`Enter ${field.label.toLowerCase()}`}
                className="w-full border border-[#e4eaed] rounded-md p-2 text-[10px] placeholder-[#aaa] focus:outline-none focus:border-[#22b1f8]"
              />
            )}

            {field.type === "dropdown" && (
              <select
                value={data[field.label] || field.options?.[0]}
                onChange={(e) => handleChange(field.label, e.target.value)}
                className="w-full border border-[#e4eaed] rounded-md p-2 text-[10px] focus:outline-none focus:border-[#22b1f8]"
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
      {/* <div className="flex justify-between items-center bg-[#f5f1f1] text-xs rounded-b-[12px] border-t border-[#eae5e5] p-2 h-8">
        <Eye className="cursor-pointer text-[#22b1f8] w-[16px]" />
        <button className="bg-none border-none text-[#22b1f8] cursor-pointer">Message</button>
        <RefreshCw className="cursor-pointer text-[#22b1f8] w-[16px]" />
      </div> */}

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

      {/* Source Handle (right side) */}
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

export { ModelNode };
