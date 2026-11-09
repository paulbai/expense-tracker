import React from 'react';
import { Plus } from 'lucide-react';

const FloatingButton = ({ onClick }) => {
    return (
        <button
            onClick={onClick}
            className="fixed bottom-6 right-6 z-40 rounded-full bg-gradient-to-r from-violet-600 to-pink-500 p-4 text-white shadow-[0_10px_20px_rgba(139,92,246,0.5)] transition-[box-shadow,transform] duration-300 hover:scale-110 hover:shadow-[0_15px_25px_rgba(139,92,246,0.6)] active:scale-95 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-offset-2 focus-visible:ring-offset-bg group"
            aria-label="Add Expense"
        >
            <Plus size={32} className="group-hover:rotate-90 transition-transform duration-300" />
        </button>
    );
};

export default FloatingButton;
