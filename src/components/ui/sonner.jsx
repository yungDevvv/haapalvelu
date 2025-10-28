"use client"

import {
  CircleCheckIcon,
  InfoIcon,
  Loader2Icon,
  OctagonXIcon,
  TriangleAlertIcon,
} from "lucide-react"
import { useTheme } from "next-themes"
import { Toaster as Sonner } from "sonner";

const Toaster = ({
  ...props
}) => {
  const { theme = "system" } = useTheme()

  return (
    <Sonner
      theme={theme}
      className="toaster group"
      position="top-right"
      closeButton
      unstyled
      icons={{
        success: <CircleCheckIcon className="size-6 md:size-7 text-pink-500" />,
        info: <InfoIcon className="size-6 md:size-7 text-pink-500" />,
        warning: <TriangleAlertIcon className="mr-4 size-6 md:size-7 text-pink-500" />,
        error: <OctagonXIcon className="size-6 md:size-7 text-pink-500" />,
        loading: <Loader2Icon className="size-6 md:size-7 animate-spin text-pink-500" />,
      }}
      toastOptions={{
        duration: 1000000,
        classNames: {
          toast: "relative overflow-hidden rounded-2xl pl-5 pr-12 py-4 !bg-white text-gray-900 shadow-lg border border-pink-200/70",
          icon: "mr-6",
          title: "ml-4 font-semibold text-[16px] !text-black md:text-[17px] tracking-[-0.01em]",
          description: "ml-4 text-[15px] md:text-[16px] !text-black/80",
          actionButton: "bg-gradient-to-r from-pink-500 to-purple-600 hover:from-pink-600 hover:to-purple-700 text-white",
          cancelButton: "border border-gray-200",
          closeButton: "!rounded-none !absolute !right-2 !top-2 !w-6 !h-6 !p-0 !bg-transparent !border-0 !text-gray-400 hover:!text-gray-600",
        },
      }}
      {...props} />
  );
}

export { Toaster }
