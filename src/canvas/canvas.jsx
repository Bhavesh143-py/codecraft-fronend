import React, { useCallback, useState, useMemo, useEffect } from "react";
import ModelNodeForm from "../Input-config/ModelNodeForm";
import NodePalette from "./NodePalette";
import ReactFlow, {
    addEdge,
    Background,
    Controls,
    MiniMap,
    useEdgesState,
    useNodesState,
} from "reactflow";
import "reactflow/dist/style.css";
import { CustomFile } from "../CustomNode/CustomFile";
import CustomNode from "../CustomNode/CustomNode";
import { ModelNode } from "../CustomNode/ModelNode";
import ChatInputConfig from "../Input-config/ChatInputConfig";
import FileUploadForm from "../Input-config/FileConfig";
import { useWorkflowStore } from "../store/Mystore";
import { useNavigate } from "react-router-dom";
import ChatComponent from "../utilities/Startworkflow";
import Navbar from "../navbar/navbar";
import CustomControls from "../CustomControls";
import bgImage from "../assets/Backgroud-Image.svg"
const Canvas = () => {
    const navigate = useNavigate();
    const {
        selectedWorkflowId,
        workflows,
        addNode: addNodeToStore,
        updateNode: updateNodeInStore,
        updateConnection: updateConnectionInStore,
        setConnections: setConnectionsInStore,
        removeNode: removeNodeFromStore,
        updateWorkflowMetadata
    } = useWorkflowStore();

    const [nodes, setNodes, onNodesChange] = useNodesState([
        {
            id: "1",
            type: "customNode",
            position: { x: 200, y: 200 },
            data: { label: "Start Node", chatSettings: { showSenderName: true, showSessionId: false } },
        },
    ]);
    const [edges, setEdges, onEdgesChange] = useEdgesState([]);
    const [selectedNode, setSelectedNode] = useState(null);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [currentWorkflowId,setWorkflowId]=useState()
    const [startworkflowwindow, setstartworkflowwindow] = useState(false);
    const nodeTypes = useMemo(() => ({
        customNode: CustomNode,
        customFile: CustomFile,
        ModelNode: ModelNode,
    }), []);
    // Update your useEffect for loading workflow data to match the new structure
    // currently there is no need as we are testing to create new (empty) workflow
    useEffect(() => {
        if (selectedWorkflowId && workflows[selectedWorkflowId]) {
            const workflowData = workflows[selectedWorkflowId];

            // Check if workflow has existing nodes
            if (workflowData.nodes) {
                // Convert stored nodes to ReactFlow format
                const storedNodes = Object.values(workflowData.nodes || {}).map(node => {
                    // Determine correct node type based on the stored node type
                    let nodeType;

                    // First check if node.id starts with specific prefixes
                    if (node.id.startsWith('model_')) {
                        nodeType = "ModelNode";
                    } else if (node.id.startsWith('file_')) {
                        nodeType = "customFile";
                    } else if (node.id === "1" || node.id.startsWith('node_')) {
                        nodeType = "customNode";
                    } else {
                        // If no ID pattern match, use the type property with proper mapping
                        nodeType = node.type === "Text Input" ||
                            node.type === "Start Node" ||
                            node.type === "Chat Input" ||
                            node.type === "Text Output" ||
                            node.type === "Chat Output" ? "customNode" :
                            node.type === "Upload a file" || node.type === "File" ? "customFile" :
                                node.type === "AnthropicLLM" || node.type === "ModelNode" ||
                                    node.type === "ChatGPT" || node.type === "Gemini" ? "ModelNode" :
                                    "customNode"; // Default to customNode
                    }

                    return {
                        id: node.id,
                        type: nodeType,
                        position: node.position || { x: 100, y: 100 },
                        data: {
                            label: node.type,
                            ...node.config,
                            // Ensure model property is set for ModelNode types
                            ...(nodeType === "ModelNode" ? { model: true } : {})
                        }
                    };
                });

                if (storedNodes.length > 0) {
                    setNodes(storedNodes);
                }

                // Convert stored connections to ReactFlow edges
                const storedEdges = (workflowData.connections || []).map(conn => ({
                    id: `${conn.from.node}-${conn.to.node}`,
                    source: conn.from.node,
                    target: conn.to.node,
                    sourceHandle: conn.from.output,
                    targetHandle: conn.to.input,
                    style: { stroke: '#CCCCCC', strokeWidth: 2 }
                }));

                if (storedEdges.length > 0) {
                    setEdges(storedEdges);
                }
            }
        }
    }, [selectedWorkflowId]);

    
    // Remove the setTimeout in handleNodesChange and handleEdgesChange
    const handleNodesChange = useCallback((changes) => {
        // Look for node removals in the changes
        changes.forEach(change => {
            if (change.type === 'remove' && change.id) {
                // Call your store's removeNode function when a node is deleted
                if (selectedWorkflowId) {
                    // Assuming you have a removeNode function in your store
                    // Note: You need to add this function if it doesn't exist
                    removeNodeFromStore(change.id);
                }
            }
        });

        // Apply the changes to the ReactFlow state
        onNodesChange(changes);
    }, [onNodesChange, selectedWorkflowId]);

    const handleEdgesChange = useCallback((changes) => {
        onEdgesChange(changes);
    }, [onEdgesChange]);

    // Add these separate useEffects to handle the store updates
    useEffect(() => {
        // This will run only when nodes change, not on every render
        if (selectedWorkflowId) {
            nodes.forEach(node => {
                addNodeToStore({
                    id: node.id,
                    type: node.type,
                    position: node.position,
                    data: node.data,
                    label: node.data.label
                });
            });

            updateWorkflowMetadata({
                updated_at: new Date().toISOString()
            });
        }
    }, [nodes, addNodeToStore, updateWorkflowMetadata, selectedWorkflowId]);

    useEffect(() => {
        // This will run only when edges change, not on every render
        if (selectedWorkflowId && workflows[selectedWorkflowId]) {
            const connections = edges.map(edge => ({
                from: {
                    node: edge.source,
                    output: edge.sourceHandle || 'default'
                },
                to: {
                    node: edge.target,
                    input: edge.targetHandle || 'default'
                }
            }));

            setConnectionsInStore(connections);
            updateWorkflowMetadata({
                updated_at: new Date().toISOString()
            });
        }
    }, [edges, setConnectionsInStore, selectedWorkflowId, updateWorkflowMetadata]);


    const onConnect = useCallback((params) => {
        setEdges((eds) => {
            const newEdges = addEdge(params, eds);

            // Save the new connection to the store
            const connection = {
                from: {
                    node: params.source,
                    output: params.sourceHandle || 'default'
                },
                to: {
                    node: params.target,
                    input: params.targetHandle || 'default'
                }
            };

            // Update the store with the new connection at the top level
            if (selectedWorkflowId) {
                updateConnectionInStore(connection);
            }

            return newEdges;
        });
    }, [selectedWorkflowId, updateConnectionInStore]);
    const onNodeContextMenu = (event, node) => {
        console.log(node)
        event.preventDefault();
        if (node.type === "customNode" || node.type === "customFile" || node.type === "ModelNode") {
            setSelectedNode(node);
            setIsModalOpen(true);
            console.log(selectedNode)
        }
    };
    const handleSettingsChange = useCallback((updatedSettings) => {
        if (!selectedNode) return;

        // Prevent unnecessary updates with empty settings
        if (!updatedSettings || Object.keys(updatedSettings).length === 0) return;

        setNodes((nds) =>
            nds.map((node) => {
                if (node.id === selectedNode.id) {
                    const existingSettings = node.data.chatSettings || {};
                    const isDifferent = JSON.stringify(existingSettings) !== JSON.stringify(updatedSettings);

                    if (isDifferent || updatedSettings.file) {
                        return {
                            ...node,
                            data: {
                                ...node.data,
                                chatSettings: updatedSettings,
                                file: updatedSettings.file || node.data.file, // Store uploaded file
                            },
                        };
                    }
                }
                return node;
            })
        );

        console.log("Updated Chat Settings for Node:", selectedNode.id, updatedSettings);
    }, [selectedNode, setNodes]);
    // Add a new node to the canvas and store it
    const onAddNode = (nodeLabel) => {
        console.log(nodeLabel)
        const newNodeId = `node_${Date.now()}`;
        const newNode = {
            id: newNodeId,
            type: "customNode",
            position: { x: 400, y: 300 },
            nodeId:nodeLabel.node_id,
            data: {
                label: nodeLabel.label,
                chatSettings: { showSenderName: true, showSessionId: false },
                nodeId:nodeLabel.node_id
            },
        };

        setNodes((nds) => nds.concat(newNode));

        // Add the node to the store
        addNodeToStore({
            id: newNodeId,
            type: "customNode",
            position: { x: 400, y: 300 },
            data: { label: nodeLabel },
            label: nodeLabel
        });
    };

    const onAddFile = (nodeLabel) => {
        const newNodeId = `file_${Date.now()}`;
        const newNode = {
            id: newNodeId,
            type: "customFile",
            position: { x: 400, y: 300 },
            data: {
                label: nodeLabel,
                chatSettings: { showSenderName: true, showSessionId: false },
            },
        };

        setNodes((nds) => nds.concat(newNode));

        // Add the node to the store
        addNodeToStore({
            id: newNodeId,
            type: "customFile",
            position: { x: 400, y: 300 },
            data: { label: nodeLabel },
            label: nodeLabel
        });
    };

    const onAddModelNode = (nodeLabel) => {
        const newNodeId = `model_${Date.now()}`;
        const newNode = {
            id: newNodeId,
            type: "ModelNode",
            position: { x: 400, y: 300 },
            data: { label: nodeLabel.label, model: true ,nodeId:nodeLabel.node_id,chatSettings: { showSenderName: true, showSessionId: false },},
            
        };

        setNodes((nds) => nds.concat(newNode));

        // Add the node to the store
        addNodeToStore({
            id: newNodeId,
            type: "ModelNode",
            position: { x: 400, y: 300 },
            data: { label: nodeLabel, model: true },
            label: nodeLabel
        });
    };

    const onNodeClick = useCallback((event, node) => {
        setSelectedNode(node);
    }, []);

    // Function to handle node drag and update position in store
    const onNodeDragStop = useCallback((event, node) => {
        updateNodeInStore(node.id, { position: node.position });
    }, [updateNodeInStore]);

    const renderConfigForm = () => {
        if (!selectedNode) return null;

        switch (selectedNode.type) {
            case "ModelNode":
                return (
                    <div>
                        {/* <h2 className="text-lg font-semibold">Configurations</h2> */}
                        <button onClick={() => setSelectedNode(null)} className="float-right px-3 py-4 mt-5 mr-3 rounded">X</button>
                        <ModelNodeForm
                            selectedNode={selectedNode}
                            setSelectedNode={setSelectedNode}
                            setIsModalOpen={setIsModalOpen}
                            onUpdate={(config) => {
                                // Update node in ReactFlow state
                                setNodes(nodes => nodes.map(n =>
                                    n.id === selectedNode.id
                                        ? { ...n, data: { ...n.data, ...config } }
                                        : n
                                ));
                                updateNodeInStore(selectedNode.id, { data: { ...selectedNode.data, ...config }, type: config.modelName });
                            }}
                        />
                    </div>
                );
            case "customNode":
                return (
                    <div className="p-5 border-l border-gray-300">
                        <ChatInputConfig
                            setSelectedNode={selectedNode}
                            nodeLabel={selectedNode?.data?.label}
                            setIsModalOpen={setIsModalOpen}
                            onSettingsChange={handleSettingsChange}
                            onUpdate={(config) => {
                                // Update node in ReactFlow state
                                setNodes((nodes) =>
                                    nodes.map((n) =>
                                        n.id === selectedNode.id
                                            ? { ...n, data: { ...n.data, ...config } }
                                            : n
                                    )
                                );
                                updateNodeInStore(selectedNode.id, {
                                    data: { ...selectedNode.data, ...config },
                                    type: config.modelName,
                                });
                            }}
                        />
                    </div>
                );
            case "customFile":
                return (
                    <FileUploadForm
                        node={selectedNode}  // Pass the entire node
                        setSelectedNode={setSelectedNode}
                        setIsModalOpen={setIsModalOpen}
                        onFileUpdate={(fileConfig) => {
                            // Update node in ReactFlow state
                            setNodes(nodes => nodes.map(n =>
                                n.id === selectedNode.id
                                    ? {
                                        ...n,
                                        data: {
                                            ...n.data,
                                            ...fileConfig,
                                            label: fileConfig.filepath || n.data.label
                                        }
                                    }
                                    : n
                            ));

                            // Update node in store with comprehensive file data
                            updateNodeInStore(selectedNode.id, {
                                data: {
                                    ...selectedNode.data,
                                    ...fileConfig
                                },
                                type: "File"
                            });
                        }}
                    />
                );

        }
    };

    // Debug logging
    useEffect(() => {
        // Only log if we have a valid workflow
        if (selectedWorkflowId && workflows[selectedWorkflowId]) {
            console.log("Current workflows:", workflows);
            console.log("Current selectedWorkflowId:", selectedWorkflowId);
            setWorkflowId(selectedWorkflowId)
            console.log("Selected workflow data:", workflows[selectedWorkflowId]);
        }
    }, [workflows, selectedWorkflowId]);

    // Add a check for the whole state
    useEffect(() => {
        console.log("Full workflow store state:", useWorkflowStore.getState());
    }, []);

    if (selectedWorkflowId === null) {
        // Try to get workflows from the store
        const storeState = useWorkflowStore.getState();
        console.log("Store state in Canvas:", storeState);

        // If there are workflows but none selected, select the first one
        const workflowIds = Object.keys(storeState.workflows);
        if (workflowIds.length > 0) {
            const firstId = workflowIds[0];
            storeState.selectWorkflow(firstId);
            return <div>Selecting workflow {firstId}...</div>;
        }

        return (
            <div className="p-8">
                <h1 className="text-xl font-bold mb-4">No Workflow Selected</h1>
                <p>It appears no workflow is currently selected. You need to create or select a workflow first.</p>
                <button
                    onClick={() => navigate("/apps")}
                    className="mt-4 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
                >
                    Go to Apps
                </button>
            </div>
        );
    }

    const saveWorkflow = async () => {
        console.log("Saving workflow:", selectedWorkflowId);

        try {
            const result = await useWorkflowStore.getState().saveWorkflow();

            if (result.success) {
                // Show success message
                alert("Workflow saved successfully!");
            } else {
                // Show error message
                alert(`Failed to save workflow: ${result.message}`);
            }
        } catch (error) {
            console.error("Error in saveWorkflow:", error);
            alert("An unexpected error occurred while saving the workflow.");
        }
    };
    const handleCloseWorkflow = () => {
        setstartworkflowwindow(false);
    };

    return (
        <>
            <div className="flex h-screen flex-col">
                {/* <div className="flex justify-between items-center p-2 bg-gray-100 border-b">
                    <h1 className="text-xl font-bold capitalize">
                        {workflows[selectedWorkflowId]?.workflow_name || "Workflow Editor"}
                    </h1>
                    <div className="flex gap-4 items-center justify-end">
                    <button
                        onClick={saveWorkflow}
                        className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
                    >
                        Save Workflow
                    </button>
                    <button className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
                    onClick={()=>setstartworkflowwindow(true)}>Run workflow</button>
                    </div>
                </div> */}

                <Navbar ></Navbar>
                <div className="flex flex-1">
                    <NodePalette
                        onAddNode={onAddNode}
                        onAddFile={onAddFile}
                        onAddModelNode={onAddModelNode}
                        selectedWorkflowId={currentWorkflowId}
                        className=" bg-white border-r border-gray-300 p-2 overflow-y-auto"
                    />
                    <div className="flex-1 relative bg-[#eef9fa]">
                        <ReactFlow
                            nodes={nodes}
                            edges={edges}
                            onNodesChange={handleNodesChange}
                            onEdgesChange={handleEdgesChange}
                            onConnect={onConnect}
                            onNodeClick={onNodeClick}
                            onNodeContextMenu={onNodeContextMenu}
                            onNodeDragStop={onNodeDragStop}
                            nodeTypes={nodeTypes}
                            proOptions={{ hideAttribution: true }}
                            fitView
                        >
                            {/* <Background className="bg-[#eef9fa] " /> */}
                            <Background
  style={{
    backgroundImage: `url(${bgImage})`,
    backgroundSize: 'cover',
    backgroundPosition: 'center',
    
  }}
  className="bg-[#eef9fa] pointer-events-none "
/>

                            {/* <Controls className="flex flex-row gap-4 p-4 bg-gray-700 rounded-lg text-white" /> */}
                            <CustomControls></CustomControls>
                        </ReactFlow>
                    </div>

                    <div className="absolute right-20 mt-5 shadow-md shadow-black/25 bg-white p-3 rounded-sm w-[250px] ">
                        <div className="flex gap-2 ">
                              {/* Preview Button */}
                                <button className="flex items-center m-auto gap-1 px-3 py-1.5  border border-[#00AEEF] text-[#00AEEF] rounded-md hover:bg-[#E6F9FF] transition dm-sans-child2 " onClick={()=>setstartworkflowwindow(true)}>
                                  <svg
                                 className="w-3.5 h-3.5"
                                 fill="#00AEEF"
                                viewBox="0 0 24 24"
                                >
                                <path d="M8 5v14l11-7z" />
                                </svg>
                                Preview
                                 </button>

                                {/* Save & Publish Button */}
                                <button className="px-3 py-1.5 m-auto gap-1  bg-[#00E6B3] text-black rounded-md dm-sans-child hover:brightness-95 transition"  onClick={saveWorkflow}>
                                 Save & Publish
                                </button>
                                </div>
                    </div>


                    {selectedNode && isModalOpen && (
                        <div className="fixed inset-y-0 right-0 w-[450px] transform transition-transform duration-300 ease-in-out overflow-y-auto z-50 mt-40 rounded-2xl mb-6">
                            {renderConfigForm()}
                        </div>
                    )}
                    {startworkflowwindow && (
                        <div className="fixed inset-y-0 right-0 w-[450px] transform transition-transform duration-300 ease-in-out overflow-y-auto z-50 mt-40 rounded-2xl mb-6">
                            <ChatComponent workflowId={selectedWorkflowId} startworkflowwindow={startworkflowwindow} onClose={handleCloseWorkflow} />
                        </div>
                    )}

                </div>
            </div>
        </>
    );
};

export default Canvas;