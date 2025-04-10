import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
// import loginImg from "../assets/Login.svg";

export default function SignUp() {
  const [userId, setUserId] = useState("");
  const [pass, setPass] = useState("");
  const navigate = useNavigate();

  const handleLogin = (e) => {
    e.preventDefault();
    console.log("Login successful");
    navigate("/apps");
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
        <div className="w-full max-w-6xl min-h-[550px] bg-white/10 backdrop-blur-lg border border-white/10 rounded-3xl overflow-hidden shadow-xl flex flex-col md:flex-row transition-all duration-500">

          {/* Left - Form Section */}
          <div className="w-full md:w-1/2 p-10 flex flex-col justify-center">
            <h2 className="text-4xl font-bold mb-2 text-white" style={fadeInStyle()}>Welcome back 👋</h2>
            <p className="text-gray-300 mb-8 font-light" style={fadeInStyle("0.2s")}>
              Please enter your details below
            </p>

            <form className="space-y-6" onSubmit={handleLogin} style={fadeInStyle("0.3s")}>
              {/* Username */}
              <div>
                <label htmlFor="username" className="block text-sm font-medium mb-1 text-gray-300">
                  Username
                </label>
                <input
                  id="username"
                  type="text"
                  value={userId}
                  onChange={(e) => setUserId(e.target.value)}
                  placeholder="Enter your username"
                  className="w-full px-4 py-3 rounded-xl bg-white/10 border border-white/20 placeholder-gray-400 text-white focus:ring-2 focus:ring-[#05a8ed] focus:outline-none transition-all duration-300"
                />
              </div>

              {/* Password */}
              <div>
                <label htmlFor="password" className="block text-sm font-medium mb-1 text-gray-300">
                  Password
                </label>
                <input
                  id="password"
                  type="password"
                  value={pass}
                  onChange={(e) => setPass(e.target.value)}
                  placeholder="Enter your password"
                  className="w-full px-4 py-3 rounded-xl bg-white/10 border border-white/20 placeholder-gray-400 text-white focus:ring-2 focus:ring-[#05a8ed] focus:outline-none transition-all duration-300"
                />
              </div>

              {/* Buttons */}
              <div className="flex flex-col sm:flex-row gap-4 mt-4">
                <button
                  type="submit"
                  className="w-full py-3 rounded-xl font-semibold shadow-lg bg-gradient-to-r from-[#12f4b7] to-[#05a8ed] hover:scale-105 transition-all duration-300"
                >
                  Login
                </button>

                <button
                  type="button"
                  className="w-full py-3 rounded-xl bg-white/10 border border-white/20 text-white hover:bg-white/20 transition-all duration-300"
                >
                  Forgot Password?
                </button>
              </div>
            </form>
          </div>

          {/* Right - Illustration */}
          <div className="w-full md:w-1/2 p-10 flex items-center justify-center bg-transparent" style={fadeInStyle("0.6s")}>
            {/* <img
              src={loginImg}
              alt="Login Illustration"
              className="w-80 max-w-full drop-shadow-2xl"
            /> */}
          </div>
        </div>
      </div>
    </>
  );
}
