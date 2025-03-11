import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import { produce } from 'immer';
import axios from 'axios';

const useWorkflowStore = create(
    persist(
        (set, get) => ({
            workflows: {}, // Stores all workflows keyed by workflow_id
            selectedWorkflowId: null,

            initializeWorkflow: (id, workflowData) => set(produce(state => {
                state.workflows[id] = {
                    version: 1.0,
                    workflow_id: id,
                    workflow_name: workflowData.workflow_name,
                    description: workflowData.description,
                    created_by: workflowData.created_by,
                    nodes: workflowData.nodes || {}, // Store nodes at the top level like in your desired format
                    connections: workflowData.connections || [], // Store connections at the top level
                    dsl_file: {
                        ...(workflowData.dsl_file || {}),
                    },
                    status: workflowData.status || 'active',
                    created_at: workflowData.created_at || new Date().toISOString(),
                    updated_at: workflowData.updated_at || new Date().toISOString()
                };
            })),
            selectWorkflow: (id) => set({ selectedWorkflowId: id }),

            // Fix the updateNode function to handle Chat and Text inputs properly
            updateNode: (nodeId, newData) => set(produce(state => {
                const workflowId = state.selectedWorkflowId;
                if (workflowId && state.workflows[workflowId]) {
                    // Ensure nodes object exists
                    if (!state.workflows[workflowId].nodes) {
                        state.workflows[workflowId].nodes = {};
                    }

                    // If the node doesn't exist, return early
                    if (!state.workflows[workflowId].nodes[nodeId]) {
                        return;
                    }

                    const node = state.workflows[workflowId].nodes[nodeId];
                    const nodeType = node.type;

                    // Update the node data based on node type
                    if (newData.data) {
                        // Handle different node types appropriately
                        if (nodeType === "Chat Input") {
                            // For Chat Input nodes, update the specific fields
                            node.config = {
                                ...node.config,
                                Text: newData.data.text || newData.data.Text || node.config.Text || "",
                                store_messages: newData.data.storeMessages || newData.data.store_messages || node.config.store_messages || false,
                                sessionID: newData.data.sessionId || newData.data.sessionID || node.config.sessionID || "",
                                files: newData.data.files || node.config.files || "path_to_file"
                            };
                        }
                        else if (nodeType === "Text Input") {
                            // For Text Input nodes, update the Text field
                            node.config = {
                                ...node.config,
                                Text: newData.data.text || newData.data.Text || node.config.Text || "hi"
                            };
                        }
                        else {
                            // For other node types, spread the data directly
                            node.config = {
                                ...node.config,
                                ...newData.data
                            };
                        }
                    }

                    // Update type if provided
                    if (newData.type) {
                        node.type = newData.type;
                    }

                    // Update position if provided
                    if (newData.position) {
                        node.position = newData.position;
                    }

                    // Update the workflow's updated_at timestamp
                    state.workflows[workflowId].updated_at = new Date().toISOString();
                }
            })),

            addNode: (nodeData) => set(produce(state => {
                const workflowId = state.selectedWorkflowId;
                if (workflowId && state.workflows[workflowId]) {
                    // Ensure nodes object exists
                    if (!state.workflows[workflowId].nodes) {
                        state.workflows[workflowId].nodes = {};
                    }

                    // Determine the correct node type
                    let nodeType;

                    // First check by node ID pattern
                    if (nodeData.id.startsWith('model_')) {
                        nodeType = nodeData.data && nodeData.data.modelName ? nodeData.data.modelName : "ModelNode";
                    } else if (nodeData.id.startsWith('file_')) {
                        nodeType = "File";
                    } else if (nodeData.type === "ModelNode") {
                        // If it's explicitly a ModelNode type
                        nodeType = nodeData.data && nodeData.data.modelName ? nodeData.data.modelName : "ModelNode";
                    } else {
                        // Otherwise use the label or fall back to a mapping
                        nodeType = nodeData.label === "Chat Input" ? "Chat Input" :
                            nodeData.label === "Text Input" ? "Text Input" :
                                nodeData.label === "Start Node" ? "Start Node" :
                                    nodeData.label === "Chat Output" ? "Chat Output" :
                                        nodeData.label === "Text Output" ? "Text Output" :
                                            nodeData.type === "customFile" ? "File" :
                                                "customNode"; // Default type
                    }

                    // Format the node to match your desired structure
                    const formattedNode = {
                        type: nodeType,
                        id: nodeData.id,
                        position: nodeData.position || { x: 0, y: 0 },
                        config: {
                            // Include model config
                            ...(nodeData.type === "ModelNode" && {
                                modelName: (nodeData.data && nodeData.data.modelName) || "ChatGpt O-3",
                                temperature: (nodeData.data && nodeData.data.temperature) || 0.5,
                                input: (nodeData.data && nodeData.data.input) || "receiving_input",
                                system_message: (nodeData.data && nodeData.data.system_message) || "system_message",
                                maximum_tokens: (nodeData.data && nodeData.data.maximum_tokens) || 4096,
                                API_key: (nodeData.data && nodeData.data.API_key) || ""
                            }),
                            // Directly store Text properties for Chat Input instead of nesting under chatSettings
                            ...(nodeData.label === "Chat Input" && {
                                Text: (nodeData.data && nodeData.data.text) ||
                                    (nodeData.data && nodeData.data.Text) ||
                                    (nodeData.data && nodeData.data.chatSettings && nodeData.data.chatSettings.text) || "",
                                store_messages: (nodeData.data && nodeData.data.storeMessages) ||
                                    (nodeData.data && nodeData.data.store_messages) ||
                                    (nodeData.data && nodeData.data.chatSettings && nodeData.data.chatSettings.storeMessages) || false,
                                sessionID: (nodeData.data && nodeData.data.sessionId) ||
                                    (nodeData.data && nodeData.data.sessionID) ||
                                    (nodeData.data && nodeData.data.chatSettings && nodeData.data.chatSettings.sessionId) || "",
                                files: (nodeData.data && nodeData.data.files) ||
                                    (nodeData.data && nodeData.data.chatSettings && nodeData.data.chatSettings.files) || "path_to_file"
                            }),
                            // Directly store Text property for Text Input
                            ...(nodeData.label === "Text Input" && {
                                Text: (nodeData.data && nodeData.data.text) ||
                                    (nodeData.data && nodeData.data.Text) ||
                                    (nodeData.data && nodeData.data.chatSettings && nodeData.data.chatSettings.text) || "hi",
                            }),
                            ...(nodeData.type === "customFile" && {
                                filepath: nodeData.data?.filepath || "",
                                fileText: nodeData.data?.fileText || "",
                                fileBase64: nodeData.data?.fileBase64 || "",
                                fileType: nodeData.data?.fileType || ""
                            })
                        },
                    };

                    // Add the new node
                    state.workflows[workflowId].nodes[nodeData.id] = formattedNode;

                    // Update the workflow's updated_at timestamp
                    state.workflows[workflowId].updated_at = new Date().toISOString();
                }
            })),
            removeNode: (nodeId) => set(produce(state => {
                const workflowId = state.selectedWorkflowId;
                if (workflowId && state.workflows[workflowId]?.nodes) {
                    // Remove the node
                    delete state.workflows[workflowId].nodes[nodeId];

                    // Also remove any connections involving this node
                    if (state.workflows[workflowId].connections) {
                        state.workflows[workflowId].connections =
                            state.workflows[workflowId].connections.filter(conn =>
                                conn.from.node !== nodeId && conn.to.node !== nodeId
                            );
                    }

                    // Update the workflow's updated_at timestamp
                    state.workflows[workflowId].updated_at = new Date().toISOString();
                }
            })),

            // Update a specific connection
            updateConnection: (connectionData) => set(produce(state => {
                const workflowId = state.selectedWorkflowId;
                if (workflowId && state.workflows[workflowId]) {
                    // Ensure connections array exists
                    if (!state.workflows[workflowId].connections) {
                        state.workflows[workflowId].connections = [];
                    }

                    // Format to match your desired structure
                    const formattedConnection = {
                        from: {
                            node: connectionData.from.node,
                            output: connectionData.from.output || 'default'
                        },
                        to: {
                            node: connectionData.to.node,
                            input: connectionData.to.input || 'default'
                        }
                    };

                    // Check if connection already exists
                    const connectionExists = state.workflows[workflowId].connections.some(
                        conn => conn.from.node === formattedConnection.from.node &&
                            conn.from.output === formattedConnection.from.output &&
                            conn.to.node === formattedConnection.to.node &&
                            conn.to.input === formattedConnection.to.input
                    );

                    if (!connectionExists) {
                        // Add the new connection
                        state.workflows[workflowId].connections.push(formattedConnection);
                    }

                    // Update the workflow's updated_at timestamp
                    state.workflows[workflowId].updated_at = new Date().toISOString();
                }
            })),

            // Set all connections at once
            setConnections: (connections) => set(produce(state => {
                const workflowId = state.selectedWorkflowId;
                if (workflowId && state.workflows[workflowId]) {
                    // Ensure dsl_file exists

                    // Set the connections array
                    state.workflows[workflowId].connections = connections;

                    // Update the workflow's updated_at timestamp
                    state.workflows[workflowId].updated_at = new Date().toISOString();
                }
            })),

            // Update workflow metadata (like name, description, or any top-level property)
            updateWorkflowMetadata: (newMetadata) => set(produce(state => {
                const workflowId = state.selectedWorkflowId;
                if (workflowId && state.workflows[workflowId]) {
                    // Deep merge the new metadata with the existing workflow
                    Object.entries(newMetadata).forEach(([key, value]) => {
                        if (key === 'dsl_file' && typeof value === 'object') {
                            // Special handling for dsl_file to ensure we don't lose existing data
                            state.workflows[workflowId].dsl_file = {
                                ...(state.workflows[workflowId].dsl_file || {}),
                                ...value
                            };
                        } else {
                            // Update other properties directly
                            state.workflows[workflowId][key] = value;
                        }
                    });
                }
            })),

            // Utility methods to get data
            getNodes: () => {
                const state = get();
                const workflowId = state.selectedWorkflowId;
                if (workflowId && state.workflows[workflowId]?.dsl_file?.nodes) {
                    return state.workflows[workflowId].dsl_file.nodes;
                }
                return {};
            },

            getConnections: () => {
                const state = get();
                const workflowId = state.selectedWorkflowId;
                if (workflowId && state.workflows[workflowId]?.dsl_file?.connections) {
                    return state.workflows[workflowId].dsl_file.connections;
                }
                return [];
            },

            getNodeById: (nodeId) => {
                const state = get();
                const workflowId = state.selectedWorkflowId;
                if (workflowId && state.workflows[workflowId]?.dsl_file?.nodes?.[nodeId]) {
                    return state.workflows[workflowId].dsl_file.nodes[nodeId];
                }
                return null;
            },

            // Method to save workflow to backend (you'll need to implement the API call)
            saveWorkflow: async () => {
                const state = get();
                const workflowId = state.selectedWorkflowId;

                if (workflowId && state.workflows[workflowId]) {
                    try {
                        // Format the request body to match exactly what Swagger shows
                        const requestData = {
                            updated_at: new Date().toISOString(),
                            dsl_file: {
                                version: state.workflows[workflowId].version,
                                workflow_id: state.workflows[workflowId].workflow_id,
                                workflow_name: state.workflows[workflowId].workflow_name,
                                description: state.workflows[workflowId].description,
                                created_by: state.workflows[workflowId].created_by,
                                nodes: state.workflows[workflowId].nodes || {},
                                connections: state.workflows[workflowId].connections || [],
                                status: state.workflows[workflowId].status,
                                created_at: state.workflows[workflowId].created_at,
                            }
                        };

                        console.log("Saving workflow to backend:", requestData);

                        const response = await axios.put(
                            `${import.meta.env.VITE_API_URL}/workflows/${workflowId}`,
                            requestData
                        );

                        // Update local state with any changes from server
                        if (response.data) {
                            set(produce(state => {
                                // Make sure to update the updated_at field
                                state.workflows[workflowId].updated_at = requestData.updated_at;
                                // If you're storing dsl_file separately in your state, update it too
                                state.workflows[workflowId] = requestData.dsl_file;
                            }));
                        }

                        return { success: true, message: "Workflow saved successfully" };
                    } catch (error) {
                        console.error("Error saving workflow:", error);
                        return { success: false, message: "Failed to save workflow" };
                    }
                }

                return { success: false, message: "No workflow selected" };
            }
        }),
        {
            name: 'workflow-storage', // name of the item in localStorage
            storage: createJSONStorage(() => localStorage),
        }
    )
);

