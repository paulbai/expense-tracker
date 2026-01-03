import React, { useMemo } from 'react';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip, Legend } from 'recharts';
import ChartWrapper from './ChartWrapper';
import { CATEGORIES } from '../../utils/constants';
import { formatCurrency } from '../../utils/calculations';

const PieChartCard = ({ expenses }) => {
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

    const CustomTooltip = ({ active, payload }) => {
        if (active && payload && payload.length) {
            return (
                <div className="bg-[#1a1d29] p-3 rounded-xl border border-white/10 shadow-xl">
                    <p className="font-medium text-white mb-1">{payload[0].name}</p>
                    <p className="text-violet-400 font-bold">
                        {formatCurrency(payload[0].value)}
                    </p>
                </div>
            );
        }
        return null;
    };

    if (data.length === 0) {
        return (
            <ChartWrapper title="Category Breakdown">
                <div className="flex items-center justify-center h-full text-gray-500 text-sm">
                    No data to display
                </div>
            </ChartWrapper>
        )
    }

    return (
        <ChartWrapper title="Category Breakdown">
            <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                    <Pie
                        data={data}
                        cx="50%"
                        cy="50%"
                        innerRadius={60}
                        outerRadius={100}
                        paddingAngle={5}
                        dataKey="value"
                        stroke="none"
                    >
                        {data.map((entry, index) => (
                            <Cell key={`cell-${index}`} fill={entry.color} />
                        ))}
                    </Pie>
                    <Tooltip content={<CustomTooltip />} />
                    <Legend
                        verticalAlign="bottom"
                        height={36}
                        formatter={(value, entry) => (
                            <span className="text-gray-400 text-xs ml-1">{value}</span>
                        )}
                    />
                </PieChart>
            </ResponsiveContainer>
        </ChartWrapper>
    );
};

export default PieChartCard;
