import React from 'react';
import { DragDropContext, Droppable, Draggable } from '@hello-pangea/dnd';
import { useResume } from '../../../hooks/useResume';
import { Card } from '../ui/Card';
import { GripVertical } from 'lucide-react';
import { clsx } from 'clsx';

export function SectionReorder() {
    const { sectionOrder, reorderSection } = useResume();

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

    return (
        <Card className="p-6">
            <h3 className="text-lg font-semibold mb-4 text-gray-900">Reorder Sections</h3>
            <DragDropContext onDragEnd={onDragEnd}>
                <Droppable droppableId="sections">
                    {(provided) => (
                        <div
                            {...provided.droppableProps}
                            ref={provided.innerRef}
                            className="space-y-2"
                        >
                            {sectionOrder.map((sectionId, index) => (
                                <Draggable key={sectionId} draggableId={sectionId} index={index}>
                                    {(provided, snapshot) => (
                                        <div
                                            ref={provided.innerRef}
                                            {...provided.draggableProps}
                                            {...provided.dragHandleProps}
                                            className={clsx(
                                                "p-3 bg-white border border-gray-200 rounded-lg flex items-center gap-3 select-none transition-shadow",
                                                snapshot.isDragging && "shadow-lg ring-2 ring-blue-500 z-10"
                                            )}
                                        >
                                            <GripVertical className="text-gray-400 w-5 h-5" />
                                            <span className="font-medium text-gray-700">{labels[sectionId]}</span>
                                        </div>
                                    )}
                                </Draggable>
                            ))}
                            {provided.placeholder}
                        </div>
                    )}
                </Droppable>
            </DragDropContext>
        </Card>
    );
}
