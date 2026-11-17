import { useCallback } from 'react';
import { BACKUP_REMINDER_INTERVAL } from '../utils/constants';
import { downloadExpensesCsv } from '../utils/exportExpenses';
import { useExpenses } from './useExpenses';
import { useSettings } from './useSettings';

export const useBackup = () => {
    const { expenses } = useExpenses();
    const { settings, updateSettings } = useSettings();

    const downloadBackup = useCallback(async () => {
        if (expenses.length === 0) return false;
        downloadExpensesCsv(expenses);
        await updateSettings({ lastBackupAt: new Date().toISOString(), lastBackupCount: expenses.length });
        return true;
    }, [expenses, updateSettings]);

    const snoozeReminder = useCallback(
        () => updateSettings({ backupReminderSnoozedAt: expenses.length }),
        [expenses.length, updateSettings]
    );

    const sinceLastBackup = expenses.length - Math.max(settings.lastBackupCount || 0, settings.backupReminderSnoozedAt || 0);

    return {
        downloadBackup,
        snoozeReminder,
        lastBackupAt: settings.lastBackupAt,
        unsavedCount: expenses.length - (settings.lastBackupCount || 0),
        reminderDue: sinceLastBackup >= BACKUP_REMINDER_INTERVAL
    };
};
