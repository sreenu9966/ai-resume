import React, { useState, useEffect, useRef } from 'react';

export function EditableText({
    value,
    onSave,
    className = '',
    tagName: Tag = 'span',
    placeholder = 'Click to edit...'
}) {
    const [text, setText] = useState(value || '');
    const elementRef = useRef(null);

    // Sync input value with prop value if it changes externally
    useEffect(() => {
        if (elementRef.current && value !== elementRef.current.innerHTML) {
            // Check innerHTML comparison to avoid cursor jumping if only minor diff, 
            // but usually comparing passed value (which is state) vs ref.innerHTML is safe-ish if we are careful.
            // If value is clean HTML and innerHTML is dirty HTML, might differ.
            // For simple usage, just update if different.
            if (elementRef.current.innerHTML !== value) {
                elementRef.current.innerHTML = value || '';
            }
        }
    }, [value]);

    const handleBlur = (e) => {
        const newText = e.target.innerHTML; // Capture HTML for formatting
        if (newText !== value) {
            onSave(newText);
        }
    };

    const handleKeyDown = (e) => {
        if (e.key === 'Enter') {
            e.preventDefault();
            e.target.blur();
        }
    };

    return (
        <Tag
            ref={elementRef}
            className={`cursor-text hover:bg-blue-50/50 outline-none transition-colors border-b border-transparent focus:border-blue-300 ${className}`}
            contentEditable
            suppressContentEditableWarning
            onBlur={handleBlur}
            onKeyDown={handleKeyDown}
            data-placeholder={placeholder}
            dangerouslySetInnerHTML={{ __html: value || '' }}
        />
    );
}
