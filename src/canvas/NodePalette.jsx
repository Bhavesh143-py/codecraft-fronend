import { useState, useEffect } from "react";
import PropTypes from 'prop-types';
import axios from 'axios';

const NodePalette = ({ onAddNode, onAddFile, onAddModelNode }) => {
  const [openSections, setOpenSections] = useState({});
  const [nodes, setNodes] = useState([]);

  // Fetch nodes from the API using Axios
  useEffect(() => {
    const fetchNodes = async () => {
      try {
        const response = await axios.get(`${import.meta.env.VITE_API_URL}/panel_components`);
        const data = response.data;

        console.log(data);
        setNodes(data);
        
        const initialSections = data.reduce((acc, node) => {
          if (!acc[node.header]) acc[node.header] = false;
          console.log(acc)
          return acc;
        }, {});
        
        setOpenSections(initialSections);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    fetchNodes();
  }, []);

  const toggleSection = (section) => {
    setOpenSections((prevState) => ({
      ...prevState,
      [section]: !prevState[section],
    }));
  };

  const groupedNodes = nodes.reduce((acc, node) => {
    if (!acc[node.header]) acc[node.header] = [];
    acc[node.header].push(node);
    console.log(acc)
    return acc;
  }, {});

  return (
    <aside className="w-64 bg-[#fefefe] rounded-lg shadow-lg p-2 font-ubuntu">
      <div className="text-[20px] font-bold text-gray-800 mb-2 p-1">Component</div>

      {Object.keys(groupedNodes).map((section) => (
        <div key={section}>
          <div
            className="p-3 font-bold cursor-pointer flex justify-between items-center border-b border-[#d9d9d9] transition-all duration-300 ease-in-out"
            onClick={() => toggleSection(section)}
          >
            <span className="text-[#4c4c4c]">
              <h5>{section}</h5>
            </span>
            <span className={`transition-transform ${openSections[section] ? "rotate-180" : ""}`}>▲</span>
          </div>

          {openSections[section] && (
            <div className="p-2.5 space-y-2">
              {groupedNodes[section].map((node) => (
                <button
                  key={node.node_id}
                  className="w-full p-3 text-sm font-bold font-ubuntu rounded-md cursor-pointer flex justify-between items-center bg-[rgb(249,244,244)] text-[rgb(12,12,12)] hover:bg-[#eae5e5] transition-all"
                  onClick={() => {
                    if (section === "Data") {
                      if (node.label === "File Upload") {
                        onAddFile(node.label);
                      } else {
                        onAddModelNode(node.label);
                      }
                    } else {
                      onAddNode(node.label);
                    }
                  }}
                >
                  {node.label} <span>+</span>
                </button>
              ))}
            </div>
          )}
        </div>
      ))}
    </aside>
  );
};

// PropTypes validation
NodePalette.propTypes = {
  onAddNode: PropTypes.func.isRequired,
  onAddFile: PropTypes.func.isRequired,
  onAddModelNode: PropTypes.func.isRequired,
  selectedWorkflowId: PropTypes.string.isRequired, // Assuming it's a string, adjust if necessary
};

export default NodePalette;
