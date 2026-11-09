import { useState } from 'react';
import { Bell, Download, Palette, RotateCcw, ShieldCheck } from 'lucide-react';
import Button from '../components/atoms/Button';
import { useToast } from '../components/atoms/Toast';
import { useExpenses } from '../hooks/useExpenses';
import { useSettings } from '../hooks/useSettings';
import { useTheme } from '../hooks/useTheme';
import { CURRENCIES } from '../utils/constants';
import { downloadExpensesCsv } from '../utils/exportExpenses';

const THEME_COLORS = {
    dark: '#1a1d29', light: '#e0e5ec', aurora: '#0b1026', ocean: '#0f172a', sunset: '#2a1b1b',
    bioluminescence: '#020617', deep_teal: '#134e4a', retro: '#2e0228', neon: '#000000'
};

const More = ({ notifications, onResetAllData }) => {
    const [isResetting, setIsResetting] = useState(false);
    const { expenses } = useExpenses();
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
            addToast('Reminders are enabled while Phae is open.', 'success');
        } else {
            addToast('Notification permission was not granted.', 'warning');
        }
    };

    const handleTestNotification = () => {
        const sent = notifications.testNotification();
        addToast(sent ? 'Test notification sent.' : 'Allow notifications first, then try again.', sent ? 'success' : 'warning');
    };

    const handleExport = () => {
        if (expenses.length === 0) {
            addToast('There are no expenses to export yet.', 'info');
            return;
        }
        downloadExpensesCsv(expenses, settings.dateFormat);
        addToast('Your CSV download has started.', 'success');
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
                        <div><h3 className="font-semibold text-primary">Remind me to log expenses</h3><p className="mt-1 text-sm text-secondary">Phae can send a daily reminder when it is open.</p></div>
                        <label className="toggle-control"><input type="checkbox" aria-label="Remind me to log expenses" checked={settings.notificationEnabled} onChange={handleNotificationChange} /><span aria-hidden="true" /></label>
                    </div>
                    <div className="grid gap-4 sm:grid-cols-[minmax(0,1fr)_auto] sm:items-end">
                        <div><label htmlFor="notification-time" className="field-label">Reminder time</label><input id="notification-time" type="time" value={settings.notificationTime} onChange={(event) => updateSettings({ notificationTime: event.target.value })} className="form-control mt-2" /></div>
                        <Button variant="secondary" onClick={handleTestNotification} disabled={!settings.notificationEnabled || notifications.permission !== 'granted'}>Send test</Button>
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
                <div className="settings-card flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                    <div><h3 className="font-semibold text-primary">Export expenses</h3><p className="mt-1 text-sm text-secondary">Download all {expenses.length} expenses as a CSV file.</p></div>
                    <Button variant="secondary" onClick={handleExport}>Export CSV</Button>
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
