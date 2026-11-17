// Builds an iCalendar file with a daily event at the user's reminder time.
// Calendar apps remind people reliably even when Phae is closed, which a
// website without a server cannot do on its own.

const pad = (value) => String(value).padStart(2, '0');

const escapeText = (value) => value
    .replace(/\\/g, '\\\\')
    .replace(/;/g, '\\;')
    .replace(/,/g, '\\,')
    .replace(/\n/g, '\\n');

// iCalendar lines longer than 75 characters must continue on a line that
// starts with a space.
const foldLine = (line) => {
    const parts = [];
    let rest = line;
    while (rest.length > 75) {
        parts.push(rest.slice(0, 75));
        rest = ` ${rest.slice(75)}`;
    }
    parts.push(rest);
    return parts.join('\r\n');
};

const utcStamp = (date) => (
    `${date.getUTCFullYear()}${pad(date.getUTCMonth() + 1)}${pad(date.getUTCDate())}`
    + `T${pad(date.getUTCHours())}${pad(date.getUTCMinutes())}${pad(date.getUTCSeconds())}Z`
);

export const ADD_EXPENSE_PATH = '/?add=1';

export const createReminderIcs = ({ time, appUrl, now = new Date(), uid }) => {
    const [hours, minutes] = time.split(':').map(Number);
    const startDate = `${now.getFullYear()}${pad(now.getMonth() + 1)}${pad(now.getDate())}`;
    // No time zone on purpose: the event stays at this local time wherever the user is.
    const start = `${startDate}T${pad(hours)}${pad(minutes)}00`;
    const endTotal = hours * 60 + minutes + 5;
    const end = `${startDate}T${pad(Math.floor(endTotal / 60) % 24)}${pad(endTotal % 60)}00`;
    const description = `Take 30 seconds to log today's spending: ${appUrl}`;

    return [
        'BEGIN:VCALENDAR',
        'VERSION:2.0',
        'PRODID:-//Phae//Daily reminder//EN',
        'CALSCALE:GREGORIAN',
        'METHOD:PUBLISH',
        'BEGIN:VEVENT',
        `UID:${uid}`,
        `DTSTAMP:${utcStamp(now)}`,
        `DTSTART:${start}`,
        // An event that crosses midnight would end before it starts, so keep it to 5 minutes inside the day.
        `DTEND:${endTotal >= 24 * 60 ? `${startDate}T235900` : end}`,
        'RRULE:FREQ=DAILY',
        'SUMMARY:Log today’s expenses in Phae',
        `DESCRIPTION:${escapeText(description)}`,
        `URL:${appUrl}`,
        'TRANSP:TRANSPARENT',
        'BEGIN:VALARM',
        'ACTION:DISPLAY',
        'DESCRIPTION:Log today’s expenses in Phae',
        'TRIGGER:PT0M',
        'END:VALARM',
        'END:VEVENT',
        'END:VCALENDAR'
    ].map(foldLine).join('\r\n') + '\r\n';
};

export const downloadReminderIcs = (time) => {
    const appUrl = new URL(ADD_EXPENSE_PATH, window.location.origin).href;
    const uid = `${globalThis.crypto?.randomUUID?.() || Date.now()}@phae`;
    const blob = new Blob([createReminderIcs({ time, appUrl, uid })], { type: 'text/calendar;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = 'phae-daily-reminder.ics';
    document.body.append(link);
    link.click();
    link.remove();
    URL.revokeObjectURL(url);
};
