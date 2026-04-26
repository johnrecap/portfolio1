import * as React from "react";
import { cn } from "@/lib/utils";
import { X } from "lucide-react";

interface DrawerProps {
  open: boolean;
  onClose: () => void;
  title: string;
  children: React.ReactNode;
}

export function Drawer({ open, onClose, title, children }: DrawerProps) {
  if (!open) return null;

  return (
    <>
      <div 
        className="fixed inset-0 bg-on-surface/40 backdrop-blur-sm z-50 transition-opacity" 
        onClick={onClose}
      />
      <div className="fixed inset-y-0 end-0 w-full max-w-[480px] bg-surface-container-lowest shadow-2xl z-50 flex flex-col animate-in slide-in-from-right rtl:slide-in-from-left border-s border-outline-variant">
        <div className="flex items-center justify-between px-6 py-4 border-b border-outline-variant">
          <h2 className="text-xl font-heading font-semibold text-on-surface">{title}</h2>
          <button 
            onClick={onClose}
            className="p-2 -me-2 text-on-surface-variant hover:bg-surface-container rounded-full transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>
        <div className="flex-1 overflow-y-auto p-6">
          {children}
        </div>
      </div>
    </>
  );
}
