import React from 'react';

const ChartWrapper = ({ title, children, className = '' }) => {
    return (
        <div className={`bg-surface p-6 rounded-[24px] shadow-neu flex flex-col h-[400px] ${className}`}>
            <h3 className="text-primary font-bold text-lg mb-6">{title}</h3>
            <div className="flex-1 w-full min-h-0 relative">
                {children}
            </div>
        </div>
    );
};

export default ChartWrapper;
