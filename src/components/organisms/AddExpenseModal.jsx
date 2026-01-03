import React, { useState, useEffect } from 'react';
import { X, Calendar } from 'lucide-react';
import Button from '../atoms/Button';
import Input from '../atoms/Input';
import CategorySelector from '../molecules/CategorySelector';
import { useExpenses } from '../../hooks/useExpenses';
import { useStreak } from '../../hooks/useStreak';
import { useToast } from '../atoms/Toast';
import { formatCurrency } from '../../utils/calculations';

const AddExpenseModal = ({ isOpen, onClose, onSave, expenseToEdit = null }) => {
    const [amount, setAmount] = useState('');
    const [category, setCategory] = useState('');
    const [date, setDate] = useState(new Date().toISOString().split('T')[0]);
    const [note, setNote] = useState('');
    const [errors, setErrors] = useState({});

    const { addExpense, updateExpense } = useExpenses();
    const { updateStreakOnAdd } = useStreak();
    const { addToast } = useToast();

    // Reset form when modal opens or editing changes
    useEffect(() => {
        if (isOpen) {
            if (expenseToEdit) {
                setAmount(expenseToEdit.amount.toString());
                setCategory(expenseToEdit.category);
                setDate(expenseToEdit.date);
                setNote(expenseToEdit.note || '');
            } else {
                setAmount('');
                setCategory('');
                setDate(new Date().toISOString().split('T')[0]);
                setNote('');
            }
            setErrors({});
        }
    }, [isOpen, expenseToEdit]);

    const validate = () => {
        const newErrors = {};
        if (!amount || parseFloat(amount) <= 0) {
            newErrors.amount = 'Please enter a valid amount';
        }
        if (!category) {
            newErrors.category = 'Please select a category';
        }
        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!validate()) return;

        const expenseData = {
            amount: parseFloat(amount),
            category,
            date,
            note,
            updatedAt: new Date().toISOString()
        };

        let success = false;
        let actionType = '';

        if (expenseToEdit) {
            success = await updateExpense({
                ...expenseToEdit,
                ...expenseData
            });
            actionType = 'updated';
        } else {
            success = await addExpense({
                id: crypto.randomUUID(),
                createdAt: new Date().toISOString(),
                ...expenseData
            });
            if (success) {
                await updateStreakOnAdd(date);
            }
            actionType = 'added';
        }

        if (success) {
            addToast(`Expense ${actionType} successfully!`, 'success');
            // Show summary toast if added new
            if (actionType === 'added') {
                setTimeout(() => {
                    addToast(`Today's Total: ${formatCurrency(amount)}`, 'info'); // Simplified daily total for now, ideally calc properly
                }, 300);
            }
            if (onSave) onSave();
            onClose();
        } else {
            addToast('Failed to save expense', 'error');
        }
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-200">
            <div className="w-full max-w-md bg-[#252936] rounded-[32px] shadow-2xl overflow-hidden animate-in zoom-in-95 duration-200">

                {/* Header */}
                <div className="flex items-center justify-between px-6 py-4 border-b border-white/5">
                    <h2 className="text-xl font-bold text-white">
                        {expenseToEdit ? 'Edit Expense' : 'Add Expense'}
                    </h2>
                    <button
                        onClick={onClose}
                        className="p-2 text-gray-400 hover:text-white bg-transparent hover:bg-white/5 rounded-full transition-colors"
                    >
                        <X size={20} />
                    </button>
                </div>

                {/* Form Body */}
                <form onSubmit={handleSubmit} className="p-6 space-y-6">

                    {/* Amount Input */}
                    <div className="relative">
                        <label className="text-sm font-medium text-gray-400 ml-1 mb-2 block">Amount</label>
                        <div className="relative">
                            <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 text-lg font-semibold">SLE</span>
                            <input
                                type="number"
                                step="0.01"
                                value={amount}
                                onChange={(e) => setAmount(e.target.value)}
                                placeholder="0.00"
                                className={`
                  w-full bg-[#1a1d29] text-white text-3xl font-bold rounded-2xl pl-14 pr-4 py-4
                  shadow-[inset_2px_2px_5px_rgba(0,0,0,0.5),inset_-2px_-2px_5px_rgba(255,255,255,0.05)]
                  border border-transparent focus:border-violet-500 focus:ring-1 focus:ring-violet-500
                  transition-all duration-200 outline-none
                  ${errors.amount ? 'border-red-500 focus:border-red-500' : ''}
                `}
                                autoFocus
                            />
                        </div>
                        {errors.amount && <span className="text-xs text-red-500 ml-1 mt-1 block">{errors.amount}</span>}
                    </div>

                    {/* Category Selector */}
                    <CategorySelector
                        selectedCategory={category}
                        onSelect={setCategory}
                        error={errors.category}
                    />

                    {/* Date & Note Grid */}
                    <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                            <label className="text-sm font-medium text-gray-400 ml-1">Date</label>
                            <div className="relative">
                                <input
                                    type="date"
                                    value={date}
                                    onChange={(e) => setDate(e.target.value)}
                                    className="w-full bg-[#1a1d29] text-white rounded-xl px-4 py-3 shadow-[inset_2px_2px_5px_rgba(0,0,0,0.5),inset_-2px_-2px_5px_rgba(255,255,255,0.05)] border-transparent focus:border-violet-500 outline-none"
                                />
                                <Calendar className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 pointer-events-none" size={16} />
                            </div>
                        </div>

                        <Input
                            label="Note (Optional)"
                            placeholder="What for?"
                            value={note}
                            onChange={(e) => setNote(e.target.value)}
                        />
                    </div>

                    {/* Actions */}
                    <div className="pt-2">
                        <Button type="submit" className="w-full py-4 text-lg shadow-lg shadow-violet-500/20">
                            {expenseToEdit ? 'Update Expense' : 'Save Expense'}
                        </Button>
                    </div>

                </form>
            </div>
        </div>
    );
};

export default AddExpenseModal;
