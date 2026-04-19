import { useState, useEffect } from 'react';

export const DevBackground = () => {
  return (
    <div className="fixed inset-0 pointer-events-none z-[-1] overflow-hidden bg-background opacity-40 dark:opacity-[0.85]">
      {/* Subtle Grid */}
      <div 
        className="absolute inset-0 pattern-grid" 
        style={{ 
          backgroundImage: `linear-gradient(to right, var(--color-border) 1px, transparent 1px), linear-gradient(to bottom, var(--color-border) 1px, transparent 1px)`, 
          backgroundSize: '40px 40px',
          opacity: 0.1 
        }} 
      ></div>

      {/* Floating Syntax / Symbols */}
      <div className="absolute top-1/4 left-[10%] text-border w-32 h-32 opacity-20 transform -rotate-12 blur-sm">
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1" strokeLinecap="round" strokeLinejoin="round"><path d="m18 16 4-4-4-4"/><path d="m6 8-4 4 4 4"/><path d="m14.5 4-5 16"/></svg>
      </div>

      <div className="absolute bottom-1/4 right-[15%] text-border text-[120px] font-mono leading-none opacity-20 transform rotate-12 blur-[2px]">
        {'{}'}
      </div>

      <div className="absolute top-[60%] left-[25%] text-border text-[80px] font-mono leading-none opacity-10 transform -rotate-6 blur-[1px]">
        ()
      </div>

      <div className="absolute top-[15%] right-[20%] text-primary/10 text-[100px] font-mono leading-none transform rotate-45 blur-md">
        ;
      </div>
      
      {/* Faded Code Snippet BG */}
      <div className="absolute bottom-10 left-10 text-muted-foreground/10 font-mono text-xs whitespace-pre select-none blur-[1px]">
        {`function resolveConfig(config) {
  return {
    ...defaultConfig,
    ...config,
    experiments: {
      enableDevMode: true
    }
  };
}`}
      </div>
    </div>
  );
};
