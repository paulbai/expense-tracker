import React from 'react';
import { Home, BarChart2, MoreHorizontal, Plus } from 'lucide-react';

const BottomNavigation = ({ activeTab, onTabChange, onAddExpense }) => {
    return (
        <div className="fixed bottom-6 left-6 right-6 flex items-center gap-4 pointer-events-none z-50 max-w-md mx-auto">
            {/* Navigation Tabs Pill */}
            <div className="flex-1 flex items-center justify-between px-2 py-2 rounded-full bg-surface/90 backdrop-blur-xl border border-white/5 shadow-neu pointer-events-auto h-20">
                {/* Home Tab */}
                <button
                    onClick={() => onTabChange('dashboard')}
                    className="flex-1 flex flex-col items-center justify-center gap-1 group"
                >
                    <div className={`
                        w-12 h-12 rounded-full flex items-center justify-center transition-all duration-300
                        ${activeTab === 'dashboard' ? 'bg-primary text-bg' : 'text-secondary group-hover:bg-white/5'}
                    `}>
                        <Home size={24} strokeWidth={2.5} />
                    </div>
                </button>

                {/* Insights Tab */}
                <button
                    onClick={() => onTabChange('insights')}
                    className="flex-1 flex flex-col items-center justify-center gap-1 group"
                >
                    <div className={`
                        w-12 h-12 rounded-full flex items-center justify-center transition-all duration-300
                        ${activeTab === 'insights' ? 'bg-primary text-bg' : 'text-secondary group-hover:bg-white/5'}
                    `}>
                        <BarChart2 size={24} strokeWidth={2.5} />
                    </div>
                </button>

                {/* More Tab */}
                <button
                    onClick={() => onTabChange('more')}
                    className="flex-1 flex flex-col items-center justify-center gap-1 group"
                >
                    <div className={`
                        w-12 h-12 rounded-full flex items-center justify-center transition-all duration-300
                        ${activeTab === 'more' ? 'bg-primary text-bg' : 'text-secondary group-hover:bg-white/5'}
                    `}>
                        <MoreHorizontal size={24} strokeWidth={2.5} />
                    </div>
                </button>
            </div>

            {/* Separate Floating Add Button */}
            <button
                onClick={onAddExpense}
                className="pointer-events-auto w-20 h-20 rounded-full bg-surface/90 backdrop-blur-xl border border-white/5 shadow-neu flex items-center justify-center group transition-transform hover:scale-105 active:scale-95"
            >
                <div className="w-12 h-12 rounded-full bg-white/10 flex items-center justify-center">
                    <Plus size={32} className="text-primary" strokeWidth={2.5} />
                </div>
            </button>
        </div>
    );
};

export default BottomNavigation;
