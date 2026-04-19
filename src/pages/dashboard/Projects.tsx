import { useState } from 'react';
import { motion } from 'motion/react';
import { 
  Plus, 
  Search, 
  Calendar, 
  Edit2, 
  Trash2, 
  Image as ImageIcon,
  ChevronLeft,
  ChevronRight,
  MoreHorizontal
} from 'lucide-react';
import { Button, buttonVariants } from '@/components/ui/button';
import { useCollection } from '@/hooks/useFirestore';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogFooter } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { useTranslation } from 'react-i18next';

export const DashboardProjects = () => {
  const { data: projects, loading, addDocument, updateDocument, removeDocument } = useCollection('projects');
  
  const [isOpen, setIsOpen] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const { t, i18n } = useTranslation();
  
  // Form State
  const [title, setTitle] = useState('');
  const [slug, setSlug] = useState('');
  const [description, setDescription] = useState('');
  const [category, setCategory] = useState('');
  const [image, setImage] = useState('');
  const [demoUrl, setDemoUrl] = useState('');
  const [githubUrl, setGithubUrl] = useState('');
  const [tagsInput, setTagsInput] = useState('');

  // Delete State
  const [deleteId, setDeleteId] = useState<string | null>(null);
  
  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        const img = new Image();
        img.onload = () => {
          const canvas = document.createElement('canvas');
          const MAX_WIDTH = 800; // compress max width
          const scaleSize = MAX_WIDTH / img.width;
          canvas.width = MAX_WIDTH;
          canvas.height = img.height * scaleSize;
          const ctx = canvas.getContext('2d');
          ctx?.drawImage(img, 0, 0, canvas.width, canvas.height);
          const compressedBase64 = canvas.toDataURL('image/webp', 0.8);
          setImage(compressedBase64);
        };
        img.src = event.target?.result as string;
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const tagsArray = tagsInput.split(',').map(t => t.trim()).filter(Boolean);
    const payload = { title, slug, description, category, image, demoUrl, githubUrl, color: 'bg-teal-500', tags: tagsArray };
    
    if (editingId) {
      await updateDocument(editingId, payload);
    } else {
      await addDocument(payload);
    }
    
    setIsOpen(false);
    resetForm();
  };
  
  const handleEdit = (project: any) => {
    setTitle(project.title);
    setSlug(project.slug);
    setDescription(project.description);
    setCategory(project.category);
    setImage(project.image);
    setDemoUrl(project.demoUrl || '');
    setGithubUrl(project.githubUrl || '');
    setTagsInput(project.tags ? project.tags.join(', ') : '');
    setEditingId(project.id);
    setIsOpen(true);
  };
  
  const handleDeleteTrigger = (id: string, e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation(); // Prevent card click
    setDeleteId(id);
  };

  const confirmDelete = async () => {
    if(deleteId) {
      try {
        await removeDocument(deleteId);
      } catch (err) {
        console.error("Failed to delete", err);
      }
      setDeleteId(null);
    }
  };

  const resetForm = () => {
    setTitle('');
    setSlug('');
    setDescription('');
    setCategory('');
    setImage('');
    setDemoUrl('');
    setGithubUrl('');
    setTagsInput('');
    setEditingId(null);
  };

  return (
    <div className="flex-1 flex flex-col pt-10 pb-12 overflow-x-hidden w-full">
      <div className="px-6 md:px-10 max-w-7xl mx-auto w-full">
        {/* Header Section */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-10">
          <div>
            <h1 className="text-3xl md:text-4xl font-heading font-bold tracking-tight mb-2">{t('dashboardProjects.projects')}</h1>
            <p className="text-muted-foreground text-lg">{t('dashboardProjects.managePortfolio')}</p>
          </div>
          
          <div className="flex gap-4">
            <div className="relative">
              <Search className={`w-4 h-4 absolute ${i18n.language === 'ar' ? 'right-3' : 'left-3'} top-1/2 -translate-y-1/2 text-muted-foreground`} />
              <Input placeholder={t('dashboardProjects.searchProjects')} className={`${i18n.language === 'ar' ? 'pr-10' : 'pl-10'} w-full md:w-[250px] bg-background border-border`} />
            </div>
            
            <Dialog open={isOpen} onOpenChange={(open) => {
              setIsOpen(open);
              if (!open) resetForm();
            }}>
              <DialogTrigger className={buttonVariants({ variant: "default", size: "default", className: "shrink-0 gap-2 font-medium" })}>
                  <Plus className="w-4 h-4" /> {t('dashboardProjects.addProject')}
              </DialogTrigger>
              <DialogContent className="sm:max-w-[500px]">
                <form onSubmit={handleSubmit}>
                  <DialogHeader>
                    <DialogTitle>{editingId ? t('dashboardProjects.editProject') : t('dashboardProjects.addNewProject')}</DialogTitle>
                  </DialogHeader>
                  <div className="grid gap-4 py-4">
                    <div className="grid gap-2">
                      <Label htmlFor="title">{t('dashboardProjects.title')}</Label>
                      <Input id="title" value={title} onChange={(e) => setTitle(e.target.value)} required />
                    </div>
                    <div className="grid gap-2">
                      <Label htmlFor="slug">{t('dashboardProjects.slug')}</Label>
                      <Input id="slug" value={slug} onChange={(e) => setSlug(e.target.value)} required placeholder="e.g. e-commerce-app" />
                      <p className="text-[10px] text-muted-foreground">The short name for the URL. Do NOT put full links here (e.g. valdor-store).</p>
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div className="grid gap-2">
                        <Label htmlFor="category">{t('dashboardProjects.category')}</Label>
                        <Input id="category" value={category} onChange={(e) => setCategory(e.target.value)} required />
                      </div>
                      <div className="grid gap-2">
                        <Label htmlFor="tags">{t('dashboardProjects.techStack') || 'Tech Stack'}</Label>
                        <Input id="tags" value={tagsInput} onChange={(e) => setTagsInput(e.target.value)} placeholder="React, Node.js, ..." />
                      </div>
                    </div>
                    
                    <div className="grid grid-cols-2 gap-4">
                      <div className="grid gap-2">
                        <Label htmlFor="demoUrl">{t('dashboardProjects.demoUrl')}</Label>
                        <Input id="demoUrl" type="url" placeholder="https://" value={demoUrl} onChange={(e) => setDemoUrl(e.target.value)} />
                      </div>
                      <div className="grid gap-2">
                        <Label htmlFor="githubUrl">{t('dashboardProjects.githubUrl')}</Label>
                        <Input id="githubUrl" type="url" placeholder="https://github.com/..." value={githubUrl} onChange={(e) => setGithubUrl(e.target.value)} />
                      </div>
                    </div>
                    <div className="grid gap-2">
                      <Label htmlFor="image">{t('dashboardProjects.imageUrl')}</Label>
                      <div className="flex flex-col gap-3">
                        <Input 
                          type="file" 
                          accept="image/*" 
                          onChange={handleImageUpload}
                          className="cursor-pointer file:text-primary file:font-medium file:border-0 file:bg-primary/10 file:mr-4 file:px-4 file:py-1 file:rounded-full hover:file:bg-primary/20 bg-muted border-dashed border-2"
                        />
                        <div className="text-center font-semibold text-xs text-muted-foreground uppercase tracking-widest">{t('dashboardProjects.or')}</div>
                        <Input 
                          id="image" 
                          placeholder="https://..." 
                          value={image} 
                          onChange={(e) => setImage(e.target.value)} 
                          required 
                        />
                      </div>
                      {image && (
                        <div className="mt-1 text-xs text-muted-foreground truncate rounded bg-muted/50 p-2 border">
                          {image.startsWith('data:') ? '✅ Local Image Attached' : '✅ URL Attached'}
                        </div>
                      )}
                    </div>
                    <div className="grid gap-2">
                      <Label htmlFor="description">{t('dashboardProjects.description')}</Label>
                      <Textarea id="description" value={description} onChange={(e) => setDescription(e.target.value)} required />
                    </div>
                  </div>
                  <DialogFooter>
                    <Button type="button" variant="outline" onClick={() => setIsOpen(false)}>{t('dashboardProjects.cancel')}</Button>
                    <Button type="submit">{t('dashboardProjects.saveChanges')}</Button>
                  </DialogFooter>
                </form>
              </DialogContent>
            </Dialog>
          </div>
        </div>

        {/* Project Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 lg:gap-8 gap-6 relative z-10 w-full">
          {loading ? (
             <p className="text-muted-foreground">{t('dashboardProjects.loading')}</p>
          ) : projects.length === 0 ? (
             <p className="text-muted-foreground">{t('dashboardProjects.noProjects')}</p>
          ) : projects.map((project: any, i: number) => (
            <motion.div 
              key={project.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.1 }}
              className="bg-card rounded-[1.5rem] overflow-hidden flex flex-col sm:flex-row shadow-sm hover:shadow-lg hover:-translate-y-1 transition-all duration-300 border border-border group"
            >
              {/* Image Section */}
              <div className={`w-full sm:w-[240px] h-48 sm:h-auto overflow-hidden relative bg-muted shrink-0 ${i18n.language === 'ar' ? 'border-l' : 'border-r'} border-border/50`}>
                {project.image ? (
                  <img 
                    alt={project.title} 
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" 
                    src={project.image || undefined}
                    referrerPolicy="no-referrer"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center bg-slate-100 dark:bg-slate-800">
                    <ImageIcon className="w-8 h-8 text-slate-300 dark:text-slate-600" />
                  </div>
                )}
              </div>
              
              {/* Content Section */}
              <div className="p-6 flex flex-col flex-1 relative w-full overflow-hidden">
                <div className="flex justify-between items-start mb-2 gap-4">
                  <h3 className="font-heading font-bold text-xl truncate">{project.title}</h3>
                  <div className="flex bg-background rounded-lg border border-border shadow-sm p-1">
                    <button onClick={() => handleEdit(project)} className="p-1.5 text-muted-foreground hover:text-teal-500 rounded-md hover:bg-muted transition-colors">
                      <Edit2 className="w-4 h-4" />
                    </button>
                    <button onClick={(e) => handleDeleteTrigger(project.id, e)} className="p-1.5 text-muted-foreground hover:text-red-500 rounded-md hover:bg-muted transition-colors">
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
                
                <p className="text-muted-foreground text-sm mb-4 line-clamp-2">
                  {project.description}
                </p>
                
                <div className="mt-auto flex flex-wrap items-center justify-between gap-3 pt-4 border-t border-border">
                  <div className="flex items-center gap-2">
                    <div className={`w-2 h-2 rounded-full bg-teal-500`}></div>
                    <span className="text-xs font-semibold px-2 py-1 bg-muted rounded-md text-foreground">{project.category}</span>
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>

      <Dialog open={!!deleteId} onOpenChange={(open) => !open && setDeleteId(null)}>
        <DialogContent className="sm:max-w-[400px]">
          <DialogHeader>
            <DialogTitle>{t('dashboardProjects.confirmDeleteTitle') || 'Confirm Delete'}</DialogTitle>
          </DialogHeader>
          <div className="py-4 text-muted-foreground text-sm">
            {t('dashboardProjects.confirmDelete')}
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setDeleteId(null)}>
              {t('dashboardProjects.cancel')}
            </Button>
            <Button variant="destructive" onClick={confirmDelete}>
              {t('dashboardProjects.delete') || 'Delete'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};
