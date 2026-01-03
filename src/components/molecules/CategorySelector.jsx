import React from 'react';
import { CATEGORIES } from '../../utils/constants';

const CategorySelector = ({ selectedCategory, onSelect, error }) => {
    return (
        <div className="space-y-2">
            <label className="text-sm font-medium text-gray-400 ml-1">Category</label>
            <div className="grid grid-cols-3 sm:grid-cols-4 gap-3">
                {CATEGORIES.map((cat) => (
                    <button
                        key={cat.id}
                        type="button"
                        onClick={() => onSelect(cat.id)}
                        className={`
                            flex flex-col items-center justify-center p-3 rounded-2xl transition-all duration-200
                            border
                            ${selectedCategory === cat.id
                                ? 'bg-violet-500 text-white border-violet-500 shadow-lg shadow-violet-500/25 scale-105'
                                : 'bg-[#1a1d29] text-gray-400 border-transparent hover:bg-[#2a2f3e] hover:border-white/5'
                            }
                        `}
                    >
                        <span className="text-2xl mb-1">{cat.icon}</span>
                        <span className="text-xs font-medium">{cat.label}</span>
                    </button>
                ))}
            </div>
            {error && <span className="text-xs text-red-500 ml-1">{error}</span>}
        </div>
    );
};

export default CategorySelector;
