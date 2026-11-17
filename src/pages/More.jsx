import { useEffect, useRef, useState } from 'react';
import { Bell, CalendarPlus, Download, Palette, RotateCcw, ShieldCheck, Upload } from 'lucide-react';
import Button from '../components/atoms/Button';
import { useToast } from '../components/atoms/Toast';
import { useExpenses } from '../hooks/useExpenses';
import { useSettings } from '../hooks/useSettings';
import { useTheme } from '../hooks/useTheme';
import { useBackup } from '../hooks/useBackup';
import { CURRENCIES } from '../utils/constants';
import { formatExpenseDate } from '../utils/calculations';
import { downloadReminderIcs } from '../utils/calendarReminder';
import { getPersistentStorageStatus, isAppleMobileBrowserTab } from '../utils/device';
import { ImportError, MAX_IMPORT_BYTES, parseExpensesCsv } from '../utils/importExpenses';

const plural = (count, word) => `${count} ${word}${count === 1 ? '' : 's'}`;

const THEME_COLORS = {
    dark: '#1a1d29', light: '#e0e5ec', aurora: '#0b1026', ocean: '#0f172a', sunset: '#2a1b1b',
    bioluminescence: '#020617', deep_teal: '#134e4a', retro: '#2e0228', neon: '#000000'
};

