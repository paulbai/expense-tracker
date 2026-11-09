import React, { useMemo } from 'react';
import ChartWrapper from './ChartWrapper';
import { CATEGORIES } from '../../utils/constants';
import { formatCurrency } from '../../utils/calculations';

const BarChartCard = ({ expenses, currency }) => {
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
                    icon: category ? category.icon : '📦'
                };
            })
            .sort((a, b) => b.value - a.value)
            .slice(0, 5); // Top 5
    }, [expenses]);

    if (data.length === 0) {
        return (
            <ChartWrapper title="Top Spending">
                <div className="flex h-full items-center justify-center text-sm text-secondary">
                    No data to display
                </div>
            </ChartWrapper>
        )
    }

    const maxValue = data.length > 0 ? data[0].value : 0;

    return (
        <ChartWrapper title="Top Categories (all time)">
            <div className="flex h-full flex-col gap-4 overflow-y-auto px-2">
                {data.map(item => (
                    <div key={item.name} className="space-y-1 group">
                        <div className="rounded-xl border border-border bg-bg p-3 shadow-neu-inset">
                            <div className="flex items-center gap-2 text-primary">
                                <span aria-hidden="true">{item.icon}</span>
                                <p className="font-medium">{item.name}</p>
                            </div>
                            <span className="mt-1 block font-semibold text-secondary">
                                {formatCurrency(item.value, currency)}
                            </span>
                        </div>
                        <div className="h-2 w-full overflow-hidden rounded-full bg-bg shadow-inner">
                            <div
                                className="h-full rounded-full transition-[width,filter] duration-700 ease-out group-hover:brightness-110"
                                style={{
                                    width: `${(item.value / maxValue) * 100}%`,
                                    backgroundColor: item.color
                                }}
                            />
                        </div>
                    </div>
                ))}
            </div>
        </ChartWrapper>
    );
}

export default BarChartCard;
