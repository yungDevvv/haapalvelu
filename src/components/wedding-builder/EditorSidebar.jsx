"use client";

import { useEffect, useState } from "react";
import { createPortal } from "react-dom";
import { toast } from "sonner";

export default function EditorSidebar({ open, onClose, children, width = 460, blockClose = false, blockMessage = 'Sinulla on tallentamattomia muutoksia.' }) {
  if (typeof window === 'undefined') return null;

  const [mounted, setMounted] = useState(false);
  useEffect(() => {
    if (open) {
      setMounted(true);
      // allow CSS transition to run
      requestAnimationFrame(() => setEntered(true));
    } else {
      setEntered(false);
      const t = setTimeout(() => setMounted(false), 250);
      return () => clearTimeout(t);
    }
  }, [open]);

  const [entered, setEntered] = useState(false);

  // Block Escape if there are unsaved changes
  useEffect(() => {
    const onKey = (e) => {
      if (e.key === 'Escape') {
        if (blockClose) {
          e.preventDefault();
          e.stopPropagation();
          toast.warning('Muokkaus kesken', { description: blockMessage });
          return;
        }
        onClose && onClose();
      }
    };
    window.addEventListener('keydown', onKey, true);
    return () => window.removeEventListener('keydown', onKey, true);
  }, [blockClose, blockMessage, onClose]);

  return mounted ? createPortal(
    <>
      <div
        className="fixed inset-0 z-[2000] bg-black/40 transition-opacity duration-300"
        style={{ opacity: entered ? 1 : 0 }}
        onClick={() => {
          if (blockClose) {
            toast.warning('Muokkaus kesken', { description: blockMessage });
            return;
          }
          onClose && onClose();
        }}
      />
      <aside
        className="fixed right-0 top-0 bottom-0 z-[2001] bg-white shadow-2xl border-l overflow-hidden flex flex-col will-change-transform transition-transform duration-300 ease-[cubic-bezier(0.22,1,0.36,1)]"
        style={{
          width: Math.min(width, typeof window !== 'undefined' ? window.innerWidth * 0.9 : width),
          transform: entered ? 'translateX(0)' : 'translateX(100%)'
        }}
      >
        <div className="flex-1 overflow-auto p-4">
          {children}
        </div>
      </aside>
    </>,
    document.body
  ) : null;
}
