"use client";

import { useState, useEffect, useRef } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Image as ImageIcon } from "lucide-react";
import RichTextEditor from "./RichTextEditor";
import ColorPicker from "./ColorPicker";
import FontSelector from "./FontSelector";
import { Label } from "../ui/label";
import { getFontClass, getFontByValue } from "@/lib/wedding-fonts";
// Import block components for preview
import HeroBlock from "./blocks/HeroBlock";
import HeadingBlock from "./blocks/HeadingBlock";
import TextBlock from "./blocks/TextBlock";
import ProgramBlock from "./blocks/ProgramBlock";
import CountdownBlock from "./blocks/CountdownBlock";
import RSVPBlock from "./blocks/RSVPBlock";
import GalleryBlock from "./blocks/GalleryBlock";
import DividerBlock from "./blocks/DividerBlock";

// Helper function to convert hex color to SVG filter
function getSVGColorFilter(hexColor) {
  // Convert hex to RGB and create filter
  // Using invert, sepia, saturate, and hue-rotate to colorize SVG
  const hex = hexColor.replace('#', '');
  const r = parseInt(hex.substring(0, 2), 16);
  const g = parseInt(hex.substring(2, 4), 16);
  const b = parseInt(hex.substring(4, 6), 16);
  
  // Simple colorize approach: brightness(0) to make black, then use sepia and hue-rotate
  // For better accuracy, we use a combination of filters
  return `brightness(0) saturate(100%) invert(${(r + g + b) / 765}) sepia(100%) saturate(200%) hue-rotate(${getHueRotation(hexColor)}deg) brightness(0.9)`;
}

// Calculate hue rotation for color transformation
function getHueRotation(hexColor) {
  const hex = hexColor.replace('#', '');
  const r = parseInt(hex.substring(0, 2), 16) / 255;
  const g = parseInt(hex.substring(2, 4), 16) / 255;
  const b = parseInt(hex.substring(4, 6), 16) / 255;
  
  const max = Math.max(r, g, b);
  const min = Math.min(r, g, b);
  let h = 0;
  
  if (max !== min) {
    const d = max - min;
    if (max === r) {
      h = ((g - b) / d + (g < b ? 6 : 0)) / 6;
    } else if (max === g) {
      h = ((b - r) / d + 2) / 6;
    } else {
      h = ((r - g) / d + 4) / 6;
    }
  }
  
  return Math.round(h * 360);
}

// Validation schemas
const heroSchema = z.object({
  title: z.string().min(1, "Otsikko on pakollinen"),
  subtitle: z.string().optional(),
  date: z.string().optional(),
  location: z.string().optional(),
  titleFont: z.string().optional(),
  subtitleFont: z.string().optional(),
  titleColor: z.string().optional(),
  subtitleColor: z.string().optional(),
  backgroundImage: z.string().optional(),
  backgroundColor: z.string().optional(),
  paddingY: z.coerce.number().optional(),
  paddingX: z.coerce.number().optional(),
  styleVariant: z.string().optional(),
});

const headingSchema = z.object({
  text: z.string().min(1, "Otsikko on pakollinen"),
  level: z.string().optional(),
  alignment: z.string().optional(),
  font: z.string().optional(),
  color: z.string().optional(),
  backgroundColor: z.string().optional(),
  paddingY: z.coerce.number().optional(),
  paddingX: z.coerce.number().optional(),
});

const textSchema = z.object({
  content: z.string().min(1, "Sisältö on pakollinen"),
  contentFont: z.string().optional(),
  contentColor: z.string().optional(),
  alignment: z.string().optional(),
  backgroundColor: z.string().optional(),
  paddingY: z.coerce.number().optional(),
  paddingX: z.coerce.number().optional(),
});

const programSchema = z.object({
  title: z.string().min(1, "Otsikko on pakollinen"),
  description: z.string().optional(),
  titleFont: z.string().optional(),
  descriptionFont: z.string().optional(),
  events: z.array(z.object({
    time: z.string().optional(),
    title: z.string().optional(),
    description: z.string().optional(),
    location: z.string().optional(),
  })).optional(),
  backgroundColor: z.string().optional(),
  paddingY: z.coerce.number().optional(),
  paddingX: z.coerce.number().optional(),
  styleVariant: z.string().optional(),
});

const countdownSchema = z.object({
  title: z.string().min(1, "Otsikko on pakollinen"),
  description: z.string().optional(),
  titleFont: z.string().optional(),
  descriptionFont: z.string().optional(),
  targetDate: z.string().optional(),
  backgroundColor: z.string().optional(),
  paddingY: z.coerce.number().optional(),
  paddingX: z.coerce.number().optional(),
});

