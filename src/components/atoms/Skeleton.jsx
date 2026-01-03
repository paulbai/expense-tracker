import React from 'react';

const Skeleton = ({ className, variant = "text", width, height }) => {
    const baseClasses = "animate-pulse bg-white/5 rounded";

    const variantClasses = {
        text: "h-4 w-full rounded",
        circular: "rounded-full",
        rectangular: "rounded-xl",
    };

    const style = {
        width,
        height,
    };

    return (
        <div
            className={`${baseClasses} ${variantClasses[variant] || ""} ${className || ""}`}
            style={style}
        />
    );
};

export default Skeleton;
