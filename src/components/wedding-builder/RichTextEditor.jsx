"use client";

import { useEditor, EditorContent } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import TextAlign from "@tiptap/extension-text-align";
import Underline from "@tiptap/extension-underline";
import { TextStyle } from "@tiptap/extension-text-style";
import { Extension } from '@tiptap/core';
import { getFontByValue } from "@/lib/wedding-fonts";
import { 
  Bold, 
  Italic, 
  Strikethrough, 
  Code,
  List,
  ListOrdered,
  Heading1,
  Heading2,
  Heading3,
  Quote,
  Undo,
  Redo,
  AlignLeft,
  AlignCenter,
  AlignRight,
  Underline as UnderlineIcon
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

// Custom FontSize extension
const FontSize = Extension.create({
  name: 'fontSize',
  addOptions() {
    return {
      types: ['textStyle'],
    };
  },
  addGlobalAttributes() {
    return [
      {
        types: this.options.types,
        attributes: {
          fontSize: {
            default: null,
            parseHTML: element => element.style.fontSize,
            renderHTML: attributes => {
              if (!attributes.fontSize) {
                return {};
              }
              return {
                style: `font-size: ${attributes.fontSize}`,
              };
            },
          },
        },
      },
    ];
  },
  addCommands() {
    return {
      setFontSize: fontSize => ({ chain }) => {
        return chain().setMark('textStyle', { fontSize }).run();
      },
      unsetFontSize: () => ({ chain }) => {
        return chain().setMark('textStyle', { fontSize: null }).updateAttributes('textStyle', { fontSize: null }).run();
      },
    };
  },
});

// Rich text editor component for wedding builder
export default function RichTextEditor({ content, onChange, textColor, textFont, backgroundColor }) {
  const editor = useEditor({
    extensions: [
      StarterKit,
      Underline,
      TextStyle,
      FontSize,
      TextAlign.configure({
        types: ['heading', 'paragraph'],
        alignments: ['left', 'center', 'right'],
      }),
    ],
    content: content || "",
    immediatelyRender: false,
    onUpdate: ({ editor }) => {
      onChange(editor.getHTML());
    },
    editorProps: {
      attributes: {
        class: 'prose prose-sm max-w-none focus:outline-none min-h-[300px] p-4'
      }
    }
  });

  if (!editor) {
    return null;
  }

  return (
    <div className="border rounded-lg overflow-hidden">
      {/* Toolbar */}
      <div className="bg-gray-50 border-b p-2 flex flex-wrap gap-1">
        {/* Headings */}
        <div className="flex gap-1 pr-2 border-r border-gray-300">
          <Button
            size="sm"
            variant="ghost"
            onClick={() => editor.chain().focus().toggleHeading({ level: 1 }).run()}
            className={editor.isActive('heading', { level: 1 }) ? 'bg-gray-200' : ''}
            title="Otsikko 1"
          >
            <Heading1 className="w-4 h-4" />
          </Button>
          <Button
            size="sm"
            variant="ghost"
            onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()}
            className={editor.isActive('heading', { level: 2 }) ? 'bg-gray-200' : ''}
            title="Otsikko 2"
          >
            <Heading2 className="w-4 h-4" />
          </Button>
          <Button
            size="sm"
            variant="ghost"
            onClick={() => editor.chain().focus().toggleHeading({ level: 3 }).run()}
            className={editor.isActive('heading', { level: 3 }) ? 'bg-gray-200' : ''}
            title="Otsikko 3"
          >
            <Heading3 className="w-4 h-4" />
          </Button>
        </div>

        {/* Font Size */}
        <div className="pr-2 border-r border-gray-300">
          <Select
            value={editor.getAttributes('textStyle').fontSize || '16px'}
            onValueChange={(value) => {
              if (value === 'default') {
                editor.chain().focus().unsetFontSize().run();
              } else {
                editor.chain().focus().setFontSize(value).run();
              }
            }}
          >
            <SelectTrigger className="h-8 w-20 text-xs">
              <SelectValue placeholder="Koko" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="default">Oletus</SelectItem>
              <SelectItem value="12px">12px</SelectItem>
              <SelectItem value="14px">14px</SelectItem>
              <SelectItem value="16px">16px</SelectItem>
              <SelectItem value="18px">18px</SelectItem>
              <SelectItem value="20px">20px</SelectItem>
              <SelectItem value="24px">24px</SelectItem>
              <SelectItem value="28px">28px</SelectItem>
              <SelectItem value="32px">32px</SelectItem>
              <SelectItem value="36px">36px</SelectItem>
              <SelectItem value="48px">48px</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Text formatting */}
        <div className="flex gap-1 pr-2 border-r border-gray-300">
          <Button
            size="sm"
            variant="ghost"
            onClick={() => editor.chain().focus().toggleBold().run()}
            className={editor.isActive('bold') ? 'bg-gray-200' : ''}
            title="Lihavoitu"
          >
            <Bold className="w-4 h-4" />
          </Button>
          <Button
            size="sm"
            variant="ghost"
            onClick={() => editor.chain().focus().toggleItalic().run()}
            className={editor.isActive('italic') ? 'bg-gray-200' : ''}
            title="Kursiivi"
          >
            <Italic className="w-4 h-4" />
          </Button>
          <Button
            size="sm"
            variant="ghost"
            onClick={() => editor.chain().focus().toggleStrike().run()}
            className={editor.isActive('strike') ? 'bg-gray-200' : ''}
            title="Yliviivaus"
          >
            <Strikethrough className="w-4 h-4" />
          </Button>
          <Button
            size="sm"
            variant="ghost"
            onClick={() => editor.chain().focus().toggleUnderline().run()}
            className={editor.isActive('underline') ? 'bg-gray-200' : ''}
            title="Alleviivattu"
          >
            <UnderlineIcon className="w-4 h-4" />
          </Button>
        </div>

        {/* Text alignment */}
        <div className="flex gap-1 pr-2 border-r border-gray-300">
          <Button
            size="sm"
            variant="ghost"
            onClick={() => editor.chain().focus().setTextAlign('left').run()}
            className={editor.isActive({ textAlign: 'left' }) ? 'bg-gray-200' : ''}
            title="Tasaa vasemmalle"
          >
            <AlignLeft className="w-4 h-4" />
          </Button>
          <Button
            size="sm"
            variant="ghost"
            onClick={() => editor.chain().focus().setTextAlign('center').run()}
            className={editor.isActive({ textAlign: 'center' }) ? 'bg-gray-200' : ''}
            title="Keskitä"
          >
            <AlignCenter className="w-4 h-4" />
          </Button>
          <Button
            size="sm"
            variant="ghost"
            onClick={() => editor.chain().focus().setTextAlign('right').run()}
            className={editor.isActive({ textAlign: 'right' }) ? 'bg-gray-200' : ''}
            title="Tasaa oikealle"
          >
            <AlignRight className="w-4 h-4" />
          </Button>
        </div>

        {/* Lists */}
        <div className="flex gap-1 pr-2 border-r border-gray-300">
          <Button
            size="sm"
            variant="ghost"
            onClick={() => editor.chain().focus().toggleBulletList().run()}
            className={editor.isActive('bulletList') ? 'bg-gray-200' : ''}
            title="Luettelomerkki"
          >
            <List className="w-4 h-4" />
          </Button>
          <Button
            size="sm"
            variant="ghost"
            onClick={() => editor.chain().focus().toggleOrderedList().run()}
            className={editor.isActive('orderedList') ? 'bg-gray-200' : ''}
            title="Numeroitu lista"
          >
            <ListOrdered className="w-4 h-4" />
          </Button>
        </div>

        {/* Quote */}
        <div className="flex gap-1 pr-2 border-r border-gray-300">
          <Button
            size="sm"
            variant="ghost"
            onClick={() => editor.chain().focus().toggleBlockquote().run()}
            className={editor.isActive('blockquote') ? 'bg-gray-200' : ''}
            title="Lainaus"
          >
            <Quote className="w-4 h-4" />
          </Button>
        </div>

        {/* Undo/Redo */}
        <div className="flex gap-1">
          <Button
            size="sm"
            variant="ghost"
            onClick={() => editor.chain().focus().undo().run()}
            disabled={!editor.can().undo()}
            title="Kumoa"
          >
            <Undo className="w-4 h-4" />
          </Button>
          <Button
            size="sm"
            variant="ghost"
            onClick={() => editor.chain().focus().redo().run()}
            disabled={!editor.can().redo()}
            title="Tee uudelleen"
          >
            <Redo className="w-4 h-4" />
          </Button>
        </div>
      </div>

      {/* Editor content */}
      <div 
        className="border rounded-lg"
        style={{
          backgroundColor: backgroundColor || '#ffffff',
          color: textColor || '#374151',
          fontFamily: textFont ? getFontByValue(textFont).label : 'inherit'
        }}
      >
        <EditorContent editor={editor} />
      </div>

      {/* Help text */}
      <div className="bg-gray-50 border-t p-2 text-xs text-gray-500">
        💡 Käytä työkalupalkia muotoillaksesi tekstiä. Voit käyttää myös pikanäppäimiä: <strong>Ctrl+B</strong> (lihavoitu), <strong>Ctrl+I</strong> (kursiivi)
      </div>
    </div>
  );
}
