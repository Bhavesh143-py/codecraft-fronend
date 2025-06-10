import { useState, useEffect } from "react";
import PropTypes from "prop-types";
import axios from "axios";
import workflowDig from "../assets/WorkFlow-symbol.svg";
import vector from "../assets/Vector.svg";
import vector1 from "../assets/Vector-1.svg";
import SearchIcon from "@mui/icons-material/Search";
import img1 from "../assets/9069793_drag_icon 1.png";
import KeyboardArrowUpIcon from "@mui/icons-material/KeyboardArrowUp";

const NodePalette = ({ onAddNode, onAddFile, onAddModelNode, selectedWorkflowId}) => {
  const [openSections, setOpenSections] = useState({});
  const [nodes, setNodes] = useState([]);
  const [workflowName, setWorkflowName] = useState("");

  // Fetch nodes from the API using Axios
  useEffect(() => {
    const fetchNodes = async () => {
      try {
        
        const response = await axios.get(`${import.meta.env.VITE_API_URL}/panel_components`);
        const data = response.data;

        setNodes(data);

        const initialSections = data.reduce((acc, node) => {
          if (!acc[node.header]) acc[node.header] = false;
          return acc;
        }, {});

        setOpenSections(initialSections);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    fetchNodes();
  }, []);


  useEffect(() => {
  const fetchWorkflow = async () => {
    if (!selectedWorkflowId) return;

    try {
      const response = await axios.get(`${import.meta.env.VITE_API_URL}/workflows/${selectedWorkflowId}`);
      const workflowData = response.data;
      console.log("Workflow data:", workflowData); // You can handle this data as needed
      setWorkflowName(response.data.workflow_name)
    } catch (error) {
      console.error("Error fetching workflow:", error);
    }
  };

  fetchWorkflow();
}, [selectedWorkflowId]);


  const toggleSection = (section) => {
    setOpenSections((prevState) => ({
      ...prevState,
      [section]: !prevState[section],
    }));
  };

  const groupedNodes = nodes.reduce((acc, node) => {
    if (!acc[node.header]) acc[node.header] = [];
    acc[node.header].push(node);
    return acc;
  }, {});

  return (
    <aside className="w-[334px] rounded-lg shadow-lg border border-[#F6ECEC] ">
      {/* Header */}
      <div className="bg-[#EFF9FF] p-4">
        <div className="flex gap-x-3 ml-4">
          <img src={workflowDig} alt="Workflow Logo" />
          <div className="dm-sans-workflow">{workflowName}</div>
        </div>
      </div>

      <div className="ml-5 mr-3">
        {/* Components Section Header */}
        <div className="p-3">
          <div className="flex items-center gap-x-3">
            <div className="flex">
              <img src={vector1} alt="Vector 1" className="h-4" />
              <img src={vector} alt="Vector" className="h-4" />
            </div>
            <div className="dm-sans-components">Components</div>
          </div>
        </div>

        {/* Search Bar */}
        <div className="flex items-center max-w-sm border border-[#E6E6E6] rounded-full px-3 py-2 ml-2">
          <input
            type="text"
            placeholder="Search"
            className="flex-1 bg-transparent outline-none text-sm text-gray-700 placeholder-gray-400"
          />
          <SearchIcon style={{ fontSize: 20, opacity: 0.4 }} />
        </div>

        {/* Node Sections */}
        {Object.keys(groupedNodes).map((section) => (
          <div key={section}>
            {/* Section Header */}
            <div
              className="p-3 font-bold cursor-pointer flex justify-between items-center transition-all duration-300 ease-in-out"
              onClick={() => toggleSection(section)}
            >
              <h5 className="text-[#4c4c4c] dm-sans-child">{section}</h5>
              <KeyboardArrowUpIcon
                className={`transition-transform ${openSections[section] ? "rotate-180" : ""}`}
              />
            </div>

            {/* Nodes List */}
            {openSections[section] && (
              <div className="p-2.5 space-y-2">
                {groupedNodes[section].map((node) => (
                  <button
                    key={node.node_id}
                    className="w-full p-3 cursor-pointer flex items-center space-x-3 dm-sans-child2 bg-[#f5f1f1]"
                    onClick={() => {
                      if (section === "Data") {
                        if (node.label === "File Upload") {
                          onAddFile(node.label);
                        } else {
                          onAddModelNode(node);
                        }
                      } else {
                        onAddNode(node);
                      }
                    }}
                  >
                    <img src={img1} alt="Drag Icon" className="w-5 h-5" />
                    <span>{node.label}</span>
                  </button>
                ))}
              </div>
            )}
          </div>
        ))}
      </div>
    </aside>
  );
};

// PropTypes validation
NodePalette.propTypes = {
  onAddNode: PropTypes.func.isRequired,
  onAddFile: PropTypes.func.isRequired,
  onAddModelNode: PropTypes.func.isRequired,
  selectedWorkflowId: PropTypes.string.isRequired, // Adjust type if needed
};

export default NodePalette;
