import React from 'react';
import { DragDropContext, Droppable, Draggable } from '@hello-pangea/dnd';
import { useResume } from '../../context/ResumeContext';
import { Card } from '../ui/Card';
import { GripVertical, Eye, EyeOff } from 'lucide-react';
import { clsx } from 'clsx';

export function SectionReorder() {
    const { sectionOrder, reorderSection, resumeData, updateSectionVisibility } = useResume();

    // Map IDs to readable labels
    const labels = {
        personal: 'Personal Information',
        education: 'Education',
        experience: 'Experience',
        projects: 'Projects',
        achievements: 'Achievements',
        skills: 'Skills',
    };

    const onDragEnd = (result) => {
        if (!result.destination) return;

        const items = Array.from(sectionOrder);
        const [reorderedItem] = items.splice(result.source.index, 1);
        items.splice(result.destination.index, 0, reorderedItem);

        reorderSection(items);
    };

    const toggleVisibility = (e, sectionId) => {
        e.stopPropagation(); // Prevent drag start when clicking toggle
        const isVisible = resumeData.sectionVisibility?.[sectionId] !== false;
        updateSectionVisibility(sectionId, !isVisible);
    };

    return (
        <Card className="p-6">
            <h3 className="text-lg font-semibold mb-4 text-gray-900">Reorder & Hide Sections</h3>
            <DragDropContext onDragEnd={onDragEnd}>
                <Droppable droppableId="sections">
                    {(provided) => (
                        <div
                            {...provided.droppableProps}
                            ref={provided.innerRef}
                            className="space-y-2"
                        >
                            {sectionOrder.map((sectionId, index) => {
                                const isVisible = resumeData.sectionVisibility?.[sectionId] !== false;
                                return (
                                    <Draggable key={sectionId} draggableId={sectionId} index={index}>
                                        {(provided, snapshot) => (
                                            <div
                                                ref={provided.innerRef}
                                                {...provided.draggableProps}
                                                {...provided.dragHandleProps}
                                                className={clsx(
                                                    "p-3 bg-white border border-gray-200 rounded-lg flex items-center justify-between gap-3 select-none transition-shadow",
                                                    snapshot.isDragging && "shadow-lg ring-2 ring-blue-500 z-10",
                                                    !isVisible && "opacity-75 bg-gray-50"
                                                )}
                                            >
                                                <div className="flex items-center gap-3">
                                                    <GripVertical className="text-gray-400 w-5 h-5" />
                                                    <span className={clsx("font-medium", !isVisible ? "text-gray-500" : "text-gray-700")}>
                                                        {labels[sectionId]}
                                                    </span>
                                                </div>
                                                <button
                                                    onClick={(e) => toggleVisibility(e, sectionId)}
                                                    className={clsx(
                                                        "p-1.5 rounded-lg transition-colors",
                                                        isVisible ? "text-indigo-600 hover:bg-indigo-50" : "text-gray-400 hover:bg-gray-100"
                                                    )}
                                                    title={isVisible ? "Hide Section" : "Show Section"}
                                                >
                                                    {isVisible ? <Eye className="w-4 h-4" /> : <EyeOff className="w-4 h-4" />}
                                                </button>
                                            </div>
                                        )}
                                    </Draggable>
                                );
                            })}
                            {provided.placeholder}
                        </div>
                    )}
                </Droppable>
            </DragDropContext>
        </Card>
    );
}
