import { useEffect, useId, useRef, useState } from 'react';
import { Calendar, X } from 'lucide-react';
import Button from '../atoms/Button';
import Input from '../atoms/Input';
import CategorySelector from '../molecules/CategorySelector';
import { useExpenses } from '../../hooks/useExpenses';
import { useSettings } from '../../hooks/useSettings';
import { useToast } from '../atoms/Toast';
import {
    calculateDateTotal,
    calculateStreak,
    formatCurrency,
    formatExpenseDate
} from '../../utils/calculations';

const toDateKey = (date = new Date()) => {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
};

const createExpenseId = () => {
    if (typeof crypto !== 'undefined' && crypto.randomUUID) return crypto.randomUUID();
    return `expense-${Date.now()}-${Math.random().toString(16).slice(2)}`;
};

const initialFormFor = (expense) => ({
    amount: expense?.amount?.toString() || '',
    category: expense?.category || '',
    date: expense?.date || toDateKey(),
    note: expense?.note || ''
});

const validateForm = (form) => {
    const errors = {};
    const amount = Number(form.amount);
    const selectedDate = new Date(`${form.date}T00:00:00`);

    if (!Number.isFinite(amount) || amount <= 0) {
        errors.amount = 'Enter an amount greater than zero.';
    }
    if (!form.category) {
        errors.category = 'Choose a category.';
    }
    if (!form.date || Number.isNaN(selectedDate.getTime())) {
        errors.date = 'Choose a valid date.';
    } else if (selectedDate > new Date(`${toDateKey()}T23:59:59`)) {
        errors.date = 'Expenses cannot be dated in the future.';
    }
    if (form.note.trim().length > 100) {
        errors.note = 'Notes can contain up to 100 characters.';
    }

    return errors;
};

