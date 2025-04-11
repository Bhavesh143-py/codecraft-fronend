import React, { useState, useRef, useEffect } from 'react';
import { MoreVertical, Trash2 } from 'lucide-react';

function AppCard({ card, index, onDelete, GetWorkflow }) {
    const [showOptionsMenu, setShowOptionsMenu] = useState(false);
    const menuRef = useRef(null);

    // Handle clicking outside to close the menu
    useEffect(() => {
        function handleClickOutside(event) {
            if (menuRef.current && !menuRef.current.contains(event.target)) {
                setShowOptionsMenu(false);
            }
        }

        document.addEventListener("mousedown", handleClickOutside);
        return () => {
            document.removeEventListener("mousedown", handleClickOutside);
        };
    }, []);

    const toggleOptionsMenu = (e) => {
        e.stopPropagation();
        setShowOptionsMenu(!showOptionsMenu);
    };

    const handleDelete = (e) => {
        e.stopPropagation();
        setShowOptionsMenu(false);

        // Confirmation dialog before deleting
        if (window.confirm(`Are you sure you want to delete "${card.workflow_name}"?`)) {
            // Call the delete function passed from parent
            if (onDelete) {
                onDelete(card.workflow_id);
            }
        }
    };

    // Check if card exists and has the required properties
    if (!card || !card.workflow_name) {
        return (
            <div className="relative bg-[#1f2937]/60 border border-white/10 backdrop-blur-lg p-5 rounded-2xl shadow-lg transition-all duration-300 flex flex-col justify-center items-center text-white min-h-[150px]">
                <p className="text-base font-semibold text-gray-400 text-center">
                    Loading Workflows
                </p>
            </div>
        );
    }

    return (
        <div
            key={index}

            className="relative bg-[#1f2937]/60 border border-white/10 backdrop-blur-lg p-5 rounded-2xl shadow-lg hover:shadow-blue-500/30 hover:scale-[1.03] transition-all duration-300 flex flex-col justify-between text-white min-h-[150px]"
        >
            <div className="absolute top-3 right-3" ref={menuRef}>
                <button
                    className="text-gray-400 hover:text-white transition"
                    onClick={toggleOptionsMenu}
                >
                    <MoreVertical size={20} />
                </button>

                {/* Options Menu */}
                {showOptionsMenu && (
                    <div className="absolute right-0 bottom-full mb-2 w-48 rounded-md shadow-lg bg-[#1f2937] border border-white/10 backdrop-blur-lg z-10">
                        <div className="py-1 rounded-md">
                            <button
                                className="flex items-center w-full px-4 py-2 text-sm text-gray-200 hover:bg-red-500 hover:text-white"
                                onClick={handleDelete}
                            >
                                <Trash2 size={16} className="mr-2" />
                                Delete
                            </button>
                        </div>
                    </div>
                )}
            </div>

            <div className="flex flex-col gap-3" onClick={() => GetWorkflow(card.workflow_id)}>
                <h2 className="text-lg font-bold text-white">{card.workflow_name}</h2>
                <p className="text-sm text-gray-300 leading-relaxed line-clamp-3">
                    {card.description || "No description available"}
                </p>
            </div>
        </div>
    );
}

export default AppCard;