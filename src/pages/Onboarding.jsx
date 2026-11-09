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
        const success = await onComplete(name);
        if (!success) {
            setError('Your name could not be saved. Check browser storage and try again.');
            setIsSubmitting(false);
        }
    };

    return (
        <div className="min-h-screen bg-bg flex flex-col items-center justify-center p-6 text-center">
            <div className="max-w-md w-full space-y-8">
                {/* Logo / Icon */}
                <div className="mb-8 flex h-20 w-20 items-center justify-center rounded-3xl bg-gradient-to-br from-violet-600 to-fuchsia-600 shadow-lg shadow-violet-950/30 mx-auto">
                    <Sparkles size={40} className="text-white" />
                </div>

                {/* Text */}
                <div className="space-y-4">
                    <h1 className="text-4xl font-bold text-primary tracking-tight">
                        Welcome to Phae
                    </h1>
                    <p className="text-secondary text-lg">
                        Let's make this space yours. <br />
                        What should we call you?
                    </p>
                </div>

                {/* Form */}
                <form onSubmit={handleSubmit} className="space-y-6 pt-6">
                    <div className="relative">
                        <label htmlFor="onboarding-name" className="sr-only">Your name</label>
                        <input
                            id="onboarding-name"
                            type="text"
                            value={name}
                            onChange={(e) => {
                                setName(e.target.value);
                                if (error) setError('');
                            }}
                            placeholder="Your Name"
                            className="w-full rounded-2xl border-2 border-transparent bg-surface px-4 py-6 text-center text-xl font-medium text-primary outline-none transition-colors placeholder:text-secondary focus:border-accent focus-visible:ring-2 focus-visible:ring-accent focus-visible:ring-offset-2 focus-visible:ring-offset-bg"
                            autoFocus
                        />
                        {error && (
                            <div className="absolute -bottom-6 left-0 right-0 text-sm text-red-500" role="alert">
                                {error}
                            </div>
                        )}
                    </div>

                    <Button
                        type="submit"
                        disabled={!name.trim() || isSubmitting}
                        className="group relative w-full overflow-hidden py-5 text-xl font-semibold shadow-xl shadow-violet-950/30"
                    >
                        <span className={`flex items-center justify-center gap-2 transition-opacity duration-300 ${isSubmitting ? 'opacity-0' : 'opacity-100'}`}>
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
