import React from 'react';
import Button from '../atoms/Button';

const EmptyState = ({ onAddFirst }) => {
    return (
        <section className="empty-panel">
            <div className="flex flex-col items-center justify-center py-5 text-center">
                <div className="mb-5 flex h-28 w-28 items-center justify-center rounded-full bg-bg shadow-neu-inset" aria-hidden="true">
                    <span className="text-4xl">🌱</span>
                </div>
                <h2 className="text-2xl font-bold text-primary">Start tracking with one expense</h2>
                <p className="mt-2 max-w-sm text-secondary">
                    Add an expense to turn this quiet space into a clear picture of your spending.
                </p>
            </div>

            <Button onClick={onAddFirst} className="min-h-12 shadow-violet-950/30">
                Add your first expense
            </Button>
        </section>
    );
};

export default EmptyState;
