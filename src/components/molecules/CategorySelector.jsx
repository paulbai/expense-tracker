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
                            flex flex-col items-center justify-center gap-2 p-3 rounded-2xl transition-all duration-200
                            border-2 group
                            ${selectedCategory === cat.id
                                ? 'bg-accent text-white border-accent shadow-lg scale-105'
                                : 'bg-bg text-secondary border-transparent hover:bg-surface hover:border-white/5'
                            }
                        `}
                    >
                        <span className="text-2xl">{cat.icon}</span>
                        <span className="text-xs font-medium">{cat.label}</span>
                    </button>
                ))}
            </div>
            {error && <span className="text-xs text-red-500 ml-1">{error}</span>}
        </div>
    );
};

export default CategorySelector;
