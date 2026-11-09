import { useMemo, useState } from 'react';
import { ArrowLeft, Search } from 'lucide-react';
import { endOfMonth, endOfWeek, isWithinInterval, parseISO, startOfMonth, startOfWeek, subMonths } from 'date-fns';
import ExpenseCard from '../components/molecules/ExpenseCard';
import { useToast } from '../components/atoms/Toast';
import { useExpenses } from '../hooks/useExpenses';
import { useSettings } from '../hooks/useSettings';
import { CATEGORIES } from '../utils/constants';

const dateRangeOptions = [
    { value: 'all', label: 'All time' },
    { value: 'week', label: 'This week' },
    { value: 'month', label: 'This month' },
    { value: 'last-month', label: 'Last month' },
    { value: 'custom', label: 'Custom range' }
];

const inSelectedDateRange = (expenseDate, range, customStart, customEnd, weekStartsOn) => {
    const date = parseISO(expenseDate);
    if (Number.isNaN(date.getTime())) return false;
    const now = new Date();
    if (range === 'all') return true;
    if (range === 'week') {
        return isWithinInterval(date, {
            start: startOfWeek(now, { weekStartsOn }),
            end: endOfWeek(now, { weekStartsOn })
        });
    }
    if (range === 'month') {
        return isWithinInterval(date, { start: startOfMonth(now), end: endOfMonth(now) });
    }
    if (range === 'last-month') {
        const previousMonth = subMonths(now, 1);
        return isWithinInterval(date, { start: startOfMonth(previousMonth), end: endOfMonth(previousMonth) });
    }
    if (!customStart && !customEnd) return true;

    const start = customStart ? parseISO(customStart) : new Date(0);
    const end = customEnd ? new Date(`${customEnd}T23:59:59`) : new Date(8640000000000000);
    if (Number.isNaN(start.getTime()) || Number.isNaN(end.getTime()) || start > end) return false;
    return isWithinInterval(date, { start, end });
};

