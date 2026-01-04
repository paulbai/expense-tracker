import React, { useMemo } from 'react';
import ChartWrapper from './ChartWrapper';
import { CATEGORIES } from '../../utils/constants';
import { formatCurrency } from '../../utils/calculations';

const BarChartCard = ({ expenses }) => {
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
                <div className="flex items-center justify-center h-full text-gray-500 text-sm">
                    No data to display
                </div>
            </ChartWrapper>
        )
    }

    const maxValue = data.length > 0 ? data[0].value : 0;

    return (
        <ChartWrapper title="Top Categories">
            <div className="flex flex-col gap-4 h-full overflow-y-auto px-2 custom-scrollbar">
                {data.map(item => (
                    <div key={item.name} className="space-y-1 group">
                        <div className="bg-bg p-3 rounded-xl border border-white/10 shadow-xl">
                            <p className="font-medium text-primary mb-1">{item.name}</p>
                            <div className="flex items-center gap-2 text-primary">
                                <span className="text-accent text-lg font-bold">
                                    <span>{item.icon}</span>
                                    <span>{item.name}</span>
                                </span>
                            </div>
                            <span className="text-gray-400 font-medium group-hover:text-white transition-colors">
                                {formatCurrency(item.value)}
                            </span>
                        </div>
                        <div className="w-full bg-[#1a1d29] rounded-full h-2 overflow-hidden shadow-inner">
                            <div
                                className="h-full rounded-full transition-all duration-1000 ease-out group-hover:brightness-110"
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
