import React from 'react';
import { Home, BarChart2, MoreHorizontal, Plus } from 'lucide-react';

const BottomNavigation = ({ activeTab, onTabChange, onAddExpense }) => {
    return (
        <div className="fixed bottom-0 left-0 right-0 p-4 bg-transparent pointer-events-none z-50">
            <div className="max-w-md mx-auto relative flex items-center justify-between px-6 py-4 rounded-[32px] bg-surface/90 backdrop-blur-xl border border-white/5 shadow-neu pointer-events-auto">
                {/* Home Tab */}
                <button
                    onClick={() => onTabChange('dashboard')}
                    className={`flex flex-col items-center gap-1 transition-all duration-300 ${activeTab === 'dashboard' ? 'text-accent' : 'text-gray-400'}`}
                >
                    <div className={`p-2 rounded-xl transition-all ${activeTab === 'dashboard' ? 'bg-accent/10 shadow-neu-inset' : ''}`}>
                        <Home size={24} />
                    </div>
                    <span className="text-xs font-medium">Home</span>
                </button>

                {/* Insights Tab */}
                <button
                    onClick={() => onTabChange('insights')}
                    className={`flex flex-col items-center gap-1 transition-all duration-300 ${activeTab === 'insights' ? 'text-accent' : 'text-gray-400'}`}
                >
                    <div className={`p-2 rounded-xl transition-all ${activeTab === 'insights' ? 'bg-accent/10 shadow-neu-inset' : ''}`}>
                        <BarChart2 size={24} />
                    </div>
                    <span className="text-xs font-medium">Insights</span>
                </button>

                {/* Add Button (Floating) */}
                <div className="absolute left-1/2 -translate-x-1/2 -top-6">
                    <button
                        onClick={onAddExpense}
                        className="w-16 h-16 rounded-full bg-accent text-white flex items-center justify-center shadow-neu-btn transform hover:scale-105 active:scale-95 transition-all duration-300 border-4 border-bg"
                    >
                        <Plus size={32} strokeWidth={2.5} />
                    </button>
                </div>

                {/* Spacer for Add Button */}
                <div className="w-8"></div>


                {/* More Tab */}
                <button
                    onClick={() => onTabChange('more')}
                    className={`flex flex-col items-center gap-1 transition-all duration-300 ${activeTab === 'more' ? 'text-accent' : 'text-gray-400'}`}
                >
                    <div className={`p-2 rounded-xl transition-all ${activeTab === 'more' ? 'bg-accent/10 shadow-neu-inset' : ''}`}>
                        <MoreHorizontal size={24} />
                    </div>
                    <span className="text-xs font-medium">More</span>
                </button>
            </div>
        </div>
    );
};

export default BottomNavigation;
