import React, { useMemo } from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Area, AreaChart } from 'recharts';
import { format, parseISO, startOfMonth, endOfMonth, eachDayOfInterval, isSameDay } from 'date-fns';
import ChartWrapper from './ChartWrapper';
import { formatCurrency } from '../../utils/calculations';

const LineChartCard = ({ expenses }) => {
    const data = useMemo(() => {
        if (expenses.length === 0) return [];

        const now = new Date();
        const start = startOfMonth(now);
        const end = endOfMonth(now); // or just up to today: new Date()

        const daysInMonth = eachDayOfInterval({ start, end }); // Show full month or partial

        // Group expenses by date
        const expensesByDate = expenses.reduce((acc, expense) => {
            // Only include this month's expenses
            if (parseISO(expense.date) >= start && parseISO(expense.date) <= end) {
                const dateKey = expense.date; // already YYYY-MM-DD
                acc[dateKey] = (acc[dateKey] || 0) + Number(expense.amount);
            }
            return acc;
        }, {});

        // Create cumulative or daily data
        let cumulative = 0;
        return daysInMonth.map(day => {
            const dateKey = format(day, 'yyyy-MM-dd');
            const dailyAmount = expensesByDate[dateKey] || 0;
            cumulative += dailyAmount;

            return {
                date: format(day, 'MMM d'),
                fullDate: dateKey,
                amount: dailyAmount,
                cumulative: cumulative
            };
        });
    }, [expenses]);

    const CustomTooltip = ({ active, payload, label }) => {
        if (active && payload && payload.length) {
            return (
                <div className="bg-bg p-3 rounded-xl border border-white/10 shadow-xl">
                    <p className="font-medium text-primary mb-1">{label}</p>
                    <div className="space-y-1">
                        <p className="text-accent text-sm">
                            Spent: <span className="font-bold">{formatCurrency(payload[0].value)}</span>
                        </p>
                        {payload[1] && (
                            <p className="text-secondary text-sm">
                                Total: <span className="font-bold">{formatCurrency(payload[1].value)}</span>
                            </p>
                        )}
                    </div>
                </div>
            );
        }
        return null;
    };

    if (data.length === 0) {
        return (
            <ChartWrapper title="Monthly Trend">
                <div className="flex items-center justify-center h-full text-gray-500 text-sm">
                    No data to display
                </div>
            </ChartWrapper>
        )
    }

    return (
        <ChartWrapper title="Monthly Spending Trend">
            <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={data} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
                    <defs>
                        <linearGradient id="colorCumulative" x1="0" y1="0" x2="0" y2="1">
                            <stop offset="5%" stopColor="#8B5CF6" stopOpacity={0.3} />
                            <stop offset="95%" stopColor="#8B5CF6" stopOpacity={0} />
                        </linearGradient>
                        <linearGradient id="colorAmount" x1="0" y1="0" x2="0" y2="1">
                            <stop offset="5%" stopColor="#EC4899" stopOpacity={0.3} />
                            <stop offset="95%" stopColor="#EC4899" stopOpacity={0} />
                        </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" stroke="#333" vertical={false} />
                    <XAxis
                        dataKey="date"
                        stroke="#6b7280"
                        tick={{ fontSize: 12 }}
                        tickLine={false}
                        axisLine={false}
                        minTickGap={30}
                    />
                    <YAxis
                        stroke="#6b7280"
                        tick={{ fontSize: 12 }}
                        tickLine={false}
                        axisLine={false}
                        tickFormatter={(value) => `$${value}`}
                        width={60}
                    />
                    <Tooltip content={<CustomTooltip />} />
                    <Area
                        type="monotone"
                        dataKey="amount"
                        stroke="#EC4899"
                        fillOpacity={1}
                        fill="url(#colorAmount)"
                        strokeWidth={2}
                    />
                    <Area
                        type="monotone"
                        dataKey="cumulative"
                        stroke="#8B5CF6"
                        fillOpacity={1}
                        fill="url(#colorCumulative)"
                        strokeWidth={2}
                    />
                </AreaChart>
            </ResponsiveContainer>
        </ChartWrapper>
    );
};

export default LineChartCard;
