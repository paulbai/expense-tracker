import { useState } from 'react';
import Dashboard from './components/organisms/Dashboard';
import FloatingButton from './components/atoms/FloatingButton';
import AllExpenses from './pages/AllExpenses';
import AddExpenseModal from './components/organisms/AddExpenseModal';
import { ToastProvider } from './components/atoms/Toast';

function AppContent() {
  const [currentPage, setCurrentPage] = useState('dashboard'); // 'dashboard', 'all-expenses'
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

  const renderPage = () => {
    switch (currentPage) {
      case 'dashboard':
        return (
          <Dashboard
            onAddExpense={() => setIsModalOpen(true)}
            onViewAll={() => setCurrentPage('all-expenses')}
            onEditExpense={handleEditExpense}
          />
        );
      case 'all-expenses':
        return (
          <AllExpenses
            onBack={() => setCurrentPage('dashboard')}
            onEditExpense={handleEditExpense}
          />
        );
      default:
        return <Dashboard />;
    }
  };

  return (
    <div className="min-h-screen bg-[#1a1d29] text-white font-sans selection:bg-violet-500/30">
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        {renderPage()}
      </main>

      <FloatingButton onClick={() => setIsModalOpen(true)} />

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
