import React, { useState } from "react";
import { useNavigate } from "react-router-dom"; // Import useNavigate hook
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { useWorkflowStore, workflowCreateStore } from "../store/Mystore";
import axios from "axios";
const CreateApp = () => {
    const { initializeWorkflow, selectWorkflow } =useWorkflowStore();
    const { appname, description, setAppname, setDescription } = workflowCreateStore();
    const [isAppCreated, setIsAppCreated] = useState(false);
    const navigate = useNavigate(); // Initialize useNavigate hook

    const handleCancel = () => {
        setAppname("");
        setDescription("");
        setIsAppCreated(false); // Reset after cancel
        navigate("/apps")
    };
    const PostApp = async () => {
        try {
            const payload = {
                workflow_name: appname,
                description: description,
                created_by: "3fa85f64-5717-4562-b3fc-2c963f66afa6",
                dsl_file: {}
            };

            const response = await axios.post(`${import.meta.env.VITE_API_URL}/workflows/create`, payload);
            console.log("API Response:", response.data);

            // Make sure we're using the correct ID
            const workflowId = response.data.id || response.data.workflow_id;

            // Initialize with the complete structure
            initializeWorkflow(workflowId, {
                ...response.data,
                dsl_file: {
                    ...(response.data.dsl_file || {})   
                },
                nodes:{},
                connections:[]
            });

            selectWorkflow(workflowId);
            console.log("After initialization:", useWorkflowStore.getState());
            return true;
        } catch (error) {
            console.error("API Error:", error.response ? error.response.data : error.message);
            toast.error("Failed to create the app. Please try again.", {
                position: "top-right",
                autoClose: 3000,
                hideProgressBar: true,
            });
            return false;
        }
    };
    const handleCreate = async () => {
        const success = await PostApp(); 
        if (success) {
            toast.success("Your app has been successfully created!", {
                position: "top-right", // Positioning the toast message on the top-right
                autoClose: 3000, // Toast message will disappear after 3 seconds
                hideProgressBar: true, // Hides the progress bar
            });
            setIsAppCreated(true); // Indicate that the app was created

            // Redirect to the next page after the app is created
            setTimeout(() => {
                navigate("/canvas"); // Change "/next-page" to your desired path
            }, 3000); // Redirect after 3 seconds
        }
    };

    return (
        <div className="bg-gradient-to-t from-blue-100 to-green-100 min-h-screen relative">
            {/* Create App Form */}
            <div className="flex items-center justify-center min-h-screen bg-transparent relative z-10">
                <div className="w-full max-w-md bg-white rounded-xl shadow-xl p-8">
                    <h3 className="text-3xl font-semibold text-[#000000] mb-6 text-center">
                        Create Your App
                    </h3>

                    <div className="mb-6">
                        <input
                            type="text"
                            placeholder="Give your app a name"
                            value={appname}
                            onChange={(e) => setAppname(e.target.value)}
                            className="w-full px-6 py-3 mb-4 border border-gray-300 rounded-lg bg-gray-50 focus:ring-2 focus:ring-blue-500 focus:outline-none transition-all duration-300 shadow-sm"
                        />
                        <textarea
                            placeholder="Enter the description of your app"
                            value={description}
                            onChange={(e) => setDescription(e.target.value)}
                            className="w-full px-6 py-3 h-24 border border-gray-300 rounded-lg bg-gray-50 focus:ring-2 focus:ring-blue-500 focus:outline-none transition-all duration-300 shadow-sm"
                        ></textarea>
                    </div>

                    <div className="flex justify-between space-x-4">
                        <button
                            onClick={handleCancel}
                            className="px-6 py-3 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-100 focus:ring-2 focus:ring-blue-500 transition-all duration-300"
                        >
                            Cancel
                        </button>
                        <button
                            onClick={handleCreate}
                            disabled={!appname.trim()}
                            className={`px-6 py-3 text-white rounded-lg w-full ${appname.trim()
                                    ? "bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700"
                                    : "bg-gray-300 cursor-not-allowed"
                                }`}
                        >
                            {isAppCreated ? "Redirecting..." : "Create"}
                        </button>
                    </div>
                </div>
            </div>

            {/* Toast Container */}
            <ToastContainer />
        </div>
    );
};

export default CreateApp;
