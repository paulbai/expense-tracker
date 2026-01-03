import React from 'react';
import { Plus } from 'lucide-react';

const FloatingButton = ({ onClick }) => {
    return (
        <button
            onClick={onClick}
            className="fixed bottom-6 right-6 z-40 bg-gradient-to-r from-violet-600 to-pink-500 text-white p-4 rounded-full shadow-[0_10px_20px_rgba(139,92,246,0.5)] hover:shadow-[0_15px_25px_rgba(139,92,246,0.6)] hover:scale-110 active:scale-95 transition-all duration-300 group"
            aria-label="Add Expense"
        >
            <Plus size={32} className="group-hover:rotate-90 transition-transform duration-300" />
        </button>
    );
};

export default FloatingButton;
