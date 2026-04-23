import { type ChangeEvent, useMemo, useRef, useState } from 'react';
import { motion } from 'motion/react';
import { Edit2, Image as ImageIcon, Loader2, Plus, Search, Trash2, Upload, Video } from 'lucide-react';
import { useTranslation } from 'react-i18next';

import { EmptyState, SkeletonBlocks } from '@/components/shared/PageState';
import { Button, buttonVariants } from '@/components/ui/button';
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { useMediaLibrary } from '@/hooks/useMediaLibrary';
import type { MediaAssetRecord } from '@/lib/content-hub';
import { compressImageFileToDataUrl, estimateDataUrlBytes, normalizeMediaUrl } from '@/lib/media';

type MediaFormState = {
  title: string;
  titleAr: string;
  alt: string;
  altAr: string;
  url: string;
  kind: 'image' | 'video';
  group: string;
  tagsInput: string;
};

const initialFormState: MediaFormState = {
  title: '',
  titleAr: '',
  alt: '',
  altAr: '',
  url: '',
  kind: 'image',
  group: 'general',
  tagsInput: '',
};

function formatKilobytes(bytes: number) {
  return `${Math.max(1, Math.round(bytes / 1024))} KB`;
}

function filterAssets(items: MediaAssetRecord[], query: string) {
  const normalizedQuery = query.trim().toLowerCase();
  if (!normalizedQuery) {
    return items;
  }

  return items.filter((item) =>
    [item.title, item.titleAr, item.alt, item.altAr, item.group, ...(item.tags ?? [])]
      .filter(Boolean)
      .join(' ')
      .toLowerCase()
      .includes(normalizedQuery),
  );
}

