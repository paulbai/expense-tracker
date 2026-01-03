import React, { useState, useEffect, createContext, useContext } from 'react';
import { X, Check, Info, AlertTriangle } from 'lucide-react';

const ToastContext = createContext();

export const ToastProvider = ({ children }) => {
    const [toasts, setToasts] = useState([]);

    const addToast = (message, type = 'success', duration = 3000) => {
        const id = crypto.randomUUID();
        setToasts(prev => [...prev, { id, message, type, duration }]);
    };

    const removeToast = (id) => {
        setToasts(prev => prev.filter(t => t.id !== id));
    };

    return (
        <ToastContext.Provider value={{ addToast }}>
            {children}
            <div className="fixed top-4 right-4 z-[70] flex flex-col gap-2 pointer-events-none">
                {toasts.map(toast => (
                    <Toast key={toast.id} {...toast} onClose={() => removeToast(toast.id)} />
                ))}
            </div>
        </ToastContext.Provider>
    );
};

export const useToast = () => useContext(ToastContext);

const Toast = ({ message, type, duration, onClose }) => {
    useEffect(() => {
        const timer = setTimeout(onClose, duration);
        return () => clearTimeout(timer);
    }, [duration, onClose]);

    const icons = {
        success: <Check size={18} className="text-emerald-400" />,
        error: <X size={18} className="text-red-400" />,
        info: <Info size={18} className="text-blue-400" />,
        warning: <AlertTriangle size={18} className="text-amber-400" />
    };

    const borders = {
        success: 'border-emerald-500/50',
        error: 'border-red-500/50',
        info: 'border-blue-500/50',
        warning: 'border-amber-500/50',
    }

    return (
        <div className={`pointer-events-auto flex items-center gap-3 bg-[#252936] text-white px-4 py-3 rounded-xl shadow-xl border ${borders[type]} animate-in slide-in-from-top-2 fade-in duration-300 min-w-[300px]`}>
            {icons[type]}
            <p className="text-sm font-medium flex-1">{message}</p>
            <button onClick={onClose} className="text-gray-400 hover:text-white">
                <X size={14} />
            </button>
        </div>
    );
};
