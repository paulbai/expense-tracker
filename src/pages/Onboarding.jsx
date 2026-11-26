import React, { useRef, useState } from 'react';

const Onboarding = ({ onComplete }) => {
    const [name, setName] = useState('');
    const [error, setError] = useState('');
    const [isSubmitting, setIsSubmitting] = useState(false);
    const inputRef = useRef(null);

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!name.trim()) {
            setError('Enter a name to continue.');
            inputRef.current?.focus();
            return;
        }

        setIsSubmitting(true);
        const success = await onComplete(name);
        if (!success) {
            setError('Your name could not be saved. Check that this browser allows site storage, then try again.');
            setIsSubmitting(false);
        }
    };

    return (
        <main className="onboarding-safe-area onboarding min-h-[100dvh] bg-bg">
            <form onSubmit={handleSubmit} noValidate className="onboarding-form">
                <div className="onboarding-brand">
                    <img src="/logo-mark.png" alt="" width="32" height="32" className="h-8 w-8 rounded-[0.625rem]" />
                    <span>Phae</span>
                </div>

                <div className="onboarding-body">
                    <h1 className="onboarding-title">
                        <label htmlFor="onboarding-name">First, what should we call you?</label>
                    </h1>
                    <input
                        ref={inputRef}
                        id="onboarding-name"
                        type="text"
                        name="name"
                        autoComplete="given-name"
                        autoCapitalize="words"
                        enterKeyHint="go"
                        maxLength={40}
                        value={name}
                        onChange={(e) => {
                            setName(e.target.value);
                            if (error) setError('');
                        }}
                        placeholder="Your name"
                        aria-invalid={Boolean(error)}
                        aria-describedby={error ? 'onboarding-error' : 'onboarding-note'}
                        className="onboarding-input"
                        autoFocus
                    />
                    {error ? (
                        <p id="onboarding-error" className="onboarding-error" role="alert">{error}</p>
                    ) : (
                        <p id="onboarding-note" className="onboarding-note">
                            Phae has no accounts. Your name and expenses stay on this device.
                        </p>
                    )}
                </div>

                <button type="submit" className="onboarding-submit" disabled={isSubmitting}>
                    {isSubmitting ? 'Saving…' : 'Continue'}
                </button>
            </form>
        </main>
    );
};

export default Onboarding;
