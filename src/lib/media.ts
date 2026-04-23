const GOOGLE_DRIVE_HOSTS = new Set(['drive.google.com', 'docs.google.com']);

export const MEDIA_UPLOAD_MAX_BYTES = 300 * 1024;
export const MEDIA_UPLOAD_MAX_DIMENSION = 1600;

function readTrimmedUrl(url?: string | null) {
  return typeof url === 'string' ? url.trim() : '';
}

function getGoogleDriveFileId(parsedUrl: URL) {
  const filePathMatch = parsedUrl.pathname.match(/\/file\/d\/([^/]+)/);
  if (filePathMatch?.[1]) {
    return filePathMatch[1];
  }

  const directId = parsedUrl.searchParams.get('id');
  if (directId) {
    return directId;
  }

  const ucPathMatch = parsedUrl.pathname.match(/\/uc$/);
  if (ucPathMatch) {
    return parsedUrl.searchParams.get('id');
  }

  return '';
}

export function normalizeMediaUrl(url?: string | null) {
  const trimmed = readTrimmedUrl(url);
  if (!trimmed || trimmed.startsWith('data:') || trimmed.startsWith('blob:')) {
    return trimmed;
  }

  try {
    const parsedUrl = new URL(trimmed);

    if (!GOOGLE_DRIVE_HOSTS.has(parsedUrl.hostname)) {
      return trimmed;
    }

    const fileId = getGoogleDriveFileId(parsedUrl);
    if (!fileId) {
      return trimmed;
    }

    return `https://drive.google.com/uc?export=view&id=${fileId}`;
  } catch {
    return trimmed;
  }
}

export function normalizeMediaUrls(urls: string[]) {
  return urls
    .map((url) => normalizeMediaUrl(url))
    .filter(Boolean);
}

export function estimateDataUrlBytes(url?: string | null) {
  const trimmed = readTrimmedUrl(url);
  if (!trimmed.startsWith('data:')) {
    return 0;
  }

  const [, encoded = ''] = trimmed.split(',', 2);
  if (!encoded) {
    return 0;
  }

  const sanitized = encoded.replace(/\s/g, '');
  const padding = sanitized.endsWith('==') ? 2 : sanitized.endsWith('=') ? 1 : 0;

  return Math.max(0, Math.floor((sanitized.length * 3) / 4) - padding);
}

function createMediaUploadError(code: 'invalid-type' | 'too-large') {
  const error = new Error(code);
  (error as Error & { code: string }).code = code;
  return error;
}

function loadImageFile(file: File) {
  return new Promise<HTMLImageElement>((resolve, reject) => {
    const objectUrl = URL.createObjectURL(file);
    const image = new Image();

    image.onload = () => {
      URL.revokeObjectURL(objectUrl);
      resolve(image);
    };

    image.onerror = () => {
      URL.revokeObjectURL(objectUrl);
      reject(createMediaUploadError('invalid-type'));
    };

    image.src = objectUrl;
  });
}

export async function compressImageFileToDataUrl(file: File) {
  if (!file.type.startsWith('image/')) {
    throw createMediaUploadError('invalid-type');
  }

  const image = await loadImageFile(file);
  const longestSide = Math.max(image.naturalWidth, image.naturalHeight);
  let scale = Math.min(1, MEDIA_UPLOAD_MAX_DIMENSION / longestSide);
  const qualitySteps = [0.82, 0.74, 0.66, 0.58, 0.5, 0.42, 0.35];

  for (let pass = 0; pass < 4; pass += 1) {
    const width = Math.max(1, Math.round(image.naturalWidth * scale));
    const height = Math.max(1, Math.round(image.naturalHeight * scale));
    const canvas = document.createElement('canvas');
    canvas.width = width;
    canvas.height = height;

    const context = canvas.getContext('2d');
    if (!context) {
      break;
    }

    context.drawImage(image, 0, 0, width, height);

    for (const quality of qualitySteps) {
      const dataUrl = canvas.toDataURL('image/webp', quality);
      const bytes = estimateDataUrlBytes(dataUrl);

      if (bytes <= MEDIA_UPLOAD_MAX_BYTES) {
        return {
          dataUrl,
          bytes,
          width,
          height,
        };
      }
    }

    scale *= 0.82;
  }

  throw createMediaUploadError('too-large');
}
