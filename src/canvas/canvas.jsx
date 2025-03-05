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
import {CustomFile} from "../CustomNode/CustomFile";
import CustomNode from "../CustomNode/CustomNode";
import { ModelNode } from "../CustomNode/ModelNode";
import ChatInputConfig from "../Input-config/ChatInputConfig";
import FileUploadForm from "../Input-config/FileConfig";
import { useWorkflowStore } from "../store/Mystore";
import { data, useNavigate } from "react-router-dom";

const Canvas = () => {
    const navigate = useNavigate();
    const {
        selectedWorkflowId,
        workflows,
        addNode: addNodeToStore,
        updateNode: updateNodeInStore,
        updateConnection: updateConnectionInStore,
        setConnections: setConnectionsInStore,
        removeNode : removeNodeFromStore,
        updateWorkflowMetadata
    } = useWorkflowStore();

    const [nodes, setNodes, onNodesChange] = useNodesState([]);
    const [edges, setEdges, onEdgesChange] = useEdgesState([]);
    const [selectedNode, setSelectedNode] = useState(null);

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
                const storedNodes = Object.values(workflowData.nodes || {}).map(node => ({
                    id: node.id,
                    // Map the node types from your format to ReactFlow node types
                    type: node.type === "TextInput" ? "customNode" :
                        node.type === "File" ? "customFile" :
                            node.type === "AnthropicLLM" || "ModelNode" ||"ChatGPT" ||"Gemini" ? "ModelNode" : "customNode",
                    position: node.position || { x: 100, y: 100 },
                    data: {
                        label: node.type,
                        ...node.config
                    }
                }));

                if (storedNodes.length > 0) {
                    setNodes(storedNodes);
                }

                // Convert stored connections to ReactFlow edges
                const storedEdges = (workflowData.connections || []).map(conn => ({
                    id: `${conn.from.node}-${conn.to.node}`,
                    source: conn.from.node,
                    target: conn.to.node,
                    sourceHandle: conn.from.output,
                    targetHandle: conn.to.input
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
    }, [edges,setConnectionsInStore, selectedWorkflowId, updateWorkflowMetadata]);
    

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

    // Add a new node to the canvas and store it
    const onAddNode = (nodeLabel) => {
        const newNodeId = `node_${Date.now()}`;
        const newNode = {
            id: newNodeId,
            type: "customNode",
            position: { x: 400, y: 300 },
            data: { label: nodeLabel },
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
            data: { label: nodeLabel },
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
            data: { label: nodeLabel, model: true },
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
                    <div className="p-4 border-l border-gray-300">
                        <h2 className="text-lg font-semibold">Configurations</h2>
                        <button onClick={() => setSelectedNode(null)} className="float-right px-2 py-1 bg-gray-200 rounded">X</button>
                        <ModelNodeForm
                            setSelectedNode={setSelectedNode}
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
                    <div className="p-4 border-l border-gray-300">
                        <ChatInputConfig
                            node={selectedNode}
                            setSelectedNode={setSelectedNode}
                            onUpdate={(config) => {
                                // Update node in ReactFlow state
                                setNodes(nodes => nodes.map(n =>
                                    n.id === selectedNode.id
                                        ? { ...n, data: { ...n.data, ...config } }
                                        : n
                                ));

                                // Update node in store
                                updateNodeInStore(selectedNode.id, { data: { ...selectedNode.data, ...config } });
                            }}
                        />
                    </div>
                );
            case "customFile":
                return (
                    <FileUploadForm
                        node={selectedNode}  // Pass the entire node
                        setSelectedNode={setSelectedNode}
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
            default:
                return (
                    <div className="p-4 border-l border-gray-300">
                        <button onClick={() => { setSelectedNode(null) }} className="float-right px-2 py-1 bg-gray-200 rounded">X</button>
                        <p>No configuration available for this node.</p>
                    </div>
                );
        }
    };

    // Debug logging
    useEffect(() => {
        // Only log if we have a valid workflow
        if (selectedWorkflowId && workflows[selectedWorkflowId]) {
            console.log("Current workflows:", workflows);
            console.log("Current selectedWorkflowId:", selectedWorkflowId);
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

    return (
        <>
            <div className="flex h-screen flex-col">
                <div className="flex justify-between items-center p-2 bg-gray-100 border-b">
                    <h1 className="text-xl font-bold">
                        {workflows[selectedWorkflowId]?.workflow_name || "Workflow Editor"}
                    </h1>
                    <button
                        onClick={saveWorkflow}
                        className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
                    >
                        Save Workflow
                    </button>
                </div>
                <div className="flex flex-1">
                    <NodePalette
                        onAddNode={onAddNode}
                        onAddFile={onAddFile}
                        onAddModelNode={onAddModelNode}
                        className="w-1/4 bg-white border-r border-gray-300 p-2 overflow-y-auto"
                    />
                    <div className="flex-1 relative bg-[#eef9fa]">
                        <ReactFlow
                            nodes={nodes}
                            edges={edges}
                            onNodesChange={handleNodesChange}
                            onEdgesChange={handleEdgesChange}
                            onConnect={onConnect}
                            onNodeClick={onNodeClick}
                            onNodeDragStop={onNodeDragStop}
                            nodeTypes={nodeTypes}
                            proOptions={{ hideAttribution: true }}
                            fitView
                        >
                            <Background className="bg-[#eef9fa]" />
                            <MiniMap />
                            <Controls className="flex flex-row gap-4 p-4 bg-gray-700 rounded-lg text-white" />
                        </ReactFlow>
                    </div>
                    {selectedNode && (
                        <>
                            {renderConfigForm()}
                        </>
                        
                    )}
                </div>
            </div>
        </>
    );
};

export default Canvas;