import React, { useEffect, useState } from 'react';
import { Bold, Italic, Underline, AlignLeft, AlignCenter, AlignRight, Type } from 'lucide-react';
import clsx from 'clsx';

export const RichTextToolbar = ({ onFormat, currentFormat }) => {
    // onFormat(command, value)

    // Prevent toolbar click from stealing focus or closing the editor
    const handleMouseDown = (e) => {
        e.preventDefault();
    };

    const Button = ({ icon: Icon, command, value, active, label }) => (
        <button
            type="button"
            onMouseDown={handleMouseDown}
            onClick={() => onFormat(command, value)}
            className={clsx(
                "p-1.5 rounded hover:bg-slate-200 text-slate-700 transition-colors",
                active && "bg-slate-300 text-slate-900"
            )}
            title={label}
        >
            <Icon className="w-4 h-4" />
        </button>
    );

    return (
        <div className="absolute bottom-full left-0 mb-2 flex items-center gap-1 bg-white border border-gray-200 shadow-lg rounded-lg p-1 z-50 animate-in fade-in zoom-in-95 duration-200 whitespace-nowrap">
            <Button icon={Bold} command="bold" label="Bold" />
            <Button icon={Italic} command="italic" label="Italic" />
            <Button icon={Underline} command="underline" label="Underline" />

            <div className="w-px h-4 bg-gray-300 mx-1" />

            <Button icon={AlignLeft} command="justifyLeft" label="Align Left" />
            <Button icon={AlignCenter} command="justifyCenter" label="Align Center" />
            <Button icon={AlignRight} command="justifyRight" label="Align Right" />

            {/* Font Handling could go here later */}
        </div>
    );
};
