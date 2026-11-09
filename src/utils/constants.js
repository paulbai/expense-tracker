export const CATEGORIES = [
    { id: 'food', label: 'Food', icon: '🍔', color: '#FF6B6B' },
    { id: 'transportation', label: 'Transportation', icon: '🚗', color: '#4ECDC4' },
    { id: 'shopping', label: 'Shopping', icon: '🛍️', color: '#95E1D3' },
    { id: 'debt_payment', label: 'Debt Payment', icon: '💳', color: '#F38181' },
    { id: 'entertainment', label: 'Entertainment', icon: '🎬', color: '#AA96DA' },
    { id: 'healthcare', label: 'Healthcare', icon: '🏥', color: '#FCBAD3' },
    { id: 'utilities', label: 'Utilities', icon: '💡', color: '#FFFFD2' },
    { id: 'miscellaneous', label: 'Miscellaneous', icon: '📦', color: '#A8D8EA' }
];

export const CURRENCIES = [
    { code: 'SLE', label: 'Sierra Leonean leone (SLE)' },
    { code: 'USD', label: 'US dollar (USD)' },
    { code: 'EUR', label: 'Euro (EUR)' },
    { code: 'GBP', label: 'British pound (GBP)' },
    { code: 'GHS', label: 'Ghanaian cedi (GHS)' },
    { code: 'NGN', label: 'Nigerian naira (NGN)' }
];

export const DEFAULT_SETTINGS = {
    notificationEnabled: false,
    notificationTime: '20:00',
    currency: 'SLE',
    dateFormat: 'dd/MM/yyyy',
    startOfWeek: 'monday',
    theme: 'dark'
};

export const STORAGE_KEYS = {
    EXPENSES: 'expenses',
    SETTINGS: 'user_settings',
    STREAK: 'streak_data',
    USER_PROFILE: 'phae_user_profile'
};
