import React, { useState } from 'react';
import Button from '../components/atoms/Button';
import { Sparkles, ArrowRight } from 'lucide-react';

const Onboarding = ({ onComplete }) => {
    const [name, setName] = useState('');
    const [error, setError] = useState('');
    const [isSubmitting, setIsSubmitting] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!name.trim()) {
            setError('Please enter your name');
            return;
        }

        setIsSubmitting(true);
        // Simulate a small delay for better UX feeling
        await new Promise(resolve => setTimeout(resolve, 600));
        await onComplete(name);
    };

    return (
        <div className="min-h-screen bg-[#1a1d29] flex flex-col items-center justify-center p-6 text-center animate-in fade-in duration-500">
            <div className="max-w-md w-full space-y-8">
                {/* Logo / Icon */}
                <div className="w-20 h-20 bg-gradient-to-br from-violet-600 to-fuchsia-600 rounded-3xl mx-auto flex items-center justify-center shadow-lg shadow-violet-500/30 mb-8 animate-in zoom-in duration-500 delay-100">
                    <Sparkles size={40} className="text-white" />
                </div>

                {/* Text */}
                <div className="space-y-4 animate-in slide-in-from-bottom-4 duration-500 delay-200">
                    <h1 className="text-4xl font-bold text-white tracking-tight">
                        Welcome to Phae
                    </h1>
                    <p className="text-gray-400 text-lg">
                        Let's make this space yours. <br />
                        What should we call you?
                    </p>
                </div>

                {/* Form */}
                <form onSubmit={handleSubmit} className="space-y-6 pt-6 animate-in slide-in-from-bottom-4 duration-500 delay-300">
                    <div className="relative group">
                        <input
                            type="text"
                            value={name}
                            onChange={(e) => {
                                setName(e.target.value);
                                if (error) setError('');
                            }}
                            placeholder="Your Name"
                            className="w-full bg-[#252936] text-white text-center text-xl font-medium rounded-2xl py-6 px-4 border-2 border-transparent focus:border-violet-500 outline-none transition-all placeholder:text-gray-600 focus:bg-[#2a2f3e]"
                            autoFocus
                        />
                        {error && (
                            <div className="absolute -bottom-6 left-0 right-0 text-red-500 text-sm">
                                {error}
                            </div>
                        )}
                    </div>

                    <Button
                        type="submit"
                        disabled={!name.trim() || isSubmitting}
                        className="w-full py-5 text-xl font-semibold shadow-xl shadow-violet-500/20 group relative overflow-hidden"
                    >
                        <span className={`flex items-center justify-center gap-2 transition-all duration-300 ${isSubmitting ? 'opacity-0' : 'opacity-100'}`}>
                            Get Started
                            <ArrowRight size={20} className="group-hover:translate-x-1 transition-transform" />
                        </span>

                        {isSubmitting && (
                            <div className="absolute inset-0 flex items-center justify-center">
                                <div className="w-6 h-6 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                            </div>
                        )}
                    </Button>
                </form>
            </div>
        </div>
    );
};

export default Onboarding;
