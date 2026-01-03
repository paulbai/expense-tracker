import React from 'react';

const StatCard = ({ label, value, icon, trend, className = '' }) => {
    return (
        <div className={`bg-[#252936] p-5 rounded-[24px] shadow-neumorphic-flat flex flex-col justify-between h-full min-h-[120px] ${className}`}>
            <div className="flex justify-between items-start">
                <span className="text-gray-400 text-sm font-medium">{label}</span>
                {icon && <span className="text-xl opacity-80">{icon}</span>}
            </div>

            <div className="space-y-1">
                <div className="text-2xl font-bold text-white tracking-tight">
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
