"use client"

import * as React from "react"
import * as TabsPrimitive from "@radix-ui/react-tabs"

import { cn } from "@/lib/utils"

function Tabs({
  className,
  ...props
}) {
  return (
    <TabsPrimitive.Root
      data-slot="tabs"
      className={cn("flex flex-col gap-2", className)}
      {...props} />
  );
}

function TabsList({
  className,
  ...props
}) {
  return (
    <TabsPrimitive.List
      data-slot="tabs-list"
      className={cn(
        "bg-white/80 backdrop-blur-sm shadow-lg border border-pink-100 flex flex-row h-22 w-full items-center justify-center rounded-2xl p-1.5 py-10 gap-1",
        className
      )}
      {...props} />
  );
}

function TabsTrigger({
  className,
  ...props
}) {
  const [isActive, setIsActive] = React.useState(false);
  
  return (
    <TabsPrimitive.Trigger
      data-slot="tabs-trigger"
      onFocus={() => setIsActive(true)}
      onBlur={() => setIsActive(false)}
      className={cn(
        "relative cursor-pointer inline-flex h-16 flex-1 flex-col items-center justify-center gap-1.5 rounded-t-xl px-8 py-4 text-sm font-bold whitespace-nowrap",
        "border-b-[3px] border-transparent",
        "text-gray-600 hover:text-gray-900 hover:bg-pink-50/50",
        "data-[state=active]:text-pink-500 data-[state=active]:bg-pink-50 data-[state=active]:border-pink-500",
        "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-pink-400 focus-visible:ring-offset-2",
        "disabled:pointer-events-none disabled:opacity-50",
        "[&_svg]:pointer-events-none [&_svg]:shrink-0 [&_svg]:size-6",
        "data-[state=active]:[&_svg]:text-pink-500",
        className
      )}
      {...props}>
      <span className="relative z-10 flex flex-col items-center justify-center gap-1.5">
        {props.children}
      </span>
    </TabsPrimitive.Trigger>
  );
}

function TabsContent({
  className,
  ...props
}) {
  return (
    <TabsPrimitive.Content
      data-slot="tabs-content"
      className={cn("flex-1 outline-none", className)}
      {...props}>
      {props.children}
    </TabsPrimitive.Content>
  );
}

export { Tabs, TabsList, TabsTrigger, TabsContent }
