import { useState } from 'react';
import { Download, Smartphone } from 'lucide-react';
import Button from '../atoms/Button';
import { useToast } from '../atoms/Toast';
import { useBackup } from '../../hooks/useBackup';
import { useSettings } from '../../hooks/useSettings';
import { isAppleMobileBrowserTab } from '../../utils/device';

const Notice = ({ icon, titleId, title, children, actions }) => (
    <section className="notice-card" aria-labelledby={titleId}>
        <span className="mt-0.5 shrink-0 text-accent" aria-hidden="true">{icon}</span>
        <div className="min-w-0 flex-1">
            <h2 id={titleId} className="font-semibold text-primary">{title}</h2>
            <p className="mt-1 text-sm text-secondary">{children}</p>
            <div className="mt-4 flex flex-wrap gap-3">{actions}</div>
        </div>
    </section>
);

// Shows at most one notice at a time, so the dashboard stays readable on phones.
const DataSafetyNotices = () => {
    const { settings, updateSettings } = useSettings();
    const { downloadBackup, snoozeReminder, reminderDue, unsavedCount } = useBackup();
    const { addToast } = useToast();
    const [showHomeScreenHint] = useState(isAppleMobileBrowserTab);

    const handleBackup = async () => {
        const started = await downloadBackup();
        addToast(started ? 'Backup downloaded. Keep the file somewhere safe.' : 'There is nothing to back up yet.', started ? 'success' : 'info');
    };

    return (
        <>
            {reminderDue && (
                <Notice
                    icon={<Download size={22} />}
                    titleId="backup-reminder-title"
                    title="Back up your expenses"
                    actions={(
                        <>
                            <Button size="sm" className="min-h-11 gap-2" onClick={handleBackup}><Download size={16} aria-hidden="true" />Download backup</Button>
                            <Button size="sm" variant="ghost" className="min-h-11" onClick={snoozeReminder}>Remind me later</Button>
                        </>
                    )}
                >
                    {unsavedCount} expenses aren’t in a backup yet. Phae keeps your data only in this browser, so a backup file is the only way to restore it on a new phone or after the browser clears it.
                </Notice>
            )}
            {!reminderDue && showHomeScreenHint && !settings.homeScreenHintDismissed && (
                <Notice
                    icon={<Smartphone size={22} />}
                    titleId="home-screen-hint-title"
                    title="Add Phae to your Home Screen"
                    actions={(
                        <>
                            <Button size="sm" variant="secondary" className="min-h-11 gap-2" onClick={handleBackup}><Download size={16} aria-hidden="true" />Download backup</Button>
                            <Button size="sm" variant="ghost" className="min-h-11" onClick={() => updateSettings({ homeScreenHintDismissed: true })}>Got it</Button>
                        </>
                    )}
                >
                    On iPhone and iPad, Safari deletes Phae’s data if you don’t open it for 7 days. Tap Share, then Add to Home Screen, and use Phae from there. The Home Screen app starts empty, so download a backup here first, then import it in Settings.
                </Notice>
            )}
        </>
    );
};

export default DataSafetyNotices;