const AllExpenses = ({ onBack, onEditExpense }) => {
    const { expenses, loading, error, deleteExpense, refreshExpenses } = useExpenses();
    const { settings } = useSettings();
    const { addToast } = useToast();
    const [search, setSearch] = useState('');
    const [selectedCategories, setSelectedCategories] = useState([]);
    const [dateRange, setDateRange] = useState('all');
    const [customStart, setCustomStart] = useState('');
    const [customEnd, setCustomEnd] = useState('');
    const [sortBy, setSortBy] = useState('date-desc');

    const filteredExpenses = useMemo(() => {
        const query = search.trim().toLowerCase();
        const weekStartsOn = settings.startOfWeek === 'sunday' ? 0 : 1;

        return expenses
            .filter((expense) => {
                const category = CATEGORIES.find((item) => item.id === expense.category);
                const searchableValues = [expense.note, expense.category, category?.label, String(expense.amount)]
                    .filter(Boolean)
                    .join(' ')
                    .toLowerCase();
                const matchesSearch = !query || searchableValues.includes(query);
                const matchesCategory = selectedCategories.length === 0 || selectedCategories.includes(expense.category);
                const matchesDate = inSelectedDateRange(expense.date, dateRange, customStart, customEnd, weekStartsOn);
                return matchesSearch && matchesCategory && matchesDate;
            })
            .sort((first, second) => {
                if (sortBy === 'date-desc') return new Date(second.date) - new Date(first.date);
                if (sortBy === 'date-asc') return new Date(first.date) - new Date(second.date);
                if (sortBy === 'amount-desc') return Number(second.amount) - Number(first.amount);
                if (sortBy === 'amount-asc') return Number(first.amount) - Number(second.amount);
                if (sortBy === 'category-asc') {
                    const firstLabel = CATEGORIES.find((item) => item.id === first.category)?.label || first.category;
                    const secondLabel = CATEGORIES.find((item) => item.id === second.category)?.label || second.category;
                    return firstLabel.localeCompare(secondLabel);
                }
                return 0;
            });
    }, [customEnd, customStart, dateRange, expenses, search, selectedCategories, settings.startOfWeek, sortBy]);

    const toggleCategory = (id) => {
        setSelectedCategories((current) => (
            current.includes(id) ? current.filter((item) => item !== id) : [...current, id]
        ));
    };

    const handleDelete = async (expense) => {
        if (!window.confirm(`Delete this ${expense.category} expense? This cannot be undone.`)) return;
        const success = await deleteExpense(expense.id);
        addToast(success ? 'Expense deleted.' : 'The expense could not be deleted.', success ? 'success' : 'error');
    };

    if (loading) return <p className="py-16 text-center text-secondary">Loading expenses…</p>;
    if (error) {
        return (
            <section className="empty-panel" role="alert">
                <h1 className="text-2xl font-bold text-primary">Expenses are unavailable</h1>
                <p className="mt-2 text-secondary">{error}</p>
                <button type="button" className="text-button mt-5" onClick={refreshExpenses}>Try again</button>
            </section>
        );
    }

    return (
        <div className="space-y-6 pb-28">
            <header className="flex items-center gap-3">
                <button type="button" onClick={onBack} className="icon-button" aria-label="Go back">
                    <ArrowLeft size={20} aria-hidden="true" />
                </button>
                <div>
                    <h1 className="text-2xl font-bold text-primary">All expenses</h1>
                    <p className="mt-1 text-sm text-secondary">{filteredExpenses.length} of {expenses.length} entries</p>
                </div>
            </header>

            <section className="filter-panel" aria-label="Filter expenses">
                <div className="grid gap-3 md:grid-cols-[minmax(0,1fr)_12rem_12rem]">
                    <div className="relative">
                        <label htmlFor="expense-search" className="sr-only">Search expenses</label>
                        <Search className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-secondary" size={18} aria-hidden="true" />
                        <input
                            id="expense-search"
                            type="search"
                            value={search}
                            onChange={(event) => setSearch(event.target.value)}
                            placeholder="Search note, category, or amount"
                            className="form-control pl-10"
                        />
                    </div>
                    <div>
                        <label htmlFor="date-range" className="sr-only">Date range</label>
                        <select id="date-range" value={dateRange} onChange={(event) => setDateRange(event.target.value)} className="form-control">
                            {dateRangeOptions.map((option) => <option key={option.value} value={option.value}>{option.label}</option>)}
                        </select>
                    </div>
                    <div>
                        <label htmlFor="sort-expenses" className="sr-only">Sort expenses</label>
                        <select id="sort-expenses" value={sortBy} onChange={(event) => setSortBy(event.target.value)} className="form-control">
                            <option value="date-desc">Newest first</option>
                            <option value="date-asc">Oldest first</option>
                            <option value="amount-desc">Highest amount</option>
                            <option value="amount-asc">Lowest amount</option>
                            <option value="category-asc">Category A–Z</option>
                        </select>
                    </div>
                </div>

                {dateRange === 'custom' && (
                    <div className="mt-3 grid gap-3 sm:grid-cols-2">
                        <div><label htmlFor="custom-start" className="field-label">From</label><input id="custom-start" type="date" value={customStart} onChange={(event) => setCustomStart(event.target.value)} className="form-control mt-1" /></div>
                        <div><label htmlFor="custom-end" className="field-label">To</label><input id="custom-end" type="date" value={customEnd} onChange={(event) => setCustomEnd(event.target.value)} className="form-control mt-1" /></div>
                    </div>
                )}

                <fieldset className="mt-4">
                    <legend className="field-label">Categories</legend>
                    <div className="mt-2 flex gap-2 overflow-x-auto pb-1">
                        <button type="button" onClick={() => setSelectedCategories([])} className={`filter-pill ${selectedCategories.length === 0 ? 'filter-pill-active' : ''}`} aria-pressed={selectedCategories.length === 0}>All categories</button>
                        {CATEGORIES.map((category) => {
                            const selected = selectedCategories.includes(category.id);
                            return <button key={category.id} type="button" onClick={() => toggleCategory(category.id)} className={`filter-pill ${selected ? 'filter-pill-active' : ''}`} aria-pressed={selected}>{category.icon} {category.label}</button>;
                        })}
                    </div>
                </fieldset>
            </section>

            <section className="space-y-3" aria-label="Expense results">
                {filteredExpenses.length === 0 ? (
                    <div className="empty-panel py-12"><p className="text-secondary">No expenses match these filters.</p></div>
                ) : filteredExpenses.map((expense) => (
                    <ExpenseCard
                        key={expense.id}
                        expense={expense}
                        currency={settings.currency}
                        dateFormat={settings.dateFormat}
                        onEdit={onEditExpense}
                        onDelete={handleDelete}
                    />
                ))}
            </section>
        </div>
    );
};

export default AllExpenses;
