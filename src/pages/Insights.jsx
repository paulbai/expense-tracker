import { useMemo } from 'react';
import { ListFilter } from 'lucide-react';
import Button from '../components/atoms/Button';
import PieChartCard from '../components/charts/PieChartCard';
import BarChartCard from '../components/charts/BarChartCard';
import LineChartCard from '../components/charts/LineChartCard';
import EmptyState from '../components/molecules/EmptyState';
import { useExpenses } from '../hooks/useExpenses';
import { useSettings } from '../hooks/useSettings';
import { calculateMonthTotal, formatCurrency, getMonthLabel } from '../utils/calculations';

const Insights = ({ onAddExpense, onBrowseExpenses }) => {
    const { expenses, loading, error, refreshExpenses } = useExpenses();
    const { settings } = useSettings();
    const monthTotal = useMemo(() => calculateMonthTotal(expenses), [expenses]);

    if (loading) return <p className="py-16 text-center text-secondary">Loading your insights…</p>;

    if (error) {
        return (
            <section className="empty-panel" role="alert">
                <h1 className="text-2xl font-bold text-primary">Insights are unavailable</h1>
                <p className="mt-2 text-secondary">{error}</p>
                <Button className="mt-6" onClick={refreshExpenses}>Try again</Button>
            </section>
        );
    }

    return (
        <div className="space-y-6 pb-28">
            <header className="flex flex-wrap items-end justify-between gap-4">
                <div>
                    <p className="text-sm text-secondary">{getMonthLabel()}</p>
                    <h1 className="mt-1 text-3xl font-bold tracking-tight text-primary">Spending insights</h1>
                    <p className="mt-2 max-w-xl text-secondary">Use your real spending history to spot where your money is going.</p>
                </div>
                <Button variant="secondary" onClick={onBrowseExpenses} className="gap-2">
                    <ListFilter size={18} aria-hidden="true" />
                    Browse expenses
                </Button>
            </header>

            {expenses.length === 0 ? (
                <EmptyState onAddFirst={onAddExpense} />
            ) : (
                <>
                    <section className="insight-total" aria-label="Monthly total">
                        <p className="text-sm text-white/85">This month</p>
                        <p className="mt-1 text-4xl font-bold tabular-nums text-white">{formatCurrency(monthTotal, settings.currency)}</p>
                    </section>
                    <section aria-label="Spending analysis" className="grid gap-6 lg:grid-cols-2">
                        <PieChartCard expenses={expenses} currency={settings.currency} />
                        <BarChartCard expenses={expenses} currency={settings.currency} />
                    </section>
                    <LineChartCard expenses={expenses} currency={settings.currency} />
                </>
            )}
        </div>
    );
};

export default Insights;
