import { CATEGORIES } from './constants';
import { formatExpenseDate } from './calculations';

const escapeCsvValue = (value) => {
    const text = String(value ?? '');
    // Spreadsheets run cells starting with these characters as formulas.
    const safeText = /^[=+\-@\t\r\n]/.test(text) ? `'${text}` : text;
    return `"${safeText.replaceAll('"', '""')}"`;
};

export const createExpensesCsv = (expenses, dateFormat) => {
    const header = ['Date', 'Category', 'Amount', 'Note', 'Created at', 'Updated at'];
    const rows = expenses
        .slice()
        .sort((first, second) => new Date(second.date) - new Date(first.date))
        .map((expense) => [
            formatExpenseDate(expense.date, dateFormat),
            CATEGORIES.find((category) => category.id === expense.category)?.label || expense.category,
            Number(expense.amount).toFixed(2),
            expense.note,
            expense.createdAt,
            expense.updatedAt
        ]);

    return [header, ...rows].map((row) => row.map(escapeCsvValue).join(',')).join('\n');
};

export const downloadExpensesCsv = (expenses, dateFormat) => {
    const csv = createExpensesCsv(expenses, dateFormat);
    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `phae-expenses-${new Date().toISOString().slice(0, 10)}.csv`;
    document.body.append(link);
    link.click();
    link.remove();
    URL.revokeObjectURL(url);
};
