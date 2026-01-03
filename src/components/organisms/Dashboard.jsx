import React, { useMemo } from 'react';
import StatCard from '../molecules/StatCard';
import EmptyState from '../molecules/EmptyState';
import Skeleton from '../atoms/Skeleton';
import PieChartCard from '../charts/PieChartCard';
import BarChartCard from '../charts/BarChartCard';
import LineChartCard from '../charts/LineChartCard';
import { useExpenses } from '../../hooks/useExpenses';
import { useStreak } from '../../hooks/useStreak';
import { calculateMonthTotal, getThisMonthExpensesCount, formatCurrency, calculateWeeklyTotal } from '../../utils/calculations';
import { CATEGORIES } from '../../utils/constants';

import CelebrationModal from '../molecules/CelebrationModal';

const Dashboard = ({ onAddExpense, onViewAll, onEditExpense }) => {
    const { expenses, loading } = useExpenses();
    const { streakData } = useStreak();
    const [showCelebration, setShowCelebration] = React.useState(false);

    // Simple milestone check effect (mimic)
    // Real implementation: useStreak updates `streakData` and perhaps returns a `milestoneReached` flag
    // For now, we'll check if just mounted/updated and have a milestone streak
    React.useEffect(() => {
        if (streakData.currentStreak > 0 && [3, 7, 30, 100].includes(streakData.currentStreak)) {
            // In a real app we'd track "seen" state to avoid showing on every reload
            // setShowCelebration(true); 
        }
    }, [streakData.currentStreak]);

    const metrics = useMemo(() => {
        if (!expenses || expenses.length === 0) {
            return {
                monthTotal: 0,
                weekTotal: 0,
                count: 0
            };
        }

        const monthTotal = calculateMonthTotal(expenses);
        const weekTotal = calculateWeeklyTotal(expenses);
        const count = getThisMonthExpensesCount(expenses);

        return {
            monthTotal,
            weekTotal,
            count
        };
    }, [expenses]);

    if (loading) {
        return (
            <div className="space-y-6 pb-24 animate-in fade-in duration-500">
                {/* Header Skeleton */}
                <div className="flex items-center justify-between">
                    <div>
                        <Skeleton className="h-8 w-48 mb-2" />
                        <Skeleton className="h-4 w-32" />
                    </div>
                    <Skeleton variant="circular" width={48} height={48} />
                </div>

                {/* Metrics Skeleton */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                    {[1, 2, 3, 4].map((i) => (
                        <div key={i} className="bg-[#252936] p-6 rounded-[32px] border border-white/5 h-32 flex flex-col justify-between">
                            <Skeleton className="h-4 w-24" />
                            <Skeleton className="h-8 w-32" />
                        </div>
                    ))}
                </div>

                {/* Charts Skeleton */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    <div className="bg-[#252936] p-6 rounded-[32px] h-80 border border-white/5">
                        <Skeleton className="h-6 w-32 mb-6" />
                        <div className="flex items-center justify-center h-56">
                            <Skeleton variant="circular" width={180} height={180} />
                        </div>
                    </div>
                    <div className="bg-[#252936] p-6 rounded-[32px] h-80 border border-white/5">
                        <Skeleton className="h-6 w-32 mb-6" />
                        <div className="space-y-4 pt-4">
                            {[1, 2, 3, 4].map(i => <Skeleton key={i} className="h-8 w-full" />)}
                        </div>
                    </div>
                </div>
            </div>
        );
    }

    // Removed EmptyState return - Dashboard will render with zero states


    return (
        <div className="space-y-6 pb-24 animate-in fade-in duration-500">
            {/* Header */}
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-2xl font-bold bg-gradient-to-r from-white to-gray-400 bg-clip-text text-transparent">
                        Welcome back! 👋
                    </h1>
                    <p className="text-gray-400 text-sm mt-1">Here's your finance overview</p>
                </div>
                <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-violet-500 to-fuchsia-600 p-[1px] shadow-lg shadow-violet-500/20">
                    <div className="w-full h-full rounded-xl bg-[#1a1d29] flex items-center justify-center overflow-hidden">
                        <span className="text-lg font-bold">👤</span>
                    </div>
                </div>
            </div>

            {/* Main Stats Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                {/* Total Balance / Month Total */}
                <div className="md:col-span-2 relative overflow-hidden bg-gradient-to-br from-violet-600 to-pink-600 rounded-[24px] p-6 text-white shadow-lg shadow-violet-500/20">
                    <div className="relative z-10">
                        <span className="text-white/80 text-sm font-medium">This Month's Spending</span>
                        <div className="text-4xl font-bold mt-2 mb-1">
                            {formatCurrency(metrics.monthTotal)}
                        </div>
                        <div className="flex items-center gap-2 text-sm text-white/90">
                            <span className="bg-white/20 px-2 py-0.5 rounded-lg backdrop-blur-sm">
                                {metrics.count} transactions
                            </span>
                        </div>
                    </div>
                    {/* Decor circles */}
                    <div className="absolute -top-10 -right-10 w-40 h-40 bg-white/10 rounded-full blur-2xl"></div>
                    <div className="absolute bottom-0 right-0 w-32 h-32 bg-black/10 rounded-full blur-xl"></div>
                </div>

                {/* Streak Card */}
                <StatCard
                    label="Current Streak"
                    value={
                        <div className="flex items-center gap-2">
                            <span>{streakData.currentStreak} days</span>
                            <span className="text-2xl animate-pulse">🔥</span>
                        </div>
                    }
                />

                {/* Weekly Total */}
                <StatCard
                    label="This Week"
                    value={formatCurrency(metrics.weekTotal)}
                    icon="📅"
                />
            </div>

            {/* Charts Section */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 h-auto md:h-[400px]">
                <PieChartCard expenses={expenses} />
                <BarChartCard expenses={expenses} />
            </div>

            <div className="h-[400px]">
                <LineChartCard expenses={expenses} />
            </div>

            {/* Recent Expenses List Placeholder (Phase 5) */}
            <div>
                <div className="flex items-center justify-between mb-4">
                    <h3 className="text-lg font-bold text-white">Recent Expenses</h3>
                    <button
                        onClick={onViewAll}
                        className="text-violet-400 text-sm hover:text-violet-300 transition-colors"
                    >
                        View All
                    </button>
                </div>
                <div className="space-y-3">
                    {expenses.slice(0, 5).map(expense => {
                        const category = CATEGORIES.find(c => c.id === expense.category);
                        return (
                            <div
                                key={expense.id}
                                className="bg-[#252936] p-4 rounded-2xl flex items-center justify-between cursor-pointer hover:bg-[#2a2f3e] transition-colors group"
                                onClick={() => onEditExpense(expense)}
                            >
                                <div className="flex items-center gap-3">
                                    <div className="w-10 h-10 rounded-full bg-[#1a1d29] flex items-center justify-center text-xl shadow-neumorphic-inset border border-white/5">
                                        {category ? category.icon : '📦'}
                                    </div>
                                    <div>
                                        <div className="font-medium text-white">{category ? category.label : expense.category}</div>
                                        <div className="text-xs text-gray-400">{expense.date}</div>
                                    </div>
                                </div>
                                <div className="font-bold text-white">
                                    {formatCurrency(expense.amount)}
                                </div>
                            </div>
                        );
                    })}
                </div>
            </div>

            <CelebrationModal
                isOpen={showCelebration}
                onClose={() => setShowCelebration(false)}
                streak={streakData.currentStreak}
            />
        </div>
    );
};

export default Dashboard;
