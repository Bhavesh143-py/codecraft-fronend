import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import Navbar from '../navbar/navbar'


export default function SignUp() {
    const [userId, setUserId] = useState('')
    const [pass, setPass] = useState('')
    
    const navigate = useNavigate();
    const handleChange = (e) => {
        setUserId(e.target.value)
    }
    const handlePass = (e) => {
        setPass(e.target.value)
    }
    const handleLogin = () => {
            console.log("Login successful")
            navigate('/apps')
        
    }

    return (
        <>
            <Navbar />
            <div className="flex justify-center items-center min-h-screen bg-gray-100">
                <div className="flex flex-col p-8 rounded-xl shadow-lg bg-white max-w-sm w-full">
                    <h1 className="text-3xl font-semibold text-gray-800 mb-4">Login</h1>
                    <p className="text-gray-600 mb-6">Welcome back to the workspace!</p>

                    <div className="flex flex-col mb-4">
                        <input
                            type="text"
                            value={userId}
                            placeholder="Enter your username"
                            className="w-full p-3 mb-4 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                            onChange={handleChange}
                        />
                        <input
                            type="password"
                            value={pass}
                            placeholder="Enter password"
                            className="w-full p-3 mb-6 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                            onChange={handlePass}
                        />
                    </div>

                    <div className="flex flex-col space-y-4">
                        <button className="w-full py-3 bg-blue-500 text-white font-semibold rounded-lg hover:bg-blue-600 transition duration-200" onClick={handleLogin}>
                            Login
                        </button>
                        <button className="w-full py-3 bg-gray-200 text-gray-700 font-semibold rounded-lg hover:bg-gray-300 transition duration-200">
                            Forgot password?
                        </button>
                    </div>
                </div>
            </div>
        </>
    )
}
