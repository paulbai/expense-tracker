import { useState } from 'react';
import Dashboard from './components/organisms/Dashboard';
import BottomNavigation from './components/molecules/BottomNavigation';
import AllExpenses from './pages/AllExpenses';
import AddExpenseModal from './components/organisms/AddExpenseModal';
import Onboarding from './pages/Onboarding';
import More from './pages/More';
import { ToastProvider } from './components/atoms/Toast';
import { useUser } from './hooks/useUser';

function AppContent() {
  const { user, loading, login } = useUser();
  const [currentPage, setCurrentPage] = useState('dashboard'); // 'dashboard', 'insights', 'more', 'all-expenses'
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [expenseToEdit, setExpenseToEdit] = useState(null);

  const handleEditExpense = (expense) => {
    setExpenseToEdit(expense);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setExpenseToEdit(null);
  };

  const handleOnboardingComplete = async (username) => {
    await login(username);
  };

  // Show loading state or splash screen while checking user
  if (loading) {
    return (
      <div className="min-h-screen bg-bg flex items-center justify-center">
        <div className="w-8 h-8 border-2 border-accent border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  // Show Onboarding if no user
  if (!user) {
    return <Onboarding onComplete={handleOnboardingComplete} />;
  }

  const renderPage = () => {
    switch (currentPage) {
      case 'dashboard':
        return (
          <Dashboard
            username={user.name}
            onAddExpense={() => setIsModalOpen(true)}
            onViewAll={() => setCurrentPage('all-expenses')}
            onEditExpense={handleEditExpense}
          />
        );
      case 'insights':
        // For now, render AllExpenses or a placeholder for Insights if not ready
        // The user mentioned moving charts to Insights. We'll reuse AllExpenses for now or check plan.
        // Plan said "Move Charts to Insights". Let's use AllExpenses as placeholder for "Reports" tab logic for this step?
        // Actually, let's keep AllExpenses accessible via "View All" on Dashboard, and make Insights a placeholder for now or move charts later.
        // For this step, I'll direct 'insights' to AllExpenses as it has the list/charts context usually.
        return (
          <div className="pb-24">
            <h1 className="text-3xl font-bold text-primary mb-6">Insights</h1>
            <AllExpenses
              onBack={() => setCurrentPage('dashboard')}
              onEditExpense={handleEditExpense}
              hideBack // We want it to look like a main tab
            />
          </div>
        );
      case 'more':
        return <More />;
      case 'all-expenses':
        return (
          <AllExpenses
            onBack={() => setCurrentPage('dashboard')}
            onEditExpense={handleEditExpense}
          />
        );
      default:
        return <Dashboard username={user.name} />;
    }
  };

  return (
    <div className="min-h-screen bg-bg text-primary font-sans selection:bg-accent/30 transition-colors duration-300">
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        {renderPage()}
      </main>

      <BottomNavigation
        activeTab={currentPage === 'all-expenses' ? 'dashboard' : currentPage}
        onTabChange={setCurrentPage}
        onAddExpense={() => setIsModalOpen(true)}
      />

      <AddExpenseModal
        isOpen={isModalOpen}
        onClose={handleCloseModal}
        expenseToEdit={expenseToEdit}
      />
    </div>
  );
}

function App() {
  return (
    <ToastProvider>
      <AppContent />
    </ToastProvider>
  );
}

export default App;
