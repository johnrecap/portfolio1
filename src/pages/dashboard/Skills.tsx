import { useState } from 'react';
import { motion } from 'motion/react';
import { Plus, Edit2, Trash2 } from 'lucide-react';
import { Button, buttonVariants } from '@/components/ui/button';
import { useCollection } from '@/hooks/useFirestore';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogFooter } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useTranslation } from 'react-i18next';

export const DashboardSkills = () => {
  const { data: skills, loading, addDocument, updateDocument, removeDocument } = useCollection('skills');
  const [isOpen, setIsOpen] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const { t } = useTranslation();
  
  const [name, setName] = useState('');
  const [category, setCategory] = useState('');
  const [proficiency, setProficiency] = useState<number>(0);

  const resetForm = () => {
    setName('');
    setCategory('');
    setProficiency(0);
    setEditingId(null);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const payload = { name, category, proficiency: Number(proficiency) };
    if (editingId) await updateDocument(editingId, payload);
    else await addDocument(payload);
    setIsOpen(false);
    resetForm();
  };

  const handleEdit = (skill: any) => {
    setName(skill.name);
    setCategory(skill.category);
    setProficiency(skill.proficiency);
    setEditingId(skill.id);
    setIsOpen(true);
  };

  const handleDelete = async (id: string) => {
    if(confirm(t('dashboardSkills.confirmDelete'))) await removeDocument(id);
  };

  const getProficiencyColor = (val: number) => {
    if (val >= 90) return 'bg-teal-500';
    if (val >= 70) return 'bg-emerald-500';
    return 'bg-amber-500';
  };

  return (
    <div className="flex-1 flex flex-col pt-10 pb-12 overflow-x-hidden w-full">
      <div className="px-6 md:px-10 max-w-7xl mx-auto w-full">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-10">
          <div>
            <h1 className="text-3xl md:text-4xl font-heading font-bold tracking-tight mb-2">{t('dashboardSkills.skillsSetup')}</h1>
            <p className="text-muted-foreground text-lg">{t('dashboardSkills.manageProficiencies')}</p>
          </div>
          <Dialog open={isOpen} onOpenChange={(open) => { setIsOpen(open); if (!open) resetForm(); }}>
            <DialogTrigger className={buttonVariants({ variant: "default", size: "default", className: "shrink-0 gap-2 font-medium" })}>
                <Plus className="w-4 h-4" /> {t('dashboardSkills.addSkill')}
            </DialogTrigger>
            <DialogContent className="sm:max-w-[400px]">
              <form onSubmit={handleSubmit} className="flex flex-col gap-6">
                <DialogHeader>
                  <DialogTitle>{editingId ? t('dashboardSkills.editSkill') : t('dashboardSkills.newSkill')}</DialogTitle>
                </DialogHeader>
                <div className="grid gap-4 py-4">
                  <div className="grid gap-2">
                    <Label>{t('dashboardSkills.skillName')}</Label>
                    <Input value={name} onChange={(e) => setName(e.target.value)} placeholder={t('dashboardSkills.namePlaceholder')} required />
                  </div>
                  <div className="grid gap-2">
                    <Label>{t('dashboardSkills.category')}</Label>
                    <Input value={category} onChange={(e) => setCategory(e.target.value)} placeholder={t('dashboardSkills.categoryPlaceholder')} required />
                  </div>
                  <div className="grid gap-2">
                    <Label>{t('dashboardSkills.proficiency')}</Label>
                    <Input type="number" min="0" max="100" value={proficiency} onChange={(e) => setProficiency(Number(e.target.value))} required />
                  </div>
                </div>
                <DialogFooter>
                  <Button type="button" variant="outline" onClick={() => setIsOpen(false)}>{t('dashboardSkills.cancel')}</Button>
                  <Button type="submit">{t('dashboardSkills.save')}</Button>
                </DialogFooter>
              </form>
            </DialogContent>
          </Dialog>
        </div>

        <div className="bg-card rounded-2xl border border-border overflow-hidden">
          {loading ? (
             <div className="p-8 text-center text-muted-foreground">{t('dashboardSkills.loading')}</div>
          ) : skills.length === 0 ? (
             <div className="p-8 text-center text-muted-foreground">{t('dashboardSkills.noSkills')}</div>
          ) : (
            <div className="divide-y divide-border">
              {skills.map((skill: any) => (
                <div key={skill.id} className="p-4 sm:p-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4 hover:bg-muted/30 transition-colors">
                  <div className="flex-1 w-full sm:w-auto">
                    <div className="flex items-center gap-3 mb-2">
                      <span className="font-semibold text-lg">{skill.name}</span>
                      <span className="text-xs bg-muted text-muted-foreground px-2 py-0.5 rounded uppercase">{skill.category}</span>
                    </div>
                    <div className="flex items-center gap-4 w-full max-w-sm">
                      <div className="h-1.5 w-full bg-muted rounded-full overflow-hidden shrink-0">
                        <div className={`h-full ${getProficiencyColor(skill.proficiency)}`} style={{ width: `${skill.proficiency}%` }}></div>
                      </div>
                      <span className="text-sm font-medium text-muted-foreground shrink-0 w-10">{skill.proficiency}%</span>
                    </div>
                  </div>
                  <div className="flex gap-2 justify-end sm:justify-start">
                    <Button variant="outline" size="sm" onClick={() => handleEdit(skill)}>{t('dashboardSkills.edit')}</Button>
                    <Button variant="destructive" size="sm" onClick={() => handleDelete(skill.id)}>{t('dashboardSkills.delete')}</Button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
