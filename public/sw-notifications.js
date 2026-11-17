// Loaded into the generated service worker (see vite.config.js).
// Tapping a reminder opens Phae on the add expense form.
self.addEventListener('notificationclick', (event) => {
    event.notification.close();
    const target = new URL(event.notification.data?.url || '/?add=1', self.location.origin).href;

    event.waitUntil((async () => {
        const windows = await self.clients.matchAll({ type: 'window', includeUncontrolled: true });
        const open = windows.find((client) => new URL(client.url).origin === self.location.origin);
        if (open) {
            await open.focus();
            open.postMessage({ type: 'phae:add-expense' });
            return;
        }
        await self.clients.openWindow(target);
    })());
});
