import React from 'react';
import clsx from 'clsx';
import { twMerge } from 'tailwind-merge';

export function Button({ className, variant = 'primary', size = 'md', type = 'button', ...props }) {
    const variants = {
        primary: 'glass-button',
        secondary: 'glass-button-secondary',
        outline: 'border border-slate-600 bg-transparent hover:bg-slate-800 text-slate-200',
        ghost: 'bg-transparent hover:bg-slate-800/50 text-slate-300 hover:text-white',
        danger: 'bg-red-500/80 hover:bg-red-600/90 text-white shadow-lg shadow-red-500/20',
    };

    const sizes = {
        sm: 'px-3 py-1.5 text-sm',
        md: 'px-4 py-2',
        lg: 'px-6 py-3 text-lg',
        icon: 'p-2',
    };

    return (
        <button
            type={type}
            className={twMerge(
                'inline-flex items-center justify-center rounded-lg font-medium transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-1 disabled:opacity-50 disabled:pointer-events-none',
                variants[variant],
                sizes[size],
                className
            )}
            {...props}
        />
    );
}