const More = ({ notifications, onResetAllData }) => {
    const [isResetting, setIsResetting] = useState(false);
    const [isImporting, setIsImporting] = useState(false);
    const [storageStatus, setStorageStatus] = useState('unsupported');
    const fileInputRef = useRef(null);
    const { expenses, importExpenses } = useExpenses();
    const { downloadBackup, lastBackupAt } = useBackup();
    const { settings, updateSettings } = useSettings();
    const { theme, changeTheme, themes } = useTheme();
    const { addToast } = useToast();

    const handleCurrencyChange = async (event) => {
        const success = await updateSettings({ currency: event.target.value });
        addToast(success ? 'Default currency saved.' : 'Currency could not be saved.', success ? 'success' : 'error');
    };

    const handleNotificationChange = async (event) => {
        if (!event.target.checked) {
            const success = await updateSettings({ notificationEnabled: false });
            addToast(success ? 'Reminders turned off.' : 'Reminder preference could not be saved.', success ? 'success' : 'error');
            return;
        }

        const result = await notifications.requestPermission();
        if (result.status === 'unsupported') {
            addToast('This browser does not support notifications.', 'warning');
        } else if (result.success) {
            addToast('Reminders turned on. They only arrive while Phae is open.', 'success');
        } else {
            addToast('Notification permission was not granted.', 'warning');
        }
    };

    const handleTestNotification = async () => {
        const sent = await notifications.testNotification();
        addToast(sent ? 'Test notification sent.' : 'The test notification could not be shown. Check that notifications are allowed for Phae.', sent ? 'success' : 'warning');
    };

    const handleAddToCalendar = () => {
        downloadReminderIcs(settings.notificationTime);
        addToast('Calendar file downloaded. Open it to add the daily reminder.', 'success');
    };

    useEffect(() => {
        let active = true;
        getPersistentStorageStatus().then((status) => { if (active) setStorageStatus(status); });
        return () => { active = false; };
    }, [expenses.length]);

    const handleExport = async () => {
        if (expenses.length === 0) {
            addToast('There are no expenses to export yet.', 'info');
            return;
        }
        await downloadBackup();
        addToast('Your CSV download has started.', 'success');
    };

    const handleImportFile = async (event) => {
        const file = event.target.files?.[0];
        event.target.value = '';
        if (!file) return;

        if (file.size > MAX_IMPORT_BYTES) {
            addToast('That file is larger than 5 MB. Choose a Phae CSV export.', 'error', 5000);
            return;
        }

        setIsImporting(true);
        try {
            const { expenses: newExpenses, duplicates, invalid } = parseExpensesCsv(await file.text(), {
                dateFormat: settings.dateFormat,
                existingExpenses: expenses
            });
            const skipped = [
                duplicates > 0 && `${plural(duplicates, 'expense')} already in Phae`,
                invalid > 0 && `${plural(invalid, 'row')} that couldn’t be read`
            ].filter(Boolean).join(' and ');

            if (newExpenses.length === 0) {
                addToast(skipped ? `Nothing new to import. The file had ${skipped}.` : 'The file has no expenses to import.', 'info', 5000);
                return;
            }

            const confirmMessage = `Import ${plural(newExpenses.length, 'expense')}?${skipped ? ` Phae will skip ${skipped}.` : ''} They will be added to the ${plural(expenses.length, 'expense')} already here.`;
            if (!window.confirm(confirmMessage)) return;

            const added = await importExpenses(newExpenses);
            if (added === null) {
                addToast('The expenses could not be imported. Nothing was changed.', 'error', 5000);
            } else {
                addToast(`Imported ${plural(added, 'expense')}.`, 'success');
            }
        } catch (error) {
            addToast(error instanceof ImportError ? error.message : 'That file could not be read. Choose a Phae CSV export.', 'error', 5000);
        } finally {
            setIsImporting(false);
        }
    };

    const handleReset = async () => {
        if (!window.confirm('Reset Phae? This permanently removes your expenses, preferences, and profile from this browser.')) return;
        setIsResetting(true);
        const success = await onResetAllData();
        if (!success) {
            addToast('Phae could not be fully reset. Some data may already have been cleared.', 'error');
            setIsResetting(false);
        }
    };

    return (
        <div className="space-y-8 pb-28">
            <header>
                <h1 className="text-3xl font-bold tracking-tight text-primary">Settings</h1>
                <p className="mt-1 text-secondary">Choose how Phae works on this device.</p>
            </header>

            <section className="settings-section" aria-labelledby="preferences-heading">
                <div className="section-heading"><ShieldCheck size={20} aria-hidden="true" /><h2 id="preferences-heading">Preferences</h2></div>
                <div className="settings-card grid gap-5 sm:grid-cols-2">
                    <div>
                        <label htmlFor="currency" className="field-label">Default currency</label>
                        <select id="currency" value={settings.currency} onChange={handleCurrencyChange} className="form-control mt-2">
                            {CURRENCIES.map((currency) => <option key={currency.code} value={currency.code}>{currency.label}</option>)}
                        </select>
                        <p className="mt-2 text-sm text-secondary">Amounts are stored as entered; changing this updates how every amount is displayed.</p>
                    </div>
                    <div>
                        <label htmlFor="date-format" className="field-label">Date format</label>
                        <select id="date-format" value={settings.dateFormat} onChange={(event) => updateSettings({ dateFormat: event.target.value })} className="form-control mt-2">
                            <option value="dd/MM/yyyy">31/12/2026</option>
                            <option value="MM/dd/yyyy">12/31/2026</option>
                            <option value="yyyy-MM-dd">2026-12-31</option>
                        </select>
                    </div>
                    <div>
                        <label htmlFor="week-start" className="field-label">Week starts on</label>
                        <select id="week-start" value={settings.startOfWeek} onChange={(event) => updateSettings({ startOfWeek: event.target.value })} className="form-control mt-2">
                            <option value="monday">Monday</option>
                            <option value="sunday">Sunday</option>
                        </select>
                    </div>
                </div>
            </section>

            <section className="settings-section" aria-labelledby="notifications-heading">
                <div className="section-heading"><Bell size={20} aria-hidden="true" /><h2 id="notifications-heading">Daily reminder</h2></div>
                <div className="settings-card space-y-5">
                    <div className="flex flex-wrap items-center justify-between gap-4">
                        <div><h3 className="font-semibold text-primary">Remind me to log expenses</h3><p className="mt-1 text-sm text-secondary">Phae can only send this while it’s open in a tab or app. It can’t remind you once it’s closed.</p></div>
                        <label className="toggle-control"><input type="checkbox" aria-label="Remind me to log expenses" checked={settings.notificationEnabled} onChange={handleNotificationChange} /><span aria-hidden="true" /></label>
                    </div>
                    <div className="grid gap-4 sm:grid-cols-[minmax(0,1fr)_auto] sm:items-end">
                        <div><label htmlFor="notification-time" className="field-label">Reminder time</label><input id="notification-time" type="time" value={settings.notificationTime} onChange={(event) => updateSettings({ notificationTime: event.target.value })} className="form-control mt-2" /></div>
                        <Button variant="secondary" onClick={handleTestNotification} disabled={!settings.notificationEnabled || notifications.permission !== 'granted'}>Send test</Button>
                    </div>
                    <div className="border-t border-border pt-5">
                        <div><h3 className="font-semibold text-primary">Add to your calendar</h3><p className="mt-1 text-sm text-secondary">Your calendar can remind you every day, even when Phae is closed. The event’s link opens a new expense. If you change the reminder time, add the event again and delete the old one.</p></div>
                        <Button variant="secondary" className="mt-4 gap-2" onClick={handleAddToCalendar}><CalendarPlus size={16} aria-hidden="true" />Add to calendar</Button>
                    </div>
                    {!notifications.supported && <p className="text-sm text-amber-500" role="status">Notifications are not supported in this browser.</p>}
                    {settings.notificationEnabled && notifications.permission === 'denied' && <p className="text-sm text-amber-500" role="status">Notifications are blocked. Enable them in your browser settings to use reminders.</p>}
                </div>
            </section>

            <section className="settings-section" aria-labelledby="appearance-heading">
                <div className="section-heading"><Palette size={20} aria-hidden="true" /><h2 id="appearance-heading">Appearance</h2></div>
                <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
                    {themes.map((item) => {
                        const selected = theme === item.id;
                        return (
                            <button key={item.id} type="button" onClick={() => changeTheme(item.id)} className={`theme-option ${selected ? 'theme-option-active' : ''}`} aria-pressed={selected}>
                                <span className="h-10 w-10 rounded-full border border-white/15 shadow-sm" style={{ backgroundColor: THEME_COLORS[item.id] }} aria-hidden="true" />
                                <span>{item.label}</span>
                            </button>
                        );
                    })}
                </div>
            </section>

            <section className="settings-section" aria-labelledby="data-heading">
                <div className="section-heading"><Download size={20} aria-hidden="true" /><h2 id="data-heading">Your data</h2></div>
                <p className="text-sm text-secondary" role="status">
                    {storageStatus === 'persisted'
                        ? 'Your expenses are stored only in this browser, and the browser has agreed not to clear them on its own.'
                        : 'Your expenses are stored only in this browser, which may clear them when space runs low or, in Safari, after 7 days without a visit. Download a backup regularly.'}
                    {isAppleMobileBrowserTab() && ' On iPhone and iPad, adding Phae to your Home Screen stops Safari clearing it.'}
                </p>
                <div className="settings-card flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                    <div>
                        <h3 className="font-semibold text-primary">Export expenses</h3>
                        <p className="mt-1 text-sm text-secondary">Download all {plural(expenses.length, 'expense')} as a CSV file. Keep it as a backup, or open it in a spreadsheet.</p>
                        <p className="mt-1 text-sm text-secondary">{lastBackupAt ? `Last exported ${formatExpenseDate(lastBackupAt.slice(0, 10), settings.dateFormat)}.` : 'Not exported yet.'}</p>
                    </div>
                    <Button variant="secondary" onClick={handleExport} className="shrink-0 gap-2"><Download size={17} aria-hidden="true" />Export CSV</Button>
                </div>
                <div className="settings-card flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                    <div>
                        <h3 className="font-semibold text-primary">Import expenses</h3>
                        <p className="mt-1 text-sm text-secondary">Restore a CSV exported from Phae. Expenses already here are skipped, so importing the same file twice is safe.</p>
                    </div>
                    <input ref={fileInputRef} type="file" accept=".csv,text/csv" className="sr-only" tabIndex={-1} aria-hidden="true" onChange={handleImportFile} />
                    <Button variant="secondary" onClick={() => fileInputRef.current?.click()} disabled={isImporting} className="shrink-0 gap-2"><Upload size={17} aria-hidden="true" />{isImporting ? 'Importing…' : 'Import CSV'}</Button>
                </div>
                <div className="danger-card mt-4 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                    <div><h3 className="font-semibold text-primary">Reset Phae</h3><p className="mt-1 text-sm text-secondary">Permanently remove your expenses, preferences, and profile from this browser.</p></div>
                    <Button variant="danger" onClick={handleReset} disabled={isResetting} className="gap-2"><RotateCcw size={17} aria-hidden="true" />{isResetting ? 'Resetting…' : 'Reset all data'}</Button>
                </div>
            </section>
        </div>
    );
};

export default More;
