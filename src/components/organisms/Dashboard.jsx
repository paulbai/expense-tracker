import { lazy, Suspense, useMemo } from 'react';
import { Plus } from 'lucide-react';
import StatCard from '../molecules/StatCard';
import EmptyState from '../molecules/EmptyState';
import ExpenseCard from '../molecules/ExpenseCard';
import Skeleton from '../atoms/Skeleton';
import Button from '../atoms/Button';
import { useExpenses } from '../../hooks/useExpenses';
import { useSettings } from '../../hooks/useSettings';
import { useStreak } from '../../hooks/useStreak';
import { useToast } from '../atoms/Toast';
import { getCategoryLabel } from '../../utils/constants';
import {
    calculateMonthTotal,
    calculateWeeklyTotal,
    compareNewestFirst,
    formatCurrency,
    getMonthLabel,
    getThisMonthExpensesCount
} from '../../utils/calculations';

const PieChartCard = lazy(() => import('../charts/PieChartCard'));
const BarChartCard = lazy(() => import('../charts/BarChartCard'));
const LineChartCard = lazy(() => import('../charts/LineChartCard'));

const ChartsLoading = ({ className = '' }) => <div className={`h-[400px] rounded-[24px] border border-border bg-surface ${className}`} aria-label="Loading chart" />;

const Dashboard = ({ onAddExpense, onViewAll, onEditExpense, username }) => {
    const { expenses, loading, error, deleteExpense, refreshExpenses } = useExpenses();
    const { settings } = useSettings();
    const { streakData } = useStreak();
    const { addToast } = useToast();

    const metrics = useMemo(() => ({
        monthTotal: calculateMonthTotal(expenses),
        weekTotal: calculateWeeklyTotal(expenses, settings.startOfWeek === 'sunday' ? 0 : 1),
        count: getThisMonthExpensesCount(expenses)
    }), [expenses, settings.startOfWeek]);

    const recentExpenses = useMemo(() => [...expenses]
        .sort(compareNewestFirst)
        .slice(0, 5), [expenses]);

    const handleDelete = async (expense) => {
        if (!window.confirm(`Delete ${formatCurrency(expense.amount, settings.currency)} for ${getCategoryLabel(expense.category)}?`)) return;
        const success = await deleteExpense(expense.id);
        addToast(success ? 'Expense deleted.' : 'The expense could not be deleted.', success ? 'success' : 'error');
    };

    if (loading) {
        return (
            <div className="space-y-6 pb-28" aria-busy="true" aria-label="Loading dashboard">
                <div className="flex items-center justify-between"><div><Skeleton className="mb-2 h-8 w-48" /><Skeleton className="h-4 w-32" /></div><Skeleton variant="circular" width={48} height={48} /></div>
                <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">{[1, 2, 3, 4].map((item) => <Skeleton key={item} variant="rectangular" className="h-32" />)}</div>
                <Skeleton variant="rectangular" className="h-96" />
            </div>
        );
    }

    if (error) {
        return (
            <section className="empty-panel" role="alert">
                <h1 className="text-2xl font-bold text-primary">Your expenses need attention</h1>
                <p className="mt-2 max-w-md text-secondary">{error} Your saved data has not been overwritten.</p>
                <Button className="mt-6" onClick={refreshExpenses}>Try again</Button>
            </section>
        );
    }

    return (
        <div className="space-y-6 pb-28">
            <header className="flex flex-wrap items-center justify-between gap-4">
                <div className="flex items-center gap-3">
                    <img src="/logo.png" width="48" height="48" alt="Phae" className="h-12 w-12 rounded-xl border border-border object-cover" />
                    <div>
                        <p className="text-sm text-secondary">{getMonthLabel()}</p>
                        <h1 className="text-2xl font-bold tracking-tight text-primary">Hello, {username || 'there'}</h1>
                    </div>
                </div>
                <Button onClick={onAddExpense} className="min-h-11 gap-2">
                    <Plus size={18} aria-hidden="true" />
                    Add expense
                </Button>
            </header>

            {expenses.length === 0 ? (
                <EmptyState onAddFirst={onAddExpense} />
            ) : (
                <>
                    <section className="grid gap-4 md:grid-cols-2 lg:grid-cols-4" aria-label="Spending summary">
                        <article className="relative overflow-hidden rounded-[24px] bg-gradient-to-br from-violet-600 to-pink-600 p-6 text-white shadow-lg shadow-violet-950/30 md:col-span-2">
                            <p className="text-sm font-medium text-white/85">This month’s spending</p>
                            <p className="mt-2 text-4xl font-bold tracking-tight tabular-nums">{formatCurrency(metrics.monthTotal, settings.currency)}</p>
                            <p className="mt-2 text-sm text-white/90">{metrics.count} {metrics.count === 1 ? 'expense' : 'expenses'} logged</p>
                            <div className="pointer-events-none absolute -right-8 -top-12 h-40 w-40 rounded-full bg-white/10 blur-2xl" />
                        </article>
                        <StatCard label="Current streak" value={<><span>{streakData.currentStreak} {streakData.currentStreak === 1 ? 'day' : 'days'}</span><span aria-hidden="true" className="ml-2 text-2xl">🔥</span></>} />
                        <StatCard label="This week" value={formatCurrency(metrics.weekTotal, settings.currency)} icon="📅" />
                    </section>

                    <section aria-label="Spending charts" className="grid gap-6 md:grid-cols-2">
                        <Suspense fallback={<ChartsLoading />}><PieChartCard expenses={expenses} currency={settings.currency} /></Suspense>
                        <Suspense fallback={<ChartsLoading />}><BarChartCard expenses={expenses} currency={settings.currency} /></Suspense>
                    </section>
                    <Suspense fallback={<ChartsLoading />}><LineChartCard expenses={expenses} currency={settings.currency} /></Suspense>

                    <section aria-labelledby="recent-expenses-heading">
                        <div className="mb-4 flex items-center justify-between gap-4">
                            <div>
                                <h2 id="recent-expenses-heading" className="text-xl font-bold text-primary">Recent expenses</h2>
                                <p className="mt-1 text-sm text-secondary">Your five latest entries</p>
                            </div>
                            <button type="button" onClick={onViewAll} className="text-button">View all expenses</button>
                        </div>
                        <div className="space-y-3">
                            {recentExpenses.map((expense) => (
                                <ExpenseCard
                                    key={expense.id}
                                    expense={expense}
                                    currency={settings.currency}
                                    dateFormat={settings.dateFormat}
                                    onEdit={onEditExpense}
                                    onDelete={handleDelete}
                                />
                            ))}
                        </div>
                    </section>
                </>
            )}
        </div>
    );
};

export default Dashboard;
