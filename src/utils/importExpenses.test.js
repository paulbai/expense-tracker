import { describe, expect, it } from 'vitest';
import { createExpensesCsv } from './exportExpenses';
import { ImportError, parseCsv, parseExpensesCsv, parseImportDate } from './importExpenses';

const expense = (id, overrides = {}) => ({
    id,
    amount: 12.5,
    category: 'food',
    date: '2026-01-08',
    note: '',
    createdAt: '2026-01-08T12:00:00.000Z',
    updatedAt: '2026-01-08T12:00:00.000Z',
    ...overrides
});

let counter = 0;
const options = (extra = {}) => ({
    now: '2026-02-01T00:00:00.000Z',
    createId: () => `new-${(counter += 1)}`,
    ...extra
});

describe('parseCsv', () => {
    it('handles quotes, commas, line breaks and CRLF endings', () => {
        const rows = parseCsv('"a","b, c"\r\n"say ""hi""","line\nbreak"\r\n');
        expect(rows).toEqual([['a', 'b, c'], ['say "hi"', 'line\nbreak']]);
    });

    it('ignores the byte order mark Excel adds to saved CSV files', () => {
        expect(parseCsv('\uFEFF"Date","Amount"')).toEqual([['Date', 'Amount']]);
    });

    it('rejects a quote that is never closed', () => {
        expect(() => parseCsv('"a,b')).toThrow(ImportError);
    });
});

describe('parseImportDate', () => {
    it('reads ISO dates and falls back to the chosen day order', () => {
        expect(parseImportDate('2026-01-08', 'MM/dd/yyyy')).toBe('2026-01-08');
        expect(parseImportDate('08/01/2026', 'dd/MM/yyyy')).toBe('2026-01-08');
        expect(parseImportDate('01/08/2026', 'MM/dd/yyyy')).toBe('2026-01-08');
        expect(parseImportDate('31/02/2026', 'dd/MM/yyyy')).toBeNull();
    });
});

describe('parseExpensesCsv', () => {
    it('restores an export exactly, including notes the export guarded', () => {
        const original = [
            expense('one', { note: 'Lunch, "team"' }),
            expense('two', { category: 'debt_payment', amount: 300, date: '2025-12-31', note: '=1+1' })
        ];
        const result = parseExpensesCsv(createExpensesCsv(original), options());

        expect(result).toEqual({ expenses: expect.any(Array), duplicates: 0, invalid: 0 });
        expect(result.expenses).toEqual(expect.arrayContaining(original));
        expect(result.expenses).toHaveLength(2);
    });

    it('skips expenses that are already on this device, so a second import adds nothing', () => {
        const existing = [expense('one'), expense('two', { amount: 5 })];
        const result = parseExpensesCsv(createExpensesCsv(existing), options({ existingExpenses: existing }));
        expect(result.expenses).toEqual([]);
        expect(result.duplicates).toBe(2);
    });

    it('keeps two identical expenses that have different ids', () => {
        const twins = [expense('bus-1', { amount: 5 }), expense('bus-2', { amount: 5 })];
        expect(parseExpensesCsv(createExpensesCsv(twins), options()).expenses).toHaveLength(2);
    });

    it('imports older exports that have no id column, using the date format setting', () => {
        const csv = [
            '"Date","Category","Amount","Note","Created at","Updated at"',
            '"08/01/2026","Food","12.50","Lunch","2026-01-08T12:00:00.000Z","2026-01-08T12:00:00.000Z"',
            '"09/01/2026","Transportation","5.00","","",""',
            '"09/01/2026","Transportation","5.00","","",""'
        ].join('\n');
        const existing = [expense('one', { note: 'Lunch' })];
        const result = parseExpensesCsv(csv, options({ existingExpenses: existing, dateFormat: 'dd/MM/yyyy' }));

        expect(result.duplicates).toBe(1);
        expect(result.expenses).toHaveLength(2);
        expect(result.expenses[0]).toMatchObject({
            category: 'transportation',
            date: '2026-01-09',
            amount: 5,
            createdAt: '2026-02-01T00:00:00.000Z'
        });
        expect(result.expenses[0].id).not.toBe(result.expenses[1].id);
    });

    it('counts rows it cannot read instead of importing them', () => {
        const csv = [
            'Date,Category,Amount,Note',
            '2026-01-08,Food,0,',
            '2026-01-08,Rent,10,',
            'not a date,Food,10,',
            `2026-01-08,Food,10,${'x'.repeat(101)}`,
            '2026-01-08,food,"1,250.5",ok'
        ].join('\n');
        const result = parseExpensesCsv(csv, options());

        expect(result.invalid).toBe(4);
        expect(result.expenses).toHaveLength(1);
        expect(result.expenses[0].amount).toBe(1250.5);
    });

    it('rejects files that are not Phae exports', () => {
        expect(() => parseExpensesCsv('Name,Email\nA,b', options())).toThrow(/Date, Category and Amount/);
        expect(() => parseExpensesCsv('', options())).toThrow(/empty/);
    });
});
