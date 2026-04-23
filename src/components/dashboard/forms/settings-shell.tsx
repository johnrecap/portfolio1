import type { ReactNode } from 'react';
import { Save } from 'lucide-react';

import { Button } from '@/components/ui/button';

type SettingsShellProps = {
  title: string;
  description: string;
  isSaving: boolean;
  saveLabel: string;
  savingLabel: string;
  onSave: () => void;
  children: ReactNode;
};

export function SettingsShell({
  title,
  description,
  isSaving,
  saveLabel,
  savingLabel,
  onSave,
  children,
}: SettingsShellProps) {
  return (
    <div className="mx-auto flex w-full max-w-7xl flex-1 flex-col gap-8 px-6 pt-10 pb-20">
      <div className="flex flex-col gap-5 md:flex-row md:items-end md:justify-between">
        <div>
          <h1 className="font-heading text-4xl font-bold tracking-tight text-foreground">{title}</h1>
          <p className="mt-2 max-w-3xl text-muted-foreground">{description}</p>
        </div>
        <Button onClick={onSave} disabled={isSaving} className="gap-2">
          <Save className="h-4 w-4" />
          {isSaving ? savingLabel : saveLabel}
        </Button>
      </div>

      {children}
    </div>
  );
}
