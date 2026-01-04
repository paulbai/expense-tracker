import React from 'react';
import Button from '../atoms/Button';

const EmptyState = ({ onAddFirst }) => {
    return (
        <div className="flex flex-col items-center justify-center py-16 px-4 text-center space-y-6">
            <div className="flex flex-col items-center justify-center py-12 text-center animate-in fade-in duration-500">
                <div className="w-32 h-32 bg-surface rounded-full flex items-center justify-center shadow-neu-inset mb-4">
                    <span className="text-4xl animate-bounce">🌱</span>
                </div>
                <h3 className="text-2xl font-bold text-primary">Start Your Journey</h3>
                <p className="text-secondary mt-2 max-w-xs">
                    {"Track your first expense to begin building your financial overview."}
                </p>
            </div>

            <Button onClick={onAddFirst} className="shadow-violet-500/20">
                Add First Expense
            </Button>
        </div>
    );
};

export default EmptyState;
