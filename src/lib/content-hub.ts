import { normalizeMediaUrl } from './media';

type TimestampLike = { seconds?: number | null } | null | undefined;

export type MediaAssetRecord = {
  id: string;
  title: string;
  titleAr?: string | null;
  alt?: string | null;
  altAr?: string | null;
  url: string;
  kind?: 'image' | 'video' | null;
  group?: string | null;
  tags?: string[] | null;
};

export type MediaFieldInput = {
  url?: string | null;
  assetId?: string | null;
};

export type ResolvedMediaField = {
  asset?: MediaAssetRecord;
  url: string;
  alt: string;
  altAr: string;
  title: string;
  titleAr: string;
};

export type EntitySeoRecord = {
  title?: string | null;
  titleAr?: string | null;
  description?: string | null;
  descriptionAr?: string | null;
  image?: string | null;
  imageAssetId?: string | null;
};

export type ProjectRecord = {
  id: string;
  title: string;
  titleAr?: string | null;
  slug: string;
  description: string;
  descriptionAr?: string | null;
  category: string;
  type?: string | null;
  color?: string | null;
  image?: string | null;
  imageAssetId?: string | null;
  galleryImages?: string[] | null;
  galleryAssetIds?: string[] | null;
  tags?: string[] | null;
  demoUrl?: string | null;
  githubUrl?: string | null;
  featured?: boolean | null;
  featuredOrder?: number | null;
  highlightLabel?: string | null;
  highlightLabelAr?: string | null;
  problem?: string | null;
  problemAr?: string | null;
  solution?: string | null;
  solutionAr?: string | null;
  projectRole?: string | null;
  projectRoleAr?: string | null;
  result?: string | null;
  resultAr?: string | null;
  seo?: EntitySeoRecord | null;
  createdAt?: TimestampLike;
};

export type BlogRecord = {
  id: string;
  title: string;
  titleAr?: string | null;
  slug: string;
  excerpt: string;
  excerptAr?: string | null;
  content: string;
  contentAr?: string | null;
  category: string;
  coverImage?: string | null;
  coverImageAssetId?: string | null;
  image?: string | null;
  imageAssetId?: string | null;
  tags?: string[] | null;
  readTime?: string | null;
  featured?: boolean | null;
  seo?: EntitySeoRecord | null;
  createdAt?: TimestampLike;
};

export type SeoEntityLike = {
  title?: string | null;
  titleAr?: string | null;
  description?: string | null;
  descriptionAr?: string | null;
  seo?: EntitySeoRecord | null;
};

export type ResolvedEntitySeo = {
  title: string;
  description: string;
  image: string;
};

export type TestimonialRecord = {
  id: string;
  name: string;
  nameAr?: string | null;
  role?: string | null;
  roleAr?: string | null;
  company?: string | null;
  companyAr?: string | null;
  quote: string;
  quoteAr?: string | null;
  outcome?: string | null;
  outcomeAr?: string | null;
  avatarUrl?: string | null;
  avatarAssetId?: string | null;
  logoUrl?: string | null;
  logoAssetId?: string | null;
  visible?: boolean | null;
  featured?: boolean | null;
  order?: number | null;
  createdAt?: TimestampLike;
};

export type SkillRecord = {
  id: string;
  name: string;
  nameAr?: string | null;
  category?: string | null;
  categoryAr?: string | null;
  description?: string | null;
  descriptionAr?: string | null;
  proficiency: number;
  icon?: string | null;
  iconAssetId?: string | null;
  categoryOrder?: number | null;
  order?: number | null;
  featured?: boolean | null;
};

export type SkillCategoryGroup<T extends SkillRecord = SkillRecord> = {
  id: string;
  label: string;
  items: T[];
};

function readTrimmedString(value?: string | null) {
  return typeof value === 'string' ? value.trim() : '';
}

const ARABIC_SCRIPT_PATTERN =
  /[\u0600-\u06FF\u0750-\u077F\u08A0-\u08FF\uFB50-\uFDFF\uFE70-\uFEFF]/u;

function looksArabicText(value: string) {
  return ARABIC_SCRIPT_PATTERN.test(value);
}

function getTimestampSeconds(value?: TimestampLike) {
  return typeof value?.seconds === 'number' ? value.seconds : 0;
}

function getNumericOrder(value?: number | null) {
  return typeof value === 'number' ? value : Number.MAX_SAFE_INTEGER;
}

export function getLocalizedValue(
  englishValue?: string | null,
  arabicValue?: string | null,
  isArabic: boolean = false,
) {
  const english = readTrimmedString(englishValue);
  const arabic = readTrimmedString(arabicValue);

  if (english && arabic) {
    const englishLooksArabic = looksArabicText(english);
    const arabicLooksArabic = looksArabicText(arabic);

    if (englishLooksArabic !== arabicLooksArabic) {
      return isArabic
        ? (englishLooksArabic ? english : arabic)
        : (englishLooksArabic ? arabic : english);
    }
  }

  if (isArabic) {
    return arabic || english;
  }

  return english || arabic;
}

