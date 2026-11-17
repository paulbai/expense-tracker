import { useCallback, useEffect, useMemo, useState } from 'react';
import { differenceInCalendarDays, parseISO } from 'date-fns';
import { calculateDateTotal, formatCurrency } from '../utils/calculations';
import { ADD_EXPENSE_PATH } from '../utils/calendarReminder';

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

        const lastDate = expenses.reduce((latest, expense) => (expense.date > latest ? expense.date : latest), '');
        const daysAway = lastDate ? differenceInCalendarDays(new Date(), parseISO(lastDate)) : 0;
        if (daysAway >= 2) {
            return {
                title: `It has been ${daysAway} days`,
                body: 'Log today’s spending to start a new streak. It takes 30 seconds.'
            };
        }

        return {
            title: 'How was your spending today?',
            body: 'Take 30 seconds to log your expenses.'
        };
    }, [currency, expenses]);

    // Android Chrome only allows notifications through the service worker, and
    // only service worker notifications can open the add form when tapped.
    const showReminder = useCallback(async () => {
        if (!supported || window.Notification.permission !== 'granted') return false;
        const { title, body } = notificationContent();
        const options = {
            body,
            icon: '/icon-192.png',
            badge: '/icon-192.png',
            tag: 'phae-daily-reminder',
            data: { url: ADD_EXPENSE_PATH }
        };

        try {
            const registration = await navigator.serviceWorker?.getRegistration();
            if (registration) {
                await registration.showNotification(title, options);
                return true;
            }
            new window.Notification(title, options);
            return true;
        } catch {
            return false;
        }
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
