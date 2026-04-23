import { type ChangeEvent, useMemo, useRef, useState } from 'react';
import { Image as ImageIcon, Link2, Loader2, Upload } from 'lucide-react';
import { useTranslation } from 'react-i18next';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import type { MediaAssetRecord } from '@/lib/content-hub';
import { resolveMediaField } from '@/lib/content-hub';
import { compressImageFileToDataUrl, estimateDataUrlBytes, normalizeMediaUrl } from '@/lib/media';

const SELECT_CLASS =
  'flex h-10 w-full rounded-lg border border-input bg-transparent px-3 py-2 text-sm text-foreground outline-none transition-colors focus:border-ring focus:ring-3 focus:ring-ring/50';

type MediaPickerProps = {
  label: string;
  urlLabel: string;
  assetLabel: string;
  url: string;
  assetId?: string;
  onUrlChange: (value: string) => void;
  onAssetIdChange: (value: string) => void;
  assets: MediaAssetRecord[];
  kind?: 'image' | 'video';
  group?: string;
  placeholder?: string;
  previewAlt?: string;
};

function formatKilobytes(bytes: number) {
  return `${Math.max(1, Math.round(bytes / 1024))} KB`;
}

export function MediaPicker({
  label,
  urlLabel,
  assetLabel,
  url,
  assetId = '',
  onUrlChange,
  onAssetIdChange,
  assets,
  kind,
  group,
  placeholder = 'https://...',
  previewAlt = 'Preview',
}: MediaPickerProps) {
  const { t } = useTranslation();
  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadError, setUploadError] = useState('');

  const filteredAssets = assets.filter((asset) => {
    if (kind && asset.kind && asset.kind !== kind) {
      return false;
    }

    if (group && asset.group !== group) {
      return false;
    }

    return true;
  });
  const resolved = resolveMediaField({ url, assetId }, filteredAssets);
  const isLocalImage = useMemo(() => url.trim().startsWith('data:image/'), [url]);
  const localImageBytes = useMemo(() => estimateDataUrlBytes(url), [url]);
  const inputValue = isLocalImage ? '' : url;
  const inputPlaceholder = isLocalImage
    ? t('dashboardMediaPicker.localImageValue')
    : placeholder;
  const sourceHint = uploadError
    ? uploadError
    : isUploading
      ? t('dashboardMediaPicker.uploading')
      : isLocalImage
        ? t('dashboardMediaPicker.localImageAttached', {
            size: formatKilobytes(localImageBytes),
          })
        : t('dashboardMediaPicker.uploadHint');

  const handleUrlInputChange = (value: string) => {
    setUploadError('');
    onAssetIdChange('');
    onUrlChange(normalizeMediaUrl(value));
  };

  const handleDeviceUpload = async (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    event.target.value = '';

    if (!file) {
      return;
    }

    setIsUploading(true);
    setUploadError('');

    try {
      const result = await compressImageFileToDataUrl(file);
      onAssetIdChange('');
      onUrlChange(result.dataUrl);
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
      setIsUploading(false);
    }
  };

  return (
    <div className="space-y-4 rounded-[1.5rem] border border-border/60 bg-background/60 p-4">
      <div className="space-y-1">
        <p className="font-semibold text-foreground">{label}</p>
        <p className="text-xs leading-6 text-muted-foreground">
          {t('dashboardMediaPicker.description')}
        </p>
      </div>

      <div className="space-y-2">
        <Label>{assetLabel}</Label>
        <select
          className={SELECT_CLASS}
          value={assetId}
          onChange={(event) => {
            setUploadError('');

            const nextAssetId = event.target.value;
            onAssetIdChange(nextAssetId);

            const selectedAsset = filteredAssets.find((asset) => asset.id === nextAssetId);
            if (selectedAsset) {
              onUrlChange(normalizeMediaUrl(selectedAsset.url));
            }
          }}
        >
          <option value="">{t('dashboardMediaPicker.manualOption')}</option>
          {filteredAssets.map((asset) => (
            <option key={asset.id} value={asset.id}>
              {asset.group ? `[${asset.group}] ` : ''}
              {asset.title}
            </option>
          ))}
        </select>
      </div>

      {kind !== 'video' ? (
        <div className="space-y-2">
          <div className="flex flex-wrap items-center gap-2">
            <Button
              type="button"
              variant="outline"
              size="sm"
              className="gap-2"
              disabled={isUploading}
              onClick={() => fileInputRef.current?.click()}
            >
              {isUploading ? <Loader2 className="h-4 w-4 animate-spin" /> : <Upload className="h-4 w-4" />}
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
            {sourceHint}
          </p>
        </div>
      ) : null}

      <div className="space-y-2">
        <Label>{urlLabel}</Label>
        <div className="relative">
          <Link2 className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            value={inputValue}
            dir="ltr"
            placeholder={inputPlaceholder}
            className="pl-10"
            onChange={(event) => handleUrlInputChange(event.target.value)}
          />
        </div>
      </div>

      <div className="rounded-[1.25rem] border border-dashed border-border/70 bg-card/50 p-3">
        {resolved.url ? (
          kind === 'video' ? (
            <div className="space-y-3">
              <video src={resolved.url} controls className="aspect-video w-full rounded-[1rem] border border-border/60 bg-black/80" />
              <p className="text-xs leading-6 text-muted-foreground" dir="ltr">
                {resolved.url}
              </p>
            </div>
          ) : (
            <div className="space-y-3">
              <div className="overflow-hidden rounded-[1rem] border border-border/60 bg-muted">
                <img
                  src={resolved.url}
                  alt={resolved.alt || previewAlt}
                  referrerPolicy="no-referrer"
                  className="aspect-video w-full object-cover"
                />
              </div>
              <p className="text-xs leading-6 text-muted-foreground" dir="ltr">
                {isLocalImage
                  ? t('dashboardMediaPicker.localImageAttached', {
                      size: formatKilobytes(localImageBytes),
                    })
                  : resolved.url}
              </p>
            </div>
          )
        ) : (
          <div className="flex min-h-28 flex-col items-center justify-center gap-2 text-center text-sm text-muted-foreground">
            <ImageIcon className="h-5 w-5" />
            <p>{t('dashboardMediaPicker.noMedia')}</p>
          </div>
        )}
      </div>
    </div>
  );
}
