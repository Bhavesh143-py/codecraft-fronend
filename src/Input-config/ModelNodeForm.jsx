import React, { useState, useEffect } from "react";
import axios from "axios";
import { useModelConfigStore } from "../store/Mystore";

const ModelNodeForm = ({ selectedNode, setSelectedNode, onUpdate }) => {
  console.log(selectedNode)
  const label=selectedNode.data.label
  const { setModelConfig } = useModelConfigStore();
  const [fields, setFields] = useState([]);
  const [formValues, setFormValues] = useState({});

  const nodeId = selectedNode?.data?.nodeId;

  useEffect(() => {
    const fetchFields = async () => {
      if (!nodeId) return;

      try {
        const response = await axios.get(
          `${import.meta.env.VITE_API_URL}/asset_configs`,
          {
            params: { node_id: nodeId },
          }
        );        
        const data = response.data;
        console.log(data)

        const parsedFields = data.map((item) => {
          const str = item[0];
          console.log(str)

          // Dropdown field
          if (str.startsWith("dropdown:")) {
            const optionsString = str.replace("dropdown:", "").trim();
            const options = JSON.parse(optionsString.replace(/'/g, '"'));
            return {
              name: "Model Name",
              type: "dropdown",
              options,
            };
          }

          // Textbox field
          const [label, type] = str.split(" : ");
          return {
            name: label.trim(),
            type: type.trim(),
          };
        });

        setFields(parsedFields);

        // Initialize form values from selectedNode.data
        const initialValues = {};
        parsedFields.forEach((field) => {
          const label = field.name;
          initialValues[label] = selectedNode?.data?.[label] || "";
        });

        setFormValues(initialValues);
      } catch (err) {
        console.error("Failed to fetch config:", err);
      }
    };

    fetchFields();
  }, [nodeId, selectedNode]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormValues((prev) => ({
      ...prev,
      [name]: name.toLowerCase() === "temperature" ? parseFloat(value) : value,
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setModelConfig(formValues);
    onUpdate(formValues);
    setSelectedNode(null);
    console.log("Submitted values:", formValues);
  };

  return (
    <div className="max-w-md mx-auto mt-6 p-6 bg-white text-slate-900 shadow-lg rounded-lg border border-slate-300">
      <h2 className="text-lg font-semibold  text-slate-800 mb-5 border-b border-gray-200 p-4">{label} Configuration</h2>
      <form onSubmit={handleSubmit} className="space-y-4  ">
        {fields.map((field, index) => (
          <div key={index}>
            <label className="block text-slate-700 mb-2">{field.name}</label>
            {field.type === "dropdown" ? (
              <select
                name={field.name}
                value={formValues[field.name] || ""}
                onChange={handleChange}
                className="w-full p-2 border border-slate-400 bg-white rounded-md text-slate-900 focus:ring-2 focus:ring-blue-500 outline-none"
              >
                {field.options.map((option, idx) => (
                  <option key={idx} value={option}>
                    {option}
                  </option>
                ))}
              </select>
            ) : (
              <input
                type={field.name.toLowerCase().includes("key") ? "password" : "text"}
                name={field.name}
                placeholder={`Enter ${field.name}`}
                value={formValues[field.name] || ""}
                onChange={handleChange}
                className="w-full p-2 border border-slate-400 bg-slate-100 rounded-md text-slate-900 focus:ring-2 focus:ring-blue-500 outline-none"
              />
            )}
          </div>
        ))}
        
        {/* <button
          type="submit"
          className="w-full bg-blue-600 text-white p-2 rounded-md font-semibold hover:bg-blue-700 transition"
        >
          Save Configuration
        </button> */}


{fields.length > 0 && (
          <button
            type="submit"
            className="w-full bg-blue-600 text-white p-2 rounded-md font-semibold hover:bg-blue-700 transition"
          >
            Save Configuration
          </button>
        )}

      </form>
    </div>
  );
};

export default ModelNodeForm;
