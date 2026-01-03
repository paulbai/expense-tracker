import React from 'react';
import { Pencil, Trash2 } from 'lucide-react';
import { CATEGORIES } from '../../utils/constants';
import { formatCurrency } from '../../utils/calculations';

const ExpenseCard = ({ expense, onEdit, onDelete }) => {
    const category = CATEGORIES.find(c => c.id === expense.category) || {};

    return (
        <div className="group bg-[#252936] p-4 rounded-2xl flex items-center justify-between transition-all hover:bg-[#2a2f3e] hover:shadow-lg">
            <div className="flex items-center gap-4">
                {/* Icon */}
                <div className="w-12 h-12 rounded-2xl bg-[#1a1d29] flex items-center justify-center text-2xl shadow-neumorphic-inset border border-white/5">
                    {category.icon || '📦'}
                </div>

                {/* Details */}
                <div className="flex flex-col">
                    <span className="font-medium text-white text-base">
                        {category.label || expense.category}
                    </span>
                    <span className="text-sm text-gray-400">
                        {expense.note || expense.date}
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
