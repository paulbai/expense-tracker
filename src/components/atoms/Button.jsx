import React from 'react';

const Button = ({
    children,
    variant = 'primary',
    size = 'md',
    className = '',
    disabled = false,
    onClick,
    type = 'button',
    'aria-label': ariaLabel,
    ...props
}) => {
    const baseStyles = 'inline-flex items-center justify-center rounded-2xl font-semibold transition-[background-color,border-color,color,box-shadow,transform] duration-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-accent focus-visible:ring-offset-2 focus-visible:ring-offset-bg disabled:cursor-not-allowed disabled:opacity-50';

    const variants = {
        primary: 'bg-accent text-white shadow-lg hover:shadow-xl hover:scale-[1.02] active:scale-95',
        secondary: 'bg-surface text-primary shadow-neu hover:brightness-110 active:scale-95',
        ghost: 'bg-transparent text-secondary hover:text-primary hover:bg-primary/5',
        danger: 'bg-red-500 text-white hover:bg-red-600 shadow-lg'
    };

    const sizes = {
        sm: 'px-3 py-1.5 text-sm',
        md: 'px-6 py-3 text-base',
        lg: 'px-8 py-4 text-lg',
        icon: 'p-3'
    };

    return (
        <button
            type={type}
            className={`${baseStyles} ${variants[variant]} ${sizes[size]} ${className}`}
            disabled={disabled}
            onClick={onClick}
            aria-label={ariaLabel}
            {...props}
        >
            {children}
        </button>
    );
};

export default Button;
