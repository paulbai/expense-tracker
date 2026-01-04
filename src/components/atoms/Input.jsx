import React from 'react';

const Input = ({
    label,
    type = 'text',
    error,
    className = '',
    containerClassName = '',
    id,
    ...props
}) => {
    const generatedId = React.useId();
    const inputId = id || generatedId;

    return (
        <div className={`flex flex-col gap-2 ${containerClassName}`}>
            {label && (
                <label htmlFor={inputId} className="text-sm font-medium text-gray-400 ml-1">
                    {label}
                </label>
            )}
            <input
                id={inputId}
                type={type}
                className={`
          w-full bg-bg text-primary rounded-xl px-4 py-3
          shadow-[inset_2px_2px_5px_var(--shadow-dark),inset_-2px_-2px_5px_var(--shadow-light)]
          border border-transparent focus:border-accent
          transition-all duration-200
          outline-none
          placeholder:text-gray-500
          ${error ? 'border-red-500 focus:border-red-500 focus:ring-red-500' : ''}
          ${className}
        `}
                {...props}
            />
            {error && (
                <span className="text-xs text-red-500 ml-1">{error}</span>
            )}
        </div>
    );
};

export default Input;
