import React, { useState, useEffect, useRef } from 'react';
import { Pencil } from 'lucide-react';
import clsx from 'clsx';
import { RichTextToolbar } from './RichTextToolbar';
import { useResume } from '../../context/ResumeContext';

export const EditableField = ({
    value,
    onSave,
    placeholder = 'Click to edit...',
    className = '',
    multiline = false,
    isWeb = false,
    isEditable = true,
    textStyle = {},
}) => {
    const { isGenerating } = useResume();
    const [isEditing, setIsEditing] = useState(false);
    const [toolbarVisible, setToolbarVisible] = useState(false);
    const containerRef = useRef(null);

    // Combine local prop and global generating state
    // If generating (PDF export), we force non-editable
    const canEdit = isEditable && !isGenerating;

    // If not editable (e.g., true PDF export), render static span
    if (!canEdit) {
        return (
            <span
                className={className}
                style={textStyle}
                dangerouslySetInnerHTML={{ __html: value }}
            />
        );
    }

    const handleClick = (e) => {
        e.stopPropagation(); // Prevent bubbling
        if (!isEditing) {
            setIsEditing(true);
            setToolbarVisible(true);
        }
    };

    const handleBlur = (e) => {
        // If the blur event is caused by clicking INSIDE the toolbar, don't close.
        // We handle this via the toolbar's onMouseDown preventing default focus loss, 
        // but double check here if relatedTarget is within our component? 
        // Actually, toolbar is usually outside contentEditable focus scope.

        // Simple logic: Close on blur.
        if (!e.currentTarget.contains(e.relatedTarget)) {
            saveChanges();
        }
    };

    const saveChanges = () => {
        setIsEditing(false);
        setToolbarVisible(false);
        if (containerRef.current) {
            const newHtml = containerRef.current.innerHTML;
            if (newHtml !== value) {
                onSave(newHtml);
            }
        }
    };

    const handleFormat = (command, val) => {
        document.execCommand(command, false, val);
        // Keep focus
        if (containerRef.current) {
            containerRef.current.focus();
        }
    };

    const handleKeyDown = (e) => {
        if (e.key === 'Escape') {
            setIsEditing(false);
            setToolbarVisible(false);
            if (containerRef.current) containerRef.current.innerHTML = value; // Revert
        }
        // Enter key: usually inserts <div> or <br>. 
        // If not multiline, we might want to preventing new lines or save?
        // But "Rich Text" usually implies multiline capability even for headers sometimes.
        // Let's allow default behavior but maybe stop propagation if needed.
        if (e.key === 'Enter' && !multiline) {
            e.preventDefault();
            saveChanges();
        }
    };

    // Base styling for the editable container
    const editableClass = clsx(
        "outline-none min-w-[50px] transition-all relative block",
        isEditing && "ring-2 ring-indigo-500/50 rounded px-1 -mx-1 bg-white/5", // Visual editing state
        className
    );

    // Hover effect for non-editing state to indicate iteractivity
    const hoverClass = !isEditing ? "hover:ring-2 hover:ring-indigo-500/20 hover:bg-indigo-500/5 rounded px-1 -mx-1 cursor-text" : "";

    return (
        <div className="relative inline-block w-full group">
            {isEditing && (
                <RichTextToolbar onFormat={handleFormat} />
            )}

            <div
                ref={containerRef}
                contentEditable={isEditing}
                suppressContentEditableWarning={true}
                onClick={handleClick}
                onBlur={handleBlur} // This fires when focus leaves the contentEditable
                onKeyDown={handleKeyDown}
                className={clsx(editableClass, hoverClass)}
                style={textStyle}
                dangerouslySetInnerHTML={{ __html: value || (isEditing ? '' : placeholder) }}
                title={!isEditing ? "Click to edit" : ""}
            />
        </div>
    );
};
