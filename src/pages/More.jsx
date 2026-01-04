import React from 'react';
import { useTheme } from '../hooks/useTheme';
import { Palette, Check } from 'lucide-react';

const THEME_COLORS = {
    dark: '#1a1d29',
    light: '#e0e5ec',
    aurora: '#0b1026',
    ocean: '#0f172a',
    sunset: '#2a1b1b',
    bioluminescence: '#020617',
    deep_teal: '#134e4a',
    retro: '#2e0228',
    neon: '#000000',
};

const More = () => {
    const { theme, changeTheme, themes } = useTheme();

    return (
        <div className="space-y-8 pb-24 animate-in fade-in duration-500">
            <header>
                <h1 className="text-3xl font-bold text-primary">Settings</h1>
                <p className="text-secondary mt-1">Customize your experience</p>
            </header>

            {/* Theme Section */}
            <section className="space-y-4">
                <div className="flex items-center gap-2 text-primary font-semibold text-lg">
                    <Palette size={20} className="text-accent" />
                    <h2>Appearance</h2>
                </div>

                <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
                    {themes.map((t) => (
                        <button
                            key={t.id}
                            onClick={() => changeTheme(t.id)}
                            className={`
                                relative p-4 rounded-2xl flex flex-col items-center gap-3 transition-all duration-300
                                ${theme === t.id
                                    ? 'bg-surface shadow-neu-inset ring-2 ring-accent'
                                    : 'bg-surface shadow-neu hover:scale-[1.02]'
                                }
                            `}
                        >
                            <div
                                className="w-12 h-12 rounded-full shadow-lg border-2 border-white/10"
                                style={{ backgroundColor: THEME_COLORS[t.id] }}
                            />
                            <span className={`text-sm font-medium ${theme === t.id ? 'text-accent' : 'text-secondary'}`}>
                                {t.label}
                            </span>
                            {theme === t.id && (
                                <div className="absolute top-3 right-3 text-accent">
                                    <Check size={16} strokeWidth={3} />
                                </div>
                            )}
                        </button>
                    ))}
                </div>
            </section>

            {/* Categories Placeholder */}
            <section className="space-y-4 opacity-50 cursor-not-allowed">
                <div className="flex items-center gap-2 text-primary font-semibold text-lg">
                    <span className="text-2xl">🏷️</span>
                    <h2>Categories (Coming Soon)</h2>
                </div>
                <div className="bg-surface p-6 rounded-2xl shadow-neu border border-white/5">
                    <p className="text-secondary text-center">Custom category management will be added here.</p>
                </div>
            </section>
        </div>
    );
};

export default More;
