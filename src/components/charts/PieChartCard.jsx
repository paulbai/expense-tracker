import React, { useMemo } from 'react';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip, Legend } from 'recharts';
import ChartWrapper from './ChartWrapper';
import { CATEGORIES } from '../../utils/constants';
import { formatCurrency } from '../../utils/calculations';
import { useReducedMotion } from '../../hooks/useReducedMotion';

const CategoryTooltip = ({ active, payload, currency }) => {
    if (active && payload && payload.length) {
        return (
            <div className="chart-tooltip">
                <p className="mb-1 font-medium text-primary">{payload[0].name}</p>
                <p className="text-lg font-bold text-accent">{formatCurrency(payload[0].value, currency)}</p>
            </div>
        );
    }
    return null;
};

const PieChartCard = ({ expenses, currency }) => {
    const reducedMotion = useReducedMotion();
    const data = useMemo(() => {
        const categoryTotals = expenses.reduce((acc, expense) => {
            acc[expense.category] = (acc[expense.category] || 0) + Number(expense.amount);
            return acc;
        }, {});

        return Object.entries(categoryTotals)
            .map(([id, value]) => {
                const category = CATEGORIES.find(c => c.id === id);
                return {
                    name: category ? category.label : id,
                    value,
                    color: category ? category.color : '#cbd5e1',
                    id
                };
            })
            .sort((a, b) => b.value - a.value);
    }, [expenses]);

    if (data.length === 0) {
        return (
            <ChartWrapper title="Category Breakdown (all time)">
                <div className="flex h-full items-center justify-center text-sm text-secondary">
                    No data to display
                </div>
            </ChartWrapper>
        )
    }

    return (
        <ChartWrapper title="Category Breakdown (all time)">
            <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                    <Pie
                        data={data}
                        cx="50%"
                        cy="50%"
                        innerRadius={60}
                        outerRadius={100}
                        paddingAngle={5}
                        isAnimationActive={!reducedMotion}
                        dataKey="value"
                        stroke="none"
                    >
                        {data.map((entry, index) => (
                            <Cell key={`cell-${index}`} fill={entry.color} />
                        ))}
                    </Pie>
                    <Tooltip content={<CategoryTooltip currency={currency} />} isAnimationActive={!reducedMotion} />
                    <Legend verticalAlign="bottom" height={36} />
                </PieChart>
            </ResponsiveContainer>
        </ChartWrapper>
    );
};

export default PieChartCard;
