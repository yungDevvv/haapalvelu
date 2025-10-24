"use client";

import { useEditor, EditorContent } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import Placeholder from '@tiptap/extension-placeholder';
import { Button } from "@/components/ui/button";
import { Bold, Italic, List, ListOrdered, Quote, Undo, Redo, Type, AlignLeft, AlignCenter } from "lucide-react";

export function RichTextEditor({ content, onChange, placeholder = "Kirjoita tähän..." }) {
  const editor = useEditor({
    extensions: [
      StarterKit,
      Placeholder.configure({
        placeholder,
      }),
    ],
    content,
    immediatelyRender: false,
    onUpdate: ({ editor }) => {
      onChange(editor.getHTML());
    },
  });

  if (!editor) {
    return null;
  }

  return (
    <div className="border rounded-lg">
      {/* Toolbar */}
      <div className="border-b p-3 bg-gray-50">
        <div className="flex items-center gap-1 flex-wrap">
          {/* Text Formatting */}
          <div className="flex items-center gap-1 mr-2">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => editor.chain().focus().toggleHeading({ level: 1 }).run()}
              className={editor.isActive('heading', { level: 1 }) ? 'bg-blue-200' : ''}
              title="Pääotsikko (H1)"
            >
              <Type className="h-4 w-4" />
              <span className="text-xs ml-1">H1</span>
            </Button>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => editor.chain().focus().toggleHeading({ level: 3 }).run()}
              className={editor.isActive('heading', { level: 3 }) ? 'bg-blue-200' : ''}
              title="Alaotsikko (H3)"
            >
              <Type className="h-4 w-4" />
              <span className="text-xs ml-1">H3</span>
            </Button>
          </div>
          
          <div className="w-px h-6 bg-gray-300 mx-1" />
          
          {/* Text Style */}
          <div className="flex items-center gap-1 mr-2">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => editor.chain().focus().toggleBold().run()}
              className={editor.isActive('bold') ? 'bg-blue-200' : ''}
              title="Lihavointi"
            >
              <Bold className="h-4 w-4" />
            </Button>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => editor.chain().focus().toggleItalic().run()}
              className={editor.isActive('italic') ? 'bg-blue-200' : ''}
              title="Kursivointi"
            >
              <Italic className="h-4 w-4" />
            </Button>
          </div>
          
          <div className="w-px h-6 bg-gray-300 mx-1" />
          
          {/* Lists */}
          <div className="flex items-center gap-1 mr-2">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => editor.chain().focus().toggleBulletList().run()}
              className={editor.isActive('bulletList') ? 'bg-blue-200' : ''}
              title="Luettelo"
            >
              <List className="h-4 w-4" />
            </Button>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => editor.chain().focus().toggleOrderedList().run()}
              className={editor.isActive('orderedList') ? 'bg-blue-200' : ''}
              title="Numeroitu luettelo"
            >
              <ListOrdered className="h-4 w-4" />
            </Button>
          </div>
          
          <div className="w-px h-6 bg-gray-300 mx-1" />
          
          {/* Actions */}
          <div className="flex items-center gap-1">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => editor.chain().focus().undo().run()}
              disabled={!editor.can().undo()}
              title="Kumoa"
            >
              <Undo className="h-4 w-4" />
            </Button>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => editor.chain().focus().redo().run()}
              disabled={!editor.can().redo()}
              title="Tee uudelleen"
            >
              <Redo className="h-4 w-4" />
            </Button>
          </div>
        </div>
        
        {/* Quick Insert Buttons */}
        <div className="flex items-center gap-2 mt-2 pt-2 border-t border-gray-200">
          <span className="text-xs text-gray-600 mr-2">Pikavalinnat:</span>
          <Button
            variant="outline"
            size="sm"
            onClick={() => editor.chain().focus().insertContent('🕊️ ').run()}
            className="text-xs h-7"
          >
            🕊️
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={() => editor.chain().focus().insertContent('💒 ').run()}
            className="text-xs h-7"
          >
            💒
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={() => editor.chain().focus().insertContent('🥂 ').run()}
            className="text-xs h-7"
          >
            🥂
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={() => editor.chain().focus().insertContent('🎵 ').run()}
            className="text-xs h-7"
          >
            🎵
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={() => editor.chain().focus().insertContent('💃 ').run()}
            className="text-xs h-7"
          >
            💃
          </Button>
        </div>
      </div>

      {/* Editor Content */}
      <div className="p-4">
        <EditorContent 
          editor={editor} 
          className="prose prose-sm max-w-none focus:outline-none min-h-[200px]"
        />
      </div>
    </div>
  );
}
