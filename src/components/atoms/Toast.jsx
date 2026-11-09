/* eslint-disable react-refresh/only-export-components */
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
            <div className="pointer-events-none fixed right-4 top-4 z-[70] flex flex-col gap-2" aria-live="polite" aria-atomic="true">
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

    const colors = {
        success: 'bg-emerald-600/20',
        error: 'bg-red-600/20',
        info: 'bg-blue-600/20',
        warning: 'bg-amber-600/20',
    }

    return (
        <div className={`pointer-events-auto flex min-w-[280px] items-center gap-3 rounded-xl border bg-surface px-4 py-3 text-primary shadow-neu ${borders[type]}`}>
            <div className={`p-2 rounded-full ${colors[type]}`}>
                {icons[type]}
            </div>
            <p className="flex-1 text-sm font-medium">{message}</p>
            <button type="button" onClick={onClose} className="icon-button h-8 w-8 p-1" aria-label="Dismiss notification">
                <X size={14} aria-hidden="true" />
            </button>
        </div>
    );
};
