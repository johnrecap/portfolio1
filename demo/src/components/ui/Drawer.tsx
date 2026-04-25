import * as React from "react";
import { cn } from "../../utils/cn";
import { X } from "lucide-react";

interface DrawerProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  children: React.ReactNode;
  subtitle?: string;
  headerContent?: React.ReactNode;
}

export function Drawer({ isOpen, onClose, title, children, subtitle, headerContent }: DrawerProps) {
  if (!isOpen) return null;

  return (
    <>
      <div 
        className="fixed inset-0 bg-slate-900/20 backdrop-blur-sm z-40 transition-opacity"
        onClick={onClose}
      />
      <aside 
        className={cn(
          "fixed right-0 top-0 h-screen w-full max-w-[440px] bg-white z-50 flex flex-col transition-transform duration-300 ease-in-out shadow-[-4px_0_24px_rgba(0,0,0,0.06)]",
          isOpen ? "translate-x-0" : "translate-x-full"
        )}
      >
        <div className="p-6 border-b border-[#E2E8F0] bg-slate-50 relative shrink-0">
          <button 
            onClick={onClose}
            className="absolute top-4 right-4 w-8 h-8 flex flex-col items-center justify-center rounded-full bg-white border border-[#E2E8F0] text-slate-600 hover:bg-slate-50 focus:outline-none focus:ring-2 focus:ring-primary/20"
          >
            <X className="w-4 h-4" />
          </button>
          
          <div className="pr-10">
            {headerContent}
            <h2 className="font-section-title text-[22px] font-bold text-slate-900 leading-tight">
              {title}
            </h2>
            {subtitle && (
              <p className="font-body-main text-slate-500 mt-1">{subtitle}</p>
            )}
          </div>
        </div>
        
        <div className="flex-1 overflow-y-auto w-full">
          {children}
        </div>
      </aside>
    </>
  );
}
