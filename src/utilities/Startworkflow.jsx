import axios from 'axios';
const handleStartWorkflow = async (workflowId) => {
    try {
        // Start the workflow
        const response = await axios.post(`${import.meta.env.VITE_API_URL}/workflows/${workflowId}/start`);
        console.log("Workflow started successfully:", response.data);
        return response.data;
    } catch (error) {
        console.error("Error starting workflow:", error);
        throw new Error("Error starting workflow");
    }
}
export default handleStartWorkflow;