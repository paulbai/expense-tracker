import { lazy, Suspense, useEffect, useState } from 'react';
import Dashboard from './components/organisms/Dashboard';
import AddExpenseModal from './components/organisms/AddExpenseModal';
import BottomNavigation from './components/molecules/BottomNavigation';
import CelebrationModal from './components/molecules/CelebrationModal';
import AllExpenses from './pages/AllExpenses';
import More from './pages/More';
import Onboarding from './pages/Onboarding';
import { ToastProvider } from './components/atoms/Toast';
import { useExpenses } from './hooks/useExpenses';
import { useNotifications } from './hooks/useNotifications';
import { useSettings } from './hooks/useSettings';
import { useUser } from './hooks/useUser';

const Insights = lazy(() => import('./pages/Insights'));

const MILESTONES = [7, 14, 30, 60, 90];

function AppContent() {
    const { user, loading: userLoading, error: userError, login, resetUser } = useUser();
    const { expenses, clearExpenses } = useExpenses();
    const { settings, resetSettings, updateSettings } = useSettings();
    const [currentPage, setCurrentPage] = useState('dashboard');
    const [listOrigin, setListOrigin] = useState('dashboard');
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [expenseToEdit, setExpenseToEdit] = useState(null);
    const [celebrationStreak, setCelebrationStreak] = useState(null);
    const notifications = useNotifications({
        enabled: settings.notificationEnabled,
        time: settings.notificationTime,
        expenses,
        currency: settings.currency,
        onEnabledChange: (notificationEnabled) => updateSettings({ notificationEnabled })
    });

    useEffect(() => {
        window.scrollTo(0, 0);
    }, [currentPage]);

    const openExpenseList = (origin = currentPage) => {
        setListOrigin(origin);
        setCurrentPage('all-expenses');
    };

    const handleEditExpense = (expense) => {
        setExpenseToEdit(expense);
        setIsModalOpen(true);
    };

    const handleCloseModal = () => {
        setIsModalOpen(false);
        setExpenseToEdit(null);
    };

    const handleExpenseSaved = ({ action, streakData }) => {
        if (action === 'added' && MILESTONES.includes(streakData.currentStreak)) {
            setCelebrationStreak(streakData.currentStreak);
        }
    };

    const handleResetAllData = async () => {
        const expensesCleared = await clearExpenses();
        if (!expensesCleared) return false;
        const settingsReset = await resetSettings();
        if (!settingsReset) return false;
        const userReset = await resetUser();
        return userReset;
    };

    if (userLoading) {
        return <div className="flex min-h-screen items-center justify-center bg-bg"><div className="h-8 w-8 animate-spin rounded-full border-2 border-accent border-t-transparent" aria-label="Loading" /></div>;
    }

    if (userError) {
        return (
            <main className="flex min-h-screen items-center justify-center bg-bg p-6">
                <section className="empty-panel max-w-lg" role="alert">
                    <h1 className="text-2xl font-bold text-primary">Phae could not open your profile</h1>
                    <p className="mt-2 text-secondary">{userError}</p>
                    <button type="button" className="text-button mt-5" onClick={() => window.location.reload()}>Reload Phae</button>
                </section>
            </main>
        );
    }

    if (!user) return <Onboarding onComplete={login} />;

    const renderPage = () => {
        switch (currentPage) {
            case 'insights':
                return (
                    <Suspense fallback={<p className="py-16 text-center text-secondary">Loading insights…</p>}>
                        <Insights onAddExpense={() => setIsModalOpen(true)} onBrowseExpenses={() => openExpenseList('insights')} />
                    </Suspense>
                );
            case 'more':
                return <More notifications={notifications} onResetAllData={handleResetAllData} />;
            case 'all-expenses':
                return <AllExpenses onBack={() => setCurrentPage(listOrigin)} onEditExpense={handleEditExpense} />;
            case 'dashboard':
            default:
                return (
                    <Dashboard
                        username={user.name}
                        onAddExpense={() => setIsModalOpen(true)}
                        onViewAll={() => openExpenseList('dashboard')}
                        onEditExpense={handleEditExpense}
                    />
                );
        }
    };

    const activeTab = currentPage === 'all-expenses' ? listOrigin : currentPage;

    return (
        <div className="min-h-screen bg-bg font-sans text-primary">
            <a className="skip-link" href="#main-content">Skip to content</a>
            <main id="main-content" className="mx-auto max-w-7xl px-4 py-6 pb-32 sm:px-6 lg:px-8">
                {renderPage()}
            </main>
            <BottomNavigation activeTab={activeTab} onTabChange={setCurrentPage} onAddExpense={() => setIsModalOpen(true)} />
            <AddExpenseModal
                key={isModalOpen ? expenseToEdit?.id || 'new-expense' : 'closed'}
                isOpen={isModalOpen}
                onClose={handleCloseModal}
                onExpenseSaved={handleExpenseSaved}
                expenseToEdit={expenseToEdit}
            />
            <CelebrationModal isOpen={celebrationStreak !== null} onClose={() => setCelebrationStreak(null)} streak={celebrationStreak || 0} />
        </div>
    );
}

function App() {
    return <ToastProvider><AppContent /></ToastProvider>;
}

export default App;
