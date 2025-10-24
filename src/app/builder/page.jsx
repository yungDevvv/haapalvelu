"use client";

import { useState, useEffect, Suspense } from "react";
import { Button } from "@/components/ui/button";
import { Save, Eye, ArrowLeft, Palette } from "lucide-react";
import { Sheet, SheetContent, SheetHeader, SheetTitle } from "@/components/ui/sheet";
import { useRouter, useSearchParams } from "next/navigation";
import BlocksSidebar from "@/components/wedding-builder/BlocksSidebar";
import BuilderCanvas from "@/components/wedding-builder/BuilderCanvas";
import TabbedBlockEditor from "@/components/wedding-builder/TabbedBlockEditor";
import SectionNavigation from "@/components/wedding-builder/SectionNavigation";
import GlobalStylesEditor from "@/components/wedding-builder/GlobalStylesEditor";
import { getTheme } from "@/lib/wedding-themes";
import { getTemplateById } from "@/lib/website-templates";

// Import blocks
import HeroBlock, { heroBlockDefaults } from "@/components/wedding-builder/blocks/HeroBlock";
import HeadingBlock, { headingBlockDefaults } from "@/components/wedding-builder/blocks/HeadingBlock";
import CountdownBlock, { countdownBlockDefaults } from "@/components/wedding-builder/blocks/CountdownBlock";
import ProgramBlock, { programBlockDefaults } from "@/components/wedding-builder/blocks/ProgramBlock";
import RSVPBlock, { rsvpBlockDefaults } from "@/components/wedding-builder/blocks/RSVPBlock";
import GalleryBlock, { galleryBlockDefaults } from "@/components/wedding-builder/blocks/GalleryBlock";
import TextBlock, { textBlockDefaults } from "@/components/wedding-builder/blocks/TextBlock";
import DividerBlock, { dividerBlockDefaults } from "@/components/wedding-builder/blocks/DividerBlock";

// Block defaults mapping
const blockDefaults = {
    hero: heroBlockDefaults,
    heading: headingBlockDefaults,
    countdown: countdownBlockDefaults,
    program: programBlockDefaults,
    rsvp: rsvpBlockDefaults,
    gallery: galleryBlockDefaults,
    text: textBlockDefaults,
    divider: dividerBlockDefaults
};

