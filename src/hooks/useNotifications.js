import { useCallback, useEffect, useMemo, useState } from 'react';
import { calculateDateTotal, formatCurrency } from '../utils/calculations';

const getReminderDelay = (time) => {
    const [hours, minutes] = time.split(':').map(Number);
    const now = new Date();
    const nextReminder = new Date(now);
    nextReminder.setHours(hours, minutes, 0, 0);

    if (nextReminder <= now) nextReminder.setDate(nextReminder.getDate() + 1);
    return nextReminder.getTime() - now.getTime();
};

export const useNotifications = ({ enabled, time, expenses, currency, onEnabledChange }) => {
    const supported = typeof window !== 'undefined' && 'Notification' in window;
    const [permission, setPermission] = useState(() => (
        supported ? window.Notification.permission : 'unsupported'
    ));

    const notificationContent = useCallback(() => {
        const todayTotal = calculateDateTotal(expenses, new Date());
        if (todayTotal > 0) {
            return {
                title: 'Nice work logging today',
                body: `You have logged ${formatCurrency(todayTotal, currency)} today.`
            };
        }

        return {
            title: 'How was your spending today?',
            body: 'Take 30 seconds to log your expenses.'
        };
    }, [currency, expenses]);

    const showReminder = useCallback(() => {
        if (!supported || window.Notification.permission !== 'granted') return false;
        const { title, body } = notificationContent();
        new window.Notification(title, { body, icon: '/logo.png', badge: '/logo.png' });
        return true;
    }, [notificationContent, supported]);

    useEffect(() => {
        if (!enabled || permission !== 'granted') return undefined;

        let timerId;
        const scheduleNextReminder = () => {
            timerId = window.setTimeout(() => {
                showReminder();
                scheduleNextReminder();
            }, getReminderDelay(time));
        };

        scheduleNextReminder();
        return () => window.clearTimeout(timerId);
    }, [enabled, permission, showReminder, time]);

    const requestPermission = useCallback(async () => {
        if (!supported) return { success: false, status: 'unsupported' };

        const nextPermission = await window.Notification.requestPermission();
        setPermission(nextPermission);

        if (nextPermission === 'granted') {
            await onEnabledChange(true);
            return { success: true, status: nextPermission };
        }

        await onEnabledChange(false);
        return { success: false, status: nextPermission };
    }, [onEnabledChange, supported]);

    const testNotification = useCallback(() => showReminder(), [showReminder]);

    return useMemo(() => ({
        supported,
        permission,
        requestPermission,
        testNotification
    }), [permission, requestPermission, supported, testNotification]);
};
