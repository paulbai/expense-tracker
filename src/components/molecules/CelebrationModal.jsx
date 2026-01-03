import React, { useEffect } from 'react';
import { X } from 'lucide-react';

const CelebrationModal = ({ isOpen, onClose, streak, type = 'streak' }) => {
    useEffect(() => {
        if (isOpen) {
            // Auto close after 5 seconds
            const timer = setTimeout(onClose, 5000);
            return () => clearTimeout(timer);
        }
    }, [isOpen, onClose]);

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-[60] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-300">
            {/* Confetti effect could be added here with a library later */}
            <div className="relative w-full max-w-sm bg-gradient-to-br from-violet-600 to-pink-600 rounded-[32px] p-8 text-center shadow-2xl animate-in zoom-in-95 duration-300">
                <button
                    onClick={onClose}
                    className="absolute top-4 right-4 p-2 text-white/70 hover:text-white bg-black/10 hover:bg-black/20 rounded-full transition-colors"
                >
                    <X size={20} />
                </button>

                <div className="text-6xl mb-6 animate-bounce">
                    🔥
                </div>

                <h3 className="text-3xl font-bold text-white mb-2">
                    {streak} Day Streak!
                </h3>

                <p className="text-white/90 text-lg">
                    You are on fire! Keep logging your expenses to maintain your momentum.
                </p>
            </div>
        </div>
    );
};

export default CelebrationModal;
