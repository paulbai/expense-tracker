import { useEffect, useRef } from 'react';
import { X } from 'lucide-react';

const CelebrationModal = ({ isOpen, onClose, streak }) => {
    const closeButtonRef = useRef(null);

    useEffect(() => {
        if (!isOpen) return undefined;
        const timer = window.setTimeout(onClose, 5000);
        const focusTimer = window.requestAnimationFrame(() => closeButtonRef.current?.focus());
        return () => {
            window.clearTimeout(timer);
            window.cancelAnimationFrame(focusTimer);
        };
    }, [isOpen, onClose]);

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-[60] flex items-center justify-center bg-black/70 p-4 backdrop-blur-sm">
            <section role="dialog" aria-modal="true" aria-labelledby="celebration-title" className="relative w-full max-w-sm rounded-[28px] bg-gradient-to-br from-violet-600 to-pink-600 p-8 text-center text-white shadow-2xl">
                <button ref={closeButtonRef} type="button" onClick={onClose} className="absolute right-4 top-4 rounded-full bg-black/15 p-2 text-white transition-colors hover:bg-black/25 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white" aria-label="Close celebration">
                    <X size={20} aria-hidden="true" />
                </button>
                <p className="mb-5 text-6xl" aria-hidden="true">🔥</p>
                <h2 id="celebration-title" className="text-3xl font-bold">{streak}-day streak!</h2>
                <p className="mt-3 text-white/90">You logged expenses on consecutive days. Keep the momentum going.</p>
            </section>
        </div>
    );
};

export default CelebrationModal;
