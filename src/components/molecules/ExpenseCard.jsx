import React from 'react';
import { Pencil, Trash2 } from 'lucide-react';
import { CATEGORIES } from '../../utils/constants';
import { formatCurrency } from '../../utils/calculations';

const ExpenseCard = ({ expense, onEdit, onDelete }) => {
    const categoryData = CATEGORIES.find(c => c.id === expense.category) || {};

    return (
        <div className="group bg-surface p-4 rounded-2xl flex items-center justify-between transition-all hover:brightness-105 hover:shadow-lg">
            <div className="flex items-center gap-4">
                {/* Icon Container with Neumorphic Inset */}
                <div className="w-12 h-12 rounded-2xl bg-bg flex items-center justify-center text-2xl shadow-neu-inset border border-white/5">
                    {categoryData ? categoryData.icon : '📦'}
                </div>

                {/* Details */}
                <div className="flex flex-col">
                    <span className="font-medium text-primary text-base">
                        {categoryData ? categoryData.label : expense.category}
                    </span>
                    <span className="text-xs text-secondary mt-0.5">
                        {expense.date}
                    </span>
                </div>
            </div>

            <div className="flex items-center gap-4">
                <span className="font-bold text-white text-lg">
                    {formatCurrency(expense.amount)}
                </span>

                {/* Actions (visible on hover or focus) */}
                <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                    <button
                        onClick={(e) => { e.stopPropagation(); onEdit(expense); }}
                        className="p-2 text-gray-400 hover:text-violet-400 hover:bg-white/5 rounded-full transition-colors"
                        aria-label="Edit"
                    >
                        <Pencil size={18} />
                    </button>
                    <button
                        onClick={(e) => { e.stopPropagation(); onDelete(expense.id); }}
                        className="p-2 text-gray-400 hover:text-red-400 hover:bg-white/5 rounded-full transition-colors"
                        aria-label="Delete"
                    >
                        <Trash2 size={18} />
                    </button>
                </div>
            </div>
        </div>
    );
};

export default ExpenseCard;