// Other stores remain unchanged
const workflowCreateStore = create((set) => ({
    appname: "Codecraft",
    description: "",
    setAppname: (newname) => set({ appname: newname }),
    setDescription: (newdescription) => set({ description: newdescription }),
}));

const useInputNodeStore = create((set) => ({
    inputNodeText: {},  // Initialize as an object to store text for each node by ID
    setInputNodeText: (nodeId, newText) =>
        set((state) => ({
            inputNodeText: {
                ...state.inputNodeText,
                [nodeId]: newText,  // Update only the text for the specific node
            },
        })),
}));

const useInputPromptStore = create((set) => ({
    input: "Default Prompt",
    setInputPrompt: (inputprompt) => set({ inputprompt }),
}));

const useModelConfigStore = create((set) => ({
    Modelconfig: {
        modelName: "ChatGPT",
        input: "",
        system_message: "",
        temperature: 0.5,
        maximum_tokens: 0,
        API_key: "",
    },
    setModelConfig: (newConfig) => set((state) => ({
        Modelconfig: { ...state.Modelconfig, ...newConfig }
    })),
}));
const useFileInputStore = create((set) => ({
    FileData: {
        filepath: "",
        fileText: "",
        fileBase64: "",
    },
    setFileConfig: (newData) => set((state) => ({
        FileData: { ...state.FileData, ...newData },
    })),
}));

export { useInputNodeStore, useInputPromptStore, useModelConfigStore, workflowCreateStore, useWorkflowStore,useFileInputStore };