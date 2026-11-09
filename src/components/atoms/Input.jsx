import React from 'react';

const Input = ({
    label,
    type = 'text',
    error,
    className = '',
    containerClassName = '',
    id,
    errorId,
    ...props
}) => {
    const generatedId = React.useId();
    const inputId = id || generatedId;

    return (
        <div className={`flex flex-col gap-2 ${containerClassName}`}>
            {label && (
                <label htmlFor={inputId} className="ml-1 text-sm font-medium text-secondary">
                    {label}
                </label>
            )}
            <input
                id={inputId}
                type={type}
                aria-describedby={error ? errorId : undefined}
                className={`
          w-full bg-bg text-primary rounded-xl px-4 py-3
          shadow-[inset_2px_2px_5px_var(--shadow-dark),inset_-2px_-2px_5px_var(--shadow-light)]
          border border-border focus:border-accent
          transition-colors duration-200
          outline-none focus-visible:ring-2 focus-visible:ring-accent focus-visible:ring-offset-2 focus-visible:ring-offset-bg
          placeholder:text-secondary
          ${error ? 'border-red-500 focus:border-red-500 focus:ring-red-500' : ''}
          ${className}
        `}
                {...props}
            />
            {error && (
                <span id={errorId} className="text-xs text-red-500 ml-1" role="alert">{error}</span>
            )}
        </div>
    );
};

export default Input;
