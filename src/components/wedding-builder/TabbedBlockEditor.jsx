"use client";

import { useState, useEffect, useRef } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Image as ImageIcon, AlignLeft, AlignCenter, AlignRight } from "lucide-react";
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
import SpacerBlock from "./blocks/SpacerBlock";
import NavigationBlock from "./blocks/NavigationBlock";

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
  font: z.string().optional(),
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
  title: z.string().optional(),
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
  targetDate: z.string().optional(),
  backgroundColor: z.string().optional(),
  paddingY: z.coerce.number().optional(),
  paddingX: z.coerce.number().optional(),
  styleVariant: z.string().optional(),
});

const rsvpSchema = z.object({
  backgroundColor: z.string().optional(),
  paddingY: z.coerce.number().optional(),
  paddingX: z.coerce.number().optional(),
  styleVariant: z.string().optional(),
});

const gallerySchema = z.object({
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

const spacerSchema = z.object({
  height: z.coerce.number().optional(),
  backgroundColor: z.string().optional(),
});

const navigationSchema = z.object({
  items: z.array(z.object({
    label: z.string(),
    id: z.string()
  })).optional(),
  styleVariant: z.string().optional(),
  backgroundColor: z.string().optional(),
  textColor: z.string().optional(),
  accentColor: z.string().optional(),
  paddingY: z.coerce.number().optional(),
  paddingX: z.coerce.number().optional(),
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
    case 'spacer': return spacerSchema;
    case 'navigation': return navigationSchema;
    default: return z.object({});
  }
};

// Tabbed editor for blocks with multiple configuration options
export default function TabbedBlockEditor({ block, open, onOpenChange, onSave, onUpdate, theme, currentTemplate, inline = false, onCancel, onDirtyChange }) {
  const [activeTab, setActiveTab] = useState("sisalto");
  const [previewImage, setPreviewImage] = useState(null);
  const initialDataRef = useRef(null);
  const didInitWatchRef = useRef(false);

  // Reset activeTab when dialog opens
  useEffect(() => {
    if (!inline && open) {
      setActiveTab("sisalto");
    }
  }, [open, inline]);

  const schema = getSchema(block?.type);
  const form = useForm({
    resolver: zodResolver(schema),
    defaultValues: block?.data || {},
  });

  // Reset form only when block identity changes (avoid resets on live onUpdate re-renders)
  useEffect(() => {
    if (block) {
      form.reset(block.data);
      setPreviewImage(null);
      setActiveTab(block.type === 'divider' || block.type === 'spacer' ? 'teema' : 'sisalto');
      initialDataRef.current = JSON.parse(JSON.stringify(block.data || {}));
      didInitWatchRef.current = false;
      if (onDirtyChange) onDirtyChange(false);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [block?.id]);

  // Live preview: propagate form changes
  useEffect(() => {
    if (!onUpdate) return;
    const sub = form.watch((v) => onUpdate(v));
    return () => sub.unsubscribe();
  }, [form, onUpdate]);

  // Dirty flag propagation with deep compare
  useEffect(() => {
    if (!onDirtyChange) return;
    const sub = form.watch(() => {
      const current = form.getValues();
      const initial = initialDataRef.current || {};
      // Skip the very first emission that can happen after reset
      if (!didInitWatchRef.current) {
        didInitWatchRef.current = true;
        onDirtyChange(false);
        return;
      }
      const isDirty = JSON.stringify(current) !== JSON.stringify(initial);
      onDirtyChange(isDirty);
    });
    return () => sub.unsubscribe();
  }, [form, onDirtyChange]);

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
    if (!inline && onOpenChange) onOpenChange(false);
    if (inline && onCancel) onCancel();
    if (onDirtyChange) onDirtyChange(false);
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

  const Body = (
    <>
      {inline ? (
        <div className="mb-3">
          <h3 className="text-lg font-semibold">Muokkaa {getBlockTypeLabel(block.type)}</h3>
        </div>
      ) : (
        <DialogHeader>
          <DialogTitle>Muokkaa {getBlockTypeLabel(block.type)}</DialogTitle>
        </DialogHeader>
      )}

      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit, onError)} className="flex-1 flex flex-col overflow-hidden">
          {/* Tabs */}
          <Tabs value={activeTab} onValueChange={setActiveTab} className="flex-1 flex flex-col">
            <TabsList className="bg-transparent justify-start  shadow-none border-0 mb-4 h-12 !py-0">
              {block.type !== 'divider' && block.type !== 'spacer' && (
                <TabsTrigger value="sisalto" className="text-base font-medium px-6 h-9 !bg-transparent !flex-initial !w-auto">
                  {getMainTabLabel(block.type)}
                </TabsTrigger>
              )}

              {block.type === 'spacer' && (
                <TabsTrigger value="sisalto" className="text-base font-medium px-6 h-9 !bg-transparent !flex-initial !w-auto">
                  Sisältö
                </TabsTrigger>
              )}

              {/* Teema tab - visible for divider and spacer only */}
              {(block.type === 'divider' || block.type === 'spacer') && (
                <TabsTrigger value="teema" className="text-base font-medium px-6 h-9 !bg-transparent !flex-initial !w-auto">Teema</TabsTrigger>
              )}

              {block.type !== 'divider' && block.type !== 'spacer' && (
                <>
                  <TabsTrigger value="teema" className="text-base font-medium px-6 h-9 !bg-transparent !flex-initial !w-auto">Teema</TabsTrigger>
                  <TabsTrigger value="tyyli" className="text-base font-medium px-6 h-9 !bg-transparent !flex-initial !w-auto">Tyyli</TabsTrigger>
                </>
              )}
            </TabsList>

              {/* No Sisalto tab for divider */}

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
                    <div className="pt-4 border-t">
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
                    <FormField
                      control={form.control}
                      name="text"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Otsikko</FormLabel>
                          <FormControl>
                            <Input {...field} placeholder="Kirjoita otsikko..." />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

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
                              <SelectContent className="z-[2002]">
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
                            <div className="flex gap-2">
                              <Button
                                type="button"
                                variant={field.value === 'left' ? 'default' : 'outline'}
                                size="sm"
                                onClick={() => field.onChange('left')}
                                className="flex-1"
                              >
                                <AlignLeft className="w-4 h-4" />
                              </Button>
                              <Button
                                type="button"
                                variant={field.value === 'center' ? 'default' : 'outline'}
                                size="sm"
                                onClick={() => field.onChange('center')}
                                className="flex-1"
                              >
                                <AlignCenter className="w-4 h-4" />
                              </Button>
                              <Button
                                type="button"
                                variant={field.value === 'right' ? 'default' : 'outline'}
                                size="sm"
                                onClick={() => field.onChange('right')}
                                className="flex-1"
                              >
                                <AlignRight className="w-4 h-4" />
                              </Button>
                            </div>
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
                              alignment={form.watch('alignment') || 'center'}
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
                          Lisää tapahtuma
                        </Button>
                      </div>

                      <div className="overflow-y-auto grid grid-cols-1  gap-3">
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

                {block.type === 'countdown' && (
                  <div className="space-y-4">
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
                  </div>
                )}

                {block.type === 'gallery' && (
                  <div className="space-y-4">
                    {/* Gallery images management */}
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
                  </div>
                )}

                {block.type === 'spacer' && (
                  <div className="space-y-4">
                    <FormField
                      control={form.control}
                      name="height"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Tyhjän tilan korkeus (px)</FormLabel>
                          <FormControl>
                            <Input type="number" {...field} value={field.value ?? ''} min="0" max="500" />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name="backgroundColor"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Taustaväri</FormLabel>
                          <FormControl>
                            <ColorPicker value={field.value} onChange={field.onChange} placeholder="Valitse väri" />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                )}

                {block.type === 'navigation' && (
                  <div className="space-y-4">
                    <div>
                      <div className="flex items-center justify-between mb-2">
                        <Label>Navigaation kohteet</Label>
                        <Button
                          type="button"
                          size="sm"
                          variant="outline"
                          onClick={() => {
                            const currentItems = form.watch('items') || [];
                            form.setValue('items', [...currentItems, { label: 'Uusi kohde', id: `item-${Date.now()}` }]);
                          }}
                        >
                          Lisää kohde
                        </Button>
                      </div>

                      <div className="space-y-2">
                        {(form.watch('items') || []).map((item, index) => (
                          <div key={index} className="flex gap-2">
                            <FormField
                              control={form.control}
                              name={`items.${index}.label`}
                              render={({ field }) => (
                                <FormItem className="flex-1">
                                  <FormControl>
                                    <Input {...field} placeholder="Kohteen nimi" />
                                  </FormControl>
                                  <FormMessage />
                                </FormItem>
                              )}
                            />
                            <FormField
                              control={form.control}
                              name={`items.${index}.id`}
                              render={({ field }) => (
                                <FormItem className="flex-1">
                                  <FormControl>
                                    <Input {...field} placeholder="ID (esim. haainfo)" />
                                  </FormControl>
                                  <FormMessage />
                                </FormItem>
                              )}
                            />
                            <Button
                              type="button"
                              size="sm"
                              variant="ghost"
                              className="text-red-600"
                              onClick={() => {
                                const currentItems = form.watch('items').filter((_, i) => i !== index);
                                form.setValue('items', currentItems);
                              }}
                            >
                              Poista
                            </Button>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                )}

              </TabsContent>

              {/* Tyyli Tab - CSS and styling settings */}
              <TabsContent value="tyyli" className="flex-1 overflow-y-auto space-y-4">
                {block.type === 'divider' ? (
                  <div className="space-y-4">
                    <div className="flex items-center gap-4">
                      <FormField control={form.control} name="color" render={({ field }) => (
                        <FormItem className="flex-1">
                          <FormLabel>Erottimen väri</FormLabel>
                          <FormControl>
                            <ColorPicker value={field.value || ''} onChange={field.onChange} placeholder="Valitse väri" />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )} />
                      <FormField control={form.control} name="width" render={({ field }) => (
                        <FormItem className="flex-1">
                          <FormLabel>Leveys (px)</FormLabel>
                          <Select onValueChange={field.onChange} value={field.value?.toString() || '150'}>
                            <FormControl>
                              <SelectTrigger>
                                <SelectValue placeholder="Valitse leveys" />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent className="z-[2002]">
                              <SelectItem value="150">Hyvin pieni (150px)</SelectItem>
                              <SelectItem value="250">Pieni (250px)</SelectItem>
                              <SelectItem value="350">Keskikokoinen (350px)</SelectItem>
                              <SelectItem value="450">Suuri (450px)</SelectItem>
                              <SelectItem value="550">Erittäin suuri (550px)</SelectItem>
                            </SelectContent>
                          </Select>
                          <FormMessage />
                        </FormItem>
                      )} />
                    </div>
                    <FormField control={form.control} name="paddingY" render={({ field }) => (
                      <FormItem>
                        <FormLabel>Pystysuuntainen väli (px)</FormLabel>
                        <FormControl>
                          <Input {...field} type="number" min="0" max="200" />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )} />
                  </div>
                ) : (
                  <>
                    {/* LIVE Preview for text block */}
                    
                    <div className="flex items-center gap-4">
                      <div className="flex-1">
                        <Label className="mb-3 block">Taustakuva</Label>
                        <div className="border-2 border-dashed border-gray-300 rounded-lg p-2 hover:border-pink-400 transition-colors">
                          <input type="file" accept="image/*" onChange={(e) => handleImageUpload(e, 'backgroundImage')} className="hidden" id="background-upload" />
                          {form.watch('backgroundImage') || previewImage ? (
                            <div className="flex items-center justify-between">
                              <div className="flex items-center gap-3">
                                <ImageIcon className="w-8 h-8 text-pink-500" />
                                <div>
                                  <p className="text-sm font-medium text-gray-900">Kuva ladattu</p>
                                  <p className="text-xs text-gray-500">Taustakuva on asetettu</p>
                                </div>
                              </div>
                              <Button type="button" variant="outline" size="sm" onClick={() => { form.setValue('backgroundImage', ''); setPreviewImage(null); }}>Poista kuva</Button>
                            </div>
                          ) : (
                            <label htmlFor="background-upload" className="cursor-pointer flex gap-2 items-center">
                              <ImageIcon className="w-10 h-10 text-gray-400" strokeWidth={1.25} />
                              <p className="text-sm text-gray-600 font-medium">Klikkaa ladataksesi kuvan</p>
                            </label>
                          )}
                        </div>
                      </div>
                      {block.type !== 'divider' && (
                        <FormField control={form.control} name="backgroundColor" render={({ field }) => (
                          <FormItem className="flex-1">
                            <FormLabel>Taustaväri</FormLabel>
                            <FormControl>
                              <ColorPicker value={field.value || theme.colors.primary} onChange={field.onChange} placeholder={theme.colors.primary} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )} />
                      )}
                    </div>
                    {block.type !== 'divider' && block.type !== 'spacer' && (
                      <div>
                        <Label>Väli (px)</Label>
                        <div className="grid grid-cols-2 gap-3 mt-2">
                          <FormField control={form.control} name="paddingY" render={({ field }) => (
                            <FormItem>
                              <FormLabel className="text-xs text-gray-500">Väli pysty</FormLabel>
                              <FormControl>
                                <Input type="number" {...field} value={field.value || 20} min="0" max="200" />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )} />
                          <FormField control={form.control} name="paddingX" render={({ field }) => (
                            <FormItem>
                              <FormLabel className="text-xs text-gray-500">Väli vaaka</FormLabel>
                              <FormControl>
                                <Input type="number" {...field} value={field.value || 16} min="0" max="100" />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )} />
                        </div>
                      </div>
                    )}
                    {block.type === 'spacer' && (
                      <FormField control={form.control} name="height" render={({ field }) => (
                        <FormItem>
                          <FormLabel>Tyhjän tilan korkeus (px)</FormLabel>
                          <FormControl>
                            <Input type="number" {...field} value={field.value || 40} min="0" max="500" />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )} />
                    )}
                  </>
                )}
              </TabsContent>

              {/* Esikatselu Tab - Full preview */}
              <TabsContent value="esikatselu" className="flex-1 overflow-y-auto">
                {block.type === 'hero' && (
                  <div className="space-y-4">
                    <div className="mb-4">
                      <h3 className="text-lg font-semibold mb-2">Esikatselu</h3>
                      <p className="text-sm text-gray-600">Näin hero-lohko näyttää sivullasi</p>
                    </div>
                    
                    {/* Live preview of the hero block */}
                    <div className="border-2 border-gray-300 rounded-lg overflow-hidden bg-white shadow-lg">
                      <HeroBlock 
                        data={{
                          title: form.watch('title') || 'Anna & Mikael',
                          subtitle: form.watch('subtitle') || '',
                          date: form.watch('date') || '',
                          location: form.watch('location') || '',
                          backgroundImage: form.watch('backgroundImage') || null,
                          backgroundColor: form.watch('backgroundColor') || null,
                          titleFont: form.watch('font') || null,
                          subtitleFont: form.watch('font') || null,
                          titleColor: form.watch('titleColor') || '#ffffff',
                          subtitleColor: form.watch('subtitleColor') || '#ffffff',
                          styleVariant: form.watch('styleVariant') || 'fullscreen',
                          overlay: true,
                          overlayOpacity: 0.4
                        }}
                        theme={theme}
                        animated={false}
                      />
                    </div>

                    <div className="mt-4 p-4 bg-blue-50 rounded-lg">
                      <p className="text-sm text-blue-800">
                        💡 <strong>Vinkki:</strong> Muutokset näkyvät esikatselussa reaaliajassa. 
                        Vaihda välilehtiä muokataksesi sisältöä, teemaa tai tyyliä.
                      </p>
                    </div>
                  </div>
                )}

                {block.type === 'spacer' && (
                  <div className="space-y-4">
                    <div className="mb-4">
                      <h3 className="text-lg font-semibold mb-2">Esikatselu</h3>
                      <p className="text-sm text-gray-600">Näin tyhjä tila näyttää sivullasi</p>
                    </div>
                    
                    {/* Live preview of the spacer block */}
                    <div className="border-2 border-gray-300 rounded-lg overflow-hidden bg-white shadow-lg">
                      <SpacerBlock 
                        data={{
                          height: form.watch('height') || 40,
                          backgroundColor: form.watch('backgroundColor') || '#ffffff'
                        }}
                        theme={theme}
                        animated={false}
                      />
                    </div>

                    <div className="mt-4 p-4 bg-blue-50 rounded-lg">
                      <p className="text-sm text-blue-800">
                        💡 <strong>Vinkki:</strong> Muutokset näkyvät esikatselussa reaaliajassa.
                      </p>
                    </div>
                  </div>
                )}

                {block.type === 'navigation' && (
                  <div className="space-y-4">
                    <div className="mb-4">
                      <h3 className="text-lg font-semibold mb-2">Esikatselu</h3>
                      <p className="text-sm text-gray-600">Näin navigaatio näyttää sivullasi</p>
                    </div>
                    
                    {/* Live preview of the navigation block */}
                    <div className="border-2 border-gray-300 rounded-lg overflow-hidden bg-white shadow-lg">
                      <NavigationBlock 
                        data={{
                          items: form.watch('items') || [],
                          styleVariant: form.watch('styleVariant') || 'ribbon',
                          backgroundColor: form.watch('backgroundColor') || 'white',
                          textColor: form.watch('textColor') || '#000000',
                          accentColor: form.watch('accentColor') || theme.colors.primary,
                          paddingY: form.watch('paddingY') || 20,
                          paddingX: form.watch('paddingX') || 16
                        }}
                        theme={theme}
                        animated={false}
                      />
                    </div>

                    <div className="mt-4 p-4 bg-blue-50 rounded-lg">
                      <p className="text-sm text-blue-800">
                        💡 <strong>Vinkki:</strong> Muutokset näkyvät esikatselussa reaaliajassa.
                      </p>
                    </div>
                  </div>
                )}
              </TabsContent>

              {/* Teema Tab - Style variant selector */}
              <TabsContent value="teema" className="flex-1 overflow-y-auto">
                <div className="space-y-4">
                  {block.type === 'divider' && (
                    <div>
                      <Label className="mb-2 block text-sm font-semibold">Valitse Erotin</Label>
                      <div className="grid grid-cols-2 gap-4">
                        {['1', '2', '3', '4'].map((style) => (
                          <FormField
                            key={style}
                            control={form.control}
                            name="dividerStyle"
                            render={({ field }) => (
                              <button
                                type="button"
                                onClick={() => field.onChange(style)}
                                className={`group relative rounded-xl overflow-hidden border transition-all text-left ${field.value === style ? 'border-teal-400 ring-2 ring-teal-300 shadow-xl' : 'border-gray-200 hover:border-pink-300 hover:shadow-md'}`}
                              >
                                <div className="aspect-video w-full bg-[linear-gradient(180deg,#0f172a,#1e293b)]/90 flex items-center justify-center">
                                  <img src={`/editor/dividers/${style}.svg`} alt={`Divider ${style}`} className=" object-contain opacity-90" />
                                </div>
                                <div className="px-3 py-2 text-sm text-gray-700 bg-gray-50">Erotin {style}</div>
                              </button>
                            )}
                          />
                        ))}
                      </div>
                    </div>
                  )}

                  {block.type === 'countdown' && (
                    <FormField
                      control={form.control}
                      name="styleVariant"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="text-lg font-semibold">Teema</FormLabel>
                          <FormControl>
                            <div className="grid grid-cols-2 gap-4">
                              {[
                                { key: 'gradient', label: 'Ruusugradientti' },
                                { key: 'framed', label: 'Kehys' },
                                { key: 'cards', label: 'Kortit' },
                                { key: 'minimal', label: 'Minimaalinen' },
                              ].map(opt => (
                                <button
                                  type="button"
                                  key={opt.key}
                                  onClick={() => field.onChange(opt.key)}
                                  className={`group relative rounded-xl overflow-hidden border transition-all text-left ${field.value === opt.key ? 'border-teal-400 ring-2 ring-teal-300 shadow-xl' : 'border-gray-200 hover:border-pink-300 hover:shadow-md'}`}
                                >
                                  {(() => {
                                    const bg = form.watch('backgroundColor') || '#e8dff5';
                                    const titleColor = form.watch('titleColor') || '#6b5b7b';
                                    const descColor = form.watch('descriptionColor') || '#6b5b7b';
                                    if (opt.key === 'cards') {
                                      return (
                                        <div className="aspect-video w-full flex items-center justify-center rounded-2xl" style={{ backgroundColor: bg }}>
                                          <div className="flex gap-2 px-2">
                                            {[1,2,3,4].map(i => (
                                              <div key={i} className="bg-white rounded-2xl shadow-lg w-12 h-14 md:w-14 md:h-16 flex items-center justify-center">
                                                <div className="text-sm font-bold" style={{ color: titleColor }}>25</div>
                                              </div>
                                            ))}
                                          </div>
                                        </div>
                                      );
                                    }
                                    if (opt.key === 'minimal') {
                                      return (
                                        <div className="aspect-video w-full flex items-end justify-center rounded-2xl" style={{ backgroundColor: bg }}>
                                          <div className="flex items-end gap-6 pb-3">
                                            {[1,2,3,4].map(i => (
                                              <div key={i} className="text-2xl font-bold" style={{ color: titleColor }}>15</div>
                                            ))}
                                          </div>
                                        </div>
                                      );
                                    }
                                    if (opt.key === 'framed') {
                                      return (
                                        <div className="aspect-video w-full flex items-center justify-center rounded-2xl" style={{ backgroundColor: bg }}>
                                          <div className="w-4/5 h-3/5 bg-white border border-pink-200 rounded-3xl shadow-lg flex items-center justify-center">
                                            <div className="flex gap-2 px-2">
                                              {[1,2,3,4].map(i => (
                                                <div key={i} className="bg-white rounded-2xl shadow w-10 h-12 md:w-12 md:h-14 flex items-center justify-center">
                                                  <div className="text-sm font-bold" style={{ color: titleColor }}>25</div>
                                                </div>
                                              ))}
                                            </div>
                                          </div>
                                        </div>
                                      );
                                    }
                                    // gradient
                                    return (
                                      <div className="aspect-video w-full flex items-center justify-center rounded-2xl" style={{ background: 'linear-gradient(135deg, rgba(253,242,248,1) 0%, rgba(237,233,254,1) 100%)' }}>
                                        <div className="flex items-end gap-6 pb-3">
                                          {[1,2,3,4].map(i => (
                                            <div key={i} className="text-2xl font-bold" style={{ color: titleColor }}>15</div>
                                          ))}
                                        </div>
                                      </div>
                                    );
                                  })()}
                                  <div className="px-3 py-2 text-sm text-gray-700 bg-gray-50">{opt.label}</div>
                                </button>
                              ))}
                            </div>
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  )}

                  {block.type === 'rsvp' && (
                    <FormField
                      control={form.control}
                      name="styleVariant"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="text-lg font-semibold">Teema</FormLabel>
                          <FormControl>
                            <div className="grid grid-cols-2 gap-4 mt-4">
                              {[
                                { key: 'cards', label: 'Kortit' },
                                { key: 'buttons', label: 'Painikkeet' },
                                { key: 'minimal', label: 'Minimaalinen' },
                              ].map(opt => (
                                <button
                                  type="button"
                                  key={opt.key}
                                  onClick={() => field.onChange(opt.key)}
                                  className={`group relative rounded-xl overflow-hidden border transition-all text-left ${field.value === opt.key ? 'border-teal-400 ring-2 ring-teal-300 shadow-xl' : 'border-gray-200 hover:border-pink-300 hover:shadow-md'}`}
                                >
                                  {(() => {
                                    const bg = form.watch('backgroundColor') || '#e8dff5';
                                    const btnColor = form.watch('buttonColor') || '#6b5b7b';
                                    if (opt.key === 'cards') {
                                      return (
                                        <div className="aspect-video w-full flex items-center justify-center rounded-2xl" style={{ backgroundColor: bg }}>
                                          <div className="grid grid-cols-2 gap-3">
                                            <div className="bg-white rounded-lg p-4 shadow text-center">
                                              <div className="w-8 h-8 rounded-full mx-auto mb-2" style={{ backgroundColor: btnColor }}></div>
                                              <div className="text-xs font-semibold">Tulen</div>
                                            </div>
                                            <div className="bg-white rounded-lg p-4 shadow text-center">
                                              <div className="w-8 h-8 rounded-full mx-auto mb-2 border-2" style={{ borderColor: btnColor }}></div>
                                              <div className="text-xs font-semibold">En voi</div>
                                            </div>
                                          </div>
                                        </div>
                                      );
                                    }
                                    if (opt.key === 'buttons') {
                                      return (
                                        <div className="aspect-video w-full flex items-center justify-center rounded-2xl" style={{ backgroundColor: bg }}>
                                          <div className="flex gap-2">
                                            <button className="px-4 py-2 text-xs font-semibold rounded-lg text-white" style={{ backgroundColor: btnColor }}>Tulen</button>
                                            <button className="px-4 py-2 text-xs font-semibold rounded-lg border-2" style={{ borderColor: btnColor, color: btnColor }}>En voi</button>
                                          </div>
                                        </div>
                                      );
                                    }
                                    // minimal
                                    return (
                                      <div className="aspect-video w-full flex items-center justify-center rounded-2xl" style={{ backgroundColor: bg }}>
                                        <div className="flex gap-2">
                                          <button className="px-3 py-1 text-xs font-semibold rounded" style={{ backgroundColor: btnColor, color: 'white' }}>Tulen</button>
                                          <button className="px-3 py-1 text-xs font-semibold rounded border-2" style={{ borderColor: btnColor, color: btnColor }}>En voi</button>
                                        </div>
                                      </div>
                                    );
                                  })()}
                                  <div className="px-3 py-2 text-sm text-gray-700 bg-gray-50">{opt.label}</div>
                                </button>
                              ))}
                            </div>
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  )}

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
                                border-2 rounded-lg cursor-pointer transition-all overflow-hidden
                                ${field.value === style.value
                                      ? 'border-pink-500 bg-pink-50'
                                      : 'border-gray-200 hover:border-pink-300 hover:bg-gray-50'}
                              `}
                                >
                                  {/* Preview miniature */}
                                  <div className="bg-white border-b border-gray-200 p-2">
                                    {/* Fullscreen preview */}
                                    {style.value === 'fullscreen' && (
                                      <div className="w-full h-24 bg-gradient-to-br from-pink-200 to-purple-200 rounded flex items-center justify-center relative">
                                        <div className="absolute inset-0 bg-black opacity-20"></div>
                                        <div className="relative z-10 text-center">
                                          <div className="text-xs font-bold text-white mb-0.5">Hero Title</div>
                                          <div className="text-[8px] text-white opacity-80">Subtitle</div>
                                        </div>
                                      </div>
                                    )}
                                    
                                    {/* Centered preview */}
                                    {style.value === 'centered' && (
                                      <div className="w-full h-24 bg-gradient-to-br from-pink-200 to-purple-200 rounded flex items-center justify-center relative">
                                        <div className="absolute inset-0 bg-black opacity-20"></div>
                                        <div className="relative z-10 text-center py-4">
                                          <div className="text-[10px] font-bold text-white mb-0.5">Hero Title</div>
                                          <div className="text-[7px] text-white opacity-80">Subtitle</div>
                                        </div>
                                      </div>
                                    )}
                                    
                                    {/* Split preview */}
                                    {style.value === 'split' && (
                                      <div className="w-full h-24 rounded overflow-hidden flex">
                                        <div className="w-1/2 bg-gradient-to-br from-pink-200 to-purple-200 relative">
                                          <div className="absolute inset-0 bg-black opacity-10"></div>
                                        </div>
                                        <div className="w-1/2 bg-white flex items-center justify-center p-2">
                                          <div className="text-left">
                                            <div className="text-[8px] font-bold text-gray-800 mb-0.5">Hero Title</div>
                                            <div className="text-[6px] text-gray-600">Subtitle</div>
                                          </div>
                                        </div>
                                      </div>
                                    )}
                                    
                                    {/* Minimal preview */}
                                    {style.value === 'minimal' && (
                                      <div className="w-full h-24 bg-white rounded flex flex-col items-center justify-center p-2">
                                        <div className="text-[10px] font-bold text-gray-800 mb-1">Hero Title</div>
                                        <div className="text-[7px] text-gray-600 mb-2">Subtitle</div>
                                        <div className="w-16 h-8 bg-gradient-to-br from-pink-200 to-purple-200 rounded-sm"></div>
                                      </div>
                                    )}
                                  </div>
                                  
                                  {/* Description */}
                                  <div className="p-3">
                                    <h4 className="font-semibold text-base mb-1">{style.label}</h4>
                                    <p className="text-sm text-gray-600">{style.desc}</p>
                                  </div>
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

                  {block.type === 'navigation' && (
                    <FormField
                      control={form.control}
                      name="styleVariant"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="text-lg font-semibold">Navigaation tyyli</FormLabel>
                          <FormControl>
                            <div className="grid grid-cols-2 gap-4">
                              {[
                                { key: 'ribbon', label: 'Nauha' },
                                { key: 'minimal', label: 'Minimaalinen' },
                                { key: 'dots', label: 'Pisteet' },
                                { key: 'underline', label: 'Alleviivaus' },
                                { key: 'badges', label: 'Merkit' },
                              ].map(opt => (
                                <button
                                  type="button"
                                  key={opt.key}
                                  onClick={() => field.onChange(opt.key)}
                                  className={`p-3 rounded-lg border transition-all text-sm font-medium ${field.value === opt.key ? 'border-teal-400 ring-2 ring-teal-300 bg-teal-50' : 'border-gray-200 hover:border-pink-300'}`}
                                >
                                  {opt.label}
                                </button>
                              ))}
                            </div>
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  )}

                  {/* Other blocks - show info */}
                  {block.type !== 'hero' && block.type !== 'program' && block.type !== 'divider' && block.type !== 'navigation' && (
                    <div className="p-4 bg-gray-50 rounded-lg">
                      <p className="text-sm text-gray-600">
                        Tyylivaihtoehdot tulevat pian tälle lohkolle.
                      </p>
                    </div>
                  )}

                  {/* Divider: no extra content in Teema beyond chooser */}
                </div>
              </TabsContent>

            </Tabs>

            {/* Footer buttons */}
            {inline ? (
              <div className="mt-4 flex justify-end gap-2">
                <Button type="button" variant="outline" onClick={() => onCancel && onCancel()}>
                  Peruuta
                </Button>
                <Button
                  type="submit"
                  className="bg-gradient-to-r from-pink-500 to-purple-600 hover:from-pink-600 hover:to-purple-700"
                >
                  Tallenna
                </Button>
              </div>
            ) : (
              <DialogFooter>
                <Button type="button" variant="outline" onClick={() => (onOpenChange && onOpenChange(false))}>
                  Peruuta
                </Button>
                <Button
                  type="submit"
                  className="bg-gradient-to-r from-pink-500 to-purple-600 hover:from-pink-600 hover:to-purple-700"
                >
                  Tallenna
                </Button>
              </DialogFooter>
            )}
          </form>
        </Form>
    </>
  );

  if (inline) {
    return (
      <div className="w-full flex flex-col">
        {Body}
      </div>
    );
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="!max-w-5xl !w-full flex flex-col">
        {Body}
      </DialogContent>
    </Dialog>
  );
}
