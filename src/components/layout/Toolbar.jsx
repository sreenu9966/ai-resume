import React, { useState } from 'react';
import { useResume } from '../../context/ResumeContext';
import { Button } from '../ui/Button';
import {
    Bold, Italic, Underline,
    AlignLeft, AlignCenter, AlignRight,
    List, ListOrdered,
    Type, Palette,
    Table, Box, Circle, Star,
    Layout, Eye, Download,
    ChevronDown
} from 'lucide-react';

export function Toolbar({ onDownload, isGenerating }) {
    const { resumeData, updateThemeColor, updateFontFamily, updateFontSize } = useResume();
    const [activeTab, setActiveTab] = useState('home');

    const handleFormat = (command) => {
        document.execCommand(command, false, null);
        // Note: The contentEditable element must be focused for this to work.
        // We ensure button click doesn't steal focus by using preventDefault onMouseDown/Action.
    };

    const tabs = [
        { id: 'home', label: 'Home' },
        { id: 'insert', label: 'Insert' },
        { id: 'view', label: 'View' },
    ];

    const fontOptions = [
        { label: 'Sans Serif', value: 'font-sans' },
        { label: 'Serif', value: 'font-serif' },
        { label: 'Mono', value: 'font-mono' },
    ];

    const sizeOptions = [
        { label: 'Small', value: 'text-sm' },
        { label: 'Medium', value: 'text-base' },
        { label: 'Large', value: 'text-lg' },
    ];

    return (
        <div className="sticky top-0 z-50 w-full bg-white shadow-sm border-b border-gray-200">
            {/* Window Title Bar Mock */}
            <div className="bg-[#2b579a] text-white px-4 py-1 text-xs flex justify-between items-center">
                <div className="flex gap-2">
                    <span className="opacity-80">AutoSave On</span>
                    <span className="font-semibold">Document1 - ResumeGen</span>
                </div>
                <div className="flex gap-2">
                    <span className="hover:bg-white/10 px-2 rounded cursor-pointer">_</span>
                    <span className="hover:bg-white/10 px-2 rounded cursor-pointer">□</span>
                    <span className="hover:bg-red-500 px-2 rounded cursor-pointer">✕</span>
                </div>
            </div>

            {/* Ribbon Tabs */}
            <div className="bg-[#2b579a] text-white px-2 flex gap-1 pt-1">
                {tabs.map(tab => (
                    <button
                        key={tab.id}
                        onClick={() => setActiveTab(tab.id)}
                        className={`
                            px-4 py-1.5 text-sm rounded-t-lg transition-colors
                            ${activeTab === tab.id
                                ? 'bg-[#f3f4f6] text-gray-900 font-medium'
                                : 'hover:bg-white/10 text-white/90'}
                        `}
                    >
                        {tab.label}
                    </button>
                ))}
            </div>

            {/* Ribbon Content Area */}
            <div className="bg-[#f3f4f6] px-4 py-3 border-b border-gray-300 min-h-[100px] flex items-stretch gap-4 overflow-x-auto">

                {/* HOME TAB */}
                {activeTab === 'home' && (
                    <>
                        {/* Font Group */}
                        <div className="flex flex-col gap-1 pr-4 border-r border-gray-300">
                            <div className="flex gap-1 mb-1">
                                <select
                                    className="h-6 text-xs border border-gray-300 rounded px-1 min-w-[120px]"
                                    value={resumeData.fontFamily}
                                    onChange={(e) => updateFontFamily(e.target.value)}
                                >
                                    {fontOptions.map(opt => <option key={opt.value} value={opt.value}>{opt.label}</option>)}
                                </select>
                                <select
                                    className="h-6 text-xs border border-gray-300 rounded px-1 w-16"
                                    value={resumeData.fontSize}
                                    onChange={(e) => updateFontSize(e.target.value)}
                                >
                                    {sizeOptions.map(opt => <option key={opt.value} value={opt.value}>{opt.label}</option>)}
                                </select>
                            </div>
                            <div className="flex gap-1">
                                <Button
                                    variant="ghost"
                                    size="icon"
                                    className="h-7 w-7"
                                    onClick={() => handleFormat('bold')}
                                    onMouseDown={(e) => e.preventDefault()}
                                >
                                    <Bold className="w-4 h-4" />
                                </Button>
                                <Button
                                    variant="ghost"
                                    size="icon"
                                    className="h-7 w-7"
                                    onClick={() => handleFormat('italic')}
                                    onMouseDown={(e) => e.preventDefault()}
                                >
                                    <Italic className="w-4 h-4" />
                                </Button>
                                <Button
                                    variant="ghost"
                                    size="icon"
                                    className="h-7 w-7"
                                    onClick={() => handleFormat('underline')}
                                    onMouseDown={(e) => e.preventDefault()}
                                >
                                    <Underline className="w-4 h-4" />
                                </Button>
                            </div>
                            <span className="text-[10px] text-gray-500 text-center mt-auto">Font</span>
                        </div>

                        {/* Paragraph Group */}
                        <div className="flex flex-col gap-1 pr-4 border-r border-gray-300">
                            <div className="flex gap-1">
                                <Button variant="ghost" size="icon" className="h-7 w-7"><List className="w-4 h-4" /></Button>
                                <Button variant="ghost" size="icon" className="h-7 w-7"><ListOrdered className="w-4 h-4" /></Button>
                            </div>
                            <div className="flex gap-1 mt-1">
                                <Button variant="ghost" size="icon" className="h-7 w-7"><AlignLeft className="w-4 h-4" /></Button>
                                <Button variant="ghost" size="icon" className="h-7 w-7"><AlignCenter className="w-4 h-4" /></Button>
                                <Button variant="ghost" size="icon" className="h-7 w-7"><AlignRight className="w-4 h-4" /></Button>
                            </div>
                            <span className="text-[10px] text-gray-500 text-center mt-auto">Paragraph</span>
                        </div>

                        {/* Styles / Theme Group */}
                        <div className="flex flex-col gap-2 pr-4 border-r border-gray-300">
                            <div className="flex items-center gap-2">
                                <label className="text-xs font-medium">Theme Color:</label>
                                <input
                                    type="color"
                                    value={resumeData.themeColor}
                                    onChange={(e) => updateThemeColor(e.target.value)}
                                    className="w-6 h-6 p-0 border-0 rounded cursor-pointer"
                                />
                            </div>
                            <span className="text-[10px] text-gray-500 text-center mt-auto">Styles</span>
                        </div>
                    </>
                )}

                {/* INSERT TAB */}
                {activeTab === 'insert' && (
                    <div className="flex gap-4">
                        <div className="flex flex-col items-center gap-1 cursor-pointer hover:bg-white/50 p-2 rounded">
                            <Table className="w-8 h-8 text-blue-600" />
                            <span className="text-xs">Table</span>
                        </div>
                        <div className="flex flex-col items-center gap-1 cursor-pointer hover:bg-white/50 p-2 rounded">
                            <Box className="w-8 h-8 text-orange-600" />
                            <span className="text-xs">Shapes</span>
                        </div>
                        <div className="flex flex-col items-center gap-1 cursor-pointer hover:bg-white/50 p-2 rounded">
                            <Circle className="w-8 h-8 text-green-600" />
                            <span className="text-xs">Icons</span>
                        </div>
                    </div>
                )}

                {/* VIEW TAB */}
                {activeTab === 'view' && (
                    <div className="flex gap-4">
                        <div className="flex flex-col items-center gap-1 cursor-pointer hover:bg-white/50 p-2 rounded">
                            <Layout className="w-8 h-8 text-gray-600" />
                            <span className="text-xs">Print Layout</span>
                        </div>
                        <Button onClick={onDownload} disabled={isGenerating} className="flex flex-col items-center gap-1 h-auto py-2 bg-transparent hover:bg-white/50 text-gray-800 shadow-none border-0">
                            {isGenerating ? (
                                <div className="w-8 h-8 rounded-full border-4 border-blue-200 border-t-blue-600 animate-spin" />
                            ) : (
                                <Eye className="w-8 h-8 text-blue-600" />
                            )}
                            <span className="text-xs">Preview & PDF</span>
                        </Button>
                    </div>
                )}
            </div>
        </div>
    );
}
