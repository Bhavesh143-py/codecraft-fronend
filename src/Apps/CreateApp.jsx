import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { useWorkflowStore, workflowCreateStore } from "../store/Mystore";
import axios from "axios";
// import appImg from "../assets/create.svg";
// import congratulation from "../assets/congratulation.png"


const CreateApp = () => {
  const { initializeWorkflow, selectWorkflow } = useWorkflowStore();
  const { appname, description, setAppname, setDescription } = workflowCreateStore();
  const [isAppCreated, setIsAppCreated] = useState(false);
  const navigate = useNavigate();

  const handleCancel = () => {
    setAppname("");
    setDescription("");
    setIsAppCreated(false);
    navigate("/apps");
  };

  const PostApp = async () => {
    try {
      const payload = {
        workflow_name: appname,
        description,
        created_by: "3fa85f64-5717-4562-b3fc-2c963f66afa6",
        dsl_file: {},
      };

      const response = await axios.post(`${import.meta.env.VITE_API_URL}/workflows/create`, payload);
      const workflowId = response.data.id || response.data.workflow_id;

      initializeWorkflow(workflowId, {
        ...response.data,
        nodes: {},
        connections: [],
      });

      selectWorkflow(workflowId);
      return true;
    } catch (error) {
      console.error("API Error:", error.response ? error.response.data : error.message);
      toast.error("Failed to create the app. Please try again.", {
        position: "top-right",
        autoClose: 4000,
        hideProgressBar: true,
      });
      return false;
    }
  };

  const handleCreate = async () => {
    const success = await PostApp();
    if (success) {
      toast.success("Your app has been successfully created!", {
        position: "top-right",
        autoClose: 3000,
        hideProgressBar: true,
      });
      setIsAppCreated(true);
      setTimeout(() => {
        navigate("/canvas");
      }, 3000);
    }
  };

  const fadeInStyle = (delay = "0s") => ({
    animation: `fade-in-up 0.7s ease-out ${delay} forwards`,
    opacity: 0,
    transform: "translateY(20px)",
  });

  return (
    <>
      <style>{`
        @keyframes fade-in-up {
          0% { opacity: 0; transform: translateY(20px); }
          100% { opacity: 1; transform: translateY(0); }
        }
      `}</style>
  
      <div className="min-h-screen flex items-center justify-center px-4 py-10 bg-gradient-to-br from-[#0f111a] via-[#1a1d2b] to-[#0f111a] text-white font-inter">
      {isAppCreated ? (
  // 🎉 Congrats Layout
  <div className="w-full max-w-6xl min-h-[550px] bg-white/10 backdrop-blur-lg border border-white/10 rounded-3xl overflow-hidden shadow-xl flex flex-col md:flex-row animate-fade-in-up">
    
    {/* Left: Message */}
    <div className="w-full md:w-1/2 p-5 flex flex-col justify-center items-center text-center">
      {/* Centered SVG on top */}
      <div className="">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          className="text-yellow-400 w-30 h-30 drop-shadow-xl animate-bounce"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
          strokeWidth={2}
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M12 4.75l2.122 4.3 4.75.693-3.436 3.35.812 4.734L12 15.963 7.752 17.827l.812-4.734-3.436-3.35 4.75-.693L12 4.75z"
          />
        </svg>
      </div>

      <h2 className="text-5xl font-bold text-white mb-4">Congratulations!</h2>
      <p className="text-lg text-white/80 max-w-md">
        Your app has been successfully created 🎉
      </p>
    </div>

    {/* Right: Image */}
    <div className="w-full md:w-1/2 p-10 flex items-center justify-center bg-transparent">
      {/* <img
        src={congratulation}
        alt="App Illustration"
        className="w-fit max-w-full drop-shadow-2xl animate-fade-in-up"
      /> */}
    </div>
  </div>
) : (
          <div className="w-full max-w-6xl min-h-[550px] bg-white/10 backdrop-blur-lg border border-white/10 rounded-3xl overflow-hidden shadow-xl flex flex-col md:flex-row">
            
            {/* Left: Form */}
            <div className="w-full md:w-1/2 p-10 flex flex-col justify-center">
              <h2 className="text-4xl font-bold mb-8 text-white" style={fadeInStyle("0s")}>
                Create Your App
              </h2>
  
              <div className="space-y-6" style={fadeInStyle("0.2s")}>
                <div>
                  <label className="block text-sm font-medium mb-1 text-gray-300">App Name</label>
                  <input
                    type="text"
                    value={appname}
                    onChange={(e) => setAppname(e.target.value)}
                    placeholder="Give your app a name"
                    className="w-full px-4 py-3 rounded-xl bg-white/10 border border-white/20 placeholder-gray-400 text-white focus:ring-2 focus:ring-[#05a8ed] focus:outline-none transition-all duration-300"
                  />
                </div>
  
                <div>
                  <label className="block text-sm font-medium mb-1 text-gray-300">Description</label>
                  <textarea
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    placeholder="Enter app description"
                    className="w-full px-4 py-3 h-28 rounded-xl bg-white/10 border border-white/20 placeholder-gray-400 text-white focus:ring-2 focus:ring-[#05a8ed] focus:outline-none transition-all duration-300 resize-none"
                  />
                </div>
  
                <div className="flex flex-col sm:flex-row gap-4 mt-4" style={fadeInStyle("0.4s")}>
                  <button
                    onClick={handleCancel}
                    className="w-full py-3 rounded-xl bg-white/10 border border-white/20 text-white hover:bg-white/20 transition"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={handleCreate}
                    disabled={!appname.trim()}
                    className={`w-full py-3 rounded-xl font-semibold shadow-lg transition-all duration-300 ${
                      appname.trim()
                        ? "bg-gradient-to-r from-[#12f4b7] to-[#05a8ed] hover:scale-105"
                        : "bg-gray-400 cursor-not-allowed"
                    }`}
                  >
                    Create App
                  </button>
                </div>
              </div>
            </div>
  
            {/* Right: Illustration */}
            <div className="w-full md:w-1/2 p-10 flex items-center justify-center bg-transparent" style={fadeInStyle("0.6s")}>
              {/* <img src={appImg} alt="App Illustration" className="w-80 max-w-full drop-shadow-2xl" /> */}
            </div>
          </div>
        )}
        <ToastContainer />
      </div>
    </>
  );
  
  
};

export default CreateApp;
