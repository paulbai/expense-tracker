import React from 'react';

const ChartWrapper = ({ title, children, className = '' }) => {
    return (
        <section className={`flex h-[400px] flex-col rounded-[24px] border border-border bg-surface p-5 shadow-neu sm:p-6 ${className}`}>
            <h3 className="text-primary font-bold text-lg mb-6">{title}</h3>
            <div className="flex-1 w-full min-h-0 relative">
                {children}
            </div>
        </section>
    );
};

export default ChartWrapper;
