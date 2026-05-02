import { Helmet } from "react-helmet-async";
import { useTranslation } from "react-i18next";
import { useProfile } from "@/hooks/useProfile";
import { useSeoSettings } from "@/hooks/usePlatformSettings";
import { resolveLocalizedSeoTitle } from "@/lib/admin/brand";

const DEFAULT_CANONICAL_SITE_URL = "https://portfolio.saeeddev.com";
const OPTIMIZED_HOME_TITLE = "Mohamed Saied - React Developer | Egypt";
const OPTIMIZED_HOME_DESCRIPTION =
  "Expert React developer in Egypt specializing in bilingual websites, admin dashboards, and internal tools. Available for freelance projects.";
const LEGACY_HOME_TITLE = "Mohamed Saied - React Developer for Websites and Dashboards";
const LEGACY_HOME_DESCRIPTION =
  "React developer in Egypt building public websites, admin dashboards, internal tools, and bilingual Arabic-English web apps for small teams.";

type PageSeoProps = {
  title?: string;
  description?: string;
  image?: string;
};

function stripTrailingTitleDuplicate(value: string) {
  const parts = value
    .split("|")
    .map((part) => part.trim())
    .filter(Boolean);

  if (parts.length > 1 && parts[0] === parts[1]) {
    return parts[0];
  }

  if (parts.length > 2 && parts.length % 2 === 0) {
    const midpoint = parts.length / 2;
    const firstHalf = parts.slice(0, midpoint).join(" | ");
    const secondHalf = parts.slice(midpoint).join(" | ");
    if (firstHalf === secondHalf) {
      return firstHalf;
    }
  }

  return value.trim().replace(/\s+/g, " ");
}

function normalizeSeoTitle(value: string) {
  const normalized = stripTrailingTitleDuplicate(value);
  return normalized === LEGACY_HOME_TITLE ? OPTIMIZED_HOME_TITLE : normalized;
}

function normalizeSeoDescription(value: string) {
  const normalized = value.trim().replace(/\s+/g, " ");
  const halfLength = normalized.length / 2;

  if (!Number.isInteger(halfLength)) {
    return normalized === LEGACY_HOME_DESCRIPTION ? OPTIMIZED_HOME_DESCRIPTION : normalized;
  }

  const firstHalf = normalized.slice(0, halfLength).trim();
  const secondHalf = normalized.slice(halfLength).trim();
  const deduped = firstHalf && firstHalf === secondHalf ? firstHalf : normalized;
  return deduped === LEGACY_HOME_DESCRIPTION ? OPTIMIZED_HOME_DESCRIPTION : deduped;
}

export function PageSeo({ title, description, image }: PageSeoProps) {
  const { profile, loading: profileLoading } = useProfile();
  const { seoSettings, loading: seoLoading } = useSeoSettings({ publicRead: true });
  const { i18n } = useTranslation();

  const localizedSiteTitle = resolveLocalizedSeoTitle(seoSettings, profile, i18n.language === "ar");
  const localizedSiteDescription =
    i18n.language === "ar"
      ? seoSettings.defaultDescriptionAr || profile.metaDescriptionAr || profile.metaDescription || profile.bioAr || profile.bio
      : seoSettings.defaultDescription || profile.metaDescription || profile.bio;

  const normalizedTitle = title ? normalizeSeoTitle(title) : "";
  const normalizedSiteTitle = normalizeSeoTitle(localizedSiteTitle);
  const fullTitle =
    normalizedTitle && normalizedTitle !== normalizedSiteTitle
      ? `${normalizedTitle} | ${normalizedSiteTitle}`
      : normalizedSiteTitle;
  const metaDescription = description
    ? normalizeSeoDescription(description)
    : profileLoading || seoLoading
      ? ""
      : normalizeSeoDescription(localizedSiteDescription);
  const metaImage =
    image ||
    (!seoLoading ? seoSettings.ogImage : "") ||
    (!profileLoading ? profile.heroImage || profile.profileImage : "");
  const siteUrl = (seoSettings.siteUrl || DEFAULT_CANONICAL_SITE_URL).replace(/\/$/, "");
  const canonicalUrl =
    typeof window === "undefined"
      ? `${siteUrl}/`
      : `${siteUrl}${window.location.pathname === "/" ? "/" : window.location.pathname}`;

  return (
    <Helmet>
      <title>{fullTitle}</title>
      {metaDescription ? <meta name="description" content={metaDescription} /> : null}
      <meta name="robots" content="index, follow" />
      <link rel="canonical" href={canonicalUrl} />
      <meta property="og:title" content={fullTitle} />
      {metaDescription ? <meta property="og:description" content={metaDescription} /> : null}
      {metaImage ? <meta property="og:image" content={metaImage} /> : null}
      <meta property="og:url" content={canonicalUrl} />
    </Helmet>
  );
}
