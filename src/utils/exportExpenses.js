import { CATEGORIES } from './constants';

export const CSV_HEADER = ['Date', 'Category', 'Amount', 'Note', 'Created at', 'Updated at', 'ID'];

const escapeCsvValue = (value) => {
    const text = String(value ?? '');
    // Spreadsheets run cells starting with these characters as formulas.
    const safeText = /^[=+\-@\t\r\n]/.test(text) ? `'${text}` : text;
    return `"${safeText.replaceAll('"', '""')}"`;
};

// Dates are written as yyyy-MM-dd and every row carries its id, so the file
// can be imported again without guessing the day order or creating duplicates.
export const createExpensesCsv = (expenses) => {
    const rows = expenses
        .slice()
        .sort((first, second) => second.date.localeCompare(first.date))
        .map((expense) => [
            expense.date,
            CATEGORIES.find((category) => category.id === expense.category)?.label || expense.category,
            Number(expense.amount).toFixed(2),
            expense.note,
            expense.createdAt,
            expense.updatedAt,
            expense.id
        ]);

    return [CSV_HEADER, ...rows].map((row) => row.map(escapeCsvValue).join(',')).join('\n');
};

export const downloadExpensesCsv = (expenses) => {
    const csv = createExpensesCsv(expenses);
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
