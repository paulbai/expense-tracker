import React from 'react';
import Button from '../atoms/Button';

const EmptyState = ({ onAddFirst }) => {
    return (
        <div className="flex flex-col items-center justify-center py-16 px-4 text-center space-y-6">
            <div className="w-32 h-32 bg-[#252936] rounded-full flex items-center justify-center shadow-neumorphic-pressed mb-4">
                <span className="text-6xl animate-bounce" role="img" aria-label="Rocket">🚀</span>
            </div>

            <div className="space-y-2 max-w-xs mx-auto">
                <h3 className="text-2xl font-bold text-white">Start Your Journey</h3>
                <p className="text-gray-400">
                    Add your first expense to see your spending dashboard come to life.
                </p>
            </div>

            <Button onClick={onAddFirst} className="shadow-violet-500/20">
                Add First Expense
            </Button>
        </div>
    );
};

export default EmptyState;
