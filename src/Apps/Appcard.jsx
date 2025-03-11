import React, { useState, useEffect } from "react";
import axios from "axios";

const AppsList = () => {
    const [apps, setApps] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchApps = async () => {
            try {
                const response = await axios.get(`${import.meta.env.VITE_API_URL}/user/all`);
                setApps(Array.isArray(response.data) ? response.data : []);// Assuming API returns an array
            } catch (err) {
                setError("Failed to fetch apps. Please try again.");
                console.error("Error fetching apps:", err);
            } finally {
                setLoading(false);
            }
        };

        fetchApps();
    }, []);

    if (loading) return <p className="text-center text-gray-500">Loading apps...</p>;
    if (error) return <p className="text-center text-red-500">{error}</p>;

    return (
        <div className="p-6 max-w-3xl mx-auto">
            <h2 className="text-2xl font-semibold text-gray-800 mb-4">Available Apps</h2>
            {apps.length === 0 ? (
                <p className="text-gray-500">No apps found.</p>
            ) : (
                <ul className="space-y-4">
                    {apps.map((app) => (
                        <li key={app.workflow_id} className="p-4 border rounded-lg shadow-md bg-white">
                            <h3 className="text-lg font-semibold text-blue-600">{app.workflow_name}</h3>
                            <p className="text-gray-700">{app.description || "No description available."}</p>
                        </li>
                    ))}
                </ul>
            )}
        </div>
    );
};

export default AppsList;