export function resolveMediaField(
  selection: MediaFieldInput,
  assets: MediaAssetRecord[],
): ResolvedMediaField {
  const asset = selection.assetId
    ? assets.find((item) => item.id === selection.assetId)
    : undefined;

  return {
    asset,
    url: normalizeMediaUrl(readTrimmedString(asset?.url) || readTrimmedString(selection.url)),
    alt: readTrimmedString(asset?.alt),
    altAr: readTrimmedString(asset?.altAr),
    title: readTrimmedString(asset?.title),
    titleAr: readTrimmedString(asset?.titleAr),
  };
}

export function resolveEntitySeo(
  entity: SeoEntityLike,
  assets: MediaAssetRecord[],
  isArabic: boolean = false,
): ResolvedEntitySeo {
  const seo = entity.seo ?? undefined;
  const resolvedImage = resolveMediaField(
    {
      url: readTrimmedString(seo?.image),
      assetId: readTrimmedString(seo?.imageAssetId),
    },
    assets,
  );

  return {
    title:
      getLocalizedValue(seo?.title, seo?.titleAr, isArabic) ||
      getLocalizedValue(entity.title, entity.titleAr, isArabic),
    description:
      getLocalizedValue(seo?.description, seo?.descriptionAr, isArabic) ||
      getLocalizedValue(entity.description, entity.descriptionAr, isArabic),
    image: resolvedImage.url,
  };
}

function sortTestimonials(items: TestimonialRecord[]) {
  return [...items]
    .filter((item) => item.visible !== false)
    .sort((left, right) => {
    const featuredDelta = Number(Boolean(right.featured)) - Number(Boolean(left.featured));
    if (featuredDelta !== 0) {
      return featuredDelta;
    }

    const orderDelta = getNumericOrder(left.order) - getNumericOrder(right.order);
    if (orderDelta !== 0) {
      return orderDelta;
    }

    const createdDelta = getTimestampSeconds(right.createdAt) - getTimestampSeconds(left.createdAt);
    if (createdDelta !== 0) {
      return createdDelta;
    }

    return left.name.localeCompare(right.name);
    });
}

export function getFeaturedTestimonials(
  items: TestimonialRecord[],
  limit: number = 3,
) {
  const sortedItems = sortTestimonials(items);
  const featuredItems = sortedItems.filter((item) => Boolean(item.featured));

  if (featuredItems.length >= limit) {
    return featuredItems.slice(0, limit);
  }

  if (featuredItems.length > 0) {
    const remainingItems = sortedItems.filter((item) => !Boolean(item.featured));
    return [...featuredItems, ...remainingItems].slice(0, limit);
  }

  return sortedItems.slice(0, limit);
}

export function groupSkillsByCategory<T extends SkillRecord>(
  items: T[],
  isArabic: boolean = false,
): SkillCategoryGroup<T>[] {
  const groups = new Map<
    string,
    {
      label: string;
      categoryOrder: number;
      items: T[];
    }
  >();

  items.forEach((item) => {
    const englishCategory = readTrimmedString(item.category) || 'Other';
    const arabicCategory = readTrimmedString(item.categoryAr);
    const label = isArabic && arabicCategory ? arabicCategory : englishCategory;
    const groupId = englishCategory.toLowerCase().replace(/\s+/g, '-');
    const existing = groups.get(groupId);

    if (existing) {
      existing.items.push(item);
      existing.categoryOrder = Math.min(existing.categoryOrder, getNumericOrder(item.categoryOrder));
      if (!existing.label && label) {
        existing.label = label;
      }
      return;
    }

    groups.set(groupId, {
      label,
      categoryOrder: getNumericOrder(item.categoryOrder),
      items: [item],
    });
  });

  return [...groups.entries()]
    .map(([id, group]) => ({
      id,
      label: group.label,
      items: [...group.items].sort((left, right) => {
        const orderDelta = getNumericOrder(left.order) - getNumericOrder(right.order);
        if (orderDelta !== 0) {
          return orderDelta;
        }

        const proficiencyDelta = right.proficiency - left.proficiency;
        if (proficiencyDelta !== 0) {
          return proficiencyDelta;
        }

        const leftLabel = getLocalizedValue(left.name, left.nameAr, isArabic) || left.name;
        const rightLabel = getLocalizedValue(right.name, right.nameAr, isArabic) || right.name;
        return leftLabel.localeCompare(rightLabel);
      }),
      order: group.categoryOrder,
    }))
    .sort((left, right) => {
      if (left.order !== right.order) {
        return left.order - right.order;
      }

      return left.label.localeCompare(right.label);
    })
    .map(({ order: _order, ...group }) => group);
}
