// Asks the browser not to clear Phae's storage when space runs low or after a
// period without visits. Chrome and Edge decide silently, Firefox may ask the
// user, and Safari grants it more readily once Phae is on the Home Screen.
export const requestPersistentStorage = async () => {
    if (typeof navigator === 'undefined' || !navigator.storage?.persist) return 'unsupported';
    try {
        if (await navigator.storage.persisted()) return 'persisted';
        return (await navigator.storage.persist()) ? 'persisted' : 'not-persisted';
    } catch {
        return 'unsupported';
    }
};

export const getPersistentStorageStatus = async () => {
    if (typeof navigator === 'undefined' || !navigator.storage?.persisted) return 'unsupported';
    try {
        return (await navigator.storage.persisted()) ? 'persisted' : 'not-persisted';
    } catch {
        return 'unsupported';
    }
};

export const isInstalledApp = () => (
    typeof window !== 'undefined'
    && (window.matchMedia?.('(display-mode: standalone)').matches || window.navigator.standalone === true)
);

// iPhone and iPad browsers all use Safari's storage rules, which clear site data
// after 7 days without a visit unless the site was added to the Home Screen.
export const isAppleMobileBrowserTab = () => {
    if (typeof navigator === 'undefined') return false;
    const { userAgent, platform, maxTouchPoints } = navigator;
    if (/Android/.test(userAgent)) return false;
    // iPadOS reports itself as a Mac, so a touch screen is what gives it away.
    const appleMobile = /iPhone|iPad|iPod/.test(userAgent) || (platform === 'MacIntel' && maxTouchPoints > 1);
    return appleMobile && !isInstalledApp();
};
