import { configureStore, createSlice } from "@reduxjs/toolkit";
// Create a slice for workflow management (main part of the store)
const workflowSlice = createSlice({
    name: "workflows",
    selectedWorkflowId: null,
    initialState: {
        workflows: {},
        selectedWorkflowId: null,
    },
    reducers: {
        initializeWorkflow: (state, action) => {
            const { Id, workflowData } = action.payload;
            state.workflows[Id] = {
                version: 1.0,
                workflow_id: Id,
                workflow_name: workflowData.workflow_name,
                description: workflowData.description,
                created_by: workflowData.created_by,
                nodes: workflowData.nodes || {}, // Store nodes at the top level like in your desired format
                connections: workflowData.connections || [], // Store connections at the top level
                chatlogs: workflowData.chatlogs || [], // Store chatlogs at the top level
                status: workflowData.status || 'active',
                created_at: workflowData.created_at || new Date().toISOString(),
                updated_at: new Date().toISOString()
            };
        },
        selectWorkflow: (state, action) => {
            state.selectedWorkflowId = action.payload;
        },
        updateNode: (state, action) => {
            const { nodeId, nodeData } = action.payload;
            const workflowId = state.selectedWorkflowId;

            // Early return if workflow or node doesn't exist
            if (!state.workflows[workflowId]) return;

            const workflow = state.workflows[workflowId];
            workflow.nodes = workflow.nodes || {};

            if (!workflow.nodes[nodeId]) return;

            const node = workflow.nodes[nodeId];
            const nodeType = node.type;// Handle both possible property names

            // Update config based on node type
            if (nodeData.data) {
                const { data } = nodeData;

                if (nodeType === "Chat Input") {
                    node.config = {
                        ...node.config,
                        Text: data.text || data.Text || node.config.Text || "",
                        store_messages: data.storeMessages || data.store_messages || node.config.store_messages || false,
                        sessionID: data.sessionId || data.sessionID || node.config.sessionID || "",
                        files: data.files || node.config.files || ""
                    };
                } else if (nodeType === "Text Input") {
                    node.config = {
                        ...node.config,
                        Text: data.text || data.Text || node.config.Text || "hi"
                    };
                } else {
                    // For other node types, merge the data
                    node.config = {
                        ...node.config,
                        ...data
                    };
                }
            }

            // Update type if provided
            if (nodeData.type) {
                node.type = nodeData.type;
            }

            // Update position if provided
            if (nodeData.position) {
                node.position = nodeData.position;
            }

            // Update timestamp
            workflow.updated_at = new Date().toISOString();
        },
        addNode: (state, action) => {
            const { nodeData } = action.payload;
            const workflowId = state.selectedWorkflowId;
            if (!workflowId || !state.workflows[workflowId]) return;
            const workflow = state.workflows[workflowId];
            workflow.nodes = workflow.nodes || {};
            const { id, position = { x: 0, y: 0 }, type, label, data = {} } = nodeData;
            let nodeType;
            if (id.startsWith('model_')) {
                nodeType = data.modelName || "ModelNode";
            } else if (id.startsWith('file_')) {
                nodeType = "File";
            } else if (type === "ModelNode") {
                nodeType = data.modelName || "ModelNode";
            } else {
                // Use a mapping object instead of long conditional chain
                const typeMap = {
                    "Chat Input": "Chat Input",
                    "Text Input": "Text Input",
                    "Start Node": "Start Node",
                    "Chat Output": "Chat Output",
                    "Text Output": "Text Output"
                };
                nodeType = typeMap[label] || (type === "customFile" ? "File" : "customNode");
            }
            const formattedNode = {
                type: nodeType,
                id,
                position,
                config: {}
            };
            // Add type-specific configurations
            if (nodeType === "ModelNode" || type === "ModelNode") {
                formattedNode.config = {
                    modelName: data.modelName || "ChatGPT",
                    temperature: data.temperature || 0.5,
                    input: data.input || "",
                    system_message: data.system_message || "",
                    maximum_tokens: data.maximum_tokens || 4096,
                    API_key: data.API_key || ""
                };
            } else if (label === "Chat Input") {
                // Simplify nested data access
                const chatData = data.chatSettings || data;
                formattedNode.config = {
                    Text: chatData.text || chatData.Text || "",
                    store_messages: chatData.storeMessages || chatData.store_messages || false,
                    sessionID: chatData.sessionId || chatData.sessionID || "",
                    files: chatData.files || "path_to_file"
                };
            } else if (label === "Text Input") {
                const textData = data.chatSettings || data;
                formattedNode.config = {
                    Text: textData.text || textData.Text || "hi"
                };
            } else if (type === "customFile") {
                formattedNode.config = {
                    fileName: data.fileName || "",
                };
            }

            // Add the node to the workflow
            workflow.nodes[id] = formattedNode;
            workflow.updated_at = new Date().toISOString();

        },
        removeNode: (state, action) => {
            const { nodeId } = action.payload;
            const workflowId = state.selectedWorkflowId;
            if (!workflowId || !state.workflows[workflowId]) return;
            const workflow = state.workflows[workflowId];
            if (workflow.nodes && workflow.nodes[nodeId]) {
                delete workflow.nodes[nodeId];
                if (state.workflows[workflowId].connections) {
                    state.workflows[workflowId].connections =
                        state.workflows[workflowId].connections.filter(conn =>
                            conn.from.node !== nodeId && conn.to.node !== nodeId
                        );
                }
                workflow.updated_at = new Date().toISOString();
            }
        },
        setConnection: (state, action) => {
            const workflowId = state.selectedWorkflowId;
            if (workflowId && state.workflows[workflowId]) {
                // Ensure dsl_file exists

                // Set the connections array
                state.workflows[workflowId].connections = connections;

                // Update the workflow's updated_at timestamp
                state.workflows[workflowId].updated_at = new Date().toISOString();
            }

        },
        updateConnection: (state, action) => {
            const {connectionData} = action.payload;
            const workflowId = state.selectedWorkflowId;
            if (!workflowId || !state.workflows[workflowId]) return;
            if (!state.workflows[workflowId].connections) {
                state.workflows[workflowId].connections = [];
            }
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
            state.workflows[workflowId].updated_at = new Date().toISOString();
        },
        updateWorkflow: (state, action) => {
            const { workflowId, newWorkflow } = action.payload;

            if (workflowId && state.workflows[workflowId]) {
                // Go through each key in the new workflow
                Object.entries(newWorkflow).forEach(([key, value]) => {
                    // If the value is an object, do a deep merge (for nested objects like dsl_file)
                    if (
                        typeof value === 'object' &&
                        value !== null &&
                        !Array.isArray(value)
                    ) {
                        state.workflows[workflowId][key] = {
                            ...(state.workflows[workflowId][key] || {}),
                            ...value,
                        };
                    } else {
                        // Replace directly for primitives or arrays
                        state.workflows[workflowId][key] = value;
                    }
                });
            }
        },  
    },
    extraReducers: (builder) => {
        // Thunk action to save the workflow to the server
        builder.addCase("workflows/saveWorkflow", (state, action) => {
            const { workflowId, workflow } = action.payload;

            if (workflowId && state.workflows[workflowId]) {
                axios
                    .put(`${import.meta.env.VITE_API_URL}/workflows/${workflowId}`, workflow)
                    .then((response) => {
                        if (response.status === 200) {
                            state.workflows[workflowId] = response.data;
                            state.workflows[workflowId].updated_at = new Date().toISOString();
                        } else {
                            console.error("Failed to save workflow", response);
                        }
                    })
                    .catch((error) => {
                        console.error("Error saving workflow:", error);
                    });
            }
        });
    },
});
export const {
    initializeWorkflow,
    selectWorkflow,
    updateNode,
    addNode,
    removeNode,
    setConnection,
    updateConnection
} = workflowSlice.actions;
const store = configureStore({
    reducer: {
        workflows: workflowSlice.reducer,
    },
});
export default store;
