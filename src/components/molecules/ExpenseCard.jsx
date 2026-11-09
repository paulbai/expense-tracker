import { Pencil, Trash2 } from 'lucide-react';
import { CATEGORIES } from '../../utils/constants';
import { formatCurrency, formatExpenseDate } from '../../utils/calculations';

const ExpenseCard = ({ expense, currency, dateFormat, onEdit, onDelete }) => {
    const category = CATEGORIES.find((item) => item.id === expense.category);

    return (
        <article className="expense-card">
            <div className="flex min-w-0 items-center gap-3">
                <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-bg text-2xl shadow-neu-inset" aria-hidden="true">
                    {category?.icon || '📦'}
                </div>
                <div className="min-w-0">
                    <h3 className="truncate font-semibold text-primary">{category?.label || expense.category}</h3>
                    <p className="mt-0.5 truncate text-sm text-secondary">
                        {formatExpenseDate(expense.date, dateFormat)}{expense.note ? ` · ${expense.note}` : ''}
                    </p>
                </div>
            </div>
            <div className="flex shrink-0 items-center gap-2 sm:gap-3">
                <p className="font-bold tabular-nums text-primary">{formatCurrency(expense.amount, currency)}</p>
                <div className="flex items-center gap-1">
                    <button type="button" onClick={() => onEdit(expense)} className="icon-button" aria-label={`Edit ${category?.label || expense.category} expense`}>
                        <Pencil size={17} aria-hidden="true" />
                    </button>
                    <button type="button" onClick={() => onDelete(expense)} className="icon-button icon-button-danger" aria-label={`Delete ${category?.label || expense.category} expense`}>
                        <Trash2 size={17} aria-hidden="true" />
                    </button>
                </div>
            </div>
        </article>
    );
};

export default ExpenseCard;
