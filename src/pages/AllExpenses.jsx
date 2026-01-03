import React, { useState, useMemo } from 'react';
import { Search, Filter, ArrowLeft } from 'lucide-react';
import Input from '../components/atoms/Input';
import Button from '../components/atoms/Button';
import ExpenseCard from '../components/molecules/ExpenseCard';
import { useExpenses } from '../hooks/useExpenses';
import { CATEGORIES } from '../utils/constants';
import { formatCurrency } from '../utils/calculations';

const AllExpenses = ({ onBack, onEditExpense }) => {
    const { expenses, deleteExpense } = useExpenses();
    const [search, setSearch] = useState('');
    const [selectedCategory, setSelectedCategory] = useState('all');
    const [sortBy, setSortBy] = useState('date-desc'); // date-desc, date-asc, amount-desc, amount-asc

    const filteredExpenses = useMemo(() => {
        return expenses
            .filter(expense => {
                const matchesSearch = (expense.note || '').toLowerCase().includes(search.toLowerCase()) ||
                    (expense.category || '').toLowerCase().includes(search.toLowerCase());
                const matchesCategory = selectedCategory === 'all' || expense.category === selectedCategory;
                return matchesSearch && matchesCategory;
            })
            .sort((a, b) => {
                if (sortBy === 'date-desc') return new Date(b.date) - new Date(a.date);
                if (sortBy === 'date-asc') return new Date(a.date) - new Date(b.date);
                if (sortBy === 'amount-desc') return b.amount - a.amount;
                if (sortBy === 'amount-asc') return a.amount - b.amount;
                return 0;
            });
    }, [expenses, search, selectedCategory, sortBy]);

    const handleDelete = async (id) => {
        if (window.confirm('Are you sure you want to delete this expense?')) {
            await deleteExpense(id);
        }
    };

    return (
        <div className="space-y-6 pb-24 animate-in fade-in slide-in-from-right-4 duration-300">
            {/* Header */}
            <div className="flex items-center gap-4">
                <button
                    onClick={onBack}
                    className="p-3 bg-[#252936] rounded-xl hover:bg-[#2d3142] transition-colors shadow-neumorphic-flat"
                >
                    <ArrowLeft size={20} className="text-white" />
                </button>
                <div>
                    <h1 className="text-2xl font-bold text-white">All Expenses</h1>
                    <p className="text-gray-400 text-sm">{filteredExpenses.length} transactions</p>
                </div>
            </div>

            {/* Filters & Search */}
            <div className="space-y-3 sticky top-0 bg-[#1a1d29]/95 backdrop-blur-md z-10 py-2 border-b border-white/5">
                <div className="flex gap-2">
                    <div className="relative flex-1">
                        <Input
                            placeholder="Search expenses..."
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                            className="pl-10"
                        />
                        <Search size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500" />
                    </div>
                    {/* Simple Sort Toggle for MVP */}
                    <select
                        value={sortBy}
                        onChange={(e) => setSortBy(e.target.value)}
                        className="bg-[#252936] text-white rounded-xl px-3 border border-transparent focus:border-violet-500 outline-none appearance-none"
                    >
                        <option value="date-desc">Newest</option>
                        <option value="date-asc">Oldest</option>
                        <option value="amount-desc">Highest</option>
                        <option value="amount-asc">Lowest</option>
                    </select>
                </div>

                {/* Category Filter Pills */}
                <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-hide">
                    <button
                        onClick={() => setSelectedCategory('all')}
                        className={`px-4 py-1.5 rounded-full text-sm font-medium whitespace-nowrap transition-colors ${selectedCategory === 'all'
                                ? 'bg-white text-black'
                                : 'bg-[#252936] text-gray-400 hover:bg-[#353a4e]'
                            }`}
                    >
                        All
                    </button>
                    {CATEGORIES.map(cat => (
                        <button
                            key={cat.id}
                            onClick={() => setSelectedCategory(cat.id)}
                            className={`px-4 py-1.5 rounded-full text-sm font-medium whitespace-nowrap transition-colors flex items-center gap-2 ${selectedCategory === cat.id
                                    ? 'bg-white text-black'
                                    : 'bg-[#252936] text-gray-400 hover:bg-[#353a4e]'
                                }`}
                        >
                            <span>{cat.icon}</span>
                            {cat.label}
                        </button>
                    ))}
                </div>
            </div>

            {/* List */}
            <div className="space-y-3">
                {filteredExpenses.length === 0 ? (
                    <div className="text-center py-12 text-gray-500">
                        <p>No expenses found matching your criteria</p>
                    </div>
                ) : (
                    filteredExpenses.map(expense => (
                        <ExpenseCard
                            key={expense.id}
                            expense={expense}
                            onEdit={onEditExpense}
                            onDelete={handleDelete}
                        />
                    ))
                )}
            </div>
        </div>
    );
};

export default AllExpenses;
