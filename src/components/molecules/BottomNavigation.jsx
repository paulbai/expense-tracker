import { BarChart2, Home, MoreHorizontal, Plus } from 'lucide-react';

const navigationItems = [
    { id: 'dashboard', label: 'Home', Icon: Home },
    { id: 'insights', label: 'Insights', Icon: BarChart2 },
    { id: 'more', label: 'Settings', Icon: MoreHorizontal }
];

const BottomNavigation = ({ activeTab, onTabChange, onAddExpense }) => (
    <nav aria-label="Primary navigation" className="fixed bottom-4 left-4 right-4 z-40 mx-auto flex max-w-lg items-center gap-3 sm:bottom-6 sm:left-6 sm:right-6">
        <div className="flex h-[72px] flex-1 items-center justify-around rounded-full border border-border bg-surface/95 p-2 shadow-neu backdrop-blur-xl">
            {navigationItems.map((item) => {
                const isActive = activeTab === item.id;
                return (
                    <button
                        key={item.id}
                        type="button"
                        onClick={() => onTabChange(item.id)}
                        className={`nav-item ${isActive ? 'nav-item-active' : ''}`}
                        aria-current={isActive ? 'page' : undefined}
                        aria-label={item.label}
                    >
                        <item.Icon size={22} aria-hidden="true" />
                        <span className={isActive ? 'inline' : 'sr-only'}>{item.label}</span>
                    </button>
                );
            })}
        </div>
        <button type="button" onClick={onAddExpense} className="add-fab" aria-label="Add expense">
            <Plus size={28} aria-hidden="true" />
        </button>
    </nav>
);

export default BottomNavigation;