// Wedding Page Builder - Inner component with searchParams
function WeddingBuilderInner() {
    const router = useRouter();
    const searchParams = useSearchParams();
    const [currentTheme, setCurrentTheme] = useState('romantic');
    const [blocks, setBlocks] = useState([]);
    const [editingBlock, setEditingBlock] = useState(null);
    const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
    const [currentTemplate, setCurrentTemplate] = useState(null); // Store template with blockDefaults
    const [showGlobalStyles, setShowGlobalStyles] = useState(false); // Toggle global styles panel

    const theme = getTheme(currentTheme);

    // Load template if provided in URL
    useEffect(() => {
        const templateId = searchParams.get('template');
        if (templateId) {
            const template = getTemplateById(templateId);
            if (template) {
                // Store template for accessing blockDefaults
                setCurrentTemplate(template);
                
                // Set theme from template
                setCurrentTheme(template.theme.name);
                
                // Load blocks from template
                setBlocks(template.blocks);
                
                console.log('Template loaded:', template.name);
                console.log('Blocks loaded:', template.blocks.length);
                console.log('BlockDefaults available:', template.blockDefaults ? 'Yes' : 'No');
            }
        }
    }, [searchParams]);

    // Add new block with template defaults applied
    const handleAddBlock = (blockType) => {
        // Start with base block defaults
        let blockData = { ...blockDefaults[blockType] };
        
        // If template has blockDefaults, merge them in (template settings override base defaults)
        if (currentTemplate?.blockDefaults?.[blockType]) {
            blockData = {
                ...blockData,
                ...currentTemplate.blockDefaults[blockType]
            };
            console.log(`✨ Käytetään template '${currentTemplate.name}' asetuksia blokkityypille '${blockType}'`);
        }
        
        const newBlock = {
            id: Date.now().toString(),
            type: blockType,
            data: blockData,
            component: null // Will be rendered dynamically
        };

        setBlocks(prev => [...prev, newBlock]);
    };

    // Move block up or down
    const handleMoveBlock = (index, direction) => {
        const newBlocks = [...blocks];
        if (direction === 'up' && index > 0) {
            [newBlocks[index], newBlocks[index - 1]] = [newBlocks[index - 1], newBlocks[index]];
        } else if (direction === 'down' && index < blocks.length - 1) {
            [newBlocks[index], newBlocks[index + 1]] = [newBlocks[index + 1], newBlocks[index]];
        }
        setBlocks(newBlocks);
    };

    // Edit block
    const handleEditBlock = (index) => {
        setEditingBlock({ ...blocks[index], index });
        setIsEditDialogOpen(true);
    };

    // Save edited block
    const handleSaveBlock = (updatedData) => {
        if (editingBlock) {
            const newBlocks = [...blocks];
            newBlocks[editingBlock.index] = {
                ...newBlocks[editingBlock.index],
                data: updatedData
            };
            setBlocks(newBlocks);
        }
    };

    // Update block (for navigation)
    const handleUpdateBlock = (index, updatedData) => {
        const newBlocks = [...blocks];
        newBlocks[index] = {
            ...newBlocks[index],
            data: updatedData
        };
        setBlocks(newBlocks);
    };

    // Delete block
    const handleDeleteBlock = (index) => {
        if (confirm('Haluatko varmasti poistaa tämän lohkon?')) {
            setBlocks(blocks.filter((_, i) => i !== index));
        }
    };

    // Render blocks with proper components
    const renderedBlocks = blocks.map(block => {
        let component;
        switch (block.type) {
            case 'hero':
                component = <HeroBlock data={block.data} theme={theme} />;
                break;
            case 'heading':
                component = <HeadingBlock data={block.data} theme={theme} />;
                break;
            case 'countdown':
                component = <CountdownBlock data={block.data} theme={theme} />;
                break;
            case 'program':
                component = <ProgramBlock data={block.data} theme={theme} />;
                break;
            case 'rsvp':
                component = <RSVPBlock data={block.data} theme={theme} />;
                break;
            case 'gallery':
                component = <GalleryBlock data={block.data} theme={theme} />;
                break;
            case 'text':
                component = <TextBlock data={block.data} theme={theme} />;
                break;
            case 'divider':
                component = <DividerBlock data={block.data} theme={theme} />;
                break;
            default:
                component = null;
        }
        return { ...block, component };
    });

    // Save page
    const handleSave = () => {
        // Here you would save to backend/context
        console.log('Saving page:', { theme: currentTheme, blocks });
        alert('✅ Sivu tallennettu!');
    };

    // Preview
    const handlePreview = () => {
        // Save to localStorage for preview
        const previewData = {
            theme: currentTheme,
            blocks: blocks.map(block => ({
                id: block.id,
                type: block.type,
                data: block.data
            }))
        };
        localStorage.setItem('wedding-builder-preview', JSON.stringify(previewData));
        
        // Open in new tab
        window.open('/builder/preview', '_blank');
    };

    // Update global styles
    const handleGlobalStylesUpdate = (updatedStyles) => {
        if (currentTemplate) {
            const updatedTemplate = {
                ...currentTemplate,
                globalStyles: updatedStyles
            };
            setCurrentTemplate(updatedTemplate);
            console.log('✨ Globaalit tyylit päivitetty:', updatedStyles);
        }
    };

    return (
        <div className="flex flex-col overflow-y-auto ">
            {/* Top bar */}
            <div className="bg-gray-900 text-white px-4 py-3 flex items-center justify-between">
                <div className="flex items-center gap-4">
                    <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => router.push('/')}
                        className="text-white"
                    >
                        <ArrowLeft className="w-4 h-4 mr-2" />
                        Takaisin
                    </Button>
                    <div className="h-6 w-px bg-gray-700"></div>
                    <h1 className="text-lg font-semibold">Wedding Page Builder</h1>
                </div>

                <div className="flex items-center gap-2">
                    {currentTemplate?.globalStyles && (
                        <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => setShowGlobalStyles(true)}
                            className="text-white "
                        >
                            <Palette className="w-4 h-4 mr-2" />
                            Ulkoasu
                        </Button>
                    )}
                    <Button
                        variant="ghost"
                        size="sm"
                        onClick={handlePreview}
                        className="text-white"
                    >
                        <Eye className="w-4 h-4 mr-2" />
                        Esikatselu
                    </Button>
                    <Button
                        size="sm"
                        onClick={handleSave}
                        className="bg-gradient-to-r from-pink-500 to-purple-600 hover:from-pink-600 hover:to-purple-700"
                    >
                        <Save className="w-4 h-4 mr-2" />
                        Tallenna
                    </Button>
                </div>
            </div>

            {/* Main builder area */}
            <div className="flex flex-1">
                {/* Sidebar */}
                <BlocksSidebar
                    onAddBlock={handleAddBlock}
                    currentTheme={currentTheme}
                    onThemeChange={setCurrentTheme}
                    currentTemplate={currentTemplate}
                />

                {/* Canvas */}
                <div className="flex-1 max-w-7xl mx-auto">
                    <BuilderCanvas
                        blocks={renderedBlocks}
                        theme={theme}
                        onMoveBlock={handleMoveBlock}
                        onEditBlock={handleEditBlock}
                        onDeleteBlock={handleDeleteBlock}
                    />
                </div>

            </div>

            {/* Edit dialog */}
            <TabbedBlockEditor
                block={editingBlock}
                open={isEditDialogOpen}
                onOpenChange={setIsEditDialogOpen}
                onSave={handleSaveBlock}
                theme={theme}
                currentTemplate={currentTemplate}
            />

            {/* Section navigation */}
            <SectionNavigation
                blocks={blocks}
                onUpdateBlock={handleUpdateBlock}
                onDeleteBlock={handleDeleteBlock}
            />

            {/* Global Styles Sheet */}
            <Sheet open={showGlobalStyles} onOpenChange={setShowGlobalStyles}>
                <SheetContent side="right" className="w-full sm:max-w-2xl overflow-y-auto">
                    <SheetHeader>
                        <SheetTitle className="flex items-center gap-2">
                            <Palette className="w-5 h-5" />
                            Ulkoasu - Globaalit Tyyliasetukset
                        </SheetTitle>
                    </SheetHeader>
                    <GlobalStylesEditor
                        template={currentTemplate}
                        onUpdate={handleGlobalStylesUpdate}
                    />
                </SheetContent>
            </Sheet>
        </div>
    );
}

// Wrapper with Suspense for searchParams
export default function WeddingBuilder() {
    return (
        <Suspense fallback={
            <div className="h-screen flex items-center justify-center bg-gray-50">
                <div className="text-center">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-pink-500 mx-auto mb-4"></div>
                    <p className="text-gray-600">Ladataan...</p>
                </div>
            </div>
        }>
            <WeddingBuilderInner />
        </Suspense>
    );
}
