import React from 'react';

const StatCard = ({ label, value, icon, trend, className = '' }) => {
    return (
        <div className={`bg-surface p-5 rounded-[24px] shadow-neu flex flex-col justify-between h-full min-h-[120px] ${className}`}>
            <div className="flex items-start justify-between">
                <span className="text-secondary font-medium text-sm">{label}</span>
                {icon && <span className="text-xl opacity-80">{icon}</span>}
            </div>

            <div className="mt-4">
                <div className="text-2xl font-bold text-primary tracking-tight">
                    {value}
                </div>
                {trend && (
                    <div className={`text-xs font-medium ${trend.isPositive ? 'text-emerald-400' : 'text-rose-400'}`}>
                        {trend.isPositive ? '↑' : '↓'} {trend.value}%
                    </div>
                )}
            </div>
        </div>
    );
};

export default StatCard;
