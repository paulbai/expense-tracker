import React from 'react';
import { CATEGORIES } from '../../utils/constants';

const CategorySelector = ({ selectedCategory, onSelect, error }) => {
    return (
        <fieldset className="space-y-2">
            <legend className="field-label">Category</legend>
            <div className="grid grid-cols-3 sm:grid-cols-4 gap-3">
                {CATEGORIES.map((cat) => (
                    <button
                        key={cat.id}
                        type="button"
                        onClick={() => onSelect(cat.id)}
                        className={`
                            flex min-h-20 flex-col items-center justify-center gap-2 rounded-2xl border-2 p-3 transition-[background-color,border-color,color,transform,box-shadow] duration-200
                            ${selectedCategory === cat.id
                                ? 'bg-accent text-white border-accent shadow-lg scale-[1.02]'
                                : 'bg-bg text-secondary border-transparent hover:bg-elevated hover:border-border'
                            }
                        `}
                        aria-pressed={selectedCategory === cat.id}
                    >
                        <span className="text-2xl">{cat.icon}</span>
                        <span className="text-xs font-medium">{cat.label}</span>
                    </button>
                ))}
            </div>
            {error && <span className="field-error" role="alert">{error}</span>}
        </fieldset>
    );
};

export default CategorySelector;
