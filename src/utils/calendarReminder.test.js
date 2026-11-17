import { describe, expect, it } from 'vitest';
import { createReminderIcs } from './calendarReminder';

const build = (time = '20:00') => createReminderIcs({
    time,
    appUrl: 'https://example.com/?add=1',
    now: new Date(2026, 10, 17, 9, 30),
    uid: 'test-uid@phae'
});

describe('createReminderIcs', () => {
    it('creates a daily event at the local reminder time with an alarm', () => {
        const ics = build();
        expect(ics).toContain('DTSTART:20261117T200000\r\n');
        expect(ics).toContain('DTEND:20261117T200500\r\n');
        expect(ics).toContain('RRULE:FREQ=DAILY\r\n');
        expect(ics).toContain('TRIGGER:PT0M\r\n');
        expect(ics).toContain('URL:https://example.com/?add=1\r\n');
        expect(ics.startsWith('BEGIN:VCALENDAR\r\n')).toBe(true);
        expect(ics.endsWith('END:VCALENDAR\r\n')).toBe(true);
    });

    it('escapes commas and keeps every line within 75 characters', () => {
        const ics = build();
        expect(ics).toContain('today\'s spending:');
        ics.split('\r\n').forEach((line) => expect(line.length).toBeLessThanOrEqual(75));
        expect(ics.replace(/\r\n /g, '')).toContain('DESCRIPTION:Take 30 seconds to log today\'s spending: https://example.com/?add=1');
    });

    it('keeps a late reminder inside the same day', () => {
        expect(build('23:58')).toContain('DTEND:20261117T235900');
    });
});