const rsvpSchema = z.object({
  title: z.string().min(1, "Otsikko on pakollinen"),
  description: z.string().optional(),
  titleFont: z.string().optional(),
  descriptionFont: z.string().optional(),
  backgroundColor: z.string().optional(),
  paddingY: z.coerce.number().optional(),
  paddingX: z.coerce.number().optional(),
});

const gallerySchema = z.object({
  title: z.string().min(1, "Otsikko on pakollinen"),
  description: z.string().optional(),
  images: z.array(z.object({
    url: z.string().optional(),
    caption: z.string().optional(),
  })).optional(),
  backgroundColor: z.string().optional(),
  paddingY: z.coerce.number().optional(),
  paddingX: z.coerce.number().optional(),
});

const dividerSchema = z.object({
  dividerStyle: z.string().optional(),
  color: z.string().optional().nullable(),
  width: z.coerce.number().optional().nullable(),
  paddingY: z.coerce.number().optional().nullable(),
  backgroundColor: z.string().optional().nullable(),
});

const getSchema = (blockType) => {
  switch (blockType) {
    case 'hero': return heroSchema;
    case 'heading': return headingSchema;
    case 'text': return textSchema;
    case 'program': return programSchema;
    case 'countdown': return countdownSchema;
    case 'rsvp': return rsvpSchema;
    case 'gallery': return gallerySchema;
    case 'divider': return dividerSchema;
    default: return z.object({});
  }
};

