import React from 'react';
import clsx from 'clsx';
import { twMerge } from 'tailwind-merge';

export function Input({ className, label, error, ...props }) {
    return (
        <div className="w-full">
            {label && (
                <label className="block text-sm font-medium text-slate-300 mb-1">
                    {label}
                </label>
            )}
            <input
                className={twMerge(
                    'w-full rounded-lg glass-input px-3 py-2 text-sm disabled:opacity-50 disabled:cursor-not-allowed',
                    error && 'border-red-500/50 focus:border-red-500',
                    className
                )}
                {...props}
            />
            {error && <p className="mt-1 text-xs text-red-500">{error}</p>}
        </div>
    );
}
