import { getLocalizedValue } from './content-hub';

export type ProjectType = "web" | "mobile" | "dashboard" | "backend" | "other";
export type ProjectSortMode = "featured" | "newest" | "alphabetical";

type FirestoreTimestampLike =
  | { seconds?: number | null }
  | null
  | undefined;

export type ProjectRecord = {
  id: string;
  title: string;
  titleAr?: string;
  slug: string;
  description: string;
  descriptionAr?: string;
  category: string;
  image?: string;
  imageAssetId?: string;
  galleryImages?: string[];
  galleryAssetIds?: string[];
  tags?: string[];
  demoUrl?: string;
  githubUrl?: string;
  type?: string;
  featured?: boolean;
  featuredOrder?: number;
  highlightLabel?: string;
  highlightLabelAr?: string;
  problem?: string;
  problemAr?: string;
  solution?: string;
  solutionAr?: string;
  projectRole?: string;
  projectRoleAr?: string;
  result?: string;
  resultAr?: string;
  seo?: {
    title?: string;
    titleAr?: string;
    description?: string;
    descriptionAr?: string;
    image?: string;
    imageAssetId?: string;
  };
  createdAt?: FirestoreTimestampLike;
};

export function normalizeProjectType(value?: string | null): ProjectType {
  switch ((value ?? "").toLowerCase()) {
    case "web":
    case "mobile":
    case "dashboard":
    case "backend":
    case "other":
      return value!.toLowerCase() as ProjectType;
    default:
      return "other";
  }
}

function getProjectTimestamp(project: ProjectRecord): number {
  if (typeof project.createdAt?.seconds === "number") {
    return project.createdAt.seconds;
  }

  return 0;
}

function compareFeaturedOrder(left: ProjectRecord, right: ProjectRecord) {
  const leftOrder = typeof left.featuredOrder === "number" ? left.featuredOrder : Number.MAX_SAFE_INTEGER;
  const rightOrder =
    typeof right.featuredOrder === "number" ? right.featuredOrder : Number.MAX_SAFE_INTEGER;

  if (leftOrder !== rightOrder) {
    return leftOrder - rightOrder;
  }

  return getProjectTimestamp(right) - getProjectTimestamp(left);
}

export function sortProjects(
  projects: ProjectRecord[],
  mode: ProjectSortMode,
): ProjectRecord[] {
  const cloned = [...projects];

  switch (mode) {
    case "alphabetical":
      return cloned.sort((left, right) => left.title.localeCompare(right.title));
    case "newest":
      return cloned.sort((left, right) => getProjectTimestamp(right) - getProjectTimestamp(left));
    case "featured":
    default:
      return cloned.sort((left, right) => {
        const featuredDelta = Number(Boolean(right.featured)) - Number(Boolean(left.featured));
        if (featuredDelta !== 0) {
          return featuredDelta;
        }
        return compareFeaturedOrder(left, right);
      });
  }
}

export function getFeaturedProjects(
  projects: ProjectRecord[],
  limit: number = 4,
): ProjectRecord[] {
  const featuredProjects = projects
    .filter((project) => project.featured)
    .sort(compareFeaturedOrder);

  if (featuredProjects.length > 0) {
    return featuredProjects.slice(0, limit);
  }

  return sortProjects(projects, "newest").slice(0, limit);
}

type FilterOptions = {
  search: string;
  activeType: ProjectType | "all";
  activeTag: string;
};

export function filterProjects(
  projects: ProjectRecord[],
  { search, activeType, activeTag }: FilterOptions,
): ProjectRecord[] {
  const normalizedSearch = search.trim().toLowerCase();
  const normalizedTag = activeTag.trim().toLowerCase();

  return projects.filter((project) => {
    const matchesSearch =
      normalizedSearch.length === 0 ||
      [project.title, project.description, project.category, ...(project.tags ?? [])]
        .filter(Boolean)
        .some((value) => value.toLowerCase().includes(normalizedSearch));

    const matchesType =
      activeType === "all" || normalizeProjectType(project.type ?? project.category) === activeType;

    const matchesTag =
      normalizedTag.length === 0 ||
      (project.tags ?? []).some((tag) => tag.toLowerCase() === normalizedTag);

    return matchesSearch && matchesType && matchesTag;
  });
}

export function getLocalizedCaseStudyValue(
  englishValue?: string | null,
  arabicValue?: string | null,
  isArabic: boolean = false,
): string {
  return getLocalizedValue(englishValue, arabicValue, isArabic);
}
