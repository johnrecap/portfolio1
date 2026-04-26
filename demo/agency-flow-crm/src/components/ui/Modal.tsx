import * as React from "react";
import { cn } from "../../utils/cn";
import { X } from "lucide-react";

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  children: React.ReactNode;
}

export function Modal({ isOpen, onClose, title, children }: ModalProps) {
  if (!isOpen) return null;

  return (
    <>
      <div 
        className="fixed inset-0 bg-slate-900/20 backdrop-blur-sm z-40 transition-opacity"
        onClick={onClose}
      />
      <div className="fixed left-1/2 top-1/2 w-full max-w-md -translate-x-1/2 -translate-y-1/2 bg-white rounded-[20px] shadow-lifted z-50 flex flex-col overflow-hidden max-h-[90vh]">
        <div className="flex items-center justify-between p-6 border-b border-[#E2E8F0] shrink-0">
          <h2 className="font-section-title text-section-title text-primary">{title}</h2>
          <button 
            onClick={onClose}
            className="w-8 h-8 flex items-center justify-center rounded-full text-slate-500 hover:bg-slate-100 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>
        <div className="flex-1 overflow-y-auto w-full p-6">
          {children}
        </div>
      </div>
    </>
  );
}
