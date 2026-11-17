import { CATEGORIES } from './constants';

export const MAX_IMPORT_BYTES = 5 * 1024 * 1024;
const MAX_NOTE_LENGTH = 100;

export class ImportError extends Error {
    constructor(message) {
        super(message);
        this.name = 'ImportError';
    }
}

// Splits CSV text into rows of cells. Handles quoted cells, doubled quotes,
// commas and line breaks inside quotes, and both \n and \r\n line endings.
export const parseCsv = (text) => {
    const rows = [];
    let row = [];
    let cell = '';
    let inQuotes = false;
    const source = text.replace(/^\uFEFF/, '');

    for (let index = 0; index < source.length; index += 1) {
        const char = source[index];

        if (inQuotes) {
            if (char === '"' && source[index + 1] === '"') {
                cell += '"';
                index += 1;
            } else if (char === '"') {
                inQuotes = false;
            } else {
                cell += char;
            }
        } else if (char === '"') {
            inQuotes = true;
        } else if (char === ',') {
            row.push(cell);
            cell = '';
        } else if (char === '\n' || char === '\r') {
            if (char === '\r' && source[index + 1] === '\n') index += 1;
            row.push(cell);
            rows.push(row);
            row = [];
            cell = '';
        } else {
            cell += char;
        }
    }

    if (inQuotes) throw new ImportError('The file has a quote that is never closed.');
    if (cell !== '' || row.length > 0) {
        row.push(cell);
        rows.push(row);
    }

    return rows.filter((cells) => cells.some((value) => value.trim() !== ''));
};

const isRealDate = (year, month, day) => {
    const date = new Date(year, month - 1, day);
    return date.getFullYear() === year && date.getMonth() === month - 1 && date.getDate() === day;
};

const toIsoDate = (year, month, day) => (
    isRealDate(year, month, day)
        ? `${year}-${String(month).padStart(2, '0')}-${String(day).padStart(2, '0')}`
        : null
);

// Accepts yyyy-MM-dd, which current exports use, and falls back to the
// user's date format for files exported before that change.
export const parseImportDate = (value, dateFormat) => {
    const text = value.trim();
    const iso = text.match(/^(\d{4})-(\d{1,2})-(\d{1,2})$/);
    if (iso) return toIsoDate(Number(iso[1]), Number(iso[2]), Number(iso[3]));

    const slashed = text.match(/^(\d{1,2})\/(\d{1,2})\/(\d{4})$/);
    if (!slashed) return null;
    const [first, second, year] = slashed.slice(1).map(Number);
    return dateFormat === 'MM/dd/yyyy'
        ? toIsoDate(year, first, second)
        : toIsoDate(year, second, first);
};

const findCategoryId = (value) => {
    const text = value.trim().toLowerCase();
    return CATEGORIES.find((category) => (
        category.id === text || category.label.toLowerCase() === text
    ))?.id || null;
};

const parseAmount = (value) => {
    const amount = Number(value.trim().replace(/,/g, ''));
    return Number.isFinite(amount) && amount > 0 ? Math.round(amount * 100) / 100 : null;
};

// Undo the export's formula guard: a leading apostrophe before = + - @ or a tab.
const restoreNote = (value) => (/^'[=+\-@\t\r\n]/.test(value) ? value.slice(1) : value);

const parseTimestamp = (value, fallback) => {
    const text = (value || '').trim();
    return text && !Number.isNaN(Date.parse(text)) ? new Date(text).toISOString() : fallback;
};

const fingerprint = (expense) => [
    expense.date,
    expense.category,
    Number(expense.amount).toFixed(2),
    expense.note.trim()
].join('|');

const defaultCreateId = () => {
    if (typeof crypto !== 'undefined' && crypto.randomUUID) return crypto.randomUUID();
    return `expense-${Date.now()}-${Math.random().toString(16).slice(2)}`;
};

/**
 * Reads a Phae CSV export and returns the expenses that are new to this device,
 * so importing the same backup twice is safe. Rows with an id are matched by id.
 * Rows from older exports have no id, so each one is matched against one
 * existing expense with the same date, category, amount and note.
 */
export const parseExpensesCsv = (text, {
    dateFormat = 'dd/MM/yyyy',
    existingExpenses = [],
    now = new Date().toISOString(),
    createId = defaultCreateId
} = {}) => {
    const rows = parseCsv(text);
    if (rows.length === 0) throw new ImportError('The file is empty.');

    const header = rows[0].map((cell) => cell.trim().toLowerCase());
    const column = (name) => header.indexOf(name);
    const columns = {
        date: column('date'),
        category: column('category'),
        amount: column('amount'),
        note: column('note'),
        createdAt: column('created at'),
        updatedAt: column('updated at'),
        id: column('id')
    };

    if (columns.date < 0 || columns.category < 0 || columns.amount < 0) {
        throw new ImportError('This does not look like a Phae export. It needs Date, Category and Amount columns.');
    }

    const knownIds = new Set(existingExpenses.map((expense) => expense.id));
    const unmatchedExisting = new Map();
    existingExpenses.forEach((expense) => {
        const key = fingerprint(expense);
        unmatchedExisting.set(key, (unmatchedExisting.get(key) || 0) + 1);
    });
    const imported = [];
    let duplicates = 0;
    let invalid = 0;

    rows.slice(1).forEach((cells) => {
        const read = (index) => (index >= 0 ? cells[index] ?? '' : '');
        const date = parseImportDate(read(columns.date), dateFormat);
        const category = findCategoryId(read(columns.category));
        const amount = parseAmount(read(columns.amount));
        const note = restoreNote(read(columns.note)).trim();

        if (!date || !category || amount === null || note.length > MAX_NOTE_LENGTH) {
            invalid += 1;
            return;
        }

        const fileId = read(columns.id).trim();
        const createdAt = parseTimestamp(read(columns.createdAt), now);
        const expense = {
            id: fileId || createId(),
            amount,
            category,
            date,
            note,
            createdAt,
            updatedAt: parseTimestamp(read(columns.updatedAt), createdAt)
        };

        if (fileId) {
            if (knownIds.has(fileId)) {
                duplicates += 1;
                return;
            }
        } else {
            const key = fingerprint(expense);
            const remaining = unmatchedExisting.get(key) || 0;
            if (remaining > 0) {
                unmatchedExisting.set(key, remaining - 1);
                duplicates += 1;
                return;
            }
        }

        knownIds.add(expense.id);
        imported.push(expense);
    });

    return { expenses: imported, duplicates, invalid };
};
