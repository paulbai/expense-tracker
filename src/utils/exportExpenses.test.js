import { describe, expect, it } from 'vitest';
import { createExpensesCsv } from './exportExpenses';

describe('createExpensesCsv', () => {
    it('escapes notes and includes readable categories', () => {
        const csv = createExpensesCsv([{
            id: 'expense-1',
            amount: 12.5,
            category: 'food',
            date: '2026-01-08',
            note: 'Lunch, "team"',
            createdAt: '2026-01-08T12:00:00.000Z',
            updatedAt: '2026-01-08T12:00:00.000Z'
        }], 'dd/MM/yyyy');

        expect(csv).toContain('"Food"');
        expect(csv).toContain('"Lunch, ""team"""');
        expect(csv).toContain('"08/01/2026"');
    });

    it.each(['=1+1', '+1+1', '-1+1', '@SUM(A1)', '\t=1+1'])('neutralises the spreadsheet formula %j', (note) => {
        const csv = createExpensesCsv([{
            id: 'expense-1',
            amount: 12.5,
            category: 'food',
            date: '2026-01-08',
            note,
            createdAt: '2026-01-08T12:00:00.000Z',
            updatedAt: '2026-01-08T12:00:00.000Z'
        }], 'dd/MM/yyyy');

        expect(csv).toContain(`"'${note}"`);
    });
});
