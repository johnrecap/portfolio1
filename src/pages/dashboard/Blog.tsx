import { useState } from 'react';
import { motion } from 'motion/react';
import { Search, Plus, Edit2, Trash2 } from 'lucide-react';
import { Button, buttonVariants } from '@/components/ui/button';
import { useCollection } from '@/hooks/useFirestore';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogFooter } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { useTranslation } from 'react-i18next';

export const DashboardBlog = () => {
  const { data: blogs, loading, addDocument, updateDocument, removeDocument } = useCollection('blogs');
  const [isOpen, setIsOpen] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const { t } = useTranslation();
  
  const [title, setTitle] = useState('');
  const [slug, setSlug] = useState('');
  const [excerpt, setExcerpt] = useState('');
  const [content, setContent] = useState('');
  const [category, setCategory] = useState('');
  const [image, setImage] = useState('');

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

  const resetForm = () => {
    setTitle('');
    setSlug('');
    setExcerpt('');
    setContent('');
    setCategory('');
    setImage('');
    setEditingId(null);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const payload = { title, slug, excerpt, content, category, image };
    if (editingId) await updateDocument(editingId, payload);
    else await addDocument(payload);
    setIsOpen(false);
    resetForm();
  };

  const handleEdit = (blog: any) => {
    setTitle(blog.title);
    setSlug(blog.slug);
    setExcerpt(blog.excerpt);
    setContent(blog.content);
    setCategory(blog.category);
    setImage(blog.image || '');
    setEditingId(blog.id);
    setIsOpen(true);
  };

  const handleDelete = async (id: string) => {
    if(confirm(t('dashboardBlog.confirmDelete'))) await removeDocument(id);
  };

  return (
    <div className="flex-1 flex flex-col pt-10 pb-12 overflow-x-hidden w-full">
      <div className="px-6 md:px-10 max-w-7xl mx-auto w-full">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-10">
          <div>
            <h1 className="text-3xl md:text-4xl font-heading font-bold tracking-tight mb-2">{t('dashboardBlog.blogManager')}</h1>
            <p className="text-muted-foreground text-lg">{t('dashboardBlog.publishThoughts')}</p>
          </div>
          
          <div className="flex gap-4">
            <Dialog open={isOpen} onOpenChange={(open) => { setIsOpen(open); if (!open) resetForm(); }}>
              <DialogTrigger className={buttonVariants({ variant: "default", size: "default", className: "shrink-0 gap-2 font-medium" })}>
                  <Plus className="w-4 h-4" /> {t('dashboardBlog.newArticle')}
              </DialogTrigger>
              <DialogContent className="sm:max-w-[700px] h-[90vh] overflow-y-auto">
                <form onSubmit={handleSubmit} className="flex flex-col gap-6">
                  <DialogHeader>
                    <DialogTitle>{editingId ? t('dashboardBlog.editArticle') : t('dashboardBlog.newArticle')}</DialogTitle>
                  </DialogHeader>
                  <div className="grid gap-4 py-4">
                    <div className="grid gap-2">
                      <Label>{t('dashboardBlog.title')}</Label>
                      <Input value={title} onChange={(e) => setTitle(e.target.value)} required />
                    </div>
                    <div className="grid gap-2">
                      <Label>{t('dashboardBlog.slug')}</Label>
                      <Input value={slug} onChange={(e) => setSlug(e.target.value)} required />
                    </div>
                    <div className="grid gap-2">
                      <Label>{t('dashboardBlog.category')}</Label>
                      <Input value={category} onChange={(e) => setCategory(e.target.value)} required />
                    </div>
                    <div className="grid gap-2">
                      <Label>{t('dashboardBlog.coverImage')}</Label>
                      <div className="flex flex-col gap-3">
                        <Input 
                          type="file" 
                          accept="image/*" 
                          onChange={handleImageUpload}
                          className="cursor-pointer file:text-primary file:font-medium file:border-0 file:bg-primary/10 file:mr-4 file:px-4 file:py-1 file:rounded-full hover:file:bg-primary/20 bg-muted border-dashed border-2"
                        />
                        <div className="text-center font-semibold text-xs text-muted-foreground uppercase tracking-widest">{t('dashboardProjects.or')}</div>
                        <Input 
                          value={image} 
                          onChange={(e) => setImage(e.target.value)} 
                          placeholder="https://..." 
                        />
                      </div>
                      {image && (
                        <div className="mt-1 text-xs text-muted-foreground truncate rounded bg-muted/50 p-2 border">
                          {image.startsWith('data:') ? '✅ Local Image Attached' : '✅ URL Attached'}
                        </div>
                      )}
                    </div>
                    <div className="grid gap-2">
                      <Label>{t('dashboardBlog.excerpt')}</Label>
                      <Textarea value={excerpt} onChange={(e) => setExcerpt(e.target.value)} required rows={3} />
                    </div>
                    <div className="grid gap-2 flex-1">
                      <Label>{t('dashboardBlog.content')}</Label>
                      <Textarea value={content} onChange={(e) => setContent(e.target.value)} required className="font-mono text-sm min-h-[300px]" />
                    </div>
                  </div>
                  <DialogFooter className="mt-auto">
                    <Button type="button" variant="outline" onClick={() => setIsOpen(false)}>{t('dashboardBlog.cancel')}</Button>
                    <Button type="submit">{t('dashboardBlog.publish')}</Button>
                  </DialogFooter>
                </form>
              </DialogContent>
            </Dialog>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {loading ? (
             <p className="text-muted-foreground">{t('dashboardBlog.loading')}</p>
          ) : blogs.length === 0 ? (
             <p className="text-muted-foreground">{t('dashboardBlog.noArticles')}</p>
          ) : blogs.map((blog: any, i: number) => (
            <motion.div 
              key={blog.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.1 }}
              className="bg-card rounded-[1.5rem] p-8 flex flex-col min-h-[320px] transition-all duration-300 hover:shadow-lg border border-border"
            >
              <div className="flex justify-between items-start mb-6">
                <span className="text-teal-600 dark:text-teal-400 text-xs font-semibold uppercase">{blog.category}</span>
                <div className="flex gap-1">
                  <button onClick={() => handleEdit(blog)} className="p-1.5 text-muted-foreground hover:text-teal-500 rounded-md bg-muted transition-colors"><Edit2 className="w-4 h-4" /></button>
                  <button onClick={() => handleDelete(blog.id)} className="p-1.5 text-muted-foreground hover:text-red-500 rounded-md bg-muted transition-colors"><Trash2 className="w-4 h-4" /></button>
                </div>
              </div>
              <h3 className="font-heading text-2xl font-bold tracking-tight mb-4">{blog.title}</h3>
              <p className="text-muted-foreground text-sm line-clamp-3">{blog.excerpt}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
};
