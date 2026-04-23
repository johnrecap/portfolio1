import type { ReactNode } from 'react';

type SettingsCardProps = {
  title: string;
  description?: string;
  children: ReactNode;
};

export function SettingsCard({ title, description, children }: SettingsCardProps) {
  return (
    <section className="space-y-5 rounded-[2rem] border border-border/60 bg-card/70 p-6 shadow-sm">
      <div>
        <h2 className="font-heading text-2xl font-bold text-foreground">{title}</h2>
        {description ? <p className="mt-2 text-sm text-muted-foreground">{description}</p> : null}
      </div>
      {children}
    </section>
  );
}
