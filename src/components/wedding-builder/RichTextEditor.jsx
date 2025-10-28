"use client";

import { useEditor, EditorContent } from '@tiptap/react';
import { useState, useEffect } from 'react';
import StarterKit from '@tiptap/starter-kit';
import TextAlign from '@tiptap/extension-text-align';
import Underline from '@tiptap/extension-underline';
import { Button } from '@/components/ui/button';
import { 
  Bold, 
  Italic, 
  Strikethrough, 
  UnderlineIcon,
  Heading2,
  List,
  ListOrdered,
  AlignLeft,
  AlignCenter,
  AlignRight
} from 'lucide-react';

// Rich Text Editor - простой и рабочий
export default function RichTextEditor({ content, onChange, textColor, textFont, backgroundColor, alignment = 'center' }) {
  const [, forceUpdate] = useState(0);
  
  const editor = useEditor({
    extensions: [
      StarterKit.configure({
        heading: {
          levels: [2, 3],
        },
      }),
      Underline,
      TextAlign.configure({
        types: ['heading', 'paragraph'],
        alignments: ['left', 'center', 'right'],
        defaultAlignment: alignment,
      }),
    ],
    content: content || "",
    immediatelyRender: false,
    onUpdate: ({ editor }) => {
      onChange(editor.getHTML());
      forceUpdate(n => n + 1); // Force re-render to update button states
    },
    onSelectionUpdate: () => {
      forceUpdate(n => n + 1); // Force re-render when selection changes
    },
    editorProps: {
      attributes: {
        class: 'prose prose-sm max-w-none focus:outline-none min-h-[200px] p-4'
      }
    }
  });

  if (!editor) {
    return null;
  }

  // Check if mark is active OR will be applied to next typed character
  const isMarkActive = (markName) => {
    if (!editor) return false;
    
    // Check if mark is active in current selection
    if (editor.isActive(markName)) return true;
    
    // Check stored marks (marks that will be applied to next character)
    const storedMarks = editor.state.storedMarks;
    if (storedMarks) {
      return storedMarks.some(mark => mark.type.name === markName);
    }
    
    return false;
  };

  return (
    <div className="border rounded-lg overflow-hidden">
      {/* Toolbar */}
      <div className="bg-gray-50 border-b p-2 flex flex-wrap gap-1 items-center">
          {/* Bold */}
          <Button
            type="button"
            size="sm"
            variant={isMarkActive('bold') ? 'default' : 'ghost'}
            onMouseDown={(e) => {
              e.preventDefault();
            }}
            onClick={() => {
              editor.chain().focus().toggleBold().run();
            }}
          >
            <Bold className="w-4 h-4" />
          </Button>

          {/* Italic */}
          <Button
            type="button"
            size="sm"
            variant={isMarkActive('italic') ? 'default' : 'ghost'}
            onMouseDown={(e) => {
              e.preventDefault();
            }}
            onClick={() => {
              editor.chain().focus().toggleItalic().run();
            }}
          >
            <Italic className="w-4 h-4" />
          </Button>

          {/* Strikethrough */}
          <Button
            type="button"
            size="sm"
            variant={isMarkActive('strike') ? 'default' : 'ghost'}
            onMouseDown={(e) => {
              e.preventDefault();
            }}
            onClick={() => {
              editor.chain().focus().toggleStrike().run();
            }}
          >
            <Strikethrough className="w-4 h-4" />
          </Button>

          {/* Underline */}
          <Button
            type="button"
            size="sm"
            variant={isMarkActive('underline') ? 'default' : 'ghost'}
            onMouseDown={(e) => {
              e.preventDefault();
            }}
            onClick={() => {
              editor.chain().focus().toggleUnderline().run();
            }}
          >
            <UnderlineIcon className="w-4 h-4" />
          </Button>

          <div className="w-px h-6 bg-gray-300 mx-1" />

          {/* Heading 2 */}
          <Button
            type="button"
            size="sm"
            variant={editor.isActive('heading', { level: 2 }) ? 'default' : 'ghost'}
            onMouseDown={(e) => {
              e.preventDefault();
            }}
            onClick={() => {
              editor.chain().focus().toggleHeading({ level: 2 }).run();
            }}
          >
            <Heading2 className="w-4 h-4" />
          </Button>

          <div className="w-px h-6 bg-gray-300 mx-1" />

          {/* Bullet List */}
          <Button
            type="button"
            size="sm"
            variant={editor.isActive('bulletList') ? 'default' : 'ghost'}
            onMouseDown={(e) => {
              e.preventDefault();
            }}
            onClick={() => {
              editor.chain().focus().toggleBulletList().run();
            }}
          >
            <List className="w-4 h-4" />
          </Button>

          {/* Ordered List */}
          <Button
            type="button"
            size="sm"
            variant={editor.isActive('orderedList') ? 'default' : 'ghost'}
            onMouseDown={(e) => {
              e.preventDefault();
            }}
            onClick={() => {
              editor.chain().focus().toggleOrderedList().run();
            }}
          >
            <ListOrdered className="w-4 h-4" />
          </Button>

          <div className="w-px h-6 bg-gray-300 mx-1" />

          {/* Align Left */}
          <Button
            type="button"
            size="sm"
            variant={editor.isActive({ textAlign: 'left' }) ? 'default' : 'ghost'}
            onMouseDown={(e) => {
              e.preventDefault();
            }}
            onClick={() => {
              editor.chain().focus().setTextAlign('left').run();
            }}
          >
            <AlignLeft className="w-4 h-4" />
          </Button>

          {/* Align Center */}
          <Button
            type="button"
            size="sm"
            variant={editor.isActive({ textAlign: 'center' }) ? 'default' : 'ghost'}
            onMouseDown={(e) => {
              e.preventDefault();
            }}
            onClick={() => {
              editor.chain().focus().setTextAlign('center').run();
            }}
          >
            <AlignCenter className="w-4 h-4" />
          </Button>

          {/* Align Right */}
          <Button
            type="button"
            size="sm"
            variant={editor.isActive({ textAlign: 'right' }) ? 'default' : 'ghost'}
            onMouseDown={(e) => {
              e.preventDefault();
            }}
            onClick={() => {
              editor.chain().focus().setTextAlign('right').run();
            }}
          >
            <AlignRight className="w-4 h-4" />
          </Button>
      </div>

      {/* Editor content */}
      <div 
        className="rounded-lg"
        style={{
          backgroundColor: backgroundColor || '#ffffff',
          color: textColor || '#374151'
        }}
      >
        <EditorContent editor={editor} />
      </div>
    </div>
  );
}