export const DashboardMediaLibrary = () => {
  const { t } = useTranslation();
  const { assets, loading, addDocument, updateDocument, removeDocument } = useMediaLibrary();
  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const [search, setSearch] = useState('');
  const [formData, setFormData] = useState<MediaFormState>(initialFormState);
  const [isOpen, setIsOpen] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const [isUploadingUrl, setIsUploadingUrl] = useState(false);
  const [uploadError, setUploadError] = useState('');

  const filteredAssets = useMemo(() => filterAssets(assets, search), [assets, search]);
  const isLocalImage = formData.url.trim().startsWith('data:image/');
  const localImageBytes = estimateDataUrlBytes(formData.url);
  const uploadSourceHint = uploadError
    ? uploadError
    : isUploadingUrl
      ? t('dashboardMediaPicker.uploading')
      : isLocalImage
        ? t('dashboardMediaPicker.localImageAttached', {
            size: formatKilobytes(localImageBytes),
          })
        : t('dashboardMediaPicker.uploadHint');

  const resetForm = () => {
    setFormData(initialFormState);
    setEditingId(null);
    setUploadError('');
    setIsUploadingUrl(false);
  };

  const handleDialogChange = (open: boolean) => {
    setIsOpen(open);
    if (!open) {
      resetForm();
    }
  };

  const handleChange = (event: ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = event.target;
    if (name === 'url') {
      setUploadError('');
    }

    setFormData((current) => ({
      ...current,
      [name]: name === 'url' ? normalizeMediaUrl(value) : value,
    }));
  };

  const handleDeviceUpload = async (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    event.target.value = '';

    if (!file) {
      return;
    }

    setIsUploadingUrl(true);
    setUploadError('');

    try {
      const result = await compressImageFileToDataUrl(file);
      setFormData((current) => ({ ...current, url: result.dataUrl }));
    } catch (error) {
      const code = typeof error === 'object' && error && 'code' in error
        ? String((error as { code?: string }).code)
        : '';

      setUploadError(
        code === 'too-large'
          ? t('dashboardMediaPicker.imageTooLarge')
          : t('dashboardMediaPicker.invalidImageType'),
      );
    } finally {
      setIsUploadingUrl(false);
    }
  };

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();

    const payload = {
      title: formData.title.trim(),
      titleAr: formData.titleAr.trim(),
      alt: formData.alt.trim(),
      altAr: formData.altAr.trim(),
      url: normalizeMediaUrl(formData.url),
      kind: formData.kind,
      group: formData.group.trim(),
      tags: formData.tagsInput
        .split(',')
        .map((item) => item.trim())
        .filter(Boolean),
    };

    const cleanedPayload = Object.fromEntries(
      Object.entries(payload).filter(([, value]) => !(Array.isArray(value) && value.length === 0) && value !== ''),
    );

    if (editingId) {
      await updateDocument(editingId, cleanedPayload);
    } else {
      await addDocument(cleanedPayload);
    }

    handleDialogChange(false);
  };

  const handleEdit = (asset: MediaAssetRecord) => {
    setEditingId(asset.id);
    setFormData({
      title: asset.title || '',
      titleAr: asset.titleAr || '',
      alt: asset.alt || '',
      altAr: asset.altAr || '',
      url: asset.url || '',
      kind: asset.kind === 'video' ? 'video' : 'image',
      group: asset.group || 'general',
      tagsInput: (asset.tags ?? []).join(', '),
    });
    setUploadError('');
    setIsOpen(true);
  };

  const confirmDelete = async () => {
    if (!deleteId) {
      return;
    }

    await removeDocument(deleteId);
    setDeleteId(null);
  };

  const groupedCount = new Set(assets.map((asset) => asset.group || 'general')).size;

  return (
    <div className="mx-auto flex w-full max-w-7xl flex-1 flex-col gap-8 px-6 pt-10 pb-16">
      <div className="grid gap-6 xl:grid-cols-[0.95fr_1.05fr]">
        <div>
          <h1 className="font-heading text-4xl font-bold tracking-tight text-foreground">
            {t('dashboardMedia.title')}
          </h1>
          <p className="mt-2 text-muted-foreground">{t('dashboardMedia.description')}</p>
        </div>

        <div className="grid gap-4 md:grid-cols-3">
          <div className="rounded-[1.75rem] border border-border/60 bg-card/70 p-5 shadow-sm">
            <p className="font-mono text-xs uppercase tracking-[0.18em] text-muted-foreground">
              {t('dashboardMedia.totalAssets')}
            </p>
            <p className="mt-3 font-heading text-4xl font-black text-foreground">{assets.length}</p>
          </div>
          <div className="rounded-[1.75rem] border border-border/60 bg-card/70 p-5 shadow-sm">
            <p className="font-mono text-xs uppercase tracking-[0.18em] text-muted-foreground">
              {t('dashboardMedia.imageAssets')}
            </p>
            <p className="mt-3 font-heading text-4xl font-black text-foreground">
              {assets.filter((asset) => asset.kind !== 'video').length}
            </p>
          </div>
          <div className="rounded-[1.75rem] border border-border/60 bg-card/70 p-5 shadow-sm">
            <p className="font-mono text-xs uppercase tracking-[0.18em] text-muted-foreground">
              {t('dashboardMedia.assetGroups')}
            </p>
            <p className="mt-3 font-heading text-4xl font-black text-foreground">{groupedCount}</p>
          </div>
        </div>
      </div>

      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div className="relative w-full sm:max-w-sm">
          <Search className="absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            value={search}
            onChange={(event) => setSearch(event.target.value)}
            placeholder={t('dashboardMedia.search')}
            className="h-12 rounded-full pl-11"
          />
        </div>

        <Dialog open={isOpen} onOpenChange={handleDialogChange}>
          <DialogTrigger className={buttonVariants({ className: 'h-12 gap-2 rounded-full px-6 font-semibold' })}>
            <Plus className="h-4 w-4" />
            {t('dashboardMedia.addAsset')}
          </DialogTrigger>
          <DialogContent className="max-h-[90vh] overflow-y-auto sm:max-w-3xl">
            <form onSubmit={handleSubmit} className="space-y-6">
              <DialogHeader>
                <DialogTitle>
                  {editingId ? t('dashboardMedia.editAsset') : t('dashboardMedia.addNewAsset')}
                </DialogTitle>
              </DialogHeader>

              <div className="grid gap-6 md:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor="title">{t('dashboardMedia.assetTitle')}</Label>
                  <Input id="title" name="title" value={formData.title} onChange={handleChange} required />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="titleAr">{t('dashboardMedia.assetTitleAr')}</Label>
                  <Input id="titleAr" name="titleAr" value={formData.titleAr} onChange={handleChange} dir="rtl" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="kind">{t('dashboardMedia.kind')}</Label>
                  <select id="kind" name="kind" value={formData.kind} onChange={handleChange} className="h-10 w-full rounded-xl border border-input bg-background px-3">
                    <option value="image">{t('dashboardMedia.kindImage')}</option>
                    <option value="video">{t('dashboardMedia.kindVideo')}</option>
                  </select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="group">{t('dashboardMedia.group')}</Label>
                  <Input id="group" name="group" value={formData.group} onChange={handleChange} required />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="url">{t('dashboardMedia.url')}</Label>
                <Input
                  id="url"
                  name="url"
                  value={isLocalImage ? '' : formData.url}
                  onChange={handleChange}
                  dir="ltr"
                  placeholder={isLocalImage ? t('dashboardMediaPicker.localImageValue') : 'https://...'}
                  required={!isLocalImage}
                />
                {formData.kind === 'image' ? (
                  <div className="space-y-2">
                    <div className="flex flex-wrap items-center gap-2">
                      <Button
                        type="button"
                        variant="outline"
                        size="sm"
                        className="gap-2"
                        disabled={isUploadingUrl}
                        onClick={() => fileInputRef.current?.click()}
                      >
                        {isUploadingUrl ? <Loader2 className="h-4 w-4 animate-spin" /> : <Upload className="h-4 w-4" />}
                        {isLocalImage
                          ? t('dashboardMediaPicker.replaceFromDevice')
                          : t('dashboardMediaPicker.uploadFromDevice')}
                      </Button>
                      <input
                        ref={fileInputRef}
                        type="file"
                        accept="image/*"
                        className="hidden"
                        onChange={handleDeviceUpload}
                      />
                    </div>
                    <p
                      className={`text-xs leading-6 ${
                        uploadError ? 'text-destructive' : 'text-muted-foreground'
                      }`}
                    >
                      {uploadSourceHint}
                    </p>
                  </div>
                ) : null}
              </div>

              <div className="grid gap-6 md:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor="alt">{t('dashboardMedia.alt')}</Label>
                  <Textarea id="alt" name="alt" value={formData.alt} onChange={handleChange} className="min-h-[110px]" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="altAr">{t('dashboardMedia.altAr')}</Label>
                  <Textarea id="altAr" name="altAr" value={formData.altAr} onChange={handleChange} dir="rtl" className="min-h-[110px]" />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="tagsInput">{t('dashboardMedia.tags')}</Label>
                <Input id="tagsInput" name="tagsInput" value={formData.tagsInput} onChange={handleChange} placeholder="hero, featured, avatar" />
              </div>

              <div className="rounded-[1.5rem] border border-border/60 bg-background/70 p-4">
                {formData.url ? (
                  formData.kind === 'video' ? (
                    <video src={normalizeMediaUrl(formData.url)} controls className="aspect-video w-full rounded-[1rem] border border-border/60 bg-black/80" />
                  ) : (
                    <img src={normalizeMediaUrl(formData.url)} alt={formData.alt || formData.title} className="aspect-video w-full rounded-[1rem] border border-border/60 object-cover" />
                  )
                ) : (
                  <div className="flex min-h-32 items-center justify-center text-sm text-muted-foreground">
                    {t('dashboardMedia.previewHint')}
                  </div>
                )}
              </div>

              <DialogFooter>
                <Button type="button" variant="outline" onClick={() => handleDialogChange(false)}>
                  {t('dashboardMedia.cancel')}
                </Button>
                <Button type="submit">{t('dashboardMedia.saveChanges')}</Button>
              </DialogFooter>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      {loading ? (
        <SkeletonBlocks count={6} className="md:grid-cols-2 xl:grid-cols-3" />
      ) : filteredAssets.length === 0 ? (
        <EmptyState
          title={t('dashboardMedia.emptyTitle')}
          description={t('dashboardMedia.emptyDescription')}
        />
      ) : (
        <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
          {filteredAssets.map((asset, index) => (
            <motion.article
              key={asset.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.05 }}
              className="overflow-hidden rounded-[1.75rem] border border-border/60 bg-card/70 shadow-sm"
            >
              <div className="aspect-video overflow-hidden bg-muted">
                {asset.url ? (
                  asset.kind === 'video' ? (
                    <video src={normalizeMediaUrl(asset.url)} controls className="h-full w-full object-cover" />
                  ) : (
                    <img src={normalizeMediaUrl(asset.url)} alt={asset.alt || asset.title} className="h-full w-full object-cover" />
                  )
                ) : (
                  <div className="flex h-full items-center justify-center text-muted-foreground">
                    {asset.kind === 'video' ? <Video className="h-6 w-6" /> : <ImageIcon className="h-6 w-6" />}
                  </div>
                )}
              </div>

              <div className="space-y-4 p-5">
                <div className="flex items-start justify-between gap-4">
                  <div>
                    <h2 className="font-heading text-xl font-bold text-foreground">{asset.title}</h2>
                    <p className="mt-2 text-sm text-muted-foreground">{asset.group || 'general'}</p>
                  </div>
                  <div className="flex items-center gap-2">
                    <button
                      type="button"
                      onClick={() => handleEdit(asset)}
                      className="rounded-full border border-border bg-background/70 p-2 text-muted-foreground transition-colors hover:text-foreground"
                    >
                      <Edit2 className="h-4 w-4" />
                    </button>
                    <button
                      type="button"
                      onClick={() => setDeleteId(asset.id)}
                      className="rounded-full border border-border bg-background/70 p-2 text-muted-foreground transition-colors hover:text-destructive"
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </div>
                </div>

                {asset.alt ? <p className="text-sm leading-7 text-muted-foreground">{asset.alt}</p> : null}

                <div className="flex flex-wrap gap-2">
                  <span className="rounded-full bg-primary/10 px-3 py-1 text-xs font-semibold text-primary">
                    {asset.kind === 'video' ? t('dashboardMedia.kindVideo') : t('dashboardMedia.kindImage')}
                  </span>
                  {(asset.tags ?? []).map((tag) => (
                    <span key={tag} className="rounded-full border border-border px-3 py-1 text-xs text-muted-foreground">
                      {tag}
                    </span>
                  ))}
                </div>

                <p className="rounded-[1rem] border border-border/60 bg-background/70 px-3 py-2 text-xs leading-6 text-muted-foreground" dir="ltr">
                  {asset.url}
                </p>
              </div>
            </motion.article>
          ))}
        </div>
      )}

      <Dialog open={Boolean(deleteId)} onOpenChange={(open) => !open && setDeleteId(null)}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>{t('dashboardMedia.deleteTitle')}</DialogTitle>
          </DialogHeader>
          <p className="text-sm leading-7 text-muted-foreground">{t('dashboardMedia.deleteDescription')}</p>
          <DialogFooter>
            <Button type="button" variant="outline" onClick={() => setDeleteId(null)}>
              {t('dashboardMedia.cancel')}
            </Button>
            <Button type="button" variant="destructive" onClick={() => void confirmDelete()}>
              {t('dashboardMedia.delete')}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};