const AddExpenseModal = ({ isOpen, onClose, onExpenseSaved, expenseToEdit = null }) => {
    const [form, setForm] = useState(() => initialFormFor(expenseToEdit));
    const [errors, setErrors] = useState({});
    const [isSaving, setIsSaving] = useState(false);
    const dialogRef = useRef(null);
    const amountInputRef = useRef(null);
    const titleId = useId();
    const amountErrorId = useId();
    const dateErrorId = useId();
    const noteErrorId = useId();
    const { expenses, addExpense, updateExpense } = useExpenses();
    const { settings } = useSettings();
    const { addToast } = useToast();

    useEffect(() => {
        if (!isOpen) return undefined;

        const previouslyFocused = document.activeElement;
        const focusTimer = window.requestAnimationFrame(() => amountInputRef.current?.focus());

        const handleKeyDown = (event) => {
            if (event.key === 'Escape') {
                event.preventDefault();
                onClose();
                return;
            }
            if (event.key !== 'Tab' || !dialogRef.current) return;

            const focusableElements = dialogRef.current.querySelectorAll(
                'button:not([disabled]), input:not([disabled]), select:not([disabled]), textarea:not([disabled]), [tabindex]:not([tabindex="-1"])'
            );
            const focusable = [...focusableElements];
            if (focusable.length === 0) return;

            const first = focusable[0];
            const last = focusable.at(-1);
            if (event.shiftKey && document.activeElement === first) {
                event.preventDefault();
                last.focus();
            } else if (!event.shiftKey && document.activeElement === last) {
                event.preventDefault();
                first.focus();
            }
        };

        document.addEventListener('keydown', handleKeyDown);
        return () => {
            window.cancelAnimationFrame(focusTimer);
            document.removeEventListener('keydown', handleKeyDown);
            previouslyFocused?.focus?.();
        };
    }, [isOpen, onClose]);

    if (!isOpen) return null;

    const updateField = (field, value) => {
        setForm((currentForm) => ({ ...currentForm, [field]: value }));
        if (errors[field]) {
            setErrors((currentErrors) => ({ ...currentErrors, [field]: undefined }));
        }
    };

    const handleSubmit = async (event) => {
        event.preventDefault();
        const validationErrors = validateForm(form);
        setErrors(validationErrors);
        if (Object.keys(validationErrors).length > 0) return;

        setIsSaving(true);
        const now = new Date().toISOString();
        const expense = {
            ...(expenseToEdit || { id: createExpenseId(), createdAt: now }),
            amount: Number(form.amount),
            category: form.category,
            date: form.date,
            note: form.note.trim(),
            updatedAt: now
        };

        const success = expenseToEdit
            ? await updateExpense(expense)
            : await addExpense(expense);

        setIsSaving(false);
        if (!success) {
            addToast('The expense could not be saved. Try again.', 'error');
            return;
        }

        const nextExpenses = expenseToEdit
            ? expenses.map((item) => (item.id === expense.id ? expense : item))
            : [...expenses, expense];
        const dayTotal = calculateDateTotal(nextExpenses, expense.date);
        const streakData = calculateStreak(nextExpenses);
        const action = expenseToEdit ? 'updated' : 'added';

        addToast(`Expense ${action}. ${formatExpenseDate(expense.date, settings.dateFormat)} totals ${formatCurrency(dayTotal, settings.currency)}.`, 'success');
        onExpenseSaved?.({ expense, action, streakData });
        onClose();
    };

    return (
        <div
            className="fixed inset-0 z-50 flex items-end justify-center bg-black/70 p-0 backdrop-blur-sm sm:items-center sm:p-4"
            onMouseDown={(event) => {
                if (event.target === event.currentTarget) onClose();
            }}
        >
            <section
                ref={dialogRef}
                role="dialog"
                aria-modal="true"
                aria-labelledby={titleId}
                className="w-full max-w-lg overflow-y-auto rounded-t-[28px] border border-border bg-surface shadow-2xl sm:max-h-[calc(100vh-2rem)] sm:rounded-[28px]"
            >
                <header className="flex items-center justify-between border-b border-border px-5 py-4 sm:px-6">
                    <div>
                        <h2 id={titleId} className="text-xl font-bold text-primary">
                            {expenseToEdit ? 'Edit expense' : 'Add expense'}
                        </h2>
                        <p className="mt-1 text-sm text-secondary">Amounts are saved in your selected currency.</p>
                    </div>
                    <button
                        type="button"
                        onClick={onClose}
                        className="icon-button"
                        aria-label="Close expense form"
                    >
                        <X size={20} aria-hidden="true" />
                    </button>
                </header>

                <form onSubmit={handleSubmit} className="space-y-6 p-5 sm:p-6">
                    <div>
                        <label htmlFor="expense-amount" className="field-label">Amount</label>
                        <div className="relative mt-2">
                            <span className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 font-semibold text-secondary">
                                {settings.currency}
                            </span>
                            <input
                                ref={amountInputRef}
                                id="expense-amount"
                                name="amount"
                                type="number"
                                inputMode="decimal"
                                min="0.01"
                                step="0.01"
                                value={form.amount}
                                onChange={(event) => updateField('amount', event.target.value)}
                                aria-invalid={Boolean(errors.amount)}
                                aria-describedby={errors.amount ? amountErrorId : undefined}
                                placeholder="0.00"
                                className="amount-input"
                            />
                        </div>
                        {errors.amount && <p id={amountErrorId} className="field-error" role="alert">{errors.amount}</p>}
                    </div>

                    <CategorySelector
                        selectedCategory={form.category}
                        onSelect={(value) => updateField('category', value)}
                        error={errors.category}
                    />

                    <div className="grid gap-4 sm:grid-cols-2">
                        <div>
                            <label htmlFor="expense-date" className="field-label">Date</label>
                            <div className="relative mt-2">
                                <input
                                    id="expense-date"
                                    name="date"
                                    type="date"
                                    max={toDateKey()}
                                    value={form.date}
                                    onChange={(event) => updateField('date', event.target.value)}
                                    aria-invalid={Boolean(errors.date)}
                                    aria-describedby={errors.date ? dateErrorId : undefined}
                                    className="form-control pr-10"
                                />
                                <Calendar className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-secondary" size={18} aria-hidden="true" />
                            </div>
                            <div className="mt-2 flex gap-2">
                                <button type="button" className="text-button" onClick={() => updateField('date', toDateKey())}>Today</button>
                                <button type="button" className="text-button" onClick={() => updateField('date', toDateKey(new Date(Date.now() - 86400000)))}>Yesterday</button>
                            </div>
                            {errors.date && <p id={dateErrorId} className="field-error" role="alert">{errors.date}</p>}
                        </div>

                        <Input
                            id="expense-note"
                            label="Note (optional)"
                            placeholder="What was this for?"
                            value={form.note}
                            maxLength={100}
                            onChange={(event) => updateField('note', event.target.value)}
                            error={errors.note}
                            errorId={noteErrorId}
                        />
                    </div>

                    <div className="flex flex-col-reverse gap-3 border-t border-border pt-5 sm:flex-row sm:justify-end">
                        <Button type="button" variant="secondary" onClick={onClose} disabled={isSaving}>Cancel</Button>
                        <Button type="submit" disabled={isSaving} className="min-w-40">
                            {isSaving ? 'Saving…' : expenseToEdit ? 'Save changes' : 'Save expense'}
                        </Button>
                    </div>
                </form>
            </section>
        </div>
    );
};

export default AddExpenseModal;