// Tabbed editor for blocks with multiple configuration options
export default function TabbedBlockEditor({ block, open, onOpenChange, onSave, theme, currentTemplate }) {
  const [activeTab, setActiveTab] = useState("sisalto");
  const [previewImage, setPreviewImage] = useState(null);

  // Reset activeTab when dialog opens
  useEffect(() => {
    if (open) {
      setActiveTab("sisalto");
    }
  }, [open]);

  const schema = getSchema(block?.type);
  const form = useForm({
    resolver: zodResolver(schema),
    defaultValues: block?.data || {},
  });

  // Reset form when block changes
  useEffect(() => {
    if (block) {
      form.reset(block.data);
      setPreviewImage(null);
      // Set initial tab based on block type
      setActiveTab('sisalto');
    }
  }, [block, form]);

  const handleImageUpload = (e, field) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        form.setValue(field, reader.result);
        setPreviewImage(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const onSubmit = (data) => {
    console.log('Form submitted:', data);
    onSave(data);
    onOpenChange(false);
  };

  const onError = (errors) => {
    console.error('Form validation errors:', errors);
  };

  if (!block) return null;

  // Get block type label for title
  const getBlockTypeLabel = (type) => {
    const labels = {
      hero: 'Hero-lohko',
      heading: 'Otsikko-lohko',
      countdown: 'Countdown-lohko',
      program: 'Ohjelma-lohko',
      rsvp: 'RSVP-lohko',
      gallery: 'Galleria-lohko',
      text: 'Teksti-lohko',
      divider: 'Erotin-lohko'
    };
    return labels[type] || 'Lohko';
  };

  // Get main tab label (for content fields)
  const getMainTabLabel = (type) => {
    const labels = {
      hero: 'Hero',
      heading: 'Otsikko',
      countdown: 'Countdown',
      program: 'Tapahtumat',
      rsvp: 'RSVP',
      gallery: 'Kuvat',
      text: 'Teksti',
      divider: 'Vaihtoehdot'
    };
    return labels[type] || 'Sisältö';
  };

  // Check if this block type has template defaults applied
  const hasTemplateDefaults = currentTemplate?.blockDefaults?.[block?.type];

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="!max-w-5xl !w-full flex flex-col">
        <DialogHeader>
          <DialogTitle>Muokkaa {getBlockTypeLabel(block.type)}</DialogTitle>
        </DialogHeader>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit, onError)} className="flex-1 flex flex-col overflow-hidden">
            {/* Tabs */}
            <Tabs value={activeTab} onValueChange={setActiveTab} className="flex-1 flex flex-col">
              <TabsList className="bg-transparent justify-start  shadow-none border-0 mb-4 h-12 !py-0">
                {/* Main content tab */}
                <TabsTrigger value="sisalto" className="text-base font-medium px-6 h-9 !bg-transparent !flex-initial !w-auto">
                  {getMainTabLabel(block.type)}
                </TabsTrigger>

                {/* Teema tab - style variations (only for blocks that have them) */}
                {(['hero', 'program'].includes(block.type)) && (
                  <TabsTrigger value="teema" className="text-base font-medium px-6 h-9 !bg-transparent !flex-initial !w-auto">Teema</TabsTrigger>
                )}

                {/* Tyyli tab - CSS settings */}
                <TabsTrigger value="tyyli" className="text-base font-medium px-6 h-9 !bg-transparent !flex-initial !w-auto">Tyyli</TabsTrigger>
              </TabsList>

              {/* Sisalto Tab - Main content for divider */}
              {block.type === 'divider' && (
                <TabsContent value="sisalto" className="flex-1 overflow-y-auto space-y-4">
                  <div>
                    <Label className="mb-4 block text-lg font-semibold">Valitse Erotin</Label>
                    <div className="grid grid-cols-2 gap-4">
                      {['1', '2', '3', '4'].map((style) => (
                        <FormField
                          key={style}
                          control={form.control}
                          name="dividerStyle"
                          render={({ field }) => (
                            <div
                              onClick={() => field.onChange(style)}
                              style={{
                                backgroundColor: form.watch('backgroundColor') || 'transparent'
                              }}
                              className={`cursor-pointer border-2 rounded-lg p-6 transition-all ${field.value === style ? 'border-pink-500 shadow-lg' : 'border-gray-200 hover:border-pink-300'
                                }`}
                            >
                              <img
                                src={`/editor/dividers/${style}.svg`}
                                alt={`Divider ${style}`}
                                className="w-full h-16 object-contain"
                                style={{
                                  filter: form.watch('color') ? getSVGColorFilter(form.watch('color')) : 'none'
                                }}
                              />
                              {/* <p className="text-sm text-center mt-3 font-medium text-gray-700">
                                {field.value === style && '✓ '}Tyyli {style}
                              </p> */}
                            </div>
                          )}
                        />
                      ))}
                    </div>
                  </div>
                </TabsContent>
              )}

              {/* Sisalto Tab - Main content fields */}
              <TabsContent value="sisalto" className="flex-1 overflow-y-auto space-y-4">
                {block.type === 'hero' && (
                  <div className="space-y-4">
                    <FormField
                      control={form.control}
                      name="title"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Otsikko</FormLabel>
                          <FormControl>
                            <Input {...field} placeholder="Anna & Mikael" />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="subtitle"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Alaotsikko</FormLabel>
                          <FormControl>
                            <Input {...field} placeholder="Suomenlinna, Helsinki" />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <div className="grid grid-cols-2 gap-4">
                      <FormField
                        control={form.control}
                        name="date"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Päivämäärä</FormLabel>
                            <FormControl>
                              <Input {...field} placeholder="15.07.2024" />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      <FormField
                        control={form.control}
                        name="location"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Paikka</FormLabel>
                            <FormControl>
                              <Input {...field} placeholder="Helsinki" />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>

                    {/* Font Selection */}
                    <div className="grid grid-cols-2 gap-4 pt-4 border-t">
                      <FormField
                        control={form.control}
                        name="titleFont"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel className="text-xs">Otsikon fontti</FormLabel>
                            <FormControl>
                              <FontSelector
                                value={field.value}
                                onChange={field.onChange}
                                placeholder="Valitse fontti"
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      <FormField
                        control={form.control}
                        name="subtitleFont"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel className="text-xs">Alaotsikon fontti</FormLabel>
                            <FormControl>
                              <FontSelector
                                value={field.value}
                                onChange={field.onChange}
                                placeholder="Valitse fontti"
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>

                    {/* Text Color Selection */}
                    <div className="grid grid-cols-2 gap-4 pt-4 border-t">
                      <FormField
                        control={form.control}
                        name="titleColor"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel className="text-xs">Otsikon väri</FormLabel>
                            <FormControl>
                              <ColorPicker
                                color={field.value || '#ffffff'}
                                onChange={field.onChange}
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      <FormField
                        control={form.control}
                        name="subtitleColor"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel className="text-xs">Alaotsikon väri</FormLabel>
                            <FormControl>
                              <ColorPicker
                                color={field.value || '#ffffff'}
                                onChange={field.onChange}
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>
                  </div>
                )}

                {block.type === 'heading' && (
                  <div className="space-y-4">
                    {/* Live Preview Heading */}
                    <div
                      style={{
                        backgroundColor: form.watch('backgroundColor') || '#e8dff5',
                        paddingTop: `${form.watch('paddingY') || 40}px`,
                        paddingBottom: `${form.watch('paddingY') || 40}px`,
                        paddingLeft: `${form.watch('paddingX') || 24}px`,
                        paddingRight: `${form.watch('paddingX') || 24}px`,
                      }}
                      className="rounded-lg border-2 border-gray-300 overflow-hidden"
                    >
                      <div className={`text-${form.watch('alignment') || 'center'}`}>
                        <input
                          type="text"
                          value={form.watch('text') || ''}
                          onChange={(e) => form.setValue('text', e.target.value)}
                          placeholder="Kirjoita otsikko..."
                          className={`${form.watch('level') === 'h1' ? 'text-5xl md:text-7xl' :
                              form.watch('level') === 'h2' ? 'text-4xl md:text-5xl' :
                                form.watch('level') === 'h3' ? 'text-3xl md:text-4xl' :
                                  'text-2xl md:text-3xl'
                            } ${form.watch('font') ? getFontClass(form.watch('font')) : 'font-serif'} 
                        w-full bg-transparent border-0 outline-none focus:ring-0 
                        placeholder:text-gray-400 placeholder:opacity-50 px-2`}
                          style={{
                            color: form.watch('color') || '#6b5b7b',
                            fontFamily: form.watch('font') ? getFontByValue(form.watch('font')).label : undefined,
                            textAlign: form.watch('alignment') || 'center'
                          }}
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <FormField
                        control={form.control}
                        name="level"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Taso</FormLabel>
                            <Select onValueChange={field.onChange} value={field.value}>
                              <FormControl>
                                <SelectTrigger>
                                  <SelectValue placeholder="Valitse taso" />
                                </SelectTrigger>
                              </FormControl>
                              <SelectContent>
                                <SelectItem value="h1">H1 - Suurin</SelectItem>
                                <SelectItem value="h2">H2 - Suuri</SelectItem>
                                <SelectItem value="h3">H3 - Keskikoko</SelectItem>
                                <SelectItem value="h4">H4 - Pieni</SelectItem>
                              </SelectContent>
                            </Select>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      <FormField
                        control={form.control}
                        name="alignment"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Tasaus</FormLabel>
                            <Select onValueChange={field.onChange} value={field.value}>
                              <FormControl>
                                <SelectTrigger>
                                  <SelectValue placeholder="Valitse tasaus" />
                                </SelectTrigger>
                              </FormControl>
                              <SelectContent>
                                <SelectItem value="left">Vasen</SelectItem>
                                <SelectItem value="center">Keskitetty</SelectItem>
                                <SelectItem value="right">Oikea</SelectItem>
                              </SelectContent>
                            </Select>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <FormField
                        control={form.control}
                        name="color"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Väri</FormLabel>
                            <FormControl>
                              <ColorPicker
                                value={field.value || theme.colors.primary}
                                onChange={field.onChange}
                                placeholder={theme.colors.primary}
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      <FormField
                        control={form.control}
                        name="font"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Fontti</FormLabel>
                            <FormControl>
                              <FontSelector
                                value={field.value}
                                onChange={field.onChange}
                                placeholder="Valitse fontti"
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>
                  </div>
                )}

                {block.type === 'text' && (
                  <div className="space-y-4">
                    <FormField
                      control={form.control}
                      name="content"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Sisältö</FormLabel>
                          <FormControl>
                            <RichTextEditor
                              content={field.value || ""}
                              onChange={field.onChange}
                              textColor={form.watch('contentColor') || '#374151'}
                              textFont={form.watch('contentFont') || undefined}
                              backgroundColor={form.watch('backgroundColor') || '#ffffff'}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <div className="grid grid-cols-2 gap-4">
                      <FormField
                        control={form.control}
                        name="contentColor"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Tekstin väri</FormLabel>
                            <FormControl>
                              <ColorPicker
                                value={field.value || '#374151'}
                                onChange={field.onChange}
                                placeholder="#374151"
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      <FormField
                        control={form.control}
                        name="contentFont"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Sisällön fontti</FormLabel>
                            <FormControl>
                              <FontSelector
                                value={field.value}
                                onChange={field.onChange}
                                placeholder="Valitse fontti"
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>
                  </div>
                )}

                {block.type === 'program' && (
                  <div className="space-y-4">
                    <FormField
                      control={form.control}
                      name="title"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Otsikko</FormLabel>
                          <FormControl>
                            <Input {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="description"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Kuvaus</FormLabel>
                          <FormControl>
                            <Textarea {...field} rows={2} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <div>
                      <div className="flex items-center justify-between mb-2">
                        <Label>Tapahtumat</Label>
                        <Button
                          type="button"
                          size="sm"
                          variant="outline"
                          onClick={() => {
                            const currentEvents = form.watch('events') || [];
                            form.setValue('events', [...currentEvents, { time: "", title: "", description: "", location: "" }]);
                          }}
                        >
                          + Lisää tapahtuma
                        </Button>
                      </div>

                      <div className="space-y-3 max-h-96 overflow-y-auto">
                        {(form.watch('events') || []).map((event, index) => (
                          <div key={index} className="p-3 border rounded-lg space-y-2 bg-gray-50">
                            <div className="grid grid-cols-3 gap-2">
                              <FormField
                                control={form.control}
                                name={`events.${index}.time`}
                                render={({ field }) => (
                                  <FormItem>
                                    <FormLabel className="text-xs">Aika</FormLabel>
                                    <FormControl>
                                      <Input {...field} placeholder="15:00" className="text-sm" />
                                    </FormControl>
                                    <FormMessage />
                                  </FormItem>
                                )}
                              />

                              <div className="col-span-2">
                                <FormField
                                  control={form.control}
                                  name={`events.${index}.title`}
                                  render={({ field }) => (
                                    <FormItem>
                                      <FormLabel className="text-xs">Otsikko</FormLabel>
                                      <FormControl>
                                        <Input {...field} placeholder="Vihkiminen" className="text-sm" />
                                      </FormControl>
                                      <FormMessage />
                                    </FormItem>
                                  )}
                                />
                              </div>
                            </div>

                            <FormField
                              control={form.control}
                              name={`events.${index}.description`}
                              render={({ field }) => (
                                <FormItem>
                                  <FormLabel className="text-xs">Kuvaus</FormLabel>
                                  <FormControl>
                                    <Input {...field} placeholder="Kirkossa pidettävä vihkiseremonia" className="text-sm" />
                                  </FormControl>
                                  <FormMessage />
                                </FormItem>
                              )}
                            />

                            <div className="flex items-center gap-2">
                              <div className="flex-1">
                                <FormField
                                  control={form.control}
                                  name={`events.${index}.location`}
                                  render={({ field }) => (
                                    <FormItem>
                                      <FormLabel className="text-xs">Paikka</FormLabel>
                                      <FormControl>
                                        <Input {...field} placeholder="Tuomiokirkko" className="text-sm" />
                                      </FormControl>
                                      <FormMessage />
                                    </FormItem>
                                  )}
                                />
                              </div>
                              <Button
                                type="button"
                                size="sm"
                                variant="ghost"
                                className="text-red-600 mt-5"
                                onClick={() => {
                                  const currentEvents = form.watch('events').filter((_, i) => i !== index);
                                  form.setValue('events', currentEvents);
                                }}
                              >
                                Poista
                              </Button>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                )}

                {(block.type === 'countdown' || block.type === 'rsvp' || block.type === 'gallery') && (
                  <div className="space-y-4">
                    <FormField
                      control={form.control}
                      name="title"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Otsikko</FormLabel>
                          <FormControl>
                            <Input {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="description"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Kuvaus</FormLabel>
                          <FormControl>
                            <Textarea {...field} rows={3} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    {block.type === 'countdown' && (
                      <FormField
                        control={form.control}
                        name="targetDate"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Kohde päivämäärä</FormLabel>
                            <FormControl>
                              <Input {...field} type="datetime-local" />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    )}

                    {/* Gallery images management */}
                    {block.type === 'gallery' && (
                      <div>
                        <div className="flex items-center justify-between mb-2">
                          <Label>Kuvat</Label>
                          <Button
                            type="button"
                            size="sm"
                            variant="outline"
                            onClick={() => {
                              const currentImages = form.watch('images') || [];
                              form.setValue('images', [...currentImages, { url: "", caption: "" }]);
                            }}
                          >
                            + Lisää kuva
                          </Button>
                        </div>

                        <div className="space-y-3 max-h-96 overflow-y-auto">
                          {(form.watch('images') || []).map((image, index) => (
                            <div key={index} className="p-3 border rounded-lg space-y-2 bg-gray-50">
                              <div className="flex items-start gap-2">
                                <div className="flex-1 space-y-2">
                                  {/* Image URL or Upload */}
                                  <FormField
                                    control={form.control}
                                    name={`images.${index}.url`}
                                    render={({ field }) => (
                                      <FormItem>
                                        <FormLabel className="text-xs">Kuvan URL</FormLabel>
                                        <FormControl>
                                          <div className="space-y-2">
                                            <Input 
                                              {...field} 
                                              placeholder="https://..." 
                                              className="text-sm" 
                                            />
                                            <div className="text-xs text-gray-500">tai</div>
                                            <div>
                                              <input
                                                type="file"
                                                accept="image/*"
                                                onChange={(e) => {
                                                  const file = e.target.files?.[0];
                                                  if (file) {
                                                    const reader = new FileReader();
                                                    reader.onloadend = () => {
                                                      form.setValue(`images.${index}.url`, reader.result);
                                                    };
                                                    reader.readAsDataURL(file);
                                                  }
                                                }}
                                                className="hidden"
                                                id={`image-upload-${index}`}
                                              />
                                              <label
                                                htmlFor={`image-upload-${index}`}
                                                className="cursor-pointer inline-flex items-center gap-2 px-3 py-2 text-sm border border-gray-300 rounded-md hover:bg-gray-100"
                                              >
                                                <ImageIcon className="w-4 h-4" />
                                                Lataa kuva
                                              </label>
                                            </div>
                                          </div>
                                        </FormControl>
                                        <FormMessage />
                                      </FormItem>
                                    )}
                                  />

                                  {/* Image Caption */}
                                  <FormField
                                    control={form.control}
                                    name={`images.${index}.caption`}
                                    render={({ field }) => (
                                      <FormItem>
                                        <FormLabel className="text-xs">Kuvateksti (valinnainen)</FormLabel>
                                        <FormControl>
                                          <Input {...field} placeholder="Kuvan kuvaus..." className="text-sm" />
                                        </FormControl>
                                        <FormMessage />
                                      </FormItem>
                                    )}
                                  />
                                </div>

                                <Button
                                  type="button"
                                  size="sm"
                                  variant="ghost"
                                  className="text-red-600 mt-5"
                                  onClick={() => {
                                    const currentImages = form.watch('images').filter((_, i) => i !== index);
                                    form.setValue('images', currentImages);
                                  }}
                                >
                                  Poista
                                </Button>
                              </div>

                              {/* Image Preview */}
                              {form.watch(`images.${index}.url`) && (
                                <div className="mt-2">
                                  <img
                                    src={form.watch(`images.${index}.url`)}
                                    alt="Preview"
                                    className="w-full h-32 object-cover rounded-lg"
                                  />
                                </div>
                              )}
                            </div>
                          ))}
                        </div>

                        {(!form.watch('images') || form.watch('images').length === 0) && (
                          <div className="text-center py-8 text-gray-400 text-sm border-2 border-dashed rounded-lg">
                            Ei vielä kuvia. Klikkaa "+ Lisää kuva" lisätäksesi.
                          </div>
                        )}
                      </div>
                    )}
                  </div>
                )}

                {block.type === 'divider' && (
                  <div className="space-y-4">
                    <FormField
                      control={form.control}
                      name="backgroundColor"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Taustaväri</FormLabel>
                          <FormControl>
                            <ColorPicker
                              value={field.value || ''}
                              onChange={field.onChange}
                              placeholder="Valitse taustaväri"
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="color"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Erottimen väri (valinnainen)</FormLabel>
                          <FormControl>
                            <ColorPicker
                              value={field.value || ''}
                              onChange={field.onChange}
                              placeholder="Valitse väri"
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="width"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Leveys (%)</FormLabel>
                          <FormControl>
                            <Input
                              type="number"
                              {...field}
                              min="20"
                              max="100"
                              placeholder="80"
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="paddingY"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Väli ylhäältä ja alta (px)</FormLabel>
                          <FormControl>
                            <Input
                              type="number"
                              {...field}
                              min="0"
                              max="200"
                              placeholder="40"
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                )}
              </TabsContent>

              {/* Tyyli Tab - CSS and styling settings */}
              <TabsContent value="tyyli" className="flex-1 overflow-y-auto space-y-4">
                {/* LIVE Preview for divider block */}
                {block.type === 'divider' && (
                  <div className="min-h-[120px] flex items-center mb-4">
                    <div
                      style={{
                        backgroundColor: form.watch('backgroundColor') || 'transparent',
                        paddingTop: `${form.watch('paddingY') || 40}px`,
                        paddingBottom: `${form.watch('paddingY') || 40}px`,
                        width: '100%'
                      }}
                      className="rounded-lg flex-1 border-2 border-gray-300 overflow-hidden flex items-center justify-center"
                    >
                      <div style={{ width: `${form.watch('width') || 80}%`, maxWidth: '600px' }}>
                        <img
                          src={`/editor/dividers/${form.watch('dividerStyle') || '1'}.svg`}
                          alt="Divider Preview"
                          className="w-full h-auto"
                          style={{
                            filter: form.watch('color') ? getSVGColorFilter(form.watch('color')) : 'none'
                          }}
                        />
                      </div>
                    </div>
                  </div>
                )}

                {/* LIVE Preview for heading block */}
                {block.type === 'heading' && (
                  <div className="min-h-[170px] flex items-center">
                    <div
                      style={{
                        backgroundColor: form.watch('backgroundColor') || '#e8dff5',
                        backgroundImage: form.watch('backgroundImage') ? `url(${form.watch('backgroundImage')})` : 'none',
                        backgroundSize: 'cover',
                        backgroundPosition: 'center',
                        paddingTop: `${form.watch('paddingY') || 40}px`,
                        paddingBottom: `${form.watch('paddingY') || 40}px`,
                        paddingLeft: `${form.watch('paddingX') || 24}px`,
                        paddingRight: `${form.watch('paddingX') || 24}px`,
                      }}
                      className="rounded-lg flex-1 border-2 border-gray-300 overflow-hidden mb-4"
                    >
                      <div className={`text-${form.watch('alignment') || 'center'}`}>
                        <div
                          className={`${form.watch('level') === 'h1' ? 'text-5xl md:text-7xl' :
                              form.watch('level') === 'h2' ? 'text-4xl md:text-5xl' :
                                form.watch('level') === 'h3' ? 'text-3xl md:text-4xl' :
                                  'text-2xl md:text-3xl'
                            } ${form.watch('font') ? getFontClass(form.watch('font')) : 'font-serif'}`}
                          style={{
                            color: form.watch('color') || '#6b5b7b',
                            fontFamily: form.watch('font') ? getFontByValue(form.watch('font')).label : undefined,
                            textAlign: form.watch('alignment') || 'center'
                          }}
                        >
                          {form.watch('text') || 'Otsikko'}
                        </div>
                      </div>
                    </div>
                  </div>

                )}

                {/* LIVE Preview for text block */}
                {block.type === 'text' && (
                  <div className="min-h-[250px] flex items-center">
                    <div
                      style={{
                        backgroundColor: form.watch('backgroundColor') || '#ffffff',
                        backgroundImage: form.watch('backgroundImage') ? `url(${form.watch('backgroundImage')})` : 'none',
                        backgroundSize: 'cover',
                        backgroundPosition: 'center',
                        paddingTop: `${form.watch('paddingY') || 80}px`,
                        paddingBottom: `${form.watch('paddingY') || 80}px`,
                        paddingLeft: `${form.watch('paddingX') || 24}px`,
                        paddingRight: `${form.watch('paddingX') || 24}px`,
                      }}
                      className="rounded-lg flex-1 border-2 border-gray-300 overflow-hidden mb-4"
                    >
                      <div 
                        className="prose max-w-none"
                        style={{
                          color: form.watch('contentColor') || '#374151',
                          fontFamily: form.watch('contentFont') ? getFontByValue(form.watch('contentFont')).label : undefined,
                          textAlign: form.watch('alignment') || 'left'
                        }}
                        dangerouslySetInnerHTML={{ __html: form.watch('content') || '<p>Kirjoita tekstiä...</p>' }}
                      />
                    </div>
                  </div>
                )}

                <div>
                  <Label className="mb-3 block">Taustakuva</Label>

                  {/* Image upload area - compact for heading and text */}
                  <div className={`border-2 border-dashed border-gray-300 rounded-lg text-center hover:border-pink-400 transition-colors ${(block.type === 'heading' || block.type === 'text') ? 'p-4' : 'p-8'
                    }`}>
                    <input
                      type="file"
                      accept="image/*"
                      onChange={(e) => handleImageUpload(e, 'backgroundImage')}
                      className="hidden"
                      id="background-upload"
                    />

                    {form.watch('backgroundImage') || previewImage ? (
                      <div className="space-y-2">
                        <div
                          className={(block.type === 'heading' || block.type === 'text') ? 'w-full h-24 bg-cover bg-center rounded-lg' : 'w-full h-48 bg-cover bg-center rounded-lg'}
                          style={{ backgroundImage: `url(${form.watch('backgroundImage') || previewImage})` }}
                        />
                        <Button
                          type="button"
                          variant="outline"
                          size="sm"
                          onClick={() => {
                            form.setValue('backgroundImage', '');
                            setPreviewImage(null);
                          }}
                        >
                          Poista kuva
                        </Button>
                      </div>
                    ) : (
                      <label htmlFor="background-upload" className="cursor-pointer block">
                        <ImageIcon className={(block.type === 'heading' || block.type === 'text') ? 'w-8 h-8 mx-auto mb-2 text-gray-400' : 'w-12 h-12 mx-auto mb-3 text-gray-400'} />
                        <p className={(block.type === 'heading' || block.type === 'text') ? 'text-xs text-gray-600' : 'text-sm text-gray-600 mb-1'}>
                          Klikkaa ladataksesi kuvan
                        </p>
                        {block.type !== 'heading' && block.type !== 'text' && (
                          <p className="text-xs text-gray-400">
                            PNG, JPG, WEBP (max 5MB)
                          </p>
                        )}
                      </label>
                    )}
                  </div>
                </div>

                {/* Background color */}
                <FormField
                  control={form.control}
                  name="backgroundColor"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Taustaväri (jos ei kuvaa)</FormLabel>
                      <FormControl>
                        <ColorPicker
                          value={field.value || theme.colors.primary}
                          onChange={field.onChange}
                          placeholder={theme.colors.primary}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                {/* Padding/Spacing */}
                <div>
                  <Label>Väli (px)</Label>
                  <div className="grid grid-cols-2 gap-3 mt-2">
                    <FormField
                      control={form.control}
                      name="paddingY"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="text-xs text-gray-500">Väli pysty</FormLabel>
                          <FormControl>
                            <Input
                              type="number"
                              {...field}
                              value={field.value || 80}
                              min="0"
                              max="200"
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="paddingX"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="text-xs text-gray-500">Väli vaaka</FormLabel>
                          <FormControl>
                            <Input
                              type="number"
                              {...field}
                              value={field.value || 16}
                              min="0"
                              max="100"
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                </div>
              </TabsContent>

              {/* Teema Tab - Style variant selector */}
              <TabsContent value="teema" className="flex-1 overflow-y-auto">
                <div className="space-y-4">
                  {/* Hero style variants */}
                  {block.type === 'hero' && (
                    <FormField
                      control={form.control}
                      name="styleVariant"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="text-lg font-semibold">Valitse Hero Teema</FormLabel>
                          <FormControl>
                            <div className="grid grid-cols-2 gap-4 mt-4">
                              {[
                                { value: 'fullscreen', label: 'Fullscreen', desc: 'Koko ruudun hero kuvan kanssa' },
                                { value: 'centered', label: 'Centered', desc: 'Keskitetty pienemmällä korkeudella' },
                                { value: 'split', label: 'Split', desc: 'Jaettu: kuva & tekstisisältö' },
                                { value: 'minimal', label: 'Minimal', desc: 'Minimalistinen tekstillä' }
                              ].map((style) => (
                                <div
                                  key={style.value}
                                  onClick={() => field.onChange(style.value)}
                                  className={`
                                p-4 border-2 rounded-lg cursor-pointer transition-all
                                ${field.value === style.value
                                      ? 'border-pink-500 bg-pink-50'
                                      : 'border-gray-200 hover:border-pink-300 hover:bg-gray-50'}
                              `}
                                >
                                  <h4 className="font-semibold text-base mb-1">{style.label}</h4>
                                  <p className="text-sm text-gray-600">{style.desc}</p>
                                </div>
                              ))}
                            </div>
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  )}

                  {/* Program style variants */}
                  {block.type === 'program' && (
                    <FormField
                      control={form.control}
                      name="styleVariant"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="text-lg font-semibold">Valitse Ohjelma Teema</FormLabel>
                          <FormControl>
                            <div className="grid grid-cols-2 gap-4 mt-4">
                              {[
                                { value: 'classic', label: 'Classic', desc: 'Kortit pyöreillä aikamerkeillä' },
                                { value: 'timeline', label: 'Timeline', desc: 'Aikajana pystysuuntaisella viivalla' },
                                { value: 'cards', label: 'Cards', desc: 'Yksinkertaiset kortit gridissä' },
                                { value: 'minimal', label: 'Minimal', desc: 'Minimalistinen lista' }
                              ].map((style) => (
                                <div
                                  key={style.value}
                                  onClick={() => field.onChange(style.value)}
                                  className={`
                                p-4 border-2 rounded-lg cursor-pointer transition-all
                                ${field.value === style.value
                                      ? 'border-pink-500 bg-pink-50'
                                      : 'border-gray-200 hover:border-pink-300 hover:bg-gray-50'}
                              `}
                                >
                                  <h4 className="font-semibold text-base mb-1">{style.label}</h4>
                                  <p className="text-sm text-gray-600">{style.desc}</p>
                                </div>
                              ))}
                            </div>
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  )}

                  {/* Other blocks - show info */}
                  {block.type !== 'hero' && block.type !== 'program' && block.type !== 'divider' && (
                    <div className="p-4 bg-gray-50 rounded-lg">
                      <p className="text-sm text-gray-600">
                        Tyylivaihtoehdot tulevat pian tälle lohkolle.
                      </p>
                    </div>
                  )}

                  {/* Divider blocks use Vaihtoehdot tab instead */}
                  {block.type === 'divider' && (
                    <div className="p-4 bg-blue-50 rounded-lg">
                      <p className="text-sm text-blue-800">
                        💡 Käytä "Vaihtoehdot" välilehteä valitaksesi erottimen tyylin.
                      </p>
                    </div>
                  )}
                </div>
              </TabsContent>

            </Tabs>

            {/* Footer buttons */}
            <div className="flex items-center justify-between pt-4 border-t mt-4">
              <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
                Peruuta
              </Button>
              <Button
                type="submit"
                className="bg-gradient-to-r from-pink-500 to-purple-600 hover:from-pink-600 hover:to-purple-700"
              >
                Tallenna
              </Button>
            </div>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
