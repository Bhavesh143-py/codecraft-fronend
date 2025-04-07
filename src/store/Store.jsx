import {configureStore ,createSlice } from "@reduxjs/toolkit";
// Create a slice for workflow management (main part of the store)
const workflowSlice = createSlice({
    name: "workflow",
    selectedWorkflowId: null,
    initialState: {
        workflows: {},
        selectedWorkflowId: null,
    },
    reducers: {
        initializeWorkflow: (state, action) => {
            const { Id, workflowData } = action.payload;
            state.workflows[Id] = workflowData;
            state.selectedWorkflowId = workflowId; // Set the selected workflow ID
        },
        selectWorkflow: (state, action) => {
            state.selectedWorkflowId = action.payload;
        },
        updateWorkflow: (state, action) => {
            const { workflowId, updatedData } = action.payload;
            if (state.workflows[workflowId]) {
                state.workflows[workflowId] = {
                    ...state.workflows[workflowId],
                    ...updatedData,
                };
            }
        },
    },
});
