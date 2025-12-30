import React from 'react';
import { twMerge } from 'tailwind-merge';

export function Card({ className, children, ...props }) {
    return (
        <div
            className={twMerge(
                'rounded-xl glass-panel',
                className
            )}
            {...props}
        >
            {children}
        </div>
    );
}
