import { configureStore, createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { persistStore, persistReducer } from 'redux-persist';
import storage from 'redux-persist/lib/storage'; // defaults to localStorage for web
import axios from "axios";

// Async thunk for saving workflow to backend
export const saveWorkflow = createAsyncThunk(
    "workflows/saveWorkflow",
    async (_, { getState }) => {
        const state = getState().workflows;
        const workflowId = state.selectedWorkflowId;

        if (workflowId && state.workflows[workflowId]) {
            try {
                // Format the request body to match backend expectations
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

                return response.data;
            } catch (error) {
                console.error("Error saving workflow:", error);
                throw error;
            }
        }

        throw new Error("No workflow selected");
    }
);

// Create a slice for workflow management
const workflowSlice = createSlice({
    name: "workflows",
    initialState: {
        workflows: {},
        selectedWorkflowId: null,
        loading: false,
        error: null,
    },
    reducers: {
        initializeWorkflow: (state, action) => {
            const { id, workflowData } = action.payload;
            state.workflows[id] = {
                version: 1.0,
                workflow_id: id,
                workflow_name: workflowData.workflow_name,
                description: workflowData.description,
                created_by: workflowData.created_by,
                nodes: workflowData.nodes || {},
                connections: workflowData.connections || [],
                chatlogs: workflowData.chatlogs || [],
                status: workflowData.status || 'active',
                created_at: workflowData.created_at || new Date().toISOString(),
                updated_at: new Date().toISOString()
            };
        },

        selectWorkflow: (state, action) => {
            state.selectedWorkflowId = action.payload;
        },

        updateNode: (state, action) => {
            const { nodeId, newData } = action.payload;
            const workflowId = state.selectedWorkflowId;

            if (!workflowId || !state.workflows[workflowId]) return;
            if (!state.workflows[workflowId].nodes) {
                state.workflows[workflowId].nodes = {};
            }
            if (!state.workflows[workflowId].nodes[nodeId]) return;

            const node = state.workflows[workflowId].nodes[nodeId];
            const nodeType = node.type;

            // Update the node data based on node type
            if (newData.data) {
                if (nodeType === "Chat Input") {
                    node.config = {
                        ...node.config,
                        Text: newData.data.text || newData.data.Text || node.config.Text || "",
                        store_messages: newData.data.storeMessages || newData.data.store_messages || node.config.store_messages || false,
                        sessionID: newData.data.sessionId || newData.data.sessionID || node.config.sessionID || "",
                        files: newData.data.files || node.config.files || ""
                    };
                }
                else if (nodeType === "Text Input") {
                    node.config = {
                        ...node.config,
                        Text: newData.data.text || newData.data.Text || node.config.Text || "hi"
                    };
                }
                else {
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

            // Update timestamp
            state.workflows[workflowId].updated_at = new Date().toISOString();
        },

        addNode: (state, action) => {
            const nodeData = action.payload;
            const workflowId = state.selectedWorkflowId;

            if (!workflowId || !state.workflows[workflowId]) return;

            if (!state.workflows[workflowId].nodes) {
                state.workflows[workflowId].nodes = {};
            }

            let nodeType;

            if (nodeData.id.startsWith('model_')) {
                nodeType = "LLM";
            } else if (nodeData.id.startsWith('file_')) {
                nodeType = "File";
            } else if (nodeData.type === "ModelNode") {
                nodeType = nodeData.data && nodeData.data.modelName ? nodeData.data.modelName : "ModelNode";
            } else {
                nodeType =
                    nodeData.label === "Chat Input" ? "Chat Input" :
                        nodeData.label === "Text Input" ? "Text Input" :
                            nodeData.label === "Start Node" ? "Start Node" :
                                nodeData.label === "Chat Output" ? "Chat Output" :
                                    nodeData.label === "Text Output" ? "Text Output" :
                                        nodeData.type === "customFile" ? "File" :
                                            "customNode";
            }

            const formattedNode = {
                type: nodeType,
                id: nodeData.id,
                position: nodeData.position || { x: 0, y: 0 },
                config: {
                    ...(nodeData.type === "ModelNode" && {
                        "Model Name": nodeData.data?.["Model Name"] || "ChatGPT",
                        temperature: nodeData.data?.temperature || 0.5,
                        maximum_tokens: nodeData.data?.maximum_tokens || 4096,
                        "user prompt": nodeData.data?.["user prompt"] || "",
                        "system prompt": nodeData.data?.["system prompt"] || "",
                        "API KEY": nodeData.data?.["API KEY"] || "",
                        "nodeId": nodeData.data?.nodeId || ""
                    }),
                    ...(nodeData.label === "Chat Input" && {
                        Text: nodeData.data?.text ||
                            nodeData.data?.Text ||
                            nodeData.data?.chatSettings?.Text || "",
                        nodeId: nodeData.data?.nodeId || ""
                    }),
                    ...(nodeData.label === "Text Input" && {
                        Text: nodeData.data?.text ||
                            nodeData.data?.Text ||
                            nodeData.data?.chatSettings?.text || "hi",
                        nodeId: nodeData.data?.nodeId || ""
                    }),
                    ...(nodeData.type === "customFile" && {
                        filename: (nodeData.data && nodeData.data.filename) || " ",
                        fileBase64: (nodeData.data && nodeData.data.fileBase64) || " ",
                        fileText: (nodeData.data && nodeData.data.fileText) || " ",
                    })
                }
            };

            state.workflows[workflowId].nodes[nodeData.id] = formattedNode;
            state.workflows[workflowId].updated_at = new Date().toISOString();
        },

        removeNode: (state, action) => {
            const nodeId = action.payload;
            const workflowId = state.selectedWorkflowId;

            if (!workflowId || !state.workflows[workflowId]?.nodes) return;

            // Remove the node
            delete state.workflows[workflowId].nodes[nodeId];

            // Also remove any connections involving this node
            if (state.workflows[workflowId].connections) {
                state.workflows[workflowId].connections =
                    state.workflows[workflowId].connections.filter(conn =>
                        conn.from.node !== nodeId && conn.to.node !== nodeId
                    );
            }

            // Update timestamp
            state.workflows[workflowId].updated_at = new Date().toISOString();
        },

        setConnections: (state, action) => {
            const connections = action.payload;
            const workflowId = state.selectedWorkflowId;

            if (!workflowId || !state.workflows[workflowId]) return;

            // Set the connections array
            state.workflows[workflowId].connections = connections;

            // Update timestamp
            state.workflows[workflowId].updated_at = new Date().toISOString();
        },

        updateConnection: (state, action) => {
            const connectionData = action.payload;
            const workflowId = state.selectedWorkflowId;

            if (!workflowId || !state.workflows[workflowId]) return;

            // Ensure connections array exists
            if (!state.workflows[workflowId].connections) {
                state.workflows[workflowId].connections = [];
            }

            // Format to match desired structure
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

            // Update timestamp
            state.workflows[workflowId].updated_at = new Date().toISOString();
        },

        updateWorkflowMetadata: (state, action) => {
            const newMetadata = action.payload;
            const workflowId = state.selectedWorkflowId;

            if (!workflowId || !state.workflows[workflowId]) return;

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

            // Update timestamp
            state.workflows[workflowId].updated_at = new Date().toISOString();
        },

        // Clear error state
        clearError: (state) => {
            state.error = null;
        }
    },
    extraReducers: (builder) => {
        builder
            .addCase(saveWorkflow.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(saveWorkflow.fulfilled, (state, action) => {
                state.loading = false;
                const workflowId = state.selectedWorkflowId;
                if (workflowId && action.payload) {
                    // Update the workflow with the response data
                    state.workflows[workflowId] = {
                        ...state.workflows[workflowId],
                        ...(action.payload.dsl_file || action.payload),
                        updated_at: new Date().toISOString()
                    };
                }
            })
            .addCase(saveWorkflow.rejected, (state, action) => {
                state.loading = false;
                state.error = action.error.message || "Failed to save workflow";
                console.error("Error saving workflow:", action.error);
            });
    }
});

// Persistence configuration
const persistConfig = {
    key: 'workflow-storage',
    storage,
    whitelist: ['workflows', 'selectedWorkflowId'], // persist workflows and selectedWorkflowId
    blacklist: ['loading', 'error'], // don't persist loading and error states
};

// Create persisted reducer
const persistedReducer = persistReducer(persistConfig, workflowSlice.reducer);

// Create the store
const store = configureStore({
    reducer: {
        workflows: persistedReducer,
    },
    middleware: (getDefaultMiddleware) =>
        getDefaultMiddleware({
            serializableCheck: {
                ignoredActions: [
                    'persist/PERSIST',
                    'persist/REHYDRATE',
                    'persist/PAUSE',
                    'persist/PURGE',
                    'persist/REGISTER'
                ],
            },
        }),
});

// Create persistor
export const persistor = persistStore(store);

// Export actions
export const {
    initializeWorkflow,
    selectWorkflow,
    updateNode,
    addNode,
    removeNode,
    setConnections,
    updateConnection,
    updateWorkflowMetadata,
    clearError
} = workflowSlice.actions;

// Create selectors
export const selectNodes = (state) => {
    const workflowId = state.workflows.selectedWorkflowId;
    if (workflowId && state.workflows.workflows[workflowId]?.nodes) {
        return state.workflows.workflows[workflowId].nodes;
    }
    return {};
};

export const selectConnections = (state) => {
    const workflowId = state.workflows.selectedWorkflowId;
    if (workflowId && state.workflows.workflows[workflowId]?.connections) {
        return state.workflows.workflows[workflowId].connections;
    }
    return [];
};

export const selectNodeById = (nodeId) => (state) => {
    const workflowId = state.workflows.selectedWorkflowId;
    if (workflowId && state.workflows.workflows[workflowId]?.nodes?.[nodeId]) {
        return state.workflows.workflows[workflowId].nodes[nodeId];
    }
    return null;
};

export const selectSelectedWorkflow = (state) => {
    const workflowId = state.workflows.selectedWorkflowId;
    if (workflowId) {
        return state.workflows.workflows[workflowId];
    }
    return null;
};

export const selectWorkflowLoading = (state) => state.workflows.loading;
export const selectWorkflowError = (state) => state.workflows.error;

// Export store as default
export default store;